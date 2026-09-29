# facet — navigation

## What this prototype is

**"Facet"** — a bento personal dashboard in the **Bento** design language
(`style="bento"`), built on the `meridian` desktop shell. It is the
*desktop* build of the same language as `atlas`, the bento PHONE prototype
(bottom nav, stacked screens, expand-to-fullscreen tile). Same token layer,
same tile grammar, entirely different layout system.

The bento language shows up as discipline rather than decoration:

- **Tiles are borderless.** The 14px gutter of felt background between every
  card IS the separation; only `shadow-1` lifts a tile off the felt. A border
  would read as a table cell, and a table cell has a job of its own.
- **One job per tile.** Nine tiles, nine jobs, each labelled in its own head.
- **Size carries meaning.** A 2×2 is what you check every morning; a 1×1 is
  what you glance at. The user owns the layout: every tile head carries a
  **span cycle control**.
- **Nothing scrolls inside a tile.** When a tile shrinks, CSS drops the
  content that no longer earns its place (a 1×1 agenda shows one row, a 1×1
  weather drops its hourly strip) instead of starting a scrollbar.
- **Content is vertically centred** with balanced padding. The only exception
  is the tiles that genuinely contain a list (agenda, mini month, signal),
  which start at the top.
- **One accent, used sparingly** — `--color-primary` (orange) for the primary
  action, the selected tile, today's dot and the progress meters.
- **Generous radii.** The bento scale (18–26px) is used as-is; `facet.css`
  overrides nothing, so the desktop window stays in the same family as the
  phone.

## Views

| View | Hash | Contents |
|------|------|----------|
| Board | `#board` | The flagship: a real bento **grid** — four columns, one fixed row height, plain auto-flow placement, so re-spanning a tile reflows everything after it. Nine tiles: clock (2×1), weather (2×1), agenda (2×2), capture (1×1), habits (1×1), focus (1×1), notes (1×1), month (2×1), signal (2×1). A board bar explains the span cycle, reads out the live spans, and offers *Smaller* (for the selected tile) and *Reset layout*. |
| Calendar | `#calendar` | Month grid (Monday-first, correct weekday column) with the selected day's detail **beside** it: the day's events, then that day's habits. Previous / next / Today all work; clicking a day updates the board's agenda tile too. |
| Notes | `#notes` | Searchable list on the left, editor on the right, saved as you type. The newest note is also the board's note tile, so the two views can never disagree. |
| Settings | `#settings` | Theme scoped to the window, tile density (compact / cosy / roomy — a real row-height change), a **hide-tile control that really removes tiles from the board**, a per-tile size cycle, show-all / reset, the desktop keyboard reference, and a preferences reset. |

## Interactions

- **⌘K / Ctrl+K** — command palette over views, notes, board tiles and
  actions (reset layout, show hidden tiles, capture, new note). Every row is
  a real action; there are no dead commands.
- **1–4** — jump between Board / Calendar / Notes / Settings.
- **`C`** — focus the quick-capture field. **`[` / `]`** — shrink or grow the
  selected tile. **`←` / `→`** — previous / next month on Calendar.
  **`Esc`** — close the palette and clear the tile selection.
- **Tile selection.** The small dot in a tile head selects that tile; the
  selection drives the `[` `]` shortcuts, the board bar's *Smaller* button and
  the palette's *Cycle the selected tile's size* command.
- **Quick capture really appends.** Typing in the 1×1 capture tile and pressing
  Enter (or the + button) prepends a row to the inbox, bumps the count in the
  tile head, the sidebar badge and the top bar, and raises a toast. Capture
  stamps are counter-derived (`08:05`, `08:12`, …) — never a clock read.
- **Habits really tick.** The three habit buttons under the ring toggle the
  live state, and the ring's `stroke-dasharray` re-animates.
- **Hide tile really hides.** Settings hides a tile, the board drops it, the
  grid reflows, and both the board bar and Settings offer *Show n hidden*.
  Clock, agenda and capture are not hideable — they are the spine.
