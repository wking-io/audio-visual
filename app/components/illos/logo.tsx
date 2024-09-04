import { type ComponentPropsWithoutRef } from 'react'

export default function Logo({ className }: ComponentPropsWithoutRef<'svg'>) {
	return (
		<svg
			aria-hidden
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 208.33 153.44"
			className={className}
		>
			<defs>
				<linearGradient
					id="baseGradient"
					x1="8.28"
					y1="84.22"
					x2="188.6"
					y2="84.22"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0" stopColor="#fb7878" />
					<stop offset="1" stopColor="#fb3865" />
				</linearGradient>
				<linearGradient
					id="darkGradient"
					x1="27.47"
					y1="129.59"
					x2="181.65"
					y2="129.59"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0" stopColor="#e8177b" />
					<stop offset="1" stopColor="#55023d" />
				</linearGradient>
			</defs>
			<path
				fill="url('#baseGradient')"
				d="M96.41,16l43,55.5,49.19-27.2-17.58,90.32c-2.6,10.62-29.29,17.82-73.87,17.82s-70.72-11.9-73.32-22.52L8.28,51.53l41.25,23.12L96.41,16Z"
			/>
			<path
				fill="url('#darkGradient')"
				d="M181.65,129.5c0,9.32-34.51,17.19-77.09,17.19s-77.09-9.84-77.09-17.19c0-7.77,34.51-17,77.09-17s77.09,7.68,77.09,17Z"
			/>
			<path
				className="text-gray-1100 fill-current"
				d="M104.16,153.44c-38.09,0-80.59-8.22-84.33-23.44v-.14L.07,34.19c-.41-2.01,.9-3.98,2.91-4.38,.86-.17,1.75-.04,2.52,.38l51.41,28.24L101.23,1.43c1.27-1.62,3.6-1.9,5.22-.64,.24,.19,.45,.4,.64,.64l44.32,57,51.41-28.24c1.8-.98,4.06-.32,5.05,1.48,.42,.77,.56,1.66,.38,2.52l-16.34,79.23c-.41,2.01-2.38,3.3-4.39,2.89-2.01-.41-3.3-2.38-2.88-4.39h0l14.71-71.36-47.14,25.89c-1.6,.87-3.61,.45-4.72-1L104.16,9.73l-43.33,55.75c-1.11,1.45-3.12,1.87-4.72,1L8.97,40.56l18.09,87.72c1.7,6.4,28.79,17.73,77.1,17.73s77-11,77-16.89-26.45-16.9-77-16.9c-25.33,0-48.71,3.33-67.61,9.63-2,.45-3.98-.81-4.43-2.81-.38-1.71,.49-3.46,2.09-4.19,19.64-6.54,43.83-10,70-10,21.86,0,42.46,2.18,58,6.15,17.54,4.48,26.43,10.59,26.43,18.17s-8.89,13.69-26.43,18.16c-15.59,3.92-36.19,6.11-58.05,6.11Z"
			/>
		</svg>
	)
}
