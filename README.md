# ANDROID-PROTOTYPE

> A mobile UI prototyping workspace. We design **interactive, fully functional mobile app interfaces** and deploy them as live prototypes via **GitHub Pages**.

---

## What this is

This repository holds **web-based mobile UI prototypes** — real, clickable interfaces that look and feel like Android apps, rendered in the browser so they can be reviewed quickly before committing to a native build.

Each prototype is a self-contained static web app (HTML + CSS + JS) served directly by GitHub Pages. No build step, no backend.

---

## Start here

- **New to the repo?** Read [`STARTUP.md`](./STARTUP.md) first — it is the master context file.
- **Looking for something specific?** Check [`navigation.md`](./navigation.md) — the root index.
- **Want to build a prototype?** See [`docs/workflow.md`](./docs/workflow.md) and copy [`prototypes/_template/`](./prototypes/_template/).

---

## Live prototypes

Prototypes are deployed to GitHub Pages automatically on every push to `main`.

- **Base URL:** `https://testplay-byte.github.io/ANDROID-PROTOTYPE/`
- **A prototype at** `prototypes/my-app/index.html` **is reachable at:** `https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/my-app/`

See [`prototypes/navigation.md`](./prototypes/navigation.md) for the full, current list of prototypes with status and direct links.

---

## Repository structure

```
.
├── STARTUP.md          # Master context — read first
├── navigation.md       # Root navigation map
├── docs/               # Documentation (workflow, standards, deploy)
├── prototypes/         # The prototypes (one folder each)
├── templates/          # Reusable UI components & screen shells
├── assets/             # Shared icons, fonts, images
└── .github/workflows/  # GitHub Pages auto-deploy
```

Every directory has its own `navigation.md` explaining its contents.

---

## Tech stack (per prototype)

| Layer         | Choice                                              |
|---------------|-----------------------------------------------------|
| Markup        | Semantic HTML5                                      |
| Styling       | Modern CSS + optional Tailwind (CDN)                |
| Interactivity | Vanilla JS (ES6+), optional Alpine.js (CDN)         |
| Icons         | Inline SVG / Lucide (CDN)                           |
| Frame         | Phone mockup wrapper for desktop preview            |

See [`docs/tech-stack.md`](./docs/tech-stack.md) for the full rationale.

---

## Conventions

- Default branch: `main`
- Prototype folders use `kebab-case`
- Every directory has a `navigation.md`, updated alongside any change
- Every completed task triggers an `ntfy.sh` notification (see [`docs/notification-protocol.md`](./docs/notification-protocol.md))

---

## License

Proprietary — internal prototyping use only.
