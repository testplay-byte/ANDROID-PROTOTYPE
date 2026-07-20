/* eslint-disable react/no-unknown-property */
/**
 * setup-wizard / components / illustrations — animated SVG illustrations.
 *
 * 8 illustrations, one per wizard step. "Corporate Memphis" flat-vector style
 * with an anime twist: big rounded shapes, geometric bodies, sparkly eyes,
 * bold primary-color accents. Each illustration is a 200×200 SVG that floats
 * (parent `.illustration` class applies the float keyframe) and has its own
 * internal CSS animations (waving paws, orbiting swatches, drawing strokes,
 * pulsing shields, falling arrows, growing bars, raining confetti).
 *
 * Colors come from CSS custom properties (var(--color-primary), etc.) so the
 * illustrations adapt to whatever palette + theme mode the user picks.
 *
 * Each illustration is a no-props React component — it reads colors from CSS
 * vars resolved at render time on the .device element.
 *
 * Class-name strategy: every illustration prefixes its scoped CSS classes with
 * a 2-3 letter abbreviation (wc- = WelcomeCat, tp- = ThemePalette, …) so the
 * inline <style> blocks cannot collide with each other or with the global
 * setup-wizard.css rules.
 */

/* ------------------------------------------------------------------ */
/* 1. WelcomeCat — cute geometric cat character waving                */
/* ------------------------------------------------------------------ */
export function WelcomeCat() {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Cute cat character waving hello">
      <style>{`
        .wc-tail {
          transform-box: fill-box;
          transform-origin: 100% 70%;
          animation: wc-tail 2.6s ease-in-out infinite;
        }
        @keyframes wc-tail {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(14deg); }
        }
        .wc-paw {
          transform-box: fill-box;
          transform-origin: 20% 80%;
          animation: wc-wave 1.4s ease-in-out infinite;
        }
        @keyframes wc-wave {
          0%, 100% { transform: rotate(-22deg); }
          50% { transform: rotate(28deg); }
        }
        .wc-eye-sparkle {
          transform-box: fill-box;
          transform-origin: center;
          animation: wc-sparkle 2.2s ease-in-out infinite;
        }
        @keyframes wc-sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        .wc-blush {
          transform-box: fill-box;
          transform-origin: center;
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>

      {/* Tail (curved) */}
      <path
        className="wc-tail"
        d="M62 138 Q30 132 28 96 Q27 76 42 70"
        fill="none"
        stroke="var(--color-surface-4)"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Body (rounded triangle / pear shape) */}
      <path
        d="M68 170 Q60 130 78 112 Q100 96 122 112 Q140 130 132 170 Z"
        fill="var(--color-surface-3)"
      />

      {/* Ears (triangles) */}
      <polygon points="76,98 70,72 96,90" fill="var(--color-surface-3)" />
      <polygon points="124,98 130,72 104,90" fill="var(--color-surface-3)" />
      <polygon points="80,93 76,80 90,89" fill="var(--color-primary)" opacity="0.55" />
      <polygon points="120,93 124,80 110,89" fill="var(--color-primary)" opacity="0.55" />

      {/* Head */}
      <circle cx="100" cy="108" r="36" fill="var(--color-surface-3)" />

      {/* Eyes (big anime style) */}
      <ellipse cx="88" cy="108" rx="6" ry="8" fill="var(--color-text)" />
      <ellipse cx="112" cy="108" rx="6" ry="8" fill="var(--color-text)" />
      <circle className="wc-eye-sparkle" cx="90" cy="105" r="2.4" fill="var(--color-bg)" />
      <circle className="wc-eye-sparkle" cx="114" cy="105" r="2.4" fill="var(--color-bg)" />

      {/* Nose + mouth (anime "ω") */}
      <path d="M97 117 L100 121 L103 117" stroke="var(--color-text)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M92 122 Q100 128 108 122" stroke="var(--color-text)" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Blush */}
      <ellipse className="wc-blush" cx="78" cy="120" rx="6" ry="3.5" fill="var(--color-primary)" opacity="0.4" />
      <ellipse className="wc-blush" cx="122" cy="120" rx="6" ry="3.5" fill="var(--color-primary)" opacity="0.4" />

      {/* Waving paw (right arm) */}
      <g className="wc-paw">
        <rect x="128" y="124" width="22" height="12" rx="6" fill="var(--color-surface-3)" />
        <circle cx="150" cy="130" r="11" fill="var(--color-surface-3)" />
        <circle cx="150" cy="130" r="5" fill="var(--color-primary)" opacity="0.4" />
      </g>

      {/* Left arm (resting) */}
      <circle cx="70" cy="148" r="9" fill="var(--color-surface-3)" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 2. ThemePalette — color swatches orbiting a central paint brush    */
/* ------------------------------------------------------------------ */
export function ThemePalette() {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Color swatches orbiting a paint brush">
      <style>{`
        .tp-orbit-1 { transform-box: fill-box; transform-origin: 100px 100px; animation: tp-spin 6s linear infinite; }
        .tp-orbit-2 { transform-box: fill-box; transform-origin: 100px 100px; animation: tp-spin 9s linear infinite reverse; }
        @keyframes tp-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .tp-brush { transform-box: fill-box; transform-origin: 50% 90%; animation: tp-tilt 3s ease-in-out infinite; }
        @keyframes tp-tilt {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(8deg); }
        }
        .tp-drip { transform-box: fill-box; transform-origin: top; animation: tp-drip 2.4s ease-in infinite; }
        @keyframes tp-drip {
          0% { transform: translateY(0) scaleY(0.6); opacity: 0.9; }
          70% { transform: translateY(8px) scaleY(1); opacity: 0.9; }
          100% { transform: translateY(14px) scaleY(0.4); opacity: 0; }
        }
      `}</style>

      {/* Outer orbit ring (decorative) */}
      <circle cx="100" cy="100" r="70" fill="none" stroke="var(--color-surface-3)" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.6" />
      <circle cx="100" cy="100" r="50" fill="none" stroke="var(--color-surface-3)" strokeWidth="1.5" strokeDasharray="3 5" opacity="0.4" />

      {/* Central brush */}
      <g className="tp-brush">
        {/* Handle */}
        <rect x="96" y="74" width="8" height="48" rx="3" fill="var(--color-surface-5)" />
        {/* Ferrule */}
        <rect x="92" y="118" width="16" height="8" rx="2" fill="var(--color-surface-4)" />
        {/* Bristles */}
        <path d="M92 126 Q100 156 108 126 Z" fill="var(--color-primary)" />
        <path d="M96 128 Q100 148 104 128 Z" fill="var(--color-primary)" opacity="0.6" />
        {/* Drip */}
        <ellipse className="tp-drip" cx="100" cy="150" rx="3" ry="5" fill="var(--color-primary)" />
      </g>

      {/* Orbiting swatches (outer ring) */}
      <g className="tp-orbit-1">
        <circle cx="100" cy="30" r="11" fill="var(--color-primary)" />
        <circle cx="170" cy="100" r="11" fill="var(--color-tertiary)" opacity="0.9" />
        <circle cx="100" cy="170" r="11" fill="var(--color-secondary)" opacity="0.9" />
        <circle cx="30" cy="100" r="11" fill="var(--color-success)" opacity="0.9" />
      </g>

      {/* Orbiting swatches (inner ring) */}
      <g className="tp-orbit-2">
        <circle cx="100" cy="50" r="7" fill="var(--color-warn)" />
        <circle cx="150" cy="100" r="7" fill="var(--color-primary)" opacity="0.7" />
        <circle cx="100" cy="150" r="7" fill="var(--color-tertiary)" opacity="0.7" />
        <circle cx="50" cy="100" r="7" fill="var(--color-secondary)" opacity="0.7" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 3. FolderOpen — folder that opens/closes (animated flap)           */
/* ------------------------------------------------------------------ */
export function FolderOpen() {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Folder opening and closing">
      <style>{`
        .fo-flap {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: fo-flap 2.6s ease-in-out infinite;
        }
        @keyframes fo-flap {
          0%, 100% { transform: rotateX(0deg); }
          45%, 55% { transform: rotateX(75deg); }
        }
        .fo-paper {
          transform-box: fill-box;
          transform-origin: bottom;
          animation: fo-paper 2.6s ease-in-out infinite;
        }
        @keyframes fo-paper {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .fo-glow {
          transform-box: fill-box;
          transform-origin: center;
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>

      {/* Back panel of folder */}
      <path d="M40 70 L40 158 Q40 168 50 168 L150 168 Q160 168 160 158 L160 78 Q160 70 152 70 L92 70 L82 58 L48 58 Q40 58 40 66 Z" fill="var(--color-primary-container)" />

      {/* Papers inside (lift up when flap opens) */}
      <g className="fo-paper">
        <rect x="60" y="78" width="80" height="60" rx="3" fill="var(--color-bg)" />
        <rect x="60" y="78" width="80" height="60" rx="3" fill="none" stroke="var(--color-surface-4)" strokeWidth="1" />
        <rect x="68" y="88" width="44" height="3" rx="1.5" fill="var(--color-surface-4)" />
        <rect x="68" y="98" width="64" height="3" rx="1.5" fill="var(--color-surface-4)" />
        <rect x="68" y="108" width="56" height="3" rx="1.5" fill="var(--color-surface-4)" />
        <rect x="68" y="118" width="60" height="3" rx="1.5" fill="var(--color-surface-4)" />
      </g>

      {/* Front flap (rotates forward to "open") */}
      <g className="fo-flap">
        <path d="M40 78 L160 78 L160 168 L40 168 Z" fill="var(--color-primary)" opacity="0.95" />
        {/* Tab on top of flap */}
        <path d="M40 70 L78 70 L86 80 L40 80 Z" fill="var(--color-primary)" />
        {/* Subtle highlight */}
        <rect x="50" y="92" width="100" height="2" rx="1" fill="var(--color-bg)" opacity="0.25" />
      </g>

      {/* Glow behind folder */}
      <circle className="fo-glow" cx="100" cy="120" r="60" fill="var(--color-primary)" opacity="0.08" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 4. CheckCircle — animated checkmark drawing                         */
/* ------------------------------------------------------------------ */
export function CheckCircle() {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Checkmark drawing inside a circle">
      <style>{`
        /* Override the global .checkmark-circle / .checkmark-check values
           for our larger 200×200 illustration. The global CSS sets
           dasharray/offset=120 (sized for ~r=19), but our circle is r=70
           (circumference ≈ 440). The svg-prefixed selectors win specificity
           over the bare global class selectors. */
        svg .checkmark-circle {
          stroke-dasharray: 440;
          stroke-dashoffset: 440;
          animation: cc-draw 0.7s var(--ease-emphasized-decel) 0.3s forwards;
        }
        svg .checkmark-check {
          stroke-dasharray: 90;
          stroke-dashoffset: 90;
          animation: cc-draw 0.45s var(--ease-emphasized-decel) 0.9s forwards;
        }
        @keyframes cc-draw {
          to { stroke-dashoffset: 0; }
        }
        .cc-burst {
          transform-box: fill-box;
          transform-origin: center;
          animation: cc-burst 0.6s var(--ease-emphasized-decel) 1.2s both;
        }
        @keyframes cc-burst {
          0% { opacity: 0; transform: scale(0.3); }
          60% { opacity: 1; transform: scale(1.15); }
          100% { opacity: 0; transform: scale(1.5); }
        }
        .cc-bg-pulse {
          transform-box: fill-box;
          transform-origin: center;
          animation: cc-bg 1.6s ease-out 0.3s both;
        }
        @keyframes cc-bg {
          0% { transform: scale(0.5); opacity: 0.6; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Soft pulsing backdrop */}
      <circle className="cc-bg-pulse" cx="100" cy="100" r="80" fill="var(--color-primary)" opacity="0.1" />
      <circle className="cc-bg-pulse" cx="100" cy="100" r="68" fill="var(--color-primary)" opacity="0.15" />

      {/* The drawing circle + check (uses global classes, overridden above) */}
      <circle
        className="checkmark-circle"
        cx="100"
        cy="100"
        r="70"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        className="checkmark-check"
        d="M70 102 L92 124 L132 80"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Burst sparkles after check draws */}
      <g className="cc-burst">
        <circle cx="140" cy="60" r="3" fill="var(--color-primary)" />
        <circle cx="60" cy="140" r="3" fill="var(--color-primary)" />
        <circle cx="155" cy="100" r="2" fill="var(--color-primary)" />
        <circle cx="50" cy="80" r="2" fill="var(--color-primary)" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 5. ShieldLock — shield with a pulsing lock                         */
/* ------------------------------------------------------------------ */
export function ShieldLock() {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Shield with a lock">
      <style>{`
        .sl-lock {
          transform-box: fill-box;
          transform-origin: center;
          animation: pulse 2.2s ease-in-out infinite;
        }
        .sl-ring {
          transform-box: fill-box;
          transform-origin: center;
          animation: sl-ring 2.6s ease-out infinite;
        }
        @keyframes sl-ring {
          0% { transform: scale(0.8); opacity: 0.7; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        .sl-shine {
          transform-box: fill-box;
          transform-origin: center;
          animation: sl-shine 3s ease-in-out infinite;
        }
        @keyframes sl-shine {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>

      {/* Pulsing rings behind shield */}
      <circle className="sl-ring" cx="100" cy="100" r="60" fill="none" stroke="var(--color-primary)" strokeWidth="3" />
      <circle className="sl-ring" cx="100" cy="100" r="60" fill="none" stroke="var(--color-primary)" strokeWidth="3" style={{ animationDelay: "1.3s" }} />

      {/* Shield body */}
      <path
        d="M100 36 L156 56 L156 104 Q156 142 100 168 Q44 142 44 104 L44 56 Z"
        fill="var(--color-primary)"
        opacity="0.18"
      />
      <path
        d="M100 36 L156 56 L156 104 Q156 142 100 168 Q44 142 44 104 L44 56 Z"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Shield inner highlight */}
      <path
        className="sl-shine"
        d="M100 48 L144 64 L144 104 Q144 134 100 156 Z"
        fill="var(--color-primary)"
        opacity="0.25"
      />

      {/* Lock (pulsing) */}
      <g className="sl-lock">
        {/* Shackle */}
        <path
          d="M82 100 L82 88 Q82 72 100 72 Q118 72 118 88 L118 100"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Body */}
        <rect x="74" y="100" width="52" height="40" rx="6" fill="var(--color-primary)" />
        {/* Keyhole */}
        <circle cx="100" cy="116" r="4" fill="var(--color-bg)" />
        <rect x="98" y="118" width="4" height="10" rx="1.5" fill="var(--color-bg)" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 6. CloudBackup — cloud with downward arrows (restore metaphor)     */
/* ------------------------------------------------------------------ */
export function CloudBackup() {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Cloud with downward backup arrows">
      <style>{`
        .cb-arrow-1 { transform-box: fill-box; transform-origin: center; animation: cb-fall 1.8s ease-in infinite; }
        .cb-arrow-2 { transform-box: fill-box; transform-origin: center; animation: cb-fall 1.8s ease-in infinite 0.6s; }
        .cb-arrow-3 { transform-box: fill-box; transform-origin: center; animation: cb-fall 1.8s ease-in infinite 1.2s; }
        @keyframes cb-fall {
          0% { transform: translateY(-10px); opacity: 0; }
          25% { opacity: 1; }
          75% { opacity: 1; }
          100% { transform: translateY(20px); opacity: 0; }
        }
        .cb-cloud {
          transform-box: fill-box;
          transform-origin: center;
          animation: float 3.5s ease-in-out infinite;
        }
        .cb-server {
          transform-box: fill-box;
          transform-origin: center;
          animation: pulse 2.4s ease-in-out infinite;
        }
      `}</style>

      {/* Cloud (floating) */}
      <g className="cb-cloud">
        <ellipse cx="70" cy="92" rx="22" ry="20" fill="var(--color-surface-3)" />
        <ellipse cx="100" cy="80" rx="32" ry="28" fill="var(--color-surface-3)" />
        <ellipse cx="130" cy="92" rx="22" ry="20" fill="var(--color-surface-3)" />
        <rect x="60" y="92" width="80" height="20" rx="10" fill="var(--color-surface-3)" />
        {/* Cloud highlight */}
        <ellipse cx="88" cy="74" rx="10" ry="5" fill="var(--color-bg)" opacity="0.18" />
      </g>

      {/* Falling arrows */}
      <g className="cb-arrow-1">
        <path d="M70 118 L70 138 M64 132 L70 138 L76 132" stroke="var(--color-primary)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="cb-arrow-2">
        <path d="M100 122 L100 142 M94 136 L100 142 L106 136" stroke="var(--color-primary)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="cb-arrow-3">
        <path d="M130 118 L130 138 M124 132 L130 138 L136 132" stroke="var(--color-primary)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Server / database at bottom (pulsing) */}
      <g className="cb-server">
        <rect x="60" y="148" width="80" height="14" rx="4" fill="var(--color-primary-container)" />
        <rect x="60" y="166" width="80" height="14" rx="4" fill="var(--color-primary-container)" />
        <circle cx="70" cy="155" r="2.5" fill="var(--color-primary)" />
        <circle cx="70" cy="173" r="2.5" fill="var(--color-primary)" />
        <rect x="80" y="153" width="40" height="4" rx="2" fill="var(--color-primary)" opacity="0.6" />
        <rect x="80" y="171" width="40" height="4" rx="2" fill="var(--color-primary)" opacity="0.6" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 7. StatsChart — animated bar chart that grows                      */
/* ------------------------------------------------------------------ */
export function StatsChart() {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Bar chart growing upward">
      <style>{`
        .sc-bar { transform-box: fill-box; transform-origin: bottom; }
        .sc-bar-1 { animation: sc-grow 1.4s var(--ease-emphasized-decel) 0.1s both; }
        .sc-bar-2 { animation: sc-grow 1.4s var(--ease-emphasized-decel) 0.25s both; }
        .sc-bar-3 { animation: sc-grow 1.4s var(--ease-emphasized-decel) 0.4s both; }
        .sc-bar-4 { animation: sc-grow 1.4s var(--ease-emphasized-decel) 0.55s both; }
        @keyframes sc-grow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        .sc-trend {
          transform-box: fill-box;
          transform-origin: bottom;
          animation: sc-trend 2s ease-in-out infinite;
        }
        @keyframes sc-trend {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .sc-dot {
          transform-box: fill-box;
          transform-origin: center;
          animation: pulse 1.8s ease-in-out infinite;
        }
      `}</style>

      {/* Backdrop card */}
      <rect x="32" y="44" width="136" height="116" rx="10" fill="var(--color-surface-2)" />

      {/* Y-axis grid lines */}
      <line x1="50" y1="80" x2="160" y2="80" stroke="var(--color-surface-4)" strokeWidth="1" strokeDasharray="3 4" />
      <line x1="50" y1="110" x2="160" y2="110" stroke="var(--color-surface-4)" strokeWidth="1" strokeDasharray="3 4" />
      <line x1="50" y1="140" x2="160" y2="140" stroke="var(--color-surface-4)" strokeWidth="1" />

      {/* Bars (grow from bottom) */}
      <rect className="sc-bar sc-bar-1" x="58" y="100" width="18" height="40" rx="3" fill="var(--color-primary)" opacity="0.55" />
      <rect className="sc-bar sc-bar-2" x="86" y="84" width="18" height="56" rx="3" fill="var(--color-primary)" opacity="0.75" />
      <rect className="sc-bar sc-bar-3" x="114" y="72" width="18" height="68" rx="3" fill="var(--color-primary)" />
      <rect className="sc-bar sc-bar-4" x="142" y="92" width="18" height="48" rx="3" fill="var(--color-primary)" opacity="0.65" />

      {/* Trend line connecting bar tops */}
      <g className="sc-trend">
        <polyline
          points="67,100 95,84 123,72 151,92"
          fill="none"
          stroke="var(--color-tertiary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle className="sc-dot" cx="67" cy="100" r="3.5" fill="var(--color-tertiary)" />
        <circle className="sc-dot" cx="95" cy="84" r="3.5" fill="var(--color-tertiary)" />
        <circle className="sc-dot" cx="123" cy="72" r="3.5" fill="var(--color-tertiary)" />
        <circle className="sc-dot" cx="151" cy="92" r="3.5" fill="var(--color-tertiary)" />
      </g>

      {/* Upward arrow indicator */}
      <g className="sc-trend">
        <path
          d="M40 60 L48 52 L56 60 M48 52 L48 70"
          stroke="var(--color-success)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 8. Celebration — confetti + sparkles around a happy character      */
/* ------------------------------------------------------------------ */
export function Celebration() {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Confetti and sparkles around a happy character">
      <style>{`
        .ce-confetti {
          transform-box: fill-box;
          transform-origin: center;
        }
        .ce-c1 { animation: ce-fall 2.4s ease-in infinite; }
        .ce-c2 { animation: ce-fall 2.4s ease-in infinite 0.3s; }
        .ce-c3 { animation: ce-fall 2.4s ease-in infinite 0.6s; }
        .ce-c4 { animation: ce-fall 2.4s ease-in infinite 0.9s; }
        .ce-c5 { animation: ce-fall 2.4s ease-in infinite 1.2s; }
        .ce-c6 { animation: ce-fall 2.4s ease-in infinite 1.5s; }
        @keyframes ce-fall {
          0% { transform: translateY(-30px) rotate(0deg); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(70px) rotate(540deg); opacity: 0; }
        }
        .ce-sparkle {
          transform-box: fill-box;
          transform-origin: center;
          animation: ce-twinkle 1.6s ease-in-out infinite;
        }
        @keyframes ce-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.6); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .ce-bounce {
          transform-box: fill-box;
          transform-origin: bottom;
          animation: ce-bounce 1.8s ease-in-out infinite;
        }
        @keyframes ce-bounce {
          0%, 100% { transform: translateY(0) scaleY(1); }
          30% { transform: translateY(-6px) scaleY(1.04); }
          60% { transform: translateY(0) scaleY(0.98); }
        }
        .ce-eye {
          transform-box: fill-box;
          transform-origin: center;
          animation: ce-blink 3s ease-in-out infinite;
        }
        @keyframes ce-blink {
          0%, 92%, 100% { transform: scaleY(1); }
          96% { transform: scaleY(0.1); }
        }
      `}</style>

      {/* Sparkles (4-point stars) */}
      <path className="ce-sparkle" d="M40 50 L43 60 L53 63 L43 66 L40 76 L37 66 L27 63 L37 60 Z" fill="var(--color-warn)" />
      <path className="ce-sparkle" d="M160 56 L162 64 L170 66 L162 68 L160 76 L158 68 L150 66 L158 64 Z" fill="var(--color-tertiary)" style={{ animationDelay: "0.5s" }} />
      <path className="ce-sparkle" d="M48 130 L50 136 L56 138 L50 140 L48 146 L46 140 L40 138 L46 136 Z" fill="var(--color-primary)" style={{ animationDelay: "1s" }} />
      <path className="ce-sparkle" d="M158 138 L160 144 L166 146 L160 148 L158 154 L156 148 L150 146 L156 144 Z" fill="var(--color-success)" style={{ animationDelay: "0.7s" }} />

      {/* Confetti pieces */}
      <rect className="ce-confetti ce-c1" x="62" y="34" width="6" height="6" rx="1.5" fill="var(--color-primary)" transform="rotate(20 65 37)" />
      <rect className="ce-confetti ce-c2" x="92" y="28" width="6" height="6" rx="1.5" fill="var(--color-tertiary)" transform="rotate(45 95 31)" />
      <rect className="ce-confetti ce-c3" x="124" y="34" width="6" height="6" rx="1.5" fill="var(--color-warn)" transform="rotate(-15 127 37)" />
      <rect className="ce-confetti ce-c4" x="72" y="34" width="5" height="8" rx="1.5" fill="var(--color-success)" transform="rotate(60 75 38)" />
      <rect className="ce-confetti ce-c5" x="108" y="30" width="5" height="8" rx="1.5" fill="var(--color-secondary)" transform="rotate(-30 110 34)" />
      <circle className="ce-confetti ce-c6" cx="140" cy="36" r="3.5" fill="var(--color-primary)" />

      {/* Happy star character (bouncing) */}
      <g className="ce-bounce">
        {/* Star body */}
        <path
          d="M100 70 L114 96 L142 100 L122 120 L127 148 L100 134 L73 148 L78 120 L58 100 L86 96 Z"
          fill="var(--color-primary)"
        />
        {/* Star highlight */}
        <path
          d="M100 80 L108 96 L124 98 L114 110 L116 124 L100 116 Z"
          fill="var(--color-bg)"
          opacity="0.18"
        />
        {/* Eyes (closed happy - anime ^_^) */}
        <path className="ce-eye" d="M84 110 Q90 104 96 110" stroke="var(--color-bg)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path className="ce-eye" d="M104 110 Q110 104 116 110" stroke="var(--color-bg)" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Big smile */}
        <path d="M88 120 Q100 132 112 120" stroke="var(--color-bg)" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Blush */}
        <ellipse cx="82" cy="120" rx="4" ry="2.5" fill="var(--color-tertiary)" opacity="0.7" />
        <ellipse cx="118" cy="120" rx="4" ry="2.5" fill="var(--color-tertiary)" opacity="0.7" />
      </g>
    </svg>
  );
}
