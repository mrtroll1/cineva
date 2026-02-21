import { eq, and, sql, desc } from 'drizzle-orm'
import { db } from '../db/client.js'
import { userVisits, venues } from '../db/schema/index.js'

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
    venueId: string
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
        name: venues.name,
        visits: sql<number>`count(*)::int`,
      })
      .from(userVisits)
      .innerJoin(venues, eq(userVisits.venueId, venues.id))
      .where(eq(userVisits.userId, userId))
      .groupBy(venues.name)
      .orderBy(desc(sql`count(*)`))
      .limit(3)

    return {
      filmsWatched: totalResult?.count ?? 0,
      monthlyAverage: Number(avgResult?.avg ?? 0),
      topCinemas,
    }
  },

  async getStatsByUserIdAndVenueType(userId: string, venueType: 'CINEMA' | 'MUSEUM') {
    const condition = and(
      eq(userVisits.userId, userId),
      eq(venues.type, venueType),
    )

    // Total visits for this venue type
    const [totalResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userVisits)
      .innerJoin(venues, eq(userVisits.venueId, venues.id))
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
      .innerJoin(venues, eq(userVisits.venueId, venues.id))
      .where(condition)

    // Top venues
    const topVenues = await db
      .select({
        name: venues.name,
        visits: sql<number>`count(*)::int`,
      })
      .from(userVisits)
      .innerJoin(venues, eq(userVisits.venueId, venues.id))
      .where(condition)
      .groupBy(venues.name)
      .orderBy(desc(sql`count(*)`))
      .limit(3)

    return {
      visitsCount: totalResult?.count ?? 0,
      monthlyAverage: Number(avgResult?.avg ?? 0),
      topVenues,
    }
  },
}
