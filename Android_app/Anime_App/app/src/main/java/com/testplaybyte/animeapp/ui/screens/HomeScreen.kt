package com.testplaybyte.animeapp.ui.screens

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import com.testplaybyte.animeapp.data.AniListClient
import com.testplaybyte.animeapp.data.HistoryRepository
import com.testplaybyte.animeapp.model.Anime
import com.testplaybyte.animeapp.ui.components.AnimeCard
import com.testplaybyte.animeapp.ui.components.ContinueWatching
import com.testplaybyte.animeapp.ui.components.HeroCarousel
import java.util.Calendar

/**
 * HomeScreen — landing screen with hero carousel, continue-watching rail,
 * "Popular This Season" grid, and "Top Rated" grid. All three AniList
 * queries are launched in parallel on first composition.
 */
@Composable
fun HomeScreen(
    onOpenAnime: (Int) -> Unit,
) {
    val context = LocalContext.current
    val client = remember { AniListClient() }
    val historyRepo = remember { HistoryRepository(context) }
    val scrollState = rememberScrollState()

    var trending by remember { mutableStateOf<List<Anime>>(emptyList()) }
    var seasonal by remember { mutableStateOf<List<Anime>>(emptyList()) }
    var topRated by remember { mutableStateOf<List<Anime>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }

    val historyItems by historyRepo.items.collectAsStateWithLifecycle(initialValue = emptyList())

    // Compute current season/year from device clock
    val (season, year) = remember {
        val cal = Calendar.getInstance()
        val y = cal.get(Calendar.YEAR)
        val m = cal.get(Calendar.MONTH) // 0..11
        val s = when (m) {
            in 0..2 -> "WINTER"
            in 3..5 -> "SPRING"
            in 6..8 -> "SUMMER"
            in 9..11 -> "FALL"
            else -> "WINTER"
        }
        s to y
    }

    LaunchedEffect(Unit) {
        loading = true
        // Parallel fetch — coroutineScope { async { ... } ... } runs concurrently
        coroutineScope {
            val t = async { runCatching { client.fetchTrending() }.getOrDefault(emptyList()) }
            val s = async { runCatching { client.fetchSeasonal(season, year) }.getOrDefault(emptyList()) }
            val r = async { runCatching { client.fetchTopRated() }.getOrDefault(emptyList()) }
            trending = t.await()
            seasonal = s.await()
            topRated = r.await()
        }
        loading = false
    }

    // Collapsing header — title font size + top padding animate with scroll
    val collapseFraction by remember {
        derivedStateOf { (scrollState.value / 160f).coerceIn(0f, 1f) }
    }
    val headerFontSize by animateFloatAsState(
        targetValue = lerp(28f, 18f, collapseFraction),
        label = "headerFontSize",
    )
    val headerPadding by animateDpAsState(
        targetValue = lerp(20.dp, 8.dp, collapseFraction),
        label = "headerPadding",
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState),
    ) {
        // Collapsing header
        Text(
            text = "Anime",
            fontSize = headerFontSize.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground,
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 16.dp, top = headerPadding, bottom = 10.dp),
        )

        if (loading && trending.isEmpty() && seasonal.isEmpty() && topRated.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(240.dp),
                contentAlignment = Alignment.Center,
            ) {
                CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
            }
        }

        // 1. Hero carousel
        if (trending.isNotEmpty()) {
            HeroCarousel(items = trending, onClick = onOpenAnime)
        }

        Spacer(modifier = Modifier.height(16.dp))

        // 2. Continue watching (only shows if there's in-progress history)
        if (historyItems.any { it.progress > 0 }) {
            SectionHeader("Continue Watching")
            ContinueWatching(items = historyItems, onClick = onOpenAnime)
            Spacer(modifier = Modifier.height(16.dp))
        }

        // 3. Popular This Season
        if (seasonal.isNotEmpty()) {
            SectionHeader("Popular This Season")
            AnimeGridRow(items = seasonal, onOpenAnime = onOpenAnime)
            Spacer(modifier = Modifier.height(16.dp))
        }

        // 4. Top Rated
        if (topRated.isNotEmpty()) {
            SectionHeader("Top Rated")
            AnimeGridRow(items = topRated, onOpenAnime = onOpenAnime)
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
private fun SectionHeader(title: String) {
    Text(
        text = title,
        fontSize = 16.sp,
        fontWeight = FontWeight.Bold,
        color = MaterialTheme.colorScheme.onBackground,
        modifier = Modifier.padding(start = 16.dp, end = 16.dp, top = 4.dp, bottom = 10.dp),
    )
}

/**
 * AnimeGridRow — non-lazy 3-column grid laid out as a Column of Rows
 * (chunked by 3). Safe to embed inside a verticalScroll Column.
 */
@Composable
private fun AnimeGridRow(
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
                horizontalArrangement = Arrangement.spacedBy(4.dp),
            ) {
                rowItems.forEach { anime ->
                    Box(modifier = Modifier.weight(1f)) {
                        AnimeCard(anime = anime, onClick = onOpenAnime)
                    }
                }
                // Fill remaining slots so columns stay aligned
                repeat(3 - rowItems.size) {
                    Spacer(modifier = Modifier.weight(1f))
                }
            }
        }
    }
}

// Linear interpolation helpers
private fun lerp(start: Float, stop: Float, fraction: Float): Float = start + (stop - start) * fraction
private fun lerp(start: androidx.compose.ui.unit.Dp, stop: androidx.compose.ui.unit.Dp, fraction: Float): androidx.compose.ui.unit.Dp =
    (start.value + (stop.value - start.value) * fraction).dp
