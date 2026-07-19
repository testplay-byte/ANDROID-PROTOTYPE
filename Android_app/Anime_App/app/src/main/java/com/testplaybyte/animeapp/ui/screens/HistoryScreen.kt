package com.testplaybyte.animeapp.ui.screens

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil.compose.AsyncImage
import com.testplaybyte.animeapp.data.HistoryRepository
import com.testplaybyte.animeapp.model.HistoryItem
import com.testplaybyte.animeapp.ui.components.ContinueWatching
import java.util.concurrent.TimeUnit

/**
 * HistoryScreen — ContinueWatching rail + a list of recently viewed items.
 * Each row shows cover, title, episode label, and a relative "time ago".
 */
@Composable
fun HistoryScreen(
    onOpenAnime: (Int) -> Unit,
) {
    val context = LocalContext.current
    val historyRepo = remember { HistoryRepository(context) }
    val scrollState = rememberScrollState()
    val items by historyRepo.items.collectAsStateWithLifecycle(initialValue = emptyList())

    // Collapsing header
    val collapseFraction by remember {
        derivedStateOf { (scrollState.value / 160f).coerceIn(0f, 1f) }
    }
    val headerFontSize by animateFloatAsState(
        targetValue = lerp(28f, 18f, collapseFraction),
        label = "headerFontSize",
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState),
    ) {
        Text(
            text = "History",
            fontSize = headerFontSize.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground,
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 16.dp, top = 16.dp, bottom = 10.dp),
        )

        if (items.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(240.dp),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    text = "No viewing history yet.",
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        } else {
            // Continue watching rail
            if (items.any { it.progress > 0 }) {
                Text(
                    "Continue Watching",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground,
                    modifier = Modifier.padding(start = 16.dp, top = 4.dp, bottom = 10.dp),
                )
                ContinueWatching(items = items, onClick = onOpenAnime)
                Spacer(Modifier.height(16.dp))
            }

            // Recently viewed
            Text(
                "Recently Viewed",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground,
                modifier = Modifier.padding(start = 16.dp, top = 4.dp, bottom = 6.dp),
            )
            items.forEach { item -> HistoryRow(item = item, onClick = { onOpenAnime(item.id) }) }
            Spacer(Modifier.height(24.dp))
        }
    }
}

@Composable
private fun HistoryRow(item: HistoryItem, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(horizontal = 16.dp, vertical = 8.dp),
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
        }
        Spacer(Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = item.title,
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onBackground,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            val totalLabel = item.totalEpisodes?.let { " / $it" } ?: ""
            Text(
                text = "EP ${item.episode}$totalLabel · ${timeAgo(item.viewedAt)}",
                fontSize = 12.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
    }
}

private fun timeAgo(timestamp: Long): String {
    val delta = System.currentTimeMillis() - timestamp
    val minutes = TimeUnit.MILLISECONDS.toMinutes(delta)
    return when {
        minutes < 1 -> "just now"
        minutes < 60 -> "${minutes}m ago"
        minutes < 60 * 24 -> "${minutes / 60}h ago"
        minutes < 60 * 24 * 7 -> "${minutes / (60 * 24)}d ago"
        else -> "${minutes / (60 * 24 * 7)}w ago"
    }
}

// Linear interpolation helper
private fun lerp(start: Float, stop: Float, fraction: Float): Float = start + (stop - start) * fraction
