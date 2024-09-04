import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
import {
	type FormProps as RFormProps,
	Form as RForm,
	useLocation,
} from '@remix-run/react'
import { forwardRef, useState } from 'react'
import { HoneypotInputs } from '#/app/utils/honeypot.tsx'

export type FormProps = RFormProps & {
	/**
	 * Allows the passing of a fetcher.Form
	 * @default RemixForm
	 */
	as?: typeof RForm
	/**
	 * Used on routes with multiple actions to identify the submitted form.
	 * @default undefined
	 */
	actionId?: string
	/**
	 * Tells the action where to send a successful response
	 * @default undefined
	 */
	redirectTo?: string
}

export const borderColors = 'border-gray-600 dark:border-gray-400'

export default function Form({
	children,
	as,
	className,
	actionId,
	redirectTo,
	method = 'post',
	...props
}: FormProps) {
	const { pathname } = useLocation()
	const ThisForm = as || RForm
	return (
		<ThisForm
			{...props}
			method={method === 'get' ? 'get' : 'post'}
			className={className}
		>
			<HoneypotInputs label="Please leave this field blank" />
			<input type="hidden" name="referrer" value={pathname} />
			<input type="hidden" name="_method" value={method} />

			{actionId ? (
				<input type="hidden" name="_action" value={actionId} />
			) : null}
			{redirectTo ? (
				<input type="hidden" name="redirectTo" value={redirectTo} />
			) : null}
			{children}
		</ThisForm>
	)
}

export const Label = forwardRef(
	(
		{ className, ...props }: React.ComponentProps<'label'>,
		ref: React.ForwardedRef<HTMLLabelElement>,
	) => (
		<label
			{...props}
			ref={ref}
			className={`block text-sm font-semibold text-gray-700 ${className ?? ''}`}
		/>
	),
)

Label.displayName = 'Form.Label'

export const inputClassNames =
	'w-full border border-gray-500 px-2 py-1 text-lg focus:border-brand focus:ring focus:ring-brand-light/50'

export const Input = forwardRef(
	(
		{ className, ...props }: React.ComponentProps<'input'>,
		ref: React.ForwardedRef<HTMLInputElement>,
	) => (
		<input
			{...props}
			ref={ref}
			className={`${inputClassNames} ${className ?? ''}`}
		/>
	),
)

Input.displayName = 'Form.Input'

export const Checkbox = forwardRef(
	(
		{ className, ...props }: React.ComponentProps<'input'>,
		ref: React.ForwardedRef<HTMLInputElement>,
	) => (
		<input
			{...props}
			type="checkbox"
			ref={ref}
			className={`text-crunchy focus:ring-crunchy dark:focus:ring-offset-gray-1100 h-4 w-4 rounded border-0 focus:ring-offset-white ${className ?? ''} `}
		/>
	),
)

Checkbox.displayName = 'Form.Checkbox'

export const Password = forwardRef(
	(
		{ className, ...props }: Omit<React.ComponentProps<'input'>, 'type'>,
		ref: React.ForwardedRef<HTMLInputElement>,
	) => {
		const [showPassword, setShowPassword] = useState(false)
		return (
			<div
				className={`${className ?? ''} "focus-within:ring-crunchy focus-within:border-crunchy-bright bg-layer-1 focus-within:ring-opacity-25 flex flex-row rounded-md border py-1 pl-1 placeholder-gray-400 shadow-sm focus-within:ring`}
			>
				<input
					{...props}
					type={showPassword ? 'text' : 'password'}
					ref={ref}
					className="bg-layer-1 block flex-1 appearance-none rounded-l-sm border-transparent py-1 px-2 focus:border-transparent focus:ring-0 focus:outline-none sm:text-sm"
				/>
				<button
					id="toggle-password"
					type="button"
					onClick={() => setShowPassword((prev) => !prev)}
					className="text-crunchy focus:bg-crunchy/10 hover:bg-crunchy/10 shrink-0 rounded px-2 focus:outline-none"
				>
					<EyeIcon className={`${showPassword ? 'hidden' : ''} h-5 w-5`} />
					<EyeSlashIcon
						className={`${!showPassword ? 'hidden' : ''} h-5 w-5`}
					/>
				</button>
			</div>
		)
	},
)

Password.displayName = 'Form.Password'

export const textAreaClassNames =
	'border border-gray-500 bg-layer-1 shadow-sm block w-full sm:text-sm focus:border-brand focus:ring focus:ring-brand-light/50'

export const TextArea = forwardRef(
	(
		{ className, ...props }: React.ComponentProps<'textarea'>,
		ref: React.ForwardedRef<HTMLTextAreaElement>,
	) => (
		<textarea
			{...props}
			ref={ref}
			className={`${textAreaClassNames} ${className ?? ''} `}
		/>
	),
)

TextArea.displayName = 'Form.TextArea'
