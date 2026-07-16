# docs/preferences.md — User Design Preferences (MEMORY FILE)

> **MANDATORY MEMORY FILE.** This captures the user's accumulated design preferences from feedback across multiple iterations.
> Any AI agent working on this repo **must** read this before designing anything. Do not violate these preferences.

---

## 1. Homepage

### Top navigation
- **Two disconnected pill containers** — NOT a full-width bar.
- Left pill: brand logo + "ANDROID-PROTOTYPE" name + subtitle.
- Right pill: Repo button + theme toggle.
- Each pill has: `border-radius: 12px`, `border: 1px solid border`, `background: card/90`, `backdrop-filter: blur(12px)`, `box-shadow: shadow-sm`, `padding`.
- Nothing connects the two pills — page background flows between them.
- Reference: https://testplay-byte.github.io/AIO-STUFF/ (copy this exactly).

### Hero
- **No eyebrow text** above the title.
- Title split into **exactly 2 lines**: "Interactive mobile UI prototypes" / "live in your browser." (second line in orange accent).
- **No lead paragraph** below the title.
- Never let the title wrap to 3 lines — 2 lines max.

### Bottom of page
- **No footer.**
- **No links strip** (Startup guide, Navigation map, etc.) — removed entirely.

### Prototype cards
- Phone silhouette in the center with info panels on **left and right** (3-column grid).
- Right panel should have **mini-charts**: a donut chart + bar chart + stats, not just text.

---

## 2. Prototype template (the phone mockup)

