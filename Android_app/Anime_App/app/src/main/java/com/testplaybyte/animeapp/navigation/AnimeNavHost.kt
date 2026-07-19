package com.testplaybyte.animeapp.navigation

import androidx.compose.animation.*
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.*
import androidx.navigation.compose.*
import com.testplaybyte.animeapp.ui.components.BottomNavBar
import com.testplaybyte.animeapp.ui.screens.*

object Routes {
    const val HOME = "home"
    const val LIBRARY = "library"
    const val HISTORY = "history"
    const val SCHEDULE = "schedule"
    const val SEARCH = "search"
    const val SETTINGS = "settings"
    const val DETAIL = "detail/{id}"
    fun detail(id: Int) = "detail/$id"

    val NAV_ITEMS = listOf(
        NavItem("home", "Home", "🏠"),
        NavItem("library", "Library", "📚"),
        NavItem("history", "History", "🕐"),
        NavItem("schedule", "Schedule", "📅"),
        NavItem("search", "Search", "🔍"),
        NavItem("settings", "Settings", "⚙"),
    )
}

data class NavItem(val route: String, val label: String, val icon: String)

@Composable
fun AnimeNavHost(
    onOpenAnime: (Int) -> Unit,
) {
    val navController = rememberNavController()
    val backStack by navController.currentBackStackEntryAsState()
    val currentRoute = backStack?.destination?.route

    val showBottomNav = currentRoute?.startsWith("detail") != true

    // Wire up anime-detail navigation: call the external callback (e.g. for
    // logging/analytics) then navigate to the detail route.
    val openAnime: (Int) -> Unit = { id ->
        onOpenAnime(id)
        navController.navigate(Routes.detail(id))
    }

    Scaffold(
        bottomBar = {
            if (showBottomNav) {
                BottomNavBar(
                    items = Routes.NAV_ITEMS,
                    currentRoute = currentRoute ?: "home",
                    onSelect = { route ->
                        if (route != currentRoute) {
                            navController.navigate(route) {
                                popUpTo(navController.graph.startDestinationId) { saveState = true }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    },
                )
            }
        }
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = Routes.HOME,
            modifier = Modifier.padding(padding),
        ) {
            composable(Routes.HOME) { HomeScreen(onOpenAnime = openAnime) }
            composable(Routes.LIBRARY) { LibraryScreen(onOpenAnime = openAnime) }
            composable(Routes.HISTORY) { HistoryScreen(onOpenAnime = openAnime) }
            composable(Routes.SCHEDULE) { ScheduleScreen(onOpenAnime = openAnime) }
            composable(Routes.SEARCH) { SearchScreen(onOpenAnime = openAnime) }
            composable(Routes.SETTINGS) { SettingsScreen() }
            composable(
                Routes.DETAIL,
                arguments = listOf(navArgument("id") { type = NavType.IntType }),
            ) { entry ->
                val id = entry.arguments?.getInt("id") ?: 0
                DetailScreen(animeId = id, onBack = { navController.popBackStack() })
            }
        }
    }
}
