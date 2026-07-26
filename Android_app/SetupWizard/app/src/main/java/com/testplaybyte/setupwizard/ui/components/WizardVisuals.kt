package com.testplaybyte.setupwizard.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
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
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.graphics.drawscope.scale
import androidx.compose.ui.graphics.drawscope.translate
import androidx.compose.ui.unit.dp
import com.testplaybyte.setupwizard.ui.theme.LocalWizardPalette
import com.testplaybyte.setupwizard.ui.theme.SecondaryLavender
import com.testplaybyte.setupwizard.ui.theme.TertiaryPink
import com.testplaybyte.setupwizard.ui.theme.WarnAmber
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

/* =====================================================================================
 *  WizardVisuals.kt — abstract animated illustrations drawn with Compose Canvas.
 *
 *  7 self-contained 200x200dp visuals, one per wizard step. Each uses a single
 *  InfiniteTransition driving cheap (transform + alpha only) draw operations
 *  inside a Canvas, all colors sourced from LocalWizardPalette + a handful of
 *  hardcoded accent colors. The Canvas is scaled so coordinates are written in
 *  a 200x200 logical space (matching the original SVG viewBox), which keeps
 *  the per-visual code compact and easy to read.
 *
 *  Visuals:
 *    1. WelcomeVisual      — pulsing rings + counter-rotating dot orbits + sparkles
 *    2. ThemeVisual        — orbiting color dots around a central palette swatch
 *    3. FolderVisual       — tall folder + floating file cards (+ success badge)
 *    4. PermissionsVisual  — shield + ripple rings + dashed orbits + checkmark draw
 *    5. RestoreVisual      — cloud + falling data particles + filling tray
 *    6. SummaryVisual      — growing bar chart + trend arrow + sparkles
 *    7. FinishVisual       — 6-layer celebration (aurora + rays + rings + star + ...)
 * ===================================================================================== */

// -------------------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------------------

/** Soft blurred glow approximation using a radial gradient. */
private fun DrawScope.glow(
    cx: Float,
    cy: Float,
    r: Float,
    color: Color,
    alpha: Float,
) {
    drawCircle(
        brush = Brush.radialGradient(
            colors = listOf(color.copy(alpha = alpha), color.copy(alpha = 0f)),
            center = Offset(cx, cy),
            radius = r,
        ),
        center = Offset(cx, cy),
        radius = r,
    )
}

/** Filled + stroked circle in one call. */
private fun DrawScope.fillStrokeCircle(
    cx: Float,
    cy: Float,
    r: Float,
    fill: Color,
    stroke: Color,
    strokeWidth: Float,
) {
    drawCircle(fill, r, Offset(cx, cy))
    drawCircle(stroke, r, Offset(cx, cy), style = Stroke(width = strokeWidth))
}

/** Filled + stroked oval in one call. */
private fun DrawScope.fillStrokeOval(
    cx: Float,
    cy: Float,
    rx: Float,
    ry: Float,
    fill: Color,
    stroke: Color,
    strokeWidth: Float,
) {
    val tl = Offset(cx - rx, cy - ry)
    val sz = Size(2f * rx, 2f * ry)
    drawOval(fill, topLeft = tl, size = sz)
    drawOval(stroke, topLeft = tl, size = sz, style = Stroke(width = strokeWidth))
}

/** Filled + stroked rounded rect in one call. */
private fun DrawScope.fillStrokeRoundRect(
    left: Float,
    top: Float,
    width: Float,
    height: Float,
    cornerRadius: Float,
    fill: Color,
    stroke: Color,
    strokeWidth: Float,
) {
    val tl = Offset(left, top)
    val sz = Size(width, height)
    val cr = CornerRadius(cornerRadius, cornerRadius)
    drawRoundRect(fill, topLeft = tl, size = sz, cornerRadius = cr)
    drawRoundRect(stroke, topLeft = tl, size = sz, cornerRadius = cr, style = Stroke(width = strokeWidth))
}

/** 0..1..0 sine pulse with an optional phase offset (in [0,1)). */
private fun pulse(phase: Float, offset: Float): Float {
    val p = ((phase + offset) % 1f + 1f) % 1f
    return sin(p * PI.toFloat()).coerceIn(-1f, 1f)
}

/** Staggered triangle-wave progress for "draw then undraw" checkmark strokes. */
private fun checkProgress(phase: Float): Float = when {
    phase < 0.15f -> 0f
    phase < 0.50f -> (phase - 0.15f) / 0.35f
    phase < 0.85f -> 1f
    else -> 1f - (phase - 0.85f) / 0.15f
}

/** Scales the draw scope into a 200x200 logical space. */
private fun DrawScope.withLogicalSpace(block: DrawScope.() -> Unit) {
    val s = size.minDimension / 200f
    scale(s, s, pivot = Offset.Zero, block = block)
}

