# Flat Design 2.0 (`flat`)

> Solid saturated color blocks with zero shadows and zero gradients — depth from color contrast alone, with a teal primary, coral secondary, bold geometry, and crisp edges.

## Identity

Flat 2.0 is the matured second wave of flat design: after 2013's iOS 7 / Material hinge stripped skeuomorphism away, the style evolved past the cold first-wave into confident solid color blocking, generous padding, and bolder geometry — still with no shadows and no gradients. Depth is communicated purely by contrasting color planes (teal on gray, coral against teal). It reads as friendly, energetic, and unpretentious: Google-2014-era Material meets modern productivity apps.

## Use when / Avoid when

**Use when:**
- The brief says "flat", "color blocking", "bold and simple", or references early-Material / Swiss-digital products.
- Productivity, utilities, task managers, education apps — anything that benefits from clear color-coded sections.
- You want high energy from hue instead of effects: teal actions, coral highlights, amber flags.
- Performance- and simplicity-minded prototypes: the cheapest style to render, the hardest to break.
- Screens with strong section structure that maps to solid color planes.
- A young or broad consumer audience that should never feel intimidated.

**Avoid when:**
- The brand direction is luxurious, quiet, or premium — flat color reads mass-market.
- You need subtle emphasis layers (hover/pressed nuance) — there is no shadow vocabulary to lean on.
- The content is photography- or video-led; color blocks compete with imagery.
- Accessibility-sensitive data viz: flat color-only depth can hinder hierarchy.

## Palette

Dark (default):

| Token | Value | Notes |
|---|---|---|
| `--color-bg` | `#121212` | |
| `--color-surface-1` | `#1c1c1c` | |
| `--color-surface-2` | `#262626` | |
| `--color-surface-3` | `#303030` | |
| `--color-surface-4` | `#3b3b3b` | |
| `--color-surface-5` | `#474747` | |
| `--color-text` | `#f5f5f5` | |
| `--color-text-muted` | `#b0b0b0` | |
| `--color-primary` | `#26a69a` | Teal — the action color |
| `--color-primary-fg` | `#06211d` | |
| `--color-primary-container` | `#0e3b36` | |
| `--color-secondary` | `#ff8a65` | Coral — the contrast plane |
| `--color-tertiary` | `#ffb300` | Amber |
| `--color-error` | `#ef5350` | |
| `--color-outline` | `#757575` | |
| `--color-outline-variant` | `#303030` | |

Light:

| Token | Value | Notes |
|---|---|---|
| `--color-bg` | `#f7f7f7` | |
| `--color-surface-1` | `#ffffff` | |
| `--color-surface-2` | `#efefef` | |
| `--color-surface-3` | `#e6e6e6` | |
| `--color-surface-4` | `#dcdcdc` | |
| `--color-surface-5` | `#cfcfcf` | |
| `--color-text` | `#212121` | |
| `--color-text-muted` | `#616161` | |
| `--color-primary` | `#00897b` | Teal |
| `--color-primary-fg` | `#ffffff` | |
| `--color-primary-container` | `#ccf0ec` | |
| `--color-secondary` | `#f4511e` | Coral |
| `--color-tertiary` | `#ffb300` | |
| `--color-error` | `#e53935` | |
| `--color-outline` | `#9e9e9e` | |
| `--color-outline-variant` | `#e6e6e6` | |

Success (`#66bb6a` / `#43a047`) shares green territory with teal — prefer teal for brand moments and reserve green strictly for semantic success.

## Shape, shadow & border signature

- `--shadow-1: none`, `--shadow-2: none`, `--shadow-inset: none` — ZERO shadows in both themes. This is the hard rule of the style.
- `--border-w: 0px` — no outlines either; planes of color and surface-tier steps do all the separation.
- No radius or device-radius override — the base token scale applies unchanged.
- Physically recognizable by: large solid teal/coral blocks sitting directly on neutral surfaces, generous padding, crisp edges, and absolutely nothing floating — if a box looks lifted, it's wrong.
- Emphasis ladder (in place of shadows): surface-1 → surface-5 tonal steps, then `--color-primary`, then `--color-secondary` for the loudest moments.

## Must-use tokens

- Zero-shadow discipline: no `box-shadow` anywhere — if a surface needs emphasis, change its color, not its shadow.
- `--color-primary` (teal) for all primary actions; `--color-secondary` (coral) for contrast accents and alerts-lite.
- Surface tiers 1–5 as the only depth mechanism for nesting.
- `--color-outline-variant` for any needed divider, kept subtle.

## Recommended components

- BottomNav variant: **labeled** — the classic full-width flat bar with icon-above-label and a top indicator is native to flat design's utilitarian DNA and echoes early Material tabs. Floating pills add fake elevation this style forbids.
- TopBar variant: **inline** — the compact enterprise row keeps the interface dense, flat, and function-first, optionally tinted teal as a solid color plane. Hero titles overstate a style whose whole point is economy.
- Do: encode sections as solid color planes (teal header on gray body, coral badge on teal tile).
- Don't: use gradients, glows, or elevation — not even "just a subtle one".
- Do: keep padding generous and edges crisp; flat 2.0 breathes through whitespace, not blur.

## Common mistakes

- Adding a drop shadow "for a little depth" — the single most common flat-design violation; use a surface tier or hue change instead.
- Gradients on buttons/banners — flat 2.0 is post-gradient; solid fills only.
- Thin outlines around every box (`--border-w` is 0) — that drifts toward bauhaus/brutalism.
- Using coral or amber as the primary action color — teal owns actions; coral/amber are contrast accents.
- Weak nesting: stacking surface-1 on surface-1 with nothing else — step the tier or introduce a color plane.
- Cramped spacing — flat 2.0 is generous, not the dense 2013 first wave.

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
  { id: "tasks", label: "Tasks", icon: /* 22x22 svg */ null },
  { id: "focus", label: "Focus", icon: null },
  { id: "profile", label: "Profile", icon: null },
];

export default function Page() {
  return (
    <DeviceFrame theme="dark" style="flat">
      <Screen>
        <TopBar variant="inline" title="Tasks" subtitle="Today" />
        {/* content: solid teal/coral planes on neutral tiers, zero shadows */}
        <BottomNav variant="labeled" items={NAV} activeId="tasks" onSelect={setTab} />
      </Screen>
    </DeviceFrame>
  );
}
```
