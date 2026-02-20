import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const ventureTypeEnum = pgEnum('venture_type', ['CINEMA', 'MUSEUM'])

export const ventures = pgTable('ventures', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  country: text('country').notNull(),
  city: text('city').notNull(),
  type: ventureTypeEnum('type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})
