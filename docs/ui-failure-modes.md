# UI Failure Modes — what "bad" looks like (READ BEFORE BUILDING)

> Catalogue of the recurring UI defects the user caught during prototype reviews
> (2026-09-28, seven-prototype review pass). These are described as **failure
> classes**, not fixes — learn to *recognise* them in your own output. Every
> rule here comes from something that shipped and was rejected.
>
> Companion docs: [`preferences.md`](./preferences.md) (what the user likes),
> [`design-standards.md`](./design-standards.md) (geometry),
> [`design-languages/`](./design-languages/navigation.md) (per-style rules).

## 1. Content escaping its control — the #1 offender

Text as wide as (or wider than) the button/pill/chip/segment/tab containing it,
so glyphs touch or cross the border. Seen on: filter buttons, segmented
controls, nav bubbles, speed options ("1.25x" touching the edges), category
chips, tab labels inside the active pill.

**The test:** for every control, imagine its longest possible label. If the
rendered text has less than ~12px of clear space to each inner edge, the
control is broken — regardless of how it looks with short labels.
**The habit:** size controls to content (`flex: 0 0 auto`, `width: max-content`)
rather than fixed widths; give horizontal padding generously (≥14px per side
for text buttons); when a label can't shrink, the control grows — never the
reverse.

## 2. Orphan-word and over-tall toasts

A toast/snackbar that wraps to 3 lines, or leaves one word alone on the last
line ("…on the clay **dial**" style breaks). A transient message that needs
three lines is a paragraph, not a toast.

**The test:** every string passed to `showToast()` must fit on ONE line at the
toast's width, or break into a balanced two. **The habit:** cap toast width at
~85% of the device, keep copy under ~34 characters where possible, and shorten
the message instead of letting it wrap. Two balanced lines beat one line plus
an orphan word.

## 3. Text escaping table cells and stat blocks

Numbers or labels rendering outside their column — uptime escaping a table
cell, "5 min" hanging off a card's right edge, shopping-list text touching the
container border. Fixed-layout regions must reserve width for their *widest
possible* content, and adjacent columns must shrink first.

**The habit:** tabular-nums for all figures; `min-width` on data columns sized
to the longest value; let decorative/secondary columns (status words, tags)
absorb the squeeze; `overflow: hidden` + `text-overflow: ellipsis` is the last
resort, not the plan. Padding belongs *inside* the container — content should
never rely on the container edge to stop it.

## 4. Jammed segmented controls

