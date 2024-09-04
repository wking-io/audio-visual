import { Dialog, Transition, TransitionChild } from '@headlessui/react'
import { useLocation } from '@remix-run/react'
import {
	type PropsWithChildren,
	type ReactNode,
	Fragment,
	createContext,
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
	| { type: 'PREVENT_CLOSE' }
	| { type: 'ALLOW_CLOSE' }

function reducer(stateObj: State, action: Action): State {
	// These actions have the same behavior in every state.
	switch (action.type) {
		case 'ALLOW_CLOSE':
			return { ...stateObj, canClose: true }

		case 'PREVENT_CLOSE':
			return { ...stateObj, canClose: false }

		default:
			break
	}

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

export const modalActionCreators = castActionCreators({
	open: (children: ReactNode) => ({
		type: 'OPEN_START',
		payload: { children },
	}),
	close: () => ({ type: 'CLOSE_START' }),
	allowClose: () => ({ type: 'ALLOW_CLOSE' }),
	preventClose: () => ({ type: 'PREVENT_CLOSE' }),
})

/* CONTEXT */

const ModalContext = createContext<null | [State, React.Dispatch<Action>]>(null)

const useModalContext = () => useContext(ModalContext)

function useModalContextOrThrow() {
	const context = useModalContext()
	if (context) return context
	throw new Error(`ModalContext not found`)
}

const useModalState = () => useModalContextOrThrow()[0]
export const useModalDispatch = () => useModalContextOrThrow()[1]

const visibleStates: State['state'][] = ['opening', 'open', 'closing']

export const useDerivedModalState = () => {
	const modalState = useModalState()
	return useMemo(
		() =>
			({
				isClosed: modalState.state === 'closed',
				isOpen: modalState.state === 'open',
				isVisible: visibleStates.includes(modalState.state),
			}) as const,
		[modalState],
	)
}

export const useShowModal = () => {
	const dispatch = useModalDispatch()
	return useCallback(
		(children: ReactNode) => dispatch(modalActionCreators.open(children)),
		[dispatch],
	)
}

/**
 * Simplifies closing the modal and running effects after the closing transition
 *
 * @example
 * const closeModal = useCloseModal()
 * // ...
 * closeModal().then(() => someInput.focus())
 */
export function useCloseModal() {
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

	const { isClosed } = useDerivedModalState()
	const modalDispatch = useModalDispatch()

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

						modalDispatch(modalActionCreators.close())
					})
				})
				return promise
			}
		}
	}, [modalDispatch, stateObj])

	return close
}

/**
 * Initializes modal context
 */
export function ModalProvider({ children }: PropsWithChildren<{}>) {
	return (
		<ModalContext.Provider value={useReducer(reducer, initialState)}>
			{children}
			<ModalPortal />
		</ModalContext.Provider>
	)
}

/* PORTAL */

function ModalContents() {
	const stateObj = useModalState()
	switch (stateObj.state) {
		case 'closed':
			return null
		case 'closing':
		case 'open':
		case 'opening':
			return <>{stateObj.children}</>
	}
}

function makeModalContainerEl(): HTMLDivElement | null {
	// Return null if running in Node.js.
	const isClient = 'document' in globalThis
	if (!isClient) return null
	// Create the div.
	const div = document.createElement('div')
	document.body.appendChild(div)
	return div
}

function ModalPortal() {
	const containerRef = useRef<HTMLDivElement | null>(null)
	useEffect(() => {
		// Create the div element when this component is mounted, and remove it when unmounted.
		containerRef.current = makeModalContainerEl()
		return () => {
			containerRef.current?.remove()
			containerRef.current = null
		}
	}, [])

	const containerEl = containerRef.current
	return containerEl && createPortal(<ModalContents />, containerEl)
}

/* UI */

interface ModalProps {
	children: (close: () => void) => JSX.Element
}

/**
 * @example
 * const EditPaymentModalButton: PaymentButtonComponent = ({
 *   onSubmitSuccess,
 *   stripeKey,
 *   teamId,
 * }) => {
 *   const [modalState, modalDispatch] = useModalReducer()
 *
 *   return (
 *     <ModalContext.Provider value={[modalState, modalDispatch]}>
 *       <EditButton onClick={_e => modalDispatch(modalActionCreators.open())}>
 *         Update Payment Info
 *       </EditButton>
 *       <ModalPortal
 *         render={() => (
 *           <StripeElementsProvider stripeKey={stripeKey}>
 *             <EditPaymentModal teamId={teamId} onSubmitSuccess={onSubmitSuccess} />
 *           </StripeElementsProvider>
 *         )}
 *       />
 *     </ModalContext.Provider>
 *   )
 * }
 */
export default function Modal({ children }: ModalProps) {
	const [stateObj, dispatch] = useModalContextOrThrow()
	const { pathname } = useLocation()
	const [originalPath] = useState<string>(pathname)

	const isOpen = stateObj.state === 'open' || stateObj.state === 'opening'
	const close = useCallback(
		() => dispatch(modalActionCreators.close()),
		[dispatch],
	)

	useEffect(() => {
		if (stateObj.state === 'open' && pathname !== originalPath) {
			close()
		}
	}, [pathname, stateObj, originalPath, close])

	return (
		<Transition
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
				<TransitionChild
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div
						className="bg-gray-1100/75 fixed inset-0 backdrop-blur transition-opacity"
						aria-hidden="true"
					/>
				</TransitionChild>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<TransitionChild
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							{children(close)}
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
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
