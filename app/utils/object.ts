export type UnknownObject = Record<string, unknown>

/**
 * Type guard to check if an item is an object
 */
export function isObject<T extends UnknownObject>(
	val: T,
): val is Extract<T, UnknownObject>
export function isObject(val: unknown): val is UnknownObject
export function isObject<T>(val: T) {
	return typeof val === 'object' && val !== null && !Array.isArray(val)
}

/**
 * Type guard to check if an object has a particular key
 * @param obj - Object to check
 * @param key - Key to check for
 */
export function isObjectWithKey<O, K extends string>(
	obj: O,
	key: K,
): obj is O & Record<K, K extends keyof O ? O[K] : unknown> {
	return isObject(obj) && key in obj
}
