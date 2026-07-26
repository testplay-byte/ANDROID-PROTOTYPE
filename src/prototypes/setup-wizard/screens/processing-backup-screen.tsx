"use client";
/**
 * setup-wizard / screens / processing-backup-screen — step 6.
 *
 * Shows a "Processing backup" animation for ~2 seconds, then auto-advances
 * to the backup summary screen (step 7).
 *
 * The animation is a circular spinner with orbiting dots + a pulsing
 * file icon in the center.
 */
import { useEffect } from "react";
import type { ThemePalette } from "../lib/themes";

interface ProcessingBackupScreenProps {
  active: boolean;
  onNext: () => void;
  palette: ThemePalette;
}

export function ProcessingBackupScreen({ active, onNext, palette }: ProcessingBackupScreenProps) {
  // Auto-advance after ~2 seconds.
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => {
      onNext();
    }, 2000);
    return () => clearTimeout(t);
  }, [active, onNext]);

  return (
    <div className={`wizard-step ${active ? "wizard-step--active" : ""}`}>
      <div className="wizard-content">
        {/* Processing animation — circular spinner with orbiting dots */}
        <div className="illustration" key={active ? "on" : "off"}>
          <svg viewBox="0 0 200 200" role="img" aria-label="Processing backup" style={{ overflow: "visible", width: "100%", height: "100%" }}>
            <style>{`
              .pb-ring { transform-box: fill-box; transform-origin: center; }
              .pb-ring-1 { animation: pb-spin 2s linear infinite; }
              .pb-ring-2 { animation: pb-spin 3s linear infinite reverse; }
              @keyframes pb-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
              .pb-core { transform-box: fill-box; transform-origin: center; animation: pb-pulse 1.2s ease-in-out infinite; }
              @keyframes pb-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
              .pb-glow { transform-box: fill-box; transform-origin: center; animation: pb-glow 1.5s ease-in-out infinite; }
              @keyframes pb-glow { 0%,100% { opacity: 0.2; } 50% { opacity: 0.5; } }
              @media (prefers-reduced-motion: reduce) { .pb-ring, .pb-core, .pb-glow { animation: none !important; } }
            `}</style>

            {/* Glow */}
            <circle className="pb-glow" cx={100} cy={100} r={60} fill="var(--color-primary)" opacity={0.3} style={{ filter: "blur(12px)" }} />

            {/* Outer ring with dots */}
            <g className="pb-ring pb-ring-1">
              <circle cx={100} cy={100} r={64} fill="none" stroke="var(--color-primary)" strokeWidth={2} strokeDasharray="6 10" opacity={0.4} />
              <circle cx={100} cy={36} r={5} fill="var(--color-primary)" />
              <circle cx={164} cy={100} r={4} fill="var(--color-tertiary)" />
              <circle cx={100} cy={164} r={4} fill="var(--color-warn)" />
              <circle cx={36} cy={100} r={4} fill="var(--color-secondary)" />
            </g>

            {/* Inner ring */}
            <g className="pb-ring pb-ring-2">
              <circle cx={100} cy={100} r={48} fill="none" stroke="var(--color-tertiary)" strokeWidth={1.5} strokeDasharray="3 6" opacity={0.3} />
            </g>

            {/* Central file icon */}
            <g className="pb-core">
              <circle cx={100} cy={100} r={34} fill="var(--color-primary-container)" stroke="var(--color-primary)" strokeWidth={2} />
              <path
                d="M 88 84 L 88 116 Q 88 119 91 119 L 109 119 Q 112 119 112 116 L 112 90 L 106 84 Z"
                fill="var(--color-primary)"
                opacity={0.9}
              />
              <path d="M 106 84 L 106 90 L 112 90" fill="none" stroke="var(--color-on-primary)" strokeWidth={1.5} opacity={0.4} />
              <rect x={93} y={96} width={14} height={2} rx={1} fill="var(--color-on-primary)" opacity={0.5} />
              <rect x={93} y={102} width={10} height={2} rx={1} fill="var(--color-on-primary)" opacity={0.4} />
              <rect x={93} y={108} width={12} height={2} rx={1} fill="var(--color-on-primary)" opacity={0.4} />
            </g>
          </svg>
        </div>

        <h1 className="wizard-title" style={{ fontWeight: 800 }}>Processing backup</h1>
        <p className="wizard-subtitle">
          Reading your backup file and extracting data…
        </p>

        {/* Scanning indicator */}
        <span
          className="scanning-pill"
          style={{ background: `${palette.primary}22`, color: palette.primary }}
        >
          <span className="scanning-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          Processing
        </span>
      </div>

      {/* No actions — auto-advances after 2s */}
      <div className="wizard-actions">
        <span
          className="wizard-btn wizard-btn--ghost"
          style={{
            cursor: "default",
            color: "var(--color-text-muted)",
            fontWeight: 800,
          }}
        >
          Please wait…
        </span>
      </div>
    </div>
  );
}
