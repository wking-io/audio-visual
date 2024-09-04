import { type LinkProps, Link as RLink } from '@remix-run/react'

type Variants = typeof variants

type Variant = {
	variant?: keyof Variants
}

const variants = {
	primary:
		'bg-gradient-to-br from-brand to-brand-light bg-clip-text text-transparent hover:from-brand-dark hover:to-brand',
	secondary:
		'hover:bg-gradient-to-br hover:from-brand hover:to-brand-light hover:bg-clip-text hover:text-transparent',
} as const

export { variants as buttonVariantClasses }

/**
 * Displays a variant link
 */

export default function Link({
	children,
	variant = 'secondary',
	className,
	...props
}: LinkProps & Variant) {
	return (
		<RLink
			{...props}
			className={`${variants[variant] ?? ''} ${className ?? ''}`}
		>
			{children}
		</RLink>
	)
}
