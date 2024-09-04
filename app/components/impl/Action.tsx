import { type LinkProps, Link } from '@remix-run/react'
import { type ComponentPropsWithRef, forwardRef } from 'react'

type AnchorProps = React.ComponentPropsWithRef<'a'>
type ButtonProps = React.ComponentPropsWithRef<'button'>

const AAnchor = forwardRef<HTMLAnchorElement, AnchorProps>(
	({ children, ...props }, ref) => (
		<a {...props} ref={ref}>
			{children}
		</a>
	),
)

AAnchor.displayName = 'Action.Anchor'

const ALink = forwardRef<HTMLAnchorElement, LinkProps>(
	({ children, ...props }, ref) => (
		<Link {...props} ref={ref}>
			{children}
		</Link>
	),
)

ALink.displayName = 'Action.Link'

const AButton = forwardRef<HTMLButtonElement, ButtonProps>(
	({ children, ...props }, ref) => (
		<button {...props} ref={ref}>
			{children}
		</button>
	),
)

AButton.displayName = 'Action.Button'

type ActionProps = ComponentPropsWithRef<
	typeof AAnchor | typeof ALink | typeof AButton
>

export default function Action({ children, ...props }: ActionProps) {
	return 'href' in props ? (
		<a {...(props as AnchorProps)}>{children}</a>
	) : 'to' in props ? (
		<Link {...(props as LinkProps)}>{children}</Link>
	) : (
		<button {...(props as ButtonProps)}>{children}</button>
	)
}
