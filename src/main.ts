import { InstanceBase, InstanceStatus, type SomeCompanionConfigField } from '@companion-module/base'
import { getConfigFields, type ScreenFreezeConfig } from './config.js'
import { SFApi } from './api.js'
import { emptyState, listSignature, type SFState } from './state.js'
import { buildActions, type ActionsSchema } from './actions.js'
import { buildFeedbacks, type FeedbacksSchema } from './feedbacks.js'
import { buildVariables, variableValues, type VariablesSchema } from './variables.js'
import { buildPresets } from './presets.js'
import { UpgradeScripts } from './upgrades.js'

export type ScreenFreezeSchema = {
	config: ScreenFreezeConfig
	secrets: undefined
	actions: ActionsSchema
	feedbacks: FeedbacksSchema
	variables: VariablesSchema
}

export { UpgradeScripts }

export default class ScreenFreezeInstance extends InstanceBase<ScreenFreezeSchema> {
	config: ScreenFreezeConfig = { host: '', port: 8772, token: '', poll: 250, warnSec: 20, dangerSec: 10 }
	api: SFApi = new SFApi('', 8772, '')
	state: SFState = emptyState()
	online = false

	private timer: NodeJS.Timeout | undefined
	private sig = ''
	// Last status pushed to Companion — updateStatus() must fire on TRANSITIONS only
	// (per-poll calls at 4x/s flood the Companion log; see the publishing playbook).
	// lastFailMsg refines the guard: a CHANGED error message re-reports once (e.g.
	// "fetch failed" -> "HTTP 401" while the operator is fixing the token), while an
	// unchanged one stays suppressed at poll rate.
	private lastStatus: 'ok' | 'fail' | 'badconfig' | '' = ''
	private lastFailMsg = ''

	async init(config: ScreenFreezeConfig): Promise<void> {
		this.config = config
		this.api = new SFApi(config.host, config.port, config.token)
		this.rebuildDefinitions()
		if (this.config.host) this.updateStatus(InstanceStatus.Connecting)
		this.restartPolling()
	}

	async destroy(): Promise<void> {
		if (this.timer) clearInterval(this.timer)
		this.timer = undefined
	}

	async configUpdated(config: ScreenFreezeConfig): Promise<void> {
		this.config = config
		this.api = new SFApi(config.host, config.port, config.token)
		this.online = false
		this.lastStatus = '' // reconfig → report the next status once, whatever it is
		this.lastFailMsg = ''
		this.sig = ''
		this.rebuildDefinitions()
		this.restartPolling()
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return getConfigFields()
	}

	rebuildDefinitions(): void {
		this.setActionDefinitions(buildActions(this))
		this.setFeedbackDefinitions(buildFeedbacks(this))
		this.setVariableDefinitions(buildVariables(this))
		const { structure, presets } = buildPresets(this)
		this.setPresetDefinitions(structure, presets)
	}

	private restartPolling(): void {
		if (this.timer) clearInterval(this.timer)
		this.timer = undefined
		// While unconfigured, do NOT poll at all: no timer, no HTTP requests — just a single
		// bad_config status. Polling starts from configUpdated() once a host is entered.
		// (Same behaviour the reviewers asked for on eventapps-cueplayer.)
		if (!this.config.host) {
			if (this.lastStatus !== 'badconfig') {
				this.lastStatus = 'badconfig'
				this.updateStatus(InstanceStatus.BadConfig, 'Set the ScreenFreeze IP address')
			}
			return
		}
		const iv = Math.max(100, Number(this.config.poll) || 250)
		this.timer = setInterval(() => void this.poll(), iv)
		void this.poll()
	}

	private async poll(): Promise<void> {
		if (!this.config.host) {
			// Transition-guarded like every other status below: updateStatus() on EVERY poll
			// (4x/s) floods the Companion log — report each state once, on the CHANGE only.
			if (this.lastStatus !== 'badconfig') {
				this.lastStatus = 'badconfig'
				this.updateStatus(InstanceStatus.BadConfig, 'Set the ScreenFreeze IP address')
			}
			return
		}
		try {
			this.state = await this.api.fetchState()
			if (!this.online || this.lastStatus !== 'ok') {
				this.online = true
				this.lastStatus = 'ok'
				this.updateStatus(InstanceStatus.Ok)
			}
			const sig = listSignature(this.state)
			if (sig !== this.sig) {
				this.sig = sig
				this.rebuildDefinitions() // slot list changed -> refresh dropdowns/presets/variables
			}
			this.setVariableValues(variableValues(this))
			this.checkAllFeedbacks()
		} catch (e) {
			// Only the FIRST failure (or a failure with a DIFFERENT message) reports; repeating
			// the same error at poll rate would spam the log for as long as the app is down.
			const msg = String((e as Error).message)
			if (this.online || this.lastStatus !== 'fail' || msg !== this.lastFailMsg) {
				this.online = false
				this.lastStatus = 'fail'
				this.lastFailMsg = msg
				this.updateStatus(InstanceStatus.ConnectionFailure, msg)
			}
			this.setVariableValues(variableValues(this))
		}
	}

	// fire-and-forget command, then a quick optimistic refresh
	send(path: string): void {
		this.api.cmd(path).catch(() => {})
		setTimeout(() => void this.poll(), 90)
	}
}
