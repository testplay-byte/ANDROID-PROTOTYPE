# streetwear-store — navigation

## What this prototype is

A neo-brutalist streetwear shopping app for the fictional "DROP 07" label.
Paper-white surfaces, 2-3px near-black ink borders, hard offset shadows
(zero blur), zero border-radius everywhere (including the device frame),
unapologetic yellow (#ffd23f) as the primary action color and orange-red
(#f0513d) for sale/secondary/danger blocks. An infinite marquee ticker is
the signature strip. Three tabs (Shop, Cart, Settings) plus a pushed
product-detail view that the browser back button closes. Cart, favorites,
currency, default size and drop-alerts all persist to localStorage
(`streetwear-*` keys; theme is `streetwear-theme`).

Chrome varies per screen by design: Shop wears the proto-kit hero TopBar +
yellow marquee; Cart and Settings use their own brutalist slab headers
(no TopBar) so the app reads as poster bands, not one repeated title bar.
BottomNav is the proto-kit `hard` variant; the Cart badge count is live
("Cart (3)").

## Screens

| Screen | View id | Description |
|--------|---------|-------------|
| Shop        | `shop`        | Hero topbar "DROP 07" with a SAVED heart button → marquee ticker → yellow featured-poster block with rotated sticker → category chips (ALL/HOODIES/TEES/PANTS/ACC) + a SAVED chip → numbered section banner ("02 HOODIES · 6 STK") → 2-col grid. Cards: 2px border, hard shadow, numbered stencil, heart favorite, rotated sticker badges, SOLD OUT diagonal band on one piece. Tap card → detail; ADD → quick-add in the default size. |
| Product     | `product{id}` | Pushed detail (no nav item): big 4:3 cover with colorway swaps + rotated sticker, oversized display name, price + SKU, description block, colorway picker (2-3 swatches), size grid with sold-out strikes, QTY stepper + ADD TO CART (toast + button state), spec table, related-pieces strip that swaps the detail in place. Back button + browser back close it. |
| Cart        | `cart`        | Yellow slab header (live count + KEEP SHOPPING) → paper marquee → free-shipping progress bar (striped fill, unlocks over $150) → numbered line items with swatch, qty stepper, red X remove → promo input (proto-kit custom keyboard; codes BRUTAL10 −10%, DROP07 −20%) → subtotal/discount/shipping rows + inverted yellow TOTAL slab → CHECKOUT with an "ORDER PLACED" confirmation state that empties the cart. Empty state is a poster block with a GO SHOP CTA. |
| Settings    | `settings`    | Slab header (underlined display title + rotated v1.1 sticker) → 3-cell stats strip (saved / in cart / my size) → APPEARANCE theme LIGHT/DARK → SHOPPING group: drop-alerts switch, default size S/M/L/XL, currency USD/EUR/GBP segmented controls → DATA: two-tap RESET (saved + cart + prefs) → about block with red spine. |

## Interactions

- Marquee ticker: seamless CSS loop (paused under prefers-reduced-motion)
- Category / SAVED chip tap → filters the product grid; banner shows the count
- Heart on a card or the detail header → toggles favorite, persisted (`streetwear-favorites`)
- Product card tap → opens the pushed detail view (`#product{id}`, pushState)
- Card ADD → quick-adds in the default size (or first available), toasts "+1 … → CART"
- Detail colorway picker → swaps the cover tone; size grid disables sold-out sizes
- ADD TO CART → merges into the cart line for that product+size+colorway,
  toasts, and shows a brief "ADDED" state
- Related strip → opens another product in the same pushed view
- Cart qty stepper / X remove → updates totals and the "Cart (n)" nav badge live
- Free-shipping bar fills as the subtotal approaches $150 (shipping waived)
- PROMOCODE input uses the proto-kit on-screen keyboard; APPLY validates,
  applied codes become a removable rotated chip; discount row appears in totals
- CHECKOUT → "ORDER PLACED" confirmation for ~1.8s, then the cart empties (+ toast)
- Theme LIGHT/DARK → scoped to the device, persisted as `streetwear-theme`
- Currency USD/EUR/GBP → persisted (`streetwear-currency`), re-prices the whole store
- Default size persisted (`streetwear-size`) — drives card quick-add + detail preselect
- Drop alerts toggle persisted (`streetwear-alerts`)
- RESET → danger button arms ("SURE?") within 2.5s; wipes cart, favorites, prefs
- Swipe left/right (mouse drag) navigates between Shop/Cart/Settings; swipe right on detail closes it
- Every pressable surface sinks 2-4px, drops its offset shadow and gets the
  hard `--shadow-inset` on `:active`

## Files

| File | What it is |
|------|------------|
| `app/prototypes/streetwear-store/layout.tsx` | Tokens + brutalism style layer imports, metadata |
| `app/prototypes/streetwear-store/page.tsx` | Shell + hash router + persisted cart/favorites/currency/size state + toast layer + Keyboard |
| `src/prototypes/streetwear-store/streetwear-store.css` | Prototype globals, display-font token, stage-panel styles, scrollbar hiding |
| `src/prototypes/streetwear-store/lib/types.ts` | Product/Size/Category/CartItem/CoverTone types |
| `src/prototypes/streetwear-store/lib/data.ts` | Mock DROP 07 catalog (descriptions, colorways, specs, sold-out) + TICKER |
| `src/prototypes/streetwear-store/lib/currency.ts` | USD/EUR/GBP conversion + formatting |
| `src/prototypes/streetwear-store/components/marquee.tsx` | Infinite ticker strip (ink/paper/flame variants) |
| `src/prototypes/streetwear-store/components/toast.tsx` | Hard-shadow toast slab above the nav |
| `src/prototypes/streetwear-store/components/cover.tsx` | Shared flat-tone cover art + geometric HeartIcon |
| `src/prototypes/streetwear-store/components/qty-stepper.tsx` | Square bordered quantity stepper (min/max) |
| `src/prototypes/streetwear-store/components/brutal-switch.tsx` | Brutalist toggle switch |
| `src/prototypes/streetwear-store/screens/shop-screen.tsx` | Ticker, featured poster, chips, numbered grid (+ module.css) |
| `src/prototypes/streetwear-store/screens/product-screen.tsx` | Pushed product detail (+ module.css) |
| `src/prototypes/streetwear-store/screens/cart-screen.tsx` | Slab header, lines, promo, totals, checkout (+ module.css) |
| `src/prototypes/streetwear-store/screens/settings-screen.tsx` | Stats, theme/alerts/size/currency, reset (+ module.css) |

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/streetwear-store/
