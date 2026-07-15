# docs/template-rules.md — Prototype Template Rules & Guides

> The rules every prototype built from `prototypes/_template/` must follow.
> These codify the look, feel, and interaction behavior the user has approved.
> Read this before deviating from the template.

---

## 1. The phone frame

| Spec                  | Value                                       |
|-----------------------|---------------------------------------------|
| Viewport              | 390 × 844 px                                |
| Device corner radius  | **36px** (slightly less rounded, per feedback) |
| Bezel                 | 10px dark ring (`#0c0c0e`) + 1px edge (`#2a2a2e`) |
| Device shadow         | soft drop shadow for depth on desktop       |
| Desktop stage         | centered, neutral gray background so attention stays on the device |
| Mobile (<480px)       | frame collapses to full viewport, no chrome |

**Rule:** Don't make the corners more rounded than 36px. The user specifically asked for *less* rounding. If a future brief asks for "more rounded", confirm first (🟦).

---

## 2. The status bar

The status bar is **decorative** — it sells the "this is a phone" illusion. It must contain, left → center → right:

```
[ time ]        [ ● punch-hole ]        [ signal  wifi  bluetooth  battery% ]
```

### 2.1 Time (left)
- Live, updates every 30s.
- 12-hour format, tabular-nums, font-weight 600, size ~13px.
- Min-width reserved so the center punch-hole stays centered when minutes change.

### 2.2 Punch-hole camera (center)
- An 11px circle, centered absolutely in the status bar.
- Dark radial gradient (mimics glass over a front camera).
- `pointer-events: none` — never interactive.

### 2.3 System icons (right), in this order
1. **Mobile data signal** — 4 ascending bars. Use the template's SVG.
2. **Wi-Fi** — three-arc fan. Use the template's SVG.
3. **Bluetooth** — the rune glyph. Use the template's SVG.
4. **Battery** — percentage number + `%` + a battery glyph whose fill width scales to the percentage.

### 2.4 Battery behavior
- The fill `<rect>` width is driven from the percentage by `script.js`.
- Below 15%, the fill tints with `--color-danger`.
- Default demo value: 87%. A real prototype may swap in `navigator.getBattery()` if it wants live data — but that's optional.

### 2.5 Status bar rules
- Never let real content overlap the status bar.
- Status bar is `user-select: none` (see §4).
- In dark theme, icons inherit `--color-text` so they stay visible.

---

## 3. Color & theming

- Every prototype uses CSS custom properties (tokens) defined in `:root`.
- Light and dark themes via `data-theme="light|dark"` on `<html>`.
- Theme toggle persists in `localStorage`.
- Default primary is teal (`#0d9488`) in the template — a prototype **may override `--color-primary`** to match its brand, but must keep all other tokens.
- See `docs/design-standards.md` for the full token list.

---

## 4. Text selection (NON-NEGOTIABLE)

**Problem the user reported:** pressing a button and dragging the mouse upward selects/copies text instead of scrolling. This must never happen on chrome.

### Rule
- The **entire device** is `user-select: none` by default (set on `.device`).
- **Only `.content`** (the scrollable screen body) is `user-select: text`, so users can still copy real content.
- Interactive elements that live inside `.content` (`.btn`, `.list__row`) **re-assert** `user-select: none` explicitly, because they would otherwise inherit `text` from `.content`.

### What this achieves
- Dragging starting on a button/nav item → never selects text.
- Dragging starting on a paragraph in content → selects text (expected).
- Scrolling works normally everywhere.

### Implementation checklist (already in the template)
- [x] `.device { user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }`
- [x] `.content { user-select: text; -webkit-user-select: text; }`
- [x] `.btn, .list__row { user-select: none; -webkit-user-select: none; }`
- [x] `.btn { -webkit-user-drag: none; }`

**When you build a new interactive component inside `.content`, add `user-select: none` to it.**

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
