# counter — navigation

## What this prototype is

**"Counter"** — a booking desk in the **Flat Design 2.0** design language
(`style="flat"`), built on the `meridian` desktop shell. It is deliberately the
*second* flat prototype in the repo: `hop` is the flat PHONE build (bottom nav,
push screens), `counter` is the flat DESKTOP build (sidebar, time grid,
multi-select table). Same tokens, same no-shadow/no-gradient rules, entirely
different layout system.

The flat language shows up as discipline rather than decoration:

- **Solid colour planes only.** No gradient anywhere; emphasis is a change of
  colour, never of elevation. `counter.css` contains zero `box-shadow`.
- **Crisp geometry.** `.ctr` re-declares the radius scale down to 2–8px, the
  way `bauhaus.css` does.
- **Bold simple type.** Weight 800 headings, uppercase letter-spaced micro
  labels, `tabular-nums` for every figure.
- **1px separators** (`--ctr-line` / `--ctr-line-strong`) instead of borders on
  every edge.
- **One accent, used sparingly** — `--color-primary` (teal) marks the active
  nav item, today, the selected row/block, the bulk bar and the primary
  button. Nothing else.
- **"Colour blocks"** is a real preference, not a mock: Flat treats tinted
  planes as optional, so `#settings` can turn every tinted block into a neutral
  surface and the whole window changes character without the layout moving.

## Views

| View | Hash | Contents |
|------|------|----------|
| Schedule | `#calendar` | Four stat blocks; the **week time grid** — one row per person, one column per day of the pinned week (Mon 28 Sep → Sun 4 Oct 2026), 08:00–18:00 at 38px an hour, blocks positioned by minutes-from-midnight and sized by the live service duration. Click empty space to snap a slot into the form, click a block to inspect it. The **booking form** sits beside the grid: pick a taken slot and it names the booking that owns it; pick a free one and the booking appears in the grid immediately. |
| Bookings | `#bookings` | The desktop table: search + status chips (with live counts) + a person filter, four sortable headers, checkbox multi-select driving a bulk status bar, and the **detail panel opening beside the table** with working status transitions. |
| Services | `#services` | The menu and the engine of the app. Duration and price are editable per card (steppers + number fields) and a service can be hidden from the bookable list. Everything feeds straight back into the grid block heights, the double-booking check and the booking quote. |
| Settings | `#settings` | Theme scoped to the window, the flat "colour blocks" preference, week-start with a live seven-day preview, the desktop keyboard reference, and demo-data restore actions. |

## Interactions

- **⌘K / Ctrl+K** — command palette over views, customers and status actions.
- **1–4** — jump between Schedule / Bookings / Services / Settings.
- **`/`** — focus the search field on Bookings. **`N`** — focus the new-booking
  customer field. **`Esc`** — close the palette, the detail panel, the conflict.
- **Conflict detection is real.** `submitDraft` overlaps the requested window
  against every non-cancelled booking for that person on that day
  (`a.start < b.end && b.start < a.end`) and, on a clash, selects the blocking
  booking so the detail panel shows who has the slot.
- **Status transitions** write to the same `bookings` array the grid and the
  table read, so a change made in the detail panel is immediately visible in
  both. Cancelled and no-show blocks stop occupying the grid.
- **Week start** (`mon` / `sun`) reorders the same seven ISO days across the
  grid columns and the day list; the Settings screen shows the resulting order.
- **Preferences persist** in `localStorage` (`counter-prefs-v1`); theme persists
  as `counter-theme` via `DeviceThemeProvider`. The dragged window size
  persists as `proto-kit-surface-size-counter`.
- Sidebar shortcuts are live: **All bookings** jumps to the table, **Needs
  confirming** jumps there with the pending filter already applied.

## Tablet reflow — `@container surface (max-width: 900px)`

Both changes are *layout* changes, not squeezes:

1. **The week grid is replaced by a day list.** `.ctr-weekview` is hidden and
   `.ctr-dayview` is shown: seven stacked day blocks, each with a header and a
   vertical, time-ordered list of that day's bookings (hour as a big numeral, a
   tone rail for the person, the status pill inline). The grid and the list are
   both in the DOM at all times and exactly one is displayed.
2. **The detail panel stops being a sidebar.** `.ctr-split` goes to
   `flex-direction: column`, so the detail panel becomes a full-width block
   *below* the data, and the booking form does the same. `@container surface
   (max-width: 720px)` then drops the person column from the table, halves the
   stat row and stacks the service grid.

These are container queries on `surface` (the window), never media queries —
the window may be 1400px wide while the surface is only 834px.

