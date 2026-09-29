# docs/SPEC.md — the ANDROID-PROTOTYPE design-system specification

> **This is the authoritative document.** When any other doc disagrees with this one, this
> one is right — and the other doc is a bug. Tokens, surfaces, components, adaptivity and
> the authoring conventions live here. Everything else in `docs/` is either a deep dive
> (`design-languages/*.md`), a process doc (`workflow.md`, `git-conventions.md`), or
> historical material.
>
> If you are an agent building a prototype: read §1–§4, skim §5–§6, then open the design
> language you were given (`docs/design-languages/<style>.md`) and copy that language's
> existing prototype. That is the whole path.

---

## 1. What this repo is

A **multi-surface UI prototype workspace**. Every prototype is a real, interactive web app
deployed to GitHub Pages — not a screenshot, not a mock.

| Surface | What it is | Frame | Sizes |
|---|---|---|---|
| **phone** | touch-first mobile app | `<DeviceFrame>` — bezel, status bar, bottom nav | 360×740 · **390×844** · 430×932 · custom (320–520 × 600–1000), set in the dashboard **Settings** page |
| **tablet** | the **desktop layout system** at tablet size | `<SurfaceFrame surface="tablet">` | 834×1112 portrait · 1112×834 landscape |
| **desktop** | desktop app | `<SurfaceFrame surface="desktop">` | 1280×800 default, resizes with the stage |

**The one rule that keeps this honest:** *a desktop prototype is never a phone prototype
stretched to a wider size.* Phone and desktop share **design languages, tokens and quality
rules** — they never share **layouts or interaction patterns**. A phone's nav is a bottom
bar; a desktop's is a sidebar or rail. A phone shows detail by pushing a screen; a desktop
shows it in a panel *beside* the data. A phone has a search screen; a desktop has ⌘K.
If you catch yourself "making a prototype responsive" across surfaces, you have the wrong
architecture — build a second prototype.

---

## 2. Repository anatomy

```
app/page.tsx                 dashboard (PROTOTYPES data + hero/stats/charts)
app/settings/                device settings page
app/prototypes/<name>/       ONE FOLDER PER PROTOTYPE — route
  page.tsx                    client shell (the "reference" for structure)
  layout.tsx                  imports the token CSS, once
  navigation.md               what it is, files, decisions, non-obvious decisions
src/prototypes/<name>/       same prototype's source
  <name>.css                  the stylesheet, with a STYLE INDEX header
  data.ts                     deterministic demo data (no Math.random, ever)
  state/<name>-context.tsx    one context for the app
  components/                 shared parts of THIS prototype
  screens/                    one file per screen/view
src/proto-kit/               the shared design system (see §4)
src/dashboard/               gallery, thumbs, settings panel, theme toggle
docs/                        this file + deep dives
```

Import paths from a prototype route are `../../../src/...` — always.

---

## 3. The authoring contract

Every prototype, without exception:

1. **Tokens only.** Colors, radii, spacing, type, motion come from `var(--*)`. A hardcoded
   hex, `rgb()` or `!important` in a prototype stylesheet is a defect. Use
   `color-mix(in srgb, var(--color-primary) 20%, transparent)` for tints.
2. **Deterministic data.** No `Math.random()`, no `Date.now()` in render. Fixed arrays or a
   seeded generator, so every load looks identical.
3. **A stylesheet with a STYLE INDEX** — a comment block at the top listing every section
   with numbers (§6).
4. **A `navigation.md`** updated in the same commit as any change to the prototype, with a
   "Non-obvious decisions" section for the traps you hit.
5. **Real interactions.** Every control does something. A dead affordance is a defect.
6. **Both themes.** Light and dark must both be designed, not just inherited.
7. **Content realism.** Real-sounding names, numbers and copy — never "Lorem", "Item 1",
   "Test 2".

---

## 4. The design system (`src/proto-kit`)

### 4.1 Components

