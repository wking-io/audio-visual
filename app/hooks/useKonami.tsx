import { useEffect, useState } from 'react'
import { useInputEvent } from './useInputEvent'

const konamiCode = [
	'ArrowUp',
	'ArrowUp',
	'ArrowDown',
	'ArrowDown',
	'ArrowLeft',
	'ArrowRight',
	'ArrowLeft',
	'ArrowRight',
	'KeyB',
	'KeyA',
]

export const useKonamiCode = () => {
	const [code, setCode] = useState<string[]>([])
	const [success, setSuccess] = useState(false)
	const key = useInputEvent()

	useEffect(() => {
		if (key === '') return
		if (key !== konamiCode[code.length]) {
			setCode([])
			return
		}

		const newCode = [...code, key]
		setCode(newCode)
		if (newCode.length === konamiCode.length) {
			setSuccess((state) => !state)
			setCode([])
		}
		// We only want to run the effect on key change.
	}, [key])

	return success
}
