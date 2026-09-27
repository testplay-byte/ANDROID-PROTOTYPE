# CHANGELOG

> Running log of notable changes to the repository.
> Append a new entry at the top (newest first) for every task you complete.

---

## [Unreleased]

### 2026-09-28 — prototype expansion batch 3: Nook (minimal), Atlas (bento), Hop (flat)

Three sub-agents (relaunched with finish/repair briefs after a network failure killed the
first dispatch mid-build — they continued around the partial files on disk). Completes the
expansion program: every non-M3/HIG style now has two prototypes.

**Nook (minimal)** — typographic reading journal: pure monochrome (ink-as-primary, zero
color), serif title treatments, 1px hairline progress rules, a real reader with
scroll-driven progress + immersive tap-to-hide chrome + paragraph highlighting, a
hairline goal ring, and a TEXT-ONLY bottom tab row (no pill, no large title — the
chrome-variety mandate taken to its minimal extreme).

**Atlas (bento)** — travel trip planner: tile sizes encode frequency of use, generative
CSS landscape art per destination (procedural ridges + sun), tap-any-tile full-screen
morph, per-trip packing bento with accent-fill cells, header-as-tile + equal-cell nav row
(chrome grows from the grid instead of the floating pill).

**Hop (flat)** — food delivery, Flat Design 2.0: screens open ON solid cuisine colour
planes, four edge-to-edge tab segments with an inverted active block, coral dot traveling
a 1px rail through the live order stepper, flying-square cart adds, block-stepper
checkout; grep-audited zero box-shadow/gradient/backdrop.

Coordinator fixes during integration: Hop search screen spread `kb.inputProps` (the
`useKeyboardInput` hook returns the props directly) → `{...kb}`; two copy/logic nits the
Hop agent fixed in the pre-existing partial files. Registered all three in the gallery
(entries + custom thumbs), prototypes index, README catalog; demo sections added to
minimal.md, bento.md, flat.md. `tsc --noEmit` + `npm run build` clean (25 routes).

### 2026-09-28 — prototype expansion batch 2: Pulse (carbon), Still (neumorph), Simmer (clay)

Three sub-agents built in parallel (efficiency-briefed: read once, write in big passes,
no build/screenshot loops); coordinator integrated + built centrally.

**Pulse (carbon)** — system-status dashboard, deliberately unlike finance-hub's consumer
fintech: flat 48px enterprise header (blue logo square + bordered health pill) and an
underlined Carbon tab strip instead of TopBar/floating pill. Blinking DOWN squares,
ack/resolve incident flow with expandable timelines (persisted — repaints the overview
grid), deterministic seeded 24h charts that rescale under a 1H/6H/12H/24H selector, and a
real Comfortable/Compact density toggle resizing rows app-wide. 0 radius / 0 shadow /
tabular-nums discipline grep-audited. Coordinator fix: missing `DEFAULT_RESOLVED` import
caught by the central typecheck.

**Still (neumorph)** — meditation & breathing companion: the extruded orb IS the
start/pause control, its scale traveling over exactly each phase's seconds (box / 4-7-8 /
ocean patterns, phase derived from elapsed time so switches can't desync); every press
carves into the molded slab; Breathe is headerless (full-bleed focus); sessions complete
with persisted checkmarks + quiet-minutes credit; copper accent stays almost silent.
47 dual-shadow extrusions, no borders.

**Simmer (clay)** — recipes & cooking companion: generative CSS dish art (seeded clay
blobs + steam per recipe), recipe detail push with live serving-stepper quantity scaling
and press-in step blobs, a 5-day meal plan that auto-derives an aisle-grouped shopping
list, and a chunky clay countdown dial (SVG ring drains inside the puffy face). Light
theme is the contrast reference: text only on >=5.2:1 tokens with deepened accent inks
under `[data-theme="light"]` — no pale-on-pale.

Registered all three in the gallery (entries + custom thumbs), prototypes index, README
catalog; demo sections added to carbon.md, neumorph.md, clay.md.
`tsc --noEmit` + `npm run build` clean (22 routes).

### 2026-09-27 — prototype expansion batch 1: streetwear-store + gallery-app overhauls, Drift (glass) added

Three sub-agents built in parallel; coordinator integrated + built centrally.

**Streetwear Store (brutalism) — reworked to spec.** The old demo was thin (111 CSS
lines) and violated its own style (rounded corners). Now: 0px radius everywhere
(grep-audited), 2-3px ink borders on every container (66×), hard zero-blur offset
shadows (62×) + inset pressed states with translate, poster composition (Arial-Black
display type, numbered sections, marquee ticker, rotated -2° sticker badges, diagonal
SOLD OUT bands), colorway picker, promo codes (BRUTAL10/DROP07) wired to the proto-kit
on-screen Keyboard, favorites/cart/currency/default-size all persisted, cart slab with
free-shipping progress + checkout flow. 26 files, ~2.1k CSS lines.

**Gallery App (bauhaus) — reworked to spec.** Now: 3 exhibitions + 12 artworks with
data-driven generative CSS geometry (12 clip-path/ring motifs, no bitmaps), numbered
exhibition list → detail push → full-screen **plate view** whose triad chips re-ink the
artwork live, date-chip ticket booking with live EUR summary + ADMITTED stamp, persisted
favourites, German-localised chrome. Spec discipline verified: red primary on every
action, ZERO box-shadow anywhere, 2px ink borders throughout, near-square radius scale.
Chrome experiment: the Collection screen drops the TopBar for a bordered segmented
index strip. 31 files, ~2.4k CSS lines.

**Drift (glass) — NEW podcast/audio prototype.** The glass color-discipline showcase:
glass fills are pure milky white alphas (0.10–0.22) — all hue comes from a vivid mesh
backdrop that rotates per tab (dawn amber → sea teal → dusk magenta → forest green,
zero blue-purple defaults), text contrast computed via a WCAG model over the scene
geometry (≥4.5:1 all tiers, both themes). 4 tabs (Listen/Browse/Player/Library):
generative cover art, live waveform + draggable scrubber, speed + sleep chips,
mini-player docked above the glass nav, persisted downloads/subscriptions/history.
Reduced-transparency deliberately not honored (same documented call as weather/wallet);
prefers-contrast + no-backdrop-filter get opaque AA twins. 16 files.

**Coordinator fixes:** gallery-app page imported `../../../proto-kit` (wrong depth —
build error) → corrected to `../../../src/proto-kit`. Registered Drift in the gallery
(entry + custom thumb), prototypes index, README catalog; refreshed streetwear/gallery
gallery copy; demo sections added to brutalism.md, bauhaus.md, glass.md.
`tsc --noEmit` + `npm run build` clean (19 routes).

### 2026-09-27 — prototypes: PC back-to-dashboard button

`<Stage>` (proto-kit) now renders a fixed top-left **Dashboard** pill on
every prototype page — same recipe as the dashboard's own nav buttons
(12px pill, card bg + border + shadow, backdrop blur, 36px icon button,
label collapses <640px), using stage tokens so it adapts to the device
theme. Links `../../` → the gallery root. Hidden on mobile (≤1024px),
where the device fills the screen. Zero per-prototype wiring.

### 2026-09-27 — device settings refinements (user feedback pass)

- **Punch size works in both positions** (center and left) — the large dot
  is no longer center-only.
- **One size group at a time:** the settings page now shows pill size only
  for the center pill and punch size only for the punch hole — no more
  grayed-out pairs.
- **Left pill reworked:** much narrower (30×16, ~2-3 punch holes), tucked
  in from the edge and sitting slightly lower; the clock gets extra
  clearance so it no longer hugs the left edge.
- **Mobile status row nudged down** 6px in fullscreen (≤480px) so the time
  + icons clear the OS edge.
- **Live preview on mobile crops to the device's top section** (the part
  the settings affect); PC keeps the full preview.

