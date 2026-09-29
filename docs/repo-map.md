# docs/repo-map.md — Repository Map

> A visual, annotated map of every file and folder in the repository.
> Use this to find things fast. Cross-reference with `navigation.md` files.

---

## Full tree

```
ANDROID-PROTOTYPE/
│
├── STARTUP.md                  ← READ FIRST. Master context for any agent.
├── README.md                   ← Public GitHub landing page.
├── navigation.md               ← Root navigation index (master map).
├── CHANGELOG.md                ← Running log of all changes (newest first).
├── package.json                ← Next.js 16 + React 19 + TypeScript 5 deps.
├── package-lock.json           ← Pinned deps — MUST be committed (CI uses npm ci).
├── next.config.ts              ← output:'export', basePath:'/ANDROID-PROTOTYPE', trailingSlash.
├── tsconfig.json               ← TS config (@/*→src/*, @app/*→app/*).
├── next-env.d.ts               ← Next.js TypeScript ambient decls (auto-generated).
├── .gitignore                  ← Ignores node_modules, out, .next.
│
├── app/                        ← Next.js App Router (routes are thin).
│   ├── layout.tsx              ← Root layout (Inter via next/font, metadata, <html>).
│   ├── page.tsx                ← Dashboard / prototypes gallery (Pages root).
│   ├── globals.css             ← Minimal global reset.
│   ├── settings/               ← Device settings page (camera cutout config — proto-kit/device-settings).
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── prototypes/             ← One route folder per prototype.
│       ├── bloom/              ← Reference prototype (canonical M3 — structure + motion).
│       │   ├── layout.tsx      ← Imports tokens.css + prototype CSS; pass-through.
│       │   └── page.tsx        ← Client. Shell + hash router → renders screens.
│       └── anime-app/          ← 6-screen M3 Expressive anime app.
│           ├── layout.tsx
│           └── page.tsx
│
├── src/
│   ├── dashboard/              ← Dashboard styles, theme toggle, data-driven gallery.
│   │   ├── dashboard.css       ← Warm-cream theme (approved palette — do not re-theme).
│   │   ├── theme-toggle.tsx    ← Page-level light/dark toggle.
│   │   ├── gallery.tsx         ← Filterable prototype gallery (detailed + grid views). Grid view = ONE shared raster: placeCells() flows every design language through the same column grid (wrap continues below the last card) and each cell paints its own sheet background (.gcell::before) that merges with same-family neighbours — see the block comment before editing it.
│   │   ├── thumbs.tsx          ← Mini home-screen thumbnails per prototype.
│   │   ├── settings-panel.tsx  ← Device settings page body (cutout config + live preview).
│   │   └── settings.css        ← Settings page styles.
│   ├── proto-kit/              ← SHARED DESIGN SYSTEM (fix once, inherit everywhere).
│   │   ├── index.ts            ← Barrel export.
│   │   ├── tokens/
│   │   │   └── tokens.css      ← SINGLE source of truth for all design tokens.
│   │   ├── styles/             ← 12 design-language token layers (data-style) + types.ts.
│   │   ├── device-frame/       ← Phone mockup (bezel, status bar, screen slot). Size comes from the device-settings store.
│   │   ├── surface/           ← Tablet/desktop: SurfaceFrame (+ window chrome, drag-resize, fullscreen), DesktopSidebar/Rail/TopBar, SurfaceSwitcher, surface context.
│   │   │   ├── device-frame.tsx
│   │   │   ├── device-frame.module.css
│   │   │   ├── fullscreen-button.tsx
│   │   │   └── status-bar.tsx
│   │   ├── device-settings/    ← Configurable device chrome (cutout type/position/pill size).
│   │   │   ├── types.ts        ← Types + localStorage key + defaults.
│   │   │   └── store.ts        ← Observable store + useDeviceSettings hook.
│   │   ├── bottom-nav/         ← Multi-variant nav (floating/tabbar/labeled/glass/soft/hard).
│   │   │   ├── bottom-nav.tsx
│   │   │   └── bottom-nav.module.css
│   │   ├── top-bar/            ← Multi-variant top app bar (large/center/inline/hero).
│   │   ├── stage/              ← Side panels + stage layout (desktop only).
│   │   │   ├── stage.tsx
│   │   │   └── stage.module.css
│   │   └── theme/              ← Device-scoped theme provider (dark/light).
│   │       ├── theme-provider.tsx
│   │       └── types.ts
│   └── prototypes/             ← Prototype screens/components/hooks/lib (one file per screen).
│       ├── bloom/              ← Reference prototype source (canonical M3).
│       │   ├── bloom.css       ← Prototype-wide styles (scoped under .bl).
│       │   ├── screens/        ← One file per screen (.tsx).
│       │   ├── components/     ← Prototype-specific UI pieces.
│       │   ├── state/          ← BloomProvider (plants, watering, prefs, toast).
│       │   └── lib/            ← Prototype-specific logic (data, helpers).
│       └── anime-app/          ← 6-screen prototype source (same structure).
│
├── public/                     ← Static files served verbatim by Next.js.
│   ├── prototypes/             ← Legacy index (navigation.md) — the static prototypes were
│   │   └── navigation.md          removed; this folder now only indexes routes.
│   └── assets/                 ← Shared static assets (icons, fonts, images).
│       └── navigation.md
│
├── templates/                  ← Reusable UI fragments (agent reference, not served).
│   └── navigation.md
│
├── archive/                    ← Backup of the pre-Next.js static site.
│   ├── STATIC-V1-MANIFEST.md   ← What was archived + why.
│   ├── static-v1.zip           ← Full snapshot of the old static site.
│   └── legacy/                 ← Old static prototype files (search-page, anime-app).
│
├── docs/                       ← ALL documentation lives here.
│   ├── navigation.md           ← Index of docs/ (read this to find a doc).
│   ├── agent-quickstart.md     ← 2-minute fast-start for any AI agent.
│   ├── prototype-blueprint.md  ← Step-by-step guide to build a new prototype.
│   ├── repo-map.md             ← THIS FILE. Visual tree of the repo.
│   ├── workflow.md             ← High-level prototype workflow (create→deploy).
│   ├── tech-stack.md           ← Allowed tech for prototypes + rationale.
│   ├── design-standards.md     ← UI/UX standards: spacing, type, color, frame.
│   ├── template-rules.md       ← Rules every prototype (built on proto-kit) follows.
│   ├── theme-architecture.md   ← CRITICAL: how app theme is scoped to .device.
│   ├── style-selection-guide.md← How to PICK a design language for a brief.
│   ├── design-languages/       ← Style specs for the 11 design languages.
│   │   └── glass-research.md   ← Deep glassmorphism research (failure modes, recipes).
│   ├── preferences.md          ← MANDATORY MEMORY: all user design preferences.
│   ├── notification-protocol.md← MANDATORY: how to notify via ntfy.sh.
│   ├── github-pages.md         ← Deployment guide + troubleshooting.
│   ├── git-conventions.md      ← Branch, commit, PR conventions.
│   └── design-systems/         ← DESIGN SYSTEM DOCS (M3 + basic principles).
│       ├── navigation.md
│       ├── design-system-guide.md
│       ├── material-3-expressive/
│       └── basic-design/
│
└── .github/                    ← GitHub configuration.
    ├── navigation.md
    └── workflows/
        └── deploy.yml          ← GitHub Actions: npm ci → next build → deploy out/.
```

