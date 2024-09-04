import { rootRouteId } from '#app/root.tsx'
import { useRouteIdLoaderData } from './route-id'

/**
 * @returns the request info from the root loader
 */
export function useRequestInfo() {
	const data = useRouteIdLoaderData(rootRouteId)
	return data.requestInfo
}
