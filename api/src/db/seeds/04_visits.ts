import { userVisits } from '../schema/index.js'

/**
 * Seed visits as if Cineville provided them — raw visit records,
 * randomly distributed across cinemas. The stats service computes
 * top cinemas, averages, etc. from this data.
 */

const ALL_CINEMAS = [
  'Eye Filmmuseum', 'Kriterion', 'De Uitkijk', 'LantarenVenster',
  'Filmhuis Den Haag', 'Forum Groningen', "'t Hoogt", 'Lab111',
  'FC Hyena', 'Kino Rotterdam',
]

const ALL_MUSEUMS = [
  'Rijksmuseum', 'Van Gogh Museum', 'Stedelijk Museum', 'FOAM',
  'Mauritshuis', 'Bonnefanten', 'Groninger Museum', 'Centraal Museum',
]

const USER_VISIT_COUNTS: Record<string, number> = {
  'anouk@cineva.nl': 124,
  'lucas.moreau@email.com': 156,
  'sofia.lindqvist@email.com': 95,
  'daan.bakker@email.com': 210,
  'mila.jansen@email.com': 138,
  'thomas.witt@email.com': 179,
  'emma.vanderberg@email.com': 99,
}

const USER_MUSEUM_VISIT_COUNTS: Record<string, number> = {
  'anouk@cineva.nl': 14,
  'sofia.lindqvist@email.com': 9,
  'daan.bakker@email.com': 21,
  'emma.vanderberg@email.com': 16,
}

function generateRandomVisits(
  count: number,
  cinemas: string[],
): Array<{ cinema: string; date: string }> {
  const visits: Array<{ cinema: string; date: string }> = []
  const startDate = new Date('2022-01-15')
  const endDate = new Date('2025-12-31')
  const range = endDate.getTime() - startDate.getTime()

  for (let i = 0; i < count; i++) {
    const date = new Date(startDate.getTime() + Math.random() * range)
    visits.push({
      cinema: cinemas[Math.floor(Math.random() * cinemas.length)],
      date: date.toISOString().split('T')[0],
    })
  }

  return visits.sort((a, b) => a.date.localeCompare(b.date))
}

export async function seedVisits(
  db: any,
  userIds: Record<string, string>,
  ventureIds: Record<string, string>,
): Promise<void> {
  console.log('Seeding visits...')

  let totalInserted = 0

  for (const [email, count] of Object.entries(USER_VISIT_COUNTS)) {
    const userId = userIds[email]
    if (!userId) {
      console.warn(`  Skipping visits for ${email} — user not found`)
      continue
    }

    const visits = generateRandomVisits(count, ALL_CINEMAS)

    const rows = visits
      .map((v) => ({
        userId,
        ventureId: ventureIds[v.cinema],
        date: v.date,
        providerName: 'cineville',
      }))
      .filter((r) => r.ventureId)

    // Insert in batches of 500
    for (let i = 0; i < rows.length; i += 500) {
      const batch = rows.slice(i, i + 500)
      await db.insert(userVisits).values(batch).onConflictDoNothing()
    }

    totalInserted += rows.length
    console.log(`  ${email}: ${rows.length} cinema visits`)
  }

  // Seed museum visits
  for (const [email, count] of Object.entries(USER_MUSEUM_VISIT_COUNTS)) {
    const userId = userIds[email]
    if (!userId) {
      console.warn(`  Skipping museum visits for ${email} — user not found`)
      continue
    }

    const visits = generateRandomVisits(count, ALL_MUSEUMS)

    const rows = visits
      .map((v) => ({
        userId,
        ventureId: ventureIds[v.cinema],
        date: v.date,
        providerName: 'museumkaart',
      }))
      .filter((r) => r.ventureId)

    for (let i = 0; i < rows.length; i += 500) {
      const batch = rows.slice(i, i + 500)
      await db.insert(userVisits).values(batch).onConflictDoNothing()
    }

    totalInserted += rows.length
    console.log(`  ${email}: ${rows.length} museum visits`)
  }

  console.log(`  Total: ${totalInserted} visits`)
}
