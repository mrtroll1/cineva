import type { FastifyInstance } from 'fastify'
import { ingestCinevilleVisits } from '../use-cases/ingestVisits.js'

export async function ingestRoutes(app: FastifyInstance) {
  app.post<{ Body: { userId: string; passNumber: string } }>('/ingest/cineville', async (request, reply) => {
    const { userId, passNumber } = request.body

    if (!userId || !passNumber) {
      return reply.status(400).send({ error: 'userId and passNumber are required' })
    }

    const result = await ingestCinevilleVisits(userId, passNumber)
    return result
  })
}
