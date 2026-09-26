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

Light:

| Token | Value | Notes |
|---|---|---|
| `--color-bg` | `#ece9f7` | Lavender felt |
| `--color-surface-1` | `#f3f0fb` | |
| `--color-surface-2` | `#f7f4fe` | |
| `--color-surface-3` | `#faf8ff` | |
| `--color-surface-4` | `#ffffff` | |
| `--color-surface-5` | `#ffffff` | |
| `--color-text` | `#3a3550` | |
| `--color-text-muted` | `#6f6a8a` | |
| `--color-primary` | `#8b5cf6` | Violet |
| `--color-primary-fg` | `#ffffff` | |
| `--color-primary-container` | `#e6dcfe` | |
| `--color-tertiary` | `#3fb5a9` | |
| `--color-error` | `#e35d6a` | |
| `--color-outline` | `#c9c3dd` | |
| `--color-outline-variant` | `#ddd8ec` | |

Secondary is pink (`#f0a6ca` dark / `#ec7fae` light) — use it sparingly for playful highlights.

## Shape, shadow & border signature

- Radius scale overrides (puffier than base): `--r-xs: 10px`, `--r-sm: 14px`, `--r-md: 20px`, `--r-lg: 24px`, `--r-xl: 28px`. Still ≤ 32 on the device frame.
- `--border-w: 0px` — no outlines; depth comes entirely from shadows.
- `--shadow-1` (dark): `8px 8px 18px rgba(0, 0, 0, 0.45), inset -4px -4px 10px rgba(0, 0, 0, 0.35), inset 4px 4px 10px rgba(255, 255, 255, 0.08)` — the triple "inflated" shadow.
- `--shadow-2` (dark): `12px 12px 28px rgba(0, 0, 0, 0.5), inset -6px -6px 14px rgba(0, 0, 0, 0.35), inset 5px 5px 14px rgba(255, 255, 255, 0.09)`.
- `--shadow-inset` (dark): `inset 5px 5px 12px rgba(0, 0, 0, 0.5), inset -4px -4px 10px rgba(255, 255, 255, 0.07)` — the "pressed dough" pressed state.
- Light theme swaps the outer dark for a violet-tinted lift (`rgba(83, 73, 113, …)`) and strong white inner highlights (`rgba(255, 255, 255, 0.9)`+).
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

- Building flat cards with no shadow — the style reads as broken M3 instead of clay.
- Using the base (M3) radius scale instead of clay's puffy overrides — corners look too tight.
- Adding borders/outlines — clay has none; depth is shadow-only.
- Hard-coding dark shadows in light theme (black shadows look dirty on lavender — use the violet-tinted values).
- Forgetting the pressed state: interactive elements should swap to `--shadow-inset` on active.
- Pairing with glass blur or gradients — clay's dimensionality comes from shadows alone.

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
