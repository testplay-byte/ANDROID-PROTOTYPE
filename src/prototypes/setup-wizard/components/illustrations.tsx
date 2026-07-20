/* eslint-disable react/no-unknown-property */
/**
 * setup-wizard / components / illustrations — flat-vector anime characters.
 *
 * 8 illustrations, one per wizard step. Each is a 200×200 inline SVG that
 * depicts a flat, anime-styled character (or scene) personalized for the
 * anime-app setup flow:
 *
 *   1. WelcomeIllustration  — twin-tail anime girl waving with sparkles
 *   2. ThemeIllustration    — anime girl holding a mirror + orbiting dots
 *   3. FolderIllustration   — kid opening a treasure chest with posters
 *   4. CheckIllustration    — character giving a thumbs-up + checkmark
 *   5. ShieldIllustration   — guardian holding a shield with big ripples
 *   6. CloudIllustration    — character reaching for falling data drops
 *   7. StatsIllustration    — excited character next to a growing chart
 *   8. FinishIllustration   — anime girl celebrating with confetti
 *
 * Colors come from CSS custom properties (var(--color-primary), etc.) so the
 * illustrations adapt to whatever palette + theme mode the user picks.
 *
 * Class-name strategy: every illustration prefixes its scoped CSS classes
 * with a 3-4 letter abbreviation (wi- = WelcomeIllustration, ti- =
 * ThemeIllustration, …) so the inline <style> blocks cannot collide with
 * each other or with the global setup-wizard.css rules.
 */

/* ------------------------------------------------------------------ */
/* Shared sub-shapes (small helpers, kept inline)                     */
/* ------------------------------------------------------------------ */

/**
 * Four-pointed star sparkle, centered at (cx, cy) with radius r.
 * Used as a decorative accent in several illustrations.
 */