Segment groups rendering with zero gap/padding so options read as one word:
"1H6H12H24H", "Darklight". A segmented control is only legible when each
segment has its own padded box (≥10px per side), a visible gap or divider, and
a comfortable height (≥30px). Same for thin "hairline" rows that should be
tappable controls — a control that looks like a text label isn't a control
(Nook's tight/loose and A-size options read as plain text).

## 5. Selection/affordance clipping

Active-state rings, highlights, or focus outlines cut off by an ancestor's
`overflow: hidden` — half the ring missing at corners. Either inset the ring
(`outline-offset: -2px`), or give the clipping container padding so the ring
has room. If a selection style can be clipped, it will be.

## 6. Corner crowding

Icons, dots, or badges placed so close to a container's corner they nearly
escape it (profile bell, soundscape icon, theme dot). Keep ≥8px breathing room
between any glyph and the nearest border/corner.

## 7. Primary actions below the fold

The player screen's transport buttons requiring a scroll to reach. On a
"device screen", the primary control of the moment must be visible without
scrolling. Full-screen surfaces (player, breathe, ticket) should use fixed
in-device layouts (`position: absolute; inset: 0` + flex regions), not long
scroll pages.

## 8. Redundant duplicate controls

Two progress indicators doing the same job (animated waveform + a plain bar
under it). One control per function; if a second exists, it must say something
the first can't.

## 9. Transparent modals/sheets

A detail sheet or dialog whose background lets the page underneath show
*through and scroll through* it. Overlays need an opaque (or deliberately
frosted-with-blur) surface plus a scrim; the content behind must never compete
with the content in front.

## 10. Minimalism ≠ wayfinding failure

A minimal screen can still be cluttered: ungrouped content, unlabeled
sections, controls without affordance. Restraint removes decoration, not
structure — grouping, spacing rhythm, and "this is tappable" cues must survive
the purge. If a reviewer says "I had to think about how to navigate," the
layout failed, not the user.

## 11. Composed layouts must reserve space

Bento/poster tiles where absolutely-positioned text overlaps generated art
(weather details printed on top of the city name). When composing art + labels
in one tile, give the label a reserved band (flex rows) or a solid/gradient
scrim plate — never let two content layers fight for the same pixels.

## 12. Number/unit line-breaks

"11h 1m" breaking as "11h 1" / "min" — units separated from their numbers.
Keep number+unit pairs together (`white-space: nowrap` on the pair) and
format adaptively when space runs out ("11h" / "1m" on two lines is fine;
"11h 1" / "min" never is).

## 13. Excessive chrome padding

Floating headers pushed too far from the screen edge (big top padding on the
header pill on every screen). Floating chrome hugs its margin (12-16px below
the status bar); content padding belongs to the content.

## 14. Broken switch/track contrast

A toggle where only the knob is visible — the track color matches the surface
in one of the themes. Every control needs both states legible on both themes;
check track-on-surface contrast, not just text.

## 15. Dead affordances

A visible search button (or any control) that does nothing. If it renders as
interactive, it must be wired — or it must not render.


## 16. vh/vw inside the device frame

`vh`/`vw` reference the **browser viewport**, not the mock device — so
`max-width: 46vh` on content inside a 390×844 frame resolves against a
~900px browser window and blows the layout into overlaps. Size in-device
content in px (or % of the device container). Caught when the Drift
player's cover sized itself off the real viewport.

## 17. Floating chrome clearance

A floating header/pill positioned below the status bar must sit ~12px
under it (the in-app root starts *below* the status bar, so `top: 12px`,
never 40px+), and scroll content must pad to `top + height + gap`. If a
screen is a focus mode (player, breathe), hide the chrome entirely rather
than pushing content down. Also: never let a decorative scrim/pseudo-element
paint over sibling content — a `::after` with `inset: 0` will cover whatever
follows it in paint order.

## 18. Toggle states need per-state, per-theme contrast

A switch isn't "done" when the thumb moves. Check all four combinations —
on/off × light/dark — against the surface the control sits on: OFF track on
light cards, ON track on dark cards, thumb against track in both. Give the
ON track a saturated fill plus an outer ring (`box-shadow: 0 0 0 2px
var(--color-bg)`) so it separates from any background, and make any check
icon contrast with the thumb (dark check on white thumb — not
`--color-primary-fg` on itself).

## 19. Segmented controls must read as N distinct choices

A connected strip where cells share one border and only the fill changes
reads as "a single button with a colored end." Use separated cells: gap +
individual borders per option, uppercase labels, min-width per cell sized
to its longest label. (Carbon/enterprise styles may keep connected strips —
but then the active cell needs strong fill + divider contrast.)

## 20. Wrap-prone UI copy gets reserved space

Header rows like `Title … flag-phrase` break mid-phrase when the title is
long. Give the head `flex-wrap: wrap` and the flag `margin-left: auto;
white-space: nowrap`, so the phrase drops to its own full line instead of
splitting ("…more this / week"). Same discipline as failure-mode #2,
applied to inline metadata.

## 21. Centered stage + overflowing device clips BOTH sides

`.stage { justify-content: center }` is safe only while the device fits the
viewport. One wide subtree (a long nowrap row, a fixed-width grid track)
pushes the device's min-content width past the screen, and centering then
clips the LEFT edge too — text loses its first characters on both sides
(Still's intention line, Atlas tile headings, Pulse uptime all showed this).

Fix (proto-kit, already applied — never undo it):
- `stage.module.css` @≤480px: `.stage { justify-content: flex-start }` so
  overflow can only clip the right, never the left.
- `device-frame.module.css` @≤480px: `.device { min-width: 0; max-width: 100% }`
  so a subtree's min-content can't widen the frame; the frame clips inside.

Corollary: at mobile widths the device is the viewport. Verify every screen
at ~390px, not just desktop — a centered 430px device in a 390px window is
exactly this bug and is invisible on a wide monitor.

## 22. Empty "add" slots need an affordance, not just less style

An unfilled slot rendered as a tinted box with a small "Choose" label reads
as disabled content, not a button. Empty add-slots should look like an
action: dashed outline, a plus chip, primary-colored verb ("Add a recipe"),
`box-shadow: none` so the inset doesn't read as a sunken display well.

## 23. Sticky headers inside scrolling tiles

`position: sticky` on a tile that lives INSIDE the scrolling screen pins a
content block over the grid while everything else scrolls — it reads as a
rendering glitch, not chrome. Only prototype-level top bars (outside the
scroll container) may stick. Atlas's greeting tile was the offender; rule:
nothing inside `.at-screen`/screen scroll containers gets sticky.

## 24. Root-scope button resets silently zero class padding

A reset like `.at button { padding: 0; ... }` has specificity (0,1,1) — it
BEATS every single-class rule such as `.at-tile { padding: 14px }` (0,1,0).
Result: every button, tile and chip in the prototype renders with no
padding at all — text sits flush at the tile edge, "looks clipped on the
left", chips read squished — while the CSS source looks perfectly correct.
Atlas shipped like this for weeks; the flush-left tile rows users kept
reporting were this bug.

Rule: root resets MUST be zero-specificity — use `:where()`:

```css
.at :where(button) { font: inherit; color: inherit; background: none;
  border: none; padding: 0; cursor: pointer; }
```

Applies to every prototype (`X :where(button)`), and to any reset that
fights component classes (lists, headings, inputs — same trap). Never
"fix" the victims by adding `!important` or doubling specificity; fix the
reset. When a class rule's padding computes to 0 in devtools, check for a
higher-specificity reset BEFORE touching the component rule.

## 25. Fixed-px grid-track minimums silently disable track growth

`grid-auto-rows: minmax(96px, auto)` looks like "at least 96px, grow if
needed" — but Chrome never grows a track whose MIN is a fixed px length
(verified 2026-09-28: every `minmax(96px, *)` variant stayed at 96 while
content scrolled to 174px inside an `overflow: hidden` tile). Symptoms:
a tile's rows get cut off with "no scrolling", content just disappears at
the tile edge.

Fix (Atlas bento): tracks must be content-driven —
`grid-auto-rows: minmax(min-content, auto)` — and the design floor moves
ONTO THE TILE: `.at-tile { min-height: 96px }` (a min-height contributes to
min-content, so the floor holds AND rows still grow). Tiles that should hug
content opt out with `min-height: 0` (greeting, about rows). Verify with
`tile.scrollHeight <= tile.clientHeight` for EVERY tile.

## 26. Overflow strips inside a column flex collapse to a sliver

A horizontal chip/filter strip (`overflow-x: auto`) that is a flex CHILD of
a `flex-direction: column` scroll container has an automatic minimum size of
ZERO (overflow ≠ visible ⇒ min-size auto ⇒ 0). When the column's content
overflows, the strip shrinks to a few px and the chips render half-clipped
behind the next block (Simmer's Find filters). Same family as the search
field collapse fixed earlier.

Fix: every fixed-height strip that scrolls horizontally needs
`flex: 0 0 auto` on itself. Corollary: NEVER leave `overflow-x: auto` on an
unflexed child of a column flex container.

## Self-review checklist (run before you finish ANY prototype)

1. Grep your stylesheet for fixed `width` on anything containing text — justify each one.
2. Read every `showToast(...)` string: one line at 85% width, or balanced two?
3. Longest-label test on every chip/segment/button/tab mentally, or in data.
4. Primary action of each screen visible without scrolling?
5. Every overlay has an opaque surface + scrim?
6. Switches/tracks legible in BOTH themes?
7. Every rendered control actually does something?
8. Number+unit pairs nowrap'd; table columns sized to widest value?
9. Selection rings can't be clipped?
10. ≥8px from any glyph to any corner?
11. No vh/vw anywhere inside the device frame?
12. Every switch: 4 states checked (on/off × light/dark) against its surface?
13. Floating chrome 12px under the status bar; content padded to clear it?
14. Segmented controls: distinct cells with per-cell borders?
15. Verified at ~390px viewport, not just desktop width?
16. Any `position: sticky` inside a screen's scroll container? Remove it.
17. Buttons with class padding: computed padding in devtools actually non-zero
    (i.e. no root `X button` reset is beating it)?
18. Grid tiles: `scrollHeight <= clientHeight` for EVERY tile (nothing clipped
    with no way to scroll)?
19. Horizontal chip/filter strips: `flex: 0 0 auto` if they sit in a column
    flex container?
