"use client";

/**
 * music-player / page — the prototype entry point.
 *
 * Renders the full shell:
 *   DeviceThemeProvider (theme, scoped to .device, persisted) →
 *   Stage (left/right info panels + device) →
 *   DeviceFrame (style="neumorph", light default) → Screen →
 *   view switch + BottomNav variant="soft".
 *
 * Player state (current track, playing flag, progress, shuffle, repeat,
 * likes) lives here so the Library screen can load songs into the Player.
 *
 * Hash router: #player / #library / #playlists / #settings.
 */

import { useEffect, useState } from "react";
import {
  DeviceThemeProvider,
  DeviceFrame,
  Screen,
  Stage,
  BottomNav,
  PanelBadge,
  PanelTitle,
  PanelDesc,
  PanelHead,
  useSwipeSimulation,
} from "../../../src/proto-kit";
import { PlayerScreen } from "../../../src/prototypes/music-player/screens/player-screen";
import { LibraryScreen } from "../../../src/prototypes/music-player/screens/library-screen";
import { PlaylistsScreen } from "../../../src/prototypes/music-player/screens/playlists-screen";
import { SettingsScreen } from "../../../src/prototypes/music-player/screens/settings-screen";
import {
  TRACKS,
  getTrackById,
  getNextTrackId,
  getPrevTrackId,
  formatTime,
} from "../../../src/prototypes/music-player/lib/data";
import {
  PlayIcon,
  LibraryIcon,
  PlaylistIcon,
  SettingsIcon,
} from "../../../src/prototypes/music-player/components/icons";

type ViewId = "player" | "library" | "playlists" | "settings";
type RepeatMode = "off" | "all" | "one";

const NAV_ITEMS = [
  {
    id: "player",
    label: "Player",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M12 3v2.5M12 18.5V21" />
      </svg>
    ),
  },
  {
    id: "library",
    label: "Library",
    icon: <LibraryIcon />,
  },
  {
    id: "playlists",
    label: "Playlists",
    icon: <PlaylistIcon />,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <SettingsIcon />,
  },
];

const SWIPE_ORDER: ViewId[] = ["player", "library", "playlists", "settings"];

const SCREEN_INFO: Record<ViewId, { name: string; desc: string }> = {
  player: {
    name: "Player",
    desc: "Now playing — album art, progress, transport and playback toggles.",
  },
  library: {
    name: "Library",
    desc: "All tracks. Tap a song to load it into the Player.",
  },
  playlists: {
    name: "Playlists",
    desc: "Curated collections in a soft puffy grid.",
  },
  settings: {
    name: "Settings",
    desc: "Theme and playback switches with carved / extruded states.",
  },
};

