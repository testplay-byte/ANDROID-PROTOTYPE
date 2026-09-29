# mochi — navigation

## What this prototype is

**"Mochi"** — a desktop personal planner (money · habits · calendar) in the
**Claymorphism** design language (`style="clay"`). Everything is a soft,
inflated surface: an ambient outer shadow plus an inner top highlight for
raised cards, `inset` dough for tracks, inputs and unselected pills, and
pastel accent containers for the few places a number needs emphasis. There
are **no hard borders anywhere** — separation comes from the shadow recipe
and the surface ladder only.

Everything is driven by clay tokens (`--color-*`, `--r-*`, `--shadow-1/2`,
`--shadow-inset`) plus four derived ones published on the app root:

| Derived token | Meaning | Used by |
|---------------|---------|---------|
| `--mch-lift` | raised | cards, envelope tiles, habit tiles, buttons, avatar |
| `--mch-lift-lg` | floating | the detail pane, the palette, the toast |
| `--mch-press` | pressed | bar tracks, inputs, search, segmented channel, stepper |
| `--mch-radius` | the shape | every puffy surface (grows with depth) |

## Screens (hash-routed)

| Screen | View id | Contents |
|--------|---------|----------|
| Today | `#today` | Two independent columns. Left: the balance card with a **real** spend/budget ring computed from the live category state, the account facts, and the 30-day spending sparkline (area + line + peak/today dots + four stat tiles). Right: the habit checklist with working pucks that re-derive the day's progress bar and the 7-day pip strip, then today's agenda with tickable rows. |
| Budget | `#budget` | Master/detail. Master: month summary, a `/`-focusable envelope filter, a 2-up **envelope grid** with per-category spend bars, and a working add-envelope form. Detail (right, sticky): a bigger ring, an **editable limit** (typed directly, plus ±10/25/50/100 steppers), the Monday-first week bars, a note and a remove button. |
| Habits | `#habits` | Master/detail. Master: day-progress summary and a 2-up **habit grid** — live streak, weekly target, four weekly completion bars — plus a working add-habit form. Detail (right, sticky): a week ring, a wide tick toggle, the 28-day strip, the per-weekday tally (regrouped by the week-start setting), a four-week trend and remove/close. |
| Settings | `#settings` | Two columns. **Theme** (dark/light, scoped to the window), **clay depth** (soft/medium/deep — writes `data-clay-depth` and re-cuts the whole shadow recipe live, with a live preview strip), **week-start day** (Mon/Sun — regroups every 7-day strip in the app), the **keyboard reference**, the frozen-demo-day note and reset/export actions. |

## Desktop-only patterns (and where they switch off)

| Pattern | Where | Tablet behaviour |
|---------|-------|------------------|
| `DesktopSidebar` with section headings | left, 232px | the proto-kit collapses it to a 68px icon rail at ≤900px |
| Multi-card grid (envelopes, habits) | 2-up | single-column **list** |
| Detail region | 340px sticky pane, opens **beside** the data | becomes the second **preview** pane of a two-pane master-detail |
| ⌘K / Ctrl+K command palette | top-bar trigger + overlay | trigger is not rendered; the context force-closes the palette below 901px |
| Keyboard shortcuts (`1`–`4`, `/`, `Esc`, arrows) | global | not bound below 901px |
| Window chrome + menu bar + 8 resize handles | `SurfaceFrame` | tablet is a device: no title bar, no menu bar |

`isWide` in the context is measured with a `ResizeObserver` on the
`.surface` element — the **window**, not the browser viewport — so a 1400px
browser showing an 834px tablet surface correctly reports "narrow".

## Tablet reflow (`@container surface (max-width: 900px)`)

The desktop width is a **two-pane** layout for Budget and Habits: master
region on the left, sticky detail region on the right. At ≤900px:

- **Today** goes from two independent columns to **one single column**
  (`mch-today { grid-template-columns: minmax(0,1fr) }`), money stacked
  above the day.
- **Budget / Habits** switch to a genuine **master-detail**:
  `minmax(0,1fr) minmax(0,1.05fr)` — a single-column list of envelopes /
  habits on the left and a preview pane on the right, with the detail
  unpinned (`position: static`) so it scrolls with the list.
- The month/day summary card is dropped from the master to keep the list
  above the fold on a short screen.
- Breakpoints are **container queries on `surface`**, never media queries —
  the window is freely draggable, so the browser width says nothing about
  the layout.

## Interactions

- **Habit pucks** on Today and the wide toggle in the habit detail write to
  the same `history[27]`, so the Today progress bar, the 7-day pip strip,
  the grid streaks and the sidebar badge all move together.
- **Editing a limit** re-derives the Today ring, the monthly total and the
  summary caption immediately.
