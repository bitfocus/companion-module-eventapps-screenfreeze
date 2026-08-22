import { combineRgb, type CompanionPresetDefinitions, type CompanionPresetSection } from '@companion-module/base'
import type ScreenFreezeInstance from './main.js'
import type { ScreenFreezeSchema } from './main.js'

const WHITE = combineRgb(255, 255, 255)
const BLACK = combineRgb(0, 0, 0)
const DARK = combineRgb(20, 22, 30)
const RED = combineRgb(180, 40, 40)
const AMBER = combineRgb(255, 176, 0)
// Tally palette (matches the app): TOP red / BOTTOM blue; live/rec red for stream+record.
const TALLY_TOP = combineRgb(255, 92, 108)
const TALLY_BOTTOM = combineRgb(91, 141, 239)
const LIVE_RED = combineRgb(255, 30, 30)
const FREEZE_RED = combineRgb(255, 92, 108) // app FreezeColor #FF5C6C
const FOLLOW_BLUE = combineRgb(91, 141, 239) // tally blue #5B8DEF

const CENTER = 'center:center' as const

export interface ScreenFreezePresets {
	structure: CompanionPresetSection<ScreenFreezeSchema>[]
	presets: CompanionPresetDefinitions<ScreenFreezeSchema>
}

export function buildPresets(self: ScreenFreezeInstance): ScreenFreezePresets {
	const L = self.label
	const presets: CompanionPresetDefinitions<ScreenFreezeSchema> = {}

	presets['freeze'] = {
		type: 'simple',
		name: 'Freeze (toggle)',
		style: { text: 'FREEZE', size: '14', color: WHITE, bgcolor: DARK, alignment: CENTER },
		steps: [{ down: [{ actionId: 'freeze', options: {} }], up: [] }],
		feedbacks: [{ feedbackId: 'freeze_on', options: {}, style: { bgcolor: FREEZE_RED, color: WHITE } }],
	}
	presets['follow'] = {
		type: 'simple',
		name: 'Follow (toggle)',
		style: { text: 'FOLLOW', size: '14', color: WHITE, bgcolor: DARK, alignment: CENTER },
		steps: [{ down: [{ actionId: 'follow', options: {} }], up: [] }],
		feedbacks: [
			{ feedbackId: 'follow_on', options: {}, style: { bgcolor: FOLLOW_BLUE, color: WHITE } },
			{ feedbackId: 'follow_holding', options: {}, style: { bgcolor: AMBER, color: BLACK } },
		],
	}
	presets['hide_all'] = {
		type: 'simple',
		name: 'Hide both layers',
		style: { text: 'HIDE', size: '18', color: WHITE, bgcolor: RED, alignment: CENTER },
		steps: [{ down: [{ actionId: 'hide', options: { layer: 'both' } }], up: [] }],
		feedbacks: [],
	}
	presets['hide_top'] = {
		type: 'simple',
		name: 'Hide top layer',
		style: { text: 'HIDE ▲', size: '18', color: WHITE, bgcolor: RED, alignment: CENTER },
		steps: [{ down: [{ actionId: 'hide', options: { layer: 'top' } }], up: [] }],
		feedbacks: [],
	}
	presets['hide_bottom'] = {
		type: 'simple',
		name: 'Hide bottom layer',
		style: { text: 'HIDE ▼', size: '18', color: WHITE, bgcolor: TALLY_BOTTOM, alignment: CENTER },
		steps: [{ down: [{ actionId: 'hide', options: { layer: 'bottom' } }], up: [] }],
		feedbacks: [],
	}
	presets['stream'] = {
		type: 'simple',
		name: 'Stream (toggle)',
		style: { text: 'STREAM', size: '14', color: WHITE, bgcolor: DARK, alignment: CENTER },
		steps: [{ down: [{ actionId: 'stream', options: { mode: 'toggle' } }], up: [] }],
		feedbacks: [
			{ feedbackId: 'stream_on', options: {}, style: { bgcolor: LIVE_RED, color: WHITE } },
			{ feedbackId: 'stream_trouble', options: {}, style: { bgcolor: AMBER, color: BLACK } },
			{ feedbackId: 'stream_timer', options: {} },
		],
	}
	presets['record'] = {
		type: 'simple',
		name: 'Record (toggle)',
		style: { text: 'REC', size: '14', color: WHITE, bgcolor: DARK, alignment: CENTER },
		steps: [{ down: [{ actionId: 'record', options: { mode: 'toggle' } }], up: [] }],
		feedbacks: [
			{ feedbackId: 'record_on', options: {}, style: { bgcolor: LIVE_RED, color: WHITE } },
			{ feedbackId: 'record_trouble', options: {}, style: { bgcolor: AMBER, color: BLACK } },
			{ feedbackId: 'record_timer', options: {} },
		],
	}

	presets['now_top'] = {
		type: 'simple',
		name: 'Top layer: now playing + countdown',
		style: { text: `TOP\n$(${L}:top_name)`, size: '14', color: WHITE, bgcolor: DARK, alignment: CENTER },
		steps: [{ down: [{ actionId: 'hide', options: { layer: 'top' } }], up: [] }],
		feedbacks: [{ feedbackId: 'top_countdown', options: {} }],
	}
	presets['now_bottom'] = {
		type: 'simple',
		name: 'Bottom layer: now playing + countdown',
		style: { text: `BOT\n$(${L}:bottom_name)`, size: '14', color: WHITE, bgcolor: DARK, alignment: CENTER },
		steps: [{ down: [{ actionId: 'hide', options: { layer: 'bottom' } }], up: [] }],
		feedbacks: [{ feedbackId: 'bottom_countdown', options: {} }],
	}

	// per-slot buttons for each layer: label = slot name (auto-fit); active slot -> green
	const topIds: string[] = []
	const bottomIds: string[] = []
	for (const e of self.state.slots) {
		const top = 'top_' + e.id
		topIds.push(top)
		presets[top] = {
			type: 'simple',
			name: `Top ${e.n}: ${e.name || '(empty)'}`,
			style: {
				text: e.name || String(e.n),
				size: e.name ? '14' : 'auto',
				color: WHITE,
				bgcolor: DARK,
				alignment: CENTER,
			},
			steps: [{ down: [{ actionId: 'top_show', options: { n: e.id } }], up: [] }],
			feedbacks: [{ feedbackId: 'top_active', options: { n: e.id }, style: { bgcolor: TALLY_TOP, color: WHITE } }],
		}
		const bottom = 'bottom_' + e.id
		bottomIds.push(bottom)
		presets[bottom] = {
			type: 'simple',
			name: `Bottom ${e.n}: ${e.name || '(empty)'}`,
			style: {
				text: e.name || String(e.n),
				size: e.name ? '14' : 'auto',
				color: WHITE,
				bgcolor: DARK,
				alignment: CENTER,
			},
			steps: [{ down: [{ actionId: 'bottom_show', options: { n: e.id } }], up: [] }],
			feedbacks: [
				{ feedbackId: 'bottom_active', options: { n: e.id }, style: { bgcolor: TALLY_BOTTOM, color: WHITE } },
			],
		}
	}

	const structure: CompanionPresetSection<ScreenFreezeSchema>[] = [
		{
			id: 'control',
			name: 'Control',
			definitions: ['freeze', 'follow', 'hide_all', 'hide_top', 'hide_bottom', 'stream', 'record'],
		},
		{ id: 'playing', name: 'Now playing', definitions: ['now_top', 'now_bottom'] },
		{ id: 'top', name: 'Top layer', definitions: topIds },
		{ id: 'bottom', name: 'Bottom layer', definitions: bottomIds },
	]

	return { structure, presets }
}
