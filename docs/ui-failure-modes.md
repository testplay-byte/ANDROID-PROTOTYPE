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
