# Bloom (Material 3 · plant-care companion)

A plant-care app prototype in **plain Material 3** — the repo's canonical
M3 reference: default purple `tokens.css` palette (no `style` prop), tonal
elevation, floating content-sized bottom nav, M3 sheets/FAB/switch/segments,
and emphasized-easing motion throughout. Plant illustrations are generated
from data as inline SVG (no assets), thirst rings animate on mount.

**Style:** Material 3 (default). `DeviceThemeProvider
storageKey="bloom-theme"`, initial dark — theme scoped to `.device`.

## Screens

1. **Home** — greeting + collection grid (art, thirst rings, "watered
   2d ago"); card → plant sheet with care facts + Water now; FAB →
   add-plant presets.
2. **Water** — streak card, weekly progress, today's schedule with
   droplet-ripple checkboxes, upcoming 7-day strip.
3. **Guide** — category chips filter an accordion of care articles
   (smooth height expand, rotating chevron).
4. **Profile** — stats, Dark/Light segmented (useDeviceTheme),
   notification switches + reminder-time stepper (all persisted),
   About → toast.

## Notes for agents

See `navigation.md` in this folder — especially why no tokens are
overridden, the `.bl` app-root layering vs the proto-kit status bar, and
the "rings draw moisture" decision.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/bloom/
