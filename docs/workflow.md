# docs/workflow.md — Prototype Workflow

> The end-to-end process for creating, updating, and retiring a prototype.
> Follow this every time. When in doubt, the steps here win.

---

## 0. Before you start

- Read [`STARTUP.md`](../STARTUP.md) and [`design-standards.md`](./design-standards.md).
- Confirm the prototype brief from the user: which screens, what interactions, what vibe.
- Pick a `kebab-case` name that describes the app/flow. Example: `food-delivery-checkout`.

---

## 1. Scaffold the prototype

1. Copy `prototypes/_template/` → `prototypes/<your-name>/`.
2. Inside the new folder you should have:
   - `index.html` — entry point (the phone frame + first screen).
   - `styles.css` — all styles.
   - `script.js` — all interactivity.
   - `navigation.md` — describes this prototype (fill it in).
   - `README.md` — short description, screens list, live link.

> **Never** share CSS/JS across prototypes via relative imports. Each prototype is self-contained. Shared look-and-feel belongs in `templates/` and `assets/`.

---

## 2. Build the screens

1. Start from the phone frame in the template (status bar + screen viewport).
2. Implement each screen as a section/view inside the frame.
3. Wire up navigation between screens in `script.js` (show/hide views, or hash routing).
4. Make it **interactive**: taps, transitions, form inputs, toggles, loading states. A static screen is not acceptable here.
5. Respect [`design-standards.md`](./design-standards.md): 44px touch targets, mobile type scale, safe-area insets, etc.

---

## 3. Document the prototype

Fill in the prototype's own `navigation.md` and `README.md`:

- What the prototype demonstrates.
- List of screens with one-line descriptions.
- Known interactions / flows.
- Any open questions for the user.
- The live URL once deployed.

---

## 4. Register the prototype in the index

Open `prototypes/navigation.md` and add a row to the prototypes table:

| Name | Status | Tech | Live link | Notes |

Status values: `in-progress`, `review`, `approved`, `archived`.

---

## 5. Commit & push

```bash
git add prototypes/<your-name> prototypes/navigation.md
git commit -m "feat: add <your-name> prototype"
git push origin main
```

GitHub Actions auto-deploys. See [`github-pages.md`](./github-pages.md).

---

## 6. Verify the live prototype

1. Wait ~30–60s after push.
2. Open `https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/<your-name>/`.
3. Click through every flow you built. If something is broken, fix and re-push.

---

## 7. Notify the user

Send an `ntfy.sh` notification per [`notification-protocol.md`](./notification-protocol.md). Use 🟩 for success.

---

## 8. Update a prototype

- Edit files in `prototypes/<name>/`.
- If you add/remove screens, update that prototype's `navigation.md` and `README.md`.
- Append a line to `CHANGELOG.md`.
- Commit, push, verify, notify.

---

## 9. Retire / archive a prototype

1. Move `prototypes/<name>/` → `prototypes/_archived/<name>/` (create `_archived/` if needed).
2. Update `prototypes/navigation.md`: mark status `archived`, keep the row for history.
3. Note in `CHANGELOG.md`.
4. Commit, push, notify.

---

## 10. The non-negotiable checklist (before you push)

- [ ] Prototype is **interactive**, not static.
- [ ] Prototype's `navigation.md` and `README.md` are filled in.
- [ ] `prototypes/navigation.md` index row added/updated.
- [ ] `CHANGELOG.md` has a new entry.
- [ ] No secrets, no absolute local paths, no backend calls.
- [ ] You will notify the user after push.

---

*Last updated: repository initialization.*
