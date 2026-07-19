package com.testplaybyte.animeapp.ui.components

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.draw.*
import androidx.compose.ui.text.font.*
import androidx.compose.ui.unit.*
import androidx.compose.ui.text.style.*
import com.testplaybyte.animeapp.navigation.NavItem

/**
 * BottomNavBar — floating pill navigation.
 * Active item: content-sized expanding pill (full label visible).
 * Inactive items: icon-only, share remaining space evenly.
 * Matches the web prototype's M3 floating bottom nav.
 */
@Composable
fun BottomNavBar(
    items: List<NavItem>,
    currentRoute: String,
    onSelect: (String) -> Unit,
) {
    Box(
        modifier = Modifier
            .padding(horizontal = 16.dp, vertical = 16.dp)
            .fillMaxWidth(),
        contentAlignment = Alignment.BottomCenter,
    ) {
        Surface(
            color = MaterialTheme.colorScheme.surfaceVariant,
            shape = RoundedCornerShape(28.dp),
            shadowElevation = 8.dp,
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(58.dp)
                    .padding(horizontal = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                items.forEach { item ->
                    val isActive = item.route == currentRoute
                    NavPill(
                        item = item,
                        isActive = isActive,
                        onClick = { onSelect(item.route) },
                        // Active item: no weight = content-sized (wraps its label).
                        // Inactive items: weight(1f) = share remaining space evenly.
                        // NOTE: weight(0f) is invalid in Compose and crashes — must use
                        // no weight at all for content-sized items.
                        modifier = if (isActive) Modifier else Modifier.weight(1f),
                    )
                }
            }
        }
    }
}

@Composable
private fun NavPill(
    item: NavItem,
    isActive: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val bgColor by animateColorAsState(
        targetValue = if (isActive) MaterialTheme.colorScheme.primaryContainer else androidx.compose.ui.graphics.Color.Transparent,
        animationSpec = tween(300, easing = FastOutSlowInEasing),
        label = "bgColor",
    )
    val textColor by animateColorAsState(
        targetValue = if (isActive) MaterialTheme.colorScheme.onPrimaryContainer else MaterialTheme.colorScheme.onSurfaceVariant,
        animationSpec = tween(200),
        label = "textColor",
    )

    Surface(
        color = bgColor,
        shape = RoundedCornerShape(50),
        modifier = modifier
            .height(42.dp)
            .padding(horizontal = if (isActive) 0.dp else 0.dp)
            .clickable(onClick = onClick),
    ) {
        Row(
            modifier = Modifier.padding(horizontal = if (isActive) 14.dp else 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center,
        ) {
            Text(
                text = item.icon,
                fontSize = 18.sp,
                color = textColor,
            )
            AnimatedVisibility(
                visible = isActive,
                enter = expandHorizontally(animationSpec = tween(300)) + fadeIn(tween(200)),
                exit = fadeOut(tween(100)) + shrinkHorizontally(tween(200)),
            ) {
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = item.label,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = textColor,
                    maxLines = 1,
                )
            }
        }
    }
}
