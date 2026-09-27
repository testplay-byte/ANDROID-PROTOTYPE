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
| `--color-tertiary`        | `#ff9500`   | iOS system orange (light)     |
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

## Typography — the iOS type scale

iOS runs **larger** than the M3 scale. Never set HIG screens from the M3 tokens (`--fs-body: 14px` reads cramped on iOS). Use the SF Pro scale instead — the fitness-tracker prototype declares these as `--ios-*` tokens in `src/prototypes/fitness-tracker/fitness-tracker.css`:

| Style       | Size / weight | Use for                                        |
|-------------|---------------|------------------------------------------------|
| Large Title | 34px / 700    | Top of each tab screen (collapses on scroll)   |
| Title 1     | 28px / 700    | Modal/sheet headings                           |
| Title 2     | 22px / 700    | Screen-level numbers (ring stats, stat cards)  |
| Title 3     | 20px / 600    | Secondary headings, avatar initials            |
| Headline    | 17px / 600    | Inline nav bar title, emphasized row text      |
| Body        | 17px / 400    | Row titles, list values, default text          |
| Callout     | 16px / 400    | Long body copy                                 |
| Subhead     | 15px / 400    | Day selectors, secondary pill text             |
| Footnote    | 13px / 400    | Subtitles, section headers/footers, hints      |
| Caption     | 12px / 400    | Stat labels, badge names                       |

- Screens should feel airy and confident, not dense — 17px body on list rows is the single biggest "this is iOS" tell.
- Tab bar labels are the exception: 10px, weight 500 (600 when active).
- Numbers that update live (timers, stats) get `font-variant-numeric: tabular-nums`.

## Grouped lists — exact geometry

The inset-grouped list is the backbone of iOS screens. Match these values:

- **Group cards** inset 16px from the screen edges (via the scroll content's padding), **10px vertical gaps between groups**, `border-radius: 10px`, no shadow (cards sit flat on the canvas).
- **Rows** 44px minimum (52px with subtitles), 17px body titles, 13px footnote subtitles, trailing values in secondary gray, chevrons in tertiary gray.
- **Icon discs** 29x29, `border-radius: 7px` (rounded square, like iOS Settings), tinted with the system color at 15% over the card.
- **Separators**: hairline (`--color-outline-variant` at 0.5 scaleY), inset 16px from the LEFT on plain rows, 57px on rows with an icon disc (starting at the text) — never full-width.
- **Section headers**: 13px uppercase gray above each group.
- **Section footers**: 13px gray caption under the group (like iOS Settings "explainer" text) — use the `GroupFooter` primitive.

## Large titles — collapse on scroll

Every top-level tab screen uses the iOS large-title pattern (implemented by `IosNavBar` + `useIosCollapse` in `src/prototypes/fitness-tracker/components/ios-nav-bar.tsx`):

- **Expanded**: the 34px/700 large title sits above the content; the inline row (44px) holds only leading/trailing actions.
- **On scroll past ~40px** (measured via the `.content` scroll event, not `window` — only the content scrolls inside the device frame): a `.is-collapsed`-style class collapses the large-title row (`max-height → 0`, opacity → 0) and fades in the 17px/600 inline title, centered.
- The collapsed bar becomes translucent blurred material (`color-mix` surface at ~80% + `backdrop-filter: blur(20px) saturate(1.8)`) with a hairline bottom border.
- Transition 250–320ms, iOS easing `cubic-bezier(0.25, 0.1, 0.25, 1)` — no bounce, no overshoot.
- Pushed detail screens (e.g. the workout session) use `inlineOnly` — compact centered bar, never a large title.

## Recommended components

- **BottomNav variant: `tabbar`** — the iOS tab bar is the definitive HIG navigation: full-width, translucent blur, labels always visible (10px). Tab glyphs follow the iOS convention: **outline when inactive, filled when active** (the fitness-tracker `page.tsx` swaps SVG variants per active tab). Blue only on the active tab.
- **TopBar: use the prototype's `IosNavBar`** (large title + collapse) for top-level tabs; use its `inlineOnly` mode for pushed detail screens. The generic proto-kit `TopBar variant="center"` remains available for static previews but has no large-title behavior.
- **Switches**: native iOS toggle — 51x31 track, 27px white knob (white in BOTH themes), iOS green (`--color-success`) when on. Use the prototype's `IosSwitch`, never an M3 switch.
- **Stepper**: iOS rounded-rect "- | +" — two ~34x30 buttons in an 8px-radius container with a hairline divider between; the value sits in the row, not inside the stepper.
- **Segmented control**: 32px tall (28px segments), 9px track radius, selected segment = raised surface-1 slab with a soft shadow.
- **Activity rings**: rounded stroke caps, each ring's own track rendered as its color at ~20% (not a flat gray), 600ms ease on progress changes.
- Do use `--color-tertiary` (iOS orange), `--color-success` (iOS green), `--ios-teal` (`#32ade6`/`#64d2ff`) and `--ios-indigo` (`#5856d6`/`#5e5ce6`) for status accents exactly like system apps do.
- Don't add thick borders, offset shadows, or saturated card backgrounds — HIG separation is hairlines + tonal steps.
- Do keep list rows full-bleed inside grouped cards with inset hairline separators (see the geometry section above).
- Don't use M3 purple anywhere — the tint ladder is red/green/blue/orange/indigo/teal only.
- Don't restyle the status bar area or fight the device frame — the HIG bezel (`#cfcfcf` dark theme) is part of the look.

## Motion & spacing

- Durations 250–350ms with iOS easing `cubic-bezier(0.25, 0.1, 0.25, 1)` (the prototype exposes `--ios-dur-fast: 250ms` / `--ios-dur: 320ms`). Never use bouncy overshoot curves.
- 8pt rhythm; scroll content clears the 60px tab bar with ~96px bottom padding.
- Don't use the M3 motion tokens (`--dur-1` at 100ms feels snapped, `--ease-emphasized` reads Android) on HIG screens.

## Common mistakes

- Using a near-black `#0d0d0d` instead of true `#000000` for the dark background.
- Replacing the system blue with a brand color "to be different" — on HIG that breaks the illusion.
- Putting drop shadows on cards; iOS grouped cards sit flat on the black/gray canvas.
- Setting list text from the M3 scale (14px body) instead of the iOS scale (17px body) — the screen instantly reads "Android".
- Full-width separators; iOS hairlines always start at the text.
- Forgetting the section footer under a settings group — the 13px gray caption is half the iOS Settings look.
- Using the `floating` nav pill — that reads Android/M3, not iOS.
- Making the tab bar opaque; the blur-through translucency is the signature.
- Leaving tab glyphs stroke-only when active — iOS fills the active tab's icon.
- Forgetting light mode: `#f2f2f7` grouped background with pure-white cards is not "default white page" styling.

## Demo prototype

Demo prototypes: the fitness tracker at `app/prototypes/fitness-tracker` (classic HIG)
and **Wallet** at `app/prototypes/wallet` — the latter layers Apple's iOS 26/27
**Liquid Glass** material on top of this style (floating glass tab/nav bars, the
Clear ↔ Tinted density setting, glass keypad). The glass recipe is prototype-scoped
in `src/prototypes/wallet/wallet.css` under `.wl` (see its navigation.md for why it
is not in proto-kit). Also see the dashboard styles gallery at
https://testplay-byte.github.io/ANDROID-PROTOTYPE/.

## Wiring

```tsx
// app/layout.tsx
import "@/proto-kit/tokens/tokens.css";
import "@/proto-kit/styles/index.css";

// app/page.tsx
import { DeviceFrame } from "@/proto-kit/device-frame/device-frame";
import { BottomNav } from "@/proto-kit/bottom-nav/bottom-nav";
import { IosNavBar, useIosCollapse } from "@/prototypes/fitness-tracker/components/ios-nav-bar";

<DeviceFrame theme="dark" style="hig">
  {/* top-level tab screen: large title that collapses on scroll */}
  <IosNavBar title="Home" collapsed={collapsed} trailing={/* icon buttons */ null} />
  {/* pushed detail screen: <IosNavBar title="Detail" inlineOnly leading={back} /> */}
  {/* screens */}
  <BottomNav
    variant="tabbar"
    items={navItems} // icons: outline svg, swapped for a filled svg when active
    activeId={active}
    onSelect={setActive}
  />
</DeviceFrame>
```
