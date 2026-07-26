package com.testplaybyte.setupwizard

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.togetherWith
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.BatteryFull
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Link
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material.icons.filled.WbSunny
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
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
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathMeasure
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.graphics.drawscope.scale
import androidx.compose.ui.graphics.drawscope.translate
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.testplaybyte.setupwizard.ui.components.FolderVisual
import com.testplaybyte.setupwizard.ui.components.PermissionsVisual
import com.testplaybyte.setupwizard.ui.components.RestoreVisual
import com.testplaybyte.setupwizard.ui.components.SummaryVisual
import com.testplaybyte.setupwizard.ui.components.ThemeVisual
import com.testplaybyte.setupwizard.ui.components.WelcomeVisual
import com.testplaybyte.setupwizard.ui.theme.AllPalettes
import com.testplaybyte.setupwizard.ui.theme.ErrorRed
import com.testplaybyte.setupwizard.ui.theme.LocalWizardPalette
import com.testplaybyte.setupwizard.ui.theme.PaletteNames
import com.testplaybyte.setupwizard.ui.theme.SecondaryLavender
import com.testplaybyte.setupwizard.ui.theme.SetupWizardTheme
import com.testplaybyte.setupwizard.ui.theme.TertiaryPink
import com.testplaybyte.setupwizard.ui.theme.TextLight
import com.testplaybyte.setupwizard.ui.theme.TextMutedLight
import com.testplaybyte.setupwizard.ui.theme.WarnAmber
import com.testplaybyte.setupwizard.ui.theme.WizardPalette
import kotlinx.coroutines.delay
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

/* =====================================================================================
 *  SetupWizardApp.kt — main app composable + 13 wizard screens.
 *
 *  Architecture:
 *    - WizardState data class holds all mutable state (step, theme, folder,
 *      permissions, linked anime list, etc.)
 *    - SetupWizardApp() owns the state via remember { mutableStateOf(...) }
 *      and exposes simple lambdas for navigation (next/back/skipToFinish/
 *      linkAnime/reset).
 *    - The active palette + dark mode are applied via SetupWizardTheme,
 *      which re-renders the entire tree when the user picks a new theme.
 *    - A thin LinearProgressIndicator at the top shows step / 13.
 *    - AnimatedContent swaps between screens with a horizontal slide + fade.
 *    - Each screen is a vertical-scroll Column (content) + fixed bottom
 *      action Row (Back / Next / etc.).
 *
 *  Screens (step 0..12):
 *    0  Welcome                 — WelcomeVisual + Get Started
 *    1  Theme                   — ThemeVisual + dark/light toggle + 4 palettes
 *    2  Folder                  — FolderVisual(selected) + scan + Continue
 *    3  Permissions             — PermissionsVisual + 3 toggles + Continue
 *    4  Restore                 — RestoreVisual + Select Backup File + Skip
 *    5  FormatNotSupported      — warning visual + Don't worry restore it
 *    6  ProcessingBackup        — processing visual (auto-advance ~2s)
 *    7  BackupSummary           — SummaryVisual + 4 stats + manga warning
 *    8  LinkingAnime            — stats + progressive list
 *    9  ManualLinking           — unlinked list + search overlay
 *    10 RestoreSummary          — 4 stats + info note
 *    11 RestoreSuccessful       — success visual (auto-advance ~5s)
 *    12 Finish                  — WelcomeVisual + API URL card + reset
 * ===================================================================================== */

// -------------------------------------------------------------------------------------
// State
// -------------------------------------------------------------------------------------

/** A single anime entry in the restore-linking flow. */
data class LinkedAnime(
    val id: Int,
    val backupName: String,
    val linked: Boolean,
    val matchedName: String? = null,
)

/** All mutable wizard state. Held in a single data class for easy copy/update. */
data class WizardState(
    val step: Int = 0,
    val isDark: Boolean = true,
    val paletteIndex: Int = 0,
    val folderSelected: Boolean = false,
    val backupSelected: Boolean = false,
    val permissions: Map<String, Boolean> = mapOf(
        "installApps" to false,
        "notifications" to false,
        "battery" to false,
    ),
    val linkedAnime: List<LinkedAnime> = DEFAULT_LINKED_ANIME,
)

/** Mock anime entries: 8 total, 5 linked + 3 unlinked. */
private val DEFAULT_LINKED_ANIME = listOf(
    LinkedAnime(1, "Frieren: Beyond Journey's End", true, "Sousou no Frieren"),
    LinkedAnime(2, "Jujutsu Kaisen Season 2", true, "Jujutsu Kaisen 2nd Season"),
    LinkedAnime(3, "Demon Slayer: Hashira Training", false),
    LinkedAnime(4, "Attack on Titan Final", true, "Shingeki no Kyojin: The Final Season"),
    LinkedAnime(5, "Spy x Family Code: White", false),
    LinkedAnime(6, "Chainsaw Man", true, "Chainsaw Man"),
    LinkedAnime(7, "One Piece Egghead Arc", false),
    LinkedAnime(8, "Solo Leveling", true, "Ore dake Level Up na Ken"),
)

/** Mock search results for the manual-linking search overlay. */
private val MOCK_SEARCH_RESULTS = listOf(
    "Demon Slayer: Hashira Training Arc",
    "Kimetsu no Yaiba: Hashira Geiko-hen",
    "Demon Slayer Season 4",
    "Demon Slayer: To the Swordsmith Village",
    "Kimetsu no Yaiba: Yuukaku-hen",
)

