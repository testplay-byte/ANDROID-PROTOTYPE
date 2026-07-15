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
| `.gitignore`     | Git ignore rules.                                               |

---

## Top-level directories

| Directory         | Purpose                                                            | Detail nav                |
|-------------------|--------------------------------------------------------------------|---------------------------|
| `docs/`           | All documentation: workflow, standards, deployment, protocols.     | [`docs/navigation.md`](./docs/navigation.md) |
| `prototypes/`     | **The actual prototypes.** One folder per prototype.               | [`prototypes/navigation.md`](./prototypes/navigation.md) |
| `templates/`      | Reusable UI fragments: components, screen shells.                  | [`templates/navigation.md`](./templates/navigation.md) |
| `assets/`         | Shared static assets: icons, fonts, images.                        | [`assets/navigation.md`](./assets/navigation.md) |
| `.github/`        | GitHub config: Actions workflows, issue templates.                 | (see `.github/` contents) |

---

## Where to go based on what you want to do

| You want to...                          | Go to                                                                 |
|-----------------------------------------|-----------------------------------------------------------------------|
| Understand the whole project            | [`STARTUP.md`](./STARTUP.md)                                          |
| Find a specific prototype               | [`prototypes/navigation.md`](./prototypes/navigation.md)              |
| Start a new prototype                   | [`prototypes/_template/`](./prototypes/_template/) + [`docs/workflow.md`](./docs/workflow.md) |
| Learn the tech stack                    | [`docs/tech-stack.md`](./docs/tech-stack.md)                          |
| Learn the UI/UX design standards        | [`docs/design-standards.md`](./docs/design-standards.md)              |
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

*Last updated: repository initialization.*
