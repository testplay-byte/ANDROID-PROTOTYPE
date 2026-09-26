# fitness-tracker — navigation

## What this prototype is

A fitness tracking app built on the **HIG (Apple Human Interface Guidelines)**
design language: grouped light-gray background with pure-white inset cards,
16px continuous radii, hairline separators, iOS system-blue accent used only
for interactive elements, and the full-width translucent blurred tab bar.
Three SVG activity rings, a live workout session timer, and iOS settings
controls.

## Screens

| Screen   | View id     | Description |
|----------|-------------|-------------|
| Activity | `activity`  | Three activity rings (move = primary blue, exercise = success green, stand = warn yellow) via SVG stroke-dasharray; weekly M T W T F S S day pills that switch the data; grouped stat cards for steps, heart rate and distance with tinted inline SVG icon discs. |
| Workouts | `workouts`  | Workout types (Run, Cycle, Swim, Yoga, HIIT) as iOS rows with icon disc + chevron. Tapping starts an inline session: big circular progress ring, elapsed time (setInterval while running), start/pause/reset controls and auto-pause at the 30-minute goal. |
| Profile  | `profile`   | Profile header with initials avatar disc, stats grid (day streak / total workouts / minutes), achievement badges row, and detail rows. |
| Settings | `settings`  | iOS inset grouped style: Light/Dark appearance segmented control (wired to useDeviceTheme, persisted), km/mi distance units segmented control, weekly workout goal stepper, About rows. |

## Interactions

- Weekly day selector — each pill shows that day's rings + stats
- Workout row tap → inline session; start / pause / reset / end controls
- Timer auto-pauses when the 30-minute goal ring completes
- Appearance segmented control switches the device theme (light/dark,
  persisted to `localStorage["fitness-theme"]`)
- Units segmented control (km/mi); weekly goal stepper (1–7)
- Hash routing: `#activity` `#workouts` `#profile` `#settings`; swipe
  left/right switches tabs; drag scrolls content

## Files

| File | What it is |
|------|------------|
| `app/prototypes/fitness-tracker/layout.tsx` | Imports tokens.css + styles/index.css (hig layer) + prototype css |
| `app/prototypes/fitness-tracker/page.tsx` | Shell + hash router + Stage panels |
| `src/prototypes/fitness-tracker/fitness-tracker.css` | Prototype globals, scrollbar hiding, panel helpers |
| `src/prototypes/fitness-tracker/lib/data.ts` | Types + mock week activity, workout types, profile data |
| `src/prototypes/fitness-tracker/components/grouped-list.tsx` | iOS inset-grouped primitives (Group / Row / SectionLabel) |
| `src/prototypes/fitness-tracker/components/segmented.tsx` | iOS segmented control |
| `src/prototypes/fitness-tracker/components/activity-rings.tsx` | Three-ring SVG component |
| `src/prototypes/fitness-tracker/screens/activity-screen.tsx` | Rings + day selector + stat cards |
| `src/prototypes/fitness-tracker/screens/workouts-screen.tsx` | Workout list + inline session timer |
| `src/prototypes/fitness-tracker/screens/profile-screen.tsx` | Profile screen |
| `src/prototypes/fitness-tracker/screens/settings-screen.tsx` | Settings screen |
| `src/prototypes/fitness-tracker/screens/*.module.css` | Scoped styles per screen |

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/fitness-tracker/
