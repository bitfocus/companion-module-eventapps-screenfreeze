import { combineRgb, type CompanionFeedbackDefinitions } from '@companion-module/base'
import type ScreenFreezeInstance from './main.js'
import { slotLabel } from './state.js'

const GREEN = combineRgb(0, 140, 60)
const BLUE = combineRgb(40, 90, 200)

type NoOptions = Record<string, never>
type SlotOptions = { n: string }

export type FeedbacksSchema = {
	top_active: { type: 'boolean'; options: SlotOptions }
	bottom_active: { type: 'boolean'; options: SlotOptions }
	freeze_on: { type: 'boolean'; options: NoOptions }
	follow_on: { type: 'boolean'; options: NoOptions }
	follow_holding: { type: 'boolean'; options: NoOptions }
	stream_on: { type: 'boolean'; options: NoOptions }
	record_on: { type: 'boolean'; options: NoOptions }
}

export function buildFeedbacks(self: ScreenFreezeInstance): CompanionFeedbackDefinitions<FeedbacksSchema> {
	const slotChoices = self.state.slots.map((e) => ({ id: e.id, label: slotLabel(e) }))
	const firstSlot = slotChoices[0]?.id ?? '1'

	return {
		top_active: {
			type: 'boolean',
			name: 'Top layer: slot is active (green background)',
			defaultStyle: { bgcolor: GREEN },
			options: [{ type: 'dropdown', id: 'n', label: 'Slot', default: firstSlot, choices: slotChoices }],
			callback: (fb) => self.state.top === Number(fb.options.n),
		},
		bottom_active: {
			type: 'boolean',
			name: 'Bottom layer: slot is active (green background)',
			defaultStyle: { bgcolor: GREEN },
			options: [{ type: 'dropdown', id: 'n', label: 'Slot', default: firstSlot, choices: slotChoices }],
			callback: (fb) => self.state.bottom === Number(fb.options.n),
		},
		freeze_on: {
			type: 'boolean',
			name: 'Freeze is active (green background)',
			defaultStyle: { bgcolor: GREEN },
			options: [],
			callback: () => self.state.freeze,
		},
		follow_on: {
			type: 'boolean',
			name: 'Follow is ON (green background)',
			defaultStyle: { bgcolor: GREEN },
			options: [],
			callback: () => self.state.follow,
		},
		follow_holding: {
			type: 'boolean',
			name: 'Follow is holding a frame (blue background)',
			defaultStyle: { bgcolor: BLUE },
			options: [],
			callback: () => self.state.followHolding,
		},
		stream_on: {
			type: 'boolean',
			name: 'Streaming is running (green background)',
			defaultStyle: { bgcolor: GREEN },
			options: [],
			callback: () => self.state.stream > 0,
		},
		record_on: {
			type: 'boolean',
			name: 'Recording is running (green background)',
			defaultStyle: { bgcolor: GREEN },
			options: [],
			callback: () => self.state.record > 0,
		},
	}
}
