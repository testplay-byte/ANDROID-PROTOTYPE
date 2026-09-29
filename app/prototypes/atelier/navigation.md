# atelier — navigation

## What this prototype is

**"Atelier"** — a Bauhaus studio's portfolio and production planner, built on
the **desktop** surface. It is the desktop sibling of
[`linie`](../linie/) (metro planner, same Bauhaus token family) — same triad,
same ink rules, same zero-shadow discipline — but a completely different app:
a designer studio files geometric *plates* instead of stations, and plans work
on a production board instead of a journey.

The shell follows [`meridian`](../meridian/) — the repo's reference desktop
prototype — exactly: `DeviceThemeProvider` → provider → `Stage` →
`SurfaceFrame` (`surface="desktop"`, `style="bauhaus"`, window chrome, menu
bar) → `DesktopSidebar` + `DesktopTopBar` + `SurfaceScreen` + per-view screens
+ command overlay + toast.

**The imagery is geometry.** Every work card carries a PLATE — a handful of
circles, squares, triangles, halves, quarters and bars in normalised 0–100
coordinates, drawn as inline SVG in `components/geometry.tsx` with fills
wired to `--color-primary` / `--color-secondary` / `--color-tertiary` /
`--color-outline` / `--color-surface-1`. There is not one bitmap, one emoji
or one hex value in the prototype.

Chrome is deliberately **absent** where a phone would have it: no status bar,
no bottom nav. Desktop navigation is the sidebar, and the preview controls
(fullscreen, surface switcher) belong to `<Stage>`, never to the app.

## Screens

| Screen | Hash | Description |
|--------|------|-------------|
| Work | `#work` | A band of four studio figures, a discipline filter (6 chips with primitive marks) that re-filters the wall in place, and a multi-column grid of square plates. Each card prints its plate number, title, discipline, year and a progress rule. Clicking a plate opens a **detail region beside the grid** — brief, scope list, facts and a progress meter — never over it. |
| Board | `#board` | Four columns across the whole window under **solid primary headers** — red, blue, yellow, then ink — each numbered 01–04, each with a live card count and a WIP limit. Cards advance to the next stage on click; an over-limit column states it. A numbered switcher above the board pins a column on desktop and is the *only* navigation between columns on tablet. |
| Studio | `#studio` | A maker directory (6 people: mark, role, discipline, booked/free capacity rule, open jobs) beside a capacity chart — one row per discipline with plate count, a flat booked rule and a printed 0–100 scale. |
| Settings | `#settings` | Three desktop panels: theme (scoped to the window), **contrast** (mutes the whole triad toward the cream ground), app-wide density, the keyboard reference, and the demo-data actions. |

## Interactions

- **Hash routing** — `#work` `#board` `#studio` `#settings`, deep-linkable and
  back/forward aware (`pushState` + `popstate`).
- **⌘K / Ctrl+K** opens the command overlay; ↑ ↓ move the cursor, ↵ runs, Esc
  closes. It jumps to views, plates, board columns and makers, and runs
  actions.
- **1 – 4** jump between the four views from anywhere outside a text field.
- **Esc** unwinds one level: palette → detail region.
- **Detail region** — click a plate to open it beside the wall; click again,
  press Esc, or use the × in the region to close it.
- **Board advance** — clicking a card (the whole card is the control, so Enter
  works too) moves it to the next stage and reports the move; `installed`
  wraps back to `commission`.
- **Contrast** (top bar or Settings) flips the triad between *full* and
  *muted* app-wide; **density** does the same for `--atl-gap` / `--atl-pad` /
  `--atl-plate-pad`. Both persist in `localStorage` (`atelier-prefs-v1`).
- **Column pinning** — the numbered switcher sets `data-col`; the pinned
  column gets a heavier ground. On tablet it also decides which single column
  is displayed.
- **Theme** flips ink ↔ paper, scoped to the window, persisted as
  `atelier-theme`. The prototype opens on **paper** (cream) — a Bauhaus studio
  is a light room.

## Files

| File | What it is |
|------|------------|
| `app/prototypes/atelier/layout.tsx` | Token + style-layer imports, metadata |
| `app/prototypes/atelier/page.tsx` | Shell: `Stage`, `SurfaceFrame` (window chrome + menu bar), `DesktopSidebar`, `DesktopTopBar`, screen switch, `CommandPalette`, toast, number-key shortcuts |
| `app/prototypes/atelier/navigation.md` | This file |
| `src/prototypes/atelier/atelier.css` | The whole stylesheet, with a numbered STYLE INDEX header |
| `src/prototypes/atelier/data.ts` | 8 works with plates, 14 board jobs, 6 makers, 4 stages, discipline/studio figures, `loadPct` |
| `src/prototypes/atelier/state/atelier-context.tsx` | `AtelierProvider`: view, prefs, discipline filter, selected plate, cards, board column, palette, toast, keyboard |
| `src/prototypes/atelier/components/icons.tsx` | 18–20px stroke icon set (square caps, `currentColor`), no emoji |
| `src/prototypes/atelier/components/geometry.tsx` | `Plate`, `Mark` and `CapacityBar` — the only imagery in the app |
| `src/prototypes/atelier/components/controls.tsx` | `Segmented` and `FilterBar` |
| `src/prototypes/atelier/components/project-panel.tsx` | The detail region that opens beside the wall |
| `src/prototypes/atelier/components/command-palette.tsx` | The ⌘K command overlay |
| `src/prototypes/atelier/screens/work.tsx` | Figures band, filter, plate grid, detail region |
| `src/prototypes/atelier/screens/board.tsx` | Numbered switcher, four primary-headed columns, advancing cards |
| `src/prototypes/atelier/screens/studio.tsx` | Maker directory + capacity chart |
| `src/prototypes/atelier/screens/settings.tsx` | Theme, contrast, density, shortcuts, data |

