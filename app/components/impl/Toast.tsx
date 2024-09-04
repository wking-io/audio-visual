import { Dialog, Transition } from '@headlessui/react'
import { useLocation } from '@remix-run/react'
import {
	type PropsWithChildren,
	type ReactNode,
	createContext,
	Fragment,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useReducer,
	useRef,
	useState,
} from 'react'
import { createPortal } from 'react-dom'

/* STATE MANAGEMENT */

type State =
	| {
			state: 'closing'
			canClose: boolean
			children: ReactNode
	  }
	| {
			state: 'closed'
			canClose: boolean
	  }
	| {
			state: 'opening'
			canClose: boolean
			children: ReactNode
	  }
	| {
			state: 'open'
			canClose: boolean
			children: ReactNode
	  }

type Action =
	| {
			type: 'OPEN_START'
			payload: {
				children: ReactNode
			}
	  }
	| { type: 'OPEN_END' }
	| { type: 'CLOSE_START' }
	| { type: 'CLOSE_END' }

function reducer(stateObj: State, action: Action): State {
	switch (stateObj.state) {
		case 'closing':
			switch (action.type) {
				case 'CLOSE_END':
					return { ...stateObj, state: 'closed' }

				case 'OPEN_START':
					return {
						...stateObj,
						state: 'opening',
						children: action.payload.children,
					}
			}

		case 'closed':
			switch (action.type) {
				case 'OPEN_START':
					return {
						...stateObj,
						state: 'opening',
						children: action.payload.children,
					}

				default:
					return stateObj
			}

		case 'opening':
			switch (action.type) {
				case 'OPEN_END':
					return { ...stateObj, state: 'open' }

				case 'CLOSE_START':
					if (stateObj.canClose) return { ...stateObj, state: 'closing' }
			}

		case 'open':
			if (action.type === 'CLOSE_START' && stateObj.canClose)
				return { ...stateObj, state: 'closing' }

		default:
			return stateObj
	}
}

const initialState: State = {
	state: 'closed',
	canClose: true,
}

const castActionCreators =
	makeInferLiteral<Record<string, (...params: any[]) => Action>>()

export const toastActionCreators = castActionCreators({
	open: (children: ReactNode) => ({
		type: 'OPEN_START',
		payload: { children },
	}),
	close: () => ({ type: 'CLOSE_START' }),
})

/* CONTEXT */

const ToastContext = createContext<null | [State, React.Dispatch<Action>]>(null)

const useToastContext = () => useContext(ToastContext)

function useToastContextOrThrow() {
	const context = useToastContext()
	if (context) return context
	throw new Error(`ToastContext not found`)
}

const useToastState = () => useToastContextOrThrow()[0]
export const useToastDispatch = () => useToastContextOrThrow()[1]

const visibleStates: State['state'][] = ['opening', 'open', 'closing']

export const useDerivedToastState = () => {
	const toastState = useToastState()
	return useMemo(
		() =>
			({
				isClosed: toastState.state === 'closed',
				isOpen: toastState.state === 'open',
				isVisible: visibleStates.includes(toastState.state),
			}) as const,
		[toastState],
	)
}

export const useShowToast = () => {
	const dispatch = useToastDispatch()
	return useCallback(
		(children: ReactNode) => dispatch(toastActionCreators.open(children)),
		[dispatch],
	)
}

/**
 * Simplifies closing the toast and running effects after the closing transition
 *
 * @example
 * const closeToast = useCloseToast()
 * // ...
 * closeToast().then(() => someInput.focus())
 */
