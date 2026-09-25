import type { CompanionStaticUpgradeScript } from '@companion-module/base'
import type { ScreenFreezeConfig, ScreenFreezeSecrets } from './config.js'

export const UpgradeScripts: CompanionStaticUpgradeScript<ScreenFreezeConfig, ScreenFreezeSecrets>[] = [
	/*
	 * Place upgrade scripts here.
	 * Remember that once one has been added it cannot be removed!
	 *
	 * Kept EMPTY at the store reviewers' request: there was no published release
	 * before the token moved to the secrets store ('secret-text'), so no user
	 * config exists that would need migrating.
	 */
]
