@file:OptIn(ExperimentalMaterial3Api::class)

package com.testplaybyte.animeapp.ui.screens

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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.testplaybyte.animeapp.data.HistoryRepository
import com.testplaybyte.animeapp.data.LibraryRepository
import com.testplaybyte.animeapp.data.SettingsRepository
import com.testplaybyte.animeapp.model.*
import kotlinx.coroutines.launch

/**
 * SettingsScreen — appearance, display, library pointer, data management,
 * and an About section.
 */
@Composable
fun SettingsScreen() {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val settingsRepo = remember { SettingsRepository(context) }
    val libraryRepo = remember { LibraryRepository(context) }
    val historyRepo = remember { HistoryRepository(context) }
    val settings by settingsRepo.settings.collectAsStateWithLifecycle(initialValue = AppSettings())

    var confirmDialog by remember { mutableStateOf<ConfirmTarget?>(null) }
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(bottom = 32.dp),
    ) {
        // Collapsing-style header
        Text(
            text = "Settings",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground,
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 16.dp, top = 16.dp, bottom = 16.dp),
        )

        // Appearance
        SectionTitle("Appearance")
        SettingCard {
            Text("Theme", fontSize = 14.sp, fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onBackground)
            Spacer(Modifier.height(8.dp))
            SingleChoiceSegmentedRow(
                options = listOf("Dark" to true, "Light" to false),
                selected = settings.darkTheme,
                onSelect = { v -> scope.launch { settingsRepo.update { copy(darkTheme = v) } } },
            )
        }

        Spacer(Modifier.height(16.dp))

        // Display
        SectionTitle("Display")
        SettingCard {
            ToggleRow(
                label = "Single-line titles",
                checked = settings.singleLineTitles,
            ) { v -> scope.launch { settingsRepo.update { copy(singleLineTitles = v) } } }
            Divider(modifier = Modifier.padding(vertical = 8.dp))
            Text("Poster style", fontSize = 14.sp, fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onBackground)
            Spacer(Modifier.height(8.dp))
            SingleChoiceSegmentedRow(
                options = listOf(
                    "Rounded" to PosterStyle.ROUNDED,
                    "Soft" to PosterStyle.SOFT,
                    "Sharp" to PosterStyle.SHARP,
                ),
                selected = settings.posterStyle,
                onSelect = { v -> scope.launch { settingsRepo.update { copy(posterStyle = v) } } },
            )
            Spacer(Modifier.height(12.dp))
            Text("Card density", fontSize = 14.sp, fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onBackground)
            Spacer(Modifier.height(8.dp))
            SingleChoiceSegmentedRow(
                options = listOf(
                    "Compact" to CardDensity.COMPACT,
                    "Default" to CardDensity.DEFAULT,
                    "Comfortable" to CardDensity.COMFORTABLE,
                ),
                selected = settings.cardDensity,
                onSelect = { v -> scope.launch { settingsRepo.update { copy(cardDensity = v) } } },
            )
        }

        Spacer(Modifier.height(16.dp))

        // Library
        SectionTitle("Library")
        SettingCard {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text("Customize library", fontSize = 14.sp, fontWeight = FontWeight.Medium,
                        color = MaterialTheme.colorScheme.onBackground)
                    Text("Layout, columns, text placement, cover details",
                        fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                Text("Open Library →",
                    fontSize = 12.sp, fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.primary)
            }
            Text("Customize in Library page",
                fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 6.dp))
        }

        Spacer(Modifier.height(16.dp))

        // Data
        SectionTitle("Data")
        SettingCard {
            ActionRow(label = "Clear history", isDestructive = true) {
                confirmDialog = ConfirmTarget.HISTORY
            }
            Divider(modifier = Modifier.padding(vertical = 8.dp))
            ActionRow(label = "Clear library", isDestructive = true) {
                confirmDialog = ConfirmTarget.LIBRARY
            }
        }

        Spacer(Modifier.height(16.dp))

        // About
        SectionTitle("About")
        SettingCard {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text("App name", fontSize = 14.sp, color = MaterialTheme.colorScheme.onBackground)
                Text("Anime App", fontSize = 14.sp, fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Spacer(Modifier.height(8.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text("Version", fontSize = 14.sp, color = MaterialTheme.colorScheme.onBackground)
                Text("1.0.0", fontSize = 14.sp, fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }

    confirmDialog?.let { target ->
        AlertDialog(
            onDismissRequest = { confirmDialog = null },
            title = { Text(target.label) },
            text = { Text("This cannot be undone. Are you sure?") },
            confirmButton = {
                TextButton(
                    onClick = {
                        scope.launch {
                            when (target) {
                                ConfirmTarget.HISTORY -> historyRepo.clear()
                                ConfirmTarget.LIBRARY -> libraryRepo.clear()
                            }
                        }
                        confirmDialog = null
                    },
                    colors = ButtonDefaults.textButtonColors(contentColor = MaterialTheme.colorScheme.error),
                ) { Text("Clear") }
            },
            dismissButton = {
                TextButton(onClick = { confirmDialog = null }) { Text("Cancel") }
            },
        )
    }
}

private enum class ConfirmTarget(val label: String) {
    HISTORY("Clear history?"), LIBRARY("Clear library?")
}

@Composable
private fun SectionTitle(text: String) {
    Text(
        text = text,
        fontSize = 13.sp,
        fontWeight = FontWeight.SemiBold,
        color = MaterialTheme.colorScheme.primary,
        modifier = Modifier.padding(start = 20.dp, top = 4.dp, bottom = 6.dp),
    )
}

@Composable
private fun SettingCard(content: @Composable ColumnScope.() -> Unit) {
    Surface(
        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
    ) {
        Column(modifier = Modifier.padding(16.dp), content = content)
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

@Composable
private fun ActionRow(label: String, isDestructive: Boolean, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        Text(
            label,
            fontSize = 14.sp,
            color = if (isDestructive) MaterialTheme.colorScheme.error
            else MaterialTheme.colorScheme.onBackground,
        )
    }
}

@Composable
private fun <T> SingleChoiceSegmentedRow(
    options: List<Pair<String, T>>,
    selected: T,
    onSelect: (T) -> Unit,
) {
    // Use M3 SingleChoiceSegmentedButtonRow — the Pair's first element is the label.
    SingleChoiceSegmentedButtonRow(modifier = Modifier.fillMaxWidth()) {
        options.forEachIndexed { index, (label, value) ->
            SegmentedButton(
                selected = selected == value,
                onClick = { onSelect(value) },
                shape = SegmentedButtonDefaults.itemShape(index, options.size),
            ) {
                Text(label, fontSize = 12.sp, maxLines = 1)
            }
        }
    }
}
