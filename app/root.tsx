import {
	json,
	type LinksFunction,
	type LoaderFunctionArgs,
	type MetaFunction,
} from '@remix-run/cloudflare'
import {
	Link,
	Links,
	Meta,
	NavLink,
	Outlet,
	Scripts,
	ScrollRestoration,
	generatePath,
	useLoaderData,
	useLocation,
} from '@remix-run/react'
import clsx from 'clsx'
import * as Fathom from 'fathom-client'
import { useEffect, useRef } from 'react'
import { Toaster } from 'sonner'
import { CanonicalLink } from '#/app/components/canonical-link.tsx'
import { getEnv } from '#/app/utils/env.server.ts'
import { getDomainUrl } from '#/app/utils/index.ts'
import { getSocialMetas } from '#/app/utils/seo.ts'
import { ContextMenu, type ContextMenuItem } from './components/ContextMenu.tsx'
import { GeneralErrorBoundary } from './components/error-boundary.tsx'
import { Icon } from './components/icon.tsx'
import { useHideMenu } from './hooks/useHideMenu.tsx'
import { ThemeSwitch, useTheme } from './routes/resources+/theme-switch.tsx'
import tailwindStyleSheetUrl from './styles/tailwind.css?url'
import { ClientHintCheck, getHints } from './utils/client-hints.tsx'
import { makeHoneypot } from './utils/honeypot.server.ts'
import { HoneypotProvider } from './utils/honeypot.tsx'
import { type RouteID } from './utils/route-id.ts'
import { getTheme, type Theme } from './utils/theme.server.ts'

const ROUTE_ID = 'root' as RouteID<{ loader: typeof loader }>
export { ROUTE_ID as rootRouteId }

export const links: LinksFunction = () => {
	return [
		{
			rel: 'apple-touch-icon',
			sizes: '180x180',
			href: '/favicons/light/apple-touch-icon.png',
		},
		{
			rel: 'icon',
			type: 'image/png',
			sizes: '32x32',
			href: '/favicons/light/favicon-32x32.png',
		},
		{
			rel: 'icon',
			type: 'image/png',
			sizes: '16x16',
			href: '/favicons/light/favicon-16x16.png',
		},
		{ rel: 'icon', href: '/favicon.ico' },
		{
			rel: 'apple-touch-icon',
			sizes: '180x180',
			href: '/favicons/dark/apple-touch-icon.png',
			media: '(prefers-color-scheme: dark)',
		},
		{
			rel: 'icon',
			type: 'image/png',
			sizes: '32x32',
			href: '/favicons/dark/favicon-32x32.png',
			media: '(prefers-color-scheme: dark)',
		},
		{
			rel: 'icon',
			type: 'image/png',
			sizes: '16x16',
			href: '/favicons/dark/favicon-16x16.png',
			media: '(prefers-color-scheme: dark)',
		},
		{
			rel: 'icon',
			href: '/favicon-dark.ico',
			media: '(prefers-color-scheme: dark)',
		},
		{ rel: 'manifest', href: '/site.webmanifest' },
		{ rel: 'stylesheet', href: tailwindStyleSheetUrl },
	].filter(Boolean)
}

export const meta: MetaFunction = () => {
	return getSocialMetas({})
}

export async function loader({ request, context }: LoaderFunctionArgs) {
	const honeypot = makeHoneypot(context.cloudflare.env.HONEYPOT_SECRET)
	const honeyProps = honeypot.getInputProps()
	return json({
		honeyProps,
		ENV: getEnv(context.cloudflare.env),
		requestInfo: {
			hints: getHints(request),
			origin: getDomainUrl(request),
			path: new URL(request.url).pathname,
			userPrefs: {
				theme: getTheme(request),
			},
		},
	})
}

