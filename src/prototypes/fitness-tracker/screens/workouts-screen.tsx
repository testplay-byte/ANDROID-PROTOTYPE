"use client";

/**
 * fitness-tracker / screens / workouts-screen — list of workout types
 * (Run, Cycle, Swim, Yoga, HIIT) as iOS rows with icon disc + chevron.
 * Tapping one opens an inline session: big circular progress ring with
 * elapsed time (setInterval while running) and start/pause/reset controls.
 */

import { useEffect, useRef, useState } from "react";
import { TopBar } from "../../../proto-kit";
import {
  WORKOUT_TYPES,
  SESSION_GOAL_SEC,
  formatClock,
  type WorkoutType,
} from "../lib/data";
import { Group, Row, SectionLabel } from "../components/grouped-list";
import styles from "./workouts-screen.module.css";

type SessionState = "idle" | "running" | "paused";

export function WorkoutsScreen() {
  const [selected, setSelected] = useState<WorkoutType | null>(null);
  const [state, setState] = useState<SessionState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Interval while running.
  useEffect(() => {
    if (state !== "running") return;
    timerRef.current = setInterval(() => {
      setElapsed((s) => Math.min(SESSION_GOAL_SEC, s + 1));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state]);

  // Auto-pause at the goal.
  useEffect(() => {
    if (elapsed >= SESSION_GOAL_SEC && state === "running") {
      setState("paused");
    }
  }, [elapsed, state]);

  function startSession(w: WorkoutType) {
    setSelected(w);
    setState("running");
    setElapsed(0);
  }

  function exitSession() {
    setSelected(null);
    setState("idle");
    setElapsed(0);
  }

  if (selected) {
    return (
      <SessionView
        workout={selected}
        state={state}
        elapsed={elapsed}
        onStart={() => setState("running")}
        onPause={() => setState("paused")}
        onReset={() => {
          setElapsed(0);
          setState("idle");
        }}
        onEnd={exitSession}
      />
    );
  }

  return (
    <div className={styles.root}>
      <TopBar variant="center" title="Workouts" />

      <div className={styles.content}>
        <SectionLabel>Start a workout</SectionLabel>
        <Group>
          {WORKOUT_TYPES.map((w, i) => (
            <Row
              key={w.id}
              icon={<WorkoutIcon kind={w.id} />}
              iconClassName={styles[w.tint]}
              title={w.name}
              subtitle={`~${Math.round(w.kcalPerMin)} kcal/min`}
              chevron
              last={i === WORKOUT_TYPES.length - 1}
              onClick={() => startSession(w)}
            />
          ))}
        </Group>

        <p className={styles.hint}>
          Tap a workout to start a {SESSION_GOAL_SEC / 60}-minute session.
        </p>
      </div>
    </div>
  );
}

/* ---- Inline session view ---- */

function SessionView({
  workout,
  state,
  elapsed,
  onStart,
  onPause,
  onReset,
  onEnd,
}: {
  workout: WorkoutType;
  state: SessionState;
  elapsed: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onEnd: () => void;
}) {
  const progress = Math.min(1, elapsed / SESSION_GOAL_SEC);
  const r = 84;
  const c = 2 * Math.PI * r;
  const kcal = Math.round(elapsed * (workout.kcalPerMin / 60));

  return (
    <div className={styles.root}>
      <TopBar
        variant="center"
        title={workout.name}
        leading={
          <button type="button" className={styles.backBtn} aria-label="End session" onClick={onEnd}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        }
      />

      <div className={styles.content}>
        <div className={styles.timerWrap}>
          <svg width="200" height="200" viewBox="0 0 200 200" role="img" aria-label={`Elapsed ${formatClock(elapsed)} of 30 minutes`}>
            <circle cx="100" cy="100" r={r} fill="none" stroke="var(--ring-track)" strokeWidth="10" />
            <circle
              cx="100"
              cy="100"
              r={r}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - progress)}
              transform="rotate(-90 100 100)"
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div className={styles.timerCenter}>
            <span className={styles.timerTime}>{formatClock(elapsed)}</span>
            <span className={styles.timerLabel}>
              {state === "running" ? "Recording" : state === "paused" ? "Paused" : "Ready"}
            </span>
          </div>
        </div>

        <div className={styles.sessionStats}>
          <div className={styles.sessionStat}>
            <span className={styles.sessionStatValue}>{kcal}</span>
            <span className={styles.sessionStatLabel}>kcal</span>
          </div>
          <div className={styles.sessionStat}>
            <span className={styles.sessionStatValue}>{Math.round(progress * 100)}%</span>
            <span className={styles.sessionStatLabel}>of 30 min</span>
          </div>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.controlBtn}
            aria-label="Reset session"
            onClick={onReset}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.controlBtn} ${styles.controlPrimary}`}
            aria-label={state === "running" ? "Pause" : "Start"}
            onClick={state === "running" ? onPause : onStart}
            disabled={elapsed >= SESSION_GOAL_SEC}
          >
            {state === "running" ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6,4 20,12 6,20" />
              </svg>
            )}
          </button>
          <button
            type="button"
            className={styles.controlBtn}
            aria-label="End workout"
            onClick={onEnd}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="7" width="16" height="10" rx="2" />
              <line x1="8" y1="7" x2="8" y2="17" />
            </svg>
          </button>
        </div>

        <p className={styles.hint}>
          {state === "running"
            ? "Recording — tap pause to take a break."
            : elapsed >= SESSION_GOAL_SEC
              ? "Session goal reached. Nice work."
              : "Tap start to begin the timer."}
        </p>
      </div>
    </div>
  );
}

/* ---- Workout icons ---- */

function WorkoutIcon({ kind }: { kind: string }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (kind) {
    case "run":
      return (
        <svg {...common}>
          <circle cx="15" cy="4.5" r="1.8" />
          <path d="m13 22 2-6-3.5-2.5L14 9l-3-1.5L8 10" />
          <path d="M15 16h4l1 6" />
          <path d="M6.5 13 4 14.5" />
        </svg>
      );
    case "cycle":
      return (
        <svg {...common}>
          <circle cx="5.5" cy="17.5" r="3.5" />
          <circle cx="18.5" cy="17.5" r="3.5" />
          <path d="M12 17.5 8 8h4l3 5 3.5-1" />
          <circle cx="15" cy="4" r="1.5" />
        </svg>
      );
    case "swim":
      return (
        <svg {...common}>
          <circle cx="16" cy="6" r="1.8" />
          <path d="M3 15c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0" />
          <path d="M3 19.5c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0" />
          <path d="m6 12 4-3 4 1.5" />
        </svg>
      );
    case "yoga":
      return (
        <svg {...common}>
          <circle cx="12" cy="4" r="2" />
          <path d="M12 7v6" />
          <path d="M5 10l7 3 7-3" />
          <path d="M12 13l-5 7M12 13l5 7" />
        </svg>
      );
    case "hiit":
    default:
      return (
        <svg {...common}>
          <path d="M6.5 6.5v11M17.5 6.5v11" />
          <path d="M3 9v6M21 9v6" />
          <path d="M6.5 12h11" />
        </svg>
      );
  }
}
