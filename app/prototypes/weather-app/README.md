# Weather App (Glassmorphism)

A frosted-glass weather prototype built on `src/proto-kit`. Translucent
panels blur and saturate a colorful ambient background of drifting
violet/cyan/amber blobs rendered inside the screen.

**Style:** Glassmorphism (`DeviceFrame theme="dark" style="glass"`, `BottomNav variant="glass"`, `TopBar variant="center"`, `DeviceThemeProvider storageKey="weather-theme" initialTheme="dark"`)

## Screens

1. **Today** — 72px hero temperature, condition icon/text, "feels like" glass chip, hourly glass strip (8 hours, horizontal scroll), 2×2 glass detail tiles (humidity / wind / UV / pressure).
2. **Forecast** — 7-day glass rows with SVG condition icons and hi/lo range bars scaled to the week.
3. **Cities** — 5 saved cities with current temps; tap to switch the active city; add-city input row with demo data + button feedback.
4. **Settings** — light/dark theme toggle, °C/°F unit toggle (applies everywhere instantly), ambient preset.

## Interactions

Active-city state shared across Today/Forecast/Cities, global temperature
unit conversion via `lib/weather.ts` helpers, add-city with check/shake
feedback, swipe-between-tabs gestures, 40ms list stagger, drifting ambient
blobs behind all glass.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/weather-app/
