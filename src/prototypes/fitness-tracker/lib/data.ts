/**
 * fitness-tracker / lib / data — types + realistic mock data.
 * Pure constants + helpers, no React imports.
 */

export interface DayActivity {
  /** Short label, e.g. "M". */
  label: string;
  /** Full day name, e.g. "Monday". */
  name: string;
  /** Move ring: kcal burned / goal. */
  move: number;
  moveGoal: number;
  /** Exercise ring: minutes / goal. */
  exercise: number;
  exerciseGoal: number;
  /** Stand ring: hours / goal. */
  stand: number;
  standGoal: number;
  steps: number;
  /** Resting heart rate bpm. */
  heartRate: number;
  /** Distance km. */
  distance: number;
}

export const WEEK_ACTIVITY: DayActivity[] = [
  { label: "M", name: "Monday", move: 412, moveGoal: 500, exercise: 24, exerciseGoal: 30, stand: 9, standGoal: 12, steps: 6210, heartRate: 64, distance: 4.4 },
  { label: "T", name: "Tuesday", move: 538, moveGoal: 500, exercise: 32, exerciseGoal: 30, stand: 11, standGoal: 12, steps: 8940, heartRate: 61, distance: 6.3 },
  { label: "W", name: "Wednesday", move: 226, moveGoal: 500, exercise: 12, exerciseGoal: 30, stand: 7, standGoal: 12, steps: 3120, heartRate: 66, distance: 2.2 },
  { label: "T", name: "Thursday", move: 610, moveGoal: 500, exercise: 41, exerciseGoal: 30, stand: 12, standGoal: 12, steps: 10480, heartRate: 59, distance: 7.5 },
  { label: "F", name: "Friday", move: 480, moveGoal: 500, exercise: 28, exerciseGoal: 30, stand: 10, standGoal: 12, steps: 7620, heartRate: 62, distance: 5.4 },
  { label: "S", name: "Saturday", move: 704, moveGoal: 500, exercise: 55, exerciseGoal: 30, stand: 12, standGoal: 12, steps: 12980, heartRate: 58, distance: 9.2 },
  { label: "S", name: "Sunday", move: 158, moveGoal: 500, exercise: 6, exerciseGoal: 30, stand: 5, standGoal: 12, steps: 1840, heartRate: 67, distance: 1.3 },
];

export type WorkoutKind = "run" | "cycle" | "swim" | "yoga" | "hiit";

export interface WorkoutType {
  id: WorkoutKind;
  name: string;
  /** kcal per minute, used by the session summary. */
  kcalPerMin: number;
  /** Tint class key for the icon disc. */
  tint: "blue" | "green" | "teal" | "indigo" | "orange";
}

export const WORKOUT_TYPES: WorkoutType[] = [
  { id: "run", name: "Run", kcalPerMin: 11.4, tint: "blue" },
  { id: "cycle", name: "Cycle", kcalPerMin: 9.2, tint: "green" },
  { id: "swim", name: "Swim", kcalPerMin: 10.1, tint: "teal" },
  { id: "yoga", name: "Yoga", kcalPerMin: 4.3, tint: "indigo" },
  { id: "hiit", name: "HIIT", kcalPerMin: 13.6, tint: "orange" },
];

/** Session goal in seconds (30 min) for the circular progress ring. */
export const SESSION_GOAL_SEC = 30 * 60;

export interface ProfileStats {
  streak: number;
  totalWorkouts: number;
  totalMinutes: number;
}

export const PROFILE_STATS: ProfileStats = {
  streak: 12,
  totalWorkouts: 148,
  totalMinutes: 8420,
};

export interface Achievement {
  id: string;
  name: string;
  tint: "blue" | "green" | "teal" | "indigo" | "orange";
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-5k", name: "First 5K", tint: "blue" },
  { id: "week-streak", name: "7-Day Streak", tint: "green" },
  { id: "early-bird", name: "Early Bird", tint: "orange" },
  { id: "century", name: "100 Workouts", tint: "indigo" },
  { id: "night-owl", name: "Night Owl", tint: "teal" },
];

export function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
