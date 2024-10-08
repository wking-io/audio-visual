import { type FileUpload, parseFormData } from '@mjackson/form-data-parser'
import { json, redirect, type ActionFunctionArgs } from '@remix-run/cloudflare'
import clsx from 'clsx'
import { drizzle } from 'drizzle-orm/d1'
import {
	forwardRef,
	type PropsWithChildren,
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
import { type PropsWithClassName } from '#app/types.js'
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

	const formData = await request.clone().formData()

	switch (formData.get('actionId')) {
		case CREATE_RECORDING: {
			const [recording] = await db
				.insert(recordings)
				.values({})
				.returning({ id: recordings.id, audioKey: recordings.audioKey })

			if (!recording) return json({ success: false })

			let audioData = await parseFormData(
				request,
				uploadHandler(store, makeRecordingKey(recording)),
			)

			let file = audioData.get('recording')

			if (!file || !(file instanceof File)) return json({ success: false })
			return redirect(`/recordings/${recording.id}`)
		}
		case ASSOCIATE_RECORDING: {
			return json({ success: true })
		}
	}
}

export default function Screen() {
	const orbStateRef = useRef<{
		analyser: AnalyserNode | null
		dataArray: Uint8Array | null
		isActive: boolean
	}>({ analyser: null, dataArray: null, isActive: false })
	const [isOn, setIsOn] = useState(true)
	const [audioPlaying, setAudioPlaying] = useState(false)
	const [mode, setMode] = useState<'record' | 'generate'>('generate')
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

	const playAudio = useCallback(() => {
		playerRef?.current?.play().catch(console.error)
	}, [])

	const pauseAudio = useCallback(() => {
		playerRef?.current?.pause()
	}, [])

	const handlePlay: ReactEventHandler<HTMLAudioElement> = useCallback(
		(e) => {
			orbStateRef.current.isActive = true
			setAudioPlaying(true)
			handleSetup(e.currentTarget).catch(console.error)
		},
		[handleSetup],
	)

	const handlePause = useCallback(() => {
		orbStateRef.current.isActive = false
		setAudioPlaying(false)
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
		<Device>
			<DeviceFace>
				<DeviceScreen isOn={isOn}>
					{mode === 'record' ? (
						<RecordingCanvas ref={canvasRef} />
					) : (
						<div className="flex h-full w-full items-center justify-center">
							<div className="absolute top-1/2 left-1/2 aspect-[16/7] w-2/3 -translate-1/2">
								{COLORS.map((color, i) => (
									<Blob
										index={i}
										seed={Math.random()}
										color={color}
										key={color}
										className="scale-125 opacity-50 blur-xl"
									/>
								))}
							</div>
							<div className="absolute top-1/2 left-1/2 aspect-[16/7] w-[69%] -translate-1/2 overflow-hidden blur">
								{COLORS.map((color, i) => (
									<Blob
										index={i}
										seed={Math.random()}
										color={color}
										key={color}
										className="blur-sm"
									/>
								))}
							</div>
							<div className="relative aspect-[16/7] w-2/3 overflow-hidden">
								{COLORS.map((color, i) => (
									<Blob
										index={i}
										seed={Math.random()}
										color={color}
										key={color}
										className="blur-[3px]"
									/>
								))}
							</div>
						</div>
					)}
					<TopStatusBar>
						<div className="flex">
							<p
								className={clsx(
									mode === 'record'
										? 'border-transparent bg-gray-100/60 text-gray-950'
										: 'border-gray-100/60',
									'border-r py-2 px-3',
								)}
							>
								Record
							</p>
							<p
								className={clsx(
									mode === 'generate'
										? 'border-transparent bg-gray-100/60 text-gray-950'
										: 'border-gray-100/60',
									'border-r py-2 px-3',
								)}
							>
								Generate
							</p>
						</div>
						<div className="flex items-center gap-2 px-3">
							<p className="inline-flex items-center gap-1.5">
								<span className="flex h-3 w-3 items-center justify-center rounded-sm bg-gray-100/60">
									<RefreshSymbol className="h-auto w-2 text-gray-800" />
								</span>
								Mode
							</p>
							<p className="inline-flex items-center gap-1.5">
								<span className="flex h-3 w-3 items-center justify-center rounded-sm bg-gray-100/60">
									<SettingsSymbol className="h-auto w-2 text-gray-800" />
								</span>
								Menu
							</p>
						</div>
					</TopStatusBar>
					<BottomStatusBar>
						{audioURL ? (
							<>
								<p className="inline-flex items-center gap-1.5">
									<span className="flex h-3 w-3 items-center justify-center rounded-sm bg-gray-100/60">
										<CircleSymbol className="h-2 w-2 text-gray-800" />
									</span>{' '}
									{audioPlaying ? 'Pause' : 'Play'} Recording
								</p>
								<p className="inline-flex items-center gap-1.5">
									<span className="flex h-3 w-3 items-center justify-center rounded-sm bg-gray-100/60">
										<XSymbol className="h-2 w-2 text-gray-800" />
									</span>{' '}
									Delete Recording
								</p>
							</>
						) : (
							<>
								<p className="inline-flex items-center gap-1.5">
									<span className="flex h-3 w-3 items-center justify-center rounded-sm bg-gray-100/60">
										<CircleSymbol className="h-2 w-2 text-gray-800" />
									</span>
									Start Recording
								</p>
								<p className="inline-flex items-center gap-1.5">
									<span className="flex h-3 w-3 items-center justify-center rounded-sm bg-gray-100/60">
										<XSymbol className="h-2 w-2 text-gray-800" />
									</span>
									Stop Recording
								</p>
							</>
						)}
					</BottomStatusBar>
				</DeviceScreen>
				<DeviceControls>
					<TertiaryButtons>
						<ModeButton
							onClick={() =>
								setMode((current) =>
									current === 'record' ? 'generate' : 'record',
								)
							}
						/>
						<SettingsButton onClick={() => {}} />
					</TertiaryButtons>
					<PrimaryButtons>
						<OButton
							disabled={isRecording || !isOn}
							onClick={
								audioURL ? (audioPlaying ? pauseAudio : playAudio) : handleStart
							}
						/>
						<XButton
							disabled={(!audioURL && !isRecording && !isOn) || audioPlaying}
							onClick={audioURL ? handleReset : handleStop}
						/>
					</PrimaryButtons>
					<DialButton />
					<Form encType="multipart/form-data" className="sr-only">
						{audioURL ? (
							<audio
								ref={playerRef}
								onPlay={handlePlay}
								onPause={handlePause}
								onEnded={handlePause}
								controls
								src={audioURL}
								className="w-full"
							></audio>
						) : null}
						<input
							ref={fileInputRef}
							type="file"
							name="recording"
							accept="audio/*"
							onChange={handleFileChange}
							className={audioURL ? 'sr-only' : 'sr-only'}
						/>
					</Form>
				</DeviceControls>
				<FaceSeam />
			</DeviceFace>
			<DeviceSeam className="z-[-1] -translate-y-8 from-gray-700 via-gray-600 via-10% to-gray-700" />
			<DeviceSeam className="z-[-2] -translate-y-[31px] from-white/10 via-white/80 via-10% to-white/10 to-50%" />
			<DeviceBottom>
				<PowerButton isOn={isOn} onClick={() => setIsOn((prev) => !prev)} />
				<PowerIndicator isOn={isOn} />
			</DeviceBottom>
		</Device>
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

const colors = [
	'#fff7ed',
	'#ffedd5',
	'#fed7aa',
	'#fdba74',
	'#fb923c',
	'#f97316',
]

/**
 * Simplex Noise generates a value between -1 and 1, but we are working with an
 * array that will not accept a negative index. We will be converting the original
 * noise range to fit the 0 to 1 scale we need.
 **/
function getColorByNoise(noise: number) {
	return colors[Math.floor(((noise + 1) / 2) * colors.length)] ?? colors[0]!
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
	const MAX_DOT_RADIUS = 1.25 // Radius of the dots
	const INACTIVE_GLOBE_RADIUS = height * 0.15 // Minimum radius of the globe
	const ACTIVE_GLOBE_RADIUS = height * 0.4 // Maximum radius of the globe
	const MIN_GLOBE_RADIUS = height * 0.35
	const MAX_GLOBE_RADIUS = height * 0.65
	let currentRadius = MIN_GLOBE_RADIUS // Current radius to be interpolated
	const GLOBE_CENTER_Z = -ACTIVE_GLOBE_RADIUS // Z value of the globe center
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
		options: { sin: number; cos: number; radius: number; color: string },
	): void {
		const { x, y, size } = project(dot, options)

		ctx.beginPath()
		ctx.arc(x, y, options.radius * size, 0, Math.PI * 2)
		ctx.closePath()
		ctx.globalAlpha = size
		ctx.fillStyle = options.color
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
		const targetRadius = isActive ? ACTIVE_GLOBE_RADIUS : INACTIVE_GLOBE_RADIUS
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
			noiseFactor = avgFrequency / 80 // Normalize avgFrequency to a range of around [0, 2]
		}

		const noiseRange = MAX_GLOBE_RADIUS - MIN_GLOBE_RADIUS

		// Loop through the dots array and draw every dot
		dots.forEach((dot) => {
			// Calculate noise-based variation
			const noiseValue = noise3D(
				dot.location.x / 80,
				dot.location.y / 80,
				time * 0.001,
			)

			const color = getColorByNoise(noiseValue)

			// Update dot's position using the audio-influenced radius
			const animatedRadius = isActive
				? Math.min(
						Math.max(
							currentRadius + noiseValue * noiseRange * noiseFactor,
							MIN_GLOBE_RADIUS,
						),
						MAX_GLOBE_RADIUS,
					)
				: currentRadius

			// Update dot's position using the animated radius
			dot.location.x = animatedRadius * Math.sin(dot.phi) * Math.cos(dot.theta)
			dot.location.y = animatedRadius * Math.sin(dot.phi) * Math.sin(dot.theta)
			dot.location.z = animatedRadius * Math.cos(dot.phi) + GLOBE_CENTER_Z

			draw(dot, {
				sin: sineRotation,
				cos: cosineRotation,
				radius: isActive ? MAX_DOT_RADIUS : MIN_DOT_RADIUS,
				color,
			})
		})
		window.requestAnimationFrame(render)
	}

	// Populate the dots array with random dots
	createDots()

	// Render the scene
	window.requestAnimationFrame(render)
}

function CircleSymbol({ className }: { className?: string }) {
	return (
		<svg
			width="8"
			height="8"
			viewBox="0 0 8 8"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M2 0H3H4H5H6V1H5H4H3H2V0ZM1 2V1H2V2H1ZM1 6H0V5V4V3V2H1V3V4V5V6ZM2 7H1V6H2V7ZM5 7H4H3H2V8H3H4H5H6V7H7V6H8V5V4V3V2H7V1H6V2H7V3V4V5V6H6V7H5Z"
				fill="currentColor"
			/>
		</svg>
	)
}

function XSymbol({ className }: { className?: string }) {
	return (
		<svg
			width="8"
			height="8"
			viewBox="0 0 8 8"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0 0H1V1H0V0ZM2 2H1V1H2V2ZM3 3H2V2H3V3ZM5 3H4H3V4V5H2V6H1V7H0V8H1V7H2V6H3V5H4H5V6H6V7H7V8H8V7H7V6H6V5H5V4V3ZM6 2V3H5V2H6ZM7 1V2H6V1H7ZM7 1V0H8V1H7Z"
				fill="currentColor"
			/>
		</svg>
	)
}

function RefreshSymbol({ className }: { className?: string }) {
	return (
		<svg
			width="6"
			height="8"
			viewBox="0 0 6 8"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M2 0H3V1H2V0ZM3 2V1H4V2H3ZM1 3V2H2H3V3H2H1ZM1 3V4V5H0V4V3H1ZM5 3H6V4V5H5V4V3ZM3 6V5H4H5V6H4H3ZM3 7V6H2V7H3ZM3 7V8H4V7H3Z"
				fill="currentColor"
			/>
		</svg>
	)
}

function SettingsSymbol({ className }: { className?: string }) {
	return (
		<svg
			width="8"
			height="7"
			viewBox="0 0 8 7"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M1 0H2H3V1H4H5H6H7H8V2H7H6H5H4H3V3H2H1V2H2V1H1V0ZM1 1V2H0V1H1ZM5 4H6H7V5H6V6H7V7H6H5V6H4H3H2H1H0V5H1H2H3H4H5V4ZM7 6H8V5H7V6Z"
				fill="currentColor"
			/>
		</svg>
	)
}

function DeviceBottom({ children }: PropsWithChildren) {
	return (
		<div className="bg-device-bottom absolute top-full right-0 left-0 z-[-3] mx-auto h-[60px] max-w-md -translate-y-8 overflow-hidden rounded-t-none rounded-b-4xl border-b border-white/50 bg-gray-500">
			<div className="absolute inset-0 mix-blend-multiply filter-[url(#noise)]" />
			<div className="absolute right-[55px] bottom-[7px] h-[9px] w-[34px] rounded-full bg-gradient-to-t from-white/70 via-white/20 via-20% to-white/0" />
			{children}
		</div>
	)
}

function PowerButton({ isOn, onClick }: { isOn: boolean; onClick(): void }) {
	return (
		<button
			onClick={onClick}
			className="switch-inset absolute right-14 bottom-2 h-2 w-8 cursor-grab rounded bg-gray-700 active:cursor-grabbing"
		>
			<span className="absolute inset-x-0 top-0 h-4 overflow-hidden rounded-t">
				<span
					className={clsx(
						isOn ? 'translate-x-3' : 'translate-x-0',
						'switch-body absolute top-0 left-px h-3 w-4 rounded-b-sm bg-orange-600 transition',
					)}
				>
					<span className="switch-face absolute inset-x-0 bottom-0 h-2 rounded-sm border-b border-white/50 bg-orange-600" />
				</span>
			</span>
			<span className="absolute -inset-2" />
			<span className="sr-only">{isOn ? 'Turn off' : 'Turn on'}</span>
		</button>
	)
}

function PowerIndicator({ isOn }: { isOn: boolean }) {
	return (
		<span className="absolute right-10 bottom-2.5 isolate block h-1 w-2 rounded-[100%] bg-emerald-950">
			{isOn ? (
				<>
					<span className="absolute inset-0 bg-emerald-400 blur-sm" />
					<span className="bg-power-on absolute inset-0 rounded-[100%]" />
				</>
			) : null}
		</span>
	)
}

function DeviceSeam({ className }: PropsWithClassName) {
	return (
		<div
			className={clsx(
				className,
				'pointer-events-none absolute top-full right-px left-px mx-auto h-9 max-w-md -translate-y-8 overflow-hidden rounded-t-none rounded-b-4xl bg-gradient-to-r',
			)}
		>
			<div className="absolute inset-0 mix-blend-multiply filter-[url(#noise)]" />
		</div>
	)
}

function OButton({
	onClick,
	disabled = false,
}: PropsWithClassName<{ onClick(): void; disabled?: boolean }>) {
	return (
		<div className="relative isolate translate-y-5 rounded-lg">
			<button
				disabled={disabled}
				onClick={onClick}
				className="peer group relative isolate z-10 flex h-16 w-16 cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 font-mono text-sm font-medium text-orange-950/70 [text-shadow:0_1px_color-mix(in_srgb,var(--color-white)_50%,transparent)] active:bg-gradient-to-br"
			>
				<span className="absolute inset-0 rounded-lg border-t-2 border-l-2 border-white/60 blur-[2px] group-active:border-white/20" />
				<span className="absolute inset-0 rounded-lg border-t border-l border-white/60 blur-[1px] group-active:border-white/20" />
				<span className="absolute inset-0 rounded-lg border-r-2 border-b-2 border-gray-950/60 blur-[3px] group-active:border-gray-950/80" />
				<span className="absolute inset-0 rounded-lg border-r border-b border-gray-950/50 blur-[2px] group-active:border-gray-950/80" />
				<div className="absolute inset-2 rounded-full bg-gradient-to-br from-orange-500 via-orange-500 to-orange-200/30" />
				<div className="absolute inset-[9px] rounded-full bg-orange-600" />
				<CircleSymbol className="relative h-4 w-4 text-orange-50/80" />
				<div className="absolute inset-[9px] rounded-full bg-gradient-to-br from-orange-50/0 to-orange-200/60" />
				<div className="absolute inset-[9px] rounded-full bg-gradient-to-br from-orange-700/20 to-orange-600/0" />
				<div className="absolute inset-2 rounded-full border border-orange-200 blur-[2px]" />
				<div className="absolute inset-2 rounded-full bg-orange-950 opacity-0 blur-sm group-active:opacity-5" />
				<div className="absolute inset-0 top-1/2 left-1/2 z-[-1] bg-gray-950/30 blur group-active:bg-gray-950/50" />
			</button>
			<div className="absolute -inset-[3px] z-[-2] rounded-xl bg-gradient-to-br from-gray-800 to-gray-200" />
			<div className="absolute -inset-[3px] z-[-2] rounded-xl bg-gradient-to-br from-orange-500/50 via-gray-950/50 to-gray-200" />
			<div className="absolute -inset-0.5 rounded-[11px] bg-gray-950" />
			<div className="absolute inset-0 z-[-1] translate-2 bg-gray-950/30 blur peer-active:bg-gray-950/10" />
			<div className="absolute inset-0 z-[-1] translate-1 bg-gray-950/30 blur-sm peer-active:bg-gray-950/10" />
		</div>
	)
}

function XButton({
	onClick,
	disabled = false,
}: PropsWithClassName<{ onClick(): void; disabled?: boolean }>) {
	return (
		<div className="relative isolate -translate-y-5 rounded-lg">
			<button
				disabled={disabled}
				onClick={onClick}
				className="peer group relative z-10 flex h-16 w-16 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 font-mono text-sm font-medium text-gray-950/70 [text-shadow:0_1px_color-mix(in_srgb,var(--color-white)_50%,transparent)] active:bg-gradient-to-br"
			>
				<span className="absolute inset-0 rounded-lg border-t-2 border-l-2 border-white/60 blur-[3px] group-active:border-white/20" />
				<span className="absolute inset-0 rounded-lg border-t border-l border-white/60 blur-[2px] group-active:border-white/20" />
				<span className="absolute inset-0 rounded-lg border-r-2 border-b-2 border-gray-950/60 blur-[3px] group-active:border-gray-950/80" />
				<span className="absolute inset-0 rounded-lg border-r border-b border-gray-950/50 blur-[2px] group-active:border-gray-950/80" />

				<div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-600 via-gray-600 to-gray-200/30" />
				<div className="absolute inset-[9px] rounded-full bg-gray-700" />
				<XSymbol className="relative h-4 w-4 text-orange-50/80" />
				<div className="absolute inset-[9px] rounded-full bg-gradient-to-br from-gray-800/20 to-gray-700/0" />
				<div className="absolute inset-[9px] rounded-full bg-gradient-to-br from-gray-50/0 to-gray-400/60" />
				<div className="absolute inset-2 rounded-full border border-gray-300 blur-[2px]" />
				<div className="absolute inset-2 bg-gray-950 opacity-0 blur-sm group-active:opacity-5" />
				<div className="absolute inset-0 top-1/2 left-1/2 z-[-1] bg-gray-950/40 blur group-active:bg-gray-950/60" />
			</button>
			<div className="absolute -inset-[3px] z-[-2] rounded-xl bg-gradient-to-br from-gray-800 to-gray-200" />
			<div className="absolute -inset-0.5 rounded-[11px] bg-gray-950" />
			<div className="absolute inset-0 z-[-1] translate-2 bg-gray-950/30 blur peer-active:bg-gray-950/20" />
			<div className="absolute inset-0 z-[-1] translate-1 bg-gray-950/30 blur-sm peer-active:bg-gray-950/20" />
		</div>
	)
}

function DialButton() {
	return (
		<div className="absolute top-1/2 left-12 h-32 w-32 -translate-y-1/2">
			<div className="absolute -inset-px rounded-full bg-gradient-to-br from-gray-600 to-white" />
			<div className="absolute -inset-px rounded-full bg-gradient-to-br from-orange-700/50 via-gray-600/20 to-white" />
			<div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-700 to-gray-200" />
			<div className="absolute inset-2 rounded-full bg-gradient-to-r from-gray-700 to-gray-100" />
			<div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-600/50 via-gray-400/50 to-gray-200" />
			<div className="absolute inset-2 rounded-full bg-gradient-to-r from-gray-700 to-gray-100" />
			<div className="absolute inset-2 rounded-full bg-gradient-to-r from-orange-400/70 via-orange-300/50 to-orange-100" />
			<div className="absolute inset-[9px] rounded-full bg-gradient-to-br from-gray-800 to-gray-950" />
			<div className="absolute inset-[11px] rounded-full bg-gradient-to-br from-orange-50 via-orange-400 to-orange-800" />
			<div className="absolute inset-3 rounded-full bg-gradient-to-br from-orange-300 to-orange-500" />
			<div className="absolute inset-4 rounded-full bg-gradient-to-br from-orange-600 via-orange-300 to-orange-100" />
			<div className="absolute inset-[17px] rounded-full bg-orange-600" />
			<div className="absolute inset-0">
				<div className="absolute bottom-8 left-8 h-2 w-2 rounded-full">
					<div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-800 via-orange-700/20 to-orange-700/0" />
					<div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/0 via-white/20 to-white/30" />
					<div className="absolute inset-px rounded-full bg-gradient-to-br from-orange-400 to-orange-200" />
				</div>
			</div>
			<div className="absolute inset-[17px] rounded-full bg-gradient-to-br from-orange-50/0 to-orange-50/60" />
		</div>
	)
}

function Device({ children }: PropsWithChildren) {
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
				{children}
				<div className="absolute inset-x-0 top-full z-[-4] h-6 translate-y-[460%] rounded-[50%] bg-gray-950/40 blur-lg" />
				<div className="absolute -inset-x-16 top-full z-[-4] h-16 translate-y-[160%] rounded-[50%] bg-gray-950/40 blur-2xl" />
			</div>
		</>
	)
}

