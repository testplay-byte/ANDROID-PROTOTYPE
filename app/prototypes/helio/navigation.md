# helio — navigation

## What this prototype is

**"Helio"** — a grid-operations analytics console in the **Console** language
(`style="console"`), for the **desktop** surface (and reflowing for tablet).

It is the **chart-first desktop reference**: when you need a dense, data-heavy
screen, copy this shell and the chart vocabulary in
`src/prototypes/helio/components/charts.tsx`. It was built from a supplied
visual reference, and the rules it encodes are:

- no chart borders, no y-axes, no vertical gridlines unless they carry meaning
- legends live in the card header, never inside the plot
- every figure is tabular
- exactly **one** saturated moment (the five stat tiles) so a charcoal
  interface never reads as monotonous
- hairline borders carry the card, shadows stay almost invisible

## Screens

| Screen | View id | Contents |
|--------|---------|----------|
| Overview | `#overview` | Five stat tiles, then a wide feature card (production by hour + yesterday's comparison), quarterly-goal donut, grid health with segmented progress, storage half-gauge, eight weeks of output with an average rule, energy mix stack, ranked contributors, alerts, load-shape area line |
| Analytics | `#analytics` | 7D/30D/90D range that genuinely rescales, the 96-step load-band timeline with a crosshair readout, mix by day, storage trajectory |
| Insights | `#insights` | The chart showcase: heat map, tree map, two radar charts (now vs target), radial bars and a radial gauge, plus count-up figures and two sparklines |
| Sites | `#sites` | Search + status filters + a sort toggle over a real table; clicking a row opens a detail card **beside** the table |
| Live | `#tracker` | Grid frequency as a sharp-peak sparkline, a token-drawn network map, output by hour, the recent event log |

## The chart vocabulary (`components/charts.tsx`)

`ComboChart` (columns + smooth comparison line + value pill) · `Donut` ·
`SegmentedProgress` · `Sparkline` (sharp or smooth, optional area) ·
`StepTimeline` (4-level bands + crosshair tooltip) · `ColumnChart` (selected
bar + dashed average rule) · `StackedBar` · `HalfGauge` (arc + needle) ·
`RankBars` · `AreaLine` · `SiteMap` · `ChartCard` (the frame every panel
uses).

**Added for the insights view:** `RadialBars` (concentric arcs) · `RadialGauge`
(270° tick sweep + needle) · `HeatMap` (intensity grid + hover readout) ·
`TreeMap` (a real squarified treemap, Bruls et al.) · `RadarChart` (polygon
grid) · `CountUp` (every figure animates in).

## Files

| File | Role |
|---|---|
| `app/prototypes/helio/page.tsx` | shell: theme provider → state → Stage → SurfaceFrame |
| `src/prototypes/helio/helio.css` | the stylesheet, with a numbered STYLE INDEX |
| `src/prototypes/helio/data.ts` | deterministic dataset (`hash01`/`series` — no randomness) |
| `src/prototypes/helio/state/helio-context.tsx` | view, selection, filters, density, live flag |
| `src/prototypes/helio/components/charts.tsx` | the eleven chart marks + the card frame |
| `src/prototypes/helio/components/chrome.tsx` | top bar: wordmark, nav pills, live/density, avatar |
| `src/prototypes/helio/screens/overview.tsx`, `views.tsx` | the four screens |

## Theme

Light and dark are both first-class: the top bar carries a sun/moon toggle,
`<SurfaceFrame>` takes its theme from `useDeviceTheme()`, and every mark reads
its colour from tokens — so all eighteen chart marks flip without a single
override in the chart code.

## Non-obvious decisions

- **The window is the query container** (`container-name: view` on `.helio`),
  so the reflow at 1180 / 900 / 640px tracks the *window*, not the browser.
- **Density is a data attribute**, not a media query: `data-density` on the
  view restates padding and tile size, and it persists.
- **Every data visual is inline SVG** with `vector-effect: non-scaling-stroke`
  where a stroke must survive the non-uniform `preserveAspectRatio="none"`
  scaling. No chart library, no defaults to fight.
- **Deterministic data** (SPEC §8.6): `hash01` is a sine-hash, and "today" is
  pinned to 2026-09-29.
- **Motion is layered, and it is all token-timed**: columns grow from the
  baseline, arcs sweep, sparklines draw with a dash offset, needles settle with
  a slight overshoot, and figures count up. Every animation is disabled under
  `prefers-reduced-motion`.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/helio/desktop/
