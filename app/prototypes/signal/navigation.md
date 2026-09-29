# signal — navigation

## What this prototype is

**"Signal"** — a product analytics console and **the flagship build of the
`console` design language** (`style="console"`). Console is the repo's
INSTRUMENT language: near-black ground, hairline 1px rules, squared cards
(3–10px radii), no shadows, tabular figures everywhere, and a four-ink signal
palette — **cyan = signal, violet = comparison, amber = caution, rose =
failure** — expressed through `--chart-series-1…5`, `--chart-grid` and
`--chart-axis`.

The whole build is about **data visualisation done by hand**. There is no
chart library anywhere in it. Every plot is inline SVG written against a fixed
`viewBox`, sized to its container (`width:100%; height:auto` + the viewBox
aspect), so it can never overflow at 1280, 1000 or 760. Every chart carries a
title, a unit, a legend whenever it draws more than one series, and a live
value readout.

It is also a **desktop app, not a wide phone**: a sidebar, a global segment
bar, a 12-column panel grid, a detail inspector that opens *beside* the table,
a ⌘K command surface, and real keyboard shortcuts.

## Surfaces

| Surface | Route | Notes |
|---|---|---|
| Desktop | `/prototypes/signal/desktop/` | Window chrome + menu bar (`Signal · File · View · Dashboards · Help`), draggable, 1280×800 default |
| Tablet | `/prototypes/signal/tablet/` | Same build, 834×1112. The `@container surface (max-width: 900px)` rules do the real work here |

`useCanonicalSurface("signal", "desktop")` rewrites a bare
`/prototypes/signal/` to the canonical desktop URL. `storageKey="signal"`
persists the dragged window size.

## Views (hash-routed, deep-linkable)

| View | Hash | Contents |
|---|---|---|
| **Overview** | `#overview` | Five KPI cards (delta + sparkline) · a large time series with a **dashed violet comparison series** and **drag-to-brush** selection · a stacked column chart of sessions by platform · a revenue ring (MRR by plan) · a live activity feed · an anomaly list · a window summary with the ink legend. Range 7D/30D/90D genuinely re-scales every number. |
| **Funnel** | `#funnel` | A five-step activation funnel with step-to-step conversion, the drop called out between every step, a full-width ghost rail behind each bar showing what was lost, and a per-platform segment breakdown + paid-step-by-plan bars beside it. **Turns horizontal under 900px.** |
| **Retention** | `#retention` | An 8 × 8 weekly cohort heat grid (every cell an inline-SVG rect, every cell hoverable into the readout), a six-step legend drawn from the same ramp, a multi-cohort retention curve, and a W1/W4 summary. |
| **Explore** | `#explore` | The desktop data table: search (`/`), category chips, six sortable columns, checkbox multi-select with a bulk action bar, an in-row sparkline column, and a row **inspector that opens beside the table**. |
| **Settings** | `#settings` | Two-column desktop settings: theme, row density, **a reduce-motion switch that really stops every chart animation**, range default, the keyboard reference, the view list and the chart-ink legend. |

## The chart-ink contract

This is the rule the build exists to demonstrate, and `signal.css` never
breaks it — **there is no hex or rgba literal anywhere in the file**:

| Ink | Token | Used for |
|---|---|---|
| Gridlines | `--chart-grid` | every horizontal gridline (`.sig-gridline`) |
| Axes | `--chart-axis` | tick labels (`.sig-axis`), the baseline, the crosshair rule |
| Data | `--chart-series-1` | the signal — primary line, primary area tint, funnel bars, heat ramp top |
| Comparison | `--chart-series-2` | the previous-period series (always **dashed** so it never reads as data) |
| Caution | `--chart-series-3` | tertiary series in the stacked columns |
| Secondary | `--chart-series-4` | quaternary series |
| Failure | `--chart-series-5` | quinary series; the error roles use `--color-error` |

Area fills and the heat ramp are `color-mix(in srgb, var(--chart-series-1) N%, …)`
tints. Because every chart names a **series index**, not a colour, flipping the
surface to `data-theme="light"` re-inks the entire app from `console.css` alone.