function DeviceFace({ children }: PropsWithChildren) {
	return (
		<div className="relative flex aspect-[9/11] w-full flex-col overflow-hidden rounded-4xl bg-gray-300 bg-gradient-to-br from-gray-950/0 via-gray-950/30 via-80% to-gray-950/35">
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-bl from-white/10 to-white/0 to-50%" />
			<div className="pointer-events-none absolute inset-0 mix-blend-multiply filter-[url(#noise)]" />
			{children}
			<div className="pointer-events-none absolute inset-0 rounded-4xl border-r-2 border-b-2 border-white/20" />
			<div className="pointer-events-none absolute inset-0 rounded-4xl border-t-2 border-l-2 border-white/60" />
		</div>
	)
}

function FaceSeam() {
	return (
		<div className="relative rounded-t-sm border-t border-gray-950/60">
			<div className="flex items-center justify-between rounded-t-sm border-t border-gray-300 font-mono">
				<svg
					width="440"
					height="48"
					className="py-1 pl-2"
					xmlns="http://www.w3.org/2000/svg"
				>
					<defs>
						<linearGradient
							id="hole-highlight"
							x1="1.5"
							y1="1.5"
							x2="6.5"
							y2="6.5"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#374151" />
							<stop offset="1" stopColor="#f3f4f6" />
						</linearGradient>

						<linearGradient
							id="hole"
							x1="4"
							y1="1"
							x2="4"
							y2="7"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#030712" />
							<stop offset="1" stopColor="#4b5563" />
						</linearGradient>
						<pattern
							id="myPattern"
							patternUnits="userSpaceOnUse"
							width="8"
							height="8"
						>
							<circle cx="4" cy="4" r="3.5" fill="url(#hole-highlight)" />
							<circle cx="4" cy="4" r="3" fill="url(#hole)" />
						</pattern>
					</defs>
					<rect width="8" height="24" fill="url(#myPattern)" />
					<rect width="8" height="32" x="8" fill="url(#myPattern)" />
					<rect width="400" height="40" x="16" fill="url(#myPattern)" />
					<rect width="8" height="32" x="416" fill="url(#myPattern)" />
					<rect width="8" height="24" x="424" fill="url(#myPattern)" />
				</svg>
			</div>
		</div>
	)
}

