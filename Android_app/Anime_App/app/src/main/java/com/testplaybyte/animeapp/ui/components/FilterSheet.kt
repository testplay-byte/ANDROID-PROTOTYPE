@file:OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)

package com.testplaybyte.animeapp.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// ─────────────────────────────────────────────────────────────────────────────
// Filter category data — mirrors src/prototypes/anime-app/lib/filters.ts.
// All AniList enum values + display labels live here so the UI and any
// GraphQL client can share them.
// ─────────────────────────────────────────────────────────────────────────────

/** 16 genre chips shown in the Genres section (multi-select). */
val GENRES = listOf(
    "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mecha",
    "Music", "Mystery", "Psychological", "Romance", "Sci-Fi",
    "Slice of Life", "Sports", "Supernatural", "Thriller",
)

/** (displayLabel, anilistEnum) pairs for Season — single-select. */
val SEASONS = listOf(
    "Winter" to "WINTER",
    "Spring" to "SPRING",
    "Summer" to "SUMMER",
    "Fall" to "FALL",
)

/** (displayLabel, anilistEnum) pairs for Format — single-select. */
val FORMATS = listOf(
    "TV Series" to "TV",
    "Movie" to "MOVIE",
    "OVA" to "OVA",
    "ONA" to "ONA",
    "Special" to "SPECIAL",
    "TV Short" to "TV_SHORT",
)

/** (displayLabel, anilistEnum) pairs for Status — single-select. */
val STATUSES = listOf(
    "Currently Airing" to "RELEASING",
    "Finished" to "FINISHED",
    "Upcoming" to "NOT_YET_RELEASED",
    "Cancelled" to "CANCELLED",
)

/** Descending year list — same range as the web prototype's getYearOptions(). */
val YEARS: List<Int> = (2025 downTo 1990).toList()

// ─────────────────────────────────────────────────────────────────────────────
// Section tab identifiers — flat-view categories. Score is intentionally
// omitted from this first Android version (no score state in the API).
// ─────────────────────────────────────────────────────────────────────────────

private enum class FilterSection(val label: String) {
    GENRES("Genres"),
    YEAR("Year"),
    SEASON("Season"),
    FORMAT("Format"),
    STATUS("Status"),
}

/**
 * FilterSheet — ModalBottomSheet replicating the web prototype's filter sheet
 * (`src/prototypes/anime-app/components/filter-sheet.tsx`).
 *
 * Simplified flat view (one section visible at a time via top pill tabs):
 *   - Genres  → multi-select FlowRow of 16 chips
 *   - Year    → vertical scrollable single-select list with "Any"
 *   - Season  → 4 single-select chips + "Any"
 *   - Format  → 6 single-select chips + "Any"
 *   - Status  → 4 single-select chips + "Any"
 *
 * Bottom actions: "Clear all" (outlined, left) + "Apply filters" (filled, right).
 * The sheet has NO drag handle — only the scrim tap (default ModalBottomSheet
 * behavior) closes it.
 *
 * State is fully hoisted to the caller — this composable only renders the
 * current selections and forwards user intent via the on* callbacks.
 */
