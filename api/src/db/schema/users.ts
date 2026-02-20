import { pgTable, uuid, text, jsonb, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  lastName: text('last_name').notNull(),
  photoUrl: text('photo_url'),
  email: text('email').notNull().unique(),
  linkedProviders: jsonb('linked_providers').$type<Record<string, string>>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})
