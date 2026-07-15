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
- **Thin bezel**: 3px (not 5px, not 10px). The user finds thick bezels ugly.
- **Corner radius**: 32px (not too rounded, not too sharp).
- Device shadow: soft drop shadow for depth.

### Status bar (left → center → right)
1. **Time** (left) — 12-hour, tabular-nums, ~13px, live clock.
2. **Punch-hole camera** (center) — 10px circle, dark radial gradient.
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
- On mobile (≤480px), the app goes **full-screen** (no device frame, fills viewport).
- A floating button lets the user toggle back to framed view.
- This gives a native app experience on phones.

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

*Last updated: after v4 (pill nav, thin bezel, fixed signal bars, smaller battery, hidden scrollbar, mobile fullscreen).*
