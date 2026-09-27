# Streetwear Store — prototype

Neo-brutalist streetwear shop for the fictional "DROP 07" label: thick
2-3px ink borders, hard offset shadows, zero radius, yellow/orange-red
flat blocks, an infinite marquee ticker and poster-style composition.

- **Style:** Brutalism (`--border-w` 2-3px + `--shadow-1/2` hard offsets + `--shadow-inset` on every press, radius 0, uppercase display headings).
- **Screens (4):** Shop, Product detail (pushed), Cart, Settings. Chrome varies per screen: hero TopBar + ticker on Shop, slab headers on Cart/Settings, `hard` BottomNav.
- **Key interactions:** category/SAVED chip filtering, numbered grid with favorites, quick-add + detail add-to-cart (colorway/size/qty, sold-out sizes), live "Cart (n)" nav badge, free-shipping progress, promo codes with the on-screen keyboard, checkout confirmation, toasts, light/dark theme, USD/EUR/GBP re-pricing — all persisted in localStorage (`streetwear-*`).

Live: https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/streetwear-store/
