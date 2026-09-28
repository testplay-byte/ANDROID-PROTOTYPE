# public/prototypes/navigation.md

> Index of prototype routes. Prototypes live in `app/prototypes/<name>/`
> (Next.js routes) + `src/prototypes/<name>/` (screens/components/lib).
> The `public/prototypes/` folder only holds legacy static files served verbatim.
> The dashboard gallery (`app/page.tsx` via `src/dashboard/gallery.tsx`) is the
> visual index — add every new prototype there too.

---

## Active Next.js prototypes (by design language)

| Route | Name | Style | Status | Screens |
|-------|------|-------|--------|---------|
| `/prototypes/bloom/` | Bloom | m3 | review | 4 |
| `/prototypes/anime-app/` | Anime App | m3 | review | 6 |
| `/prototypes/setup-wizard/` | Setup Wizard | m3 | review | 8 |
| `/prototypes/music-player/` | Music Player | neumorph | review | 4 |
| `/prototypes/still/` | Still | neumorph | review | 4 |
| `/prototypes/drift/` | Drift | glass | review | 4 |
| `/prototypes/weather-app/` | Weather App | glass | review | 4 |
| `/prototypes/streetwear-store/` | Streetwear Store | brutalism | review | 3 + detail |
| `/prototypes/ruckus/` | Ruckus | brutalism | review | 4 + detail |
| `/prototypes/finance-hub/` | Finance Hub | carbon | review | 4 |
| `/prototypes/pulse/` | Pulse | carbon | review | 4 |
| `/prototypes/smart-home/` | Smart Home | bento | review | 4 |
| `/prototypes/atlas/` | Atlas | bento | review | 4 |
| `/prototypes/fitness-tracker/` | Fitness Tracker | hig | review | 4 |
| `/prototypes/wallet/` | Wallet | hig (iOS 26/27 Liquid Glass) | review | 4 |
| `/prototypes/kids-learning/` | Kids Learning | clay | review | 4 |
| `/prototypes/simmer/` | Simmer | clay | review | 4 + detail |
| `/prototypes/chat-app/` | Chat App | flat | review | 3 + detail |
| `/prototypes/hop/` | Hop | flat | review | 4 + menu |
| `/prototypes/habit-tracker/` | Habit Tracker | minimal | review | 4 |
| `/prototypes/nook/` | Nook | minimal | review | 4 |
| `/prototypes/gallery-app/` | Gallery App | bauhaus | review | 4 |
| `/prototypes/linie/` | Linie | bauhaus | review | 4 |

All 11 design languages are supported by the style system (`src/proto-kit/styles/`) —
see `docs/style-selection-guide.md` and `docs/design-languages/`.

## Legacy

The old static HTML prototypes (`_template/`, static search-page) were removed
from `public/` on 2026-09-27. Pre-Next.js snapshots live in `archive/legacy/`.

---

*Last updated: 2026-09-28 — batch 3: added Nook (minimal), Atlas (bento), Hop (flat); batch 2: Still, Pulse, Simmer; batch 1: Drift + streetwear/gallery reworks.*