- **Add envelope / add habit** append to the state, select the new row and
  toast; ids come from a counter, never `Math.random`.
- **Remove** works on both, and clears the detail pane if it was open.
- **Clay depth** is a single data attribute; the top-bar chip cycles it and
  the Settings segmented control sets it.
- **Command palette** lists views, envelopes and habits with arrow-key
  navigation and Enter to open.
- All edits persist in `localStorage` (`mochi-prefs-v1`, `mochi-plan-v1`);
  Settings → Reset the plan restores the seed.

## Determinism

No `Math.random`, no `Date.now()`, no `new Date()` in render. "Today" is
**pinned to Tuesday 29 September 2026** (`TODAY` in `data.ts`, `dow = 2`),
the 30-day spend array is a literal, and streaks are computed from the
fixed boolean history. The app looks identical on every load, on every
machine, forever.

## Contrast rule (clay light mode)

Pale surfaces only ever carry **ink** text. `--color-text`
(#262038 on #e0dbf2) and `--color-text-muted` (#5b547a) are used on the
card ladder, and accent containers pair `--color-on-primary-container`
(#371d73 on #ddd0fb = 9.1:1) with `--color-primary-container`. Nothing in
this prototype puts a pale foreground on a pale background.

## Files

| File | What it is |
|------|------------|
| `app/prototypes/mochi/layout.tsx` | Imports `tokens.css` + `styles/index.css` + `mochi.css`; metadata. |
| `app/prototypes/mochi/page.tsx` | Client shell: `DeviceThemeProvider` (`mochi-theme`) → `MochiProvider` → `Stage` panels → `SurfaceFrame` (`style="clay"`, `windowChrome`, `menu`, `storageKey="mochi"`, `draggable`) → `.mch-app[data-clay-depth]` → sidebar + top bar + views + palette + toast. |
| `app/prototypes/mochi/navigation.md` | This file. |
| `src/prototypes/mochi/mochi.css` | One stylesheet, nine numbered sections with a style index (depth recipe, shell, atoms, the four views, overlays, tablet reflow). |
| `src/prototypes/mochi/data.ts` | Frozen `TODAY`, 7 envelopes, 6 habits with 28-day histories, 7 agenda rows, the 30-day spend array, week maths (`weekSlots` / `weekCounts` / `weekBlocks` / `streakOf`) and the `money` formatters. |
| `src/prototypes/mochi/state/mochi-context.tsx` | Hash router, preferences (depth, week start), plan state (categories, habits, agenda), selections, derived totals, `isWide` observer, ⌘K/Esc/1–4// shortcuts, toast, localStorage persistence. |
| `src/prototypes/mochi/components/atoms.tsx` | The clay atoms: `Card`, `Ring`, `Bar`, `Segmented`, `Fact`, `CheckPuck`. |
| `src/prototypes/mochi/components/sparkline.tsx` | The 30-day spending trace (pure geometry over a fixed array). |
| `src/prototypes/mochi/components/command-palette.tsx` | The ⌘K overlay. |
| `src/prototypes/mochi/components/icons.tsx` | 16 inline SVG icons — no emoji, no assets. |
| `src/prototypes/mochi/screens/{today,budget,habits,settings}.tsx` | The four views. |

## Non-obvious decisions (for future agents)

- **The detail pane needs a stretching grid row to be sticky.** With
  `align-items: start` on `.mch-split` a grid item's containing block is
  only as tall as the item, so `position: sticky` has nowhere to travel.
  The fix is a stretching row plus `align-self: start` on `.mch-detail`.
- **Depth is one data attribute, not three shadow values in three files.**
  `.mch-app[data-clay-depth]` re-cuts `--mch-lift` / `--mch-lift-lg` /
  `--mch-press` / `--mch-radius` together, and the whole UI follows because
  nothing else declares a shadow.
- **The desktop surface squares the clay radii off.** `.surface[data-surface="desktop"]`
  in the proto-kit drops `--r-lg` to 14px and `--r-pill` to 8px for
  window-like chrome. Mochi re-asserts the puffy scale with a selector
  specific enough (0,3,0) to win: `.surface[data-surface="…"][data-style="clay"]`.
- **`weekStart` is not a label switch.** It re-derives `weekSlots()` and
  `weekCounts()`, which re-slides the 7-day pip strip on Today, regroups the
  per-day tally in the habit detail and re-labels both.
- **`streakOf` skips today when today is still unticked**, so ticking a
  habit in the morning extends the visible streak instead of resetting it.
- **New rows get a blank history, not a fake one** — an added habit starts
  with 28 empty cells and a 0-day streak, which is honest.
- **Preview chrome stays on `<Stage>`**: the fullscreen button, the
  Dashboard link and the desktop/tablet switcher are never inside the app.

## Live URL

http://localhost:3000/prototypes/mochi/
