# docs/theme-architecture.md — Theme Architecture

> **CRITICAL.** This document explains how theming works in prototypes and why the app's theme is **scoped to the device**, separate from the page theme.
> Read this before touching any CSS variables or theme toggle logic.

---

## The problem we solved

**User feedback:**
> "When I turn it into dark mode, the whole page turns into dark mode. The app is a different part from the actual web page so only the app's theme color should change if needed. Make sure that the whole page never turns into dark mode when a user presses a button inside the app."

**Root cause:** `data-theme` was set on `<html>` (the document root), which cascaded to *everything* — the device, the side panels, the stage background, the body. Pressing the in-app dark mode toggle turned the entire page dark.

**Solution:** Scope `data-theme` to the `.device` element only. The page (stage, side panels, body) uses its own fixed set of CSS variables that never change with the app's toggle.

---

## Architecture: two independent token layers

```
┌─ <html> ─────────────────────────────────────────────────────┐
│                                                               │
│  :root — shared tokens (spacing, type, radius, motion)       │
│  :root — page-level tokens (--stage-bg, --sb-*)  ◄── FIXED   │
│                                                               │
│  ┌─ .stage ────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  ┌─ .sidepanel ───┐    ┌─ .device ────────────────┐    │ │
│  │  │ uses --sb-*    │    │ data-theme="light|dark"  │    │ │
│  │  │ (page-level,   │    │                          │    │ │
│  │  │  never changes)│    │ .device — app tokens     │    │ │
│  │  └────────────────┘    │ (--color-*, --chart-*)   │    │ │
│  │                        │                          │    │ │
│  │                        │ .device[data-theme=dark] │    │ │
│  │                        │ overrides app tokens     │    │ │
│  │                        │ + device frame color     │    │ │
│  │                        └──────────────────────────┘    │ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

### Layer 1: Page-level tokens (`:root`)

These are defined on `:root` and **never change** with the app's theme toggle:

| Token             | Light value | Purpose                          |
|-------------------|-------------|----------------------------------|
| `--stage-bg`      | `#ebe1d2`   | Page background behind the device |
| `--sb-bg`         | `#f9f2ea`   | Side panel card background       |
| `--sb-muted`      | `#e9decf`   | Side panel muted surface          |
| `--sb-border`     | `#d7cec1`   | Side panel border                 |
| `--sb-text`       | `#1e1a13`   | Side panel / page text            |
| `--sb-text-muted` | `#5d574e`   | Side panel muted text             |

The `body` element uses these: `color: var(--sb-text); background: var(--stage-bg);`

### Layer 2: App-level tokens (`.device`)

These are defined on `.device` and **change with `data-theme`**:

| Token                | Light value | Dark value  | Purpose                        |
|----------------------|-------------|-------------|--------------------------------|
| `--color-bg`         | `#f2e8da`   | `#12100e`   | App screen background          |
| `--color-surface`    | `#e9decf`   | `#282521`   | App surface (inputs, chips)    |
| `--color-surface-2`  | `#f9f2ea`   | `#1c1916`   | App card background            |
| `--color-text`       | `#1e1a13`   | `#ebe7e2`   | App text                       |
| `--color-text-muted` | `#5d574e`   | `#a29e98`   | App muted text                 |
| `--color-primary`    | `#f05100`   | `#fe6a00`   | App primary (orange)           |
| `--color-primary-fg` | `#ffffff`   | `#181512`   | Text on primary                |
| `--color-border`     | `#d7cec1`   | `#36322e`   | App internal borders           |
| `--color-danger`     | `#de2024`   | `#de2024`   | Danger color                   |
| `--color-success`    | `#0fa05c`   | `#43c07a`   | Success color                  |
| `--chart-1`          | `#f05100`   | `#fe6a00`   | Chart: orange                  |
| `--chart-2`          | `#0fa05c`   | `#43c07a`   | Chart: green                   |
| `--chart-3`          | `#3d6a7f`   | `#608da4`   | Chart: teal                    |
| `--chart-4`          | `#f2a618`   | `#f0b135`   | Chart: amber                   |
| `--chart-5`          | `#f0503d`   | `#f75f4c`   | Chart: red                     |

### Layer 3: Device frame tokens (`.device`, changes with `data-theme`)

The device bezel/frame color adapts to the app theme so it's always visible:

| Token           | Light mode (`#1a1612`) | Dark mode (`#3a3530`) | Why                                                    |
|-----------------|------------------------|-----------------------|--------------------------------------------------------|
| `--device-bezel`| Near-black             | Medium-dark gray      | Light: classic black phone frame. Dark: lighter so it's visible against the dark app screen and doesn't blend. |
| `--device-edge` | `#2a2521`              | `#4a4540`             | Thin highlight edge, slightly lighter than the bezel.  |

**User preference:** "When in light mode it will stay as black, which is perfect." — The bezel is near-black in light mode. In dark mode, it shifts to a medium gray that's visible against both the light page and the dark app.

---

## How the toggle works (JavaScript)

```javascript
// The toggle sets data-theme on the .device element, NOT on <html>.
var device = document.getElementById("device");

function setTheme(theme) {
  device.setAttribute("data-theme", theme);           // scoped!
  localStorage.setItem("proto-app-theme", theme);     // persisted separately
}

themeToggle.addEventListener("click", function () {
  var current = device.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
});
```

**Key points:**
- `data-theme` is set on `.device`, not on `document.documentElement` (`<html>`).
- localStorage key is `proto-app-theme` (not `proto-theme`) to avoid collision with any future page-level theme.
- The `<html>` element has **no** `data-theme` attribute at all.

---

## What NOT to do

1. **Never** set `data-theme` on `<html>` or `<body>` in a prototype page. This would cascade to the whole page.
2. **Never** define app-level tokens (`--color-*`) on `:root`. They must be on `.device` so they're scoped.
3. **Never** use `--color-text` on `body` or side panels. Use `--sb-text` instead.
4. **Never** apply `[data-theme="dark"]` as a global selector. Always scope it: `.device[data-theme="dark"]`.

---

## Testing the separation

To verify the theme is properly scoped:

1. Open the prototype page.
2. Note the page background and side panel colors (they should be light/cream).
3. Press the dark mode toggle inside the app (the moon/sun icon in the app bar).
4. **The device screen should turn dark.** The page background, side panels, and device bezel should remain unchanged (or in the bezel's case, shift to the adaptive gray).
5. If the whole page turns dark, the scoping is broken — check that `data-theme` is on `.device`, not `<html>`.

---

## Future: page-level theme (not yet implemented)

If a future task requires a page-level dark mode (for the side panels and stage), it would use a **separate** attribute on `<html>`:

```html
<html data-page-theme="dark">
  ...
  <div class="device" data-theme="light">
    ...
  </div>
</html>
```

This would allow the page and the app to have independent themes. For now, the page stays in light mode and only the app has a toggle.

---

*Created: v5 (scoped theming). Read this before modifying any theme-related CSS or JS.*
