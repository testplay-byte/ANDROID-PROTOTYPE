# weather-app — navigation

## What this prototype is

**"Aurora Weather"** — a glassmorphism weather app recreated **1:1 from the
Aurora Weather reference project** (`C:\Users\khurr\Desktop\GLASS\DL\aurora-weather`,
a vanilla ES-module app) on this repo's stack (React 19 + CSS + proto-kit).
The reference's look, colors, animations and functionality are kept intact;
only the shell complies with repo standards (proto-kit `DeviceFrame` /
`StatusBar` / `Stage`, theme scoped to `.device`, hash routing).

Milky low-alpha white glass (blur 26px + saturate 1.6 by default) floats over
a vivid four-theme sky — **dawn / day / dusk / night** (night = dark mode) —
with drifting orbs, frosted spheres, film grain, glossy gradient weather
glyphs and spring-soft motion. Five views: Weather, Forecast, Cities,
Settings (+ a transient error state).

## Screens

| Screen | View id | Contents |
|--------|---------|----------|
| Weather | `#home` | Hero glass card (count-up temperature, glossy condition glyph with bob/rays, H/L/humidity chips), 7 metric tiles (feels/wind+compass/humidity/visibility/pressure/sunrise/UV bar), sun-arc card, hourly strip (24h), 7-day rows with range bars → tap opens the day modal. |
| Forecast | `#forecast` | Temperature / Precipitation / Wind seg chips, 24h chart card (horizontally scrollable SVG) with inset hourly strip, 3×2 detail grid, 7-day rows. |
| Cities | `#cities` | Search (matches name or country; add to favorites / open saved), saved city cards (star, current badge, live temp, condition, remove button on hover), empty state. |
| Settings | `#settings` | °C/°F, wind units (km/h · mph · m/s), 12h/24h, four backdrop-theme swatches (night = dark mode), auto theme by city clock, glass blur slider (8–40px, live), reduce motion, simulate connection error, reset. |
| Error | (transient) | Connection-failure card shown by refresh when "Simulate connection error" is on; Try again / Open Settings. |

## Interactions

- **Refresh** (topbar) — loading overlay → toast; honors the error simulation; resets the weather cache.
- **City switch** — tap a saved/searched city: loading overlay, all screens update, auto-theme re-evaluates.
- **Day modal** — tap any 7-day row: bottom glass sheet with mini temperature curve + 4 detail tiles; veil click / Esc / × closes.
- **Theme** — swatch or auto mode repaints the sky (1s cross-fade + white flash in the reference is carried by the bg transition); night flips the device to dark mode (`DeviceThemeProvider storageKey="weather-theme"`).
- **Blur slider** — sets `--wa-blur` on the app root; every glass surface updates live.
- **Splash → app boot** (1.5s), staggered fadeUp entrances per screen switch, count-up hero temp, dock icon bump, parallax orbs/spheres on pointer move (desktop), `wa-rm` class + `prefers-reduced-motion` kill all motion.
- **Swipe** — horizontal drag navigates the 4 tabs (proto-kit `useSwipeSimulation`).
- All prefs persist in `localStorage` under `weather-app-prefs-v1`.

## Files

| File | What it is |
|------|------------|
| `app/prototypes/weather-app/layout.tsx` | Imports tokens.css + styles/index.css + `weather-app.css`; loads the **Outfit** font (`next/font`, `--font-outfit`). |
| `app/prototypes/weather-app/page.tsx` | Client shell: DeviceThemeProvider → WeatherProvider → Stage panels → DeviceFrame (`style="glass"`) → `.wa` app root (data-sky, --wa-blur, ambient, screens, topbar, dock, overlays); theme sync + parallax + swipe wiring. |
| `src/prototypes/weather-app/weather-app.css` | 1:1 scoped port of the reference's 4 CSS layers (tokens/components/layout/animations) under `.wa`; keyframes prefixed `wa-`; stage panel helpers; status-bar white-over-sky overrides; neutralizes glass.css's reduced-transparency fallback (see below). |
| `src/prototypes/weather-app/lib/utils.ts` | clamp, FNV-1a hash, mulberry32 PRNG, rAF tween, rAF throttle. |
| `src/prototypes/weather-app/lib/data.ts` | 12-city mock DB, condition labels, wind-direction labels, date helpers. |
| `src/prototypes/weather-app/lib/engine.ts` | Deterministic weather engine (current + 24h + 7d, cached per city/day). |
| `src/prototypes/weather-app/lib/prefs.ts` | Persisted prefs + formatters (temp/wind/time/hour labels). |
| `src/prototypes/weather-app/state/weather-context.tsx` | Central provider: prefs, hash router, overlays (splash/loading/toast/modal), all actions, effective-theme computation. |
| `src/prototypes/weather-app/components/icons.tsx` | Shared SVG gradient defs (`gSun`…`gFog`), UI stroke icons, glossy weather glyphs (`WxIcon`). |
| `src/prototypes/weather-app/components/charts.tsx` | Sun arc, 24h chart (temp/pp/wind), day-modal mini curve (React SVG). |
| `src/prototypes/weather-app/components/chrome.tsx` | Glass topbar (title/subtitle per view, refresh + search) and dock (4 tabs, white active pill) — app-level, exact reference ports. |
| `src/prototypes/weather-app/components/overlays.tsx` | Splash, loading overlay, toast, day-detail modal. |
| `src/prototypes/weather-app/screens/*.tsx` | `home-screen.tsx` (+ shared `HourlyStrip`/`DailyRows`), `forecast-screen.tsx`, `cities-screen.tsx`, `settings-screen.tsx`, `error-screen.tsx`. |

## Non-obvious decisions (for future agents)

- **The dock and topbar are app-level ports, not proto-kit `BottomNav`/`TopBar`** — the
  reference's exact markup/behavior was prioritized (white active pill, navBump, refresh
  spin). proto-kit's `variant="glass"` nav remains available for other glass prototypes.
- **glass.css fallback neutralization:** `src/proto-kit/styles/glass.css` forces every
  `[class*="glass"]` surface opaque under `prefers-reduced-transparency` (Windows
  transparency effects off ⇒ this machine reports it) and `prefers-contrast: more`.
  The reference app does not honor those flags, so `weather-app.css` re-asserts the
  recipe with equal specificity + later source order to keep the 1:1 glassy look.
  Do not "fix" this by deleting the override — it is deliberate.
- **Status bar integration:** `.device div[class*="statusbar"]` is forced transparent +
  white (all four skies are deep enough at the top). The status bar is proto-kit chrome
  (36px, punch-hole); the app's topbar sits at `top: 46px`.
- **Theme model:** the app owns 4 backdrop themes (`data-sky` on `.wa`); the device
  light/dark theme is *derived* (night ⇒ dark) and synced via `useDeviceTheme().setTheme`.
- **Entrances:** the active view remounts with `key={view}` so the staggered fadeUp
  replays per screen switch; in-place updates (unit change) do not replay it.
- The weather engine is **deterministic per city per calendar day** (seeded PRNG) —
  data is stable across re-renders and reloads on the same day.

## Reference source

`C:\Users\khurr\Desktop\GLASS\DL\aurora-weather` (README there documents its own
architecture; `standalone.html` is a frozen v2 snapshot, not canonical).

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/weather-app/
