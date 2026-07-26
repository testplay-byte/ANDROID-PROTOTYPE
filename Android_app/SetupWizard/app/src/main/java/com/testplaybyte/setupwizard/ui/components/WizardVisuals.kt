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
import androidx.compose.foundation.layout.size
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
 *  WizardVisuals.kt — polished, animated illustrations drawn with Compose Canvas.
 *
 *  7 self-contained 200x200dp visuals (one per wizard step) + 3 inline visuals
 *  (used by SetupWizardApp.kt). Each uses an InfiniteTransition driving cheap
 *  (transform + alpha only) draw operations inside a Canvas. All colors come
 *  from LocalWizardPalette + a handful of hardcoded accents. The Canvas is
 *  scaled so coordinates are written in a 200x200 logical space, keeping each
 *  visual compact and easy to read.
 *
 *  Visuals:
 *    1. WelcomeVisual      — 4 dramatic pulsing rings + 2 orbits + 6 twinkles
 *    2. ThemeVisual        — 2 counter-rotating orbits around breathing swatch
 *    3. FolderVisual       — tall folder + 3 floating file cards + bouncy badge
 *    4. PermissionsVisual  — big shield + 3 ripples + 2 dashed orbits + check
 *    5. RestoreVisual      — beautiful soft cloud + 6 data drops + glowing tray
 *    6. SummaryVisual      — 4 staggered growing bars + trend arrow + sparkles
 *    7. FinishVisual       — 6-layer celebration (aurora + rays + rings + ...)
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
// 1. WelcomeVisual — 4 dramatic pulsing rings + 2 orbits + 6 twinkling sparkles
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
        animationSpec = infiniteRepeatable(tween(2800, easing = LinearEasing)),
        label = "pulse",
    )
    val orbit1 by infinite.animateFloat(
        initialValue = 0f, targetValue = 360f,
        animationSpec = infiniteRepeatable(tween(7000, easing = LinearEasing)),
        label = "orbit1",
    )
    val orbit2 by infinite.animateFloat(
        initialValue = 360f, targetValue = 0f,
        animationSpec = infiniteRepeatable(tween(11000, easing = LinearEasing)),
        label = "orbit2",
    )
    val twinklePhase by infinite.animateFloat(
        initialValue = 0f, targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(1600, easing = LinearEasing)),
        label = "twinkle",
    )
    val breathPhase by infinite.animateFloat(
        initialValue = 0f, targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(3200, easing = LinearEasing)),
        label = "breath",
    )

    Canvas(modifier = Modifier.size(200.dp)) {
        withLogicalSpace {
            val cx = 100f
            val cy = 100f

            // Soft outer glow that breathes
            val bf = pulse(breathPhase, 0f)
            val glowAlpha = 0.22f + 0.18f * (0.5f + 0.5f * bf)
            glow(cx, cy, 72f, primary, glowAlpha)

            // 4 dramatic pulsing rings — wider amplitude + staggered phase
            val rings = listOf(
                // r,  strokeW, phaseOff, baseA, deltaA
                floatArrayOf(86f, 1.6f, 0.00f, 0.30f, 0.45f),
                floatArrayOf(66f, 2.2f, 0.18f, 0.42f, 0.35f),
                floatArrayOf(46f, 2.4f, 0.36f, 0.55f, 0.30f),
                floatArrayOf(28f, 2.8f, 0.54f, 0.70f, 0.20f),
            )
            rings.forEach { spec ->
                val r = spec[0]
                val sw = spec[1]
                val off = spec[2]
                val baseA = spec[3]
                val deltaA = spec[4]
                val f = pulse(pulsePhase, off)
                val alpha = (baseA + deltaA * f).coerceIn(0f, 1f)
                // More dramatic — radius oscillates between 0.78x and 1.22x
                val sr = r * (0.78f + 0.44f * f)
                drawCircle(
                    color = primary.copy(alpha = alpha),
                    radius = sr,
                    center = Offset(cx, cy),
                    style = Stroke(width = sw),
                )
            }

            // Inner orbit (3 dots, faster) — bigger & brighter
            rotate(orbit1, pivot = Offset(cx, cy)) {
                drawCircle(primary, 6f, Offset(100f, 42f))
                drawCircle(tertiary, 5f, Offset(150f, 130f))
                drawCircle(warn, 5f, Offset(50f, 130f))
                // Small trailing accent dots
                drawCircle(primary.copy(alpha = 0.4f), 2.5f, Offset(125f, 70f))
                drawCircle(tertiary.copy(alpha = 0.4f), 2.5f, Offset(75f, 70f))
            }

            // Outer orbit (4 dots, slower, reverse)
            rotate(orbit2, pivot = Offset(cx, cy)) {
                drawCircle(secondary, 3.5f, Offset(100f, 22f))
                drawCircle(primary.copy(alpha = 0.8f), 3.5f, Offset(178f, 100f))
                drawCircle(tertiary.copy(alpha = 0.8f), 3.5f, Offset(100f, 178f))
                drawCircle(warn.copy(alpha = 0.8f), 3.5f, Offset(22f, 100f))
            }

            // 6 ambient twinkling sparkles with varied sizes & phases
            val sparkles = listOf(
                Sparkle(36f, 50f, 3.0f, primary),
                Sparkle(168f, 60f, 2.5f, tertiary),
                Sparkle(40f, 158f, 2.5f, warn),
                Sparkle(164f, 150f, 3.0f, primary),
                Sparkle(100f, 18f, 2.0f, secondary),
                Sparkle(100f, 182f, 2.0f, primary),
            )
            sparkles.forEachIndexed { i, sp ->
                val f = pulse(twinklePhase, i * 0.17f)
                val alpha = 0.12f + 0.88f * f
                val sr = sp.r * (0.4f + 0.8f * f)
                // Twinkle cross (4-point star) for extra polish
                val cf = (0.5f + 0.5f * f).coerceIn(0f, 1f)
                drawCircle(sp.color.copy(alpha = alpha), sr, Offset(sp.x, sp.y))
                if (cf > 0.3f) {
                    drawLine(
                        color = sp.color.copy(alpha = alpha * 0.6f),
                        start = Offset(sp.x - sr * 2f, sp.y),
                        end = Offset(sp.x + sr * 2f, sp.y),
                        strokeWidth = 0.8f,
                        cap = StrokeCap.Round,
                    )
                    drawLine(
                        color = sp.color.copy(alpha = alpha * 0.6f),
                        start = Offset(sp.x, sp.y - sr * 2f),
                        end = Offset(sp.x, sp.y + sr * 2f),
                        strokeWidth = 0.8f,
                        cap = StrokeCap.Round,
                    )
                }
            }
        }
    }
}

