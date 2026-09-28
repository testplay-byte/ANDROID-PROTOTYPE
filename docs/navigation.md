# docs/navigation.md

> Index of everything in `docs/`. These are the reference documents that govern how we work.

---

## Files

| File                          | What it covers                                                      |
|-------------------------------|---------------------------------------------------------------------|
| `agent-quickstart.md`         | **2-minute fast-start** for any AI agent. Read this first if you're new. |
| `prototype-blueprint.md`      | **Step-by-step guide** to build a new prototype (detailed).         |
| `repo-map.md`                 | **Visual annotated tree** of the entire repository.                 |
| `workflow.md`                 | High-level prototype workflow (create → update → retire).           |
| `tech-stack.md`               | The allowed tech for prototypes and *why* each choice was made.      |
| `design-standards.md`         | Mobile UI/UX standards: spacing, type scale, color, touch targets, the phone frame. |
| `github-pages.md`             | How deployment works, how to find live URLs, how to troubleshoot.    |
| `notification-protocol.md`    | **MANDATORY MEMORY FILE.** The ntfy.sh protocol: topic, colors, format, copy-paste commands. |
| `preferences.md`              | **MANDATORY MEMORY FILE.** All accumulated user design preferences. Read before designing anything. |
| `ui-failure-modes.md`         | **MANDATORY BEFORE BUILDING.** The 15 recurring UI defect classes the user rejected in reviews (content escaping controls, orphan-word toasts, jammed segments, clipped selections, below-fold CTAs…) + the 10-point self-review checklist. Learn to *recognise* bad, not just apply fixes. |
| `template-rules.md`           | The rules every prototype (built on `src/proto-kit/`) must follow (frame, status bar, text-selection, scrollbar, mobile, theming). |
| `theme-architecture.md`       | **CRITICAL.** How app theme (scoped to `.device`) is separated from page theme. Read before touching CSS variables. |
| `style-selection-guide.md`    | **Choose a design language** for a brief — intent → style mapping, the 11 languages, rules and exceptions. |
| `design-languages/`           | **Style specs** for the 11 design languages (M3 default + HIG, Carbon, Neumorphism, Glassmorphism, Brutalism, Claymorphism, Bauhaus, Minimalism, Bento, Flat). See [`design-languages/navigation.md`](./design-languages/navigation.md). |
| `git-conventions.md`          | Branch, commit message, and PR conventions.                         |
| `design-systems/`             | **Design system documentation** — Material 3 Expressive + Basic Design Principles + master guide. See [`design-systems/navigation.md`](./design-systems/navigation.md). |
| `android-dev/`                | **Native Android development guide** — 14 golden rules, crash lessons, UI patterns, build guide, and 8-phase workflow for converting prototypes to native apps. See [`android-dev/navigation.md`](./android-dev/navigation.md). |

---

## Reading order for a new agent

1. [`../STARTUP.md`](../STARTUP.md) — master context
2. [`agent-quickstart.md`](./agent-quickstart.md) — 2-minute fast-start
3. [`repo-map.md`](./repo-map.md) — see where everything is
4. [`preferences.md`](./preferences.md) — user's design preferences (MANDATORY)
5. [`ui-failure-modes.md`](./ui-failure-modes.md) — the 15 defect classes the user rejects (MANDATORY before writing UI)
6. [`template-rules.md`](./template-rules.md) — the rules every prototype follows
7. [`theme-architecture.md`](./theme-architecture.md) — how theming works (CRITICAL)
8. [`style-selection-guide.md`](./style-selection-guide.md) — how to pick a design language for a brief
9. [`prototype-blueprint.md`](./prototype-blueprint.md) — how to build a prototype
10. [`notification-protocol.md`](./notification-protocol.md) — how to notify the user
11. [`workflow.md`](./workflow.md) — high-level process
12. [`design-standards.md`](./design-standards.md) — UI/UX specs (reference as needed)
13. [`design-systems/design-system-guide.md`](./design-systems/design-system-guide.md) — master design system guide
14. [`design-systems/basic-design/what-makes-good-ui.md`](./design-systems/basic-design/what-makes-good-ui.md) — what makes good UI
15. [`design-systems/basic-design/ai-ui-mistakes.md`](./design-systems/basic-design/ai-ui-mistakes.md) — common AI UI mistakes to avoid
16. [`design-systems/material-3-expressive/navigation.md`](./design-systems/material-3-expressive/navigation.md) — M3 design system (if using M3)
17. [`design-languages/<style>.md`](./design-languages/navigation.md) — the spec for your chosen style (all 11 languages)
18. [`android-dev/navigation.md`](./android-dev/navigation.md) — **if building a native Android app** (14 golden rules + crash lessons + UI patterns + workflow)

---

*Last updated: 2026-09-28 — added `ui-failure-modes.md` (15 rejected defect classes + self-review checklist, mandatory before building). Reading order renumbered.*
