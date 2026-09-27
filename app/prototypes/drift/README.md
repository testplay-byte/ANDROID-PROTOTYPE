# Drift (Glassmorphism · podcast & audio player)

An audio app whose whole point is **glass color discipline**: milky
low-alpha white panels (0.10–0.22, blur + saturate 1.6, luminous hairline,
light-catch + inner shade + float shadows) over a fixed vivid mesh-gradient
backdrop that rotates hue per tab — dawn amber → sea teal → dusk magenta →
forest green (warm-led, never generic blue). Show covers and waveforms are
fully generative inline SVG from a seeded PRNG; per-show palettes tint the
accents that touch their content.

**Style:** `glass` (`DeviceFrame style="glass"`). `DeviceThemeProvider
storageKey="drift-theme"`, initial dark — theme scoped to `.device`.
Nav: proto-kit `BottomNav variant="glass"` paired with a persistent
mini-player glass bar and a floating header pill (no large-title bar).

## Screens

1. **Listen** — featured hero (cover art fading into a blurred glass veil,
   play/follow), continue card with live waveform, 8-show grid.
2. **Browse** — category chips, horizontal snap rows, in-place show detail
   with episode list (play, follow, download).
3. **Player** — glowing cover, waveform + draggable scrubber, full
   transport, segmented speed, sleep-timer chips.
4. **Library** — Downloads / Following / History sections with stateful
   toggles and glass empty states.

## Notes for agents

See `navigation.md` in this folder — especially the layering tiers (why
the hero frame carries no blur), the deliberate `prefers-reduced-transparency`
decision (same as weather-app/wallet), and the `[class*="bottomnav"]`
dock re-toning.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/drift/