private data class Sparkle(val x: Float, val y: Float, val r: Float, val color: Color)

// =====================================================================================
// 2. ThemeVisual — 2 counter-rotating orbits around a breathing palette swatch
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
        0f, 360f, infiniteRepeatable(tween(8000, easing = LinearEasing)), "o1",
    )
    val orbit2 by infinite.animateFloat(
        360f, 0f, infiniteRepeatable(tween(12000, easing = LinearEasing)), "o2",
    )
    val breathePhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(3000, easing = LinearEasing)), "breathe",
    )
    val sparklePhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2000, easing = LinearEasing)), "sp",
    )

    Canvas(modifier = Modifier.size(200.dp)) {
        withLogicalSpace {
            glow(100f, 100f, 52f, primary, 0.25f)

            // Outer dashed ring (slowly rotating)
            rotate(orbit2 * 0.5f, pivot = Offset(100f, 100f)) {
                drawCircle(
                    color = primary.copy(alpha = 0.18f),
                    radius = 82f, center = Offset(100f, 100f),
                    style = Stroke(width = 1.2f, pathEffect = PathEffect.dashPathEffect(floatArrayOf(4f, 10f))),
                )
            }

            // Inner orbit (3 big dots) — bigger & more colorful
            rotate(orbit1, pivot = Offset(100f, 100f)) {
                // Trailing comet effect (smaller fade dots)
                drawCircle(primary.copy(alpha = 0.25f), 4f, Offset(110f, 56f))
                drawCircle(primary.copy(alpha = 0.5f), 5f, Offset(105f, 56f))
                drawCircle(primary, 7.5f, Offset(100f, 56f))

                drawCircle(tertiary.copy(alpha = 0.5f), 4.5f, Offset(133f, 116f))
                drawCircle(tertiary, 6.5f, Offset(138f, 122f))

                drawCircle(warn.copy(alpha = 0.5f), 4.5f, Offset(67f, 116f))
                drawCircle(warn, 6.5f, Offset(62f, 122f))
            }

            // Outer orbit (4 dots, reverse)
            rotate(orbit2, pivot = Offset(100f, 100f)) {
                drawCircle(secondary, 4.5f, Offset(100f, 32f))
                drawCircle(primary.copy(alpha = 0.8f), 4.5f, Offset(160f, 100f))
                drawCircle(tertiary.copy(alpha = 0.8f), 4.5f, Offset(100f, 168f))
                drawCircle(warn.copy(alpha = 0.8f), 4.5f, Offset(40f, 100f))
            }

            // Central swatch — breathing scale (more dramatic)
            val f = pulse(breathePhase, 0f)
            val s = 1f + 0.10f * f
            scale(s, s, pivot = Offset(100f, 100f)) {
                // Outer ring around swatch
                drawCircle(
                    color = primary.copy(alpha = 0.4f),
                    radius = 36f, center = Offset(100f, 100f),
                    style = Stroke(width = 2f),
                )
                // Rounded square swatch
                fillStrokeRoundRect(
                    left = 72f, top = 72f, width = 56f, height = 56f,
                    cornerRadius = 16f,
                    fill = primaryContainer, stroke = primary, strokeWidth = 2.5f,
                )
                // Inner circle
                drawCircle(primary, 14f, Offset(100f, 100f))
                // Highlight
                drawOval(
                    color = primary.copy(alpha = 0.3f),
                    topLeft = Offset(82f, 80f), size = Size(20f, 12f),
                )
            }

            // 4 sparkles
            val sparks = listOf(
                Sparkle(36f, 60f, 2.5f, secondary),
                Sparkle(164f, 50f, 2.0f, tertiary),
                Sparkle(170f, 150f, 2.5f, primary),
                Sparkle(34f, 142f, 2.0f, warn),
            )
            sparks.forEachIndexed { i, sp ->
                val sf = pulse(sparklePhase, i * 0.25f)
                val alpha = 0.15f + 0.85f * sf
                val sr = sp.r * (0.5f + 0.6f * sf)
                drawCircle(sp.color.copy(alpha = alpha), sr, Offset(sp.x, sp.y))
            }
        }
    }
}

