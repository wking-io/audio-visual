import { type ReactNode } from 'react'
import { guideIconList } from '#/app/utils/tailwind-constants.ts'

export default function TipsAndTricks({
	items,
}: {
	items: (string | ReactNode)[]
}) {
	return (
		<>
			<h2>Tips & Tricks</h2>
			<ul className="not-prose ml-0 list-none pl-0">
				{items.map((item, i) => (
					<li className={guideIconList.container} key={`tiptrick-${i}`}>
						<span className={guideIconList.icon}>👉</span>
						<span className={guideIconList.text}>{item}</span>
					</li>
				))}
			</ul>
		</>
	)
}
