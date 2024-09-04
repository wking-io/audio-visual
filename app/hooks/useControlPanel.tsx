import {
	Field,
	Fieldset,
	Input,
	Label,
	Legend,
	Popover,
	PopoverButton,
	PopoverPanel,
	Tab,
	TabGroup,
	TabList,
	TabPanel,
	TabPanels,
	Transition,
} from '@headlessui/react'
import * as Slider from '@radix-ui/react-slider'
import { hexToHsva, type HsvaColor } from '@uiw/color-convert'
import clsx from 'clsx'
import {
	Fragment,
	type PropsWithChildren,
	createContext,
	useContext,
	useState,
} from 'react'
import { Icon } from '#app/components/icon.js'

/**
 * Field Types
 */
interface FieldBase {
	name: string
	label?: string
}

interface PercentageField extends FieldBase {
	type: 'percentage'
	defaultValue?: number
}

interface ColorField extends FieldBase {
	type: 'color'
	defaultValue?: HsvaColor
}

interface VectorField extends FieldBase {
	type: 'vector'
	defaultValue?: [number, number]
}

export type Field = PercentageField | ColorField | VectorField

type FieldTypeMap = {
	[K in Field['type']]: NonNullable<Extract<Field, { type: K }>['defaultValue']>
}

type Result<T extends Field> = T & {
	value: FieldTypeMap[T['type']]
}

/**
 * Fieldset Types
 */

interface Fieldset {
	name: string
	label?: string
	fields: Field[]
}
/**
 * Conversion Types
 */
type ConvertFieldToResult<F extends Field> = {
	[K in F as K['name']]: FieldTypeMap[K['type']]
}

type ConvertSchemaToResult<S extends Fieldset> = {
	[K in S as K['name']]: ConvertFieldToResult<K['fields'][number]>
}

function getDefaultFieldValue<F extends Field>(
	field: F,
): FieldTypeMap[F['type']] {
	switch (field.type) {
		case 'percentage':
			return (field?.defaultValue ?? 50) as FieldTypeMap[F['type']]
		case 'color':
			return (field?.defaultValue ??
				hexToHsva('#000000')) as FieldTypeMap[F['type']]
		case 'vector':
			return (field?.defaultValue ?? [0, 0]) as FieldTypeMap[F['type']]
	}
}

// Function to generate fields with inferred types
function generateFields<const S extends Fieldset>(
	schema: S[],
): ConvertSchemaToResult<S> {
	const result: any = {}
	schema.forEach((fieldset) => {
		const fieldResult: any = {}
		fieldset.fields.forEach((field) => {
			fieldResult[field.name] = getDefaultFieldValue(field)
		})
		result[fieldset.name] = fieldResult
	})
	return result
}

