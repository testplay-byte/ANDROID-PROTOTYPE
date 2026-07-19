# UI_PATTERNS.md — Replicating the Web Prototype in Jetpack Compose

> How to convert each prototype UI element to its Compose equivalent.
> Study this alongside the prototype source code.

---

## Collapsing header (title stays, shrinks on scroll)

**Prototype:** The title (e.g., "Anime") is 32sp bold at the top. When the user scrolls past 20px, it shrinks to 22sp. The title NEVER scrolls away — it stays pinned.

**WRONG (what we did initially):** Put the title inside the scrolling Column → it scrolled away with the content.

**RIGHT:**
```kotlin
val scrollState = rememberScrollState()
Column(modifier = Modifier.fillMaxSize()) {
    // Header is OUTSIDE the scroll — always visible
    CollapsingHeader(title = "Anime", scrollState = scrollState)
    // Content is INSIDE the scroll
    Column(modifier = Modifier.verticalScroll(scrollState)) {
        // ...
    }
}
```

The `CollapsingHeader` component reads `scrollState.value` and animates the font size between 32sp and 22sp.

---

## Floating bottom navigation bar

**Prototype:** The nav bar floats with 16dp padding from all edges. Content scrolls behind it. It is NOT a Scaffold bottom bar.

**WRONG:** Using `Scaffold(bottomBar = { BottomNavBar() })` → creates a solid section at the bottom, content doesn't scroll behind it.

**RIGHT:**
```kotlin
Box(modifier = Modifier.fillMaxSize()) {
    // Content fills the full screen
    NavHost(...) { /* screens */ }
    // Nav overlays on top, at the bottom
    BottomNavBar(
        modifier = Modifier.align(Alignment.BottomCenter),
        // ...
    )
}
```

---

## Bottom nav pill — content-sized active item

**Prototype:** Active nav item expands to fit its full label (e.g., "Settings"). Inactive items are icon-only.

**WRONG:** `Modifier.weight(0f)` for the active item → crashes (weight must be > 0).

**RIGHT:** Active item = `Modifier` (no weight = content-sized). Inactive items = `Modifier.weight(1f)`.

```kotlin
items.forEach { item ->
    NavPill(
        modifier = if (isActive) Modifier else Modifier.weight(1f),
        // ...
    )
}
```

---

## Custom toggle switch

**Prototype:** 44x26dp pill, surface-5 when off, primary when on. 20dp knob slides right.

**Do NOT use** `Switch` from Material 3 — it looks generic and doesn't match.

**Build custom:**
```kotlin
@Composable
fun CustomToggle(on: Boolean, onChange: (Boolean) -> Unit) {
    val bgColor by animateColorAsState(if (on) primary else surface5)
    val knobOffset by animateDpAsState(if (on) 20.dp else 2.dp)
    Box(
        modifier = Modifier
            .width(44.dp).height(26.dp)
            .clip(CircleShape)
            .background(bgColor)
            .clickable { onChange(!on) }
    ) {
        Box(modifier = Modifier
            .offset(x = knobOffset, y = 2.dp)
            .size(20.dp)
            .clip(CircleShape)
            .background(knobColor)
        )
    }
}
```

---

## Text-only segmented control (poster style, card density)

**Prototype:** A row of pill buttons in a surface-2 container. Active button has primary background + primaryFg text. Text only, no icons/images.

**Do NOT use** `SingleChoiceSegmentedButtonRow` — it looks generic.

**Build custom:**
```kotlin
@Composable
fun TextSelector(options: List<String>, value: String, onChange: (String) -> Unit) {
    Surface(color = surface2, shape = RoundedCornerShape(16.dp), modifier = Modifier.padding(4.dp)) {
        Row {
            options.forEach { opt ->
                Surface(
                    color = if (opt == value) primary else Color.Transparent,
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.weight(1f).clickable { onChange(opt) }
                ) {
                    Text(opt, color = if (opt == value) primaryFg else onSurfaceVariant,
                         fontWeight = FontWeight.SemiBold, fontSize = 13.sp,
                         modifier = Modifier.padding(vertical = 10.dp))
                }
            }
        }
    }
}
```

---

## Settings section groups

**Prototype:**
- Group label: 11sp bold UPPERCASE, letter-spacing 0.06em, onSurfaceVariant color.
- Card: surface-1 background, rounded 20dp, contains rows.
- Row: title (14sp semibold) + description (13sp normal, muted) on the left, control on the right.
- Divider between rows (1px, surface-3 color), no divider on last row.

```kotlin
@Composable
fun SettingsGroup(label: String, content: @Composable ColumnScope.() -> Unit) {
    Text(label, fontSize = 11.sp, fontWeight = FontWeight.Bold,
         letterSpacing = 0.06.sp, color = onSurfaceVariant,
         modifier = Modifier.padding(start = 16.dp, top = 24.dp, bottom = 8.dp))
    Surface(color = surface1, shape = RoundedCornerShape(20.dp)) {
        Column(content = content)
    }
}
```

---

## Cover overlap on detail screen

**Prototype:** Cover poster overlaps the banner by 70px (CSS negative margin).

**WRONG:** `Modifier.padding(top = (-70).dp)` → crashes.

**RIGHT:** `Modifier.offset(y = (-70).dp)` — moves the element visually without affecting layout.

---

## Grid inside a scrollable page

**Prototype:** Home page has a hero carousel + continue watching + two grids, all in one scroll.

**WRONG:** `LazyVerticalGrid` inside `verticalScroll` → crashes (nested scrolling).

**RIGHT:** Use a regular `Column` with `verticalScroll` and manually chunk items into rows:
```kotlin
Column(modifier = Modifier.verticalScroll(scrollState)) {
    HeroCarousel(...)
    items.chunked(3).forEach { rowItems ->
        Row {
            rowItems.forEach { item ->
                AnimeCard(anime = item, modifier = Modifier.weight(1f))
            }
            // Fill empty slots if rowItems.size < 3
            repeat(3 - rowItems.size) { Spacer(Modifier.weight(1f)) }
        }
    }
}
```

---

## Bottom sheet (customize, filters)

**Prototype:** Slides up from the bottom, rounded top corners, scrim backdrop. No drag handle.

**Use** `ModalBottomSheet` from Material 3:
```kotlin
if (show) {
    ModalBottomSheet(onDismissRequest = { show = false }) {
        // Content — no drag handle (the prototype doesn't have one)
        Column(modifier = Modifier.padding(24.dp)) {
            // sections...
        }
    }
}
```