// =====================================================================================
// Main app composable
// =====================================================================================
@Composable
fun SetupWizardApp() {
    var state by remember { mutableStateOf(WizardState()) }

    // --- Navigation callbacks ---
    val onNext: () -> Unit = { state = state.copy(step = (state.step + 1).coerceAtMost(12)) }
    val onBack: () -> Unit = { state = state.copy(step = (state.step - 1).coerceAtLeast(0)) }
    val onSkipToFinish: () -> Unit = { state = state.copy(step = 12) }
    val onReset: () -> Unit = { state = WizardState() }
    val onDarkChange: (Boolean) -> Unit = { state = state.copy(isDark = it) }
    val onPaletteChange: (Int) -> Unit = { state = state.copy(paletteIndex = it) }
    val onFolderSelected: () -> Unit = { state = state.copy(folderSelected = true) }
    val onTogglePermission: (String) -> Unit = { key ->
        state = state.copy(
            permissions = state.permissions.toMutableMap().apply {
                this[key] = !(this[key] ?: false)
            },
        )
    }
    val onLinkAnime: (Int, String) -> Unit = { id, name ->
        state = state.copy(
            linkedAnime = state.linkedAnime.map {
                if (it.id == id) it.copy(linked = true, matchedName = name) else it
            },
        )
    }

    val palette = AllPalettes[state.paletteIndex]

    SetupWizardTheme(palette = palette, isDark = state.isDark) {
        Surface(modifier = Modifier.fillMaxSize(), color = palette.background) {
            Column(modifier = Modifier.fillMaxSize()) {
                // Top progress bar
                LinearProgressIndicator(
                    progress = { state.step / 12f },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(3.dp),
                    color = palette.primary,
                    trackColor = palette.surface3,
                )

                // Screen content
                AnimatedContent(
                    targetState = state.step,
                    modifier = Modifier.weight(1f),
                    transitionSpec = {
                        val direction = if (targetState > initialState) 1 else -1
                        (slideInHorizontally(tween(300)) { it * direction / 4 } + fadeIn(tween(300))) togetherWith
                            (slideOutHorizontally(tween(300)) { -it * direction / 4 } + fadeOut(tween(300)))
                    },
                    label = "wizard",
                ) { step ->
                    when (step) {
                        0 -> WelcomeScreen(state, onNext, palette)
                        1 -> ThemeScreen(state, onNext, onBack, palette, onDarkChange, onPaletteChange)
                        2 -> FolderScreen(state, onNext, onBack, palette, onFolderSelected)
                        3 -> PermissionsScreen(state, onNext, onBack, palette, onTogglePermission)
                        4 -> RestoreScreen(state, onNext, onBack, palette, onSkipToFinish)
                        5 -> FormatNotSupportedScreen(state, onNext, onBack, palette)
                        6 -> ProcessingBackupScreen(state, onNext, palette)
                        7 -> BackupSummaryScreen(state, onNext, onBack, palette)
                        8 -> LinkingAnimeScreen(state, onNext, onBack, palette)
                        9 -> ManualLinkingScreen(state, onNext, onBack, palette, onLinkAnime)
                        10 -> RestoreSummaryScreen(state, onNext, onBack, palette)
                        11 -> RestoreSuccessfulScreen(state, onNext, palette)
                        12 -> FinishScreen(state, onReset, palette)
                    }
                }
            }
        }
    }
}

// =====================================================================================
// Shared UI helpers
// =====================================================================================

@Composable
private fun PrimaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    icon: ImageVector? = Icons.Default.ArrowForward,
) {
    val palette = LocalWizardPalette.current
    Button(
        onClick = onClick,
        modifier = modifier.height(50.dp),
        enabled = enabled,
        shape = RoundedCornerShape(14.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = palette.primary,
            contentColor = palette.onPrimary,
            disabledContainerColor = palette.primary.copy(alpha = 0.4f),
            disabledContentColor = palette.onPrimary.copy(alpha = 0.6f),
        ),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(text, fontWeight = FontWeight.ExtraBold, fontSize = 15.sp)
            if (icon != null) {
                Icon(icon, null, Modifier.size(18.dp))
            }
        }
    }
}

@Composable
private fun SecondaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    icon: ImageVector? = Icons.Default.ArrowBack,
) {
    val palette = LocalWizardPalette.current
    OutlinedButton(
        onClick = onClick,
        modifier = modifier.height(50.dp),
        shape = RoundedCornerShape(14.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, palette.surface5),
        colors = ButtonDefaults.outlinedButtonColors(
            contentColor = TextLight,
        ),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            if (icon != null) {
                Icon(icon, null, Modifier.size(18.dp))
            }
            Text(text, fontWeight = FontWeight.ExtraBold, fontSize = 15.sp)
        }
    }
}

@Composable
private fun GhostButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    val palette = LocalWizardPalette.current
    Button(
        onClick = onClick,
        modifier = modifier.height(50.dp),
        enabled = enabled,
        shape = RoundedCornerShape(14.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = Color.Transparent,
            contentColor = TextLight,
        ),
    ) {
        Text(text, fontWeight = FontWeight.ExtraBold, fontSize = 15.sp)
    }
}

/** Pill with a spinner + text, used for "Scanning…" / "Processing" states. */
@Composable
private fun ScanningPill(text: String) {
    val palette = LocalWizardPalette.current
    Row(
        modifier = Modifier
            .clip(RoundedCornerShape(50))
            .background(palette.primary.copy(alpha = 0.15f))
            .padding(horizontal = 12.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        CircularProgressIndicator(
            modifier = Modifier.size(12.dp),
            strokeWidth = 1.5.dp,
            color = palette.primary,
        )
        Text(text, color = palette.primary, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
    }
}

/** Title text used at the top of every screen. */
@Composable
private fun WizardTitle(text: String, color: Color = TextLight) {
    Text(
        text = text,
        style = MaterialTheme.typography.displayMedium,
        fontWeight = FontWeight.ExtraBold,
        color = color,
        textAlign = TextAlign.Center,
    )
}

/** Subtitle text below the title. */
@Composable
private fun WizardSubtitle(text: String, color: Color = TextMutedLight) {
    Text(
        text = text,
        style = MaterialTheme.typography.bodyMedium,
        color = color,
        textAlign = TextAlign.Center,
    )
}

/** Stat card used by BackupSummary and RestoreSummary screens. */
@Composable
private fun StatCard(value: String, label: String, valueColor: Color) {
    val palette = LocalWizardPalette.current
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(86.dp),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = palette.surface2),
        border = androidx.compose.foundation.BorderStroke(1.dp, palette.surface4),
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
        ) {
            Text(value, color = valueColor, fontSize = 24.sp, fontWeight = FontWeight.ExtraBold)
            Text(label, color = TextMutedLight, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
        }
    }
}

/** Common screen layout: scrollable content above, fixed action row below. */
@Composable
private fun WizardScreenLayout(
    vararg actions: @Composable RowScope.() -> Unit,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(14.dp, Alignment.CenterVertically),
            content = content,
        )
        if (actions.isNotEmpty()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp, vertical = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                actions.forEach { it() }
            }
        }
    }
}

// =====================================================================================
// Screen 0 — Welcome
// =====================================================================================
@Composable
private fun WelcomeScreen(
    state: WizardState,
    onNext: () -> Unit,
    palette: WizardPalette,
) {
    WizardScreenLayout(
        { PrimaryButton("Get Started", onNext, Modifier.weight(1f)) },
    ) {
        WelcomeVisual()
        WizardTitle("Welcome to Anime App!")
        WizardSubtitle("Let's get you set up in just a few steps. Pick a theme, point us at your anime library, and start watching.")
    }
}

