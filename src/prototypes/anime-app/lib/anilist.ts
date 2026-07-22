/**
 * anime-app / lib / anilist — AniList GraphQL client.
 *
 * Single endpoint, simple in-memory cache, builds a parameterised query
 * from the active filters. Also exposes helpers for the home screen
 * (trending / seasonal / top-rated) and the detail screen (Media by id).
 */
import type { Anime, FilterState, SortOption } from "./types";

const API = "https://graphql.anilist.co";

interface GraphQLResponse {
  data?: { Page?: { media: Anime[] }; Media?: Anime };
  errors?: unknown;
}

const cache = new Map<string, GraphQLResponse>();

/** POST a GraphQL query, caching by query+vars. */
export async function gql<T = GraphQLResponse>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const key = query + JSON.stringify(variables || {});
  const cached = cache.get(key);
  if (cached) return cached as T;

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const data = (await res.json()) as T;
  cache.set(key, data as GraphQLResponse);
  return data;
}

interface FetchMediaArgs extends FilterState {
  search?: string;
  sort?: SortOption;
}

/** Build + send the AniList media search query (Page). */
export function fetchMedia(args: FetchMediaArgs): Promise<GraphQLResponse> {
  const vars: Record<string, unknown> = { page: 1, perPage: 30 };
  const params: string[] = ["type:ANIME"];

  if (args.search) {
    params.push("search:$search");
    vars.search = args.search;
  }
  if (args.genres?.length) {
    params.push("genre_in:$genres");
    vars.genres = args.genres;
  }
  if (args.year) {
    params.push("seasonYear:$year");
    vars.year = parseInt(args.year, 10);
  }
  if (args.season) {
    params.push("season:$season");
    vars.season = args.season;
  }
  if (args.format) {
    params.push("format:$format");
    vars.format = args.format;
  }
  if (args.status) {
    params.push("status:$status");
    vars.status = args.status;
  }
  if (args.minScore && args.minScore > 0) {
    params.push("averageScore_greater:$minScore");
    vars.minScore = args.minScore;
  }
  if (args.sort) params.push("sort:" + args.sort);

  const varDecls: string[] = ["$page:Int", "$perPage:Int"];
  if (vars.search !== undefined) varDecls.push("$search:String");
  if (vars.genres !== undefined) varDecls.push("$genres:[String]");
  if (vars.year !== undefined) varDecls.push("$year:Int");
  if (vars.season !== undefined) varDecls.push("$season:MediaSeason");
  if (vars.format !== undefined) varDecls.push("$format:MediaFormat");
  if (vars.status !== undefined) varDecls.push("$status:MediaStatus");
  if (vars.minScore !== undefined) varDecls.push("$minScore:Int");

  const q =
    `query(${varDecls.join(",")}){` +
    `Page(page:$page,perPage:$perPage){` +
    `media(${params.join(",")}){` +
    `id title{romaji english} coverImage{large extraLarge} ` +
    `averageScore episodes format season seasonYear genres status` +
    `}}}`;

  return gql<GraphQLResponse>(q, vars);
}

// ---------------------------------------------------------------------------
// Home screen — three independent queries (AniList doesn't allow aliasing
// multiple Page queries in a single request).
// ---------------------------------------------------------------------------

/** Trending anime (5) for the hero carousel. */
export function fetchTrending(): Promise<Anime[]> {
  const q =
    "query{Page(page:1,perPage:5){media(type:ANIME,sort:TRENDING_DESC){" +
    "id title{romaji english} coverImage{large extraLarge} bannerImage averageScore}}}";
  return gql<GraphQLResponse>(q, {}).then(
    (d) => d.data?.Page?.media ?? [],
  );
}

