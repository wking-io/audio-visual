import { Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { type NavLinkProps, Link, NavLink, useMatch } from '@remix-run/react'
import clsx from 'clsx'
import {
	type PropsWithChildren,
	Fragment,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { type PropsWithClassName } from '#/app/types.ts'
import { screenWithoutHeader } from '#/app/utils/tailwind-constants.ts'

/**
 * In theory could probably get away with an array of tuples like:
 * [[href, label], [href, label]]
 * But should other attrs come up it's easier to support additively this way
 *
 * Did consider taking react components that fit the ItemProps type instead but
 * found it to be more verbose and the items had to be wrapped in a fragment
 *
 * This approach felt a bit cleaner and more concise
 */
export type MenuItem = Omit<NavLinkProps, 'children'> & {
	label: string | JSX.Element
	notification?: JSX.Element
	children?: MenuItem[]
}

interface ColumnMenuLayoutProps {
	menuItems: MenuItem[]
	children: React.ReactNode
	sidebar?: React.ReactNode
	navLabel: string
}

export function SidebarTitle({ children }: PropsWithChildren) {
	return (
		<h4 className="text-primary/50 mt-8 px-6 text-xs font-extrabold uppercase tracking-wider lg:px-8">
			{children}
		</h4>
	)
}

function NavItem({ to, label, end = true, children }: MenuItem) {
	const match = useMatch({ path: `${to}`, end: false })
	const [open, setOpen] = useState(match !== null)
	const routeMatches = useMemo(() => Boolean(match), [match])

	useEffect(() => {
		setOpen(routeMatches)
	}, [routeMatches])

	if (children?.length) {
		return (
			<>
				<div className="flex items-center justify-between">
					<Link
						to={to}
						className="font-display hover:bg-layer-1 hover:text-primary block flex-1 py-3 pl-6 lg:pl-8"
					>
						{label}
					</Link>
					<button
						className={clsx(
							'hover:bg-layer-1 p-3 transition',
							open && 'rotate-90',
						)}
						onClick={() => setOpen((prev) => !prev)}
					>
						<ChevronRightIcon className="h-4 w-4" />
					</button>
				</div>
				{open ? (
					<div className="ml-6 border-l py-1 lg:ml-8">
						{children.map((item) => (
							<NavLink
								key={`${item.to}-child`}
								to={item.to}
								end={item?.end ?? true}
								className={({ isActive }) =>
									`font-display block py-2 px-4 text-xs ${
										isActive
											? 'bg-layer-2 text-primary'
											: 'hover:bg-layer-1 hover:text-primary'
									}`
								}
							>
								{item.label}
							</NavLink>
						))}
					</div>
				) : null}
			</>
		)
	}

	return (
		<NavLink
			key={`${to}-item`}
			end={end}
			to={to}
			className={({ isActive }) =>
				`font-display block py-3 px-6 lg:px-8 ${
					isActive
						? 'bg-layer-2 text-primary'
						: 'hover:bg-layer-1 hover:text-primary'
				}`
			}
		>
			{label}
		</NavLink>
	)
}

export default function ColumnMenuLayout({
	menuItems,
	children,
	className = '',
	sidebar,
	navLabel,
}: PropsWithClassName<ColumnMenuLayoutProps>) {
	const [show, setShow] = useState(true)

	console.log(show)

	useEffect(() => {
		function hide() {
			console.log('HERE?')
			setShow(window?.innerWidth >= 768)
		}
		window.addEventListener('resize', hide)
		hide()
		return () => window.removeEventListener('resize', hide)
	}, [])

	return (
		<Menu as="div" className="relative flex min-h-screen items-start">
			<Transition
				as={Fragment}
				show={show}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 -translate-x-full"
				enterTo="transform opacity-100 translate-x-0"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 translate-x-0"
				leaveTo="transform opacity-0 -translate-x-full"
			>
				<Menu.Items
					static
					className="fixed top-[65px] bottom-0 left-0 z-10 hidden w-56 flex-col border-r bg-white text-sm sm:flex md:top-[81px] lg:w-64 lg:text-base print:hidden"
				>
					<div className="sticky top-0 h-full w-full overflow-x-visible overflow-y-auto pb-8">
						{sidebar ?? null}
						{menuItems.length > 1 ? (
							<nav className="mt-2" aria-label={navLabel}>
								{menuItems.map((item) => (
									<NavItem key={`${item.to}-root`} {...item} />
								))}
							</nav>
						) : null}
					</div>
					<button
						className="absolute top-4 left-full border bg-white p-1 md:hidden"
						onClick={() => setShow((prev) => !prev)}
					>
						{show ? (
							<XMarkIcon className="h-4 w-4" />
						) : (
							<Bars3Icon className="h-4 w-4" />
						)}
					</button>
				</Menu.Items>
			</Transition>
			<button
				className="fixed top-20 left-0 border p-1"
				onClick={() => setShow((prev) => !prev)}
			>
				{show ? (
					<XMarkIcon className="h-4 w-4" />
				) : (
					<Bars3Icon className="h-4 w-4" />
				)}
			</button>
			<div
				className={`flex w-full flex-col justify-between md:ml-56 lg:ml-64 ${screenWithoutHeader} flex-1 ${className}`}
			>
				<div>{children}</div>
			</div>
		</Menu>
	)
}
