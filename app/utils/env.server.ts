import { z } from 'zod'

const schema = z.object({
	NODE_ENV: z.enum(['production', 'development', 'test'] as const),
	DATABASE_URL: z.string(),
	SESSION_SECRET: z.string(),
	INTERNAL_COMMAND_TOKEN: z.string(),
	HONEYPOT_SECRET: z.string(),
	ALLOW_INDEXING: z.enum(['true', 'false']).optional(),
	SKIP_ALLOWED_PATHS: z.enum(['true', 'false']).optional(),
	FATHOM_ID: z.string().optional(),
	SKIP_CACHE: z.string().optional(),
	CACHE_VERSION: z.string().optional(),
})

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof schema> {}
	}
}

export function init() {
	const parsed = schema.safeParse(process.env)

	if (parsed.success === false) {
		console.error(
			'❌ Invalid environment variables:',
			parsed.error.flatten().fieldErrors,
		)

		throw new Error('Invalid environment variables')
	}
}

/**
 * This is used in both `entry.server.ts` and `root.tsx` to ensure that
 * the environment variables are set and globally available before the app is
 * started.
 *
 * NOTE: Do *not* add any environment variables in here that you do not wish to
 * be included in the client.
 * @returns all public ENV variables
 */
export function getEnv(env: Env) {
	return {
		ALLOW_INDEXING: env.ALLOW_INDEXING,
		FATHOM_ID: env.FATHOM_ID,
	}
}

type ENV = ReturnType<typeof getEnv>

declare global {
	var ENV: ENV
	interface Window {
		ENV: ENV
	}
}
