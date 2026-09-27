# drift — navigation

## What this prototype is

**"Drift"** — a podcast & audio player built as the repo's **glassmorphism
color-discipline showcase** (`DeviceFrame style="glass"`). The brief: glass
panels must never gray out the color — every surface is milky low-alpha
white glass (0.10 → 0.22, blur 14–28px + saturate 1.6, luminous 1px hairline,
top light-catch + bottom inner shade + real float shadows) floating over a
**fixed vivid mesh-gradient backdrop whose hue rotates per tab**: dawn amber
(Listen) → sea teal (Browse) → dusk magenta (Player) → forest green
(Library). Warm-led, never a generic blue. Cover art is fully generative
(inline SVG gradient mesh + seeded waveform bars + motif emblem per show).

Four tabs, a persistent mini-player glass bar above the proto-kit
`<BottomNav variant="glass">` dock, and a floating glass **header pill**
instead of a large-title top bar — content scrolls under it.

## Screens

| Screen | View id | Contents |
|--------|---------|----------|
| Listen | `#listen` | Featured hero: full-bleed generative Golden Hour cover fading into a blurred glass veil, play-latest + follow buttons, episode line. Continue-listening card with live tinted waveform + clock pair. 2-col grid of eight shows (generative covers, hover-lift + play badge). Cards jump to Browse with that show open. |
| Browse | `#browse` | Warm amber category chips (All / Culture / Science / Tech / Wellbeing / Stories) filtering three horizontal snap rows (Editor's picks / Wind down / Long-form stories). Tapping a row card opens an in-place glass show-detail panel: rim + cover, follow toggle, play-latest, episode list (play/pause, per-episode download, inline progress thread on the live row). |
| Player | `#player` | The showcase: big cover on a breathing accent glow, glass scrubber panel (34-bar live waveform + click/drag-to-seek slider with glowing knob + tabular times), transport (−15s / prev / play-pause / next / +30s), segmented speed picker (1× / 1.25× / 1.5× / 2×, persisted), sleep-timer chips (Off/15/30/45/60, persisted — pauses at end of episode), download toggle. |
| Library | `#library` | Segmented glass section picker — Downloads (episode rows with live delete toggles + total-hours stat), Following (per-show unfollow/follow + play), History (resume-from-progress rows with tinted threads, Clear button). Every section has a glass empty state. |

## Interactions

- **Playback engine** — `setInterval` tick in DriftProvider advances progress
  by the current speed every second; the mini-player line, the continue card,
  episode threads, the scrubber and the waveform tint all stay in lockstep.
  Episode end auto-advances to the next episode of the show (toast).
- **Seek** — pointer down/move/up on the scrubber rail: click-to-seek +
  live drag (pointer capture, `touch-action: none`). −15/+30 buttons jump.
- **Mini → Player** — the mini glass bar rides above the dock on every tab
  except Player; tapping it routes to `#player`, the rise-in keyframe makes
  the hand-off read as one object growing into its full screen.
- **Play/pause anywhere** — hero button, continue card, every episode row,
  the mini bar and the player all drive the same state; the live row
  swaps play→pause glyph and grows a progress thread.
- **Downloads / subscriptions** — toggles persist (`drift-downloads-v1`,
  `drift-subs-v1`); Library reflects them live; toasts confirm (glass pill,
  modal-rung 28px blur).
- **Scene rotation** — `data-scene` on `.dr` cross-fades the whole backdrop
  (900ms) + orbs keep drifting (`dr-float`); grain tile caps banding.
- **Staggered entrances** — views remount with `key={view}`, blocks rise
  with per-index `--stagger`; press = scale 0.94; hover lift on cards/rows
  (pointer: fine).
- **Theme** — DeviceThemeProvider `storageKey="drift-theme"` flips
  `.device[data-theme]` only. Light theme = pastel-washed scenes +
  near-opaque frost + solid dark ink (≥8:1); dark theme = deep vivid
  scenes + milky glass + white ink.
- **Swipe** — horizontal drag navigates the four tabs (`useSwipeSimulation`).
- Prefs (speed, sleep), now-playing position, downloads, follows and history
  persist in localStorage (`drift-*`); playback never autostarts on reload.

## Files

| File | What it is |
|------|------------|
| `app/prototypes/drift/layout.tsx` | Imports tokens.css + styles/index.css + `drift.css`; metadata "Drift — ANDROID-PROTOTYPE". |
| `app/prototypes/drift/page.tsx` | Client shell: DeviceThemeProvider (`drift-theme`, initial dark) → DriftProvider → Stage panels → DeviceFrame (`style="glass"`) → `.dr` app root (data-scene, ambient, header pill, screens keyed by hash view, mini-player, BottomNav `variant="glass"`, toast, live region); swipe wiring; side-panel MiniBar/kvlist helpers. |
| `src/prototypes/drift/drift.css` | ONE stylesheet, every selector scoped under `.dr` (plus `.device` status-bar integration and stage-panel helpers): theme contract (§1), four vivid tab scenes (§2), the glass recipe + rim tiers (§3), shell/header (§4) and per-screen sections (§5–9), motion + fallbacks (§10). |
| `src/prototypes/drift/lib/data.ts` | 8 shows × 3–4 episodes with per-show vivid palettes/accents/motifs/seeds; categories; clock/min formatters; FNV-1a + mulberry32 PRNG + `waveformHeights` for deterministic generative art; `findEpisode`/`neighborEpisode` helpers. |
| `src/prototypes/drift/state/drift-context.tsx` | Central provider (bloom pattern): now-playing with ticking progress, speed/sleep prefs, downloads, subscriptions, history, toast; all persisted under `drift-*` keys. |
| `src/prototypes/drift/components/icons.tsx` | Inline SVG icon set (headphones, compass, wave, stack, transport, download/heart/moon/search…). No emoji anywhere. |
| `src/prototypes/drift/components/cover-art.tsx` | Generative SVG covers: palette radial mesh + soft blobs + seeded waveform band + six motif emblems; scales 40→252px. |
| `src/prototypes/drift/components/waveform.tsx` | Animated bar strip — seeded heights, accent tint up to the played fraction, `dr-bar` pulse while playing. |
| `src/prototypes/drift/components/chrome.tsx` | Floating glass chrome: header pill (brand mark + title + search/avatar), mini-player bar (cover, meta, line progress, play), toast pill. |
| `src/prototypes/drift/components/episode-row.tsx` | Shared episode row (Browse + Library): play/pause, live thread, download toggle. |
| `src/prototypes/drift/screens/*.tsx` | `listen-screen`, `browse-screen` (+ in-place ShowDetail), `player-screen`, `library-screen`. |

## Non-obvious decisions (for future agents)

- **Color discipline is the design.** Glass fills are *pure milky white*
  alphas (0.10/0.14/0.18/0.22) — never blue-tinted whites — so the tab's
  scene hue and each show's palette read THROUGH the glass. Accents come
  exclusively from content (`--ep-accent`, set per instance inline from
  `show.accent` / row tints), never from a generic primary. Scenes are
  warm-led: amber, teal (green-cyan, not sky blue), magenta, forest.
- **Layered glass tiers (glass.md layering rule)**: dock+mini+toast = nav
  tier (0.22 fill, 24–28 blur, rim, shadow-2) · hero/detail/scrubber =
  hero tier (rim + shadow-2) · cards/rows = content tier (0.14, no rim,
  shadow-1) · chips = 14px blur rung. Inner controls (follow pill, head
  buttons, segmented pills) use *higher fill without backdrop-filter* —
  glass is never stacked on glass. The hero's only blur layer is its
  bottom veil (it blurs the artwork INTO the panel); the hero frame itself
  carries no backdrop-filter for the same reason.
- **Glass-on-glass avoided on the hero by construction** — `.dr-hero` is a
  plain floating frame (overflow-hidden + shadows + rim), the `.dr-glass`
  class would double-blur there and was deliberately not applied.
- **The dock is proto-kit `BottomNav variant="glass"`** (nav-variety
  requirement: no custom dock, no large-title TopBar). It's re-toned to
  Drift's milky ladder via `.device .dr [class*="bottomnav"]` overrides
  (CSS modules hash class names → suffix-match), sitting with the
  mini-player as one paired floating layer (dock `bottom:16`, mini
  `bottom:84`, content reserves 208px).
- **prefers-reduced-transparency is deliberately NOT honored** — the same
  documented decision as weather-app and wallet: this machine reports the
  flag by default (Windows transparency off), and a glass prototype
  rendered solid is no glass prototype at all. drift.css re-asserts the
  recipe (incl. proto-kit's own vGlass fallback) under that flag. An
  explicit `prefers-contrast: more` signal DOES solidify everything
  (opaque `--color-surface-solid` twin), and engines without
  `backdrop-filter` get an opaque tinted twin via `@supports not` — both
  paths keep text at AA.
- **Contrast model**: dark scenes are DEEP SATURATED bands (burnt orange,
  sea, plum, forest — vivid hue, low luminance) with a fixed tinted
  **scene scrim** (§2 `.dr-bg__scrim`) flooring the scroll-column
  luminance; white body + .86 muted text over the milky 0.10–0.22 fills
  clear AA through every tier even at the worst orb overlap (verified
  numerically: muted ≥4.5 on S2 and S4). Vivid brightness lives in
  saturated hues + corner orbs + cover art — never behind body copy;
  `--dr-ink-ghost` is reserved for chrome (lines, knobs). Hero titles sit
  on an inked veil that darkens the art behind them; light theme mirrors
  this with near-opaque frost and solid `#414c63`/`#141225` ink. Play
  buttons use the show's accent with dark ink (`color-mix … + #fff`,
  `#231404` text) — never white-on-accent.
- **Sleep timer semantics**: chips persist the choice; in the demo the
  timer fires at end-of-episode (pauses instead of auto-advancing) —
  a minute-accurate countdown would be invisible at prototype pace.
- **History stores only episode ids**; "resume at %" is derived — the
  live entry from its real progress, past ones from a deterministic 72%
  heuristic. Clear is real (empties + persists the list).

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/drift/
