import { type ComponentPropsWithRef } from 'react'
import Action from '#/app/components/impl/Action.tsx'

type Variant = {
	variant?: keyof typeof variants
}

const variants = {
	primary: {
		bg: 'from-gray-100 to-gray-100 group-hover:from-brand group-hover:to-brand-light group-focus:from-brand group-focus:to-brand-light',
		text: 'group-hover:text-white group-focus:text-white',
	},
	danger: {
		bg: 'from-gray-100 to-gray-100 group-hover:from-danger group-hover:to-danger-hover group-focus:from-danger group-focus:to-danger-hover',
		text: 'group-hover:text-white group-focus:text-white',
	},
	light: {
		bg: 'from-white/25 to-white/10 group-hover:from-brand group-hover:to-brand-dark group-focus:from-brand-dark group-focus:to-brand',
		text: '',
	},
	extraLight: {
		bg: 'from-white/100 to-white/50 group-hover:to-white/80 group-focus:from-white/75 group-focus:to-white/50',
		text: '',
	},
} as const

const baseClasses =
	'absolute inset-0 translate-x-2 translate-y-2 bg-gradient-to-br transition-all group-hover:translate-x-1 group-hover:translate-y-1 disabled:opacity-50 disabled:pointer-events-none'

export default function Button({
	children,
	variant = 'primary',
	className,
	...props
}: ComponentPropsWithRef<typeof Action> & Variant) {
	const { bg, text } = variants[variant]
	return (
		<Action
			{...props}
			className={`group relative select-none focus:outline-none disabled:pointer-events-none disabled:opacity-60 ${
				className ?? ''
			}`}
		>
			<span className={`${baseClasses} ${bg ?? ''}`}></span>
			<span
				className={`border-brand-dark relative flex items-center justify-center gap-2 border py-2 px-6 text-center ${
					text ?? ''
				}`}
			>
				{children}
			</span>
		</Action>
	)
}
