package com.testplaybyte.setupwizard

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.slideOutVertically
import androidx.compose.animation.togetherWith
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.PathMeasure
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.graphics.drawscope.scale
import androidx.compose.ui.graphics.drawscope.translate
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
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
import kotlinx.coroutines.launch
import java.text.NumberFormat
import java.util.Locale
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
 *      and exposes simple lambdas for navigation.
 *    - Palette colors are animated via animateColorAsState so switching
 *      themes transitions smoothly instead of snapping.
 *    - A thin LinearProgressIndicator at the top shows step / 12.
 *    - AnimatedContent swaps between screens with a horizontal slide + fade.
 *    - Each screen follows a consistent pattern: scrollable Column (content)
 *      + fixed bottom Row (actions), with a coordinated entrance animation
 *      driven by rememberEntranceState().
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

    // --- Animated palette (smooth color transitions when switching palettes) ---
    val targetPalette = AllPalettes[state.paletteIndex]
    val animatedPrimary by animateColorAsState(targetPalette.primary, tween(500), label = "p")
    val animatedOnPrimary by animateColorAsState(targetPalette.onPrimary, tween(500), label = "op")
    val animatedPrimaryContainer by animateColorAsState(targetPalette.primaryContainer, tween(500), label = "pc")
    val animatedOnPrimaryContainer by animateColorAsState(targetPalette.onPrimaryContainer, tween(500), label = "opc")
    val animatedBackground by animateColorAsState(targetPalette.background, tween(500), label = "bg")
    val animatedSurface1 by animateColorAsState(targetPalette.surface1, tween(500), label = "s1")
    val animatedSurface2 by animateColorAsState(targetPalette.surface2, tween(500), label = "s2")
    val animatedSurface3 by animateColorAsState(targetPalette.surface3, tween(500), label = "s3")
    val animatedSurface4 by animateColorAsState(targetPalette.surface4, tween(500), label = "s4")
    val animatedSurface5 by animateColorAsState(targetPalette.surface5, tween(500), label = "s5")
    val animatedPalette = WizardPalette(
        primary = animatedPrimary,
        onPrimary = animatedOnPrimary,
        primaryContainer = animatedPrimaryContainer,
        onPrimaryContainer = animatedOnPrimaryContainer,
        background = animatedBackground,
        surface1 = animatedSurface1,
        surface2 = animatedSurface2,
        surface3 = animatedSurface3,
        surface4 = animatedSurface4,
        surface5 = animatedSurface5,
    )

    SetupWizardTheme(palette = animatedPalette, isDark = state.isDark) {
        Surface(modifier = Modifier.fillMaxSize(), color = animatedPalette.background) {
            Column(modifier = Modifier.fillMaxSize()) {
                // Top progress bar
                LinearProgressIndicator(
                    progress = { state.step / 12f },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(4.dp),
                    color = animatedPalette.primary,
                    trackColor = animatedPalette.surface3,
                )

                // Screen content
                AnimatedContent(
                    targetState = state.step,
                    modifier = Modifier.weight(1f),
                    transitionSpec = {
                        val direction = if (targetState > initialState) 1 else -1
                        (slideInHorizontally(tween(320)) { it * direction / 4 } + fadeIn(tween(320))) togetherWith
                            (slideOutHorizontally(tween(320)) { -it * direction / 4 } + fadeOut(tween(320)))
                    },
                    label = "wizard",
                ) { step ->
                    when (step) {
                        0 -> WelcomeScreen(state, onNext, animatedPalette)
                        1 -> ThemeScreen(state, onNext, onBack, animatedPalette, onDarkChange, onPaletteChange)
                        2 -> FolderScreen(state, onNext, onBack, animatedPalette, onFolderSelected)
                        3 -> PermissionsScreen(state, onNext, onBack, animatedPalette, onTogglePermission)
                        4 -> RestoreScreen(state, onNext, onBack, animatedPalette, onSkipToFinish)
                        5 -> FormatNotSupportedScreen(state, onNext, onBack, animatedPalette)
                        6 -> ProcessingBackupScreen(state, onNext, animatedPalette)
                        7 -> BackupSummaryScreen(state, onNext, onBack, animatedPalette)
                        8 -> LinkingAnimeScreen(state, onNext, onBack, animatedPalette)
                        9 -> ManualLinkingScreen(state, onNext, onBack, animatedPalette, onLinkAnime)
                        10 -> RestoreSummaryScreen(state, onNext, onBack, animatedPalette)
                        11 -> RestoreSuccessfulScreen(state, onNext, animatedPalette)
                        12 -> FinishScreen(state, onReset, animatedPalette)
                    }
                }
            }
        }
    }
}

// =====================================================================================
// Animation helpers
// =====================================================================================

/**
 * Holds the entrance-animation values for a screen. Each screen creates one
 * of these via [rememberEntranceState] and a single LaunchedEffect drives the
 * whole sequence (visual → title → subtitle → content → actions).
 */
private class EntranceState {
    val visualScale = Animatable(0f)
    val visualAlpha = Animatable(0f)
    val titleAlpha = Animatable(0f)
    val titleOffset = Animatable(30f)
    val subtitleAlpha = Animatable(0f)
    val subtitleOffset = Animatable(16f)
    val contentAlpha = Animatable(0f)
    val contentOffset = Animatable(20f)
    val actionsAlpha = Animatable(0f)
    val actionsOffset = Animatable(24f)
}

/**
 * Returns an [EntranceState] and triggers the entrance animation sequence:
 * visual scales in → title slides up + fades in → subtitle fades in →
 * content fades in → actions fade in. The sequence takes ~1.2s total.
 */
@Composable
private fun rememberEntranceState(): EntranceState {
    val state = remember { EntranceState() }
    LaunchedEffect(Unit) {
        // Visual scales in with a gentle spring
        launch { state.visualAlpha.animateTo(1f, tween(220)) }
        launch {
            state.visualScale.animateTo(
                1f,
                spring(dampingRatio = 0.62f, stiffness = 380f),
            )
        }
        // Title slides up + fades in
        delay(160)
        launch { state.titleAlpha.animateTo(1f, tween(520, easing = FastOutSlowInEasing)) }
        launch {
            state.titleOffset.animateTo(
                0f,
                spring(dampingRatio = 0.78f, stiffness = 360f),
            )
        }
        // Subtitle fades in
        delay(120)
        launch { state.subtitleAlpha.animateTo(1f, tween(500, easing = FastOutSlowInEasing)) }
        launch { state.subtitleOffset.animateTo(0f, tween(500, easing = FastOutSlowInEasing)) }
        // Content fades in
        delay(120)
        launch { state.contentAlpha.animateTo(1f, tween(460, easing = FastOutSlowInEasing)) }
        launch { state.contentOffset.animateTo(0f, tween(460, easing = FastOutSlowInEasing)) }
        // Actions fade in
        delay(120)
        launch { state.actionsAlpha.animateTo(1f, tween(420, easing = FastOutSlowInEasing)) }
        launch { state.actionsOffset.animateTo(0f, tween(420, easing = FastOutSlowInEasing)) }
    }
    return state
}

/**
 * Counts an integer up from 0 to [target] with a smooth tween, used by stat
 * cards in the summary screens.
 */
