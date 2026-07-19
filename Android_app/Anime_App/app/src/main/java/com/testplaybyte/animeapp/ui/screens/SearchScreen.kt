package com.testplaybyte.animeapp.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.testplaybyte.animeapp.data.AniListClient
import com.testplaybyte.animeapp.model.Anime
import com.testplaybyte.animeapp.ui.components.AnimeCard
import com.testplaybyte.animeapp.ui.components.CollapsingHeader
import com.testplaybyte.animeapp.ui.components.NavIcons
import kotlinx.coroutines.delay

/**
 * SearchScreen — debounced AniList search with a results grid.
 *
 * Mirrors the web prototype (`search-screen.tsx` + `search-screen.module.css`):
 *   - Pinned `CollapsingHeader("Search")` outside the scroll Column.
 *   - Pill-shaped search bar (52dp tall, fully rounded, surfaceVariant tinted
 *     background, magnifier icon left, clear button right when text exists).
 *     Sits BETWEEN the header and the scroll content (always visible).
 *   - Debounced search: 500ms after the user stops typing, calls AniListClient.search.
 *   - When no query: "Popular anime" label + trending results as the default view.
 *   - Results: non-lazy 3-column chunked grid of AnimeCard (avoids nested-scroll
 *     crash with the verticalScroll Column, matches HomeScreen's AnimeGrid pattern).
 *   - Loading skeleton grid, error state, and empty-results state.
 *   - 110dp bottom padding for the floating nav bar.
 */
