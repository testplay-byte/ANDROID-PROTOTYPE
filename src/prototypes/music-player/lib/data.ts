/**
 * music-player / lib / data — types + realistic mock data + helpers.
 * Pure logic, no React.
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  /** Duration in seconds. */
  duration: number;
  /** Album-art gradient index (0-5), mapped to CSS classes. */
  art: number;
}

export interface Playlist {
  id: string;
  name: string;
  trackCount: number;
  /** Cover gradient index (0-5), mapped to CSS classes. */
  art: number;
}

export const TRACKS: Track[] = [
  { id: "t1", title: "Midnight City Lights", artist: "Neon Harbor", album: "Afterglow", duration: 222, art: 0 },
  { id: "t2", title: "Golden Hour", artist: "Ivy Lune", album: "Sunroom", duration: 245, art: 1 },
  { id: "t3", title: "Static Bloom", artist: "Cassette Youth", album: "Analog Heart", duration: 198, art: 2 },
  { id: "t4", title: "Slow Motion", artist: "Mara Voss", album: "Tidal Rooms", duration: 302, art: 3 },
  { id: "t5", title: "Paper Planes Over Tokyo", artist: "Kite District", album: "Nightflights", duration: 235, art: 4 },
  { id: "t6", title: "Velvet Static", artist: "The Low Ceilings", album: "Hum", duration: 261, art: 5 },
  { id: "t7", title: "Ocean in Reverse", artist: "Sol Maré", album: "Blue Hour", duration: 213, art: 2 },
  { id: "t8", title: "Neon Rain", artist: "Nova Cascade", album: "Afterglow", duration: 252, art: 0 },
];

export const PLAYLISTS: Playlist[] = [
  { id: "p1", name: "Late Night Drive", trackCount: 24, art: 0 },
  { id: "p2", name: "Focus Flow", trackCount: 18, art: 3 },
  { id: "p3", name: "Indie Gems", trackCount: 32, art: 1 },
  { id: "p4", name: "Rainy Day Jazz", trackCount: 21, art: 4 },
  { id: "p5", name: "Workout Energy", trackCount: 27, art: 5 },
  { id: "p6", name: "Acoustic Mornings", trackCount: 15, art: 2 },
];

export function getTrackById(id: string): Track | undefined {
  return TRACKS.find((t) => t.id === id);
}

/** Next track id in order, or a random one when shuffle is on. */
export function getNextTrackId(currentId: string, shuffle: boolean): string {
  const idx = TRACKS.findIndex((t) => t.id === currentId);
  if (shuffle) {
    if (TRACKS.length < 2) return currentId;
    let next = idx;
    while (next === idx) {
      next = Math.floor(Math.random() * TRACKS.length);
    }
    return TRACKS[next].id;
  }
  return TRACKS[(idx + 1) % TRACKS.length].id;
}

/** Previous track id in order, or a random one when shuffle is on. */
export function getPrevTrackId(currentId: string, shuffle: boolean): string {
  const idx = TRACKS.findIndex((t) => t.id === currentId);
  if (shuffle) {
    if (TRACKS.length < 2) return currentId;
    let prev = idx;
    while (prev === idx) {
      prev = Math.floor(Math.random() * TRACKS.length);
    }
    return TRACKS[prev].id;
  }
  return TRACKS[(idx - 1 + TRACKS.length) % TRACKS.length].id;
}

/** 214 → "3:34" */
export function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}
