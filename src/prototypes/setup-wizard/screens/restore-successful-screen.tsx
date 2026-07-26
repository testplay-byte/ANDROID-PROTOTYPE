"use client";
/**
 * setup-wizard / screens / restore-successful-screen — step 11.
 *
 * Shows "Restore successful!" with the total number of anime restored.
 * Auto-advances after 5 seconds, or the user can click Continue to
 * advance to the finish screen (step 12).
 */
import { useEffect } from "react";
import type { ThemePalette } from "../lib/themes";
import type { LinkedAnime } from "../hooks/use-wizard-state";

interface RestoreSuccessfulScreenProps {
  active: boolean;
  onNext: () => void;
  palette: ThemePalette;
  linkedAnime: LinkedAnime[];
}

export function RestoreSuccessfulScreen({ active, onNext, palette, linkedAnime }: RestoreSuccessfulScreenProps) {
  const restoredCount = linkedAnime.filter((a) => a.linked).length + 247; // mock: 247 + linked extras

  // Auto-advance after 5 seconds.
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => {
      onNext();
    }, 5000);
    return () => clearTimeout(t);
  }, [active, onNext]);

  return (
    <div className={`wizard-step ${active ? "wizard-step--active" : ""}`}>
      <div className="wizard-content">
        {/* Success animation — checkmark with expanding rings */}
        <div className="illustration" key={active ? "on" : "off"}>
          <svg viewBox="0 0 200 200" role="img" aria-label="Restore successful" style={{ overflow: "visible", width: "100%", height: "100%" }}>
            <style>{`
              .rs-glow { transform-box: fill-box; transform-origin: center; animation: rs-glow 2s ease-in-out infinite; }
              @keyframes rs-glow { 0%,100% { opacity: 0.25; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.15); } }
              .rs-ring { transform-box: fill-box; transform-origin: center; }
              .rs-ring-1 { animation: rs-expand 2.5s ease-out infinite; }
              .rs-ring-2 { animation: rs-expand 2.5s ease-out infinite 0.6s; }
              .rs-ring-3 { animation: rs-expand 2.5s ease-out infinite 1.2s; }
              @keyframes rs-expand { 0% { transform: scale(0.2); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
              .rs-core { transform-box: fill-box; transform-origin: center; animation: rs-pulse 2s ease-in-out infinite; }
              @keyframes rs-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
              .rs-check { stroke-dasharray: 70; stroke-dashoffset: 70; animation: rs-draw 2s ease-in-out infinite; }
              @keyframes rs-draw { 0%,15% { stroke-dashoffset: 70; } 50%,85% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -70; } }
              .rs-spark { transform-box: fill-box; transform-origin: center; animation: rs-twinkle 2s ease-in-out infinite; }
              @keyframes rs-twinkle { 0%,100% { opacity: 0.2; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1.2); } }
              @media (prefers-reduced-motion: reduce) { .rs-glow, .rs-ring, .rs-core, .rs-check, .rs-spark { animation: none !important; } .rs-check { stroke-dashoffset: 0; } }
            `}</style>

            {/* Glow */}
            <circle className="rs-glow" cx={100} cy={100} r={60} fill={palette.primary} opacity={0.2} style={{ filter: "blur(12px)" }} />

            {/* Expanding rings */}
            <circle className="rs-ring rs-ring-1" cx={100} cy={100} r={36} fill="none" stroke={palette.primary} strokeWidth={3} />
            <circle className="rs-ring rs-ring-2" cx={100} cy={100} r={36} fill="none" stroke="var(--color-tertiary)" strokeWidth={2.5} />
            <circle className="rs-ring rs-ring-3" cx={100} cy={100} r={36} fill="none" stroke="var(--color-warn)" strokeWidth={2} />

            {/* Central badge */}
            <g className="rs-core">
              <circle cx={100} cy={100} r={38} fill={palette.primary} />
              <circle cx={100} cy={100} r={38} fill="none" stroke="var(--color-bg)" strokeWidth={2} opacity={0.25} />
              <path
                className="rs-check"
                d="M 82 100 L 94 113 L 120 87"
                stroke={palette.onPrimary}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>

            {/* Sparkles */}
            <circle className="rs-spark" cx={40} cy={70} r={3} fill={palette.primary} />
            <circle className="rs-spark" cx={160} cy={60} r={2.5} fill="var(--color-tertiary)" style={{ animationDelay: "0.5s" }} />
            <circle className="rs-spark" cx={170} cy={130} r={3} fill="var(--color-warn)" style={{ animationDelay: "1s" }} />
            <circle className="rs-spark" cx={30} cy={140} r={2.5} fill={palette.primary} style={{ animationDelay: "1.5s" }} />
          </svg>
        </div>

        <h1
          className="wizard-title wizard-title--xl"
          style={{
            fontWeight: 800,
            background: `linear-gradient(135deg, ${palette.primary}, ${palette.primary}aa)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          Restore successful!
        </h1>
        <p className="wizard-subtitle">
          <b style={{ color: palette.primary }}>{restoredCount} anime</b> have been
          restored to your library. You&apos;re all set to go!
        </p>
      </div>

      <div className="wizard-actions">
        <button
          type="button"
          className="wizard-btn wizard-btn--primary"
          onClick={onNext}
          style={{ background: palette.primary, color: palette.onPrimary, fontWeight: 800 }}
        >
          Continue
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
