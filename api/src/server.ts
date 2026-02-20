import Fastify from 'fastify'
import cors from '@fastify/cors'
import { healthRoutes } from './routes/health.js'
import { profileRoutes } from './routes/profile.js'
import { matchRoutes } from './routes/matches.js'
import { ingestRoutes } from './routes/ingest.js'

export function buildServer() {
  const app = Fastify({ logger: true })

  app.register(cors, { origin: process.env.CORS_ORIGIN ?? '*' })
  app.register(healthRoutes, { prefix: '/api' })
  app.register(profileRoutes, { prefix: '/api' })
  app.register(matchRoutes, { prefix: '/api' })
  app.register(ingestRoutes, { prefix: '/api' })

  return app
}
