"use client";

/**
 * anime-app / screens / detail-screen — pushed detail view.
 *
 * Slides in from the right (CSS handled by the global .view[data-view="detail"]
 * rule in anime-app.css). Renders a banner + cover + title + meta pills +
 * add-to-library button + genres + expandable synopsis + episode list.
 *
 * `animeId` is null until the first card click — the screen renders an
 * empty placeholder until then. Once an id arrives, useAnimeDetail
 * fetches the full Media. On successful fetch the anime is pushed into
 * history (useHistory.add) so the History screen reflects latest views.
 *
 * The back button calls onBack() which the page wires to history.back()
 * so the browser's popstate + the slide-out animation both fire.
 *
 * Episode list: uses generateMockEpisodes() to synthesize per-episode data
 * (title, description, release date, sub/dub, thumbnail) since AniList
 * doesn't provide per-episode metadata via the Media query. The episode
 * list respects the user's episode display settings (decorative backgrounds,
 * two-line title) from useSettings().
 *
 * A gear icon on the Episodes section header opens the EpisodeSettingsView
 * (a pushed sub-view) where the user can configure the episode display.
 */
import { useEffect, useMemo, useState } from "react";
import { useAnimeDetail } from "../hooks/use-anilist";
import { useHistory } from "../hooks/use-history";
import { useLibrary } from "../hooks/use-library";
import { useSettings } from "../hooks/use-settings";
import { fmtScore, stripHtml, generateMockEpisodes } from "../lib/anilist";
import { formatLabel, statusLabel } from "../lib/filters";
import type { LibraryStatus } from "../lib/types";
import { EpisodeRow } from "../components/episode-row";
import { EpisodeSettingsView } from "../components/episode-settings-view";
import styles from "./detail-screen.module.css";

interface DetailScreenProps {
  active: boolean;
  animeId: number | null;
  onBack: () => void;
}

