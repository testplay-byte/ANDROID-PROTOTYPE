# ruckus — navigation

## What this prototype is

**"Ruckus"** — a DIY live-music gig guide in **Neo-brutalism**, the second
brutalism demo after streetwear-store (a *different app, same language*).
0px radius everywhere, 2-3px ink borders carrying all structure, hard
zero-blur offset shadows, inset pressed states, Arial Black poster type,
marquee tickers, rotated sticker badges, and flat yellow / orange-red
blocks. `style="brutalism"` gives the device square corners too.

## Screens

| Screen | View id | Contents |
|--------|---------|----------|
| Gigs | `#gigs` | Yellow poster hero, looping marquee ticker, genre filter chips, tonight's lineup as **numbered poster rows** (01/02/…, band, venue·time·day, price block or SOLD OUT sticker). Tap a row → pushed detail. |
| Gig detail | (pushed) | Own back slab + crumb, poster with generative cover, three ink fact slabs (venue / time / capacity+distance), **GET TICKETS** primary CTA visible without scrolling → buys a stub ticket (persisted) + toast, follow toggle, "more dates" list. |
| Bands | `#bands` | 2-col grid, generative geometric cover art (solid blocks + one circle motif chosen by the band's `motif` index — no gradients), follower counts, follow toggles (persisted, followed sort first), tap card → that band's next gig. |
| Venues | `#rooms` | Room list with a **segmented capacity meter** (8 hard blocks — "loudness"), distance, note, and mini date tags that open the gig. |
| Me | `#me` | **Ticket wallet** — perforated stubs (dashed perforation column, №serial), empty state, alert switches (persisted), Dark/Light segmented, about → toast. |

## Interactions

- Genre chips filter the lineup; ticker reflects the current count.
- GET TICKETS → ticket stub in the wallet + count updates everywhere (persisted).
- Follow bands (persisted) → sorting + follower counts on the band card.
- Every pressable: 2-4px translate + inset shadow (90ms steps — no bounce).
- Marquee loops; staggered 140ms `steps()` entrances per view; hover lift on desktop.
- `prefers-reduced-motion` kill-block (marquee included). Inline SVG only, no emoji.
- Toast: one line, 92% max width, nowrap (never wraps to an orphan word).
- Swipe between tabs; right-swipe closes the pushed gig first. Hash routes: #gigs #bands #venues #me.

## Files

| File | What it is |
|------|------------|
| `app/prototypes/ruckus/layout.tsx` | tokens.css → styles/index.css → ruckus.css; metadata. |
| `app/prototypes/ruckus/page.tsx` | Shell: DeviceThemeProvider(`ruckus-theme`) → RuckusProvider → Stage panels → DeviceFrame(`style="brutalism"`) → `.rk` root (hash router, pushed detail, toast, `<BottomNav variant="hard">`, swipe). |
| `src/prototypes/ruckus/ruckus.css` | The whole style: 0 radius, ink borders, hard shadows, poster/marquee/banner/sticker, rows, generative cover, detail slabs, venue meter, wallet stubs, switch/seg, toast. |
| `src/prototypes/ruckus/lib/data.ts` | 8 bands (genre, tone, motif, followers), 5 venues, ~10 gigs across 4 nights. |
| `src/prototypes/ruckus/state/ruckus-context.tsx` | RuckusProvider: tickets (with serial), follows, prefs — all persisted `ruckus-*`; toast channel. |
| `src/prototypes/ruckus/components/` | `marquee.tsx` (looping ticker), `cover.tsx` (generative cover), `chrome.tsx` (Banner / Sticker / Toast / Switch), `icons.tsx`. |
| `src/prototypes/ruckus/screens/` | `gigs-screen`, `gig-detail`, `bands-screen`, `venues-screen`, `me-screen`. |

## Non-obvious decisions

- **Solid art, not gradients** — the brutalism style forbids gradients, so
  covers are flat token-color blocks with a bar-stack + one circle motif.
- **The detail CTA never scrolls out of view** — buying a ticket must be
  reachable without scrolling (failure mode #7).
- **Ticket serials are generated once at purchase** and persisted, so a
  stub keeps its № across reloads.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/ruckus/