---

## Quick lookup: where is X?

| You're looking for... | It's at... |
|---|---|
| The master context | `STARTUP.md` |
| The dashboard / gallery (live) | `app/page.tsx` → built to `out/index.html` |
| The reference prototype | `app/prototypes/bloom/` + `src/prototypes/bloom/` |
| The 6-screen anime prototype | `app/prototypes/anime-app/` + `src/prototypes/anime-app/` |
| The shared design system | `src/proto-kit/` (DeviceFrame, StatusBar, BottomNav, Stage, tokens, DeviceThemeProvider) |
| The shared tokens | `src/proto-kit/tokens/tokens.css` |
| How to build a prototype | `docs/prototype-blueprint.md` |
| Design rules for prototypes | `docs/template-rules.md` |
| Pick a design language (11 supported) | `docs/style-selection-guide.md` + `docs/design-languages/` |
| User's design preferences | `docs/preferences.md` |
| How theming works | `docs/theme-architecture.md` |
| How to notify the user | `docs/notification-protocol.md` |
| The deploy workflow | `.github/workflows/deploy.yml` |
| The Next.js config | `next.config.ts` |
| Old static site (backup) | `archive/` (zip + `legacy/` — the pre-Next.js static search-page + anime-app) |
| What changed recently | `CHANGELOG.md` |
| Reusable UI fragments | `templates/` |
| Shared icons/images | `public/assets/` |

---

## File roles at a glance

### Top-level files
| File | Role | Who reads it |
|---|---|---|
| `STARTUP.md` | Master context — read first | Every agent, every session |
| `README.md` | Public face on GitHub | Visitors, new collaborators |
| `navigation.md` | Master index of the repo | Any agent looking for something |
| `CHANGELOG.md` | History of changes | Any agent wondering "what happened" |
| `package.json` | Dependencies + scripts (`dev`, `build`, `start`, `verify`) | Anyone building locally / CI |
| `scripts/verify.mjs` | Pre-review gate: every prototype at every supported size (overflow / clipping / forbidden CSS) | Agents + the user, before review |
| `docs/SPEC.md` | **The authoritative system spec** — surfaces, tokens, components, adaptivity, targeting | Everyone; it wins every other doc |
| `docs/playbook.md` | How to work here without burning a cycle | Agents |
| `docs/native-bridge.md` | Token → Compose / SwiftUI mapping | Future native work |
| `ROADMAP.md` | Expansion phases, the locked decisions, what is done | Sessions picking up mid-stream |
| `package-lock.json` | Pinned dep versions — MUST be committed | CI (`npm ci` requires it) |
| `next.config.ts` | Static export + basePath config | Anyone debugging URLs or build |
| `tsconfig.json` | Path aliases + TS strictness | Anyone importing across `app/` ↔ `src/` |

