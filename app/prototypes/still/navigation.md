# still — navigation

## What this prototype is

**"Still"** — a meditation & breathing companion built in **Neumorphism**
(`style="neumorph"` on `DeviceFrame`). Where the repo's other neumorph demo
(Music Player) is a gadget, Still is the same language taken somewhere quiet
and sculptural: one molded slab of a single-tone surface, elements defined
purely by the dual light/dark shadow pair, presses carving **into** the
sheet instead of clicking, and the copper accent used almost silently (only
the breath track, the lit toggle dot, the avatar glyph). No borders, no
outlines, generous pillow radii, text held at AA.

Chrome variety is deliberate: there is **no TopBar at all**. Today /
Sessions / Profile open with a quiet centered letterspaced label; **Breathe
has no header whatsoever** — the full-bleed orb owns the screen. The nav is
the proto-kit `BottomNav variant="soft"` (extruded bar, carved active state).

## Screens

| Screen   | View id     | Contents |
|----------|-------------|----------|
| Today    | `#today`    | Quiet centered "TODAY" label + time-aware greeting, extruded **streak disc** (raised ring + carved inner well holding the day count), "today's intention" soft slab (one line per calendar day, tap → Breathe), three **pillow-soft recommendation cards** — pressing sinks the whole card in via `--shadow-inset`. |
| Breathe  | `#breathe`  | The showcase. Pattern picker as carved soft pills (**Box 4-4-4-4 / Calm 4-7-8 / Ocean 5-2-6**); a large extruded **breathing orb** that IS the start/pause control — its scale tracks the active phase (inhale expands, exhale sinks, holds stay) with slow ease-in-out travel equal to the phase length; a ring pulse is released on every phase change (haptic-feel); cycle counter + elapsed under the orb; a pressed-in cycle-position track; "finish" credits the session's minutes into the profile stats. |
| Sessions | `#sessions` | Segmented **length filter** (All / ≤5 / 6-14 / 15+) sitting in a carved trough with an extruded active segment; library grouped by three programs (Grounding / Wind Down / Clear Mind, 10 sessions); each row carries an extruded **play disc** — tapping completes the session (disc carves, check pops in, minutes credited), state persists. |
| Profile  | `#profile`  | Identity slab + three extruded stat pills (minutes / streak / sessions, live), daily-reminder **time stepper** (extruded ± discs around a carved time well, 30-min steps), a soft switch row, **soundscape toggles** (Rain / Singing bowl / Soft noise — visual-only, pressed-in + lit dot when on), Dark/Light segmented theme (`useDeviceTheme`, persisted `still-theme`), About row → toast. |

## Interactions

- **The orb** — one 100 ms heartbeat drives elapsed time; the current
  phase is derived (not stored), so the scale transition, countdown digit,
  phase label and cycle track all agree. `--orb-scale` + `--orb-travel`
  CSS vars feed a single `transition: transform var(--orb-travel)
  ease-in-out` — the ONE place long motion belongs (4-8 s breaths).
  Pausing freezes mid-travel; finishing ≥ 20 s credits
  `addQuietMinutes(elapsed/60)` and toasts.
- **Phase pulse** — a span keyed by `cycles-phaseIndex` re-mounts on every
  phase change and runs one expanding, fading `st-pulse` ring animation.
- **Press = carve** — every tappable surface (intention, reco cards, pills,
  segments, discs, nudges, sounds) swaps `--shadow-1/2` → `--shadow-inset`
  plus a slight scale-down; nothing uses outlines or borders.
- **Completion state** — session discs, row checkmark, Profile session
  count and minutes all flow from `StillProvider` (persisted).
- **Staggered rise** — the active view remounts (`key={view}`); blocks
  carry `--stagger` delays (40-60 ms apart) on `st-rise`.
- **Theme** — segmented control flips `.device[data-theme]` only (page
  never darkens); the whole slab re-sculpts (light theme = classic
  `#e0e5ec` blue-gray with the rgba(163,177,198) shadow pair); persisted
  as `still-theme`.