- **Preferences persist** in `localStorage` (`facet-prefs-v1`); theme persists
  as `facet-theme` via `DeviceThemeProvider`; the dragged window size persists
  as `proto-kit-surface-size-facet`.

## The tile span system

Four sizes, defined once in `data.ts` and applied by four `data-span`
selectors in `facet.css`:

| Span | Columns | Rows | Cycle position |
|------|---------|------|----------------|
| `1x1` | 1 | 1 | 1st |
| `2x1` | 2 | 1 | 2nd |
| `2x2` | 2 | 2 | 3rd |
| `1x2` | 1 | 2 | 4th |

`SPAN_CYCLE = ["1x1", "2x1", "2x2", "1x2"]` is the order the per-tile button
in every tile head walks, and `[` / `]` walk it backwards. The span lives on
`data-span` on the tile, so **nothing in the layout is computed in JavaScript**
— resizing a tile is one attribute change and the grid does the rest.

The default board tiles up exactly: 2+2+4+1+1+1+1+2+2 = 16 cells = 4 rows ×
4 columns, so the flagship board has no holes at its default spans.

**Per-span content fallbacks** (section 5 of the CSS): a 1×1 agenda shows one
row, a 1×2 agenda four, a 2×2 agenda five; 1×1/1×2 weather drops the hourly
strip; a 1×1 month drops the grid; 1×1 habits and focus drop their secondary
lines. This is the "no tile scrolls internally" rule, implemented.

## Tablet reflow — `@container surface (max-width: 900px)`

Both changes are *layout* changes, not squeezes:

1. **The board drops to two columns and every tall tile becomes a one-row
   tile.** `.fc-tile[data-span="2x2"]` becomes `grid-column: span 2;
   grid-row: span 1` and `.fc-tile[data-span="1x2"]` becomes `span 1 / span
   1` — so a 2×2 really does read as a 2×1, not as a squashed 2×2. The
   per-span content fallbacks follow, and the wide short habits tile switches
   to a row layout (ring · list · streak).
2. **The detail regions stop being sidebars.** `.fc-split` and
   `.fc-split--notes` go to `flex-direction: column`, so the calendar's day
   detail and the notes list become full-width blocks *below* the data.
   Settings goes to a single column, the note list caps at 260px and the
   editor's textarea grows.

`@container surface (max-width: 620px)` then tightens the view padding, the
tile padding and the grid gutter, halves the signal stats to two columns and
stacks the density control.

These are container queries on `surface` (the window), never media queries —
the browser window may be 1400px wide while the surface is only 834px.

## Desktop-only patterns

- **Sidebar navigation** (icon + label + section headings), not a bottom bar.
- **⌘K command palette**, which no phone build has.
- **A real month grid** with weekday columns, not a vertical date list.
- **Detail beside the data** — the calendar's day panel and the notes list
  sit next to their content, not over it.
- **Multi-state rows** — the notes list is a selectable list, the agenda and
  the day detail are item lists, the board bar is a control strip.
- **Window chrome** — title bar with working window buttons, a menu bar
  (Facet · File · Edit · View · Widgets · Help) and 8 drag-resize handles,
  persisted per `storageKey="facet"`.

## Determinism

- `TODAY` is pinned to **2026-09-28**, a Monday. No `Date.now()`, no
  argument-less `new Date()` and no `Math.random()` anywhere in
  `app/prototypes/facet/` or `src/prototypes/facet/`.
- Calendar maths is **pure integer work**: `daysFromCivil` in `data.ts` is
  Howard Hinnant's days-since-epoch formula written out as arithmetic, so
  weekday columns, month lengths and "is this day today" need no Date object
  and cannot disagree between the server and the client.
- The clock tile shows a **pinned time** (09:41:24). A live clock would make
  the prototype non-deterministic and a screenshot would never match.

## Files

