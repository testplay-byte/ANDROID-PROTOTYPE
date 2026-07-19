package com.testplaybyte.animeapp.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.testplaybyte.animeapp.data.AniListClient
import com.testplaybyte.animeapp.model.Anime
import com.testplaybyte.animeapp.ui.components.AnimeCard
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

/**
 * SearchScreen — debounced AniList search with a results grid.
 * When no query is entered, shows a "Popular anime" label and trending results.
 */
@Composable
fun SearchScreen(
    onOpenAnime: (Int) -> Unit,
) {
    val client = remember { AniListClient() }
    val scope = rememberCoroutineScope()
    val keyboard = LocalSoftwareKeyboardController.current

    var query by remember { mutableStateOf("") }
    var results by remember { mutableStateOf<List<Anime>>(emptyList()) }
    var loading by remember { mutableStateOf(false) }
    var hasSearched by remember { mutableStateOf(false) }

    // Debounced search: re-launches whenever query changes, with a 500ms delay.
    LaunchedEffect(query) {
        if (query.isBlank()) {
            results = emptyList()
            hasSearched = false
            loading = false
            return@LaunchedEffect
        }
        loading = true
        delay(500)
        // If the query changed during the delay, this LaunchedEffect was
        // cancelled & re-launched, so we're safe to proceed.
        val q = query.trim()
        results = runCatching { client.search(q) }.getOrDefault(emptyList())
        loading = false
        hasSearched = true
    }

    // Fetch popular (trending) anime as the default landing view
    var popular by remember { mutableStateOf<List<Anime>>(emptyList()) }
    LaunchedEffect(Unit) {
        popular = runCatching { client.fetchTrending() }.getOrDefault(emptyList())
    }

    Column(modifier = Modifier.fillMaxSize()) {
        // Header + search bar
        Text(
            text = "Search",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground,
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 16.dp, top = 16.dp, bottom = 10.dp),
        )

        OutlinedTextField(
            value = query,
            onValueChange = { query = it },
            placeholder = { Text("Search anime…") },
            leadingIcon = { Icon(Icons.Filled.Search, contentDescription = null) },
            trailingIcon = {
                if (query.isNotEmpty()) {
                    IconButton(onClick = { query = "" }) {
                        Icon(Icons.Filled.Clear, contentDescription = "Clear")
                    }
                }
            },
            singleLine = true,
            shape = RoundedCornerShape(28.dp),
            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
            keyboardActions = KeyboardActions(onSearch = { keyboard?.hide() }),
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 4.dp),
        )

        Spacer(Modifier.height(8.dp))

        val displayed = if (query.isBlank()) popular else results
        val sectionLabel = when {
            query.isBlank() -> "Popular anime"
            loading -> "Searching…"
            hasSearched && results.isEmpty() -> "No results for \"$query\""
            else -> "Results for \"$query\""
        }

        Text(
            text = sectionLabel,
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(start = 16.dp, top = 6.dp, bottom = 6.dp),
        )

        if (displayed.isEmpty() && !loading) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    "Try a different keyword.",
                    fontSize = 13.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Fixed(3),
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(12.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                items(displayed, key = { it.id }) { anime ->
                    AnimeCard(anime = anime, onClick = onOpenAnime)
                }
            }
        }
    }
}
