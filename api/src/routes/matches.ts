import type { FastifyInstance } from 'fastify'
import { getMatches } from '../use-cases/getMatches.js'

export async function matchRoutes(app: FastifyInstance) {
  app.get<{ Querystring: { userId: string; limit?: string } }>('/matches', async (request, reply) => {
    const { userId, limit } = request.query

    if (!userId) {
      return reply.status(400).send({ error: 'userId query parameter is required' })
    }

    const matches = await getMatches(userId, limit ? parseInt(limit, 10) : 10)
    return matches
  })
}
