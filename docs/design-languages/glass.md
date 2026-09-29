# Glassmorphism (`glass`)

> Luminous "liquid glass": cool-tinted frosted layers over a vivid ambient scene — blur + saturate(1.6), a 1px specular edge, and real shadows so panels float.

> **Spec & research:** the design decisions, contrast computations and source links behind
> every value in this doc live in [`glass-research.md`](./glass-research.md) (§2 physics →
> CSS, §3 color strategy, §4 layering, §6 recipe cards, §7 action list). Update both docs
> together or they drift.

## Identity

Glassmorphism (Apple's visionOS / iOS 26 "Liquid Glass" era) builds UI from translucent frosted-glass sheets: surfaces are semi-transparent, cool-tinted whites with `backdrop-filter: blur() saturate(1.6)`, a 1px luminous border with a top light-catch and a bottom inner shade (thickness), and a layered ambient drop shadow (float). Colorful, *capped* light fields glow behind the panels so the blur has something to sample. Depth comes from layering — you see *through* the UI, not just *at* it.

In this repo the style is tokenized in `src/proto-kit/styles/glass.css` as `data-style="glass"`. Working demo: the weather app (`app/prototypes/weather-app`).

## Use when / Avoid when

Use when:

- The brief says "frosted glass", "visionOS-style", "liquid glass", "aurora", or "glassmorphism".
- The product is media, music, weather, travel or crypto — anything with hero imagery behind panels.
- A designed ambient scene (gradient light fields, sky, imagery) can sit behind the UI (required, not optional).
- The demo should feel premium, atmospheric and modern.

Avoid when:

- The page background is flat/neutral — glass without a colorful backdrop looks like gray rectangles.
- The screen is text-heavy or data-dense: translucency murders readability (or goes opaque — see the layering rule below).
- Performance/legacy-browser support matters (backdrop blur is GPU-expensive; always ship the fallback).
- The brief calls for a restrained enterprise look (use carbon) or print-like boldness (use brutalism).

## Palette

Palette rule — **luminous, never gray-on-gray** (research §0/§3): the dark theme uses a deep *saturated* navy base (`#0d1424`) so panels separate by real luminance, and the glass ladder is **cool-tinted** (`rgba(235,240,252,…)`), not pure white, with ladder steps of 0.04–0.07 so every tier is distinguishable. Text tokens are computed to clear WCAG AA on every tier they are used on. The light theme uses a tinted daylight base (`#eef2fb` — the tint gives the blur something to sample) with a near-opaque frost ladder (0.62 → 0.92). Accents always glow; never darken or muddy them.

Dark theme (default):

| Token | Value | Note |
|---|---|---|
| `--color-bg` | `#0d1424` | Deep saturated navy — headroom for panel separation |
| `--color-surface-1` | `rgba(235, 240, 252, 0.10)` | Faintest glass (chrome only, no text) |
| `--color-surface-2` | `rgba(235, 240, 252, 0.14)` | Default content-glass tier |
| `--color-surface-3` | `rgba(235, 240, 252, 0.18)` | Hover / active rows |
| `--color-surface-4` | `rgba(235, 240, 252, 0.23)` | Nav layer / strongest chrome |
| `--color-surface-5` | `rgba(235, 240, 252, 0.30)` | Overlays, scrims |
| `--color-surface-solid` | `#232a3a` | Opaque twin — fallbacks & form-heavy panels |
| `--color-text` | `#f4f6fb` | 6.8–13.3:1 across the ladder |
| `--color-text-muted` | `#c3ccdf` | 4.6–8.9:1 — secondary copy, never below S2 |
| `--color-text-subtle` | `#9daac7` | ≥ 4.7:1 on S1–S3 only, never body copy |
| `--color-primary` | `#c99cff` | Luminous violet glow accent |
| `--color-primary-fg` | `#2d1157` | Dark text on violet |
| `--color-primary-container` | `rgba(201, 156, 255, 0.22)` | Translucent violet |
| `--color-on-primary-container` | `#f1e3ff` | ≥ 4.7:1 on the container tint |
| `--color-tertiary` | `#67e8f9` | Cyan glow |
| `--color-tertiary-container` | `rgba(103, 232, 249, 0.18)` | |
| `--color-error` | `#fc8296` | Brightened |
| `--color-success` | `#5be49b` | Brightened |
| `--color-warn` | `#fcd34d` | Brightened (ambient mix capped at 22%) |
| `--color-outline` | `rgba(255, 255, 255, 0.32)` | Luminous edge |
| `--color-outline-variant` | `rgba(255, 255, 255, 0.16)` | |

Light theme — near-opaque frost on a tinted daylight base:

| Token | Value | Note |
|---|---|---|
| `--color-bg` | `#eef2fb` | Tinted daylight base — blur has something to sample |
| `--color-surface-1` | `rgba(255, 255, 255, 0.62)` | Light glass must be MORE opaque than dark |
| `--color-surface-2` | `rgba(255, 255, 255, 0.70)` | Default content tier |
| `--color-surface-3` | `rgba(255, 255, 255, 0.78)` | Hover / active |
| `--color-surface-4` | `rgba(255, 255, 255, 0.86)` | Nav layer |
| `--color-surface-5` | `rgba(255, 255, 255, 0.92)` | Overlays |
| `--color-surface-solid` | `#f7f9fe` | Opaque twin |
| `--color-text` | `#10182b` | 16.9–17.5:1 |
| `--color-text-muted` | `#414c63` | 8.3–8.5:1 |
| `--color-text-subtle` | `#5d6880` | 5.4:1 |
| `--color-primary` | `#9333ea` | |
| `--color-primary-fg` | `#ffffff` | |
| `--color-primary-container` | `rgba(147, 51, 234, 0.14)` | |
| `--color-tertiary` | `#0ea5b7` | |
| `--color-error` | `#e11d48` | |
| `--color-outline` | `rgba(20, 27, 45, 0.3)` | |
| `--color-outline-variant` | `rgba(20, 27, 45, 0.12)` | |

Contrast: verified by computed WCAG 2.x ratios (research §3.2/§7) — dark text 6.8–13.3:1, muted 4.6–8.9:1, subtle ≥ 4.7:1 on S1–S3; light text 16.9–17.5:1, muted 8.3–8.5:1, subtle 5.4:1. All AA across the full ladder. Text-bearing surfaces never use surface-1; ambient light fields cap their hue mixes (violet 34% / cyan 30% / amber 22%) so no hotspot under text can drop below AA.

## Shape, shadow & border signature

- **Radius scale:** no overrides — the shared scale's soft rounded corners suit glass (`--r-xl` 28px hero/nav, `--r-lg` cards/rows, `--r-pill` chips). Avoid going sharp.
- **Edge stack — all three parts, every glass surface** (research §2.3):
  - `border: var(--border-w) solid var(--glass-border)` — `rgba(255,255,255,0.28)` dark / `rgba(255,255,255,0.8)` light hairline.
  - `--shadow-inset` = top light-catch `inset 0 1px 0 rgba(255,255,255,0.30)` **+ bottom inner shade** `inset 0 -1px 0 rgba(0,0,0,0.18)` (dark) — the shade is what fakes thickness; light: `rgba(255,255,255,0.9)` / `rgba(20,27,45,0.06)`.
  - `--shadow-1: 0 8px 24px rgba(4,8,20,0.38)` (dark) / `rgba(20,27,45,0.10)` (light) on cards and rows.
  - `--shadow-2: 0 16px 48px rgba(4,8,20,0.46)` (dark) / `rgba(20,27,45,0.14)` (light) on the nav layer and hero only.
- **Specular rim (hero + nav only):** 1px masked gradient ring (`--glass-highlight` bright top-left falling to bottom-right) — see recipe 6.1 in the research doc. Never app-wide.
- **Style-specific tokens:** `--glass-blur: 20px`, `--glass-saturate: 1.6`, `--glass-border`, `--glass-highlight`, `--glass-shade`, `--glass-grain` (feTurbulence SVG tile) + `--glass-grain-opacity` (0.04 dark / 0.03 light).
- What makes it recognizable: blur **+ saturate(1.6)** behind cool-tinted panels, the glowing 1px edge with a bottom shade, and floating shadows. No blur = no glass; no saturate = gray mud.

## Layering rule (navigation vs content)

The number one tell of cheap glass is the *same* recipe everywhere (research §1 #1, §4):

- **Nav / floating layer** gets the strongest glass: surface-4, blur 24px, `--shadow-2`, rim (BottomNav `glass` variant).
- **Content cards** get lighter glass: surface-2, blur 20px (`--glass-blur`), `--shadow-1`, no rim.
- **Blur ladder:** nav 24px · cards/rows 20px · small chips 14px · modals 28px+.
- **Never stack translucent glass on translucent glass** — inner pills/chips inside a glass card use a higher tier fill *without* `backdrop-filter`.
- At most two visible glass tiers on screen at once (content + one floating layer).

## Must-use tokens

Per the `glass.css` header, on EVERY glass surface:

```css
background: var(--color-surface-2); /* or higher — never S1 under text */
backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate, 1.6));
-webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate, 1.6));
border: var(--border-w) solid var(--glass-border);
box-shadow: var(--shadow-inset), var(--shadow-1 /* cards */ or --shadow-2 /* nav+hero */);
```

Plus, non-negotiable:

- `--glass-highlight` on the specular rim / active-pill inset — it is part of the contract, not optional.
- `--glass-grain` overlay (`opacity: var(--glass-grain-opacity)`, `mix-blend-mode: overlay`) on the ambient layer — gradient banding on dark backgrounds is a defect, not a quirk.
- Fallbacks on every glass class: `@media (prefers-reduced-transparency: reduce), (prefers-contrast: more)` → `background: var(--color-surface-solid)`, no blur; and `@supports not (backdrop-filter: blur(1px))` → the same solid twin (research §3.2).
- A panel with only a translucent fill and no backdrop blur is not glassmorphism — it is a gray rectangle.

Guidance (the luminous rule): glass needs AIR, LIGHT and SEPARATION. Keep the dark base deep saturated navy (`#0d1424`), keep ladder steps ≥ 0.04 alpha apart, keep accents glowing (violet `#c99cff` / cyan `#67e8f9`), cap ambient hue mixes (≤ 34%, amber ≤ 22%) and keep hot cores off the text column. In light theme go near-opaque frost with dark, solid text. If panels read as one gray slab or the accents look muted, the palette has drifted.

## Recommended components

- **BottomNav variant: `glass`** — the floating translucent pill is the canonical glassmorphism nav and the *strongest* glass on screen (surface-4 + blur 24px + `--shadow-2` + rim + a contrast-safe active pill). Opaque full-width bars kill the effect.
- **TopBar variant: `center`** — a centered title over a translucent bar (Big Sur / iOS style) matches the language.
- Do design the backdrop as a scene: three full-bleed radial light fields on the base + drifting low-mix accents + grain (recipe 6.4). Even fields beat discrete blobs — no hard edges for the blur to smear.
- Don't stack text-heavy content on the faintest glass tier; body/secondary copy sits on surface-2+ (`--color-text-muted` never below S2; `--color-text-subtle` only for tiny labels on S1–S3 or the raw base).
- Do use the violet `#c99cff` / cyan `#67e8f9` pair as glowing accents (buttons, badges, chart lines); avoid accent-colored *text* on glass below 17px semibold (Microsoft's warning).
- Don't add thick borders or hard offset shadows — glass edges are 1px and luminous, never solid.

## Common mistakes

- The uniform-recipe sticker sheet: identical fill/blur/border on nav, cards, chips and tiles. Tier the treatment (nav > hero > cards > chips) — see the layering rule.
- Glass on glass: translucent chips nested inside translucent cards. Inner elements get a higher fill tier, no `backdrop-filter`.
- Gray-on-gray ladder: pure-white alphas 0.09→0.24 over a soft slate base span ~9 luminance points — nothing separates. Use the cool-tinted 0.10→0.30 ladder on `#0d1424`.
- `saturate(1.3)` or plain `blur()` — below the 140–180% consensus floor the backdrop desaturates into mud. Always `saturate(var(--glass-saturate, 1.6))`.
- Amber/bright blob cores behind scrolling text — a 42% amber hotspot drops muted text to 2.91:1. Cap mixes (amber ≤ 22%) and keep hot cores off the text column.
- Text tokens that only pass on the plain base: check muted/subtle against the *brightest* hotspot behind each panel, and never put body copy on surface-1.
- Missing the bottom inner shade or the drop shadows — without the full edge stack, panels look like PNGs with opacity, not material.
- Omitting the fallbacks: `prefers-reduced-transparency`, `prefers-contrast: more` and no-`backdrop-filter` browsers must get the opaque `--color-surface-solid` twin.
- Skipping the grain — large blurred gradients band visibly on dark backgrounds.
- Using the style over a plain background with nothing behind the panels; darkening accents "for the dark theme"; white text on white-ish light glass; making every panel opaque (one opaque panel is fine, an opaque UI is not glassmorphism); blue/purple default-M3 hues instead of the violet/cyan glow pair.

## Demo prototype

- **Desktop / tablet: `Aurora`** (`/prototypes/aurora/desktop/`, also at
  `/tablet/`) — a glass weather + ambience console: layered translucent panels over a real
  blurred backdrop, saved cities that can be added and removed live, a unit toggle and a
  glass-intensity control.

Demo prototypes: the weather app at `app/prototypes/weather-app` (1:1 reference port) and
**Drift** at `app/prototypes/drift` — a podcast/audio player built as the color-discipline
showcase: glass fills are pure milky white alphas (0.10–0.22, never tinted), all hue comes
from a vivid mesh backdrop that rotates per tab (dawn amber → sea teal → dusk magenta →
forest green), and text contrast was computed (WCAG model over the scene geometry) rather
than eyeballed. See its navigation.md for the method before building another glass app.
Also the styles gallery at https://testplay-byte.github.io/ANDROID-PROTOTYPE/.

> **Note (2026-09-27):** the weather app was rebuilt as a 1:1 port of the user's "Aurora
> Weather" reference (`GLASS/DL/aurora-weather`), which runs its own recipe inside the
> prototype: milky white fills 0.08/0.14/0.22, blur 26px (user-adjustable 8–40) + saturate 1.6,
> iridescent rim, and four full-scene sky themes (dawn/day/dusk/night) instead of the shared
> token ladder above. This file still defines the shared `glass` style for other prototypes;
> the weather app's own values live in `src/prototypes/weather-app/weather-app.css` (scoped
> under `.wa`) and must stay in sync with the reference, not with this token ladder.

## Wiring

```tsx
// app/layout.tsx
import "@/proto-kit/tokens/tokens.css";
import "@/proto-kit/styles/index.css";

// page.tsx
import { DeviceFrame } from "@/proto-kit/device-frame/device-frame";
import { BottomNav } from "@/proto-kit/bottom-nav/bottom-nav";
import { TopBar } from "@/proto-kit/top-bar/top-bar";

<DeviceFrame theme="dark" style="glass">
  {/* ambient scene: full-bleed light fields + grain, behind everything */}
  <div className="ambient" aria-hidden="true">…</div>
  <TopBar variant="center" title="Now Playing" />
  {/* content: lighter glass (surface-2, blur 20, --shadow-1) */}
  <BottomNav
    variant="glass" // nav layer: surface-4, blur 24, --shadow-2, rim
    items={navItems}
    activeId={active}
    onSelect={setActive}
  />
</DeviceFrame>
```
