import { type InferSelectModel } from 'drizzle-orm'
import { type recordings } from '#app/db/schema.server.js'

export function makeRecordingKey({
	id,
	audioKey,
}: Pick<InferSelectModel<typeof recordings>, 'id' | 'audioKey'>) {
	return `${id}-${audioKey}`
}