// =====================================================================================
// Screen 1 — Theme
// =====================================================================================
@Composable
private fun ThemeScreen(
    state: WizardState,
    onNext: () -> Unit,
    onBack: () -> Unit,
    palette: WizardPalette,
    onDarkChange: (Boolean) -> Unit,
    onPaletteChange: (Int) -> Unit,
) {
    WizardScreenLayout(
        { SecondaryButton("Back", onBack, Modifier.weight(1f)) },
        { PrimaryButton("Next", onNext, Modifier.weight(1f)) },
    ) {
        ThemeVisual()
        WizardTitle("Choose your theme")
        WizardSubtitle("Pick a mode and a color. You can change this anytime in settings.")

        // Dark/Light segmented toggle
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(50))
                .background(palette.surface2)
                .padding(4.dp),
        ) {
            ModeButton("Dark", Icons.Default.DarkMode, state.isDark, { onDarkChange(true) }, Modifier.weight(1f))
            ModeButton("Light", Icons.Default.WbSunny, !state.isDark, { onDarkChange(false) }, Modifier.weight(1f))
        }

        // 4 palette cards in a 2x2 grid
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                PaletteCard(0, state.paletteIndex, onPaletteChange, Modifier.weight(1f))
                PaletteCard(1, state.paletteIndex, onPaletteChange, Modifier.weight(1f))
            }
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                PaletteCard(2, state.paletteIndex, onPaletteChange, Modifier.weight(1f))
                PaletteCard(3, state.paletteIndex, onPaletteChange, Modifier.weight(1f))
            }
        }
    }
}

@Composable
private fun ModeButton(
    text: String,
    icon: ImageVector,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val palette = LocalWizardPalette.current
    Box(
        modifier = modifier
            .height(40.dp)
            .clip(RoundedCornerShape(50))
            .background(if (isSelected) palette.primary else Color.Transparent)
            .clickable { onClick() },
        contentAlignment = Alignment.Center,
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp),
        ) {
            Icon(icon, null, Modifier.size(14.dp), tint = if (isSelected) palette.onPrimary else TextLight)
            Text(text, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = if (isSelected) palette.onPrimary else TextLight)
        }
    }
}

@Composable
private fun PaletteCard(
    index: Int,
    selectedIndex: Int,
    onPaletteChange: (Int) -> Unit,
    modifier: Modifier = Modifier,
) {
    val palette = LocalWizardPalette.current
    val cardPalette = AllPalettes[index]
    val isSelected = index == selectedIndex
    Card(
        modifier = modifier
            .height(72.dp)
            .clip(RoundedCornerShape(14.dp))
            .clickable { onPaletteChange(index) },
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = palette.surface2),
        border = androidx.compose.foundation.BorderStroke(
            2.dp,
            if (isSelected) palette.primary else palette.surface4,
        ),
    ) {
        Row(
            modifier = Modifier.fillMaxSize().padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            // Color swatch
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(cardPalette.primary),
                contentAlignment = Alignment.Center,
            ) {
                if (isSelected) {
                    Icon(Icons.Default.Check, null, tint = cardPalette.onPrimary, modifier = Modifier.size(20.dp))
                }
            }
            Text(
                PaletteNames[index],
                color = TextLight,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
            )
        }
    }
}

// =====================================================================================
// Screen 2 — Folder (with scanning)
// =====================================================================================
@Composable
private fun FolderScreen(
    state: WizardState,
    onNext: () -> Unit,
    onBack: () -> Unit,
    palette: WizardPalette,
    onFolderSelected: () -> Unit,
) {
    var scanning by remember { mutableStateOf(false) }
    LaunchedEffect(scanning) {
        if (scanning) {
            delay(1500)
            scanning = false
        }
    }

    WizardScreenLayout(
        { SecondaryButton("Back", onBack, Modifier.weight(1f)) },
        {
            if (scanning) {
                GhostButton("Scanning…", {}, Modifier.weight(1f), enabled = false)
            } else {
                PrimaryButton("Continue", onNext, Modifier.weight(1f), enabled = state.folderSelected)
            }
        },
    ) {
        FolderVisual(selected = state.folderSelected && !scanning)
        WizardTitle(if (state.folderSelected) "Folder connected!" else "Select your anime folder")
        WizardSubtitle(
            if (state.folderSelected) {
                if (scanning) "Scanning your library…" else "Your library is ready to go. Continue when you are."
            } else {
                "Pick the folder where your anime library lives. We'll scan it and organize everything for you."
            },
        )

        if (!state.folderSelected) {
            // Compact "Select Folder" outlined button
            OutlinedButton(
                onClick = { onFolderSelected(); scanning = true },
                modifier = Modifier.height(46.dp),
                shape = RoundedCornerShape(14.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, palette.primary),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = palette.primary),
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Icon(Icons.Default.Folder, null, Modifier.size(18.dp))
                    Text("Select Folder", fontWeight = FontWeight.ExtraBold, fontSize = 14.sp)
                }
            }
        } else {
            // Selected card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = palette.surface2),
                border = androidx.compose.foundation.BorderStroke(1.dp, palette.primary),
            ) {
                Row(
                    modifier = Modifier.padding(12.dp).fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(palette.primaryContainer),
                        contentAlignment = Alignment.Center,
                    ) {
                        Icon(Icons.Default.Folder, null, tint = palette.onPrimaryContainer, modifier = Modifier.size(22.dp))
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            "/storage/anime-library",
                            color = TextLight,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                        )
                        Text(
                            if (scanning) "Scanning…" else "247 items · ready",
                            color = TextMutedLight,
                            fontSize = 12.sp,
                        )
                    }
                    if (scanning) {
                        ScanningPill("Scanning")
                    } else {
                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .clip(CircleShape)
                                .background(palette.primary.copy(alpha = 0.18f)),
                            contentAlignment = Alignment.Center,
                        ) {
                            Icon(Icons.Default.Check, null, tint = palette.primary, modifier = Modifier.size(20.dp))
                        }
                    }
                }
            }
        }
    }
}