export function useCloseToast() {
	const [stateObj, setStateObj] = useState<
		| {
				state: 'idle'
		  }
		| {
				state: 'closing'
				promise: Promise<void>
				resolvePromise: VoidFunction
		  }
	>({ state: 'idle' })

	const { isClosed } = useDerivedToastState()
	const toastDispatch = useToastDispatch()

	useEffect(() => {
		if (stateObj.state === 'closing' && isClosed) {
			stateObj.resolvePromise()
			setStateObj({ state: 'idle' })
		}
	}, [isClosed, stateObj])

	const close = useCallback((): Promise<void> => {
		switch (stateObj.state) {
			case 'closing':
				return stateObj.promise

			case 'idle': {
				const promise = new Promise<void>((resolve) => {
					// setTimeout allows the `promise` const to initialize before we try to access it.
					setTimeout(() => {
						setStateObj({
							state: 'closing',
							promise,
							resolvePromise: resolve,
						})

						toastDispatch(toastActionCreators.close())
					})
				})
				return promise
			}
		}
	}, [toastDispatch, stateObj])

	return close
}

/**
 * Initializes toast context
 */
export function ToastProvider({ children }: PropsWithChildren<{}>) {
	return (
		<ToastContext.Provider value={useReducer(reducer, initialState)}>
			{children}
			<ToastPortal />
		</ToastContext.Provider>
	)
}

/* PORTAL */

function ToastContents() {
	const stateObj = useToastState()
	switch (stateObj.state) {
		case 'closed':
			return null
		case 'closing':
		case 'open':
		case 'opening':
			return <>{stateObj.children}</>
	}
}

function makeToastContainerEl(): HTMLDivElement | null {
	// Return null if running in Node.js.
	const isClient = 'document' in globalThis
	if (!isClient) return null
	// Create the div.
	const div = document.createElement('div')
	document.body.appendChild(div)
	return div
}

function ToastPortal() {
	const containerRef = useRef<HTMLDivElement | null>(null)
	useEffect(() => {
		// Create the div element when this component is mounted, and remove it when unmounted.
		containerRef.current = makeToastContainerEl()
		return () => {
			containerRef.current?.remove()
			containerRef.current = null
		}
	}, [])

	const containerEl = containerRef.current
	return containerEl && createPortal(<ToastContents />, containerEl)
}

/* UI */

interface ToastProps {
	children: (close: () => void) => JSX.Element
}

/**
 * @example
 * const EditPaymentToastButton: PaymentButtonComponent = ({
 *   onSubmitSuccess,
 *   stripeKey,
 *   teamId,
 * }) => {
 *   const [toastState, toastDispatch] = useToastReducer()
 *
 *   return (
 *     <ToastContext.Provider value={[toastState, toastDispatch]}>
 *       <EditButton onClick={_e => toastDispatch(toastActionCreators.open())}>
 *         Update Payment Info
 *       </EditButton>
 *       <ToastPortal
 *         render={() => (
 *           <StripeElementsProvider stripeKey={stripeKey}>
 *             <EditPaymentToast teamId={teamId} onSubmitSuccess={onSubmitSuccess} />
 *           </StripeElementsProvider>
 *         )}
 *       />
 *     </ToastContext.Provider>
 *   )
 * }
 */
export default function Toast({ children }: ToastProps) {
	const [stateObj, dispatch] = useToastContextOrThrow()
	const { pathname } = useLocation()
	const [originalPath] = useState<string>(pathname)

	const isOpen = stateObj.state === 'open' || stateObj.state === 'opening'
	const close = useCallback(
		() => dispatch(toastActionCreators.close()),
		[dispatch],
	)

	useEffect(() => {
		if (stateObj.state === 'open' && pathname !== originalPath) {
			close()
		}
	}, [pathname, stateObj, originalPath, close])

	return (
		<Transition.Root
			show={isOpen}
			as={Fragment}
			appear={true}
			afterEnter={() => dispatch({ type: 'OPEN_END' })}
			afterLeave={() => dispatch({ type: 'CLOSE_END' })}
		>
			<Dialog
				as="div"
				auto-reopen="true"
				className="relative z-10"
				onClose={close}
			>
				<div className="fixed right-0 bottom-0 z-20">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						{children(close)}
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

/**
 * Utility for creating/casting a literal type that is compatible with the given interface (`T`)
 */
function makeInferLiteral<T = never>() {
	return function inferLiteral<TT extends T>(val: TT) {
		return val
	}
}