### Device frame
- **Bezel**: 5px (slightly thicker than v4's 3px). The user found 3px too thin. 5px is the sweet spot — visible but not bulky.
- **Corner radius**: 32px (not too rounded, not too sharp).
- Device shadow: soft drop shadow for depth.
- **Bezel color**: near-black (`#1a1612`) in light mode ("stays as black, which is perfect"). In dark mode, shifts to medium-gray (`#3a3530`) — adaptive, visible against both the light page and the dark app screen.

### Status bar (left → center → right)
1. **Time** (left) — 12-hour, tabular-nums, ~13px, live clock.
2. **Punch-hole camera** (center) — **13px** circle (bigger per feedback), dark radial gradient.
3. **Right icons** (left to right):
   - **Wi-Fi** — 3 arcs, 2 bright (outermost dim).
   - **Mobile signal** — 4 bars, **LEFT 2 bright, RIGHT 2 dim** (`opacity: 0.3`). NOT the other way around.
   - **Portrait battery** — vertical orientation, small (8×16px), fill grows from bottom.
   - **Battery %** — to the **right** of the battery glyph.
- **No Bluetooth icon.** Removed permanently.

### Text selection
- **Entire page is `user-select: none`.** No text is selectable anywhere in the prototype.
- Global `selectstart` + `dragstart` listeners cancel any remaining selection.
- Only `<input>` / `<textarea>` allow text entry.
- The user hates drag-to-copy behavior — this must never happen.

### Dark mode scoping (CRITICAL)
- The app's dark mode toggle changes **ONLY the device's theme**, never the whole page.
- `data-theme` is set on the `.device` element, NOT on `<html>`.
- The page (stage background, side panels, body text) uses page-level tokens (`--stage-bg`, `--sb-*`) that never change.
- The app (device screen, cards, text) uses app-level tokens (`--color-*`) scoped to `.device`.
- The device bezel adapts: black in light mode, medium-gray in dark mode.
- **The user's exact words:** "Make sure that the whole page never turns into dark mode when a user presses a button inside the app. The app is a different part from the actual web page so only the app's theme color should change."
- See `docs/theme-architecture.md` for the full architecture.

### Scrollbar
- **No visible scrollbar** anywhere — not on the app screen, not on side panels.
- Use `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`.
- Scrolling still works; the bar is just invisible.

### Side panels (desktop)
- **Left panel** and **right panel** flank the device horizontally.
- NEVER top/bottom — always left/right.
- Left: prototype name, description, screen list (clickable, syncs with device), tags.
- Right: screen info, mini-donut (components), mini-bars (interactions), stats.
- Hidden on screens <1024px.

### Mobile experience
- On mobile (≤480px), the app fills the viewport by default (no device frame).
- A floating button triggers the **real browser Fullscreen API** (`requestFullscreen`), which hides the browser address bar, tab bar, and system status bar — a true native-app full-screen experience.
- The button toggles: press once to enter fullscreen, press again (or press Esc) to exit.
- Falls back to a CSS-only fullscreen (fills viewport without hiding browser chrome) on browsers that don't support the Fullscreen API (e.g., iOS Safari on iPhone).
- On desktop, the floating button is hidden — desktop uses click-drag-to-scroll instead.

### Scrolling (desktop)
- The device screen supports **click-drag-to-scroll**: press and hold the mouse on the screen content, then drag up/down/left/right to scroll.
- This is in addition to native wheel scrolling and trackpad gestures.
- The cursor shows a `grab` hint on desktop.
- Dragging is ignored on interactive elements (buttons, links, inputs, toggles) so their clicks still work.
- A drag that moves more than 3px suppresses the click event (prevents accidental navigation after a drag).
- On mobile, native touch scrolling is used (the drag module only activates on `pointer: fine` devices).

### Content
- Prototypes must be **fully navigable**: multiple screens, scrollable content, clickable buttons, toggles, etc.
- Not static screens — real interaction.

---

## 3. Color palette

### Homepage (warm cream — from AIO-STUFF)
- Background: `#f2e8da`
- Card: `#f9f2ea`
- Foreground: `#1e1a13`
- Primary: `#231e18` (dark)
- Primary foreground: `#f9f2ea`
- Muted foreground: `#5d574e`
- Border: `#d7cec1`
- Chart accents: `#f05100` (orange), `#0fa05c` (green), `#3d6a7f` (teal), `#f2a618` (amber), `#f0503d` (red)

### Dark theme
- Background: `#12100e`
- Card: `#1c1916`
- Foreground: `#ebe7e2`
- Primary: `#e1ddd8`
- Chart accents: `#fe6a00`, `#43c07a`, `#608da4`, `#f0b135`, `#f75f4c`

### Rule
- **Never use indigo or blue** as primary colors.
- Warm earth tones (cream, beige, amber, orange) are the approved palette.

---

## 4. References

| Reference | URL | What to copy |
|-----------|-----|--------------|
| AIO-STUFF | https://testplay-byte.github.io/AIO-STUFF/ | Homepage nav (pill containers), color palette, hero layout, stat cards, charts |
| INFRO/app | https://testplay-byte.github.io/INFRO/app/ | Device frame proportions, side panel concept, mobile full-screen switch, warm minimalist aesthetic |

Both are the user's own creations — copy freely.

---

## 5. Notification protocol
- **Always** notify on task completion via ntfy.sh, topic `TASKISDONE`.
- 8 emojis (single color) on line 1: 🟩 success, 🟥 error, 🟦 paused, 🟧 processing.
- See `docs/notification-protocol.md` for the full spec.

---

## 6. Material 3 Expressive design (for prototypes that use M3)

When a prototype uses Material 3 (like the search-page), follow these rules:

### Elevation = tonal surfaces, NOT heavy shadows
- M3 dark theme uses **surface color tiers** for elevation: `surface-1` → `surface-2` → `surface-3` → `surface-4` → `surface-5`.
- Higher elevation = **lighter tone** (in dark theme).
- **Do NOT use `box-shadow` for elevation** — use tonal surface colors.
- The only exception: the device frame's outer drop shadow (for depth against the page background).

### Bottom navigation — NO border line
- The bottom nav must **NOT** have a `border-top`, `box-shadow`, or any visible divider line.
- Use a different surface tone (`surface-1`) to separate it from the content above.
- The user explicitly said: "remove that white line kind of looking bar."

### Home indicator — REMOVED
- The iPhone-style gesture bar (`.home-indicator`) has been **removed permanently**.
- The bottom navigation bar is the last element inside the device.
- Do NOT re-add it.

### Type scale
- Use a proper M3 type scale: display (32px) → h1 (26px) → h2 (22px) → h3 (18px) → body-large (16px) → body (14px) → label (12px) → label-small (11px).
- Headlines should use negative letter-spacing (`-.02em` for display, `-.01em` for h1/h2).

### Motion
- Use M3 emphasized easing: `cubic-bezier(.3, 0, 0, 1)` for enter/exit, `cubic-bezier(.05, .7, .1, 1)` for decelerate.
- Stagger card animations: 40ms delay per card index.
- Bottom sheet slides up with `var(--dur-5)` (500ms) emphasized easing.

### Settings page
- Every prototype with a bottom nav should have a **functional Settings page**.
- Must include a **light/dark theme toggle** (M3 segmented buttons).
- Theme must **persist** in localStorage and apply to the `.device` element (scoped theming).
- Theme key: `<prototype-name>-theme` (e.g., `search-theme`).

### Recent searches
- Show only **3 items by default** — don't let recent searches push the anime grid down.
- Add a **"Show N more"** button to expand (with a chevron that rotates).
- "Show less" to collapse.
- Max 12 stored in localStorage.

---

## 7. Workflow for AI agents (CRITICAL — read this before starting work)

The user has explicitly praised the following workflow. **Follow it every time:**

1. **Research first** — Before designing, search the web for:
   - "Material 3 design best practices"
   - "why AI generated UI looks bad common mistakes"
   - Modern UI techniques for the specific app type (e.g., "anime app UI design")
   - Use the `web-search` skill (z-ai CLI: `z-ai function -n web_search -a '{"query": "...", "num": 5}'`)

2. **Analyze the current state** — Screenshot the live site with Agent Browser, then use VLM to get brutally honest feedback:
   - `z-ai vision -p "Be brutally honest: what looks bad, ugly, or AI-generated?" -i screenshot.png`
   - List every problem the VLM identifies.

3. **Implement fixes** — Address every problem from the VLM analysis. Apply modern M3 techniques (tonal elevation, proper type scale, emphasized easing).

4. **Verify with VLM on the LIVE site** (not just localhost):
   - Screenshot the live URL with Agent Browser.
   - Use VLM to verify: "Does it look polished and professional, or still AI-generated?"
   - If VLM rates it below 7/10, iterate.

5. **Never skip verification** — The user will check, and they will notice if you didn't verify.

### Why AI UI looks bad (common mistakes to avoid)
- Using "clean and modern" as a style descriptor (too vague → generic output)
- Not specifying the platform (mobile vs desktop)
- Flat cards with no elevation/depth
- Inconsistent spacing (uneven gaps between elements)
- Low contrast text
- Small touch targets
- Generic color schemes (the user hates indigo/blue)
- No personality or branding
- Forgetting to verify the result

---

*Last updated: after search-page v4 (settings page, improved recent searches, removed home indicator, staggered animations, M3 tonal elevation, workflow documentation).*
