import { type FileUpload, parseFormData } from '@mjackson/form-data-parser'
import { json, redirect, type ActionFunctionArgs } from '@remix-run/cloudflare'
import { drizzle } from 'drizzle-orm/d1'
import {
	EventHandler,
	ReactEventHandler,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import { createNoise3D } from 'simplex-noise'
import Form from '#app/components/kits/Form.js'
import { recordings } from '#app/db/schema.server.js'
import { R2FileStorage } from '#app/utils/file-storage.js'
import { makeRecordingKey } from '#app/utils/make-recording-key.js'
import { useRecordAudio } from '#app/hooks/useRecordAudio.js'
import { useAudioAnalyser } from '#app/hooks/useAudioAnalyser.js'

function uploadHandler(store: R2FileStorage, key: string) {
	return async (fileUpload: FileUpload) => {
		// Is this file upload from the <input type="file" name="user-avatar"> field?
		if (fileUpload.fieldName === 'recording') {
			// FileUpload objects are not meant to stick around for very long (they are
			// streaming data from the request.body!) so we should store them as soon as
			// possible.
			await store.set(key, fileUpload)

			// Return a File for the FormData object. This is a LazyFile that knows how
			// to access the file's content if needed (using e.g. file.stream()) but
			// waits until it is requested to actually read anything.
			return store.get(key)
		}

		// Ignore any files we don't recognize the name of...
	}
}

const CREATE_RECORDING = 'createRecording'
const ASSOCIATE_RECORDING = 'associateRecording'

export async function action({ request, context }: ActionFunctionArgs) {
	const store = new R2FileStorage(context.cloudflare.env.BUCKET)
	const db = drizzle(context.cloudflare.env.DB)

	const [recording] = await db
		.insert(recordings)
		.values({})
		.returning({ id: recordings.id, audioKey: recordings.audioKey })

	if (!recording) return json({ success: false })

	let formData = await parseFormData(
		request,
		uploadHandler(store, makeRecordingKey(recording)),
	)

	let file = formData.get('recording')

	if (!file || !(file instanceof File)) return json({ success: false })
	return redirect(`/recordings/${recording.id}`)
}

export default function Screen() {
	const orbStateRef = useRef<{
		analyser: AnalyserNode | null
		dataArray: Uint8Array | null
		isActive: boolean
	}>({ analyser: null, dataArray: null, isActive: false })

	const { handleSetup, handleSuspend, handleTearDown } = useAudioAnalyser({
		onSetup(analyser) {
			// Set analyser instance
			orbStateRef.current.analyser = analyser
			// Prepare data array for visualization
			const bufferLength = analyser.frequencyBinCount
			orbStateRef.current.dataArray = new Uint8Array(bufferLength)
		},
		onTearDown() {
			orbStateRef.current.analyser = null
			orbStateRef.current.dataArray = null
		},
	})

	const {
		isRecording,
		fileInputRef,
		audioURL,
		handleStop,
		handleStart,
		handleFileChange,
		handleReset,
	} = useRecordAudio({
		onStart(stream) {
			orbStateRef.current.isActive = true
			handleSetup(stream).catch(console.error)
		},
		onStop() {
			orbStateRef.current.isActive = false
			handleTearDown().catch(console.error)
		},
	})

	const canvasRef = useRef<HTMLCanvasElement>(null)
	const playerRef = useRef<HTMLAudioElement>(null)

	const handlePlay: ReactEventHandler<HTMLAudioElement> = useCallback(
		(e) => {
			orbStateRef.current.isActive = true
			handleSetup(e.currentTarget).catch(console.error)
		},
		[handleSetup],
	)

	const handlePause = useCallback(() => {
		orbStateRef.current.isActive = false
		handleSuspend().catch(console.error)
	}, [handleSetup])

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		orb({ canvas, ctx, getState: () => orbStateRef.current })
	}, [])

	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-4">
			<canvas ref={canvasRef} width={400} height={400} />
			<div className="w-full max-w-sm">
				{audioURL ? (
					<div>
						<audio
							ref={playerRef}
							onPlay={handlePlay}
							onPause={handlePause}
							controls
							src={audioURL}
							className="w-full"
						></audio>
					</div>
				) : (
					<button
						onClick={isRecording ? handleStop : handleStart}
						className="bg-foreground hover:bg-foreground/90 group text-background flex w-full items-center justify-center gap-2 rounded-full py-2 px-4 font-medium"
					>
						{isRecording ? (
							<>
								<span className="bg-background ring-background block h-3 w-3" />
								Stop Recording
							</>
						) : (
							<>
								<span className="bg-red ring-red group-hover:ring-offset-foreground/80 ring-offset-foreground block h-2 w-2 rounded-full ring-1 ring-offset-2" />
								Start Recording
							</>
						)}
					</button>
				)}
			</div>
			<Form
				encType="multipart/form-data"
				className="flex w-full max-w-sm flex-col gap-4"
			>
				<input
					ref={fileInputRef}
					type="file"
					name="recording"
					accept="audio/*"
					onChange={handleFileChange}
					className={audioURL ? 'sr-only' : ''}
				/>
				{audioURL ? (
					<>
						<button
							type="submit"
							className="bg-foreground hover:bg-foreground/90 group text-background flex w-full items-center justify-center gap-2 rounded-full border border-transparent py-2 px-4 font-medium"
						>
							Save and Make Magic
						</button>
						<button
							onClick={() => {
								if (playerRef.current) {
									playerRef.current.pause()
									handlePause()
								}
								handleReset()
							}}
							type="button"
							className="hover:bg-foreground/10 border-foreground group flex w-full items-center justify-center gap-2 rounded-full border bg-transparent py-2 px-4 font-medium"
						>
							Clear Audio
						</button>
					</>
				) : null}
			</Form>
		</div>
	)
}

