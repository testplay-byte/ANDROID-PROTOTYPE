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
├── index.html                  ← Homepage / prototypes gallery (GitHub Pages root).
├── .gitignore                  ← Git ignore rules.
│
├── docs/                       ← ALL documentation lives here.
│   ├── navigation.md           ← Index of docs/ (read this to find a doc).
│   ├── agent-quickstart.md     ← 2-minute fast-start for any AI agent.
│   ├── prototype-blueprint.md  ← Step-by-step guide to build a new prototype.
│   ├── repo-map.md             ← THIS FILE. Visual tree of the repo.
│   ├── workflow.md             ← High-level prototype workflow (create→deploy).
│   ├── tech-stack.md           ← Allowed tech for prototypes + rationale.
│   ├── design-standards.md     ← UI/UX standards: spacing, type, color, frame.
│   ├── template-rules.md       ← Rules every prototype built from _template follows.
│   ├── theme-architecture.md   ← CRITICAL: how app theme is scoped to .device.
│   ├── preferences.md           ← MANDATORY MEMORY: all user design preferences.
│   ├── notification-protocol.md← MANDATORY MEMORY: how to notify via ntfy.sh.
│   ├── github-pages.md         ← How deployment works + troubleshooting.
│   └── git-conventions.md      ← Branch, commit message, PR conventions.
│
├── prototypes/                 ← THE ACTUAL PROTOTYPES. One folder each.
│   ├── navigation.md           ← Index of all prototypes (status, links).
│   └── _template/              ← The starter template (copy to begin).
│       ├── index.html          ← Phone frame + 4 sample screens + side panels.
│       ├── styles.css          ← Design tokens + frame + components (v6).
│       ├── script.js           ← Routing, theme, clock, battery, scroll, fullscreen.
│       ├── navigation.md       ← Template's own index.
│       └── README.md           ← Short description of the template.
│   (future: <your-prototype>/  ← Each new prototype gets a folder here.)
│
├── templates/                  ← Reusable UI fragments (copy-paste sources).
│   ├── navigation.md           ← Index of templates/.
│   ├── components/             ← Atomic UI pieces (button, card, input…).
│   │   └── .gitkeep
│   └── screens/                ← Full-screen layouts (login, onboarding…).
│       └── .gitkeep
│   (Currently empty — add fragments as patterns repeat across prototypes.)
│
├── assets/                     ← Shared static assets.
│   ├── navigation.md           ← Index of assets/.
│   ├── icons/                  ← Reusable SVG icons.
│   │   └── .gitkeep
│   ├── fonts/                  ← Self-hosted font files.
│   │   └── .gitkeep
│   └── images/                 ← Shared images (logos, illustrations).
│       └── .gitkeep
│   (Currently empty — add when a real need arises.)
│
└── .github/                    ← GitHub configuration.
    ├── navigation.md           ← Index of .github/.
    ├── workflows/
    │   └── deploy.yml          ← GitHub Actions: auto-deploys to Pages on push.
    └── ISSUE_TEMPLATE/         ← (Reserved) Issue templates.
```

---

## Quick lookup: where is X?

| You're looking for... | It's at... |
|---|---|
| The master context | `STARTUP.md` |
| The homepage (live) | `index.html` (served at the Pages root URL) |
| The prototype template | `prototypes/_template/` |
| All prototypes index | `prototypes/navigation.md` |
| How to build a prototype | `docs/prototype-blueprint.md` |
| Design rules for prototypes | `docs/template-rules.md` |
| User's design preferences | `docs/preferences.md` |
| How theming works | `docs/theme-architecture.md` |
| How to notify the user | `docs/notification-protocol.md` |
| The deploy workflow | `.github/workflows/deploy.yml` |
| What changed recently | `CHANGELOG.md` |
| Reusable components | `templates/components/` (empty — add as needed) |
| Shared icons/images | `assets/` (empty — add as needed) |

---

## File roles at a glance

### Top-level files
| File | Role | Who reads it |
|---|---|---|
| `STARTUP.md` | Master context — read first | Every agent, every session |
| `README.md` | Public face on GitHub | Visitors, new collaborators |
| `navigation.md` | Master index of the repo | Any agent looking for something |
| `CHANGELOG.md` | History of changes | Any agent wondering "what happened" |
| `index.html` | Live homepage + gallery | Users browsing the site |

### `docs/` — the reference library
| File | Role |
|---|---|
| `agent-quickstart.md` | 2-minute on-ramp |
| `prototype-blueprint.md` | How to build a prototype (detailed) |
| `repo-map.md` | This file — the map |
| `workflow.md` | High-level workflow |
| `tech-stack.md` | Allowed tech |
| `design-standards.md` | UI/UX specs |
| `template-rules.md` | Template rules (frame, status bar, etc.) |
| `theme-architecture.md` | Theme scoping (CRITICAL) |
| `preferences.md` | User preferences (MEMORY) |
| `notification-protocol.md` | ntfy.sh protocol (MEMORY) |
| `github-pages.md` | Deploy guide |
| `git-conventions.md` | Git rules |

### `prototypes/` — the actual work
| Path | Role |
|---|---|
| `_template/` | The starter (copy this) |
| `<your-name>/` | Each prototype (self-contained: HTML+CSS+JS+docs) |

### `templates/` and `assets/`
Both are currently empty scaffolds. They exist so that when patterns repeat, you have a place to promote them. Don't pre-fill — add when needed.

### `.github/`
| Path | Role |
|---|---|
| `workflows/deploy.yml` | Auto-deploys to GitHub Pages on push to `main` |
| `ISSUE_TEMPLATE/` | Reserved for future issue templates |

---

## Navigation file chain

Every directory has a `navigation.md`. Follow the chain:

```
STARTUP.md
  └→ navigation.md (root)
       ├→ docs/navigation.md
       │    └→ (individual doc files)
       ├→ prototypes/navigation.md
       │    └→ prototypes/_template/navigation.md
       │    └→ prototypes/<each-prototype>/navigation.md
       ├→ templates/navigation.md
       ├→ assets/navigation.md
       └→ .github/navigation.md
```

**Rule:** If you add/rename/move/delete a file, update the nearest `navigation.md` in the **same commit**.

---

*Created: documentation pass (v7). Keep this map accurate — it's how agents find things.*
