# docs/android-dev/ — Native Android Development Guide

> **MANDATORY reading for any agent building or modifying Android apps in this repo.**
> This documents the lessons learned from building the first Anime_App — what went wrong,
> how to do it right, and the patterns to follow for ALL future Android apps.

---

## Index

| File | What it covers |
|------|----------------|
| `CRASH_LESSONS.md` | Every crash we hit + root cause + fix. Read before touching Compose layout. |
| `UI_PATTERNS.md` | How to replicate the web prototype's M3 design in Jetpack Compose. |
| `BUILD_GUIDE.md` | How the Gradle project is structured + GitHub Actions APK build. |

---

## Golden rules (read these FIRST)

1. **STUDY THE PROTOTYPE** — Before writing any Compose code, read the corresponding `.tsx` + `.module.css` files in `src/prototypes/<name>/`. The prototype IS the spec. Every color, spacing, font weight, border radius, and animation must match.

2. **NEVER use emojis** — Always use Material vector icons (`Icons.Filled.*` from `material-icons-extended`). The prototype uses SVG icons, not emojis.

3. **NEVER use negative padding** — Compose's `padding()` throws `IllegalArgumentException` for negative values. Use `offset(y = (-N).dp)` instead for overlaps.

4. **NEVER use `weight(0f)`** — Compose's `weight()` requires > 0. For content-sized items, omit `weight()` entirely (just use `Modifier`).

5. **Pinned collapsing headers** — Place `CollapsingHeader` OUTSIDE the scroll Column (above it). If it's inside the scroll, it scrolls away (the user reported this bug).

6. **Floating bottom nav** — Do NOT use `Scaffold(bottomBar = ...)`. Use a `Box` overlay so the nav floats on top of scrolling content (matching the prototype).

7. **Custom components, not defaults** — The prototype has custom toggles, segmented controls, and bottom sheets. Do NOT use default `Switch`, `SegmentedButton`, or `Slider`. Build custom composables that match the prototype's CSS.

8. **Bold + uppercase** — Section labels are 11sp bold UPPERCASE. Row titles are 14sp semibold. Screen titles are 32sp bold. Match the prototype's typography exactly.

9. **M3 color scheme** — Use `MaterialTheme.colorScheme.*` everywhere. The theme is set up in `theme/Color.kt` + `theme/Theme.kt` to match the prototype's dark purple palette.

10. **Error handling** — Every network call MUST be wrapped in `runCatching { }.getOrDefault(emptyList())`. An unhandled exception crashes the app.
