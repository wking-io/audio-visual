import { Transition } from '@headlessui/react'
import { Link } from '@remix-run/react'
import {
  type MouseEvent,
  type MouseEventHandler,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react'

export type ContextMenuItem =
	| {
			kind: 'link'
			label: ReactNode
			to: string
	  }
			| {
						kind: 'anchor'
						label: ReactNode
						href: string
						download?: boolean
				  }
	| {
			kind: 'button'
			label: ReactNode
			onClick: MouseEventHandler<HTMLButtonElement>
	  }

export function ContextMenu({
	items,
	children,
}: PropsWithChildren<{ items: ContextMenuItem[] }>) {
	const [open, setIsOpen] = useState(false)
	const [coords, setCoords] = useState({ x: 0, y: 0 })

	const handleContextMenu = useCallback(
		(e: MouseEvent<HTMLDivElement>) => {
			e.preventDefault()
			console.log(e)
			setCoords({ x: e.clientX, y: e.clientY })
			setIsOpen((prev) => !prev)
		},
		[items],
	)

	useEffect(() => {
		function close() {
			setIsOpen(false)
		}
		window.addEventListener('click', close)
		return () => window.removeEventListener('click', close)
	}, [items])

	return (
		<div onContextMenu={handleContextMenu}>
			{children}
			<Transition show={open}>
				<div className="fixed z-50" style={{ left: coords.x, top: coords.y }}>
					<ul className="bg-layer border border-foreground/10 shadow-xl rounded py-1 text-xs text-foreground/75">
						{items.map((item, i) =>
							item.kind === 'button' ? (
								<li key={`context-item-${item.label}-${i}`}>
									<button className={itemClasses} type="button" onClick={item.onClick}>
										{item.label}
									</button>
								</li>
							) : item.kind === 'anchor' ? (
							<li key={`context-item-${item.label}-${i}`}>
									<a className={itemClasses} href={item.href} download={item.download}>{item.label}</a>
								</li>
							) : (
								<li key={`context-item-${item.label}-${i}`}>
									<Link className={itemClasses} to={item.to}>{item.label}</Link>
								</li>
							),
						)}
					</ul>
				</div>
			</Transition>
		</div>
	)
}

const itemClasses = "hover:bg-layer-2 hover:text-foreground py-2 px-4 cursor-pointer flex items-center gap-2 font-code"
