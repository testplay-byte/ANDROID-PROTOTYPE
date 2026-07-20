package com.testplaybyte.animeapp.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

// M3 type scale — matches the web prototype.
// Uses ExtraBold (800) for display/headline to ensure bold is clearly visible
// on Android (Roboto at FontWeight.ExtraBold=700 can look subtle at small sizes).
val Typography = Typography(
    displayLarge = TextStyle(fontSize = 36.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = (-0.02).sp),
    headlineLarge = TextStyle(fontSize = 28.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = (-0.01).sp),
    headlineMedium = TextStyle(fontSize = 26.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = (-0.01).sp),
    headlineSmall = TextStyle(fontSize = 20.sp, fontWeight = FontWeight.ExtraBold),
    bodyLarge = TextStyle(fontSize = 16.sp, fontWeight = FontWeight.Medium),
    bodyMedium = TextStyle(fontSize = 14.sp, fontWeight = FontWeight.Medium),
    bodySmall = TextStyle(fontSize = 13.sp, fontWeight = FontWeight.Normal),
    labelLarge = TextStyle(fontSize = 12.sp, fontWeight = FontWeight.ExtraBold),
    labelMedium = TextStyle(fontSize = 11.sp, fontWeight = FontWeight.ExtraBold),
    labelSmall = TextStyle(fontSize = 10.sp, fontWeight = FontWeight.ExtraBold),
)
