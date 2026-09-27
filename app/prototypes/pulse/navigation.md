# pulse — navigation

## What this prototype is

An IBM Carbon system-status / infrastructure monitoring dashboard — the
style's native enterprise habitat. Flat layer-gray surfaces (#161616 →
#262626 → #333333) with 1px borders carrying all structure, 0px radius
everywhere, zero shadows, IBM blue #0f62fe reserved for primary/active
elements, semantic green/amber/red status squares, tabular numerals on
every figure, and fast 100–150ms productive motion with no bounce. Four
tabs: Overview, Incidents, Metrics and Settings. Chrome is custom Carbon
product chrome — a flat 48px header (logo mark · live status pill ·
avatar) and an indicator-tab strip — not the shared large-title +
floating-pill pattern.

## Screens

| Screen | View id | Description |
|--------|---------|-------------|
| Overview | `overview` | Active-incident banner (worst open severity, left accent bar, "View" → Incidents), fleet health ring + counters strip (Services / Down / Degraded / Incidents), dense 2-column status grid of 12 services (square status tiles + 30-day uptime), and a Carbon data table of the top six services with hover-row tint, sortable header cells (Service / p50 / Uptime) and inline SVG response-time sparklines. |
| Incidents | `incidents` | Severity filter chips (ALL / ACTIVE / SEV-1 / SEV-2 / SEV-3) with result count. Rows carry bordered uppercase SEV and state tags; tapping one expands its event timeline (grid-rows 0fr→1fr, 150ms). Acknowledge / Resolve / Reopen flow is stateful and persisted — resolving a sev-1 turns Payments Core green on Overview. |
| Metrics | `metrics` | Time-range segmented control (1H / 6H / 12H / 24H) that re-scales pure-SVG charts from a deterministic seeded 288-point master series: CPU area line, memory bars (peak bar in IBM blue), p95-latency line with the incident spike. Current figure large, stat strip per chart (PEAK / AVG / SLO). |
| Settings | `settings` | Dark/Light theme segmented (scoped to the device, persisted `pulse-theme`), refresh-interval stepper (5–120s, drives the simulated probe ticker + header re-stamp), notification switches (SEV-1 page / SEV-2 email / weekly digest), real Carbon density toggle (Comfortable/Compact — resizes rows app-wide) and an incident-state reset. |

## Interactions

- Custom header status pill reflects fleet health; refresh button re-stamps "Last updated"
- Incident banner "View" jumps to the Incidents tab
- Status grid squares blink (step-end) while DOWN; resolving an incident stops the blink and repaints green
- Sortable table headers (name / p50 / uptime) with active-column blue tint and direction arrow
- Row hover tint; sparklines coloured by service status
- Severity filter chips re-filter the incident list with live count
- Expand/collapse incident timelines (rotating chevron)
- Acknowledge → tag flips OPEN→ACKNOWLEDGED (red→blue); Resolve → RESOLVED + green; Reopen brings it back
- Time-range segmented control re-scales all three charts (140ms re-scale fade)
- Theme toggle → scoped to the device, persisted as `pulse-theme`
- Refresh-interval stepper changes the ticker cadence (persisted)
- Notification switches and density toggle persist in `pulse-prefs-v1`; density resizes every row height app-wide
- Toast (Carbon inline-notification style) on ack/resolve/reset/weekly-digest
- Swipe left/right (mouse drag) navigates between the four tabs

## Files

| File | What it is |
|------|------------|
| `app/prototypes/pulse/layout.tsx` | Tokens + carbon style layer imports, metadata |
| `app/prototypes/pulse/page.tsx` | Shell + hash router + tab strip + swipe wiring |
| `src/prototypes/pulse/pulse.css` | Single prototype stylesheet (all `.plu` selectors) + stage-panel helpers |
| `src/prototypes/pulse/lib/data.ts` | Services, incidents, hash01 seeded generators, status derivation, formatters |
| `src/prototypes/pulse/state/pulse-context.tsx` | PulseProvider: acks/resolved/prefs (persisted), counts, refresh ticker, toast |
| `src/prototypes/pulse/components/icons.tsx` | Inline SVG icon set (square caps, currentColor) |
| `src/prototypes/pulse/components/app-header.tsx` | Custom product header + UpdatedStamp helper |
| `src/prototypes/pulse/components/sparkline.tsx` | Inline SVG response-time sparkline |
| `src/prototypes/pulse/components/charts.tsx` | Line / bar / health-ring pure-SVG charts |
| `src/prototypes/pulse/components/controls.tsx` | CarbonSwitch, StatusSquare, tags, Segmented, ActionButton |
| `src/prototypes/pulse/components/toast.tsx` | Carbon inline-notification toast |
| `src/prototypes/pulse/screens/overview-screen.tsx` | Banner, health strip, status grid, data table |
| `src/prototypes/pulse/screens/incidents-screen.tsx` | Filter chips, expandable rows, ack/resolve flow |
| `src/prototypes/pulse/screens/metrics-screen.tsx` | Range control + three chart panels |
| `src/prototypes/pulse/screens/settings-screen.tsx` | Theme, stepper, switches, density, reset |

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/pulse/
