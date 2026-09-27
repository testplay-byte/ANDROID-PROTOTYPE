"use client";

/* still / screens / today — the landing tab.
   Quiet centered label header, greeting, extruded streak disc,
   "today's intention" soft card and three pillow-soft recommended
   session cards that sink in on press and hand off to #breathe. */

import type { CSSProperties } from "react";
import { useStill } from "../state/still-context";
import {
  formatDuration,
  greeting,
  intentionOfDate,
  recommendedSessions,
} from "../lib/data";
import { LeafIcon, PlayIcon } from "../components/icons";

interface TodayScreenProps {
  onNavigate: (view: "today" | "breathe" | "sessions" | "profile") => void;
}

export function TodayScreen({ onNavigate }: TodayScreenProps) {
  const { streak, totalMinutes, completeCount } = useStill();
  const recommended = recommendedSessions();
  const intention = intentionOfDate();

  return (
    <section className="st-screen" aria-label="Today">
      <div className="st-content">
        {/* quiet centered header — no large title, no floating pill */}
        <header className="st-head" style={({ ["--stagger" as string]: "0ms" } as CSSProperties)}>
          <span className="st-head__label">Today</span>
          <h1 className="st-head__greet">{greeting()}</h1>
        </header>

        {/* streak disc — an extruded soft ring molded out of the sheet */}
        <div
          className="st-streak"
          style={({ ["--stagger" as string]: "70ms" } as CSSProperties)}
          aria-label={`${streak} day streak`}
        >
          <div className="st-streak__disc" aria-hidden="true">
            <div className="st-streak__well">
              <b className="st-num">{streak}</b>
              <span>days</span>
            </div>
          </div>
          <div className="st-streak__meta">
            <b>Quiet streak</b>
            <span>
              {totalMinutes} min stillness · {completeCount} session
              {completeCount === 1 ? "" : "s"} done
            </span>
            <span className="st-streak__hint">Stillness compounds slowly.</span>
          </div>
        </div>

        {/* intention card — one soft extruded slab, pressed on tap */}
        <button
          type="button"
          className="st-intention"
          style={({ ["--stagger" as string]: "140ms" } as CSSProperties)}
          onClick={() => onNavigate("breathe")}
        >
          <span className="st-intention__eyebrow">
            <LeafIcon size={14} />
            Today&apos;s intention
          </span>
          <span className="st-intention__line">{intention}</span>
        </button>

        <h2 className="st-sechead" style={({ ["--stagger" as string]: "210ms" } as CSSProperties)}>
          Recommended
        </h2>

        {/* pillow-soft cards — pressing sinks them into the sheet */}
        <div className="st-reco">
          {recommended.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className="st-reco__card"
              style={{ ["--stagger" as string]: `${260 + i * 60}ms` } as CSSProperties}
              onClick={() => onNavigate("breathe")}
            >
              <span className="st-reco__disc" aria-hidden="true">
                <PlayIcon size={16} />
              </span>
              <span className="st-reco__text">
                <b>{s.title}</b>
                <span>{s.mood}</span>
              </span>
              <span className="st-reco__dur st-num">{formatDuration(s.durationMin)}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
