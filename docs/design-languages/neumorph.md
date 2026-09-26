# Neumorphism / Soft UI (`neumorph`)

> Extruded plastic-look surfaces the same color as the background, shaped entirely by dual soft shadows — dark bottom-right, light top-left.

## Identity

Neumorphism ("new skeuomorphism", popularized ~2019-2020 by dribbble shots from Alexander Plyuto and others) makes UI elements look like they were molded from one continuous soft-plastic sheet: raised elements extrude out of the background, pressed elements are carved into it. There are no borders, no outlines, and almost no contrast between surface and background — shape is communicated purely by the paired light/dark shadows.

In this repo the style is tokenized in `src/proto-kit/styles/neumorph.css` as `data-style="neumorph"`.

## Use when / Avoid when

Use when:

- The brief says "soft UI", "neumorphism", "squishy/plastic", or shows extruded controls.
- The product is a focused tool: music player, smart-home control, timer, calculator.
- The screen has few, large controls rather than dense data.
- A tactile, gadget-like, "physical device" feel is the goal.
- One warm accent (the style's amber/copper) can carry all interactive emphasis.

Avoid when:

- The screen is information-dense (tables, feeds) — low-contrast surfaces collapse.
- Accessibility is the priority: neumorphism flirts with contrast failures by design.
- The brief needs strong brand color variety; the style is monochrome by nature.
- You need long scrollable lists with many small touch targets.

## Palette

Dark theme (default):

| Token                     | Value       | Note                              |
|---------------------------|-------------|-----------------------------------|
| `--color-bg`              | `#23262b`   | The "plastic sheet" base color    |
| `--color-surface-1`       | `#282b31`   | Barely a step above bg            |
| `--color-surface-2`       | `#2e3137`   |                                   |
| `--color-surface-3`       | `#34373d`   |                                   |
| `--color-surface-4`       | `#3a3d43`   |                                   |
| `--color-surface-5`       | `#41444a`   |                                   |
| `--color-text`            | `#d7dae0`   | Keep at AA — low contrast is NOT for text |
| `--color-text-muted`      | `#9aa0aa`   |                                   |
| `--color-primary`         | `#e0a458`   | Warm copper accent                |
| `--color-primary-fg`      | `#2a2118`   | Dark text on copper               |
| `--color-primary-container` | `#3d3427` |                                   |
| `--color-tertiary`        | `#8fb8a8`   | Muted sage                        |
| `--color-error`           | `#e07a6e`   | Desaturated coral                 |
| `--color-outline`         | `#4a4e55`   | Use sparingly — the style is borderless |
| `--color-outline-variant` | `#35383e`   |                                   |

Light theme:

| Token                     | Value       | Note                              |
|---------------------------|-------------|-----------------------------------|
| `--color-bg`              | `#e0e5ec`   | Classic neumorph blue-gray        |
| `--color-surface-1`       | `#e4e9f0`   |                                   |
| `--color-surface-2`       | `#e9edf3`   |                                   |
| `--color-surface-3`       | `#eef1f6`   |                                   |
| `--color-surface-4`       | `#f2f5f9`   |                                   |
| `--color-surface-5`       | `#f6f8fb`   |                                   |
| `--color-text`            | `#3a4150`   |                                   |
| `--color-text-muted`      | `#6a7382`   |                                   |
| `--color-primary`         | `#e07b39`   | Warm orange accent                |
| `--color-primary-fg`      | `#ffffff`   |                                   |
| `--color-primary-container` | `#f5e3d4` |                                   |
| `--color-tertiary`        | `#5f9e8c`   |                                   |
| `--color-error`           | `#d65a4e`   |                                   |
| `--color-outline`         | `#b8bfc9`   |                                   |
| `--color-outline-variant` | `#d0d6de`   |                                   |

## Shape, shadow & border signature

- **Radius scale: puffier than default.** `--r-xs: 10px`, `--r-sm: 14px`, `--r-md: 18px`, `--r-lg: 24px`, `--r-xl: 30px` — soft, pillowy corners everywhere.
- `--shadow-1: 5px 5px 12px rgba(0, 0, 0, 0.45), -5px -5px 12px rgba(255, 255, 255, 0.045)` (dark) — the dual extrude: dark source bottom-right, light top-left.
- `--shadow-2: 10px 10px 24px rgba(0, 0, 0, 0.5), -8px -8px 20px rgba(255, 255, 255, 0.05)` — larger extrude for hero elements.
- `--shadow-inset: inset 4px 4px 10px rgba(0, 0, 0, 0.5), inset -4px -4px 10px rgba(255, 255, 255, 0.04)` — the carve, for pressed/active states and wells.
- In light theme the same roles use the classic `rgba(163, 177, 198, …)` shadow + `rgba(255, 255, 255, …)` highlight pair.
- `--border-w: 0px` — borders and outlines kill the illusion; never outline a neumorph surface.
- What makes it recognizable: surface color ≈ background color, and every element showing the two-directional shadow pair.

## Must-use tokens

Per the `neumorph.css` header: `--shadow-1` / `--shadow-2` (extrude) and `--shadow-inset` (carve/press) on EVERY raised or pressed element. A flat card with a plain shadow or a border is not neumorphism — the dual-shadow extrude is the style.

## Recommended components

- **BottomNav variant: `soft`** — the floating soft bar applies the style's extruded/inset shadows to the nav itself, so the bar reads as molded out of the same sheet as the content. Full-width hard slabs or glass pills contradict the plastic look.
- **TopBar variant: `large`** — a big left-aligned title with no border sits cleanly on the unbroken background; a boxed/centered bar would need separation the style refuses to provide.
- Do render toggle/knob/slider controls as inset wells with extruded knobs — it is the style's signature moment.
- Don't use `--color-outline` borders on cards; carve depth with `--shadow-inset` instead.
- Do keep text contrast at AA (`#d7dae0` on `#23262b`) even though surfaces may be subtle.
- Don't place busy images directly on the background without an extruded frame around them.

## Common mistakes

- Using default M3-style single drop shadows instead of the dual light/dark pair.
- Adding `--border-w` outlines because the surface "isn't visible enough" — re-shape the shadows instead.
- Making surfaces dramatically lighter/darker than the background; the extrusion should do the work.
- Dropping the whole UI into low-contrast including TEXT — text must stay AA-readable.
- Mixing in sharp corners; the puffy radius scale is part of the identity.
- Forgetting pressed states: any tappable element should switch to `--shadow-inset` when active.

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

<DeviceFrame theme="dark" style="neumorph">
  <TopBar variant="large" title="Now Playing" subtitle="Soft UI" trailing={/* icon buttons */ null} />
  {/* screens */}
  <BottomNav
    variant="soft"
    items={navItems}
    activeId={active}
    onSelect={setActive}
  />
</DeviceFrame>
```
