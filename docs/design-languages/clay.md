# Claymorphism (`clay`)

> Puffy, inflated 3D pastel surfaces that look molded from soft clay — chunky radii, triple-layer shadows, and a friendly violet/pink palette.

## Identity

Claymorphism reads as "cute and squeezable": every surface looks softly inflated, with very-rounded corners and a signature triple shadow (outer lift + inner top light + inner bottom depth). It emerged around 2020–2021 in the Dribbble/UI-trends era as a friendlier, more dimensional reaction to flat design and glassmorphism, and quickly became the default look for playful fintech, kids' apps, and NFT-era dashboards. The vibe is toy-like but polished — pastel violet/pink surfaces with teal and mint accents.

## Use when / Avoid when

**Use when:**
- The app should feel playful, friendly, and approachable — kids' products, habit trackers, pet apps, casual games.
- The audience responds to softness and personality (consumer, lifestyle, wellness).
- You want a dashboard that feels tactile and 3D without glass blur or skeuomorphic textures.
- The brief asks for "clay", "puffy", "inflated", or "3D pastel" explicitly.
- You want a distinctive mood that clearly separates itself from M3/flat/brutalist prototypes in the gallery.
- Content is card-based (stats, cards, avatars) — clay shines when surfaces are the hero.

**Avoid when:**
- The prototype is enterprise, banking-serious, or data-dense — the puffiness undermines authority.
- You need long reading surfaces (articles, docs): heavy shadows tire the eye.
- Pixel-tight layouts with many nested surfaces — clay shadows compound visually.

## Palette

Dark (default):

| Token | Value | Notes |
|---|---|---|
| `--color-bg` | `#2a2733` | Deep violet-gray |
| `--color-surface-1` | `#322e3d` | |
| `--color-surface-2` | `#3a3547` | |
| `--color-surface-3` | `#433d52` | |
| `--color-surface-4` | `#4c455d` | |
| `--color-surface-5` | `#564e69` | |
| `--color-text` | `#f0edf8` | |
| `--color-text-muted` | `#b3aec6` | |
| `--color-primary` | `#a78bfa` | Soft violet |
| `--color-primary-fg` | `#2a1a4a` | Deep violet on primary |
| `--color-primary-container` | `#4a3d75` | |
| `--color-tertiary` | `#7fd8ce` | Mint accent |
| `--color-error` | `#f08c8c` | Soft coral |
| `--color-outline` | `#564e69` | |
| `--color-outline-variant` | `#433d52` | |

Light (re-derived for contrast — dark ink on the puffy pastels, deepened accents so white fg passes AA):

| Token | Value | Notes |
|---|---|---|
| `--color-bg` | `#e0dbf2` | Deep lavender felt (deeper than before so tiles pop) |
| `--color-surface-1` | `#efebf9` | |
| `--color-surface-2` | `#f4f1fc` | |
| `--color-surface-3` | `#faf8ff` | |
| `--color-surface-4` | `#ffffff` | |
| `--color-surface-5` | `#ffffff` | |
| `--color-text` | `#262038` | Ink violet — 11.6:1 on bg |
| `--color-text-muted` | `#5b547a` | 5.2:1 on bg, 6.0:1 on surface-1, 6.3:1 on surface-2 |
| `--color-text-subtle` | `#7d75a0` | Decorative only — ~3.2:1, never for body text |
| `--color-primary` | `#6d3fe0` | Violet — white fg on it is 6.1:1 |
| `--color-primary-fg` | `#ffffff` | |
| `--color-primary-container` | `#ddd0fb` | |
| `--color-on-primary-container` | `#371d73` | 9.1:1 on primary-container |
| `--color-secondary` | `#c94f8c` | Pink — white fg 4.2:1 |
| `--color-secondary-container` | `#fadcec` | |
| `--color-tertiary` | `#0e8a7d` | Mint/teal — white fg 4.2:1 |
| `--color-tertiary-container` | `#cdf0ec` | |
| `--color-error` | `#d6303f` | White fg 4.8:1 |
| `--color-error-container` | `#fadade` | |
| `--color-success` | `#0e7c40` | 3.9:1 on bg (praise text, large/bold) |
| `--color-warn` | `#c2620a` | Amber — white fg 4.2:1, 3.6:1 on surface-1 |
| `--color-outline` | `#a89fc6` | Stronger so hairline edges survive on light bg |
| `--color-outline-variant` | `#c3bcdc` | |

Secondary is pink (`#f0a6ca` dark / `#c94f8c` light) — use it sparingly for playful highlights. The light accents are deliberately deeper than the dark ones: dark mode puts dark ink on pale pastels, light mode puts white ink on saturated accents, so the light block needs the extra depth to keep the same pair contrast.

## Shape, shadow & border signature

