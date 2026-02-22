import { providers } from '../schema/index.js'

const PROVIDERS = [
  { name: 'cineville' },
  { name: 'museumkaart' },
  { name: 'wearepublic' },
]

export async function seedProviders(db: any): Promise<Record<string, string>> {
  console.log('Seeding providers...')

  const rows = await db
    .insert(providers)
    .values(PROVIDERS)
    .onConflictDoNothing()
    .returning({ id: providers.id, name: providers.name })

  const ids: Record<string, string> = {}
  for (const row of rows) {
    ids[row.name] = row.id
  }

  console.log(`  Inserted ${rows.length} providers`)
  return ids
}
