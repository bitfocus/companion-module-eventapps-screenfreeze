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
		slots: [],
	}
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
