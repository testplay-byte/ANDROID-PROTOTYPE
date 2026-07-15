# CHANGELOG

> Running log of notable changes to the repository.
> Append a new entry at the top (newest first) for every task you complete.

---

## [Unreleased]

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