// =====================================================================================
// 3. FolderVisual — tall folder + 3 floating file cards; bouncy success badge
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
        0f, 1f, infiniteRepeatable(tween(3400, easing = LinearEasing)), "bob",
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

    // Pop-in scale for the success badge — bouncy spring
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
            // Taller folder — extends from y=82 to y=184
            moveTo(28f, 96f)
            lineTo(28f, 178f)
            quadraticBezierTo(28f, 184f, 34f, 184f)
            lineTo(166f, 184f)
            quadraticBezierTo(172f, 184f, 172f, 178f)
            lineTo(172f, 102f)
            lineTo(96f, 102f)
            lineTo(86f, 96f)
            close()
        }
    }
    val folderFront = remember {
        Path().apply {
            moveTo(28f, 116f)
            lineTo(86f, 116f)
            lineTo(96f, 124f)
            lineTo(172f, 124f)
            lineTo(172f, 178f)
            quadraticBezierTo(172f, 184f, 166f, 184f)
            lineTo(34f, 184f)
            quadraticBezierTo(28f, 184f, 28f, 178f)
            close()
        }
    }

    Canvas(modifier = Modifier.size(200.dp)) {
        withLogicalSpace {
            glow(100f, 145f, 68f, primary, 0.24f)

            // Back card 3 (left, behind folder)
            val f3 = pulse(cardPhase3, 0f)
            translate(-1f * f3, -14f * f3) {
                rotate(-3f + 2f * f3, pivot = Offset(74f, 61f)) {
                    fillStrokeRoundRect(
                        left = 54f, top = 38f, width = 40f, height = 50f,
                        cornerRadius = 5f,
                        fill = surface3, stroke = primary, strokeWidth = 1.4f,
                    )
                    drawRoundRect(
                        color = primary.copy(alpha = 0.6f),
                        topLeft = Offset(60f, 46f), size = Size(28f, 3.5f),
                        cornerRadius = CornerRadius(1.5f, 1.5f),
                    )
                    drawRoundRect(
                        color = primary.copy(alpha = 0.4f),
                        topLeft = Offset(60f, 53f), size = Size(22f, 3.5f),
                        cornerRadius = CornerRadius(1.5f, 1.5f),
                    )
                    drawRoundRect(
                        color = primary.copy(alpha = 0.4f),
                        topLeft = Offset(60f, 60f), size = Size(25f, 3.5f),
                        cornerRadius = CornerRadius(1.5f, 1.5f),
                    )
                }
            }

            // Back card 2 (right, behind folder)
            val f2 = pulse(cardPhase2, 0f)
            translate(3f * f2, -12f * f2) {
                rotate(5f + 2f * f2, pivot = Offset(130f, 53f)) {
                    fillStrokeRoundRect(
                        left = 108f, top = 30f, width = 40f, height = 50f,
                        cornerRadius = 5f,
                        fill = surface4, stroke = tertiary, strokeWidth = 1.4f,
                    )
                    drawRoundRect(
                        color = tertiary.copy(alpha = 0.7f),
                        topLeft = Offset(114f, 38f), size = Size(28f, 3.5f),
                        cornerRadius = CornerRadius(1.5f, 1.5f),
                    )
                    drawRoundRect(
                        color = tertiary.copy(alpha = 0.5f),
                        topLeft = Offset(114f, 45f), size = Size(22f, 3.5f),
                        cornerRadius = CornerRadius(1.5f, 1.5f),
                    )
                    drawRoundRect(
                        color = tertiary.copy(alpha = 0.5f),
                        topLeft = Offset(114f, 52f), size = Size(25f, 3.5f),
                        cornerRadius = CornerRadius(1.5f, 1.5f),
                    )
                }
            }

            // Folder body — bob + slight rotate, pivot at (100, 145)
            val fb = pulse(bobPhase, 0f)
            translate(0f, -5f * fb) {
                rotate(-1f * fb, pivot = Offset(100f, 145f)) {
                    // Folder back (container fill)
                    drawPath(folderBack, color = primaryContainer)
                    drawPath(
                        folderBack, color = primary,
                        style = Stroke(width = 2.4f, join = StrokeJoin.Round),
                    )
                    // Folder front flap (primary fill)
                    drawPath(folderFront, color = primary.copy(alpha = 0.92f))
                    drawPath(
                        folderFront, color = primary,
                        style = Stroke(width = 2.4f, join = StrokeJoin.Round),
                    )
                    // Highlight on the flap
                    drawLine(
                        color = onPrimary.copy(alpha = 0.4f),
                        start = Offset(38f, 120f), end = Offset(82f, 120f),
                        strokeWidth = 2.4f, cap = StrokeCap.Round,
                    )
                    // Content lines (suggesting files inside)
                    drawLine(
                        color = onPrimary.copy(alpha = 0.22f),
                        start = Offset(46f, 142f), end = Offset(154f, 142f),
                        strokeWidth = 1.8f, cap = StrokeCap.Round,
                    )
                    drawLine(
                        color = onPrimary.copy(alpha = 0.18f),
                        start = Offset(46f, 154f), end = Offset(132f, 154f),
                        strokeWidth = 1.8f, cap = StrokeCap.Round,
                    )
                    drawLine(
                        color = onPrimary.copy(alpha = 0.15f),
                        start = Offset(46f, 166f), end = Offset(144f, 166f),
                        strokeWidth = 1.8f, cap = StrokeCap.Round,
                    )
                }
            }

            // Front card 1 (in front of folder)
            val f1 = pulse(cardPhase1, 0f)
            translate(-2f * f1, -10f * f1) {
                rotate(-6f - 2f * f1, pivot = Offset(102f, 79f)) {
                    fillStrokeRoundRect(
                        left = 80f, top = 56f, width = 40f, height = 50f,
                        cornerRadius = 5f,
                        fill = surface5, stroke = primary, strokeWidth = 1.6f,
                    )
                    // File icon decoration (warn circle)
                    drawCircle(warn.copy(alpha = 0.85f), 5.5f, Offset(100f, 70f))
                    drawRoundRect(
                        color = primary.copy(alpha = 0.7f),
                        topLeft = Offset(86f, 80f), size = Size(28f, 3.5f),
                        cornerRadius = CornerRadius(1.5f, 1.5f),
                    )
                    drawRoundRect(
                        color = primary.copy(alpha = 0.5f),
                        topLeft = Offset(86f, 87f), size = Size(20f, 3.5f),
                        cornerRadius = CornerRadius(1.5f, 1.5f),
                    )
                    drawRoundRect(
                        color = primary.copy(alpha = 0.5f),
                        topLeft = Offset(86f, 94f), size = Size(24f, 3.5f),
                        cornerRadius = CornerRadius(1.5f, 1.5f),
                    )
                }
            }

            // Success checkmark badge (only when selected) — bouncy spring
            if (badgeScale > 0.01f) {
                scale(badgeScale, badgeScale, pivot = Offset(158f, 116f)) {
                    // Glow
                    glow(158f, 116f, 26f, primary, 0.6f)
                    fillStrokeCircle(
                        cx = 158f, cy = 116f, r = 20f,
                        fill = primary, stroke = bg, strokeWidth = 3.5f,
                    )
                    drawLine(
                        color = onPrimary,
                        start = Offset(149f, 116f),
                        end = Offset(156f, 123f),
                        strokeWidth = 4f, cap = StrokeCap.Round,
                    )
                    drawLine(
                        color = onPrimary,
                        start = Offset(156f, 123f),
                        end = Offset(168f, 110f),
                        strokeWidth = 4f, cap = StrokeCap.Round,
                    )
                }
            }

            // 4 sparkles
            val sparks = listOf(
                Sparkle(26f, 80f, 2.5f, primary),
                Sparkle(178f, 90f, 2.0f, tertiary),
                Sparkle(174f, 36f, 1.8f, warn),
                Sparkle(24f, 30f, 1.8f, primary),
            )
            sparks.forEachIndexed { i, sp ->
                val f = pulse(sparklePhase, i * 0.27f)
                val alpha = 0.18f + 0.72f * f
                drawCircle(sp.color.copy(alpha = alpha), sp.r, Offset(sp.x, sp.y))
            }
        }
    }
}