// =====================================================================================
// 1. WelcomeVisual — pulsing rings + orbits + sparkles (no central logo)
// =====================================================================================
@Composable
fun WelcomeVisual() {
    val palette = LocalWizardPalette.current
    val primary = palette.primary
    val tertiary = TertiaryPink
    val warn = WarnAmber
    val secondary = SecondaryLavender

    val infinite = rememberInfiniteTransition(label = "welcome")
    val pulsePhase by infinite.animateFloat(
        initialValue = 0f, targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(3000, easing = LinearEasing)),
        label = "pulse",
    )
    val orbit1 by infinite.animateFloat(
        initialValue = 0f, targetValue = 360f,
        animationSpec = infiniteRepeatable(tween(8000, easing = LinearEasing)),
        label = "orbit1",
    )
    val orbit2 by infinite.animateFloat(
        initialValue = 360f, targetValue = 0f,
        animationSpec = infiniteRepeatable(tween(12000, easing = LinearEasing)),
        label = "orbit2",
    )
    val twinklePhase by infinite.animateFloat(
        initialValue = 0f, targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(1800, easing = LinearEasing)),
        label = "twinkle",
    )

    Canvas(modifier = Modifier.size(200.dp)) {
        withLogicalSpace {
            val cx = 100f
            val cy = 100f

            // Soft glow behind everything
            glow(cx, cy, 60f, primary, 0.25f)

            // 4 concentric pulsing rings
            val rings = listOf(
                floatArrayOf(80f, 1.5f, 0.00f, 0.30f, 0.40f),
                floatArrayOf(62f, 2.0f, 0.13f, 0.45f, 0.25f),
                floatArrayOf(44f, 2.0f, 0.26f, 0.60f, 0.15f),
                floatArrayOf(26f, 2.5f, 0.39f, 0.75f, 0.00f),
            )
            rings.forEach { spec ->
                val r = spec[0]; val sw = spec[1]; val off = spec[2]
                val baseA = spec[3]; val deltaA = spec[4]
                val f = pulse(pulsePhase, off)
                val alpha = baseA + deltaA * f
                val sr = r * (0.9f + 0.2f * f)
                drawCircle(
                    color = primary.copy(alpha = alpha),
                    radius = sr,
                    center = Offset(cx, cy),
                    style = Stroke(width = sw),
                )
            }

            // Inner orbit (3 dots, faster)
            rotate(orbit1, pivot = Offset(cx, cy)) {
                drawCircle(primary, 5f, Offset(100f, 44f))
                drawCircle(tertiary, 4f, Offset(148.5f, 128f))
                drawCircle(warn, 4f, Offset(51.5f, 128f))
            }

            // Outer orbit (4 dots, slower, reverse)
            rotate(orbit2, pivot = Offset(cx, cy)) {
                drawCircle(secondary, 3f, Offset(100f, 24f))
                drawCircle(primary.copy(alpha = 0.7f), 3f, Offset(176f, 100f))
                drawCircle(tertiary.copy(alpha = 0.7f), 3f, Offset(100f, 176f))
                drawCircle(warn.copy(alpha = 0.7f), 3f, Offset(24f, 100f))
            }

            // 6 ambient twinkling sparkles
            val sparkles = listOf(
                Sparkle(36f, 50f, 2.5f, primary),
                Sparkle(168f, 60f, 2.0f, tertiary),
                Sparkle(40f, 158f, 2.0f, warn),
                Sparkle(164f, 150f, 2.5f, primary),
                Sparkle(100f, 20f, 1.8f, secondary),
                Sparkle(100f, 180f, 1.8f, primary),
            )
            sparkles.forEachIndexed { i, sp ->
                val f = pulse(twinklePhase, i * 0.17f)
                val alpha = 0.15f + 0.85f * f
                val sr = sp.r * (0.5f + 0.7f * f)
                drawCircle(sp.color.copy(alpha = alpha), sr, Offset(sp.x, sp.y))
            }
        }
    }
}

private data class Sparkle(val x: Float, val y: Float, val r: Float, val color: Color)

// =====================================================================================
// 2. ThemeVisual — orbiting color dots around a central palette swatch
// =====================================================================================
@Composable
fun ThemeVisual() {
    val palette = LocalWizardPalette.current
    val primary = palette.primary
    val primaryContainer = palette.primaryContainer
    val tertiary = TertiaryPink
    val warn = WarnAmber
    val secondary = SecondaryLavender

    val infinite = rememberInfiniteTransition(label = "theme")
    val orbit1 by infinite.animateFloat(
        0f, 360f, infiniteRepeatable(tween(9000, easing = LinearEasing)), "o1",
    )
    val orbit2 by infinite.animateFloat(
        360f, 0f, infiniteRepeatable(tween(12000, easing = LinearEasing)), "o2",
    )
    val breathePhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(3400, easing = LinearEasing)), "breathe",
    )

    Canvas(modifier = Modifier.size(200.dp)) {
        withLogicalSpace {
            glow(100f, 100f, 48f, primary, 0.25f)

            // Inner orbit (3 dots)
            rotate(orbit1, pivot = Offset(100f, 100f)) {
                drawCircle(primary, 7f, Offset(100f, 56f))
                drawCircle(tertiary, 6f, Offset(138f, 122f))
                drawCircle(warn, 6f, Offset(62f, 122f))
            }

            // Outer orbit (4 dots, reverse)
            rotate(orbit2, pivot = Offset(100f, 100f)) {
                drawCircle(secondary, 4f, Offset(100f, 32f))
                drawCircle(primary.copy(alpha = 0.7f), 4f, Offset(160f, 100f))
                drawCircle(tertiary.copy(alpha = 0.7f), 4f, Offset(100f, 168f))
                drawCircle(warn.copy(alpha = 0.7f), 4f, Offset(40f, 100f))
            }

            // Central swatch — breathing scale
            val f = pulse(breathePhase, 0f)
            val s = 1f + 0.06f * f
            scale(s, s, pivot = Offset(100f, 100f)) {
                fillStrokeRoundRect(
                    left = 76f, top = 76f, width = 48f, height = 48f,
                    cornerRadius = 14f,
                    fill = primaryContainer, stroke = primary, strokeWidth = 2f,
                )
                drawCircle(primary, 12f, Offset(100f, 100f))
            }
        }
    }
}

