import { guideIconList } from '#/app/utils/tailwind-constants.ts'

export default function ProsAndCons({
	pros,
	cons,
}: {
	pros: string[]
	cons: string[]
}) {
	return (
		<>
			<h2>Pros & Cons</h2>
			<ul className="not-prose ml-0 list-none pl-0">
				{pros.map((pro) => (
					<li className={guideIconList.container} key={pro}>
						<span className={guideIconList.icon}>✅</span>
						<span className={guideIconList.text}>{pro}</span>
					</li>
				))}
			</ul>
			<ul className="not-prose ml-0 list-none pl-0">
				{cons.map((con) => (
					<li className={guideIconList.container} key={con}>
						<span className={guideIconList.icon}>❌</span>
						<span className={guideIconList.text}>{con}</span>
					</li>
				))}
			</ul>
		</>
	)
}
