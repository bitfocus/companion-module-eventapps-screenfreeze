import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export type ScreenFreezeConfig = {
	host: string
	port: number
	poll: number
	warnSec: number
	dangerSec: number
}

// The auth token lives in the Companion secrets store ('secret-text' field), NOT in the
// config store — so it is excluded from config exports. Read it from the `secrets`
// parameter of init()/configUpdated(), never from the config object.
export type ScreenFreezeSecrets = {
	token: string
}

export function getConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'static-text',
			id: 'info',
			width: 12,
			label: 'ScreenFreeze',
			value:
				'Enable HTTP remote control in ScreenFreeze (Settings -> HTTP remote control). ' +
				'The token is optional - leave it blank unless you set one there.',
		},
		{ type: 'textinput', id: 'host', label: 'ScreenFreeze IP', width: 6, default: '', regex: Regex.IP },
		{ type: 'number', id: 'port', label: 'Port', width: 6, default: 8772, min: 1, max: 65535 },
		{ type: 'secret-text', id: 'token', label: 'Token (optional)', width: 12, default: '' },
		{ type: 'number', id: 'poll', label: 'Poll interval (ms)', width: 4, default: 250, min: 100, max: 2000 },
		{ type: 'number', id: 'warnSec', label: 'Amber countdown under (s)', width: 4, default: 20, min: 0, max: 600 },
		{ type: 'number', id: 'dangerSec', label: 'Red countdown under (s)', width: 4, default: 10, min: 0, max: 600 },
	]
}
