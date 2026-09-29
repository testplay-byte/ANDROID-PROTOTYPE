# aurora — navigation

## What this prototype is

**"Aurora"** — a weather + ambience console in **Glassmorphism**
(`style="glass"`), built for the **desktop** surface (and reflowing for
tablet). A window, not a wide phone: sidebar navigation, a multi-metric grid,
a detail region, a ⌘K command overlay, and unit + glass-intensity controls
that change every surface on screen.

Glass is enforced rather than suggested: layered translucent panels over a
blurred backdrop, 1px light borders, soft inner highlights and glow accents —
all from the glass token layer (`--glass-blur`, `--glass-saturate`,
`--glass-border`, `--glass-highlight`), never hand-rolled per component.

## Screens

| Screen | View id | Contents |
|--------|---------|----------|
| Now | `#now` | Hero conditions card, hourly strip, 7-day list, precipitation / air-quality / wind cards. |
| Cities | `#cities` | Saved locations with live temperature, add/remove a city, select the active one. |
| Details | `#details` | Precipitation grid, sun/moon timeline, wind + humidity metric cards. |
| Settings | `#settings` | Theme, °C/°F unit toggle (re-renders every temperature), glass intensity, keyboard reference. |

`#now` is the default view; the hash is canonicalised on first load.

## Interactions

- **Unit toggle** — °C ↔ °F converts every temperature on every screen.
- **Glass intensity** — a data attribute that re-tunes the blur/overlay
  recipe app-wide.
- **City add/remove** — mutates shared state; the sidebar count follows.
- ⌘K / Ctrl+K opens the command overlay (views + cities); `1`–`4` jump
  between views; `Esc` unwinds.

## Tablet

The same build, not a narrower one: at `@container surface (max-width: 900px)`
the now-view becomes a single column with a horizontal hourly strip, the
metric cards go 2-up, and the sidebar collapses to the icon rail.

## Files

| File | Role |
|---|---|
| `app/prototypes/aurora/layout.tsx` | token + style + prototype CSS imports |
| `app/prototypes/aurora/page.tsx` | shell: theme provider → provider → Stage → SurfaceFrame → sidebar/top bar/views |
| `src/prototypes/aurora/auridian.css` | stylesheet with a numbered STYLE INDEX |
| `src/prototypes/aurora/data.ts` | deterministic city + forecast data |
| `src/prototypes/aurora/state/aurora-context.tsx` | view, active city, unit, intensity, theme |
| `src/prototypes/aurora/components/` | icons, glass card primitives, command overlay |
| `src/prototypes/aurora/screens/` | now · cities · details · settings |

## Non-obvious decisions

- **No `vh`/`vw` inside the window** — they measure the browser, not the
  surface. Layout is grid/flex with `@container surface` breakpoints.
- **Glass panels never carry their own blur** — the token layer owns the
  recipe, so a change to `--glass-blur` restyles every panel at once.
- **Deterministic data** — fixed forecasts, no `Math.random`, no `Date.now`
  in render, so every load looks identical.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/aurora/desktop/