/** Popular anime for the current season (12). */
export function fetchSeasonal(
  season: string,
  year: number,
): Promise<Anime[]> {
  const q =
    "query($season:MediaSeason,$year:Int){Page(page:1,perPage:12){" +
    "media(type:ANIME,season:$season,seasonYear:$year,sort:POPULARITY_DESC){" +
    "id title{romaji english} coverImage{large extraLarge} averageScore episodes format seasonYear}}}";
  return gql<GraphQLResponse>(q, { season, year }).then(
    (d) => d.data?.Page?.media ?? [],
  );
}

/** Top-rated anime (9). */
export function fetchTopRated(): Promise<Anime[]> {
  const q =
    "query{Page(page:1,perPage:9){media(type:ANIME,sort:SCORE_DESC){" +
    "id title{romaji english} coverImage{large extraLarge} averageScore episodes format seasonYear}}}";
  return gql<GraphQLResponse>(q, {}).then(
    (d) => d.data?.Page?.media ?? [],
  );
}

// ---------------------------------------------------------------------------
// Detail screen — single Media by id.
// ---------------------------------------------------------------------------

export function fetchDetail(id: number): Promise<Anime | null> {
  const q =
    "query($id:Int){Media(id:$id,type:ANIME){" +
    "id title{romaji english} coverImage{large extraLarge} bannerImage averageScore " +
    "episodes format season seasonYear genres status description " +
    "nextAiringEpisode{airingAt episode} siteUrl}}";
  return gql<GraphQLResponse>(q, { id }).then(
    (d) => d.data?.Media ?? null,
  );
}

/** Format an AniList 0–100 average score as a 0.0–10.0 string. */
export function fmtScore(s?: number | null): string {
  return s ? (s / 10).toFixed(1) : "—";
}

/** Strip HTML tags from an AniList synopsis string. */
export function stripHtml(s: string | null | undefined): string {
  if (!s) return "No synopsis available.";
  return s.replace(/<[^>]+>/g, "");
}

/** "Just now" / "5m ago" / "3h ago" / "2d ago" / locale date. */
export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return "Just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}

// ---------------------------------------------------------------------------
// Schedule screen — airing schedules for a 7-day window.
// ---------------------------------------------------------------------------

export interface AiringEntry {
  id: number;
  airingAt: number; // Unix seconds
  episode: number;
  media: Anime;
}

interface AiringResponse {
  data?: {
    Page?: {
      airingSchedules: {
        id: number;
        airingAt: number;
        episode: number;
        media: Anime;
      }[];
    };
  };
}

/**
 * Fetch airing schedules for a time window (Unix seconds).
 * Returns entries sorted by airingAt ascending.
 */
export function fetchAiringSchedule(
  weekStart: number,
  weekEnd: number,
): Promise<AiringEntry[]> {
  const q =
    "query($weekStart:Int!,$weekEnd:Int!){Page(page:1,perPage:100){" +
    "airingSchedules(airingAt_greater:$weekStart,airingAt_lesser:$weekEnd){" +
    "id airingAt episode media{id title{romaji english} " +
    "coverImage{large extraLarge} averageScore episodes format seasonYear}}}}";
  return gql<AiringResponse>(q, { weekStart, weekEnd }).then((d) => {
    const list = d.data?.Page?.airingSchedules ?? [];
    return list
      .map((e) => ({
        id: e.id,
        airingAt: e.airingAt,
        episode: e.episode,
        media: e.media,
      }))
      .sort((a, b) => a.airingAt - b.airingAt);
  });
}

// ---------------------------------------------------------------------------
// Mock episode data (prototype only — AniList doesn't provide per-episode
// titles/descriptions/thumbnails via the Media query, so we synthesize
// plausible episode data for the detail screen's episode list).
// ---------------------------------------------------------------------------

import type { EpisodeData } from "./types";

