# navigation.md — Root Navigation Map

> This is the master index of the repository. If you are lost, start here.
> Every directory in this repo also has its own `navigation.md` — follow those for detail.

---

## Top-level files

| File             | What it is                                                      |
|------------------|-----------------------------------------------------------------|
| `STARTUP.md`     | **Read first.** Master context: what the project is, how to work in it, notification protocol. |
| `README.md`      | Public GitHub landing page.                                     |
| `navigation.md`  | This file — the root index.                                     |
| `CHANGELOG.md`   | Running log of notable changes (append on every task).          |
| `index.html`     | Homepage / prototypes gallery (served at the GitHub Pages root).|
| `.gitignore`     | Git ignore rules.                                               |

---

## Top-level directories

| Directory         | Purpose                                                            | Detail nav                |
|-------------------|--------------------------------------------------------------------|---------------------------|
| `docs/`           | All documentation: workflow, standards, deployment, protocols.     | [`docs/navigation.md`](./docs/navigation.md) |
| `prototypes/`     | **The actual prototypes.** One folder per prototype.               | [`prototypes/navigation.md`](./prototypes/navigation.md) |
| `templates/`      | Reusable UI fragments: components, screen shells.                  | [`templates/navigation.md`](./templates/navigation.md) |
| `assets/`         | Shared static assets: icons, fonts, images.                        | [`assets/navigation.md`](./assets/navigation.md) |
| `.github/`        | GitHub config: Actions workflows, issue templates.                 | [`.github/navigation.md`](./.github/navigation.md) |

---

## Where to go based on what you want to do

| You want to...                          | Go to                                                                 |
|-----------------------------------------|-----------------------------------------------------------------------|
| Understand the whole project            | [`STARTUP.md`](./STARTUP.md)                                          |
| **Get productive fast (2-min guide)**   | [`docs/agent-quickstart.md`](./docs/agent-quickstart.md)              |
| **See the full repo map**               | [`docs/repo-map.md`](./docs/repo-map.md)                              |
| Find a specific prototype               | [`prototypes/navigation.md`](./prototypes/navigation.md)              |
| **Build a new prototype (detailed)**    | [`docs/prototype-blueprint.md`](./docs/prototype-blueprint.md)        |
| Start a new prototype (high-level)      | [`prototypes/_template/`](./prototypes/_template/) + [`docs/workflow.md`](./docs/workflow.md) |
| Learn the tech stack                    | [`docs/tech-stack.md`](./docs/tech-stack.md)                          |
| Learn the UI/UX design standards        | [`docs/design-standards.md`](./docs/design-standards.md)              |
| Read the prototype template rules       | [`docs/template-rules.md`](./docs/template-rules.md)                  |
| Understand the theme architecture       | [`docs/theme-architecture.md`](./docs/theme-architecture.md)          |
| **Read user design preferences**        | [`docs/preferences.md`](./docs/preferences.md)                        |
| Understand GitHub Pages deployment      | [`docs/github-pages.md`](./docs/github-pages.md)                      |
| Read the notification protocol          | [`docs/notification-protocol.md`](./docs/notification-protocol.md)    |
| Reuse a UI component                    | [`templates/navigation.md`](./templates/navigation.md)                |
| Grab shared icons / fonts               | [`assets/navigation.md`](./assets/navigation.md)                      |
| See recent changes                      | [`CHANGELOG.md`](./CHANGELOG.md)                                      |

---

## Navigation discipline (reminder)

1. Every content directory has a `navigation.md`.
2. When you add/move/rename/delete anything, update the relevant `navigation.md` **in the same commit**.
3. Keep this root file accurate — it is the entry point for every future agent.

---

*Last updated: documentation pass (v7) — added agent-quickstart, prototype-blueprint, repo-map; fixed .github link.*
