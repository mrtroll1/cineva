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

/**
 * Curated (fixed) We Are Public visits for Anouk.
 * Pre-seeded so the stats are always available — the client controls
 * whether to show them via localStorage (demo-friendly).
 */
const ANOUK_WAP_VISITS: Array<{ venue: string; date: string }> = [
  { venue: 'Paradiso', date: '2023-02-11' },
  { venue: 'Melkweg', date: '2023-03-04' },
  { venue: 'Concertgebouw', date: '2023-04-18' },
  { venue: 'Paradiso', date: '2023-05-27' },
  { venue: 'Stadsschouwburg', date: '2023-06-09' },
  { venue: 'TivoliVredenburg', date: '2023-07-15' },
  { venue: 'Carré', date: '2023-08-22' },
  { venue: 'Paradiso', date: '2023-09-30' },
  { venue: 'Melkweg', date: '2023-10-14' },
  { venue: 'Concertgebouw', date: '2023-11-05' },
  { venue: 'De Oosterpoort', date: '2023-12-01' },
  { venue: 'Paradiso', date: '2024-01-20' },
  { venue: 'Melkweg', date: '2024-02-14' },
  { venue: 'Stadsschouwburg', date: '2024-03-08' },
  { venue: 'Carré', date: '2024-03-29' },
  { venue: 'TivoliVredenburg', date: '2024-04-12' },
  { venue: 'Paradiso', date: '2024-05-03' },
  { venue: 'Concertgebouw', date: '2024-06-21' },
  { venue: 'Melkweg', date: '2024-07-07' },
  { venue: 'Paradiso', date: '2024-08-16' },
  { venue: 'Mezz', date: '2024-09-01' },
  { venue: 'Carré', date: '2024-09-28' },
  { venue: 'Paradiso', date: '2024-10-19' },
  { venue: 'Melkweg', date: '2024-11-02' },
  { venue: 'Concertgebouw', date: '2024-11-30' },
  { venue: 'TivoliVredenburg', date: '2024-12-14' },
  { venue: 'Paradiso', date: '2025-01-11' },
  { venue: 'Stadsschouwburg', date: '2025-02-08' },
  { venue: 'Melkweg', date: '2025-03-15' },
  { venue: 'Carré', date: '2025-04-05' },
  { venue: 'Paradiso', date: '2025-05-24' },
  { venue: 'Concertgebouw', date: '2025-06-07' },
  { venue: 'De Oosterpoort', date: '2025-07-19' },
  { venue: 'Melkweg', date: '2025-08-30' },
  { venue: 'Paradiso', date: '2025-10-11' },
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
  venueIds: Record<string, string>,
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
        venueId: venueIds[v.cinema],
        date: v.date,
        providerName: 'cineville',
      }))
      .filter((r) => r.venueId)

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
        venueId: venueIds[v.cinema],
        date: v.date,
        providerName: 'museumkaart',
      }))
      .filter((r) => r.venueId)

    for (let i = 0; i < rows.length; i += 500) {
      const batch = rows.slice(i, i + 500)
      await db.insert(userVisits).values(batch).onConflictDoNothing()
    }

    totalInserted += rows.length
    console.log(`  ${email}: ${rows.length} museum visits`)
  }

  // Seed We Are Public visits for Anouk (curated, always available)
  const anoukId = userIds['anouk@cineva.nl']
  if (anoukId) {
    const rows = ANOUK_WAP_VISITS
      .map((v) => ({
        userId: anoukId,
        venueId: venueIds[v.venue],
        date: v.date,
        providerName: 'wearepublic',
      }))
      .filter((r) => r.venueId)

    for (let i = 0; i < rows.length; i += 500) {
      const batch = rows.slice(i, i + 500)
      await db.insert(userVisits).values(batch).onConflictDoNothing()
    }

    totalInserted += rows.length
    console.log(`  anouk@cineva.nl: ${rows.length} performing arts visits`)
  }

  console.log(`  Total: ${totalInserted} visits`)
}
