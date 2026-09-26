# smart-home

A smart home dashboard prototype in the **bento** design language — the
signature 2-column bento grid of mixed-height rounded tiles (thermostat dial,
lights, live security camera, energy mini-chart, speaker, door lock) with one
vivid orange accent, big tabular numbers and tappable tiles. Plus Rooms, Energy
and Settings tabs. Built on `src/proto-kit/` (DeviceFrame `style="bento"`,
BottomNav `variant="floating"`, TopBar `variant="large"`).

## Screens

1. **Home** — the bento grid; toggling devices updates the "N devices on" subtitle
2. **Rooms** — filter chips + per-room device rows with toggles and temps
3. **Energy** — today/week segmented control, bar chart with orange peak, per-device usage
4. **Settings** — theme toggle (light/dark), eco mode, guest access, home name

## Live

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/smart-home/
