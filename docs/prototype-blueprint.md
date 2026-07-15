# docs/prototype-blueprint.md — How to Build a New Prototype

> A detailed, step-by-step blueprint for creating a new prototype from the template.
> Read this alongside [`docs/workflow.md`](./workflow.md) (which is the high-level process).
> This is the **how-to with specifics**.

---

## Prerequisites

Before you start, you should have read:
- [`STARTUP.md`](../STARTUP.md)
- [`docs/preferences.md`](./preferences.md) — user's design preferences
- [`docs/template-rules.md`](./template-rules.md) — the rules every prototype follows
- [`docs/theme-architecture.md`](./theme-architecture.md) — how theming works

---

## Step 1: Name the prototype

- Use `kebab-case`, descriptive of the app or flow.
- Examples: `food-delivery-checkout`, `bank-onboarding`, `music-player-home`.
- Avoid generic names like `app1` or `prototype-v2`.

---

## Step 2: Copy the template

```bash
cd /home/z/DESIGN-PROTOTYPE
cp -r prototypes/_template prototypes/<your-name>
```

You now have a folder with:
```
prototypes/<your-name>/
├── index.html      ← markup (phone frame + 4 sample screens)
├── styles.css      ← design tokens + frame + components
├── script.js       ← routing, theme, clock, battery, scroll, fullscreen
├── navigation.md   ← fill this in
└── README.md       ← fill this in
```

---

## Step 3: Plan your screens

Before writing code, decide:
1. **How many screens?** (typically 3–6 for a prototype)
2. **What is each screen?** (home, search, detail, settings, profile, etc.)
3. **What navigation pattern?** (bottom nav with tabs? stack with back button? both?)
4. **What interactions?** (buttons, toggles, forms, lists, cards)

Write this down in the prototype's `navigation.md` as a screen list.

---

## Step 4: Edit `index.html`

### 4.1 Update the `<title>`
```html
<title>Food Delivery Checkout — ANDROID-PROTOTYPE</title>
```

### 4.2 Keep the device frame and status bar as-is
The `<div class="device">` wrapper, status bar, punch-hole, and system icons are **standard** — don't modify them unless the brief specifically requires it. They follow [`docs/template-rules.md`](./template-rules.md).

### 4.3 Replace the sample views
Each screen is a `<section class="view" data-view="<name>">`. The template has 4 sample views (`home`, `search`, `profile`, `settings`). Replace their content with your screens.

To add a new screen:
```html
<section class="view" data-view="checkout" aria-label="Checkout screen">
  <header class="appbar">
    <button class="iconbtn" data-goto="cart" aria-label="Back"><!-- back arrow SVG --></button>
    <h1 class="appbar__title">Checkout</h1>
  </header>
  <div class="content">
    <!-- your screen content here -->
  </div>
</section>
```

### 4.4 Update the bottom nav
Each `<button class="bottomnav__item" data-goto="<name>">` corresponds to a view. Add/remove items to match your screens. Keep it to 3–5 items.

### 4.5 Update the left side panel
- Replace the screen list (`<button class="screentlist__item" data-goto="...">`) with your screens.
- Update the prototype name, description, and tags.

### 4.6 Update the right side panel
- The screen info (`SCREEN_INFO` in `script.js`) will auto-update.
- Update the mini-donut and mini-bars data to reflect your prototype's components.

---

## Step 5: Edit `styles.css`

### 5.1 Override `--color-primary` if needed
The template uses orange (`#f05100`). If your app has a different brand color, override it:

```css
.device {
  --color-primary: #your-brand-color;
  --color-primary-fg: #ffffff; /* or whatever contrasts */
}
.device[data-theme="dark"] {
  --color-primary: #your-dark-brand-color;
}
```

**Don't change** the other tokens, the frame dimensions, the status bar, or the page-level tokens (`--stage-bg`, `--sb-*`).

### 5.2 Add your components
Add new CSS rules for your prototype's unique components. Use the existing tokens (`var(--space-lg)`, `var(--color-surface)`, etc.) for consistency.

### 5.3 Keep these rules intact
- `body { user-select: none; }` — no text selection
- `.view { scrollbar-width: none; }` + `.view::-webkit-scrollbar { display: none; }` — no scrollbar
- `.device:fullscreen { ... }` — fullscreen layout
- `@media (pointer: fine) { .view { cursor: grab; } }` — drag cursor hint

---