// =====================================================================================
// 3. FolderVisual — tall folder with floating file cards; success badge when selected
// =====================================================================================
@Composable
fun FolderVisual(selected: Boolean = false) {
    val palette = LocalWizardPalette.current
    val primary = palette.primary
    val primaryContainer = palette.primaryContainer
    val onPrimary = palette.onPrimary
    val bg = palette.background
    val surface3 = palette.surface3
    val surface4 = palette.surface4
    val surface5 = palette.surface5
    val tertiary = TertiaryPink
    val warn = WarnAmber

    val infinite = rememberInfiniteTransition(label = "folder")
    val bobPhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(3600, easing = LinearEasing)), "bob",
    )
    val cardPhase1 by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(4000, easing = LinearEasing)), "c1",
    )
    val cardPhase2 by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(4500, easing = LinearEasing)), "c2",
    )
    val cardPhase3 by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(5000, easing = LinearEasing)), "c3",
    )
    val sparklePhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2000, easing = LinearEasing)), "sp",
    )

    // Pop-in scale for the success badge (0 → 1.2 → 1, reversed when deselected)
    val badgeScale by animateFloatAsState(
        targetValue = if (selected) 1f else 0f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessLow,
        ),
        label = "badge",
    )

    val folderBack = remember {
        Path().apply {
            moveTo(36f, 104f)
            lineTo(36f, 174f)
            quadraticBezierTo(36f, 180f, 42f, 180f)
            lineTo(158f, 180f)
            quadraticBezierTo(164f, 180f, 164f, 174f)
            lineTo(164f, 110f)
            lineTo(92f, 110f)
            lineTo(84f, 104f)
            close()
        }
    }
    val folderFront = remember {
        Path().apply {
            moveTo(36f, 120f)
            lineTo(84f, 120f)
            lineTo(92f, 126f)
            lineTo(164f, 126f)
            lineTo(164f, 174f)
            quadraticBezierTo(164f, 180f, 158f, 180f)
            lineTo(42f, 180f)
            quadraticBezierTo(36f, 180f, 36f, 174f)
            close()
        }
    }

    Canvas(modifier = Modifier.size(200.dp)) {
        withLogicalSpace {
            glow(100f, 145f, 64f, primary, 0.22f)

            // Back card 3 (left, behind folder)
            val f3 = pulse(cardPhase3, 0f)
            translate(-1f * f3, -12f * f3) {
                rotate(-2f + 2f * f3, pivot = Offset(72f, 63f)) {
                    fillStrokeRoundRect(
                        left = 54f, top = 40f, width = 36f, height = 46f,
                        cornerRadius = 4f,
                        fill = surface3, stroke = primary, strokeWidth = 1.2f,
                    )
                    drawRoundRect(
                        color = primary.copy(alpha = 0.6f),
                        topLeft = Offset(60f, 48f), size = Size(24f, 3f),
                        cornerRadius = CornerRadius(1.5f, 1.5f),
                    )
                    drawRoundRect(
                        color = primary.copy(alpha = 0.4f),
                        topLeft = Offset(60f, 54f), size = Size(20f, 3f),
                        cornerRadius = CornerRadius(1.5f, 1.5f),
                    )
                    drawRoundRect(
                        color = primary.copy(alpha = 0.4f),
                        topLeft = Offset(60f, 60f), size = Size(22f, 3f),
                        cornerRadius = CornerRadius(1.5f, 1.5f),
                    )
                }
            }

            // Back card 2 (right, behind folder)
            val f2 = pulse(cardPhase2, 0f)
            translate(3f * f2, -10f * f2) {
                rotate(4f + 2f * f2, pivot = Offset(128f, 55f)) {
                    fillStrokeRoundRect(
                        left = 110f, top = 32f, width = 36f, height = 46f,
                        cornerRadius = 4f,
                        fill = surface4, stroke = tertiary, strokeWidth = 1.2f,
                    )
                    drawRoundRect(
                        color = tertiary.copy(alpha = 0.7f),
                        topLeft = Offset(116f, 40f), size = Size(24f, 3f),
                        cornerRadius = CornerRadius(1.5f, 1.5f),
                    )
                    drawRoundRect(
                        color = tertiary.copy(alpha = 0.5f),
                        topLeft = Offset(116f, 46f), size = Size(20f, 3f),
                        cornerRadius = CornerRadius(1.5f, 1.5f),
                    )
                    drawRoundRect(
                        color = tertiary.copy(alpha = 0.5f),
                        topLeft = Offset(116f, 52f), size = Size(22f, 3f),
                        cornerRadius = CornerRadius(1.5f, 1.5f),
                    )
                }
            }

            // Folder body — bob + slight rotate, pivot at (100, 145)
            val fb = pulse(bobPhase, 0f)
            translate(0f, -4f * fb) {
                rotate(-1f * fb, pivot = Offset(100f, 145f)) {
                    // Folder back (container fill)
                    drawPath(folderBack, color = primaryContainer)
                    drawPath(
                        folderBack, color = primary,
                        style = Stroke(width = 2f, join = StrokeJoin.Round),
                    )
                    // Folder front flap (primary fill)
                    drawPath(folderFront, color = primary.copy(alpha = 0.92f))
                    drawPath(
                        folderFront, color = primary,
                        style = Stroke(width = 2f, join = StrokeJoin.Round),
                    )
                    // Highlight on the flap
                    drawLine(
                        color = onPrimary.copy(alpha = 0.35f),
                        start = Offset(44f, 124f), end = Offset(80f, 124f),
                        strokeWidth = 2f, cap = StrokeCap.Round,
                    )
                    // Content lines (suggesting files inside)
                    drawLine(
                        color = onPrimary.copy(alpha = 0.20f),
                        start = Offset(52f, 142f), end = Offset(148f, 142f),
                        strokeWidth = 1.5f, cap = StrokeCap.Round,
                    )
                    drawLine(
                        color = onPrimary.copy(alpha = 0.15f),
                        start = Offset(52f, 152f), end = Offset(130f, 152f),
                        strokeWidth = 1.5f, cap = StrokeCap.Round,
                    )
                    drawLine(
                        color = onPrimary.copy(alpha = 0.12f),
                        start = Offset(52f, 162f), end = Offset(140f, 162f),
                        strokeWidth = 1.5f, cap = StrokeCap.Round,
                    )
                }
            }

            // Front card 1 (in front of folder)
            val f1 = pulse(cardPhase1, 0f)
            translate(-2f * f1, -8f * f1) {
                rotate(-6f - 2f * f1, pivot = Offset(100f, 81f)) {
                    fillStrokeRoundRect(
                        left = 82f, top = 58f, width = 36f, height = 46f,
                        cornerRadius = 4f,
                        fill = surface5, stroke = primary, strokeWidth = 1.4f,
                    )
                    drawCircle(warn.copy(alpha = 0.8f), 5f, Offset(100f, 70f))
                    drawRoundRect(
                        color = primary.copy(alpha = 0.7f),
                        topLeft = Offset(88f, 80f), size = Size(24f, 3f),
                        cornerRadius = CornerRadius(1.5f, 1.5f),
                    )
                    drawRoundRect(
                        color = primary.copy(alpha = 0.5f),
                        topLeft = Offset(88f, 86f), size = Size(18f, 3f),
                        cornerRadius = CornerRadius(1.5f, 1.5f),
                    )
                    drawRoundRect(
                        color = primary.copy(alpha = 0.5f),
                        topLeft = Offset(88f, 92f), size = Size(22f, 3f),
                        cornerRadius = CornerRadius(1.5f, 1.5f),
                    )
                }
            }

            // Success checkmark badge (only when selected)
            if (badgeScale > 0.01f) {
                scale(badgeScale, badgeScale, pivot = Offset(150f, 110f)) {
                    fillStrokeCircle(
                        cx = 150f, cy = 110f, r = 18f,
                        fill = primary, stroke = bg, strokeWidth = 3f,
                    )
                    drawLine(
                        color = onPrimary,
                        start = Offset(142f, 110f),
                        end = Offset(148f, 116f),
                        strokeWidth = 3.5f, cap = StrokeCap.Round,
                    )
                    drawLine(
                        color = onPrimary,
                        start = Offset(148f, 116f),
                        end = Offset(158f, 106f),
                        strokeWidth = 3.5f, cap = StrokeCap.Round,
                    )
                }
            }

            // 3 sparkles
            val sparks = listOf(
                Sparkle(28f, 80f, 2.5f, primary),
                Sparkle(176f, 90f, 2.0f, tertiary),
                Sparkle(174f, 36f, 1.8f, warn),
            )
            sparks.forEachIndexed { i, sp ->
                val f = pulse(sparklePhase, i * 0.35f)
                val alpha = 0.2f + 0.7f * f
                drawCircle(sp.color.copy(alpha = alpha), sp.r, Offset(sp.x, sp.y))
            }
        }
    }
}