export function DetailScreen({ active, animeId, onBack }: DetailScreenProps) {
  const { anime, loading, error } = useAnimeDetail(animeId);
  const { add: addHistory } = useHistory();
  const { has, add: addToLib, remove: removeFromLib } = useLibrary();
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const [statusSelectorOpen, setStatusSelectorOpen] = useState(false);
  const [showEpisodeSettings, setShowEpisodeSettings] = useState(false);

  // Reset transient UI state when the anime changes.
  useEffect(() => {
    setSynopsisExpanded(false);
    setStatusSelectorOpen(false);
    setShowEpisodeSettings(false);
  }, [animeId]);

  // Push into history when the anime becomes available.
  useEffect(() => {
    if (anime) addHistory(anime);
  }, [anime, addHistory]);

  const inLib = anime ? has(anime.id) : false;

  function handleLibraryToggle(status: LibraryStatus = "watching") {
    if (!anime) return;
    if (inLib) {
      removeFromLib(anime.id);
    } else {
      addToLib(anime, status);
      setStatusSelectorOpen(false);
    }
  }

  return (
    <>
      <section
        className={`view ${active && !showEpisodeSettings ? "view--active" : ""}`}
        data-view="detail"
        aria-label="Anime detail"
        aria-hidden={!active}
      >
        <div className={styles.content}>
          {!animeId && <Placeholder />}

          {animeId && loading && <DetailSkeleton />}

          {animeId && !loading && error && (
            <div className={styles.errorState}>
              <div className={styles.errorIcon}>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 className={styles.errorTitle}>Could not load anime</h3>
              <p className={styles.errorDesc}>
                Check your connection and try again.
              </p>
              <button
                type="button"
                className="btn-outlined"
                style={{ marginTop: 12, flex: "0 0 auto" }}
                onClick={onBack}
              >
                Go back
              </button>
            </div>
          )}

          {animeId && !loading && !error && anime && (
            <DetailBody
              anime={anime}
              inLib={inLib}
              synopsisExpanded={synopsisExpanded}
              onToggleSynopsis={() => setSynopsisExpanded((v) => !v)}
              onBack={onBack}
              onLibraryToggle={() => handleLibraryToggle("watching")}
              onPickStatus={(s) => handleLibraryToggle(s)}
              statusSelectorOpen={statusSelectorOpen}
              onToggleStatusSelector={() =>
                setStatusSelectorOpen((v) => !v)
              }
              onOpenEpisodeSettings={() => setShowEpisodeSettings(true)}
            />
          )}
        </div>
      </section>

      {/* Episode settings sub-view — slides in on top of the detail view */}
      <EpisodeSettingsView
        active={active && showEpisodeSettings}
        onBack={() => setShowEpisodeSettings(false)}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Detail body — banner + cover + title + meta + actions + body sections.
// ---------------------------------------------------------------------------

interface DetailBodyProps {
  anime: NonNullable<ReturnType<typeof useAnimeDetail>["anime"]>;
  inLib: boolean;
  synopsisExpanded: boolean;
  onToggleSynopsis: () => void;
  onBack: () => void;
  onLibraryToggle: () => void;
  onPickStatus: (s: LibraryStatus) => void;
  statusSelectorOpen: boolean;
  onToggleStatusSelector: () => void;
  onOpenEpisodeSettings: () => void;
}

function DetailBody({
  anime,
  inLib,
  synopsisExpanded,
  onToggleSynopsis,
  onBack,
  onLibraryToggle,
  onPickStatus,
  statusSelectorOpen,
  onToggleStatusSelector,
  onOpenEpisodeSettings,
}: DetailBodyProps) {
  const { settings } = useSettings();
  const title = anime.title.romaji || anime.title.english || "Unknown";
  const englishSub =
    anime.title.english && anime.title.english !== title
      ? anime.title.english
      : "";
  const banner =
    anime.bannerImage ||
    anime.coverImage.extraLarge ||
    anime.coverImage.large ||
    "";
  const cover = anime.coverImage.large || anime.coverImage.extraLarge || "";
  const synopsis = stripHtml(anime.description);

  // Meta pills: score / status / episodes / format.
  const metaPills: string[] = [];
  if (anime.averageScore)
    metaPills.push(`★ ${fmtScore(anime.averageScore)}`);
  if (anime.status) metaPills.push(statusLabel(anime.status));
  if (anime.episodes) metaPills.push(`${anime.episodes} ep`);
  else if (anime.nextAiringEpisode?.episode)
    metaPills.push(`Ep ${anime.nextAiringEpisode.episode} soon`);
  if (anime.format) metaPills.push(formatLabel(anime.format));

  // Generate mock episode data (memoized so it's stable across re-renders).
  const episodes = useMemo(
    () => generateMockEpisodes(anime),
    [anime],
  );

  return (
    <>
      <div className={styles.banner}>
        {banner && <img src={banner} alt={title} />}
      </div>
      <button
        type="button"
        className={styles.back}
        onClick={onBack}
        aria-label="Back"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      <div className={styles.header}>
        <div className={styles.cover}>
          {cover && <img src={cover} alt={title} />}
        </div>
        <div className={styles.info}>
          <h1 className={styles.title}>{title}</h1>
          {englishSub && (
            <span className={styles.subtitle}>{englishSub}</span>
          )}
          <div className={styles.meta}>
            {metaPills.map((p, i) => (
              <span key={i} className={styles.metaPill}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.libButtonWrap}>
          <button
            type="button"
            className={inLib ? "btn-filled" : "btn-outlined"}
            onClick={() => {
              if (inLib) {
                onLibraryToggle();
              } else {
                onToggleStatusSelector();
              }
            }}
          >
            {inLib ? "In Library ✓" : "+ Add to Library"}
          </button>
          {statusSelectorOpen && !inLib && (
            <div className={styles.statusSelector} role="menu">
              {(["watching", "completed", "plan"] as LibraryStatus[]).map(
                (s) => (
                  <button
                    key={s}
                    type="button"
                    className={styles.statusItem}
                    onClick={() => onPickStatus(s)}
                    role="menuitem"
                  >
                    {statusLabelForLib(s)}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </div>

      <div className={styles.body}>
        {anime.genres && anime.genres.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Genres</h3>
            <div className={styles.genres}>
              {anime.genres.map((g) => (
                <span key={g} className={styles.genreChip}>
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Synopsis</h3>
          <p
            className={`${styles.synopsis} ${synopsisExpanded ? styles.synopsisExpanded : ""}`}
          >
            {synopsis}
          </p>
          <button
            type="button"
            className={styles.expand}
            onClick={onToggleSynopsis}
          >
            {synopsisExpanded ? "Show less" : "Read more"}
          </button>
        </div>

        {episodes.length > 0 && (
          <div className={styles.section}>
            <div className={styles.episodeHeader}>
              <h3 className={styles.sectionTitle}>Episodes</h3>
              <button
                type="button"
                className={styles.episodeSettingsBtn}
                onClick={onOpenEpisodeSettings}
                aria-label="Episode display settings"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
            </div>
            <div className={styles.episodeList}>
              {episodes.map((ep) => (
                <EpisodeRow
                  key={ep.number}
                  episode={ep}
                  showDecorativeBackgrounds={settings.episodeShowDecorativeBackgrounds}
                  allowTwoLineTitle={settings.episodeAllowTwoLineTitle}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function statusLabelForLib(s: LibraryStatus): string {
  if (s === "watching") return "Watching";
  if (s === "completed") return "Completed";
  return "Plan to Watch";
}

// ---------------------------------------------------------------------------
// Skeleton + placeholder.
// ---------------------------------------------------------------------------

function DetailSkeleton() {
  return (
    <>
      <div className={styles.bannerSkeleton} />
      <div className={styles.header}>
        <div className={`${styles.cover} ${styles.coverSkeleton}`} />
        <div className={styles.info}>
          <div
            className={styles.lineSkeleton}
            style={{ height: 24, width: "60%", marginBottom: 8 }}
          />
          <div
            className={styles.lineSkeleton}
            style={{ height: 16, width: "40%" }}
          />
        </div>
      </div>
    </>
  );
}

function Placeholder() {
  return (
    <div className={styles.placeholder}>
      <p>Select an anime to view details.</p>
    </div>
  );
}
