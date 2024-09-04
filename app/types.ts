import { type ComponentType, type ElementType } from 'react'
import { type ZodFormattedError } from 'zod'

export type PropsWithClassName<T = {}> = T & { className?: string }

export type ActionResponse<T = any, E = any> = {
	success: boolean
	errors?: ZodFormattedError<E>
	data?: T
}

export type Tag = ElementType | ComponentType<{ className?: string }>

export type SitemapEntry = {
	route: string
	lastmod?: string
	changefreq?:
		| 'always'
		| 'hourly'
		| 'daily'
		| 'weekly'
		| 'monthly'
		| 'yearly'
		| 'never'
	priority?: 0.0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0
}

export type ListOfErrors = Array<string | null | undefined> | null | undefined
