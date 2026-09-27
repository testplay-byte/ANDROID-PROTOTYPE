# bloom — navigation

## What this prototype is

**"Bloom"** — a plant-care companion built in plain **Material 3 (default
style, no `data-style` layer)**: the repo's canonical M3 reference
implementation. All colors/surfaces come from the default purple palette in
`src/proto-kit/tokens/tokens.css`; nothing is overridden. Screens use M3
tonal elevation (no shadows except the FAB/sheet), the floating content-sized
`<BottomNav>`, emphasized-easing motion tokens, animated SVG thirst rings,
M3 bottom sheets, a primary-container FAB, segmented theme switch and a
material switch. Plant art is **generated from data** (shape + pot tokens →
inline SVG), so there are zero bitmap assets.

## Screens

| Screen  | View id    | Contents |
|---------|-----------|----------|
| Home    | `#home`   | Time-aware greeting with inline leaf mark, "due / thirsty soon" chips, 2-col collection grid — per-plant generative SVG art, thirst ring (fills on mount, green→amber→red), "watered Nd ago". Card → plant bottom sheet (big art, care facts light/water/temp, **Water now** completes a watering: ring springs back to full, button flips to done state, toast). FAB → Add-plant sheet (6 presets, stateful). |
| Water   | `#water`  | Streak card (flame-leaf icon, springing tabular counter), weekly progress bar that fills as tasks tick, "Today's schedule" rows (time slot, mini art, task + thirst meta) — checking fires a droplet ripple, strike-through, circular checkbox; 7-day upcoming strip with due-days tinted and today outlined. |
| Guide   | `#guide`  | Category chips (All / Watering / Light / Soil / Pets) filtering a 6-article accordion; rows expand with a smooth `grid-template-rows 0fr→1fr` animation + rotating chevron; tinted per-category icon discs. |
| Profile | `#profile`| Avatar + name + 3-stat row (plants / streak / waterings — live from state), Dark/Light M3 segmented control wired to `useDeviceTheme()`, watering + repot notification switches and a 30-min reminder-time stepper (all persisted), About row → toast. |

## Interactions

- **Thirst rings** — SVG `stroke-dashoffset` animates from empty to the
  plant's moisture on mount (`--dur-5` emphasized-decel); re-keyed on value
  change so watering replays the spring. Bucket colors from `--bl-thirst-*`.
- **Plant sheet** — opens from any card (scrim fade + 500ms slide-up,
  drag handle, × / scrim / **Esc** close); "Water now" persists a
  daysSinceWatered=0 override, resets the ring, updates Home chips,
  collection stats and the Water schedule; done button shows a check pop.
- **Add plant** — FAB → sheet → tapping a preset appends a new plant
  (persisted) and toasts; it appears in the grid immediately.
- **Schedule checks** — toggle any task: droplet-ripple keyframe + strike +
  streak counter spring + weekly bar fill; persisted per calendar day.
- **Staggered entrance** — the active view remounts (`key={view}`), every
  content block rising with a per-index `--stagger` delay.
- **Press feedback** — scale 0.94–0.98 + `--ease-emphasized` on cards,
  chips, tasks, stepper, FAB, nav; hover lift on cards (pointer: fine).
- **Theme** — segmented control flips `.device[data-theme]` only (page
  never darkens); bezel inverts (platinum ↔ dark) automatically; persisted
  as `bloom-theme`. Light + dark are both tuned (thirst colors, art greens,
  cut-color all re-scope).
- **Swipe** — horizontal drag navigates the four tabs (`useSwipeSimulation`).
- All prefs + progress persist in `localStorage` (`bloom-prefs-v1`,
  `bloom-waterings-v1`, `bloom-checks-v1`, `bloom-stats-v1`,
  `bloom-collection-v1`).

## Files

