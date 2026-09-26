# Minimalism (`minimal`)

> Quiet-luxury monochrome: pure neutrals, hairline borders, generous whitespace — hierarchy from type weight and spacing alone, with ink itself as the primary color.

## Identity

Minimal looks like a high-end fashion or productivity app stripped to essentials: grayscale surfaces, 1px hairlines, no decorative color anywhere, and a near-black/near-white "ink" acting as the primary. The lineage runs from Swiss typography through Dieter Rams's "less but better" into today's premium apps (thinking of luxury e-commerce and note-taking tools where restraint signals quality). Its one indulgence is a soft deep drop shadow (`--shadow-2`) reserved for true overlays — everything else is flat and hairline-separated.

## Use when / Avoid when

**Use when:**
- The product should feel premium, calm, and expensive — fashion, jewelry, architecture, portfolio.
- The app is content-first and reading-focused: notes, articles, meditation, journals.
- The audience skews professional/adult and distrusting of playful UI.
- You want typography and photography to carry the design, not chrome.
- The brief says "monochrome", "quiet", "editorial", "Apple-pro" restraint.
- Screens are simple enough that hierarchy survives without color coding.

**Avoid when:**
- The UI has many simultaneous states/severities that need color to parse (dense analytics, ops dashboards).
- The audience is young/consumer-casual — minimal can read as cold or boring.
- You cannot resist adding accent color — one stray blue chip breaks the whole language.
- Long forms and heavy onboarding: gray-only feedback gets monotonous.

## Palette

Dark (default):

| Token | Value | Notes |
|---|---|---|
| `--color-bg` | `#0e0e0e` | Near-black |
| `--color-surface-1` | `#161616` | |
| `--color-surface-2` | `#1c1c1c` | |
| `--color-surface-3` | `#232323` | |
| `--color-surface-4` | `#2b2b2b` | |
| `--color-surface-5` | `#343434` | |
| `--color-text` | `#f5f5f5` | |
| `--color-text-muted` | `#a3a3a3` | |
| `--color-primary` | `#fafafa` | Ink white IS the primary |
| `--color-primary-fg` | `#0a0a0a` | |
| `--color-primary-container` | `#2b2b2b` | |
| `--color-tertiary` | `#737373` | Mid gray |
| `--color-error` | `#e5484d` | The only saturated accent |
| `--color-outline` | `#343434` | Hairline gray |
| `--color-outline-variant` | `#232323` | |

Light:

| Token | Value | Notes |
|---|---|---|
| `--color-bg` | `#ffffff` | Pure white |
| `--color-surface-1` | `#fafafa` | |
| `--color-surface-2` | `#f4f4f4` | |
| `--color-surface-3` | `#eeeeee` | |
| `--color-surface-4` | `#e5e5e5` | |
| `--color-surface-5` | `#d9d9d9` | |
| `--color-text` | `#111111` | Ink |
| `--color-text-muted` | `#6b6b6b` | |
| `--color-primary` | `#111111` | Ink black IS the primary |
| `--color-primary-fg` | `#ffffff` | |
| `--color-primary-container` | `#f0f0f0` | |
| `--color-tertiary` | `#a3a3a3` | |
| `--color-error` | `#d13438` | |
| `--color-outline` | `#d9d9d9` | |
| `--color-outline-variant` | `#eeeeee` | |

Success (`#46a758` / `#2f7d3b`) and warn (`#f5a623` / `#b45309`) exist but are for semantic feedback only — never decoration.

## Shape, shadow & border signature

- `--border-w: 1px` — hairlines only. Borders (`--color-outline`, `--color-outline-variant`) do all the structural work.
- `--shadow-1: none` and `--shadow-inset: none` — cards are NOT lifted; they are hairline boxes.
- `--shadow-2` is the single exception: `0 16px 48px rgba(0, 0, 0, 0.5)` dark / `0 16px 48px rgba(0, 0, 0, 0.08)` light — a deep, soft shadow for overlays, sheets, and the floating nav only.
- No radius scale override — use the base token radii unchanged.
- Physically recognizable by: hairline-separated flat surfaces, huge whitespace, grayscale-only UI, and one soft overlay shadow. Any colored chip, gradient, or puffy shadow is foreign matter.

## Must-use tokens

- `--border-w` (1px) hairlines with `--color-outline` / `--color-outline-variant` — structure without weight.
- Ink-as-primary: `--color-primary` + `--color-primary-fg` for all main actions.
- The generous spacing scale — whitespace is a load-bearing token in this style.
- `--shadow-2` strictly for overlays/sheets/floating nav; nothing else gets a shadow.

## Recommended components

- BottomNav variant: **floating** (monochrome) — the floating pill in pure ink/gray reads as a quiet, premium control and justifies the one allowed `--shadow-2`. A labeled slab adds visual noise this style forbids.
- TopBar variant: **large** — a big, airy left-aligned title in strong type weight delivers hierarchy without any decoration, which is exactly the minimal thesis. Compact bars cramp the whitespace story.
- Do: differentiate with font weight, size, and gray tiers (`--color-text` → muted → subtle).
- Don't: color any control beyond semantic error/success/warn feedback.
- Don't: give cards shadows or heavy borders — a 1px hairline is the maximum.

## Common mistakes

- Adding an accent color (a teal button, a blue link) — if you are tempted to add a color, don't.
- Shadowing regular cards; only overlays and the floating nav earn `--shadow-2`.
- Cramped layouts: minimal without generous whitespace is just gray, not luxury.
- Using heavy 2px borders — that's Bauhaus/brutalism; minimal is strictly 1px hairlines.
- Letting every text sit at full contrast — muted/subtle grays create the soft hierarchy.
- Filling every pixel; emptiness is the feature, not wasted space.

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
  { id: "library", label: "Library", icon: null },
  { id: "settings", label: "Settings", icon: null },
];

export default function Page() {
  return (
    <DeviceFrame theme="dark" style="minimal">
      <Screen>
        <TopBar variant="large" title="Overview" subtitle="Quiet, by design" />
        {/* content: hairline-separated sections, type-weight hierarchy, zero color */}
        <BottomNav variant="floating" items={NAV} activeId="home" onSelect={setTab} />
      </Screen>
    </DeviceFrame>
  );
}
```
