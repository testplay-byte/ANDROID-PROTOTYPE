# docs/agent-quickstart.md — 2-Minute Fast-Start for AI Agents

> **Read this if you're an AI agent and need to get productive immediately.**
> It condenses everything you need to start working into one page.
> For full detail, follow the links.

---

## What this repo is (30 seconds)

**ANDROID-PROTOTYPE** — a mobile UI prototyping workspace. We build **interactive, fully functional mobile app UI prototypes** (phone-frame mockups with real navigation, scrolling, toggles, etc.) and deploy them via **GitHub Pages**. Each prototype is a self-contained static web app (HTML + CSS + JS, no build step).

- **Repo:** https://github.com/testplay-byte/ANDROID-PROTOTYPE
- **Live:** https://testplay-byte.github.io/ANDROID-PROTOTYPE/
- **Template (the starting point):** https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/_template/

---

## The 5 things you MUST know (60 seconds)

### 1. Read these files first (in order)
1. [`STARTUP.md`](../STARTUP.md) — master context
2. [`docs/preferences.md`](./preferences.md) — **all user design preferences** (don't violate these)
3. [`docs/template-rules.md`](./template-rules.md) — the rules every prototype follows
4. [`docs/theme-architecture.md`](./theme-architecture.md) — how app theme is scoped (CRITICAL)
5. [`docs/notification-protocol.md`](./notification-protocol.md) — how to notify the user

### 2. Notify the user on EVERY task completion
- **Topic:** `TASKISDONE` on ntfy.sh
- **Format:** 8 emojis (one color) on line 1, blank line, then message
- **Colors:** 🟩 success · 🟥 error · 🟦 paused · 🟧 processing
- Copy-paste command in [`docs/notification-protocol.md`](./notification-protocol.md)

### 3. The template is at `prototypes/_template/`
- Copy `prototypes/_template/` → `prototypes/<your-name>/` to start a new prototype.
- It has: phone frame (32px corners, 5px bezel, 13px punch-hole), status bar (time, Wi-Fi 2/3, signal 2/4 left-bright, portrait battery, battery%), 4 sample screens (Home, Search, Profile, Settings), bottom nav, theme toggle, side panels, click-drag scroll, mobile fullscreen.
- **Theme is scoped to `.device`** — `data-theme` goes on the `.device` element, NOT `<html>`. The page never turns dark when the app toggle is pressed.

### 4. Navigation discipline
- Every directory has a `navigation.md`. **Update it in the same commit** as any change.
- When you add/rename/move/delete a file, update the relevant `navigation.md`.
- Append to `CHANGELOG.md` when you finish a task.

### 5. Design preferences (don't violate)
- **Warm-cream palette** — never indigo/blue. See [`docs/preferences.md`](./preferences.md).
- **Thin bezel** (5px), **32px corners**, **13px punch-hole**.
- **Signal bars**: LEFT 2 bright, RIGHT 2 dim. **Portrait battery** (vertical, small). **No Bluetooth icon**.
- **No visible scrollbar** anywhere. **No text selection** (entire page `user-select: none`).
- **Side panels** flank the device left/right (never top/bottom), hidden on <1024px.
- **Mobile fullscreen** uses the real Fullscreen API (`requestFullscreen`).

---

## Quick task guide (30 seconds)

| You need to... | Do this |
|---|---|
| Build a new prototype | Read [`docs/prototype-blueprint.md`](./prototype-blueprint.md), copy `prototypes/_template/` |
| Understand the file structure | Read [`docs/repo-map.md`](./repo-map.md) |
| Change a design preference | Update [`docs/preferences.md`](./preferences.md) + the relevant code |
| Fix a bug in the template | Edit `prototypes/_template/`, test, push, notify |
| Add a shared component | Put it in `templates/components/`, update `templates/navigation.md` |
| Deploy | Just push to `main` — GitHub Actions auto-deploys |

---

## The mandatory checklist before you push

- [ ] Code works (tested in browser)
- [ ] Navigation files updated (if structure changed)
- [ ] `CHANGELOG.md` has a new entry
- [ ] No secrets / absolute paths / backend calls
- [ ] Notification sent to ntfy.sh

---

*Created: documentation pass (v7). Keep this page accurate — it's the fastest on-ramp for new agents.*
