# companion-module-eventapps-screenfreeze

Bitfocus Companion module for **EventApps ScreenFreeze**. It talks to the app's
built-in HTTP control server (the EventApps standard contract, identical in style
to the CuePlayer module): it **polls `GET /state`** and fires commands as
`GET /path?query`, with an optional `X-Auth-Token` header.

This module is written in TypeScript against `@companion-module/base` 2.x, per the
`bitfocus/companion-module-template-ts` template.

## Build (do this in a real shell / VS Code — not in Cowork)

```
corepack enable
corepack prepare yarn@4.17.0 --activate
rm -f package-lock.json
yarn install        # generates yarn.lock (commit it); husky is set up via postinstall
yarn build          # tsc -> dist/main.js
yarn lint
```

> **Two files must be created locally, not through the Cowork file bridge**
> (it refuses files that run commands): **`.yarnrc.yml`** (`nodeLinker: node-modules`)
> and **`.husky/pre-commit`** (one line: `lint-staged`). `yarn install` / `husky`
> create both; if not, add them by hand.

## Dev-load in Companion

Companion's "Developer modules path" points at the **container** folder whose
subfolders are modules. So set it to `…\ScreenFreeze\ScreenFreeze` (this module
lives in `companion-module-eventapps-screenfreeze` under it).

## HTTP control contract (implemented app-side in `HttpControlService.vb`)

Default port **8772**. Optional token in header `X-Auth-Token` (never in the query).
The server also keeps the legacy OSC interface running in parallel.

### `GET /state` → JSON

```jsonc
{
	"app": "screenfreeze",
	"version": "0.17.1",
	"top": 0, // active slot in the top layer (0 = none)
	"bottom": 0, // active slot in the bottom layer
	"freeze": false,
	"hasFreeze": false, // a freeze capture exists
	"follow": false,
	"followHolding": false,
	"followHoldSec": 0,
	"stream": 0, // 0 off / 1 running / 2 problem
	"record": 0,
	"slots": [
		// always 1..9
		{ "id": "1", "n": 1, "name": "Intro", "kind": "Image", "empty": false },
	],
}
```

The "list signature" (slot ids + name + kind + empty) drives dropdown/preset rebuilds.

### Command endpoints (GET)

| Path                                               | Effect                                      |
| -------------------------------------------------- | ------------------------------------------- |
| `/top?n=1..9`                                      | toggle a slot in the **top** layer          |
| `/bottom?n=1..9`                                   | toggle a slot in the **bottom** layer       |
| `/freeze`                                          | toggle Freeze (num 0)                       |
| `/freeze/assign?n=1..9`                            | save the current freeze capture into a slot |
| `/follow`                                          | toggle Follow                               |
| `/hide` · `/hide?layer=top` · `/hide?layer=bottom` | hide both / one layer                       |
| `/stream` · `/stream?on=1` · `/stream?on=0`        | toggle / start / stop streaming             |
| `/record` · `/record?on=1` · `/record?on=0`        | toggle / start / stop recording             |
| `/`                                                | health probe (no token required)            |

## Publishing

See the EventApps Companion publishing playbook. The manifest `version` stays
`0.0.0`; the real version comes from the git tag. Canonical repo lives under the
`bitfocus` org; `eventapps-online` is a mirror.
