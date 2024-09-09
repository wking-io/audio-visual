import { useRef } from 'react'

export function useAudioAnalyser({
	onSetup,
	onTearDown,
}: {
	onSetup?: (analyser: AnalyserNode) => void
	onTearDown?: () => void
} = {}) {
	const audioContextRef = useRef<AudioContext | null>(null)

	async function handleSetup(rawSource: MediaStream | HTMLAudioElement) {
		if (!audioContextRef.current) {
			// Set up audio context and analyser for visualization
			audioContextRef.current = new (window.AudioContext ||
				window.webkitAudioContext)()

			const audioContext = audioContextRef.current

			// Create an AnalyserNode
			const analyser = audioContext.createAnalyser()
			analyser.fftSize = 2048 // Set the FFT size for the analyser node

			// Create a MediaElementSource from the audio element
			const source =
				rawSource instanceof HTMLAudioElement
					? audioContext.createMediaElementSource(rawSource)
					: audioContext.createMediaStreamSource(rawSource)
			source.connect(analyser)
			analyser.connect(audioContext.destination)

			onSetup?.(analyser)
		}

		await audioContextRef.current.resume()
	}

	async function handleSuspend() {
		await audioContextRef.current?.suspend()
	}

	async function handleTearDown() {
		await audioContextRef.current?.close()
		audioContextRef.current = null

		onTearDown?.()
	}

	return { handleSetup, handleSuspend, handleTearDown }
}
