# docs/template-rules.md — Prototype Template Rules & Guides

> The rules every prototype built from `prototypes/_template/` must follow.
> These codify the look, feel, and interaction behavior the user has approved.
> Read this before deviating from the template.

---

## 1. The phone frame

| Spec                  | Value                                       |
|-----------------------|---------------------------------------------|
| Viewport              | 390 × 844 px                                |
| Device corner radius  | **28px** (less rounded, per feedback)       |
| Bezel                 | **5px** dark ring + 1px edge (thinner, per feedback) |
| Device shadow         | soft drop shadow for depth on desktop       |
| Desktop stage         | centered, warm-cream background; side info panels on left & right |
| Mobile (<480px)       | frame collapses to full viewport, no chrome |

**Rule:** Don't make the corners more rounded than 28px. The user specifically asked for *less* rounding. If a future brief asks for "more rounded", confirm first (🟦).

---

## 2. The status bar

The status bar is **decorative** — it sells the "this is a phone" illusion. It must contain, left → center → right:

```
[ time ]        [ ● punch-hole ]        [ wifi  signal  battery  battery% ]
```

### 2.1 Time (left)
- Live, updates every 30s.
- 12-hour format, tabular-nums, font-weight 600, size ~13px.

### 2.2 Punch-hole camera (center)
- A 10px circle, centered absolutely in the status bar.
- Dark radial gradient (mimics glass over a front camera).
- `pointer-events: none` — never interactive.

### 2.3 System icons (right), in this order (left to right)
1. **Wi-Fi** — 3 arcs total. **2 of 3 bright** (outermost arc dim). Represents a moderate connection.
2. **Mobile data signal** — 4 bars total. **2 of 4 bright** (the two taller bars; the two shorter bars are dim). Represents ~50% signal strength.
3. **Battery** — **portrait (vertical) orientation**. A vertical rectangle with a nub at the top and a fill that grows from the bottom.
4. **Battery percentage** — shown **to the right** of the battery glyph (e.g., `87%`).

> **No Bluetooth icon.** Removed per feedback.

### 2.4 Battery behavior (portrait)
- The fill `<rect>` `y` and `height` are driven from the percentage by `script.js`.
- Fill grows from the **bottom** upward (portrait orientation).
- Below 15%, the fill tints with `--color-danger`.
- Default demo value: 87%.

### 2.5 Status bar rules
- Never let real content overlap the status bar.
- Status bar is `user-select: none` (see §4).
- In dark theme, icons inherit `--color-text` so they stay visible.

---

## 3. Color & theming

- Every prototype uses CSS custom properties (tokens) defined in `:root`.
- Light and dark themes via `data-theme="light|dark"` on `<html>`.
- Theme toggle persists in `localStorage`.
- Default primary is orange (`#f05100` light / `#fe6a00` dark) matching the homepage warm-cream palette. A prototype **may override `--color-primary`** to match its brand, but must keep all other tokens.
- See `docs/design-standards.md` for the full token list.

---

## 4. Text selection (NON-NEGOTIABLE)

**Problem the user reported:** pressing a button and dragging the mouse upward selects/copies text instead of scrolling. This must never happen on chrome.

### Rule
- The **entire page** (`body`) is `user-select: none`. No text in a prototype is selectable — prototypes behave like real apps.
- A global `selectstart` event listener in `script.js` cancels any remaining selection attempts (except inside `<input>`/`<textarea>`).
- A global `dragstart` listener prevents drag-to-select entirely.

### What this achieves
- Dragging from any element (button, card, text, nav) → **never** selects text.
- Scrolling works normally everywhere.
- Inputs (search fields) still allow text entry.

### Implementation checklist (already in the template)
- [x] `body { user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }`
- [x] `document.addEventListener('selectstart', …)` — cancels unless target is an input.
- [x] `document.addEventListener('dragstart', …)` — cancels all drag.

**Prototypes are not for reading/copying text. They are for simulating app interaction.**

---

## 5. Touch & interaction

- Minimum **44 × 44 px** hit area for every tappable element.
- `:active` state gives feedback (scale down ~3–6%, or background tint).
- Transitions: 150ms for taps, 250ms for view changes.
- Respect `prefers-reduced-motion` (the template disables animations).
- View navigation uses `data-goto="viewName"` and syncs `location.hash`.

---

## 6. Layout anatomy (top → bottom inside the device)

1. Status bar (40px) — decorative, non-selectable.
2. App bar (56px) — screen title + actions, sticky, non-selectable.
3. Content (flex, scrollable) — the actual screen; **selectable text**.
4. Bottom nav (56px + safe area) — primary destinations; non-selectable.
5. Home indicator (5px pill) — non-selectable.

---

## 7. What to copy vs. what to change

### Copy as-is
- The phone frame, status bar, punch-hole, system icons, battery logic.
- The design tokens (spacing, type, radius, motion).
- The view-routing + theme-toggle JS.
- The `user-select` rules.

### Change per prototype
- The views' content (markup inside each `<section class="view">`).
- `--color-primary` (to match the brand).
- Bottom-nav items (add/remove, relabel).
- The prototype's `navigation.md` + `README.md`.

### Never
- Don't import CSS/JS from another prototype. Stay self-contained.
- Don't remove the `user-select` rules.
- Don't make the device corners more rounded than 36px without confirming.
- Don't put real content in the status bar.

---

## 8. Accessibility (unchanged from design-standards)

- Semantic HTML, keyboard reachable, visible focus.
- `aria-label` on icon-only buttons.
- Color is never the only signal.

---

*Last updated: after template v2 (punch-hole, battery %, Wi-Fi/Bluetooth, less-rounded corners, text-selection fix).*