## Responsiveness — `@container surface`, never `@media`

| Breakpoint | What changes |
|---|---|
| **1120px** | The three-across band collapses: panels go `12 / 6 / 6 / 12`, KPI row 5 → 3 columns. |
| **1000px** | The Explore inspector drops **under** the table (`position: static`, full width) instead of squeezing it; settings go single-column. |
| **900px (tablet)** | A genuine layout change, not smaller padding: every panel goes full width, the **KPI row stops being a grid and becomes a horizontal snap-scrolling rail**, and the **funnel swaps to its horizontal twin**. |
| **760px** | Tighter padding, the two widest optional table columns drop out, the table footer stops reserving room for the surface switcher. |

The funnel switch is the interesting one: `FunnelChart` renders **two real
SVG charts** from the same numbers, `.sig-funnel--v` and `.sig-funnel--h`. CSS
changes which one is displayed. Nothing is scaled down to fake a reflow.

## Interactions

- **Range** 7D / 30D / 90D — a global filter. It re-slices the same 210-day
  history, so the KPI values, sparklines, comparison window, stacked buckets,
  funnel volume and plan mix all move together. Bound to `R`.
- **Segments** — platform and plan chips in the global bar. They genuinely
  re-weight the funnel, the per-platform breakdown and cohort retention. The
  segment persists to `localStorage` (`signal-segment`) and a dashed amber
  chip appears with a one-click clear.
- **Brush** — drag anywhere on the time series to select a window. The plot
  bands, the readout switches to the window's mean plus a total, and the
  x-axis labels re-slice. Drag again or press Esc to clear.
- **Hover readouts** — every chart reports on hover: the time series via a
  crosshair, stacked columns per bucket, the ring per slice, funnel steps, the
  heat grid per cell, the retention curve per week column.
- **Command palette** — ⌘K / Ctrl+K. Runs views, events, range switching,
  segment reset, density and reduce motion. `1`–`5` jump between views, `/`
  focuses the Explore search, `Esc` clears everything.
- **Preferences** — `signal-density` (row height, card padding, feed rows) and
  `signal-reduce-motion` (cancels every chart's draw-in animation and drops all
  transitions to 1ms; hover and brush still work). Theme persists as
  `signal-theme`.

## Determinism

Hard rule, and the build honours it: **no `Math.random`, no `Date.now`, no
`new Date` in render, and no locale formatting of dates.**

- The 210-day history is generated at module load from a **fixed-seed
  mulberry32** (`0x51694e41`), so the same curve is drawn on every load and in
  every reviewer's browser.
- The calendar is pinned to a fictional **2026-09-29** and labels are computed
  with pure day-of-year arithmetic over a fixed month table — deliberately no
  `Date` object anywhere.
- The "live" feed is a **rotation over a fixed list** with a fixed
  seconds-ago column and an explicit *Advance* button, rather than a ticking
  clock.

## Files

