import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export type ScreenFreezeConfig = {
	host: string
	port: number
	token: string
	poll: number
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
		{ type: 'textinput', id: 'token', label: 'Token (optional)', width: 12, default: '' },
		{ type: 'number', id: 'poll', label: 'Poll interval (ms)', width: 4, default: 250, min: 100, max: 2000 },
	]
}
