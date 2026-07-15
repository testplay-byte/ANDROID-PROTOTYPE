# STARTUP.md — Read This First

> **If you are an AI agent (or a human) opening this repository for the first time, read this file in full before doing anything else.**
> This file is the single source of truth for *what this project is, how it is organized, and how to work in it without breaking things.*

---

## 1. What Is This Project?

This repository — **`ANDROID-PROTOTYPE`** — is a **mobile UI prototyping workspace**.

We design **mobile app UI interfaces** (Android-style, but viewable in any modern web browser) and deploy them as **live, interactive prototypes** via **GitHub Pages**. Each prototype is a real, clickable, fully functional web UI — not a static screenshot.

The goal is to validate look-and-feel on the web *before* committing to a native Android build.

---

## 2. Who Works Here?

- **The user (owner):** Provides design briefs, reviews prototypes, makes go/no-go decisions.
- **AI agents (you, most likely):** Create prototypes, manage the repo, write docs, keep navigation files updated, and notify the user on task completion.
- **Future AI agents:** Will rely on this file + every `navigation.md` to understand prior work. **Always leave the repo more navigable than you found it.**

---

## 3. Repository Layout (High Level)

```
ANDROID-PROTOTYPE/
├── STARTUP.md              ← YOU ARE HERE. Master context. Read first.
├── README.md               ← Public landing page for GitHub.
├── navigation.md           ← Root navigation map (every folder + what's in it).
├── CHANGELOG.md            ← Running log of notable changes.
├── index.html              ← Homepage / prototypes gallery (GitHub Pages root).
├── docs/                   ← All documentation (workflow, standards, deploy, etc.).
│   ├── navigation.md       ← Index of docs/.
│   ├── agent-quickstart.md ← 2-minute fast-start for any AI agent.
│   ├── prototype-blueprint.md ← Step-by-step guide to build a new prototype.
│   ├── repo-map.md         ← Visual annotated tree of the entire repo.
│   ├── workflow.md         ← High-level prototype workflow.
│   ├── tech-stack.md       ← Allowed tech + rationale.
│   ├── design-standards.md ← UI/UX standards (spacing, type, color, frame).
│   ├── template-rules.md   ← Rules every prototype follows.
│   ├── theme-architecture.md ← CRITICAL: app theme scoped to .device.
│   ├── preferences.md      ← MANDATORY MEMORY: all user design preferences.
│   ├── notification-protocol.md ← MANDATORY: how to notify via ntfy.sh.
│   ├── github-pages.md     ← Deployment guide + troubleshooting.
│   └── git-conventions.md  ← Branch, commit, PR conventions.
├── prototypes/             ← THE ACTUAL PROTOTYPES. One folder per prototype.
│   ├── navigation.md       ← Index of all prototypes (status, links, tech).
│   └── _template/          ← Copy this to start a new prototype (v6).
├── templates/              ← Reusable UI fragments (components, screen shells).
│   └── navigation.md
├── assets/                 ← Shared static assets (icons, fonts, images).
│   └── navigation.md
└── .github/
    ├── navigation.md
    └── workflows/
        └── deploy.yml      ← GitHub Pages auto-deploy on push.
```

> **Homepage design language:** the root `index.html` follows the approved warm-cream theme (cream `#f2e8da` bg, dark `#231e18` primary, orange `#f05100` chart accents) with a split top nav and a hero + stat cards + charts layout. Do not revert to a generic/blue look. See `docs/template-rules.md` for prototype-frame rules.

**Rule:** Every directory that contains project content has its own `navigation.md`. When in doubt about where something is, read the nearest `navigation.md`.

---

## 4. How Prototypes Are Built (Tech Stack)

Each prototype is a **self-contained static web app** so GitHub Pages can serve it with zero build step.

| Layer        | Choice                                                        |
|--------------|--------------------------------------------------------------|
| Structure    | Semantic HTML5                                               |
| Styling      | Modern CSS (custom properties, flexbox, grid) + optional Tailwind via CDN |
| Interactivity| Vanilla JavaScript (ES6+), optional Alpine.js via CDN        |
| Icons        | Inline SVG or Lucide icons (CDN)                             |
| Frame        | A phone mockup wrapper (status bar + screen area) so it reads as "mobile" on desktop |
| State        | In-file JS state; no backend, no database                    |

**Why static?** No build step = fastest iteration, direct GitHub Pages serving, and each prototype stays isolated and portable.

See `docs/tech-stack.md` for the full rationale and allowed libraries.

---

## 5. How to Create a New Prototype (Quick Start)

1. **Read** [`docs/prototype-blueprint.md`](./docs/prototype-blueprint.md) for the detailed step-by-step.
2. **Copy** `prototypes/_template/` → `prototypes/<your-prototype-name>/`.
3. **Edit** the `index.html`, `styles.css`, `script.js` inside.
4. **Fill in** the prototype's own `navigation.md` and `README.md`.
5. **Register** the new prototype in `prototypes/navigation.md` (the index).
6. **Add a card** to the root `index.html` gallery (optional, for real prototypes).
7. **Commit & push** to `main`. GitHub Actions auto-deploys to Pages.
8. **Verify** the live URL (see [`docs/github-pages.md`](./docs/github-pages.md)).
9. **Notify** the user via ntfy.sh (see §7 below).