// =====================================================================================
// 4. PermissionsVisual — big shield + 3 ripples + 2 dashed orbits + checkmark
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
        0f, 1f, infiniteRepeatable(tween(2600, easing = LinearEasing)), "ripple",
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
    val glowPhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2000, easing = LinearEasing)), "glow",
    )

    val shieldPath = remember {
        Path().apply {
            // Bigger shield — extends from y=46 to y=156
            moveTo(100f, 46f)
            lineTo(142f, 62f)
            lineTo(142f, 102f)
            quadraticBezierTo(142f, 134f, 100f, 156f)
            quadraticBezierTo(58f, 134f, 58f, 102f)
            lineTo(58f, 62f)
            close()
        }
    }
    val shieldInner = remember {
        Path().apply {
            moveTo(100f, 53f)
            lineTo(135f, 67f)
            lineTo(135f, 102f)
            quadraticBezierTo(135f, 128f, 100f, 148f)
            quadraticBezierTo(65f, 128f, 65f, 102f)
            lineTo(65f, 67f)
            close()
        }
    }
    val checkPath = remember {
        Path().apply {
            moveTo(80f, 100f)
            lineTo(94f, 114f)
            lineTo(122f, 86f)
        }
    }
    val checkMeasure = remember(checkPath) {
        PathMeasure().apply { setPath(checkPath, false) }
    }

    Canvas(modifier = Modifier.size(200.dp)) {
        withLogicalSpace {
            // Breathing glow
            val gf = pulse(glowPhase, 0f)
            glow(100f, 100f, 64f, primary, 0.18f + 0.14f * gf)

            // Rotating dashed rings
            rotate(dash1, pivot = Offset(100f, 100f)) {
                drawCircle(
                    color = primary.copy(alpha = 0.28f),
                    radius = 84f, center = Offset(100f, 100f),
                    style = Stroke(width = 1.8f, pathEffect = PathEffect.dashPathEffect(floatArrayOf(4f, 8f))),
                )
            }
            rotate(dash2, pivot = Offset(100f, 100f)) {
                drawCircle(
                    color = tertiary.copy(alpha = 0.32f),
                    radius = 72f, center = Offset(100f, 100f),
                    style = Stroke(width = 1.2f, pathEffect = PathEffect.dashPathEffect(floatArrayOf(2f, 6f))),
                )
            }

            // 6 floating particles (drift via combined sine waves)
            val particles = listOf(
                Sparkle(38f, 58f, 2.2f, primary),
                Sparkle(162f, 48f, 2.0f, tertiary),
                Sparkle(170f, 142f, 2.2f, warn),
                Sparkle(32f, 152f, 2.0f, primary),
                Sparkle(100f, 26f, 1.8f, secondary),
                Sparkle(100f, 174f, 1.8f, primary),
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

            // 3 expanding ripple rings (staggered) — bigger now
            val ringColors = listOf(primary, primary, primary)
            ringColors.forEachIndexed { i, c ->
                val ph = (ripplePhase + i * 0.32f) % 1f
                val scaleR = 0.5f + 1.4f * ph
                val alpha = (0.7f * (1f - ph)).coerceAtLeast(0f)
                drawCircle(
                    color = c.copy(alpha = alpha),
                    radius = 50f * scaleR,
                    center = Offset(100f, 100f),
                    style = Stroke(width = 2.5f),
                )
            }

            // Shield — floating up/down
            val f = pulse(shieldFloat, 0f)
            translate(0f, -5f * f) {
                drawPath(shieldPath, color = primaryContainer)
                drawPath(
                    shieldPath, color = primary,
                    style = Stroke(width = 2.8f, join = StrokeJoin.Round),
                )
                drawPath(
                    shieldInner, color = primary.copy(alpha = 0.32f),
                    style = Stroke(width = 1.2f, join = StrokeJoin.Round),
                )
                // Inner top highlight on shield
                drawOval(
                    color = primary.copy(alpha = 0.15f),
                    topLeft = Offset(78f, 60f), size = Size(44f, 14f),
                )

                // Animated checkmark draw (segment of the path)
                val progress = checkProgress(checkPhase)
                if (progress > 0f) {
                    val totalLen = checkMeasure.length
                    val subPath = Path()
                    checkMeasure.getSegment(0f, totalLen * progress, subPath, true)
                    drawPath(
                        subPath, color = primary,
                        style = Stroke(width = 5f, cap = StrokeCap.Round, join = StrokeJoin.Round),
                    )
                }
            }
        }
    }
}

