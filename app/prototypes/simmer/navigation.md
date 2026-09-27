# simmer — navigation

## What this prototype is

**"Simmer"** — a recipes & cooking companion built in **Claymorphism**
(`<DeviceFrame style="clay">`). Every surface is puffy: idle cards ride
`--shadow-2`, every press sinks with `translateY` + `--shadow-inset`
("pressed dough"), zero borders anywhere. Dish imagery is **generated
from data** — each recipe carries a tiny `art` descriptor (vessel kind +
three clay colors + blob count) that the `DishArt` component renders as
layered CSS clay shapes (vessel, food disc, seeded ingredient blobs,
steam wisps). There are no bitmaps and no emoji; all icons are inline
SVG. Four tabs — **Cook / Find / Plan / Kitchen** — plus a pushed
recipe-detail view.

## Screens

| Screen        | View id     | Contents |
|---------------|-------------|----------|
| Cook          | `#cook`     | Rounded clay header card (brand mark, date, moment-aware greeting) that the content scrolls **behind**; "what's cooking" hero — big generative dish, time/difficulty/serves chips, **Open recipe** + **Simmer now** (arms the Kitchen dial + toast); snap-scrolling Today's picks rail of wide recipe cards; kitchen-rhythm stat tiles. |
| Find          | `#find`     | Inset clay search pill (proto-kit custom keyboard; matches names, blurbs **and ingredient names**), category filter chips with counts (All / Breakfast / Mains / Soups / Baking). Puffy 2-col recipe grid — each card shows time, difficulty, ingredient count and an independent heart. Empty state when nothing matches. |
| Recipe detail | push        | Its own sticky clay header with a **puffy back button** + title + heart (chrome variety — not the tab header). Big dish, **serving stepper** that rescales every ingredient quantity live, dotted-leader ingredient list, method as numbered clay blobs — tapping one presses it into the dough (persisted) with a progress pill; footer button puts the recipe on the clay dial. |
| Plan          | `#plan`     | Five chunky day cards (Mon–Fri), each with midday + evening slots; tapping a slot opens the clay **picker sheet** (all 10 recipes, current one flagged, "leave empty"). Below: the **shopping list auto-derived** from the week — quantities merged across recipes, grouped by aisle headers, every line a press-in clay checkbox (persisted, strike + sink), "reset ticks". |
| Kitchen       | `#kitchen`  | The **clay dial** — one interactive clock: countdown on a draining SVG ring inside a puffy face, pause/resume/reset/clear buttons + four quick presets; start it from a recipe's **Simmer now** and the tab header tracks the dish. Favorites grid (persisted, live from hearts anywhere), pantry check pucks (inset-off / puffy-on), Dark/Light segmented switch. |

## Interactions

- **The clay press** — every interactive element: `translateY(2–3px)` +
  `--shadow-inset` on `:active`; done/checked states stay pressed.
- **Generative dish art** — blob offsets are seeded per recipe
  (`2654435761 * i`), so each dish is a stable little still life; blobs
  pop in staggered, steam loops on pot/pan kinds.
- **Serving stepper → live scaling** — quantities are stored per base
  serving and divided/multiplied on render (`formatQty` snaps to ¼/½/¾
  or whole halves for spoon units, rounds grams/ml).
- **Plan → list derivation** — `shoppingList(plan)` folds all planned
  recipes into aisle-grouped merged lines; checks persist by line key,
  so editing the plan never crashes the list.
- **Detail push** — `openRecipeId` overlays the pushed view on the
  active tab; swipe-right or the back button closes it first. The
  view remounts per recipe (`key`) resetting the stepper; done steps
  persist per recipe.
- **Timer** — a single 1s interval in SimmerProvider while running;
  completion flips the dial face to the tertiary container + toast.
  Session-only by design (a localStorage countdown that "resumes"
  after a reload is a lie).
- **Staggered entrance** — `key={view}` remount replays `sm-rise`
  blocks at `--stagger * 60ms`; the detail view slides in with
  `sm-push`.
- **Theme** — segmented control flips `.device[data-theme]` only (the
  page never darkens), persisted as **`simmer-theme`**; bezel inverts
  automatically via the clay style layer. All other prefs persist as
  `simmer-*` (favorites / plan / list / steps / pantry, `-v1`).
- **Swipe** — horizontal drag walks the four tabs
  (`useSwipeSimulation`); right-swipe closes the pushed detail.
- **Keyboard** — the Find search input uses the proto-kit custom
  keyboard (`KeyboardProvider` + `<Keyboard />` + `useKeyboardInput`).

## Files