function DeviceScreen({
	children,
	isOn = false,
}: PropsWithChildren<{ isOn?: boolean }>) {
	return (
		<div className="relative m-4">
			<div className="absolute top-0 -right-0.5 -bottom-0.5 left-0 rounded-[18px] bg-gradient-to-tl from-white/60 to-white/0" />
			<div className="absolute -top-0.5 right-0 bottom-0 -left-0.5 rounded-[18px] bg-gradient-to-br from-gray-950/30 to-gray-950/0" />
			<div className="relative overflow-hidden rounded-2xl">
				<div className="relative aspect-[7/5] w-full bg-gray-950 p-0.5">
					<div className="bg-glare absolute inset-0 z-50 rounded-[18px]" />
					<div
						className={clsx(
							isOn ? 'scale-y-100' : 'scale-y-0 delay-100',
							'h-full w-full bg-white/5 transition duration-200',
						)}
					>
						<div
							className={clsx(
								isOn ? 'opacity-100 delay-100' : 'opacity-0',
								'h-full w-full transition duration-200',
							)}
						>
							{children}
						</div>
					</div>
					<div className="absolute inset-1 rounded-xl border-t-4 border-l-4 border-t-gray-300/15 border-l-gray-300/15"></div>
					<div className="absolute inset-[5px] rounded-xl border-t border-l border-t-gray-200/50 border-l-gray-200/50"></div>
				</div>
			</div>
		</div>
	)
}

