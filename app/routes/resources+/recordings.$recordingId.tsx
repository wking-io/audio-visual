import { invariant } from '@epic-web/invariant'
import Headers from '@mjackson/headers'
import { redirect, type LoaderFunctionArgs } from '@remix-run/cloudflare'
import { R2FileStorage } from '#app/utils/file-storage.js'

export async function loader({ params, context }: LoaderFunctionArgs) {
	const { recordingId } = params
	invariant(recordingId, 'Missing recording ID.')

	const store = new R2FileStorage(context.cloudflare.env.BUCKET)
	const recording = await store.get(recordingId)

	if (!recording) {
		return redirect('/')
	}

	const meta = store.getMeta(recordingId)

	const headers = new Headers()

	headers.contentType = recording.type
	headers.contentDisposition = `inline; filename="${recording.name}"`
	headers.cacheControl = 'public, max-age=31536000, immutable'

	if (meta) {
		headers.contentLength = meta.size
		headers.set('ETag', meta.httpEtag)
	}

	return new Response(recording, {
		status: 200,
		headers,
	})
}
