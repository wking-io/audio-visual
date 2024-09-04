import { type ComponentPropsWithoutRef } from 'react'
import { type Tag } from '#/app/types.ts'

export default function Container<TTag extends Tag = 'div'>({
	as,
	className,
	children,
	...props
}: { as?: TTag } & ComponentPropsWithoutRef<TTag>) {
	const Wrapper = as || 'div'
	return (
		<Wrapper
			{...props}
			className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className ?? ''}`}
		>
			{children}
		</Wrapper>
	)
}
