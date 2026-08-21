## EventApps ScreenFreeze

Control ScreenFreeze from Companion over its built-in HTTP remote-control
server: activate slots in the top and bottom fullscreen layers, toggle Freeze
and Follow, hide layers, and start/stop streaming and recording.

### Configuration

- **ScreenFreeze IP** — the IP address of the machine running ScreenFreeze.
- **Port** — the HTTP control port (default `8772`), shown in ScreenFreeze under
  _Settings → HTTP remote control_.
- **Token** — only needed if you set one in that same settings section.
  Leave blank otherwise.
- **Poll interval** — how often Companion reads state for feedbacks.

### Actions

- **Top / Bottom layer: show slot** — activate (toggle) a slot in that layer.
- **Freeze: toggle** — capture / release the current output (the num-0 Freeze).
- **Freeze: save into a slot** — store the current freeze capture into a slot.
- **Follow: toggle** — enable/disable the automatic bottom-layer failover.
- **Hide layer(s)** — hide the top, bottom, or both layers.
- **Stream / Record: start · stop · toggle.**

### Feedbacks

- A slot is the active one in the top / bottom layer (green).
- Freeze active, Follow on, Follow holding a frame, Streaming, Recording.

### Notes

- Slot dropdowns list the **slot number and description**; the numbers 1–9 are
  the stable identifiers, so button assignments survive content edits.
- If the connection shows an error, check the IP/port, that ScreenFreeze's HTTP
  remote control is enabled, and (if set) that the token matches. Reaching the
  app from another computer may need a Windows firewall rule — ScreenFreeze has
  a one-click helper for it in the same settings section.
