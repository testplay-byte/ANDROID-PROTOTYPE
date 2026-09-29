# stockyard — navigation

## What this prototype is

**"Stockyard"** — an inventory + fulfilment console in **Neo-brutalism**
(`style="brutalism"`), built for the **desktop** surface only. It is a
window, not a wide phone: a sidebar, a fixed-layout sortable multi-select
stock table, a detail panel that opens **beside** the data, a ⌘K command
overlay, and a density preference that rescales every row app-wide.

The language is enforced rather than suggested: 0px radius everywhere, 2px
ink borders on every container, hard zero-blur offset shadows (`--shadow-1/2`),
flat high-contrast fills with no gradients, heavy letter-spaced uppercase
micro-labels, and tabular numerals on every figure. Dense and loud, never
cute. Zero bitmaps, zero emoji, zero randomness.

## Screens

| Screen | View id | Contents |
|--------|---------|----------|
| Inventory | `#inventory` | Left category rail with live counts; a search + state-filter toolbar; a fixed-layout sortable table (SKU · description · on-hand · reserved · free · reorder point · unit cost · state) with checkbox multi-select and a bulk bar; a right-hand **detail drawer** with a facts list, a cover bar against the reorder point, a per-bin breakdown and a working restock form. |
| Orders | `#orders` | Queue filter rail plus a "ready to load" dock list; a queue of order cards with status chips, channel, due date and value; a detail panel **beside** the queue with the line table (and shortfalls highlighted), a status-stepper and the **Mark shipped** flow. |
| Movement | `#movement` | Four KPI blocks (units today, received, picked, busiest day); a 14-day column chart of units moved with today highlighted; a filterable movement ledger (ref · type · SKU · reason · signed qty · location · when). |
| Settings | `#settings` | Two-column: appearance (theme + density) and a live table preview on the right; four alert switches; the keyboard map; a yard reset. |

`#inventory` is the default view; the hash is canonicalised on first load.

## Interactions

- **Restock (real)** — the drawer's stepper + bin `<select>` + "Receive N"
  adds units to that bin, recomputes the SKU's on-hand and reserved from the
  bins, appends a `RECEIPT` to the ledger, grows today's bar on the movement
  chart, and toasts. The table row behind the drawer updates immediately.
- **Mark shipped (real)** — draws every order line out of the bins nearest
  first, releases the matching reservation, recomputes the totals, writes one
  `PICK` movement per bin actually touched, shrinks today's units, and flips
  the chip to `SHIPPED`. A line whose free stock cannot cover it is flagged
  in the line table before you ship it.
- **Sortable + multi-select table** — six sortable columns (click to toggle
  asc/desc, `aria-sort` follows), a select-all checkbox scoped to the
  *visible* rows, and a bulk bar that reports the selection's units and
  value. The table is `table-layout: fixed` with percentage `<col>` widths,
  so it cannot produce a horizontal scrollbar at 1280 or at 900.
- **Detail beside the data** — clicking a row (or a `Esc` to dismiss) opens
  the drawer next to the table rather than over it. Same pattern on Orders.
- **Command palette (⌘K / Ctrl+K)** — searches views, SKUs and orders, plus a
  density action. Arrow keys move, `↵` runs, `Esc` dismisses.
- **Keyboard** — `1`–`4` jump between views, `/` focuses the stock search,
  `D` flips row density, `Esc` unwinds the palette, the detail panel and the
  selection.
- **Density** — `data-density` on the app root sets `--sy-row` (40px regular
  / 26px dense) and the table cell gutter. It is a real row height on the
  inventory table, the movement ledger and the order queue, is persisted to
  `localStorage`, and Settings shows a live sample of the affected grammar.
- **Theme** — Dark ("Ink") ↔ Light ("Paper") flips the surface scope only
  (`.surface[data-theme]`), persisted as `stockyard-theme`. Every surface in
  the app is token-driven, so both palettes are the same contract.
- **Alerts** — four switches persisted as `stockyard-notifications-v1`,
  built from `container` / `on-container` token pairs so they read correctly
  in both themes without a second rule set.
- **Reset** — restores the seeded inventory, orders, ledger and chart.

## Files

