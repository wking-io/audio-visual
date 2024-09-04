import { type ReactNode, Fragment, useState } from 'react'
import Button from '#/app/components/kits/Button.tsx'
import { randomKey } from '#/app/utils/index.ts'

export function useListField<T extends { id: string }>(
	items?: T[],
): { list: string[]; add(): void; remove?: (key: string) => void } {
	const [list, setList] = useState(
		items && items.length > 0 ? items.map(({ id }) => id) : [randomKey()],
	)

	function add() {
		setList((prev) => [...prev, randomKey()])
	}

	function remove(key: string) {
		setList((prev) => prev.filter((k) => k !== key))
	}

	const showRemove = list.length > 1

	return { list, add, remove: showRemove ? remove : undefined }
}

export default function ListField<T extends { id: string }>({
	items,
	children,
	buttonLabel = 'Add another',
}: {
	items?: T[]
	buttonLabel?: string
	children(args: {
		uid: string
		order: number
		item?: T
		remove?: (id: string) => void
	}): ReactNode
}) {
	const { list, add, remove } = useListField(items)

	return (
		<div>
			<div className="grid gap-6">
				{list.map((uid, order) => {
					const item = items?.find(({ id }) => id === uid)
					return (
						<Fragment key={uid}>
							{children({
								uid,
								order,
								remove,
								item,
							})}
						</Fragment>
					)
				})}
			</div>
			<div className="pt-6">
				<Button type="button" onClick={add}>
					{buttonLabel}
				</Button>
			</div>
		</div>
	)
}
