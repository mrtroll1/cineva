import { db } from '../client.js'
import { seedProviders } from './01_providers.js'
import { seedVenues } from './02_venues.js'
import { seedUsers } from './03_users.js'
import { seedVisits } from './04_visits.js'
import { seedInvites } from './05_invites.js'
import postgres from 'postgres'

async function run() {
  console.log('Seeding database...\n')

  const providerIds = await seedProviders(db)
  const venueIds = await seedVenues(db)
  const userIds = await seedUsers(db, providerIds)
  await seedVisits(db, userIds, venueIds)
  await seedInvites(db, userIds)

  console.log('\nSeeding complete!')

  // Close the connection
  const client = postgres(process.env.DATABASE_URL!)
  await client.end()
  process.exit(0)
}

run().catch((err) => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
