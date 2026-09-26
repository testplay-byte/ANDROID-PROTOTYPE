# gallery-app — navigation

## What this prototype is

A bauhaus gallery app built on proto-kit. Off-white paper, near-black ink,
and the primary triad (red #d5321f / blue #2b50c8 / yellow #f2b705) used as
SOLID geometric blocks — never gradients. Sharp corners, 2px ink borders, no
shadows, uppercase weight-900 headings. 4 screens, hard slab bottom nav,
hero top bar.

## Screens

| Screen      | View id       | Description |
|-------------|---------------|-------------|
| Exhibitions | `exhibitions` | 2 feature cards with pure CSS geometric posters (red disc, blue quarter-circle, yellow triangle/bar), dates + price + TICKETS button |
| Collection  | `collection`  | Filter chips (ALL / PAINTING / SCULPTURE / PRINT) + geometric art grid; tap toggles a favorite heart (filled/outline ink) |
| Visit       | `visit`       | Opening hours table (hairline rows), address block, ticket steppers with live total, BOOK → confirmation with a rotated geometric stamp |
| Settings    | `settings`    | Dark theme toggle (useDeviceTheme), guided-tours toggle, newsletter toggle — sharp-cornered bordered groups |

## Interactions

- TICKETS button toggles a booked/added state (red slab → outline)
- Filter chips re-filter the collection grid (sharp chips, active = ink fill)
- Tap an artwork to favorite it (heart pops, filled/outline)
- Adult / concession square steppers with live EUR total; BOOK disabled at 0
- BOOKED confirmation state with a geometric ADMITTED stamp; "book another" resets
- Dark theme toggle via `useDeviceTheme` (persisted to `gallery-theme`)
- Swipe left/right navigates between tabs; hash router

## Files

| File | What it is |
|------|------------|
| `app/prototypes/gallery-app/page.tsx` | Shell + hash router |
| `app/prototypes/gallery-app/layout.tsx` | Token/style imports + metadata |
| `src/prototypes/gallery-app/gallery-app.css` | Prototype-wide globals |
| `src/prototypes/gallery-app/screens/*.tsx` | One file per screen |
| `src/prototypes/gallery-app/components/*` | GeometricPoster, GeometricArt, BauhausSwitch |
| `src/prototypes/gallery-app/lib/*` | Types + exhibitions/artworks data |

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/gallery-app/
