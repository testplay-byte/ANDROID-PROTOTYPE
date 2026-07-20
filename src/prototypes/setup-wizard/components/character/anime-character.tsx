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
 * AnimeCharacter — a high-quality chibi anime girl.
 *
 * Based on VLM analysis of AI-generated reference + user-provided references.
 * Key design principles:
 * - Chibi proportions: head is 1/3 of total height
 * - Eyes are 1/3 of face width, almond-shaped, with iris gradient + pupil + 2 highlights + lashes
 * - Hair: smooth flowing curves with multiple strands, gradient, volume
 * - Clothing: dress with Peter Pan collar, bow, skirt folds
 * - Clean thin outlines (1px), smooth gradients, subtle shading
 * - Symmetrical design
 *
 * Animations: idle (breathing), walking (legs), jumping (bounce), waving (arm)
 */
export function AnimeCharacter({
  config,
  size = 200,
  animation = "idle",
  className,
}: AnimeCharacterProps) {
  const uid = useId().replace(/[:]/g, "");
  const { hairColor, eyeColor, outfitColor, accentColor, earType } = config;

  // Derived colors
  const hairDark = shade(hairColor, -25);
  const hairLight = shade(hairColor, 25);
  const hairMid = shade(hairColor, -10);
  const outfitDark = shade(outfitColor, -20);
  const outfitLight = shade(outfitColor, 15);
  const accentDark = shade(accentColor, -20);
  const skin = "#ffe5d3";
  const skinShadow = "#f5d0b8";
  const skinDark = "#e8c5a8";
  const eyeDark = shade(eyeColor, -35);
  const eyeLight = shade(eyeColor, 45);
  const cheekColor = "#ffb3c1";
  const outlineColor = "#3a3a4a";
  const lashColor = "#2a2a3a";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id={`eye-grad-${uid}`} cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor={eyeLight} />
          <stop offset="40%" stopColor={eyeColor} />
          <stop offset="100%" stopColor={eyeDark} />
        </radialGradient>
        <linearGradient id={`hair-grad-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={hairLight} />
          <stop offset="50%" stopColor={hairColor} />
          <stop offset="100%" stopColor={hairDark} />
        </linearGradient>
        <linearGradient id={`hair-side-grad-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={hairColor} />
          <stop offset="100%" stopColor={hairDark} />
        </linearGradient>
        <linearGradient id={`outfit-grad-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={outfitLight} />
          <stop offset="60%" stopColor={outfitColor} />
          <stop offset="100%" stopColor={outfitDark} />
        </linearGradient>
        <linearGradient id={`skin-grad-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={skin} />
          <stop offset="100%" stopColor={skinShadow} />
        </linearGradient>
        <linearGradient id={`bow-grad-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={accentColor} />
          <stop offset="100%" stopColor={accentDark} />
        </linearGradient>
      </defs>

      <style>{`
        .root-${uid} {
          transform-origin: 100px 190px;
          animation: ${animation === "idle" ? `idle-${uid} 3.5s ease-in-out infinite` :
                      animation === "walking" ? `walk-${uid} 0.5s ease-in-out infinite` :
                      animation === "jumping" ? `jump-${uid} 0.9s ease-in-out infinite` :
                      `idle-${uid} 3.5s ease-in-out infinite`};
        }
        @keyframes idle-${uid} {
          0%, 100% { transform: translateY(0px) scale(1, 1); }
          50% { transform: translateY(-2px) scale(1.005, 0.995); }
        }
        @keyframes walk-${uid} {
          0%, 100% { transform: translateY(0px) rotate(-1.5deg); }
          50% { transform: translateY(-1px) rotate(1.5deg); }
        }
        @keyframes jump-${uid} {
          0%, 100% { transform: translateY(0px) scale(1, 1); }
          20% { transform: translateY(0px) scale(1.06, 0.92); }
          45% { transform: translateY(-25px) scale(0.96, 1.06); }
          65% { transform: translateY(-25px) scale(0.96, 1.06); }
          85% { transform: translateY(0px) scale(1.04, 0.95); }
        }
        .wave-arm-${uid} {
          transform-origin: 75px 118px;
          animation: wave-${uid} 1.3s ease-in-out infinite;
        }
        @keyframes wave-${uid} {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-35deg); }
        }
        .walk-leg-l-${uid} {
          transform-origin: 88px 155px;
          animation: legl-${uid} 0.5s ease-in-out infinite;
        }
        .walk-leg-r-${uid} {
          transform-origin: 112px 155px;
          animation: legr-${uid} 0.5s ease-in-out infinite;
        }
        @keyframes legl-${uid} {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(15deg); }
        }
        @keyframes legr-${uid} {
          0%, 100% { transform: rotate(15deg); }
          50% { transform: rotate(-15deg); }
        }
        .blink-${uid} {
          transform-origin: center;
          animation: blink-${uid}-a 4.5s ease-in-out infinite;
        }
        @keyframes blink-${uid}-a {
          0%, 90%, 100% { transform: scaleY(1); }
          94% { transform: scaleY(0.08); }
        }
        .hair-sway-${uid} {
          transform-origin: 100px 55px;
          animation: sway-${uid} 4s ease-in-out infinite;
        }
        @keyframes sway-${uid} {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(1deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .root-${uid}, .wave-arm-${uid}, .walk-leg-l-${uid},
          .walk-leg-r-${uid}, .blink-${uid}, .hair-sway-${uid} {
            animation: none !important;
          }
        }
      `}</style>

      <g className={`root-${uid}`}>
        {/* ========== BACK HAIR (behind everything) ========== */}
        <g className={`hair-sway-${uid}`}>
          {/* Large back hair mass — flowing, voluminous */}
          <path
            d="M 58 60 C 48 80, 46 110, 50 140 C 52 155, 55 168, 58 175
               C 62 170, 60 155, 60 135 C 60 110, 62 85, 68 68
               C 75 52, 86 44, 100 42 C 114 44, 125 52, 132 68
               C 138 85, 140 110, 140 135 C 140 155, 138 170, 142 175
               C 145 168, 148 155, 150 140 C 154 110, 152 80, 142 60
               C 130 38, 115 32, 100 30 C 85 32, 70 38, 58 60 Z"
            fill={`url(#hair-grad-${uid})`}
            stroke={hairDark}
            strokeWidth="0.8"
          />
          {/* Long flowing side strands - left */}
          <path
            d="M 55 85 C 48 100, 44 120, 42 140 C 41 152, 43 162, 47 168
               C 49 160, 50 145, 52 125 C 54 108, 57 92, 60 85 Z"
            fill={`url(#hair-side-grad-${uid})`}
            stroke={hairDark}
            strokeWidth="0.6"
          />
          {/* Long flowing side strands - right */}
          <path
            d="M 145 85 C 152 100, 156 120, 158 140 C 159 152, 157 162, 153 168
               C 151 160, 150 145, 148 125 C 146 108, 143 92, 140 85 Z"
            fill={`url(#hair-side-grad-${uid})`}
            stroke={hairDark}
            strokeWidth="0.6"
          />
          {/* Hair shine highlight on top */}
          <path
            d="M 82 42 C 90 38, 100 37, 110 39 C 105 42, 100 43, 95 43 C 88 43, 84 43, 82 42 Z"
            fill={hairLight}
            opacity="0.7"
          />
        </g>

        {/* ========== BODY (torso + outfit) ========== */}
        {/* Neck */}
        <path
          d="M 93 95 C 93 100, 91 106, 89 110 L 111 110 C 109 106, 107 100, 107 95 Z"
          fill={`url(#skin-grad-${uid})`}
          stroke={skinDark}
          strokeWidth="0.5"
        />

        {/* Dress bodice (top part) */}
        <path
          d="M 80 108 C 76 112, 72 122, 70 135 C 68 145, 66 155, 65 162
               L 135 162 C 134 155, 132 145, 130 135 C 128 122, 124 112, 120 108
               C 115 105, 108 104, 100 104 C 92 104, 85 105, 80 108 Z"
          fill={`url(#outfit-grad-${uid})`}
          stroke={outfitDark}
          strokeWidth="0.8"
        />

        {/* Peter Pan collar */}
        <path
          d="M 86 108 C 90 113, 95 115, 100 115 C 105 115, 110 113, 114 108
               C 112 112, 108 114, 100 114 C 92 114, 88 112, 86 108 Z"
          fill="white"
          stroke={outfitDark}
          strokeWidth="0.6"
        />

        {/* Bow at collar */}
        <g>
          {/* Left bow loop */}
          <path
            d="M 92 110 C 86 106, 82 108, 83 112 C 84 116, 89 116, 93 113 Z"
            fill={`url(#bow-grad-${uid})`}
            stroke={accentDark}
            strokeWidth="0.5"
          />
          {/* Right bow loop */}
          <path
            d="M 108 110 C 114 106, 118 108, 117 112 C 116 116, 111 116, 107 113 Z"
            fill={`url(#bow-grad-${uid})`}
            stroke={accentDark}
            strokeWidth="0.5"
          />
          {/* Bow center knot */}
          <ellipse cx="100" cy="111" rx="3.5" ry="4" fill={accentDark} />
        </g>

        {/* Skirt — A-line with folds */}
        <path
          d="M 65 162 C 62 168, 58 178, 55 190 L 145 190 C 142 178, 138 168, 135 162 Z"
          fill={`url(#outfit-grad-${uid})`}
          stroke={outfitDark}
          strokeWidth="0.8"
        />
        {/* Skirt fold lines */}
        <path d="M 78 164 C 76 175, 74 185, 72 190" stroke={outfitDark} strokeWidth="0.6" fill="none" opacity="0.4" />
        <path d="M 100 164 C 100 175, 100 185, 100 190" stroke={outfitDark} strokeWidth="0.6" fill="none" opacity="0.4" />
        <path d="M 122 164 C 124 175, 126 185, 128 190" stroke={outfitDark} strokeWidth="0.6" fill="none" opacity="0.4" />
        {/* Skirt hem accent line */}
        <path d="M 55 190 L 145 190" stroke={accentColor} strokeWidth="1.5" opacity="0.5" />

        {/* ========== LEGS ========== */}
        {animation === "walking" ? (
          <>
            <g className={`walk-leg-l-${uid}`}>
              <path d="M 88 155 C 86 165, 84 178, 83 188 C 85 190, 89 190, 91 188 C 91 178, 90 165, 90 155 Z"
                fill={`url(#skin-grad-${uid})`} stroke={skinDark} strokeWidth="0.5" />
              <ellipse cx="87" cy="189" rx="6" ry="3" fill={outfitDark} />
            </g>
            <g className={`walk-leg-r-${uid}`}>
              <path d="M 110 155 C 110 165, 109 178, 108 188 C 110 190, 114 190, 116 188 C 115 178, 113 165, 112 155 Z"
                fill={`url(#skin-grad-${uid})`} stroke={skinDark} strokeWidth="0.5" />
              <ellipse cx="113" cy="189" rx="6" ry="3" fill={outfitDark} />
            </g>
          </>
        ) : (
          <>
            <path d="M 88 155 C 86 165, 84 178, 83 188 C 85 190, 89 190, 91 188 C 91 178, 90 165, 90 155 Z"
              fill={`url(#skin-grad-${uid})`} stroke={skinDark} strokeWidth="0.5" />
            <path d="M 110 155 C 110 165, 109 178, 108 188 C 110 190, 114 190, 116 188 C 115 178, 113 165, 112 155 Z"
              fill={`url(#skin-grad-${uid})`} stroke={skinDark} strokeWidth="0.5" />
            <ellipse cx="87" cy="189" rx="6" ry="3" fill={outfitDark} />
            <ellipse cx="113" cy="189" rx="6" ry="3" fill={outfitDark} />
          </>
        )}

        {/* ========== ARMS ========== */}
        {/* Left arm (character's right, our left) */}
        {animation === "waving" ? (
          <g className={`wave-arm-${uid}`}>
            <path
              d="M 78 112 C 70 108, 62 100, 56 88 C 54 82, 54 76, 57 72
               C 59 78, 63 84, 68 90 C 73 96, 77 102, 80 108 Z"
              fill={`url(#skin-grad-${uid})`}
              stroke={skinDark}
              strokeWidth="0.5"
            />
            {/* Hand */}
            <circle cx="56" cy="72" r="7" fill={skin} stroke={skinDark} strokeWidth="0.5" />
            {/* Finger details */}
            <path d="M 51 68 C 49 65, 50 62, 52 61" stroke={skinDark} strokeWidth="0.8" fill="none" strokeLinecap="round" />
            <path d="M 55 66 C 54 63, 55 60, 57 59" stroke={skinDark} strokeWidth="0.8" fill="none" strokeLinecap="round" />
            <path d="M 59 67 C 59 64, 60 61, 62 61" stroke={skinDark} strokeWidth="0.8" fill="none" strokeLinecap="round" />
            {/* Sleeve cuff */}
            <path d="M 76 108 C 74 106, 72 106, 71 108 C 72 110, 74 111, 76 110 Z" fill={accentColor} opacity="0.7" />
          </g>
        ) : (
          <path
            d="M 78 112 C 72 118, 66 128, 62 138 C 60 143, 61 148, 64 150
               C 66 145, 69 138, 73 130 C 76 124, 79 118, 80 114 Z"
            fill={`url(#skin-grad-${uid})`}
            stroke={skinDark}
            strokeWidth="0.5"
          />
        )}
        {/* Right arm (character's left, our right) */}
        <path
          d="M 122 112 C 128 118, 134 128, 138 138 C 140 143, 139 148, 136 150
             C 134 145, 131 138, 127 130 C 124 124, 121 118, 120 114 Z"
          fill={`url(#skin-grad-${uid})`}
          stroke={skinDark}
          strokeWidth="0.5"
        />
        {/* Sleeve cuffs */}
        <path d="M 77 112 C 79 114, 82 114, 83 112 C 82 110, 79 109, 77 110 Z" fill={accentColor} opacity="0.6" />
        <path d="M 123 112 C 121 114, 118 114, 117 112 C 118 110, 121 109, 123 110 Z" fill={accentColor} opacity="0.6" />

        {/* ========== HEAD ========== */}
        {/* Face shape — soft round with pointed chin */}
        <path
          d="M 72 60 C 70 48, 78 38, 90 35 C 95 34, 105 34, 110 35
             C 122 38, 130 48, 128 60 C 128 72, 125 82, 118 88
             C 112 93, 106 95, 100 95 C 94 95, 88 93, 82 88
             C 75 82, 72 72, 72 60 Z"
          fill={`url(#skin-grad-${uid})`}
          stroke={skinDark}
          strokeWidth="0.5"
        />

        {/* ========== ANIMAL EARS ========== */}
        <g className={`hair-sway-${uid}`}>
          {earType === "cat" && (
            <>
              {/* Left cat ear */}
              <path d="M 72 42 C 66 28, 68 22, 74 24 C 80 28, 84 36, 82 42 Z"
                fill={`url(#hair-grad-${uid})`} stroke={hairDark} strokeWidth="0.6" />
              <path d="M 74 38 C 72 30, 74 27, 77 28 C 80 32, 80 37, 79 39 Z"
                fill={accentColor} opacity="0.5" />
              {/* Right cat ear */}
              <path d="M 128 42 C 134 28, 132 22, 126 24 C 120 28, 116 36, 118 42 Z"
                fill={`url(#hair-grad-${uid})`} stroke={hairDark} strokeWidth="0.6" />
              <path d="M 126 38 C 128 30, 126 27, 123 28 C 120 32, 120 37, 121 39 Z"
                fill={accentColor} opacity="0.5" />
            </>
          )}
          {earType === "bunny" && (
            <>
              {/* Left bunny ear */}
              <ellipse cx="76" cy="24" rx="6" ry="18" fill={`url(#hair-grad-${uid})`} stroke={hairDark} strokeWidth="0.6" transform="rotate(-8 76 24)" />
              <ellipse cx="76" cy="26" rx="3.5" ry="13" fill={accentColor} opacity="0.45" transform="rotate(-8 76 26)" />
              {/* Right bunny ear */}
              <ellipse cx="124" cy="24" rx="6" ry="18" fill={`url(#hair-grad-${uid})`} stroke={hairDark} strokeWidth="0.6" transform="rotate(8 124 24)" />
              <ellipse cx="124" cy="26" rx="3.5" ry="13" fill={accentColor} opacity="0.45" transform="rotate(8 124 26)" />
            </>
          )}
          {earType === "fox" && (
            <>
              {/* Left fox ear */}
              <path d="M 70 44 C 60 22, 64 16, 72 20 C 80 26, 86 36, 84 44 Z"
                fill={`url(#hair-grad-${uid})`} stroke={hairDark} strokeWidth="0.6" />
              <path d="M 72 40 C 68 26, 72 22, 76 24 C 80 30, 82 37, 80 40 Z"
                fill={accentColor} opacity="0.45" />
              {/* Right fox ear */}
              <path d="M 130 44 C 140 22, 136 16, 128 20 C 120 26, 114 36, 116 44 Z"
                fill={`url(#hair-grad-${uid})`} stroke={hairDark} strokeWidth="0.6" />
              <path d="M 128 40 C 132 26, 128 22, 124 24 C 120 30, 118 37, 120 40 Z"
                fill={accentColor} opacity="0.45" />
            </>
          )}
        </g>

        {/* ========== FRONT HAIR (bangs + side strands) ========== */}
        <g className={`hair-sway-${uid}`}>
          {/* Bangs — curved fringe across forehead */}
          <path
            d="M 68 52 C 70 42, 80 36, 92 35 C 96 34, 100 34, 104 35
               C 116 36, 126 42, 128 52
               C 124 48, 118 46, 112 47 C 108 48, 105 50, 102 49
               C 98 49, 95 50, 92 49 C 88 48, 82 46, 76 48 C 72 49, 69 50, 68 52 Z"
            fill={`url(#hair-grad-${uid})`}
            stroke={hairDark}
            strokeWidth="0.6"
          />
          {/* Side strands framing face — left */}
          <path
            d="M 68 52 C 64 62, 62 75, 63 88 C 64 95, 66 98, 68 96
               C 67 88, 67 78, 69 68 C 70 60, 72 54, 72 52 Z"
            fill={`url(#hair-side-grad-${uid})`}
            stroke={hairDark}
            strokeWidth="0.5"
          />
          {/* Side strands framing face — right */}
          <path
            d="M 132 52 C 136 62, 138 75, 137 88 C 136 95, 134 98, 132 96
               C 133 88, 133 78, 131 68 C 130 60, 128 54, 128 52 Z"
            fill={`url(#hair-side-grad-${uid})`}
            stroke={hairDark}
            strokeWidth="0.5"
          />
          {/* Individual hair strands on bangs for detail */}
          <path d="M 78 48 C 80 52, 82 55, 82 50" stroke={hairDark} strokeWidth="0.5" fill="none" opacity="0.5" />
          <path d="M 88 46 C 89 51, 90 54, 91 50" stroke={hairDark} strokeWidth="0.5" fill="none" opacity="0.5" />
          <path d="M 100 46 C 100 51, 100 54, 101 50" stroke={hairDark} strokeWidth="0.5" fill="none" opacity="0.5" />
          <path d="M 110 47 C 109 51, 108 54, 109 50" stroke={hairDark} strokeWidth="0.5" fill="none" opacity="0.5" />
          <path d="M 120 49 C 118 52, 116 55, 117 51" stroke={hairDark} strokeWidth="0.5" fill="none" opacity="0.5" />
          {/* Hair highlight on bangs */}
          <path d="M 84 40 C 92 36, 102 36, 110 38 C 105 40, 100 41, 95 41 C 90 41, 86 41, 84 40 Z"
            fill={hairLight} opacity="0.5" />
        </g>

        {/* ========== FACE FEATURES ========== */}
        {/* Cheeks (blush) */}
        <ellipse cx="80" cy="72" rx="8" ry="5" fill={cheekColor} opacity="0.3" />
        <ellipse cx="120" cy="72" rx="8" ry="5" fill={cheekColor} opacity="0.3" />

        {/* === EYES === */}
        {/* Left eye (character's right) */}
        <g className={`blink-${uid}`} style={{ transformOrigin: "85px 66px" }}>
          {/* Sclera (white) */}
          <ellipse cx="85" cy="66" rx="9" ry="11" fill="white" stroke={lashColor} strokeWidth="0.8" />
          {/* Iris with gradient */}
          <ellipse cx="85" cy="67" rx="7.5" ry="9.5" fill={`url(#eye-grad-${uid})`} />
          {/* Dark outer iris ring */}
          <ellipse cx="85" cy="67" rx="7.5" ry="9.5" fill="none" stroke={eyeDark} strokeWidth="0.6" opacity="0.5" />
          {/* Pupil */}
          <ellipse cx="85" cy="68" rx="3" ry="4" fill="#1a1a2e" />
          {/* Large highlight (top-left) */}
          <ellipse cx="82" cy="63" rx="2.5" ry="3" fill="white" />
          {/* Small highlight (bottom-right) */}
          <circle cx="88" cy="71" r="1.2" fill="white" opacity="0.8" />
          {/* Sparkle dots */}
          <circle cx="87" cy="64" r="0.8" fill="white" opacity="0.6" />
          {/* Upper lash line — thick */}
          <path d="M 76 58 C 80 55, 85 54, 90 56 C 92 57, 93 58, 93 59"
            stroke={lashColor} strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Outer lash flick */}
          <path d="M 76 58 C 74 56, 73 54, 72 52" stroke={lashColor} strokeWidth="1.2" strokeLinecap="round" fill="none" />
          {/* Inner lash flick */}
          <path d="M 93 59 C 94 58, 95 57, 95 56" stroke={lashColor} strokeWidth="1" strokeLinecap="round" fill="none" />
          {/* Lower lash hint */}
          <path d="M 78 75 C 82 77, 88 77, 92 75" stroke={lashColor} strokeWidth="0.6" fill="none" opacity="0.4" />
        </g>

        {/* Right eye (character's left) */}
        <g className={`blink-${uid}`} style={{ transformOrigin: "115px 66px" }}>
          <ellipse cx="115" cy="66" rx="9" ry="11" fill="white" stroke={lashColor} strokeWidth="0.8" />
          <ellipse cx="115" cy="67" rx="7.5" ry="9.5" fill={`url(#eye-grad-${uid})`} />
          <ellipse cx="115" cy="67" rx="7.5" ry="9.5" fill="none" stroke={eyeDark} strokeWidth="0.6" opacity="0.5" />
          <ellipse cx="115" cy="68" rx="3" ry="4" fill="#1a1a2e" />
          <ellipse cx="112" cy="63" rx="2.5" ry="3" fill="white" />
          <circle cx="118" cy="71" r="1.2" fill="white" opacity="0.8" />
          <circle cx="117" cy="64" r="0.8" fill="white" opacity="0.6" />
          <path d="M 107 58 C 111 55, 115 54, 120 56 C 122 57, 123 58, 124 59"
            stroke={lashColor} strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 124 59 C 125 58, 126 57, 127 56" stroke={lashColor} strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M 107 58 C 106 57, 105 57, 104 56" stroke={lashColor} strokeWidth="1" strokeLinecap="round" fill="none" />
          <path d="M 108 75 C 112 77, 118 77, 122 75" stroke={lashColor} strokeWidth="0.6" fill="none" opacity="0.4" />
        </g>

        {/* Eyebrows — thin, expressive */}
        <path d="M 78 56 C 81 54, 85 54, 89 55" stroke={hairDark} strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M 111 55 C 115 54, 119 54, 122 56" stroke={hairDark} strokeWidth="1.2" strokeLinecap="round" fill="none" />

        {/* Nose — tiny, subtle */}
        <path d="M 99 78 C 99 79, 100 80, 101 79" stroke={skinDark} strokeWidth="0.8" strokeLinecap="round" fill="none" />

        {/* Mouth — expression dependent */}
        {animation === "waving" || animation === "jumping" ? (
          <>
            {/* Open happy smile */}
            <path d="M 94 83 C 96 88, 100 90, 104 88 C 106 87, 107 85, 106 83
                     C 102 85, 98 85, 94 83 Z" fill="#ff6b7a" />
            <path d="M 95 84 C 98 86, 102 86, 105 84" stroke="#e5556a" strokeWidth="0.5" fill="none" />
          </>
        ) : (
          <>
            {/* Gentle smile */}
            <path d="M 95 82 C 98 85, 102 85, 105 82"
              stroke="#cc7788" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Tiny lip highlight */}
            <path d="M 97 83 C 99 84, 101 84, 103 83" stroke="#ff9eab" strokeWidth="0.6" fill="none" opacity="0.5" />
          </>
        )}

        {/* Chin shadow — subtle */}
        <path d="M 92 90 C 95 93, 100 94, 105 93 C 102 92, 100 92, 98 92 C 95 92, 93 91, 92 90 Z"
          fill={skinShadow} opacity="0.3" />
      </g>
    </svg>
  );
}

/** Darken or lighten a hex color by a percentage (-100 to 100). */
function shade(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + Math.round(2.55 * percent)));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + Math.round(2.55 * percent)));
  const b = Math.max(0, Math.min(255, (num & 0xff) + Math.round(2.55 * percent)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
