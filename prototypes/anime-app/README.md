# Anime App (v1.0)

A mobile anime discovery & streaming app prototype with real AniList data. 7 fully interactive screens.

## What's inside

- **7 screens:** Home, Library, History, Search, Settings, Detail (pushed), Player (pushed)
- **Real AniList data:** trending, seasonal, top-rated anime, search with filters, full detail pages
- **Mock video player:** play/pause, seek, skip intro, prev/next episode, fullscreen
- **Library customization:** grid/list/compact views, sort, status tabs (watching/completed/plan/dropped)
- **Search filters:** genre, year, season, format, sort — all functional
- **Fully functional settings:** theme, accent color (5 options), player prefs, library defaults, data management — all persisted in localStorage
- **Dark anime theme:** sakura pink `#e85d75` accent on deep charcoal
- Scoped theming, click-drag scroll, mobile fullscreen API

## Files

- `index.html` — 7 screens + bottom nav + side panels
- `styles.css` — dark anime theme + all components
- `script.js` — AniList API, routing, settings, library, history, search, player
- `navigation.md` — detailed folder index
- `PLAN.md` — design plan

## Live preview

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/anime-app/

## Data source

[AniList GraphQL API](https://graphql.anilist.co) — public, CORS-enabled, no auth required.
