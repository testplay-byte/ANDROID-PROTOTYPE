# hop — navigation

## What this prototype is

**"Hop"** — a food-delivery app built in **Flat Design 2.0**
(`<DeviceFrame style="flat">`): bold 2D solid colour blocks, edge-to-edge
planes, ZERO shadows, zero gradients, no outlines — depth comes only from
surface tiers and hue contrast. Every "photo" is a data-driven inline SVG
flat illustration (`food-art.tsx`: pizza/sushi/salad/brew silhouettes painted
with per-cuisine palettes). The chrome signature is the custom **edge-to-edge
TabBar** — four solid segments with hairline bg gaps where the ACTIVE segment
is an inverted colour block (no pills, no indicator line, no floating bar).
Motion is fast and honest (100–200ms colour swaps, translate-only cart fly);
`prefers-reduced-motion` kills it all.

## Screens

| Screen  | View id       | Contents |
|---------|---------------|----------|
| Home    | `#home`       | Opens ON a full-bleed cuisine colour plane — flat food art, headline copy and an "Order {kitchen}" CTA; four tiny squares swap the hero's cuisine (colour swap, not a fade). Category strip = four solid cuisine squares; "Back by demand" rows (flat thumb, solid rating chip, time, heart-square favourite that inverts coral); rotating promo plane with pips. |
| Search  | `#search`     | Big flat search block (proto-kit custom keyboard, `inputMode="none"`), cuisine colour-grid filter tiles (active = solid hue plane, inactive = surface tier with a swatch), two-tone split result blocks — art half on the cuisine colour, info half on surface-1. Menu-item names are searchable. Empty state block when nothing matches. |
| Menu    | `#menu<id>`   | Pushed restaurant (browser back / swipe-right closes it). Flat header plane (back + heart knocked out of the colour), 1px-icon delivery strip (ETA / fee / distance), menu rows with square thumbnails + "popular" amber chip. Tapping the square **+** quick-adds — a coral square flies to the tab-bar Orders slot (`flyToCart`, translate-only) and the count pops; items with options open the **item sheet** (square toggles, selected = inverted cuisine colour). Cart dock appears above the tab bar when this kitchen is in the cart. |
| Orders  | `#orders`     | Live tracker: restaurant + ETA head, a **1px rail with a coral dot** travelling Confirmed → Cooking → On the way (context ticker advances stage every `STAGE_MS=9s`; dot/fill use 1s linear transitions), three stepper blocks that colour-swap (primary-container done → primary current → surface-2 pending), line summary + total. Past orders as blocks with **Reorder** (refills cart + opens sheet). Empty state before the first order. |
| Account | `#account`    | Teal identity plane (initials square, live order count), address cards (tap = default, persisted), payment blocks with square radios, **Dark/Light segmented control** (persisted `hop-theme`, scoped to `.device`), notification switches (square knob slides, colour swap). |
| Cart    | sheet on `#orders` (opens from any view) | `hp-cart` bottom sheet from context `cartOpen`: line rows with square − qty + steppers (qty re-pops on change), per-line options, solid primary-container subtotal footer with fee-free hint, **Place order** (disabled when empty) starts the live tracker. |

## Interactions

- **Fly-to-cart** — `flyToCart()` (context) drops a fixed 14px coral square at
  the tapped button and translates it to `[data-hop-cart-slot]` (the Orders
  tab segment); removed after 320ms. Skips itself under reduced motion.
- **Tab badge** — the Orders segment shows a solid coral count square that
  pops (`key={bump}` re-mount) on every add; when the cart is empty but an
  order is live it shows a blinking square instead.
- **Item sheet** — scrim tap / Close dismiss; square option toggles flip the
  row's whole colour plane (cuisine colour, fg knocked out) — never a check
  floating in space. Add composes the toast + fly.
- **Live ticker** — HopProvider advances `liveOrder.stage` from wall-clock
  elapsed time every second; after the last stage + 4s the order archives to
  Past and a toast announces arrival.
