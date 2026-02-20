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

// Each user gets a random number of visits (100–450 range)
const USER_VISIT_COUNTS: Record<string, number> = {
  'anouk@cineva.nl': 247,
  'lucas.moreau@email.com': 312,
  'sofia.lindqvist@email.com': 189,
  'daan.bakker@email.com': 421,
  'mila.jansen@email.com': 276,
  'thomas.witt@email.com': 358,
  'emma.vanderberg@email.com': 198,
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
    console.log(`  ${email}: ${rows.length} visits`)
  }

  console.log(`  Total: ${totalInserted} visits`)
}