@Composable
fun FilterSheet(
    show: Boolean,
    onDismiss: () -> Unit,
    onApply: () -> Unit,
    onClearAll: () -> Unit,
    // Filter state (hoisted)
    selectedGenres: Set<String>,
    onGenreToggle: (String) -> Unit,
    selectedYear: Int?,
    onYearSelect: (Int?) -> Unit,
    selectedSeason: String?,
    onSeasonSelect: (String?) -> Unit,
    selectedFormat: String?,
    onFormatSelect: (String?) -> Unit,
    selectedStatus: String?,
    onStatusSelect: (String?) -> Unit,
) {
    if (!show) return

    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    var activeSection by remember { mutableStateOf(FilterSection.GENRES) }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = MaterialTheme.colorScheme.surface,
        dragHandle = null, // NO dismiss handle — tap scrim to close
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .navigationBarsPadding(),
        ) {
            // ── Header — "Filters" title ──
            Text(
                text = "Filters",
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = (-0.02).sp,
                color = MaterialTheme.colorScheme.onSurface,
                modifier = Modifier.padding(
                    start = 20.dp,
                    end = 20.dp,
                    top = 20.dp,
                    bottom = 12.dp,
                ),
            )

            // ── Section tabs (horizontally scrollable pill row) ──
            SectionTabs(
                active = activeSection,
                onSelect = { activeSection = it },
            )

            // ── Body — selected section's options, scrollable ──
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f, fill = false)
                    .verticalScroll(rememberScrollState())
                    .padding(start = 20.dp, end = 20.dp, top = 8.dp, bottom = 8.dp),
            ) {
                when (activeSection) {
                    FilterSection.GENRES -> GenresPanel(
                        selected = selectedGenres,
                        onToggle = onGenreToggle,
                    )
                    FilterSection.YEAR -> YearPanel(
                        selected = selectedYear,
                        onSelect = onYearSelect,
                    )
                    FilterSection.SEASON -> SingleSelectChipsPanel(
                        options = SEASONS,
                        selected = selectedSeason,
                        onSelect = onSeasonSelect,
                    )
                    FilterSection.FORMAT -> SingleSelectChipsPanel(
                        options = FORMATS,
                        selected = selectedFormat,
                        onSelect = onFormatSelect,
                    )
                    FilterSection.STATUS -> SingleSelectChipsPanel(
                        options = STATUSES,
                        selected = selectedStatus,
                        onSelect = onStatusSelect,
                    )
                }
            }

            // ── Bottom actions — Clear all (outlined) + Apply filters (filled) ──
            FilterActions(
                onClearAll = onClearAll,
                onApply = onApply,
            )
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Section tabs — horizontal pill row, active = primaryContainer
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun SectionTabs(
    active: FilterSection,
    onSelect: (FilterSection) -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .horizontalScroll(rememberScrollState())
            .padding(start = 20.dp, end = 20.dp, top = 4.dp, bottom = 4.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        FilterSection.entries.forEach { section ->
            val isActive = section == active
            val bg = if (isActive) MaterialTheme.colorScheme.primaryContainer
            else MaterialTheme.colorScheme.surfaceVariant
            val fg = if (isActive) MaterialTheme.colorScheme.onPrimaryContainer
            else MaterialTheme.colorScheme.onSurfaceVariant
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(50))
                    .background(bg)
                    .clickable { onSelect(section) }
                    .padding(horizontal = 16.dp, vertical = 10.dp),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    text = section.label,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = fg,
                )
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Genres panel — multi-select wrap-flow of pill chips (16 genres)
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun GenresPanel(
    selected: Set<String>,
    onToggle: (String) -> Unit,
) {
    FlowRow(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        GENRES.forEach { genre ->
            FilterPillChip(
                label = genre,
                selected = genre in selected,
                onClick = { onToggle(genre) },
            )
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Year panel — vertical scrollable single-select list with "Any"
// (36 items: Any + 2025 downTo 1990)
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun YearPanel(
    selected: Int?,
    onSelect: (Int?) -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(max = 320.dp),
    ) {
        YearRow(
            label = "Any",
            isSelected = selected == null,
            onClick = { onSelect(null) },
        )
        YEARS.forEach { year ->
            YearRow(
                label = year.toString(),
                isSelected = selected == year,
                onClick = { onSelect(year) },
            )
        }
    }
}

@Composable
private fun YearRow(
    label: String,
    isSelected: Boolean,
    onClick: () -> Unit,
) {
    val bg = if (isSelected) MaterialTheme.colorScheme.primaryContainer
    else Color.Transparent
    val fg = if (isSelected) MaterialTheme.colorScheme.onPrimaryContainer
    else MaterialTheme.colorScheme.onSurface
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(bg)
            .clickable(onClick = onClick)
            .padding(horizontal = 14.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            text = label,
            fontSize = 14.sp,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.SemiBold,
            color = fg,
        )
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Single-select chips panel — used for Season / Format / Status.
// "Any" chip first, then the category's options.
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun SingleSelectChipsPanel(
    options: List<Pair<String, String>>,
    selected: String?,
    onSelect: (String?) -> Unit,
) {
    FlowRow(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        // "Any" chip — represents no filter (selected == null)
        FilterPillChip(
            label = "Any",
            selected = selected == null,
            onClick = { onSelect(null) },
        )
        options.forEach { (label, value) ->
            FilterPillChip(
                label = label,
                selected = selected == value,
                onClick = { onSelect(value) },
            )
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Pill chip — shared by Genres + Season/Format/Status.
// Selected:   primaryContainer bg + onPrimaryContainer text
// Unselected: surfaceVariant bg + onSurfaceVariant text
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun FilterPillChip(
    label: String,
    selected: Boolean,
    onClick: () -> Unit,
) {
    val bg = if (selected) MaterialTheme.colorScheme.primaryContainer
    else MaterialTheme.colorScheme.surfaceVariant
    val fg = if (selected) MaterialTheme.colorScheme.onPrimaryContainer
    else MaterialTheme.colorScheme.onSurfaceVariant
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(50))
            .background(bg)
            .clickable(onClick = onClick)
            .padding(horizontal = 14.dp, vertical = 8.dp),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text = label,
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            color = fg,
        )
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Bottom actions — Clear all (outlined, left) + Apply filters (filled, right).
// Matches the prototype CSS: Apply grows (flex:1 1 0), Clear is auto-width
// (flex:0 0 auto) with extra horizontal padding.
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun FilterActions(
    onClearAll: () -> Unit,
    onApply: () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(start = 20.dp, end = 20.dp, top = 8.dp, bottom = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        // Clear all — outlined pill (transparent bg + outlineVariant border)
        Box(
            modifier = Modifier
                .height(52.dp)
                .clip(RoundedCornerShape(50))
                .border(
                    width = 1.dp,
                    color = MaterialTheme.colorScheme.outlineVariant,
                    shape = RoundedCornerShape(50),
                )
                .clickable(onClick = onClearAll)
                .padding(horizontal = 24.dp),
            contentAlignment = Alignment.Center,
        ) {
            Text(
                text = "Clear all",
                fontSize = 15.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onSurface,
            )
        }
        // Apply filters — filled pill (primary bg + onPrimary text, bold)
        Box(
            modifier = Modifier
                .weight(1f)
                .height(52.dp)
                .clip(RoundedCornerShape(50))
                .background(MaterialTheme.colorScheme.primary)
                .clickable(onClick = onApply),
            contentAlignment = Alignment.Center,
        ) {
            Text(
                text = "Apply filters",
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onPrimary,
            )
        }
    }
}
