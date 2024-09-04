import { sql } from 'drizzle-orm'
import {
	sqliteTable,
	text,
	integer,
	type AnySQLiteColumn,
} from 'drizzle-orm/sqlite-core'

export const user = sqliteTable('user', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
})

export const password = sqliteTable('password', {
	hash: text('hash').notNull(),
	createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),

	userId: text('user_id')
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
})

export const session = sqliteTable('session', {
	id: integer('id').primaryKey(),
	expirationDate: integer('expiration_date', { mode: 'timestamp' }),
	createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),

	userId: text('user_id')
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
})

export const recording = sqliteTable('recording', {
	id: integer('id').primaryKey(),
	audio: text('audio'),
	createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
	activeIterationId: text('active_iteration_id').references(
		(): AnySQLiteColumn => recordingIteration.id,
		{ onDelete: 'set null' },
	),

	userId: text('user_id')
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
})

export const recordingIteration = sqliteTable('recording_iteration', {
	id: integer('id').primaryKey(),
	seed: integer('seed'),
	createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),

	recordingId: text('recording_id')
		.notNull()
		.unique()
		.references(() => recording.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
})