function Sparkle({ cx, cy, r, fill, className, style }: {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const pts = `${cx},${cy - r} ${cx + r * 0.28},${cy - r * 0.28} ${cx + r},${cy} ${cx + r * 0.28},${cy + r * 0.28} ${cx},${cy + r} ${cx - r * 0.28},${cy + r * 0.28} ${cx - r},${cy} ${cx - r * 0.28},${cy - r * 0.28}`;
  return <polygon points={pts} fill={fill} className={className} style={style} />;
}

/* ------------------------------------------------------------------ */
/* 1. WelcomeIllustration — twin-tail anime girl waving               */
/* ------------------------------------------------------------------ */
export function WelcomeIllustration() {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Anime girl waving hello">
      <style>{`
        .wi-wave {
          transform-box: fill-box;
          transform-origin: 25% 80%;
          animation: wi-wave 1.6s ease-in-out infinite;
        }
        @keyframes wi-wave {
          0%, 100% { transform: rotate(-18deg); }
          50% { transform: rotate(22deg); }
        }
        .wi-sparkle {
          transform-box: fill-box;
          transform-origin: center;
          animation: wi-twinkle 1.8s ease-in-out infinite;
        }
        @keyframes wi-twinkle {
          0%, 100% { opacity: 0.25; transform: scale(0.55); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .wi-blush {
          transform-box: fill-box;
          transform-origin: center;
          animation: pulse 3s ease-in-out infinite;
        }
        .wi-shine {
          transform-box: fill-box;
          transform-origin: center;
          animation: wi-twinkle 2.4s ease-in-out infinite;
        }
        .wi-tail {
          transform-box: fill-box;
          transform-origin: top;
          animation: wi-sway 3.4s ease-in-out infinite;
        }
        @keyframes wi-sway {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
      `}</style>

      {/* Decorative sparkles around her */}
      <Sparkle className="wi-sparkle" cx={36} cy={48} r={9} fill="var(--color-primary)" />
      <Sparkle className="wi-sparkle" cx={166} cy={58} r={7} fill="var(--color-tertiary)" style={{ animationDelay: "0.5s" }} />
      <Sparkle className="wi-sparkle" cx={32} cy={150} r={6} fill="var(--color-warn)" style={{ animationDelay: "1s" }} />
      <Sparkle className="wi-sparkle" cx={170} cy={144} r={8} fill="var(--color-primary)" style={{ animationDelay: "0.7s" }} />
      <circle className="wi-sparkle" cx={150} cy={32} r={3} fill="var(--color-secondary)" style={{ animationDelay: "0.3s" }} />
      <circle className="wi-sparkle" cx={48} cy={108} r={2.5} fill="var(--color-primary)" style={{ animationDelay: "1.2s" }} />

      {/* Twin tails (back, swaying) */}
      <path
        className="wi-tail"
        d="M76 96 Q56 110 50 144 Q48 160 58 168 Q66 162 70 150 Q74 130 80 116 Z"
        fill="var(--color-primary)"
        opacity="0.92"
      />
      <path
        className="wi-tail"
        d="M124 96 Q144 110 150 144 Q152 160 142 168 Q134 162 130 150 Q126 130 120 116 Z"
        fill="var(--color-primary)"
        opacity="0.92"
        style={{ animationDelay: "0.4s" }}
      />
      {/* Tail-tie ribbons */}
      <ellipse cx="58" cy="140" rx="6" ry="3" fill="var(--color-tertiary)" opacity="0.8" transform="rotate(-30 58 140)" />
      <ellipse cx="142" cy="140" rx="6" ry="3" fill="var(--color-tertiary)" opacity="0.8" transform="rotate(30 142 140)" />

      {/* Body (dress) */}
      <path d="M72 168 Q70 138 84 128 L116 128 Q130 138 128 168 Z" fill="var(--color-primary-container)" />
      {/* Dress collar */}
      <path d="M88 128 L100 134 L112 128 L112 132 L100 138 L88 132 Z" fill="var(--color-primary)" opacity="0.55" />

      {/* Neck */}
      <rect x="93" y="118" width="14" height="14" rx="4" fill="var(--color-bg)" opacity="0.92" />

      {/* Head */}
      <circle cx="100" cy="100" r="30" fill="var(--color-bg)" opacity="0.95" />

      {/* Hair top (bangs + side-swept framing) */}
      <path
        d="M70 96 Q72 70 100 66 Q128 70 130 96 Q124 80 108 80 Q100 86 92 80 Q76 80 70 96 Z"
        fill="var(--color-primary)"
      />
      {/* Center bang parting */}
      <path d="M100 70 L96 92 L100 96 L104 92 Z" fill="var(--color-primary)" opacity="0.7" />
      {/* Side-swept bangs */}
      <path d="M72 92 Q78 80 92 84 L90 100 Q80 100 72 92 Z" fill="var(--color-primary)" />
      <path d="M128 92 Q122 80 108 84 L110 100 Q120 100 128 92 Z" fill="var(--color-primary)" />

      {/* Eyes (big anime style) */}
      <ellipse cx="88" cy="102" rx="5" ry="7" fill="var(--color-text)" />
      <ellipse cx="112" cy="102" rx="5" ry="7" fill="var(--color-text)" />
      <circle className="wi-shine" cx="89.5" cy="99" r="2" fill="var(--color-bg)" />
      <circle className="wi-shine" cx="113.5" cy="99" r="2" fill="var(--color-bg)" />

      {/* Mouth (small smile) */}
      <path d="M95 112 Q100 116 105 112" stroke="var(--color-text)" strokeWidth="1.6" fill="none" strokeLinecap="round" />

      {/* Blush */}
      <ellipse className="wi-blush" cx="80" cy="109" rx="5" ry="3" fill="var(--color-tertiary)" opacity="0.7" />
      <ellipse className="wi-blush" cx="120" cy="109" rx="5" ry="3" fill="var(--color-tertiary)" opacity="0.7" />

      {/* Left arm (resting at side) */}
      <ellipse cx="74" cy="150" rx="7" ry="14" fill="var(--color-primary-container)" transform="rotate(12 74 150)" />
      <circle cx="71" cy="164" r="7" fill="var(--color-bg)" opacity="0.95" />

      {/* Right arm (waving) */}
      <g className="wi-wave">
        <ellipse cx="128" cy="120" rx="7" ry="22" fill="var(--color-primary-container)" transform="rotate(-28 128 120)" />
        <circle cx="142" cy="100" r="11" fill="var(--color-bg)" opacity="0.95" />
        {/* Tiny waving finger detail */}
        <path d="M138 92 Q142 88 146 92" stroke="var(--color-primary)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 2. ThemeIllustration — anime girl with mirror + orbiting dots      */
/* ------------------------------------------------------------------ */
export function ThemeIllustration() {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Anime girl holding a color mirror" overflow="hidden">
      <style>{`
        .ti-orbit {
          transform-box: fill-box;
          transform-origin: 100px 100px;
          animation: ti-spin 8s linear infinite;
        }
        @keyframes ti-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .ti-orbit-rev {
          transform-box: fill-box;
          transform-origin: 100px 100px;
          animation: ti-spin 11s linear infinite reverse;
        }
        .ti-mirror {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: ti-tilt 3.4s ease-in-out infinite;
        }
        @keyframes ti-tilt {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(6deg); }
        }
        .ti-blush {
          transform-box: fill-box;
          transform-origin: center;
          animation: pulse 3s ease-in-out infinite;
        }
        .ti-shine {
          transform-box: fill-box;
          transform-origin: center;
          animation: ti-pulse 2.4s ease-in-out infinite;
        }
        @keyframes ti-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }
        .ti-hairsway {
          transform-box: fill-box;
          transform-origin: top;
          animation: ti-sway 3.6s ease-in-out infinite;
        }
        @keyframes ti-sway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
      `}</style>

      {/* Inner orbit ring (decorative, contained) */}
      <circle cx="100" cy="92" r="62" fill="none" stroke="var(--color-surface-3)" strokeWidth="1" strokeDasharray="3 5" opacity="0.5" />

      {/* Orbiting color dots (small, contained within viewBox) */}
      <g className="ti-orbit">
        <circle cx="100" cy="32" r="5" fill="var(--color-primary)" />
        <circle cx="160" cy="92" r="5" fill="var(--color-tertiary)" opacity="0.9" />
        <circle cx="100" cy="152" r="5" fill="var(--color-secondary)" opacity="0.9" />
        <circle cx="40" cy="92" r="5" fill="var(--color-warn)" opacity="0.9" />
      </g>
      <g className="ti-orbit-rev">
        <circle cx="100" cy="48" r="3.5" fill="var(--color-success)" />
        <circle cx="144" cy="92" r="3.5" fill="var(--color-primary)" opacity="0.7" />
        <circle cx="100" cy="136" r="3.5" fill="var(--color-tertiary)" opacity="0.7" />
        <circle cx="56" cy="92" r="3.5" fill="var(--color-warn)" opacity="0.7" />
      </g>

      {/* Long hair back */}
      <path
        className="ti-hairsway"
        d="M70 92 Q56 120 60 168 L80 168 Q76 124 80 100 Z"
        fill="var(--color-primary)"
        opacity="0.88"
      />
      <path
        className="ti-hairsway"
        d="M130 92 Q144 120 140 168 L120 168 Q124 124 120 100 Z"
        fill="var(--color-primary)"
        opacity="0.88"
        style={{ animationDelay: "0.3s" }}
      />

      {/* Body */}
      <path d="M72 168 Q70 142 84 132 L116 132 Q130 142 128 168 Z" fill="var(--color-primary-container)" />
      <path d="M88 132 L100 138 L112 132 L112 136 L100 142 L88 136 Z" fill="var(--color-primary)" opacity="0.55" />

      {/* Neck */}
      <rect x="93" y="122" width="14" height="12" rx="4" fill="var(--color-bg)" opacity="0.92" />

      {/* Head */}
      <circle cx="100" cy="104" r="28" fill="var(--color-bg)" opacity="0.95" />

      {/* Hair top (center-parted bangs) */}
      <path
        d="M72 100 Q74 76 100 72 Q126 76 128 100 Q120 84 104 84 Q100 90 96 84 Q80 84 72 100 Z"
        fill="var(--color-primary)"
      />
      <path d="M72 96 Q80 84 94 88 L92 102 Q82 102 72 96 Z" fill="var(--color-primary)" />
      <path d="M128 96 Q120 84 106 88 L108 102 Q118 102 128 96 Z" fill="var(--color-primary)" />

      {/* Eyes */}
      <ellipse cx="89" cy="106" rx="4.5" ry="6.5" fill="var(--color-text)" />
      <ellipse cx="111" cy="106" rx="4.5" ry="6.5" fill="var(--color-text)" />
      <circle className="ti-shine" cx="90.5" cy="103" r="1.8" fill="var(--color-bg)" />
      <circle className="ti-shine" cx="112.5" cy="103" r="1.8" fill="var(--color-bg)" />

      {/* Mouth */}
      <path d="M95 115 Q100 119 105 115" stroke="var(--color-text)" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Blush */}
      <ellipse className="ti-blush" cx="81" cy="112" rx="4.5" ry="2.8" fill="var(--color-tertiary)" opacity="0.7" />
      <ellipse className="ti-blush" cx="119" cy="112" rx="4.5" ry="2.8" fill="var(--color-tertiary)" opacity="0.7" />

      {/* Left arm holding mirror */}
      <ellipse cx="74" cy="148" rx="6" ry="14" fill="var(--color-primary-container)" transform="rotate(20 74 148)" />

      {/* Mirror / palette she's holding */}
      <g className="ti-mirror">
        {/* Mirror frame (oval hand mirror) */}
        <ellipse cx="60" cy="156" rx="18" ry="14" fill="var(--color-primary)" opacity="0.95" />
        {/* Mirror glass — shows a different color (reflection) */}
        <ellipse cx="60" cy="156" rx="13" ry="9.5" fill="var(--color-tertiary)" opacity="0.85" />
        {/* Reflection shine */}
        <ellipse cx="55" cy="151" rx="4" ry="2.5" fill="var(--color-bg)" opacity="0.6" />
        {/* Handle */}
        <rect x="74" y="156" width="14" height="5" rx="2.5" fill="var(--color-surface-4)" transform="rotate(20 74 148)" />
      </g>

      {/* Right arm (raised slightly toward palette) */}
      <ellipse cx="128" cy="142" rx="6" ry="14" fill="var(--color-primary-container)" transform="rotate(-22 128 142)" />
      <circle cx="136" cy="130" r="7" fill="var(--color-bg)" opacity="0.95" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 3. FolderIllustration — kid opening a treasure chest               */
/* ------------------------------------------------------------------ */
export function FolderIllustration() {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Anime character opening a treasure chest with posters">
      <style>{`
        .fli-lid {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: fli-lid 2.8s ease-in-out infinite;
        }
        @keyframes fli-lid {
          0%, 100% { transform: rotate(0deg); }
          45%, 55% { transform: rotate(-55deg); }
        }
        .fli-poster-1 { transform-box: fill-box; transform-origin: bottom; animation: fli-float 2.8s ease-in-out infinite; }
        .fli-poster-2 { transform-box: fill-box; transform-origin: bottom; animation: fli-float 2.8s ease-in-out infinite 0.4s; }
        .fli-poster-3 { transform-box: fill-box; transform-origin: bottom; animation: fli-float 2.8s ease-in-out infinite 0.8s; }
        @keyframes fli-float {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-12px); opacity: 1; }
        }
        .fli-glow {
          transform-box: fill-box;
          transform-origin: center;
          animation: pulse 3s ease-in-out infinite;
        }
        .fli-arm {
          transform-box: fill-box;
          transform-origin: 80% 80%;
          animation: fli-reach 2.8s ease-in-out infinite;
        }
        @keyframes fli-reach {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-12deg); }
        }
        .fli-blush {
          transform-box: fill-box;
          transform-origin: center;
          animation: pulse 3s ease-in-out infinite;
        }
        .fli-shine {
          transform-box: fill-box;
          transform-origin: center;
          animation: fli-twinkle 2.2s ease-in-out infinite;
        }
        @keyframes fli-twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* Soft glow behind chest */}
      <circle className="fli-glow" cx="110" cy="140" r="56" fill="var(--color-primary)" opacity="0.08" />

      {/* Treasure chest body (back) */}
      <rect x="78" y="124" width="84" height="46" rx="6" fill="var(--color-primary-container)" />
      {/* Chest wood-plank detail */}
      <rect x="82" y="148" width="76" height="3" rx="1.5" fill="var(--color-primary)" opacity="0.3" />
      {/* Gold lock */}
      <rect x="114" y="138" width="12" height="14" rx="2" fill="var(--color-warn)" />
      <circle cx="120" cy="144" r="2" fill="var(--color-bg)" opacity="0.7" />

      {/* Posters spilling out (floating up, staggered) */}
      <g className="fli-poster-1">
        <rect x="86" y="110" width="18" height="26" rx="2" fill="var(--color-tertiary)" opacity="0.85" />
        {/* Mini anime face on poster */}
        <circle cx="95" cy="118" r="3.5" fill="var(--color-bg)" opacity="0.9" />
        <path d="M91 116 Q95 113 99 116" stroke="var(--color-primary)" strokeWidth="1.2" fill="none" />
        <ellipse cx="93.5" cy="118" rx="0.9" ry="1.2" fill="var(--color-text)" />
        <ellipse cx="96.5" cy="118" rx="0.9" ry="1.2" fill="var(--color-text)" />
      </g>
      <g className="fli-poster-2">
        <rect x="108" y="100" width="18" height="26" rx="2" fill="var(--color-secondary)" opacity="0.85" />
        <circle cx="117" cy="108" r="3.5" fill="var(--color-bg)" opacity="0.9" />
        <path d="M113 106 Q117 103 121 106" stroke="var(--color-primary)" strokeWidth="1.2" fill="none" />
        <ellipse cx="115.5" cy="108" rx="0.9" ry="1.2" fill="var(--color-text)" />
        <ellipse cx="118.5" cy="108" rx="0.9" ry="1.2" fill="var(--color-text)" />
      </g>
      <g className="fli-poster-3">
        <rect x="130" y="112" width="18" height="26" rx="2" fill="var(--color-warn)" opacity="0.85" />
        <circle cx="139" cy="120" r="3.5" fill="var(--color-bg)" opacity="0.9" />
        <path d="M135 118 Q139 115 143 118" stroke="var(--color-primary)" strokeWidth="1.2" fill="none" />
        <ellipse cx="137.5" cy="120" rx="0.9" ry="1.2" fill="var(--color-text)" />
        <ellipse cx="140.5" cy="120" rx="0.9" ry="1.2" fill="var(--color-text)" />
      </g>

      {/* Chest lid (animated, opens forward) */}
      <g className="fli-lid">
        <path d="M78 124 L120 124 L120 110 Q120 104 114 104 L84 104 Q78 104 78 110 Z" fill="var(--color-primary)" />
        <rect x="82" y="108" width="34" height="3" rx="1.5" fill="var(--color-bg)" opacity="0.25" />
        {/* Lid gold band */}
        <rect x="78" y="120" width="42" height="4" rx="2" fill="var(--color-warn)" opacity="0.85" />
      </g>

      {/* Kid character on the left, reaching toward chest */}
      {/* Body */}
      <path d="M40 168 Q38 144 50 136 L66 136 Q72 144 70 168 Z" fill="var(--color-surface-3)" />
      {/* Neck */}
      <rect x="50" y="126" width="10" height="10" rx="3" fill="var(--color-bg)" opacity="0.92" />
      {/* Head */}
      <circle cx="55" cy="116" r="18" fill="var(--color-bg)" opacity="0.95" />
      {/* Hair (messy) */}
      <path d="M38 112 Q40 96 55 94 Q70 96 72 112 Q66 102 55 102 Q44 102 38 112 Z" fill="var(--color-primary)" />
      <path d="M44 100 Q50 92 58 96 L56 108 Q48 108 44 100 Z" fill="var(--color-primary)" />
      {/* Eyes (excited - starry) */}
      <ellipse cx="49" cy="116" rx="3" ry="4.5" fill="var(--color-text)" />
      <ellipse cx="61" cy="116" rx="3" ry="4.5" fill="var(--color-text)" />
      <circle className="fli-shine" cx="50" cy="114" r="1.2" fill="var(--color-bg)" />
      <circle className="fli-shine" cx="62" cy="114" r="1.2" fill="var(--color-bg)" />
      {/* Mouth (open excited "o") */}
      <ellipse cx="55" cy="123" rx="2" ry="1.5" fill="var(--color-text)" />
      {/* Blush */}
      <ellipse className="fli-blush" cx="44" cy="120" rx="3" ry="2" fill="var(--color-tertiary)" opacity="0.7" />
      <ellipse className="fli-blush" cx="66" cy="120" rx="3" ry="2" fill="var(--color-tertiary)" opacity="0.7" />

      {/* Right arm reaching toward chest lid */}
      <g className="fli-arm">
        <ellipse cx="70" cy="142" rx="5" ry="12" fill="var(--color-surface-3)" transform="rotate(-30 70 142)" />
        <circle cx="80" cy="128" r="6" fill="var(--color-bg)" opacity="0.95" />
      </g>
      {/* Left arm */}
      <ellipse cx="48" cy="152" rx="5" ry="11" fill="var(--color-surface-3)" transform="rotate(15 48 152)" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 4. CheckIllustration — character giving a thumbs up + checkmark    */
/* ------------------------------------------------------------------ */
export function CheckIllustration() {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Anime character giving a thumbs up with a checkmark">
      <style>{`
        /* Checkmark draw — sized for our 200×200 scene */
        svg .ci-check {
          stroke-dasharray: 80;
          stroke-dashoffset: 80;
          animation: ci-draw 0.5s var(--ease-emphasized-decel) 0.4s forwards;
        }
        svg .ci-circle {
          stroke-dasharray: 260;
          stroke-dashoffset: 260;
          animation: ci-draw 0.6s var(--ease-emphasized-decel) 0.1s forwards;
        }
        @keyframes ci-draw { to { stroke-dashoffset: 0; } }
        .ci-burst {
          transform-box: fill-box;
          transform-origin: center;
          animation: ci-burst 0.7s var(--ease-emphasized-decel) 1.1s both;
        }
        @keyframes ci-burst {
          0% { opacity: 0; transform: scale(0.3); }
          60% { opacity: 1; transform: scale(1.15); }
          100% { opacity: 0; transform: scale(1.6); }
        }
        .ci-thumb {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: ci-pop 0.5s var(--ease-emphasized-decel) 0.7s both;
        }
        @keyframes ci-pop {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .ci-blush {
          transform-box: fill-box;
          transform-origin: center;
          animation: pulse 3s ease-in-out infinite;
        }
        .ci-spark {
          transform-box: fill-box;
          transform-origin: center;
          animation: ci-twinkle 1.6s ease-in-out infinite;
        }
        @keyframes ci-twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.6); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>

      {/* Backdrop ring (soft, drawing) */}
      <circle className="ci-circle" cx="140" cy="64" r="34" fill="none" stroke="var(--color-primary)" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
      <circle cx="140" cy="64" r="34" fill="var(--color-primary)" opacity="0.1" />

      {/* Checkmark (drawing in) */}
      <path
        className="ci-check"
        d="M126 64 L137 75 L156 54"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Burst sparkles after check draws */}
      <g className="ci-burst">
        <circle cx="170" cy="40" r="3" fill="var(--color-primary)" />
        <circle cx="110" cy="50" r="2.5" fill="var(--color-primary)" />
        <circle cx="172" cy="86" r="2.5" fill="var(--color-tertiary)" />
        <circle cx="118" cy="92" r="2" fill="var(--color-primary)" />
      </g>

      {/* Character on the left */}
      {/* Body */}
      <path d="M44 168 Q42 138 56 128 L86 128 Q100 138 98 168 Z" fill="var(--color-primary-container)" />
      <path d="M60 128 L72 134 L84 128 L84 132 L72 138 L60 132 Z" fill="var(--color-primary)" opacity="0.55" />

      {/* Neck */}
      <rect x="65" y="118" width="12" height="12" rx="4" fill="var(--color-bg)" opacity="0.92" />

      {/* Head */}
      <circle cx="71" cy="100" r="26" fill="var(--color-bg)" opacity="0.95" />

      {/* Hair (spiky anime style) */}
      <path d="M46 100 Q48 76 71 72 Q94 76 96 100 Q88 84 78 84 L75 92 L70 84 L65 92 L60 84 Q54 84 46 100 Z" fill="var(--color-primary)" />
      <path d="M48 92 Q56 80 66 84 L62 98 Q54 98 48 92 Z" fill="var(--color-primary)" />
      <path d="M94 92 Q86 80 76 84 L80 98 Q88 98 94 92 Z" fill="var(--color-primary)" />

      {/* Eyes (happy closed - ^_^) */}
      <path d="M61 102 Q65 96 69 102" stroke="var(--color-text)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M73 102 Q77 96 81 102" stroke="var(--color-text)" strokeWidth="2.2" fill="none" strokeLinecap="round" />

      {/* Big smile */}
      <path d="M63 110 Q71 118 79 110" stroke="var(--color-text)" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Blush */}
      <ellipse className="ci-blush" cx="56" cy="107" rx="4.5" ry="2.8" fill="var(--color-tertiary)" opacity="0.7" />
      <ellipse className="ci-blush" cx="86" cy="107" rx="4.5" ry="2.8" fill="var(--color-tertiary)" opacity="0.7" />

      {/* Left arm (resting) */}
      <ellipse cx="50" cy="150" rx="6" ry="13" fill="var(--color-primary-container)" transform="rotate(15 50 150)" />

      {/* Right arm with thumbs-up (pops in) */}
      <g className="ci-thumb">
        {/* Forearm */}
        <ellipse cx="92" cy="148" rx="6" ry="16" fill="var(--color-primary-container)" transform="rotate(-18 92 148)" />
        {/* Fist */}
        <circle cx="100" cy="128" r="11" fill="var(--color-bg)" opacity="0.95" />
        {/* Thumb up */}
        <rect x="98" y="112" width="8" height="14" rx="4" fill="var(--color-bg)" opacity="0.95" />
        {/* Fist knuckle details */}
        <path d="M93 130 Q100 134 107 130" stroke="var(--color-text)" strokeWidth="1.2" fill="none" opacity="0.5" />
      </g>

      {/* Sparkles around */}
      <circle className="ci-spark" cx="36" cy="58" r="3" fill="var(--color-warn)" />
      <circle className="ci-spark" cx="50" cy="40" r="2.5" fill="var(--color-primary)" style={{ animationDelay: "0.4s" }} />
      <circle className="ci-spark" cx="170" cy="120" r="2.5" fill="var(--color-tertiary)" style={{ animationDelay: "0.8s" }} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 5. ShieldIllustration — guardian holding shield, BIG ripples behind*/
/* ------------------------------------------------------------------ */
export function ShieldIllustration() {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Anime guardian holding a shield with expanding ripples" overflow="hidden">
      <style>{`
        /* BIG expanding ripples BEHIND the character.
           Multiple staggered rings emanate outward from behind. */
        .si-ring {
          transform-box: fill-box;
          transform-origin: 100px 100px;
          animation: si-ring 2.8s ease-out infinite;
        }
        @keyframes si-ring {
          0% { transform: scale(0.4); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .si-ring-2 { animation-delay: 0.9s; }
        .si-ring-3 { animation-delay: 1.8s; }
        .si-shield-glow {
          transform-box: fill-box;
          transform-origin: center;
          animation: pulse 2.4s ease-in-out infinite;
        }
        .si-cape {
          transform-box: fill-box;
          transform-origin: top;
          animation: si-sway 3.2s ease-in-out infinite;
        }
        @keyframes si-sway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        .si-blush {
          transform-box: fill-box;
          transform-origin: center;
          animation: pulse 3s ease-in-out infinite;
        }
        .si-shine {
          transform-box: fill-box;
          transform-origin: center;
          animation: si-twinkle 2.4s ease-in-out infinite;
        }
        @keyframes si-twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* BIG expanding ripples BEHIND everything (multiple staggered rings) */}
      <circle className="si-ring" cx="100" cy="100" r="72" fill="none" stroke="var(--color-primary)" strokeWidth="3" opacity="0.6" />
      <circle className="si-ring si-ring-2" cx="100" cy="100" r="72" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" opacity="0.6" />
      <circle className="si-ring si-ring-3" cx="100" cy="100" r="72" fill="none" stroke="var(--color-primary)" strokeWidth="2" opacity="0.6" />

      {/* Soft glow halo behind character */}
      <circle className="si-shield-glow" cx="100" cy="104" r="58" fill="var(--color-primary)" opacity="0.1" />

      {/* Cape (flowing behind body, sways) */}
      <path
        className="si-cape"
        d="M72 110 Q56 130 56 168 L72 168 Q76 138 80 122 Z"
        fill="var(--color-primary)"
        opacity="0.7"
      />
      <path
        className="si-cape"
        d="M128 110 Q144 130 144 168 L128 168 Q124 138 120 122 Z"
        fill="var(--color-primary)"
        opacity="0.7"
        style={{ animationDelay: "0.3s" }}
      />

      {/* Body (armor tunic) */}
      <path d="M70 168 Q68 138 82 128 L118 128 Q132 138 130 168 Z" fill="var(--color-primary-container)" />
      {/* Belt */}
      <rect x="70" y="150" width="60" height="6" rx="2" fill="var(--color-primary)" opacity="0.7" />
      <rect x="96" y="148" width="8" height="10" rx="2" fill="var(--color-warn)" />

      {/* Neck */}
      <rect x="93" y="118" width="14" height="12" rx="4" fill="var(--color-bg)" opacity="0.92" />

      {/* Head */}
      <circle cx="100" cy="100" r="26" fill="var(--color-bg)" opacity="0.95" />

      {/* Hair (top, short — serious guardian) */}
      <path d="M74 100 Q76 74 100 70 Q124 74 126 100 Q118 84 100 84 Q82 84 74 100 Z" fill="var(--color-primary)" />
      <path d="M74 94 Q84 82 96 86 L94 100 Q84 100 74 94 Z" fill="var(--color-primary)" />
      <path d="M126 94 Q116 82 104 86 L106 100 Q116 100 126 94 Z" fill="var(--color-primary)" />

      {/* Guardian headband (forehead protector) */}
      <rect x="76" y="86" width="48" height="6" rx="2" fill="var(--color-surface-4)" />
      <circle cx="100" cy="89" r="2" fill="var(--color-primary)" />

      {/* Eyes (determined) */}
      <ellipse cx="89" cy="102" rx="4.5" ry="6" fill="var(--color-text)" />
      <ellipse cx="111" cy="102" rx="4.5" ry="6" fill="var(--color-text)" />
      <circle className="si-shine" cx="90.5" cy="99.5" r="1.8" fill="var(--color-bg)" />
      <circle className="si-shine" cx="112.5" cy="99.5" r="1.8" fill="var(--color-bg)" />

      {/* Mouth (small focused) */}
      <path d="M95 113 L105 113" stroke="var(--color-text)" strokeWidth="1.6" fill="none" strokeLinecap="round" />

      {/* Blush (subtle) */}
      <ellipse className="si-blush" cx="80" cy="109" rx="4" ry="2.5" fill="var(--color-tertiary)" opacity="0.5" />
      <ellipse className="si-blush" cx="120" cy="109" rx="4" ry="2.5" fill="var(--color-tertiary)" opacity="0.5" />

      {/* Shield (held in front, big and prominent) */}
      <g>
        {/* Shield outer */}
        <path
          d="M138 110 Q138 96 152 96 Q166 96 166 110 L166 138 Q166 152 152 158 Q138 152 138 138 Z"
          fill="var(--color-primary)"
        />
        {/* Shield inner panel */}
        <path
          d="M144 112 Q144 102 152 102 Q160 102 160 112 L160 134 Q160 146 152 150 Q144 146 144 134 Z"
          fill="var(--color-primary-container)"
        />
        {/* Shield emblem (cross/star) */}
        <path d="M152 116 L152 138 M143 124 L161 124" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />
        {/* Shield highlight */}
        <ellipse cx="148" cy="110" rx="3" ry="2" fill="var(--color-bg)" opacity="0.4" />
      </g>

      {/* Right arm holding shield */}
      <ellipse cx="138" cy="138" rx="6" ry="14" fill="var(--color-primary-container)" transform="rotate(-15 138 138)" />

      {/* Left arm (clenched fist at side) */}
      <ellipse cx="68" cy="148" rx="6" ry="13" fill="var(--color-primary-container)" transform="rotate(15 68 148)" />
      <circle cx="64" cy="160" r="6" fill="var(--color-bg)" opacity="0.95" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 6. CloudIllustration — character reaching for falling data drops   */
/* ------------------------------------------------------------------ */
export function CloudIllustration() {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Anime character reaching up to catch falling data particles">
      <style>{`
        .cb-drop-1 { transform-box: fill-box; transform-origin: center; animation: cb-fall 2.2s ease-in infinite; }
        .cb-drop-2 { transform-box: fill-box; transform-origin: center; animation: cb-fall 2.2s ease-in infinite 0.5s; }
        .cb-drop-3 { transform-box: fill-box; transform-origin: center; animation: cb-fall 2.2s ease-in infinite 1.0s; }
        .cb-drop-4 { transform-box: fill-box; transform-origin: center; animation: cb-fall 2.2s ease-in infinite 1.5s; }
        @keyframes cb-fall {
          0% { transform: translateY(-8px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(36px); opacity: 0; }
        }
        .cb-cloud {
          transform-box: fill-box;
          transform-origin: center;
          animation: float 3.5s ease-in-out infinite;
        }
        .cb-arm-l {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: cb-reach-l 2.4s ease-in-out infinite;
        }
        @keyframes cb-reach-l {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-8deg); }
        }
        .cb-arm-r {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: cb-reach-r 2.4s ease-in-out infinite;
        }
        @keyframes cb-reach-r {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(8deg); }
        }
        .cb-blush {
          transform-box: fill-box;
          transform-origin: center;
          animation: pulse 3s ease-in-out infinite;
        }
        .cb-shine {
          transform-box: fill-box;
          transform-origin: center;
          animation: cb-twinkle 2s ease-in-out infinite;
        }
        @keyframes cb-twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* Cloud (floating up top) */}
      <g className="cb-cloud">
        <ellipse cx="74" cy="48" rx="20" ry="18" fill="var(--color-surface-3)" />
        <ellipse cx="100" cy="38" rx="28" ry="24" fill="var(--color-surface-3)" />
        <ellipse cx="126" cy="48" rx="20" ry="18" fill="var(--color-surface-3)" />
        <rect x="64" y="48" width="72" height="18" rx="9" fill="var(--color-surface-3)" />
        {/* Cloud highlight */}
        <ellipse cx="90" cy="32" rx="9" ry="4" fill="var(--color-bg)" opacity="0.18" />
        {/* Cloud "data" dotted pattern */}
        <circle cx="80" cy="48" r="2" fill="var(--color-primary)" opacity="0.5" />
        <circle cx="110" cy="42" r="2" fill="var(--color-primary)" opacity="0.5" />
        <circle cx="124" cy="52" r="2" fill="var(--color-primary)" opacity="0.5" />
      </g>

      {/* Falling data particles (small dots/squares) */}
      <g className="cb-drop-1">
        <rect x="70" y="64" width="6" height="6" rx="1.5" fill="var(--color-primary)" transform="rotate(20 73 67)" />
      </g>
      <g className="cb-drop-2">
        <circle cx="92" cy="68" r="3.5" fill="var(--color-tertiary)" />
      </g>
      <g className="cb-drop-3">
        <rect x="112" y="64" width="6" height="6" rx="1.5" fill="var(--color-warn)" transform="rotate(-15 115 67)" />
      </g>
      <g className="cb-drop-4">
        <circle cx="130" cy="70" r="3" fill="var(--color-primary)" opacity="0.8" />
      </g>

      {/* Character reaching up — body */}
      <path d="M70 168 Q68 140 82 130 L118 130 Q132 140 130 168 Z" fill="var(--color-primary-container)" />
      <path d="M88 130 L100 136 L112 130 L112 134 L100 140 L88 134 Z" fill="var(--color-primary)" opacity="0.55" />

      {/* Neck */}
      <rect x="93" y="120" width="14" height="12" rx="4" fill="var(--color-bg)" opacity="0.92" />

      {/* Head — tilted up slightly */}
      <g transform="translate(0 -2)">
        <circle cx="100" cy="104" r="26" fill="var(--color-bg)" opacity="0.95" />

        {/* Hair (twin-tails or side pony) */}
        <path d="M74 100 Q76 76 100 72 Q124 76 126 100 Q118 84 100 84 Q82 84 74 100 Z" fill="var(--color-primary)" />
        <path d="M74 94 Q82 82 94 86 L92 100 Q84 100 74 94 Z" fill="var(--color-primary)" />
        <path d="M126 94 Q118 82 106 86 L108 100 Q116 100 126 94 Z" fill="var(--color-primary)" />

        {/* Eyes (looking up - hopeful/sparkly) */}
        <ellipse cx="89" cy="102" rx="4.5" ry="6" fill="var(--color-text)" />
        <ellipse cx="111" cy="102" rx="4.5" ry="6" fill="var(--color-text)" />
        <circle className="cb-shine" cx="90.5" cy="99" r="1.8" fill="var(--color-bg)" />
        <circle className="cb-shine" cx="112.5" cy="99" r="1.8" fill="var(--color-bg)" />

        {/* Mouth (small open "o" — anticipation) */}
        <ellipse cx="100" cy="115" rx="2" ry="2.5" fill="var(--color-text)" />

        {/* Blush */}
        <ellipse className="cb-blush" cx="80" cy="110" rx="4.5" ry="2.8" fill="var(--color-tertiary)" opacity="0.7" />
        <ellipse className="cb-blush" cx="120" cy="110" rx="4.5" ry="2.8" fill="var(--color-tertiary)" opacity="0.7" />
      </g>

      {/* Left arm reaching up */}
      <g className="cb-arm-l">
        <ellipse cx="76" cy="124" rx="5" ry="18" fill="var(--color-primary-container)" transform="rotate(28 76 124)" />
        <circle cx="64" cy="108" r="7" fill="var(--color-bg)" opacity="0.95" />
        {/* Cupped palm detail */}
        <path d="M60 106 Q64 102 68 106" stroke="var(--color-primary)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </g>

      {/* Right arm reaching up */}
      <g className="cb-arm-r">
        <ellipse cx="124" cy="124" rx="5" ry="18" fill="var(--color-primary-container)" transform="rotate(-28 124 124)" />
        <circle cx="136" cy="108" r="7" fill="var(--color-bg)" opacity="0.95" />
        <path d="M132 106 Q136 102 140 106" stroke="var(--color-primary)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 7. StatsIllustration — excited character next to growing chart     */
/* ------------------------------------------------------------------ */
export function StatsIllustration() {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Excited anime character next to a growing bar chart">
      <style>{`
        .st-bar { transform-box: fill-box; transform-origin: bottom; }
        .st-bar-1 { animation: st-grow 1.4s var(--ease-emphasized-decel) 0.1s both; }
        .st-bar-2 { animation: st-grow 1.4s var(--ease-emphasized-decel) 0.25s both; }
        .st-bar-3 { animation: st-grow 1.4s var(--ease-emphasized-decel) 0.4s both; }
        .st-bar-4 { animation: st-grow 1.4s var(--ease-emphasized-decel) 0.55s both; }
        @keyframes st-grow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        .st-trend {
          transform-box: fill-box;
          transform-origin: bottom;
          animation: st-bob 2.4s ease-in-out infinite;
        }
        @keyframes st-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .st-arm-l {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: st-cheer-l 1.4s ease-in-out infinite;
        }
        @keyframes st-cheer-l {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-12deg); }
        }
        .st-arm-r {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: st-cheer-r 1.4s ease-in-out infinite;
        }
        @keyframes st-cheer-r {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(12deg); }
        }
        .st-blush {
          transform-box: fill-box;
          transform-origin: center;
          animation: pulse 3s ease-in-out infinite;
        }
        .st-spark {
          transform-box: fill-box;
          transform-origin: center;
          animation: st-twinkle 1.6s ease-in-out infinite;
        }
        @keyframes st-twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.6); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>

      {/* Chart backdrop card */}
      <rect x="92" y="60" width="92" height="100" rx="8" fill="var(--color-surface-2)" />
      {/* Card inner header strip */}
      <rect x="92" y="60" width="92" height="12" rx="8" fill="var(--color-primary)" opacity="0.4" />
      <rect x="92" y="66" width="92" height="6" fill="var(--color-primary)" opacity="0.4" />

      {/* Y-axis grid lines */}
      <line x1="100" y1="92" x2="176" y2="92" stroke="var(--color-surface-4)" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
      <line x1="100" y1="116" x2="176" y2="116" stroke="var(--color-surface-4)" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
      <line x1="100" y1="140" x2="176" y2="140" stroke="var(--color-surface-4)" strokeWidth="1" />

      {/* Bars (grow from bottom) */}
      <rect className="st-bar st-bar-1" x="106" y="118" width="14" height="22" rx="2" fill="var(--color-primary)" opacity="0.55" />
      <rect className="st-bar st-bar-2" x="126" y="106" width="14" height="34" rx="2" fill="var(--color-primary)" opacity="0.75" />
      <rect className="st-bar st-bar-3" x="146" y="92" width="14" height="48" rx="2" fill="var(--color-primary)" />
      <rect className="st-bar st-bar-4" x="166" y="100" width="14" height="40" rx="2" fill="var(--color-primary)" opacity="0.65" />

      {/* Trend arrow */}
      <g className="st-trend">
        <path
          d="M104 76 L112 68 L120 76 M112 68 L112 84"
          stroke="var(--color-success)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Character on the left, excited */}
      {/* Body */}
      <path d="M40 168 Q38 138 52 128 L80 128 Q94 138 92 168 Z" fill="var(--color-primary-container)" />
      <path d="M56 128 L66 134 L76 128 L76 132 L66 138 L56 132 Z" fill="var(--color-primary)" opacity="0.55" />

      {/* Neck */}
      <rect x="60" y="118" width="12" height="12" rx="4" fill="var(--color-bg)" opacity="0.92" />

      {/* Head */}
      <circle cx="66" cy="100" r="24" fill="var(--color-bg)" opacity="0.95" />

      {/* Hair (twin-tails or short bob) */}
      <path d="M42 100 Q44 76 66 72 Q88 76 90 100 Q82 84 66 84 Q50 84 42 100 Z" fill="var(--color-primary)" />
      <path d="M42 94 Q50 82 60 86 L58 100 Q50 100 42 94 Z" fill="var(--color-primary)" />
      <path d="M90 94 Q82 82 72 86 L74 100 Q82 100 90 94 Z" fill="var(--color-primary)" />

      {/* Eyes (star sparkly — excited) */}
      <ellipse cx="58" cy="100" rx="4" ry="5.5" fill="var(--color-text)" />
      <ellipse cx="74" cy="100" rx="4" ry="5.5" fill="var(--color-text)" />
      <circle className="st-spark" cx="59.5" cy="97.5" r="1.6" fill="var(--color-bg)" />
      <circle className="st-spark" cx="75.5" cy="97.5" r="1.6" fill="var(--color-bg)" />

      {/* Big smile (open happy) */}
      <path d="M58 108 Q66 116 74 108" stroke="var(--color-text)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M60 109 Q66 113 72 109" fill="var(--color-tertiary)" opacity="0.4" />

      {/* Blush */}
      <ellipse className="st-blush" cx="50" cy="106" rx="4" ry="2.5" fill="var(--color-tertiary)" opacity="0.7" />
      <ellipse className="st-blush" cx="82" cy="106" rx="4" ry="2.5" fill="var(--color-tertiary)" opacity="0.7" />

      {/* Both arms raised in excitement */}
      <g className="st-arm-l">
        <ellipse cx="46" cy="118" rx="5" ry="16" fill="var(--color-primary-container)" transform="rotate(35 46 118)" />
        <circle cx="36" cy="100" r="6" fill="var(--color-bg)" opacity="0.95" />
      </g>
      <g className="st-arm-r">
        <ellipse cx="86" cy="118" rx="5" ry="16" fill="var(--color-primary-container)" transform="rotate(-35 86 118)" />
        <circle cx="96" cy="100" r="6" fill="var(--color-bg)" opacity="0.95" />
      </g>

      {/* Excited sparkles around character */}
      <circle className="st-spark" cx="28" cy="80" r="2.5" fill="var(--color-warn)" />
      <circle className="st-spark" cx="22" cy="120" r="2" fill="var(--color-primary)" style={{ animationDelay: "0.4s" }} />
      <circle className="st-spark" cx="38" cy="56" r="2" fill="var(--color-tertiary)" style={{ animationDelay: "0.8s" }} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 8. FinishIllustration — celebrating anime girl with confetti       */
/* ------------------------------------------------------------------ */
export function FinishIllustration() {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Anime girl celebrating with confetti">
      <style>{`
        .fini-bounce {
          transform-box: fill-box;
          transform-origin: bottom;
          animation: fini-bounce 1.4s ease-in-out infinite;
        }
        @keyframes fini-bounce {
          0%, 100% { transform: translateY(0) scaleY(1); }
          30% { transform: translateY(-10px) scaleY(1.04); }
          60% { transform: translateY(0) scaleY(0.97); }
        }
        .fini-arm-l {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: fini-cheer-l 1.4s ease-in-out infinite;
        }
        @keyframes fini-cheer-l {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-10deg); }
        }
        .fini-arm-r {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: fini-cheer-r 1.4s ease-in-out infinite;
        }
        @keyframes fini-cheer-r {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(10deg); }
        }
        .fini-tail {
          transform-box: fill-box;
          transform-origin: top;
          animation: fini-sway 2.2s ease-in-out infinite;
        }
        @keyframes fini-sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        .fini-confetti {
          transform-box: fill-box;
          transform-origin: center;
        }
        .fini-c1 { animation: fini-fall 2.4s ease-in infinite; }
        .fini-c2 { animation: fini-fall 2.4s ease-in infinite 0.3s; }
        .fini-c3 { animation: fini-fall 2.4s ease-in infinite 0.6s; }
        .fini-c4 { animation: fini-fall 2.4s ease-in infinite 0.9s; }
        .fini-c5 { animation: fini-fall 2.4s ease-in infinite 1.2s; }
        .fini-c6 { animation: fini-fall 2.4s ease-in infinite 1.5s; }
        @keyframes fini-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(60px) rotate(540deg); opacity: 0; }
        }
        .fini-sparkle {
          transform-box: fill-box;
          transform-origin: center;
          animation: fini-twinkle 1.6s ease-in-out infinite;
        }
        @keyframes fini-twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.6); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .fini-blush {
          transform-box: fill-box;
          transform-origin: center;
          animation: pulse 3s ease-in-out infinite;
        }
        .fini-eye {
          transform-box: fill-box;
          transform-origin: center;
          animation: fini-blink 3.4s ease-in-out infinite;
        }
        @keyframes fini-blink {
          0%, 92%, 100% { transform: scaleY(1); }
          96% { transform: scaleY(0.1); }
        }
      `}</style>

      {/* Sparkles around (4-pointed stars) */}
      <Sparkle className="fini-sparkle" cx={36} cy={50} r={8} fill="var(--color-primary)" />
      <Sparkle className="fini-sparkle" cx={166} cy={56} r={7} fill="var(--color-tertiary)" style={{ animationDelay: "0.5s" }} />
      <Sparkle className="fini-sparkle" cx={32} cy={130} r={6} fill="var(--color-warn)" style={{ animationDelay: "1s" }} />
      <Sparkle className="fini-sparkle" cx={170} cy={128} r={7} fill="var(--color-primary)" style={{ animationDelay: "0.7s" }} />

      {/* Confetti pieces */}
      <rect className="fini-confetti fini-c1" x="58" y="34" width="6" height="6" rx="1.5" fill="var(--color-primary)" transform="rotate(20 61 37)" />
      <rect className="fini-confetti fini-c2" x="88" y="28" width="6" height="6" rx="1.5" fill="var(--color-tertiary)" transform="rotate(45 91 31)" />
      <rect className="fini-confetti fini-c3" x="120" y="34" width="6" height="6" rx="1.5" fill="var(--color-warn)" transform="rotate(-15 123 37)" />
      <rect className="fini-confetti fini-c4" x="68" y="34" width="5" height="8" rx="1.5" fill="var(--color-success)" transform="rotate(60 71 38)" />
      <rect className="fini-confetti fini-c5" x="104" y="30" width="5" height="8" rx="1.5" fill="var(--color-secondary)" transform="rotate(-30 106 34)" />
      <circle className="fini-confetti fini-c6" cx="140" cy="36" r="3.5" fill="var(--color-primary)" />

      {/* The bouncing anime girl character */}
      <g className="fini-bounce">
        {/* Twin tails (back, swaying) */}
        <path
          className="fini-tail"
          d="M74 96 Q56 112 50 146 Q48 162 58 168 Q66 162 70 150 Q74 130 80 116 Z"
          fill="var(--color-primary)"
          opacity="0.92"
        />
        <path
          className="fini-tail"
          d="M126 96 Q144 112 150 146 Q152 162 142 168 Q134 162 130 150 Q126 130 120 116 Z"
          fill="var(--color-primary)"
          opacity="0.92"
          style={{ animationDelay: "0.3s" }}
        />
        {/* Tail-tie ribbons */}
        <ellipse cx="58" cy="142" rx="6" ry="3" fill="var(--color-tertiary)" opacity="0.8" transform="rotate(-30 58 142)" />
        <ellipse cx="142" cy="142" rx="6" ry="3" fill="var(--color-tertiary)" opacity="0.8" transform="rotate(30 142 142)" />

        {/* Body (dress) */}
        <path d="M72 168 Q70 138 84 128 L116 128 Q130 138 128 168 Z" fill="var(--color-primary-container)" />
        {/* Dress collar (V) */}
        <path d="M88 128 L100 134 L112 128 L112 132 L100 138 L88 132 Z" fill="var(--color-primary)" opacity="0.55" />

        {/* Neck */}
        <rect x="93" y="118" width="14" height="12" rx="4" fill="var(--color-bg)" opacity="0.92" />

        {/* Head */}
        <circle cx="100" cy="100" r="30" fill="var(--color-bg)" opacity="0.95" />

        {/* Hair top (bangs) */}
        <path
          d="M70 96 Q72 70 100 66 Q128 70 130 96 Q124 80 108 80 Q100 86 92 80 Q76 80 70 96 Z"
          fill="var(--color-primary)"
        />
        <path d="M72 92 Q82 80 96 84 L94 100 Q82 100 72 92 Z" fill="var(--color-primary)" />
        <path d="M128 92 Q118 80 104 84 L106 100 Q118 100 128 92 Z" fill="var(--color-primary)" />
        {/* Center bang parting */}
        <path d="M100 70 L96 92 L100 96 L104 92 Z" fill="var(--color-primary)" opacity="0.7" />

        {/* Eyes (happy — big sparkly anime) */}
        <ellipse className="fini-eye" cx="88" cy="102" rx="5" ry="7" fill="var(--color-text)" />
        <ellipse className="fini-eye" cx="112" cy="102" rx="5" ry="7" fill="var(--color-text)" />
        <circle className="fini-sparkle" cx="89.5" cy="99" r="2" fill="var(--color-bg)" />
        <circle className="fini-sparkle" cx="113.5" cy="99" r="2" fill="var(--color-bg)" style={{ animationDelay: "0.5s" }} />

        {/* Big happy smile */}
        <path d="M92 110 Q100 120 108 110" stroke="var(--color-text)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M94 111 Q100 117 106 111" fill="var(--color-tertiary)" opacity="0.5" />

        {/* Blush */}
        <ellipse className="fini-blush" cx="78" cy="110" rx="5" ry="3" fill="var(--color-tertiary)" opacity="0.7" />
        <ellipse className="fini-blush" cx="122" cy="110" rx="5" ry="3" fill="var(--color-tertiary)" opacity="0.7" />

        {/* Both arms raised in joy */}
        <g className="fini-arm-l">
          <ellipse cx="78" cy="120" rx="6" ry="20" fill="var(--color-primary-container)" transform="rotate(35 78 120)" />
          <circle cx="64" cy="100" r="9" fill="var(--color-bg)" opacity="0.95" />
        </g>
        <g className="fini-arm-r">
          <ellipse cx="122" cy="120" rx="6" ry="20" fill="var(--color-primary-container)" transform="rotate(-35 122 120)" />
          <circle cx="136" cy="100" r="9" fill="var(--color-bg)" opacity="0.95" />
        </g>
      </g>
    </svg>
  );
}
