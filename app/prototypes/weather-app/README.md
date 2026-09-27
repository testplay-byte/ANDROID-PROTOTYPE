# Aurora Weather (Glassmorphism)

A glassmorphism weather prototype recreated **1:1 from the Aurora Weather
reference project** (`C:\Users\khurr\Desktop\GLASS\DL\aurora-weather`) on
`src/proto-kit`. Milky low-alpha glass floats over a vivid four-theme sky
(dawn / day / dusk / night — night is the dark mode) with drifting orbs,
frosted spheres, film grain and glossy gradient weather glyphs.

**Style:** Glassmorphism (`DeviceFrame style="glass"`; the dock/topbar are
exact app-level ports of the reference chrome; `DeviceThemeProvider
storageKey="weather-theme"` with the device theme derived from the backdrop
theme — night ⇒ dark).

## Screens

1. **Weather** — hero glass card (count-up temperature, glossy condition
   glyph, H/L/humidity chips), 7 metric tiles (wind compass, UV bar, …),
   sun-arc card, 24h hourly strip, 7-day rows → tap for the day modal.
2. **Forecast** — Temperature / Precipitation / Wind 24h chart modes,
   hourly tiles, 3×2 detail grid, 7-day rows.
3. **Cities** — search (add/open), star favorites, current badge, remove.
4. **Settings** — units (°C/°F, wind, clock), four backdrop themes + auto,
   glass blur slider (live), reduce motion, error simulation, reset.

## Interactions

Everything from the reference: splash boot, staggered screen entrances,
count-up hero temperature, dock bump, sun-arc position by daylight progress,
deterministic seeded weather per city/day, refresh with loading + toast,
error simulation, parallax floaters, swipe between tabs, persisted prefs
(`weather-app-prefs-v1`).

## Notes for agents

See `navigation.md` in this folder — especially the deliberate
glass.css-fallback neutralization and the app-level dock/topbar decision.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/weather-app/
