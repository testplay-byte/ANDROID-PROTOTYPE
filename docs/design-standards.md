# docs/design-standards.md — Mobile & desktop UI standards

> **This doc states the RULES. `docs/SPEC.md` states the SYSTEM** (surfaces,
> components, adaptivity, targeting). If the two ever disagree, SPEC is right
> and this file is a bug — fix it in the same commit.
>
> Rewritten 2026-09-28 against the real code (`src/proto-kit/`) to remove ten
> known contradictions with `template-rules.md`, `preferences.md`,
> `agent-quickstart.md` and `STARTUP.md`. If a fact here is wrong, it is
> checked against code, not against another doc.

---

## 1. The frame (what surrounds a prototype)

A prototype lives inside a **frame**, and the frame is the preview's job, not
the app's.

| Surface | Frame | Chrome inside it |
|---|---|---|
| phone | `<DeviceFrame>` | status bar (time · cutout · wifi · signal · battery) |
| tablet | `<SurfaceFrame surface="tablet">` | **no** title bar, no menu bar — it is a device |
| desktop | `<SurfaceFrame surface="desktop">` | optional OS title bar + menu bar, window controls, drag-resize |

**Frame facts (true today):**

- The phone frame's **size is user-controlled** (Settings page: Compact 360×740 ·
  Standard 390×844 · Large 430×932 · custom 320–520 × 600–1000). Prototype CSS
  must never assume a width.
- Desktop/tablet windows carry their own size (`--surface-w` / `--surface-h`),
  resize by dragging 8 handles (persisted), and go real fullscreen.
- The bezel **inverts with the theme**: platinum `#cfcfcf` in dark, near-black
  `#0e0a17` in light, with token-driven widths (`--bezel-w` 3.5/4px, `--edge-w`
  4/4.4px). Design languages may override both.
- `data-theme` is scoped to the frame (`.device` **or** `.surface`) and is
  **never** set on `<html>` — page theme and app theme are separate systems.
- **Preview chrome belongs to the stage**: the Dashboard link (top-left), the
  full screen control (bottom-left) and the surface switcher (bottom-right)
  are rendered by `<Stage>` and share one `.previewpill` definition. An app's
  own UI never contains them.
- Status bar: 36px, decorative, user-configurable cutout (punch / pill /
  notch × center / left × sizes) via the Settings page.

## 2. Spacing — the 4px grid

`--sp-1` 4 · `--sp-2` 8 · `--sp-3` 12 · `--sp-4` 16 · `--sp-5` 20 ·
`--sp-6` 24 · `--sp-8` 32 · `--sp-10` 40 (px)

Screen gutters: 14px (phone), 20–24px (desktop). No ad-hoc 13px/18px gaps.

## 3. Type — the real scale

`--fs-display` 32 · `--fs-h1` 26 · `--fs-h2` 22 · `--fs-h3` 18 ·
`--fs-body-l` 16 · `--fs-body` 14 · `--fs-body-s` 13 · `--fs-label` 12 ·
`--fs-label-s` 11 (px)

A design language may rescale these on its own layer (HIG reads larger) — but
these are the only names that exist. **There is no second type scale**; a size
that isn't here is a design decision and belongs in the style layer.

Radii: `--r-xs` 8 · `--r-sm` 12 · `--r-md` 16 · `--r-lg` 20 · `--r-xl` 28 ·
`--r-pill` 999. The desktop surface tightens this scale on purpose, so a window
reads less bubbly than a phone.

## 4. Color

- App color comes from tokens only: `--color-bg`, `--color-surface-1…5`,
  `--color-text`, `--color-text-muted`, `--color-outline`,
  `--color-outline-variant`, plus the role set (`--color-primary`,
  `-primary-fg`, `-primary-container`, `-on-primary-container`, secondary /
  tertiary pairs, `--color-error`, `--color-warn`).
- The palette is a **warm earth system** (cream, beige, amber, orange), and the
  dashboard accent is **never indigo or blue**. Accent exceptions are
  per-design-language (HIG blue, Carbon IBM blue) and live inside a prototype,
  never in the dashboard chrome.
- Tints come from tokens: `color-mix(in srgb, var(--color-primary) 18%, transparent)`
  — never a hand-picked hex.
- Light and dark are both designed. A state that only reads in one theme is a
  defect (`docs/ui-failure-modes.md` #18).

## 5. Touch and pointer targets

- Phone: 44px minimum interactive height; bottom-nav items 58px (pill variants:
  tabbar 60, labeled 64, hard 56).
- Desktop: pointer targets may be 32px, but table rows and list items stay
  ≥36px, and density (comfortable/compact) is a real, persisted control.

## 6. Motion

`--dur-1` 100ms … `--dur-5` 500ms; `--ease-standard`, `--ease-emphasized`,
`--ease-emphasized-decel`. Entrances short and staggered, exits faster than
entrances. Everything decorative respects `prefers-reduced-motion`.

## 7. Components: reuse before you build

| Need | Use |
|---|---|
| Phone navigation | `<BottomNav variant>` — floating · tabbar · labeled · glass · soft · hard |
| Phone header | `<TopBar variant>` — large · center · inline · hero |
| Desktop navigation | `<DesktopSidebar>` / `<DesktopRail>` / `<DesktopTopBar>` |
| Content | `screens/` + `state/`; a **screen** is a phone concept, a **view** a desktop one |
| Sheets / dialogs | prototype-local — bottom sheets are phone, dialogs are desktop |

The variant a design language should use is recorded in
`docs/design-languages/<style>.md` under "Recommended components". Read it
before choosing, so eleven prototypes don't end up identical.

## 8. Accessibility (mandatory)

- Icon-only controls carry `aria-label`; toggles carry `aria-pressed` /
  `aria-checked`; the active nav item exposes `aria-current`.
- Focus is visible (`:focus-visible` outline from a token).
- Contrast ≥ 4.5:1 for text, 3:1 for large text and meaningful shapes.
- `prefers-reduced-motion`, `prefers-reduced-transparency` and
  `prefers-contrast` are honoured wherever the effect is decorative.

## 9. Content realism

Real names, real numbers, plausible copy. "Lorem ipsum", "Item 1", "Test 2", or
an empty state that says "No data" where the demo clearly has data, are defects.
Demo data is deterministic — no `Math.random()` in anything a user sees.

## 10. Dark mode

The app theme lives on the frame; the page/stage theme is separate. Both themes
ship in the same commit. A prototype that only looks right in dark is not
finished.

## 11. Content & layout awareness (mandatory)

Every element needs an explicit adaptive contract — SPEC §6. The three that
bite most:

1. **Grid tracks must grow**: `minmax(min-content, auto)` with the design floor
   on the item (`min-height`). A fixed-px track minimum silently disables growth
   and clips content (failure mode #25).
2. **Anything that scrolls needs `flex: 0 0 auto`** inside a column flex
   container (failure mode #26).
3. **Text declares its overflow** — wrap, or ellipsize with `min-width: 0` in
   the flex chain. Never clip mid-word.

## 12. Before you call it done

`node scripts/verify.mjs` (every prototype, every supported size) plus the
19-point checklist in `docs/ui-failure-modes.md`. Both are cheap: a defect
caught here saves the user a review cycle, and a defect found in review costs a
round trip.
