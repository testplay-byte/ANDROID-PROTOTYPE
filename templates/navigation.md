# templates/navigation.md

> Reusable UI fragments. These are **not** deployed as standalone pages — they are copy-paste sources for prototypes.

---

## Structure

| Subfolder        | Holds                                                        |
|------------------|--------------------------------------------------------------|
| `components/`    | Atomic UI pieces (button, card, input, list row, badge…).   |
| `screens/`       | Full-screen layouts (login, onboarding step, empty state…). |

Each fragment is a standalone `.html` (markup) + optional `.css`/`.js` snippet, with a short header comment explaining usage.

---

## How to use a template fragment

1. Open the fragment file.
2. Copy the markup (and the CSS/JS if present) into your prototype.
3. Adapt tokens — fragments use the same CSS custom properties as `_template/styles.css`.

---

## Currently empty

This folder is scaffolded but contains no fragments yet. Add them as patterns repeat across prototypes (don't pre-build; build when needed, then promote to here).

---

*Last updated: repository initialization.*
