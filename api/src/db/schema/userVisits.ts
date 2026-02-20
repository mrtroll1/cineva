import { pgTable, uuid, text, date, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users.js'
import { ventures } from './ventures.js'

export const userVisits = pgTable('user_visits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  ventureId: uuid('venture_id').notNull().references(() => ventures.id),
  date: date('date').notNull(),
  providerName: text('provider_name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})