@Composable
private fun CountUpText(
    target: Int,
    modifier: Modifier = Modifier,
    color: Color,
    fontSize: androidx.compose.ui.unit.TextUnit = 32.sp,
    fontWeight: FontWeight = FontWeight.ExtraBold,
    durationMs: Int = 1000,
    delayMs: Int = 350,
) {
    val animatedValue = remember(target) { Animatable(0f) }
    LaunchedEffect(target) {
        delay(delayMs)
        animatedValue.animateTo(
            target.toFloat(),
            tween(durationMs, easing = FastOutSlowInEasing),
        )
    }
    val displayValue = animatedValue.value.toInt()
    Text(
        text = formatNumber(displayValue),
        modifier = modifier,
        color = color,
        fontSize = fontSize,
        fontWeight = fontWeight,
        textAlign = TextAlign.Center,
    )
}

private fun formatNumber(value: Int): String {
    return NumberFormat.getNumberInstance(Locale.US).format(value)
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
        modifier = modifier.height(54.dp),
        enabled = enabled,
        shape = RoundedCornerShape(16.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = palette.primary,
            contentColor = palette.onPrimary,
            disabledContainerColor = palette.primary.copy(alpha = 0.35f),
            disabledContentColor = palette.onPrimary.copy(alpha = 0.55f),
        ),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(text, fontWeight = FontWeight.ExtraBold, fontSize = 16.sp)
            if (icon != null) {
                Icon(icon, null, Modifier.size(20.dp))
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
        modifier = modifier.height(54.dp),
        shape = RoundedCornerShape(16.dp),
        border = BorderStroke(1.5.dp, palette.surface5),
        colors = ButtonDefaults.outlinedButtonColors(
            contentColor = TextLight,
        ),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            if (icon != null) {
                Icon(icon, null, Modifier.size(20.dp))
            }
            Text(text, fontWeight = FontWeight.ExtraBold, fontSize = 16.sp)
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
        modifier = modifier.height(54.dp),
        enabled = enabled,
        shape = RoundedCornerShape(16.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = palette.surface2,
            contentColor = if (enabled) TextLight else TextMutedLight,
        ),
    ) {
        Text(text, fontWeight = FontWeight.ExtraBold, fontSize = 16.sp)
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
            .padding(horizontal = 14.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        CircularProgressIndicator(
            modifier = Modifier.size(14.dp),
            strokeWidth = 2.dp,
            color = palette.primary,
        )
        Text(text, color = palette.primary, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
    }
}

/** Big bold title used at the top of every screen. */
@Composable
private fun WizardTitle(
    text: String,
    color: Color = TextLight,
    style: TextStyle = MaterialTheme.typography.displayMedium,
    brush: Brush? = null,
) {
    val finalStyle = if (brush != null) style.copy(brush = brush) else style
    Text(
        text = text,
        style = finalStyle,
        fontWeight = FontWeight.ExtraBold,
        color = if (brush != null) Color.Unspecified else color,
        textAlign = TextAlign.Center,
    )
}

/** Subtitle text below the title. */
@Composable
private fun WizardSubtitle(
    text: String,
    color: Color = TextMutedLight,
) {
    Text(
        text = text,
        style = MaterialTheme.typography.bodyLarge,
        color = color,
        textAlign = TextAlign.Center,
    )
}

/** Stat card used by BackupSummary and RestoreSummary screens. */
@Composable
private fun StatCard(
    target: Int,
    label: String,
    valueColor: Color,
    modifier: Modifier = Modifier,
) {
    val palette = LocalWizardPalette.current
    Card(
        modifier = modifier.height(96.dp),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = palette.surface2),
        border = BorderStroke(1.dp, palette.primary.copy(alpha = 0.33f)),
    ) {
        Column(
            modifier = Modifier.fillMaxSize().padding(8.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
        ) {
            CountUpText(
                target = target,
                color = valueColor,
                fontSize = 30.sp,
                fontWeight = FontWeight.ExtraBold,
            )
            Spacer(Modifier.height(2.dp))
            Text(
                label,
                color = TextMutedLight,
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                textAlign = TextAlign.Center,
            )
        }
    }
}

/** Common screen layout: scrollable content above, fixed action row below. */
@Composable
private fun WizardScreenLayout(
    actionsAlpha: Float = 1f,
    actionsOffset: Float = 0f,
    vararg actions: @Composable RowScope.() -> Unit,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp, Alignment.CenterVertically),
            content = content,
        )
        if (actions.isNotEmpty()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .graphicsLayer {
                        alpha = actionsAlpha
                        translationY = actionsOffset
                    }
                    .padding(horizontal = 24.dp, vertical = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                actions.forEach { it() }
            }
        }
    }
}

