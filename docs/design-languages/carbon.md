# IBM Carbon Design System (`carbon`)

> Enterprise rigor: layer-gray surfaces, 0px corners, zero shadows, 1px structural borders, and IBM blue on a strict grid.

## Identity

Carbon is IBM's open-source design system (launched 2010s, evolved through IBM Cloud and Watson) built for dense, data-heavy enterprise products — dashboards, admin consoles, tables. It is flat by philosophy: elevation is expressed as gray *layers*, not shadows, structure is carried by 1px borders and a strict grid, and motion is "productive" — fast and direct, never bouncy.

In this repo the style is tokenized in `src/proto-kit/styles/carbon.css` as `data-style="carbon"`.

## Use when / Avoid when

Use when:

- The product is B2B/enterprise: admin panels, analytics, IT tooling, fintech back-office.
- The screen is data-dense: tables, metrics, logs, forms, multi-column layouts.
- The brief explicitly names IBM Carbon or "enterprise design system".
- Credibility, precision and calm efficiency matter more than delight.
- Both dark (`#161616` gray-100) and light (`#f4f4f4` gray-10) themes are needed with identical structure.

Avoid when:

- The brief wants a playful, emotional or lifestyle product — Carbon will feel cold.
- You need expressive elevation or depth cues; Carbon forbids shadows.
- Marketing pages or consumer onboarding are the target.
- The audience reads rounded corners as friendly and would see 0px as severe.

## Palette

Dark theme (default):

| Token                     | Value       | Note                            |
|---------------------------|-------------|---------------------------------|
| `--color-bg`              | `#161616`   | Gray-100                        |
| `--color-surface-1`       | `#262626`   | Layer 01                        |
| `--color-surface-2`       | `#333333`   | Layer 02                        |
| `--color-surface-3`       | `#393939`   |                                 |
| `--color-surface-4`       | `#474747`   |                                 |
| `--color-surface-5`       | `#525252`   |                                 |
| `--color-text`            | `#f4f4f4`   |                                 |
| `--color-text-muted`      | `#c6c6c6`   |                                 |
| `--color-primary`         | `#0f62fe`   | IBM blue-60                     |
| `--color-primary-fg`      | `#ffffff`   |                                 |
| `--color-primary-container` | `#002d9c` | Blue-80 container               |
| `--color-tertiary`        | `#42be65`   | Green-40                        |
| `--color-error`           | `#fa4d56`   | Red-50                          |
| `--color-outline`         | `#8d8d8d`   | Gray-50 border                  |
| `--color-outline-variant` | `#393939`   |                                 |

Light theme:

| Token                     | Value       | Note                            |
|---------------------------|-------------|---------------------------------|
| `--color-bg`              | `#f4f4f4`   | Gray-10                         |
| `--color-surface-1`       | `#ffffff`   |                                 |
| `--color-surface-2`       | `#f4f4f4`   |                                 |
| `--color-surface-3`       | `#e0e0e0`   | Gray-20                         |
| `--color-surface-4`       | `#c6c6c6`   | Gray-30                         |
| `--color-surface-5`       | `#a8a8a8`   | Gray-40                         |
| `--color-text`            | `#161616`   |                                 |
| `--color-text-muted`      | `#525252`   | Gray-70                         |
| `--color-primary`         | `#0f62fe`   | IBM blue-60 (same in both)      |
| `--color-primary-fg`      | `#ffffff`   |                                 |
| `--color-primary-container` | `#d0e2ff` | Blue-20                         |
| `--color-tertiary`        | `#198038`   | Green-60                        |
| `--color-error`           | `#da1e28`   | Red-60                          |
| `--color-outline`         | `#8d8d8d`   |                                 |
| `--color-outline-variant` | `#e0e0e0`   |                                 |

> **Documented exception:** IBM blue-60 (`#0f62fe`) is Carbon's brand identity. This overrides the repo's "no blue primary" preference in `docs/design-standards.md` §4 — but only when the brief explicitly calls for Carbon.

## Shape, shadow & border signature

- **Radius scale: everything 0px.** `--r-xs` through `--r-xl` are all `0px` — buttons, cards, chips, sheets are sharp rectangles. Keep `--device-radius` at 32 only for the physical frame.
- `--shadow-1: none`, `--shadow-2: none`, `--shadow-inset: none` — Carbon is flat in BOTH themes. Layers, not shadows.
- `--border-w: 1px` — every container gets a 1px `--color-outline` border; borders carry the structure that shadows normally would.
- What makes it recognizable: the all-square silhouette plus 1px outlined tiles on a stepped gray ladder (`#161616 → #262626 → #333333`).

## Must-use tokens

Per the `carbon.css` header: the 0px radius overrides (sharp corners on all components), `--shadow-*: none` (flat layers, borders only), IBM blue-60 as `--color-primary`, and `--border-w: 1px` outlines on containers. Do not re-add shadows or radii — that erases the style.

## Recommended components

- **BottomNav variant: `labeled`** — a full-width flat bar with icon-above-label and a top indicator line matches Carbon's outlined, indicator-driven components. Floating pills and blur effects contradict the flat, grid-driven language.
- **TopBar variant: `inline`** — Carbon uses a compact single-row header (title + subtitle inline, actions right), which also frees vertical space for the dense content the style is built for.
- Do use the `--color-tertiary` green (`#42be65` dark) for success/positive metrics and `--color-error` `#fa4d56` for alerts, as in Carbon's notification system.
- Don't add hover glows, rounded buttons, or soft shadows — a Carbon component with a blur shadow reads as broken.
- Do align everything to the 4px grid and keep paddings generous and even.
- Don't use the blue sparingly-with-accents trick from other styles — Carbon buttons/links/selected states are unapologetically blue.

## Common mistakes

- Applying rounded corners to cards or buttons "for friendliness" — Carbon is 0px everywhere.
- Adding elevation shadows; if a surface needs emphasis, step up the gray layer or add a 1px border.
- Using purple/violet accents; the palette is gray + IBM blue + semantic green/red/yellow.
- Pairing it with a playful font or oversized display headings — Carbon typography is disciplined and workmanlike.
- Filling every gap with color instead of structure; empty gray space is idiomatic.
- Making the light theme's cards white-on-white without the 1px `#e0e0e0` border.

## Demo prototype

Demo prototype: see the dashboard at https://testplay-byte.github.io/ANDROID-PROTOTYPE/ (styles gallery).

## Wiring

```tsx
// app/layout.tsx
import "@/proto-kit/tokens/tokens.css";
import "@/proto-kit/styles/index.css";

// app/page.tsx
import { DeviceFrame } from "@/proto-kit/device-frame/device-frame";
import { BottomNav } from "@/proto-kit/bottom-nav/bottom-nav";
import { TopBar } from "@/proto-kit/top-bar/top-bar";

<DeviceFrame theme="dark" style="carbon">
  <TopBar variant="inline" title="Dashboard" subtitle="Ops" trailing={/* icon buttons */ null} />
  {/* screens */}
  <BottomNav
    variant="labeled"
    items={navItems}
    activeId={active}
    onSelect={setActive}
  />
</DeviceFrame>
```
