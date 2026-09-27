/* still / lib / data — the meditation catalogue and breathing patterns.

   Types, 3 guided breathing patterns (box / calm 4-7-8 / ocean), a library
   of sessions grouped into programs, length filters, and small pure
   helpers (formatting, greetings, intonation-of-the-day). No React, no
   state — screens and the provider read from here. */

/* ---------------------------------------------------------------------------
   Breathing patterns
   --------------------------------------------------------------------------- */

export type PhaseKind = "inhale" | "hold" | "exhale";

export interface BreathPhase {
  kind: PhaseKind;
  /** Seconds this phase lasts. */
  seconds: number;
}

export interface BreathPattern {
  id: "box" | "calm" | "ocean";
  name: string;
  /** Short line shown under the pattern picker. */
  blurb: string;
  /** One full cycle; the sum of every phase's seconds. */
  cycleSeconds: number;
  phases: BreathPhase[];
}

export const PATTERNS: BreathPattern[] = [
  {
    id: "box",
    name: "Box",
    blurb: "4-4-4-4 · steady focus",
    cycleSeconds: 16,
    phases: [
      { kind: "inhale", seconds: 4 },
      { kind: "hold", seconds: 4 },
      { kind: "exhale", seconds: 4 },
      { kind: "hold", seconds: 4 },
    ],
  },
  {
    id: "calm",
    name: "Calm",
    blurb: "4-7-8 · down-regulate",
    cycleSeconds: 19,
    phases: [
      { kind: "inhale", seconds: 4 },
      { kind: "hold", seconds: 7 },
      { kind: "exhale", seconds: 8 },
    ],
  },
  {
    id: "ocean",
    name: "Ocean",
    blurb: "5-2-6 · tide rhythm",
    cycleSeconds: 13,
    phases: [
      { kind: "inhale", seconds: 5 },
      { kind: "hold", seconds: 2 },
      { kind: "exhale", seconds: 6 },
    ],
  },
];

export function patternById(id: BreathPattern["id"]): BreathPattern {
  return PATTERNS.find((p) => p.id === id) ?? PATTERNS[0];
}

/* ---------------------------------------------------------------------------
   Session library
   --------------------------------------------------------------------------- */

export interface Session {
  id: string;
  title: string;
  /** Program id this session belongs to. */
  program: string;
  durationMin: number;
  /** Short mood line shown on Today's recommendation cards. */
  mood: string;
}

export interface Program {
  id: string;
  name: string;
  line: string;
}

export const PROGRAMS: Program[] = [
  { id: "grounding", name: "Grounding", line: "Arrive in the body" },
  { id: "sleep", name: "Wind Down", line: "Ease toward sleep" },
  { id: "focus", name: "Clear Mind", line: "Settle attention" },
];

export const SESSIONS: Session[] = [
  { id: "s-morning-still", title: "Morning Stillness", program: "grounding", durationMin: 5, mood: "Start unhurried" },
  { id: "s-body-anchor", title: "Body Anchor", program: "grounding", durationMin: 10, mood: "Settle the shoulders" },
  { id: "s-earth-breath", title: "Earth Breath", program: "grounding", durationMin: 15, mood: "Weight and warmth" },
  { id: "s-lantern", title: "Lantern Walk", program: "grounding", durationMin: 20, mood: "Slow, lit, unhurried" },

  { id: "s-easing", title: "Easing Off", program: "sleep", durationMin: 5, mood: "Lights low" },
  { id: "s-heavy-blanket", title: "Heavy Blanket", program: "sleep", durationMin: 10, mood: "Sink downward" },
  { id: "s-long-tide", title: "Long Tide", program: "sleep", durationMin: 20, mood: "Outlasting thought" },

  { id: "s-one-page", title: "One Page", program: "focus", durationMin: 3, mood: "Before the first tab" },
  { id: "s-reset", title: "Field Reset", program: "focus", durationMin: 5, mood: "Between two tasks" },
  { id: "s-deep-work", title: "Deep Water", program: "focus", durationMin: 15, mood: "Hold one line" },
];

export function sessionsOfProgram(programId: string): Session[] {
  return SESSIONS.filter((s) => s.program === programId);
}

export function sessionById(id: string): Session | undefined {
  return SESSIONS.find((s) => s.id === id);
}

/* Today's three recommendations — a fixed quiet trio. */
export const RECOMMENDED_IDS = ["s-morning-still", "s-body-anchor", "s-easing"];

export function recommendedSessions(): Session[] {
  return RECOMMENDED_IDS.map((id) => sessionById(id)).filter(
    (s): s is Session => Boolean(s),
  );
}

/* ---------------------------------------------------------------------------
   Length filter (soft segmented control on Sessions)
   --------------------------------------------------------------------------- */

export type LengthFilter = "all" | "short" | "medium" | "long";

export const LENGTH_FILTERS: { id: LengthFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "short", label: "≤ 5" },
  { id: "medium", label: "6–14" },
  { id: "long", label: "15+" },
];

export function matchesLength(session: Session, filter: LengthFilter): boolean {
  if (filter === "all") return true;
  if (filter === "short") return session.durationMin <= 5;
  if (filter === "medium") return session.durationMin >= 6 && session.durationMin <= 14;
  return session.durationMin >= 15;
}

/* ---------------------------------------------------------------------------
   Small helpers
   --------------------------------------------------------------------------- */

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

export function formatDuration(min: number): string {
  return `${min} min`;
}

export function greeting(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 5) return "Still awake";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/** "today's intention" — one quiet line, chosen deterministically per day. */
export function intentionOfDate(date: Date = new Date()): string {
  const key = date.getFullYear() * 372 + date.getMonth() * 31 + date.getDate();
  const lines = [
    "Let one thing be enough today.",
    "The pause is not lost time.",
    "Nothing needs to be decided in this breath.",
    "Arrive before you begin.",
    "Softness is a kind of strength.",
  ];
  return lines[key % lines.length];
}