// =====================================================================================
// 4. PermissionsVisual — shield + ripples + dashed orbits + animated checkmark
// =====================================================================================
@Composable
fun PermissionsVisual() {
    val palette = LocalWizardPalette.current
    val primary = palette.primary
    val primaryContainer = palette.primaryContainer
    val tertiary = TertiaryPink
    val warn = WarnAmber
    val secondary = SecondaryLavender

    val infinite = rememberInfiniteTransition(label = "perms")
    val ripplePhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2800, easing = LinearEasing)), "ripple",
    )
    val dash1 by infinite.animateFloat(
        0f, 360f, infiniteRepeatable(tween(14000, easing = LinearEasing)), "d1",
    )
    val dash2 by infinite.animateFloat(
        360f, 0f, infiniteRepeatable(tween(20000, easing = LinearEasing)), "d2",
    )
    val particlePhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(6000, easing = LinearEasing)), "part",
    )
    val shieldFloat by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(3400, easing = LinearEasing)), "shield",
    )
    val checkPhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2400, easing = LinearEasing)), "check",
    )

    val shieldPath = remember {
        Path().apply {
            moveTo(100f, 56f)
            lineTo(138f, 70f)
            lineTo(138f, 104f)
            quadraticBezierTo(138f, 134f, 100f, 150f)
            quadraticBezierTo(62f, 134f, 62f, 104f)
            lineTo(62f, 70f)
            close()
        }
    }
    val shieldInner = remember {
        Path().apply {
            moveTo(100f, 62f)
            lineTo(132f, 74f)
            lineTo(132f, 104f)
            quadraticBezierTo(132f, 129f, 100f, 143f)
            quadraticBezierTo(68f, 129f, 68f, 104f)
            lineTo(68f, 74f)
            close()
        }
    }
    val checkPath = remember {
        Path().apply {
            moveTo(84f, 100f)
            lineTo(95f, 112f)
            lineTo(118f, 88f)
        }
    }
    val checkMeasure = remember(checkPath) {
        PathMeasure().apply { setPath(checkPath, false) }
    }

    Canvas(modifier = Modifier.size(200.dp)) {
        withLogicalSpace {
            glow(100f, 100f, 60f, primary, 0.22f)

            // Rotating dashed rings
            rotate(dash1, pivot = Offset(100f, 100f)) {
                drawCircle(
                    color = primary.copy(alpha = 0.25f),
                    radius = 78f, center = Offset(100f, 100f),
                    style = Stroke(width = 1.5f, pathEffect = PathEffect.dashPathEffect(floatArrayOf(4f, 8f))),
                )
            }
            rotate(dash2, pivot = Offset(100f, 100f)) {
                drawCircle(
                    color = tertiary.copy(alpha = 0.3f),
                    radius = 68f, center = Offset(100f, 100f),
                    style = Stroke(width = 1f, pathEffect = PathEffect.dashPathEffect(floatArrayOf(2f, 6f))),
                )
            }

            // 6 floating particles (drift via combined sine waves)
            val particles = listOf(
                Sparkle(40f, 60f, 2f, primary),
                Sparkle(160f, 50f, 1.8f, tertiary),
                Sparkle(170f, 140f, 2f, warn),
                Sparkle(34f, 150f, 1.8f, primary),
                Sparkle(100f, 28f, 1.5f, secondary),
                Sparkle(100f, 172f, 1.5f, primary),
            )
            particles.forEachIndexed { i, p ->
                val ph = (particlePhase + i * 0.16f) % 1f
                val dx = 6f * sin(ph * 2f * PI.toFloat())
                val dy = -8f + 4f * sin(ph * 4f * PI.toFloat())
                val alpha = 0.3f + 0.5f * (0.5f + 0.5f * sin(ph * 2f * PI.toFloat()))
                drawCircle(
                    color = p.color.copy(alpha = alpha),
                    radius = p.r,
                    center = Offset(p.x + dx, p.y + dy),
                )
            }

            // 3 expanding ripple rings (staggered)
            val ringColors = listOf(primary, primary, primary)
            ringColors.forEachIndexed { i, c ->
                val ph = (ripplePhase + i * 0.32f) % 1f
                val scaleR = 0.5f + 1.3f * ph
                val alpha = (0.7f * (1f - ph)).coerceAtLeast(0f)
                drawCircle(
                    color = c.copy(alpha = alpha),
                    radius = 48f * scaleR,
                    center = Offset(100f, 100f),
                    style = Stroke(width = 2f),
                )
            }

            // Shield — floating up/down
            val f = pulse(shieldFloat, 0f)
            translate(0f, -4f * f) {
                drawPath(shieldPath, color = primaryContainer)
                drawPath(
                    shieldPath, color = primary,
                    style = Stroke(width = 2.5f, join = StrokeJoin.Round),
                )
                drawPath(
                    shieldInner, color = primary.copy(alpha = 0.3f),
                    style = Stroke(width = 1f, join = StrokeJoin.Round),
                )

                // Animated checkmark draw (segment of the path)
                val progress = checkProgress(checkPhase)
                if (progress > 0f) {
                    val totalLen = checkMeasure.length
                    val subPath = Path()
                    checkMeasure.getSegment(0f, totalLen * progress, subPath, true)
                    drawPath(
                        subPath, color = primary,
                        style = Stroke(width = 4f, cap = StrokeCap.Round, join = StrokeJoin.Round),
                    )
                }
            }
        }
    }
}

