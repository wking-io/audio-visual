const onlyNumbersRegex = /^\d+$/
export function isNumberParam(param: string): boolean {
	return onlyNumbersRegex.test(param)
}