| File | What it is |
|------|------------|
| `app/prototypes/bloom/layout.tsx` | Imports tokens.css + styles/index.css + `bloom.css`; metadata "Bloom — ANDROID-PROTOTYPE". |
| `app/prototypes/bloom/page.tsx` | Client shell: DeviceThemeProvider (`bloom-theme`, initial dark) → BloomProvider → Stage panels → DeviceFrame (**no style prop** = M3) → `.bl` app root (screens keyed by hash view, proto-kit `<BottomNav>`, FAB, sheets, toast); swipe wiring; side-panel MiniBar/kvlist helpers. |
| `src/prototypes/bloom/bloom.css` | ONE stylesheet, everything scoped under `.bl` (plus `.device` scrollbar/`body` chrome and stage-panel helpers like smart-home.css): art tokens (leaf greens × theme, pot colourways, thirst traffic-light), stagger keyframes, ring, Home/Water/Guide/Profile styles, sheet, FAB, toast, reduced-motion block. |
| `src/prototypes/bloom/lib/data.ts` | Plant/Guide/preset types, 6 curated plants (thirst = daysSinceWatered/interval), 6 add-plant species, 6 real short articles, `thirstOf/thirstState/thirstLabel/wateredAgo/dayPillLabel/greeting` helpers. |
| `src/prototypes/bloom/state/bloom-context.tsx` | Central provider (wallet pattern): plants + persisted waterings/collection, daily schedule checks, streak/total stats, prefs, selected plant (sheet), toast channel. |
| `src/prototypes/bloom/components/plant-art.tsx` | Generative SVG plants: 7 shape recipes (monstera w/ fenestrated cut-leaves, snake, pothos, fiddle, echeveria, calathea, ZZ) + shared pot, driven by `data-pot` CSS vars. |
| `src/prototypes/bloom/components/progress-ring.tsx` | Circular moisture ring with on-mount stroke animation + spring pop (re-key). |
| `src/prototypes/bloom/components/plant-card.tsx` | Home collection card. |
| `src/prototypes/bloom/components/bottom-sheet.tsx` | M3 modal sheet primitive (scrim, slide-up, handle, ×, Esc). |
| `src/prototypes/bloom/components/plant-sheet.tsx` | Plant detail: art + live ring, care facts, Water now. |
| `src/prototypes/bloom/components/add-plant-sheet.tsx` | Species picker sheet (FAB target). |
| `src/prototypes/bloom/components/fab.tsx` / `toast.tsx` / `switch.tsx` / `icons.tsx` | M3 FAB (primary-container, rounded `--r-md`), snackbar toast, M3 switch, inline icon set (leaf/drop/sun/temp/flame-leaf/paw/…). |
| `src/prototypes/bloom/screens/*.tsx` | `home-screen`, `water-screen`, `guide-screen`, `profile-screen`. |

## Non-obvious decisions (for future agents)

- **No `style` prop anywhere.** Bloom intentionally sits on the *default*
  M3 token layer so it can double as the palette/motion reference. Do not
  add `data-style`; do not override `--color-*` either — if art/thirst need
  colors that M3 roles can't express (traffic-light greens/ambers/reds),
  they are added as *additional* `--bl-*` tokens on `.bl`, re-scoped for
  light theme. This keeps the token contract clean.
- **`.bl` app-root pattern (like wallet's `.wl`)**: the screens render
  inside `<Screen><div className="bl">…</div></Screen>` with `.bl` absolutely
  filling it, so the sheet/FAB/toast/nav can be absolutely positioned within
  the device, and `key={view}` remount replays entrances. `.bl` sits at
  `z-index:10`; the proto-kit status bar (z 30) stays above everything —
  the sheet scrim (z 28) deliberately stops under it.
- **Thirst rings draw moisture, not thirst** (full arc = happy; it *drains*
  as days pass, keeping a 4% red sliver so "0" never looks empty). Mount
  animation always sweeps from empty → current, which reads as "filling in"
  and makes the post-watering spring legible.
- **Accordion expand uses `grid-template-rows: 0fr→1fr`**, not a max-height
  magic number — animates to real content height in any theme/density.
- **No emojis anywhere**: the greeting's leaf, the "watered ✓" confirmation
  and the streak flame are inline SVGs (`icons.tsx`, `FlameLeafIcon`).
- **Water-screen "due list" = thirst ≥ 60** (due ∪ thirsty-soon), so the
  schedule never looks empty; the weekly bar models 4 banked days + today,
  so it visibly fills on the first tick.
- **The "Monstera watered" toast carries an SVG check disc**, and watering
  from the sheet *also* syncs the Home chips, Water list (plant drops out of
  the due band) and Profile stats — everything flows from BloomProvider,
  nothing is screen-local truth.
- **Persistence is keyed to the calendar day** (`bloom-checks-v1` →
  `YYYY-MM-DD` → ids), so tomorrow the schedule starts fresh; waterings
  persist as `daysSinceWatered` overrides and simply drift back up.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/bloom/