- **Swipe** — horizontal drag navigates the four tabs (`useSwipeSimulation`).
- All state persists: `still-completed-v1`, `still-stats-v1`,
  `still-prefs-v1`, `still-pattern-v1`, `still-theme`.
- **Reduced motion** — entrances/pulses stop, but the orb keeps its
  rhythm as **discrete steps**: transitions are removed so each phase
  change snaps the orb to its scale (phase stays fully legible), and the
  countdown/track keep updating.

## Files

| File | What it is |
|------|------------|
| `app/prototypes/still/layout.tsx` | Imports tokens.css + styles/index.css + `still.css`; metadata "Still — ANDROID-PROTOTYPE". |
| `app/prototypes/still/page.tsx` | Client shell: DeviceThemeProvider (`still-theme`, initial dark) → StillProvider → Stage panels → DeviceFrame (`style="neumorph"`) → `.st` app root (hash-routed screens, toast, `BottomNav variant="soft"`); swipe wiring; side-panel MiniBar/kvlist helpers. |
| `src/prototypes/still/still.css` | ONE stylesheet, everything scoped under `.st` (plus `.device` resets and stage-panel helpers): extrude/carve aliases (`--st-ridge`, `--st-carve`), quiet headers, streak disc, intention + pillow cards, the orb (radial-gradient face, scale transition, pulse), carved tracks/segments, program rows + play discs, profile toggles/steppers, toast, stagger + reduced-motion blocks. |
| `src/prototypes/still/lib/data.ts` | Breath patterns (phase lists → cycle math), 10 sessions × 3 programs, length filters, `formatClock`/`greeting`/`intentionOfDate` (deterministic per-day intention line). |
| `src/prototypes/still/state/still-context.tsx` | Central provider (bloom/wallet pattern): completed set, streak + quiet-minutes stats, now-breathing pattern, prefs (soundscapes, reminder), toast channel — all persisted through `loadJson/saveJson`. |
| `src/prototypes/still/components/icons.tsx` | Inline stroke-SVG set (sun/breathe/library/user, play/pause, ±, check, bell, rain/bowl/waves, leaf, info). No emoji. |
| `src/prototypes/still/components/toast.tsx` | Carved soft pill snackbar reading the provider's toast channel. |
| `src/prototypes/still/screens/*.tsx` | `today-screen`, `breathe-screen`, `sessions-screen`, `profile-screen`. |

## Non-obvious decisions (for future agents)

- **The orb derives, never stores, its phase.** Elapsed seconds are the
  only run truth; scale target, travel time, countdown and track position
  are pure functions of `(pattern, elapsed)` — pattern switches mid-run
  can't desync anything.
- **Travel = phase length.** The scale transition duration equals the
  active phase's seconds, so the orb reaches full size exactly as the
  hold begins. This is the single sanctioned place for multi-second
  motion; all UI chrome stays at `--dur-2/3` (200-300 ms).
- **Holds inherit the previous moving phase's scale** (look backwards over
  the ring), which is what makes Box read as four corners rather than two.
- **Copper (--color-primary) is rationed** — track fill, lit dot, avatar
  glyph, toast icon — because the brief is calm; the style doc's "one warm
  accent carries all emphasis" is intentionally under-used here vs the
  music-player demo.
- **`.st` app-root pattern** (like bloom's `.bl`): absolute fill inside
  `<Screen>`, views keyed for remount, toast/nav absolutely positioned;
  proto-kit status bar (z 30) stays above content, toast matches z 30.
- **Breathe's finish threshold is 20 s** so accidental taps never
  pollute the streak stats; anything shorter just says "Session set down".
- **No TopBar import at all** — if a future agent reaches for
  `TopBar variant="large"`, resist: the chrome variety here (centered
  micro-label / none) is the point.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/still/
