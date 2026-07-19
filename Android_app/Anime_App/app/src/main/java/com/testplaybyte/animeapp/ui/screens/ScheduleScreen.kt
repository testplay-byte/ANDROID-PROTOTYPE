package com.testplaybyte.animeapp.ui.screens

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.testplaybyte.animeapp.data.AniListClient
import com.testplaybyte.animeapp.model.AiringSchedule
import java.text.SimpleDateFormat
import java.util.*

/**
 * ScheduleScreen — weekly airing schedule.
 * Fetches airing schedules from AniList for the next 7 days,
 * groups them by day, shows a horizontal day selector + a list.
 * Past entries are dimmed; the next-up airing is highlighted with a primary border.
 */
@Composable
fun ScheduleScreen(
    onOpenAnime: (Int) -> Unit,
) {
    val client = remember { AniListClient() }

    var schedule by remember { mutableStateOf<List<AiringSchedule>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var selectedDay by remember { mutableStateOf(0) } // 0..6 (index into weekDays)

    // Compute today midnight (local) and +7 days, in unix SECONDS (AniList uses seconds)
    val weekStart = remember {
        val cal = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, 0); set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0); set(Calendar.MILLISECOND, 0)
        }
        cal.timeInMillis / 1000
    }
    val weekEnd = remember { weekStart + 7 * 24 * 60 * 60 }

    // Build day labels for the selector
    val weekDays = remember {
        val today = Calendar.getInstance()
        val dayFmt = SimpleDateFormat("EEE", Locale.getDefault())
        (0 until 7).map { offset ->
            val cal = (today.clone() as Calendar).apply { add(Calendar.DAY_OF_YEAR, offset) }
            val label = when (offset) {
                0 -> "Today"
                1 -> "Tomorrow"
                else -> dayFmt.format(cal.time)
            }
            ScheduleDay(
                index = offset,
                label = label,
                startSec = (cal.apply {
                    set(Calendar.HOUR_OF_DAY, 0); set(Calendar.MINUTE, 0)
                    set(Calendar.SECOND, 0); set(Calendar.MILLISECOND, 0)
                }.timeInMillis / 1000),
                endSec = (cal.apply {
                    set(Calendar.HOUR_OF_DAY, 0); set(Calendar.MINUTE, 0)
                    set(Calendar.SECOND, 0); set(Calendar.MILLISECOND, 0)
                }.timeInMillis / 1000) + 24 * 60 * 60,
            )
        }
    }

    LaunchedEffect(Unit) {
        loading = true
        schedule = runCatching { client.fetchAiringSchedule(weekStart, weekEnd) }.getOrDefault(emptyList())
        loading = false
    }

    val daySchedule = schedule.filter { it.airingAt in weekDays[selectedDay].startSec until weekDays[selectedDay].endSec }
    val dayCounts = weekDays.map { d -> schedule.count { it.airingAt in d.startSec until d.endSec } }
    val nowSec = System.currentTimeMillis() / 1000
    // Next-up: the first airing whose time is still in the future
    val nextUpId = remember(schedule, nowSec) {
        schedule.firstOrNull { it.airingAt >= nowSec }?.id
    }

    Scaffold(
        topBar = {
            // Collapsing header — simple text, no scroll-coupling (LazyColumn below).
            Text(
                text = "Schedule",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(start = 16.dp, top = 16.dp, bottom = 10.dp),
            )
        },
    ) { padding ->
        Column(modifier = Modifier
            .fillMaxSize()
            .padding(padding)) {
            // Day selector
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                items(weekDays) { day ->
                    val isSelected = day.index == selectedDay
                    val count = dayCounts[day.index]
                    DayPill(
                        label = day.label,
                        count = count,
                        isSelected = isSelected,
                        onClick = { selectedDay = day.index },
                    )
                }
            }

            Spacer(Modifier.height(8.dp))

            if (loading && schedule.isEmpty()) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center,
                ) {
                    CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
                }
            } else if (daySchedule.isEmpty()) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        "No airing anime on this day.",
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(vertical = 4.dp),
                ) {
                    items(daySchedule, key = { it.id }) { sched ->
                        AiringRow(
                            sched = sched,
                            isPast = sched.airingAt < nowSec,
                            isNextUp = sched.id == nextUpId,
                            onClick = { onOpenAnime(sched.media.id) },
                        )
                    }
                }
            }
        }
    }
}

private data class ScheduleDay(
    val index: Int,
    val label: String,
    val startSec: Long,
    val endSec: Long,
)

@Composable
private fun DayPill(
    label: String,
    count: Int,
    isSelected: Boolean,
    onClick: () -> Unit,
) {
    Surface(
        color = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
        shape = RoundedCornerShape(50),
        modifier = Modifier.clickable { onClick() },
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            Text(
                text = label,
                fontSize = 13.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                color = if (isSelected) MaterialTheme.colorScheme.onPrimary
                else MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Surface(
                color = if (isSelected) MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.2f)
                else MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.4f),
                shape = RoundedCornerShape(50),
            ) {
                Text(
                    text = count.toString(),
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (isSelected) MaterialTheme.colorScheme.onPrimary
                    else MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(horizontal = 5.dp, vertical = 1.dp),
                )
            }
        }
    }
}

@Composable
private fun AiringRow(
    sched: AiringSchedule,
    isPast: Boolean,
    isNextUp: Boolean,
    onClick: () -> Unit,
) {
    val media = sched.media
    val airingMs = sched.airingAt * 1000L
    val timeFmt = remember { SimpleDateFormat("HH:mm", Locale.getDefault()) }
    val alpha = if (isPast) 0.45f else 1f

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 5.dp)
            .let {
                if (isNextUp) it.border(
                    width = 1.dp,
                    color = MaterialTheme.colorScheme.primary,
                    shape = RoundedCornerShape(10.dp),
                ) else it
            }
            .clip(RoundedCornerShape(10.dp))
            .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = if (isNextUp) 0.5f else 0f))
            .clickable { onClick() }
            .padding(8.dp),
    ) {
        Row(
            modifier = Modifier.alpha(alpha),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                modifier = Modifier
                    .size(width = 48.dp, height = 64.dp)
                    .clip(RoundedCornerShape(6.dp))
                    .background(MaterialTheme.colorScheme.outlineVariant),
            ) {
                AsyncImage(
                    model = media.coverUrl,
                    contentDescription = media.displayTitle,
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop,
                )
            }
            Spacer(Modifier.width(10.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = media.displayTitle,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onBackground,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
                val meta = buildList {
                    add("EP ${sched.episode}")
                    if (media.format != null) add(media.format)
                    if (media.averageScore != null) add("★ ${media.scoreFormatted}")
                }.joinToString(" · ")
                Text(
                    text = meta,
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
            Spacer(Modifier.width(10.dp))
            Column(horizontalAlignment = Alignment.End) {
                Text(
                    text = timeFmt.format(Date(airingMs)),
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground,
                )
                Text(
                    text = relativeTime(sched.airingAt),
                    fontSize = 11.sp,
                    color = MaterialTheme.colorScheme.primary,
                )
            }
        }
    }
}

private fun relativeTime(airingAtSec: Long): String {
    val now = System.currentTimeMillis() / 1000
    val diff = airingAtSec - now
    return when {
        diff < 0 -> {
            val h = (-diff) / 3600
            if (h > 0) "${h}h ago" else "${(-diff) / 60}m ago"
        }
        diff < 3600 -> "in ${diff / 60}m"
        else -> "in ${diff / 3600}h"
    }
}
