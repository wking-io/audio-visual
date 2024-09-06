import { sql } from 'drizzle-orm'
import {
	sqliteTable,
	text,
	integer,
	type AnySQLiteColumn,
} from 'drizzle-orm/sqlite-core'
import { nanoid } from 'nanoid'

export const users = sqliteTable('user', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
})

export const passwords = sqliteTable('password', {
	hash: text('hash').notNull(),
	createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),

	userId: text('user_id')
		.notNull()
		.unique()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
})

export const sessions = sqliteTable('session', {
	id: integer('id').primaryKey(),
	expirationDate: integer('expiration_date', { mode: 'timestamp' }),
	createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),

	userId: text('user_id')
		.notNull()
		.unique()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
})

export const recordings = sqliteTable('recording', {
	id: integer('id').primaryKey(),
	audioKey: text('audio_key')
		.notNull()
		.$defaultFn(() => nanoid()),
	createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
	activeIterationId: text('active_iteration_id').references(
		(): AnySQLiteColumn => recordingIterations.id,
		{ onDelete: 'set null' },
	),

	userId: text('user_id')
		.unique()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
})

export const recordingIterations = sqliteTable('recording_iteration', {
	id: integer('id').primaryKey(),
	seed: integer('seed'),
	createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),

	recordingId: text('recording_id')
		.notNull()
		.unique()
		.references(() => recordings.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
})
