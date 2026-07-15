# CHANGELOG

> Running log of notable changes to the repository.
> Append a new entry at the top (newest first) for every task you complete.

---

## [Unreleased]

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