/** Wrapper that applies the visual entrance scale + alpha from [EntranceState]. */
@Composable
private fun AnimatedVisualBlock(
    scale: Float,
    alpha: Float,
    content: @Composable () -> Unit,
) {
    Box(
        modifier = Modifier.graphicsLayer {
            scaleX = scale
            scaleY = scale
            this.alpha = alpha
        },
        contentAlignment = Alignment.Center,
    ) {
        content()
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
    val entrance = rememberEntranceState()

    WizardScreenLayout(
        actionsAlpha = entrance.actionsAlpha.value,
        actionsOffset = entrance.actionsOffset.value,
        { PrimaryButton("Get Started", onNext, Modifier.fillMaxWidth()) },
    ) {
        AnimatedVisualBlock(entrance.visualScale.value, entrance.visualAlpha.value) {
            WelcomeVisual()
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.titleAlpha.value
                translationY = entrance.titleOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            WizardTitle(
                text = "Welcome to Anime App!",
                style = MaterialTheme.typography.displayLarge,
                brush = Brush.horizontalGradient(
                    colors = listOf(palette.primary, TertiaryPink),
                ),
            )
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.subtitleAlpha.value
                translationY = entrance.subtitleOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            WizardSubtitle("Let's get you set up in just a few steps. Pick a theme, point us at your anime library, and start watching.")
        }
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
    val entrance = rememberEntranceState()

    WizardScreenLayout(
        actionsAlpha = entrance.actionsAlpha.value,
        actionsOffset = entrance.actionsOffset.value,
        { SecondaryButton("Back", onBack, Modifier.weight(1f)) },
        { PrimaryButton("Next", onNext, Modifier.weight(1f)) },
    ) {
        AnimatedVisualBlock(entrance.visualScale.value, entrance.visualAlpha.value) {
            ThemeVisual()
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.titleAlpha.value
                translationY = entrance.titleOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            WizardTitle("Choose Your Theme")
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.subtitleAlpha.value
                translationY = entrance.subtitleOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            WizardSubtitle("Pick a mode and a color. You can change this anytime in settings.")
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.contentAlpha.value
                translationY = entrance.contentOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            // Dark/Light segmented toggle (bigger touch targets)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(50))
                    .background(palette.surface2)
                    .padding(5.dp),
            ) {
                ModeButton("Dark", Icons.Default.DarkMode, state.isDark, { onDarkChange(true) }, Modifier.weight(1f))
                ModeButton("Light", Icons.Default.WbSunny, !state.isDark, { onDarkChange(false) }, Modifier.weight(1f))
            }
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.contentAlpha.value
                translationY = entrance.contentOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            // 4 palette cards in a 2x2 grid (bigger swatches, bold names)
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(10.dp),
            ) {
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                    PaletteCard(0, state.paletteIndex, onPaletteChange, Modifier.weight(1f))
                    PaletteCard(1, state.paletteIndex, onPaletteChange, Modifier.weight(1f))
                }
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                    PaletteCard(2, state.paletteIndex, onPaletteChange, Modifier.weight(1f))
                    PaletteCard(3, state.paletteIndex, onPaletteChange, Modifier.weight(1f))
                }
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
            .height(48.dp)
            .clip(RoundedCornerShape(50))
            .background(if (isSelected) palette.primary else Color.Transparent)
            .clickable { onClick() },
        contentAlignment = Alignment.Center,
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            Icon(icon, null, Modifier.size(18.dp), tint = if (isSelected) palette.onPrimary else TextLight)
            Text(
                text,
                fontSize = 15.sp,
                fontWeight = FontWeight.ExtraBold,
                color = if (isSelected) palette.onPrimary else TextLight,
            )
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
    // Pop-in scale when selected
    val swatchScale by animateFloatAsState(
        targetValue = if (isSelected) 1.05f else 1f,
        animationSpec = spring(dampingRatio = 0.6f, stiffness = 400f),
        label = "swatch",
    )
    Card(
        modifier = modifier
            .height(82.dp)
            .clip(RoundedCornerShape(16.dp))
            .clickable { onPaletteChange(index) },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = palette.surface2),
        border = BorderStroke(
            2.5.dp,
            if (isSelected) palette.primary else palette.surface4,
        ),
    ) {
        Row(
            modifier = Modifier.fillMaxSize().padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            // Color swatch (bigger, with checkmark when selected)
            Box(
                modifier = Modifier
                    .size(46.dp)
                    .graphicsLayer {
                        scaleX = swatchScale
                        scaleY = swatchScale
                    }
                    .clip(RoundedCornerShape(12.dp))
                    .background(cardPalette.primary),
                contentAlignment = Alignment.Center,
            ) {
                if (isSelected) {
                    Icon(
                        Icons.Default.Check,
                        null,
                        tint = cardPalette.onPrimary,
                        modifier = Modifier.size(24.dp),
                    )
                }
            }
            Text(
                PaletteNames[index],
                color = TextLight,
                fontSize = 16.sp,
                fontWeight = FontWeight.ExtraBold,
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
    val entrance = rememberEntranceState()

    // phase: 0 = initial, 1 = scanning, 2 = success
    var phase by remember { mutableStateOf(if (state.folderSelected) 2 else 0) }

    LaunchedEffect(phase) {
        if (phase == 1) {
            delay(1500)
            onFolderSelected()
            phase = 2
        }
    }

    WizardScreenLayout(
        actionsAlpha = entrance.actionsAlpha.value,
        actionsOffset = entrance.actionsOffset.value,
        { SecondaryButton("Back", onBack, Modifier.weight(1f)) },
        {
            if (phase == 2) {
                PrimaryButton("Continue", onNext, Modifier.weight(1f))
            } else if (phase == 1) {
                GhostButton("Scanning…", {}, Modifier.weight(1f), enabled = false)
            } else {
                GhostButton("Select Folder First", {}, Modifier.weight(1f), enabled = false)
            }
        },
    ) {
        AnimatedVisualBlock(entrance.visualScale.value, entrance.visualAlpha.value) {
            FolderVisual(selected = phase == 2)
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.titleAlpha.value
                translationY = entrance.titleOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            WizardTitle(
                when (phase) {
                    1 -> "Scanning…"
                    2 -> "Folder Connected!"
                    else -> "Select Your Anime Folder"
                },
            )
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.subtitleAlpha.value
                translationY = entrance.subtitleOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            WizardSubtitle(
                when (phase) {
                    1 -> "Looking through your library for anime files…"
                    2 -> "Your library is ready to go. Continue when you are."
                    else -> "Pick the folder where your anime library lives. We'll scan it and organize everything for you."
                },
            )
        }

        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.contentAlpha.value
                translationY = entrance.contentOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            when (phase) {
                0 -> {
                    OutlinedButton(
                        onClick = { phase = 1 },
                        modifier = Modifier.height(54.dp),
                        shape = RoundedCornerShape(16.dp),
                        border = BorderStroke(1.5.dp, palette.primary),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = palette.primary),
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            Icon(Icons.Default.Folder, null, Modifier.size(20.dp))
                            Text("Select Folder", fontWeight = FontWeight.ExtraBold, fontSize = 16.sp)
                        }
                    }
                }
                1 -> {
                    // Selected card with scanning pill
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = palette.surface2),
                        border = BorderStroke(1.dp, palette.primary),
                    ) {
                        Row(
                            modifier = Modifier.padding(16.dp).fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(14.dp),
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(46.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(palette.primaryContainer),
                                contentAlignment = Alignment.Center,
                            ) {
                                Icon(
                                    Icons.Default.Folder,
                                    null,
                                    tint = palette.onPrimaryContainer,
                                    modifier = Modifier.size(24.dp),
                                )
                            }
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    "/storage/anime-library",
                                    color = TextLight,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold,
                                )
                                Text(
                                    "Scanning your library…",
                                    color = TextMutedLight,
                                    fontSize = 13.sp,
                                )
                            }
                            ScanningPill("Scanning")
                        }
                    }
                }
                2 -> {
                    // Success card
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = palette.surface2),
                        border = BorderStroke(1.5.dp, palette.primary),
                    ) {
                        Row(
                            modifier = Modifier.padding(16.dp).fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(14.dp),
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(46.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(palette.primaryContainer),
                                contentAlignment = Alignment.Center,
                            ) {
                                Icon(
                                    Icons.Default.Folder,
                                    null,
                                    tint = palette.onPrimaryContainer,
                                    modifier = Modifier.size(24.dp),
                                )
                            }
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    "/storage/anime-library",
                                    color = TextLight,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold,
                                )
                                Text(
                                    "247 items · ready",
                                    color = palette.primary,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.SemiBold,
                                )
                            }
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(palette.primary.copy(alpha = 0.18f)),
                                contentAlignment = Alignment.Center,
                            ) {
                                Icon(
                                    Icons.Default.Check,
                                    null,
                                    tint = palette.primary,
                                    modifier = Modifier.size(22.dp),
                                )
                            }
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
    val entrance = rememberEntranceState()
    val permRows = listOf(
        PermRow("installApps", "Install Apps", "Allow installing anime extensions", Icons.Default.Download),
        PermRow("notifications", "Notifications", "Get notified about new episodes", Icons.Default.Notifications),
        PermRow("battery", "Battery", "Allow background sync for updates", Icons.Default.BatteryFull),
    )

    WizardScreenLayout(
        actionsAlpha = entrance.actionsAlpha.value,
        actionsOffset = entrance.actionsOffset.value,
        { SecondaryButton("Back", onBack, Modifier.weight(1f)) },
        { PrimaryButton("Continue", onNext, Modifier.weight(1f)) },
    ) {
        AnimatedVisualBlock(entrance.visualScale.value, entrance.visualAlpha.value) {
            PermissionsVisual()
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.titleAlpha.value
                translationY = entrance.titleOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            WizardTitle("Grant Permissions")
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.subtitleAlpha.value
                translationY = entrance.subtitleOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            WizardSubtitle("(optional — you can skip these)")
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.contentAlpha.value
                translationY = entrance.contentOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
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
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = palette.surface2),
        border = BorderStroke(
            1.dp,
            if (isOn) palette.primary.copy(alpha = 0.5f) else palette.surface4,
        ),
    ) {
        Row(
            modifier = Modifier.padding(14.dp).fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            Box(
                modifier = Modifier
                    .size(46.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(if (isOn) palette.primary else palette.surface4),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    row.icon,
                    null,
                    tint = if (isOn) palette.onPrimary else TextLight,
                    modifier = Modifier.size(24.dp),
                )
            }
            Column(modifier = Modifier.weight(1f)) {
                Text(row.title, color = TextLight, fontSize = 16.sp, fontWeight = FontWeight.ExtraBold)
                Text(row.desc, color = TextMutedLight, fontSize = 13.sp)
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
    val entrance = rememberEntranceState()

    WizardScreenLayout(
        actionsAlpha = entrance.actionsAlpha.value,
        actionsOffset = entrance.actionsOffset.value,
        { SecondaryButton("Back", onBack, Modifier.weight(1f), icon = null) },
        { GhostButton("Skip", onSkip, Modifier.weight(1f)) },
    ) {
        AnimatedVisualBlock(entrance.visualScale.value, entrance.visualAlpha.value) {
            RestoreVisual()
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.titleAlpha.value
                translationY = entrance.titleOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            WizardTitle("Restore Backup")
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.subtitleAlpha.value
                translationY = entrance.subtitleOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            WizardSubtitle("Got a backup from a previous install? Restore your library, history, and settings in one tap.")
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.contentAlpha.value
                translationY = entrance.contentOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            OutlinedButton(
                onClick = onNext,
                modifier = Modifier.height(54.dp),
                shape = RoundedCornerShape(16.dp),
                border = BorderStroke(1.5.dp, palette.primary),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = palette.primary),
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Icon(Icons.Default.Download, null, Modifier.size(20.dp))
                    Text("Select Backup File", fontWeight = FontWeight.ExtraBold, fontSize = 16.sp)
                }
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
    val entrance = rememberEntranceState()

    WizardScreenLayout(
        actionsAlpha = entrance.actionsAlpha.value,
        actionsOffset = entrance.actionsOffset.value,
        { SecondaryButton("Back", onBack, Modifier.weight(1f), icon = null) },
        { PrimaryButton("Don't Worry, Restore It", onNext, Modifier.weight(1f)) },
    ) {
        AnimatedVisualBlock(entrance.visualScale.value, entrance.visualAlpha.value) {
            WarningFileVisual()
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.titleAlpha.value
                translationY = entrance.titleOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            WizardTitle("Format Not Supported", color = WarnAmber)
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.subtitleAlpha.value
                translationY = entrance.subtitleOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            WizardSubtitle("We don't recognize this backup format. But don't worry — we can still try to restore from it!")
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.contentAlpha.value
                translationY = entrance.contentOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = palette.surface2),
                border = BorderStroke(1.dp, palette.primary.copy(alpha = 0.33f)),
            ) {
                Row(
                    modifier = Modifier.padding(14.dp).fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(14.dp),
                ) {
                    Box(
                        modifier = Modifier
                            .size(46.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(palette.primary.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center,
                    ) {
                        Icon(Icons.Default.Info, null, tint = palette.primary, modifier = Modifier.size(24.dp))
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            "anime_backup_2025-01-15.json",
                            color = TextLight,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                        )
                        Text("2.3 MB · unknown format", color = TextMutedLight, fontSize = 13.sp)
                    }
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
    val entrance = rememberEntranceState()
    LaunchedEffect(Unit) {
        delay(2000)
        onNext()
    }

    Column(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp, Alignment.CenterVertically),
        ) {
            AnimatedVisualBlock(entrance.visualScale.value, entrance.visualAlpha.value) {
                ProcessingBackupVisual()
            }
            Box(
                modifier = Modifier.graphicsLayer {
                    alpha = entrance.titleAlpha.value
                    translationY = entrance.titleOffset.value
                },
                contentAlignment = Alignment.Center,
            ) {
                WizardTitle("Processing Backup")
            }
            Box(
                modifier = Modifier.graphicsLayer {
                    alpha = entrance.subtitleAlpha.value
                    translationY = entrance.subtitleOffset.value
                },
                contentAlignment = Alignment.Center,
            ) {
                WizardSubtitle("Reading your backup file and extracting data…")
            }
            Box(
                modifier = Modifier.graphicsLayer { alpha = entrance.contentAlpha.value },
                contentAlignment = Alignment.Center,
            ) {
                ScanningPill("Processing")
            }
        }
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .graphicsLayer { alpha = entrance.actionsAlpha.value }
                .padding(horizontal = 24.dp, vertical = 16.dp),
            horizontalArrangement = Arrangement.Center,
        ) {
            Text("Please wait…", color = TextMutedLight, fontWeight = FontWeight.ExtraBold, fontSize = 15.sp)
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
    val entrance = rememberEntranceState()
    val stats = listOf(
        247 to "Anime Detected",
        12 to "Categories",
        1432 to "Episodes Tracked",
        89 to "Completed",
    )

    WizardScreenLayout(
        actionsAlpha = entrance.actionsAlpha.value,
        actionsOffset = entrance.actionsOffset.value,
        { SecondaryButton("Cancel", onBack, Modifier.weight(1f), icon = null) },
        { PrimaryButton("Restore", onNext, Modifier.weight(1f)) },
    ) {
        AnimatedVisualBlock(entrance.visualScale.value, entrance.visualAlpha.value) {
            SummaryVisual()
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.titleAlpha.value
                translationY = entrance.titleOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            WizardTitle("Backup Summary")
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.subtitleAlpha.value
                translationY = entrance.subtitleOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            WizardSubtitle("Here's what we found in your backup.")
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.contentAlpha.value
                translationY = entrance.contentOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    StatCard(stats[0].first, stats[0].second, palette.primary, Modifier.weight(1f))
                    StatCard(stats[1].first, stats[1].second, palette.primary, Modifier.weight(1f))
                }
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    StatCard(stats[2].first, stats[2].second, palette.primary, Modifier.weight(1f))
                    StatCard(stats[3].first, stats[3].second, palette.primary, Modifier.weight(1f))
                }
            }
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.contentAlpha.value
                translationY = entrance.contentOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            // RED manga warning box (prominent)
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = ErrorRed.copy(alpha = 0.14f)),
                border = BorderStroke(1.5.dp, ErrorRed.copy(alpha = 0.5f)),
            ) {
                Row(
                    modifier = Modifier.padding(14.dp).fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(ErrorRed.copy(alpha = 0.25f)),
                        contentAlignment = Alignment.Center,
                    ) {
                        Icon(Icons.Default.Warning, null, tint = ErrorRed, modifier = Modifier.size(22.dp))
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            "Manga Entries Detected",
                            color = ErrorRed,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.ExtraBold,
                        )
                        Text(
                            "Manga is not supported — these entries will be skipped.",
                            color = TextMutedLight,
                            fontSize = 13.sp,
                        )
                    }
                }
            }
        }
    }
}