| File | What it is |
|---|---|
| `app/prototypes/signal/layout.tsx` | Imports `tokens.css` + `styles/index.css` + `signal.css`; metadata. |
| `app/prototypes/signal/page.tsx` | Client shell: `DeviceThemeProvider` (`signal-theme`, dark) → `SignalProvider` → `Stage` (panels, surface switcher, fullscreen — all preview chrome, all OUTSIDE the app) → `SurfaceFrame` (`surface="desktop"`, `style="console"`, `windowChrome`, `menu={["Signal","File","View","Dashboards","Help"]}`, `storageKey="signal"`, `draggable`) → `DesktopSidebar` + `DesktopTopBar` + the global segment bar + the view + `CommandPalette` + toast. |
| `src/prototypes/signal/signal.css` | One stylesheet, everything under `.sig-`, with a numbered STYLE INDEX matching `meridian.css`. Sections: shell · chrome · segment bar · panels + grid · KPI row · chart ink · overview panels · funnel · retention · explore table + inspector · settings · overlays · adaptivity · reduce motion. |
| `src/prototypes/signal/data.ts` | The fixed-seed generator, the pinned calendar, dimensions (ranges / platforms / plans), the five metrics, the stacked + ring + funnel + cohort derivations, the event table and the activity feed. Pure functions only. |
| `src/prototypes/signal/state/signal-context.tsx` | The one context: view + hash routing, global range/segment filters, density + reduce-motion (persisted), the explore table's search / categories / sort / multi-select / selection, the derived memos (`win`, `metrics`, `stacks`, `mix`, `funnel`, `cohorts`, `filteredEvents`), the ⌘K / 1–5 / Esc keyboard bindings, and the toast. |
| `src/prototypes/signal/components/icons.tsx` | 18px stroke icon set — squared and technical, no emoji. |
| `src/prototypes/signal/components/atoms.tsx` | The console vocabulary: `Panel` / `PanelHead`, `Legend`, `Readout`, `StatCard`, `Sparkline`, `Segmented`, `Chip`, `Button`, `Toggle`, `Meter`, `Kbd`, `Delta`, `Empty`. |
| `src/prototypes/signal/components/charts.tsx` | The nine hand-built SVG charts, plus the `niceMax` scale helper. |
| `src/prototypes/signal/components/command-palette.tsx` | The ⌘K surface: views, events and live actions in one keyboard-navigable list. |
| `src/prototypes/signal/screens/overview.tsx` | KPI row, time series, ring, stacked columns, live feed, anomalies, window summary. |
| `src/prototypes/signal/screens/funnel.tsx` | Both funnel orientations + the per-platform and per-plan breakdown. |
| `src/prototypes/signal/screens/retention.tsx` | Heat grid, legend, curve, summary, week-on-week delta. |
| `src/prototypes/signal/screens/explore.tsx` | The sortable multi-select table and the beside-the-table inspector. |
| `src/prototypes/signal/screens/settings.tsx` | Theme, density, range, reduce motion, keyboard reference, view list, ink legend, data. |

## Non-obvious decisions (for future agents)

- **`Sparkline` lives in `atoms.tsx`, not `charts.tsx`,** and is re-exported
  from `charts.tsx` so both import paths work. `charts.tsx` already needs the
  legend and readout atoms; putting `Sparkline` there would have made the two
  modules import each other. Don't "tidy" it back.
- **`preserveAspectRatio="none"` is used in exactly one place** — the
  sparkline. It has no axes to distort and must fill whatever card width it
  gets. Every other chart uses the default uniform fit plus
  `width:100%; height:auto`, which is what keeps text legible at 760px.
- **The chart gridline class is `.sig-gridline`, not `.sig-grid`.** `.sig-grid`
  is the 12-column layout grid on the overview; the collision would have
  applied `display:grid` to every `<line>` in every chart.
- **The draw-in animation is opt-IN via `.sig-draw`**, not a property of
  `.sig-line`. The comparison series is dashed (`stroke-dasharray: 4 3`) and an
  inherited dash animation would have overwritten it on animation finish. Each
  animated path also carries `pathLength={1}` so `stroke-dasharray: 1` means
  the whole line.
- **Two funnel SVGs, not one resized one.** Geometry lives in JS, so CSS cannot
  re-lay-out an SVG. The tablet orientation is a second real chart built from
  the same `steps`, revealed at `@container surface (max-width: 900px)`.
- **The time series has a transparent full-plot `<rect class="sig-barhit">`.**
  Without it the empty space above and below the line swallows pointer events
  and the crosshair only follows the stroke. The retention curve needs the same
  for its per-week hover.
- **Radius is left to the language** (`var(--r-xs…--r-md)`). The surface frame
  also overrides some radii for `data-surface="desktop"`, and both paths stay
  inside console's 3–10px band, so the stylesheet does not fight it.
- **Preview controls belong to `<Stage>`** — the Dashboard link, the fullscreen
  button and the surface switcher are all outside the app, as they are in
  `meridian`. The table footer reserves `padding-right: 190px` so the last row
  is not hidden under the surface switcher; that is reset to `0` below 760px.
