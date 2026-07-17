# src/proto-kit/ — Shared Design System

> The single source of truth for the phone mockup, navigation, tokens, and theme.
> Every prototype imports from here — **fix once, inherit everywhere**.

---

## What's inside

| Component / File | What it does | Import |
|------------------|--------------|--------|
| `tokens/tokens.css` | ALL design tokens: type scale, spacing, radius, motion, M3 color roles, per-theme frame invert + widths, stage backgrounds. Import once in each prototype's layout. | `import "@proto-kit/tokens/tokens.css"` |
| `device-frame/device-frame.tsx` | `<DeviceFrame theme="dark">` — the phone mockup (bezel + status bar + fullscreen button + screen slot). Frame color/width invert by theme automatically. | `{ DeviceFrame, Screen }` |
| `device-frame/status-bar.tsx` | `<StatusBar>` — live clock, punch-hole, Wi-Fi/signal/battery icons. Auto-rendered inside DeviceFrame. | `{ StatusBar }` |
| `device-frame/fullscreen-button.tsx` | `<FullscreenButton>` — real Fullscreen API toggle. Desktop-only (hidden on mobile). Auto-rendered inside DeviceFrame. | (internal) |
| `bottom-nav/bottom-nav.tsx` | `<BottomNav items activeId onSelect>` — floating pill nav. Active item is content-sized (full label always visible). 42px pill / 58px bar. | `{ BottomNav, NavItem }` |
| `stage/stage.tsx` | `<Stage leftPanel rightPanel>` — desktop layout with side panels. Panels hide on ≤1024px. | `{ Stage, PanelBadge, PanelTitle, PanelDesc, PanelHead }` |
| `theme/theme-provider.tsx` | `<DeviceThemeProvider storageKey="..." initialTheme="dark">` — scopes `data-theme` to `.device` (NOT `<html>`). Persists to localStorage. | `{ DeviceThemeProvider, useDeviceTheme }` |
| `swipe-simulation/use-swipe-simulation.ts` | `useSwipeSimulation({ onSwipeLeft, onSwipeRight })` — test feature. Click+drag = touch swipe. Easily removable. | `{ useSwipeSimulation }` |

---

## Token architecture (CRITICAL)

Two independent token layers — read [`docs/theme-architecture.md`](../../docs/theme-architecture.md) for the full explanation.

```
:root  — universal tokens (type, spacing, radius, motion) + STAGE tokens (--stage-bg, --sb-*)
         Stage tokens MUST be on :root because .stage is an ANCESTOR of .device.
         If they were on .device, the stage couldn't read them → white background bug.

.device — app-level tokens (M3 color roles, surfaces, frame bezel/width).
          data-theme="dark" (default) or data-theme="light".
          Light mode overrides via .device[data-theme="light"].
          Stage also adapts via :has(.device[data-theme="light"]).
```

---

## Device frame — per-theme inversion

The frame inverts by theme for premium contrast:

| Theme | Frame color | Border width | Notes |
|-------|-------------|--------------|-------|
| **Dark** | Soft platinum `#cfcfcf` + `#a8a8a8` rim | `3.5px / 4px` | Light but not stark white; thinner (bright border reads heavier) |
| **Light** | Dark `#0e0a17` + `#1b1729` rim | `4px / 4.4px` | Dark border against light screen |

The frame + background transition smoothly when toggling themes.

---

## Bottom nav — content-sized active pill

- Active item: `flex: 0 1 auto` (content-sized) — full label always visible, never truncated.
- Inactive items: `flex: 1 1 0` (icon-only, share remaining space evenly).
- Slim: 42px pill height, 58px bar height.
- Expanding-pill animation on tab switch.

---

## Fullscreen button

- Part of `<DeviceFrame>` — every prototype gets it automatically.
- Real Fullscreen API (`requestFullscreen` on `.device`).
- Purple circular, 40px, bottom-right above the nav bar.
- **Desktop-only** — `@media (max-width: 480px) { display: none }`.
- Icon toggles expand (enter) / shrink (exit). Syncs on `fullscreenchange`.

---

## Swipe simulation (test feature)

Easily removable — marked with `SWIPE SIMULATION (TEST FEATURE)` in 4 places:
1. `src/proto-kit/swipe-simulation/use-swipe-simulation.ts`
2. `src/proto-kit/index.ts` (export)
3. `app/prototypes/anime-app/page.tsx` (hook call + SWIPE_ORDER)
4. `src/prototypes/anime-app/anime-app.css` (cursor CSS)

To disable: set `enabled: false`. To remove: delete the 4 blocks.

---

## Usage pattern

```tsx
import "@proto-kit/tokens/tokens.css";
import { DeviceThemeProvider, DeviceFrame, Screen, Stage, BottomNav } from "@/proto-kit";

<DeviceThemeProvider storageKey="my-prototype-theme" initialTheme="dark">
  <Stage leftPanel={...} rightPanel={...}>
    <DeviceFrame theme="dark">
      <Screen>
        {/* screens here */}
      </Screen>
      <BottomNav items={NAV_ITEMS} activeId={active} onSelect={handleNav} />
    </DeviceFrame>
  </Stage>
</DeviceThemeProvider>
```

See `app/prototypes/search-page/` as the reference implementation.