// =====================================================================================
// 5. RestoreVisual — COMPLETE REDO: beautiful soft cloud + 6 data drops + tray
// =====================================================================================
@Composable
fun RestoreVisual() {
    val palette = LocalWizardPalette.current
    val primary = palette.primary
    val primaryContainer = palette.primaryContainer
    val bg = palette.background
    val surface3 = palette.surface3
    val surface4 = palette.surface4
    val tertiary = TertiaryPink
    val warn = WarnAmber
    val secondary = SecondaryLavender

    val infinite = rememberInfiniteTransition(label = "restore")
    val bgPulse by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(4000, easing = LinearEasing)), "bg",
    )
    val bgDash by infinite.animateFloat(
        0f, 360f, infiniteRepeatable(tween(22000, easing = LinearEasing)), "bgDash",
    )
    val cloudFloat by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(4000, easing = LinearEasing)), "cloud",
    )
    val cloudBreathe by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2800, easing = LinearEasing)), "cloudBreathe",
    )
    val dropPhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2400, easing = LinearEasing)), "drop",
    )
    val trayBreathe by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2000, easing = LinearEasing)), "tray",
    )
    val fillPhase by infinite.animateFloat(
        0f, 1f, infiniteRepeatable(tween(2400, easing = LinearEasing)), "fill",
    )

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
            // Background pulse ring
            val bp = pulse(bgPulse, 0f)
            val bgAlpha = 0.10f + 0.12f * bp
            drawCircle(
                color = primary.copy(alpha = bgAlpha),
                radius = 78f * (0.88f + 0.22f * bp),
                center = Offset(100f, 70f),
                style = Stroke(width = 1.5f),
            )
            rotate(bgDash, pivot = Offset(100f, 70f)) {
                drawCircle(
                    color = tertiary.copy(alpha = 0.22f),
                    radius = 66f, center = Offset(100f, 70f),
                    style = Stroke(width = 1f, pathEffect = PathEffect.dashPathEffect(floatArrayOf(3f, 7f))),
                )
            }

            // Cloud glow
            val cb = pulse(cloudBreathe, 0f)
            glow(100f, 68f, 56f, primary, 0.22f + 0.10f * cb)

            // Cloud — smooth gentle floating
            val cf = pulse(cloudFloat, 0f)
            val cloudY = -6f * cf
            translate(0f, cloudY) {
                // Soft cloud shadow on ground
                drawOval(
                    color = Color.Black.copy(alpha = 0.18f),
                    topLeft = Offset(50f, 94f),
                    size = Size(100f, 12f),
                )

                // Cloud body — soft, fluffy puffs with subtle highlights
                // Use a slightly lighter fill for the cloud body
                val cloudFill = surface4.copy(alpha = 0.95f)
                val cloudStroke = primary.copy(alpha = 0.7f)
                val cloudHighlight = primary.copy(alpha = 0.12f)

                // Layer 1 (back) — widest bottom puff (4 overlapping circles for soft cloud silhouette)
                // We draw 4 puffs slightly overlapping to create a fluffy cloud shape
                fillStrokeOval(70f, 70f, 22f, 22f, cloudFill, cloudStroke, 1.8f)
                fillStrokeOval(130f, 70f, 22f, 22f, cloudFill, cloudStroke, 1.8f)
                fillStrokeOval(100f, 56f, 30f, 26f, cloudFill, cloudStroke, 1.8f)
                fillStrokeOval(85f, 64f, 18f, 18f, cloudFill, cloudStroke, 1.4f)
                fillStrokeOval(115f, 64f, 18f, 18f, cloudFill, cloudStroke, 1.4f)

                // Bottom flat bar (closes the cloud silhouette)
                fillStrokeRoundRect(
                    left = 54f, top = 70f, width = 92f, height = 22f,
                    cornerRadius = 11f,
                    fill = cloudFill, stroke = cloudStroke, strokeWidth = 1.8f,
                )

                // Soft inner highlights (give the cloud a "puffy" feel)
                // Top highlight on center puff
                drawOval(
                    color = cloudHighlight,
                    topLeft = Offset(86f, 42f), size = Size(28f, 10f),
                )
                // Side puff highlights
                drawOval(
                    color = cloudHighlight,
                    topLeft = Offset(60f, 60f), size = Size(14f, 6f),
                )
                drawOval(
                    color = cloudHighlight,
                    topLeft = Offset(122f, 60f), size = Size(14f, 6f),
                )

                // Download arrow inside the cloud (subtle, primary-colored)
                val arrowColor = primary
                // Vertical stem
                drawLine(
                    color = arrowColor,
                    start = Offset(100f, 60f), end = Offset(100f, 80f),
                    strokeWidth = 3.5f, cap = StrokeCap.Round,
                )
                // Arrow head (V shape)
                drawLine(
                    color = arrowColor,
                    start = Offset(90f, 72f), end = Offset(100f, 82f),
                    strokeWidth = 3.5f, cap = StrokeCap.Round,
                )
                drawLine(
                    color = arrowColor,
                    start = Offset(110f, 72f), end = Offset(100f, 82f),
                    strokeWidth = 3.5f, cap = StrokeCap.Round,
                )
            }

            // 6 falling data particles — varied colors & shapes
            val drops = listOf(
                Drop(70f, 96f, primary, DropShape.Rect, 10f),
                Drop(88f, 100f, tertiary, DropShape.Circle, 0f),
                Drop(110f, 96f, warn, DropShape.Rect, -10f),
                Drop(128f, 100f, primary, DropShape.Circle, 0f, 0.9f),
                Drop(78f, 96f, secondary, DropShape.RectSmall, 6f),
                Drop(120f, 100f, tertiary, DropShape.Circle, 0f, 0.9f),
            )
            drops.forEachIndexed { i, d ->
                val ph = (dropPhase + i * 0.16f) % 1f
                val dy = 56f * ph
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
            glow(100f, 158f, 40f, primary, 0.28f + 0.30f * tg)

            // Tray — vertical breathe
            val ts = 1f + 0.04f * tg
            scale(1f, ts, pivot = Offset(100f, 172f)) {
                // Outer trapezoid
                drawPath(trayOuter, color = primaryContainer)
                drawPath(
                    trayOuter, color = primary,
                    style = Stroke(width = 2.4f, join = StrokeJoin.Round),
                )
                // Inner fill (rising)
                val fs = 0.2f + 0.8f * fillPhase
                scale(1f, fs, pivot = Offset(100f, 168f)) {
                    drawPath(trayFill, color = primary.copy(alpha = 0.55f))
                }
                // Top rim highlight
                drawLine(
                    color = primary.copy(alpha = 0.85f),
                    start = Offset(52f, 144f), end = Offset(148f, 144f),
                    strokeWidth = 3f, cap = StrokeCap.Round,
                )
                // Collected indicator dots
                drawCircle(primary.copy(alpha = 0.7f), 2.2f, Offset(80f, 160f))
                drawCircle(primary.copy(alpha = 0.9f), 2.6f, Offset(100f, 162f))
                drawCircle(primary.copy(alpha = 0.7f), 2.2f, Offset(120f, 160f))
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
// 6. SummaryVisual — 4 staggered growing bars + trend arrow + sparkles
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
    LaunchedEffect(Unit) { bar1.animateTo(1f, tween(1300, delayMillis = 100)) }
    LaunchedEffect(Unit) { bar2.animateTo(1f, tween(1300, delayMillis = 250)) }
    LaunchedEffect(Unit) { bar3.animateTo(1f, tween(1300, delayMillis = 400)) }
    LaunchedEffect(Unit) { bar4.animateTo(1f, tween(1300, delayMillis = 550)) }

    Canvas(modifier = Modifier.size(200.dp)) {
        withLogicalSpace {
            glow(100f, 120f, 54f, primary, 0.22f)

            // Backplate rounded rect (chart area)
            fillStrokeRoundRect(
                left = 30f, top = 50f, width = 140f, height = 120f,
                cornerRadius = 14f,
                fill = palette.surface2.copy(alpha = 0.4f),
                stroke = palette.surface4, strokeWidth = 1.2f,
            )

            // Baseline
            drawLine(
                color = palette.surface5,
                start = Offset(40f, 160f), end = Offset(160f, 160f),
                strokeWidth = 1.8f, cap = StrokeCap.Round,
            )
            // Horizontal gridlines
            drawLine(
                color = palette.surface4.copy(alpha = 0.5f),
                start = Offset(40f, 130f), end = Offset(160f, 130f),
                strokeWidth = 0.8f,
            )
            drawLine(
                color = palette.surface4.copy(alpha = 0.5f),
                start = Offset(40f, 100f), end = Offset(160f, 100f),
                strokeWidth = 0.8f,
            )
            drawLine(
                color = palette.surface4.copy(alpha = 0.5f),
                start = Offset(40f, 70f), end = Offset(160f, 70f),
                strokeWidth = 0.8f,
            )

            // 4 bars — staggered grow-in (scaleY from bottom)
            val bars = listOf(
                BarSpec(48f, 130f, 20f, 30f, primary.copy(alpha = 0.7f), bar1.value),
                BarSpec(76f, 112f, 20f, 48f, primary.copy(alpha = 0.85f), bar2.value),
                BarSpec(104f, 92f, 20f, 68f, tertiary, bar3.value),
                BarSpec(132f, 74f, 20f, 86f, primary, bar4.value),
            )
            bars.forEach { b ->
                scale(1f, b.progress, pivot = Offset(b.x + b.w / 2f, 160f)) {
                    // Bar fill
                    drawRoundRect(
                        color = b.color,
                        topLeft = Offset(b.x, b.y),
                        size = Size(b.w, b.h),
                        cornerRadius = CornerRadius(4f, 4f),
                    )
                    // Top highlight
                    drawRoundRect(
                        color = b.color.copy(alpha = 0.6f).compositeLighten(),
                        topLeft = Offset(b.x, b.y),
                        size = Size(b.w, 4f),
                        cornerRadius = CornerRadius(4f, 4f),
                    )
                }
            }

            // Trend arrow line — bobbing
            val tb = pulse(trendBob, 0f)
            translate(0f, -6f * tb) {
                val trendColor = warn
                // Polyline through bar tops
                val pts = listOf(Offset(58f, 124f), Offset(86f, 106f), Offset(114f, 86f), Offset(142f, 68f))
                for (i in 0 until pts.size - 1) {
                    drawLine(
                        color = trendColor,
                        start = pts[i], end = pts[i + 1],
                        strokeWidth = 2.6f, cap = StrokeCap.Round,
                    )
                }
                // Arrowhead corner
                drawLine(trendColor, Offset(132f, 68f), Offset(144f, 68f), strokeWidth = 2.6f, cap = StrokeCap.Round)
                drawLine(trendColor, Offset(144f, 68f), Offset(144f, 80f), strokeWidth = 2.6f, cap = StrokeCap.Round)
                // Trend dot
                drawCircle(trendColor, 4.5f, Offset(142f, 68f))
                // Outer ring around trend dot
                drawCircle(trendColor.copy(alpha = 0.4f), 8f, Offset(142f, 68f), style = Stroke(width = 1.2f))
            }

            // 4 sparkles
            val sparks = listOf(
                Sparkle(36f, 60f, 2.5f, primary),
                Sparkle(170f, 92f, 2.0f, tertiary),
                Sparkle(160f, 40f, 2.0f, warn),
                Sparkle(36f, 36f, 2.0f, primary),
            )
            sparks.forEachIndexed { i, sp ->
                val f = pulse(sparklePhase, i * 0.27f)
                val alpha = 0.2f + 0.8f * f
                val sr = sp.r * (0.6f + 0.5f * f)
                drawCircle(sp.color.copy(alpha = alpha), sr, Offset(sp.x, sp.y))
            }
        }
    }
}

/** Lighten a color slightly for highlight overlays. */
private fun Color.compositeLighten(): Color {
    return Color(
        red = (red + 0.15f).coerceAtMost(1f),
        green = (green + 0.15f).coerceAtMost(1f),
        blue = (blue + 0.15f).coerceAtMost(1f),
        alpha = alpha,
    )
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
            val auroraScale = 1f + 0.10f * sin(ap * 2f * PI.toFloat())
            val auroraRot = 360f * ap
            rotate(auroraRot, pivot = Offset(100f, 100f)) {
                scale(auroraScale, auroraScale, pivot = Offset(100f, 100f)) {
                    glow(100f, 100f, 82f, primary, 0.32f)
                    glow(70f, 80f, 42f, tertiary, 0.22f)
                    glow(130f, 120f, 42f, warn, 0.17f)
                }
            }

            // ---- Layer 2: 16 rotating light rays (alternating thick/thin) ----
            rotate(raysRotate, pivot = Offset(100f, 100f)) {
                for (i in 0 until 16) {
                    val angleDeg = i * 22.5f
                    val angleRad = angleDeg * PI.toFloat() / 180f
                    val isThick = i % 2 == 0
                    val r1 = 38f
                    val r2 = if (isThick) 90f else 78f
                    val x1 = 100f + cos(angleRad) * r1
                    val y1 = 100f + sin(angleRad) * r1
                    val x2 = 100f + cos(angleRad) * r2
                    val y2 = 100f + sin(angleRad) * r2
                    drawLine(
                        color = if (isThick) primary else tertiary,
                        start = Offset(x1, y1), end = Offset(x2, y2),
                        strokeWidth = if (isThick) 3.5f else 1.8f,
                        cap = StrokeCap.Round,
                        alpha = if (isThick) 0.5f else 0.22f,
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
            val starScale = 1f + 0.07f * sp
            scale(starScale, starScale, pivot = Offset(100f, 100f)) {
                // Outer glow ring
                glow(100f, 100f, 44f, primary, 0.17f)
                // 8 star burst points (short lines from r42 to r52)
                for (i in 0 until 8) {
                    val angleRad = (i * 45f) * PI.toFloat() / 180f
                    val x1 = 100f + cos(angleRad) * 42f
                    val y1 = 100f + sin(angleRad) * 42f
                    val x2 = 100f + cos(angleRad) * 52f
                    val y2 = 100f + sin(angleRad) * 52f
                    drawLine(
                        color = primary.copy(alpha = 0.65f),
                        start = Offset(x1, y1), end = Offset(x2, y2),
                        strokeWidth = 4.5f, cap = StrokeCap.Round,
                    )
                }
                // Main badge circle
                drawCircle(primary, 40f, Offset(100f, 100f))
                // Inner highlight stroke
                drawCircle(
                    color = bg.copy(alpha = 0.28f),
                    radius = 40f, center = Offset(100f, 100f),
                    style = Stroke(width = 2.2f),
                )
                // Inner top highlight
                drawOval(
                    color = bg.copy(alpha = 0.12f),
                    topLeft = Offset(76f, 66f), size = Size(48f, 48f),
                )
                // Animated checkmark (segment of the path)
                val progress = checkProgress(checkPhase)
                if (progress > 0f) {
                    val totalLen = checkMeasure.length
                    val subPath = Path()
                    checkMeasure.getSegment(0f, totalLen * progress, subPath, true)
                    drawPath(
                        subPath, color = onPrimary,
                        style = Stroke(width = 7f, cap = StrokeCap.Round, join = StrokeJoin.Round),
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
                Confetti(48f, 20f, 6f, 6f, 20f, primary),
                Confetti(100f, 10f, 6f, 6f, -15f, tertiary),
                Confetti(152f, 18f, 6f, 6f, 45f, warn),
                Confetti(70f, 5f, 5f, 5f, -30f, secondary),
                Confetti(130f, 8f, 5f, 5f, 60f, primary),
                Confetti(30f, 15f, 5f, 5f, -45f, tertiary),
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

private data class Confetti(
    val x: Float, val y: Float, val w: Float, val h: Float,
    val initialRot: Float, val color: Color,
)
