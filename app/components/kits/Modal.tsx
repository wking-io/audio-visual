import { Dialog } from '@headlessui/react'
import {
	type ComponentProps,
	type ComponentType,
	type ElementType,
	type PropsWithChildren,
	type VoidFunctionComponent,
} from 'react'
import Modal from '#/app/components/impl/Modal.tsx'

type Tag = ElementType | ComponentType<{ className?: string }>

type ModalProps = ComponentProps<typeof Modal>
type ModalComponent = VoidFunctionComponent<ModalProps>

/**
 * Generic, flexible modal kit for building other modal kits
 */
export default function ModalKit<TModal extends ModalComponent = typeof Modal>({
	children,
	modalProps,
}: {
	children: (close: VoidFunction) => JSX.Element
	modalProps?: Omit<ComponentProps<TModal>, 'children'>
}) {
	return (
		<Modal {...modalProps}>
			{(close) => (
				<Dialog.Panel className="from-brand to-brand-light relative bg-gradient-to-br p-1 shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl">
					<div className="relative bg-white">{children(close)}</div>
				</Dialog.Panel>
			)}
		</Modal>
	)
}

export function Body({ className, ...props }: ComponentProps<'div'>) {
	return <div {...props} className={`p-8 ${className ?? ''}`} />
}

export function Title({ children }: PropsWithChildren<{}>) {
	return (
		<Dialog.Title
			as="h3"
			className="text-primary mb-2 text-lg font-semibold leading-6"
		>
			{children}
		</Dialog.Title>
	)
}

export function Text<TTag extends Tag = 'p'>({
	/** Element tag or React component */
	as: Component = 'p',
	className,
	...props
}: { as?: TTag } & ComponentProps<TTag>) {
	return (
		<Component
			{...props}
			className={`text-secondary text-sm ${className ?? ''}`}
		/>
	)
}