function readHashView(): ViewId {
  if (typeof window === "undefined") return "player";
  const h = window.location.hash.replace(/^#/, "");
  return (SWIPE_ORDER as string[]).includes(h) ? (h as ViewId) : "player";
}

export default function Page() {
  const [view, setView] = useState<ViewId>("player");

  // ── Shared player state ──────────────────────────────────────────────
  const [trackId, setTrackId] = useState<string>(TRACKS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(38); // seconds into the track
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("off");
  const [likedIds, setLikedIds] = useState<string[]>([TRACKS[1].id, TRACKS[4].id]);

  const track = getTrackById(trackId) ?? TRACKS[0];

  // ── Hash routing ─────────────────────────────────────────────────────
  useEffect(() => {
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#player");
      } catch {
        /* sandbox may block hash writes — ignore */
      }
    } else {
      setView(readHashView());
    }
  }, []);

  useEffect(() => {
    function onPop() {
      setView(readHashView());
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function handleNav(id: string) {
    if (id === view) return;
    try {
      history.pushState(null, "", `#${id}`);
    } catch {
      /* ignore */
    }
    setView(id as ViewId);
  }

  // ── Simulated playback timer ─────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) return;
    const t = window.setInterval(() => {
      setProgress((p) => {
        if (p + 1 < track.duration) return p + 1;
        // Track ended.
        if (repeat === "one") return 0;
        setTrackId((cur) =>
          repeat === "all" || shuffle
            ? getNextTrackId(cur, shuffle)
            : getNextTrackId(cur, false)
        );
        return 0;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [isPlaying, track.duration, repeat, shuffle]);

  // ── Player actions ───────────────────────────────────────────────────
  function playTrack(id: string) {
    setTrackId(id);
    setProgress(0);
    setIsPlaying(true);
  }

  function nextTrack() {
    setTrackId((cur) => getNextTrackId(cur, shuffle));
    setProgress(0);
  }

  function prevTrack() {
    // Restart if a few seconds in, otherwise go to the previous track.
    if (progress > 4) {
      setProgress(0);
      return;
    }
    setTrackId((cur) => getPrevTrackId(cur, shuffle));
    setProgress(0);
  }

  function toggleLike(id: string) {
    setLikedIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );
  }

  function cycleRepeat() {
    setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off"));
  }

  function seekTo(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setProgress(Math.round(frac * track.duration));
  }

  // ── Swipe gestures (proto-kit) ───────────────────────────────────────
  useSwipeSimulation({
    enabled: true,
    onSwipeLeft: () => {
      const idx = SWIPE_ORDER.indexOf(view);
      if (idx >= 0 && idx < SWIPE_ORDER.length - 1) handleNav(SWIPE_ORDER[idx + 1]);
    },
    onSwipeRight: () => {
      const idx = SWIPE_ORDER.indexOf(view);
      if (idx > 0) handleNav(SWIPE_ORDER[idx - 1]);
    },
  });

  const info = SCREEN_INFO[view];

  return (
    <DeviceThemeProvider storageKey="music-player-theme" initialTheme="light">
      <Stage
        leftPanel={
          <>
            <PanelBadge>prototype</PanelBadge>
            <PanelTitle>Music Player</PanelTitle>
            <PanelDesc>
              A neumorphism (soft UI) music player. Extruded plastic surfaces
              shaped by dual shadows — no borders, one warm accent. Four
              screens: Player, Library, Playlists and Settings with a
              simulated playback engine.
            </PanelDesc>
            <div className="tags">
              <span className="tag">Neumorphism</span>
              <span className="tag">Soft UI</span>
              <span className="tag">4 screens</span>
            </div>
          </>
        }
        rightPanel={
          <>
            <PanelHead>Screen info</PanelHead>
            <div className="screeninfo">
              <span className="screeninfo__name">{info.name}</span>
              <span className="screeninfo__desc">{info.desc}</span>
            </div>

            <PanelHead>Interactions</PanelHead>
            <div className="mini-bars">
              <MiniBar label="Play" width="100%" color="var(--color-primary)" />
              <MiniBar label="Seek" width="85%" color="var(--color-tertiary)" />
              <MiniBar label="Like" width="70%" color="var(--color-error)" />
              <MiniBar label="Shuffle" width="55%" color="var(--color-warn)" />
              <MiniBar label="Repeat" width="45%" color="var(--color-secondary)" />
            </div>

            <PanelHead>Design</PanelHead>
            <div className="kvlist">
              <div className="kvlist__row">
                <span>Style</span>
                <b>Neumorph</b>
              </div>
              <div className="kvlist__row">
                <span>Elevation</span>
                <b>Dual shadow</b>
              </div>
              <div className="kvlist__row">
                <span>Accent</span>
                <b>Warm amber</b>
              </div>
            </div>
          </>
        }
      >
        <DeviceFrame theme="light" style="neumorph">
          <Screen>
            <div className="view" key={view}>
              {view === "player" && (
                <PlayerScreen
                  track={track}
                  isPlaying={isPlaying}
                  progress={progress}
                  shuffle={shuffle}
                  repeat={repeat}
                  liked={likedIds.includes(track.id)}
                  onTogglePlay={() => setIsPlaying((p) => !p)}
                  onNext={nextTrack}
                  onPrev={prevTrack}
                  onSeek={seekTo}
                  onToggleShuffle={() => setShuffle((s) => !s)}
                  onCycleRepeat={cycleRepeat}
                  onToggleLike={() => toggleLike(track.id)}
                />
              )}
              {view === "library" && (
                <LibraryScreen
                  currentTrackId={trackId}
                  isPlaying={isPlaying}
                  likedIds={likedIds}
                  onPlayTrack={playTrack}
                  onToggleLike={toggleLike}
                />
              )}
              {view === "playlists" && <PlaylistsScreen onOpenPlaylist={playTrack} />}
              {view === "settings" && <SettingsScreen />}
            </div>
          </Screen>

          <BottomNav
            items={NAV_ITEMS}
            activeId={view}
            onSelect={handleNav}
            variant="soft"
          />
        </DeviceFrame>
      </Stage>
    </DeviceThemeProvider>
  );

  /** Small helper — current time readout for the right panel. */
  function MiniBar({ label, width, color }: { label: string; width: string; color: string }) {
    return (
      <div className="mini-bar-row">
        <span className="mini-bar-label">{label}</span>
        <div className="mini-bar-track">
          <div className="mini-bar-fill" style={{ width, background: color }} />
        </div>
        <span className="mini-bar-num">{label === "Play" ? formatTime(progress) : "•"}</span>
      </div>
    );
  }
}
