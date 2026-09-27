# Pulse — prototype

IBM Carbon system-status / infrastructure monitoring dashboard: flat
layer grays, 1px borders, 0px radius, live status pill, tabular-nums
metrics, incident ack/resolve flow.

- **Style:** Carbon (`--shadow-*` = none, structure via 1px borders and layer tones, 100–150ms motion, no bounce).
- **Screens (4):** Overview, Incidents, Metrics, Settings.
- **Key interactions:** status squares driven by open incidents (blink while DOWN), sortable service table with SVG sparklines, expandable incident timelines with acknowledge/resolve/reopen persisted state, 1H/6H/12H/24H segmented control re-scaling deterministic seeded SVG charts, refresh-interval stepper, and a real Carbon density toggle that resizes rows app-wide.

Live: https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/pulse/
