import {
	type SVGMotionProps,
	useScroll,
	useTransform,
	motion,
} from 'framer-motion'
import { useMemo, useRef } from 'react'

const SPACING = 10

export function Timeline({ height }: { height: number }) {
	const dots = useMemo(() => Array.from({ length: height / SPACING }), [height])
	return (
		<svg width="1" height={height}>
			{dots.map((_, index) => {
				return <Dash key={index} index={index} />
			})}
		</svg>
	)
}

function Dash({
	index,
	...props
}: SVGMotionProps<SVGPolylineElement> & { index: number }) {
	const ref = useRef(null)
	const { scrollYProgress } = useScroll({ target: ref })
	const length = useTransform(
		scrollYProgress,
		[0, 0.4, 0.45, 0.55, 0.6, 1],
		[0.1, 0.5, 1, 1, 0.5, 0.1],
	)
	const xPosition = index * SPACING

	return (
		<motion.polyline
			ref={ref}
			points={`0,${xPosition - SPACING / 2} 0,${xPosition + SPACING / 2}`}
			pathLength={1}
			style={{ pathLength: length, transformOrigin: 'center' }}
			className="text-foreground stroke-current"
			initial="hidden"
			whileInView="visible"
			{...props}
		/>
	)
}