// =====================================================================================
// Screen 3 — Permissions
// =====================================================================================
@Composable
private fun PermissionsScreen(
    state: WizardState,
    onNext: () -> Unit,
    onBack: () -> Unit,
    palette: WizardPalette,
    onTogglePermission: (String) -> Unit,
) {
    val permRows = listOf(
        PermRow("installApps", "Install apps", "Allow installing anime extensions", Icons.Default.Download),
        PermRow("notifications", "Notifications", "Get notified about new episodes", Icons.Default.Notifications),
        PermRow("battery", "Battery", "Allow background sync for updates", Icons.Default.BatteryFull),
    )

    WizardScreenLayout(
        { SecondaryButton("Back", onBack, Modifier.weight(1f)) },
        { PrimaryButton("Continue", onNext, Modifier.weight(1f)) },
    ) {
        PermissionsVisual()
        WizardTitle("Grant permissions")
        WizardSubtitle("(optional — you can skip these)")

        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            permRows.forEach { row ->
                val isOn = state.permissions[row.key] ?: false
                PermissionRow(row, isOn) { onTogglePermission(row.key) }
            }
        }
    }
}

private data class PermRow(
    val key: String,
    val title: String,
    val desc: String,
    val icon: ImageVector,
)

@Composable
private fun PermissionRow(row: PermRow, isOn: Boolean, onToggle: () -> Unit) {
    val palette = LocalWizardPalette.current
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = palette.surface2),
        border = androidx.compose.foundation.BorderStroke(1.dp, palette.surface4),
    ) {
        Row(
            modifier = Modifier.padding(12.dp).fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(if (isOn) palette.primary else palette.surface4),
                contentAlignment = Alignment.Center,
            ) {
                Icon(row.icon, null, tint = if (isOn) palette.onPrimary else TextLight, modifier = Modifier.size(20.dp))
            }
            Column(modifier = Modifier.weight(1f)) {
                Text(row.title, color = TextLight, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                Text(row.desc, color = TextMutedLight, fontSize = 12.sp)
            }
            Switch(
                checked = isOn,
                onCheckedChange = { onToggle() },
                colors = SwitchDefaults.colors(
                    checkedThumbColor = palette.onPrimary,
                    checkedTrackColor = palette.primary,
                    uncheckedThumbColor = TextLight,
                    uncheckedTrackColor = palette.surface5,
                ),
            )
        }
    }
}

// =====================================================================================
// Screen 4 — Restore (select backup file)
// =====================================================================================
@Composable
private fun RestoreScreen(
    state: WizardState,
    onNext: () -> Unit,
    onBack: () -> Unit,
    palette: WizardPalette,
    onSkip: () -> Unit,
) {
    WizardScreenLayout(
        { SecondaryButton("Back", onBack, Modifier.weight(1f)) },
        { GhostButton("Skip", onSkip, Modifier.weight(1f)) },
    ) {
        RestoreVisual()
        WizardTitle("Restore backup")
        WizardSubtitle("Got a backup from a previous install? Restore your library, history, and settings in one tap.")

        OutlinedButton(
            onClick = onNext,
            modifier = Modifier.height(46.dp),
            shape = RoundedCornerShape(14.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, palette.primary),
            colors = ButtonDefaults.outlinedButtonColors(contentColor = palette.primary),
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Icon(Icons.Default.Download, null, Modifier.size(18.dp))
                Text("Select Backup File", fontWeight = FontWeight.ExtraBold, fontSize = 14.sp)
            }
        }
    }
}

// =====================================================================================
// Screen 5 — Format not supported
// =====================================================================================
@Composable
private fun FormatNotSupportedScreen(
    state: WizardState,
    onNext: () -> Unit,
    onBack: () -> Unit,
    palette: WizardPalette,
) {
    WizardScreenLayout(
        { SecondaryButton("Back", onBack, Modifier.weight(1f)) },
        { PrimaryButton("Don't worry, restore it", onNext, Modifier.weight(1f)) },
    ) {
        WarningFileVisual()
        WizardTitle("Format not supported", color = WarnAmber)
        WizardSubtitle("We don't recognize this backup format. But don't worry — we can still try to restore from it!")

        // Info card with the file name
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(containerColor = palette.surface2),
            border = androidx.compose.foundation.BorderStroke(1.dp, palette.primary.copy(alpha = 0.27f)),
        ) {
            Row(
                modifier = Modifier.padding(12.dp).fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(palette.primary.copy(alpha = 0.15f)),
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(Icons.Default.Info, null, tint = palette.primary, modifier = Modifier.size(22.dp))
                }
                Column(modifier = Modifier.weight(1f)) {
                    Text("anime_backup_2025-01-15.json", color = TextLight, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    Text("2.3 MB · unknown format", color = TextMutedLight, fontSize = 12.sp)
                }
            }
        }
    }
}

// =====================================================================================
// Screen 6 — Processing backup (auto-advance ~2s)
// =====================================================================================
@Composable
private fun ProcessingBackupScreen(
    state: WizardState,
    onNext: () -> Unit,
    palette: WizardPalette,
) {
    LaunchedEffect(Unit) {
        delay(2000)
        onNext()
    }

    Column(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(14.dp, Alignment.CenterVertically),
        ) {
            ProcessingBackupVisual()
            WizardTitle("Processing backup")
            WizardSubtitle("Reading your backup file and extracting data…")
            ScanningPill("Processing")
        }
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 24.dp, vertical = 16.dp),
            horizontalArrangement = Arrangement.Center,
        ) {
            Text("Please wait…", color = TextMutedLight, fontWeight = FontWeight.ExtraBold)
        }
    }
}

// =====================================================================================
// Screen 7 — Backup summary
// =====================================================================================
@Composable
private fun BackupSummaryScreen(
    state: WizardState,
    onNext: () -> Unit,
    onBack: () -> Unit,
    palette: WizardPalette,
) {
    val stats = listOf(
        "247" to "Anime detected",
        "12" to "Categories",
        "1,432" to "Episodes tracked",
        "89" to "Completed",
    )

    WizardScreenLayout(
        { SecondaryButton("Cancel", onBack, Modifier.weight(1f), icon = null) },
        { PrimaryButton("Restore", onNext, Modifier.weight(1f)) },
    ) {
        SummaryVisual()
        WizardTitle("Backup summary")
        WizardSubtitle("Here's what we found in your backup")

        // 4 stat cards in 2x2 grid
        Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                StatCard(stats[0].first, stats[0].second, palette.primary)
                StatCard(stats[1].first, stats[1].second, palette.primary)
            }
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                StatCard(stats[2].first, stats[2].second, palette.primary)
                StatCard(stats[3].first, stats[3].second, palette.primary)
            }
        }

        // Manga warning (red)
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(containerColor = ErrorRed.copy(alpha = 0.12f)),
            border = androidx.compose.foundation.BorderStroke(1.dp, ErrorRed.copy(alpha = 0.4f)),
        ) {
            Row(
                modifier = Modifier.padding(12.dp).fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp),
            ) {
                Icon(Icons.Default.Warning, null, tint = ErrorRed, modifier = Modifier.size(20.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text("Manga entries detected", color = ErrorRed, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    Text(
                        "Manga is not supported — these entries will be skipped.",
                        color = TextMutedLight,
                        fontSize = 11.sp,
                    )
                }
            }
        }
    }
}

