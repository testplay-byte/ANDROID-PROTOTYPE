# Console — design language

> The twelfth language, and the only one **not** inherited from a phone style.
> It exists for instrument-grade UI: dashboards, analytics and anything whose
> job is to make a number legible. `src/proto-kit/styles/console.css`.

## Identity

The language of **instruments**, not of apps. Near-black ground, hairline
rules, squared corners, tabular figures, and a signal palette (cyan = signal,
violet = comparison, amber = caution, rose = failure). Nothing competes with
the data: no shadows, no gradients on data marks, no decorative imagery. Every
pixel either carries a value or draws the eye to one.

This language exists because the other eleven could not honestly carry a
chart-heavy dashboard — folding M3 or Carbon into a KPI wall produced a
phone app stretched wide, which is exactly what the design system forbids.

## Use when / avoid when

**Use when**
- the screen is mostly data: analytics, monitoring, finance, telemetry;
- values must be compared (series, ranges, cohorts, funnels);
- density is a feature — many rows, many metrics, all readable.

**Avoid when**
- the product is content-led (reading, browsing, writing) — use HIG, minimal
  or flat;
- the interface should feel friendly and soft — use clay or neumorph;
- there are only one or two numbers — a KPI card does not need a language.

## Palette

Signal inks are tokens, not literals: `--chart-series-1…5`, plus
`--chart-grid` and `--chart-axis` for structure.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--color-bg` | `#0a0d12` | `#f7f8fa` | ground |
| `--color-surface-1…3` | `#10141b` → `#1c222d` | `#ffffff` → `#e8ebf0` | panels, cards, table rows |
| `--color-text` | `#e8edf5` | `#10151c` | primary figures |
| `--color-text-muted` | `#9aa7b8` | `#4a5566` | labels, axes, secondary figures |
| `--color-primary` | `#4fd1e0` | `#0d7f92` | the signal — series 1, selection, active |
| `--color-secondary` | `#9b8cf5` | `#5b48c4` | comparison — series 2 |
| `--color-tertiary` | `#f0b45f` | `#8a5b12` | caution — series 3, warning states |
| `--color-success` | `#58c98a` | `#1c6f45` | healthy — series 4 |
| `--color-error` | `#f2687c` | `#b3283d` | failure — series 5, down deltas |
| `--color-outline` / `-variant` | `#2e3644` | `#cfd5de` | hairline rules, gridlines |

## Shape, shadow & border signature

- Radii 3–10px; `--r-pill` for chips and toggles only.
- `--border-w: 1px`, hairline everywhere; **no shadows** on data surfaces
  (`--shadow-1: none`); `--shadow-2` exists only for overlays (palette, toast).
- Squared: charts, tables and tiles have square or 3px corners. The window
  frame is 10px (`--device-radius`).

## Must-use tokens

`--chart-series-1…5` for every series, `--chart-grid` for gridlines,
`--chart-axis` for axes and ticks, `--color-text-muted` for any secondary
figure. Never a hex literal inside a chart.

## Recommended components

- Navigation: `DesktopSidebar` (icon + label, section headings) — the rail is
  too thin for a chart-heavy sidebar with filters.
- Top bar: `DesktopTopBar` with a **global filter bar** beneath it (range,
  platform, plan) rather than per-view filters.
- Detail: a **panel beside the data** (inspector), never a modal for a
  drill-down.
- Density: compact/cosy toggle — this language is built for density.

## Common mistakes

- Using a phone language's big rounded cards around a chart (it reads as an
  app, not an instrument).
- Hardcoding series colors instead of the `--chart-series-*` tokens, so a
  light/dark switch or a second chart breaks the system.
- Gradients, glows or 3D on data marks — the value must read as a value.
- Proportional (non-tabular) numerals in a table — columns stop aligning.

## Charts (the language's whole job)

Every chart owes: a **title**, a **unit**, a **legend** when more than one
series, an **axis** that names the dimension, and a **readout** for the value
under the cursor. Gridlines at `--chart-grid`; the hovered/selected series at
full opacity while others drop to a hairline. Charts size to their container
(`viewBox` + `preserveAspectRatio`), never to fixed pixels.

## Demo prototype

**Signal** — product analytics console (`app/prototypes/signal/`, desktop +
tablet). Nine charts: sparkline, brushed time series with a comparison,
stacked columns, plan ring, funnel (two orientations), cohort heat grid,
retention curve, heat legend, plan bars.

## Wiring

```tsx
<SurfaceFrame surface="desktop" style="console" windowChrome menu={[…]}>
  <SurfaceScreen>{children}</SurfaceScreen>
</SurfaceFrame>
```

Registration points when this language was added: `styles/console.css`,
`styles/index.css`, `styles/types.ts`, `STYLE_ORDER` in
`src/dashboard/gallery.tsx`, the `.gcell[data-style="console"]` tint in
`dashboard.css`, and this file — the six points in SPEC §4.3.