| File | What it is |
|------|------------|
| `app/prototypes/facet/layout.tsx` | Imports `tokens.css` + `styles/index.css` + `facet.css`; metadata. |
| `app/prototypes/facet/page.tsx` | Client shell: `DeviceThemeProvider` (`facet-theme`) → `FacetProvider` → `Stage` panels → `SurfaceFrame` (`style="bento"`, `windowChrome`, `menu`, `storageKey="facet"`, `draggable`) → `DesktopSidebar` + `DesktopTopBar` + `SurfaceScreen` + per-view screens + `CommandPalette` + toast; hash routing and the `C`, `[`, `]`, `1–4` shortcuts. |
| `app/prototypes/facet/navigation.md` | This file. |
| `src/prototypes/facet/facet.css` | One stylesheet with a numbered STYLE INDEX; the grid, the span system, the per-span fallbacks, and the two `@container surface` breakpoints. |
| `src/prototypes/facet/data.ts` | Pinned date + civil-date arithmetic, the tile definitions and the span tables, weather, agenda, habits, captures, notes, stats and the shortcut list. |
| `src/prototypes/facet/state/facet-context.tsx` | One provider: view routing, tile spans + selection, persisted prefs (density, hidden tiles), captures, habits, the selected day and month offset, notes, the palette and the toast. |
| `src/prototypes/facet/components/icons.tsx` | Inline SVG set (nav, actions, weather, resize) — no emoji. |
| `src/prototypes/facet/components/tile.tsx` | The bento atom: head (job label, span cycle, slot), body, and the centred-content helper. |
| `src/prototypes/facet/components/board-tiles.tsx` | The nine tile bodies. |
| `src/prototypes/facet/components/command-palette.tsx` | The ⌘K command surface. |
| `src/prototypes/facet/screens/*.tsx` | `board-screen.tsx`, `calendar-screen.tsx`, `notes-screen.tsx`, `settings-screen.tsx`. |

## Non-obvious decisions (for future agents)

- **The grid is `grid-auto-rows: var(--fc-row)` with plain auto-flow.** No
  explicit `grid-row`/`grid-column` per tile, and no `grid-auto-flow: dense`.
  Dense flow would backtrack and fill holes, which makes "I moved one tile and
  three others jumped" impossible to reason about; sparse flow means the
  default order tiles the 4×4 board exactly and any resize pushes the rest
  down in reading order.
- **Tile spans are `data-span`, not inline styles.** That keeps the tablet
  reflow a pure stylesheet concern — the component never learns that a tablet
  exists.
- **`:has()` picks the two vertical alignments.** The tile body centres its
  content by default; `.fc-tile:has(.fc-agenda) .fc-tile__body` (and the
  weather / mini month / signal equivalents) opt into `flex-start`. A
  `data-*` flag on `<Tile>` would need every tile to know its own name.
- **The mini month is `grid-auto-rows: minmax(0, 1fr)`, not fixed-height
  cells.** The same markup reads as a 10px strip in a 2×1 tile and a roomy
  calendar when the tile grows — which is what makes "no tile scrolls" hold at
  every span.
- **`monthAt` (data) vs `shiftMonth` (context) are deliberately different
  names.** The first is pure arithmetic on (year, month); the second is a
  state action. A shared name shadowed the pure one at a call site and made
  the month grid read `void`.
- **`facet.css` contains no hardcoded colours** — no hex, no `rgb()`, no
  `hsl()` — so the light theme is correct for free. `color-mix` is used only
  with token colours as both inputs.
- **The radius scale is left alone.** Unlike `counter` (which pulls the
  radius down for flat), bento's oversized radii ARE the language, so
  `facet.css` overrides none of them.
- **Captures use a counter-derived stamp** (`08:05`, `08:12`, …) rather than
  `new Date()`, keeping the inbox reproducible while still looking like a
  timestamp.

## Known gap

`/prototypes/facet/desktop/` (the URL `useCanonicalSurface` rewrites to) is
served by the shared `[slug]/[surface]` route, which reads
`app/prototypes/_registry.ts` and imports desktop stylesheets in
`app/prototypes/[slug]/[surface]/layout.tsx`. Both are outside this
prototype's directory, so they were left untouched: the app is fully working
at **`/prototypes/facet/`**, and wiring the canonical surface URL is two
one-line edits elsewhere — a `facet` entry in `_registry.ts` and
`import "../../../../src/prototypes/facet/facet.css";` in the surface layout.