// =====================================================================================
// Screen 8 — Linking anime (progressive reveal + count-up stats)
// =====================================================================================
@Composable
private fun LinkingAnimeScreen(
    state: WizardState,
    onNext: () -> Unit,
    onBack: () -> Unit,
    palette: WizardPalette,
) {
    val entrance = rememberEntranceState()
    var revealedCount by remember { mutableStateOf(0) }
    LaunchedEffect(Unit) {
        for (i in 1..state.linkedAnime.size) {
            delay(380)
            revealedCount = i
        }
    }

    val revealedLinked = state.linkedAnime.take(revealedCount).count { it.linked }
    val revealedUnlinked = state.linkedAnime.take(revealedCount).count { !it.linked }
    val allRevealed = revealedCount >= state.linkedAnime.size

    WizardScreenLayout(
        actionsAlpha = entrance.actionsAlpha.value,
        actionsOffset = entrance.actionsOffset.value,
        { SecondaryButton("Back", onBack, Modifier.weight(1f)) },
        { PrimaryButton("Next", onNext, Modifier.weight(1f), enabled = allRevealed) },
    ) {
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.titleAlpha.value
                translationY = entrance.titleOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            WizardTitle("Linking Anime")
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.subtitleAlpha.value
                translationY = entrance.subtitleOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            WizardSubtitle("Matching your backup entries to AniList…")
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.contentAlpha.value
                translationY = entrance.contentOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            // 3 stat boxes with count-up
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                LinkStatBox(revealedLinked, "Linked", palette.primary, Modifier.weight(1f))
                LinkStatBox(revealedUnlinked, "No Match", ErrorRed, Modifier.weight(1f))
                LinkStatBox(revealedCount, "Total", TextLight, Modifier.weight(1f))
            }
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.contentAlpha.value
                translationY = entrance.contentOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            // Progressive list (entries animate in one by one)
            Column(
                modifier = Modifier.fillMaxWidth().heightIn(max = 240.dp).verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                state.linkedAnime.take(revealedCount).forEach { anime ->
                    // Per-item entrance animation: alpha + slide-up
                    val itemAlpha = remember { Animatable(0f) }
                    val itemOffset = remember { Animatable(-28f) }
                    LaunchedEffect(Unit) {
                        launch { itemAlpha.animateTo(1f, tween(280, easing = FastOutSlowInEasing)) }
                        launch { itemOffset.animateTo(0f, tween(280, easing = FastOutSlowInEasing)) }
                    }
                    Box(
                        modifier = Modifier.graphicsLayer {
                            alpha = itemAlpha.value
                            translationY = itemOffset.value
                        }
                    ) {
                        LinkedAnimeRow(anime, palette)
                    }
                }
                if (!allRevealed) {
                    Box(
                        modifier = Modifier.fillMaxWidth().padding(8.dp),
                        contentAlignment = Alignment.Center,
                    ) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(18.dp),
                            strokeWidth = 2.dp,
                            color = palette.primary,
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun LinkedAnimeRow(anime: LinkedAnime, palette: WizardPalette) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = palette.surface2),
        border = BorderStroke(1.dp, palette.surface4),
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp).fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            Text(
                anime.backupName,
                modifier = Modifier.weight(1f),
                color = TextLight,
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            if (anime.linked) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    Icon(Icons.Default.Check, null, tint = palette.primary, modifier = Modifier.size(14.dp))
                    Text(
                        anime.matchedName ?: "",
                        color = palette.primary,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                }
            } else {
                Text("No Match", color = ErrorRed, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
            }
        }
    }
}