### `app/` — Next.js App Router routes (thin)
| Path | Role |
|---|---|
| `layout.tsx` | Root `<html>` + fonts + metadata |
| `page.tsx` | Dashboard / prototypes gallery (served at Pages root) |
| `globals.css` | Minimal global reset (everything else is in CSS Modules) |
| `prototypes/<name>/layout.tsx` | Imports `tokens.css` + the prototype's CSS; pass-through wrapper |
| `prototypes/<name>/page.tsx` | Client component: shell (`DeviceThemeProvider` → `Stage` → `DeviceFrame` → `Screen` + `BottomNav`) + hash router |

### `src/proto-kit/` — the shared design system
| Path | Role |
|---|---|
| `index.ts` | Barrel: `DeviceFrame`, `Screen`, `StatusBar`, `BottomNav`, `Stage`, `PanelBadge/Title/Desc/Head`, `DeviceThemeProvider`, `useDeviceTheme`, `useDeviceSettings`/`saveDeviceSettings` |
| `tokens/tokens.css` | Single source of truth: type/spacing/radius/motion + M3 color roles + stage tokens |
| `device-frame/` | `<DeviceFrame>` (bezel + screen) + `<StatusBar>` + `<Screen>` + `<FullscreenButton>` |
| `surface/` | `<SurfaceFrame>` / `<SurfaceScreen>` (tablet + desktop window), `<DesktopSidebar>` / `<DesktopRail>` / `<DesktopTopBar>`, `<SurfaceSwitcher>`, `useCanonicalSurface` |
| `device-settings/` | Configurable device chrome — camera cutout type (punch/pill/notch), position (center/left), pill size. Store + `useDeviceSettings()`; set from the dashboard Settings page (`app/settings/`), applied by `<StatusBar>` on every device |
| `bottom-nav/` | `<BottomNav>` — floating pill, content-sized active item (42px pill / 58px bar) |
| `stage/` | `<Stage>` — desktop layout with left/right info panels |
| `theme/` | `<DeviceThemeProvider>` + `useDeviceTheme()` (scopes `data-theme` to `.device`) |

### `src/prototypes/<name>/` — prototype-specific source
| Subfolder | Role |
|---|---|
| `<name>.css` | Prototype-wide token overrides + global styles |
| `screens/` | One file per screen (`.tsx` + `.module.css`) |
| `components/` | Prototype-specific UI pieces |
| `hooks/` | Prototype-specific hooks (e.g. `use-anilist`) |
| `lib/` | Prototype-specific logic (API clients, filters, types) |

### `public/` — static files served verbatim
| Path | Role |
|---|---|
| `prototypes/navigation.md` | Prototype index (route table) — keep in sync with `app/page.tsx` |
| `assets/` | Shared icons/fonts/images (currently sparse — add when needed) |

### `archive/` — backup of the pre-Next.js site
| Path | Role |
|---|---|
| `static-v1.zip` | Full snapshot of the old static site |
| `legacy/<name>/` | Old static prototype files (preserved for diff/reference) |
| `STATIC-V1-MANIFEST.md` | What was archived + why |

### `templates/` and `public/assets/`
Both are currently sparse. They exist so that when patterns repeat, you have a place to promote them. Don't pre-fill — add when needed.

### `.github/`
| Path | Role |
|---|---|
| `workflows/deploy.yml` | Auto-deploys to GitHub Pages on push to `main` (`npm ci → next build → deploy out/`) |

---

## Navigation file chain

Every directory has a `navigation.md`. Follow the chain:

```
STARTUP.md
  └→ navigation.md (root)
       ├→ docs/navigation.md
       │    └→ (individual doc files)
       ├→ src/proto-kit/   (no navigation.md yet — see index.ts barrel)
       ├→ src/prototypes/<name>/  (no navigation.md yet — see the prototype's own docs)
       ├→ public/prototypes/navigation.md
       ├→ templates/navigation.md
       ├→ public/assets/navigation.md
       ├→ archive/STATIC-V1-MANIFEST.md
       └→ .github/navigation.md
```

**Rule:** If you add/rename/move/delete a file, update the nearest `navigation.md` in the **same commit**.

---

*Last updated: 2026-09-27 — search-page + legacy `_template` removed; `app/prototypes/bloom/` is the canonical M3 reference; `app/settings/` + `src/proto-kit/device-settings/` added (configurable device chrome). Old static files preserved under `archive/`. Keep this map accurate — it's how agents find things.*
