package com.testplaybyte.setupwizard.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val SetupWizardTypography = Typography(
    displayLarge = TextStyle(fontSize = 32.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = (-0.5).sp),
    displayMedium = TextStyle(fontSize = 26.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = (-0.3).sp),
    headlineLarge = TextStyle(fontSize = 22.sp, fontWeight = FontWeight.Bold),
    headlineMedium = TextStyle(fontSize = 18.sp, fontWeight = FontWeight.Bold),
    titleLarge = TextStyle(fontSize = 16.sp, fontWeight = FontWeight.Bold),
    titleMedium = TextStyle(fontSize = 14.sp, fontWeight = FontWeight.Bold),
    bodyLarge = TextStyle(fontSize = 16.sp, fontWeight = FontWeight.Normal),
    bodyMedium = TextStyle(fontSize = 14.sp, fontWeight = FontWeight.Normal),
    bodySmall = TextStyle(fontSize = 13.sp, fontWeight = FontWeight.Normal),
    labelLarge = TextStyle(fontSize = 12.sp, fontWeight = FontWeight.SemiBold),
    labelMedium = TextStyle(fontSize = 11.sp, fontWeight = FontWeight.SemiBold),
    labelSmall = TextStyle(fontSize = 10.sp, fontWeight = FontWeight.SemiBold),
)