type Point3D = {
	x: number
	y: number
	z: number
}

type Projection3D = {
	x: number
	y: number
	size: number
}

type Dot = {
	location: Point3D
	projection: Projection3D
	theta: number
	phi: number
}

function createDot(point: Point3D, theta: number, phi: number): Dot {
	return {
		location: point,
		projection: {
			x: 0,
			y: 0,
			size: 0,
		},
		theta,
		phi,
	}
}

function orb({
	canvas,
	ctx,
	getState,
}: {
	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D
	getState: () => {
		analyser: AnalyserNode | null
		dataArray: Uint8Array | null
		isActive: boolean
	}
}) {
	let { width, height } = canvas
	let rotation = 0 // Rotation of the globe
	let dots: Dot[] = [] // Every dots in an array
	const noise3D = createNoise3D(Math.random)

	/* ====================== */
	/* ====== CONSTANTS ===== */
	/* ====================== */
	/* Some of those constants may change if the user resizes their screen but I still strongly believe they belong to the Constants part of the variables */
	const DOTS_AMOUNT = 1000 // Amount of dots on the screen
	const MIN_DOT_RADIUS = 1
	const MAX_DOT_RADIUS = 2 // Radius of the dots
	const MIN_GLOBE_RADIUS = width * 0.1 // Minimum radius of the globe
	const MAX_GLOBE_RADIUS = width * 0.5 // Maximum radius of the globe
	let currentRadius = MIN_GLOBE_RADIUS // Current radius to be interpolated
	const GLOBE_CENTER_Z = -MAX_GLOBE_RADIUS // Z value of the globe center
	let PROJECTION_CENTER_X = width / 2 // X center of the canvas HTML
	let PROJECTION_CENTER_Y = height / 2 // Y center of the canvas HTML
	let FIELD_OF_VIEW = width * 0.8

	function project(
		{ location, projection }: Dot,
		{ sin, cos }: { sin: number; cos: number },
	): Projection3D {
		const rotX = cos * location.x + sin * (location.z - GLOBE_CENTER_Z)
		const rotZ =
			-sin * location.x + cos * (location.z - GLOBE_CENTER_Z) + GLOBE_CENTER_Z
		projection.size = FIELD_OF_VIEW / (FIELD_OF_VIEW - rotZ)
		projection.x = rotX * projection.size + PROJECTION_CENTER_X
		projection.y = location.y * projection.size + PROJECTION_CENTER_Y

		return projection
	}

	// Draw the dot on the canvas
	function draw(
		dot: Dot,
		options: { sin: number; cos: number; radius: number },
	): void {
		const { x, y, size } = project(dot, options)

		ctx.beginPath()
		ctx.arc(x, y, options.radius * size, 0, Math.PI * 2)
		ctx.closePath()
		ctx.fillStyle = `rgba(255, 255, 255, ${size})`
		ctx.fill()
	}

	function createDots() {
		// Empty the array of dots
		dots.length = 0

		// Create a new dot based on the amount needed
		for (let i = 0; i < DOTS_AMOUNT; i++) {
			const theta = Math.random() * 2 * Math.PI // Random value between [0, 2PI]
			const phi = Math.acos(Math.random() * 2 - 1) // Random value between [-1, 1]

			// Calculate the [x, y, z] coordinates of the dot along the globe

			const x = currentRadius * Math.sin(phi) * Math.cos(theta)
			const y = currentRadius * Math.sin(phi) * Math.sin(theta)
			const z = currentRadius * Math.cos(phi) + GLOBE_CENTER_Z

			dots.push(createDot({ x, y, z }, theta, phi))
		}
	}

	/* ====================== */
	/* ======== RENDER ====== */
	/* ====================== */
	function render(time: DOMHighResTimeStamp) {
		// Clear the scene
		ctx.clearRect(0, 0, width, height)

		const { analyser, dataArray, isActive } = getState()

		const smoothness = 4
		const targetRadius = isActive ? MAX_GLOBE_RADIUS : MIN_GLOBE_RADIUS
		currentRadius += (targetRadius - currentRadius) / smoothness // Smooth transition

		// Increase the globe rotation
		rotation = time * 0.0002

		const sineRotation = Math.sin(rotation) // Sine of the rotation
		const cosineRotation = Math.cos(rotation) // Cosine of the rotation

		let noiseFactor = 0

		if (analyser && dataArray) {
			// Get the audio data
			analyser.getByteFrequencyData(dataArray)

			// Calculate the average frequency value
			const avgFrequency =
				dataArray.reduce((a, b) => a + b) / analyser.frequencyBinCount

			// Determine the noise-based intensity from the audio data
			noiseFactor = avgFrequency / 128 // Normalize avgFrequency to a range of around [0, 2]
		}

		// Loop through the dots array and draw every dot
		dots.forEach((dot) => {
			// Calculate noise-based variation
			const noiseValue = noise3D(
				dot.location.x / 80,
				dot.location.y / 80,
				time * 0.0001,
			)
			const audioInfluence = noiseFactor * currentRadius

			// Update dot's position using the audio-influenced radius
			const animatedRadius = currentRadius + noiseValue * audioInfluence

			// Update dot's position using the animated radius
			dot.location.x = animatedRadius * Math.sin(dot.phi) * Math.cos(dot.theta)
			dot.location.y = animatedRadius * Math.sin(dot.phi) * Math.sin(dot.theta)
			dot.location.z = animatedRadius * Math.cos(dot.phi) + GLOBE_CENTER_Z

			draw(dot, {
				sin: sineRotation,
				cos: cosineRotation,
				radius: isActive ? MAX_DOT_RADIUS : MIN_DOT_RADIUS,
			})
		})
		window.requestAnimationFrame(render)
	}

	// Populate the dots array with random dots
	createDots()

	// Render the scene
	window.requestAnimationFrame(render)
}