// =====================================================================================
// Screen 8 — Linking anime (progressive reveal)
// =====================================================================================
@Composable
private fun LinkingAnimeScreen(
    state: WizardState,
    onNext: () -> Unit,
    onBack: () -> Unit,
    palette: WizardPalette,
) {
    var revealedCount by remember { mutableStateOf(0) }
    LaunchedEffect(Unit) {
        for (i in 1..state.linkedAnime.size) {
            delay(400)
            revealedCount = i
        }
    }

    val linkedCount = state.linkedAnime.count { it.linked }
    val unlinkedCount = state.linkedAnime.count { !it.linked }
    val allRevealed = revealedCount >= state.linkedAnime.size

    WizardScreenLayout(
        { SecondaryButton("Back", onBack, Modifier.weight(1f)) },
        { PrimaryButton("Next", onNext, Modifier.weight(1f), enabled = allRevealed) },
    ) {
        WizardTitle("Linking anime")
        WizardSubtitle("Matching your backup entries to AniList…")

        // 3 stat boxes
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            LinkStatBox(linkedCount.toString(), "Linked", palette.primary, Modifier.weight(1f))
            LinkStatBox(unlinkedCount.toString(), "No match", ErrorRed, Modifier.weight(1f))
            LinkStatBox(state.linkedAnime.size.toString(), "Total", TextLight, Modifier.weight(1f))
        }

        // Progressive list
        Column(
            modifier = Modifier.fillMaxWidth().heightIn(max = 220.dp).verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            state.linkedAnime.take(revealedCount).forEach { anime ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp),
                    colors = CardDefaults.cardColors(containerColor = palette.surface2),
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp).fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        Text(
                            anime.backupName,
                            modifier = Modifier.weight(1f),
                            color = TextLight,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                        )
                        if (anime.linked) {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                Icon(Icons.Default.Check, null, tint = palette.primary, modifier = Modifier.size(12.dp))
                                Text(
                                    anime.matchedName ?: "",
                                    color = palette.primary,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis,
                                )
                            }
                        } else {
                            Text("No match", color = ErrorRed, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                        }
                    }
                }
            }
            if (!allRevealed) {
                Box(
                    modifier = Modifier.fillMaxWidth().padding(8.dp),
                    contentAlignment = Alignment.Center,
                ) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(16.dp),
                        strokeWidth = 2.dp,
                        color = palette.primary,
                    )
                }
            }
        }
    }
}

@Composable
private fun LinkStatBox(value: String, label: String, valueColor: Color, modifier: Modifier = Modifier) {
    val palette = LocalWizardPalette.current
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = palette.surface2),
        border = androidx.compose.foundation.BorderStroke(1.dp, palette.surface4),
    ) {
        Column(
            modifier = Modifier.fillMaxWidth().padding(vertical = 10.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Text(value, color = valueColor, fontSize = 20.sp, fontWeight = FontWeight.ExtraBold)
            Text(label, color = TextMutedLight, fontSize = 10.sp, fontWeight = FontWeight.SemiBold)
        }
    }
}

