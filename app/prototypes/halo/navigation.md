# halo — navigation

## What this prototype is

**"Halo"** — a neumorphism (soft UI) **desktop** smart-home control centre,
and the desktop sibling of the Neumorph phone prototype (music-player): *a
different domain, the same design language*.

The shell follows `app/prototypes/meridian` — the repo's reference desktop
prototype — exactly:

```
DeviceThemeProvider (halo-theme, scoped to the SURFACE)
  → HaloProvider
    → Stage (left/right info panels + the surface switcher, OUTSIDE the app)
      → SurfaceFrame (surface="desktop", style="neumorph", windowChrome,
                      menu={["Halo","File","Edit","View","Rooms","Help"]},
                      storageKey="halo", draggable)
          · DesktopSidebar   — sectioned navigation
          · DesktopTopBar    — title + ⌘K command field + live load + scenes
          · SurfaceScreen    — the active view
          · CommandPalette   (⌘K) and a toast
```

`useCanonicalSurface("halo", "desktop")` keeps the URL honest, and
`surfaces={["desktop","tablet"]}` + `slug="halo"` on the **Stage** (never on
the app) gives the tablet build at `/prototypes/halo/tablet/`.

## Views (hash-routed)

| View       | Hash       | Contents |
|------------|------------|----------|
| Home       | `#home`    | 4-up stat strip (indoor temp / live load / kWh today / active devices) · six room tiles that double as the device-grid filter · an 8-card device grid where every tile carries its own power control **and** its own carved value groove · a two-column band with the 24-hour power curve (frozen at 14:00, peak-rate window washed in) and the live draw leaderboard. |
| Rooms      | `#rooms`   | The desktop split: a filterable room list (temperature, target, active counts, live watts) on the left and a **device drawer that opens BESIDE it** on the right — room facts, a turn-room-on/off action, and one row per device with a live power control and value stepper. |
| Energy     | `#energy`  | kWh per hour today as extruded bars with **yesterday dashed across the same frame**, the peak-rate strip (18:00–21:00), and a by-device breakdown where every bar carries a **tick for yesterday's share**. |
| Settings   | `#settings`| Theme scoped to the window, the **softness** control, four automation switches, the desktop shortcut reference, demo-data actions. |

## State (one context, `state/halo-context.tsx`)

- `devices` — a copy of the literal data set; `toggleDevice` and `nudgeDevice`
  are the only writers.
- `homeRoom` (home grid filter), `roomFilter` (list filter), `selectedRoom`
  (the open drawer).
- `softness` — persisted to `localStorage` under `halo-softness`.
- `automations`, `paletteOpen`, `toast`.
- `metrics` — every figure the four views share, derived once with `useMemo`:
  live watts, kWh today vs yesterday, the % delta, cost at the fixed tariff,
  active counts, average indoor temperature and the draw leaderboard.

Switching a device off in the **Rooms drawer** or the **Home grid** therefore
moves the same numbers everywhere in the same click.

## The Neumorph recipe (the one preference a phone could not have)

`halo.css` §0 declares the whole shadow language from tokens only:

```
--neu-d  ← --frame-shadow        (the shade)
--neu-l  ← --color-surface-5     (the highlight — light-on-dark in the dark
                                  palette, white-on-pale in the light one)
```

Both are multiplied by `--neu-o` (offset) and `--neu-b` (blur), which the
**softness** preference re-bakes through `data-softness` on the `.halo` root:

| `data-softness` | offset | blur  |
|-----------------|--------|-------|
| `firm`          | 2px    | 6px   |
| `medium`        | 5px    | 12px  |
| `soft`          | 9px    | 20px  |

Three derived shadows — `--neu-raise`, `--neu-raise-lg`, `--neu-press` — are
consumed through the `.halo-raised`, `.halo-raised-lg` and `.halo-press`
classes, so one attribute change re-bakes every tile, groove, switch, popup
and toast in the app.

## Tablet reflow — `@container surface` breakpoints only

At `@container surface (max-width: 900px)` (not a media query — the window is
draggable, so the SURFACE width is what matters):

1. **Home device grid** goes 4-up → **2-up** (`.halo-grid`).
2. **The Rooms device drawer leaves its column** and becomes a **full-width
   block directly BELOW the room list** — the beside-the-list pattern is a
   desktop affordance a tablet cannot afford the width for.
3. The stat strip and settings grid go 2-up; the room tiles go 3-up.
4. At 620px everything goes single-column.

Intermediate stops: 1180px (room tiles 4-up, grid 3-up, the home band stacks)
and 620px.

## Desktop-only patterns (none of these exist on a phone)

- Sectioned **sidebar** navigation (not a bottom bar).
- A **⌘K / Ctrl+K command palette** that jumps to a view, opens a room's
  drawer, or switches a device.
- **Keyboard shortcuts**: `⌘K` palette · `Esc` close · `/` filter rooms ·
  `1–4` switch views · `D` toggle the open room · `A` away scene.
- A **detail drawer beside the list**, never over it.
- A **softness** preference that rescales every shadow in the window.
- No status bar, no bottom nav, no swipe navigation — by design.

## Files

| File | What it is |
|------|------------|
| `app/prototypes/halo/layout.tsx` | tokens.css → styles/index.css → halo.css; metadata |
| `app/prototypes/halo/page.tsx` | The shell: providers, Stage panels, SurfaceFrame, sidebar, top bar, palette, toast |
| `src/prototypes/halo/halo.css` | The whole style, with a numbered STYLE INDEX and the shadow recipe in §0 |
| `src/prototypes/halo/data.ts` | 6 rooms, 23 devices, the 24-hour series and yesterday's, the tariff, the automations — all literals |
| `src/prototypes/halo/state/halo-context.tsx` | Device state, the selected room, softness, automations, hash routing, shortcuts, derived `metrics` |
| `src/prototypes/halo/components/icons.tsx` | Inline SVG set, one glyph per device kind |
| `src/prototypes/halo/components/controls.tsx` | StatTile, CardHead, Legend, PowerButton, ValueWell, Chip |
| `src/prototypes/halo/components/device-card.tsx` | The home-grid tile (power + value + draw) |
| `src/prototypes/halo/components/charts.tsx` | PowerCurve, HourlyBars, PeakStrip, DeviceBar — deterministic inline SVG / DOM |
| `src/prototypes/halo/components/neu-switch.tsx` | The carved-off / extruded-on toggle |
| `src/prototypes/halo/components/command-palette.tsx` | The ⌘K overlay |
| `src/prototypes/halo/screens/*.tsx` | home · rooms · energy · settings |

## Rules held

- **Tokens only** — not one hardcoded colour, radius or shadow value in
  halo.css; the language arrives through `data-style` on the surface.
- **Deterministic** — no `Math.random`, no `Date.now()`. The wall clock is
  frozen at 14:00 (`CURRENT_HOUR`).
- **Contrast** — neumorphism is soft, never illegible. No pale-on-pale: body
  copy uses `--color-text`, secondary copy `--color-text-muted`, and filled
  controls use `--color-primary-container` + `--color-on-primary-container`
  rather than a solid `--color-primary` fill, which would fail 4.5:1 in the
  light palette.
- **No hard borders, no flat cards** — every surface is the background colour
  shaped by the two-shadow recipe.
- **Fits 1280×800** with no horizontal scrolling; the window is draggable and
  every breakpoint is a `@container surface` query.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/halo/
