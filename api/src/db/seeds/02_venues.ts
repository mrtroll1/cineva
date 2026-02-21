import { venues } from '../schema/index.js'

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

export async function seedVenues(db: any): Promise<Record<string, string>> {
  console.log('Seeding venues...')

  const rows = await db
    .insert(venues)
    .values([...CINEMAS, ...MUSEUMS])
    .onConflictDoNothing()
    .returning({ id: venues.id, name: venues.name })

  const ids: Record<string, string> = {}
  for (const row of rows) {
    ids[row.name] = row.id
  }

  console.log(`  Inserted ${rows.length} venues`)
  return ids
}
