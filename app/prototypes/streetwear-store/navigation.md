# streetwear-store — navigation

## What this prototype is

A neo-brutalist streetwear shopping app for the fictional "DROP 07" label.
Paper-white surfaces, 2px near-black borders, hard offset shadows (no
blur), zero border-radius everywhere, unapologetic yellow (#ffd23f) as the
primary action color and red for sale/remove. Three tabs (Shop, Cart,
Settings) plus a pushed product-detail view that the browser back button
closes. Cart state lives in the page shell and drives a live badge count
on the Cart nav label.

## Screens

| Screen | View id | Description |
|--------|---------|-------------|
| Shop        | `shop`        | Hero topbar "DROP 07", category chips (ALL/HOODIES/TEES/PANTS/ACC) filtering a 2-col product grid. Cards: 2px border, hard shadow, uppercase name, bold price, yellow ADD button. Tap card → detail. |
| Product     | `product{id}` | Pushed detail (no nav item): big geometric placeholder cover, size selector (S/M/L/XL), quantity stepper, huge ADD TO CART that sinks onto its shadow. Back button + browser back close it. |
| Cart        | `cart`        | Line items with qty steppers and red remove buttons, subtotal/shipping rows, inverted (primary-yellow) TOTAL row, big CHECKOUT with an "ORDER PLACED" confirmation state that empties the cart. |
| Settings    | `settings`    | Light/dark theme toggle (useDeviceTheme), drop-alerts switch, USD/EUR/GBP segmented control that instantly re-prices shop, cart and detail. |

## Interactions

- Category chip tap → filters the product grid (ALL/HOODIES/TEES/PANTS/ACC)
- Product card tap → opens the pushed detail view (`#product{id}`, pushState)
- Card ADD button → quick-adds the product in size M (stops propagation)
- Size selector S/M/L/XL → selected size gets primary-yellow fill
- Quantity stepper (detail + cart) → min 1, bordered square buttons
- ADD TO CART → merges into the cart line for that product+size, shows a brief "ADDED TO CART" state
- Cart qty stepper / REMOVE → updates totals and the "Cart (n)" nav badge live
- CHECKOUT → "ORDER PLACED" confirmation for ~1.8s, then the cart empties
- Theme LIGHT/DARK → scoped to the device, persisted as `streetwear-theme`
- Currency USD/EUR/GBP → all displayed prices convert via `lib/currency.ts`
- Swipe left/right (mouse drag) navigates between Shop/Cart/Settings; swipe right on detail closes it
- Every pressable surface sinks `translate(2px, 2px)` and drops its hard shadow

## Files

| File | What it is |
|------|------------|
| `app/prototypes/streetwear-store/layout.tsx` | Tokens + brutalism style layer imports, metadata |
| `app/prototypes/streetwear-store/page.tsx` | Shell + hash router + cart/currency state |
| `src/prototypes/streetwear-store/streetwear-store.css` | Prototype globals, stage-panel styles, scrollbar hiding |
| `src/prototypes/streetwear-store/lib/types.ts` | Product/Size/Category/CartItem types |
| `src/prototypes/streetwear-store/lib/data.ts` | Mock DROP 07 catalog |
| `src/prototypes/streetwear-store/lib/currency.ts` | USD/EUR/GBP conversion + formatting |
| `src/prototypes/streetwear-store/components/qty-stepper.tsx` | Square bordered quantity stepper |
| `src/prototypes/streetwear-store/components/brutal-switch.tsx` | Brutalist toggle switch |
| `src/prototypes/streetwear-store/screens/shop-screen.tsx` | Shop grid + chips (+ module.css) |
| `src/prototypes/streetwear-store/screens/product-screen.tsx` | Pushed product detail (+ module.css) |
| `src/prototypes/streetwear-store/screens/cart-screen.tsx` | Cart lines, totals, checkout (+ module.css) |
| `src/prototypes/streetwear-store/screens/settings-screen.tsx` | Theme/notifications/currency (+ module.css) |

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/streetwear-store/
