# quill — navigation

## What this prototype is

**"Quill"** — a desktop **notes / knowledge app** in the **HIG (Apple Human
Interface Guidelines)** design language (`<SurfaceFrame style="hig">`). It is the
HIG's desktop expression: the same tokens as the phone family in
`src/proto-kit/styles/hig.css` (true black / grouped gray, system blue, 1px
hairlines) driving a *window* with a sidebar, a detail pane beside a list, a
command palette and a keyboard map.

The point of the prototype is the desktop shell, so it is deliberately not a
phone layout stretched to 1280px: navigation is a `<DesktopSidebar>`, the library
is three columns, the editor has a metadata rail beside the text, settings is a
two-column form, and ⌘K / `/` / `1`–`4` / `↑↓` / `Esc` all work. No status bar
and no bottom nav — those are phone-only and never appear on a desktop surface.

## Screens (hash-routed, deep-linkable)

| Screen    | View id        | Contents |
|-----------|----------------|----------|
| Library   | `#library`     | Three columns: sidebar, note list, preview pane. Search field, tag filter chips (with counts), Pinned toggle, three-way sort (Recent / Title / Length). `↑`/`↓` move the selection, `Enter` opens the note. Footer reports "n of m notes". |
| Note      | `#note/<id>`   | The block editor beside a metadata rail. Title, paragraphs, a quote, a code block and a checklist whose checkboxes **really toggle** (persisted overrides). Footer shows word count, block count, checked count and the relative updated time. Prev/next note arrows in the editor bar. |
| Search    | `#search`      | Query field (focused on mount) + scope chips (Everything / Text / Checklist / Code). Results **grouped** by where the match landed — Title, Checklist, Note, Code — with the matched span wrapped in `<mark>`. `↑`/`↓` walk the notes, `Enter` opens one, `Esc` clears. |
| Settings  | `#settings`    | Two-column form: a section list (Appearance / Editor / Keyboard / Data) on the left, its controls on the right. Theme is the device theme; **font size really re-scales the editor**; plus the keyboard reference and a reset. |

`#note` with no id opens the currently selected note. The active note is shared
state: selecting a row in the Library fills the preview pane, and opening it
carries the same note into the editor.

## Interactions

- **⌘K / Ctrl+K** — command palette: jump to a view, or open a note by title,
  tag or body text. `↑`/`↓` + `Enter`, `Esc` closes.
