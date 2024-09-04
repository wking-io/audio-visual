import clsx from 'clsx'
import {
	type PropsWithChildren,
	createContext,
	forwardRef,
	useContext,
} from 'react'

export type Status = 'idle' | 'pending' | 'success'

/**
 * A critical part of the Compound Component pattern is having a shared context that all the
 * components can use to communicate with each other.
 */
const StatusButtonContext = createContext<Status | null>(null)
StatusButtonContext.displayName = 'StatusButtonContext'

/**
 * Fun Trick: The error in this function makes sure to restrict the use of Compound Components
 * to only be used within the <StatusButton /> component. Throws a helpful message when you don't.
 */
function useStatusButtonContext(component: string) {
	let context = useContext(StatusButtonContext)
	if (context === null) {
		let err = new Error(
			`<${component} /> is missing a parent <StatusButton /> component.`,
		)
		if (Error.captureStackTrace)
			Error.captureStackTrace(err, useStatusButtonContext)
		throw err
	}
	return context
}

const colors = {
	DEFAULT:
		'border-foreground/10 bg-foreground/20 hover:[&:not(:disabled)]:bg-foreground/30',
	invert:
		'border-background/10 bg-background/20 hover:[&:not(:disabled)]:bg-background/30',
	bright:
		'border-foreground bg-foreground/80 hover:[&:not(:disabled)]:bg-foreground/50 text-background',
}

type Color = keyof typeof colors

const variants = {
	DEFAULT: 'rounded-md',
	sharp: '',
}

type Variant = keyof typeof variants

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	status: Status
	variant?: Variant
	color?: Color
}

export const StatusButton = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{ className, status, variant = 'DEFAULT', color = 'DEFAULT', ...props },
		ref,
	) => {
		return (
			<StatusButtonContext.Provider value={status}>
				<button
					ref={ref}
					disabled={status !== 'idle'}
					className={clsx(
						className,
						variants[variant],
						colors[color],
						'font-code text-sm',
						'border py-1.5 px-3',
						'relative flex items-center justify-center gap-2.5',
						'cursor-pointer transition',
					)}
					{...props}
				/>
			</StatusButtonContext.Provider>
		)
	},
)
StatusButton.displayName = 'StatusButton'

/**
 * Trigger blur on pending status. Can be used with raw text or the components
 * below to conditionally render text based on the status.
 *
 * @example Static
 *
 *   return (
 *     <StatusButton>
 *       <StatusText>Static Button Text</StatusText>
 *     </StatusButton>
 *  )
 *
 * @example Dynamic
 *
 *   return (
 *     <StatusButton>
 *       <StatusText>
 *           <IdleText>Dynamic Button Text</IdleText>
 *           <SuccessText>Success Button Text</SuccessText>
 *       </StatusText>
 *     </StatusButton>
 *  )
 */
export function StatusText({ children }: PropsWithChildren) {
	const status = useStatusButtonContext('StatusIcon')
	return (
		<span
			className={clsx(
				status === 'pending' && 'blur-sm',
				'transition duration-200',
			)}
		>
			{children}
		</span>
	)
}

export function IdleText({ children }: PropsWithChildren) {
	const status = useStatusButtonContext('StatusIcon')
	return status !== 'success' ? children : null
}

export function SuccessText({ children }: PropsWithChildren) {
	const status = useStatusButtonContext('StatusIcon')
	return status === 'success' ? children : null
}

/**
 * Handles conditionally rendering the dynamically passed icon vs
 * the loader and success icons based on status.
 */
export function StatusIcon({ children }: PropsWithChildren) {
	const status = useStatusButtonContext('StatusIcon')
	switch (status) {
		case 'idle':
			return <span className="w-4">{children}</span>
		case 'pending':
			return (
				<span className="w-4">
					<LoaderIcon />
				</span>
			)
		case 'success':
			return (
				<span className="w-4">
					<CheckIcon />
				</span>
			)
		default:
			return null
	}
}

