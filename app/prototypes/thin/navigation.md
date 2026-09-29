# thin — navigation

## What this prototype is

**"Thin"** — a minimal desktop **tasks + writing** app in the **Minimalism**
design language (`style="minimal"`), built on the `meridian` desktop shell.
It is the desktop sibling of `nook`, the minimal *phone* build: same token
layer, same monochrome rules — entirely different layout system. Where `nook`
is a bottom-nav reading app, `thin` is a sidebar, master–detail, ⌘K and
multi-select.

The minimal language shows up as discipline rather than decoration:

- **Hairlines and whitespace do all the structural work.** `thin.css`
  contains zero `box-shadow`; minimal.css sets `--shadow-*: none`.
- **No cards where a list will do.** A task is a line of text you can click to
  tick. The only borders in the app are separators, the focused control and
  the palette.
- **One type scale, one font for chrome, a serif for writing.** `--fs-*` is
  re-declared on the app root with a multiplier, so the Settings type-scale
  control resizes the *whole* window, chrome included. The daily note is set
  in a serif stack — an app that writes should not write in the same face as
  its own buttons.
- **One accent, three places.** `--tn-accent` (aliased to a token, never
  authored) appears only on: the chosen project filter's underline, the
  selected project's 2px rule in the master list, the "on" switch dot, and
  the focus ring. Everything else is ink, grey or a hairline. Ticked
  checkboxes are ink (`--color-primary`), not the accent — state is not
  decoration.
- **A single filled control in the entire app**: the Capture button in the top
  bar. If it does not need to be the loudest thing on screen, it is not.

## Views

| View | Hash | Contents |
|------|------|----------|
| Today | `#today` | One quiet list. The day's tasks plus anything still open from earlier days (labelled "from 22 Sep"), working completion by clicking the title, checkbox multi-select driving the bulk bar, a project filter written as a line of words rather than a row of chips, and a plain-text daily note in a serif column that saves on every keystroke (`thin-notes-v1`). |
| Projects | `#projects` | The master–detail pattern. Projects sit in a fixed left column with live open/done counts; the selected project's tasks open on the right with a working add row (with a "for today" checkbox), complete, and archive. |
| Inbox | `#inbox` | Capture first: Enter really prepends a task to the list below and clears the field. Each unfiled task can then be scheduled for today, filed under a project from a select, or archived — every one of which removes it from the inbox for real. |
| Settings | `#settings` | Theme scoped to the window, a four-step type scale that re-declares `--fs-*` on the app root (so everything resizes together), a reduce-motion switch that zeroes every transition, the "show finished work" switch, the keyboard reference, and a demo-data restore. |

## Interactions

- **⌘K / Ctrl+K** — command palette over views, projects, tasks and three
  actions. Tasks and projects jump to the view that contains them.
- **1–4** — Today / Projects / Inbox / Settings. **N** — jump to the capture
  field. **/** — Today with the project filter focused. **X** — tick the
  selection, or the next unfinished task if nothing is selected. **Esc** —
  close the palette and clear the selection.
- **One tick rule everywhere**: if everything ticked is already done, ticking
  reopens it. There is no second button and no context menu.
- **Bulk bar** appears the moment anything is selected: count, "Tick",
  "Archive" (which becomes "Restore" when everything ticked is already
  filed) and "Clear". It is a line of text, not a floating toolbar.
- **The note saves itself.** There is no save button, no dirty state and no
  confirmation dialog; a "Saved" chip appears for a moment after you stop
  typing. Preferences persist as `thin-prefs-v1`, the theme as `thin-theme`,
  the dragged window size as `proto-kit-surface-size-thin`.
- **Everything is one array.** Ticking in Projects moves the count in the
  master list, filters on Today and the palette results at the same time.

## Tablet reflow — `@container surface (max-width: 900px)`

Both changes are *layout* changes, not squeezes:

1. **Master–detail becomes one pane.** `.tn-split` goes to
   `flex-direction: column` and then only one of its two children is
   displayed, driven by `data-pane` on the split: picking a project sets
   `data-pane="detail"`, which hides the list; a **back affordance**
   (`.tn-back`, `display: none` on the desktop and `inline-flex` inside the
   container query) sets it back to `"list"`. The master list is *swapped*
   for the detail, not squeezed beside it.
2. **The note drops under the list.** `.tn-today__body` goes to a column and
   the note's vertical hairline becomes a horizontal one, so the writing
   surface is full width instead of a 316px column.

The proto-kit sidebar collapses to a 68px rail at the same breakpoint (that
is the kit's own behaviour), and at `max-width: 620px` the settings fields
and the task-row controls stack instead of competing.

## Files

| Path | What it is |
|------|------------|
| `app/prototypes/thin/page.tsx` | The desktop shell: Stage → SurfaceFrame → sidebar + top bar → views. |
| `app/prototypes/thin/layout.tsx` | Token imports (tokens.css, styles/index.css, thin.css) and the title. |
| `src/prototypes/thin/thin.css` | The whole stylesheet, with the numbered style index at the top. |
| `src/prototypes/thin/data.ts` | Fixed demo data: 5 projects, 30 tasks, 3 seeded notes, "today" pinned to 2026-09-29. |
| `src/prototypes/thin/state/thin-context.tsx` | One context: routing, selection, bulk actions, capture, triage, prefs, notes, palette, toast. |
| `src/prototypes/thin/components/` | `icons.tsx` (hairline 1.4px set), `task-row.tsx` (the one row + the bulk bar), `command-palette.tsx` (⌘K). |
| `src/prototypes/thin/screens/` | `today-screen.tsx`, `projects-screen.tsx`, `inbox-screen.tsx`, `settings-screen.tsx`. |
