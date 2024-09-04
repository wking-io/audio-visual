import { useLocation, useMatches, type UIMatch } from '@remix-run/react'
import { useMemo } from 'react'
import useIsClientSideRendering from '#app/hooks/useClientsideRendering.js'
import { useRequestInfo } from '#app/utils/request-info.js'

function makeCanonicalUrl(...params: ConstructorParameters<typeof URL>): URL {
	const expectedUrl = new URL(...params)

	// Clear search params
	const { searchParams } = expectedUrl
	Array.from(searchParams.keys())
		.filter(
			(key) =>
				key !== 'page' || (key == 'page' && searchParams.get(key) == '1'),
		)
		.forEach((key) => searchParams.delete(key))

	expectedUrl.hash = ''

	return expectedUrl
}

function useCanonicalUrl(): URL | undefined {
	const matches = useMatches() as UIMatch<
		unknown,
		Record<string, any> | undefined
	>[]
	const requestInfo = useRequestInfo()
	const location = useLocation()
	const skipCanonical = useMemo(
		() => !!matches.find((match) => match.handle?.skipCanonical ?? false),
		[matches],
	)
	const isClient = useIsClientSideRendering()
	return useMemo(() => {
		if (skipCanonical) return undefined
		const urlString = isClient
			? window.location.href
			: `${requestInfo.origin}${requestInfo.path}`
		return urlString === undefined ? undefined : makeCanonicalUrl(urlString)
	}, [
		requestInfo,
		isClient,
		skipCanonical,
		// The `Location` returned from `useLocation()` does not include `href`. It
		// is only being called here to force an update when navigating to other
		// pages.
		location,
	])
}

export function CanonicalLink() {
	const url = useCanonicalUrl()
	return url ? <link rel="canonical" href={url.href} /> : null
}