| File | What it is |
|------|------------|
| `app/prototypes/stockyard/layout.tsx` | Imports tokens.css + styles/index.css + stockyard.css; metadata. |
| `app/prototypes/stockyard/page.tsx` | Client shell: `DeviceThemeProvider` (`stockyard-theme`, initial dark) → `StockyardProvider` → `Stage` panels → `SurfaceFrame` (`style="brutalism"`, window chrome, menu bar, `storageKey="stockyard"`, draggable) with `DesktopSidebar` + `DesktopTopBar` + `SurfaceScreen` + the four screens + `CommandPalette` + a toast. Window-level keyboard shortcuts. |
| `app/prototypes/stockyard/navigation.md` | This file. |
| `src/prototypes/stockyard/stockyard.css` | One stylesheet, everything under `.sy-`: nine numbered style-index sections, the zero-radius guard, and the `@container surface` adaptivity block. |
| `src/prototypes/stockyard/data.ts` | 28 SKUs, 12 orders, 36 ledger entries, 14 daily-unit figures, 4 bin locations, and every label map. Fully hardcoded — no `Math.random`, no `Date.now`. |
| `src/prototypes/stockyard/state/stockyard-context.tsx` | Central provider: live `skus` / `orders` / `movements` / `dailyUnits`, `restock`, `shipOrder`, table + queue + ledger UI state, hash routing, ⌘K and Esc wiring, toast, persisted density and alert prefs, derived counts. |
| `src/prototypes/stockyard/components/icons.tsx` | 18px stroke icon set (nav, search, alert, bin, arrows) — no emoji. |
| `src/prototypes/stockyard/components/status-chip.tsx` | One brutalist chip, three vocabularies (stock state / order status / movement type), colour by `data-*`. |
| `src/prototypes/stockyard/components/detail-drawer.tsx` | The right-hand drawer: facts, cover bar, per-bin breakdown, restock form, recent movement. |
| `src/prototypes/stockyard/components/command-palette.tsx` | The ⌘K overlay across views, SKUs, orders and actions. |
| `src/prototypes/stockyard/screens/inventory.tsx` | The main screen + the `StockWarning` chip used in the top bar. |
| `src/prototypes/stockyard/screens/orders.tsx` | Queue, dock list and the order detail panel with the ship flow. |
| `src/prototypes/stockyard/screens/movement.tsx` | KPI band, daily column chart, filterable ledger. |
| `src/prototypes/stockyard/screens/settings.tsx` | Theme, density + live preview, alert switches, shortcuts, reset. |

## Tokens used

Every value in `stockyard.css` is a `var(--*)` token — no hardcoded colours,
no fixed hex. Colors and shapes come from `src/proto-kit/styles/brutalism.css`
via `data-style` on the `.surface`:

- **Surfaces** — `--color-bg`, `--color-surface-1` … `--color-surface-5`
- **Text** — `--color-text`, `--color-text-muted`, `--color-text-subtle`
- **Roles** — `--color-primary`, `--color-primary-fg`,
  `--color-primary-container`, `--color-on-primary-container`,
  `--color-secondary`, `--color-tertiary`, `--color-tertiary-container`,
  `--color-error`, `--color-error-container`, `--color-success`,
  `--color-warn`
- **Ink** — `--color-outline`, `--color-outline-variant`
- **Brutalism structure** — `--border-w` (2px), `--shadow-1`, `--shadow-2`,
  `--shadow-inset` (all hard, zero blur), `--r-xs` (0px)
- **Type / space / motion** — `--fs-label-s` … `--fs-h2`, `--sp-1` … `--sp-6`

The only other composition is `color-mix()` over tokens, for the two
scrims (palette backdrop, cover-bar fill) — never a literal colour.

## Adaptivity — container queries, never media queries

`@container surface` in two steps; the surface is its own inline-size query
container, so a 1400px browser showing an 834px tablet still reflows.