- **/** — focuses the library search field (and switches to the Library first).
- **1–4** — jump to Library / Note / Search / Settings.
- **↑ ↓** — walk the filtered library list; the preview pane follows.
- **Esc** — steps back out: close the palette → clear the query → clear the
  search → clear the tag chips → clear the Pinned filter.
- **Checklist** — tapping a box (or its label) writes `noteId:itemId` into the
  provider's override map. Progress meters in the editor rail and the preview
  pane both follow; the word count does not change.
- **New note** — inserts an untitled note at the top of the list and opens it.
  Ids are counted (`n-new-1`, `n-new-2`, …) — no randomness.
- Persistence (localStorage): `quill-theme` (device theme, via
  `DeviceThemeProvider`), `quill-checks-v1`, `quill-font-v1`, `quill-sort-v1`.

## Files

| File | What it is |
|------|------------|
| `app/prototypes/quill/layout.tsx` | Imports `tokens.css` + `styles/index.css` + `quill.css`; metadata "Quill — ANDROID-PROTOTYPE". Thin pass-through. |
| `app/prototypes/quill/page.tsx` | Client shell: `DeviceThemeProvider` (`quill-theme`, initial light) → `QuillProvider` → `Stage` panels → `SurfaceFrame` (`surface="desktop"`, `style="hig"`, `windowChrome`, `windowTitle`, `menu` bar) → `DesktopSidebar` (two section headings) + `DesktopTopBar` (⌘K slot, New note, theme toggle, avatar) + `SurfaceScreen` + per-view screens + `CommandPalette` + toast. Owns the `/` and `1`–`4` shortcuts. |
| `src/prototypes/quill/quill.css` | ONE stylesheet with a numbered STYLE INDEX header. Sections: shell · top-bar extras · shared atoms · library · preview pane · note editor · meta rail · search · settings · overlays · adaptivity. |
| `src/prototypes/quill/data.ts` | Eight authored notes as block lists, tag definitions, the search scorer/Grouper and the `relativeTime` formatter. Fixed `updatedMins` values — no `Math.random`, no `Date.now`. |
| `src/prototypes/quill/state/quill-context.tsx` | The provider: hash router (`#view` / `#note/<id>`), active note, checklist overrides, library filters + sort, search query + scope, editor font size, palette, toast, counts, `newNote`, `resetAll`, persistence. |
| `src/prototypes/quill/components/icons.tsx` | 20px stroke SVG icon set (library, note, search, sliders, checklist, code, quote, pin, clock, moon/sun, keyboard, …). No emoji, no assets. |
| `src/prototypes/quill/components/note-blocks.tsx` | The single renderer for note content — title, paragraph, quote, code, checklist. Also the `BlockKinds` strip. |
| `src/prototypes/quill/components/highlight.tsx` | `<Highlight>` — wraps the matched span of a query in `<mark>`, nothing else. |
| `src/prototypes/quill/components/command-palette.tsx` | The ⌘K overlay. |
| `src/prototypes/quill/screens/library.tsx` | List + preview, filters, keyboard selection. |
| `src/prototypes/quill/screens/note.tsx` | Editor + metadata rail + footer stats. |
| `src/prototypes/quill/screens/search.tsx` | Grouped, highlighted, keyboard-driven results. |
| `src/prototypes/quill/screens/settings.tsx` | Two-column form; theme, editor font size, shortcuts, data reset. |

## Design-language decisions (HIG on a desktop surface)

- **Tokens only.** Every colour, radius, border, shadow and type size is
  `var(--color-*)`, `var(--fs-*)`, `var(--r-*)`, `var(--sp-*)`,
  `var(--shadow-*)` or `var(--border-w)`. There is not one hardcoded hex in
  `quill.css`; the HIG personality arrives entirely through `data-style="hig"`
  on the surface.
- **HIG type scale as local tokens.** HIG's sizes are larger than the M3 scale
  the token file ships, so `quill.css` declares `--ql-title1 … --ql-caption`
  (28/22/17/17/16/15/13/12) on `.ql-main` — the same contract the wallet and
  fitness-tracker prototypes use for their `--ios-*` tokens.
- **Hairlines, not shadows.** Separation is `--border-w` (1px) plus the
  surface-step ladder. `--shadow-2` is spent only on the palette and the toast;
  `--shadow-1` is not used at all.
- **Generous radii from the token scale** — `--r-lg` for cards, `--r-md` for
  nested panels, `--r-pill` for chips, search fields and buttons. No new radius
  values were invented.
- **System blue does the talking.** Selection, checked boxes, active chips and
  the progress fill are all `--color-primary`; nothing else is coloured.
- **Focus is real.** One `:focus-visible` rule (2px system-blue outline with a
  2px offset) covers every button, input and focusable row on the surface.
- **Light default.** `initialTheme="light"` — the HIG grouped canvas is the
  more recognisable desktop-notes reading, and the dark theme inverts the
  token ladder correctly because both themes are defined in `hig.css`.

## Non-obvious decisions (for future agents)

- **The Library search filters titles, folders and tags only** — body text is
  what the dedicated **Search view** is for. The `/` shortcut therefore takes you
  to a *different* view than a phone prototype would, where search filters the
  same list. This is intentional, not an oversight.
- **Filters survive view changes.** `go()` does not clear the search or the tag
  chips (Meridian's `go()` does). Coming back from the editor should not lose
  the reading context you were in.
- **The active note is one piece of state, not two.** The Library preview and
  the editor both read `activeNoteId`; `#note/<id>` encodes the selection in
  the URL, which is why the editor hash carries a path segment while the other
  views do not.
- **Checklist state is an override map, not a copied note.** `isChecked()` falls
  back to the seed `done` value, so toggling never mutates the fixture data and
  "reset" is a one-line `{}`.
- **The editor's font size is a single variable.** Settings writes
  `data-size` on the editor split; the CSS swaps `--ql-editor-size` and every
  block (title `1.7em`, code `0.86em`, quote `0.78em`) scales with it. Nothing
  else in the app changes size.
- **The settings section list is local `useState`, not provider state.** Only
  the *values* are global (theme, font size, sort). A settings sub-tab is not a
  route, so it is not in the hash.
- **Media queries respond to the browser viewport, not the window** — the same
  trade-off meridian makes. The surface is a fixed 1280×800 box that the frame
  zooms to fit, so in-surface sizing comes from grid + flex + the panes'
  `height: 100%`, never from `vh`/`vw`. Breakpoints at 1120 / 1000 / 760px
  collapse the splits, the settings form and the row snippets.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/quill/
