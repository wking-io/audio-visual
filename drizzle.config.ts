import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	dialect: 'sqlite',
	driver: 'd1-http',
	out: 'app/db/migrations',
	schema: 'app/db/schema.server.ts',
})
