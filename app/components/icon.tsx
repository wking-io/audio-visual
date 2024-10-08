import clsx from 'clsx'
import { forwardRef, type SVGProps } from 'react'
import href from './icons/sprite.svg'
import { type IconName } from '@/icon-name'

export { IconName, href }

const sizeClassName = {
	font: 'w-[1em] h-[1em]',
	xs: 'w-3 h-3',
	sm: 'w-4 h-4',
	md: 'w-5 h-5',
	lg: 'w-6 h-6',
	xl: 'w-7 h-7',
} as const

type Size = keyof typeof sizeClassName

/**
 * Renders an SVG icon. The icon defaults to the size of the font. To make it
 * align vertically with neighboring text, you can pass the text as a child of
 * the icon and it will be automatically aligned.
 * Alternatively, if you're not ok with the icon being to the left of the text,
 * you need to wrap the icon and text in a common parent and set the parent to
 * display "flex" (or "inline-flex") with "items-center" and a reasonable gap.
 */
export const Icon = forwardRef<
	SVGSVGElement,
	SVGProps<SVGSVGElement> & {
		name: IconName
		size?: Size
	}
>(({ name, size = 'font', className, children, ...props }, ref) => {
	return (
		<svg
			{...props}
			ref={ref}
			className={clsx(sizeClassName[size], 'inline self-center', className)}
		>
			<use href={`${href}#${name}`} />
		</svg>
	)
})

Icon.displayName = 'Icon'
