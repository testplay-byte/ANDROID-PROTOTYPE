# docs/github-pages.md — Deployment Guide

> How prototypes get from a git push to a live URL.

---

## How it works

1. You push to `main`.
2. The GitHub Actions workflow at `.github/workflows/deploy.yml` runs.
3. It uploads the **entire repo** as a static Pages site (no build).
4. GitHub serves it at the Pages URL.

No build step. Every file in the repo is web-accessible.

---

## URLs

- **Repo:** `https://github.com/testplay-byte/ANDROID-PROTOTYPE`
- **Pages base:** `https://testplay-byte.github.io/ANDROID-PROTOTYPE/`
- **A prototype:** `https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/<name>/`
- **A specific file:** `https://testplay-byte.github.io/ANDROID-PROTOTYPE/<path/to/file>`

> The repo root `index.html` (the prototypes gallery — see below) lives at the Pages base URL.

---

## First-time setup (already done, for reference)

These were configured at init:

1. **Settings → Pages → Build and deployment → Source:** set to **GitHub Actions**.
2. The workflow `.github/workflows/deploy.yml` uses `actions/deploy-pages`.
3. Permissions in the workflow: `pages: write` and `id-token: write`.

If Pages ever breaks, re-check step 1 — the source must be "GitHub Actions", not "Deploy from a branch".

---

## The root gallery (`index.html` at repo root)

A lightweight `index.html` at the repo root lists all prototypes with links, so visiting the Pages base URL gives a navigable landing page (not a 404). It is auto-maintained: when you add a prototype, add a card to this file.

---

## Troubleshooting

| Symptom                                      | Fix                                                                 |
|----------------------------------------------|---------------------------------------------------------------------|
| 404 at Pages URL                             | Wait 60s; check Actions tab for a failed run; confirm source = Actions. |
| Prototype CSS missing                        | Check the `<link href="styles.css">` is relative, not absolute.     |
| Images broken                                | Paths must be relative (`./assets/...` or `../assets/...`).         |
| Workflow not running                         | Ensure `.github/workflows/deploy.yml` is on `main`.                 |
| Workflow fails on permissions                | Confirm repo Settings → Actions → General → Workflow permissions = read+write. |

---

## Checking deploy status

- **Web:** repo → Actions tab → latest "Deploy to GitHub Pages" run.
- **CLI:** `gh run list` (if `gh` is installed) or watch the Actions page.

A successful run prints the Pages URL in its summary.

---

*Last updated: repository initialization.*