### 2026-09-27 — system pass: device settings page, fullscreen status bar, dashboard fonts, Bloom reference prototype, search-page + template removal

Four coordinated improvements across the whole system:

**1. Device settings (new `app/settings/` + `src/proto-kit/device-settings/`).**
The dashboard top-right now has a Settings button (Repo · Settings · theme).
The page configures the camera cutout every prototype's StatusBar renders —
live preview + radio groups, persisted to `proto-kit-device-settings-v1`:
- **Cutout:** punch hole (default) · pill (Dynamic Island) · notch (center only).
- **Position:** center · left (the clock shifts right to clear it; left+notch
  falls back to punch; a left pill is automatically much smaller).
- **Pill size:** compact · wide — height fixed at 24px, width-only change.
- **Punch size:** normal (13px) · large (17px).
Mechanics: module-level observable store (localStorage + custom event +
cross-tab `storage` sync); `<StatusBar>` applies variant classes and mirrors
`data-cutout*` onto `.device`; morph transitions only arm after first
settings application (no punch→pill animation on every prototype load).
Prototypes need zero wiring — it's automatic via DeviceFrame.

**2. Fullscreen status bar fix.** The bar no longer pads itself down by
`env(safe-area-inset-top)` in fullscreen — the time + icons + cutout now
share one fixed 36px row centered at the very top (the clock had been
sitting visibly low).

**3. Dashboard fonts on Android.** The dashboard + settings pages never
loaded Inter (system-stack fallback → thin Roboto cuts on Android, so
headings read un-bolded vs the prototypes). Inter 400–900 is now
self-hosted via `next/font` in `app/layout.tsx` (`--font-inter`), consumed
by `dashboard.css` + `globals.css`. Verified computed font on the page.

**4. Bloom — the new canonical M3 reference (replaces "Starter Template").**
A plant-care companion (4 tabs: Home/Water/Guide/Profile) built by a
sub-agent on the modern proto-kit pattern: generative SVG plant art
(7 shapes × 6 pots), mount-animated thirst rings, M3 bottom sheets,
droplet-ripple schedule checks, accordion guide with working category
chips, persisted prefs. Registered in the gallery (status `reference`) +
custom mini-thumb. Fixed during review: profile-screen JSX brace errors,
guide chip row collapsing (missing `flex:0 0 auto` on an `overflow-x`
column-flex child). Docs: `app/prototypes/bloom/navigation.md` + README.