## Step 6: Edit `script.js`

### 6.1 Update `SCREEN_INFO`
```javascript
var SCREEN_INFO = {
  home:     { name: "Home",     desc: "Browse restaurants and search by cuisine." },
  cart:     { name: "Cart",     desc: "Review selected items and adjust quantities." },
  checkout: { name: "Checkout", desc: "Enter delivery address and payment method." },
  confirm:  { name: "Confirm",  desc: "Order placed successfully with tracking info." }
};
```

### 6.2 Add your interactions
The template ships with: view routing, theme toggle, clock, battery fill, like buttons, toggles, follow button, tabs, search filter, chip clicks, click-drag scroll, and fullscreen API.

Add your own interactions below these. Keep the same patterns:
- Use event delegation (`document.addEventListener("click", ...)` with `e.target.closest()`).
- Use `data-*` attributes for behavior triggers (`data-goto`, `data-like`, `data-toggle`).
- Keep functions small and named clearly.

### 6.3 Don't remove these modules
- Theme toggle (scoped to `.device`)
- Click-drag-to-scroll (desktop)
- Fullscreen API (mobile)
- The `selectstart`/`dragstart` note (they're intentionally NOT added — see comments)

---

## Step 7: Fill in documentation

### 7.1 `navigation.md` (in your prototype folder)
```markdown
# prototypes/<your-name>/navigation.md

## What this prototype is
<one-paragraph description>

## Screens
| Screen | View name | Description |
|--------|-----------|-------------|
| Home   | `home`    | Browse restaurants |
| Cart   | `cart`    | Review items |
| ...    | ...       | ... |

## Interactions
- Like buttons (toggle)
- Quantity steppers
- Address autocomplete
- Payment method selector

## Files
| File | What it is |
|------|------------|
| `index.html` | ... |
| `styles.css` | ... |
| `script.js` | ... |

## Live URL
https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/<your-name>/
```

### 7.2 `README.md`
A shorter version — name, description, screens list, live link.

---

## Step 8: Register in the index

Open [`prototypes/navigation.md`](../prototypes/navigation.md) and add a row:

```markdown
| `<your-name>/` | Food Delivery Checkout | in-progress | HTML/CSS/JS | [open](https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/<your-name>/) | Cart → checkout → confirm flow. |
```

---

## Step 9: Commit, push, verify

```bash
cd /home/z/DESIGN-PROTOTYPE
git add prototypes/<your-name> prototypes/navigation.md
git commit -m "feat: add <your-name> prototype

- <N> screens: <list>
- <key interactions>
- Based on _template v6"
git push origin main
```

Wait ~30s for the GitHub Actions deploy, then open:
`https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/<your-name>/`

Click through every screen, test every interaction. If something's broken, fix and re-push.

---

## Step 10: Notify the user

Send an ntfy.sh notification (🟩 green for success):

```bash
curl -H "Title: ANDROID-PROTOTYPE" \
  -d "🟩🟩🟩🟩🟩🟩🟩🟩

Prototype ready: <your-name>.
- <N> screens: <list>
- <key interactions>
Live: https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/<your-name>/
Status: awaiting your review." \
  https://ntfy.sh/TASKISDONE
```

---

## Step 11: Update the homepage gallery (optional)

If this is a real prototype (not a test), add a card to the root `index.html` gallery section so it appears on the homepage. Follow the pattern of the existing `_template` card.

---

## Common pitfalls

| Pitfall | Fix |
|---------|-----|
| Whole page turns dark when app toggle pressed | `data-theme` must be on `.device`, not `<html>`. See [`docs/theme-architecture.md`](./theme-architecture.md). |
| Scrollbar visible | Add `scrollbar-width: none` + `::-webkit-scrollbar { display: none }` to your scrollable containers. |
| Text gets selected on drag | Ensure `body { user-select: none; }` is present. Don't add global `selectstart` listeners (they block scrolling). |
| Side panels disappear | They're hidden on <1024px. Test on a wide viewport. |
| Battery/signal look wrong | Don't modify the status bar SVGs. They follow the spec in [`docs/template-rules.md`](./template-rules.md). |
| Fullscreen button doesn't hide browser | Use `device.requestFullscreen()`, not a CSS class. See `script.js`. |
| Prototype doesn't deploy | Check the Actions tab on GitHub. Ensure you pushed to `main`. |

---

*Created: documentation pass (v7). Follow this blueprint for every new prototype.*
