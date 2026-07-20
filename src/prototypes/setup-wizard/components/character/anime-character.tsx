"use client";

import { useId } from "react";
import type { CharacterConfig, AnimationState } from "./types";

interface AnimeCharacterProps {
  config: CharacterConfig;
  size?: number;
  animation?: AnimationState;
  className?: string;
}

/**
 * AnimeCharacter — a clean, minimal chibi anime girl.
 *
 * Inspired by the reference images: chibi proportions (big head, small body),
 * smooth rounded shapes, large glossy eyes, soft pastel colors, animal ears.
 *
 * Animations: idle (breathing), walking (legs move), jumping (bounce up),
 * waving (arm raises).
 *
 * The character is built with smooth bezier curves — NOT random shapes
 * stitched together. Every element is carefully positioned for a cute,
 * appealing look.
 */
export function AnimeCharacter({
  config,
  size = 200,
  animation = "idle",
  className,
}: AnimeCharacterProps) {
  const uid = useId().replace(/:/g, "");
  const { hairColor, eyeColor, outfitColor, accentColor, earType } = config;

  // Derived colors
  const hairDark = shadeColor(hairColor, -25);
  const hairLight = shadeColor(hairColor, 20);
  const outfitDark = shadeColor(outfitColor, -20);
  const skinColor = "#ffe5d3";
  const skinShadow = "#f5d0b8";
  const cheekColor = accentColor;
  const eyeDark = shadeColor(eyeColor, -30);
  const eyeLight = shadeColor(eyeColor, 40);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id={`eye-${uid}`} cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor={eyeLight} />
          <stop offset="50%" stopColor={eyeColor} />
          <stop offset="100%" stopColor={eyeDark} />
        </radialGradient>
        <linearGradient id={`hair-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={hairLight} />
          <stop offset="60%" stopColor={hairColor} />
          <stop offset="100%" stopColor={hairDark} />
        </linearGradient>
        <linearGradient id={`outfit-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={outfitColor} />
          <stop offset="100%" stopColor={outfitDark} />
        </linearGradient>
        <linearGradient id={`skin-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={skinColor} />
          <stop offset="100%" stopColor={skinShadow} />
        </linearGradient>
      </defs>

      <style>{`
        .char-root-${uid} {
          transform-origin: 100px 180px;
          animation: char-${uid}-idle 3s ease-in-out infinite;
        }
        .char-${uid}-idle {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(-2px) scaleY(0.99); }
        }
        .char-${uid}-walk {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-1px) rotate(-1deg); }
          75% { transform: translateY(-1px) rotate(1deg); }
        }
        .char-${uid}-jump {
          0%, 100% { transform: translateY(0) scaleY(1); }
          30% { transform: translateY(0) scaleY(0.9); }
          50% { transform: translateY(-20px) scaleY(1.05); }
          70% { transform: translateY(0) scaleY(0.95); }
        }
        .char-${uid}-wave-arm {
          transform-origin: 145px 110px;
          animation: char-${uid}-wave 1.2s ease-in-out infinite;
        }
        .char-${uid}-wave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-30deg); }
        }
        .char-${uid}-walk-leg-left {
          transform-origin: 88px 150px;
          animation: char-${uid}-leg-l 0.6s ease-in-out infinite;
        }
        .char-${uid}-walk-leg-right {
          transform-origin: 112px 150px;
          animation: char-${uid}-leg-r 0.6s ease-in-out infinite;
        }
        .char-${uid}-leg-l {
          0%, 100% { transform: rotate(-12deg); }
          50% { transform: rotate(12deg); }
        }
        .char-${uid}-leg-r {
          0%, 100% { transform: rotate(12deg); }
          50% { transform: rotate(-12deg); }
        }
        .char-${uid}-blink {
          animation: char-${uid}-blink-anim 4s ease-in-out infinite;
        }
        .char-${uid}-blink-anim {
          0%, 92%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        .char-${uid}-hair-sway {
          transform-origin: 100px 50px;
          animation: char-${uid}-sway 4s ease-in-out infinite;
        }
        .char-${uid}-sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(1.5deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .char-root-${uid}, .char-${uid}-wave-arm, .char-${uid}-walk-leg-left,
          .char-${uid}-walk-leg-right, .char-${uid}-blink, .char-${uid}-hair-sway {
            animation: none !important;
          }
        }
      `}</style>

      <g className={`char-root-${uid}`} style={{
        animation: animation === "idle" ? `char-${uid}-idle 3s ease-in-out infinite` :
                   animation === "walking" ? `char-${uid}-walk 0.6s ease-in-out infinite` :
                   animation === "jumping" ? `char-${uid}-jump 0.8s ease-in-out infinite` :
                   `char-${uid}-idle 3s ease-in-out infinite`
      }}>

        {/* ===== BACK HAIR (behind body) ===== */}
        <g className={`char-${uid}-hair-sway`}>
          {/* Back hair mass — flowing curves behind the head */}
          <path
            d="M 62 55 Q 50 80 52 120 Q 54 150 60 165 Q 65 150 62 130 Q 60 100 65 75 Q 70 55 80 48 Q 90 42 100 42 Q 110 42 120 48 Q 130 55 135 75 Q 140 100 138 130 Q 135 150 140 165 Q 146 150 148 120 Q 150 80 138 55 Q 125 38 100 36 Q 75 38 62 55 Z"
            fill={`url(#hair-${uid})`}
          />
          {/* Long side strands */}
          <path d="M 58 90 Q 50 110 48 135 Q 47 150 52 155 Q 55 145 56 125 Q 57 105 62 90 Z" fill={`url(#hair-${uid})`} />
          <path d="M 142 90 Q 150 110 152 135 Q 153 150 148 155 Q 145 145 144 125 Q 143 105 138 90 Z" fill={`url(#hair-${uid})`} />
        </g>

        {/* ===== BODY (torso + outfit) ===== */}
        {/* Outfit/dress — A-line shape */}
        <path
          d="M 78 108 Q 72 115 68 140 Q 64 160 62 175 Q 80 170 100 170 Q 120 170 138 175 Q 136 160 132 140 Q 128 115 122 108 Q 110 104 100 104 Q 90 104 78 108 Z"
          fill={`url(#outfit-${uid})`}
        />
        {/* Outfit collar/accent */}
        <path
          d="M 82 106 Q 90 112 100 112 Q 110 112 118 106 Q 114 116 110 118 Q 100 120 90 118 Q 86 116 82 106 Z"
          fill={accentColor}
          opacity="0.7"
        />
        {/* Outfit bow at neck */}
        <g>
          <ellipse cx="93" cy="110" rx="6" ry="4" fill={accentColor} />
          <ellipse cx="107" cy="110" rx="6" ry="4" fill={accentColor} />
          <circle cx="100" cy="110" r="3" fill={shadeColor(accentColor, -20)} />
        </g>

        {/* ===== LEGS ===== */}
        {animation === "walking" ? (
          <>
            <g className={`char-${uid}-walk-leg-left`}>
              <path d="M 88 148 Q 84 160 82 175 Q 84 178 88 178 Q 92 178 92 175 Q 92 160 92 148 Z" fill={`url(#skin-${uid})`} />
              <ellipse cx="87" cy="178" rx="7" ry="4" fill={outfitDark} />
            </g>
            <g className={`char-${uid}-walk-leg-right`}>
              <path d="M 108 148 Q 108 160 108 175 Q 112 178 116 178 Q 118 178 118 175 Q 116 160 112 148 Z" fill={`url(#skin-${uid})`} />
              <ellipse cx="113" cy="178" rx="7" ry="4" fill={outfitDark} />
            </g>
          </>
        ) : (
          <>
            {/* Standing legs */}
            <path d="M 88 148 Q 86 160 85 175 Q 87 178 91 178 Q 93 178 93 175 Q 92 160 92 148 Z" fill={`url(#skin-${uid})`} />
            <path d="M 108 148 Q 108 160 107 175 Q 109 178 113 178 Q 115 178 115 175 Q 114 160 112 148 Z" fill={`url(#skin-${uid})`} />
            <ellipse cx="89" cy="178" rx="7" ry="4" fill={outfitDark} />
            <ellipse cx="111" cy="178" rx="7" ry="4" fill={outfitDark} />
          </>
        )}

        {/* ===== ARMS ===== */}
        {/* Left arm (character's left = our right) */}
        <path
          d="M 122 112 Q 130 118 135 128 Q 138 135 136 142 Q 133 138 128 132 Q 124 126 120 120 Z"
          fill={`url(#skin-${uid})`}
        />
        {/* Right arm (character's right = our left) */}
        {animation === "waving" ? (
          <g className={`char-${uid}-wave-arm`}>
            <path
              d="M 78 112 Q 68 105 62 92 Q 58 82 60 76 Q 64 80 70 88 Q 76 98 80 106 Z"
              fill={`url(#skin-${uid})`}
            />
            {/* Hand */}
            <circle cx="60" cy="76" r="7" fill={skinColor} />
            {/* Fingers hint */}
            <path d="M 56 72 Q 54 68 56 66 M 60 70 Q 60 66 62 65 M 64 73 Q 66 70 65 67" stroke={skinShadow} strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </g>
        ) : (
          <path
            d="M 78 112 Q 70 118 65 128 Q 62 135 64 142 Q 67 138 72 132 Q 76 126 80 120 Z"
            fill={`url(#skin-${uid})`}
          />
        )}

        {/* ===== HEAD ===== */}
        {/* Face shape — soft oval */}
        <ellipse cx="100" cy="70" rx="32" ry="35" fill={`url(#skin-${uid})`} />

        {/* ===== ANIMAL EARS ===== */}
        {earType === "cat" && (
          <g className={`char-${uid}-hair-sway`}>
            {/* Left cat ear */}
            <path d="M 74 42 Q 68 28 72 25 Q 78 30 82 40 Z" fill={`url(#hair-${uid})`} />
            <path d="M 76 38 Q 74 32 77 30 Q 80 34 80 38 Z" fill={accentColor} opacity="0.6" />
            {/* Right cat ear */}
            <path d="M 126 42 Q 132 28 128 25 Q 122 30 118 40 Z" fill={`url(#hair-${uid})`} />
            <path d="M 124 38 Q 126 32 123 30 Q 120 34 120 38 Z" fill={accentColor} opacity="0.6" />
          </g>
        )}
        {earType === "bunny" && (
          <g className={`char-${uid}-hair-sway`}>
            {/* Left bunny ear */}
            <ellipse cx="78" cy="28" rx="7" ry="18" fill={`url(#hair-${uid})`} />
            <ellipse cx="78" cy="30" rx="4" ry="13" fill={accentColor} opacity="0.5" />
            {/* Right bunny ear */}
            <ellipse cx="122" cy="28" rx="7" ry="18" fill={`url(#hair-${uid})`} />
            <ellipse cx="122" cy="30" rx="4" ry="13" fill={accentColor} opacity="0.5" />
          </g>
        )}
        {earType === "fox" && (
          <g className={`char-${uid}-hair-sway`}>
            {/* Left fox ear */}
            <path d="M 72 44 Q 62 22 68 20 Q 78 28 84 40 Z" fill={`url(#hair-${uid})`} />
            <path d="M 74 40 Q 70 28 74 26 Q 80 32 82 38 Z" fill={accentColor} opacity="0.5" />
            {/* Right fox ear */}
            <path d="M 128 44 Q 138 22 132 20 Q 122 28 116 40 Z" fill={`url(#hair-${uid})`} />
            <path d="M 126 40 Q 130 28 126 26 Q 120 32 118 38 Z" fill={accentColor} opacity="0.5" />
          </g>
        )}

        {/* ===== FRONT HAIR (bangs + side strands) ===== */}
        <g className={`char-${uid}-hair-sway`}>
          {/* Bangs — curved fringe across forehead */}
          <path
            d="M 68 58 Q 70 42 85 38 Q 95 35 100 36 Q 105 35 115 38 Q 130 42 132 58 Q 128 52 120 50 Q 112 48 108 52 Q 104 48 100 48 Q 96 48 92 52 Q 88 48 80 50 Q 72 52 68 58 Z"
            fill={`url(#hair-${uid})`}
          />
          {/* Side hair strands framing face */}
          <path d="M 68 58 Q 62 75 64 95 Q 66 90 68 80 Q 70 68 72 60 Z" fill={`url(#hair-${uid})`} />
          <path d="M 132 58 Q 138 75 136 95 Q 134 90 132 80 Q 130 68 128 60 Z" fill={`url(#hair-${uid})`} />
          {/* Hair highlight strand */}
          <path d="M 88 42 Q 95 38 105 40 Q 100 44 95 44 Q 90 44 88 42 Z" fill={hairLight} opacity="0.6" />
        </g>

        {/* ===== FACE FEATURES ===== */}
        {/* Cheeks (blush) */}
        <ellipse cx="80" cy="78" rx="7" ry="4" fill={cheekColor} opacity="0.35" />
        <ellipse cx="120" cy="78" rx="7" ry="4" fill={cheekColor} opacity="0.35" />

        {/* Eyes — large, glossy, expressive */}
        <g className={`char-${uid}-blink`} style={{ transformOrigin: "85px 70px" }}>
          {/* Left eye (character's right) */}
          <ellipse cx="85" cy="70" rx="8" ry="10" fill="white" />
          <ellipse cx="85" cy="71" rx="7" ry="9" fill={`url(#eye-${uid})`} />
          <ellipse cx="85" cy="73" rx="3" ry="4" fill={eyeDark} opacity="0.5" />
          <ellipse cx="85" cy="72" rx="2.5" ry="3" fill="#1a1a2e" />
          <circle cx="83" cy="68" r="2.5" fill="white" />
          <circle cx="87" cy="73" r="1.5" fill="white" opacity="0.7" />
          {/* Upper lash */}
          <path d="M 77 63 Q 85 60 93 63 Q 91 62 93 61" stroke="#2d2d3f" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 77 63 Q 76 61 75 60" stroke="#2d2d3f" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </g>
        <g className={`char-${uid}-blink`} style={{ transformOrigin: "115px 70px" }}>
          {/* Right eye (character's left) */}
          <ellipse cx="115" cy="70" rx="8" ry="10" fill="white" />
          <ellipse cx="115" cy="71" rx="7" ry="9" fill={`url(#eye-${uid})`} />
          <ellipse cx="115" cy="73" rx="3" ry="4" fill={eyeDark} opacity="0.5" />
          <ellipse cx="115" cy="72" rx="2.5" ry="3" fill="#1a1a2e" />
          <circle cx="113" cy="68" r="2.5" fill="white" />
          <circle cx="117" cy="73" r="1.5" fill="white" opacity="0.7" />
          {/* Upper lash */}
          <path d="M 107 63 Q 115 60 123 63 Q 121 62 123 61" stroke="#2d2d3f" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 123 63 Q 124 61 125 60" stroke="#2d2d3f" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </g>

        {/* Nose — tiny dot */}
        <ellipse cx="100" cy="80" rx="1.2" ry="0.8" fill={skinShadow} />

        {/* Mouth — small smile */}
        {animation === "waving" || animation === "jumping" ? (
          /* Open happy mouth */
          <path d="M 95 85 Q 100 92 105 85 Q 100 88 95 85 Z" fill="#ff8a80" />
        ) : (
          /* Gentle smile */
          <path d="M 96 84 Q 100 88 104 84" stroke="#cc8899" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        )}

        {/* Neck */}
        <path d="M 92 98 Q 92 104 90 108 L 110 108 Q 108 104 108 98 Z" fill={`url(#skin-${uid})`} />
      </g>
    </svg>
  );
}

/** Darken or lighten a hex color by a percentage (-100 to 100). */
function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + Math.round(2.55 * percent)));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + Math.round(2.55 * percent)));
  const b = Math.max(0, Math.min(255, (num & 0xff) + Math.round(2.55 * percent)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
