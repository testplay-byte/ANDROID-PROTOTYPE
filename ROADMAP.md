# ROADMAP.md — ANDROID-PROTOTYPE expansion plan

> **Read this if you are picking up the project mid-stream.** It records the decisions the
> user made on 2026-09-28 and the phases that follow from them. `STARTUP.md` explains the
> repo; this file explains *where it is going and why*.
> Status markers: `[ ]` todo · `[~]` in progress · `[x]` done.

---

## The direction

The project began as a **mobile** UI prototype workspace (23 phone prototypes across 11
design languages, Next.js static export, GitHub Pages). It is becoming a **multi-surface**
UI prototype workspace with a design system strong enough that any AI agent can build
beautiful, adaptive prototypes quickly — with native (Kotlin / Swift) as the eventual
destination, not the current work.

Two hard principles the user has stated:

1. **Mobile and desktop are separate systems, not one resizable thing.** A desktop app is
   never "a phone that got wider" — its navigation, density, and interaction model are
   genuinely different. They share *design languages, tokens, and quality rules*, never
   *layouts or interaction patterns*.
2. **Everything must be adaptive.** Prototypes must hold their layout, spacing, and
   smoothness across every supported size — phone 360→430, tablet, desktop, and the
   dashboard's own breakpoints — without breaking.

---

## Locked decisions (user, 2026-09-28)

### Surfaces and sizing
- **D1 — Device sizing is presets + custom W/H**, stored in the existing
  `proto-kit/device-settings` store (global, persisted, applied to every prototype),
  surfaced in the existing Settings page. Presets: Compact / Standard / Large, plus
  custom width and height.
- **D2 — Surface abstraction with separate prototypes.** proto-kit gains an explicit
  `phone | tablet | desktop` surface concept. Desktop prototypes are their own routes and
  folders with their own layout patterns. They are never reachable by "switching" a
  mobile prototype to desktop.
- **D3 — Desktop chrome is app-style by default** (sidebar rail or top nav + wide
  content canvas, inside a rounded desktop window). OS window chrome (traffic lights,
  title bar) is an opt-in prop.
- **D4 — Tablet is the desktop surface at tablet sizes** (e.g. 834×1112 portrait /
  1112×834 landscape), framed as a device with a bezel. Same layout system as desktop.

### Dashboard
- **D5 — The Prototypes section gets a surface switcher** (Phone / Tablet / Desktop)
  above the existing family-sheet raster. The top half of the dashboard (hero, stats,
  bars, donut, CTA) is unchanged and stays as-is.

### Prototypes
- **D6 — Guidelines first, then an audit pass across all 23 mobile prototypes** at
  360 / 390 / 430, fixing real breakages. New prototypes are adaptive from day one.
- **D7 — First desktop batch: one deep reference prototype** (teaches the patterns) plus
  **two more** covering different languages (HIG desktop, Carbon enterprise).

### Design system and agents
- **D8 — One authoritative spec** (`docs/SPEC.md`) for tokens, surfaces, components,
  adaptivity, and the targeting convention. Superseded docs are marked and pruned;
  contradictions are resolved once, in the spec.
- **D9 — Targeting = convention + per-file style index.** Every prototype stylesheet has a
  fixed section structure with a comment index (section name + line number) at the top,
  plus a strict class-naming convention. One element = one file, one predictable place.
- **D10 — Verification is automated + visual review.** A script checks every prototype
  headlessly at the supported widths for horizontal overflow, clipped content, and
  forbidden CSS patterns, and captures screenshots. Agents get a pass/fail gate before
  the user reviews.
- **D11 — Token bridge now, native build later.** Token names stay platform-neutral and a
  token→Compose/Swift mapping is documented, so a future native prototype consumes the
  same source of truth.

---

## Phases

### Phase 1 — Sizable phones (D1) `[x]`
- `device-settings`: `size` (preset id) + optional `customW` / `customH`, sanitized,
  persisted, cross-tab synced — same store pattern as the cutout settings.
- `DeviceFrame`: read size settings, expose `--device-w` / `--device-h` / `--device-radius`
  on `.device`, keep the ≤480px fullscreen override (fullscreen still wins).