// =====================================================================================
// 5. RestoreVisual — cloud + falling data particles + filling tray
// =====================================================================================
@Composable
fun RestoreVisual() {
    val palette = LocalWizardPalette.current
    val primary = palette.primary
    val primaryContainer = palette.primaryContainer
    val bg = palette.background
    val surface3 = palette.surface3
    val tertiary = TertiaryPink
    val warn = WarnAmber
    val secondary = SecondaryLavender

    val infinite = rememberInfiniteTransition(label = "restore")
    val bgPulse by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(4000, easing = LinearEasing)), "bg",
    )
    val bgDash by infinite.animateFloat(
        0f, 360f, infiniteRepeatable(tween(18000, easing = LinearEasing)), "bgDash",
    )
    val cloudFloat by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(4000, easing = LinearEasing)), "cloud",
    )
    val dropPhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2000, easing = LinearEasing)), "drop",
    )
    val trayBreathe by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2000, easing = LinearEasing)), "tray",
    )
    val fillPhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2000, easing = LinearEasing)), "fill",
    )

    // Tray paths
    val trayOuter = remember {
        Path().apply {
            moveTo(50f, 142f)
            lineTo(60f, 172f)
            lineTo(140f, 172f)
            lineTo(150f, 142f)
            close()
        }
    }
    val trayFill = remember {
        Path().apply {
            moveTo(56f, 148f)
            lineTo(62f, 168f)
            lineTo(138f, 168f)
            lineTo(144f, 148f)
            close()
        }
    }

    Canvas(modifier = Modifier.size(200.dp)) {
        withLogicalSpace {
            // Background rings (behind cloud)
            val bp = pulse(bgPulse, 0f)
            val bgScale = 0.85f + 0.25f * bp
            val bgAlpha = 0.12f + 0.13f * bp
            drawCircle(
                color = primary.copy(alpha = bgAlpha),
                radius = 78f * bgScale,
                center = Offset(100f, 72f),
                style = Stroke(width = 1.5f),
            )
            rotate(bgDash, pivot = Offset(100f, 72f)) {
                drawCircle(
                    color = tertiary.copy(alpha = 0.22f),
                    radius = 66f, center = Offset(100f, 72f),
                    style = Stroke(width = 1f, pathEffect = PathEffect.dashPathEffect(floatArrayOf(3f, 7f))),
                )
            }

            glow(100f, 68f, 52f, primary, 0.2f)

            // Cloud — float up/down
            val cf = pulse(cloudFloat, 0f)
            translate(0f, -6f * cf) {
                // Shadow ellipse (semi-transparent)
                drawOval(
                    color = Color.Black.copy(alpha = 0.18f),
                    topLeft = Offset(52f, 80f),
                    size = Size(96f, 16f),
                )
                // 3 puffs
                fillStrokeOval(68f, 72f, 22f, 20f, surface3, primary, 1.5f)
                fillStrokeOval(100f, 58f, 32f, 26f, surface3, primary, 1.5f)
                fillStrokeOval(132f, 72f, 22f, 20f, surface3, primary, 1.5f)
                // Bottom bar
                fillStrokeRoundRect(
                    left = 56f, top = 72f, width = 88f, height = 20f,
                    cornerRadius = 10f,
                    fill = surface3, stroke = primary, strokeWidth = 1.5f,
                )
                // Highlights on puffs
                drawOval(
                    color = bg.copy(alpha = 0.25f),
                    topLeft = Offset(80f, 45f), size = Size(24f, 10f),
                )
                drawOval(
                    color = bg.copy(alpha = 0.15f),
                    topLeft = Offset(56f, 61f), size = Size(16f, 6f),
                )
                drawOval(
                    color = bg.copy(alpha = 0.15f),
                    topLeft = Offset(120f, 61f), size = Size(16f, 6f),
                )
            }

            // 6 falling data particles (staggered)
            val drops = listOf(
                Drop(68f, 96f, primary, shape = DropShape.Rect, rot = 10f),
                Drop(88f, 98f, tertiary, shape = DropShape.Circle, rot = 0f),
                Drop(108f, 96f, warn, shape = DropShape.Rect, rot = -10f),
                Drop(128f, 98f, primary, shape = DropShape.Circle, rot = 0f, alpha = 0.85f),
                Drop(78f, 96f, secondary, shape = DropShape.RectSmall, rot = 5f),
                Drop(118f, 98f, tertiary, shape = DropShape.Circle, rot = 0f, alpha = 0.8f),
            )
            drops.forEachIndexed { i, d ->
                val ph = (dropPhase + i * 0.15f) % 1f
                val dy = 58f * ph
                val alpha = when {
                    ph < 0.15f -> ph / 0.15f
                    ph < 0.85f -> 1f
                    else -> (1f - ph) / 0.15f
                } * d.alpha
                val color = d.color.copy(alpha = alpha)
                translate(0f, dy) {
                    when (d.shape) {
                        DropShape.Rect -> {
                            rotate(d.rot, pivot = Offset(d.x + 3.5f, d.y + 5f)) {
                                fillStrokeRoundRect(
                                    left = d.x, top = d.y, width = 7f, height = 10f,
                                    cornerRadius = 2f,
                                    fill = color, stroke = color, strokeWidth = 0f,
                                )
                            }
                        }
                        DropShape.RectSmall -> {
                            rotate(d.rot, pivot = Offset(d.x + 3f, d.y + 4.5f)) {
                                fillStrokeRoundRect(
                                    left = d.x, top = d.y, width = 6f, height = 9f,
                                    cornerRadius = 2f,
                                    fill = color, stroke = color, strokeWidth = 0f,
                                )
                            }
                        }
                        DropShape.Circle -> drawCircle(color, 3.5f, Offset(d.x, d.y))
                    }
                }
            }

            // Tray glow
            val tg = pulse(trayBreathe, 0f)
            glow(100f, 158f, 36f, primary, 0.3f + 0.4f * tg)

            // Tray — slight vertical breathe
            val ts = 1f + 0.05f * tg
            scale(1f, ts, pivot = Offset(100f, 172f)) {
                // Outer trapezoid
                drawPath(trayOuter, color = primaryContainer)
                drawPath(
                    trayOuter, color = primary,
                    style = Stroke(width = 2f, join = StrokeJoin.Round),
                )
                // Inner fill (rising)
                val fs = 0.2f + 0.8f * fillPhase
                scale(1f, fs, pivot = Offset(100f, 168f)) {
                    drawPath(trayFill, color = primary.copy(alpha = 0.5f))
                }
                // Top rim highlight
                drawLine(
                    color = primary.copy(alpha = 0.7f),
                    start = Offset(52f, 144f), end = Offset(148f, 144f),
                    strokeWidth = 2.5f, cap = StrokeCap.Round,
                )
                // Collected indicator dots
                drawCircle(primary.copy(alpha = 0.6f), 2f, Offset(80f, 160f))
                drawCircle(primary.copy(alpha = 0.8f), 2.5f, Offset(100f, 162f))
                drawCircle(primary.copy(alpha = 0.6f), 2f, Offset(120f, 160f))
            }
        }
    }
}

