import { combineRgb, type CompanionFeedbackDefinitions } from '@companion-module/base'
import type ScreenFreezeInstance from './main.js'
import { fmtClock, slotLabel } from './state.js'

const GREEN = combineRgb(0, 140, 60)
const BLUE = combineRgb(40, 90, 200)
const AMBER = combineRgb(255, 176, 0)
const RED = combineRgb(255, 64, 64)
const WHITE = combineRgb(255, 255, 255)
const BLACK = combineRgb(0, 0, 0)
// Tally palette (matches the app: TOP red / BOTTOM blue) + live/rec red.
const TALLY_TOP = combineRgb(255, 92, 108)
const TALLY_BOTTOM = combineRgb(91, 141, 239)
const LIVE_RED = combineRgb(255, 30, 30)

// Big, centred countdown text that overrides the button label while a video plays.
const COUNTDOWN_SIZE = 22

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
	stream_trouble: { type: 'boolean'; options: NoOptions }
	record_trouble: { type: 'boolean'; options: NoOptions }
	top_countdown: { type: 'advanced'; options: NoOptions }
	bottom_countdown: { type: 'advanced'; options: NoOptions }
	stream_timer: { type: 'advanced'; options: NoOptions }
	record_timer: { type: 'advanced'; options: NoOptions }
}

export function buildFeedbacks(self: ScreenFreezeInstance): CompanionFeedbackDefinitions<FeedbacksSchema> {
	const slotChoices = self.state.slots.map((e) => ({ id: e.id, label: slotLabel(e) }))
	const firstSlot = slotChoices[0]?.id ?? '1'

	const remColor = (remainingMs: number): number => {
		const sec = remainingMs / 1000
		if (sec <= self.config.dangerSec) return RED
		if (sec <= self.config.warnSec) return AMBER
		return WHITE
	}
	const countdown = (remainingMs: number) => ({
		text: '-' + fmtClock(remainingMs),
		size: COUNTDOWN_SIZE,
		alignment: 'center:center' as const,
		color: remColor(remainingMs),
	})

	return {
		top_active: {
			type: 'boolean',
			name: 'Top layer: slot is active (red background)',
			defaultStyle: { bgcolor: TALLY_TOP, color: WHITE },
			options: [{ type: 'dropdown', id: 'n', label: 'Slot', default: firstSlot, choices: slotChoices }],
			callback: (fb) => self.state.top === Number(fb.options.n),
		},
		bottom_active: {
			type: 'boolean',
			name: 'Bottom layer: slot is active (blue background)',
			defaultStyle: { bgcolor: TALLY_BOTTOM, color: WHITE },
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
			name: 'Streaming is running (red background)',
			defaultStyle: { bgcolor: LIVE_RED, color: WHITE },
			options: [],
			callback: () => self.state.stream > 0,
		},
		record_on: {
			type: 'boolean',
			name: 'Recording is running (red background)',
			defaultStyle: { bgcolor: LIVE_RED, color: WHITE },
			options: [],
			callback: () => self.state.record > 0,
		},
		stream_trouble: {
			type: 'boolean',
			name: 'Streaming has a problem (amber background) — layer over "Streaming is running"',
			defaultStyle: { bgcolor: AMBER, color: BLACK },
			options: [],
			callback: () => self.state.stream === 2,
		},
		record_trouble: {
			type: 'boolean',
			name: 'Recording has a problem (amber background) — layer over "Recording is running"',
			defaultStyle: { bgcolor: AMBER, color: BLACK },
			options: [],
			callback: () => self.state.record === 2,
		},
		top_countdown: {
			type: 'advanced',
			name: 'Top layer video countdown (centred, amber/red) — overrides label while playing',
			options: [],
			callback: () => (self.state.topPlaying ? countdown(self.state.topRemainingMs) : {}),
		},
		bottom_countdown: {
			type: 'advanced',
			name: 'Bottom layer video countdown (centred, amber/red) — overrides label while playing',
			options: [],
			callback: () => (self.state.bottomPlaying ? countdown(self.state.bottomRemainingMs) : {}),
		},
		stream_timer: {
			type: 'advanced',
			name: 'Streaming elapsed time (centred) — overrides label while running',
			options: [],
			callback: () =>
				self.state.stream > 0
					? { text: fmtClock(self.state.streamElapsedSec * 1000), size: 18, alignment: 'center:center' as const }
					: {},
		},
		record_timer: {
			type: 'advanced',
			name: 'Recording elapsed time (centred) — overrides label while running',
			options: [],
			callback: () =>
				self.state.record > 0
					? { text: fmtClock(self.state.recordElapsedSec * 1000), size: 18, alignment: 'center:center' as const }
					: {},
		},
	}
}
