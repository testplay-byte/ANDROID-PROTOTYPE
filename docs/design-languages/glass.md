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

Dark theme (default). Surfaces are translucent whites — the bg they sit over must be colorful:

| Token                     | Value                        | Note                        |
|---------------------------|------------------------------|-----------------------------|
| `--color-bg`              | `#101522`                    | Deep ambient base           |
| `--color-surface-1`       | `rgba(255, 255, 255, 0.06)`  | Faintest glass              |
| `--color-surface-2`       | `rgba(255, 255, 255, 0.09)`  |                             |
| `--color-surface-3`       | `rgba(255, 255, 255, 0.12)`  |                             |
| `--color-surface-4`       | `rgba(255, 255, 255, 0.16)`  |                             |
| `--color-surface-5`       | `rgba(255, 255, 255, 0.2)`   | Strongest glass             |
| `--color-text`            | `#f4f6fb`                    |                             |
| `--color-text-muted`      | `#a8b0c4`                    |                             |
| `--color-primary`         | `#c084fc`                    | Violet glow accent          |
| `--color-primary-fg`      | `#2a1245`                    | Dark text on violet         |
| `--color-primary-container` | `rgba(192, 132, 252, 0.18)` | Translucent violet          |
| `--color-tertiary`        | `#67e8f9`                    | Cyan glow                   |
| `--color-error`           | `#fb7185`                    |                             |
| `--color-outline`         | `rgba(255, 255, 255, 0.25)`  | Luminous edge               |
| `--color-outline-variant` | `rgba(255, 255, 255, 0.12)`  |                             |

Light theme:

| Token                     | Value                        | Note                        |
|---------------------------|------------------------------|-----------------------------|
| `--color-bg`              | `#eef1f8`                    | Soft daylight base          |
| `--color-surface-1`       | `rgba(255, 255, 255, 0.55)`  |                             |
| `--color-surface-2`       | `rgba(255, 255, 255, 0.65)`  |                             |
| `--color-surface-3`       | `rgba(255, 255, 255, 0.72)`  |                             |
| `--color-surface-4`       | `rgba(255, 255, 255, 0.8)`   |                             |
| `--color-surface-5`       | `rgba(255, 255, 255, 0.88)`  |                             |
| `--color-text`            | `#1c2333`                    |                             |
| `--color-text-muted`      | `#5a6377`                    |                             |
| `--color-primary`         | `#9333ea`                    |                             |
| `--color-primary-fg`      | `#ffffff`                    |                             |
| `--color-primary-container` | `rgba(147, 51, 234, 0.12)` |                             |
| `--color-tertiary`        | `#0ea5b7`                    |                             |
| `--color-error`           | `#e11d48`                    |                             |
| `--color-outline`         | `rgba(28, 35, 51, 0.25)`     |                             |
| `--color-outline-variant` | `rgba(28, 35, 51, 0.1)`      |                             |

## Shape, shadow & border signature

- **Radius scale:** no overrides — the shared scale's soft rounded corners suit glass; avoid going sharp.
- `--shadow-1: 0 4px 16px rgba(0, 0, 0, 0.25)` (dark) / `0 4px 16px rgba(28, 35, 51, 0.08)` (light) — panels float, but gently.
- `--shadow-2: 0 12px 40px rgba(0, 0, 0, 0.35)` (dark) — for hero cards / sheets hovering above the stack.
- `--shadow-inset: inset 0 1px 0 rgba(255, 255, 255, 0.2)` (dark) / `inset 0 1px 0 rgba(255, 255, 255, 0.8)` (light) — the top "light catch" along the glass edge.
- `--border-w: 1px` — every glass panel gets a 1px `--glass-border` (`rgba(255, 255, 255, 0.18)` dark / `rgba(255, 255, 255, 0.6)` light) luminous outline.
- **Style-specific extras:** `--glass-blur: 18px`, `--glass-border`, `--glass-highlight` (`rgba(255, 255, 255, 0.25)` dark).
- What makes it recognizable: blur behind translucent white panels + the glowing 1px edge. No blur = no glass.

## Must-use tokens

Per the `glass.css` header: `--glass-blur` + `--glass-border` on EVERY glass surface. A panel with only `rgba(255,255,255,0.1)` background and no backdrop blur is not glassmorphism — it is a gray rectangle.

## Recommended components

- **BottomNav variant: `glass`** — the floating translucent pill with backdrop blur is the canonical glassmorphism nav; it hovers over content so the colorful background shines through it. Opaque full-width bars kill the effect.
- **TopBar variant: `center`** — a centered title over a translucent bar (Big Sur / iOS style) matches the language; a heavy hero title would need an opaque backing.
- Do put colorful gradient blobs or imagery behind every major panel — glass needs a backdrop worth blurring.
- Don't stack text-heavy content on the faintest glass tier; use `--color-surface-3`+ (or an extra scrim) behind body copy.
- Do use the violet `#c084fc` / cyan `#67e8f9` pair as glowing accents (buttons, badges, chart lines).
- Don't add thick borders or hard offset shadows — glass edges are 1px and luminous, never solid.

## Common mistakes

- Using the style over a plain `#101522` background with nothing behind the panels — the blur has nothing to refract and the UI looks muddy.
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
