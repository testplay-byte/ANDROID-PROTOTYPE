# _template

The starter scaffold for every new prototype.

## What's inside

- A **phone frame** (status bar + screen + home indicator) that centers on desktop and goes full-screen on mobile.
- **Two sample views** (`home`, `detail`) with view-switching wired via `data-goto`.
- A **bottom navigation** bar with active-state syncing.
- A **theme toggle** (light/dark) with persistence via `localStorage`.
- A **live clock** in the status bar.
- Design tokens (spacing, type, color, radius, motion) matching `docs/design-standards.md`.
- Sample components: app bar, card, badge, buttons, list rows.

## Files

- `index.html` — markup
- `styles.css` — tokens + frame + components
- `script.js` — routing, theme, clock, demo list
- `navigation.md` — folder index

## How to start a new prototype

```bash
cp -r prototypes/_template prototypes/my-new-prototype
```

Then edit the three files and fill in `navigation.md` + `README.md`.

See `docs/workflow.md` for the full process.