private enum class DropShape { Rect, RectSmall, Circle }
private data class Drop(
    val x: Float,
    val y: Float,
    val color: Color,
    val shape: DropShape,
    val rot: Float = 0f,
    val alpha: Float = 1f,
)

// =====================================================================================
// 6. SummaryVisual — growing bar chart + trend arrow + sparkles
// =====================================================================================
@Composable
fun SummaryVisual() {
    val palette = LocalWizardPalette.current
    val primary = palette.primary
    val tertiary = TertiaryPink
    val warn = WarnAmber

    val infinite = rememberInfiniteTransition(label = "summary")
    val trendBob by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2600, easing = LinearEasing)), "trend",
    )
    val sparklePhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2000, easing = LinearEasing)), "sp",
    )

    // One-shot grow-in for bars (staggered)
    val bar1 = remember { Animatable(0f) }
    val bar2 = remember { Animatable(0f) }
    val bar3 = remember { Animatable(0f) }
    val bar4 = remember { Animatable(0f) }
    LaunchedEffect(Unit) {
        bar1.animateTo(1f, tween(1400, delayMillis = 100))
    }
    LaunchedEffect(Unit) {
        bar2.animateTo(1f, tween(1400, delayMillis = 250))
    }
    LaunchedEffect(Unit) {
        bar3.animateTo(1f, tween(1400, delayMillis = 400))
    }
    LaunchedEffect(Unit) {
        bar4.animateTo(1f, tween(1400, delayMillis = 550))
    }

    Canvas(modifier = Modifier.size(200.dp)) {
        withLogicalSpace {
            glow(100f, 120f, 52f, primary, 0.2f)

            // Baseline
            drawLine(
                color = palette.surface5,
                start = Offset(40f, 160f), end = Offset(160f, 160f),
                strokeWidth = 1.5f, cap = StrokeCap.Round,
            )

            // 4 bars — staggered grow-in (scaleY from bottom)
            val bars = listOf(
                BarSpec(48f, 130f, 18f, 30f, primary.copy(alpha = 0.7f), bar1.value),
                BarSpec(76f, 112f, 18f, 48f, primary.copy(alpha = 0.85f), bar2.value),
                BarSpec(104f, 92f, 18f, 68f, tertiary, bar3.value),
                BarSpec(132f, 74f, 18f, 86f, primary, bar4.value),
            )
            bars.forEach { b ->
                scale(1f, b.progress, pivot = Offset(b.x + b.w / 2f, 160f)) {
                    drawRoundRect(
                        color = b.color,
                        topLeft = Offset(b.x, b.y),
                        size = Size(b.w, b.h),
                        cornerRadius = CornerRadius(3f, 3f),
                    )
                }
            }

            // Trend arrow line — bobbing
            val tb = pulse(trendBob, 0f)
            translate(0f, -5f * tb) {
                val trendColor = warn
                // Polyline through bar tops
                val pts = listOf(Offset(52f, 122f), Offset(82f, 104f), Offset(112f, 84f), Offset(140f, 64f))
                for (i in 0 until pts.size - 1) {
                    drawLine(
                        color = trendColor,
                        start = pts[i], end = pts[i + 1],
                        strokeWidth = 2.4f, cap = StrokeCap.Round,
                    )
                }
                // Arrowhead corner
                drawLine(trendColor, Offset(130f, 64f), Offset(142f, 64f), strokeWidth = 2.4f, cap = StrokeCap.Round)
                drawLine(trendColor, Offset(142f, 64f), Offset(142f, 76f), strokeWidth = 2.4f, cap = StrokeCap.Round)
                // Trend dot
                drawCircle(trendColor, 4f, Offset(140f, 64f))
            }

            // 3 sparkles
            val sparks = listOf(
                Sparkle(36f, 60f, 2.5f, primary),
                Sparkle(170f, 92f, 2.0f, tertiary),
                Sparkle(160f, 40f, 2.0f, warn),
            )
            sparks.forEachIndexed { i, sp ->
                val f = pulse(sparklePhase, i * 0.35f)
                val alpha = 0.2f + 0.8f * f
                val sr = sp.r * (0.6f + 0.5f * f)
                drawCircle(sp.color.copy(alpha = alpha), sr, Offset(sp.x, sp.y))
            }
        }
    }
}

