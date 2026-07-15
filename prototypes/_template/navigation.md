# prototypes/_template/navigation.md

> The starter template. Copy this whole folder to begin a new prototype.

---

## Files

| File           | What it is                                                         |
|----------------|--------------------------------------------------------------------|
| `index.html`   | Entry point: phone frame (36px corners, punch-hole) + 2 sample views + bottom nav. |
| `styles.css`   | Design tokens + frame + status bar (signal/wifi/bt/battery) + components. |
| `script.js`    | View routing (`data-goto`), theme toggle, live clock, battery fill, demo list. |
| `navigation.md`| This file.                                                         |
| `README.md`    | Short description of the template.                                 |

## How to use

1. Copy this folder to `prototypes/<your-name>/`.
2. Replace the content of the two views; add more `<section class="view" data-view="...">` blocks as needed.
3. Add bottom-nav items with `data-goto="<viewName>"`.
4. Extend `styles.css` — keep the tokens, add your components.
5. Fill in this folder's `navigation.md` and `README.md`.
6. Register the prototype in `../navigation.md`.

## Live preview

Once deployed: `https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/_template/`

---

*Last updated: repository initialization.*
