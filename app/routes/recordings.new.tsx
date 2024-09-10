import { type FileUpload, parseFormData } from '@mjackson/form-data-parser'
import { json, redirect, type ActionFunctionArgs } from '@remix-run/cloudflare'
import clsx from 'clsx'
import { drizzle } from 'drizzle-orm/d1'
import {
	type ReactEventHandler,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import { createNoise3D } from 'simplex-noise'
import Form from '#app/components/kits/Form.js'
import { recordings } from '#app/db/schema.server.js'
import { useAudioAnalyser } from '#app/hooks/useAudioAnalyser.js'
import { useRecordAudio } from '#app/hooks/useRecordAudio.js'
import { R2FileStorage } from '#app/utils/file-storage.js'
import { makeRecordingKey } from '#app/utils/make-recording-key.js'

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
	const [isOn, setIsOn] = useState(true)

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
		<>
			<svg width="0" height="0">
				<filter id="noise">
					<feTurbulence
						type="fractalNoise"
						baseFrequency="1.2"
						numOctaves="6"
						stitchTiles="stitch"
					/>
					<feColorMatrix type="saturate" values="0" />
					<feComponentTransfer>
						<feFuncR type="gamma" amplitude="1" exponent="0.5" />
						<feFuncG type="gamma" amplitude="1" exponent="0.5" />
						<feFuncB type="gamma" amplitude="1" exponent="0.5" />
						<feFuncA type="linear" slope="0.8" intercept="0.1" />
					</feComponentTransfer>
				</filter>
			</svg>
			<div className="relative isolate mt-16 mx-auto w-full max-w-md">
				<div className="relative flex aspect-[6/7] w-full flex-col overflow-hidden rounded-4xl bg-gray-300 bg-gradient-to-br from-gray-950/0 via-gray-950/30 via-80% to-gray-950/35">
					<div className="pointer-events-none absolute inset-0 bg-gradient-to-bl from-white/10 to-white/0 to-50%" />
					<div className="pointer-events-none absolute inset-0 mix-blend-multiply filter-[url(#noise)]" />
					<div className="relative m-4">
						<div className="absolute top-0 -right-0.5 -bottom-0.5 left-0 rounded-[18px] bg-gradient-to-tl from-white/60 to-white/0" />
						<div className="absolute -top-0.5 right-0 bottom-0 -left-0.5 rounded-[18px] bg-gradient-to-br from-gray-950/30 to-gray-950/0" />
						<div className="relative overflow-hidden rounded-2xl">
							<div className="relative aspect-[7/5] w-full bg-gray-950 p-0.5">
								<div className="bg-glare absolute inset-0 rounded-[18px]" />
								<div className="flex h-full w-full items-center justify-center rounded-xl border-2 border-gray-950/60 bg-white/5">
									<canvas ref={canvasRef} width={300} height={300} />
								</div>
								<div className="absolute inset-1 rounded-xl border-t-4 border-l-4 border-t-gray-300/15 border-l-gray-300/15"></div>
								<div className="absolute inset-[5px] rounded-xl border-t border-l border-t-gray-200/50 border-l-gray-200/50"></div>
							</div>
						</div>
					</div>
					<div className="flex-1">
						<div className="flex flex-1 flex-col items-center justify-center gap-4">
							<div className="w-full px-4">
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
										className="group relative flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-t border-l border-white/60 bg-transparent from-gray-950/10 to-gray-950/0 py-2 px-4 font-mono text-sm font-medium text-gray-950/70 ring ring-gray-950 [text-shadow:0_1px_color-mix(in_srgb,var(--color-white)_50%,transparent)] active:border-gray-950/30 active:bg-gradient-to-br"
									>
										<span className="pointer-events-none absolute inset-0 rounded-full border-r border-b border-gray-950/50" />
										<span
											className={clsx(
												'relative block h-2 w-2 rounded-full',
												isRecording ? 'bg-red-400' : 'bg-red-800',
											)}
										>
											{isRecording ? (
												<>
													<span className="absolute inset-0 bg-red-400 blur-sm" />
													<span className="bg-recording absolute inset-0 rounded-full" />
												</>
											) : null}
										</span>
										{isRecording ? 'Stop Recording' : 'Start Recording'}
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
									className={audioURL ? 'sr-only' : 'sr-only'}
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
					</div>
					<div className="relative rounded-t-sm border-t-2 border-gray-950/60">
						<div className="flex items-center justify-between rounded-t-sm border-t-2 border-white/40 py-4 px-8 font-mono">
							<p className="text-xs text-gray-950/70 [text-shadow:0_1px_color-mix(in_srgb,var(--color-white)_50%,transparent)]">
								Audio Visualizer II
							</p>
							<span className="relative isolate block h-2 w-2 rounded-full bg-emerald-800">
								{isOn ? (
									<>
										<span className="absolute inset-0 bg-emerald-400 blur-sm" />
										<span className="bg-power-on absolute inset-0 rounded-full" />
									</>
								) : null}
							</span>
						</div>
					</div>
					<div className="pointer-events-none absolute inset-0 rounded-4xl border-r-2 border-b-2 border-white/20" />
					<div className="pointer-events-none absolute inset-0 rounded-4xl border-t-2 border-l-2 border-white/60" />
				</div>
				<div className="pointer-events-none absolute top-full right-px left-px z-[-1] mx-auto h-9 max-w-md -translate-y-8 overflow-hidden rounded-t-none rounded-b-4xl bg-gradient-to-r from-gray-950 via-gray-800 via-10% to-gray-950">
					<div className="absolute inset-0 mix-blend-multiply filter-[url(#noise)]" />
				</div>
				<div className="pointer-events-none absolute top-full right-px left-px z-[-2] h-9 max-w-md -translate-y-[31px] overflow-hidden rounded-t-none rounded-b-4xl bg-gradient-to-r from-white/10 via-white/80 via-10% to-white/10 to-50%">
					<div className="absolute inset-0 mix-blend-multiply filter-[url(#noise)]" />
				</div>
				<div className="bg-device-bottom absolute top-full right-0 left-0 z-[-3] mx-auto h-[60px] max-w-md -translate-y-8 overflow-hidden rounded-t-none rounded-b-4xl bg-gray-500">
					<div className="absolute inset-0 mix-blend-multiply filter-[url(#noise)]" />
				</div>
				<div className="absolute inset-x-0 top-full z-[-4] h-6 translate-y-[460%] rounded-[50%] bg-gray-950/40 blur-lg" />
				<div className="absolute -inset-x-16 top-full z-[-4] h-16 translate-y-[160%] rounded-[50%] bg-gray-950/40 blur-2xl" />
			</div>
		</>
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
	const DOTS_AMOUNT = 1500 // Amount of dots on the screen
	const MIN_DOT_RADIUS = 1
	const MAX_DOT_RADIUS = 1.5 // Radius of the dots
	const MIN_GLOBE_RADIUS = height * 0.15 // Minimum radius of the globe
	const MAX_GLOBE_RADIUS = height * 0.5 // Maximum radius of the globe
	let currentRadius = MIN_GLOBE_RADIUS // Current radius to be interpolated
	const GLOBE_CENTER_Z = -MAX_GLOBE_RADIUS // Z value of the globe center
	let PROJECTION_CENTER_X = width / 2 // X center of the canvas HTML
	let PROJECTION_CENTER_Y = height / 2 // Y center of the canvas HTML
	let FIELD_OF_VIEW = height * 0.8

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
			noiseFactor = avgFrequency / 40 // Normalize avgFrequency to a range of around [0, 2]
		}

		// Loop through the dots array and draw every dot
		dots.forEach((dot) => {
			// Calculate noise-based variation
			const noiseValue = noise3D(
				dot.location.x / 80,
				dot.location.y / 80,
				time * 0.001,
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
