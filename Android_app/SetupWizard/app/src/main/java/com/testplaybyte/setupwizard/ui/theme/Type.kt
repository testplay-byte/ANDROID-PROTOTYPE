package com.testplaybyte.setupwizard.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

/* =====================================================================================
 *  Type.kt — BIG, BOLD typography for the Setup Wizard.
 *
 *  Screen titles use displayLarge (36sp / ExtraBold) and displayMedium
 *  (30sp / ExtraBold). Subtitles use bodyLarge (16sp). All weights are
 *  pushed heavier than Material's defaults so the wizard feels chunky,
 *  confident, and easy to read on small screens.
 * ===================================================================================== */

val SetupWizardTypography = Typography(
    // Screen titles — "Welcome to Anime App!", "Restore Successful!", etc.
    displayLarge = TextStyle(
        fontSize = 36.sp,
        fontWeight = FontWeight.ExtraBold,
        letterSpacing = (-0.75).sp,
        lineHeight = 42.sp,
    ),
    // Most screen titles — "Choose Your Theme", "Backup Summary", etc.
    displayMedium = TextStyle(
        fontSize = 30.sp,
        fontWeight = FontWeight.ExtraBold,
        letterSpacing = (-0.5).sp,
        lineHeight = 36.sp,
    ),
    // Smaller titles / "Restore Backup" style headers
    displaySmall = TextStyle(
        fontSize = 26.sp,
        fontWeight = FontWeight.ExtraBold,
        letterSpacing = (-0.25).sp,
        lineHeight = 32.sp,
    ),
    // Big section headers inside cards
    headlineLarge = TextStyle(
        fontSize = 24.sp,
        fontWeight = FontWeight.Bold,
        letterSpacing = 0.sp,
        lineHeight = 30.sp,
    ),
    // Card headers
    headlineMedium = TextStyle(
        fontSize = 20.sp,
        fontWeight = FontWeight.Bold,
        letterSpacing = 0.sp,
        lineHeight = 26.sp,
    ),
    headlineSmall = TextStyle(
        fontSize = 17.sp,
        fontWeight = FontWeight.Bold,
        lineHeight = 22.sp,
    ),
    // Toggle / stat box labels
    titleLarge = TextStyle(
        fontSize = 18.sp,
        fontWeight = FontWeight.Bold,
        lineHeight = 24.sp,
    ),
    titleMedium = TextStyle(
        fontSize = 15.sp,
        fontWeight = FontWeight.Bold,
        lineHeight = 20.sp,
    ),
    titleSmall = TextStyle(
        fontSize = 13.sp,
        fontWeight = FontWeight.SemiBold,
        lineHeight = 18.sp,
    ),
    // Body text / subtitles
    bodyLarge = TextStyle(
        fontSize = 16.sp,
        fontWeight = FontWeight.Normal,
        lineHeight = 22.sp,
    ),
    bodyMedium = TextStyle(
        fontSize = 14.sp,
        fontWeight = FontWeight.Normal,
        lineHeight = 20.sp,
    ),
    bodySmall = TextStyle(
        fontSize = 13.sp,
        fontWeight = FontWeight.Normal,
        lineHeight = 18.sp,
    ),
    // Button text, badges
    labelLarge = TextStyle(
        fontSize = 13.sp,
        fontWeight = FontWeight.SemiBold,
        letterSpacing = 0.5.sp,
        lineHeight = 16.sp,
    ),
    labelMedium = TextStyle(
        fontSize = 12.sp,
        fontWeight = FontWeight.SemiBold,
        letterSpacing = 0.5.sp,
        lineHeight = 14.sp,
    ),
    labelSmall = TextStyle(
        fontSize = 11.sp,
        fontWeight = FontWeight.SemiBold,
        letterSpacing = 0.5.sp,
        lineHeight = 14.sp,
    ),
)
