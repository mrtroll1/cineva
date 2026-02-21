import { eq, or, desc } from 'drizzle-orm'
import { db } from '../db/client.js'
import { invites } from '../db/schema/index.js'
import { users } from '../db/schema/index.js'
import { alias } from 'drizzle-orm/pg-core'

const fromUser = alias(users, 'fromUser')
const toUser = alias(users, 'toUser')

export const inviteRepository = {
  async findByUserId(userId: string) {
    return db
      .select({
        id: invites.id,
        whenText: invites.whenText,
        whereText: invites.whereText,
        status: invites.status,
        createdAt: invites.createdAt,
        fromUserId: invites.fromUserId,
        toUserId: invites.toUserId,
        fromUserName: fromUser.name,
        fromUserLastName: fromUser.lastName,
        fromUserPhoto: fromUser.photoUrl,
        toUserName: toUser.name,
        toUserLastName: toUser.lastName,
        toUserPhoto: toUser.photoUrl,
      })
      .from(invites)
      .innerJoin(fromUser, eq(invites.fromUserId, fromUser.id))
      .innerJoin(toUser, eq(invites.toUserId, toUser.id))
      .where(or(eq(invites.fromUserId, userId), eq(invites.toUserId, userId)))
      .orderBy(desc(invites.createdAt))
  },

  async create(data: { fromUserId: string; toUserId: string; whereText: string; whenText: string }) {
    const [row] = await db
      .insert(invites)
      .values(data)
      .returning()
    return row
  },
}
