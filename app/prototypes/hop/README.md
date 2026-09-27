# Hop (Flat Design 2.0 · food delivery)

A food-delivery app prototype in **Flat Design 2.0** — solid cuisine colour
planes, edge-to-edge inverted tab segments, ZERO shadows and gradients.
Every food image is a data-driven inline SVG flat illustration (bowl/disc/
leaf/cup silhouettes per cuisine palette). Home hero, cuisine filters, menu
pushes with flying-square cart adds, a live order tracker (coral dot
travelling a 1px rail), block-stepper cart sheet, and persisted
addresses/payments/theme.

**Style:** Flat 2.0. `DeviceFrame style="flat"`, `DeviceThemeProvider
storageKey="hop-theme"`, initial dark — theme scoped to `.device`.

## Screens

1. **Home** (`#home`) — full-bleed cuisine hero plane + category squares +
   "back by demand" rows + rotating promo plane.
2. **Search** (`#search`) — flat search block (custom keyboard), cuisine
   colour-grid filter, two-tone split results.
3. **Menu** (`#menu<id>`, pushed) — colour header plane, delivery strip,
   quick-add +/item sheet with square option toggles, cart dock.
4. **Orders** (`#orders`) — live stepper tracker + past orders with
   Reorder; cart sheet checkout (Place order starts the tracker).
5. **Account** (`#account`) — identity plane, address cards, payment
   blocks, Dark/Light segmented theme, notification switches.

## Notes for agents

See `navigation.md` in this folder — especially the custom TabBar rationale
(no floating pill in flat chrome), the context-owned cart sheet, and the
single-hairline divider rule.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/hop/
