import type { FastifyInstance } from 'fastify'
import { getInvites } from '../use-cases/getInvites.js'

export async function inviteRoutes(app: FastifyInstance) {
  app.get<{ Querystring: { userId: string } }>('/invites', async (request, reply) => {
    const { userId } = request.query

    if (!userId) {
      return reply.status(400).send({ error: 'userId query parameter is required' })
    }

    return getInvites(userId)
  })
}
