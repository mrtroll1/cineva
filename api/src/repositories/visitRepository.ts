import { eq, and, sql, desc } from 'drizzle-orm'
import { db } from '../db/client.js'
import { userVisits, ventures } from '../db/schema/index.js'

export const visitRepository = {
  async findByUserId(userId: string) {
    return db
      .select()
      .from(userVisits)
      .where(eq(userVisits.userId, userId))
      .orderBy(desc(userVisits.date))
  },

  async createMany(visits: Array<{
    userId: string
    ventureId: string
    date: string
    providerName: string
  }>) {
    if (visits.length === 0) return []
    return db.insert(userVisits).values(visits).returning()
  },

  async getStatsByUserId(userId: string) {
    // Total visits
    const [totalResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userVisits)
      .where(eq(userVisits.userId, userId))

    // Monthly average
    const [avgResult] = await db
      .select({
        avg: sql<number>`
          CASE
            WHEN count(*) = 0 THEN 0
            ELSE round(count(*)::numeric / GREATEST(
              EXTRACT(EPOCH FROM (max(${userVisits.date}::timestamp) - min(${userVisits.date}::timestamp))) / 2592000,
              1
            ), 1)
          END
        `,
      })
      .from(userVisits)
      .where(eq(userVisits.userId, userId))

    // Top cinemas
    const topCinemas = await db
      .select({
        name: ventures.name,
        visits: sql<number>`count(*)::int`,
      })
      .from(userVisits)
      .innerJoin(ventures, eq(userVisits.ventureId, ventures.id))
      .where(eq(userVisits.userId, userId))
      .groupBy(ventures.name)
      .orderBy(desc(sql`count(*)`))
      .limit(3)

    return {
      filmsWatched: totalResult?.count ?? 0,
      monthlyAverage: Number(avgResult?.avg ?? 0),
      topCinemas,
    }
  },

  async getStatsByUserIdAndVentureType(userId: string, ventureType: 'CINEMA' | 'MUSEUM') {
    const condition = and(
      eq(userVisits.userId, userId),
      eq(ventures.type, ventureType),
    )

    // Total visits for this venture type
    const [totalResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userVisits)
      .innerJoin(ventures, eq(userVisits.ventureId, ventures.id))
      .where(condition)

    // Monthly average
    const [avgResult] = await db
      .select({
        avg: sql<number>`
          CASE
            WHEN count(*) = 0 THEN 0
            ELSE round(count(*)::numeric / GREATEST(
              EXTRACT(EPOCH FROM (max(${userVisits.date}::timestamp) - min(${userVisits.date}::timestamp))) / 2592000,
              1
            ), 1)
          END
        `,
      })
      .from(userVisits)
      .innerJoin(ventures, eq(userVisits.ventureId, ventures.id))
      .where(condition)

    // Top venues
    const topVenues = await db
      .select({
        name: ventures.name,
        visits: sql<number>`count(*)::int`,
      })
      .from(userVisits)
      .innerJoin(ventures, eq(userVisits.ventureId, ventures.id))
      .where(condition)
      .groupBy(ventures.name)
      .orderBy(desc(sql`count(*)`))
      .limit(3)

    return {
      visitsCount: totalResult?.count ?? 0,
      monthlyAverage: Number(avgResult?.avg ?? 0),
      topVenues,
    }
  },
}