@Composable
fun SearchScreen(
    onOpenAnime: (Int) -> Unit,
) {
    val client = remember { AniListClient() }
    val keyboard = LocalSoftwareKeyboardController.current
    val scrollState = rememberScrollState()

    var query by remember { mutableStateOf("") }
    var results by remember { mutableStateOf<List<Anime>>(emptyList()) }
    var popular by remember { mutableStateOf<List<Anime>>(emptyList()) }
    var loading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var hasSearched by remember { mutableStateOf(false) }
    var source by remember { mutableStateOf("anilist") }

    // Fetch popular (trending) anime as the default landing view.
    LaunchedEffect(Unit) {
        popular = runCatching { client.fetchTrending() }.getOrDefault(emptyList())
    }

    // Debounced search — re-launches whenever `query` changes (cancels previous
    // delay if a new keystroke arrives within 500ms).
    LaunchedEffect(query) {
        if (query.isBlank()) {
            results = emptyList()
            hasSearched = false
            loading = false
            error = null
            return@LaunchedEffect
        }
        loading = true
        delay(500)
        val result = runCatching { client.search(query.trim()) }
        results = result.getOrDefault(emptyList())
        error = result.exceptionOrNull()?.message
        loading = false
        hasSearched = true
    }

    val displayed = if (query.isBlank()) popular else results
    val sectionLabel = when {
        query.isBlank() -> "Popular anime"
        loading -> "Searching…"
        error != null -> "Search error"
        hasSearched && results.isEmpty() -> "No results for \"$query\""
        else -> "Results for \"$query\""
    }
    val showCount = !loading && error == null && displayed.isNotEmpty()

    Column(modifier = Modifier.fillMaxSize()) {
        // Pinned collapsing header — sits OUTSIDE the scroll Column.
        CollapsingHeader(title = "Search", scrollState = scrollState)

        // ── Search bar (always visible, between header and scroll content) ──
        SearchBar(
            value = query,
            onChange = { query = it },
            onClear = { query = "" },
            onSubmit = { keyboard?.hide() },
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp),
        )

        // ── Source toggle + Filter button row ──
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            // Source toggle: AniList / Extension
            Surface(
                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
                shape = RoundedCornerShape(50),
            ) {
                Row(modifier = Modifier.padding(3.dp)) {
                    SourceToggleBtn(
                        label = "AniList",
                        active = source == "anilist",
                        onClick = { source = "anilist" },
                    )
                    SourceToggleBtn(
                        label = "Extension",
                        active = source == "extension",
                        onClick = { source = "extension" },
                    )
                }
            }

            // Filter button
            Surface(
                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
                shape = RoundedCornerShape(50),
            ) {
                Row(
                    modifier = Modifier
                        .clip(RoundedCornerShape(50))
                        .clickable { /* Filter sheet — TODO in future iteration */ }
                        .padding(horizontal = 14.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Icon(
                        imageVector = Icons.Filled.FilterList,
                        contentDescription = "Filters",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(18.dp),
                    )
                    Spacer(Modifier.width(6.dp))
                    Text(
                        text = "Filters",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        }

        // ── Scrollable content ──────────────────────────────────────────────
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
                .padding(bottom = 110.dp),
        ) {
            // Section header — label on left, count on right.
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    text = sectionLabel,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground,
                    modifier = Modifier.weight(1f),
                )
                if (showCount) {
                    Text(
                        text = "${displayed.size} found",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }

            when {
                // Loading state — skeleton grid.
                loading -> SearchSkeletonGrid()
                // Error state.
                error != null -> SearchEmptyState(
                    title = "Search error",
                    description = error ?: "Something went wrong.",
                )
                // No results for the query.
                query.isNotBlank() && results.isEmpty() -> SearchEmptyState(
                    title = "No results found",
                    description = "Try different keywords or adjust your filters.",
                )
                // Still loading popular (initial state, no query).
                displayed.isEmpty() && query.isBlank() -> SearchSkeletonGrid()
                // Results grid.
                else -> SearchResultsGrid(items = displayed, onOpenAnime = onOpenAnime)
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// SearchBar — pill-shaped text field.
// 52dp tall, RoundedCornerShape(50) (full pill), surfaceVariant tinted background.
// Layout: magnifier icon | text field | clear button (when text exists).
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun SearchBar(
    value: String,
    onChange: (String) -> Unit,
    onClear: () -> Unit,
    onSubmit: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(52.dp)
            .clip(RoundedCornerShape(50))
            .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)),
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            // Magnifier icon (left).
            Icon(
                imageVector = NavIcons.Search,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(20.dp),
            )
            Spacer(Modifier.width(12.dp))

            // Text field — transparent, no decoration. Placeholder shown when empty.
            BasicTextField(
                value = value,
                onValueChange = onChange,
                modifier = Modifier.weight(1f),
                singleLine = true,
                textStyle = TextStyle(
                    fontSize = 15.sp,
                    color = MaterialTheme.colorScheme.onBackground,
                ),
                cursorBrush = SolidColor(MaterialTheme.colorScheme.primary),
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
                keyboardActions = KeyboardActions(onSearch = { onSubmit() }),
                decorationBox = { innerTextField ->
                    Box {
                        if (value.isEmpty()) {
                            Text(
                                text = "Search anime…",
                                fontSize = 15.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                        innerTextField()
                    }
                },
            )

            // Clear button (right) — only visible when there's text.
            if (value.isNotEmpty()) {
                Spacer(Modifier.width(8.dp))
                Box(
                    modifier = Modifier
                        .size(24.dp)
                        .clip(CircleShape)
                        .background(MaterialTheme.colorScheme.surfaceVariant)
                        .clickable { onClear() },
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(
                        imageVector = Icons.Filled.Close,
                        contentDescription = "Clear",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(14.dp),
                    )
                }
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// SearchResultsGrid — non-lazy 3-column grid laid out as Column-of-Rows
// (chunked by 3). Safe to embed inside verticalScroll (LazyVerticalGrid would
// crash with nested scrolling). Spacing matches HomeScreen's AnimeGrid pattern:
//   - 16dp effective edge padding (Column 12dp + AnimeCard internal 4dp).
//   - 8dp column gap (AnimeCard left 4dp + right 4dp, Row spacedBy 0dp).
//   - 12dp row gap (Column spacedBy 12dp).
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun SearchResultsGrid(
    items: List<Anime>,
    onOpenAnime: (Int) -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 12.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        items.chunked(3).forEach { rowItems ->
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(0.dp),
            ) {
                rowItems.forEach { anime ->
                    Box(modifier = Modifier.weight(1f)) {
                        AnimeCard(anime = anime, onClick = onOpenAnime)
                    }
                }
                // Fill remaining slots so columns stay aligned.
                repeat(3 - rowItems.size) {
                    Spacer(modifier = Modifier.weight(1f))
                }
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// SearchSkeletonGrid — 12 cover-shaped placeholders while fetching.
// Uses surfaceVariant background. Matches HomeScreen's GridSkeleton pattern.
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun SearchSkeletonGrid() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 12.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        (0 until 12).chunked(3).forEach { rowIndices ->
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(0.dp),
            ) {
                rowIndices.forEach {
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .padding(horizontal = 4.dp)
                            .aspectRatio(2f / 3f)
                            .clip(RoundedCornerShape(8.dp))
                            .background(MaterialTheme.colorScheme.surfaceVariant),
                    )
                }
                repeat(3 - rowIndices.size) {
                    Spacer(modifier = Modifier.weight(1f))
                }
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// SearchEmptyState — magnifier icon + title + description.
// Matches prototype's `.emptyState` / `.emptyStateIcon` (72dp circle, surface-2 bg).
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun SearchEmptyState(title: String, description: String) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp, vertical = 60.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Box(
            modifier = Modifier
                .size(72.dp)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.surfaceVariant),
            contentAlignment = Alignment.Center,
        ) {
            // NavIcons.Search — magnifier icon, matches prototype's empty-state SVG.
            Icon(
                imageVector = NavIcons.Search,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(28.dp),
            )
        }
        Spacer(Modifier.height(12.dp))
        Text(
            text = title,
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground,
            textAlign = TextAlign.Center,
        )
        Spacer(Modifier.height(8.dp))
        Text(
            text = description,
            fontSize = 14.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center,
            maxLines = 3,
        )
    }
}

// ── Source toggle button (AniList / Extension) ──────────────────────────────
@Composable
private fun SourceToggleBtn(
    label: String,
    active: Boolean,
    onClick: () -> Unit,
) {
    val bg = if (active) MaterialTheme.colorScheme.primaryContainer else androidx.compose.ui.graphics.Color.Transparent
    val fg = if (active) MaterialTheme.colorScheme.onPrimaryContainer else MaterialTheme.colorScheme.onSurfaceVariant
    Row(
        modifier = Modifier
            .clip(RoundedCornerShape(50))
            .background(bg)
            .clickable { onClick() }
            .padding(horizontal = 14.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            text = label,
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            color = fg,
        )
    }
}
