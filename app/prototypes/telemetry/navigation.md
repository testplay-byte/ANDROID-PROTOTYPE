# telemetry — navigation

## What this prototype is

An IBM Carbon infrastructure & operations console, built on the **desktop**
surface. It is the desktop sibling of [`pulse`](../pulse/) — the same Carbon
family, the same data fiction (services, incidents, seeded metric series), the
same acknowledge → resolve behaviour — but laid out as a console rather than a
dashboard app: sidebar navigation, a dense multi-column sortable table with
multi-select and a bulk action bar, a detail panel that opens **beside** the
data, a ⌘K command overlay, keyboard shortcuts, and a density preference that
resizes every row app-wide.

The shell follows [`meridian`](../meridian/) — the repo's reference desktop
prototype — exactly: `DeviceThemeProvider` → provider → `Stage` → `SurfaceFrame`
(`surface="desktop"`, `style="carbon"`, window chrome, menu bar) →
`DesktopSidebar` + `DesktopTopBar` + `SurfaceScreen` + per-view screens.

Carbon look: layer-gray surfaces (`#161616` → `#262626` → `#333333`) with 1px
borders carrying all structure, 0px radius everywhere, zero shadows, IBM blue
`#0f62fe` reserved for primary and active elements only, semantic
green/amber/red for service state, tabular numerals on every figure that
changes, and uppercase 10px micro-labels on every column head, stat and chip.

Chrome is deliberately **absent** where a phone would have it: there is no
status bar and no bottom nav. Desktop navigation is the sidebar.

## Screens

| Screen | Hash | Description |
|--------|------|-------------|
| Fleet | `#fleet` | Five-cell status summary strip (Services / Healthy / Degraded / Down / Open incidents, the last stamped with the poll time). A grid of twelve square status tiles, each with a 30-day uptime bar strip. Filter toolbar (search + state chips with live counts + result count). Checkbox multi-select with a bulk action bar (Run probe / Drain / Silence 30m / Clear). Six sortable columns plus a request-rate sparkline column. A right-hand detail panel opens beside the table on row or tile click. |
| Incidents | `#incidents` | Severity/state filter chips with counts and a "Declare incident" primary action, above the queue — with the on-call rota pinned in a rail beside it. Rows carry a bordered SEV tag, id, service, commander and age, plus a state tag; clicking expands the row in place (`grid-rows: 0fr → 1fr`) to show the summary, the event timeline and the actions. Acknowledge → Resolve → Reopen, stateful and persisted. |
| Metrics | `#metrics` | 1H / 6H / 12H / 24H segmented range re-scaling a single deterministic 288-point (5-minute) master series. CPU as a full-width line chart, memory as bars, p95 latency as a line; every chart has hairline gridlines with axis figures, a current reading, a peak / average / SLO stat strip, and the window's peak drawn in IBM blue with a callout. |
| Settings | `#settings` | Two-column desktop preferences: theme (scoped to the window), row density, poll-interval stepper (5–120s, drives the ticker), notification switches, the keyboard reference, and the demo-data actions. |

## Interactions

- **Hash routing** — `#fleet` `#incidents` `#metrics` `#settings`, deep-linkable
  and back/forward aware (`pushState` + `popstate`).
- **⌘K / Ctrl+K** opens the command overlay; ↑ ↓ move the cursor, ↵ runs, Esc
  closes. It jumps to views, services and incidents and runs actions (poll now,
  flip density).
