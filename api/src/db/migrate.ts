import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function runMigrations() {
  console.log('Running database migrations...')

  const client = postgres(process.env.DATABASE_URL!, { max: 1 })
  const db = drizzle(client)

  await migrate(db, {
    migrationsFolder: path.resolve(__dirname, 'migrations'),
  })

  await client.end()
  console.log('Migrations complete.')
}
