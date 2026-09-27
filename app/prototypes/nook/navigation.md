# nook — navigation

## What this prototype is

**"Nook"** — a typographic reading journal built in the **Minimalism** design
language (`<DeviceFrame style="minimal">`). The design IS the type scale and
the whitespace: pure grayscale from `src/proto-kit/styles/minimal.css`, 1px
hairlines doing every structural job, ink-as-primary, and exactly one shadow
(the toast's `--shadow-2`). Reader body text, the featured title, notes
quotations and stat numerals are set in a serif stack (Iowan Old Style →
Palatino → Georgia) — a book app whose type is all sans is not a book app —
while all UI chrome stays Inter. It is deliberately purer and more
text-first than the existing minimal demo (habit-tracker): no large titles,
no pills, no switch material — small-caps kickers, typographic rows and
hairline rules only.

## Screens

| Screen | View id  | Contents |
|--------|----------|----------|
| Shelf  | `#shelf` | Quiet small-caps header (no large title). "Currently reading" card with the big serif title treatment, author/year muted, pages-left + 1px meter. Then In progress / Finished / To read as pure typographic lines: title 500-weight, author muted, 1px hairline separators, 1px progress rule under each row; finished rows show "— Finished · N notes". Tap any line → opens that book in the reader. |
| Read   | `#read`  | Two states. **Picker**: rank-ordered line list (reading → to-read → finished) with %/page meta. **Reader**: real long-form passages (original prose in `lib/data.ts`). 1px progress bar under the top chrome; "A A A" serif size control (3 steps, persisted) + tight/loose leading toggle. Scroll drives progress (monotonic), resumes at the stored page, feeds minutes + the day streak; reaching 100% flips the book to Finished and toasts. **Tap the page outside a paragraph toggles the chrome (immersive — the signature minimal interaction); tap a paragraph marks it** (hairline rule in the margin, no highlighter yellow). "The end" state returns to the shelf. |
| Notes  | `#notes` | Every marked passage grouped by book (serif quotations on a hanging hairline, ¶ locators muted). **read** jumps into the reader at that paragraph (smooth scroll + 1.3s flash); **remove** deletes the mark. Empty state invites the first mark with an "Open a book" hairline CTA. Notes badge (count) rides on the tab word. |
| You    | `#you`   | Quiet stat numerals (books finished / minutes read / day streak), the yearly goal (12) as a single hairline circle + ink arc that draws on mount, two hairline switches (tap-to-highlight, count reading time — persisted), Dark/Light text pair wired to `useDeviceTheme` (scoped `.device`, persisted `nook-theme`), library facts + "Reset the shelf" (hover→error red, the only saturated color anywhere). |

## Interactions

- **Immersive chrome** — tapping the reader body fades/shifts the top bar +
  controls strip away (180ms); tap again to restore. The 1px progress rule
  never leaves — it is the page number.
- **Scroll-driven progress** — `scrollTop/span` → %, clamped monotonic
  (scrolling back never loses ground). 1 progress point ≈ 1 minute read
  (when "count reading time" is on) and touches the calendar-day streak.
- **Tap-to-highlight** — paragraph taps toggle a mark (persisted); the
  paragraph grows a 1px left rule. Toggleable off in You for purists.
- **Jump-to** — Notes → `requestJump` opens the book, sets a jump target;
  the reader smooth-scrolls to the paragraph, flashes its background once,
  clears the target.
- **Finish moment** — 100% flips status to Finished (shelf re-groups the
  row into "Finished"), toasts "Finished — Walden", and the reader footer
  becomes "The end / Return to the shelf".
- **Staggered entrances** — the active view remounts (`key={view}`); blocks
  rise 6px at 180ms with per-index `--stagger` delays. Motion is capped at
  180–200ms opacity/translate everywhere — nothing bouncy; a
  `prefers-reduced-motion` block kills it all.
- **Text-only tabs** — four words, no icons, no pill. Active = weight 400→
  600, ink color, and a 14px 1px underline. Leaving Read closes the open
  book back to the picker.
- **Theme** — Dark/Light flips `.device[data-theme]` only (never the page);
  the minimal bezel inverts automatically; persisted as `nook-theme`.
- **Swipe** — horizontal drag navigates the four tabs
  (`useSwipeSimulation`); post-drag clicks are suppressed, so a swipe never
  toggles the reader chrome.
- Persistence (localStorage): `nook-progress-v1`, `nook-highlights-v1`,
  `nook-prefs-v1`, `nook-stats-v1` (day-keyed streak), `nook-active-v1`.

## Files

| File | What it is |
|------|------------|
| `app/prototypes/nook/layout.tsx` | Imports tokens.css + styles/index.css + `nook.css`; metadata "Nook — ANDROID-PROTOTYPE". |
| `app/prototypes/nook/page.tsx` | Client shell: DeviceThemeProvider (`nook-theme`, initial dark) → NookProvider → Stage panels (badge/title/desc + tags, screeninfo, live mini-bars, design kvlist) → DeviceFrame (`style="minimal"`) → `.no` app root (hash-routed screens keyed by view, custom text-only tab row, toast); swipe wiring; MiniBar helper. |
| `src/prototypes/nook/nook.css` | ONE stylesheet, everything scoped under `.no` (plus `body`/stage-panel helpers like bloom.css): serif/sans split, small-caps heads, 1px rules, featured card, reader chrome + immersive + 3 text sizes + margin-rule marks, notes, goal ring, hairline switch, text tabs, toast, reduced-motion block. |
| `src/prototypes/nook/lib/data.ts` | Seven public-domain-era classics with original essay-fiction passages; `bookById/flatParagraphs/minutesLabel` helpers, `YEARLY_GOAL = 12`. |
| `src/prototypes/nook/state/nook-context.tsx` | Central provider (wallet/bloom pattern): library with persisted progress/status overlays, active book, monotonic `setProgress` (feeds minutes/streak/finish), highlights CRUD + jump target, prefs, view (hash router shared so screens can hand off), toast channel, `resetAll`. |
| `src/prototypes/nook/components/icons.tsx` | Inline SVG icon set (close/check/arrow/dot) — no emoji anywhere. |
| `src/prototypes/nook/components/toast.tsx` | The one `--shadow-2` overlay: hairline pill-less line of text, fade + 8px rise. |
| `src/prototypes/nook/screens/*.tsx` | `shelf-screen`, `read-screen` (picker + reader), `notes-screen`, `you-screen`. |

## Non-obvious decisions (for future agents)

- **Custom tab row, not proto-kit `<BottomNav>`.** The user mandate forbids
  floating pill nav here and the minimal doc's "floating" recommendation is
  exactly what this prototype intentionally breaks: BottomNav always renders
  icons + a pill surface. `.no-tabs` is a flat text row over a bg fade; the
  only "indicator" is weight + a 1px underline. Do not swap it back.
- **No large title anywhere.** Every screen header is an 11px letter-spaced
  small-caps kicker + muted meta at the opposite baseline. Hierarchy comes
  from the featured card's 25px serif title and the row/numeral scale —
  never a TopBar variant.
- **Reader progress is scroll-based, not pager-based.** The `advanceBy`
  paragraph-stepper idea was dropped: `onScroll` maps scrollTop→%, clamped
  monotonic in the provider (`Math.max(book.pct, …)`), so notes-jump,
  immersive taps and re-reads never corrupt progress. `startParagraphOf`
  converts stored % back to a paragraph offset for resume.
- **Highlights use a 1px left rule, not a background tint** — tinted
  highlighter would import "color" behavior into a hairline language; the
  rule reads as an editorial margin mark and survives both themes.
- **`view` lives in NookProvider** (not page state, unlike bloom) because
  Notes must navigate into Read (`requestJump → go("read")`) and the tab
  row must close the book when leaving Read — screens need the router.
- **proto-kit's `useSwipeSimulation` suppresses the click after a drag**, so
  the immersive tap handler does not need its own drag guard.
- **Serif stack is system-only** (Iowan Old Style/Palatino/Georgia) — no web
  font download, matches the zero-asset rule; the sans/chrome stays Inter.
- **Reset is state-only**: it drops the five `nook-*` localStorage keys and
  reverts to seeds; it never touches `nook-theme` (the device theme is the
  user's page-level choice, not reading data).

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/nook/
