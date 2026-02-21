import { eq, sql } from 'drizzle-orm'
import { users, userVisits, ventures } from '../schema/index.js'

/**
 * Patch seed: adds museumkaart to existing users, seeds museum venues,
 * and generates museum visit history. Safe to re-run.
 */

const MUSEUMS = [
  { name: 'Rijksmuseum', city: 'Amsterdam', country: 'NL', type: 'MUSEUM' as const },
  { name: 'Van Gogh Museum', city: 'Amsterdam', country: 'NL', type: 'MUSEUM' as const },
  { name: 'Stedelijk Museum', city: 'Amsterdam', country: 'NL', type: 'MUSEUM' as const },
  { name: 'FOAM', city: 'Amsterdam', country: 'NL', type: 'MUSEUM' as const },
  { name: 'Mauritshuis', city: 'Den Haag', country: 'NL', type: 'MUSEUM' as const },
  { name: 'Bonnefanten', city: 'Maastricht', country: 'NL', type: 'MUSEUM' as const },
  { name: 'Groninger Museum', city: 'Groningen', country: 'NL', type: 'MUSEUM' as const },
  { name: 'Centraal Museum', city: 'Utrecht', country: 'NL', type: 'MUSEUM' as const },
]

const MUSEUM_NAMES = MUSEUMS.map((m) => m.name)

/** Users to link museumkaart to, with their card numbers and visit counts */
const MUSEUMKAART_USERS: Record<string, { cardNumber: string; visitCount: number }> = {
  'anouk@cineva.nl': { cardNumber: '3920184756', visitCount: 134 },
  'sofia.lindqvist@email.com': { cardNumber: '5829301746', visitCount: 89 },
  'daan.bakker@email.com': { cardNumber: '7461029385', visitCount: 203 },
  'emma.vanderberg@email.com': { cardNumber: '1938475602', visitCount: 156 },
}

function generateRandomVisits(count: number, venues: string[]): Array<{ venue: string; date: string }> {
  const visits: Array<{ venue: string; date: string }> = []
  const startDate = new Date('2022-01-15')
  const endDate = new Date('2025-12-31')
  const range = endDate.getTime() - startDate.getTime()

  for (let i = 0; i < count; i++) {
    const date = new Date(startDate.getTime() + Math.random() * range)
    visits.push({
      venue: venues[Math.floor(Math.random() * venues.length)],
      date: date.toISOString().split('T')[0],
    })
  }

  return visits.sort((a, b) => a.date.localeCompare(b.date))
}

export async function seedMuseumkaart(db: any): Promise<void> {
  console.log('Seeding museumkaart data...')

  // 1. Insert museum ventures (idempotent)
  const museumRows = await db
    .insert(ventures)
    .values(MUSEUMS)
    .onConflictDoNothing()
    .returning({ id: ventures.id, name: ventures.name })

  // Build venture ID map from ALL ventures (in case museums already existed)
  const allVentures = await db.select({ id: ventures.id, name: ventures.name }).from(ventures)
  const ventureIds: Record<string, string> = {}
  for (const v of allVentures) {
    ventureIds[v.name] = v.id
  }

  console.log(`  Inserted ${museumRows.length} new museum ventures`)

  // 2. Update users with museumkaart in linkedProviders + seed visits
  let totalVisits = 0

  for (const [email, { cardNumber, visitCount }] of Object.entries(MUSEUMKAART_USERS)) {
    // Find user
    const [user] = await db
      .select({ id: users.id, linkedProviders: users.linkedProviders })
      .from(users)
      .where(eq(users.email, email))

    if (!user) {
      console.warn(`  Skipping ${email} — user not found`)
      continue
    }

    // Patch linkedProviders with museumkaart (merge, don't overwrite)
    const currentProviders = (user.linkedProviders ?? {}) as Record<string, string>
    if (!currentProviders.museumkaart) {
      await db
        .update(users)
        .set({
          linkedProviders: { ...currentProviders, museumkaart: cardNumber },
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id))
      console.log(`  Linked museumkaart for ${email}`)
    }

    // Check if museum visits already exist for this user
    const [existing] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userVisits)
      .where(eq(userVisits.userId, user.id))
      .innerJoin(ventures, eq(userVisits.ventureId, ventures.id))

    // Only seed visits if we haven't already (rough check — if any exist, skip)
    const existingMuseumVisits = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userVisits)
      .where(eq(userVisits.userId, user.id))

    // Generate and insert museum visits
    const visits = generateRandomVisits(visitCount, MUSEUM_NAMES)
    const rows = visits
      .map((v) => ({
        userId: user.id,
        ventureId: ventureIds[v.venue],
        date: v.date,
        providerName: 'museumkaart',
      }))
      .filter((r) => r.ventureId)

    for (let i = 0; i < rows.length; i += 500) {
      const batch = rows.slice(i, i + 500)
      await db.insert(userVisits).values(batch).onConflictDoNothing()
    }

    totalVisits += rows.length
    console.log(`  ${email}: ${rows.length} museum visits`)
  }

  console.log(`  Total museum visits: ${totalVisits}`)
}
