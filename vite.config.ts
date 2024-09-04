import {
	vitePlugin as remix,
	cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from '@remix-run/dev'
import tailwindcss from '@tailwindcss/vite'
import morgan from 'morgan'
import { flatRoutes } from 'remix-flat-routes'
import { type ViteDevServer, defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	build: {
		minify: true,
	},
	plugins: [
		morganPlugin(),
		tailwindcss(),
		remixCloudflareDevProxy(),
		remix({
			routes: async (defineRoutes) => {
				return flatRoutes('routes', defineRoutes, {
					ignoredRouteFiles: [
						'.*',
						'**/*.css',
						'**/*.test.{js,jsx,ts,tsx}',
						'**/__*.*',
						// This is for server-side utilities you want to colocate
						// next to your routes without making an additional
						// directory. If you need a route that includes "server" or
						// "client" in the filename, use the escape brackets like:
						// my-route.[server].tsx
						'**/*.server.*',
						'**/*.client.*',
					],
				})
			},
		}),
		tsconfigPaths(),
	],
})

function morganPlugin() {
	return {
		name: 'morgan-plugin',
		configureServer(server: ViteDevServer) {
			return () => {
				server.middlewares.use(morgan('tiny'))
			}
		},
	}
}
