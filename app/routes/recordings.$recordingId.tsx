import { invariant } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { recordings } from '#app/db/schema.server.js'
import { isNumberParam } from '#app/utils/is-number-param.js'
import { makeRecordingKey } from '#app/utils/make-recording-key.js'

export async function loader({ context, params }: LoaderFunctionArgs) {
	const { recordingId } = params
	invariant(recordingId && isNumberParam(recordingId), 'Missing recording id.')
	const db = drizzle(context.cloudflare.env.DB)

	const [recording] = await db
		.select({ id: recordings.id, audioKey: recordings.audioKey })
		.from(recordings)
		.where(eq(recordings.id, parseInt(recordingId)))
		.limit(1)

	if (!recording) {
		throw new Response(null, { status: 404 })
	}

	return json(recording)
}

export default function Screen() {
	const recording = useLoaderData<typeof loader>()
	return (
		<div className="flex min-h-80 flex-1 flex-col items-center justify-center gap-4">
			<div className="w-full max-w-sm">
				<div>
					<audio
						controls
						src={`/resources/recordings/${makeRecordingKey(recording)}`}
						className="w-full"
					></audio>
				</div>
			</div>
		</div>
	)
}