/** Curated pool of plausible-sounding episode titles. */
const EPISODE_TITLES = [
  "A New Beginning",
  "The Journey Starts",
  "First Light",
  "Whispers in the Dark",
  "The Unlikely Alliance",
  "Crossroads of Fate",
  "Echoes of the Past",
  "The Hidden Path",
  "Storm Brewing",
  "Bonds Forged in Battle",
  "The Silent Oath",
  "Shadows of Tomorrow",
  "Breaking the Chains",
  "The Cost of Courage",
  "Where Dreams Collide",
  "A Glimmer of Hope",
  "The Turning Point",
  "Beyond the Horizon",
  "Fractured Reflections",
  "The Final Promise",
  "Embers of Resolve",
  "Crimson Twilight",
  "The weight of Wings",
  "Dawn of a New Era",
];

/** Curated pool of plausible-sounding episode descriptions. */
const EPISODE_DESCRIPTIONS = [
  "Our hero sets out on a journey that will change everything. Old memories resurface as the first steps are taken into the unknown.",
  "Tensions rise as the team faces their first real challenge. Friendships are tested and unlikely bonds begin to form.",
  "A long-buried secret comes to light, forcing everyone to question what they thought they knew about the world.",
  "The stakes grow higher as a new threat emerges from the shadows. Time is running out to prepare.",
  "In the aftermath of battle, hard choices must be made. Some wounds cut deeper than any blade.",
  "A quiet moment of peace is shattered when an unexpected visitor arrives with urgent news.",
  "Loyalties are tested as the group is forced to choose between their mission and their hearts.",
  "The truth behind the legend is finally revealed, and nothing will ever be the same again.",
  "With the clock ticking, our heroes must race against time to prevent a catastrophe.",
  "Old rivals cross paths once more as the past and present collide in an explosive confrontation.",
  "A sacrifice changes the course of everything, leaving the group forever altered.",
  "The final battle looms on the horizon as alliances are forged and broken.",
  "In the darkest hour, a glimmer of hope appears from the most unlikely of places.",
  "Everything has been leading to this moment. The fate of the world hangs in the balance.",
];

/** Month labels for generating release dates. */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Generate a list of mock episodes for the given anime.
 *
 * Uses the anime's cover/banner image as the per-episode thumbnail (AniList
 * does not provide real per-episode stills). Titles, descriptions, release
 * dates, and sub/dub availability are all deterministic-but-varied so the
 * same anime always produces the same episode list (stable across re-renders).
 *
 * @param anime The anime to generate episodes for.
 * @param count How many episodes to generate (defaults to anime.episodes, capped at 24).
 */
export function generateMockEpisodes(
  anime: Anime,
  count?: number,
): EpisodeData[] {
  const n = Math.min(count ?? anime.episodes ?? 12, 24);
  if (n <= 0) return [];

  const thumb =
    anime.bannerImage ||
    anime.coverImage.extraLarge ||
    anime.coverImage.large ||
    "";

  const startDate = anime.nextAiringEpisode?.airingAt
    ? new Date(anime.nextAiringEpisode.airingAt * 1000)
    : new Date(anime.seasonYear ?? 2024, 0, 7);

  const list: EpisodeData[] = [];
  for (let i = 0; i < n; i++) {
    // Deterministic pseudo-random based on anime id + episode index so the
    // same anime always yields the same episode data across re-renders.
    const seed = (anime.id * 31 + i * 7) % 1000;
    const titleIdx = (seed + i) % EPISODE_TITLES.length;
    const descIdx = (seed * 3 + i * 5) % EPISODE_DESCRIPTIONS.length;

    // Release date: ~7 days apart starting from startDate.
    const epDate = new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
    const releaseDate = `${MONTHS[epDate.getMonth()]} ${epDate.getDate()}, ${epDate.getFullYear()}`;

    // Sub/dub availability: sub is almost always available; dub ~70% of the time.
    const subAvailable = true;
    const dubAvailable = (seed % 10) < 7;

    list.push({
      number: i + 1,
      title: EPISODE_TITLES[titleIdx],
      description: EPISODE_DESCRIPTIONS[descIdx],
      releaseDate,
      subAvailable,
      dubAvailable,
      thumbnail: thumb,
    });
  }
  return list;
}