## Determinism

- `TODAY` is pinned to **2026-09-28**, a Monday. No `Date.now()`, no `new Date()`
  and no `Math.random()` anywhere in `src/prototypes/counter/`.
- Times are stored as **minutes from midnight** (540 = 09:00) and weekdays come
  from a hard-coded lookup, so overlap maths and day labels are pure integer
  work — nothing to re-derive per render.
- All seed data lives in `data.ts`: 10 services, 4 staff, 41 bookings across
  the week, with no intra-day overlaps.

## Files

| File | What it is |
|------|------------|
| `app/prototypes/counter/layout.tsx` | Imports `tokens.css` + `styles/index.css` + `counter.css`; metadata. |
| `app/prototypes/counter/page.tsx` | Client shell: `DeviceThemeProvider` (`counter-theme`) → `CounterProvider` → `Stage` panels → `SurfaceFrame` (`style="flat"`, `windowChrome`, `menu`, `storageKey="counter"`, `draggable`) → `DesktopSidebar` + `DesktopTopBar` + `SurfaceScreen` + per-view screens + `CommandPalette` + toast; hash routing and the `/`, `N`, `1–4` shortcuts. |
| `src/prototypes/counter/counter.css` | One stylesheet with a numbered STYLE INDEX; flat rules, the `data-blocks` preference, and the two `@container surface` breakpoints. |
| `src/prototypes/counter/data.ts` | Pinned date/week, opening hours, grid metrics, service + staff + booking seeds, `hhmm`/`shortDate`/`weekdayIndex`/`overlaps` helpers. |
| `src/prototypes/counter/state/counter-context.tsx` | One provider: view routing, bookings + services, selection and multi-select, filters, sort, status transitions, the booking draft with its conflict check, persisted preferences, palette and toast. |
| `src/prototypes/counter/components/icons.tsx` | Inline SVG set (nav, actions, arrows) — no emoji. |
| `src/prototypes/counter/components/schedule-grid.tsx` | The week time grid and its booking blocks. |
| `src/prototypes/counter/components/day-list.tsx` | The tablet schedule — day blocks with inline booking rows. |
| `src/prototypes/counter/components/booking-detail.tsx` | The beside-the-data detail panel and the shared status pill. |
| `src/prototypes/counter/components/command-palette.tsx` | The ⌘K command surface (views, customers, status actions). |
| `src/prototypes/counter/screens/*.tsx` | `calendar-screen.tsx`, `bookings-screen.tsx`, `services-screen.tsx`, `settings-screen.tsx`. |

## Non-obvious decisions (for future agents)

- **The schedule grid is `grid-template-columns: 76px repeat(7, minmax(0, 1fr))`
  set inline**, because the column count is data. The 76px gutter holds the
  person's avatar and *first* name only — at 1280px the seven day columns are
  ~90px each and blocks are ~82px, so anything longer must be clipped, not
  wrapped.
- **`PersonRow` returns a fragment, not a wrapper.** The `.ctr-week` grid counts
  8 items per row (one gutter cell + seven day cells); wrapping each person in
  a `<div>` would break the column alignment.
- **The grid and the day list are always both mounted** and toggled by a
  container query. That keeps the reflow purely presentational — no JS resize
  listener, no duplicated state.
- **Cancelled bookings are removed from the grid and the day list, not greyed
  out** (they are still greystruck in the table and the detail panel, where the
  record matters). They also never count as conflicts.
- **The radius override lives on `.ctr`, not in `flat.css`.** `flat.css` is a
  shared proto-kit file; changing its radius scale would re-skin `hop` too.
- **The accent block in the checked table row is a `border-left`, not an inset
  `box-shadow`** — flat never shadows. `td:first-child` keeps a matching
  `padding-left` so the checkbox column does not jump when rows are ticked.
- **`counter.css` uses no hardcoded colours at all** — no hex, no `rgb()`,
  no `hsl()` — so the light theme is correct for free.

## Known gap

`/prototypes/counter/desktop/` (the URL `useCanonicalSurface` rewrites to) is
served by the shared `[slug]/[surface]` route, which reads
`app/prototypes/_registry.ts` and imports desktop stylesheets in
`app/prototypes/[slug]/[surface]/layout.tsx`. Both are outside this
prototype's directory, so they were left untouched: the app is fully working at
**`/prototypes/counter/`**, and wiring the canonical surface URL is two
one-line edits elsewhere — a `counter` entry in `_registry.ts` and
`import "../../../../src/prototypes/counter/counter.css";` in the surface
layout.
