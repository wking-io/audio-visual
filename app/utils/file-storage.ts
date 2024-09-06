import { type FileStorage } from '@mjackson/file-storage'
import { LazyFile } from '@mjackson/lazy-file'

export class R2FileStorage implements FileStorage {
	#store: Env['BUCKET']
	#metadata: Record<string, R2Object>

	constructor(store: Env['BUCKET']) {
		this.#store = store
		this.#metadata = {}
	}
	/**
	 * Returns `true` if a file with the given key exists, `false` otherwise.
	 */
	async has(key: string): Promise<boolean> {
		const result = await this.#store.head(key)
		return Boolean(result)
	}

	/**
	 * Puts a file in storage at the given key.
	 */
	async set(key: string, file: File): Promise<void> {
		// Remove any existing file with the same key.
		await this.remove(key)
		const object = await this.#store.put(key, file)

		if (object) {
			this.#metadata[key] = object
		}
	}
	/**
	 * Returns the file with the given key, or `null` if no such key exists.
	 */
	async get(key: string): Promise<File | void> {
		const result = await this.#store.get(key)
		if (!result) return

		this.#metadata[key] = result

		const file = new LazyFile(
			[await result.blob()],
			`recording-${result.key}.webm`,
			{
				type: 'audio/webm',
				lastModified: result.uploaded.getTime(),
			},
		)

		return file
	}
	/**
	 * Removes the file with the given key from storage.
	 */
	remove(key: string): void | Promise<void> {
		this.#store.delete(key)
	}

	getMeta(key: string): R2Object | null {
		return this.#metadata[key] ?? null
	}
}
