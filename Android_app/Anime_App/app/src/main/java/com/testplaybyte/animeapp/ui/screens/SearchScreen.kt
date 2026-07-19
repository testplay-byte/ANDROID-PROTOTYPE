@file:OptIn(ExperimentalMaterial3Api::class)

package com.testplaybyte.animeapp.ui.screens

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.testplaybyte.animeapp.data.AniListClient
import com.testplaybyte.animeapp.model.Anime
import com.testplaybyte.animeapp.ui.components.AnimeCard
import com.testplaybyte.animeapp.ui.components.CollapsingHeader
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

/**
 * SearchScreen — matches the web prototype exactly.
 *
 * Layout (top to bottom):
 *   1. Collapsing header area (NOT using CollapsingHeader — custom):
 *      - Row: [Title "Search"] [SourceToggle (right)] [SearchBar (full width)]
 *      - When scrolled: title shrinks, source toggle fades+shrinks to 0,
 *        search bar moves beside title.
 *   2. Quick row: [Filters (left)] [spacer] [Sort dropdown (right)]
 *      - Slides out (fades + height→0) when scrolled.
 *   3. Scrollable content:
 *      - Recent searches (when no query + no filters)
 *      - Results grid (3-column chunked) with label + count
 */
@Composable
fun SearchScreen(
    onOpenAnime: (Int) -> Unit,
) {
    val client = remember { AniListClient() }
    val keyboard = LocalSoftwareKeyboardController.current
    val scrollState = rememberScrollState()
    val scope = rememberCoroutineScope()

    var query by remember { mutableStateOf("") }
    var source by remember { mutableStateOf("anilist") } // "anilist" or "extension"
    var sort by remember { mutableStateOf("POPULARITY_DESC") } // default for anilist
    var results by remember { mutableStateOf<List<Anime>>(emptyList()) }
    var loading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var hasSearched by remember { mutableStateOf(false) }
    var showFilterSheet by remember { mutableStateOf(false) }
    var showSortDropdown by remember { mutableStateOf(false) }
    var recents by remember { mutableStateOf<List<String>>(emptyList()) }

    // Collapsed state — driven by scroll position
    val collapsed = scrollState.value > 20

    // Fetch default content when source changes or on first load
    LaunchedEffect(source) {
        if (query.isBlank()) {
            loading = true
            error = null
            val result = runCatching {
                if (source == "anilist") client.fetchPopular()
                else client.fetchTrendingFull()
            }
            results = result.getOrDefault(emptyList())
            error = result.exceptionOrNull()?.message
            loading = false
            hasSearched = false
        }
    }

    // Debounced search
    LaunchedEffect(query) {
        if (query.isBlank()) {
            // When query is cleared, fetch default content for current source
            loading = true
            error = null
            val result = runCatching {
                if (source == "anilist") client.fetchPopular()
                else client.fetchTrendingFull()
            }
            results = result.getOrDefault(emptyList())
            error = result.exceptionOrNull()?.message
            loading = false
            hasSearched = false
            return@LaunchedEffect
        }
        loading = true
        delay(500)
        // Add to recents
        recents = (listOf(query.trim()) + recents.filter { it != query.trim() }).take(12)
        val result = runCatching { client.search(query.trim()) }
        results = result.getOrDefault(emptyList())
        error = result.exceptionOrNull()?.message
        loading = false
        hasSearched = true
    }

    // Result label
    val sectionLabel = when {
        query.isNotBlank() -> "Results for \"$query\""
        source == "extension" -> "Trending now · Extension"
        else -> "Popular anime"
    }
    val showCount = !loading && error == null && results.isNotEmpty()

    // Sort options
    val sortOptions = listOf(
        "POPULARITY_DESC" to "Popularity",
        "SCORE_DESC" to "Score",
        "START_DATE_DESC" to "Newest",
        "TITLE_ROMAJI" to "Title A-Z",
        "TRENDING_DESC" to "Trending",
    )
    val currentSortLabel = sortOptions.find { it.first == sort }?.second ?: "Popularity"

    Column(modifier = Modifier.fillMaxSize()) {
        // ── Collapsing topbar (title + source toggle + search bar) ──
        SearchTopBar(
            collapsed = collapsed,
            query = query,
            onQueryChange = { query = it },
            onClearQuery = { query = "" },
            source = source,
            onSourceChange = { newSource ->
                source = newSource
                sort = if (newSource == "extension") "TRENDING_DESC" else "POPULARITY_DESC"
            },
            onSubmit = { keyboard?.hide() },
        )

        // ── Quick row: Filters (left) + Sort (right) — slides out when collapsed ──
        AnimatedVisibility(
            visible = !collapsed,
            enter = fadeIn(),
            exit = fadeOut() + shrinkVertically(animationSpec = tween(300, easing = FastOutSlowInEasing)),
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                // Filters button (LEFT side)
                Row(
                    modifier = Modifier
                        .clip(RoundedCornerShape(50))
                        .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f))
                        .clickable { showFilterSheet = true }
                        .padding(horizontal = 14.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Icon(
                        imageVector = Icons.Filled.FilterList,
                        contentDescription = "Filters",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(18.dp),
                    )
                    Spacer(Modifier.width(7.dp))
                    Text(
                        text = "Filters",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }

                // Sort dropdown (RIGHT side)
                Box {
                    Row(
                        modifier = Modifier
                            .clip(RoundedCornerShape(50))
                            .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f))
                            .clickable { showSortDropdown = !showSortDropdown }
                            .padding(horizontal = 14.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(
                            text = currentSortLabel,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        Spacer(Modifier.width(6.dp))
                        Icon(
                            imageVector = if (showSortDropdown) Icons.Filled.KeyboardArrowUp else Icons.Filled.KeyboardArrowDown,
                            contentDescription = "Sort",
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.size(14.dp),
                        )
                    }

                    // Sort dropdown menu
                    DropdownMenu(
                        expanded = showSortDropdown,
                        onDismissRequest = { showSortDropdown = false },
                    ) {
                        sortOptions.forEach { (value, label) ->
                            DropdownMenuItem(
                                text = { Text(label, fontSize = 14.sp, fontWeight = if (value == sort) FontWeight.Bold else FontWeight.Normal) },
                                onClick = {
                                    sort = value
                                    showSortDropdown = false
                                },
                                leadingIcon = if (value == sort) {
                                    { Icon(Icons.Filled.Check, contentDescription = null, modifier = Modifier.size(16.dp)) }
                                } else null,
                            )
                        }
                    }
                }
            }
        }

        // ── Scrollable content ──
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
                .padding(bottom = 110.dp),
        ) {
            // Recent searches (when no query)
            if (query.isBlank() && recents.isNotEmpty()) {
                RecentSearchesSection(
                    recents = recents,
                    onPick = { query = it },
                    onClear = { recents = emptyList() },
                )
            }

            // Section header — label + count
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
                        text = "${results.size} found",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }

            // Results grid (3-column chunked)
            if (loading) {
                Text(
                    text = "Loading…",
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(16.dp),
                )
            } else if (error != null) {
                Text(
                    text = error ?: "An error occurred",
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.error,
                    modifier = Modifier.padding(16.dp),
                )
            } else if (results.isEmpty() && hasSearched) {
                Text(
                    text = "No results found for \"$query\"",
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(16.dp),
                )
            } else {
                results.chunked(3).forEach { rowItems ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 12.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        rowItems.forEach { anime ->
                            AnimeCard(
                                anime = anime,
                                onClick = onOpenAnime,
                                modifier = Modifier.weight(1f),
                            )
                        }
                        // Fill empty slots
                        repeat(3 - rowItems.size) {
                            Spacer(Modifier.weight(1f))
                        }
                    }
                    Spacer(Modifier.height(12.dp))
                }
            }
        }
    }

    // Filter bottom sheet (TODO: implement full filter options)
    if (showFilterSheet) {
        ModalBottomSheet(
            onDismissRequest = { showFilterSheet = false },
            containerColor = MaterialTheme.colorScheme.surface,
        ) {
            Column(modifier = Modifier.padding(24.dp)) {
                Text(
                    text = "Filters",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface,
                )
                Spacer(Modifier.height(16.dp))
                Text(
                    text = "Filter options will be implemented in a future update.",
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Spacer(Modifier.height(24.dp))
                Button(
                    onClick = { showFilterSheet = false },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(50),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.primary,
                    ),
                ) {
                    Text("Done", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

// ── SearchTopBar — collapsing title + source toggle + search bar ──────────

@Composable
private fun SearchTopBar(
    collapsed: Boolean,
    query: String,
    onQueryChange: (String) -> Unit,
    onClearQuery: () -> Unit,
    source: String,
    onSourceChange: (String) -> Unit,
    onSubmit: () -> Unit,
) {
    val titleFontSize by animateFloatAsState(
        targetValue = if (collapsed) 22f else 32f,
        animationSpec = tween(300, easing = FastOutSlowInEasing),
        label = "titleSize",
    )
    val sourceAlpha by animateFloatAsState(
        targetValue = if (collapsed) 0f else 1f,
        animationSpec = tween(300, easing = FastOutSlowInEasing),
        label = "sourceAlpha",
    )
    val sourceWidth by animateDpAsState(
        targetValue = if (collapsed) 0.dp else 160.dp,
        animationSpec = tween(300, easing = FastOutSlowInEasing),
        label = "sourceWidth",
    )

    Surface(
        color = MaterialTheme.colorScheme.background,
        modifier = Modifier.fillMaxWidth(),
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
                .statusBarsPadding(),
        ) {
            // Row: Title + SourceToggle (right) + SearchBar (below)
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                // Title
                Text(
                    text = "Search",
                    fontSize = titleFontSize.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = (-0.02).sp,
                    color = MaterialTheme.colorScheme.onBackground,
                    maxLines = 1,
                )

                // Source toggle (right side, fades out when collapsed)
                if (sourceWidth > 0.dp) {
                    Row(
                        modifier = Modifier
                            .width(sourceWidth)
                            .alpha(sourceAlpha)
                            .clip(RoundedCornerShape(50))
                            .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f))
                            .padding(3.dp),
                        horizontalArrangement = Arrangement.End,
                    ) {
                        SourceToggleBtn(
                            label = "AniList",
                            icon = Icons.Filled.Search,
                            active = source == "anilist",
                            onClick = { onSourceChange("anilist") },
                        )
                        SourceToggleBtn(
                            label = "Extension",
                            icon = Icons.Filled.Extension,
                            active = source == "extension",
                            onClick = { onSourceChange("extension") },
                        )
                    }
                }
            }

            Spacer(Modifier.height(4.dp))

            // Search bar (full width)
            SearchBar(
                value = query,
                onChange = onQueryChange,
                onClear = onClearQuery,
                onSubmit = onSubmit,
            )

            Spacer(Modifier.height(4.dp))
        }
    }
}

// ── Source toggle button ──────────────────────────────────────────────────

@Composable
private fun RowScope.SourceToggleBtn(
    label: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    active: Boolean,
    onClick: () -> Unit,
) {
    val bg = if (active) MaterialTheme.colorScheme.primaryContainer else Color.Transparent
    val fg = if (active) MaterialTheme.colorScheme.onPrimaryContainer else MaterialTheme.colorScheme.onSurfaceVariant
    Row(
        modifier = Modifier
            .weight(1f)
            .clip(RoundedCornerShape(50))
            .background(bg)
            .clickable { onClick() }
            .padding(horizontal = 10.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Center,
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = fg,
            modifier = Modifier.size(14.dp),
        )
        Spacer(Modifier.width(4.dp))
        Text(
            text = label,
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold,
            color = fg,
            maxLines = 1,
        )
    }
}

// ── Search bar ────────────────────────────────────────────────────────────

@Composable
private fun SearchBar(
    value: String,
    onChange: (String) -> Unit,
    onClear: () -> Unit,
    onSubmit: () -> Unit,
) {
    Surface(
        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
        shape = RoundedCornerShape(50),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(
                imageVector = Icons.Filled.Search,
                contentDescription = "Search",
                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(20.dp),
            )
            Spacer(Modifier.width(12.dp))
            BasicTextField(
                value = value,
                onValueChange = onChange,
                modifier = Modifier.weight(1f),
                textStyle = TextStyle(
                    fontSize = 16.sp,
                    color = MaterialTheme.colorScheme.onBackground,
                ),
                cursorBrush = SolidColor(MaterialTheme.colorScheme.primary),
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
                keyboardActions = KeyboardActions(onSearch = { onSubmit() }),
                singleLine = true,
                decorationBox = { innerTextField ->
                    if (value.isEmpty()) {
                        Text(
                            text = "Search anime by title...",
                            fontSize = 16.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                    innerTextField()
                },
            )
            if (value.isNotEmpty()) {
                Spacer(Modifier.width(8.dp))
                Box(
                    modifier = Modifier
                        .size(24.dp)
                        .clip(CircleShape)
                        .clickable { onClear() },
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(
                        imageVector = Icons.Filled.Close,
                        contentDescription = "Clear",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(18.dp),
                    )
                }
            }
        }
    }
}

// ── Recent searches section ───────────────────────────────────────────────

@Composable
private fun RecentSearchesSection(
    recents: List<String>,
    onPick: (String) -> Unit,
    onClear: () -> Unit,
) {
    Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = "RECENT SEARCHES",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                letterSpacing = 0.06.sp,
            )
            Text(
                text = "Clear",
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier.clickable { onClear() },
            )
        }
        Spacer(Modifier.height(8.dp))
        recents.take(5).forEach { recent ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .clickable { onPick(recent) }
                    .padding(vertical = 10.dp, horizontal = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Icon(
                    imageVector = Icons.Filled.History,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.size(18.dp),
                )
                Spacer(Modifier.width(12.dp))
                Text(
                    text = recent,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    color = MaterialTheme.colorScheme.onBackground,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
        }
        Spacer(Modifier.height(8.dp))
    }
}
