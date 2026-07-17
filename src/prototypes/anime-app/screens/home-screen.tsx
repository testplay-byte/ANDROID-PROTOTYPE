"use client";

/**
 * anime-app / screens / home-screen — landing screen.
 *
 * Renders the trending hero carousel + "Popular This Season" + "Top Rated"
 * grids. All three come from a single useHomeData() call (three parallel
 * AniList queries). Cards open the detail screen via onClick(id).
 *
 * The `active` prop drives the global .view--active toggle so the page
 * can fade this screen in/out without unmounting it (preserves scroll
 * position + state across navigation).
 */
import type { ReactNode } from "react";
import { useHomeData } from "../hooks/use-anilist";
import { useSettings } from "../hooks/use-settings";
import { HeroCarousel } from "../components/hero-carousel";
import { AnimeCard } from "../components/anime-card";
import styles from "./home-screen.module.css";

interface HomeScreenProps {
  active: boolean;
  onOpenAnime: (id: number) => void;
}

export function HomeScreen({ active, onOpenAnime }: HomeScreenProps) {
  const { settings } = useSettings();
  const { trending, seasonal, topRated, loading } = useHomeData();
  const densityClass = densityToClass(settings.cardDensity);

  return (
    <section
      className={`view ${active ? "view--active" : ""}`}
      data-view="home"
      aria-label="Home"
      aria-hidden={!active}
    >
      <div className={styles.topbar}>
        <h1 className={styles.topbarTitle}>Anime</h1>
      </div>
      <div className={styles.content}>
        {/* Hero / Trending */}
        <div className={styles.heroWrap}>
          {loading && trending.length === 0 ? (
            <div className={styles.heroSkeleton} aria-hidden="true" />
          ) : (
            <HeroCarousel slides={trending} onClick={onOpenAnime} />
          )}
        </div>

        {/* Popular This Season */}
        <div className={styles.tray}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Popular This Season</span>
          </div>
          <div className={`${styles.grid} results-grid ${densityClass}`}>
            {loading && seasonal.length === 0
              ? renderSkeletons(6)
              : seasonal.map((a, i) => (
                  <AnimeCard
                    key={a.id}
                    anime={a}
                    index={i}
                    onClick={onOpenAnime}
                  />
                ))}
          </div>
        </div>

        {/* Top Rated */}
        <div className={styles.tray}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Top Rated</span>
          </div>
          <div
            className={`${styles.grid} ${styles.gridThree} results-grid ${densityClass}`}
          >
            {loading && topRated.length === 0
              ? renderSkeletons(9)
              : topRated.map((a, i) => (
                  <AnimeCard
                    key={a.id}
                    anime={a}
                    index={i}
                    onClick={onOpenAnime}
                  />
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function densityToClass(d: "default" | "compact" | "comfortable"): string {
  if (d === "compact") return "results-grid--compact";
  if (d === "comfortable") return "results-grid--comfortable";
  return "";
}

function renderSkeletons(count: number): ReactNode {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className={styles.skeletonCard} aria-hidden="true">
      <div className={styles.skeletonCover} />
      <div className={styles.skeletonLine} />
      <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
    </div>
  ));
}
