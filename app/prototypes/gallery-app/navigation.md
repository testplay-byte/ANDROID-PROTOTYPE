# gallery-app — navigation

## What this prototype is

A Bauhaus art-gallery app built on proto-kit. Off-white paper, near-black
ink, and the primary triad (red #d5321f / blue #2b50c8 / yellow #f2b705)
used as SOLID geometric blocks — never gradients. Sharp corners, 2px ink
borders on every box, zero shadows, uppercase wide-tracked headings. 4
tabs, hard slab bottom nav, hero top bar on the main screens, and one
chrome experiment (segmented index strip instead of a top bar). All
artwork imagery is generative pure CSS — zero bitmaps.

## Screens (4 tabs)

| Screen      | View id       | Chrome | Description |
|-------------|---------------|--------|-------------|
| Exhibitions | `exhibitions` | TopBar hero "GALLERY" / overline "Weimar — Dessau — Berlin" | Numbered exhibition list (01/02/03 huge display type + mini CSS poster + quarter-circle enter tick), diagonal divider, triad colour-study grid (ROT/BLAU/GELB squares). Tapping a row pushes Exhibition Detail. |
| ↳ Detail (push) | `exhibitions` (context `detailId`) | hero TopBar + in-content back row | Large poster header, bordered facts row (dates / location / price), curatorial blurb, triad rule, TICKETS red slab (toast), hung-works grid (ArtTile). |
| ↳ Plate view (overlay) | any (`plateId`) | full-screen, ends above nav slab | Museum mat: bordered plate of the generated composition, caption block (title / artist / category·medium·size / note), room tag, diamond favourite toggle, triad colour chips that re-ink the plate live. |
| Collection  | `collection`  | **No TopBar** — masthead + bordered segmented INDEX STRIP (00 Alle / 01 Gemälde / 02 Plastik / 03 Grafik) doubles as the category filter | Count ledger (im Saal / gesammelt) + NUR SAMMLUNG (favourites-only) ink toggle, artwork grid of ArtTiles, quarter-circle empty state, triad footer chips, SAMMLUNG LEEREN. |
| Visit       | `visit`       | TopBar hero | Öffnungszeiten ledger (Monday closed), address block with red-disc + blue-quarter motif, date chips (real next 7 days, Mondays disabled), time-slot chips, square adult/concession steppers, hard-bordered summary slab with live EUR total, BOOK red slab → confirmation with rotated geometric ADMITTED stamp + toast. |
| Settings    | `settings`    | TopBar hero | HELL/DUNKEL segmented theme control (persisted `gallery-theme`, scoped to `.device`), square BauhausSwitch rows (Führungen, Audio-Guide, Newsletter) each firing a toast, collection ledger showing persisted favourites count, triad-rule about block. |

## Interactions

- Exhibition row → detail push; back icon/text, tab change, or right-swipe closes it
- Artwork tile plate → full-screen PlateView; ✕ ZURÜCK, right-swipe, or tab change closes it
- Plate colour chips (ROT/BLAU/GELB) re-ink the composition live
- Diamond toggles favourites — persisted in localStorage (`gallery-favs-v1`), shared between collection tiles, plate view, settings ledger, and NUR SAMMLUNG mode; SAMMLUNG LEEREN clears
- TICKETS / BOOK / every toggle fire a bordered ink toast (triad square marks the channel)
- Visit planner: date chips + time slots + steppers feed a live summary; BOOK disabled at 0 tickets; confirmation carries a random code (GM-####)
- Theme persists (`gallery-theme`); swipe left/right navigates tabs (overlays close first); hash router

## Files

| File | What it is |
|------|------------|
| `app/prototypes/gallery-app/page.tsx` | Shell + hash router + swipe logic; renders PlateView + Toast overlays |
| `app/prototypes/gallery-app/layout.tsx` | Token/style imports + metadata |
| `src/prototypes/gallery-app/gallery-app.css` | Prototype-wide globals (fonts, scrollbars, side-panel bits) |
| `src/prototypes/gallery-app/screens/*.tsx|css` | One file per screen |
| `src/prototypes/gallery-app/components/geometric-poster.*` | Exhibition poster (3 CSS compositions) |
| `src/prototypes/gallery-app/components/geometric-art.*` | Artwork plate — 12 generative percentage-based motifs |
| `src/prototypes/gallery-app/components/art-tile.*` | Grid tile: plate + diamond favourite + caption |
| `src/prototypes/gallery-app/components/plate-view.*` | Full-screen artwork plate with caption + colour chips |
| `src/prototypes/gallery-app/components/toast.*` | Bordered ink toast slab |
| `src/prototypes/gallery-app/components/bits.*` | SectionLabel, DiagonalDivider, TriadRule, IndexStrip, Segment, IconButton |
| `src/prototypes/gallery-app/components/bauhaus-switch.*` | Square on/off switch |
| `src/prototypes/gallery-app/lib/data.ts|types.ts` | Domain data: 3 exhibitions, 12 artworks, tickets, slot days |
| `src/prototypes/gallery-app/lib/usePersistentState.ts` | localStorage-backed useState |
| `src/prototypes/gallery-app/state/gallery-context.tsx` | Favourites (persisted) + detail/plate nav + toast |

## Bauhaus spec compliance

- Primary is RED everywhere (actions: BOOK, TICKETS, active nav, diamonds, dates); blue appears only as secondary accent/geometry; yellow as tertiary
- 2px ink borders (`--border-w` + `--color-outline`) on every tile, chip, button, input-free control, and divider
- Zero shadows (no `box-shadow` anywhere in the prototype), no gradients, no blur
- Near-square radius scale (`--r-xs`..`--r-xl`); chrome uses 0 radius; `--device-radius: 10px` via the style token layer
- Circle / quarter-circle motifs: masthead disc, row tick, address quarter, empty state, stamp, label tick
- Uppercase wide-tracked section labels; solid saturated triad blocks

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/gallery-app/
