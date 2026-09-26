# Music Player (Neumorphism)

A soft-UI music player prototype built on `src/proto-kit`. Extruded plastic
surfaces shaped by dual shadows — no hard borders, one warm accent.

**Style:** Neumorphism (`DeviceFrame style="neumorph"`, `BottomNav variant="soft"`, light theme default)

## Screens

1. **Player** — spinning album art in an extruded ring, like button, inset seekable progress groove, transport (shuffle / prev / play-pause / next / repeat).
2. **Library** — all tracks; tap to play; current track shows an animated equalizer.
3. **Playlists** — puffy 2-column card grid with gradient covers; tap to play.
4. **Settings** — light/dark theme segmented toggle, gapless + crossfade neumorphic switches.

## Interactions

Simulated playback engine (1s progress timer, auto-advance on track end with
shuffle/repeat handling), seek, likes, song selection shared across screens,
swipe-between-tabs gestures, 40ms list stagger.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/music-player/
