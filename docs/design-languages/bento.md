# Bento Grid (`bento`)

> A dashboard of rounded tiles — iOS-widget energy with white/neutral tiles on a light gray felt, one vivid orange accent, and content-first tiles of mixed heights.

## Identity

Bento looks like a personal dashboard made of iOS home-screen widgets: a grid of generously rounded tiles, each self-contained with big numbers, mini charts, or compact media, separated by felt-gray gutters. The style took off around 2022 with iOS 16's lock-screen widgets and Apple's own bento-style presentation grids, then spread through portfolio sites and productivity dashboards. One vivid orange accent carries the identity; everything else is disciplined neutral.

## Use when / Avoid when

**Use when:**
- The brief says "dashboard", "widgets", "stats", or "overview" — bento is purpose-built for tile summaries.
- Content decomposes naturally into cards: metrics, weather, calendar, habits, media.
- You want iOS-adjacent familiarity with a warmer personality than plain HIG.
- The prototype showcases scannability: big numbers, sparklines, mini charts per tile.
- A personal/home-screen product (launcher, widgets app, fitness summary).
- Mixed content types need equal footing side by side.

**Avoid when:**
- Linear flows (onboarding, checkout) — bento is a glanceable grid, not a path.
- Long-form reading or lists with many rows; tiles waste vertical space.
- The content can't be chunked into roughly tile-sized units.
- Dense tables or hierarchical navigation — tiles flatten hierarchy by design.

## Palette

Dark (default):

| Token | Value | Notes |
|---|---|---|
| `--color-bg` | `#111114` | Near-black felt |
| `--color-surface-1` | `#1c1c21` | Tile base |
| `--color-surface-2` | `#232329` | |
| `--color-surface-3` | `#2b2b32` | |
| `--color-surface-4` | `#34343c` | |
| `--color-surface-5` | `#3e3e47` | |
| `--color-text` | `#f5f5f7` | |
| `--color-text-muted` | `#a1a1aa` | |
| `--color-primary` | `#ff7a45` | Vivid orange accent |
| `--color-primary-fg` | `#2a1105` | |
| `--color-primary-container` | `#4a2c1c` | |
| `--color-secondary` | `#38bdf8` | Sky accent |
| `--color-tertiary` | `#a3e635` | Lime accent |
| `--color-error` | `#f87171` | |
| `--color-outline` | `#3e3e47` | |
| `--color-outline-variant` | `#2b2b32` | |

Light:

| Token | Value | Notes |
|---|---|---|
| `--color-bg` | `#f2f2f7` | iOS-system-gray felt |
| `--color-surface-1` | `#ffffff` | White tiles |
| `--color-surface-2` | `#ffffff` | |
| `--color-surface-3` | `#f7f7fa` | |
| `--color-surface-4` | `#e5e5ea` | |
| `--color-surface-5` | `#d1d1d6` | |
| `--color-text` | `#111114` | |
| `--color-text-muted` | `#6e6e73` | |
| `--color-primary` | `#ff5c33` | Orange |
| `--color-primary-fg` | `#ffffff` | |
| `--color-primary-container` | `#ffe3d9` | |
| `--color-secondary` | `#0284c7` | |
| `--color-tertiary` | `#65a30d` | |
| `--color-error` | `#e5484d` | |
| `--color-outline` | `#d1d1d6` | |
| `--color-outline-variant` | `#e5e5ea` | |

Keep the palette content-first: most tiles are neutral; orange (and sky/lime in small doses) marks live data, active tiles, and key metrics only.

## Shape, shadow & border signature

- Radius overrides (bigger than usual — the widget look): `--r-xs: 10px`, `--r-sm: 14px`, `--r-md: 18px`, `--r-lg: 22px`, `--r-xl: 26px`.
- `--border-w: 0px` — tiles have no outlines; separation is gutter + shadow.
- `--shadow-1`: `0 1px 3px rgba(0, 0, 0, 0.4)` dark / `0 1px 3px rgba(17, 17, 20, 0.06)` light — a whisper of contact shadow on every tile.
- `--shadow-2`: `0 8px 24px rgba(0, 0, 0, 0.45)` dark / `0 8px 24px rgba(17, 17, 20, 0.08)` light — for floating/raised tiles and the nav.
- `--shadow-inset` is a deliberate no-op (`inset 0 0 0 100px rgba(0, 0, 0, 0)`) — there is no pressed-dough inset in this style.
- Physically recognizable by: the bento GRID itself — 2-column tiles of mixed heights, oversized tile radii, felt-gray gutters, and content-first tiles (big numbers, mini charts).

## Must-use tokens

- The enlarged radius scale (`--r-xs` … `--r-xl`) — default radii make tiles look like plain cards, not widgets.
- `--shadow-1` on every tile for the subtle contact lift.
- `--color-primary` (orange) reserved for the single most important data point per screen.
- `--color-bg` as visible gutter — tiles must not touch; the felt shows through.

## Recommended components

- BottomNav variant: **floating** — the floating pill hovers over the tile grid like an iOS control and keeps all four grid edges clean. A full-width slab would visually fuse with the bottom tiles.
- TopBar variant: **large** — a big scannable title matches the glanceable, widget-scale typography of the tiles and gives the grid a clean top edge. Inline bars feel enterprise-flat.
- Do: build a genuine 2-column CSS grid with mixed tile heights (span 1 or 2 rows).
- Don't: add borders between tiles — gutters and shadows do the separation.
- Do: give each tile ONE job — a number, a chart, a list preview — with content-first typography.

## Common mistakes

- Uniform equal-height cards in a single column — that's a card list, not a bento grid; vary heights/spans.
- Small, card-like radii — tiles need the 14–26px scale to read as widgets.
- Orange everywhere — the accent is vivid precisely because it is scarce.
- Borders on tiles (`--border-w` is 0) — outline boxes break the soft tile language.
- Cramming multiple data types into one tile — split them; tiles are atomic.
- Forgetting the felt gutter: tiles need visible `--color-bg` between them (12–16px gaps).

## Demo prototype

Demo prototype: see the dashboard at https://testplay-byte.github.io/ANDROID-PROTOTYPE/ (styles gallery).

## Wiring

```tsx
// app/<prototype>/layout.tsx
import "@/proto-kit/tokens/tokens.css";   // base token layer first
import "@/proto-kit/styles/index.css";    // style layer second (after tokens)

// app/<prototype>/page.tsx
import { DeviceFrame, Screen, BottomNav, TopBar, type NavItem } from "@/proto-kit";

const NAV: NavItem[] = [
  { id: "home", label: "Home", icon: /* 22x22 svg */ null },
  { id: "stats", label: "Stats", icon: null },
  { id: "media", label: "Media", icon: null },
];

export default function Page() {
  return (
    <DeviceFrame theme="dark" style="bento">
      <Screen>
        <TopBar variant="large" title="Today" subtitle="Your widgets at a glance" />
        {/* content: 2-col grid, mixed-height tiles, big numbers + mini charts */}
        <BottomNav variant="floating" items={NAV} activeId="home" onSelect={setTab} />
      </Screen>
    </DeviceFrame>
  );
}
```
