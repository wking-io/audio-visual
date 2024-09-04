import { type Status } from '#app/components/status-button.js'

export function requestStateToStatus(
	requestState: 'loading' | 'idle' | 'submitting',
	result?: 'success' | 'error',
): Status {
	switch (requestState) {
		case 'loading':
		case 'submitting':
			return 'pending'
		case 'idle':
			if (result === 'success') return 'success'
			return 'idle'
	}
}
