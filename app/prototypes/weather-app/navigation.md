# weather-app — navigation

## What this prototype is

A glassmorphism weather app. Frosted translucent panels (backdrop blur +
saturate, 1px luminous borders, inner top highlight) float over a colorful
ambient background of three large blurred blobs — violet, cyan and amber —
rendered inside the screen so the glass always has something to refract.
Four screens (Today, Forecast, Cities, Settings) with a shared active-city
state and a global °C/°F unit conversion.

## Screens

| Screen   | View id    | Description |
|----------|------------|-------------|
| Today    | `today`    | Current conditions for the active city: 72px/800 temperature, condition icon + text, "feels like" glass chip, hi/lo line, horizontally scrolling glass hourly strip (8 cards), and a 2×2 grid of glass detail tiles (humidity / wind / UV / pressure). |
| Forecast | `forecast` | 7-day glass list rows: day, SVG condition icon, lo temp, hi→lo range bar (positioned within the week's span, tertiary→primary gradient), hi temp. |
| Cities   | `cities`   | Glass list of saved cities with current temps and condition icons. Tapping a row switches the active city (Today + Forecast follow). Add-city input row appends a new demo city via React state; the add button flashes a check / shakes on duplicate and an aria-live note reports the result. |
| Settings | `settings` | Light/dark theme segmented glass toggle (persists via `useDeviceTheme`), °C/°F unit toggle (converts every displayed temp instantly), ambient-blob intensity preset, About card. |

## Interactions

- City switching — tap a city row; the active dot moves and Today/Forecast re-render for that city.
- Add city — type a name and press the + button (or Enter): a new glass row staggers in with deterministic demo data and becomes the active city; duplicates shake the row; not persisted (prototype).
- Unit toggle — °C/°F in Settings converts hero temp, feels-like, hourly temps, forecast range bars and city list everywhere.
- Theme toggle — light/dark frost, scoped to the device and persisted to localStorage.
- Swipe — horizontal drag on the device navigates between the 4 tabs (proto-kit `useSwipeSimulation`).
- Ambient blobs — violet/cyan/amber radial gradients drift slowly behind all glass panels.
- Stagger — hourly cards and list rows animate in with a 40ms per-item delay.

## Files

| File | What it is |
|------|------------|
| `app/prototypes/weather-app/layout.tsx` | Imports tokens.css + styles/index.css + prototype CSS |
| `app/prototypes/weather-app/page.tsx` | Shell + hash router + ambient blobs + shared city/unit/add state |
| `src/prototypes/weather-app/weather-app.css` | Ambient blobs, glass helpers, view transition, stagger, scrollbar hiding |
| `src/prototypes/weather-app/lib/weather.ts` | City/forecast types, deterministic mock data for 5 cities + `makeCity`, `toUnit`/`formatTemp` helpers |
| `src/prototypes/weather-app/components/icons.tsx` | Inline SVG weather + UI icon set (stroke=currentColor) |
| `src/prototypes/weather-app/screens/today-screen.tsx` + `.module.css` | Today screen |
| `src/prototypes/weather-app/screens/forecast-screen.tsx` + `.module.css` | Forecast screen |
| `src/prototypes/weather-app/screens/cities-screen.tsx` + `.module.css` | Cities screen |
| `src/prototypes/weather-app/screens/settings-screen.tsx` + `.module.css` | Settings screen |

## Style rules honored

- Every glass surface: `backdrop-filter: blur(var(--glass-blur)) saturate(1.3)`, translucent `--color-surface-*` background, `1px solid var(--glass-border)` border, `--shadow-inset` top inner highlight.
- Colorful blobs sit behind everything (`.ambient`, z-index 0, inside the Screen).
- Tokens only for colors/spacing/radius/type/motion; inline SVG icons; 44px+ touch targets; scrollbars hidden; 110px bottom padding above the nav.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/weather-app/
