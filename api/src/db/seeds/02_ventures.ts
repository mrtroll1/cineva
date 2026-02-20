import { ventures } from '../schema/index.js'

const CINEMAS = [
  { name: 'Eye Filmmuseum', city: 'Amsterdam', country: 'NL', type: 'CINEMA' as const },
  { name: 'Kriterion', city: 'Amsterdam', country: 'NL', type: 'CINEMA' as const },
  { name: 'De Uitkijk', city: 'Amsterdam', country: 'NL', type: 'CINEMA' as const },
  { name: 'LantarenVenster', city: 'Rotterdam', country: 'NL', type: 'CINEMA' as const },
  { name: 'Filmhuis Den Haag', city: 'Den Haag', country: 'NL', type: 'CINEMA' as const },
  { name: 'Forum Groningen', city: 'Groningen', country: 'NL', type: 'CINEMA' as const },
  { name: "'t Hoogt", city: 'Utrecht', country: 'NL', type: 'CINEMA' as const },
  { name: 'Lab111', city: 'Amsterdam', country: 'NL', type: 'CINEMA' as const },
  { name: 'FC Hyena', city: 'Amsterdam', country: 'NL', type: 'CINEMA' as const },
  { name: 'Kino Rotterdam', city: 'Rotterdam', country: 'NL', type: 'CINEMA' as const },
]

export async function seedVentures(db: any): Promise<Record<string, string>> {
  console.log('Seeding ventures...')

  const rows = await db
    .insert(ventures)
    .values(CINEMAS)
    .onConflictDoNothing()
    .returning({ id: ventures.id, name: ventures.name })

  const ids: Record<string, string> = {}
  for (const row of rows) {
    ids[row.name] = row.id
  }

  console.log(`  Inserted ${rows.length} ventures`)
  return ids
}
