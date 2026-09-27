# Atlas (Bento Grid · travel trip planner)

A travel trip planner in the **Bento Grid** language where the tile
hierarchy *is* the information architecture: tile sizes encode frequency of
use, the header is a tile grown from the grid, the nav is a row of equal
rounded cells, and tapping any tile morphs it full-screen (~300ms
emphasized scale). Destination art — sky, sun, ridges — is generated from
per-city colour tokens; zero bitmaps, zero emoji.

**Style:** Bento (`style="bento"` — enlarged widget radii, felt gutters,
shadow-1 contact lift, one orange accent). `DeviceThemeProvider
storageKey="atlas-theme"`, initial dark.

## Screens

1. **Trip** — destination hero (generative landscape), 2×1 weather with
   mini forecast bars, tall countdown numeral, flights / stay / budget-ring
   / activities 1×1 tiles, packing strip. All tiles expand.
2. **Places** — collection hero + 2-up destination cards (city loud,
   country muted, days chip, persisted bookmark).
3. **Pack** — checklist as spatial bento: Essentials spans wide, Tech and
   Docs are equal tiles; cells fill with the accent; per-trip persistence.
4. **Me** — stats bento (countries/trips/miles numerals), Dark↔Light
   segmented, trip-length stepper, notification toggles, About.

## Notes for agents

See `navigation.md` in this folder — especially the deliberate chrome
deviation from the style guide's recommended TopBar/BottomNav (user
mandate) and the expand-overlay layering.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/atlas/
