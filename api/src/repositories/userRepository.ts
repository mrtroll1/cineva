import { eq, ne, isNull, sql } from 'drizzle-orm'
import { db } from '../db/client.js'
import { users } from '../db/schema/index.js'

export const userRepository = {
  async findById(id: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)
    return user ?? null
  },

  async findByEmail(email: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
    return user ?? null
  },

  async findRandomExcluding(excludeId: string, limit: number) {
    return db
      .select()
      .from(users)
      .where(ne(users.id, excludeId))
      .orderBy(sql`RANDOM()`)
      .limit(limit)
  },

  async findAll() {
    return db
      .select()
      .from(users)
      .where(isNull(users.deletedAt))
  },

  async updateLinkedProvider(userId: string, providerName: string, externalId: string) {
    await db
      .update(users)
      .set({
        linkedProviders: sql`COALESCE(${users.linkedProviders}, '{}'::jsonb) || ${JSON.stringify({ [providerName]: externalId })}::jsonb`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
  },
}