- **Esc** unwinds one level at a time: palette → detail panel → row selection.
- **/** focuses the Fleet search field from any view; **1–4** jump between views.
- **Sortable table** — click any of the six headers; the first click on a
  numeric column sorts worst-first, the active column goes IBM blue and its
  caret rotates.
- **Multi-select** — checkboxes plus a header select-all that covers the
  *filtered* set; the bulk bar appears with the count.
- **Detail panel** — opens beside the table (never over it) and carries its own
  acknowledge / resolve actions, so a service can be recovered without leaving
  the fleet view.
- **Incident flow** — resolving an incident is shared state: the affected
  service's tile, table row, strip counters and top-bar readout all repaint from
  degraded/down to healthy in the same click. State persists in `localStorage`
  (`telemetry-acks-v1`, `telemetry-resolved-v1`).
- **Range control** re-scales all three charts (140 ms re-scale transition).
- **Density** (top bar or Settings) flips three CSS variables and resizes every
  table row, tile and card app-wide; persisted in `telemetry-prefs-v1`.
- **Notification switches** print `ON` / `OFF` beside the track, so the off
  state is unambiguous in both Carbon themes.
- Toast on acknowledge / resolve / reopen / poll / reset.

## Files

| File | What it is |
|------|------------|
| `app/prototypes/telemetry/layout.tsx` | Token + Carbon style-layer imports, metadata |
| `app/prototypes/telemetry/page.tsx` | Shell: Stage, SurfaceFrame (window chrome + menu bar), DesktopSidebar, DesktopTopBar, screen switch, toast |
| `src/prototypes/telemetry/telemetry.css` | The whole prototype stylesheet, with a numbered STYLE INDEX header |
| `src/prototypes/telemetry/data.ts` | Services, incidents, on-call rota, `hash01` seeded generators, 30-day uptime bars, sparklines, master metric series, formatters |
| `src/prototypes/telemetry/state/telemetry-context.tsx` | `TelemetryProvider`: view, filters, sort, selection, detail panel, density, prefs, acks/resolve, poll ticker, palette, toast, keyboard |
| `src/prototypes/telemetry/components/icons.tsx` | 16–18px stroke icon set (square caps, `currentColor`), no emoji |
| `src/prototypes/telemetry/components/charts.tsx` | Line chart, bar chart, sparkline and the 30-day uptime strip, all inline SVG |
| `src/prototypes/telemetry/components/controls.tsx` | Status square, tag, Carbon switch, segmented control, stepper, filter chip |
| `src/prototypes/telemetry/components/command-palette.tsx` | The ⌘K command overlay |
| `src/prototypes/telemetry/components/service-panel.tsx` | The right-hand detail panel |
| `src/prototypes/telemetry/screens/fleet.tsx` | Summary strip, status tiles, filter toolbar, bulk bar, sortable table |
| `src/prototypes/telemetry/screens/incidents.tsx` | Filter chips, expandable queue, ack/resolve flow, on-call rail |
| `src/prototypes/telemetry/screens/metrics.tsx` | Range control + three chart cards |
| `src/prototypes/telemetry/screens/settings.tsx` | Theme, density, polling, notifications, shortcuts, demo data |

## Design-language decisions

- **Tokens only.** Every colour, size, radius, motion and border comes from
  `var(--color-*)`, `var(--fs-*)`, `var(--sp-*)`, `var(--r-*)`, `var(--shadow-*)`,
  `var(--border-w)`, `var(--dur-*)` or `var(--ease-*)`. There is not one hex
  value in `telemetry.css`.
- **0px radius is left alone.** Carbon's token layer already zeroes
  `--r-xs … --r-xl`; nothing in the prototype re-adds rounding. Only the
  `proto-kit` sidebar badge and the stage back-link stay pill-shaped, because
  they are the stage's chrome, not the app's.
- **Flat means flat.** `--shadow-1/2/inset` are `none` in Carbon, so no
  elevation is simulated: structure is carried entirely by 1px
  `--color-outline-variant` rules and by stepping the gray layer.
- **The 30-day uptime strip is DOM, not SVG.** At 1px wide the bars are crisper
  and cheaper as flex children, and the strip reflows with the tile grid.
- **Amber on white.** Carbon's `--color-warn` yellow is unreadable as text in
  the light theme. Rather than hardcode a darker hex, amber text and borders use
  `color-mix(in srgb, var(--color-warn) …, var(--color-text))` under
  `.surface[data-theme="light"]` — the hue stays Carbon's, the contrast comes
  from the theme's own text token.

## Non-obvious decisions

- **The detail panel is `position: sticky`, not fixed.** It has to sit beside a
  table that is taller than the window, and it must not cover it. Below 1000px
  the split becomes a column and the panel goes `static` and full width.
- **`data-density` lives on the app root, not the view.** Meridian scopes it per
  view; Telemetry puts it on `.tel` and drives three variables
  (`--tel-row-py`, `--tel-tile-py`, `--tel-card-py`), so density is a single
  inherited fact rather than something each screen has to remember to apply.
- **The "last poll" stamp is derived, not read.** `pollStamp(tick, pollSec)`
  adds `tick × pollSec` to a fixed base time. No `Date.now()` runs during
  render, so a reload replays exactly the same sequence — the same discipline
  as `hash01` for the data.
- **Windows are addressed by `span`, not `stride`.** Each range covers a number
  of master-series points and 24 output points are interpolated across it.
  A fixed stride walked off the front of the 288-point array at the wide zooms
  and produced `undefined` → `NaN` peaks.
- **Sort defaults to worst-first.** The first click on a numeric column sorts
  descending, because "slowest service first" is the question an on-call opens
  the table to answer. Text columns sort ascending.
- **No bottom nav, no status bar.** They are phone chrome. Their absence is the
  argument that this is a separate system, not a stretched dashboard.
- **Media queries, never viewport units.** Sizing is grid + `minmax` +
  breakpoints at 1120 / 1000 / 860 / 760px. The palette offset is `72px`, not
  `vh`, because the window is a fixed 1280×800 surface that only gets zoomed —
  a viewport unit would not track it.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/telemetry/