| Import | Use it for | Never use it for |
|---|---|---|
| `<DeviceFrame theme style>` | the phone window | anything on desktop |
| `<Screen>` | the phone's scroll area | — |
| `<SurfaceFrame surface theme style width height windowChrome menu draggable fullscreen surfaces slug storageKey>` | the tablet/desktop window — window controls, drag-resize, fullscreen and the wrong-surface notice are built in | phone |
| `<SurfaceScreen>` | the desktop scroll area | phone |
| `<DesktopSidebar items activeId onSelect>` | desktop navigation (icon + label, sections) | phone |
| `<DesktopRail items activeId onSelect>` | desktop navigation (icon-only, dense) | phone |
| `<DesktopTopBar title subtitle tools actions>` | the desktop toolbar | phone |
| `<BottomNav variant>` | phone navigation — `floating` \| `tabbar` \| `labeled` \| `glass` \| `soft` \| `hard` | desktop |
| `<TopBar variant>` | phone headers — `large` \| `center` \| `inline` \| `hero` | desktop |
| `<Stage leftPanel rightPanel>` | the presentation frame (info panels + Dashboard link) | — |
| `<DeviceThemeProvider storageKey>` | theme state, scoped to `.device` **or** `.surface` | — |
| `useKeyboardInput` / `<Keyboard>` | the custom on-screen keyboard | — |
| `useSwipeSimulation` | phone swipe gestures | desktop (use hover/click) |
| `<SurfaceSwitcher surfaces current slug>` | the bottom-right quick switch between a prototype's surfaces | — |
| `useCanonicalSurface(slug, surface)` | keeps the URL on `/prototypes/<slug>/<surface>/` | — |
| `useDeviceSettings` / `saveDeviceSettings` | the user-configurable phone (cutout + size) | — |

### 4.2 Tokens

`src/proto-kit/tokens/tokens.css` is the single source of truth. Three layers, in order:

1. **`:root`** — page + stage tokens (`--stage-bg`, `--sb-*`) and the base type/spacing/radius
   scale (`--fs-*`, `--sp-*`, `--r-*`, `--dur-*`, `--ease-*`).
2. **`:is(.device, .surface)`** — the APP layer: `--color-bg`, `--color-surface-1…5`,
   `--color-text*`, the M3 roles (`--color-primary`, `--color-primary-container`,
   `--color-on-primary-container`, secondary/tertiary, `--color-error`, `--color-warn`,
   `--color-outline`, `--color-outline-variant`), plus `--shadow-1/2/inset`, `--border-w`,
   `--device-radius` and the frame tokens.
3. **`src/proto-kit/styles/<style>.css`** — one file per design language defining the full
   token contract in both themes, scoped to `:is(.device, .surface)[data-style="<id>"]`.
   Import it via `styles/index.css`, **after** `tokens.css`.

Because both frames carry the same selectors, **the same prototype CSS works unchanged on
phone and desktop** — the language travels, the layout does not.

### 4.3 Adding a design language (6 registration points)

_(Exercised for real on 2026-09-28 when **Console** was added alongside the
Signal prototype — all six points, no surprises.)_

1. `src/proto-kit/styles/<style>.css` — the token contract for both themes.
2. Register it in `src/proto-kit/styles/index.css`.
3. Add the id + label to `src/proto-kit/styles/types.ts` (`DeviceStyle`, `DEVICE_STYLES`,
   `STYLE_LABELS`).
4. Add the id to `STYLE_ORDER` in `src/dashboard/gallery.tsx` (grouping order) and a
   `[data-style="<id>"]` rule for `--secbg / --secedge / --secdot` in `dashboard.css`.
5. Write `docs/design-languages/<style>.md` from the 9-section template.
6. Add the prototype to `app/page.tsx` (`PROTOTYPES`, with `surfaces`) — that is also what
   makes it appear on the dashboard.

---

## 5. Surfaces in practice

### 5.1 Phone

