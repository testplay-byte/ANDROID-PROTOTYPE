# smart-home — navigation

## What this prototype is

A smart home dashboard built on the **bento** design language: a signature
2-column bento grid of mixed-height rounded tiles (white tiles on an iOS-gray
felt background, oversized radii, subtle contact shadows) with one vivid
orange accent used sparingly. Big tabular numbers, mini charts, and tappable
tiles with press feedback. Device state is shared between the Home and Rooms
screens so the "N devices on" line stays consistent.

## Screens

| Screen   | View id    | Description |
|----------|------------|-------------|
| Home     | `home`     | Bento grid: thermostat tile (2 rows, dial + +/- steppers), lights tile (brightness slider + toggle), dark security camera tile (LIVE badge + CSS-gradient noise), energy tile (mini 7-bar chart), speaker tile (now playing + play/pause), wide door-lock tile. Top bar subtitle counts devices on. |
| Rooms    | `rooms`    | Room filter chips (All / Living / Kitchen / Bedroom) + per-room grouped device rows with toggles, per-device status and room temperature. |
| Energy   | `energy`   | Today/week segmented control, usage bar chart (peak bar in orange), big "usage this week" number, per-device usage rows. |
| Settings | `settings` | Light/dark theme toggle (useDeviceTheme, persisted), eco mode + guest access switches, home name input. |

## Interactions

- Thermostat +/- steppers (0.5° steps, clamped 15–28°)
- Lights toggle + brightness slider (slider disabled when off)
- Camera stream on/off (LIVE badge dot pulses when streaming)
- Speaker play/pause (equalizer bars animate while playing)
- Door lock locked/unlocked tile (tappable, icon swaps)
- Every toggle updates the "N devices on" count in the Home subtitle
- Room filter chips; per-device toggles in Rooms
- Energy today/week segmented control (chart animates between ranges)
- Theme toggle (light/dark, persisted to `localStorage["smart-home-theme"]`)
- Hash routing: `#home` `#rooms` `#energy` `#settings`; swipe left/right
  switches tabs; drag scrolls content

## Files

| File | What it is |
|------|------------|
| `app/prototypes/smart-home/layout.tsx` | Imports tokens.css + styles/index.css (bento layer) + prototype css |
| `app/prototypes/smart-home/page.tsx` | Shell + hash router + shared device state + Stage panels |
| `src/prototypes/smart-home/smart-home.css` | Prototype globals, scrollbar hiding, panel helpers |
| `src/prototypes/smart-home/lib/data.ts` | Types + mock devices, rooms, usage data |
| `src/prototypes/smart-home/lib/use-devices.ts` | Shared device state hook |
| `src/prototypes/smart-home/components/toggle.tsx` | Bento on/off switch (44px touch target) |
| `src/prototypes/smart-home/screens/home-screen.tsx` | Bento grid screen |
| `src/prototypes/smart-home/screens/rooms-screen.tsx` | Rooms + filter chips screen |
| `src/prototypes/smart-home/screens/energy-screen.tsx` | Energy stats screen |
| `src/prototypes/smart-home/screens/settings-screen.tsx` | Settings screen |
| `src/prototypes/smart-home/screens/*.module.css` | Scoped styles per screen |

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/smart-home/
