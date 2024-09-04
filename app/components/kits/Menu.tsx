import { Menu as HMenu, Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { Link } from '@remix-run/react'
import { Fragment, type PropsWithChildren } from 'react'
import Button from '#/app/components/kits/Button.tsx'
import Form, { type FormProps } from '#/app/components/kits/Form.tsx'
import { type PropsWithClassName } from '#/app/types.ts'

type Option =
	| {
			type: 'internal'
			to: string
			label: string
	  }
	| {
			type: 'form'
			label: string
			formProps: FormProps
	  }

export default function Menu({
	label = '',
	options,
	width = 'w-40',
	align = 'left',
	children,
	className,
}: PropsWithChildren<
	PropsWithClassName<{
		label?: string
		align?: 'left' | 'right'
		width?: `w-${string}`
		options: Option[]
	}>
>) {
	const { Base, Panel, Item } = children
		? { Base: Popover, Panel: Popover.Panel, Item: Popover.Button }
		: { Base: HMenu, Panel: HMenu.Items, Item: HMenu.Item }
	return (
		<>
			<Base>
				<div className="relative">
					<Base.Button
						as={Button}
						className={`justify-between ${className ?? ''}`}
					>
						{label}
						<span className="pointer-events-none">
							<ChevronDownIcon
								className="h-4 w-4 opacity-75"
								aria-hidden="true"
							/>
						</span>
					</Base.Button>
					<Transition
						as={Fragment}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Panel
							className={` ${width} ${
								align === 'left' ? 'left-0' : 'right-0'
							} bg-layer-1 absolute z-50 mt-2 w-full overflow-auto rounded-md border pb-1 text-base shadow-lg focus:outline-none sm:text-sm`}
						>
							<div className="mb-1">{children}</div>
							{options.map(({ label, ...option }, idx) =>
								option.type === 'internal' ? (
									<Item
										key={option.to}
										as={Link}
										to={option.to}
										className="hover:bg-brand-light/25 text-secondary hover:text-primary relative flex cursor-default items-center py-2 px-4 select-none"
									>
										<span className="block flex-1 truncate">{label}</span>
									</Item>
								) : (
									<Form
										key={`${label}-${idx}`}
										{...option.formProps}
										className="w-full"
									>
										<Item
											as="button"
											type="submit"
											className="hover:bg-brand-light/50 text-secondary hover:text-primary relative flex w-full cursor-default items-center py-2 px-4 select-none"
										>
											{label}
										</Item>
									</Form>
								),
							)}
						</Panel>
					</Transition>
				</div>
			</Base>
		</>
	)
}
