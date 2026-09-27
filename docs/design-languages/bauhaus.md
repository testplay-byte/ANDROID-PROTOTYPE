# Bauhaus (`bauhaus`)

> 1920s geometric modernism on a phone: off-white paper, near-black ink, and the red/blue/yellow triad as solid blocks — sharp corners, zero shadows, circles as motifs.

## Identity

Bauhaus looks like a printed modernist poster turned into a UI: warm paper surfaces, ink hairlines rendered as 2px borders, uppercase headings, and the primary triad (red/blue/yellow) used as solid geometric color blocks — never as gradients or glows. It is based on the Bauhaus school (Weimar/Dessau, 1919–1933), whose "form follows function" geometry seeded Swiss design and modernist graphic language. On screen it reads as editorial, arty, and uncompromisingly flat.

## Use when / Avoid when

**Use when:**
- The brief explicitly asks for Bauhaus, constructivist, Swiss/modernist, or "geometric poster" vibes.
- The product is creative: portfolio apps, gallery/museum guides, design tools, event posters, editorial feeds.
- You want maximum contrast from every other style in the gallery — nothing else is this flat and graphic.
- The layout benefits from big geometric motifs (circles, quarter-circles, half-circles) as decorative anchors.
- Typography-forward screens: uppercase display headings are part of the language.
- A small, confident color system is enough (one red action color, two accents).

**Avoid when:**
- The app needs many status/semantic colors — the triad is deliberately tiny.
- Data-dense dashboards with subtle hierarchy needs; Bauhaus hierarchy is bold-or-nothing.
- The audience expects softness, rounded friendliness, or consumer polish.
- You need dark-theme subtlety — the dark theme is warm charcoal, not pure black, and ink outlines stay loud.

## Palette

Dark (default):

| Token | Value | Notes |
|---|---|---|
| `--color-bg` | `#1c1a17` | Warm charcoal "paper at night" |
| `--color-surface-1` | `#25221e` | |
| `--color-surface-2` | `#2e2a25` | |
| `--color-surface-3` | `#37322c` | |
| `--color-surface-4` | `#413b33` | |
| `--color-surface-5` | `#4c443b` | |
| `--color-text` | `#f4f1ea` | Warm paper white |
| `--color-text-muted` | `#b5afa2` | |
| `--color-primary` | `#ff5a45` | Triad RED — the action color |
| `--color-primary-fg` | `#1c0703` | |
| `--color-primary-container` | `#5c231c` | |
| `--color-tertiary` | `#f2b705` | Triad YELLOW |
| `--color-error` | `#ff5a45` | Same red as primary |
| `--color-outline` | `#f4f1ea` | Ink lines |
| `--color-outline-variant` | `#7d776b` | |

Light:

| Token | Value | Notes |
|---|---|---|
| `--color-bg` | `#f4f1ea` | Off-white paper |
| `--color-surface-1` | `#ffffff` | |
| `--color-surface-2` | `#ece8dd` | |
| `--color-surface-3` | `#e0dbcd` | |
| `--color-surface-4` | `#cfc9b8` | |
| `--color-surface-5` | `#b8b19d` | |
| `--color-text` | `#141414` | Ink |
| `--color-text-muted` | `#5c5850` | |
| `--color-primary` | `#d5321f` | Poster red |
| `--color-primary-fg` | `#ffffff` | |
| `--color-primary-container` | `#f8d2cc` | |
| `--color-tertiary` | `#f2b705` | |
| `--color-error` | `#d5321f` | |
| `--color-outline` | `#141414` | |
| `--color-outline-variant` | `#8f8a7d` | |

**Note on blue:** `--color-secondary` is `#4f74e3` (dark) / `#2b50c8` (light) — Bauhaus blue. This is part of the historical triad and is a documented exception to the repo's "no blue primary" preference in `docs/design-standards.md` §4. The PRIMARY is red; blue appears only as a secondary geometric accent. Do not promote blue to primary, and do not remove it "to satisfy the rule" — the triad is the point.

