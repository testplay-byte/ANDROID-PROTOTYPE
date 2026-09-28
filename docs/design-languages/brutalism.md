# Neo-brutalism (`brutalism`)

> Raw and loud: paper background, near-black ink, thick borders, hard zero-blur offset shadows, unapologetic yellow accents — elements look stickered on.

## Identity

Neo-brutalism is the 2020s web revival of brutalist design philosophy (from Le Corbusier's "béton brut" via raw 1950s-70s architecture): it refuses polish on purpose. Thick near-black outlines, chunky solid offset shadows with zero blur, flat saturated yellows/oranges, and oversized uppercase headings make the UI look constructed — honest materials, visible structure, deliberately anti-corporate and anti-Apple-glass.

In this repo the style is tokenized in `src/proto-kit/styles/brutalism.css` as `data-style="brutalism"`.

## Use when / Avoid when

Use when:

- The brief says "bold", "raw", "punk", "sticker", "zine", "anti-corporate" or names brutalism.
- The product is a creative tool, indie brand, streetwear shop, music/event or portfolio.
- The audience is young and the demo should feel loud, fun and memorable.
- A few large blocks dominate the layout (posters, cards, hero statements).
- You want maximum personality with zero gradients or blur.

Avoid when:

- The product is enterprise, banking, health or anything needing quiet trust.
- The screen is information-dense — heavy borders on every tile become noise.
- Accessibility auditors are the audience: some pairings need contrast care.
- The brief wants softness, elegance or luxury (use neumorph or glass).

## Palette

Dark theme (default):

| Token                     | Value       | Note                            |
|---------------------------|-------------|---------------------------------|
| `--color-bg`              | `#181614`   | Charred paper                   |
| `--color-surface-1`       | `#211f1c`   |                                 |
| `--color-surface-2`       | `#2a2723`   |                                 |
| `--color-surface-3`       | `#332f2a`   |                                 |
| `--color-surface-4`       | `#3d3831`   |                                 |
| `--color-surface-5`       | `#474138`   |                                 |
| `--color-text`            | `#f5f2ea`   | Warm paper white                |
| `--color-text-muted`      | `#b8b2a5`   |                                 |
| `--color-primary`         | `#ffd23f`   | Alarm yellow                    |
| `--color-primary-fg`      | `#181205`   | Near-black text on yellow       |
| `--color-primary-container` | `#4a3d10` |                                 |
| `--color-secondary`       | `#f0513d`   | Hot orange-red                  |
| `--color-tertiary`        | `#3d6a7f`   | Steel blue (the one cool note)  |
| `--color-error`           | `#ff5c5c`   |                                 |
| `--color-outline`         | `#f5f2ea`   | Borders are near-white, not gray |
| `--color-outline-variant` | `#7d776b`   |                                 |

Light theme:

| Token                     | Value       | Note                            |
|---------------------------|-------------|---------------------------------|
| `--color-bg`              | `#f7f4ec`   | Warm paper                      |
| `--color-surface-1`       | `#ffffff`   |                                 |
| `--color-surface-2`       | `#f7f4ec`   |                                 |
| `--color-surface-3`       | `#ece8db`   |                                 |
| `--color-surface-4`       | `#ddd7c5`   |                                 |
| `--color-surface-5`       | `#c9c2ac`   |                                 |
| `--color-text`            | `#141210`   | Near-black ink                  |
| `--color-text-muted`      | `#5c574c`   |                                 |
| `--color-primary`         | `#ffd23f`   | Same alarm yellow               |
| `--color-primary-fg`      | `#141210`   |                                 |
| `--color-primary-container` | `#ffe58a` |                                 |
| `--color-secondary`       | `#f0513d`   |                                 |
| `--color-tertiary`        | `#3d6a7f`   |                                 |
| `--color-error`           | `#e63329`   |                                 |
| `--color-outline`         | `#141210`   | Borders are pure ink            |
| `--color-outline-variant` | `#8f897a`   |                                 |

## Shape, shadow & border signature

- **Radius scale: everything 0px.** `--r-xs` through `--r-xl` are all `0px`, and `--device-radius: 0px` — even the device frame goes square. The anti-M3.
- `--shadow-1: 4px 4px 0 rgba(0, 0, 0, 0.8)` (dark) / `4px 4px 0 #141210` (light) — hard offset, ZERO blur. The shadow is a solid block.
- `--shadow-2: 6px 6px 0 rgba(0, 0, 0, 0.85)` / `6px 6px 0 #141210` — bigger offset for hero cards.
- `--shadow-inset: inset 2px 2px 0 rgba(0, 0, 0, 0.6)` (dark) / `inset 2px 2px 0 rgba(20, 18, 16, 0.25)` (light) — hard inset for pressed states.
- `--border-w: 2px` — thick ink borders on EVERY container; the header calls for 2-3px.
- What makes it recognizable: the combination of thick near-black outline + solid offset shadow. Blur, gradients or rounded corners are all foreign objects here.

## Must-use tokens

Per the `brutalism.css` header: `--border-w` (2-3px) + `--shadow-1`/`--shadow-2` (hard offsets, zero blur) on EVERY container. Elements must look "stickered on" — a card without its thick border and hard shadow is not brutalism.

## Recommended components

- **BottomNav variant: `hard`** — the full-width slab with thick border, square corners and uppercase labels is exactly the brutalist grammar. Floating pills and blur effects are the opposite of the style.
- **TopBar variant: `hero`** — the oversized uppercase display title with an overline subtitle is the loudest, most poster-like variant, which is what this style exists for.
- Do use uppercase for headings, buttons and labels; tight tracking on huge type.
- Don't add border-radius, gradients, or soft box-shadows to anything — even 4px radius softens the statement.
- Do let `#ffd23f` yellow and `#f0513d` orange-red collide as flat color blocks with ink borders.
- Don't use subtle gray outlines (`--color-outline-variant`) on important containers — the primary ink outline (`#f5f2ea` dark / `#141210` light) is the structural element.

## Common mistakes

- Adding blur to the offset shadow (even 1px) — the hard edge IS the style.
- Rounding corners "just a little"; the 0px radius includes the device frame.
- Using thin 1px borders; brutalist borders are 2-3px ink.
- Centering everything vertically like a polite SaaS page; brutalism thrives on edge-aligned, poster-like composition.
- Muting the yellow/orange accents to pastel — the palette is loud on purpose.
- Forgetting pressed states: tappable elements should use the hard `--shadow-inset` when active.

## Demo prototype

Demo prototypes: **Streetwear Store** at `app/prototypes/streetwear-store` (a drop
shop) and **Ruckus** at `app/prototypes/ruckus` (a DIY gig guide — numbered poster
lineup, generative covers, ticket stubs) — using every signature of the language: marquee tickers, rotated sticker badges, numbered
poster sections, 2-3px ink borders + hard zero-blur offset shadows on every container,
inset-shadow pressed states, and zero radius anywhere (including the device frame).
Also the styles gallery at https://testplay-byte.github.io/ANDROID-PROTOTYPE/.

## Wiring

```tsx
// app/layout.tsx
import "@/proto-kit/tokens/tokens.css";
import "@/proto-kit/styles/index.css";

// app/page.tsx
import { DeviceFrame } from "@/proto-kit/device-frame/device-frame";
import { BottomNav } from "@/proto-kit/bottom-nav/bottom-nav";
import { TopBar } from "@/proto-kit/top-bar/top-bar";

<DeviceFrame theme="dark" style="brutalism">
  <TopBar variant="hero" title="Shop" subtitle="New Drop" trailing={/* icon buttons */ null} />
  {/* screens */}
  <BottomNav
    variant="hard"
    items={navItems}
    activeId={active}
    onSelect={setActive}
  />
</DeviceFrame>
```
