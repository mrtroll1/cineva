import { eq } from 'drizzle-orm'
import { db } from '../db/client.js'
import { providers } from '../db/schema/index.js'

export const providerRepository = {
  async findByName(name: string) {
    const [provider] = await db
      .select()
      .from(providers)
      .where(eq(providers.name, name))
      .limit(1)
    return provider ?? null
  },

  async create(name: string) {
    const [provider] = await db
      .insert(providers)
      .values({ name })
      .returning()
    return provider
  },
}
