"use client";

/* still / screens / breathe — the showcase.
   No top bar; a large extruded orb molded out of the sheet IS the
   start/pause control. Its scale tracks the active pattern phase
   (inhale expands, exhale sinks, holds stay) with a 400-600 ms-class
   slow ease-in-out — the one place long motion belongs. A ring pulse
   marks each phase change ("haptic feel"), cycles and elapsed time sit
   below, and a pressed-in well shows position inside the current cycle.
   Pattern picker = soft pills; the active one is carved in. */

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useStill } from "../state/still-context";
import { PATTERNS, formatClock } from "../lib/data";
import type { BreathPhase } from "../lib/data";

/* Orb scale at the end of each phase kind. */
const SCALE_INHALE = 1;
const SCALE_EXHALE = 0.68;

/** Resolve what the orb should be doing right now, given cycle time. */
function phaseAt(
  phases: BreathPhase[],
  cycleSeconds: number,
  t: number,
): { index: number; phase: BreathPhase; remain: number; target: number; travel: number } {
  const cycleT = ((t % cycleSeconds) + cycleSeconds) % cycleSeconds;
  let acc = 0;
  for (let i = 0; i < phases.length; i++) {
    const p = phases[i];
    if (cycleT < acc + p.seconds || i === phases.length - 1) {
      /* Hold takes the scale of the last non-hold looking backwards. */
      let target: number;
      let travel: number;
      if (p.kind === "inhale") {
        target = SCALE_INHALE;
        travel = p.seconds;
      } else if (p.kind === "exhale") {
        target = SCALE_EXHALE;
        travel = p.seconds;
      } else {
        let j = i;
        for (let k = 0; k < phases.length; k++) {
          const q = phases[(i - 1 - k + phases.length * 2) % phases.length];
          if (q.kind !== "hold") {
            j = (i - 1 - k + phases.length * 2) % phases.length;
            break;
          }
        }
        target = phases[j].kind === "inhale" ? SCALE_INHALE : SCALE_EXHALE;
        travel = 0.05;
      }
      return {
        index: i,
        phase: p,
        remain: Math.max(0, Math.ceil(acc + p.seconds - cycleT)),
        target,
        travel,
      };
    }
    acc += p.seconds;
  }
  /* unreachable — phases is never empty */
  return { index: 0, phase: phases[0], remain: 0, target: SCALE_EXHALE, travel: 0.05 };
}

const PHASE_LABEL: Record<BreathPhase["kind"], string> = {
  inhale: "Inhale",
  hold: "Hold",
  exhale: "Exhale",
};

export function BreatheScreen() {
  const { pattern, setPattern, addQuietMinutes, showToast } = useStill();
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds within this run
  const tickRef = useRef<number | null>(null);

  /* 100 ms heartbeat while breathing — drives position + counters. */
  useEffect(() => {
    if (!running) return;
    tickRef.current = window.setInterval(() => {
      setElapsed((e) => e + 0.1);
    }, 100);
    return () => {
      if (tickRef.current !== null) window.clearInterval(tickRef.current);
    };
  }, [running]);

  const cycles = Math.floor(elapsed / pattern.cycleSeconds);
  const state = useMemo(
    () => phaseAt(pattern.phases, pattern.cycleSeconds, elapsed),
    [pattern, elapsed],
  );
  const cycleT = ((elapsed % pattern.cycleSeconds) + pattern.cycleSeconds) % pattern.cycleSeconds;

  function pick(id: (typeof PATTERNS)[number]["id"]) {
    if (id === pattern.id) return;
    setRunning(false);
    setElapsed(0);
    setPattern(id);
  }

  function finish() {
    const min = elapsed / 60;
    setRunning(false);
    if (elapsed >= 20) {
      addQuietMinutes(min);
      showToast(`${Math.max(1, Math.round(min))} min of stillness saved`, "breath");
    } else if (elapsed > 0) {
      showToast("Session set down", "info");
    }
    setElapsed(0);
  }

  const orbStyle = {
    ["--orb-scale" as string]: state.target,
    ["--orb-travel" as string]: `${state.travel}s`,
  } as CSSProperties;

  return (
    <section className="st-screen st-screen--breathe" aria-label="Breathe">
      <div className="st-breathe">
        {/* pattern pills — active one is carved into the sheet */}
        <div className="st-pills" role="tablist" aria-label="Breathing pattern">
          {PATTERNS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={p.id === pattern.id}
              className={`st-pill${p.id === pattern.id ? " st-pill--on" : ""}`}
              onClick={() => pick(p.id)}
            >
              {p.name}
            </button>
          ))}
        </div>
        <p className="st-pills__blurb">{pattern.blurb}</p>

        {/* the orb itself is the start/pause control */}
        <div className="st-orb-zone">
          {running ? (
            <span
              key={`pulse-${cycles}-${state.index}`}
              className="st-orb__pulse"
              aria-hidden="true"
            />
          ) : null}
          <button
            type="button"
            className={`st-orb${running ? " st-orb--on" : ""}`}
            style={orbStyle}
            onClick={() => setRunning((r) => !r)}
            aria-label={running ? "Pause breathing" : "Begin breathing"}
          >
            <span className="st-orb__face">
              {running ? (
                <>
                  <span className="st-orb__phase">{PHASE_LABEL[state.phase.kind]}</span>
                  <span className="st-orb__count st-num">{state.remain}</span>
                </>
              ) : (
                <>
                  <span className="st-orb__phase">Begin</span>
                  <span className="st-orb__hint">tap to breathe</span>
                </>
              )}
            </span>
          </button>
        </div>

        {/* cycle position — a pressed-in soft track */}
        <div className="st-track" aria-hidden="true">
          <div
            className="st-track__fill"
            style={{ width: `${(cycleT / pattern.cycleSeconds) * 100}%` }}
          />
        </div>

        <div className="st-readout">
          <span className="st-readout__item">
            <b className="st-num">{cycles}</b>
            <span>cycles</span>
          </span>
          <span className="st-readout__dot" aria-hidden="true" />
          <span className="st-readout__item">
            <b className="st-num">{formatClock(elapsed)}</b>
            <span>elapsed</span>
          </span>
        </div>

        {elapsed > 0 ? (
          <button type="button" className="st-finish" onClick={finish}>
            {running ? "Pause & finish" : "Finish session"}
          </button>
        ) : (
          <span className="st-breathe__foot">One pattern, one breath at a time.</span>
        )}
      </div>
    </section>
  );
}
