# CRASH_LESSONS.md — Android App Crashes We Hit + Root Causes

> Every crash we encountered, what caused it, and how to avoid it in the future.
> Read this before touching any Compose layout code.

---

## Crash 1: `IllegalArgumentException: invalid weight 0.0; must be greater than zero`

**Where:** `BottomNavBar.kt` — `Modifier.weight(0f)` for the active nav pill.

**Root cause:** I wanted the active nav pill to be "content-sized" (wrap its label, not expand). In CSS, `flex: 0` means "don't grow". In Compose, `weight(0f)` is **invalid** — it throws. The correct approach is to **omit `weight()` entirely** for content-sized items.

**Fix:** `modifier = if (isActive) Modifier else Modifier.weight(1f)` — active item has no weight (content-sized), inactive items share space via `weight(1f)`.

**Lesson:** Compose `weight()` ≠ CSS `flex`. `weight(0)` crashes. For content-sized items, don't apply weight at all.

---

## Crash 2: `IllegalArgumentException: Padding must be non-negative`

**Where:** `DetailScreen.kt` — `Modifier.padding(top = (-70).dp)` for the cover poster overlapping the banner.

**Root cause:** The web prototype uses CSS `margin-top: -70px` to overlap the cover on the banner. Compose's `padding()` does NOT allow negative values — it throws immediately.

**Fix:** Use `Modifier.offset(y = (-70).dp)` instead. `offset` moves the element visually without affecting the layout flow, and it accepts negative values.

**Lesson:** CSS negative margins ≠ Compose padding. Use `offset` for visual overlaps. `padding` must always be ≥ 0.

---

## Crash 3: Missing launcher icon (`resource mipmap/ic_launcher not found`)

**Where:** `AndroidManifest.xml` referenced `@mipmap/ic_launcher` but no icon resources existed.

**Root cause:** The initial project scaffolding didn't create launcher icons. The build failed at the AAPT resource linking stage.

**Fix:** Created adaptive icon resources:
- `res/mipmap-anydpi-v26/ic_launcher.xml` + `ic_launcher_round.xml` (adaptive icon for API 26+)
- `res/drawable/ic_launcher_background.xml` (purple vector)
- `res/drawable/ic_launcher_foreground.xml` (play button vector)
- `res/drawable-anydpi-v24/ic_launcher.xml` + `ic_launcher_round.xml` (layer-list fallback for API 24-25)

**Lesson:** Always create launcher icons. Even a simple vector drawable is better than nothing. The manifest MUST have valid `android:icon` + `android:roundIcon` references.

---

## Crash 4: Missing Kotlin Serialization plugin

**Where:** `@Serializable` annotations on data classes weren't being processed — `kotlinx.serialization` couldn't find serializers.

**Root cause:** The `org.jetbrains.kotlin.plugin.serialization` Gradle plugin wasn't applied. Without it, `@Serializable` is a no-op annotation.

**Fix:** Added `id("org.jetbrains.kotlin.plugin.serialization") version "2.0.20"` to both the project-level and app-level `build.gradle.kts` plugins block.

**Lesson:** `@Serializable` requires the Kotlin serialization compiler plugin. Just adding the runtime dependency (`kotlinx-serialization-json`) is not enough.

---

## Crash 5: Experimental API not opted in

**Where:** `FlowRow` (ExperimentalLayoutApi), `combinedClickable` (ExperimentalFoundationApi), `ModalBottomSheet` (ExperimentalMaterial3Api).

**Root cause:** Compose marks new APIs as experimental. Using them without opting in is a compilation error.

**Fix:** Added `@file:OptIn(ExperimentalMaterial3Api::class, ExperimentalFoundationApi::class, ExperimentalLayoutApi::class)` at the top of files that use these APIs.

**Lesson:** Check the Compose docs for `@Experimental*` annotations. Add them at the file level with `@file:OptIn(...)`.

---

## Pattern: How to debug a crash from a logcat

1. Look for `FATAL EXCEPTION` in the logcat.
2. Read the exception class + message (e.g., `IllegalArgumentException: Padding must be non-negative`).
3. Find the `at com.testplaybyte.animeapp...` line — this tells you the exact file + line number.
4. Read that line in the source code.
5. Understand WHY the exception is thrown (read the Compose docs for that API).
6. Fix the root cause — don't just try random changes.
7. Verify the fix doesn't break anything else.
