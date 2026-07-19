@file:OptIn(ExperimentalMaterial3Api::class)

package com.testplaybyte.animeapp.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.AsyncImage
import com.testplaybyte.animeapp.data.LibraryRepository
import com.testplaybyte.animeapp.data.SettingsRepository
import com.testplaybyte.animeapp.model.*
import kotlinx.coroutines.launch


private enum class LibTab(val label: String) {
    ALL("All"), WATCHING("Watching"), COMPLETED("Completed"), PLAN("Plan to Watch");

    fun matches(status: LibraryStatus) = when (this) {
        ALL -> true
        WATCHING -> status == LibraryStatus.WATCHING
        COMPLETED -> status == LibraryStatus.COMPLETED
        PLAN -> status == LibraryStatus.PLAN
    }
}

/**
 * LibraryScreen — filterable, multi-selectable library list.
 * Two layout modes (grid/list) driven by settings, plus a customize sheet.
 * Long-press a card to enter selection mode.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LibraryScreen(
    onOpenAnime: (Int) -> Unit,
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val libraryRepo = remember { LibraryRepository(context) }
    val settingsRepo = remember { SettingsRepository(context) }

    val items by libraryRepo.items.collectAsStateWithLifecycle(initialValue = emptyList())
    val settings by settingsRepo.settings.collectAsStateWithLifecycle(initialValue = AppSettings())

    var activeTab by remember { mutableStateOf(LibTab.ALL) }
    var selectionMode by remember { mutableStateOf(false) }
    val selectedIds = remember { mutableStateListOf<Int>() }
    var showCustomize by remember { mutableStateOf(false) }
    var showCategoryMenu by remember { mutableStateOf(false) }

    val filtered = items.filter { activeTab.matches(it.status) }

    Scaffold(
        topBar = {
            LibraryTopBar(
                title = if (selectionMode) "${selectedIds.size} selected" else "Library",
                selectionMode = selectionMode,
                onBack = {
                    selectionMode = false
                    selectedIds.clear()
                },
                onCustomize = { showCustomize = true },
            )
        },
        bottomBar = {
            if (selectionMode) {
                SelectionActionBar(
                    onCategory = { showCategoryMenu = true },
                    onDelete = {
                        scope.launch {
                            libraryRepo.remove(selectedIds.toSet())
                            selectedIds.clear()
                            selectionMode = false
                        }
                    },
                    onCancel = {
                        selectedIds.clear()
                        selectionMode = false
                    },
                )
            }
        },
    ) { padding ->
        Column(modifier = Modifier
            .fillMaxSize()
            .padding(padding)) {
            // Status tabs (flat row with underline)
            if (!selectionMode) {
                StatusTabRow(active = activeTab, onSelect = { activeTab = it })
            }

            if (filtered.isEmpty()) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        text = if (items.isEmpty()) "Your library is empty.\nBrowse and add anime!"
                        else "No ${activeTab.label.lowercase()} items.",
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center,
                    )
                }
            } else if (settings.libraryLayout == LibraryLayout.GRID) {
                LazyVerticalGrid(
                    columns = GridCells.Fixed(settings.libraryColumns.coerceIn(2, 5)),
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(12.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    items(filtered, key = { it.id }) { item ->
                        LibraryGridCard(
                            item = item,
                            settings = settings,
                            selected = item.id in selectedIds,
                            selectionMode = selectionMode,
                            onClick = {
                                if (selectionMode) {
                                    if (item.id in selectedIds) selectedIds.remove(item.id)
                                    else selectedIds.add(item.id)
                                } else {
                                    onOpenAnime(item.id)
                                }
                            },
                            onLongPress = {
                                if (!selectionMode) selectionMode = true
                                if (item.id !in selectedIds) selectedIds.add(item.id)
                            },
                        )
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(vertical = 8.dp),
                ) {
                    items(filtered, key = { it.id }) { item ->
                        LibraryListRow(
                            item = item,
                            settings = settings,
                            selected = item.id in selectedIds,
                            selectionMode = selectionMode,
                            onClick = {
                                if (selectionMode) {
                                    if (item.id in selectedIds) selectedIds.remove(item.id)
                                    else selectedIds.add(item.id)
                                } else {
                                    onOpenAnime(item.id)
                                }
                            },
                            onLongPress = {
                                if (!selectionMode) selectionMode = true
                                if (item.id !in selectedIds) selectedIds.add(item.id)
                            },
                        )
                    }
                }
            }
        }
    }

    if (showCustomize) {
        ModalBottomSheet(onDismissRequest = { showCustomize = false }) {
            CustomizeSheetContent(
                settings = settings,
                onUpdate = { patch -> scope.launch { settingsRepo.update(patch) } },
            )
        }
    }

    if (showCategoryMenu) {
        ModalBottomSheet(onDismissRequest = { showCategoryMenu = false }) {
            Column(modifier = Modifier.padding(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 32.dp)) {
                Text(
                    "Move to category",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground,
                    modifier = Modifier.padding(bottom = 12.dp),
                )
                LibraryStatus.values().forEach { status ->
                    val label = when (status) {
                        LibraryStatus.WATCHING -> "Watching"
                        LibraryStatus.COMPLETED -> "Completed"
                        LibraryStatus.PLAN -> "Plan to Watch"
                    }
                    Text(
                        text = label,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        color = MaterialTheme.colorScheme.onBackground,
                        modifier = Modifier
                            .fillMaxWidth()
                            .combinedClickable(onClick = {
                                scope.launch {
                                    libraryRepo.setStatusForIds(selectedIds.toSet(), status)
                                    selectedIds.clear()
                                    selectionMode = false
                                    showCategoryMenu = false
                                }
                            })
                            .padding(vertical = 12.dp),
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun LibraryTopBar(
    title: String,
    selectionMode: Boolean,
    onBack: () -> Unit,
    onCustomize: () -> Unit,
) {
    TopAppBar(
        title = { Text(title, fontWeight = FontWeight.Bold) },
        navigationIcon = {
            if (selectionMode) {
                IconButton(onClick = onBack) {
                    Icon(Icons.Filled.ArrowBack, contentDescription = "Cancel selection")
                }
            }
        },
        actions = {
            if (!selectionMode) {
                IconButton(onClick = onCustomize) {
                    Icon(Icons.Filled.Settings, contentDescription = "Customize library")
                }
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.background,
            titleContentColor = MaterialTheme.colorScheme.onBackground,
        ),
    )
}

@Composable
private fun StatusTabRow(
    active: LibTab,
    onSelect: (LibTab) -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.spacedBy(20.dp),
    ) {
        LibTab.values().forEach { tab ->
            val isActive = tab == active
            Column(
                modifier = Modifier.combinedClickable(onClick = { onSelect(tab) }),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Text(
                    text = tab.label,
                    fontSize = 13.sp,
                    fontWeight = if (isActive) FontWeight.Bold else FontWeight.Medium,
                    color = if (isActive) MaterialTheme.colorScheme.primary
                    else MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Spacer(Modifier.height(4.dp))
                Box(
                    modifier = Modifier
                        .width(28.dp)
                        .height(2.dp)
                        .background(
                            if (isActive) MaterialTheme.colorScheme.primary
                            else Color.Transparent
                        ),
                )
            }
        }
    }
}

@Composable
private fun SelectionActionBar(
    onCategory: () -> Unit,
    onDelete: () -> Unit,
    onCancel: () -> Unit,
) {
    Surface(
        color = MaterialTheme.colorScheme.surfaceVariant,
        shadowElevation = 8.dp,
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            TextButton(onClick = onCancel) { Text("Cancel") }
            TextButton(onClick = onCategory) { Text("Category") }
            TextButton(
                onClick = onDelete,
                colors = ButtonDefaults.textButtonColors(
                    contentColor = MaterialTheme.colorScheme.error,
                ),
            ) {
                Icon(Icons.Filled.Delete, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(4.dp))
                Text("Delete")
            }
        }
    }
}

// ── Grid card ─────────────────────────────────────────────────────────────
@Composable
private fun LibraryGridCard(
    item: LibraryItem,
    settings: AppSettings,
    selected: Boolean,
    selectionMode: Boolean,
    onClick: () -> Unit,
    onLongPress: () -> Unit,
) {
    val cornerRadius = when (settings.posterStyle) {
        PosterStyle.ROUNDED -> 12.dp
        PosterStyle.SOFT -> 6.dp
        PosterStyle.SHARP -> 2.dp
    }

    Column(
        modifier = Modifier
            .padding(horizontal = 4.dp)
            .combinedClickable(
                onClick = onClick,
                onLongClick = onLongPress,
            ),
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(2f / 3f)
                .clip(RoundedCornerShape(cornerRadius))
                .background(MaterialTheme.colorScheme.surfaceVariant),
        ) {
            AsyncImage(
                model = item.cover,
                contentDescription = item.title,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop,
            )
            // Episode badge per settings (only if Show episodes enabled)
            if (settings.libraryShowEpisodes && item.episodes != null &&
                settings.libraryEpisodePosition != EpisodePosition.HIDDEN
            ) {
                val badgeAlign = when (settings.libraryEpisodePosition) {
                    EpisodePosition.TOP_LEFT -> Alignment.TopStart
                    EpisodePosition.TOP_RIGHT -> Alignment.TopEnd
                    EpisodePosition.BOTTOM_LEFT -> Alignment.BottomStart
                    EpisodePosition.BOTTOM_RIGHT -> Alignment.BottomEnd
                    EpisodePosition.HIDDEN -> Alignment.TopEnd
                }
                Surface(
                    color = Color.Black.copy(alpha = 0.55f),
                    shape = RoundedCornerShape(6.dp),
                    modifier = Modifier
                        .align(badgeAlign)
                        .padding(6.dp),
                ) {
                    Text(
                        text = "EP ${item.episodes}",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                    )
                }
            }
            // Selection checkmark
            if (selectionMode) {
                Box(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(6.dp)
                        .size(22.dp)
                        .clip(CircleShape)
                        .background(
                            if (selected) MaterialTheme.colorScheme.primary
                            else Color.Black.copy(alpha = 0.4f)
                        ),
                    contentAlignment = Alignment.Center,
                ) {
                    if (selected) {
                        Icon(
                            Icons.Filled.Check,
                            contentDescription = "Selected",
                            tint = MaterialTheme.colorScheme.onPrimary,
                            modifier = Modifier.size(14.dp),
                        )
                    }
                }
            }
            // Overlay text placement
            if (settings.libraryTextPlacement == TextPlacement.OVERLAY) {
                Box(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .fillMaxWidth()
                        .background(
                            androidx.compose.ui.graphics.Brush.verticalGradient(
                                listOf(Color.Transparent, Color.Black.copy(alpha = 0.7f))
                            )
                        )
                        .padding(8.dp),
                ) {
                    Text(
                        text = item.title,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color.White,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                }
            }
        }
        Spacer(Modifier.height(6.dp))
        if (settings.libraryTextPlacement == TextPlacement.BELOW) {
            Text(
                text = item.title,
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onBackground,
                maxLines = if (settings.singleLineTitles) 1 else 2,
                overflow = TextOverflow.Ellipsis,
            )
            val meta = buildList {
                if (settings.libraryShowFormat && item.format != null) add(item.format)
                if (settings.libraryShowEpisodes && item.episodes != null) add("${item.episodes} ep")
            }.joinToString(" · ")
            if (meta.isNotEmpty()) {
                Text(
                    text = meta,
                    fontSize = 11.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
        }
    }
}

// ── List row ──────────────────────────────────────────────────────────────
@Composable
private fun LibraryListRow(
    item: LibraryItem,
    settings: AppSettings,
    selected: Boolean,
    selectionMode: Boolean,
    onClick: () -> Unit,
    onLongPress: () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .combinedClickable(
                onClick = onClick,
                onLongClick = onLongPress,
            )
            .padding(horizontal = 12.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            modifier = Modifier
                .size(width = 56.dp, height = 80.dp)
                .clip(RoundedCornerShape(6.dp))
                .background(MaterialTheme.colorScheme.surfaceVariant),
        ) {
            AsyncImage(
                model = item.cover,
                contentDescription = item.title,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop,
            )
            if (selectionMode) {
                Box(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(4.dp)
                        .size(18.dp)
                        .clip(CircleShape)
                        .background(
                            if (selected) MaterialTheme.colorScheme.primary
                            else Color.Black.copy(alpha = 0.4f)
                        ),
                    contentAlignment = Alignment.Center,
                ) {
                    if (selected) {
                        Icon(
                            Icons.Filled.Check,
                            contentDescription = "Selected",
                            tint = MaterialTheme.colorScheme.onPrimary,
                            modifier = Modifier.size(12.dp),
                        )
                    }
                }
            }
        }
        Spacer(Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = item.title,
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onBackground,
                maxLines = if (settings.singleLineTitles) 1 else 2,
                overflow = TextOverflow.Ellipsis,
            )
            val meta = buildList {
                add(when (item.status) {
                    LibraryStatus.WATCHING -> "Watching"
                    LibraryStatus.COMPLETED -> "Completed"
                    LibraryStatus.PLAN -> "Plan to Watch"
                })
                if (settings.libraryShowFormat && item.format != null) add(item.format)
                if (settings.libraryShowEpisodes && item.episodes != null) add("${item.episodes} ep")
            }.joinToString(" · ")
            Text(
                text = meta,
                fontSize = 12.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
    }
}

// ── Customize sheet ───────────────────────────────────────────────────────
@Composable
private fun CustomizeSheetContent(
    settings: AppSettings,
    onUpdate: (AppSettings.() -> AppSettings) -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp)
            .padding(bottom = 40.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        Text(
            "Customize Library",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground,
        )

        Text("Layout", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        SegmentedRow(
            options = listOf("Grid" to LibraryLayout.GRID, "List" to LibraryLayout.LIST),
            selected = settings.libraryLayout,
            onSelect = { v -> onUpdate { copy(libraryLayout = v) } },
            label = { it.name.lowercase().replaceFirstChar { c -> c.uppercase() } },
        )

        Text("Columns", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            listOf(2, 3, 4, 5).forEach { n ->
                FilterChip(
                    selected = settings.libraryColumns == n,
                    onClick = { onUpdate { copy(libraryColumns = n) } },
                    label = { Text("$n") },
                )
            }
        }

        Text("Text placement", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        SegmentedRow(
            options = listOf("Below" to TextPlacement.BELOW, "Overlay" to TextPlacement.OVERLAY),
            selected = settings.libraryTextPlacement,
            onSelect = { v -> onUpdate { copy(libraryTextPlacement = v) } },
            label = { it.name.lowercase().replaceFirstChar { c -> c.uppercase() } },
        )

        Text("Cover details", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        ToggleRow(label = "Show format", checked = settings.libraryShowFormat) {
            onUpdate { copy(libraryShowFormat = it) }
        }
        ToggleRow(label = "Show episodes", checked = settings.libraryShowEpisodes) {
            onUpdate { copy(libraryShowEpisodes = it) }
        }

        Text("Episode badge position", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        SegmentedRow(
            options = EpisodePosition.values().map { it.name to it },
            selected = settings.libraryEpisodePosition,
            onSelect = { v -> onUpdate { copy(libraryEpisodePosition = v) } },
            label = {
                it.name.split("_").joinToString(" ") { w ->
                    w.lowercase().replaceFirstChar { c -> c.uppercase() }
                }
            },
        )
    }
}

@Composable
private fun <T> SegmentedRow(
    options: List<Pair<String, T>>,
    selected: T,
    onSelect: (T) -> Unit,
    label: (T) -> String,
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        options.forEach { (_, value) ->
            FilterChip(
                selected = selected == value,
                onClick = { onSelect(value) },
                label = { Text(label(value)) },
                modifier = Modifier.weight(1f),
            )
        }
    }
}

@Composable
private fun ToggleRow(label: String, checked: Boolean, onChange: (Boolean) -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        Text(label, fontSize = 14.sp, color = MaterialTheme.colorScheme.onBackground)
        Switch(checked = checked, onCheckedChange = onChange)
    }
}