function DeviceControls({ children }: PropsWithChildren) {
	return (
		<div className="relative mb-4 flex flex-1 justify-between">{children}</div>
	)
}

function ModeButton({ onClick }: { onClick(): void }) {
	return (
		<button
			onClick={onClick}
			className="group relative flex h-6 w-6 cursor-pointer items-center justify-center gap-2 rounded-full border-t border-l border-white/60 bg-transparent from-gray-950/10 to-gray-950/0 font-mono text-sm font-medium text-gray-950/70 ring ring-gray-950 [text-shadow:0_1px_color-mix(in_srgb,var(--color-white)_50%,transparent)] active:border-gray-950/30 active:bg-gradient-to-br"
		>
			<RefreshSymbol className="h-auto w-2.5" />
		</button>
	)
}

function SettingsButton({ onClick }: { onClick(): void }) {
	return (
		<button
			onClick={onClick}
			className="group relative flex h-6 w-6 cursor-pointer items-center justify-center gap-2 rounded-full border-t border-l border-white/60 bg-transparent from-gray-950/10 to-gray-950/0 font-mono text-sm font-medium text-gray-950/70 ring ring-gray-950 [text-shadow:0_1px_color-mix(in_srgb,var(--color-white)_50%,transparent)] active:border-gray-950/30 active:bg-gradient-to-br"
		>
			<SettingsSymbol className="h-auto w-2.5" />
		</button>
	)
}

