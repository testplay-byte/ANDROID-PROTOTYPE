# music-player — navigation

## What this prototype is

A neumorphism (soft UI) music player. Every surface is shaped by dual
extruded/carved shadows on a single warm background — no hard borders,
one primary accent. Four screens (Player, Library, Playlists, Settings)
driven by a shared simulated playback engine in `page.tsx`: current
track, play/pause with a 1s progress timer, shuffle/repeat, likes.

## Screens

| Screen    | View id     | Description |
|-----------|-------------|-------------|
| Player    | `player`    | Now playing — spinning album art in an extruded ring, track meta + like, inset seekable progress groove, transport row (shuffle / prev / play / next / repeat). |
| Library   | `library`   | All 8 tracks as soft rows. Tap a row to load + play it; the current track shows an animated equalizer glyph and an inset (carved) row. |
| Playlists | `playlists` | 2-column grid of puffy playlist cards with gradient covers; tapping a card starts playback of a stand-in track. |
| Settings  | `settings`  | Theme segmented toggle (light/dark, persisted via `useDeviceTheme`), Gapless + Crossfade NeuSwitches (carved off / extruded on), About card. |

## Interactions

- Play/pause — big extruded button, turns inset (pressed) while playing; simulated progress timer advances every second.
- Seek — click/drag on the inset progress groove sets the position.
- Next/prev — prev restarts the track when more than 4s in.
- Shuffle — toggles random track selection; repeat cycles off → all → one (track end auto-advances accordingly).
- Like — heart toggle on the Player and per-row in Library (shared state).
- Song selection — tapping a Library row or Playlist card switches the shared current track and starts playback.
- Theme — Settings segmented control switches the device theme (persisted to localStorage).
- Swipe — horizontal drag on the device navigates between the 4 tabs (proto-kit `useSwipeSimulation`).
- Stagger — card/row lists animate in with a 40ms per-item delay.

## Files

| File | What it is |
|------|------------|
| `app/prototypes/music-player/layout.tsx` | Imports tokens.css + styles/index.css + prototype CSS |
| `app/prototypes/music-player/page.tsx` | Shell + hash router + shared player state + playback timer |
| `src/prototypes/music-player/music-player.css` | Prototype-wide globals (view transition, stagger, scrollbar hiding) |
| `src/prototypes/music-player/lib/data.ts` | Track/Playlist types, mock data, next/prev + formatTime helpers |
| `src/prototypes/music-player/components/icons.tsx` | Inline SVG icon set (stroke=currentColor) |
| `src/prototypes/music-player/components/neu-switch.tsx` + `.module.css` | Neumorphic toggle switch |
| `src/prototypes/music-player/screens/player-screen.tsx` + `.module.css` | Player screen |
| `src/prototypes/music-player/screens/library-screen.tsx` + `.module.css` | Library screen |
| `src/prototypes/music-player/screens/playlists-screen.tsx` + `.module.css` | Playlists screen |
| `src/prototypes/music-player/screens/settings-screen.tsx` + `.module.css` | Settings screen |

## Style rules honored

- Raised elements: `--shadow-1` / `--shadow-2` only (no borders).
- Pressed/active elements: `--shadow-inset`.
- Surfaces: `--color-bg` / `--color-surface-*` (same family, no borders).
- Tokens only for spacing/radius/type/motion; inline SVG icons; 44px+ touch targets; scrollbars hidden; 110px bottom padding above the nav.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/music-player/
