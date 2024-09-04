import { useEffect, useState, useTransition } from 'react'

/** @returns true when the page has been hydrated in the web browser */
export default function useIsClientSideRendering(): boolean {
	const [isClientSideRendering, setIsClientSideRendering] = useState(false)
	const [, startTransition] = useTransition()
	useEffect(() => startTransition(() => setIsClientSideRendering(true)), [])
	return isClientSideRendering
}