Naming convention: `kebab-case`, descriptive. Example: `prototypes/food-delivery-checkout/`.

---

## 6. The Navigation Discipline (NON-NEGOTIABLE)

This repo is built to be navigable by AI agents. The rules:

1. **Every content directory has a `navigation.md`.** It lists what is inside, what each item is, and where to go next.
2. **Navigation files are updated FIRST when things change.** If you add/rename/move/delete anything, update the relevant `navigation.md` in the same commit.
3. **The root `navigation.md` is the master index.** Keep it accurate.
4. **Cross-link generously.** If a doc references another doc, link it.
5. **When you finish a task, append to `CHANGELOG.md`.**

A future agent should be able to understand the entire project by reading `STARTUP.md` → `navigation.md` → the relevant sub-`navigation.md`, without guessing.

---

## 7. Task Completion Notification Protocol (MANDATORY)

**Every time you complete a task — small or big — you MUST send a notification to the user via [ntfy.sh](https://nty.sh).**

- **Topic:** `TASKISDONE`
- **Endpoint:** `https://ntfy.sh/TASKISDONE`
- **Method:** HTTP POST (see `docs/notification-protocol.md` for exact commands)

### Emoji Color Code

| Emoji | Meaning                                         |
|-------|-------------------------------------------------|
| 🟩 Green  | Success — task completed successfully          |
| 🟥 Red    | Error / issue — needs attention                |
| 🟦 Blue   | Stopping the task — waiting for user input     |
| 🟧 Orange | Processing — task in progress (use sparingly)  |

### Message Format

**Line 1:** Exactly **8 emojis** (all the same color) representing the status.
**Line 2:** Blank.
**Line 3+:** Your actual message (concise: what was done, where, what's next).

#### Example — Success
```
🟩🟩🟩🟩🟩🟩🟩🟩

Task complete: Set up the ANDROID-PROTOTYPE repository structure.
- Created folder layout with navigation.md in every directory
- Configured GitHub Pages auto-deploy
- Pushed initial commit to main
Live URL: https://testplay-byte.github.io/ANDROID-PROTOTYPE/
Next: awaiting your first prototype brief.
```

#### Example — Error
```
🟥🟥🟥🟥🟥🟥🟥🟥

Issue: GitHub Pages deploy failed.
The deploy.yml references Node 20 but the action needs Node 22.
Fixing now. No action needed from you yet.
```

#### Example — Stopping for input
```
🟦🟦🟦🟦🟦🟦🟦🟦

Paused: I need your decision on the color system for the food-delivery prototype.
Option A: warm orange primary
Option B: green primary
Reply with A or B to continue.
```

**Never skip the notification.** Even if a task seems trivial, notify.

---

## 8. Git & GitHub Conventions

- **Default branch:** `main`
- **Commit messages:** Conventional-ish, imperative mood.
  - `feat: add food-delivery-checkout prototype`
  - `docs: update navigation for prototypes/`
  - `chore: fix Pages deploy workflow`
- **One logical change per commit** when possible.
- **Always push to `main`** unless working on a large feature — then use a `feat/<name>` branch and merge.
- **GitHub Pages source:** GitHub Actions (configured in repo settings + `.github/workflows/deploy.yml`).

---

## 9. Where Things Live (Quick Lookup)

| You want to...                         | Go to                                  |
|----------------------------------------|----------------------------------------|
| Understand the project                 | You're here. Then `navigation.md`.     |
| **Get productive fast (2-min guide)**  | [`docs/agent-quickstart.md`](./docs/agent-quickstart.md) |
| **See the full repo map**              | [`docs/repo-map.md`](./docs/repo-map.md) |
| See all prototypes                     | `prototypes/navigation.md`             |
| **Build a new prototype (detailed)**   | [`docs/prototype-blueprint.md`](./docs/prototype-blueprint.md) |
| Start a new prototype (high-level)     | `prototypes/_template/` + `docs/workflow.md` |
| Learn the tech stack                   | `docs/tech-stack.md`                   |
| Learn UI/UX standards                  | `docs/design-standards.md`             |
| Read the prototype template rules      | `docs/template-rules.md`               |
| Understand the theme architecture      | `docs/theme-architecture.md`           |
| **Read user design preferences**       | `docs/preferences.md`                  |
| Understand deployment                  | `docs/github-pages.md`                 |
| See the notification protocol (memory) | `docs/notification-protocol.md`        |
| Reuse a UI component                   | `templates/components/`                |
| Grab shared icons/fonts                | `assets/`                              |
| See what changed recently              | `CHANGELOG.md`                         |

---

## 10. Golden Rules

1. **Navigation files are sacred.** Update them in the same commit as the change they describe.
2. **Notify on every task.** No exceptions.
3. **Prototypes must be interactive.** A static screen is not a prototype here.
4. **Keep each prototype self-contained.** No cross-prototype dependencies except shared `assets/`.
5. **Leave breadcrumbs.** Future you (or another agent) should never have to guess.
6. **When unsure, read the nearest `navigation.md`.**

---

*Last updated: documentation pass (v7) — added agent-quickstart, prototype-blueprint, repo-map; updated for template v6.*