## Shape, shadow & border signature

- `--border-w: 2px` — every box is delineated with a 2px ink border, not a shadow.
- `--shadow-1: none`, `--shadow-2: none`, `--shadow-inset: none` — zero shadows in both themes. Depth comes from border + solid color blocks only.
- Radius overrides are near-square: `--r-xs: 2px`, `--r-sm: 3px`, `--r-md: 4px`, `--r-lg: 6px`, `--r-xl: 8px`.
- `--device-radius: 10px` — the only style allowed to shrink the phone frame, so the device itself looks like a printed card.
- Light theme bezel is pure ink (`#141414` on both bezel and edge) — the phone reads as an outlined object.
- Physically recognizable by: 2px ink outlines, square-ish corners, solid red/blue/yellow blocks, circle/quarter-circle motifs, and the total absence of shadow or gradient.

## Must-use tokens

- `--border-w` (2px) with `--color-outline` as the ink — surfaces without borders look unfinished.
- Zero-shadow discipline: never add a `box-shadow` locally; if it needs lift, it's not Bauhaus.
- The triad tokens: `--color-primary` (red) for action, `--color-secondary` (blue) and `--color-tertiary` (yellow) as accents only.
- The near-square radius scale (`--r-xs` … `--r-xl`).

## Recommended components

- BottomNav variant: **hard** — the full-width slab with thick border, square corners, and uppercase labels is literally the Bauhaus idiom; any floating pill softens the language.
- TopBar variant: **hero** — the oversized uppercase display title mimics a poster headline and carries the editorial identity. Center/large bars waste the type voice.
- Do: build decorative geometry with pure CSS (circles, quarter-circles, bars) using the triad tokens.
- Don't: round corners, add elevation, or use gradients — all three kill the style instantly.
- Do: set headings in uppercase with wide tracking; body copy stays sentence case.

## Common mistakes

- Making blue the primary because it "looks nicer" — the primary is RED; blue is a secondary accent (documented exception, see Palette).
- Adding soft shadows "just a little" — shadows must be `none`; hierarchy comes from borders and color blocks.
- Using default rounded radii — Bauhaus corners are 2–8px, nearly square.
- Forgetting the 2px borders on tiles and dividers — the ink outline IS the structure.
- Using pastel or muted versions of the triad — the colors are saturated and solid.
- Decorative gradients or blur — this style predates and rejects both.

## Demo prototype

Demo prototype: **Gallery App** at `app/prototypes/gallery-app` — a museum app built like
a Bauhaus poster: generative CSS artwork (12 data-driven geometric compositions, no
bitmaps), numbered exhibitions with detail pushes, a full-screen plate view whose triad
color chips re-ink the artwork live, 2px ink borders on everything, zero shadows, and a
chrome experiment where the Collection screen drops the top bar for a bordered segmented
index strip. Also the styles gallery at https://testplay-byte.github.io/ANDROID-PROTOTYPE/.

## Wiring

```tsx
// app/<prototype>/layout.tsx
import "@/proto-kit/tokens/tokens.css";   // base token layer first
import "@/proto-kit/styles/index.css";    // style layer second (after tokens)

// app/<prototype>/page.tsx
import { DeviceFrame, Screen, BottomNav, TopBar, type NavItem } from "@/proto-kit";

const NAV: NavItem[] = [
  { id: "home", label: "Home", icon: /* 22x22 svg */ null },
  { id: "grid", label: "Work", icon: null },
  { id: "info", label: "Info", icon: null },
];

export default function Page() {
  return (
    <DeviceFrame theme="dark" style="bauhaus">
      <Screen>
        <TopBar variant="hero" title="STUDIO" subtitle="Weimar — 1923" />
        {/* content: 2px-bordered tiles, solid triad blocks, circle motifs */}
        <BottomNav variant="hard" items={NAV} activeId="home" onSelect={setTab} />
      </Screen>
    </DeviceFrame>
  );
}
```
