// Shape of GET /state returned by ScreenFreeze (see HttpControlService.Snapshot / StateDto).

export interface SlotEntry {
	id: string // "1".."9" (stable slot number, used as the dropdown value)
	n: number
	name: string
	kind: string
	empty: boolean
}

export interface SFState {
	app: string
	version: string
	top: number // active slot in the TOP layer (0 = none)
	bottom: number // active slot in the BOTTOM layer (0 = none)
	freeze: boolean
	hasFreeze: boolean
	follow: boolean
	followHolding: boolean
	followHoldSec: number
	stream: number // 0 off, 1 running, 2 running with a problem
	record: number // 0 off, 1 running, 2 running with a problem
	topPlaying: boolean // a video is playing in the top layer (images/web/NDI = false)
	topElapsedMs: number
	topLengthMs: number
	topRemainingMs: number
	bottomPlaying: boolean
	bottomElapsedMs: number
	bottomLengthMs: number
	bottomRemainingMs: number
	slots: SlotEntry[]
}

export function emptyState(): SFState {
	return {
		app: 'screenfreeze',
		version: '',
		top: 0,
		bottom: 0,
		freeze: false,
		hasFreeze: false,
		follow: false,
		followHolding: false,
		followHoldSec: 0,
		stream: 0,
		record: 0,
		topPlaying: false,
		topElapsedMs: 0,
		topLengthMs: 0,
		topRemainingMs: 0,
		bottomPlaying: false,
		bottomElapsedMs: 0,
		bottomLengthMs: 0,
		bottomRemainingMs: 0,
		slots: [],
	}
}

// milliseconds -> "m:ss"
export function fmtClock(ms: number): string {
	if (!isFinite(ms) || ms < 0) ms = 0
	const total = Math.floor(ms / 1000)
	const m = Math.floor(total / 60)
	const s = total % 60
	return m + ':' + String(s).padStart(2, '0')
}

// Signature of the slot LIST (ids + labels + kind + empty). When it changes we rebuild
// dropdown choices, per-slot variables and presets.
export function listSignature(s: SFState): string {
	return JSON.stringify(s.slots.map((e) => [e.id, e.name, e.kind, e.empty]))
}

// Human label for a slot dropdown / preset: "3 — Intro" or "3 — (empty)".
export function slotLabel(e: SlotEntry): string {
	if (e.empty) return `${e.n} — —`
	const text = e.name || e.kind || ''
	return text ? `${e.n} — ${text}` : String(e.n)
}
