"use client";

/* pass-card — the pass art renderer + the interactive Wallet stack.
   The selected pass sits full-width at the front; the others peek below it
   (Apple Wallet's fanned stack) and spring to the front when tapped. */

import type { Pass } from "../lib/data";
import { money } from "../lib/data";

const KIND_GLYPH: Record<Pass["kind"], React.ReactNode> = {
  card: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <rect x="5.5" y="9" width="6" height="4.4" rx="1" fill="currentColor" opacity=".9" />
      <path d="M5.5 16.2h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  transit: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="3.5" width="14" height="15" rx="3.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5.8 13.5h12.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="9" cy="16.4" r="1.15" fill="currentColor" />
      <circle cx="15" cy="16.4" r="1.15" fill="currentColor" />
      <path d="M8.5 6.8h7l-1 4h-5l-1-4Z" fill="currentColor" opacity=".55" />
    </svg>
  ),
  boarding: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 15.5c-2.2.6-4.5-.1-6.4-1.6L6 7.2 7.6 5.6l6.1 2 2.6-2.6 1.8.9-2 3.5 3.1 1.5c.9.4 1.5.9 1.8 1.6Z" fill="currentColor" opacity=".9" />
      <path d="M4 17.5h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M6.5 20h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity=".6" />
    </svg>
  ),
  loyalty: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3.6 2.6 5.3 5.8.85-4.2 4.1 1 5.8-5.2-2.75L6.8 19.65l1-5.8-4.2-4.1 5.8-.85L12 3.6Z" fill="currentColor" />
    </svg>
  ),
};

export function PassArt({ pass, expanded }: { pass: Pass; expanded: boolean }) {
  return (
    <div
      className={"wl-pass wl-pass--" + pass.kind}
      style={{ background: `linear-gradient(150deg, ${pass.art.from} 0%, ${pass.art.via} 52%, ${pass.art.to} 100%)`, color: pass.art.ink }}
    >
      <div className="wl-pass__sheen" aria-hidden="true" />
      <div className="wl-pass__grain" aria-hidden="true" />
      <div className="wl-pass__top">
        <span className="wl-pass__glyph">{KIND_GLYPH[pass.kind]}</span>
        <span className="wl-pass__name">{pass.name}</span>
        <span className="wl-pass__num">{pass.number}</span>
      </div>
      <div className="wl-pass__bottom">
        <div>
          <div className="wl-pass__holder">{pass.holder}</div>
          {expanded && pass.balance !== undefined && (
            <div className="wl-pass__balance">
              {money(pass.balance)}
              <small> available</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PassStack({
  passes,
  selectedId,
  onSelect,
}: {
  passes: Pass[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const selIdx = Math.max(0, passes.findIndex((p) => p.id === selectedId));
  return (
    <div className="wl-stack" style={{ height: 210 + (passes.length - 1) * 46 }}>
      {passes.map((pass, i) => {
        /* distance below the selected card: selected → 0, next → 1 … */
        const k = i <= selIdx ? selIdx - i : i - selIdx;
        const front = k === 0;
        return (
          <button
            key={pass.id}
            className={"wl-stack__item" + (front ? " front" : "")}
            style={{
              transform: `translateY(${k * 46}px) scale(${1 - Math.min(k, 3) * 0.045})`,
              zIndex: passes.length - k,
            }}
            onClick={() => !front && onSelect(pass.id)}
            aria-pressed={front}
            aria-label={`Show ${pass.name}`}
          >
            <PassArt pass={pass} expanded={front} />
          </button>
        );
      })}
    </div>
  );
}
