@file:OptIn(ExperimentalLayoutApi::class)

package com.testplaybyte.animeapp.ui.screens

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.AsyncImage
import com.testplaybyte.animeapp.data.AniListClient
import com.testplaybyte.animeapp.data.HistoryRepository
import com.testplaybyte.animeapp.data.LibraryRepository
import com.testplaybyte.animeapp.model.Anime
import kotlinx.coroutines.launch

/**
 * DetailScreen — full anime detail page.
 * Fetches detail by id, records to history, shows banner + poster + meta +
 * genres + synopsis + episode list, and an "Add to Library" toggle button.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DetailScreen(
    animeId: Int,
    onBack: () -> Unit,
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val client = remember { AniListClient() }
    val libraryRepo = remember { LibraryRepository(context) }
    val historyRepo = remember { HistoryRepository(context) }
    val scrollState = rememberScrollState()

    val libraryItems by libraryRepo.items.collectAsStateWithLifecycle(initialValue = emptyList())
    val inLibrary = libraryItems.any { it.id == animeId }

    var anime by remember { mutableStateOf<Anime?>(null) }
    var loading by remember { mutableStateOf(true) }
    var synopsisExpanded by remember { mutableStateOf(false) }

    LaunchedEffect(animeId) {
        loading = true
        val detail = runCatching { client.fetchDetail(animeId) }.getOrNull()
        anime = detail
        loading = false
        // Record to history once we have the anime object.
        if (detail != null) {
            runCatching { historyRepo.add(detail) }
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        if (loading || anime == null) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center,
            ) {
                if (loading) {
                    CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
                } else {
                    Text(
                        "Failed to load.",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
            // Top bar back button still accessible during loading
            TopBackButton(onBack = onBack)
            return@Box
        }

        val a = anime!!
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState),
        ) {
            // Banner (full-width, 200dp tall) + poster overlapping below
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp),
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(MaterialTheme.colorScheme.surfaceVariant),
                ) {
                    AsyncImage(
                        model = a.bannerImage ?: a.coverUrl,
                        contentDescription = a.displayTitle,
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop,
                    )
                    // Darken gradient at top so back button is legible
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(
                                Brush.verticalGradient(
                                    colors = listOf(
                                        Color.Black.copy(alpha = 0.45f),
                                        Color.Transparent,
                                        Color.Black.copy(alpha = 0.4f),
                                    ),
                                ),
                            ),
                    )
                }
                // Back button floating over banner
                Surface(
                    color = Color.Black.copy(alpha = 0.45f),
                    shape = CircleShape,
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .padding(12.dp)
                        .size(38.dp)
                        .clickable { onBack() },
                ) {
                    Icon(
                        Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Back",
                        tint = Color.White,
                        modifier = Modifier
                            .padding(8.dp)
                            .size(22.dp),
                    )
                }
            }

            // Poster overlapping banner (left-aligned, 120x170)
            Box(
                modifier = Modifier
                    .padding(start = 16.dp, top = (-70).dp)
                    .size(width = 120.dp, height = 170.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(MaterialTheme.colorScheme.surfaceVariant),
            ) {
                AsyncImage(
                    model = a.coverUrl,
                    contentDescription = a.displayTitle,
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop,
                )
            }

            // Title + meta
            Text(
                text = a.displayTitle,
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground,
                modifier = Modifier.padding(start = 16.dp, end = 16.dp, top = 8.dp),
            )
            // Score + format + episodes + season year
            Row(
                modifier = Modifier.padding(start = 16.dp, end = 16.dp, top = 6.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                if (a.averageScore != null) {
                    Surface(
                        color = MaterialTheme.colorScheme.tertiaryContainer,
                        shape = RoundedCornerShape(6.dp),
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Icon(
                                Icons.Filled.Star,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.tertiary,
                                modifier = Modifier.size(14.dp),
                            )
                            Spacer(Modifier.width(2.dp))
                            Text(
                                a.scoreFormatted,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onTertiaryContainer,
                            )
                        }
                    }
                }
                val meta = buildList {
                    if (a.format != null) add(a.format)
                    if (a.episodes != null) add("${a.episodes} ep")
                    if (a.seasonYear != null) add(a.seasonYear.toString())
                }.joinToString(" · ")
                if (meta.isNotEmpty()) {
                    Text(
                        meta,
                        fontSize = 13.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }

            // Genres as chips
            if (a.genres.isNotEmpty()) {
                FlowRow(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(start = 16.dp, end = 16.dp, top = 10.dp),
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalArrangement = Arrangement.spacedBy(6.dp),
                ) {
                    a.genres.forEach { g ->
                        AssistChip(onClick = {}, label = { Text(g, fontSize = 11.sp) })
                    }
                }
            }

            // Synopsis (expandable)
            if (!a.description.isNullOrBlank()) {
                Text(
                    text = "Synopsis",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onBackground,
                    modifier = Modifier.padding(start = 16.dp, end = 16.dp, top = 14.dp, bottom = 4.dp),
                )
                val cleaned = a.description!!.replace(Regex("<[^>]*>"), "")
                Text(
                    text = cleaned,
                    fontSize = 13.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = if (synopsisExpanded) 50 else 3,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.padding(start = 16.dp, end = 16.dp),
                )
                Text(
                    text = if (synopsisExpanded) "Show less" else "Read more",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier
                        .padding(start = 16.dp, top = 2.dp)
                        .clickable { synopsisExpanded = !synopsisExpanded },
                )
            }

            // Episode list
            val epCount = a.episodes ?: 0
            if (epCount > 0) {
                Text(
                    text = "Episodes",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onBackground,
                    modifier = Modifier.padding(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 6.dp),
                )
                val showCount = minOf(epCount, 24)
                (1..showCount).forEach { i ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(RoundedCornerShape(6.dp))
                                .background(MaterialTheme.colorScheme.primaryContainer),
                            contentAlignment = Alignment.Center,
                        ) {
                            Text(
                                text = i.toString(),
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onPrimaryContainer,
                            )
                        }
                        Spacer(Modifier.width(12.dp))
                        Text(
                            text = "Episode $i",
                            fontSize = 14.sp,
                            color = MaterialTheme.colorScheme.onBackground,
                        )
                    }
                }
                if (epCount > showCount) {
                    Text(
                        text = "+ ${epCount - showCount} more episodes",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(start = 16.dp, top = 4.dp),
                    )
                }
            }

            Spacer(Modifier.height(80.dp)) // bottom button clearance
        }

        // Add to Library button (sticky bottom)
        Button(
            onClick = {
                scope.launch {
                    if (inLibrary) libraryRepo.remove(setOf(animeId))
                    else libraryRepo.add(a)
                }
            },
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .padding(16.dp)
                .height(50.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = if (inLibrary) MaterialTheme.colorScheme.surfaceVariant
                else MaterialTheme.colorScheme.primary,
                contentColor = if (inLibrary) MaterialTheme.colorScheme.onSurfaceVariant
                else MaterialTheme.colorScheme.onPrimary,
            ),
            shape = RoundedCornerShape(14.dp),
        ) {
            Icon(
                imageVector = if (inLibrary) Icons.Filled.Check else Icons.Filled.Add,
                contentDescription = null,
                modifier = Modifier.size(18.dp),
            )
            Spacer(Modifier.width(8.dp))
            Text(
                text = if (inLibrary) "In Library" else "Add to Library",
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
            )
        }
    }
}

@Composable
private fun TopBackButton(onBack: () -> Unit) {
    Box(modifier = Modifier.fillMaxSize()) {
        Surface(
            color = Color.Black.copy(alpha = 0.45f),
            shape = CircleShape,
            modifier = Modifier
                .align(Alignment.TopStart)
                .padding(12.dp)
                .size(38.dp)
                .clickable { onBack() },
        ) {
            Icon(
                Icons.AutoMirrored.Filled.ArrowBack,
                contentDescription = "Back",
                tint = Color.White,
                modifier = Modifier
                    .padding(8.dp)
                    .size(22.dp),
            )
        }
    }
}
