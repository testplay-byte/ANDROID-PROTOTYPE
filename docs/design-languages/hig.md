# Apple Human Interface Guidelines (`hig`)

> iOS-native: pure black (or grouped light-gray) surfaces, translucent tab bar, hairline separators, and the unmistakable system-blue accent.

## Identity

The Apple Human Interface Guidelines define the look of iOS itself: dark mode is true black (`#000000`) with elevated gray "grouped" cards, light mode is a soft gray canvas with pure-white cards, and separation comes from hairline borders rather than heavy shadows. Born with the iPhone (2007) and refined through every iOS release since, HIG is about familiarity — controls look and behave the way users already expect from their phone.

In this repo the style is tokenized in `src/proto-kit/styles/hig.css` as `data-style="hig"`.

## Use when / Avoid when

Use when:

- The brief says "iOS app", "Apple-style", or "feels like a native iPhone app".
- The product is consumer-facing: music, fitness, health, finance, messaging.
- The audience expects zero learning curve — standard iOS patterns only.
- Content density is moderate and lists/cards dominate the screens.
- A calm, restrained, "premium system" feel matters more than visual novelty.
- Light and dark must both feel first-class (iOS treats dark mode as a core theme).

Avoid when:

- The brief asks for a distinctive brand personality — HIG reads as "Apple", not "you".
- You need expressive color surfaces or playful shapes (use M3 or clay instead).
- The demo must avoid blue primaries for brand reasons (see the note below).
- Marketing-heavy, poster-like screens are the goal (use brutalism or glass).

## Palette

Dark theme (default):

| Token                     | Value       | Note                          |
|---------------------------|-------------|-------------------------------|
| `--color-bg`              | `#000000`   | True black — OLED-first       |
| `--color-surface-1`       | `#1c1c1e`   | Grouped card level 1          |
| `--color-surface-2`       | `#2c2c2e`   |                               |
| `--color-surface-3`       | `#3a3a3c`   |                               |
| `--color-surface-4`       | `#48484a`   |                               |
| `--color-surface-5`       | `#545456`   |                               |
| `--color-text`            | `#f2f2f7`   | iOS label color               |
| `--color-text-muted`      | `#98989f`   | Secondary label               |
| `--color-primary`         | `#0a84ff`   | iOS system blue (dark)        |
| `--color-primary-fg`      | `#ffffff`   |                               |
| `--color-primary-container` | `#0e3a66` |                               |
| `--color-tertiary`        | `#ff9f0a`   | iOS system orange             |
| `--color-error`           | `#ff453a`   | iOS system red                |
| `--color-outline`         | `#48484a`   | Hairline separator            |
| `--color-outline-variant` | `#2c2c2e`   |                               |

Light theme:

| Token                     | Value       | Note                          |
|---------------------------|-------------|-------------------------------|
| `--color-bg`              | `#f2f2f7`   | Grouped background            |
| `--color-surface-1`       | `#ffffff`   | Card                          |
| `--color-surface-2`       | `#ffffff`   | Cards share white at level 2  |
| `--color-surface-3`       | `#e5e5ea`   |                               |
| `--color-surface-4`       | `#d1d1d6`   |                               |
| `--color-surface-5`       | `#aeaeb2`   |                               |
| `--color-text`            | `#000000`   |                               |
| `--color-text-muted`      | `#6d6d72`   |                               |
| `--color-primary`         | `#007aff`   | iOS system blue (light)       |
| `--color-primary-fg`      | `#ffffff`   |                               |
| `--color-primary-container` | `#d5e8ff` |                               |
| `--color-tertiary`        | `#c93400`   |                               |
| `--color-error`           | `#ff3b30`   |                               |
| `--color-outline`         | `#c6c6c8`   | Hairline separator            |
| `--color-outline-variant` | `#e5e5ea`   |                               |

> **Documented exception:** HIG's identity IS the iOS system blue (`#0a84ff` dark / `#007aff` light). This overrides the repo's "no blue primary" preference in `docs/design-standards.md` §4 — but only when the brief explicitly asks for the HIG/iOS look.

## Shape, shadow & border signature

- **Radius scale:** no overrides — components inherit the shared scale (cards ~12-16px feel right; do not go sharper).
- `--shadow-1: 0 1px 2px rgba(0, 0, 0, 0.5)` (dark) / `0 1px 2px rgba(0, 0, 0, 0.08)` (light) — barely-there.
- `--shadow-2: 0 8px 24px rgba(0, 0, 0, 0.55)` (dark) / `0 8px 24px rgba(0, 0, 0, 0.1)` (light) — used sparingly (sheets, modals).
- `--shadow-inset: inset 0 0 0 100px rgba(0, 0, 0, 0)` — disabled; iOS does not carve surfaces.
- `--border-w: 1px` — hairlines everywhere. Separation comes from `--color-outline` 1px lines plus surface-step contrast, not elevation.
- **Glass support:** `--glass-blur: 24px`, `--glass-border: rgba(255, 255, 255, 0.12)` — for the translucent tab bar and sheets.
- What makes it recognizable: true-black background, hairline dividers, and the translucent blurred bar at the bottom.

## Must-use tokens

Per the `hig.css` header: the iOS system blue as `--color-primary` on every interactive accent, the true-black/grouped-gray surface ladder for backgrounds, and `--border-w: 1px` hairlines for separation. The translucent tab bar must stay translucent — do not give it an opaque surface.

## Recommended components

- **BottomNav variant: `tabbar`** — the iOS tab bar is the definitive HIG navigation: full-width, translucent blur, labels always visible. It is the single strongest "this is iOS" signal on screen.
- **TopBar variant: `center`** — iOS nav bars center their title with a back button on the left and actions on the right. Large-title iOS screens exist, but the centered bar is the safer, more recognizable default.
- Do use `--color-tertiary` (iOS orange) and `--color-success` (iOS green) for status accents exactly like system apps do.
- Don't add thick borders, offset shadows, or saturated card backgrounds — HIG separation is hairlines + tonal steps.
- Do keep list rows full-bleed inside grouped cards with 1px inset separators.
- Don't restyle the status bar area or fight the device frame — the HIG bezel (`#cfcfcf` dark theme) is part of the look.

## Common mistakes

- Using a near-black `#0d0d0d` instead of true `#000000` for the dark background.
- Replacing the system blue with a brand color "to be different" — on HIG that breaks the illusion.
- Putting drop shadows on cards; iOS cards sit flat on the black/gray canvas.
- Using the `floating` nav pill — that reads Android/M3, not iOS.
- Making the tab bar opaque; the blur-through translucency is the signature.
- Forgetting light mode: `#f2f2f7` grouped background with pure-white cards is not "default white page" styling.

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

<DeviceFrame theme="dark" style="hig">
  <TopBar variant="center" title="Home" leading={/* back */ null} trailing={/* icon buttons */ null} />
  {/* screens */}
  <BottomNav
    variant="tabbar"
    items={navItems}
    activeId={active}
    onSelect={setActive}
  />
</DeviceFrame>
```