@Composable
private fun LinkStatBox(value: Int, label: String, valueColor: Color, modifier: Modifier = Modifier) {
    val palette = LocalWizardPalette.current
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = palette.surface2),
        border = BorderStroke(1.dp, palette.surface4),
    ) {
        Column(
            modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Text(
                value.toString(),
                color = valueColor,
                fontSize = 26.sp,
                fontWeight = FontWeight.ExtraBold,
            )
            Text(label, color = TextMutedLight, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
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
    val entrance = rememberEntranceState()
    var searchOpen by remember { mutableStateOf(false) }
    var searchQuery by remember { mutableStateOf("") }
    var selectedAnimeId by remember { mutableStateOf<Int?>(null) }
    var revealedResults by remember { mutableStateOf(0) }

    val unlinkedCount = state.linkedAnime.count { !it.linked }
    val selectedAnime = state.linkedAnime.find { it.id == selectedAnimeId }

    val filtered = if (searchQuery.isBlank()) {
        MOCK_SEARCH_RESULTS
    } else {
        MOCK_SEARCH_RESULTS.filter { it.contains(searchQuery, ignoreCase = true) }
    }

    // Animate search results in with stagger
    LaunchedEffect(searchOpen) {
        if (searchOpen) {
            revealedResults = 0
            delay(180)
            for (i in 1..MOCK_SEARCH_RESULTS.size) {
                delay(70)
                revealedResults = i
            }
        } else {
            revealedResults = 0
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        WizardScreenLayout(
            actionsAlpha = entrance.actionsAlpha.value,
            actionsOffset = entrance.actionsOffset.value,
            { SecondaryButton("Back", onBack, Modifier.weight(1f)) },
            { PrimaryButton("Continue", onNext, Modifier.weight(1f)) },
        ) {
            Box(
                modifier = Modifier.graphicsLayer {
                    alpha = entrance.titleAlpha.value
                    translationY = entrance.titleOffset.value
                },
                contentAlignment = Alignment.Center,
            ) {
                WizardTitle("Manual Linking")
            }
            Box(
                modifier = Modifier.graphicsLayer {
                    alpha = entrance.subtitleAlpha.value
                    translationY = entrance.subtitleOffset.value
                },
                contentAlignment = Alignment.Center,
            ) {
                WizardSubtitle(
                    if (unlinkedCount == 0) "All anime are linked! You're ready to continue."
                    else "$unlinkedCount anime need your help. Tap any entry to search for a match.",
                )
            }
            Box(
                modifier = Modifier.graphicsLayer {
                    alpha = entrance.contentAlpha.value
                    translationY = entrance.contentOffset.value
                },
                contentAlignment = Alignment.Center,
            ) {
                if (unlinkedCount == 0) {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = palette.surface2),
                        border = BorderStroke(1.5.dp, palette.primary.copy(alpha = 0.4f)),
                    ) {
                        Column(
                            modifier = Modifier.fillMaxWidth().padding(24.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(10.dp),
                        ) {
                            Icon(Icons.Default.Check, null, tint = palette.primary, modifier = Modifier.size(48.dp))
                            Text("All Linked!", color = palette.primary, fontSize = 18.sp, fontWeight = FontWeight.ExtraBold)
                        }
                    }
                } else {
                    Column(
                        modifier = Modifier.fillMaxWidth().heightIn(max = 320.dp).verticalScroll(rememberScrollState()),
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        // Iterate over all anime; AnimatedVisibility animates the exit when linked
                        state.linkedAnime.forEach { anime ->
                            AnimatedVisibility(
                                visible = !anime.linked,
                                enter = fadeIn(tween(280)) + slideInVertically(tween(280)) { -it / 6 },
                                exit = fadeOut(tween(280)) + slideOutVertically(tween(280)) { it / 6 },
                            ) {
                                UnlinkedAnimeCard(
                                    anime = anime,
                                    onClick = {
                                        selectedAnimeId = anime.id
                                        searchQuery = anime.backupName
                                        searchOpen = true
                                    },
                                )
                            }
                        }
                    }
                }
            }
        }

        // Search overlay (covers the entire screen when open)
        AnimatedVisibility(
            visible = searchOpen,
            enter = fadeIn(tween(220)) + slideInVertically(tween(300)) { it / 4 },
            exit = fadeOut(tween(200)) + slideOutVertically(tween(260)) { it / 4 },
        ) {
            Surface(modifier = Modifier.fillMaxSize(), color = palette.background) {
                Column(modifier = Modifier.fillMaxSize()) {
                    // Header
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                    ) {
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .clip(CircleShape)
                                .background(palette.surface2)
                                .clickable {
                                    searchOpen = false
                                    selectedAnimeId = null
                                    searchQuery = ""
                                },
                            contentAlignment = Alignment.Center,
                        ) {
                            Icon(Icons.Default.ArrowBack, null, tint = TextLight, modifier = Modifier.size(22.dp))
                        }
                        OutlinedTextField(
                            value = searchQuery,
                            onValueChange = { searchQuery = it },
                            modifier = Modifier.weight(1f),
                            placeholder = { Text("Search for anime…", color = TextMutedLight, fontSize = 15.sp) },
                            leadingIcon = { Icon(Icons.Default.Search, null, tint = TextMutedLight, modifier = Modifier.size(20.dp)) },
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
                        modifier = Modifier.padding(horizontal = 20.dp, vertical = 6.dp),
                        color = TextMutedLight,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                    )
                    // Results list
                    if (filtered.isEmpty()) {
                        Box(
                            modifier = Modifier.fillMaxSize().padding(24.dp),
                            contentAlignment = Alignment.Center,
                        ) {
                            Text(
                                "No results found. Try a different search.",
                                color = TextMutedLight,
                                fontSize = 14.sp,
                                textAlign = TextAlign.Center,
                            )
                        }
                    } else {
                        Column(
                            modifier = Modifier.fillMaxWidth().padding(16.dp).verticalScroll(rememberScrollState()),
                            verticalArrangement = Arrangement.spacedBy(8.dp),
                        ) {
                            filtered.forEachIndexed { idx, result ->
                                AnimatedVisibility(
                                    visible = idx < revealedResults,
                                    enter = fadeIn(tween(260)) + slideInVertically(tween(280)) { -it / 6 },
                                ) {
                                    Card(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .clip(RoundedCornerShape(12.dp))
                                            .clickable {
                                                val id = selectedAnimeId
                                                if (id != null) {
                                                    onLink(id, result)
                                                }
                                                searchOpen = false
                                                selectedAnimeId = null
                                                searchQuery = ""
                                            },
                                        shape = RoundedCornerShape(12.dp),
                                        colors = CardDefaults.cardColors(containerColor = palette.surface2),
                                        border = BorderStroke(1.dp, palette.surface4),
                                    ) {
                                        Row(
                                            modifier = Modifier.padding(12.dp).fillMaxWidth(),
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.spacedBy(12.dp),
                                        ) {
                                            Box(
                                                modifier = Modifier
                                                    .size(38.dp, 52.dp)
                                                    .clip(RoundedCornerShape(6.dp))
                                                    .background(palette.primary.copy(alpha = 0.18f)),
                                            )
                                            Text(
                                                result,
                                                modifier = Modifier.weight(1f),
                                                color = TextLight,
                                                fontSize = 14.sp,
                                                fontWeight = FontWeight.SemiBold,
                                            )
                                            Icon(Icons.Default.Add, null, tint = palette.primary, modifier = Modifier.size(20.dp))
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
}

@Composable
private fun UnlinkedAnimeCard(anime: LinkedAnime, onClick: () -> Unit) {
    val palette = LocalWizardPalette.current
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .clickable { onClick() },
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = palette.surface2),
        border = BorderStroke(1.dp, palette.surface4),
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 12.dp).fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            Text(
                anime.backupName,
                modifier = Modifier.weight(1f),
                color = TextLight,
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                Text("Search", color = TextMutedLight, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                Icon(Icons.Default.ArrowForward, null, tint = TextMutedLight, modifier = Modifier.size(14.dp))
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
    val entrance = rememberEntranceState()
    val linkedCount = state.linkedAnime.count { it.linked }
    val unlinkedCount = state.linkedAnime.count { !it.linked }
    val stats = listOf(
        247 to "Anime to Restore",
        linkedCount to "Auto-Linked",
        unlinkedCount to "Manually Linked",
        1432 to "Episodes",
    )

    WizardScreenLayout(
        actionsAlpha = entrance.actionsAlpha.value,
        actionsOffset = entrance.actionsOffset.value,
        { SecondaryButton("Back", onBack, Modifier.weight(1f)) },
        { PrimaryButton("Restore Now", onNext, Modifier.weight(1f)) },
    ) {
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.titleAlpha.value
                translationY = entrance.titleOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            WizardTitle("Restore Summary")
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.subtitleAlpha.value
                translationY = entrance.subtitleOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            WizardSubtitle("Ready to restore. Review the details below.")
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.contentAlpha.value
                translationY = entrance.contentOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    StatCard(stats[0].first, stats[0].second, palette.primary, Modifier.weight(1f))
                    StatCard(stats[1].first, stats[1].second, palette.primary, Modifier.weight(1f))
                }
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    StatCard(stats[2].first, stats[2].second, palette.primary, Modifier.weight(1f))
                    StatCard(stats[3].first, stats[3].second, palette.primary, Modifier.weight(1f))
                }
            }
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.contentAlpha.value
                translationY = entrance.contentOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            // Info note about overwriting
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = palette.primary.copy(alpha = 0.08f)),
                border = BorderStroke(1.dp, palette.primary.copy(alpha = 0.3f)),
            ) {
                Row(
                    modifier = Modifier.padding(14.dp).fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(palette.primary.copy(alpha = 0.18f)),
                        contentAlignment = Alignment.Center,
                    ) {
                        Icon(Icons.Default.Info, null, tint = palette.primary, modifier = Modifier.size(22.dp))
                    }
                    Text(
                        "This will overwrite any existing library data. The restore process may take a few moments.",
                        color = TextMutedLight,
                        fontSize = 13.sp,
                    )
                }
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
    val entrance = rememberEntranceState()
    LaunchedEffect(Unit) {
        delay(5000)
        onNext()
    }

    val restoredCount = state.linkedAnime.count { it.linked } + 247

    Column(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp, Alignment.CenterVertically),
        ) {
            AnimatedVisualBlock(entrance.visualScale.value, entrance.visualAlpha.value) {
                RestoreSuccessVisual()
            }
            Box(
                modifier = Modifier.graphicsLayer {
                    alpha = entrance.titleAlpha.value
                    translationY = entrance.titleOffset.value
                },
                contentAlignment = Alignment.Center,
            ) {
                WizardTitle(
                    text = "Restore Successful!",
                    style = MaterialTheme.typography.displayLarge,
                    brush = Brush.horizontalGradient(
                        colors = listOf(palette.primary, TertiaryPink, WarnAmber),
                    ),
                )
            }
            Box(
                modifier = Modifier.graphicsLayer {
                    alpha = entrance.subtitleAlpha.value
                    translationY = entrance.subtitleOffset.value
                },
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    buildAnnotatedString {
                        withStyle(SpanStyle(color = palette.primary, fontWeight = FontWeight.ExtraBold, fontSize = 18.sp)) {
                            append(formatNumber(restoredCount))
                        }
                        withStyle(SpanStyle(color = TextMutedLight, fontSize = 16.sp)) {
                            append(" anime have been restored to your library. You're all set to go!")
                        }
                    },
                    textAlign = TextAlign.Center,
                )
            }
        }
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .graphicsLayer {
                    alpha = entrance.actionsAlpha.value
                    translationY = entrance.actionsOffset.value
                }
                .padding(horizontal = 24.dp, vertical = 16.dp),
        ) {
            PrimaryButton("Continue", onNext, Modifier.fillMaxWidth())
        }
    }
}

// =====================================================================================
// Screen 12 — Finish (gradient title + API URL card + reset)
// =====================================================================================
@Composable
private fun FinishScreen(
    state: WizardState,
    onRestart: () -> Unit,
    palette: WizardPalette,
) {
    val entrance = rememberEntranceState()

    WizardScreenLayout(
        actionsAlpha = entrance.actionsAlpha.value,
        actionsOffset = entrance.actionsOffset.value,
        { PrimaryButton("Start Exploring", onRestart, Modifier.fillMaxWidth(), icon = Icons.Default.Refresh) },
    ) {
        AnimatedVisualBlock(entrance.visualScale.value, entrance.visualAlpha.value) {
            WelcomeVisual()
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.titleAlpha.value
                translationY = entrance.titleOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            WizardTitle(
                text = "You're All Set!",
                style = MaterialTheme.typography.displayLarge,
                brush = Brush.horizontalGradient(
                    colors = listOf(palette.primary, TertiaryPink, WarnAmber),
                ),
            )
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.subtitleAlpha.value
                translationY = entrance.subtitleOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            WizardSubtitle("Your anime journey begins now. Enjoy exploring thousands of titles, tracking your progress, and never missing a new episode.")
        }
        Box(
            modifier = Modifier.graphicsLayer {
                alpha = entrance.contentAlpha.value
                translationY = entrance.contentOffset.value
            },
            contentAlignment = Alignment.Center,
        ) {
            // API URL card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = palette.surface2),
                border = BorderStroke(1.dp, palette.primary.copy(alpha = 0.33f)),
            ) {
                Row(
                    modifier = Modifier.padding(16.dp).fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(14.dp),
                ) {
                    Box(
                        modifier = Modifier
                            .size(46.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(palette.primary.copy(alpha = 0.18f)),
                        contentAlignment = Alignment.Center,
                    ) {
                        Icon(Icons.Default.Link, null, tint = palette.primary, modifier = Modifier.size(22.dp))
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text("API URL", color = TextMutedLight, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        Text("https://api.anilist.co", color = TextLight, fontSize = 15.sp, fontWeight = FontWeight.Bold)
                    }
                    Icon(Icons.Default.Check, null, tint = palette.primary, modifier = Modifier.size(20.dp))
                }
            }
        }
        Box(
            modifier = Modifier.graphicsLayer { alpha = entrance.contentAlpha.value },
            contentAlignment = Alignment.Center,
        ) {
            // "Setup complete" badge
            Row(
                modifier = Modifier
                    .clip(RoundedCornerShape(50))
                    .background(palette.primary.copy(alpha = 0.15f))
                    .padding(horizontal = 14.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp),
            ) {
                Icon(Icons.Default.Star, null, tint = palette.primary, modifier = Modifier.size(16.dp))
                Text("Setup Complete", color = palette.primary, fontSize = 13.sp, fontWeight = FontWeight.ExtraBold)
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
    val glowPhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2200, easing = LinearEasing)), "glow",
    )

    Canvas(modifier = Modifier.size(200.dp)) {
        val s = size.minDimension / 200f
        scale(s, s, pivot = Offset.Zero) {
            // Glow
            val gf = 0.5f + 0.5f * sin(glowPhase * 2f * PI.toFloat())
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(WarnAmber.copy(alpha = 0.18f + 0.10f * gf), WarnAmber.copy(alpha = 0f)),
                    center = Offset(100f, 100f),
                    radius = 64f,
                ),
                center = Offset(100f, 100f),
                radius = 64f,
            )

            // File body (bobbing)
            val f = sin(bobPhase * PI.toFloat()).coerceIn(-1f, 1f)
            translate(0f, -8f * f) {
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
                drawPath(file, color = WarnAmber, style = Stroke(width = 2.5f, join = StrokeJoin.Round))
                // Folded corner detail
                drawLine(WarnAmber, Offset(114f, 50f), Offset(114f, 72f), strokeWidth = 2f, cap = StrokeCap.Round)
                drawLine(WarnAmber, Offset(114f, 72f), Offset(136f, 72f), strokeWidth = 2f, cap = StrokeCap.Round)
                // File content lines
                drawRoundRect(WarnAmber.copy(alpha = 0.6f), Offset(76f, 86f), Size(48f, 4f), CornerRadius(2f, 2f))
                drawRoundRect(WarnAmber.copy(alpha = 0.4f), Offset(76f, 98f), Size(40f, 4f), CornerRadius(2f, 2f))
                drawRoundRect(WarnAmber.copy(alpha = 0.4f), Offset(76f, 110f), Size(44f, 4f), CornerRadius(2f, 2f))
                drawRoundRect(WarnAmber.copy(alpha = 0.35f), Offset(76f, 122f), Size(36f, 4f), CornerRadius(2f, 2f))
            }

            // Warning triangle badge (pulsing)
            val wf = 0.5f + 0.5f * sin(warnPhase * 2f * PI.toFloat())
            val ws = 0.95f + 0.12f * wf
            scale(ws, ws, pivot = Offset(140f, 140f)) {
                drawCircle(WarnAmber, 24f, Offset(140f, 140f))
                drawCircle(palette.background, 24f, Offset(140f, 140f), style = Stroke(width = 2.5f))
                // Exclamation
                drawLine(palette.background, Offset(140f, 128f), Offset(140f, 142f), strokeWidth = 4f, cap = StrokeCap.Round)
                drawCircle(palette.background, 2.5f, Offset(140f, 150f))
            }

            // Sparkles
            val sparks = listOf(
                InlineSparkle(40f, 60f, 3f, WarnAmber),
                InlineSparkle(160f, 50f, 2.5f, TertiaryPink),
                InlineSparkle(36f, 150f, 2f, palette.primary),
                InlineSparkle(170f, 150f, 2.5f, WarnAmber),
            )
            sparks.forEachIndexed { i, sp ->
                val pf = 0.5f + 0.5f * sin((sparkPhase + i * 0.33f) * 2f * PI.toFloat())
                drawCircle(sp.color.copy(alpha = pf), sp.r, Offset(sp.x, sp.y))
            }
        }
    }
}

private data class InlineSparkle(val x: Float, val y: Float, val r: Float, val color: Color)

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
                brush = Brush.radialGradient(
                    colors = listOf(palette.primary.copy(alpha = ga), palette.primary.copy(alpha = 0f)),
                    center = Offset(100f, 100f),
                    radius = 64f,
                ),
                center = Offset(100f, 100f),
                radius = 64f,
            )

            // Outer ring (rotating dashes + dots)
            rotate(ring1, pivot = Offset(100f, 100f)) {
                drawCircle(
                    color = palette.primary.copy(alpha = 0.5f),
                    radius = 68f, center = Offset(100f, 100f),
                    style = Stroke(width = 2.5f, pathEffect = PathEffect.dashPathEffect(floatArrayOf(6f, 10f))),
                )
                drawCircle(palette.primary, 6f, Offset(100f, 32f))
                drawCircle(TertiaryPink, 5f, Offset(168f, 100f))
                drawCircle(WarnAmber, 5f, Offset(100f, 168f))
                drawCircle(SecondaryLavender, 5f, Offset(32f, 100f))
            }
            // Inner ring (reverse)
            rotate(ring2, pivot = Offset(100f, 100f)) {
                drawCircle(
                    color = TertiaryPink.copy(alpha = 0.4f),
                    radius = 50f, center = Offset(100f, 100f),
                    style = Stroke(width = 1.8f, pathEffect = PathEffect.dashPathEffect(floatArrayOf(3f, 6f))),
                )
            }
            // Central file icon (pulsing)
            val cs = 1f + 0.10f * (0.5f + 0.5f * sin(corePhase * 2f * PI.toFloat()))
            scale(cs, cs, pivot = Offset(100f, 100f)) {
                drawCircle(palette.primaryContainer, 36f, Offset(100f, 100f))
                drawCircle(palette.primary, 36f, Offset(100f, 100f), style = Stroke(width = 2.5f))
                // File icon path
                val file = Path().apply {
                    moveTo(86f, 82f)
                    lineTo(86f, 118f)
                    quadraticBezierTo(86f, 121f, 89f, 121f)
                    lineTo(111f, 121f)
                    quadraticBezierTo(114f, 121f, 114f, 118f)
                    lineTo(114f, 90f)
                    lineTo(106f, 82f)
                    close()
                }
                drawPath(file, color = palette.primary.copy(alpha = 0.95f))
                drawPath(file, color = palette.onPrimary, style = Stroke(width = 1.5f, join = StrokeJoin.Round))
                drawRoundRect(palette.onPrimary.copy(alpha = 0.6f), Offset(91f, 96f), Size(16f, 2.5f), CornerRadius(1f, 1f))
                drawRoundRect(palette.onPrimary.copy(alpha = 0.5f), Offset(91f, 103f), Size(12f, 2.5f), CornerRadius(1f, 1f))
                drawRoundRect(palette.onPrimary.copy(alpha = 0.5f), Offset(91f, 110f), Size(14f, 2.5f), CornerRadius(1f, 1f))
            }
        }
    }
}

