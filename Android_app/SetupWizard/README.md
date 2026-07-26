# Setup Wizard — Android App

A complete Android prototype of the setup wizard, built with Kotlin + Jetpack Compose + Material 3.
Matches the web prototype's design: 13-step animated setup wizard with lime primary color,
theme switching, folder selection, permissions, and full backup restore flow.

## Building

This project requires **Android Studio** (or Android SDK + Gradle 8.9+).

### Option 1: Android Studio (recommended)
1. Open Android Studio
2. File → Open → select this `SetupWizard` folder
3. Let Gradle sync complete
4. Click Run (▶) or Build → Build APK

### Option 2: Command line
```bash
# If you don't have the Gradle wrapper jar, generate it:
gradle wrapper --gradle-version 8.9

# Then build:
./gradlew assembleDebug

# APK output: app/build/outputs/apk/debug/app-debug.apk
```

## Requirements
- JDK 17+
- Android SDK 35 (compileSdk)
- Min SDK 24 (Android 7.0+)
- Kotlin 2.0.20

## Structure
```
app/src/main/java/com/testplaybyte/setupwizard/
├── MainActivity.kt              — entry point
├── SetupWizardApp.kt            — main composable + state + all 13 screens
├── ui/theme/
│   ├── Color.kt                 — color palette definitions
│   ├── Theme.kt                 — Material 3 theme + WizardPalette
│   └── Type.kt                  — typography
└── ui/components/
    └── WizardVisuals.kt         — 7 animated Canvas visuals
```

## The 13 Steps
0. Welcome
1. Theme (dark/light + 4 color palettes)
2. Folder selection (stays on screen with success animation)
3. Permissions (3 toggles)
4. Restore backup (Select Backup File / Skip)
5. Format not supported (fun warning)
6. Processing backup (~2s auto-advance)
7. Backup summary (stats + red manga warning + Cancel/Restore)
8. Linking anime (progressive reveal + stats)
9. Manual linking (search overlay → link)
10. Restore summary (final summary)
11. Restore successful (5s auto-advance)
12. Finish / URL set (Start Exploring → restart)