export function createControlPanelContext<const S extends Fieldset>(
	schema: S[],
) {
	const fields = generateFields(schema)

	type FieldsetName = S['name']
	// S['fields']
	type FieldsOfFieldset<FN extends FieldsetName> = Extract<
		S,
		{ name: FN }
	>['fields']

	type FieldName<FN extends FieldsetName> = FieldsOfFieldset<FN>[number]['name']

	type FieldValue<FN extends FieldsetName, N extends FieldName<FN>> = Extract<
		FieldsOfFieldset<FN>[number],
		{ name: N }
	>['type'] extends keyof FieldTypeMap
		? FieldTypeMap[Extract<FieldsOfFieldset<FN>[number], { name: N }>['type']]
		: never

	type Getter = <FN extends FieldsetName, N extends FieldName<FN>>(p: {
		fieldsetKey: FN
		fieldKey: N
	}) => FieldValue<FN, N>
	type Setter = <FN extends FieldsetName, N extends FieldName<FN>>(p: {
		fieldsetKey: FN
		fieldKey: N
		value: FieldValue<FN, N>
	}) => void

	type ControlPanelState<S extends Fieldset> =
		| {
				state: 'inactive'
		  }
		| {
				state: 'active'
				schema: S[]
				data: ConvertSchemaToResult<S>
				get: Getter
				set: Setter
		  }

	const ControlPanelContext = createContext<ControlPanelState<S>>({
		state: 'inactive',
	})

	function useControlPanel() {
		const controlPanelData = useContext(ControlPanelContext)
		if (!controlPanelData) {
			throw new Error(
				'useControlPanel must be used within a ControlPanelProvider',
			)
		}
		return controlPanelData
	}

	/**
	 * Control Panel
	 */

	function Control<FN extends FieldsetName, F extends Field>({
		parent,
		...field
	}: F & { parent: FN }) {
		const panel = useControlPanel()
		if (panel.state === 'inactive') return null
		const fieldset = panel.data[parent] as any
		const { set } = panel

		function updateField<T>(value: T) {
			const fieldKey = field.name as FieldName<FN>
			const fieldValue = value as FieldValue<FN, FieldName<FN>>
			set({
				fieldsetKey: parent,
				fieldKey,
				value: fieldValue,
			})
		}

		switch (field.type) {
			case 'percentage':
				return (
					<PercentageControl
						{...(field as PercentageField)}
						value={fieldset[field.name]}
						updateField={updateField}
					/>
				)

			case 'vector':
				return (
					<VectorControl
						{...(field as VectorField)}
						value={fieldset[field.name]}
						updateField={updateField}
					/>
				)

			default:
				return null
		}
	}

	function ControlPanel() {
		const panel = useControlPanel()
		if (panel.state === 'inactive') return null
		const { schema } = panel
		return (
			<Popover className="fixed right-4 bottom-4 z-50">
				{({ open }) => (
					<>
						<PopoverButton className="bg-background border-foreground/10 hover:bg-layer data-[active]:bg-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-colors duration-200">
							<Transition
								show={!open}
								enter="delay-100 duration-200 ease-out"
								enterFrom="-rotate-20 opacity-0"
								enterTo="rotate-0 opacity-100"
								leave="duration-200 ease-out"
								leaveFrom="rotate-0 opacity-100"
								leaveTo="-rotate-20 opacity-0"
							>
								<Icon
									name="controller"
									className="absolute top-1/2 left-1/2 -translate-1/2 transition"
								/>
							</Transition>
							<Transition
								show={open}
								enter="delay-100 duration-200 ease-out"
								enterFrom="rotate-20 opacity-0"
								enterTo="rotate-0 opacity-100"
								leave="duration-200 ease-out"
								leaveFrom="rotate-0 opacity-100"
								leaveTo="rotate-20 opacity-0"
							>
								<Icon
									name="close"
									className="absolute top-1/2 left-1/2 -translate-1/2 transition"
									size="xs"
								/>
							</Transition>
						</PopoverButton>
						<Transition
							enter="duration-200 ease-out"
							enterFrom="translate-y-3 opacity-0"
							enterTo="translate-y-0 opacity-100"
							leave="duration-200 ease-out"
							leaveFrom="translate-y-0 opacity-100"
							leaveTo="translate-y-3 opacity-0"
						>
							<PopoverPanel anchor="top end" className="pb-3 transition">
								<div className="bg-background border-foreground/10 flex h-56 w-64 flex-col overflow-hidden rounded-lg border">
									<TabGroup as={Fragment}>
										<TabList className="no-scrollbar flex overflow-x-auto overflow-y-hidden">
											{schema.map(({ name, label }) => (
												<Tab
													key={name}
													className="data-[selected]:bg-layer text-foreground/75 data-[selected]:text-primary data-[hover]:text-foreground shrink-0 py-1.5 px-3 text-[10px] font-medium uppercase tracking-wide"
												>
													{label ?? name}
												</Tab>
											))}
										</TabList>
										<TabPanels as={Fragment}>
											{schema.map(({ name, label, fields }) => {
												return (
													<TabPanel key={name} className="bg-layer h-full p-4">
														<Fieldset>
															<Legend className="sr-only">
																{label ?? name}
															</Legend>
															<div className="mt-4 flex flex-col gap-4">
																{fields.map((field) => (
																	<Control
																		key={field.name}
																		{...field}
																		parent={name}
																	/>
																))}
															</div>
														</Fieldset>
													</TabPanel>
												)
											})}
										</TabPanels>
									</TabGroup>
								</div>
							</PopoverPanel>
						</Transition>
					</>
				)}
			</Popover>
		)
	}

	function ControlPanelProvider({
		show,
		children,
	}: {
		show: boolean
		children: React.ReactNode
	}) {
		const [data, setData] = useState<ConvertSchemaToResult<S>>(fields)

		const set: Setter = ({ fieldsetKey, fieldKey, value }) => {
			setData((prevData) => {
				const newData = { ...prevData }
				const fieldset = newData[fieldsetKey] as any
				fieldset[fieldKey] = value
				return { ...prevData, data: newData }
			})
		}

		const get: Getter = ({ fieldsetKey, fieldKey }) => {
			const fieldset = data[fieldsetKey] as any
			return fieldset[fieldKey]
		}

		return (
			<ControlPanelContext.Provider
				value={
					show
						? { state: 'active', schema, data, set, get }
						: { state: 'inactive' }
				}
			>
				{children}
				<ControlPanel />
			</ControlPanelContext.Provider>
		)
	}

	return [useControlPanel, ControlPanelProvider] as const
}