export function EmailIcon() {
	return (
		<svg
			className="h-auto w-full"
			width="13"
			height="11"
			viewBox="0 0 13 11"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M1 0H2H3H4H5H6H7H8H9H10H11H12V1H13V2V3V4V5V6V7V8V9V10H12V11H11H10H9H8H7H6H5H4H3H2H1V10H0V9V8V7V6V5V4V3V2V1H1V0ZM7 8V7H8V6H9V5H10V4H11V3H12V2H11V3H10V4H9V5H8V6H7V7H6V6H5V5H4V4H3V3H2V2H1V3H2V4H3V5H4V6H5V7H6V8H7Z"
				fill="currentColor"
			/>
		</svg>
	)
}

function LoaderIcon() {
	return (
		<svg
			width="13"
			height="13"
			viewBox="0 0 13 13"
			fill="none"
			className="h-auto w-full"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M6 0H7V1V2V3V4H6V3V2V1V0Z"
				fill="currentColor"
			>
				<animate
					attributeName="opacity"
					dur="1s"
					values=".2;1"
					repeatCount="indefinite"
					begin="0s"
					fill="freeze"
				></animate>
			</path>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M11 1H12V2H11V1ZM10 3V2H11V3H10ZM9 4H10V3H9V4ZM9 4V5H8V4H9Z"
				fill="currentColor"
			>
				<animate
					attributeName="opacity"
					dur="1s"
					values=".2;1"
					repeatCount="indefinite"
					begin="0.125s"
					fill="freeze"
				></animate>
			</path>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M9 6H10H11H12H13V7H12H11H10H9V6Z"
				fill="currentColor"
			>
				<animate
					attributeName="opacity"
					dur="1s"
					values=".2;1"
					repeatCount="indefinite"
					begin="0.25s"
					fill="freeze"
				></animate>
			</path>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M8 8H9V9H8V8ZM10 10H9V9H10V10ZM11 11V10H10V11H11ZM11 11V12H12V11H11Z"
				fill="currentColor"
			>
				<animate
					attributeName="opacity"
					dur="1s"
					values=".2;1"
					repeatCount="indefinite"
					begin="0.375s"
					fill="freeze"
				></animate>
			</path>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M6 9H7V10V11V12V13H6V12V11V10V9Z"
				fill="currentColor"
			>
				<animate
					attributeName="opacity"
					dur="1s"
					values=".2;1"
					repeatCount="indefinite"
					begin="0.5s"
					fill="freeze"
				></animate>
			</path>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M4 8H5V9H4V8ZM3 10V9H4V10H3ZM2 11H3V10H2V11ZM2 11V12H1V11H2Z"
				fill="currentColor"
			>
				<animate
					attributeName="opacity"
					dur="1s"
					values=".2;1"
					repeatCount="indefinite"
					begin="0.625s"
					fill="freeze"
				></animate>
			</path>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0 6H1H2H3H4V7H3H2H1H0V6Z"
				fill="currentColor"
			>
				<animate
					attributeName="opacity"
					dur="1s"
					values=".2;1"
					repeatCount="indefinite"
					begin="0.75s"
					fill="freeze"
				></animate>
			</path>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M1 1H2V2H1V1ZM3 3H2V2H3V3ZM4 4V3H3V4H4ZM4 4V5H5V4H4Z"
				fill="currentColor"
			>
				<animate
					attributeName="opacity"
					dur="1s"
					values=".2;1"
					repeatCount="indefinite"
					begin="0.875s"
					fill="freeze"
				></animate>
			</path>
		</svg>
	)
}

