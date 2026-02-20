import { buildServer } from './server.js'
import { runMigrations } from './db/migrate.js'

const port = Number(process.env.PORT ?? 3000)
const host = '0.0.0.0'

async function start() {
  await runMigrations()

  const app = buildServer()

  app.listen({ port, host }, (err, address) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
    app.log.info(`Server listening at ${address}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
