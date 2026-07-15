# prototypes/navigation.md

> Index of every prototype in this repo.
> When you add or retire a prototype, update this table in the same commit.

---

## Prototypes

| Folder        | Name            | Status        | Tech            | Live URL | Notes |
|---------------|-----------------|---------------|-----------------|----------|-------|
| `_template/`  | Starter template | reference    | HTML/CSS/JS     | [open](https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/_template/) | Copy to start a new prototype. |
| `anime-app/`  | Anime App       | review        | HTML/CSS/JS + AniList API | [open](https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/anime-app/) | 7-screen anime discovery & streaming app. Real AniList data, mock player, full settings. |

> The first real prototype (`anime-app/`) is live and in review status.

---

## Status legend

| Status        | Meaning                                                        |
|---------------|----------------------------------------------------------------|
| `in-progress` | Being built; not ready for review.                             |
| `review`      | Built; awaiting user feedback.                                 |
| `approved`    | User signed off; kept for reference.                           |
| `archived`    | Superseded or discarded; moved to `prototypes/_archived/`.    |
| `reference`   | Not a real prototype — a template/example (like `_template/`). |

---

## Conventions

- One folder per prototype, `kebab-case` name.
- Each folder is **self-contained**: its own `index.html`, `styles.css`, `script.js`, `navigation.md`, `README.md`.
- No cross-prototype imports. Shared assets go in `../../assets/`.
- Retired prototypes move to `_archived/<name>/` (create it when first needed).

---

*Last updated: documentation pass (v7) — template upgraded to v6 (4 screens, scoped theming, click-drag scroll, fullscreen API).*
