import { useEffect, useState } from 'react'

export const useInputEvent = () => {
	const [key, setKey] = useState<string>('')
	useEffect(() => {
		const keyDownHandler = ({ code }: KeyboardEvent) => setKey(code)
		const keyUpHandler = () => setKey('')
		window.addEventListener('keydown', keyDownHandler)
		window.addEventListener('keyup', keyUpHandler)
		return () => {
			window.removeEventListener('keydown', keyDownHandler)
			window.removeEventListener('keyup', keyUpHandler)
		}
	}, [])
	return key
}