- **Reorder** — clones an order's lines into the cart and opens the sheet.
- **Stagger** — views remount via `key={view}`; rows rise 10px over 180ms
  with 40–45ms per-index delays.
- **Swipe** — `useSwipeSimulation`: horizontal drag navigates the four tabs;
  swipe right on a menu push = back (matches chat-app's convention).
- **Theme** — segmented control on Account flips `.device[data-theme]` only
  (page never darkens), persisted `hop-theme`; prefs (defaults, payments,
  switches, favourites) persist under `hop-prefs`.

## Files

| File | What it is |
|------|------------|
| `app/prototypes/hop/layout.tsx` | Imports tokens.css + styles/index.css + `hop.css`; metadata "Hop — ANDROID-PROTOTYPE". |
| `app/prototypes/hop/page.tsx` | Client shell: DeviceThemeProvider (`hop-theme`, initial dark) → KeyboardProvider → HopProvider → Stage panels → DeviceFrame (`style="flat"`) → `.hp` root (hash views keyed, TabBar, ItemSheet, CartSheet, Toast, `<Keyboard/>`); swipe wiring; side-panel MiniBar/kvlist helpers. |
| `src/prototypes/hop/hop.css` | ONE stylesheet, everything scoped under `.hp` (plus `body`/stage-panel helpers): tab bar, hero/cats/promo, search splits, menu push, tracker rail + steps, cart/item sheets, account planes/switches, keyframes, reduced-motion block. Zero `box-shadow`, zero gradients. |
| `src/prototypes/hop/lib/data.ts` | Cuisines (colours + art palettes), 8 restaurants, 8 menus with option sets, order stages (`STAGE_MS`), addresses, promos, `money/ratingColor` helpers. |
| `src/prototypes/hop/state/hop-context.tsx` | Central provider: cart lines keyed by item+options, order ticker + archive, sheet target, favourites/addresses/prefs (`hop-prefs` persisted), toast, bump counter, `flyToCart`. |
| `src/prototypes/hop/components/tab-bar.tsx` | The chrome signature — edge-to-edge solid segments, inverted active block, cart count/pulse slots. |
| `src/prototypes/hop/components/{food-art,icons,item-sheet,toast}.tsx` | Flat SVG food silhouettes; 22×22 line icon set (no emoji); item detail sheet with square toggles; solid toast plane. |
| `src/prototypes/hop/screens/*.tsx` | `home-screen`, `search-screen`, `menu-screen`, `orders-screen` (+ `CartSheet` export), `account-screen`. |

## Non-obvious decisions (for future agents)

- **Custom TabBar instead of proto-kit `<BottomNav>`.** The user mandate
  forbids large-title + floating-pill chrome here; flat's native vocabulary
  is the full-width segmented bar, and Hop's "active = inverted solid block"
  is not something BottomNav variants express. The `hp-*` classes are
  Hop-only — no cross-prototype style bleed.
- **Two small fixes to the first-pass screens** (this build): the dead
  `{"delivery" in r ? "" : ""}` expression in `search-screen.tsx` was
  replaced by a real `hp-split__fee` span, and the nonsensical
  `Delivery from {money(0)}` copy in `home-screen.tsx` now reads "Free
  delivery over $25". `money` remains used in both files (no lint break).
- **Cart is a context-owned sheet, not a tab.** `cartOpen` lives in
  HopProvider so the dock on Menu, the tab badge, and Reorder can all open
  the same surface; Orders shows the *tracker*, keeping "Orders" honest as
  delivery status.
- **Dividers**: exactly one hairline in the whole app (`hp-track__foot`)
  using `--color-outline-variant`, per flat.md's allowance; everything else
  separates via 2px bg-bleed gaps or surface-tier steps.
- **`rgba(0,0,0,.18)` header buttons** are tone-of-plane, not elevation —
  flat.md permits contrast-based emphasis; no alpha is used for shadow.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/hop/