- **≤ 900px (tablet)** — a genuinely different arrangement, not narrower
  columns: the category rail becomes a horizontal, `position: sticky`
  filter bar pinned to the top; the table loses its `<thead>` and every
  `<tr>` becomes a bordered **record block** whose cells label themselves
  from `data-label` (the checkbox / SKU / description cells become the
  record's header band); the drawer and the order panel stop being sticky
  side columns and become **full-width blocks ordered above the records**;
  the order card re-grids to two rows; settings drop to one column with the
  preview first; the line table and the KPI band reflow too.
- **≤ 700px (narrow window)** — one KPI per row, per-bar figures hidden, the
  table footer stacks, the bulk bar tightens.

`prefers-reduced-motion` is honoured; it is a user-preference query, not a
layout one, so it stays a media query.

## Desktop-only patterns (deliberately absent on phone)

Sidebar navigation (not a bottom bar), sortable multi-select table, a detail
panel **beside** the data, ⌘K command overlay, keyboard shortcuts, window
chrome and a menu bar. There is no status bar and no bottom nav anywhere in
this prototype. The Stage's fullscreen button and surface switcher live
**outside** the app, in the preview environment.

## Non-obvious decisions (for future agents)

- **The drawer and the order panel are capped at `max-height: 620px` with
  internal scroll.** A `position: sticky` box taller than its scrollport
  pins at `top: 0` and clips its own tail unreachably, because its height
  is also what defines the containing block. 620px is the honest budget for
  1280×800 (800 − 38 winbar − 32 menu − 60 topbar). The cap is released at
  tablet width, where the panel is a static block.
- **The zero-radius guard in §8 is not decoration.**
  `.surface[data-surface="desktop"]` re-points `--r-pill` at `8px` for
  every desktop window, so a style file that trusted the radius tokens
  alone would sprout rounded pills in a brutalism app. The
  `.sy, .sy *, .sy *::before, .sy *::after { border-radius: 0 }` rule at the
  end of the stylesheet closes that door for every element the console owns.
  proto-kit's own sidebar/top-bar adapt separately, in
  `desktop-nav.module.css`.
- **Totals are always recomputed FROM the bins, never patched.** `recalc()`
  in the context derives `onHand` / `reserved` from `locations` after every
  mutation, which is what stops the table, the drawer and the ledger from
  disagreeing about how much of something exists.
- **The per-location split is authored once and derived.** A SKU's `onHand`
  is written in `data.ts`; the four bins come from fixed ratios
  (`[.45, .25, .2, .1]`, remainder to the last) and each bin's reservation
  from `[.42, .35, .15, .08]` clamped to what that bin holds. The numbers
  always sum back to the total, so a drawer breakdown is never a decoration.
- **New movements use a sequence number, not a clock.** `seq` plus a fixed
  clock reading gives every appended movement a stable ref and time. Using
  `Date.now()` would make the ledger differ on every render and break the
  determinism rule the rest of the file depends on.
- **`data-label` on every `<td>` is load-bearing, not documentation.** The
  tablet breakpoint deletes the `<thead>` and rebuilds each cell's label
  from that attribute with `content: attr(data-label)`. Adding a column
  without a `data-label` produces an unlabelled cell on tablet.
- **The table uses `table-layout: fixed` with a percentage `<colgroup>`.**
  That is the horizontal-scroll guarantee: column widths are percentages of
  the container, so no content can push the table past 1280 (or past 900).
- **Stock state is derived, never stored.** `stockState()` in `data.ts` is
  the single rule (`0 → backorder`, `≤ 60% of reorder point → critical`,
  `≤ reorder point → low`), so a restock that crosses a threshold recolours
  the row, the chip and the sidebar counts at once.

## Known gap — one line outside this prototype's scope

The surface route (`/prototypes/stockyard/desktop/` and `/tablet/`) is
served by `app/prototypes/[slug]/[surface]/page.tsx`, which resolves the slug
through `app/prototypes/_registry.ts`. **Stockyard is not in that registry
yet**, so `useCanonicalSurface("stockyard", "desktop")` rewrites the address
bar to a URL that 404s on refresh, and the Stage's tablet switcher link has
nowhere to land. Registering it needs three edits that live outside
`app/prototypes/stockyard/` and `src/prototypes/stockyard/`, so they are left
for the repo owner:

```ts
// app/prototypes/_registry.ts
import StockyardPage from "./stockyard/page";
// …
stockyard: {
  name: "Stockyard",
  surfaces: ["desktop", "tablet"],
  views: { desktop: StockyardPage, tablet: StockyardPage },
},
```

```ts
// app/prototypes/[slug]/[surface]/layout.tsx — add to the stylesheet imports
import "../../../../src/prototypes/stockyard/stockyard.css";
```

(`app/prototypes/[slug]/[surface]/layout.tsx` does not use the prototype's
own layout, so without the third edit the tablet build would render
unstyled.) Everything else — including the `@container surface` tablet
reflow — is complete and works today; you can also reach the tablet
arrangement by dragging the window narrower than 900px.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/stockyard/
