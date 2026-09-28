# docs/playbook.md — how to work in this repo without burning a cycle

> Written 2026-09-28 after a long build-out that produced more process failures
> than design failures. Every entry here is a mistake that actually happened, and
> the check that prevents it. Read this before your first edit in a session.

---

## 1. Verify the thing you changed, at the size the user uses

- **Never claim a fix works from a desktop-width screenshot.** The user reviews
  on a phone-sized window. The bug that mattered was invisible on a wide screen.
- Headless Chrome **clamps `--window-size` to a 500px minimum viewport** — a
  "390px" capture is really a 500px render. For true narrow widths use the in-app
  browser's `setViewportSize`, or a 390px iframe harness.
- `node scripts/verify.mjs` is the objective gate. Run it; don't eyeball.
- Decorative bleed (background orbs), off-screen swipe views and window resize
  handles look like overflow to a naive checker — the gate already knows this.
  If you extend the checks, keep teaching it the difference.

## 2. Trust the build you're actually serving

A "fix doesn't work" is very often a **stale preview**, not a broken fix.

- The preview serves a *copy* at `<root>/preview/ANDROID-PROTOTYPE`. After a
  build, re-sync it and confirm a new asset name resolves:
  `curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/ANDROID-PROTOTYPE/_next/static/chunks/<new>.css`
- In Git Bash, `robocopy` eats `/MIR` (it becomes a path). Always run it as
  `cmd //c "robocopy …"`.
- **Wait for the build to finish before syncing.** A sync that runs mid-build
  copies a half-written `out/` and the site renders unstyled — which looks
  exactly like a CSS bug. If the page suddenly has no styles, check
  `ls out/_next/static/chunks/*.css | wc -l` before touching any CSS.
- A dropped preview server looks like a total site failure (`curl` returns 000).
  Check the server before debugging the app.

## 3. Edit surgically, then prove the edit landed

- Multi-line `python` patches fail **silently** in spirit: an anchor that
  doesn't match aborts before any write, but an anchor that matches the wrong
  place writes something wrong. After every batch edit, `grep` the change back.
- Prefer the Edit tool for multi-line blocks; prefer `python` for many
  mechanical replacements. Never write a huge patch inline in a heredoc — long
  heredocs get truncated mid-script (the `SyntaxError: unterminated triple-quoted
  string` tell-tale). Write the patch to a file, then run it.
- A multi-line edit can succeed with the *structure* subtly broken (an inserted
  JSX prop landing inside a fragment). After editing JSX, always `npx tsc
  --noEmit` before building.
- `node -e` / inline scripts and `python -` heredocs both fail on non-ASCII in
  this environment (em-dashes, arrows). Prefer the Write tool for any file
  containing them.

## 4. CSS gotchas that cost real time

- **CSS Modules hash class names.** `querySelector(".handle")` returns nothing
  for a module class; use `[class*="handle"]` in test scripts. A class the
  component passes as a plain string (e.g. `className="tags"`) must be written
  `:global(.tags)` in the module or it will never match.
- **`:where()` for resets.** A root reset like `.at button { padding: 0 }`
  (specificity 0,1,1) beats every single-class rule (0,1,0) and silently strips
  padding from the whole prototype. Root resets use `:where(button)`.
- **Container queries, not media queries, inside a surface.** The window is a
  query container named `surface`; `@media` responds to the browser, so a
  1280px window renders an 834px tablet with desktop breakpoints.
- **Never `vh`/`vw` in frame content** — they measure the browser, not the
  frame. Use px, `%`, `cqw`, or flex sizing.

## 5. Keep the system honest

- One new **surface** = the frame, the nav components, a route shape, and a
  `SURFACE_PRESETS` entry. One new **style** = tokens, `styles/index.css`,
  `types.ts`, `STYLE_ORDER`, dashboard tints, a style doc, and a gallery entry —
  six registration points; the old 5-line recipe missed four of them.
- Prototype stylesheets carry a numbered **style index** at the top. Editing one
  element should never require reading the whole file.
- `navigation.md` in a touched folder is updated **in the same commit** as the
  change — the index is only useful if it's current.

## 6. Reporting

- Say what is verified and how (which size, which tool), and what is *not*
  verified. A confident claim that turns out to be a stale preview costs more
  trust than an honest "unverified".
- When the user asks for something specific, restate the requirement in one
  sentence before building it. Half the rework in this project came from
  building a *plausible* interpretation of an instruction instead of the literal
  one (window-button placement, control placement inside vs outside the app).