## Design-language decisions

- **Tokens only.** Every colour, size, radius, motion and border comes from
  `var(--color-*)`, `var(--fs-*)`, `var(--sp-*)`, `var(--r-*)`,
  `var(--border-w)`, `var(--dur-*)` or `var(--ease-*)`. There is not one hex
  value in `atelier.css`; the only colour expressions are `color-mix()` of
  two tokens.
- **The triad is indirected once.** `.atl` publishes `--atl-t1…--atl-t4` and
  `--atl-fg1…--atl-fg4`; the five tone classes (`--primary`, `--secondary`,
  `--tertiary`, `--ink`, `--paper`) are the ONLY places a tone is consumed,
  as both `fill` and `background-color`. Muted contrast is therefore a
  four-line change in one block instead of a sweep through the file.
- **Yellow never carries white text.** `--color-primary-fg` is white, which
  fails on the tertiary yellow, so `--atl-fg3` is `--color-text` and the ink
  tone takes `--color-surface-1`. Text on a triad block is a per-tone
  decision, made once.
- **The 2px rule is the structure.** Bauhaus's token layer zeroes every
  shadow (`--shadow-1/2/inset: none`) and sets `--border-w: 2px` with a near
  black `--color-outline`, so depth comes from stepping `--color-surface-1…4`
  and from 1px `--color-outline-variant` rules — never from elevation.
- **No gradients, no blur, no soft radius.** The only `50%` radius in the app
  is the circle primitive itself, which is drawn as an SVG `<circle>`, not a
  rounded box.
- **The proto-kit chrome is re-stated, not fought.** The shared sidebar and
  top bar are CSS modules with hashed class names, so they are targeted
  structurally (`.atl nav[aria-label="Primary"]`, `.atl__main > header`,
  `[data-style="bauhaus"] [role="menubar"]`). A window with a M3 menu bar over
  a Bauhaus app is a style leak, and the menubar is the one piece of shared
  chrome that the module does not expose a hook for beyond its ARIA role.

## Tablet reflow (a real layout change, not a squeeze)

At `@container surface (max-width: 900px)` — 834px tablet portrait:

- **The plate grid becomes one column of full-width BANDS.** Each card stops
  being a square plate tile and becomes a `104px | 1fr` band: the plate sits
  in the left cell spanning three rows, the plate number, title and
  discipline stack to its right, and the progress rule runs the full width
  beneath. Nine-column information density becomes one scannable row per
  work.
- **The board shows one column at a time.** All four columns are still in the
  DOM (and keep their counts), but only the column carrying `data-on` is
  displayed, and the numbered switcher stretches to the full window width and
  becomes the only way between columns. On the desktop the same switcher
  merely pins a column, so the control has a job on both surfaces rather than
  appearing from nowhere at the breakpoint.
- The detail region leaves the split and runs full width under the wall; the
  studio and settings grids drop to a single column; the top bar and views
  tighten their padding.

Below 720px the figures band folds to 2×2 with the correct internal rules,
the maker grid and the fact lists go single-column.

## Non-obvious decisions

- **The window opens on `light`.** Every other desktop prototype in the repo
  opens on dark. A Bauhaus studio is a cream room, and the dark Bauhaus layer
  is muddy for a palette built on three primaries — so `initialTheme="light"`
  is the correct first impression, not an oversight.
- **Plate geometry is data, not decoration.** `data.ts` owns every shape, so
  a work's plate can be re-composed by editing one array and nothing in the
  components needs to know about it. It also means the app has no asset
  pipeline at all.
- **`data-density` and `data-contrast` live on `.atl`, the app root**, not on
  a view — one inherited fact drives the grid, the board, the panels and every
  tone block, and a screen never has to remember to apply it.
- **The board's over-limit state is stated in words**, not just coloured: the
  yellow column turning red would be unreadable, and Bauhaus layouts are
  typographic first.
- **The detail region is `position: sticky`, not fixed** — it has to sit
  beside a wall taller than the window without covering it. It goes `static`
  and full width under 900px.
- **Media queries, never viewport units.** The window is a fixed surface that
  only gets zoomed, so every breakpoint is `@container surface` and no
  measurement is in `vh` — the command overlay offsets itself with a
  surface-relative percentage instead.
- **No bottom nav, no status bar.** Their absence is the argument that this
  is a separate system, not a stretched dashboard.

## Known gaps

- `/prototypes/atelier/tablet/` is not generated yet: `app/prototypes/_registry.ts`
  has no `atelier` entry, so the stage's tablet switcher link has nothing to
  resolve to until the registry is updated. The layout itself is built and
  tested — the container queries at 900px / 720px are what the tablet build
  uses, and the same page renders through `SurfaceProvider` once registered.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/atelier/