// =====================================================================================
// Screen 9 — Manual linking (with search overlay)
// =====================================================================================
@Composable
private fun ManualLinkingScreen(
    state: WizardState,
    onNext: () -> Unit,
    onBack: () -> Unit,
    palette: WizardPalette,
    onLink: (Int, String) -> Unit,
) {
    var searchOpen by remember { mutableStateOf(false) }
    var searchQuery by remember { mutableStateOf("") }
    var selectedAnimeId by remember { mutableStateOf<Int?>(null) }

    val unlinked = state.linkedAnime.filter { !it.linked }
    val selectedAnime = state.linkedAnime.find { it.id == selectedAnimeId }

    Box(modifier = Modifier.fillMaxSize()) {
        WizardScreenLayout(
            { SecondaryButton("Back", onBack, Modifier.weight(1f)) },
            { PrimaryButton("Continue", onNext, Modifier.weight(1f)) },
        ) {
            WizardTitle("Manual linking")
            WizardSubtitle(
                if (unlinked.isEmpty()) "All anime are linked! You're ready to continue."
                else "${unlinked.size} anime need your help. Tap any entry to search for a match.",
            )

            if (unlinked.isEmpty()) {
                // All linked card
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = palette.surface2),
                    border = androidx.compose.foundation.BorderStroke(1.dp, palette.primary.copy(alpha = 0.2f)),
                ) {
                    Column(
                        modifier = Modifier.fillMaxWidth().padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        Icon(Icons.Default.Check, null, tint = palette.primary, modifier = Modifier.size(40.dp))
                        Text("All linked!", color = palette.primary, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    }
                }
            } else {
                Column(
                    modifier = Modifier.fillMaxWidth().heightIn(max = 280.dp).verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(6.dp),
                ) {
                    unlinked.forEach { anime ->
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(10.dp))
                                .clickable {
                                    selectedAnimeId = anime.id
                                    searchQuery = anime.backupName
                                    searchOpen = true
                                },
                            shape = RoundedCornerShape(10.dp),
                            colors = CardDefaults.cardColors(containerColor = palette.surface2),
                            border = androidx.compose.foundation.BorderStroke(1.dp, palette.surface4),
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp).fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                            ) {
                                Text(
                                    anime.backupName,
                                    modifier = Modifier.weight(1f),
                                    color = TextLight,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis,
                                )
                                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(3.dp)) {
                                    Text("Search", color = TextMutedLight, fontSize = 10.sp, fontWeight = FontWeight.SemiBold)
                                    Icon(Icons.Default.ArrowForward, null, tint = TextMutedLight, modifier = Modifier.size(12.dp))
                                }
                            }
                        }
                    }
                }
            }
        }

        // Search overlay (covers the entire screen when open)
        if (searchOpen) {
            Surface(modifier = Modifier.fillMaxSize(), color = palette.background) {
                Column(modifier = Modifier.fillMaxSize()) {
                    // Header
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(palette.surface2)
                                .clickable {
                                    searchOpen = false
                                    selectedAnimeId = null
                                },
                            contentAlignment = Alignment.Center,
                        ) {
                            Icon(Icons.Default.ArrowBack, null, tint = TextLight, modifier = Modifier.size(18.dp))
                        }
                        OutlinedTextField(
                            value = searchQuery,
                            onValueChange = { searchQuery = it },
                            modifier = Modifier.weight(1f),
                            placeholder = { Text("Search for anime…", color = TextMutedLight, fontSize = 13.sp) },
                            leadingIcon = { Icon(Icons.Default.Search, null, tint = TextMutedLight, modifier = Modifier.size(16.dp)) },
                            singleLine = true,
                            shape = RoundedCornerShape(50),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedTextColor = TextLight,
                                unfocusedTextColor = TextLight,
                                focusedBorderColor = palette.surface5,
                                unfocusedBorderColor = palette.surface4,
                                cursorColor = palette.primary,
                            ),
                        )
                    }
                    // Search info
                    Text(
                        "Linking: ${selectedAnime?.backupName ?: ""}",
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp),
                        color = TextMutedLight,
                        fontSize = 11.sp,
                    )
                    // Results list
                    val filtered = MOCK_SEARCH_RESULTS.filter { it.contains(searchQuery, ignoreCase = true) }
                    if (filtered.isEmpty()) {
                        Box(
                            modifier = Modifier.fillMaxSize().padding(24.dp),
                            contentAlignment = Alignment.Center,
                        ) {
                            Text(
                                "No results found. Try a different search.",
                                color = TextMutedLight,
                                fontSize = 12.sp,
                                textAlign = TextAlign.Center,
                            )
                        }
                    } else {
                        Column(
                            modifier = Modifier.fillMaxWidth().padding(12.dp).verticalScroll(rememberScrollState()),
                            verticalArrangement = Arrangement.spacedBy(6.dp),
                        ) {
                            filtered.forEach { result ->
                                Card(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(10.dp))
                                        .clickable {
                                            val id = selectedAnimeId
                                            if (id != null) {
                                                onLink(id, result)
                                            }
                                            searchOpen = false
                                            selectedAnimeId = null
                                            searchQuery = ""
                                        },
                                    shape = RoundedCornerShape(10.dp),
                                    colors = CardDefaults.cardColors(containerColor = palette.surface2),
                                    border = androidx.compose.foundation.BorderStroke(1.dp, palette.surface4),
                                ) {
                                    Row(
                                        modifier = Modifier.padding(10.dp).fillMaxWidth(),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(32.dp, 44.dp)
                                                .clip(RoundedCornerShape(4.dp))
                                                .background(palette.primary.copy(alpha = 0.2f)),
                                        )
                                        Text(
                                            result,
                                            modifier = Modifier.weight(1f),
                                            color = TextLight,
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.SemiBold,
                                        )
                                        Icon(Icons.Default.Add, null, tint = palette.primary, modifier = Modifier.size(16.dp))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// =====================================================================================
// Screen 10 — Restore summary
// =====================================================================================
@Composable
private fun RestoreSummaryScreen(
    state: WizardState,
    onNext: () -> Unit,
    onBack: () -> Unit,
    palette: WizardPalette,
) {
    val linkedCount = state.linkedAnime.count { it.linked }
    val unlinkedCount = state.linkedAnime.count { !it.linked }
    val stats = listOf(
        "247" to "Anime to restore",
        linkedCount.toString() to "Auto-linked",
        unlinkedCount.toString() to "Manually linked",
        "1,432" to "Episodes",
    )

    WizardScreenLayout(
        { SecondaryButton("Back", onBack, Modifier.weight(1f)) },
        { PrimaryButton("Restore Now", onNext, Modifier.weight(1f)) },
    ) {
        WizardTitle("Restore summary")
        WizardSubtitle("Ready to restore. Review the details below.")

        Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                StatCard(stats[0].first, stats[0].second, palette.primary)
                StatCard(stats[1].first, stats[1].second, palette.primary)
            }
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                StatCard(stats[2].first, stats[2].second, palette.primary)
                StatCard(stats[3].first, stats[3].second, palette.primary)
            }
        }

        // Info note
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(containerColor = palette.primary.copy(alpha = 0.07f)),
            border = androidx.compose.foundation.BorderStroke(1.dp, palette.primary.copy(alpha = 0.2f)),
        ) {
            Row(
                modifier = Modifier.padding(12.dp).fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp),
            ) {
                Icon(Icons.Default.Info, null, tint = palette.primary, modifier = Modifier.size(20.dp))
                Text(
                    "This will overwrite any existing library data. The restore process may take a few moments.",
                    color = TextMutedLight,
                    fontSize = 12.sp,
                )
            }
        }
    }
}

// =====================================================================================
// Screen 11 — Restore successful (auto-advance ~5s)
// =====================================================================================
@Composable
private fun RestoreSuccessfulScreen(
    state: WizardState,
    onNext: () -> Unit,
    palette: WizardPalette,
) {
    LaunchedEffect(Unit) {
        delay(5000)
        onNext()
    }

    Column(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(14.dp, Alignment.CenterVertically),
        ) {
            RestoreSuccessVisual()
            Text(
                "Restore successful!",
                style = MaterialTheme.typography.displayMedium,
                fontWeight = FontWeight.ExtraBold,
                color = palette.primary,
                textAlign = TextAlign.Center,
            )
            val restoredCount = state.linkedAnime.count { it.linked } + 247
            Text(
                buildAnnotatedString {
                    withStyle(SpanStyle(color = palette.primary, fontWeight = FontWeight.Bold)) {
                        append(restoredCount.toString())
                    }
                    withStyle(SpanStyle(color = TextMutedLight)) {
                        append(" anime have been restored to your library. You're all set to go!")
                    }
                },
                fontSize = 14.sp,
                textAlign = TextAlign.Center,
            )
        }
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 24.dp, vertical = 16.dp),
        ) {
            PrimaryButton("Continue", onNext, Modifier.fillMaxWidth())
        }
    }
}

