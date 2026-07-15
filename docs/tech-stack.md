# docs/tech-stack.md — Prototype Tech Stack

> What each prototype is built with, and why. Stick to this unless you have a strong reason and you document it.

---

## Core stack (per prototype)

| Layer          | Choice                                              | Why                                                                                  |
|----------------|-----------------------------------------------------|--------------------------------------------------------------------------------------|
| Markup         | Semantic HTML5                                      | Accessible, indexable, zero tooling.                                                 |
| Styling        | Hand-written modern CSS (custom properties, flex/grid) | Full control, no build step, easy to read for future agents.                     |
| Optional CSS   | Tailwind via CDN (`https://cdn.tailwindcss.com`)    | Rapid styling when a prototype needs many utilities. CDN = no build.                 |
| Interactivity  | Vanilla JS (ES6+ modules)                           | No framework overhead, runs everywhere, easy to audit.                               |
| Optional JS    | Alpine.js via CDN (`https://unpkg.com/alpinejs`)    | For prototypes needing reactive state without writing a full framework.              |
| Icons          | Inline SVG, or Lucide via CDN                       | Crisp, themeable, no font payload.                                                   |
| Fonts          | System font stack + optional Google Fonts via `<link>` | Fast, native-feeling typography.                                                  |
| State          | In-file JS (objects/functions); localStorage if persistence needed | No backend. The prototype must run fully offline-capable on Pages.      |

---

## The phone frame

Every prototype is wrapped in a **phone mockup** so that on desktop it visibly reads as "this is a mobile screen".

The template (`prototypes/_template/`) ships a frame with:

- A centered device shell (~390×844 viewport, iPhone/Android-ish proportions).
- A status bar (time, battery, signal) — decorative.
- A scrollable screen area clipped to the device.
- Optional bottom nav bar slot.

On narrow viewports (actual phones), the frame collapses to full-screen so it behaves like a real app.

See [`design-standards.md`](./design-standards.md) for exact dimensions.

---

## What we deliberately avoid

| Avoid                             | Reason                                                                 |
|-----------------------------------|------------------------------------------------------------------------|
| React/Vue/Svelte build steps      | Adds tooling; GitHub Pages can serve static directly. Keep it simple. |
| npm/bun install per prototype     | Each prototype must be a folder you can open with no install.         |
| Backend / database / API keys     | Prototypes are front-end only. Mock all data in-file.                 |
| Heavy UI kits (Material UI etc.)  | Bloats and obscures the design intent. Hand-build or use Tailwind.    |
| jQuery                            | Outdated; vanilla ES6+ is shorter and faster now.                     |

---

## When you need a library not listed here

1. Check if vanilla CSS/JS can do it. Usually yes.
2. If not, prefer a **single-file CDN library** (no install, no build).
3. Document the dependency in the prototype's `navigation.md` (name, version, CDN URL, why).
4. If a prototype truly needs a build step, raise it with the user first (🟦 notification) — it changes the deploy model.

---

## CDN libraries currently approved

| Library   | URL                                                            | Use for                          |
|-----------|----------------------------------------------------------------|----------------------------------|
| Tailwind  | `https://cdn.tailwindcss.com`                                  | Utility-first styling            |
| Alpine.js | `https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js`             | Lightweight reactivity           |
| Lucide    | `https://unpkg.com/lucide@latest`                              | Icon set                         |

Always pin a version when a prototype goes to `review` status.

---

*Last updated: repository initialization.*
