import CryptoJS from 'crypto-js'
import { type HoneypotInputProps } from './honeypot.tsx'

export interface HonetpotConfig {
	randomizeNameFieldName?: boolean
	nameFieldName?: string
	validFromFieldName?: string
	validFromTimestamp?: number
	amountOfSeconds?: number
	honeypotFieldsRequiredForAllForms?: boolean
	encryptionSeed?: string
}

export class SpamError extends Error {}

export class Honeypot {
	protected config: HonetpotConfig = {}
	constructor(config?: HonetpotConfig) {
		if (config) {
			this.config = config
		}
	}

	public getInputProps(): HoneypotInputProps {
		return {
			nameFieldName: this.nameFieldName,
			validFromFieldName: this.validFromFieldName,
			encryptedValidFrom: this.encrypt(this.validFromTimestamp.toString()),
		}
	}

	public check(formData: FormData) {
		let nameFieldName = this.config.nameFieldName ?? 'honeypot'
		if (this.config.randomizeNameFieldName) {
			let actualName = this.getRandomizedNameFieldName(nameFieldName, formData)
			if (actualName) nameFieldName = actualName
		}

		if (!this.shouldCheckHoneypot(formData, nameFieldName)) return

		if (!formData.has(nameFieldName)) {
			throw new SpamError('Missing honeypot input')
		}

		let honeypotValue = formData.get(nameFieldName)

		if (honeypotValue !== '') throw new SpamError('Honeypot input not empty')
		if (!this.config.validFromTimestamp) return

		let validFrom = formData.get(this.validFromFieldName)

		if (!validFrom) throw new SpamError('Missing honeypot valid from input')

		let time = this.decrypt(validFrom as string)
		if (!time) throw new SpamError('Invalid honeypot valid from input')
		if (!this.isValidTimeStamp(Number(time))) {
			throw new SpamError('Invalid honeypot valid from input')
		}

		if (this.isFuture(Number(time))) {
			throw new SpamError('Honeypot valid from is in future')
		}
	}

	protected get nameFieldName() {
		let fieldName = this.config.nameFieldName ?? 'honeypot'
		if (!this.config.randomizeNameFieldName) return fieldName
		return `${fieldName}_${this.randomValue()}`
	}

	protected get validFromFieldName() {
		return this.config.validFromFieldName ?? 'honeypot_from'
	}

	protected get validFromTimestamp() {
		return this.config.validFromTimestamp ?? Date.now()
	}

	protected get encryptionSeed() {
		return this.config.encryptionSeed ?? this.randomValue()
	}

	protected getRandomizedNameFieldName(
		nameFieldName: string,
		formData: FormData,
	): string | undefined {
		for (let key of formData.keys()) {
			if (!key.startsWith(nameFieldName)) continue
			return key
		}
	}

	protected shouldCheckHoneypot(
		formData: FormData,
		nameFieldName: string,
	): boolean {
		return formData.has(nameFieldName) || formData.has(this.validFromFieldName)
	}

	protected randomValue() {
		return CryptoJS.lib.WordArray.random(128 / 8).toString()
	}

	protected encrypt(value: string) {
		return CryptoJS.AES.encrypt(value, this.encryptionSeed).toString()
	}

	protected decrypt(value: string) {
		return CryptoJS.AES.decrypt(value, this.encryptionSeed).toString(
			CryptoJS.enc.Utf8,
		)
	}

	protected isFuture(timestamp: number) {
		return timestamp > Date.now()
	}

	protected isValidTimeStamp(timestampp: number) {
		if (Number.isNaN(timestampp)) return false
		if (timestampp <= 0) return false
		if (timestampp >= Number.MAX_SAFE_INTEGER) return false
		return true
	}
}

export function makeHoneypot(encryptionSeed: string) {
	return new Honeypot({
		encryptionSeed: encryptionSeed,
	})
}

export function checkHoneypot(honeypot: Honeypot, formData: FormData) {
	try {
		honeypot.check(formData)
	} catch (error) {
		if (error instanceof SpamError) {
			throw new Response('Form not submitted properly', { status: 400 })
		}
		throw error
	}
}
