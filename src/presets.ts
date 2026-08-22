import { combineRgb, type CompanionPresetDefinitions, type CompanionPresetSection } from '@companion-module/base'
import type ScreenFreezeInstance from './main.js'
import type { ScreenFreezeSchema } from './main.js'

const WHITE = combineRgb(255, 255, 255)
const DARK = combineRgb(20, 22, 30)
const GREEN = combineRgb(0, 160, 70)
const RED = combineRgb(180, 40, 40)
const BLUE = combineRgb(40, 90, 200)

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
		style: { text: 'FREEZE', size: '18', color: WHITE, bgcolor: DARK, alignment: CENTER },
		steps: [{ down: [{ actionId: 'freeze', options: {} }], up: [] }],
		feedbacks: [{ feedbackId: 'freeze_on', options: {}, style: { bgcolor: GREEN } }],
	}
	presets['follow'] = {
		type: 'simple',
		name: 'Follow (toggle)',
		style: { text: 'FOLLOW', size: '18', color: WHITE, bgcolor: DARK, alignment: CENTER },
		steps: [{ down: [{ actionId: 'follow', options: {} }], up: [] }],
		feedbacks: [
			{ feedbackId: 'follow_on', options: {}, style: { bgcolor: GREEN } },
			{ feedbackId: 'follow_holding', options: {}, style: { bgcolor: BLUE } },
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
		style: { text: 'HIDE ▼', size: '18', color: WHITE, bgcolor: RED, alignment: CENTER },
		steps: [{ down: [{ actionId: 'hide', options: { layer: 'bottom' } }], up: [] }],
		feedbacks: [],
	}
	presets['stream'] = {
		type: 'simple',
		name: 'Stream (toggle)',
		style: { text: 'STREAM', size: '14', color: WHITE, bgcolor: DARK, alignment: CENTER },
		steps: [{ down: [{ actionId: 'stream', options: { mode: 'toggle' } }], up: [] }],
		feedbacks: [{ feedbackId: 'stream_on', options: {}, style: { bgcolor: GREEN } }],
	}
	presets['record'] = {
		type: 'simple',
		name: 'Record (toggle)',
		style: { text: 'REC', size: '18', color: WHITE, bgcolor: DARK, alignment: CENTER },
		steps: [{ down: [{ actionId: 'record', options: { mode: 'toggle' } }], up: [] }],
		feedbacks: [{ feedbackId: 'record_on', options: {}, style: { bgcolor: GREEN } }],
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
			style: { text: e.name || String(e.n), size: 'auto', color: WHITE, bgcolor: DARK, alignment: CENTER },
			steps: [{ down: [{ actionId: 'top_show', options: { n: e.id } }], up: [] }],
			feedbacks: [{ feedbackId: 'top_active', options: { n: e.id }, style: { bgcolor: GREEN } }],
		}
		const bottom = 'bottom_' + e.id
		bottomIds.push(bottom)
		presets[bottom] = {
			type: 'simple',
			name: `Bottom ${e.n}: ${e.name || '(empty)'}`,
			style: { text: e.name || String(e.n), size: 'auto', color: WHITE, bgcolor: DARK, alignment: CENTER },
			steps: [{ down: [{ actionId: 'bottom_show', options: { n: e.id } }], up: [] }],
			feedbacks: [{ feedbackId: 'bottom_active', options: { n: e.id }, style: { bgcolor: GREEN } }],
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
