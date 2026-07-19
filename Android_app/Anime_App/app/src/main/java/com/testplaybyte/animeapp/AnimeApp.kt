package com.testplaybyte.animeapp

import androidx.compose.runtime.*
import androidx.compose.ui.platform.LocalContext
import com.testplaybyte.animeapp.data.*
import com.testplaybyte.animeapp.navigation.AnimeNavHost

@Composable
fun AnimeApp() {
    val context = LocalContext.current
    val aniListClient = remember { AniListClient() }
    val historyRepo = remember { HistoryRepository(context) }

    AnimeNavHost(
        onOpenAnime = { id ->
            // History is recorded when the DetailScreen loads the anime
            // (DetailScreen calls historyRepo.add after fetching).
        },
    )
}