// =====================================================================================
// Screen 12 — Finish (URL set + restart)
// =====================================================================================
@Composable
private fun FinishScreen(
    state: WizardState,
    onRestart: () -> Unit,
    palette: WizardPalette,
) {
    WizardScreenLayout(
        { PrimaryButton("Start Exploring", onRestart, Modifier.fillMaxWidth(), icon = Icons.Default.Refresh) },
    ) {
        // "Setup complete" badge
        Row(
            modifier = Modifier
                .clip(RoundedCornerShape(50))
                .background(palette.primary.copy(alpha = 0.15f))
                .padding(horizontal = 12.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            Icon(Icons.Default.Star, null, tint = palette.primary, modifier = Modifier.size(14.dp))
            Text("Setup complete", color = palette.primary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
        }

        WelcomeVisual()

        Text(
            "You're all set!",
            style = MaterialTheme.typography.displayMedium,
            fontWeight = FontWeight.ExtraBold,
            color = palette.primary,
            textAlign = TextAlign.Center,
        )

        WizardSubtitle("Your anime journey begins now. Enjoy exploring thousands of titles, tracking your progress, and never missing a new episode.")

        // API URL card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(containerColor = palette.surface2),
            border = androidx.compose.foundation.BorderStroke(1.dp, palette.primary.copy(alpha = 0.2f)),
        ) {
            Row(
                modifier = Modifier.padding(12.dp).fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp),
            ) {
                Icon(Icons.Default.Link, null, tint = palette.primary, modifier = Modifier.size(20.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text("API URL", color = TextMutedLight, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                    Text("https://api.anilist.co", color = TextLight, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                }
                Icon(Icons.Default.Check, null, tint = palette.primary, modifier = Modifier.size(16.dp))
            }
        }
    }
}

// =====================================================================================
// Inline visuals (used by screens 5, 6, 11)
// =====================================================================================

/** File + caution badge visual for the Format-Not-Supported screen. */
@Composable
private fun WarningFileVisual() {
    val palette = LocalWizardPalette.current
    val infinite = rememberInfiniteTransition(label = "warn")
    val bobPhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(3000, easing = LinearEasing)), "bob",
    )
    val warnPhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(1500, easing = LinearEasing)), "warn",
    )
    val sparkPhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2000, easing = LinearEasing)), "spark",
    )

    Canvas(modifier = Modifier.size(200.dp)) {
        val s = size.minDimension / 200f
        scale(s, s, pivot = Offset.Zero) {
            // Glow
            drawCircle(
                brush = androidx.compose.ui.graphics.Brush.radialGradient(
                    colors = listOf(WarnAmber.copy(alpha = 0.18f), WarnAmber.copy(alpha = 0f)),
                    center = Offset(100f, 100f),
                    radius = 60f,
                ),
                center = Offset(100f, 100f),
                radius = 60f,
            )

            // File body (bobbing)
            val f = sin(bobPhase * PI.toFloat()).coerceIn(-1f, 1f)
            translate(0f, -6f * f) {
                val file = Path().apply {
                    moveTo(64f, 50f)
                    lineTo(64f, 150f)
                    quadraticBezierTo(64f, 156f, 70f, 156f)
                    lineTo(130f, 156f)
                    quadraticBezierTo(136f, 156f, 136f, 150f)
                    lineTo(136f, 72f)
                    lineTo(114f, 50f)
                    close()
                }
                drawPath(file, color = palette.surface3)
                drawPath(file, color = WarnAmber, style = Stroke(width = 2f, join = StrokeJoin.Round))
                // File content lines
                drawRoundRect(WarnAmber.copy(alpha = 0.5f), Offset(76f, 86f), Size(48f, 4f), CornerRadius(2f, 2f))
                drawRoundRect(WarnAmber.copy(alpha = 0.35f), Offset(76f, 98f), Size(40f, 4f), CornerRadius(2f, 2f))
                drawRoundRect(WarnAmber.copy(alpha = 0.35f), Offset(76f, 110f), Size(44f, 4f), CornerRadius(2f, 2f))
                drawRoundRect(WarnAmber.copy(alpha = 0.3f), Offset(76f, 122f), Size(36f, 4f), CornerRadius(2f, 2f))
            }

            // Warning triangle badge (pulsing)
            val wf = 0.5f + 0.5f * sin(warnPhase * 2f * PI.toFloat())
            val ws = 0.95f + 0.1f * wf
            scale(ws, ws, pivot = Offset(140f, 140f)) {
                drawCircle(WarnAmber, 22f, Offset(140f, 140f))
                drawCircle(palette.background, 22f, Offset(140f, 140f), style = Stroke(width = 2f))
                // Exclamation
                drawLine(palette.background, Offset(140f, 128f), Offset(140f, 142f), strokeWidth = 3.5f, cap = StrokeCap.Round)
                drawCircle(palette.background, 2f, Offset(140f, 150f))
            }

            // Sparkles
            val sparks = listOf(
                Sparkle(40f, 60f, 3f, WarnAmber),
                Sparkle(160f, 50f, 2.5f, TertiaryPink),
                Sparkle(36f, 150f, 2f, palette.primary),
            )
            sparks.forEachIndexed { i, sp ->
                val pf = 0.5f + 0.5f * sin((sparkPhase + i * 0.33f) * 2f * PI.toFloat())
                drawCircle(sp.color.copy(alpha = pf), sp.r, Offset(sp.x, sp.y))
            }
        }
    }
}

private data class Sparkle(val x: Float, val y: Float, val r: Float, val color: Color)