function TertiaryButtons({ children }: PropsWithChildren) {
	return <div className="flex flex-col justify-between px-4">{children}</div>
}

function PrimaryButtons({ children }: PropsWithChildren) {
	return (
		<div className="flex items-center justify-end gap-4 pr-12">{children}</div>
	)
}

const RecordingCanvas = forwardRef<HTMLCanvasElement, {}>((_, ref) => (
	<div className="flex h-full w-full items-center justify-center rounded-xl border-2 border-gray-950/60">
		<canvas ref={ref} width={300} height={300} />
	</div>
))

function TopStatusBar({ children }: PropsWithChildren) {
	return (
		<div className="absolute inset-x-1 top-1 flex justify-between gap-4 overflow-hidden rounded-t-[10px] border-b border-dashed border-gray-100/60 font-mono text-[10px] text-gray-100/80">
			{children}
		</div>
	)
}

function BottomStatusBar({ children }: PropsWithChildren) {
	return (
		<div className="absolute inset-x-1 bottom-1 flex gap-4 rounded-b-[11px] border-t border-dashed border-gray-100/60 py-2 px-3 font-mono text-[10px] text-gray-100/80">
			{children}
		</div>
	)
}
/**
 * Blob generator
 */
function blobGenerator({
	size = 400,
	edges = 6,
	seed,
}: {
	size?: number
	edges?: number
	seed?: number
}) {
	var { destPoints, seedValue } = createPoints({ size, edges, seed })
	var path = createSvgPath(destPoints)
	return { path, seedValue }
}

