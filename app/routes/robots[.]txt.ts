import { generateRobotsTxt } from '@nasa-gcn/remix-seo'
import { type LoaderFunctionArgs } from '@remix-run/cloudflare'
import { getDomainUrl } from '#app/utils/misc.tsx'

export function loader({ request }: LoaderFunctionArgs) {
	return generateRobotsTxt([
		{ type: 'sitemap', value: `${getDomainUrl(request)}/sitemap.xml` },
	])
}
