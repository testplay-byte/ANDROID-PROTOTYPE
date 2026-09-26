# Glassmorphism (`glass`)

> Frosted translucent panels floating over a colorful ambient background — blurred white glass with a 1px luminous border.

## Identity

Glassmorphism (Apple's macOS Big Sur / visionOS era, mainstreamed on dribbble ~2020-2021) builds UI from translucent frosted-glass sheets: surfaces are semi-transparent whites with `backdrop-filter: blur`, a faint white border catches the light like an edge, and colorful blobs glow behind the panels so the blur has something to show. Depth comes from layering — you see *through* the UI, not just *at* it.

In this repo the style is tokenized in `src/proto-kit/styles/glass.css` as `data-style="glass"`.

## Use when / Avoid when

Use when:

- The brief says "frosted glass", "visionOS-style", "aurora", or "glassmorphism".
- The product is media, music, weather, travel or crypto — anything with hero imagery behind panels.
- A dark ambient scene with gradient blobs can sit behind the UI (this is required, not optional).
- The demo should feel premium, atmospheric and modern.
- Layered depth (panels over panels) is a core part of the design.

Avoid when:

- The page background is flat/neutral — glass without colorful backdrop looks like gray rectangles.
- The screen is text-heavy or data-dense: translucency murders readability.
- Performance/legacy-browser support matters (backdrop blur is expensive).
- The brief calls for a restrained enterprise look (use carbon) or print-like boldness (use brutalism).

## Palette

Glass palette rule — **airy/luminous, never dark-muddy**: the dark theme keeps a deep but soft, *blue*-slate backdrop with a raised surface-alpha ladder so the translucency glows instead of smothering; accents are always bright and luminous (never darkened to "fit" the theme). The light theme is bright frost: near-white translucent surfaces with slightly stronger alphas and dark, high-contrast text.

Dark theme (default). Surfaces are translucent whites — the bg they sit over must be colorful:

| Token                     | Value                        | Note                        |
|---------------------------|------------------------------|-----------------------------|
| `--color-bg`              | `#131a2e`                    | Soft blue-slate ambient base |
| `--color-surface-1`       | `rgba(255, 255, 255, 0.09)`  | Faintest glass              |
| `--color-surface-2`       | `rgba(255, 255, 255, 0.12)`  |                             |
| `--color-surface-3`       | `rgba(255, 255, 255, 0.16)`  |                             |
| `--color-surface-4`       | `rgba(255, 255, 255, 0.2)`   |                             |
| `--color-surface-5`       | `rgba(255, 255, 255, 0.24)`  | Strongest glass             |
| `--color-text`            | `#f4f6fb`                    |                             |
| `--color-text-muted`      | `#b6bfd4`                    | Comfortable, lightened      |
| `--color-text-subtle`     | `#8a94ad`                    |                             |
| `--color-primary`         | `#c99cff`                    | Luminous violet glow accent |
| `--color-primary-fg`      | `#2d1157`                    | Dark text on violet         |
| `--color-primary-container` | `rgba(201, 156, 255, 0.22)` | Translucent violet         |
| `--color-on-primary-container` | `#f1e3ff`              |                             |
| `--color-tertiary`        | `#67e8f9`                    | Cyan glow                   |
| `--color-tertiary-container` | `rgba(103, 232, 249, 0.18)` |                           |
| `--color-error`           | `#fc8296`                    | Brightened                  |
| `--color-success`         | `#5be49b`                    | Brightened                  |
| `--color-warn`            | `#fcd34d`                    | Brightened                  |
| `--color-outline`         | `rgba(255, 255, 255, 0.3)`   | Luminous edge               |
| `--color-outline-variant` | `rgba(255, 255, 255, 0.16)`  |                             |

Light theme — bright frost on a daylight base:

| Token                     | Value                        | Note                        |
|---------------------------|------------------------------|-----------------------------|
| `--color-bg`              | `#f4f7fd`                    | Bright daylight base        |
| `--color-surface-1`       | `rgba(255, 255, 255, 0.7)`   |                             |
| `--color-surface-2`       | `rgba(255, 255, 255, 0.76)`  |                             |
| `--color-surface-3`       | `rgba(255, 255, 255, 0.82)`  |                             |
| `--color-surface-4`       | `rgba(255, 255, 255, 0.88)`  |                             |
| `--color-surface-5`       | `rgba(255, 255, 255, 0.94)`  |                             |
| `--color-text`            | `#141b2d`                    | Dark text, solid contrast   |
| `--color-text-muted`      | `#4a5468`                    |                             |
| `--color-text-subtle`     | `#6f7889`                    |                             |
| `--color-primary`         | `#9333ea`                    |                             |
| `--color-primary-fg`      | `#ffffff`                    |                             |
| `--color-primary-container` | `rgba(147, 51, 234, 0.14)` |                             |
| `--color-tertiary`        | `#0ea5b7`                    |                             |
| `--color-error`           | `#e11d48`                    |                             |
| `--color-outline`         | `rgba(20, 27, 45, 0.3)`      |                             |
| `--color-outline-variant` | `rgba(20, 27, 45, 0.12)`     |                             |

Contrast: body text (`--color-text`) and secondary copy (`--color-text-muted`) both clear 4.5:1 on their surfaces in both themes — dark `#f4f6fb`/`#b6bfd4` over the raised white-alpha ladder on `#131a2e`, and light `#141b2d`/`#4a5468` over near-white frost on `#f4f7fd`.

## Shape, shadow & border signature

- **Radius scale:** no overrides — the shared scale's soft rounded corners suit glass; avoid going sharp.
- `--shadow-1: 0 4px 16px rgba(9, 14, 30, 0.22)` (dark) / `0 4px 16px rgba(20, 27, 45, 0.08)` (light) — panels float, but gently.
- `--shadow-2: 0 12px 40px rgba(9, 14, 30, 0.3)` (dark) — for hero cards / sheets hovering above the stack.
- `--shadow-inset: inset 0 1px 0 rgba(255, 255, 255, 0.25)` (dark) / `inset 0 1px 0 rgba(255, 255, 255, 0.9)` (light) — the top "light catch" along the glass edge.
- `--border-w: 1px` — every glass panel gets a 1px `--glass-border` (`rgba(255, 255, 255, 0.22)` dark / `rgba(255, 255, 255, 0.75)` light) luminous outline.
- **Style-specific extras:** `--glass-blur: 18px`, `--glass-border`, `--glass-highlight` (`rgba(255, 255, 255, 0.3)` dark).
- What makes it recognizable: blur behind translucent white panels + the glowing 1px edge. No blur = no glass.

## Must-use tokens

Per the `glass.css` header: `--glass-blur` + `--glass-border` on EVERY glass surface. A panel with only `rgba(255,255,255,0.1)` background and no backdrop blur is not glassmorphism — it is a gray rectangle.

Guidance (the airy rule): glass needs AIR and LIGHT. Keep the dark backdrop bluer and softer (`#131a2e`), keep the surface-alpha ladder high enough to glow (0.09 → 0.24), and keep every accent luminous — violet `#c99cff` / cyan `#67e8f9`, never darkened or muddied. In light theme go bright frost with dark, solid text. If a panel reads as a dark gray slab or the accents look muted, the palette has drifted.

## Recommended components

- **BottomNav variant: `glass`** — the floating translucent pill with backdrop blur is the canonical glassmorphism nav; it hovers over content so the colorful background shines through it. Opaque full-width bars kill the effect.
- **TopBar variant: `center`** — a centered title over a translucent bar (Big Sur / iOS style) matches the language; a heavy hero title would need an opaque backing.
- Do put colorful gradient blobs or imagery behind every major panel — glass needs a backdrop worth blurring.
- Don't stack text-heavy content on the faintest glass tier; use `--color-surface-3`+ (or an extra scrim) behind body copy.
- Do use the violet `#c99cff` / cyan `#67e8f9` pair as glowing accents (buttons, badges, chart lines).
- Don't add thick borders or hard offset shadows — glass edges are 1px and luminous, never solid.

## Common mistakes

- Using the style over a plain `#131a2e` background with nothing behind the panels — the blur has nothing to refract and the UI looks muddy.
- Darkening the palette or accents "for the dark theme" — glass must stay airy and luminous; dark accents on translucent white read as mud.
- Omitting `backdrop-filter: blur(…)` and relying on opacity alone.
- Body text on `--color-surface-1` — contrast fails; step up the surface or add a scrim.
- White text on white-ish light-theme glass without checking contrast.
- Making every panel fully opaque "for readability" — one opaque panel is fine, an opaque UI is no longer glassmorphism.
- Using blue/purple default-M3 hues instead of the style's violet/cyan glow pair.

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

<DeviceFrame theme="dark" style="glass">
  <TopBar variant="center" title="Now Playing" leading={/* back */ null} trailing={/* icon buttons */ null} />
  {/* colorful ambient blobs / imagery behind glass panels */}
  <BottomNav
    variant="glass"
    items={navItems}
    activeId={active}
    onSelect={setActive}
  />
</DeviceFrame>
```
