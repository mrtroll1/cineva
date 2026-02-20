import { eq, isNull } from 'drizzle-orm'
import { db } from '../db/client.js'
import { ventures } from '../db/schema/index.js'

export const ventureRepository = {
  async findById(id: string) {
    const [venture] = await db
      .select()
      .from(ventures)
      .where(eq(ventures.id, id))
      .limit(1)
    return venture ?? null
  },

  async findByName(name: string) {
    const [venture] = await db
      .select()
      .from(ventures)
      .where(eq(ventures.name, name))
      .limit(1)
    return venture ?? null
  },

  async findAll() {
    return db
      .select()
      .from(ventures)
      .where(isNull(ventures.deletedAt))
  },
}