- Settings page: size preset chips + custom width/height inputs, with a live preview.
- **Done when:** changing the size resizes every prototype live, persists across reloads,
  and the fullscreen/mobile override is unaffected.

### Phase 2 — Surface abstraction + desktop chrome (D2, D3, D4) `[x]`
- `proto-kit/surface/`: `Surface` type + `SurfaceFrame` (wraps the device window),
  desktop window chrome (optional traffic lights), desktop nav components (rail, top bar).
- Phone prototypes keep using `DeviceFrame`; the frame reads its size from settings.
- **Done when:** a desktop prototype renders inside a desktop window with rail/top-nav
  chrome, and tablet renders the same surface at tablet dimensions.

### Phase 3 — Desktop prototypes (D7) `[x]`
- One reference desktop prototype (deep, teaches sidebar + data table/grid + command
  surface + adaptive density).
- Two more: a HIG-language desktop app and a Carbon enterprise dashboard.
- Each registered in the gallery, `navigation.md`, and its design-language doc.

### Phase 4 — Dashboard redesign (D5) `[x]`
- `GalleryItem` gains `surfaces: Surface[]`; thumbs per surface.
- Surface switcher above the family-sheet raster; the sheet packing adapts to the
  surface's natural card aspect. Top half untouched.

### Phase 5 — Spec + docs consolidation (D8, D9) `[x]` — `docs/SPEC.md` is authoritative; the older docs now defer to it and their ten known contradictions are resolved
- `docs/SPEC.md`: tokens, surfaces, component inventory (per language), adaptivity
  rules, the targeting convention, and the add-a-style / add-a-surface recipes.
- Resolve the 10 known contradictions; mark superseded docs; shrink the mandatory
  reading path.
- Per-file style index convention documented and adopted.

### Phase 6 — Adaptivity + verification (D6, D10) `[x]` — `scripts/verify.mjs` is the gate and all 26 prototypes pass at 360/390/430 (phone) and 1280/1000/760 (desktop)
- `scripts/verify.mjs`: per-prototype checks at 360 / 390 / 430 (phone) and the desktop
  width — horizontal overflow, clipped content (`scrollHeight > clientHeight` on
  non-scrollable elements), forbidden in-device CSS (vh/vw, fixed-px grid track
  minimums), plus screenshot capture.
- Audit pass over the 23 mobile prototypes; fix real breakages only.

### Phase 7 — Native bridge (D11) `[x]` — `docs/native-bridge.md` maps every token to Compose / SwiftUI and names the gaps (glass, neumorphism)
- `docs/native-bridge.md`: token → Compose / SwiftUI mapping, and what a native
  prototype consumes from this repo. No native build in this phase.

---

## Round-2 review outcomes (2026-09-28, all shipped)

| Ask | How it landed |
|---|---|
| URLs must name the surface | `/prototypes/<slug>/<surface>/` via `_registry.ts` + `useCanonicalSurface` |
| Desktop chrome: minimize / maximize-restore / close | real window buttons in `SurfaceFrame`, closed state with Reopen |
| Live customizability | 8 drag handles, size persisted per prototype |
| Fullscreen from the prototype | bottom-left button, real Fullscreen API |
| Phones must not squash a desktop app | wrong-surface notice under 520px, per surface |
| Scrollbars are part of the language | token-driven thin scrollbars on tablet/desktop; phone stays clean |
| Desktop looks too bubbly | the desktop surface tightens the radius scale; tablet keeps phone radii |
| Quick surface switch on the prototype page | `<SurfaceSwitcher>`, bottom-right, only when a prototype has >1 surface |

## Rules that hold across every phase

- Prototypes stay **separate per surface** — never one prototype stretched to another.
- New prototype CSS follows the **section structure + comment index** (D9).
- Every change is **verified at each supported size** before the user sees it.
- `navigation.md` in every touched directory is updated **in the same commit**.
- The **ntfy** notification on `TASK808DONE` still closes every task.

## Open questions / future decisions

- Whether desktop prototypes get their own gallery view or share the switcher (D5 covers
  the first pass; revisit after Phase 4).
- Native build order (Compose vs SwiftUI) — deferred until Phase 7.