function CheckIcon() {
	return (
		<svg className="h-auto w-full" width="13" height="10" viewBox="0 0 13 10">
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="0.5;0"
					begin="0s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="4.5;4"
					begin="0s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="0.5;0"
					begin="0s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="5.5;5"
					begin="0s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="1.5;1"
					begin="0.01s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="4.5;4"
					begin="0.01s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.01s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.01s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="1.5;1"
					begin="0.01s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="5.5;5"
					begin="0.01s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.01s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.01s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="1.5;1"
					begin="0.01s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="6.5;6"
					begin="0.01s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.01s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.01s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="2.5;2"
					begin="0.02s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="5.5;5"
					begin="0.02s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.02s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.02s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="2.5;2"
					begin="0.02s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="6.5;6"
					begin="0.02s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.02s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.02s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="2.5;2"
					begin="0.02s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="7.5;7"
					begin="0.02s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.02s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.02s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="3.5;3"
					begin="0.03s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="6.5;6"
					begin="0.03s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.03s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.03s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="3.5;3"
					begin="0.03s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="7.5;7"
					begin="0.03s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.03s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.03s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="3.5;3"
					begin="0.03s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="8.5;8"
					begin="0.03s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.03s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.03s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="4.5;4"
					begin="0.04s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="7.5;7"
					begin="0.04s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.04s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.04s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="4.5;4"
					begin="0.04s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="8.5;8"
					begin="0.04s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.04s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.04s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="4.5;4"
					begin="0.04s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="9.5;9"
					begin="0.04s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.04s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.04s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="5.5;5"
					begin="0.05s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="6.5;6"
					begin="0.05s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.05s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.05s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="5.5;5"
					begin="0.05s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="7.5;7"
					begin="0.05s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.05s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.05s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="5.5;5"
					begin="0.05s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="8.5;8"
					begin="0.05s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.05s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.05s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="6.5;6"
					begin="0.06s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="5.5;5"
					begin="0.06s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.06s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.06s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="6.5;6"
					begin="0.06s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="6.5;6"
					begin="0.06s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.06s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.06s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="6.5;6"
					begin="0.06s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="7.5;7"
					begin="0.06s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.06s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.06s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="7.5;7"
					begin="0.07s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="4.5;4"
					begin="0.07s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.07s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.07s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="7.5;7"
					begin="0.07s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="5.5;5"
					begin="0.07s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.07s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.07s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="7.5;7"
					begin="0.07s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="6.5;6"
					begin="0.07s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.07s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.07s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="8.5;8"
					begin="0.08s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="3.5;3"
					begin="0.08s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.08s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.08s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="8.5;8"
					begin="0.08s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="4.5;4"
					begin="0.08s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.08s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.08s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="8.5;8"
					begin="0.08s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="5.5;5"
					begin="0.08s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.08s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.08s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="9.5;9"
					begin="0.09s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="2.5;2"
					begin="0.09s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.09s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.09s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="9.5;9"
					begin="0.09s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="3.5;3"
					begin="0.09s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.09s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.09s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="9.5;9"
					begin="0.09s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="4.5;4"
					begin="0.09s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.09s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.09s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="10.5;10"
					begin="0.1s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="1.5;1"
					begin="0.1s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.1s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.1s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="10.5;10"
					begin="0.1s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="2.5;2"
					begin="0.1s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.1s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.1s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="10.5;10"
					begin="0.1s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="3.5;3"
					begin="0.1s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin="0.1s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin="0.1s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="11.5;11"
					begin=".11s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="0.5;0"
					begin=".11s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin=".11s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin=".11s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="11.5;11"
					begin=".11s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="1.5;1"
					begin=".11s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin=".11s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin=".11s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="11.5;11"
					begin=".11s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="2.5;2"
					begin=".11s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin=".11s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin=".11s"
					fill="freeze"
				></animate>
			</rect>
			<rect fill="currentColor">
				<animate
					attributeName="x"
					dur="0.1s"
					values="12.5;12"
					begin=".12s"
					fill="freeze"
				></animate>
				<animate
					attributeName="y"
					dur="0.1s"
					values="1.5;1"
					begin=".12s"
					fill="freeze"
				></animate>
				<animate
					attributeName="width"
					dur="0.1s"
					values="0;1"
					begin=".12s"
					fill="freeze"
				></animate>
				<animate
					attributeName="height"
					dur="0.1s"
					values="0;1"
					begin=".12s"
					fill="freeze"
				></animate>
			</rect>
		</svg>
	)
}
