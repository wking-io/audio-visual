import { type FileUpload, parseFormData } from '@mjackson/form-data-parser'
import { json, redirect, type ActionFunctionArgs } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { useRef, useState } from 'react'
import Form from '#app/components/kits/Form.js'
import { R2FileStorage } from '#app/utils/file-storage.js'

function uploadHandler(store: R2FileStorage) {
	return async (fileUpload: FileUpload) => {
		// Is this file upload from the <input type="file" name="user-avatar"> field?
		if (fileUpload.fieldName === 'recording') {
			let storageKey = `recording`

			// FileUpload objects are not meant to stick around for very long (they are
			// streaming data from the request.body!) so we should store them as soon as
			// possible.
			await store.set(storageKey, fileUpload)

			// Return a File for the FormData object. This is a LazyFile that knows how
			// to access the file's content if needed (using e.g. file.stream()) but
			// waits until it is requested to actually read anything.
			return store.get(storageKey)
		}

		// Ignore any files we don't recognize the name of...
	}
}

export async function action({ request, context }: ActionFunctionArgs) {
	const store = new R2FileStorage(context.cloudflare.env.BUCKET)
	let formData = await parseFormData(request, uploadHandler(store))

	let file = formData.get('recording')

	if (!file || !(file instanceof File)) return json({ success: false })
	return redirect(`/recordings/recording`)
}

export default function Screen() {
	const [recording, setRecording] = useState(false)
	const [audioURL, setAudioURL] = useState('')
	const mediaRecorderRef = useRef<MediaRecorder | null>(null)
	const audioContextRef = useRef<AudioContext | null>(null)
	const analyserRef = useRef<AnalyserNode | null>(null)
	const audioChunksRef = useRef<Blob[]>([])
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const playerRef = useRef<HTMLAudioElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const dataArrayRef = useRef<Uint8Array | null>(null)

	const handleStartRecording = async () => {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
		mediaRecorderRef.current = new MediaRecorder(stream)

		// Set up audio context and analyser for visualization
		audioContextRef.current = new (window.AudioContext ||
			window.webkitAudioContext)()
		const analyser = audioContextRef.current.createAnalyser()
		analyser.fftSize = 2048
		analyserRef.current = analyser

		// Connect the media stream source to the analyser
		const source = audioContextRef.current.createMediaStreamSource(stream)
		source.connect(analyser)

		// Prepare data array for visualization
		const bufferLength = analyser.frequencyBinCount
		dataArrayRef.current = new Uint8Array(bufferLength)

		mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
			audioChunksRef.current.push(event.data)
		}

		mediaRecorderRef.current.onstop = () => {
			const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
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
		draw()
		setRecording(true)
	}

	const initializeAudioPlayer = () => {
		// Create an AudioContext
		audioContextRef.current = new (window.AudioContext ||
			(window as any).webkitAudioContext)()
		const audioContext = audioContextRef.current

		if (!audioContext || !playerRef.current) return

		// Create an AnalyserNode
		const analyser = audioContext.createAnalyser()
		analyser.fftSize = 2048 // Set the FFT size for the analyser node
		analyserRef.current = analyser

		// Create a MediaElementSource from the audio element
		const source = audioContext.createMediaElementSource(playerRef.current)
		source.connect(analyser)
		analyser.connect(audioContext.destination)

		// Prepare data array for visualization
		const bufferLength = analyser.frequencyBinCount
		dataArrayRef.current = new Uint8Array(bufferLength)

		// Start drawing
		draw()
		audioContextRef.current.resume().catch(console.error)
	}

	const draw = () => {
		const canvas = canvasRef.current
		const analyser = analyserRef.current
		const dataArray = dataArrayRef.current
		if (!canvas || !analyser || !dataArray) return

		const canvasContext = canvas.getContext('2d')

		if (!canvasContext) return

		const drawLoop = () => {
			requestAnimationFrame(drawLoop)

			analyser.getByteTimeDomainData(dataArray) // Get waveform data

			// Clear the canvas
			canvasContext.clearRect(0, 0, canvas.width, canvas.height)

			// Draw the waveform
			canvasContext.lineWidth = 2
			canvasContext.strokeStyle = '#ff75dd'
			canvasContext.beginPath()

			const sliceWidth = (canvas.width * 1.0) / dataArray.length
			let x = 0

			for (let i = 0; i < dataArray.length; i++) {
				const v = dataArray[i] / 128.0
				const y = (v * canvas.height) / 2

				if (i === 0) {
					canvasContext.moveTo(x, y)
				} else {
					canvasContext.lineTo(x, y)
				}

				x += sliceWidth
			}

			canvasContext.lineTo(canvas.width, canvas.height / 2)
			canvasContext.stroke()
		}

		drawLoop()
	}

	const handleStopRecording = async () => {
		mediaRecorderRef.current?.stop()
		mediaRecorderRef.current = null

		await audioContextRef.current?.close()
		audioContextRef.current = null

		setRecording(false)
	}

	// Handle file input change
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			const fileURL = URL.createObjectURL(file)
			setAudioURL(fileURL)
		}
	}

	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-4">
			<canvas ref={canvasRef} width={600} height={200} />
			<div>
				<button
					onClick={recording ? handleStopRecording : handleStartRecording}
				>
					{recording ? 'Stop Recording' : 'Start Recording'}
				</button>
				{audioURL && (
					<div>
						<audio
							ref={playerRef}
							onPlay={() => {
								if (audioContextRef.current) {
									audioContextRef.current.resume().catch(console.error)
								} else {
									initializeAudioPlayer()
								}
							}}
							controls
							src={audioURL}
						></audio>
					</div>
				)}
			</div>
			<Form encType="multipart/form-data">
				<input
					ref={fileInputRef}
					type="file"
					name="recording"
					accept="audio/*"
					onChange={handleFileChange}
				/>
				<button type="submit">Save Audio</button>
			</Form>
		</div>
	)
}