/** Circular spinner + central file icon for the Processing-Backup screen. */
@Composable
private fun ProcessingBackupVisual() {
    val palette = LocalWizardPalette.current
    val infinite = rememberInfiniteTransition(label = "proc")
    val ring1 by infinite.animateFloat(
        0f, 360f, infiniteRepeatable(tween(2000, easing = LinearEasing)), "r1",
    )
    val ring2 by infinite.animateFloat(
        360f, 0f, infiniteRepeatable(tween(3000, easing = LinearEasing)), "r2",
    )
    val corePhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(1200, easing = LinearEasing)), "core",
    )
    val glowPhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(1500, easing = LinearEasing)), "glow",
    )

    Canvas(modifier = Modifier.size(200.dp)) {
        val s = size.minDimension / 200f
        scale(s, s, pivot = Offset.Zero) {
            // Glow
            val ga = 0.2f + 0.3f * (0.5f + 0.5f * sin(glowPhase * 2f * PI.toFloat()))
            drawCircle(
                brush = androidx.compose.ui.graphics.Brush.radialGradient(
                    colors = listOf(palette.primary.copy(alpha = ga), palette.primary.copy(alpha = 0f)),
                    center = Offset(100f, 100f),
                    radius = 60f,
                ),
                center = Offset(100f, 100f),
                radius = 60f,
            )

            // Outer ring (rotating dashes + dots)
            rotate(ring1, pivot = Offset(100f, 100f)) {
                drawCircle(
                    color = palette.primary.copy(alpha = 0.4f),
                    radius = 64f, center = Offset(100f, 100f),
                    style = Stroke(width = 2f, pathEffect = androidx.compose.ui.graphics.PathEffect.dashPathEffect(floatArrayOf(6f, 10f))),
                )
                drawCircle(palette.primary, 5f, Offset(100f, 36f))
                drawCircle(TertiaryPink, 4f, Offset(164f, 100f))
                drawCircle(WarnAmber, 4f, Offset(100f, 164f))
                drawCircle(SecondaryLavender, 4f, Offset(36f, 100f))
            }
            // Inner ring (reverse)
            rotate(ring2, pivot = Offset(100f, 100f)) {
                drawCircle(
                    color = TertiaryPink.copy(alpha = 0.3f),
                    radius = 48f, center = Offset(100f, 100f),
                    style = Stroke(width = 1.5f, pathEffect = androidx.compose.ui.graphics.PathEffect.dashPathEffect(floatArrayOf(3f, 6f))),
                )
            }
            // Central file icon (pulsing)
            val cs = 1f + 0.08f * (0.5f + 0.5f * sin(corePhase * 2f * PI.toFloat()))
            scale(cs, cs, pivot = Offset(100f, 100f)) {
                drawCircle(palette.primaryContainer, 34f, Offset(100f, 100f))
                drawCircle(palette.primary, 34f, Offset(100f, 100f), style = Stroke(width = 2f))
                // File icon path
                val file = Path().apply {
                    moveTo(88f, 84f)
                    lineTo(88f, 116f)
                    quadraticBezierTo(88f, 119f, 91f, 119f)
                    lineTo(109f, 119f)
                    quadraticBezierTo(112f, 119f, 112f, 116f)
                    lineTo(112f, 90f)
                    lineTo(106f, 84f)
                    close()
                }
                drawPath(file, color = palette.primary.copy(alpha = 0.9f))
                drawRoundRect(palette.onPrimary.copy(alpha = 0.5f), Offset(93f, 96f), Size(14f, 2f), CornerRadius(1f, 1f))
                drawRoundRect(palette.onPrimary.copy(alpha = 0.4f), Offset(93f, 102f), Size(10f, 2f), CornerRadius(1f, 1f))
                drawRoundRect(palette.onPrimary.copy(alpha = 0.4f), Offset(93f, 108f), Size(12f, 2f), CornerRadius(1f, 1f))
            }
        }
    }
}

/** Success badge + expanding rings for the Restore-Successful screen. */
@Composable
private fun RestoreSuccessVisual() {
    val palette = LocalWizardPalette.current
    val infinite = rememberInfiniteTransition(label = "success")
    val glowPhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2000, easing = LinearEasing)), "glow",
    )
    val ringPhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2500, easing = LinearEasing)), "ring",
    )
    val corePhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2000, easing = LinearEasing)), "core",
    )
    val checkPhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2000, easing = LinearEasing)), "check",
    )
    val sparkPhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2000, easing = LinearEasing)), "spark",
    )

    val checkPath = remember {
        Path().apply {
            moveTo(82f, 100f)
            lineTo(94f, 113f)
            lineTo(120f, 87f)
        }
    }
    val checkMeasure = remember(checkPath) {
        PathMeasure().apply { setPath(checkPath, false) }
    }

    Canvas(modifier = Modifier.size(200.dp)) {
        val s = size.minDimension / 200f
        scale(s, s, pivot = Offset.Zero) {
            // Glow
            val ga = 0.25f + 0.25f * (0.5f + 0.5f * sin(glowPhase * 2f * PI.toFloat()))
            drawCircle(
                brush = androidx.compose.ui.graphics.Brush.radialGradient(
                    colors = listOf(palette.primary.copy(alpha = ga), palette.primary.copy(alpha = 0f)),
                    center = Offset(100f, 100f),
                    radius = 60f,
                ),
                center = Offset(100f, 100f),
                radius = 60f,
            )

            // 3 expanding rings
            val ringColors = listOf(palette.primary, TertiaryPink, WarnAmber)
            ringColors.forEachIndexed { i, c ->
                val ph = (ringPhase + i * 0.24f) % 1f
                val scaleR = 0.2f + 1.8f * ph
                val alpha = (1f - ph).coerceAtLeast(0f)
                drawCircle(
                    color = c.copy(alpha = alpha),
                    radius = 36f * scaleR,
                    center = Offset(100f, 100f),
                    style = Stroke(width = 3f - i * 0.5f),
                )
            }

            // Central badge (pulsing)
            val cs = 1f + 0.06f * (0.5f + 0.5f * sin(corePhase * 2f * PI.toFloat()))
            scale(cs, cs, pivot = Offset(100f, 100f)) {
                drawCircle(palette.primary, 38f, Offset(100f, 100f))
                drawCircle(palette.background, 38f, Offset(100f, 100f), style = Stroke(width = 2f))

                // Animated checkmark draw
                val progress = when {
                    checkPhase < 0.15f -> 0f
                    checkPhase < 0.50f -> (checkPhase - 0.15f) / 0.35f
                    checkPhase < 0.85f -> 1f
                    else -> 1f - (checkPhase - 0.85f) / 0.15f
                }
                if (progress > 0f) {
                    val totalLen = checkMeasure.length
                    val subPath = Path()
                    checkMeasure.getSegment(0f, totalLen * progress, subPath, true)
                    drawPath(
                        subPath, color = palette.onPrimary,
                        style = Stroke(width = 6f, cap = StrokeCap.Round, join = StrokeJoin.Round),
                    )
                }
            }

            // Sparkles
            val sparks = listOf(
                Sparkle(40f, 70f, 3f, palette.primary),
                Sparkle(160f, 60f, 2.5f, TertiaryPink),
                Sparkle(170f, 130f, 3f, WarnAmber),
                Sparkle(30f, 140f, 2.5f, palette.primary),
            )
            sparks.forEachIndexed { i, sp ->
                val pf = 0.2f + 0.8f * (0.5f + 0.5f * sin((sparkPhase + i * 0.25f) * 2f * PI.toFloat()))
                drawCircle(sp.color.copy(alpha = pf), sp.r, Offset(sp.x, sp.y))
            }
        }
    }
}

// =====================================================================================
// End of file
// =====================================================================================
