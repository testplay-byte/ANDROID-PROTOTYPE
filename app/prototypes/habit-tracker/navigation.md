# habit-tracker — navigation

## What this prototype is

A minimalism (monochrome) habit tracker built on proto-kit. Pure neutrals,
hairline borders, generous whitespace — hierarchy comes from type weight and
spacing alone. Ink is the primary; `--color-error` is the single accent,
used only for the destructive reset action. 4 screens, floating bottom nav,
large top bar with today's date.

## Screens

| Screen   | View id    | Description |
|----------|------------|-------------|
| Today    | `today`    | Big circular day-progress ring (SVG stroke, ink) + hairline habit checklist with tabular-nums streaks and large circular check buttons |
| Stats    | `stats`    | 7-column weekly monochrome heatmap per habit, big completion %, best streak |
| Habits   | `habits`   | Habit list with "New habit" inline form (name, icon picker, target-days stepper) and per-row edit/delete |
| Settings | `settings` | Theme toggle, "week starts on" segmented control (Mon/Sun), reminder toggle, reset data with confirm |

## Interactions

- Check / uncheck a habit (circular button fills with ink; streak pops up / decrements)
- Progress ring animates with the day completion
- Inline add / edit / delete habit form
- Week start (Mon/Sun) reorders the Stats heatmap
- Dark theme toggle via `useDeviceTheme` (persisted to `habit-tracker-theme`)
- Reset data with a confirm step (the one red accent)
- Swipe left/right navigates between tabs; hash router (#today / #stats / #habits / #settings)

## Files

| File | What it is |
|------|------------|
| `app/prototypes/habit-tracker/page.tsx` | Shell + hash router + app state |
| `app/prototypes/habit-tracker/layout.tsx` | Token/style imports + metadata |
| `src/prototypes/habit-tracker/habit-tracker.css` | Prototype-wide globals |
| `src/prototypes/habit-tracker/screens/*.tsx` | One file per screen |
| `src/prototypes/habit-tracker/components/*` | ProgressRing, HabitForm, HabitIcon, MinimalSwitch |
| `src/prototypes/habit-tracker/lib/*` | Types, mock data, date/stats helpers, icon registry |

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/habit-tracker/
