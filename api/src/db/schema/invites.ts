import { pgTable, pgEnum, uuid, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users.js'

export const inviteStatusEnum = pgEnum('invite_status', ['PENDING', 'ACCEPTED', 'DECLINED'])

export const invites = pgTable('invites', {
  id: uuid('id').primaryKey().defaultRandom(),
  fromUserId: uuid('from_user_id').notNull().references(() => users.id),
  toUserId: uuid('to_user_id').notNull().references(() => users.id),
  whenText: text('when_text').notNull(),
  whereText: text('where_text').notNull(),
  status: inviteStatusEnum('status').notNull().default('PENDING'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})
