import { Dialog } from '@headlessui/react'
import {
	CheckCircleIcon,
	ExclamationCircleIcon,
	XMarkIcon,
} from '@heroicons/react/24/solid'
import { type ComponentProps, type VoidFunctionComponent } from 'react'
import Toast from '#/app/components/impl/Toast.tsx'

type Variants = typeof variants

const iconClasses = 'w-6 h-6'

const variants = {
	success: {
		classes: 'from-success to-success-hover',
		icon: <CheckCircleIcon className={`text-success ${iconClasses}`} />,
	},
	danger: {
		classes: 'from-danger to-danger-hover',
		icon: <ExclamationCircleIcon className={`text-danger ${iconClasses}`} />,
	},
} as const

type ToastProps = ComponentProps<typeof Toast>
type ToastComponent = VoidFunctionComponent<ToastProps>

/**
 * Generic, flexible toast kit for building other toast kits
 */
export default function ToastKit<TToast extends ToastComponent = typeof Toast>({
	title,
	description,
	variant = 'success',
	toastProps,
}: {
	variant?: keyof Variants
	title: string
	description: string
	toastProps?: Omit<ComponentProps<TToast>, 'children'>
}) {
	const { classes, icon } = variants[variant]
	return (
		<Toast {...toastProps}>
			{(close) => (
				<Dialog.Panel
					className={`relative m-2 w-96 bg-gradient-to-br p-1 shadow-xl transition-all ${classes}`}
				>
					<div className="relative flex gap-4 bg-white py-4 px-6">
						<button
							type="button"
							className="absolute top-0 right-0 p-2 hover:bg-gray-100"
							onClick={() => close()}
						>
							<XMarkIcon className="text-secondary hover:text-primary h-5 w-5" />
						</button>
						<div>{icon}</div>
						<div className="flex flex-col gap-1">
							<h3 className="text-primary font-extrabold">{title}</h3>
							<p className="text-sm">{description}</p>
						</div>
					</div>
				</Dialog.Panel>
			)}
		</Toast>
	)
}
