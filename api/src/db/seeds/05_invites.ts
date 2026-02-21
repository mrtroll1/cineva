import { eq } from 'drizzle-orm'
import { invites, users } from '../schema/index.js'

const ANOUK_ID = 'db111f37-3cd0-42e6-8493-c9530ad6294f'

async function findUserIdByEmail(db: any, email: string): Promise<string | null> {
  const [row] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
  return row?.id ?? null
}

export async function seedInvites(db: any, _userIds: Record<string, string>): Promise<void> {
  console.log('Seeding invites...')

  const lucas = await findUserIdByEmail(db, 'lucas.moreau@email.com')
  const sofia = await findUserIdByEmail(db, 'sofia.lindqvist@email.com')
  const daan = await findUserIdByEmail(db, 'daan.bakker@email.com')
  const mila = await findUserIdByEmail(db, 'mila.jansen@email.com')

  const seedData = [
    lucas && {
      fromUserId: ANOUK_ID,
      toUserId: lucas,
      whereText: 'Eye Filmmuseum',
      whenText: 'This Saturday afternoon',
      status: 'ACCEPTED' as const,
    },
    sofia && {
      fromUserId: sofia,
      toUserId: ANOUK_ID,
      whereText: 'Ketelhuis',
      whenText: 'Next Friday evening',
      status: 'PENDING' as const,
    },
    daan && {
      fromUserId: ANOUK_ID,
      toUserId: daan,
      whereText: 'Stedelijk Museum',
      whenText: 'Sunday morning',
      status: 'DECLINED' as const,
    },
    mila && {
      fromUserId: mila,
      toUserId: ANOUK_ID,
      whereText: 'Lab111',
      whenText: 'Tomorrow around 8pm',
      status: 'PENDING' as const,
    },
  ].filter(Boolean) as Array<{
    fromUserId: string
    toUserId: string
    whereText: string
    whenText: string
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED'
  }>

  if (seedData.length === 0) {
    console.log('  Skipped — required users not found')
    return
  }

  const rows = await db
    .insert(invites)
    .values(seedData)
    .onConflictDoNothing()
    .returning()

  console.log(`  Inserted ${rows.length} invites`)
}
