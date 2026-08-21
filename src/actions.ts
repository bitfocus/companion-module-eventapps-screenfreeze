import type { CompanionActionDefinitions } from '@companion-module/base'
import type ScreenFreezeInstance from './main.js'
import { slotLabel } from './state.js'

type NoOptions = Record<string, never>
type SlotOptions = { n: string }

export type ActionsSchema = {
	top_show: { options: SlotOptions }
	bottom_show: { options: SlotOptions }
	freeze: { options: NoOptions }
	freeze_assign: { options: SlotOptions }
	follow: { options: NoOptions }
	hide: { options: { layer: 'both' | 'top' | 'bottom' } }
	stream: { options: { mode: 'toggle' | 'on' | 'off' } }
	record: { options: { mode: 'toggle' | 'on' | 'off' } }
}

const onOffQuery = (mode: string): string => (mode === 'on' ? '?on=1' : mode === 'off' ? '?on=0' : '')

export function buildActions(self: ScreenFreezeInstance): CompanionActionDefinitions<ActionsSchema> {
	const slotChoices = self.state.slots.map((e) => ({ id: e.id, label: slotLabel(e) }))
	const firstSlot = slotChoices[0]?.id ?? '1'

	return {
		top_show: {
			name: 'Top layer: show/toggle slot',
			options: [{ type: 'dropdown', id: 'n', label: 'Slot', default: firstSlot, choices: slotChoices }],
			callback: (a) => self.send(`/top?n=${a.options.n}`),
		},
		bottom_show: {
			name: 'Bottom layer: show/toggle slot',
			options: [{ type: 'dropdown', id: 'n', label: 'Slot', default: firstSlot, choices: slotChoices }],
			callback: (a) => self.send(`/bottom?n=${a.options.n}`),
		},
		freeze: { name: 'Freeze: toggle (num 0)', options: [], callback: () => self.send('/freeze') },
		freeze_assign: {
			name: 'Freeze: save the current capture into a slot',
			options: [{ type: 'dropdown', id: 'n', label: 'Slot', default: firstSlot, choices: slotChoices }],
			callback: (a) => self.send(`/freeze/assign?n=${a.options.n}`),
		},
		follow: { name: 'Follow: toggle', options: [], callback: () => self.send('/follow') },
		hide: {
			name: 'Hide layer(s)',
			options: [
				{
					type: 'dropdown',
					id: 'layer',
					label: 'Layer',
					default: 'both',
					choices: [
						{ id: 'both', label: 'Both layers' },
						{ id: 'top', label: 'Top' },
						{ id: 'bottom', label: 'Bottom' },
					],
				},
			],
			callback: (a) => self.send(a.options.layer === 'both' ? '/hide' : `/hide?layer=${a.options.layer}`),
		},
		stream: {
			name: 'Stream: start / stop / toggle',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Action',
					default: 'toggle',
					choices: [
						{ id: 'toggle', label: 'Toggle' },
						{ id: 'on', label: 'Start' },
						{ id: 'off', label: 'Stop' },
					],
				},
			],
			callback: (a) => self.send(`/stream${onOffQuery(a.options.mode)}`),
		},
		record: {
			name: 'Record: start / stop / toggle',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Action',
					default: 'toggle',
					choices: [
						{ id: 'toggle', label: 'Toggle' },
						{ id: 'on', label: 'Start' },
						{ id: 'off', label: 'Stop' },
					],
				},
			],
			callback: (a) => self.send(`/record${onOffQuery(a.options.mode)}`),
		},
	}
}