| File | What it is |
|------|------------|
| `app/prototypes/simmer/layout.tsx` | Imports tokens.css + styles/index.css + `simmer.css`; metadata "Simmer — ANDROID-PROTOTYPE". |
| `app/prototypes/simmer/page.tsx` | Client shell: DeviceThemeProvider (`simmer-theme`, initial dark) → SimmerProvider → KeyboardProvider → Stage panels → DeviceFrame (`style="clay"`) → `.sm` app root (hash-routed screens keyed by view, pushed detail, proto-kit `BottomNav variant="soft"`, picker sheet, toast, Keyboard); swipe wiring; side-panel MiniBar/kvlist helpers. |
| `src/prototypes/simmer/simmer.css` | ONE stylesheet, everything under `.sm` (plus `.device` scrollbar / `body` chrome / stage-panel helpers like the other prototypes): header-card-over-scroll layout, chips/buttons, dish art, cards, all five screens, sheet/toast, reduced-motion block. No palette overrides — the clay style layer IS the brand. |
| `src/prototypes/simmer/lib/data.ts` | 10 curated recipes (per-serving ingredients + aisle, steps, `art` descriptor), categories/aisles/difficulty tables, `formatQty/formatMinutes/recipeById`, week-plan types + `DEFAULT_PLAN`, `planEntries`, `shoppingList` (aisle-grouped merge), pantry list. |
| `src/prototypes/simmer/state/simmer-context.tsx` | Central provider: favorites, week plan, checked list lines, done steps, pantry, the one timer interval, pushed-detail + picker-sheet targets, toast channel; all persistence (`simmer-*-v1`). |
| `src/prototypes/simmer/components/icons.tsx` | Inline SVG icon set (pot/search/calendar/shelf nav, clock/flame/heart/check/back/close/stepper/play/pause/reset/cart/sun/moon...). |
| `src/prototypes/simmer/components/dish-art.tsx` | Generative CSS dish: pan/bowl/tray/stack/pot vessels + seeded blobs + steam + butter-peak, driven by the recipe's `art`. |
| `src/prototypes/simmer/components/chips.tsx` | MetaChip / RecipeMeta / FilterChip (pressed-in active state). |
| `src/prototypes/simmer/components/recipe-card.tsx` | The puffy tile (grid/wide variants, inset art well, independent heart with pop). |
| `src/prototypes/simmer/components/sheet.tsx` + `picker-sheet.tsx` | Clay bottom sheet (scrim, slide-up settle, Esc/× close) + the slot picker. |
| `src/prototypes/simmer/components/toast.tsx` | Puffy snackbar above the tab bar. |
| `src/prototypes/simmer/screens/*.tsx` | `cook-screen`, `find-screen`, `detail-screen`, `plan-screen`, `kitchen-screen`. |

## Non-obvious decisions (for future agents)

- **Chrome variety is deliberate.** No large-title + floating-pill
  clone: the tab chrome is a rounded header **card** with an opaque
  surface + `--shadow-1`, and `.sm-content` (inset 0, big top padding)
  scrolls **behind** it. The recipe detail reuses none of it — its own
  sticky header with a puffy back button. The nav is proto-kit
  `BottomNav variant="soft"`, whose active item presses *inward*
  (`--shadow-inset`) — inverted vs the rest of the app, which pops
  outward; that contrast is the clay signature read two ways.
- **Light-theme contrast is the hard rule.** Text never sits pale-on-
  pale: body/labels use `--color-text` (#262038, 11.6:1) or
  `--color-text-muted` (#5b547a, ≥5.2:1 on every light tier). `--color-
  text-subtle` is not used anywhere. White chip/button labels only ever
  sit on the pre-darkened accents (`#6d3fe0`/`#0e8a7d`/`#c94f8c`);
  mint/teal-on-container text (tertiary) is re-darkened to `#0b6e63`
  under `[data-theme="light"]` for checks and section icons. Dish-art
  colors are decorative (`aria-hidden`, never carry text). Outer clay
  lift stays at the style layer's ≥0.28-alpha violet-tinted shadows.
- **No `--color-*` overrides in simmer.css.** All palette comes from
  the clay style layer; this file adds layout/craft only, so both
  themes inflate correctly with zero per-prototype color drift.
- **`.sm` app-root pattern** (like bloom's `.bl`): absolute in the
  Screen at `z-index:10`; sheets at z 28 under the proto-kit status
  bar (30). `key={view}` remount replays entrances.
- **Per-serving ingredient quantities** (`qty` for 1 base serving)
  keep the stepper math one division deep; the shopping list multiplies
  back out by each recipe's *planned* servings.
- **Preset timers use id `"preset"`** so `recipeById(null)` simply
  hides the dish label instead of inventing a fake recipe.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/simmer/
