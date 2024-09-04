import { useMatches } from '@remix-run/react'
import { isObject } from '#app/utils/object.js'

export function useHideMenu() {
	return useMatches().some((m) => isObject(m.handle) && m.handle?.hideMenu)
}