const createPoints = ({
	size,
	edges,
	seed,
}: {
	size: number
	edges: number
	seed?: number
}) => {
	let seedValue = seed ?? Math.random()
	const growth = randomFloatBetween(0, 0.5, seedValue)
	const origin = size / 2
	let outerRad = origin
	let innerRad = origin - origin * growth

	let slices = divide(edges)
	let destPoints: [number, number][] = []

	slices.forEach((degree) => {
		let O = randomFloatBetween(innerRad, outerRad, Math.random())
		console.log('DATA: ', innerRad, outerRad, O)
		let end = point({ origin, radius: O, degree })
		destPoints.push(end)
	})
	return { destPoints, seedValue }
}

function createSvgPath(points: [number, number][]) {
	let svgPath = ''
	var mid = [
		(points[0]![0] + points[1]![0]) / 2,
		(points[0]![1] + points[1]![1]) / 2,
	]
	svgPath += 'M' + mid[0] + ',' + mid[1]

	for (var i = 0; i < points.length; i++) {
		var p1 = points[(i + 1) % points.length]!
		var p2 = points[(i + 2) % points.length]!
		mid = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2]
		svgPath += 'Q' + p1[0] + ',' + p1[1] + ',' + mid[0] + ',' + mid[1]
	}
	svgPath += 'Z'
	return svgPath
}

