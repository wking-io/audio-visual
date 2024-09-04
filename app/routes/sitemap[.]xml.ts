import { generateSitemap } from '@nasa-gcn/remix-seo'
import { type LoaderFunctionArgs } from '@remix-run/cloudflare'
// @ts-expect-error Virtual modules are not recognized by TypeScript

import { routes } from 'virtual:remix/server-build'
import { getDomainUrl } from '#app/utils/misc.tsx'

export async function loader({ request }: LoaderFunctionArgs) {
	return generateSitemap(request, routes, {
		siteUrl: getDomainUrl(request),
		headers: {
			'Cache-Control': `public, max-age=${60 * 5}`,
		},
	})
}
