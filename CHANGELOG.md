# CHANGELOG

> Running log of notable changes to the repository.
> Append a new entry at the top (newest first) for every task you complete.

---

## [Unreleased]

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
