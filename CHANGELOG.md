# CHANGELOG

> Running log of notable changes to the repository.
> Append a new entry at the top (newest first) for every task you complete.

---

## [Unreleased]

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