- Radius scale overrides (puffier than base): `--r-xs: 10px`, `--r-sm: 14px`, `--r-md: 20px`, `--r-lg: 24px`, `--r-xl: 28px`. Still ≤ 32 on the device frame.
- `--border-w: 0px` — no outlines; depth comes entirely from shadows.
- `--shadow-1` (dark): `8px 8px 18px rgba(0, 0, 0, 0.45), inset -4px -4px 10px rgba(0, 0, 0, 0.35), inset 4px 4px 10px rgba(255, 255, 255, 0.08)` — the triple "inflated" shadow.
- `--shadow-2` (dark): `12px 12px 28px rgba(0, 0, 0, 0.5), inset -6px -6px 14px rgba(0, 0, 0, 0.35), inset 5px 5px 14px rgba(255, 255, 255, 0.09)`.
- `--shadow-inset` (dark): `inset 5px 5px 12px rgba(0, 0, 0, 0.5), inset -4px -4px 10px rgba(255, 255, 255, 0.07)` — the "pressed dough" pressed state.
- Light theme swaps the outer dark for a violet-tinted lift and deepened inner shading (`--shadow-1` light: `8px 8px 18px rgba(60, 50, 100, 0.28), inset -5px -5px 12px rgba(120, 108, 160, 0.2), inset 5px 5px 12px rgba(255, 255, 255, 0.95)`; `--shadow-2` light: `12px 12px 28px rgba(60, 50, 100, 0.34), inset -6px -6px 14px rgba(120, 108, 160, 0.22), inset 6px 6px 14px rgba(255, 255, 255, 1)`; `--shadow-inset` light: `inset 5px 5px 12px rgba(105, 94, 145, 0.42), inset -4px -4px 10px rgba(255, 255, 255, 0.9)`). The outer lift must stay ≥ ~0.28 alpha on light backgrounds or the puff reads as blur, not clay.
- Physically recognizable by: the triple puffy shadow on every raised surface, oversized radii, and zero borders. A flat, sharp-cornered surface instantly breaks the illusion.

## Must-use tokens

- `--shadow-1` / `--shadow-2` — the puffy lift. Plain flat surfaces look broken in this style.
- `--shadow-inset` — pressed/active states ("pressed dough").
- The clay radius scale (`--r-xs` … `--r-xl`) — never round down to smaller radii.
- `--color-primary` / `--color-primary-container` for the violet accent hierarchy.

## Recommended components

- BottomNav variant: **soft** — the soft bar applies the style's extruded/inset shadows to the nav, so the bar itself looks like a puffy clay pill floating above the content. A flat slab or glass pill contradicts the inflated identity.
- TopBar variant: **hero** — the oversized display title matches clay's chunky, toy-scale personality and gives the pastel palette room to breathe. A compact inline bar feels too austere.
- Do: put `--shadow-1` on every card, avatar, and stat tile; use `--shadow-inset` for pressed states and inputs.
- Don't: add `border` or `box-shadow` by hand — use the tokens so dark/light both inflate correctly.
- Don't: use sharp corners (brutalism habit) or hairline outlines (minimal habit).

## Common mistakes

- **Pale-on-pale text — the classic claymorphism failure.** Muted text on puffy pastel surfaces must still pass 4.5:1 (use `--color-text-muted` #5b547a in light, and never `--color-text-subtle` for real labels — it is decorative-only at ~3.2:1). White text on unsaturated pastel accents (mint/amber/pink) is the same trap: in light mode the accents are pre-darkened (`#6d3fe0`/`#c94f8c`/`#0e8a7d`/`#c2620a`) so `--color-primary-fg` white passes; don't swap them for lighter pastels.
- Building flat cards with no shadow — the style reads as broken M3 instead of clay.
- Using the base (M3) radius scale instead of clay's puffy overrides — corners look too tight.
- Adding borders/outlines — clay has none; depth is shadow-only.
- Hard-coding dark shadows in light theme (black shadows look dirty on lavender — use the violet-tinted values).
- Forgetting the pressed state: interactive elements should swap to `--shadow-inset` on active.
- Pairing with glass blur or gradients — clay's dimensionality comes from shadows alone.

## Demo prototype

- **Desktop / tablet: `Mochi`** (`/prototypes/mochi/desktop/`, also at
  `/tablet/`) — planner with a live budget ring, habit checklist, editable limits, a clay-depth control.

Demo prototypes: the kids learning game at `app/prototypes/kids-learning` and **Simmer**
at `app/prototypes/simmer` — a recipes & cooking companion with generative clay dish art,
triple-shadow puffy cards (outer lift + inner light + inner shade, >=0.28 alpha), press-in
step blobs, and a chunky clay countdown dial. Its light theme is the contrast reference:
text only on `--color-text`/`--color-text-muted` (>=5.2:1) with deepened accent inks via
`[data-theme="light"]` overrides — never pale-on-pale.
Also the styles gallery at https://testplay-byte.github.io/ANDROID-PROTOTYPE/.

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
  { id: "profile", label: "Profile", icon: null },
];

export default function Page() {
  return (
    <DeviceFrame theme="dark" style="clay">
      <Screen>
        <TopBar variant="hero" title="Dashboard" subtitle="Good morning" />
        {/* content: cards with var(--shadow-1), pressed states with var(--shadow-inset) */}
        <BottomNav variant="soft" items={NAV} activeId="home" onSelect={setTab} />
      </Screen>
    </DeviceFrame>
  );
}
```
