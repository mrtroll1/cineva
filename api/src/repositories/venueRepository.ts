import { eq, isNull } from 'drizzle-orm'
import { db } from '../db/client.js'
import { venues } from '../db/schema/index.js'

export const venueRepository = {
  async findById(id: string) {
    const [venue] = await db
      .select()
      .from(venues)
      .where(eq(venues.id, id))
      .limit(1)
    return venue ?? null
  },

  async findByName(name: string) {
    const [venue] = await db
      .select()
      .from(venues)
      .where(eq(venues.name, name))
      .limit(1)
    return venue ?? null
  },

  async findAll() {
    return db
      .select()
      .from(venues)
      .where(isNull(venues.deletedAt))
  },
}