function toRad(deg: number) {
	return deg * (Math.PI / 180.0)
}

function divide(count: number) {
	var deg = 360 / count

	return Array(count)
		.fill('a')
		.map((_, i) => i * deg)
}

function point({
	origin,
	radius,
	degree,
}: {
	origin: number
	radius: number
	degree: number
}): [number, number] {
	var x = origin + radius * Math.cos(toRad(degree))
	var y = origin + radius * Math.sin(toRad(degree))
	return [Math.round(x), Math.round(y)]
}

function shuffle<T>(array: T[]) {
	array.sort(() => Math.random() - 0.5)
	return array
}

function randomFloatBetween(min: number, max: number, seed: number): number {
	return min + seed * (max - min)
}

function randomIntBetween(min: number, max: number, seed: number): number {
	return Math.floor(randomFloatBetween(min, max, seed))
}

export type Seed = number

const CANVAS_WIDTH = 124
const CANVAS_HEIGHT = 124

const COLORS = [
	'#3479F6',
	'#34BF96',
	'#EFBD2D',
	'#97DC42',
	'#F28F47',
	'#7863F9',
	'#FF77DD',
]

const POSITIONS = [
	'-left-5 -top-3',
	'left-1/4 -top-6',
	'-right-7 -top-8',
	'-bottom-2 -left-5',
	'-bottom-10 left-1/4',
	'bottom-2 right-6',
	'-bottom-6 -right-8',
]
type BaseProps = {
	seed: Seed
	color: string
	index: number
	className?: string
}

function Blob({ seed, color, className, index }: BaseProps) {
	const edges = randomIntBetween(8, 36, seed)
	const blob = blobGenerator({
		size: randomFloatBetween(92, 108, seed),
		edges,
	})
	return (
		<svg
			id="craft-lab-logo"
			viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
			width={CANVAS_WIDTH}
			height={CANVAS_HEIGHT}
			xmlns="http://www.w3.org/2000/svg"
			className={clsx(
				className,
				POSITIONS[index] ?? POSITIONS[0]!,
				'absolute isolate',
			)}
		>
			<path
				d={blob.path}
				key={color}
				fill={color}
				className="mix-blend-screen"
			/>
		</svg>
	)
}
