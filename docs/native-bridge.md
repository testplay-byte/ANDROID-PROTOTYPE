# docs/native-bridge.md — carrying this design system to Kotlin and Swift

> Written 2026-09-28 as part of the multi-surface expansion. **No native
> prototype exists yet** — this is the contract that makes one cheap later. Its
> only job is to keep the web system honest: if a token can be translated
> without renaming, a future Compose or SwiftUI build reads the same source of
> truth instead of re-inventing values.

---

## 1. The rule

**One token vocabulary, three targets.** A value is named once in
`src/proto-kit/tokens/tokens.css` and mapped to Compose / SwiftUI without
renaming. Web CSS variables are the canonical spelling; the native mappings
below are mechanical. If a design decision needs a new value, it is added to
the token layer first — never hardcoded in a prototype, because a hardcoded
value cannot cross to native.

## 2. Token → Compose (Material 3) / SwiftUI

| Token (web) | Compose | SwiftUI | Notes |
|---|---|---|---|
| `--color-bg` | `MaterialTheme.colorScheme.background` | `.background` / `Color("bg")` | surface-1…5 map to `surfaceContainer*` |
| `--color-surface-1…5` | `surfaceContainerLowest…Highest` | `Color("surface1"…)` | keep the ordinal meaning |
| `--color-text` / `--text-muted` | `onSurface` / `onSurfaceVariant` | `.primary` / `.secondary` | |
| `--color-primary` / `-fg` | `primary` / `onPrimary` | `.tint` / label colour | |
| `--color-primary-container` / `-on-…` | `primaryContainer` / `onPrimaryContainer` | accent bg / on-accent | |
| `--color-error` / `--color-warn` | `error` / custom warn | `.red` / custom | warn has no M3 role; keep the name |
| `--color-outline` / `-variant` | `outline` / `outlineVariant` | `.gray` / `.gray.opacity` | |
| `--fs-display … --fs-label-s` | `displaySmall … labelSmall` | `.largeTitle … .caption2` | px → sp via `sp`/`dp` scaling |
| `--sp-1 … --sp-10` | `4.dp … 40.dp` | `4 … 40` points | 4px grid maps 1:1 |
| `--r-xs … --r-pill` | `RoundedCornerShape(8.dp … )` | `RoundedRectangle(cornerRadius: 8)` | `--r-pill` → `CircleShape` |
| `--dur-1 … --dur-5` | `tween(ms)` | `.easeInOut(duration:)` | 100–500ms |
| `--ease-emphasized(-decel)` | `EmphasizedDecelerate` | custom `Spring`/timing curve | approximate, never invented per-app |
| `--shadow-1/2/inset` | `shadow`/`surfaceTint` | `.shadow(radius:)` | neumorphism & glass have **no native equivalent** — see §4 |
| `--device-radius` | (n/a) | (n/a) | frame chrome only; never part of an app |

## 3. What a native prototype would consume

1. The **token contract** of its design language — `docs/design-languages/<style>.md`
   (palette tables already list the exact values, both themes).
2. The **component inventory** for that language (SPEC §7 / the style doc) —
   a native build re-implements the same components, not new ones.
3. The **failure modes** (`docs/ui-failure-modes.md`) — they are language-neutral;
   #25 and #26 are layout laws, not CSS laws.
4. The **adaptivity contract** (SPEC §6) — in Compose that maps to
   `WindowSizeClass` / `BoxWithConstraints`; in SwiftUI to size classes. The
   breakpoints carry over unchanged.

## 4. Known gaps to plan for (not solved today)

| Gap | Web today | Native implication |
|---|---|---|
| **Liquid glass** | `backdrop-filter` + a token recipe (glass style) | iOS 26 `glassEffect` / Android 12+ `RenderEffect` blur; the *recipe* is portable, the API isn't |
| **Neumorphism** | dual inset/outset shadows | Compose `Modifier.drawBehind` / SwiftUI custom shadows — expensive; expect a simpler, flatter native variant |
| **Scrollbars** | token-driven, hidden on phone | native scroll indicators are OS-owned |
| **The window chrome itself** | proto-kit | native apps have real windows; the preview chrome is irrelevant there |
| **Density toggles** | `data-density` + CSS | Android `fontScale`, iOS Dynamic Type — a *system* control instead |

## 5. Naming discipline for the future

- Keep new tokens **platform-neutral**: no `px`, no `android`, no `ios` in the
  name. `--sp-4`, not `--sp-4px`; `--r-md`, not `--corner-android`.
- Add a mapping row here **in the same commit** that introduces the token.
- A design language is the unit of portability: its style file is what a native
  build must be able to read without interpretation.
