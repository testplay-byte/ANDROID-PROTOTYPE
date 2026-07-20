"use client";

import { useId } from "react";

interface CatProps {
  size?: number;
  className?: string;
  /** Override the primary color (defaults to CSS var --color-primary) */
  color?: string;
  /** Override the accent/secondary color (defaults to a lighter shade) */
  accentColor?: string;
}

/**
 * Cat — a simple, clean 2D vector cat illustration.
 *
 * The cat's color adapts to the theme:
 * - Uses CSS variables (--color-primary, --color-surface-3, etc.) by default
 * - Can be overridden with explicit color props
 *
 * Animations (subtle, smooth):
 * - Tail sways back and forth
 * - Head tilts slightly
 * - Gentle breathing (body scale)
 * - Occasional ear twitch
 * - Blinking eyes
 *
 * Designed to be cute, minimal, and beautiful — not complex or scary.
 */
export function Cat({ size = 200, className, color, accentColor }: CatProps) {
  const uid = useId().replace(/[:]/g, "");
  const bodyColor = color || "var(--color-primary)";
  const bodyLight = accentColor || "var(--color-primary-container)";
  const innerEar = "var(--color-tertiary)";
  const noseColor = "var(--color-tertiary)";
  const eyeColor = "var(--color-on-primary-container)";
  const whiskerColor = "var(--color-outline)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={`cat-body-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={bodyLight} />
          <stop offset="100%" stopColor={bodyColor} />
        </linearGradient>
        <linearGradient id={`cat-head-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={bodyLight} />
          <stop offset="100%" stopColor={bodyColor} />
        </linearGradient>
      </defs>

      <style>{`
        .cat-body-${uid} {
          transform-origin: 100px 130px;
          animation: cat-breathe-${uid} 3s ease-in-out infinite;
        }
        @keyframes cat-breathe-${uid} {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02, 1.03); }
        }
        .cat-tail-${uid} {
          transform-origin: 135px 140px;
          animation: cat-tail-${uid}-a 3.5s ease-in-out infinite;
        }
        @keyframes cat-tail-${uid}-a {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(15deg); }
        }
        .cat-head-${uid} {
          transform-origin: 100px 85px;
          animation: cat-head-${uid}-a 5s ease-in-out infinite;
        }
        @keyframes cat-head-${uid}-a {
          0%, 100% { transform: rotate(0deg); }
          30% { transform: rotate(3deg); }
          70% { transform: rotate(-2deg); }
        }
        .cat-ear-l-${uid} {
          transform-origin: 72px 48px;
          animation: cat-ear-l-${uid}-a 4s ease-in-out infinite;
        }
        @keyframes cat-ear-l-${uid}-a {
          0%, 90%, 100% { transform: rotate(0deg); }
          93% { transform: rotate(-8deg); }
          96% { transform: rotate(0deg); }
        }
        .cat-ear-r-${uid} {
          transform-origin: 128px 48px;
          animation: cat-ear-r-${uid}-a 4.5s ease-in-out infinite;
        }
        @keyframes cat-ear-r-${uid}-a {
          0%, 85%, 100% { transform: rotate(0deg); }
          88% { transform: rotate(8deg); }
          91% { transform: rotate(0deg); }
        }
        .cat-blink-${uid} {
          transform-origin: center;
          animation: cat-blink-${uid}-a 5s ease-in-out infinite;
        }
        @keyframes cat-blink-${uid}-a {
          0%, 88%, 100% { transform: scaleY(1); }
          92% { transform: scaleY(0.1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cat-body-${uid}, .cat-tail-${uid}, .cat-head-${uid},
          .cat-ear-l-${uid}, .cat-ear-r-${uid}, .cat-blink-${uid} {
            animation: none !important;
          }
        }
      `}</style>

      {/* ===== TAIL (behind body) ===== */}
      <g className={`cat-tail-${uid}`}>
        <path
          d="M 135 140 C 155 135, 170 120, 168 100 C 167 88, 160 82, 155 85
             C 158 90, 160 98, 155 108 C 148 122, 138 130, 130 135 Z"
          fill={`url(#cat-body-${uid})`}
          stroke={bodyColor}
          strokeWidth="1"
        />
      </g>

      {/* ===== BODY ===== */}
      <g className={`cat-body-${uid}`}>
        {/* Body — sitting cat shape, rounded and cute */}
        <path
          d="M 65 185 C 60 165, 58 145, 62 130 C 65 120, 72 112, 80 108
             L 120 108 C 128 112, 135 120, 138 130 C 142 145, 140 165, 135 185 Z"
          fill={`url(#cat-body-${uid})`}
          stroke={bodyColor}
          strokeWidth="1"
        />
        {/* Belly — lighter patch */}
        <ellipse cx="100" cy="155" rx="22" ry="28" fill={bodyLight} opacity="0.5" />

        {/* Front paws */}
        <ellipse cx="82" cy="185" rx="12" ry="8" fill={`url(#cat-body-${uid})`} stroke={bodyColor} strokeWidth="0.8" />
        <ellipse cx="118" cy="185" rx="12" ry="8" fill={`url(#cat-body-${uid})`} stroke={bodyColor} strokeWidth="0.8" />
        {/* Paw toe lines */}
        <line x1="78" y1="183" x2="78" y2="188" stroke={bodyColor} strokeWidth="0.8" strokeLinecap="round" />
        <line x1="82" y1="184" x2="82" y2="189" stroke={bodyColor} strokeWidth="0.8" strokeLinecap="round" />
        <line x1="86" y1="183" x2="86" y2="188" stroke={bodyColor} strokeWidth="0.8" strokeLinecap="round" />
        <line x1="114" y1="183" x2="114" y2="188" stroke={bodyColor} strokeWidth="0.8" strokeLinecap="round" />
        <line x1="118" y1="184" x2="118" y2="189" stroke={bodyColor} strokeWidth="0.8" strokeLinecap="round" />
        <line x1="122" y1="183" x2="122" y2="188" stroke={bodyColor} strokeWidth="0.8" strokeLinecap="round" />
      </g>

      {/* ===== HEAD ===== */}
      <g className={`cat-head-${uid}`}>
        {/* Ears */}
        <g className={`cat-ear-l-${uid}`}>
          <path d="M 62 55 C 55 38, 58 30, 68 32 C 75 38, 80 48, 78 58 Z"
            fill={`url(#cat-head-${uid})`} stroke={bodyColor} strokeWidth="0.8" />
          <path d="M 65 48 C 62 40, 64 35, 69 37 C 73 42, 75 48, 73 52 Z"
            fill={innerEar} opacity="0.6" />
        </g>
        <g className={`cat-ear-r-${uid}`}>
          <path d="M 138 55 C 145 38, 142 30, 132 32 C 125 38, 120 48, 122 58 Z"
            fill={`url(#cat-head-${uid})`} stroke={bodyColor} strokeWidth="0.8" />
          <path d="M 135 48 C 138 40, 136 35, 131 37 C 127 42, 125 48, 127 52 Z"
            fill={innerEar} opacity="0.6" />
        </g>

        {/* Head shape — round, cute */}
        <ellipse cx="100" cy="80" rx="38" ry="35" fill={`url(#cat-head-${uid})`} stroke={bodyColor} strokeWidth="1" />

        {/* Eyes — simple curved happy eyes (^^ style) or round with pupils */}
        <g className={`cat-blink-${uid}`} style={{ transformOrigin: "85px 78px" }}>
          <ellipse cx="85" cy="78" rx="6" ry="7" fill="white" />
          <ellipse cx="85" cy="79" rx="4" ry="5" fill={eyeColor} />
          <circle cx="83" cy="76" r="1.5" fill="white" />
        </g>
        <g className={`cat-blink-${uid}`} style={{ transformOrigin: "115px 78px" }}>
          <ellipse cx="115" cy="78" rx="6" ry="7" fill="white" />
          <ellipse cx="115" cy="79" rx="4" ry="5" fill={eyeColor} />
          <circle cx="113" cy="76" r="1.5" fill="white" />
        </g>

        {/* Nose — small triangle */}
        <path d="M 97 88 L 103 88 L 100 92 Z" fill={noseColor} />

        {/* Mouth — cute w shape */}
        <path d="M 100 92 Q 96 96, 93 94 M 100 92 Q 104 96, 107 94"
          stroke={eyeColor} strokeWidth="1.2" strokeLinecap="round" fill="none" />

        {/* Whiskers */}
        <path d="M 72 85 C 65 84, 58 85, 54 87" stroke={whiskerColor} strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M 72 89 C 65 90, 58 92, 54 95" stroke={whiskerColor} strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M 128 85 C 135 84, 142 85, 146 87" stroke={whiskerColor} strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M 128 89 C 135 90, 142 92, 146 95" stroke={whiskerColor} strokeWidth="0.8" fill="none" strokeLinecap="round" />

        {/* Cheek blush */}
        <ellipse cx="75" cy="88" rx="6" ry="4" fill={innerEar} opacity="0.25" />
        <ellipse cx="125" cy="88" rx="6" ry="4" fill={innerEar} opacity="0.25" />
      </g>
    </svg>
  );
}
