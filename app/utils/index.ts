import slugify from './slugify.ts'

const DEFAULT_REDIRECT = '/'

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
	to: FormDataEntryValue | string | null | undefined,
	defaultRedirect: string = DEFAULT_REDIRECT,
) {
	if (!to || typeof to !== 'string') {
		return defaultRedirect
	}

	if (!to.startsWith('/') || to.startsWith('//')) {
		return defaultRedirect
	}

	return to
}

export function slugit(value: string) {
	return slugify(value, { lower: true, trim: true, strict: true })
}

/**
 * @returns domain URL (without a ending slash)
 */
export function getDomainUrl(request: Request) {
	const host =
		request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')
	if (!host) {
		throw new Error('Could not determine domain URL.')
	}
	const protocol = host.includes('localhost') ? 'http' : 'https'
	return `${protocol}://${host}`
}

export function removeTrailingSlash(s: string) {
	return s.endsWith('/') ? s.slice(0, -1) : s
}

export function getUrl(requestInfo?: { origin: string; path: string }) {
	return removeTrailingSlash(
		`${requestInfo?.origin ?? 'https://wking.dev'}${requestInfo?.path ?? ''}`,
	)
}

type Format = 'long' | 'medium' | 'short'
export function formatDate(date: Date, format?: Format) {
	const formats: Record<Format, Intl.DateTimeFormatOptions> = {
		long: {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		},
		medium: {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		},
		short: {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
		},
	}

	return date.toLocaleString('en-US', formats[format ?? 'long'])
}

export function typedBoolean<T>(
	value: T,
): value is Exclude<T, '' | 0 | false | null | undefined> {
	return Boolean(value)
}

export function randomKey() {
	return Math.random()
		.toString(36)
		.replace(/[^a-z]+/g, '')
}
