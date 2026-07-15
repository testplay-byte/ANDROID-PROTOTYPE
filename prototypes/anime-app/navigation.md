# prototypes/anime-app/navigation.md

> A fully interactive anime discovery & streaming app prototype with real AniList data.

---

## What this is

A mobile anime streaming/discovery app UI with 7 screens, using real data from the AniList GraphQL API (cover images, titles, scores, descriptions, genres). Includes a mock video player with full controls. Built on the v6 template architecture (scoped theming, click-drag scroll, fullscreen API).

**Live:** https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/anime-app/

---

## Screens (7 total)

| Screen | View name | Nav type | Description |
|--------|-----------|----------|-------------|
| Home | `home` | Bottom nav | Hero carousel (auto-rotating), continue watching, trending, seasonal, top rated |
| Library | `library` | Bottom nav | Saved anime by status (watching/completed/plan/dropped), grid/list/compact views, sortable |
| History | `history` | Bottom nav | Recently watched episodes with progress bars, clear history |
| Search | `search` | Bottom nav | Debounced AniList search with genre/year/season/format/sort filters |
| Settings | `settings` | Bottom nav | Theme, accent color, player, library, playback, data — all persist and apply |
| Detail | `detail` | Pushed | Cover, banner, title, score, genres, synopsis (expandable), episode list |
| Player | `player` | Pushed | Mock video player with controls (play/pause, seek, skip intro, prev/next ep, fullscreen) + episode list |

---

## Data source

- **API:** AniList GraphQL (`https://graphql.anilist.co`) — public, CORS-enabled, no auth
- **Covers:** Real AniList cover/banner images
- **Streaming:** Mock (blank player with poster + controls, no real video)
- **Library/History:** localStorage (mock user data)
- **Settings:** localStorage (applied on load + on change)

---

## Files

| File | What it is |
|------|------------|
| `index.html` | 7 screens: Home, Library, History, Search, Settings, Detail, Player + bottom nav + side panels |
| `styles.css` | Dark anime theme (pink `#e85d75` accent), all components (hero, cards, grids, tabs, filters, player, settings) |
| `script.js` | AniList API integration, view routing with back stack, settings persistence, library, history, search filters, player controls |
| `navigation.md` | This file |
| `README.md` | Short description |
| `PLAN.md` | Design plan (screen layout, color scheme, data flow) |

---

## Key features

- **Real AniList data:** trending, seasonal, top-rated, search, detail — all live from the API
- **7 navigable screens** with a back stack (detail/player are pushed views)
- **Library customization:** grid/list/compact views, sort by title/score/date, status tabs
- **Search filters:** genre (multi-select chips), year, season, format, sort — all functional
- **Settings that apply:** theme (dark/light), accent color (5 options), player prefs, library defaults, data clearing — all persisted in localStorage
- **Video player:** play/pause, seek bar, skip intro, prev/next episode, fullscreen, auto-progress simulation
- **Scoped theming:** dark mode toggle affects only the device, not the page (see `docs/theme-architecture.md`)
- **Click-drag-to-scroll** on desktop, **fullscreen API** on mobile

---

## Design language

- **Theme:** Dark-first (`#0d0c11` bg, `#18161e` surface)
- **Accent:** Sakura pink `#e85d75` (with 5 swappable accent colors in settings)
- **Secondary:** Amber `#f4a261` (scores), Teal `#06d6a0` (success)
- **Cards:** Rounded 10px, cover-image-dominant, score badge overlay
- **No blue/indigo** — warm anime-inspired palette

---

*Created: anime-app v1.0. Real data from AniList.*
