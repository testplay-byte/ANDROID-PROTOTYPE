# Still (Neumorphism · meditation & breathing companion)

A meditation app prototype in **neumorphism** — the repo's soft-UI
language taken somewhere quiet and sculptural (the deliberate contrast to
the neumorph Music Player gadget): one molded single-tone slab, dual-shadow
extrusion everywhere, presses that **carve into** the surface, and a copper
accent used almost silently. The centerpiece is a full-bleed Breathe screen
whose extruded orb *is* the start/pause control and slowly scales with the
selected pattern (box 4-4-4-4 / calm 4-7-8 / ocean).

**Style:** Neumorphism (`style="neumorph"`). `DeviceThemeProvider
storageKey="still-theme"`, initial dark — theme scoped to `.device`.
Chrome: proto-kit `BottomNav variant="soft"`, **no TopBar** (quiet centered
micro-labels; Breathe has none).

## Screens

1. **Today** (`#today`) — centered label + time-aware greeting, extruded
   streak disc with carved well, "today's intention" slab, three
   pillow-soft recommendation cards that sink in on press.
2. **Breathe** (`#breathe`) — pattern pills (active carved in), the
   breathing orb (phase-tracked scale, slow ease-in-out, per-phase ring
   pulse, start/pause on the orb itself), carved cycle track, cycles +
   elapsed, finish credits quiet-minutes.
3. **Sessions** (`#sessions`) — segmented length filter in a carved
   trough, library grouped by program, extruded play discs that complete
   sessions (persisted checkmarks, minutes credited).
4. **Profile** (`#profile`) — stats pills, daily-reminder ± stepper in a
   carved time well, reminder switch row, soundscape toggles (rain/bowl/
   noise, visual-only), Dark/Light segmented theme, About → toast.

## Notes for agents

See `navigation.md` in this folder — especially the "orb derives, never
stores, its phase" decision, why `--orb-travel` equals the phase length
(the only sanctioned long motion), and the rationed copper accent.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/still/