- The frame size comes from the **user's setting**, not from your CSS. Prototype CSS must
  therefore never assume a width: no fixed `width:` on a screen container, no
  `min-width` larger than 320px, and every horizontal strip needs `flex: 0 0 auto` if it
  scrolls (an `overflow-x: auto` child of a column flex has an automatic min-size of **0**
  and will collapse — failure mode #26).
- Verify at **360, 390 and 430**.

### 5.2 URLs are surface-specific

Every surface has its own address, so a phone app and a desktop app can share
a name without colliding and the address bar always says which one you see:

```
/prototypes/bloom/                    phone (the slug route)
/prototypes/meridian/desktop/         desktop
/prototypes/meridian/tablet/          the same build at tablet size
```

`app/prototypes/_registry.ts` maps slug → surfaces → the component to render
(underscore-prefixed, so it is data, not a route). Adding a desktop build of
an existing phone app means: add its entry, pass `surfaces`/`slug` to its
`SurfaceFrame`, and its URL appears. A desktop prototype also calls
`useCanonicalSurface` so its bare `/prototypes/<slug>/` URL rewrites itself.

### 5.3 Desktop window behaviour

- **Window controls** — one group at the TOP RIGHT of the title bar, in the
  order minimize · maximize · close, with the window title on the left.
  Minimize collapses to the title bar; maximize enters REAL fullscreen (the
  browser chrome disappears) and restores the previous size on the way back;
  close shows a "closed window" state with a Reopen button — prototypes never
  actually navigate away.
- **Drag to resize** — 8 handles (4 edges + 4 corners) with the right cursors;
  the size is persisted per prototype (`storageKey`, default the window
  title) and restored on the next visit.
- **Fullscreen** — the bottom-left button uses the real Fullscreen API, so the
  browser chrome disappears.
- **Wrong surface** — below 520px of browser width a desktop/tablet prototype
  explains itself instead of rendering a squashed window.
- **Preview chrome is the stage's, never the app's** — the Dashboard link
  (top-left), the full screen control (bottom-left) and the surface switcher
  (bottom-right) are rendered by `<Stage>` and all share one `.previewpill`
  visual, so the three corners always match. A prototype's own UI never
  contains preview controls.
- **Scrollbars** — token-driven and visible on tablet/desktop; phones keep
  them hidden.
- **Radii** — the desktop surface tightens the radius scale (`--r-lg` 14px,
  `--r-pill` 8px) so a desktop window reads less bubbly than a phone; tablet
  keeps the phone radii.

- The window **resizes**: `width: min(var(--surface-w), 100%)`, and the surface is a query
  container named `surface`. Prototype breakpoints are therefore `@container surface
  (max-width: 1000px)` — **not** `@media`, which responds to the browser window and would
  never fire inside a fixed-width surface.
- Layout expectations at 1280×800: a sidebar (232px) or rail (68px), a top bar (60px), and
  content in a 2–4 column grid. Content reflows to 2 columns by 1000px and 1 by 760px.
- Density: one `data-density` attribute on the view root, with a compact block that
  restates paddings. Desktop users expect density control; phones do not.
- Chrome is **app-style by default**. `windowChrome` + `menu` are for OS-level apps.

---

## 6. Adaptivity — the non-negotiable rules

Every screen must survive its surface at any supported size. In order of how often they
bite:

1. **No fixed-px grid track minimums.** `grid-auto-rows: minmax(96px, auto)` looks like
   "96px or grow" but Chrome **never grows a track whose minimum is a fixed length** —
   content just clips. Use `minmax(min-content, auto)` and put the floor on the item
   (`min-height`). *(failure mode #25)*
2. **Every flex child that scrolls needs `flex: 0 0 auto`.** *(#26)*
3. **Every text row declares its overflow behaviour** — wrap, or ellipsize with
   `min-width: 0` somewhere in the flex chain. Never clip mid-word.
4. **Tracks grow, floors live on items.** Same idea as #1 for `auto-fill` grids.
5. **No `vh`/`vw` inside a surface or frame** — they resolve against the *browser*, not the
   device. *(#16)*
6. **Verify at the real size.** 360/390/430 for phone; 1280, 1000 and 760 for desktop.
   Check `scrollHeight > clientHeight` on anything the user cannot scroll.

The full catalogue with code examples is `docs/ui-failure-modes.md` — 26 classes, and the
19-point checklist at the end of that file is the pre-review gate.

---

## 7. Targeting one element (the "edit anything" rule)

The system is built so you never have to read the whole prototype to change one thing.

- **One stylesheet per prototype**, with a numbered STYLE INDEX header. Open the CSS, read
  8 lines of index, jump to the right section.
- **Class naming**: `<proto-prefix>__<block>__<element>` is welcome but optional; the
  contract is that class names are greppable and never collide across prototypes.
- **Tokens are the tuning surface.** If a value is used by more than one element, it is a
  token — change the token, not the element.
- **State through data attributes**, not modifier classes you invent per element:
  `data-density`, `data-status`, `data-priority`, `data-theme`, `data-style`. One CSS rule
  then covers every instance.
- **Design-language overrides live in one place**: `:global([data-style="brutalism"]) .thing`.
- **Never fight specificity.** Root resets use `:where()`; component rules stay
  single-class. *(#24)*

---

## 8. Verification

```bash
npm run build          # must be clean; tsc runs first
node scripts/verify.mjs           # all prototypes at their supported sizes
node scripts/verify.mjs atlas     # just one
```

`scripts/verify.mjs` opens every prototype headlessly at its supported sizes and fails on
horizontal overflow, clipped content, or forbidden CSS patterns (vh/vw in-frame, fixed-px
grid track minimums), writing screenshots to `.verify/`. Run it before asking for a
review. Then read `docs/ui-failure-modes.md`'s checklist once more with your own eyes.

---

## 8.5 The prototype inventory (what already exists)

Do not rebuild one of these — study it first.

**Phone (23)**: `bloom` (M3 reference), `anime-app`, `setup-wizard` (M3);
`wallet`, `fitness-tracker` (HIG); `finance-hub`, `pulse` (Carbon);
`music-player`, `still` (Neumorph); `weather-app`, `drift` (Glass);
`streetwear-store`, `ruckus` (Brutalism); `kids-learning`, `simmer` (Clay);
`linie`, `gallery-app` (Bauhaus); `nook`, `habit-tracker` (Minimal);
`atlas`, `smart-home` (Bento); `hop`, `chat-app` (Flat).

**Desktop & tablet (12) — one per language, each at `/prototypes/<slug>/desktop/`
and `/tablet/`:**

| Language | Prototype | Notes |
|---|---|---|
| m3 | **Meridian** | **the reference desktop build** — copy its shell for new desktop work |
| hig | Quill | three-column window, detail beside the list |
| carbon | Telemetry | dense table + sticky detail, incident flow |
| console | **Signal** | reference for data-heavy UI: nine hand-built SVG charts |
| neumorph | Halo | soft extruded device tiles, softness control |
| glass | Aurora | layered translucency, unit + intensity controls |
| brutalism | Stockyard | inventory console, density toggle |
| clay | Mochi | planner, clay-depth control |
| bauhaus | Atelier | plate wall, primary-colour kanban |
| flat | Counter | booking app, schedule grid + conflicts |
| bento | Facet | tile grid with real span cycling |
| minimal | Thin | tasks + writing, type-scale control |

## 9. What is NOT here (and where it lives)

| Topic | File |
|---|---|
| The 26 rejected UI defects + checklist | `docs/ui-failure-modes.md` |
| Each design language's palette, shape, traps, demo app | `docs/design-languages/*.md` |
| Picking a language for a brief | `docs/style-selection-guide.md` |
| The user's mandatory design preferences | `docs/preferences.md` |
| Build/deploy | `docs/github-pages.md` |
| Process, git, notification protocol | `docs/workflow.md`, `docs/git-conventions.md`, `docs/notification-protocol.md` |
| The expansion plan + locked decisions | `../ROADMAP.md` |
| Android/Compose porting | `docs/android-dev/` |
