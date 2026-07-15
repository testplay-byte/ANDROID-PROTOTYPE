# Anime App Prototype — Design Plan

## Overview
A mobile anime streaming/discovery app with 7 screens, using real AniList data.

## Design Language
- **Theme:** Dark-first (deep charcoal with warm tint)
- **Accent:** Sakura pink-red `#e85d75` (energetic, anime-inspired, no blue/indigo)
- **Secondary accents:** Amber `#f4a261` (scores), Teal `#06d6a0` (success/progress)
- **Page background:** Dark neutral (overridden from template's cream for this prototype)
- **Typography:** System font stack, bold headings
- **Cards:** Rounded 12px, subtle borders, cover-image-dominant

## Screens

### 1. Home
- Hero carousel: top 5 trending (auto-rotating, large cover + title + "Watch")
- Continue Watching row (from localStorage): horizontal cards w/ progress bar
- Trending Now grid (2-col mobile)
- Popular This Season grid
- Top Rated grid
- Each card: cover image, title (2-line clamp), score badge, episode count

### 2. Library
- Tabs: All / Watching / Completed / Plan to Watch / Dropped
- Toolbar: sort dropdown, view toggle (grid/list/compact), filter
- Grid or list of saved anime (localStorage)
- Empty state with CTA
- Layout preference persists in settings

### 3. History
- Continue Watching section (horizontal, with progress)
- Full history list (vertical): thumbnail, title, ep number, progress, timestamp
- Clear history button

### 4. Search
- Search bar (sticky)
- Collapsible filter panel: genres, year, season, format, status, sort
- Results grid with loading + empty states
- Debounced search

### 5. Settings
- Appearance: theme (dark/light), accent color picker
- Video: autoplay, skip intro, default quality
- Library: default layout, default sort
- Playback: track history, continue watching
- Data: clear history, clear cache
- All settings PERSIST and APPLY

### 6. Detail Page (pushed, not in bottom nav)
- Back button + title
- Banner cover image
- Title (romaji + english), score, status, episodes, studio, season/year
- Genre chips
- Synopsis (expandable)
- Add to Library button (toggles status)
- Episode list (clickable → player)

### 7. Player Page (pushed)
- Video area: 16:9 black with poster, custom controls overlay
- Controls: play/pause, seekbar, time, volume, fullscreen, skip intro, next ep
- Episode list below (current highlighted)
- Tap to show/hide controls

## Data Flow
- AniList GraphQL API (`https://graphql.anilist.co`) — CORS-enabled, no auth needed
- Home: fetch trending, popular this season, top rated on load
- Search: debounced queries with filters
- Detail: fetch by anime ID (or use cached data from list)
- Library/History: localStorage (mock user data)
- Settings: localStorage (applied on load + on change)

## Bottom Navigation
Home | Library | History | Search | Settings (5 tabs)
Detail and Player are pushed views (accessed via anime clicks)
