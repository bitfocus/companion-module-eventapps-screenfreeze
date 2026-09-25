import type {
	CompanionStaticUpgradeProps,
	CompanionStaticUpgradeResult,
	CompanionStaticUpgradeScript,
	CompanionUpgradeContext,
} from '@companion-module/base'
import type { ScreenFreezeConfig, ScreenFreezeSecrets } from './config.js'

export const UpgradeScripts: CompanionStaticUpgradeScript<ScreenFreezeConfig, ScreenFreezeSecrets>[] = [
	// v1.0.3: the token moved from the plain config store ('textinput') to the secrets
	// store ('secret-text'), so it no longer appears in config exports. Migrate any
	// token stored by <= v1.0.2 out of the config object.
	function moveTokenToSecrets(
		_context: CompanionUpgradeContext<ScreenFreezeConfig>,
		props: CompanionStaticUpgradeProps<ScreenFreezeConfig, ScreenFreezeSecrets>,
	): CompanionStaticUpgradeResult<ScreenFreezeConfig, ScreenFreezeSecrets> {
		const cfg = props.config
		if (!cfg || !('token' in cfg)) {
			return { updatedConfig: null, updatedActions: [], updatedFeedbacks: [] }
		}
		const token = typeof cfg.token === 'string' ? cfg.token : ''
		delete (cfg as { token?: unknown }).token
		return {
			updatedConfig: cfg,
			updatedSecrets: token !== '' ? { ...(props.secrets ?? {}), token } : null,
			updatedActions: [],
			updatedFeedbacks: [],
		}
	},
]