function Document({
	children,
	theme = 'light',
	env = {},
	allowIndexing = true,
}: {
	children: React.ReactNode
	theme?: Theme
	env?: Record<string, string>
	allowIndexing?: boolean
}) {
	return (
		<html lang="en" className={`${theme}`}>
			<head>
				<ClientHintCheck />
				<CanonicalLink />
				<Meta />
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				{allowIndexing ? null : (
					<meta name="robots" content="noindex, nofollow" />
				)}
				<Links />
			</head>
			<body className="text-foreground font-display bg-gray-500">
				{children}
				<script
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(env)}`,
					}}
				/>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

function getLogoItems(theme: Theme): ContextMenuItem[] {
	const path = `/logo/${theme === 'light' ? 'light' : 'dark'}-logo`
	return [
		{
			kind: 'anchor',
			label: (
				<>
					<Icon name="svg" size="sm" />
					<span>Download logo as SVG.</span>
				</>
			),
			href: `${path}.svg`,
			download: true,
		},
		{
			kind: 'anchor',
			label: (
				<>
					<Icon name="png" size="sm" />
					<span>Download logo as PNG.</span>
				</>
			),
			href: `${path}.png`,
			download: true,
		},
	]
}

function App() {
	const { ENV, requestInfo } = useLoaderData<typeof loader>()
	const location = useLocation()
	const fathomLoaded = useRef(false)
	const theme = useTheme()
	const hideMenu = useHideMenu()
	const allowIndexing = ENV.ALLOW_INDEXING !== 'false'

	useEffect(() => {
		if (!fathomLoaded.current && ENV.FATHOM_ID) {
			Fathom.load(ENV.FATHOM_ID, {
				url: 'https://cdn.usefathom.com/script.js',
			})
			fathomLoaded.current = true
		} else {
			Fathom.trackPageview()
		}
	}, [location, fathomLoaded, ENV])

	return (
		<Document theme={theme} allowIndexing={allowIndexing} env={ENV}>
			<div className="relative min-h-screen">
				{hideMenu ? null : (
					<header className="mx-auto flex max-w-6xl justify-between py-2 px-4">
						<Link
							to="/"
							className="text-foreground/65 hover:text-foreground flex items-center gap-2 font-mono text-sm"
						>
							<span className="hidden md:inline-block">audio-visual</span>
						</Link>
						<nav className="font-code flex text-xs">
							<ThemeSwitch userPreference={requestInfo.userPrefs.theme} />
							<Toaster
								duration={400000}
								toastOptions={{
									style: {
										backdropFilter: 'blur(20px)',
										width: '100%',
										borderRadius: 'var(--radius-md)',
									},
								}}
							/>
						</nav>
					</header>
				)}
				<Outlet />
			</div>

			<footer className="border-foreground flex items-center justify-between gap-8 border-t p-2">
				<p className="flex items-center gap-2 text-sm font-semibold">
					wking © {new Date().getFullYear()}
				</p>
				<div className="flex items-center gap-2">
					<nav className="font-code flex items-center gap-2 text-xs">
						<a
							target="_blank"
							href="https://github.com/wking-io"
							className="text-foreground/65 hover:text-foreground"
							rel="noreferrer"
						>
							<Icon name="github-logo" size="sm" />
							<span className="sr-only">Checkout my github</span>
						</a>
						<a
							target="_blank"
							href="https://www.x.com/wking__"
							className="text-foreground/65 hover:text-foreground"
							rel="noreferrer"
						>
							<Icon name="twitter-logo" size="sm" />
							<span className="sr-only">Follow me on X</span>
						</a>
					</nav>
				</div>
			</footer>
		</Document>
	)
}

export default function AppWithProviders() {
	const data = useLoaderData<typeof loader>()
	return (
		<HoneypotProvider {...data.honeyProps}>
			<App />
		</HoneypotProvider>
	)
}

export function ErrorBoundary() {
	// NOTE: you cannot use useLoaderData in an ErrorBoundary because the loader
	// likely failed to run so we have to do the best we can.
	// We could probably do better than this (it's possible the loader did run).
	// This would require a change in Remix.

	// Just make sure your root route never errors out and you'll always be able
	// to give the account a better UX.

	return (
		<Document>
			<GeneralErrorBoundary />
		</Document>
	)
}
