import type { CompanionVariableDefinitions, CompanionVariableValue } from '@companion-module/base'
import type ScreenFreezeInstance from './main.js'
import type { SFState } from './state.js'

// Per-slot variable ids are generated, so the schema is an open map.
export type VariablesSchema = Record<string, CompanionVariableValue>

export function buildVariables(self: ScreenFreezeInstance): CompanionVariableDefinitions<VariablesSchema> {
	const defs: CompanionVariableDefinitions<VariablesSchema> = {
		connection: { name: 'Connection state' },
		top_slot: { name: 'Active top-layer slot (0 = none)' },
		top_name: { name: 'Active top-layer slot name' },
		bottom_slot: { name: 'Active bottom-layer slot (0 = none)' },
		bottom_name: { name: 'Active bottom-layer slot name' },
		freeze: { name: 'Freeze active (0/1)' },
		follow: { name: 'Follow on (0/1)' },
		follow_holding: { name: 'Follow holding a frame (0/1)' },
		follow_hold_sec: { name: 'Follow hold time (s)' },
		stream: { name: 'Stream state (0 off / 1 running / 2 problem)' },
		record: { name: 'Record state (0 off / 1 running / 2 problem)' },
	}
	for (const e of self.state.slots) {
		defs[`slot_${e.n}_name`] = { name: `Slot ${e.n} name` }
		defs[`slot_${e.n}_kind`] = { name: `Slot ${e.n} kind` }
	}
	return defs
}

function nameOf(s: SFState, n: number): string {
	const e = s.slots.find((x) => x.n === n)
	return e ? e.name : ''
}

export function variableValues(self: ScreenFreezeInstance): Partial<VariablesSchema> {
	const s = self.state
	const v: Partial<VariablesSchema> = {
		connection: self.online ? 'OK' : 'offline',
		top_slot: s.top,
		top_name: s.top > 0 ? nameOf(s, s.top) : '',
		bottom_slot: s.bottom,
		bottom_name: s.bottom > 0 ? nameOf(s, s.bottom) : '',
		freeze: s.freeze ? 1 : 0,
		follow: s.follow ? 1 : 0,
		follow_holding: s.followHolding ? 1 : 0,
		follow_hold_sec: s.followHoldSec ?? 0,
		stream: s.stream,
		record: s.record,
	}
	for (const e of s.slots) {
		v[`slot_${e.n}_name`] = e.name
		v[`slot_${e.n}_kind`] = e.kind
	}
	return v
}
