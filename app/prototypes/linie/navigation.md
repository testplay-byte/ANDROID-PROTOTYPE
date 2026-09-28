# linie — navigation

## What this prototype is

**"Linie"** — a metro/transit planner in **Bauhaus**, the second bauhaus demo
after gallery-app (a *different domain, same language*). The network IS the
design: three lines drawn as right-angle/45° SVG paths, stations as circles
with 2px ink rings, interchanges as double rings. Red is the primary action
color; blue and yellow are the other two line colors / secondary accents.
`style="bauhaus"` gives near-square radii and the square device corners.

## Screens

| Screen | View id | Contents |
|--------|---------|----------|
| Netz | `#map` | Poster header with quarter-circle motif, the SVG metro map on an ink-bordered plate (tap a line to isolate, tap a station to select), line legend, and a selected-station slab with an ABFAHRTEN button. |
| Route | `#route` | Journey planner: FROM/TO square selects → station-picker overlay; FIND ROUTE draws a vertical diagram (line-colored segment bars + circle stops + interchange diamonds) with duration/stops/fare stat blocks; SAVE ROUTE. Primary CTA is above the fold. |
| Abfahrt | `#depart` | Station chip strip; "next 3" hero with live tabular countdowns (tick every minute); full departure list; service-status strip (green/amber squares + uppercase labels). |
| Ich | `#me` | Saved routes (removable), ticket passes (Einzel/Tageskarte/Wochenkarte — buy to own, triad-colored cards), theme segmented, switches, about. All persisted. |

## Interactions

- Tap a legend square to highlight a line; tap the map to select a station.
- FIND ROUTE → animated vertical diagram with the actual legs; SAVE persists it.
- Departure countdowns tick down each minute (context `tick`).
- Buying a pass flips the card to "IM PORTEMONNAIE"; routes/tickets/prefs persist.
- Border swap (no shadow) for pressed states; staggered 240ms entrances;
  `prefers-reduced-motion` kill-block. Inline SVG only, no emoji.
- Toast: one line, 92% max width, nowrap. Swipe between tabs; hash routes.

## Files

| File | What it is |
|------|------------|
| `app/prototypes/linie/layout.tsx` | tokens.css → styles/index.css → linie.css; metadata. |
| `app/prototypes/linie/page.tsx` | Shell: DeviceThemeProvider(`linie-theme`, light) → LinieProvider → Stage panels → DeviceFrame(`style="bauhaus"`) → `.ln` root (hash router, toast, `<BottomNav variant="hard">`, swipe). |
| `src/prototypes/linie/linie.css` | The whole style: near-square radius + 2px ink borders, no shadows, map plate + hit layer, diagram, hero, passes, switches, toast. |
| `src/prototypes/linie/lib/data.ts` | 3 lines (SVG paths), 12 stations with coords, 10 departures, service status, 3 ticket types, default saved routes. |
| `src/prototypes/linie/state/linie-context.tsx` | LinieProvider: station/line selection, saved routes, passes, prefs (persisted `linie-*`), live tick, toast. |
| `src/prototypes/linie/components/` | `metro-map.tsx` (SVG network), `icons.tsx` (geometric set). |
| `src/prototypes/linie/screens/` | `map-screen`, `route-screen`, `departs-screen`, `me-screen`. |

## Non-obvious decisions

- **RED is the primary** — the FIND ROUTE / ABFAHRTEN / active-state blocks all
  use `--color-primary`; blue and yellow stay as line colors and accents only
  (a documented bauhaus rule — never blue-primary).
- **Zero shadows, ever** — pressed states swap the 2px border / invert fills;
  nothing in the file declares box-shadow.
- **Labels never sit on the geometry** — station hit targets are a sibling
  layer over the SVG and all text lives in bordered plates (failure mode #11).
- **Near-square everywhere** — the only `50%` in the file is the station
  circle, which is the map's motif, not a corner radius.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/linie/
