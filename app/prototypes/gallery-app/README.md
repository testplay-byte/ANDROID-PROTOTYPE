# Gallery App (Bauhaus)

A geometric-modernist art-gallery prototype built on proto-kit with the
**Bauhaus** design language: the red/blue/yellow triad as solid blocks,
2px ink borders on every box, zero shadows, near-square corners,
uppercase weight-900 headings, circle/quarter-circle motifs. All artwork
is generative pure CSS — zero bitmaps.

## Screens (4 tabs)

1. **Exhibitions** — hero TopBar ("GALLERY" / "Weimar — Dessau — Berlin"),
   numbered list (01/02/03) with CSS mini-posters, triad colour-study grid;
   tap pushes a detail screen (poster, blurb, facts, TICKETS, hung works)
2. **Collection** — chrome experiment: a bordered segmented index strip
   replaces the top bar and filters GEMÄLDE / PLASTIK / GRAFIK;
   favourites-only mode; persisted diamond-favourites; plate tiles open a
   full-screen **PlateView** (museum mat, caption, triad colour chips)
3. **Visit** — hours ledger, address motif block, date + time-slot chips,
   square ticket steppers, hard summary slab, BOOK → ADMITTED stamp + toast
4. **Settings** — HELL/DUNKEL segmented theme (persisted, device-scoped),
   square switches with toasts, collection ledger

## Interactions

Detail push / plate overlay (swipe-right closes overlays before tabs),
colour chips re-ink plates live, favourites persist to localStorage,
toasts on every action, live booking total, swipe/hash navigation.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/gallery-app/