**5. Removals.** `search-page` (duplicate of anime-app's search) and the
legacy static `public/prototypes/_template/` deleted outright. All
references repointed to `bloom` across STARTUP/README/navigation/
agent-quickstart/template-rules/prototype-blueprint/workflow/theme-architecture/
repo-map/proto-kit README/templates nav/design-systems docs; M3 spec docs
now point at the archived static original (`archive/legacy/search-page/`)
for their verbatim token provenance. anime-app comments that referenced
search-page made self-contained.

Verified: `tsc --noEmit` + `npm run build` clean (18 routes); settings
rules exercised in-browser (notch↔left fallback, compact width-only,
punch large, cross-page propagation to the wallet); Bloom home/guide +
sheet/water flow + toast checked in light+dark; dashboard Wallet/Bloom
cards render.

### 2026-09-27 — wallet: finalized the Liquid Glass prototype (finish + docs pass)

Completed the in-progress Wallet prototype (Apple Wallet–style passes &
payments in the iOS 26/27 Liquid Glass language on the `hig` style) and
finalized it for review:

- **Fix — glass was invisible on this machine:** the a11y fallback keyed on
  `prefers-reduced-transparency: reduce` forced every glass surface opaque
  (Windows transparency effects off ⇒ the flag is on here), erasing the
  whole design language for the reviewer. The fallback now honors only
  `prefers-contrast: more` — the same deliberate call weather-app made for
  its glass rebuild. Verified live: the tab bar computes
  `blur(28px) saturate(1.8)` with translucent fill again.
- **Polish:** side-panel "Pass" mini-bar now shows the active pass name
  (was a duplicate of the Glass value).
- **Verified end-to-end in the browser:** pass stack tap-to-front (front
  card + balance + recent-activity follow), pay flow (keypad → "Pay
  $12.50" → Face ID processing → toast → txn appended to Activity on the
  right pass), activity search (filter + empty state), Clear ↔ Tinted
  density + Dark/Light (both persisted; `wallet-prefs-v1` / `wallet-theme`),
  Default Card → Passes nav, switches, nav-bar collapse on scroll, swipe
  tabs; light + dark themes screenshot-checked.
- **Docs:** new `app/prototypes/wallet/navigation.md` (screens,
  interactions, files, non-obvious decisions — incl. why Liquid Glass is
  prototype-scoped and the reduced-transparency call) + `README.md`;
  registered in the `public/prototypes/navigation.md` index, the README
  catalog and `docs/design-languages/hig.md` demo section. Dashboard
  gallery entry + mini thumb (fanned pass stack) finalized.
- `npm run build` + `tsc --noEmit` clean; wallet route exports.

### 2026-09-27 — weather-app: polished dock — sliding active pill + nav-layer glass

- The active pill is now one element (`.dock-ind`) that **slides** under the 4 tabs with a
  spring transition, instead of each tab carrying its own white background; tabs only swap
  ink color and replay the icon bump (`wa-navBump`).
- The dock reads as the navigation layer: boosted glass fill (0.20; 0.15 at night) and a
  heavier blur (`--wa-blur + 6px`, saturate 1.7), also kept alive under the
  reduced-transparency override in `weather-app.css`.
- Micro-interactions: hover lifts the icon, press scales the tab, and the dock rises in
  softly (`wa-dockIn`) as the splash fades.
- Verified on the live preview in a fresh browser tab: indicator present, slides
  Weather → Forecast → Cities, hash and screen state stay in sync.

### 2026-09-27 — weather-app: full rebuild as "Aurora Weather" (1:1 port of the user's reference)

**User direction:** scrap the previous weather-app implementation entirely and recreate the
reference project at `C:\Users\khurr\Desktop\GLASS\DL\aurora-weather` exactly — same look,
animations and functionality; only the shell complies with repo standards.

**What replaced what:** every old file under `src/prototypes/weather-app/` (screens, CSS,
lib, icons) was deleted; the route was rebuilt as a React port of the reference's ES-module
app. Structure is documented in `app/prototypes/weather-app/navigation.md` (read its
"Non-obvious decisions" before touching this prototype):
- 4 backdrop themes (dawn/day/dusk/night, night = device dark mode) painted on `.wa[data-sky]`.
- Deterministic seeded weather engine (12 cities, current + 24h + 7d, cached per city/day).
- Splash → app boot, staggered screen entrances, count-up hero temperature, sun-arc card,
  24h chart (temp/pp/wind), day-detail modal, toast, error simulation, glass blur slider,
  reduce motion, parallax floaters, city search/favorites — all reference behavior kept.
- App-level glass topbar + dock (exact reference ports, incl. white active pill); proto-kit
  provides DeviceFrame/StatusBar/Stage/swipe. Outfit loaded via `next/font`.
- `weather-app.css` deliberately **neutralizes glass.css's `prefers-reduced-transparency`
  fallback** (this machine reports reduced transparency; the reference ignores the flag) —
  do not remove that override.

**Dashboard:** weather-app palette/desc/screens updated to the new design; mini thumb redrawn
(glass hero + white dock pill).

**Verification:** `npm run build` clean; previewed at the basePath copy; home/forecast/cities/
settings + night-mode flip + prefs persistence verified by screenshot and live DOM inspection
against the reference served on :8094.

### 2026-09-26 — Grid view: shared family sheets with dense horizontal packing (user feedback)

**User feedback on the sectioned grid:** the style header on top and the single row of items below were right, but (a) each prototype had its own individual card background instead of one shared surface, (b) the section grid stretched full-width with dead space at the end of the row, and (c) a wrapped item should fill the end of the previous line (closest to its sibling), not start the next line.

**Changes (`src/dashboard/gallery.tsx`, `src/dashboard/dashboard.css`):**
- Each design language is now a **family sheet**: header (hue dot + name + count) at the top, prototypes directly on ONE shared tinted background — individual card backgrounds removed (cells are transparent, hover highlights).
- Sheets are **content-hugging** (`width: fit-content`, `--cols` per family = min(count, 4) set inline) — the sheet ends at its last item, never stretches.
- Sheets **pack horizontally** on a flex row: the next family starts right after the previous family's last item on the same line; a family that doesn't fit wraps as a unit (its items stay together, closest to the previous line's end).
- Small screens (≤640px): families go full-width with auto-fill columns.

**Verification:** `npm run build` + preview screenshots at 1440px (M3 + HIG share the first line) and 800px (families wrap as units, still packed).

### 2026-09-26 — Dashboard grid view: per-style sections restored (user feedback)

**User feedback:** the packed inline-flow grid (style label on the left, prototypes flowing to the right) was rejected. The preferred layout is the earlier one: the style name as a full header line at the TOP of its section with all of its prototypes in a grid directly BELOW it, and column count adapting to display size instead of a fixed number of items per line.

**Changes (`src/dashboard/gallery.tsx`, `src/dashboard/dashboard.css`):**
- Grid view restructured into vertical per-style sections: `.stylesec` with a header row (hue dot + style name + count) on top and a `.stylesec__grid` of cards below.
- Grid is `repeat(auto-fill, minmax(150px, 1fr))` — columns adapt to any display width; no fixed items-per-line.
- Cells restored to the previous card aesthetic: bordered card, 16px radius, mini phone silhouette + name, hover lift + ring + shadow.
- Removed the tinted-cell inline packed-flow styles (`.stylegroup*`).

**Verification:** `npm run build` passes; previewed at the basePath copy — sections, headers, and adaptive columns confirmed by screenshot at 1440px and 800px.

### 2026-09-26 — Style-quality round 2: grouped grid view, HIG overhaul, glass refinement, clay light-mode fix

**Dashboard (grid view grouping — user-requested):**
- Grid view now renders **one tinted section per design language** (`.stylegroup[data-style=…]`
  in dashboard.css): rounded card with a soft background tint derived from the style's
  signature hue (5-9% color-mix), matching border, and a header row (hue dot + style name +
  prototype count). Similar prototypes read as one family; styles never mix in a section.
- Weather palette entry + kids-learning thumb colors updated to the new token values.

**fitness-tracker (Apple HIG) — full quality overhaul:**
- Real iOS type scale (34 Large Title / 22 Title2 / 17 Body / 13 Footnote, as `--ios-*` tokens).
- New `IosNavBar` with large-title → inline-bar collapse on scroll (40px threshold, 320ms).
- True iOS Settings anatomy: inset grouped lists (16px insets, hairline separators inset past
  icon discs, section footers), native 51×31 green switches, "- | +" rounded-rect steppers,
  32px segmented control, outline→filled tab icons, per-ring subtle ring tracks.
- hig.css light `--color-tertiary` corrected to iOS orange #ff9500. Doc: hig.md gained
  typography table, grouped-list geometry, large-title + motion sections.

**weather-app (Glassmorphism) — quality + palette refinement:**
- `.vGlass` nav variant fixed: active pill has ≥16px side padding and never clips labels,
  6px gaps between items, gradient active treatment with inner highlight + glow.
- glass.css re-tuned BOTH themes to the "airy/luminous, never dark-muddy" rule: dark bg
  #131a2e with a brighter surface-alpha ladder (0.09→0.24) and luminous accents; light theme
  brighter frost + darker text. Contrast verified ≥4.5:1 for body/muted text in both themes.
- Screens: larger/softer ambient blobs, even hourly cards, aligned detail tiles, airier
  forecast rows. Doc: glass.md palette + guidance updated.

**kids-learning (Claymorphism) — light-mode legibility fix (dark untouched):**
- clay.css light palette re-derived for contrast: text #262038 (11.6:1 on bg), muted #5b547a
  (≥5.2:1), deeper accents (#6d3fe0 primary etc.), stronger outline + puffy shadows (≥0.28
  alpha or puff reads as blur). Screen fixes: answer labels were white-on-pale (invisible),
  invisible empty stars, subtle-text misuse — all resolved. Doc: clay.md updated with
  contrast notes + the pale-on-pale mistake rule.

**Docs:** hig.md / glass.md / clay.md all reflect the new values; preferences.md §1 records
the grouped grid view. `npm run build` clean; all changed pages screenshot-verified.

---

### 2026-09-26 — Dashboard gallery UX pass: view modes, real mini-thumbnails, symmetric filters, docs consistency

**Fixes & features (user feedback round 2):**
- **Fixed invisible chart bars** — `.bar__fill` is a `<span>` and inline elements ignore
  `height: 100%`, so the "Prototypes by design language" bars rendered empty. Now
  `display: block` (same bug class to watch for in any inline-element fill).
- **Gallery view modes** (`src/dashboard/gallery.tsx`): segmented Grid/Detailed toggle in a
  toolbar with a result count. **Grid view** = simplified symmetric grid, mini phone image +
  name only. Mode persists in localStorage (`gallery-view`) and is deep-linkable via
  `#grid` / `#detailed`.
- **Real mini-thumbnails** (`src/dashboard/thumbs.tsx`): each card/grid silhouette now shows
  a tiny CSS composition of the prototype's ACTUAL home screen (album dial, temp + glass
  chips, brutalist product blocks, bento tiles, activity rings, geometric posters, ...) —
  no more generic placeholder lines. Add a thumb when adding a prototype.
- **Filter chips → symmetric grid**: equal-width chips, 4 per row on desktop (3 tidy rows
  for 12 chips), 2 per row on mobile, centered content, press feedback.
- Screen counts corrected on the dashboard (anime-app 6, setup-wizard 8; totals now 60).

**Documentation consistency pass:**
- README.md: multi-style intro, full prototype catalog, updated structure tree + tech table.
- STARTUP.md: dashboard/ tree entry, registration step now points at `PROTOTYPES` +
  `thumbs.tsx`, §9 lookup rows for the style guides.
- docs/preferences.md §1: codified the new approved dashboard design (view modes, thumbnails
  mirror real home screens, symmetric chips, data-driven gallery rule).
- docs/repo-map.md: src tree now includes gallery.tsx/thumbs.tsx, styles/, top-bar/.
- docs/tech-stack.md + docs/agent-quickstart.md: style-layer row + registration checklist item.
- Not pushed yet, per user decision — will deploy after the next improvement round.

---

### 2026-09-26 — Multi-design-language system: 11 styles, nav/top-bar variants, 10 new prototypes, dashboard rework

**The system is no longer M3-only.** Any agent can now build a prototype in any of 11 design
languages, guided by intent-mapping docs and per-style specs.

**Style system (proto-kit):**
- `<DeviceFrame style="<id>">` sets `data-style` on `.device` — a full token layer per design
  language, both themes, scoped exactly like `data-theme` (see `docs/theme-architecture.md`).
- New styles in `src/proto-kit/styles/`: `hig` (Apple HIG), `carbon` (IBM Carbon), `neumorph`
  (Neumorphism), `glass` (Glassmorphism), `brutalism` (Neo-brutalism), `clay` (Claymorphism),
  `bauhaus` (Bauhaus), `minimal` (Minimalism), `bento` (Bento grid), `flat` (Flat Design 2.0).
  M3 remains the default (no attribute). Each file defines the full token contract documented
  in `styles/index.css` + extensible tokens (`--shadow-1/2`, `--shadow-inset`, `--border-w`,
  `--device-radius`, `--glass-*`).
- `<BottomNav variant>` — 6 style-agnostic variants: `floating` (default), `tabbar` (iOS),
  `labeled`, `glass`, `soft`, `hard`.
- New `<TopBar variant>` component — `large`, `center`, `inline`, `hero`.
- Style-identity blues (HIG/Carbon, bauhaus-secondary) documented as exceptions to the
  no-blue rule in `docs/preferences.md` + `docs/style-selection-guide.md`.

**Docs for agents:**
- `docs/style-selection-guide.md` — intent/vibe/category/reference-app → style mapping,
  choice rules, how to add a new style.
- `docs/design-languages/` — 10 new style specs (palette tables, shape/shadow signature,
  must-use tokens, recommended variants, common mistakes, wiring snippet) + index.
- Updated: STARTUP.md (§5a), agent-quickstart (§3b), prototype-blueprint (Step 1b),
  template-rules (§3 + radius exception), docs/navigation.md, root navigation.md,
  repo-map.md, proto-kit README, public/prototypes/navigation.md.

**New demo prototypes (one per style, all different apps — not reskins):**
| Prototype | Style | What it is |
|---|---|---|
| `music-player` | neumorph | Soft-UI player with simulated playback engine, extruded controls |
| `weather-app` | glass | Frosted glass weather over drifting ambient blobs, multi-city + °C/°F |
| `streetwear-store` | brutalism | DROP 07 shop: hard shadows, live cart badge, checkout flow |
| `finance-hub` | carbon | IBM Carbon banking: layers/borders, spending chart, card freeze |
| `smart-home` | bento | Bento dashboard: thermostat dial, lights, camera, energy tiles |
| `fitness-tracker` | hig | Apple HIG: activity rings, workout timer, iOS grouped lists |
| `kids-learning` | clay | Puffy clay quiz game with star rewards + badge shelf |
| `chat-app` | flat | Zero-shadow messenger with custom keyboard + auto-reply |
| `habit-tracker` | minimal | Monochrome checklist, streaks, weekly heatmap |
| `gallery-app` | bauhaus | Geometric triad posters, favorites, stamped ticket booking |

**Dashboard rework:** `app/page.tsx` rewritten data-driven via `src/dashboard/gallery.tsx` —
filterable prototype gallery (filter chips per design language), style badges, updated stats
and charts. To add a prototype, append one `PROTOTYPES` entry.

**Verification:** `npm run build` clean (16 static pages), all routes 200 on the basePath
preview, and all 11 pages visually reviewed (screenshots of the rendered site).

---

### 2025-01-15 — Anime_App Android build complete (Build #16) — documentation finalized

**Final state:** The Android app matches the web prototype with minor acceptable differences.
16 build iterations from initial scaffold to final APK. All documentation updated for future agents.

**Build #16 — Font bundling (bold text fix):**
- Root cause: Android's system Roboto may not have ExtraBold (800) weight → bold text renders as Regular.
- Fix: bundled 4 Roboto TTF files (regular/medium/bold/black = 400/500/700/900) in `res/font/`.
- Typography uses `FontFamily` with bundled fonts. CollapsingHeader + SearchScreen title use `fontFamily = RobotoFamily`.

**Build #14 — Bigger titles + ExtraBold everywhere:**
- Title sizes: 36sp expanded (was 32sp), 26sp collapsed (was 22sp).
- ALL `FontWeight.Bold` (700) replaced with `FontWeight.ExtraBold` (800) across 13 files (48 instances).
- Results container padding reduced from 16dp to 8dp.

**Builds #12-13 — Search screen + filter sheet:**
- Collapsing search bar (moves beside title when scrolled, source toggle fades out).
- Recent searches card (collapsible, individual delete, "Show N more").
- Results grid in a surface card container.
- Filter sheet with accordion + flat views, 5 categories, score slider, sort chips.
- Scroll animation smoothness (AnimatedVisibility for search bar transition).

**Builds #9-11 — Core fixes:**
- Background color: M3 dark purple (#14111F) instead of gray (#303030).
- Theme toggle: reads from DataStore (was hardcoded to dark).
- Source toggle: AniList/Extension with SVG icons, 30 results (was 5).
- Filters button (left) + Sort dropdown (right).
- Library tabs with item counts.

**Builds #4-8 — Screen rebuilds:**
- All 7 screens rebuilt to match the prototype.
- Floating bottom nav (Box overlay, not Scaffold).
- CollapsingHeader component (pinned, shrinks on scroll).
- SVG Material icons (not emojis).
- Custom toggles, text selectors, filter sheet.

**Builds #1-3 — Initial setup + crashes:**
- Gradle project scaffolded (Kotlin 2.0 + Compose + M3 + Ktor + DataStore).
- 5 crashes fixed: missing icon, missing serialization plugin, compilation errors,
  weight(0f), negative padding.

**Documentation finalized:**
- `STARTUP.md` — added §5b (prototype→Android workflow) + Android_app in directory tree.
- `docs/navigation.md` — added `android-dev/` to index + reading order.
- `docs/preferences.md` §7 — 10 critical Android-specific rules (font bundling, ExtraBold, etc.).
- `docs/android-dev/` — 5 files: navigation.md (14 golden rules), CRASH_LESSONS.md (7 crashes + 5 UI issues), UI_PATTERNS.md (all patterns), WORKFLOW.md (8-phase process), BUILD_GUIDE.md (tech stack + error table + font bundling).
- `Android_app/Anime_App/IMPROVEMENTS.md` — full implementation status + 16-build history.

---

### 2025-01-15 — Native Android app: Anime_App (Kotlin + Jetpack Compose)

**Goal:** Build the actual native Android app that matches the anime-app prototype. The web prototype is the design reference; the Android app is the deliverable.

**Architecture:**
- `Android_app/Anime_App/` — Kotlin + Jetpack Compose + Material 3
- Navigation Compose for screen routing (Home, Library, History, Schedule, Search, Settings, Detail)
- Coil for image loading (AniList cover images)
- Ktor client for AniList GraphQL API
- DataStore Preferences for persistence (library, history, settings)
- ViewModel + StateFlow for state management
- GitHub Actions builds a debug-signed APK and uploads it as an artifact

**Documentation:**
- `docs/preferences.md` — added §7 (Native Android app) + updated library/settings/continue-watching sections.
- `Android_app/Anime_App/IMPROVEMENTS.md` — tracks what needs work to match the prototype.

---

### 2025-01-15 — Settings text selectors + library category menu + customize sheet sections

**Settings:**
- Poster style: text-only segmented control (Rounded/Soft/Sharp). Removed image previews. Replaced 'circle' with 'soft'.
- Card density: text-only segmented control (Compact/Default/Comfortable). Removed dot previews.

**Library:**
- Renamed 'Status' to 'Category' with folder icon.
- Category menu: shows current categories as chips, divider, then move options.
- Action bar moved to sit ON TOP of bottom nav (same position/dimensions).
- Customize sheet: removed dismiss handle, organized into 5 sections (Layout, Columns, Text placement, Cover details, Episode badge position).
- Added show/hide format + episode count toggles.
- Added episode badge position selector (top-left/top-right/bottom-left/bottom-right/hidden).

**Keyboard improvements:**
- **Removed the dismiss bar** (white handle line at top) — the user dismisses by tapping outside the input.
- **Moved Enter/Search button to the right side** only (removed the left enter button). Last row is now: Space (wide) + Enter (right).
- **Fixed key press theme color** — replaced CSS `:active` with JS-driven pointer events (`onPointerDown`/`onPointerUp`) for reliable pressed state on both desktop and mobile. Pressed keys now show the primary theme color with `scale(0.92)` + shadow.
- **Fixed mobile keyboard auto-show** — added `onClick` handler as backup to `onFocus` (some mobile browsers don't fire `onFocus` reliably). Increased blur timeout to 200ms.
- **Fixed focus stealing** — keys now use `tabIndex={-1}` + `onMouseDown preventDefault` so they never steal focus from the input (prevents the keyboard from deactivating mid-typing).
- **Fixed stale value bug** — the keyboard context now uses a `valueRef` (always latest value) instead of `target.value` (stale between renders) for rapid key presses.
- Enhanced animations: key pop-in stagger by row, `touch-action: none` on keypad.

**Fullscreen button — now mobile-only:**
- Hidden on PC (>480px) via `@media (min-width: 481px) { display: none }`.
- On mobile it gives a native-app full-screen experience. On PC there's no need for it.
- Still completely disappears when in fullscreen mode (no exit button).

**Docs updated:** preferences.md (mobile experience, keyboard section), proto-kit README (fullscreen + keyboard sections).

---

### 2025-01-15 — Finalize fullscreen button + swipe gestures as permanent proto-kit features

**Fullscreen button — behavior corrected per user feedback:**
- The button is now **always visible** (mobile + desktop) — previously it was hidden on mobile.
- **When the user enters fullscreen, the button completely disappears** (no exit button). The user exits via the system back button/gesture (mobile) or Esc key (desktop).
- The button only enters fullscreen — it never toggles to an exit button. Simplified the component (removed state + exit icon + fullscreenchange listener — CSS `:fullscreen` pseudo-class handles hiding).
- Verified: `display: flex` at 390px and 1400px; `aria-label` always "Enter fullscreen".

**Swipe gestures — finalized as permanent proto-kit feature:**
- Removed all "TEST FEATURE" / "easily removable" markers from the hook, index export, and page.tsx wiring.
- Moved the swipe CSS (grab cursor, image-drag prevention, text-selection kill) from `src/prototypes/anime-app/anime-app.css` to `src/proto-kit/device-frame/device-frame.module.css` (global — all prototypes get it automatically).
- Added swipe to the **search-page** prototype (swipe left = settings, swipe right = search). Both prototypes now have swipe gestures.
- Updated docs: `preferences.md`, `src/proto-kit/README.md` reflect the finalized behavior.

---

### 2025-01-15 — Post-migration features: Schedule screen, Library customization, Swipe sim, Fullscreen button

**Schedule screen (`#schedule`):**
- New 7th screen: weekly airing schedule from AniList.
- `fetchAiringSchedule()` + `useSchedule()` hook — fetches a 7-day window, groups by day.
- Day selector pills (Today/Tomorrow/Wed…) with airing count per day.
- Airing list: cover thumbnail, title, EP badge, absolute time (HH:MM) + relative ("in 3h" / "2h ago"). Past entries dimmed, next-up highlighted.
- Collapsing header, staggered animations, loading/empty states. Clicking a row opens detail.

**Library customization:**
- Gear button at top-right of Library topbar opens a bottom sheet.
- Options: Layout (Grid/List), Columns (2–5, grid only), Text placement (Below cover / On cover overlay).
- Grid overlay mode = Netflix-style gradient title on cover.
- List mode = horizontal rows with cover + title + meta + status.
- All settings persist to localStorage, apply live.

**Swipe simulation (test feature, easily removable):**
- `useSwipeSimulation()` hook in proto-kit — click+drag = touch swipe.
- Vertical drag = grab-scroll (1:1). Horizontal drag past 70px = navigate screens.
- Swipe right on detail = back gesture. Click suppression after drag (>8px).
- Prevents text selection + image ghost-drag (`preventDefault` + `-webkit-user-drag: none`).
- Desktop-only (mouse/pen); touch unaffected.

**Fullscreen button (proto-kit, all prototypes):**
- `<FullscreenButton>` added to `<DeviceFrame>` — every prototype gets it automatically.
- Real Fullscreen API (`requestFullscreen` on `.device`). Purple circular, bottom-right above nav.
- **Desktop-only** — hidden on mobile (≤480px) where the system back button/gesture exits fullscreen natively.
- Icon toggles expand/shrink; syncs on `fullscreenchange`.

---

### 2025-01-15 — Next.js Migration (Phases 1–4) — static site → Next.js 16 static export

**Goal:** Migrate the monolithic static-HTML prototypes to a Next.js 16 App Router static export with a shared design system (`proto-kit`), so the frame/nav/tokens are defined once and each screen is its own file.

**Decisions (confirmed with user):**
- Flat prototype layout (`app/prototypes/<name>/` + `src/prototypes/<name>/`).
- Hash routing (`#home`, `#search`) — preserves in-app feel + detail push animation; Next.js paths remain available for future.
- CSS Modules + `tokens.css` for styling.
- Convert repo root to Next.js; preserve all AI-agent docs (STARTUP.md, navigation.md, preferences.md, etc.).
- Stay at `https://testplay-byte.github.io/ANDROID-PROTOTYPE/` (`basePath: '/ANDROID-PROTOTYPE'`).

**Backup (before migration):**
- Git tag `v1.0-static` + branch `archive/static-v1` (both pushed).
- `archive/static-v1.zip` — full snapshot of the pre-migration site, committed to repo.

**Phase 1 — Foundation + dashboard:**
- Scaffolded Next.js 16 (App Router, TypeScript 5, `output:'export'`, `basePath:'/ANDROID-PROTOTYPE'`, `trailingSlash:true`).
- Ported the dashboard (`index.html` → `app/page.tsx`, 1186 lines) + `src/dashboard/theme-toggle.tsx` (client component). Faithful JSX conversion: className, camelCase SVG attrs, inline `style={{}}` objects.
- Built `src/proto-kit/` — the shared design system:
  - `tokens/tokens.css` — SINGLE source of truth (type scale, spacing, radius, motion, M3 color roles, per-theme frame invert + widths, stage backgrounds).
  - `device-frame/` — `<DeviceFrame>` + `<Screen>` + `<StatusBar>` (live clock, punch-hole, wifi/signal/battery). Bezel color + width invert by theme automatically.
  - `bottom-nav/` — `<BottomNav>` floating pill, content-sized active item (full label always visible), 42px pill / 58px bar.
  - `stage/` — `<Stage>` with left/right side panels.
  - `theme/` — `<DeviceThemeProvider>` + `useDeviceTheme()` (device-scoped, persisted to localStorage).
- Moved old static prototypes to `public/prototypes/` (preserved at original URLs during transition).
- Updated GitHub Actions: `npm ci` → `next build` → deploy `out/`.
- VLM-verified: dashboard parity (3 prototype cards, charts, theme toggle works + persists).

**Phase 2 — search-page port:**
- Ported search-page to `app/prototypes/search-page/` using proto-kit (24 files, ~3831 lines).
- One file per screen: `search-screen.tsx`, `settings-screen.tsx` + CSS Modules.
- Components: anime-card, filter-sheet (accordion + flat views), sort-dropdown, source-toggle, recent-searches, search-bar.
- Hooks: `use-anilist` (debounced GraphQL search + recents).
- All behavior preserved: AniList search, 5 filter categories + score slider, 5 sort options, recent searches, source toggle, collapsing header, theme toggle.
- Proto-kit fix: DeviceFrame exposes global `device` class alongside module class so `tokens.css` `.device` rules match.
- Old static files moved to `archive/legacy/search-page/`.
- VLM-verified parity.

**Phase 3 — anime-app port:**
- Ported anime-app (6 screens) to `app/prototypes/anime-app/` (35 files, ~6874 lines).
- 6 screens (each its own file + CSS Module): home, search, library, history, settings, detail.
- Components: anime-card, hero-carousel, filter-sheet, sort-dropdown, source-toggle, recent-searches, search-bar.
- Hooks: `use-anilist`, `use-library`, `use-history`, `use-settings`.
- All behavior preserved: 6 hash-routed screens, detail push/pop animation (translateX, no nav in detail), back-gesture (pushState + popstate), AniList data (trending/seasonal/top-rated/search/detail), library (localStorage, status tabs), history (auto-tracked, max 20), settings (theme, single-line titles, poster style, card density, anim speed — all persisted).
- Fixed: cross-instance localStorage sync bug in use-library/use-history (side-effects moved outside React updater for StrictMode safety).
- Old static files moved to `archive/legacy/anime-app/`.
- VLM-verified: home (trending + grids), detail (banner/cover/synopsis/episodes), theme toggle, all settings persist.

**Phase 4 — cutover + docs:**
- `public/prototypes/` cleaned (only legacy `_template/` remains for reference).
- Updated docs: `STARTUP.md` (§3 layout, §4 tech stack, §5 quick-start), `navigation.md` (root index), `README.md` (structure + tech stack + live links), `docs/preferences.md` (frame inversion + bottom-nav policies).
- Final VLM sweep: dashboard + both prototypes verified in both themes.

**Net result:**
- Frame/nav/tokens defined ONCE in `src/proto-kit/` — fix once, inherit everywhere.
- Each screen is its own file — edit one without touching others.
- Hot reload + type safety during dev; identical static HTML output for GitHub Pages.
- URL unchanged: `https://testplay-byte.github.io/ANDROID-PROTOTYPE/`.
- Rollback: `git checkout archive/static-v1` or unzip `archive/static-v1.zip`.

---

### 2025-01-15 — Anime App v23 — thinner dark-mode (platinum) border

**Goal:** The platinum/white border in dark mode is visually heavier (bright against the dark screen) than the dark border in light mode, so it needs to be thinner.

**Change:**
- Dark mode border width reduced from `5px / 5.5px` → **`3.5px / 4px`**.
- Light mode border width **kept exactly as-is** at `4px / 4.4px`.
- Net result: the dark-mode platinum border is now thinner than the light-mode dark border, which visually balances the two (a bright frame needs fewer pixels to read at the same visual weight as a dark frame).

**Verification:** VLM confirmed the dark-mode border is now "slim and refined... proportionate and elegant... minimal width aligns with modern, sleek phone aesthetics."

**Files:** `prototypes/anime-app/styles.css` (cache v23), `prototypes/anime-app/index.html`.

---

### 2025-01-15 — Anime App v22 — frame polish + bottom-nav fix

**Goal:** Address user feedback on the device frame and bottom navigation.

**Frame (per-theme inversion + softening):**
1. **Softened the dark-mode frame** — the white bezel (`#ffffff`) was too stark. Replaced with a soft platinum/silver (`#cfcfcf` bezel + `#a8a8a8` edge rim) so the frame reads as a refined light metal, not glaring white. Per user: "reduce its whiteness a bit but don't turn it into black."
2. **Thinner border in light mode** — dark borders visually read thicker than light ones at the same pixel width, so the light-mode dark frame looked too heavy. Introduced per-theme `--bezel-w` / `--edge-w` CSS variables: dark mode keeps `5px / 5.5px`; light mode is reduced to `4px / 4.4px` so both themes look visually equal. Per user: "reduce the border width in light mode a bit but keep it exactly the same as it is in dark mode."
3. **Per-theme drop shadow** — `--frame-shadow` token (`rgba(0,0,0,.55)` dark / `.4` light) so the lift off the stage is tuned for each background.

**Bottom navigation (selection pill refinement):**
4. **Reduced pill height** — active-item pill reduced from `48px` → `42px`, and the nav bar from `64px` → `58px`, for a slimmer, more refined look. Per user: "its height is way too much."
5. **Full labels now show** — switched the active item from `flex: 1 1 0` (equal-width, truncated) to `flex: 0 1 auto` (content-sized, never truncated). The active pill expands to fit its full label ("Settings", "Library", "History" all render completely); inactive items stay compact icon-only. Removed `overflow:hidden` / `text-overflow:ellipsis` on the label. Per user: "increase its width a little bit so that the full name can be shown properly."
6. Added a `flex` transition so the pill width animates smoothly when switching tabs (M3 expanding-pill behavior).

**Verification:** VLM confirmed in both themes — dark frame is "a softer light gray/platinum/silver, not stark white"; light border is "slim and refined, not overly thick"; nav pill is "slim, not chunky" and "Settings is fully visible, no truncation."

**Files:** `prototypes/anime-app/styles.css` (cache v22), `prototypes/anime-app/index.html`.

---

### 2025-01-15 — Design System Documentation Pass

**Goal:** Create a comprehensive, structured design system documentation that helps future AI agents design beautiful prototypes consistently.

**New documentation structure:**

```
docs/design-systems/
├── navigation.md                    ← Index of all design system docs
├── design-system-guide.md           ← Master guide: workflow, principles, checklist
├── material-3-expressive/           ← M3 design system (from search-page prototype)
│   ├── navigation.md                ← Index of M3 docs
│   ├── color-system.md              ← Color tokens, tonal tiers, dark/light themes
│   ├── typography.md                ← M3 type scale (display → label-small)
│   ├── spacing.md                   ← 4px grid system (sp-1 → sp-10)
│   ├── elevation.md                 ← Tonal elevation (NOT box-shadow)
│   ├── motion.md                    ← M3 easing curves, durations, animations
│   ├── components.md                ← Button, card, chip, nav, sheet specs
│   └── layout-patterns.md           ← Collapsing header, floating nav, trays, blur
└── basic-design/                    ← Fundamental design principles
    ├── navigation.md                ← Index of basic design docs
    ├── what-makes-good-ui.md        ← 8 principles with DO/DON'T examples
    ├── ai-ui-mistakes.md            ← 13 common AI mistakes + fixes
    ├── mobile-first-design.md       ← Touch targets, thumb zone, safe areas
    ├── accessibility.md             ← WCAG, ARIA, keyboard nav, contrast
    ├── color-theory.md              ← Color roles, harmony, 60-30-10, repo policy
    └── typography-basics.md         ← Type scale, weights, line height, readability
```

**Updated existing docs:**
- `docs/navigation.md` — added design-systems/ to the file table and reading order
- `STARTUP.md` — added design system links to the quick-lookup table
- `docs/repo-map.md` — updated the visual tree to include design-systems/

**Total new documentation:** 17 files, ~7,000 lines of structured design system reference.

### 2025-01-15 — Search Page v5 — floating nav, collapsing header, sort dropdown

**New features:**
1. **Floating bottom navigation** — the bottom nav is no longer edge-to-edge. It floats with 12px padding from all edges, rounded corners (20px), a subtle shadow, and a tonal `surface-3` background. Active items show text beside the icon (horizontal layout); non-active items show icon only. Per user: "floating kind of rounded corners navigation bar with padding" and "show the text on the right side of the logo itself."
2. **Collapsing header on scroll** — when the user scrolls the content down past 20px, the top bar smoothly collapses (title shrinks from display to h2, search bar shrinks from 56px to 44px, source toggle scales to 0.9). Scrolls back to top → expands. M3 emphasized easing.
3. **Separated Filters and Sort** — Filters is now a prominent tonal-filled button (surface-2); Sort is an outlined secondary button with a chevron. Sort opens its own dropdown menu (5 options, checkmark on active) — separate from the filter bottom sheet. Per user: "add the filters option to a separate area."

**Documentation updated:**
- `docs/preferences.md` — updated bottom nav section (floating, rounded, text beside icon). Added "Collapsing header on scroll" section. Added "Separated Filters and Sort" section.

### 2025-01-15 — Search Page v4 — settings page, improved recent searches, animations, docs

**New features:**
1. **Settings page** — bottom nav Settings button now navigates to a functional settings view with a light/dark theme toggle (M3 segmented buttons). Theme persists in localStorage (`search-theme` key) and applies to the `.device` element.
2. **Improved recent searches** — limited to 3 visible by default with a "Show N more" expandable button (chevron rotates). Prevents recent searches from pushing the anime grid down when there are many. Max 12 stored.
3. **Removed iPhone home indicator** — the `.home-indicator` div and CSS have been removed. Bottom nav is now the last element in the device. Per user: "remove that white line kind of looking bar."
4. **Staggered card animations** — cards fade-in with 40ms stagger on each render, using M3 emphasized-decel easing.

**Documentation updated:**
- `docs/preferences.md` — new §6 "Material 3 Expressive design" (tonal elevation rules, no border line on bottom nav, home indicator removed, type scale, motion, settings page, recent searches). New §7 "Workflow for AI agents" (research → analyze → implement → verify on live site, common AI UI mistakes to avoid).

### 2025-01-15 — Search Page v3 — M3 tonal elevation, recent searches, source defaults

**Removed:** `prototypes/anime-app/` (deleted — user found it too ugly/complex).

**New prototype:** `prototypes/search-page/` — a focused, beautiful single-screen search prototype.

**Design:** Material 3 Expressive — dark purple theme (`#14101f` bg, `#d0bcff` primary, `#1d1a2e` surface). M3 color tokens, pill-shaped elements, emphasized easing.

**Features:**
- **Source toggle** (top): AniList / Extension segmented buttons — AniList fetches real data, Extension is visual-only (same data, for UI testing)
- **Search bar**: pill-shaped, debounced (450ms), clear button, shows "Popular anime" by default when empty
- **Filter chips** (quick filters): Action, Romance, Comedy, Fantasy, Sci-Fi, Drama — multi-select with checkmark
- **Expandable filter panel**: year, season, format, sort — with reset button
- **Results grid**: 3-column anime cards with cover (2:3), score badge, title (2-line clamp), format+episodes
- **Bottom navigation** (Material 3): 5 items (Home, Library, History, Search, Settings)
  - Active item shows pill indicator + label
  - Non-active items show **only the icon** (no label) — per user spec
  - Search item (4th) **always shows label + icon** — per user spec
  - M3 active-pill pattern with `primary-container` background
- Default results load on page open (popular anime, no query needed)

**README:** Updated with proper clickable links to dashboard, starter template, and search page.

**Live:** https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/search-page/

### 2025-01-15 — Anime App prototype (v1.0) — 7 screens, AniList integration

**New prototype:** `prototypes/anime-app/` — a fully interactive mobile anime discovery & streaming app.

**Screens (7 total):**
- **Home** — hero carousel (auto-rotating, 5 trending), continue watching, trending grid, popular this season, top rated
- **Library** — status tabs (all/watching/completed/plan/dropped), grid/list/compact view toggle, sort by title/score/date
- **History** — continue watching section + recent episodes list with progress bars, clear history
- **Search** — debounced AniList search with genre chips (multi-select), year, season, format, sort filters
- **Settings** — theme (dark/light), accent color (5 options: pink/coral/amber/green/violet), player prefs (autoplay, skip intro, quality), library defaults (layout, sort), playback tracking, data management — ALL persist in localStorage and apply live
- **Detail** (pushed) — banner, cover, title, score, status, genres, expandable synopsis, episode list, add-to-library toggle
- **Player** (pushed) — mock video player with play/pause, seek bar, skip intro, prev/next episode, fullscreen, auto-progress, episode list below

**Data:**
- AniList GraphQL API (`https://graphql.anilist.co`) — real covers, titles, scores, descriptions, genres
- Library/History/Settings in localStorage
- Mock video player (blank with poster + controls, no real streaming)

**Design:**
- Dark-first theme (`#0d0c11` bg) with sakura pink accent (`#e85d75`)
- 5 swappable accent colors via settings
- Scoped theming (app toggle doesn't affect page — see `docs/theme-architecture.md`)
- Built on v6 template architecture (click-drag scroll, fullscreen API, no scrollbar, no text selection)

**Workflow:**
- Developed on `feat/anime-app` branch, merged to `main` via `--no-ff`
- Updated `prototypes/navigation.md` index with new entry
- Added anime-app card to homepage gallery (`index.html`)

**Live:** https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/anime-app/

### 2025-01-15 — Documentation pass (v7): comprehensive docs for next AI agent

**Goal:** Make the repository fully self-documenting so any future AI agent can understand the project, the rules, and how to build a prototype without guessing.

**New documentation files:**
- `docs/agent-quickstart.md` — 2-minute fast-start guide condensing everything an agent needs to begin work.
- `docs/prototype-blueprint.md` — detailed, step-by-step blueprint for building a new prototype (11 steps + common pitfalls table).
- `docs/repo-map.md` — visual annotated tree of the entire repository, with quick-lookup tables and a navigation-file chain diagram.

**Updated documentation:**
- `STARTUP.md` — expanded the repository layout tree to show all 12 doc files + `index.html`; added new docs to the quick-lookup table; updated "Last updated" line; added prototype-blueprint as the first step in "How to Create a New Prototype".
- `navigation.md` (root) — fixed the `.github/` link (was broken); added `index.html` to top-level files table; added links to agent-quickstart, repo-map, prototype-blueprint, preferences, theme-architecture; updated "Last updated".
- `docs/navigation.md` — added the 3 new docs to the files table; rewrote the reading order to be a 10-step progressive path; updated "Last updated".
- `prototypes/_template/navigation.md` — completely rewritten to reflect v6 (4 screens, 32px corners, 5px bezel, 13px punch-hole, scoped theming, click-drag scroll, fullscreen API, no Bluetooth, side panels, what NOT to change).
- `prototypes/_template/README.md` — rewritten with v6 features and correct links.
- `prototypes/navigation.md` — updated "Last updated".
- `templates/navigation.md` — updated "Last updated".
- `assets/navigation.md` — updated "Last updated".
- `.github/navigation.md` — updated "Last updated".
- `README.md` — added links to agent-quickstart, repo-map, prototype-blueprint; updated the repository structure tree to include `index.html` and `_template/` v6.

**Result:** The repository now has 12 documentation files in `docs/` + 7 `navigation.md` files across directories + `STARTUP.md` + `README.md` + `CHANGELOG.md`. Any AI agent can start from `STARTUP.md` → `docs/agent-quickstart.md` → `docs/repo-map.md` and find anything in under 2 minutes.

### 2025-01-15 — Template v6 (click-drag scroll + real Fullscreen API)

**Template (`prototypes/_template/`) — v6:**

- **Click-drag-to-scroll (desktop):** the device screen now supports pressing and dragging the mouse to scroll in any direction. The cursor shows `grab`/`grabbing` hints. Interactive elements (buttons, links, inputs, toggles) are excluded so their clicks still work. A drag >3px suppresses the click event to prevent accidental navigation. Native wheel/trackpad scrolling still works. Only activates on `pointer: fine` devices (doesn't interfere with mobile touch scrolling).
  - **Root cause of the old issue:** global `selectstart`/`dragstart` event listeners were blocking all drag gestures. These have been **removed**. Text selection is now prevented purely via CSS `user-select: none`, which doesn't block scrolling.
- **Real Fullscreen API (mobile):** the floating fullscreen button now calls `device.requestFullscreen()` — the real browser Fullscreen API. This hides the browser address bar, tab bar, and (on Android) the system status bar, giving a true native-app full-screen experience. Pressing the button again or Esc exits. Best-effort orientation lock to portrait on Android.
  - **Fallback:** CSS-only `.device--cssfs` class (fills viewport without hiding browser chrome) for browsers without Fullscreen API support (e.g. iOS Safari on iPhone).
  - `:fullscreen` / `:-webkit-full-screen` pseudo-class CSS rules handle the fullscreen layout.
- Removed the old `.device--framed` class (was toggling framed view on mobile — no longer needed; the Fullscreen API replaces it).

**Docs:**
- `docs/preferences.md` — new "Scrolling (desktop)" section; updated "Mobile experience" to describe the real Fullscreen API.
- `docs/template-rules.md` — new §7b "Click-drag-to-scroll (desktop)"; rewrote §7 "Mobile full-screen experience" to describe the Fullscreen API + fallback.

### 2025-01-15 — Template v5 (scoped theming, thicker bezel, bigger punch-hole) + detailed docs

**Template (`prototypes/_template/`) — v5:**
- **Scoped theming (CRITICAL fix):** the app's dark mode toggle now changes ONLY the device's theme, never the whole page. `data-theme` is set on `.device`, not `<html>`. CSS variables split into two layers: page-level (`--stage-bg`, `--sb-*`) on `:root` (fixed), app-level (`--color-*`, `--chart-*`) on `.device` (changes with theme). The page background, side panels, and body text stay light when the app goes dark.
- **Bezel slightly thicker:** 3px → **5px** (per feedback: "not too much but just a little bit thicker").
- **Punch-hole bigger:** 10px → **13px** (per feedback).
- **Adaptive bezel color:** near-black (`#1a1612`) in light mode (stays black, per user); medium-gray (`#3a3530`) in dark mode — visible against both the light page and the dark app screen, doesn't interfere with either.
- JS: `setTheme` now sets `data-theme` on `device` element; localStorage key changed to `proto-app-theme` (separate from any page theme).

**Docs (highly detailed):**
- New `docs/theme-architecture.md` — full explanation of the page/app theme separation, token tables, architecture diagram, what-NOT-to-do list, testing steps.
- `docs/template-rules.md` — new §9 Theming architecture (CRITICAL); updated bezel (5px) and punch-hole (13px) specs.
- `docs/preferences.md` — added dark mode scoping rule with user's exact words; updated bezel and punch-hole specs.
- `docs/design-standards.md` — updated bezel (5px), punch-hole (13px), added bezel color and theming notes.
- `docs/navigation.md` — added theme-architecture.md to the index.

### 2025-01-15 — Homepage pill nav + template v4 (thin bezel, fixed signal, smaller battery, no scrollbar, mobile fullscreen)

**Homepage (`index.html`):**
- Top nav: both brand and button group now sit in **pill-shaped containers** (rounded-xl, border, card bg, shadow, backdrop-blur) — copied exactly from the AIO-STUFF reference. Two disconnected pills, no full-width bar.

**Template (`prototypes/_template/`) — v4:**
- Device bezel reduced 5px→**3px** (thinner, per feedback).
- Device corner radius set to **32px**.
- Battery icon made **smaller** (8×16px) and cleaner.
- **Fixed signal bars**: LEFT 2 bars now bright, RIGHT 2 bars dim (was reversed).
- **Hidden scrollbar** everywhere: app screens, side panels. Uses `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`.
- **Mobile full-screen**: on ≤480px, the app fills the entire viewport (no device frame). A floating button lets users toggle back to framed view.
- Added `docs/preferences.md` — mandatory memory file capturing all user design preferences.

**Docs:**
- New `docs/preferences.md` (MANDATORY MEMORY FILE): all accumulated preferences — nav pills, hero 2-line, no footer, thin bezel, signal direction, portrait battery, no scrollbar, mobile fullscreen, color palette, references.
- `docs/template-rules.md`: updated frame specs (32px, 3px bezel), signal bar direction (left bright), added §6 scrollbar, §7 mobile fullscreen, §8 side panels.
- `docs/design-standards.md`: updated to match.
- `docs/navigation.md`: added preferences.md to the index.

### 2025-01-15 — Homepage nav/hero cleanup + template v3 (new status bar, side panels, more screens)

**Homepage (`index.html`):**
- Top nav: removed the full-width bar. Now two disconnected floating groups (brand left, Repo+theme right) with page background between them — nothing connects them, per feedback.
- Hero: removed eyebrow text and lead paragraph. H1 split into two lines: "Interactive mobile UI prototypes" / "live in your browser." (orange accent on line 2). Max 2 lines, no 3-line wrap.
- Prototype card right panel: replaced plain text stats with mini-charts — a component-breakdown donut + a per-screen interactions bar chart + screen/component counts.
- Removed the bottom links strip (Startup guide, Navigation map, etc.).
- Removed the footer entirely.
- Updated stat cards (4 screens, 12 components) to match the new template.

**Template (`prototypes/_template/`) — v3:**
- Device corners reduced 36→28px; bezel reduced 10→5px (thinner, less rounded, per feedback).
- Status bar rebuilt per spec:
  - Wi-Fi (2 of 3 arcs bright) → Signal (2 of 4 bars bright) → Portrait battery → Battery % to the right.
  - Punch-hole camera centered.
  - Bluetooth removed.
  - Battery is now portrait (vertical); fill grows from bottom, driven by JS.
- Text-selection fully fixed: entire `body` is `user-select: none`; global `selectstart` + `dragstart` listeners cancel any remaining selection. No text is selectable anywhere in the prototype (except input fields).
- 4 fully navigable screens: Home (scrollable feed with stories, posts, like buttons), Search (filterable input, chips, categories), Profile (avatar, stats, follow toggle, tabs, media grid), Settings (toggle switches, grouped rows).
- Left info panel: prototype name, description, screen list (clickable, syncs with device), tech tags.
- Right info panel: screen info (updates on view change), component donut, interaction bars, stats.
- Warm-cream palette aligned with homepage (orange primary `#f05100`).

**Docs:**
- `docs/template-rules.md`: updated frame specs (28px, 5px bezel), new status bar spec (Wi-Fi 2/3, signal 2/4, portrait battery, no Bluetooth), text-selection rule changed to "entire page non-selectable."
- `docs/design-standards.md`: updated frame + status bar specs to match.

### 2025-01-15 — Homepage redesign + template v2 + docs
- **Homepage (`index.html`):** complete redesign based on the approved AIO-STUFF reference. Warm-cream theme (`#f2e8da`/`#231e18`/`#f05100`), split top nav (logo+name left, Repo+theme toggle right), hero with eyebrow + H1 + 4 stat cards, two-up panel (feature bars + repo file-mix donut), CTA, and a restyled prototypes gallery with phone silhouettes flanked by left/right info panels. Light + dark themes.
- **Template (`prototypes/_template/`):**
  - Device corner radius reduced 44→36px (less rounded, per feedback).
  - Status bar rebuilt: punch-hole camera (centered), mobile-data signal bars, Wi-Fi, Bluetooth, battery percentage + scaling fill glyph. Time stays left.
  - Fixed drag-to-copy issue: `.device` is `user-select: none`; only `.content` text is selectable; buttons/list rows re-assert `user-select: none`.
  - Battery fill driven by `script.js`; danger tint below 15%.
- **Docs:**
  - New `docs/template-rules.md` — authoritative rules for every prototype built from `_template/` (frame, status bar, theming, text-selection, interaction).
  - `docs/notification-protocol.md` promoted to MANDATORY MEMORY FILE with a 30-second copy-paste section at the top.
  - `docs/design-standards.md` updated for new status bar + 36px corners.
  - `docs/navigation.md` + `STARTUP.md` updated to reference the new files and homepage design language.

### 2025-01 — Repository Initialization
- Created repository folder structure: `docs/`, `prototypes/`, `templates/`, `assets/`, `.github/workflows/`.
- Authored `STARTUP.md` (master context), `README.md`, root `navigation.md`.
- Authored `docs/`: workflow, tech-stack, design-standards, github-pages, notification-protocol, git-conventions.
- Created `prototypes/_template/` starter (phone frame + sample interactive screen).
- Created `templates/` reusable fragments scaffold.
- Configured GitHub Pages auto-deploy via `.github/workflows/deploy.yml`.
- Set up notification protocol (ntfy.sh, topic `TASKISDONE`, 4-color emoji scheme).
- Pushed initial commit to `main`.
