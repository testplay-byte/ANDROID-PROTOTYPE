# docs/template-rules.md — Prototype Template Rules & Guides

> The rules every prototype built from `prototypes/_template/` must follow.
> These codify the look, feel, and interaction behavior the user has approved.
> Read this before deviating from the template.

---

## 1. The phone frame

| Spec                  | Value                                       |
|-----------------------|---------------------------------------------|
| Viewport              | 390 × 844 px                                |
| Device corner radius  | **32px**                                     |
| Bezel                 | **5px** dark ring + 0.5px edge (slightly thicker than v4, per feedback) |
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
- A **13px** circle (bigger per feedback), centered absolutely in the status bar.
- Dark radial gradient (mimics glass over a front camera).
- `pointer-events: none` — never interactive.

### 2.3 System icons (right), in this order (left to right)
1. **Wi-Fi** — 3 arcs total. **2 of 3 bright** (outermost arc dim). Represents a moderate connection.
2. **Mobile data signal** — 4 bars total. **LEFT 2 bars bright** (the two shorter bars on the left); **RIGHT 2 bars dim** (the two taller bars on the right, `opacity: 0.3`). Represents a weak/moderate connection.
3. **Battery** — **portrait (vertical) orientation**, small (8×16px). A vertical rectangle with a nub at the top and a fill that grows from the bottom.
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

## 6. Scrollbar handling

- **No visible scrollbar** anywhere in the prototype — not on the screen content, not on side panels.
- Implemented via `scrollbar-width: none` (Firefox) + `::-webkit-scrollbar { display: none }` (Chrome/Safari).
- Scrolling still works (touch, wheel, trackpad) — the scrollbar is just invisible.

## 7. Mobile full-screen experience

On mobile (≤480px), the prototype fills the viewport (no device frame) by default. A floating button (bottom-right) triggers the **real browser Fullscreen API**:

- `device.requestFullscreen()` is called on the `.device` element.
- The browser hides its address bar, tab bar, and (on Android) the system status bar.
- This gives a true native-app full-screen experience — not just a CSS class toggle.
- Pressing the button again, or pressing Esc, exits fullscreen.
- The button's icon syncs via `fullscreenchange` event listeners.
- Best-effort: locks orientation to portrait on Android Chrome via `screen.orientation.lock("portrait")`.

**Fallback:** If the Fullscreen API is unavailable (e.g., iOS Safari on iPhone), a CSS-only `.device--cssfs` class fills the viewport without hiding browser chrome. This is the best we can do on those browsers.

**Desktop:** The floating button is hidden (`display: none` on `pointer: coarse` / `min-width: 481px`). Desktop uses click-drag-to-scroll instead (see §7b).

## 7b. Click-drag-to-scroll (desktop)

On desktop (`pointer: fine`), the device screen supports click-drag-to-scroll:
- Press and hold the mouse on the screen content, then drag to scroll in any direction.
- The cursor shows `grab` / `grabbing` hints.
- Interactive elements (buttons, links, inputs, toggles, chips, tabs) are excluded — their clicks work normally.
- A drag that moves more than 3px suppresses the subsequent click event (prevents accidental navigation).
- This is **additive** — native wheel scrolling and trackpad gestures still work.
- On mobile, this module is disabled (`pointer: fine` check); native touch scrolling is used instead.

**Why:** The user reported being unable to scroll by clicking and dragging. The old global `selectstart`/`dragstart` listeners were blocking this gesture. Those listeners have been removed — text selection is now prevented purely via CSS `user-select: none`, which doesn't block scrolling.

## 8. Side panels (desktop only)

- **Left panel**: prototype name, description, clickable screen list (syncs with device), tech tags.
- **Right panel**: screen info (updates on view change), component donut, interaction bars, stats.
- Panels are **hidden on screens <1024px** — on mobile/tablet, only the device shows.
- Panels flank the device horizontally (left and right), never top/bottom.

---

## 9. Theming architecture (CRITICAL)

The app's theme is **scoped to the `.device` element**, NOT set on `<html>`. This is the most important architectural rule:

- `data-theme` is set on `<div class="device" data-theme="light|dark">` only.
- The page (stage background, side panels, body text) uses **page-level tokens** (`--stage-bg`, `--sb-*`) defined on `:root` that **never change** with the app toggle.
- The app (device screen, cards, text, buttons) uses **app-level tokens** (`--color-*`, `--chart-*`) defined on `.device`, overridden by `.device[data-theme="dark"]`.
- The device bezel color adapts: near-black (`#1a1612`) in light mode, medium-gray (`#3a3530`) in dark mode — visible against both backgrounds.
- **Never** set `data-theme` on `<html>`. **Never** define `--color-*` on `:root`.
- See [`docs/theme-architecture.md`](./theme-architecture.md) for the full explanation and token tables.

---

## 10. What to copy vs. what to change

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

## 11. Accessibility (unchanged from design-standards)

- Semantic HTML, keyboard reachable, visible focus.
- `aria-label` on icon-only buttons.
- Color is never the only signal.

---

*Last updated: after template v2 (punch-hole, battery %, Wi-Fi/Bluetooth, less-rounded corners, text-selection fix).*
