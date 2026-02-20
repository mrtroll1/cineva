import { users } from '../schema/index.js'

const SEED_USERS = [
  {
    id: 'db111f37-3cd0-42e6-8493-c9530ad6294f',
    name: 'Anouk',
    lastName: 'de Vries',
    photoUrl: 'https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=400&h=400&fit=crop&crop=face',
    email: 'anouk@cineva.nl',
    linkedProviders: { cineville: '$93278420387' },
  },
  {
    name: 'Lucas',
    lastName: 'Moreau',
    photoUrl: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400&h=400&fit=crop&crop=face',
    email: 'lucas.moreau@email.com',
    linkedProviders: { cineville: '$10293847561' },
  },
  {
    name: 'Sofia',
    lastName: 'Lindqvist',
    photoUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop&crop=face',
    email: 'sofia.lindqvist@email.com',
    linkedProviders: { cineville: '$29384756102' },
  },
  {
    name: 'Daan',
    lastName: 'Bakker',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=face',
    email: 'daan.bakker@email.com',
    linkedProviders: { cineville: '$38475610293' },
  },
  {
    name: 'Mila',
    lastName: 'Jansen',
    photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face',
    email: 'mila.jansen@email.com',
    linkedProviders: { cineville: '$47561029384' },
  },
  {
    name: 'Thomas',
    lastName: 'Witt',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face',
    email: 'thomas.witt@email.com',
    linkedProviders: { cineville: '$56102938475' },
  },
  {
    name: 'Emma',
    lastName: 'van der Berg',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    email: 'emma.vanderberg@email.com',
    linkedProviders: { cineville: '$65102938471' },
  },
]

export async function seedUsers(db: any, _providerIds: Record<string, string>): Promise<Record<string, string>> {
  console.log('Seeding users...')

  const rows = await db
    .insert(users)
    .values(SEED_USERS)
    .onConflictDoNothing()
    .returning({ id: users.id, email: users.email })

  const ids: Record<string, string> = {}
  for (const row of rows) {
    ids[row.email] = row.id
  }

  console.log(`  Inserted ${rows.length} users`)
  return ids
}
