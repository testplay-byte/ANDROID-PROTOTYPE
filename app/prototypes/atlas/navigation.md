# atlas — navigation

## What this prototype is

**"Atlas"** — a travel trip planner in the **Bento Grid** design language
(`style="bento"`), where the tile hierarchy *is* the information
architecture. Tile sizes encode frequency of use (destination hero 2-wide,
weather 2-wide, countdown tall 1×2, utility tiles 1×1), the header is a tile
grown from the grid (not a large-title + floating pill), and the nav is a row
of four equal rounded cells (not a floating pill bar). The signature motion
is the **tile expand**: any owned tile morphs into a full-screen view
(~300ms scale + fade, emphasized easing) and collapses back.

All destination visuals — skyline, sun, ridge silhouettes — are generated
from colour tokens in `data.ts` (layered CSS gradients + procedurally hashed
SVG ridges). Zero bitmaps, zero emoji.

## Screens

| Screen | View id | Contents |
|--------|---------|----------|
| Trip | `#trip` | Header tile (greeting + trip-switch dots); destination hero with generative landscape art + departure chip; 2×1 weather tile with mini forecast bars; tall countdown tile (big orange numeral); 1×1 tiles for flights, stay, budget ring and activities count; packing-progress strip linking to `#pack`. Every tile taps into the expand overlay. |
| Places | `#places` | Collection hero (saved count as the big numeral + colour pips); destination cards as 2-up bento media tiles — city loud, country muted, days chip, bookmark toggle (persisted). Tapping a city sets it as the next trip and opens the expanded destination. |
| Pack | `#pack` | Progress banner (done/total + gradient bar); Essentials spans full width (the 2×2 of the layout) with a 2-col cell grid; Tech + Docs are equal half tiles with 1-col cells; checked cells fill with the accent; arm-then-confirm reset for the trip. State persists per trip. |
| Me | `#me` | Identity tile (avatar, saved/planned counts, level badge); stats bento (countries / trips / miles as big numerals, streak caption); Dark↔Light segmented control (`useDeviceTheme`, persisted as `atlas-theme`); trip-length stepper and three notification switches (persisted prefs); About → toast. |

## Interactions

- **Tile expand (signature)** — tap hero → Destination, weather → Forecast,
  flights → Flights, stay → Stay, budget → Budget ring + buckets,
  activities → timeline. The overlay scales up from 0.72 with
  `--ease-emphasized` (~300ms); the header chevron (or a horizontal swipe)
  collapses it.
- **Trip switching** — dots in the header tile cycle `tripIdx`; hero art,
  countdown, weather, flights, budget and pack state all re-derive from the
  selected destination.
- **Saved collection** — bookmark on a Places card toggles `atlas-saved-v1`;
  toast confirms add/remove; collection hero count + pips update live.
- **Packing** — cells toggle per-trip state (`atlas-pack-v1` seeded from
  `PACK_SEED`); Trip's packing strip and Pack's banner share the count.
- **Theme** — Dark/Light flips the device scope only
  (`.device[data-theme]`), persisted as `atlas-theme`.
- **Swipe** — horizontal drag navigates the four tabs
  (`useSwipeSimulation`); while a tile is expanded, a swipe collapses it
  first.
- All state persists in `localStorage` (`atlas-saved-v1`, `atlas-pack-v1`,
  `atlas-prefs-v1`, `atlas-trip-v1`).

## Files

| File | What it is |
|------|------------|
| `app/prototypes/atlas/layout.tsx` | Imports tokens.css + styles/index.css + `atlas.css`; metadata. |
| `app/prototypes/atlas/page.tsx` | Client shell: DeviceThemeProvider (`atlas-theme`, initial dark) → AtlasProvider → Stage panels → DeviceFrame (`style="bento"`) → `.at` app root (screens, bento nav row, expand overlay, toast); hash router + swipe wiring; side-panel MiniBar/kvlist helpers. |
| `src/prototypes/atlas/atlas.css` | One stylesheet, everything under `.at`: tile atom (sizes/tones/stagger), landscape art, four screens' grammar, expand morph, nav row, toast, reduced-motion block, stage-panel helpers. |
| `src/prototypes/atlas/lib/data.ts` | 5 destinations as art + trip data (sky/sun/ridge tokens, forecast, flights, stay, budget buckets, activities), pack groups + per-trip seeds, countdown offsets, prefs defaults, stats. |
| `src/prototypes/atlas/state/atlas-context.tsx` | Central provider: tripIdx, saved collection, per-trip packed state, prefs, expanded-tile id, toast — all persisted (SSR-safe hydrate). |
| `src/prototypes/atlas/components/icons.tsx` | Inline SVG icon set (nav, travel, weather, utility) — no emoji. |
| `src/prototypes/atlas/components/landscape-art.tsx` | Generative destination art: gradient sky + sun disc/glow + two procedurally hashed ridge silhouettes per city. |
| `src/prototypes/atlas/components/tile.tsx` | The bento atom: wide/tall spans, tones, stagger index, hover-lift/press-sink button mode. |
| `src/prototypes/atlas/components/expand.tsx` | Full-screen morph view for the six owned tiles (destination/weather/flights/stay/budget/activities). |
| `src/prototypes/atlas/components/toast.tsx` | Raised-tile confirmation pill above the nav row. |
| `src/prototypes/atlas/screens/*.tsx` | `trip-screen.tsx`, `places-screen.tsx`, `pack-screen.tsx`, `me-screen.tsx`. |

## Non-obvious decisions (for future agents)

- **Chrome deviation from the style guide is deliberate.** `bento.md`
  recommends large TopBar + floating BottomNav; the user's standing mandate
  forbids the large-title + floating-pill clone, so the header is a grid
  tile and the nav is four equal rounded cells styled with the same
  surface-1 + shadow-1 language as the tiles. Do not "fix" this back.
- **Differentiation from smart-home (the other bento demo):** Atlas's tile
  grammar is travel — media tiles with generative art and scrims, a tall
  countdown numeral, checklist cells that fill with the accent, and the
  expand morph. Smart-home is control tiles (dials, sliders, camera). Keep
  them visibly distinct when editing either.
- **`daysUntilDeparture` is pinned to a fictional "today" (27 Sep 2026)** in
  `data.ts` so countdown numbers stay stable for reviewers; do not swap in
  `Date.now()` differences without pinning flight dates too.
- **The expand overlay lives at page level**, driven by the `expanded` id in
  context, so both Trip tiles and Places cards can open the Destination
  view. Views remount with `key={view}` on tab change to replay the tile
  entrance stagger.
- **Nav row sits inside `.at` (z 15), toast z 25, expand z 20** — the proto-kit
  status bar (z 30) always stays on top; `.screen` is already flex-below it,
  so `.at-screen` uses a modest 20px top padding.
- **Accent scarcity is enforced**: orange marks the countdown numeral, live
  flight dots, the active nav cell and checked cells only; weather bars use
  secondary/tertiary hues in small doses.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/atlas/
