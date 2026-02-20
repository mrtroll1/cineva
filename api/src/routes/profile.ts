import type { FastifyInstance } from 'fastify'
import { getProfile } from '../use-cases/getProfile.js'

export async function profileRoutes(app: FastifyInstance) {
  app.get<{ Params: { userId: string } }>('/profile/:userId', async (request, reply) => {
    const { userId } = request.params
    const result = await getProfile(userId)

    if (!result) {
      return reply.status(404).send({ error: 'User not found' })
    }

    return result
  })
}