type PercentageControlProps = Result<PercentageField> & {
	updateField: (v: FieldTypeMap['percentage']) => void
}

function PercentageControl({
	name,
	label,
	value,
	updateField,
}: PercentageControlProps) {
	return (
		<Field>
			<div className="flex justify-between">
				<Label className="font-mono text-xs">{label ?? name}</Label>
				<p className="font-mono text-xs">{value}%</p>
			</div>
			<Slider.Root
				className="relative mt-2 flex h-1 w-full items-center"
				value={[value]}
				onValueChange={([newValue]) => updateField(newValue)}
				min={0}
				max={100}
			>
				<Slider.Track className="bg-foreground/10 relative h-full w-full rounded-full">
					<Slider.Range className="bg-primary absolute h-full rounded-full" />
				</Slider.Track>
				<Slider.Thumb
					className="bg-background border-foreground/10 block h-4 w-4 rounded-full border"
					aria-label="Percentage"
				/>
			</Slider.Root>
		</Field>
	)
}

type VectorControlProps = Result<VectorField> & {
	updateField: (v: FieldTypeMap['vector']) => void
}

function VectorControl({
	name,
	label,
	value,
	updateField,
}: VectorControlProps) {
	const [x, y] = value
	return (
		<Fieldset>
			<Legend className="font-mono text-xs">{label ?? name}</Legend>
			<div className="mt-2 grid grid-cols-2 gap-2">
				<Field className="border-foreground/10 focus-within:border-primary group/field flex rounded border transition-colors">
					<ControlLabel className="bg-foreground/10 group-focus-within/field:bg-primary flex shrink-0 items-center justify-center px-2 transition-colors">
						X
					</ControlLabel>
					<Input
						className="w-full border-0 py-1 px-2 text-xs focus:outline-none"
						type="number"
						value={x}
						onChange={(e) => {
							if (e.target.valueAsNumber) {
								updateField([e.target.valueAsNumber, y])
							}
						}}
					/>
				</Field>
				<Field className="border-foreground/10 focus-within:border-primary group/field flex rounded border transition-colors">
					<ControlLabel className="bg-foreground/10 group-focus-within/field:bg-primary flex shrink-0 items-center justify-center px-2 transition-colors">
						Y
					</ControlLabel>
					<Input
						className="w-full border-0 py-1 px-2 text-xs focus:outline-none"
						type="number"
						value={y}
						onChange={(e) => {
							if (e.target.valueAsNumber) {
								updateField([x, e.target.valueAsNumber])
							}
						}}
					/>
				</Field>
			</div>
		</Fieldset>
	)
}

function ControlLabel({
	children,
	className,
}: PropsWithChildren<{ className?: string }>) {
	return (
		<Label className={clsx(className, 'font-mono text-xs')}>{children}</Label>
	)
}
