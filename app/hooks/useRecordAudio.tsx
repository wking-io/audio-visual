import { useRef, useState } from 'react'

export function useRecordAudio({
	onStop,
	onStart,
}: {
	onStop?: () => void
	onStart?: (stream: MediaStream) => void
} = {}) {
	const mediaRecorderRef = useRef<MediaRecorder | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [audioURL, setAudioURL] = useState<string | null>(null)
	const [isRecording, setIsRecording] = useState(false)

	async function handleStart() {
		setIsRecording(true)
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
		const audioChunks: Blob[] = []
		mediaRecorderRef.current = new MediaRecorder(stream)

		mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
			audioChunks.push(event.data)
		}

		onStart?.(stream)

		mediaRecorderRef.current.onstop = () => {
			const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
			setAudioURL(URL.createObjectURL(audioBlob))

			// Create a File object from the recorded Blob
			const file = new File([audioBlob], 'recorded-audio.webm', {
				type: 'audio/webm',
			})

			if (fileInputRef.current) {
				const dataTransfer = new DataTransfer()
				dataTransfer.items.add(file)
				fileInputRef.current.files = dataTransfer.files // Set the file input to the recorded file
			}
		}

		mediaRecorderRef.current.start()
	}

	function handleStop() {
		onStop?.()
		mediaRecorderRef.current?.stop()
		mediaRecorderRef.current = null

		setIsRecording(false)
	}

	function handleReset() {
		mediaRecorderRef.current?.stop()
		mediaRecorderRef.current = null
		setIsRecording(false)
		setAudioURL(null)
		if (fileInputRef?.current) {
			fileInputRef.current.value = ''
		}
	}

	// Handle file input change
	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		handleStop()
		const file = event.target.files?.[0]
		if (file) {
			const fileURL = URL.createObjectURL(file)
			setAudioURL(fileURL)
		}
	}

	return {
		isRecording,
		audioURL,
		fileInputRef,
		handleStart,
		handleStop,
		handleReset,
		handleFileChange,
	}
}