private data class BarSpec(
    val x: Float, val y: Float, val w: Float, val h: Float,
    val color: Color, val progress: Float,
)

// =====================================================================================
// 7. FinishVisual — 6-layer celebration
//    aurora glow + rotating light rays + expanding rings + star burst badge
//    with animated checkmark + drifting sparkles + falling confetti
// =====================================================================================
@Composable
fun FinishVisual() {
    val palette = LocalWizardPalette.current
    val primary = palette.primary
    val onPrimary = palette.onPrimary
    val bg = palette.background
    val tertiary = TertiaryPink
    val warn = WarnAmber
    val secondary = SecondaryLavender

    val infinite = rememberInfiniteTransition(label = "finish")
    val auroraPhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(6000, easing = LinearEasing)), "aurora",
    )
    val raysRotate by infinite.animateFloat(
        0f, 360f, infiniteRepeatable(tween(24000, easing = LinearEasing)), "rays",
    )
    val ringPhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2800, easing = LinearEasing)), "ring",
    )
    val starPulse by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2000, easing = LinearEasing)), "star",
    )
    val checkPhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2400, easing = LinearEasing)), "check",
    )
    val sparkDrift by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(3000, easing = LinearEasing)), "spark",
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
        withLogicalSpace {
            // ---- Layer 1: Aurora glow (3 blobs, slow scale + rotate) ----
            val ap = auroraPhase
            val auroraScale = 1f + 0.1f * sin(ap * 2f * PI.toFloat())
            val auroraRot = 360f * ap
            rotate(auroraRot, pivot = Offset(100f, 100f)) {
                scale(auroraScale, auroraScale, pivot = Offset(100f, 100f)) {
                    glow(100f, 100f, 80f, primary, 0.3f)
                    glow(70f, 80f, 40f, tertiary, 0.2f)
                    glow(130f, 120f, 40f, warn, 0.15f)
                }
            }

            // ---- Layer 2: 16 rotating light rays (alternating thick/thin) ----
            rotate(raysRotate, pivot = Offset(100f, 100f)) {
                for (i in 0 until 16) {
                    val angleDeg = i * 22.5f
                    val angleRad = angleDeg * PI.toFloat() / 180f
                    val isThick = i % 2 == 0
                    val r1 = 38f
                    val r2 = if (isThick) 88f else 76f
                    val x1 = 100f + cos(angleRad) * r1
                    val y1 = 100f + sin(angleRad) * r1
                    val x2 = 100f + cos(angleRad) * r2
                    val y2 = 100f + sin(angleRad) * r2
                    drawLine(
                        color = if (isThick) primary else tertiary,
                        start = Offset(x1, y1), end = Offset(x2, y2),
                        strokeWidth = if (isThick) 3f else 1.5f,
                        cap = StrokeCap.Round,
                        alpha = if (isThick) 0.45f else 0.2f,
                    )
                }
            }

            // ---- Layer 3: 6 expanding celebration rings (staggered) ----
            val ringSpecs = listOf(
                Triple(primary, 3f, 0.0f),
                Triple(tertiary, 2.5f, 0.143f),
                Triple(warn, 2f, 0.286f),
                Triple(primary, 2.5f, 0.429f),
                Triple(tertiary, 2f, 0.571f),
                Triple(warn, 1.5f, 0.714f),
            )
            ringSpecs.forEach { (color, sw, off) ->
                val ph = (ringPhase + off) % 1f
                val scaleR = 0.15f + 2.05f * ph
                val alpha = (1f - ph).coerceAtLeast(0f)
                drawCircle(
                    color = color.copy(alpha = alpha),
                    radius = 34f * scaleR,
                    center = Offset(100f, 100f),
                    style = Stroke(width = sw),
                )
            }

            // ---- Layer 4: 8-point star burst badge + animated checkmark ----
            val sp = pulse(starPulse, 0f)
            val starScale = 1f + 0.06f * sp
            scale(starScale, starScale, pivot = Offset(100f, 100f)) {
                // Outer glow ring
                glow(100f, 100f, 42f, primary, 0.15f)
                // 8 star burst points (short lines from r42 to r50)
                for (i in 0 until 8) {
                    val angleRad = (i * 45f) * PI.toFloat() / 180f
                    val x1 = 100f + cos(angleRad) * 42f
                    val y1 = 100f + sin(angleRad) * 42f
                    val x2 = 100f + cos(angleRad) * 50f
                    val y2 = 100f + sin(angleRad) * 50f
                    drawLine(
                        color = primary.copy(alpha = 0.6f),
                        start = Offset(x1, y1), end = Offset(x2, y2),
                        strokeWidth = 4f, cap = StrokeCap.Round,
                    )
                }
                // Main badge circle
                drawCircle(primary, 38f, Offset(100f, 100f))
                // Inner highlight stroke
                drawCircle(
                    color = bg.copy(alpha = 0.25f),
                    radius = 38f, center = Offset(100f, 100f),
                    style = Stroke(width = 2f),
                )
                // Inner top highlight
                drawOval(
                    color = bg.copy(alpha = 0.1f),
                    topLeft = Offset(78f, 68f), size = Size(44f, 44f),
                )
                // Animated checkmark (segment of the path)
                val progress = checkProgress(checkPhase)
                if (progress > 0f) {
                    val totalLen = checkMeasure.length
                    val subPath = Path()
                    checkMeasure.getSegment(0f, totalLen * progress, subPath, true)
                    drawPath(
                        subPath, color = onPrimary,
                        style = Stroke(width = 6f, cap = StrokeCap.Round, join = StrokeJoin.Round),
                    )
                }
            }

            // ---- Layer 5: 10 drifting sparkle particles ----
            val sparks = listOf(
                Sparkle(36f, 70f, 3f, primary),
                Sparkle(164f, 60f, 2.5f, tertiary),
                Sparkle(170f, 130f, 3f, warn),
                Sparkle(30f, 140f, 2.5f, primary),
                Sparkle(100f, 28f, 2.5f, tertiary),
                Sparkle(100f, 172f, 2.5f, warn),
                Sparkle(48f, 40f, 2f, secondary),
                Sparkle(152f, 160f, 2f, primary),
                Sparkle(20f, 100f, 2f, tertiary),
                Sparkle(180f, 100f, 2f, warn),
            )
            sparks.forEachIndexed { i, sp2 ->
                val ph = (sparkDrift + i * 0.1f) % 1f
                val dy = -32f * ph
                val scaleR = 0.3f + 1.0f * sin(ph * PI.toFloat()).coerceIn(0f, 1f)
                val alpha = when {
                    ph < 0.2f -> ph / 0.2f
                    ph < 0.8f -> 1f
                    else -> (1f - ph) / 0.2f
                }
                drawCircle(
                    color = sp2.color.copy(alpha = alpha),
                    radius = sp2.r * scaleR,
                    center = Offset(sp2.x, sp2.y + dy),
                )
            }

            // ---- Layer 6: 6 falling confetti pieces (staggered) ----
            val confetti = listOf(
                Confetti(48f, 20f, 5f, 5f, 20f, primary),
                Confetti(100f, 10f, 5f, 5f, -15f, tertiary),
                Confetti(152f, 18f, 5f, 5f, 45f, warn),
                Confetti(70f, 5f, 4f, 4f, -30f, secondary),
                Confetti(130f, 8f, 4f, 4f, 60f, primary),
                Confetti(30f, 15f, 4f, 4f, -45f, tertiary),
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
                            cornerRadius = CornerRadius(1f, 1f),
                        )
                    }
                }
            }
        }
    }
}

private data class Confetti(
    val x: Float, val y: Float, val w: Float, val h: Float,
    val initialRot: Float, val color: Color,
)
