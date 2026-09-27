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
| `/prototypes/_template/` | Starter Template | m3 (legacy static) | reference | 4 |
| `/prototypes/search-page/` | Search Page | m3 | approved | 2 |
| `/prototypes/anime-app/` | Anime App | m3 | review | 6 |
| `/prototypes/setup-wizard/` | Setup Wizard | m3 | review | 8 |
| `/prototypes/music-player/` | Music Player | neumorph | review | 4 |
| `/prototypes/weather-app/` | Weather App | glass | review | 4 |
| `/prototypes/streetwear-store/` | Streetwear Store | brutalism | review | 3 + detail |
| `/prototypes/finance-hub/` | Finance Hub | carbon | review | 4 |
| `/prototypes/smart-home/` | Smart Home | bento | review | 4 |
| `/prototypes/fitness-tracker/` | Fitness Tracker | hig | review | 4 |
| `/prototypes/wallet/` | Wallet | hig (iOS 26/27 Liquid Glass) | review | 4 |
| `/prototypes/kids-learning/` | Kids Learning | clay | review | 4 |
| `/prototypes/chat-app/` | Chat App | flat | review | 3 + detail |
| `/prototypes/habit-tracker/` | Habit Tracker | minimal | review | 4 |
| `/prototypes/gallery-app/` | Gallery App | bauhaus | review | 4 |

All 11 design languages are supported by the style system (`src/proto-kit/styles/`) —
see `docs/style-selection-guide.md` and `docs/design-languages/`.

## Legacy (served from public/)

| Folder | What |
|--------|------|
| `_template/` | Old static HTML starter template. Linked from the dashboard but NOT the primary starting point — use `src/proto-kit/` + the search-page pattern instead. |

Old static versions of search-page + anime-app are in `archive/legacy/`.

---

*Last updated: 2026-09-27 — added Wallet (hig · iOS 26/27 Liquid Glass).*