/** Success badge + expanding rings + sparkles + confetti for Restore-Successful. */
@Composable
private fun RestoreSuccessVisual() {
    val palette = LocalWizardPalette.current
    val infinite = rememberInfiniteTransition(label = "success")
    val glowPhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2000, easing = LinearEasing)), "glow",
    )
    val ringPhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2200, easing = LinearEasing)), "ring",
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
    val confettiPhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2500, easing = LinearEasing)), "confetti",
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
                brush = Brush.radialGradient(
                    colors = listOf(palette.primary.copy(alpha = ga), palette.primary.copy(alpha = 0f)),
                    center = Offset(100f, 100f),
                    radius = 64f,
                ),
                center = Offset(100f, 100f),
                radius = 64f,
            )

            // 3 expanding rings
            val ringColors = listOf(palette.primary, TertiaryPink, WarnAmber)
            ringColors.forEachIndexed { i, c ->
                val ph = (ringPhase + i * 0.24f) % 1f
                val scaleR = 0.2f + 1.8f * ph
                val alpha = (1f - ph).coerceAtLeast(0f)
                drawCircle(
                    color = c.copy(alpha = alpha),
                    radius = 38f * scaleR,
                    center = Offset(100f, 100f),
                    style = Stroke(width = 3.5f - i * 0.6f),
                )
            }

            // Central badge (pulsing)
            val cs = 1f + 0.07f * (0.5f + 0.5f * sin(corePhase * 2f * PI.toFloat()))
            scale(cs, cs, pivot = Offset(100f, 100f)) {
                // Outer glow ring
                drawCircle(palette.primary.copy(alpha = 0.25f), 42f, Offset(100f, 100f))
                drawCircle(palette.primary, 40f, Offset(100f, 100f))
                drawCircle(palette.background, 40f, Offset(100f, 100f), style = Stroke(width = 2.5f))
                // Inner top highlight
                drawOval(
                    color = palette.background.copy(alpha = 0.15f),
                    topLeft = Offset(78f, 68f), size = Size(44f, 44f),
                )

                // Animated checkmark draw — more dramatic (thicker stroke)
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
                        style = Stroke(width = 7f, cap = StrokeCap.Round, join = StrokeJoin.Round),
                    )
                }
            }

            // Sparkles
            val sparks = listOf(
                InlineSparkle(40f, 70f, 3f, palette.primary),
                InlineSparkle(160f, 60f, 2.5f, TertiaryPink),
                InlineSparkle(170f, 130f, 3f, WarnAmber),
                InlineSparkle(30f, 140f, 2.5f, palette.primary),
            )
            sparks.forEachIndexed { i, sp ->
                val pf = 0.2f + 0.8f * (0.5f + 0.5f * sin((sparkPhase + i * 0.25f) * 2f * PI.toFloat()))
                drawCircle(sp.color.copy(alpha = pf), sp.r, Offset(sp.x, sp.y))
            }

            // Confetti pieces (6)
            val confetti = listOf(
                InlineConfetti(48f, 20f, 6f, 6f, 20f, palette.primary),
                InlineConfetti(100f, 10f, 6f, 6f, -15f, TertiaryPink),
                InlineConfetti(152f, 18f, 6f, 6f, 45f, WarnAmber),
                InlineConfetti(70f, 5f, 5f, 5f, -30f, SecondaryLavender),
                InlineConfetti(130f, 8f, 5f, 5f, 60f, palette.primary),
                InlineConfetti(30f, 15f, 5f, 5f, -45f, TertiaryPink),
            )
            confetti.forEachIndexed { i, c ->
                val ph = (confettiPhase + i * 0.16f) % 1f
                val dy = -20f + 60f * ph
                val rot = 180f * ph
                val alpha = when {
                    ph < 0.15f -> ph / 0.15f
                    ph < 0.85f -> 1f
                    else -> (1f - ph) / 0.15f
                }
                rotate(c.initialRot + rot, pivot = Offset(c.x + c.w / 2f, c.y + c.h / 2f)) {
                    translate(0f, dy) {
                        drawRoundRect(
                            color = c.color.copy(alpha = alpha),
                            topLeft = Offset(c.x, c.y),
                            size = Size(c.w, c.h),
                            cornerRadius = CornerRadius(1.5f, 1.5f),
                        )
                    }
                }
            }
        }
    }
}

private data class InlineConfetti(
    val x: Float, val y: Float, val w: Float, val h: Float,
    val initialRot: Float, val color: Color,
)

// =====================================================================================
// End of file
// =====================================================================================
