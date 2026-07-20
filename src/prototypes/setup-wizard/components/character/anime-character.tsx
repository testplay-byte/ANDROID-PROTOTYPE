/* eslint-disable react/no-unknown-property */
/**
 * setup-wizard / components / character / anime-character
 *
 * High-quality flat-vector anime character SVG component for the setup-wizard
 * prototype. Designed to look like an actual anime girl — not abstract shapes.
 *
 * ## Visual design
 *
 *  - **Egg-shaped face** (wider at temples, narrower at chin) instead of a
 *    perfect circle — the classic anime head silhouette.
 *  - **Big layered eyes**: sclera → iris (with darker outer ring) → pupil →
 *    two white highlights (large top-left + small bottom-right) → thick
 *    upper lash arc → optional outer-corner lash flick + thin lower-lash
 *    hint. Iris is clipped to the sclera ellipse so the top is naturally
 *    cut by the upper lid — exactly how anime eyes are drawn.
 *  - **Flowing hair**: every hair style uses cubic-bezier (C) curves with
 *    multiple layered strands (back mass + side strands + center-parted
 *    bangs + face-framing tendrils). A vertical linear gradient gives a
 *    subtle top-light / bottom-shadow sheen.
 *  - **Kemonomimi**: animal ears on top of head + tail behind body when
 *    `earType` is `cat` / `fox` / `bunny` (regardless of artStyle).
 *  - **Blush**: two soft pink ellipses on the cheeks.
 *  - **Tiny nose** + **expression-shaped mouth**.
 *
 * ## Anatomy per art style
 *
 *  - **chibi**     — head ≈ ½ total height (huge head, tiny body, stubby
 *                    limbs, oversized eyes). Extra-cute proportions.
 *  - **slim**      — head ≈ ⅙ total height (tall, elegant, longer legs).
 *  - **kemonomimi**— identical proportions to slim, plus ears + tail.
 *
 * ## Animations (when `animated=true`)
 *
 *  - Whole character gently floats up/down (4s).
 *  - Back hair sways slightly (3.8s).
 *  - Eyes blink briefly every ~5s (scaleY squash).
 *  - `waving` expression: right arm rotates back and forth (1.4s).
 *  - `excited` expression: subtle bounce (0.7s).
 *
 * All keyframes live in a single `<style>` block inside the SVG. Element
 * IDs (clip-paths, gradients) are namespaced with `useId()` so multiple
 * characters can coexist on one page without collisions.
 */

import { useId } from "react";
import type {
  CharacterConfig,
  ArtStyle,
  HairStyle,
  EarType,
  Expression,
  OutfitStyle,
} from "./types";

/* ================================================================== */
/* Color helpers                                                       */
/* ================================================================== */

function clampByte(n: number): number {
  return Math.max(0, Math.min(255, n));
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "").trim();
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(v, 16);
  if (Number.isNaN(num)) return { r: 255, g: 255, b: 255 };
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
  const t = (n: number) => clampByte(Math.round(n)).toString(16).padStart(2, "0");
  return `#${t(r)}${t(g)}${t(b)}`;
}

/** Mix a hex color toward white by `amount` (0..1). */
function lighten(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({
    r: r + (255 - r) * amount,
    g: g + (255 - g) * amount,
    b: b + (255 - b) * amount,
  });
}

/** Mix a hex color toward black by `amount` (0..1). */
function darken(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({
    r: r * (1 - amount),
    g: g * (1 - amount),
    b: b * (1 - amount),
  });
}

/** Convert a hex color to an `rgba(...)` string with the given alpha. */
function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* ================================================================== */
/* Proportions per art style                                           */
/* ================================================================== */

interface Proportions {
  /** Head center X (always 100 — character is horizontally centered). */
  headCx: number;
  /** Head center Y. */
  headCy: number;
  /** Head horizontal radius. */
  headRx: number;
  /** Head vertical radius. */
  headRy: number;
  /** Chin Y (bottom of face). */
  chinY: number;
  /** Top of head (where hair starts). */
  headTop: number;
  /** Neck top Y. */
  neckTop: number;
  /** Neck bottom Y (where shoulders start). */
  neckBottom: number;
  /** Neck half-width. */
  neckHalf: number;
  /** Shoulder Y. */
  shoulderY: number;
  /** Shoulder half-width (distance from center to shoulder tip). */
  shoulderHalf: number;
  /** Waist Y (where skirt / top-hem sits). */
  waistY: number;
  /** Hip Y (where legs split). */
  hipY: number;
  /** Bottom Y of skirt / dress. */
  skirtBottom: number;
  /** Bottom Y of legs (feet). */
  legBottom: number;
  /** Eye center Y. */
  eyeY: number;
  /** Distance from head-center-X to one eye center. */
  eyeOffset: number;
  /** Sclera horizontal radius. */
  eyeRx: number;
  /** Sclera vertical radius. */
  eyeRy: number;
  /** Nose Y. */
  noseY: number;
  /** Mouth Y. */
  mouthY: number;
  /** Blush center X offset (from head center). */
  blushOffset: number;
  /** Blush center Y. */
  blushY: number;
  /** Blush horizontal radius. */
  blushRx: number;
  /** Blush vertical radius. */
  blushRy: number;
  /** Whether this is the chibi proportion set. */
  isChibi: boolean;
}

function getProportions(art: ArtStyle): Proportions {
  if (art === "chibi") {
    return {
      headCx: 100,
      headCy: 76,
      headRx: 44,
      headRy: 42,
      chinY: 118,
      headTop: 34,
      neckTop: 116,
      neckBottom: 128,
      neckHalf: 7,
      shoulderY: 130,
      shoulderHalf: 17,
      waistY: 168,
      hipY: 180,
      skirtBottom: 196,
      legBottom: 196,
      eyeY: 80,
      eyeOffset: 16,
      eyeRx: 8.5,
      eyeRy: 11,
      noseY: 98,
      mouthY: 106,
      blushOffset: 26,
      blushY: 92,
      blushRx: 7,
      blushRy: 4,
      isChibi: true,
    };
  }
  // slim + kemonomimi share the same proportions
  return {
    headCx: 100,
    headCy: 56,
    headRx: 22,
    headRy: 26,
    chinY: 82,
    headTop: 30,
    neckTop: 80,
    neckBottom: 92,
    neckHalf: 6,
    shoulderY: 94,
    shoulderHalf: 22,
    waistY: 138,
    hipY: 158,
    skirtBottom: 182,
    legBottom: 196,
    eyeY: 60,
    eyeOffset: 10,
    eyeRx: 5.4,
    eyeRy: 7.6,
    noseY: 70,
    mouthY: 75,
    blushOffset: 13,
    blushY: 68,
    blushRx: 4.6,
    blushRy: 2.8,
    isChibi: false,
  };
}

/* ================================================================== */
/* Derived palette                                                     */
/* ================================================================== */

interface DerivedColors {
  hair: string;
  hairLight: string;
  hairLighter: string;
  hairDark: string;
  hairStrand: string;
  skin: string;
  skinLight: string;
  skinShadow: string;
  iris: string;
  irisLight: string;
  irisDark: string;
  irisRing: string;
  pupil: string;
  lash: string;
  outfit: string;
  outfitLight: string;
  outfitDark: string;
  accent: string;
  accentLight: string;
  accentDark: string;
}

function deriveColors(config: CharacterConfig): DerivedColors {
  return {
    hair: config.hairColor,
    hairLight: lighten(config.hairColor, 0.32),
    hairLighter: lighten(config.hairColor, 0.55),
    hairDark: darken(config.hairColor, 0.22),
    hairStrand: lighten(config.hairColor, 0.45),
    skin: config.skinColor,
    skinLight: lighten(config.skinColor, 0.14),
    skinShadow: darken(config.skinColor, 0.14),
    iris: config.eyeColor,
    irisLight: lighten(config.eyeColor, 0.45),
    irisDark: darken(config.eyeColor, 0.28),
    irisRing: darken(config.eyeColor, 0.5),
    pupil: darken(config.eyeColor, 0.7),
    lash: darken(config.hairColor, 0.6),
    outfit: config.outfitColor,
    outfitLight: lighten(config.outfitColor, 0.22),
    outfitDark: darken(config.outfitColor, 0.2),
    accent: config.accentColor,
    accentLight: lighten(config.accentColor, 0.3),
    accentDark: darken(config.accentColor, 0.2),
  };
}

/* ================================================================== */
/* Layer props                                                         */
/* ================================================================== */

interface LayerProps {
  config: CharacterConfig;
  p: Proportions;
  c: DerivedColors;
  ids: {
    hairGrad: string;
    outfitGrad: string;
    eyeClipL: string;
    eyeClipR: string;
    irisGradL: string;
    irisGradR: string;
  };
  animated: boolean;
}

/* ================================================================== */
/* 1. HAIR — BACK                                                      */
/* ================================================================== */

/** Returns the JSX for back hair (behind body & head), per style. */
function HairBack({ config, p, c, ids, animated }: LayerProps) {
  const fill = `url(#${ids.hairGrad})`;
  const swayClass = animated ? "ac-hair-sway" : undefined;
  const isChibi = p.isChibi;

  // Common highlight strand lines drawn on top of back hair.
  const strands = (stroke: string, opacity = 0.6) => (
    <g stroke={stroke} strokeWidth={isChibi ? 2 : 1.4} fill="none" strokeLinecap="round" opacity={opacity}>
      <path d={`M ${p.headCx - p.headRx - 2} ${p.headCy + 10} Q ${p.headCx - p.headRx - 6} ${p.headCy + 40} ${p.headCx - p.headRx} ${p.headCy + 70}`} />
      <path d={`M ${p.headCx + p.headRx + 2} ${p.headCy + 10} Q ${p.headCx + p.headRx + 6} ${p.headCy + 40} ${p.headCx + p.headRx} ${p.headCy + 70}`} />
    </g>
  );

  if (config.hairStyle === "long_flow") {
    // Long hair flowing past shoulders, big symmetric shape behind body.
    const backPath = isChibi
      ? `M ${p.headCx - p.headRx - 6} ${p.headCy - 18}
         C ${p.headCx - p.headRx - 24} ${p.headCy - 10}, ${p.headCx - p.headRx - 30} ${p.headCy + 30}, ${p.headCx - p.headRx - 24} ${p.headCy + 80}
         C ${p.headCx - p.headRx - 18} ${p.chinY + 70}, ${p.headCx - p.headRx - 8} ${p.chinY + 78}, ${p.headCx - p.headRx + 4} ${p.chinY + 70}
         C ${p.headCx - p.headRx + 6} ${p.chinY + 40}, ${p.headCx - p.headRx + 4} ${p.chinY + 10}, ${p.headCx - 6} ${p.headCy - 6}
         C ${p.headCx - 4} ${p.headCy - 16}, ${p.headCx + 4} ${p.headCy - 16}, ${p.headCx + 6} ${p.headCy - 6}
         C ${p.headCx + p.headRx - 4} ${p.chinY + 10}, ${p.headCx + p.headRx - 6} ${p.chinY + 40}, ${p.headCx + p.headRx - 4} ${p.chinY + 70}
         C ${p.headCx + p.headRx + 8} ${p.chinY + 78}, ${p.headCx + p.headRx + 18} ${p.chinY + 70}, ${p.headCx + p.headRx + 24} ${p.headCy + 80}
         C ${p.headCx + p.headRx + 30} ${p.headCy + 30}, ${p.headCx + p.headRx + 24} ${p.headCy - 10}, ${p.headCx + p.headRx + 6} ${p.headCy - 18}
         C ${p.headCx + 18} ${p.headTop - 6}, ${p.headCx - 18} ${p.headTop - 6}, ${p.headCx - p.headRx - 6} ${p.headCy - 18}
         Z`
      : `M ${p.headCx - p.headRx + 4} ${p.headCy - 8}
         C ${p.headCx - p.headRx - 14} ${p.headCy - 4}, ${p.headCx - p.headRx - 22} ${p.headCy + 30}, ${p.headCx - p.headRx - 20} ${p.headCy + 80}
         C ${p.headCx - p.headRx - 14} ${p.chinY + 90}, ${p.headCx - p.headRx - 4} ${p.chinY + 100}, ${p.headCx - p.headRx + 6} ${p.chinY + 90}
         C ${p.headCx - p.headRx + 8} ${p.chinY + 60}, ${p.headCx - p.headRx + 6} ${p.chinY + 30}, ${p.headCx - 6} ${p.headCy + 6}
         C ${p.headCx - 4} ${p.headCy - 4}, ${p.headCx + 4} ${p.headCy - 4}, ${p.headCx + 6} ${p.headCy + 6}
         C ${p.headCx + p.headRx - 6} ${p.chinY + 30}, ${p.headCx + p.headRx - 8} ${p.chinY + 60}, ${p.headCx + p.headRx - 6} ${p.chinY + 90}
         C ${p.headCx + p.headRx + 4} ${p.chinY + 100}, ${p.headCx + p.headRx + 14} ${p.chinY + 90}, ${p.headCx + p.headRx + 20} ${p.headCy + 80}
         C ${p.headCx + p.headRx + 22} ${p.headCy + 30}, ${p.headCx + p.headRx + 14} ${p.headCy - 4}, ${p.headCx + p.headRx - 4} ${p.headCy - 8}
         C ${p.headCx + 14} ${p.headTop - 4}, ${p.headCx - 14} ${p.headTop - 4}, ${p.headCx - p.headRx + 4} ${p.headCy - 8}
         Z`;
    return (
      <g id="hair-back">
        <path className={swayClass} d={backPath} fill={fill} />
        {strands(c.hairLighter, 0.55)}
      </g>
    );
  }

  if (config.hairStyle === "twin_tails") {
    // Two side ponytails (left + right) — each is a tapered flowing shape.
    const tailPath = (side: "L" | "R") => {
      const s = side === "L" ? -1 : 1;
      const baseX = p.headCx + s * (p.headRx - 4);
      const tipX = p.headCx + s * (p.headRx + (isChibi ? 26 : 16));
      const outerX = p.headCx + s * (p.headRx + (isChibi ? 36 : 24));
      const topY = p.headCy - (isChibi ? 4 : 2);
      const bottomY = p.chinY + (isChibi ? 60 : 88);
      const midY = p.headCy + (isChibi ? 40 : 30);
      return `M ${baseX} ${topY}
        C ${p.headCx + s * (p.headRx + 6)} ${topY - 6}, ${outerX} ${topY + 14}, ${outerX} ${midY}
        C ${outerX} ${bottomY - 12}, ${tipX + s * 4} ${bottomY}, ${tipX} ${bottomY - 4}
        C ${tipX - s * 4} ${bottomY - 8}, ${tipX - s * 8} ${bottomY - 30}, ${tipX - s * 6} ${midY - 8}
        C ${tipX - s * 8} ${topY + 18}, ${baseX + s * 4} ${topY + 6}, ${baseX} ${topY}
        Z`;
    };
    // Tail-tie ribbons (small bow-ish shape at the base of each tail).
    const ribbon = (side: "L" | "R") => {
      const s = side === "L" ? -1 : 1;
      const x = p.headCx + s * (p.headRx + (isChibi ? 6 : 4));
      const y = p.headCy + (isChibi ? 2 : 4);
      const w = isChibi ? 9 : 6;
      const h = isChibi ? 5 : 3.5;
      return (
        <g>
          <ellipse cx={x} cy={y} rx={w} ry={h} fill={c.accent} />
          <ellipse cx={x - s * w} cy={y - 1} rx={w * 0.7} ry={h * 0.8} fill={c.accentLight} transform={`rotate(${s * -20} ${x - s * w} ${y - 1})`} />
          <ellipse cx={x + s * w} cy={y - 1} rx={w * 0.7} ry={h * 0.8} fill={c.accentLight} transform={`rotate(${s * 20} ${x + s * w} ${y - 1})`} />
        </g>
      );
    };
    // Small back mass behind the head (keeps the top of head covered).
    const backMass = isChibi
      ? `M ${p.headCx - p.headRx + 4} ${p.headCy - 18}
         C ${p.headCx - p.headRx - 12} ${p.headCy - 10}, ${p.headCx - p.headRx - 16} ${p.headCy + 20}, ${p.headCx - p.headRx - 8} ${p.headCy + 40}
         C ${p.headCx - 8} ${p.headCy + 30}, ${p.headCx + 8} ${p.headCy + 30}, ${p.headCx + p.headRx + 8} ${p.headCy + 40}
         C ${p.headCx + p.headRx + 16} ${p.headCy + 20}, ${p.headCx + p.headRx + 12} ${p.headCy - 10}, ${p.headCx + p.headRx - 4} ${p.headCy - 18}
         C ${p.headCx + 16} ${p.headTop - 4}, ${p.headCx - 16} ${p.headTop - 4}, ${p.headCx - p.headRx + 4} ${p.headCy - 18}
         Z`
      : `M ${p.headCx - p.headRx + 4} ${p.headCy - 8}
         C ${p.headCx - p.headRx - 10} ${p.headCy - 4}, ${p.headCx - p.headRx - 14} ${p.headCy + 16}, ${p.headCx - p.headRx - 6} ${p.headCy + 32}
         C ${p.headCx - 6} ${p.headCy + 24}, ${p.headCx + 6} ${p.headCy + 24}, ${p.headCx + p.headRx + 6} ${p.headCy + 32}
         C ${p.headCx + p.headRx + 14} ${p.headCy + 16}, ${p.headCx + p.headRx + 10} ${p.headCy - 4}, ${p.headCx + p.headRx - 4} ${p.headCy - 8}
         C ${p.headCx + 12} ${p.headTop - 4}, ${p.headCx - 12} ${p.headTop - 4}, ${p.headCx - p.headRx + 4} ${p.headCy - 8}
         Z`;
    return (
      <g id="hair-back">
        <path d={backMass} fill={fill} />
        <path className={swayClass} d={tailPath("L")} fill={fill} />
        <path className={swayClass} d={tailPath("R")} fill={fill} style={{ animationDelay: "0.4s" }} />
        {strands(c.hairLighter, 0.5)}
        {ribbon("L")}
        {ribbon("R")}
      </g>
    );
  }

  if (config.hairStyle === "short_bob") {
    // Short hair framing the face, ending around the jaw. The "back" is a
    // smaller cap that sits behind the head; the front layers do most of
    // the framing.
    const backPath = isChibi
      ? `M ${p.headCx - p.headRx + 2} ${p.headCy - 20}
         C ${p.headCx - p.headRx - 10} ${p.headCy - 14}, ${p.headCx - p.headRx - 12} ${p.headCy + 18}, ${p.headCx - p.headRx - 4} ${p.headCy + 36}
         C ${p.headCx - p.headRx + 4} ${p.headCy + 40}, ${p.headCx - 8} ${p.headCy + 32}, ${p.headCx - 4} ${p.headCy + 4}
         C ${p.headCx - 2} ${p.headCy - 10}, ${p.headCx + 2} ${p.headCy - 10}, ${p.headCx + 4} ${p.headCy + 4}
         C ${p.headCx + 8} ${p.headCy + 32}, ${p.headCx + p.headRx - 4} ${p.headCy + 40}, ${p.headCx + p.headRx + 4} ${p.headCy + 36}
         C ${p.headCx + p.headRx + 12} ${p.headCy + 18}, ${p.headCx + p.headRx + 10} ${p.headCy - 14}, ${p.headCx + p.headRx - 2} ${p.headCy - 20}
         C ${p.headCx + 14} ${p.headTop - 4}, ${p.headCx - 14} ${p.headTop - 4}, ${p.headCx - p.headRx + 2} ${p.headCy - 20}
         Z`
      : `M ${p.headCx - p.headRx + 4} ${p.headCy - 10}
         C ${p.headCx - p.headRx - 8} ${p.headCy - 6}, ${p.headCx - p.headRx - 10} ${p.headCy + 12}, ${p.headCx - p.headRx - 2} ${p.headCy + 24}
         C ${p.headCx - p.headRx + 6} ${p.headCy + 28}, ${p.headCx - 6} ${p.headCy + 22}, ${p.headCx - 2} ${p.headCy + 2}
         C ${p.headCx - 1} ${p.headCy - 6}, ${p.headCx + 1} ${p.headCy - 6}, ${p.headCx + 2} ${p.headCy + 2}
         C ${p.headCx + 6} ${p.headCy + 22}, ${p.headCx + p.headRx - 6} ${p.headCy + 28}, ${p.headCx + p.headRx + 2} ${p.headCy + 24}
         C ${p.headCx + p.headRx + 10} ${p.headCy + 12}, ${p.headCx + p.headRx + 8} ${p.headCy - 6}, ${p.headCx + p.headRx - 4} ${p.headCy - 10}
         C ${p.headCx + 10} ${p.headTop - 4}, ${p.headCx - 10} ${p.headTop - 4}, ${p.headCx - p.headRx + 4} ${p.headCy - 10}
         Z`;
    return (
      <g id="hair-back">
        <path className={swayClass} d={backPath} fill={fill} />
      </g>
    );
  }

  // ponytail — single tail from back/top, sweeping to the right side.
  const s = 1;
  const tailPath = isChibi
    ? `M ${p.headCx + s * 6} ${p.headCy - 32}
       C ${p.headCx + s * 30} ${p.headCy - 36}, ${p.headCx + s * 56} ${p.headCy - 10}, ${p.headCx + s * 64} ${p.headCy + 30}
       C ${p.headCx + s * 70} ${p.headCy + 70}, ${p.headCx + s * 60} ${p.chinY + 50}, ${p.headCx + s * 48} ${p.chinY + 60}
       C ${p.headCx + s * 42} ${p.chinY + 56}, ${p.headCx + s * 50} ${p.chinY + 30}, ${p.headCx + s * 44} ${p.headCy}
       C ${p.headCx + s * 36} ${p.headCy - 24}, ${p.headCx + s * 16} ${p.headCy - 30}, ${p.headCx + s * 6} ${p.headCy - 32}
       Z`
    : `M ${p.headCx + s * 4} ${p.headCy - 22}
       C ${p.headCx + s * 22} ${p.headCy - 26}, ${p.headCx + s * 40} ${p.headCy - 4}, ${p.headCx + s * 46} ${p.headCy + 28}
       C ${p.headCx + s * 50} ${p.headCy + 60}, ${p.headCx + s * 40} ${p.chinY + 60}, ${p.headCx + s * 30} ${p.chinY + 70}
       C ${p.headCx + s * 26} ${p.chinY + 66}, ${p.headCx + s * 32} ${p.chinY + 36}, ${p.headCx + s * 28} ${p.headCy + 4}
       C ${p.headCx + s * 22} ${p.headCy - 18}, ${p.headCx + s * 12} ${p.headCy - 24}, ${p.headCx + s * 4} ${p.headCy - 22}
       Z`;
  const ribbonX = p.headCx + s * (isChibi ? 10 : 6);
  const ribbonY = p.headCy - (isChibi ? 30 : 22);
  return (
    <g id="hair-back">
      {/* small back cap to keep top of head covered */}
      <path
        d={isChibi
          ? `M ${p.headCx - p.headRx + 4} ${p.headCy - 18} C ${p.headCx - p.headRx - 8} ${p.headCy - 12}, ${p.headCx - p.headRx - 10} ${p.headCy + 8}, ${p.headCx - p.headRx - 2} ${p.headCy + 22} C ${p.headCx - 4} ${p.headCy + 14}, ${p.headCx + 4} ${p.headCy + 14}, ${p.headCx + p.headRx + 2} ${p.headCy + 22} C ${p.headCx + p.headRx + 10} ${p.headCy + 8}, ${p.headCx + p.headRx + 8} ${p.headCy - 12}, ${p.headCx + p.headRx - 4} ${p.headCy - 18} C ${p.headCx + 12} ${p.headTop - 4}, ${p.headCx - 12} ${p.headTop - 4}, ${p.headCx - p.headRx + 4} ${p.headCy - 18} Z`
          : `M ${p.headCx - p.headRx + 4} ${p.headCy - 8} C ${p.headCx - p.headRx - 6} ${p.headCy - 4}, ${p.headCx - p.headRx - 8} ${p.headCy + 8}, ${p.headCx - p.headRx - 2} ${p.headCy + 18} C ${p.headCx - 4} ${p.headCy + 12}, ${p.headCx + 4} ${p.headCy + 12}, ${p.headCx + p.headRx + 2} ${p.headCy + 18} C ${p.headCx + p.headRx + 8} ${p.headCy + 8}, ${p.headCx + p.headRx + 6} ${p.headCy - 4}, ${p.headCx + p.headRx - 4} ${p.headCy - 8} C ${p.headCx + 10} ${p.headTop - 4}, ${p.headCx - 10} ${p.headTop - 4}, ${p.headCx - p.headRx + 4} ${p.headCy - 8} Z`}
        fill={fill}
      />
      <path className={swayClass} d={tailPath} fill={fill} />
      {/* tail-tie ribbon */}
      <ellipse cx={ribbonX} cy={ribbonY} rx={isChibi ? 7 : 5} ry={isChibi ? 4 : 3} fill={c.accent} />
      <ellipse cx={ribbonX - s * 6} cy={ribbonY - 1} rx={4} ry={2.6} fill={c.accentLight} transform={`rotate(${s * -20} ${ribbonX - s * 6} ${ribbonY - 1})`} />
      <ellipse cx={ribbonX + s * 6} cy={ribbonY - 1} rx={4} ry={2.6} fill={c.accentLight} transform={`rotate(${s * 20} ${ribbonX + s * 6} ${ribbonY - 1})`} />
    </g>
  );
}

/* ================================================================== */
/* 2. HAIR — FRONT (bangs + face-framing tendrils)                    */
/* ================================================================== */

function HairFront({ config, p, c, ids }: LayerProps) {
  const fill = `url(#${ids.hairGrad})`;
  const isChibi = p.isChibi;
  // Bangs always cover the top of the forehead; center-parted with three
  // flowing sections.
  const bangScale = isChibi ? 1.9 : 1;
  const topY = p.headTop;
  const browY = p.eyeY - (isChibi ? 16 : 11);

  // Center-parted bangs (one big shape with three feathered sections).
  const bangs = isChibi
    ? `M ${p.headCx - p.headRx + 6} ${p.headCy - 26}
       C ${p.headCx - p.headRx + 12} ${topY - 2}, ${p.headCx - 8} ${topY - 4}, ${p.headCx} ${topY - 2}
       C ${p.headCx + 8} ${topY - 4}, ${p.headCx + p.headRx - 12} ${topY - 2}, ${p.headCx + p.headRx - 6} ${p.headCy - 26}
       C ${p.headCx + p.headRx - 14} ${p.headCy - 18}, ${p.headCx + 22} ${p.headCy - 14}, ${p.headCx + 14} ${browY + 2}
       C ${p.headCx + 10} ${p.headCy - 8}, ${p.headCx + 6} ${p.headCy - 4}, ${p.headCx + 4} ${browY - 2}
       C ${p.headCx + 2} ${p.headCy - 6}, ${p.headCx - 2} ${p.headCy - 6}, ${p.headCx - 4} ${browY - 2}
       C ${p.headCx - 6} ${p.headCy - 4}, ${p.headCx - 10} ${p.headCy - 8}, ${p.headCx - 14} ${browY + 2}
       C ${p.headCx - 22} ${p.headCy - 14}, ${p.headCx - p.headRx + 14} ${p.headCy - 18}, ${p.headCx - p.headRx + 6} ${p.headCy - 26}
       Z`
    : `M ${p.headCx - p.headRx + 4} ${p.headCy - 16}
       C ${p.headCx - p.headRx + 10} ${topY - 2}, ${p.headCx - 6} ${topY - 4}, ${p.headCx} ${topY - 2}
       C ${p.headCx + 6} ${topY - 4}, ${p.headCx + p.headRx - 10} ${topY - 2}, ${p.headCx + p.headRx - 4} ${p.headCy - 16}
       C ${p.headCx + p.headRx - 12} ${p.headCy - 10}, ${p.headCx + 12} ${p.headCy - 6}, ${p.headCx + 8} ${browY + 1}
       C ${p.headCx + 5} ${p.headCy - 4}, ${p.headCx + 3} ${p.headCy - 2}, ${p.headCx + 2} ${browY - 1}
       C ${p.headCx + 1} ${p.headCy - 4}, ${p.headCx - 1} ${p.headCy - 4}, ${p.headCx - 2} ${browY - 1}
       C ${p.headCx - 3} ${p.headCy - 2}, ${p.headCx - 5} ${p.headCy - 4}, ${p.headCx - 8} ${browY + 1}
       C ${p.headCx - 12} ${p.headCy - 6}, ${p.headCx - p.headRx + 12} ${p.headCy - 10}, ${p.headCx - p.headRx + 4} ${p.headCy - 16}
       Z`;

  // Side face-framing tendrils (left + right) — long_flow & short_bob get
  // longer tendrils; twin_tails and ponytail get shorter ones tucked back.
  const tendrilLength: Record<HairStyle, "long" | "short"> = {
    long_flow: "long",
    short_bob: "long",
    twin_tails: "short",
    ponytail: "short",
  };
  const tLen = tendrilLength[config.hairStyle];
  const tendrilEndY = tLen === "long" ? p.chinY - 2 : p.headCy + (isChibi ? 16 : 8);

  const tendril = (side: "L" | "R") => {
    const s = side === "L" ? -1 : 1;
    const topX = p.headCx + s * (p.headRx - (isChibi ? 8 : 6));
    const topY2 = p.headCy - (isChibi ? 18 : 8);
    const outerX = p.headCx + s * (p.headRx + (isChibi ? 4 : 2));
    const innerX = p.headCx + s * (p.headRx - (isChibi ? 18 : 10));
    return `M ${topX} ${topY2}
      C ${outerX} ${p.headCy - (isChibi ? 6 : 2)}, ${outerX} ${p.headCy + (isChibi ? 18 : 12)}, ${p.headCx + s * (p.headRx - 2)} ${tendrilEndY - (isChibi ? 10 : 8)}
      C ${innerX} ${tendrilEndY}, ${innerX - s * 2} ${p.headCy + (isChibi ? 10 : 4)}, ${innerX + s * 2} ${p.headCy - (isChibi ? 10 : 4)}
      C ${innerX + s * 6} ${topY2 + 4}, ${topX - s * 2} ${topY2 + 2}, ${topX} ${topY2}
      Z`;
  };

  return (
    <g id="hair-front">
      <path d={bangs} fill={fill} />
      {/* Subtle bangs shading line */}
      <path
        d={`M ${p.headCx - (isChibi ? 14 : 8)} ${browY + (isChibi ? 4 : 2)} Q ${p.headCx} ${browY + (isChibi ? 8 : 5)} ${p.headCx + (isChibi ? 14 : 8)} ${browY + (isChibi ? 4 : 2)}`}
        stroke={c.hairDark}
        strokeWidth={isChibi ? 1.5 : 1}
        fill="none"
        opacity={0.5}
      />
      <path d={tendril("L")} fill={fill} />
      <path d={tendril("R")} fill={fill} />
      {/* Crown highlight strand to give hair volume */}
      <path
        d={`M ${p.headCx - (isChibi ? 20 : 12)} ${p.headCy - (isChibi ? 26 : 16)} Q ${p.headCx} ${p.headCy - (isChibi ? 32 : 22)} ${p.headCx + (isChibi ? 20 : 12)} ${p.headCy - (isChibi ? 26 : 16)}`}
        stroke={c.hairLighter}
        strokeWidth={isChibi ? 3 : 2}
        fill="none"
        strokeLinecap="round"
        opacity={0.7}
      />
    </g>
  );
}

/* ================================================================== */
/* 3. ANIMAL EARS (cat / fox / bunny)                                  */
/* ================================================================== */

function AnimalEars({ config, p, c }: LayerProps) {
  if (config.earType === "none") return null;
  const isChibi = p.isChibi;
  const outer = c.hair;
  const outerDark = c.hairDark;
  const inner = c.accentLight;

  const earTop = p.headTop - (isChibi ? 4 : 2);

  if (config.earType === "bunny") {
    // Two long upright oval ears.
    const ear = (side: "L" | "R") => {
      const s = side === "L" ? -1 : 1;
      const baseX = p.headCx + s * (isChibi ? 18 : 9);
      const w = isChibi ? 9 : 6;
      const h = isChibi ? 36 : 28;
      const tilt = s * (isChibi ? 6 : 4);
      return (
        <g key={side} transform={`rotate(${tilt} ${baseX} ${earTop})`}>
          {/* outer */}
          <path
            d={`M ${baseX - w} ${earTop + 4}
                C ${baseX - w} ${earTop - h * 0.8}, ${baseX - w * 0.4} ${earTop - h}, ${baseX} ${earTop - h}
                C ${baseX + w * 0.4} ${earTop - h}, ${baseX + w} ${earTop - h * 0.8}, ${baseX + w} ${earTop + 4}
                C ${baseX + w * 0.6} ${earTop + 2}, ${baseX - w * 0.6} ${earTop + 2}, ${baseX - w} ${earTop + 4}
                Z`}
            fill={outer}
          />
          {/* inner */}
          <path
            d={`M ${baseX - w * 0.5} ${earTop}
                C ${baseX - w * 0.5} ${earTop - h * 0.7}, ${baseX - w * 0.2} ${earTop - h * 0.88}, ${baseX} ${earTop - h * 0.88}
                C ${baseX + w * 0.2} ${earTop - h * 0.88}, ${baseX + w * 0.5} ${earTop - h * 0.7}, ${baseX + w * 0.5} ${earTop}
                C ${baseX + w * 0.3} ${earTop - 2}, ${baseX - w * 0.3} ${earTop - 2}, ${baseX - w * 0.5} ${earTop}
                Z`}
            fill={inner}
            opacity={0.85}
          />
        </g>
      );
    };
    return (
      <g id="ears-animal">
        {ear("L")}
        {ear("R")}
      </g>
    );
  }

  // cat / fox — triangular ears.
  const isFox = config.earType === "fox";
  const earHeight = isChibi ? (isFox ? 24 : 20) : isFox ? 22 : 18;
  const earHalfBase = isChibi ? (isFox ? 14 : 12) : isFox ? 12 : 10;
  const earRoundness = isFox ? 0.18 : 0.32; // 0 = sharp, 1 = round

  const ear = (side: "L" | "R") => {
    const s = side === "L" ? -1 : 1;
    const baseX = p.headCx + s * (isChibi ? 24 : 12);
    const baseY = earTop + (isChibi ? 6 : 4);
    const tipX = baseX + s * earHalfBase * 0.6;
    const tipY = baseY - earHeight;
    const innerBaseX = baseX - s * earHalfBase * 0.6;
    const innerBaseY = baseY + 2;
    const outerBaseX = baseX + s * earHalfBase;
    const outerBaseY = baseY;
    // Use a path with curved tip for softness.
    const tipCtrl = earRoundness * 6;
    return (
      <g key={side}>
        <path
          d={`M ${outerBaseX} ${outerBaseY}
              Q ${outerBaseX + s * 4} ${baseY - earHeight * 0.55}, ${tipX + s * tipCtrl} ${tipY + tipCtrl}
              Q ${tipX} ${tipY - tipCtrl}, ${tipX - s * tipCtrl} ${tipY + tipCtrl}
              Q ${innerBaseX + s * 2} ${baseY - earHeight * 0.55}, ${innerBaseX} ${innerBaseY}
              Q ${baseX} ${baseY + 1}, ${outerBaseX} ${outerBaseY}
              Z`}
          fill={outer}
          stroke={outerDark}
          strokeWidth={0.6}
        />
        {/* inner ear */}
        <path
          d={`M ${outerBaseX - s * 1} ${outerBaseY - 2}
              Q ${outerBaseX + s * 2} ${baseY - earHeight * 0.5}, ${tipX + s * tipCtrl * 0.7} ${tipY + tipCtrl * 1.5}
              Q ${tipX - s * tipCtrl * 0.5} ${tipY + tipCtrl * 1.5 + 1}, ${innerBaseX + s * 1} ${baseY - earHeight * 0.5}
              Q ${baseX - s * 1} ${baseY - 2}, ${outerBaseX - s * 1} ${outerBaseY - 2}
              Z`}
          fill={inner}
          opacity={0.88}
        />
      </g>
    );
  };

  return (
    <g id="ears-animal">
      {ear("L")}
      {ear("R")}
    </g>
  );
}

/* ================================================================== */
/* 4. TAIL (kemonomimi — behind body)                                  */
/* ================================================================== */

function Tail({ config, p, c, animated }: LayerProps) {
  if (config.earType === "none") return null;
  const swayClass = animated ? "ac-tail-sway" : undefined;
  const isChibi = p.isChibi;
  const baseY = p.hipY + (isChibi ? 6 : 4);

  if (config.earType === "bunny") {
    // Small round puff tail on the right side.
    return (
      <g id="tail">
        <circle cx={p.headCx + (isChibi ? 28 : 26)} cy={baseY + 6} r={isChibi ? 9 : 7} fill={c.hair} />
        <circle cx={p.headCx + (isChibi ? 26 : 24)} cy={baseY + 4} r={isChibi ? 5 : 4} fill={c.hairLight} opacity={0.7} />
      </g>
    );
  }

  if (config.earType === "fox") {
    // Big bushy fox tail, sweeping to the right.
    const path = isChibi
      ? `M ${p.headCx + 24} ${baseY}
         C ${p.headCx + 50} ${baseY - 10}, ${p.headCx + 66} ${baseY + 6}, ${p.headCx + 68} ${baseY + 28}
         C ${p.headCx + 70} ${baseY + 48}, ${p.headCx + 56} ${baseY + 56}, ${p.headCx + 44} ${baseY + 50}
         C ${p.headCx + 50} ${baseY + 40}, ${p.headCx + 44} ${baseY + 28}, ${p.headCx + 30} ${baseY + 16}
         C ${p.headCx + 24} ${baseY + 12}, ${p.headCx + 22} ${baseY + 8}, ${p.headCx + 24} ${baseY}
         Z`
      : `M ${p.headCx + 20} ${baseY}
         C ${p.headCx + 42} ${baseY - 8}, ${p.headCx + 56} ${baseY + 6}, ${p.headCx + 58} ${baseY + 24}
         C ${p.headCx + 60} ${baseY + 40}, ${p.headCx + 48} ${baseY + 46}, ${p.headCx + 38} ${baseY + 42}
         C ${p.headCx + 42} ${baseY + 34}, ${p.headCx + 38} ${baseY + 22}, ${p.headCx + 26} ${baseY + 12}
         C ${p.headCx + 22} ${baseY + 10}, ${p.headCx + 20} ${baseY + 6}, ${p.headCx + 20} ${baseY}
         Z`;
    return (
      <g id="tail">
        <path className={swayClass} d={path} fill={c.hair} />
        {/* white tip */}
        <ellipse cx={p.headCx + (isChibi ? 60 : 52)} cy={baseY + (isChibi ? 36 : 30)} rx={isChibi ? 10 : 8} ry={isChibi ? 12 : 10} fill={lighten(c.hair, 0.7)} />
      </g>
    );
  }

  // cat — slim curved tail.
  const path = isChibi
    ? `M ${p.headCx + 24} ${baseY + 6}
       C ${p.headCx + 46} ${baseY - 4}, ${p.headCx + 60} ${baseY - 24}, ${p.headCx + 58} ${baseY - 40}
       C ${p.headCx + 56} ${baseY - 48}, ${p.headCx + 46} ${baseY - 44}, ${p.headCx + 44} ${baseY - 32}
       C ${p.headCx + 46} ${baseY - 22}, ${p.headCx + 38} ${baseY - 14}, ${p.headCx + 26} ${baseY - 4}
       C ${p.headCx + 22} ${baseY}, ${p.headCx + 22} ${baseY + 4}, ${p.headCx + 24} ${baseY + 6}
       Z`
    : `M ${p.headCx + 20} ${baseY + 4}
       C ${p.headCx + 38} ${baseY - 4}, ${p.headCx + 50} ${baseY - 22}, ${p.headCx + 48} ${baseY - 36}
       C ${p.headCx + 46} ${baseY - 44}, ${p.headCx + 38} ${baseY - 40}, ${p.headCx + 36} ${baseY - 30}
       C ${p.headCx + 38} ${baseY - 22}, ${p.headCx + 32} ${baseY - 14}, ${p.headCx + 22} ${baseY - 4}
       C ${p.headCx + 18} ${baseY}, ${p.headCx + 18} ${baseY + 2}, ${p.headCx + 20} ${baseY + 4}
       Z`;
  return (
    <g id="tail">
      <path className={swayClass} d={path} fill={c.hair} />
    </g>
  );
}

/* ================================================================== */
/* 5. BODY (skin-toned base: neck, torso, arms, hands, legs)          */
/* ================================================================== */

function Body({ config, p, c, animated }: LayerProps) {
  const isChibi = p.isChibi;
  const isWaving = config.expression === "waving";
  const waveClass = animated && isWaving ? "ac-wave" : undefined;

  if (isChibi) {
    // Tiny chibi body — small rounded torso + stubby arms + tiny feet.
    return (
      <g id="body">
        {/* Neck */}
        <rect x={p.headCx - p.neckHalf} y={p.neckTop} width={p.neckHalf * 2} height={p.neckBottom - p.neckTop + 2} rx={3} fill={c.skinShadow} />
        {/* Torso (skin base, mostly covered by outfit) */}
        <path
          d={`M ${p.headCx - p.shoulderHalf} ${p.shoulderY}
              Q ${p.headCx - p.shoulderHalf - 2} ${p.waistY}, ${p.headCx - p.shoulderHalf + 2} ${p.hipY}
              L ${p.headCx + p.shoulderHalf - 2} ${p.hipY}
              Q ${p.headCx + p.shoulderHalf + 2} ${p.waistY}, ${p.headCx + p.shoulderHalf} ${p.shoulderY}
              Q ${p.headCx} ${p.shoulderY - 4}, ${p.headCx - p.shoulderHalf} ${p.shoulderY}
              Z`}
          fill={c.skin}
        />
        {/* Arms — stubby */}
        {!isWaving && (
          <>
            <ellipse cx={p.headCx - p.shoulderHalf - 2} cy={p.shoulderY + 14} rx={5} ry={14} fill={c.skin} transform={`rotate(10 ${p.headCx - p.shoulderHalf - 2} ${p.shoulderY + 14})`} />
            <ellipse cx={p.headCx + p.shoulderHalf + 2} cy={p.shoulderY + 14} rx={5} ry={14} fill={c.skin} transform={`rotate(-10 ${p.headCx + p.shoulderHalf + 2} ${p.shoulderY + 14})`} />
            <circle cx={p.headCx - p.shoulderHalf - 5} cy={p.shoulderY + 26} r={5} fill={c.skinLight} />
            <circle cx={p.headCx + p.shoulderHalf + 5} cy={p.shoulderY + 26} r={5} fill={c.skinLight} />
          </>
        )}
        {isWaving && (
          <>
            {/* Left arm down */}
            <ellipse cx={p.headCx - p.shoulderHalf - 2} cy={p.shoulderY + 14} rx={5} ry={14} fill={c.skin} transform={`rotate(10 ${p.headCx - p.shoulderHalf - 2} ${p.shoulderY + 14})`} />
            <circle cx={p.headCx - p.shoulderHalf - 5} cy={p.shoulderY + 26} r={5} fill={c.skinLight} />
            {/* Right arm waving */}
            <g className={waveClass} style={{ transformOrigin: `${p.headCx + p.shoulderHalf}px ${p.shoulderY}px` }}>
              <ellipse cx={p.headCx + p.shoulderHalf + 10} cy={p.shoulderY - 6} rx={5} ry={16} fill={c.skin} transform={`rotate(-35 ${p.headCx + p.shoulderHalf + 10} ${p.shoulderY - 6})`} />
              <circle cx={p.headCx + p.shoulderHalf + 20} cy={p.shoulderY - 20} r={6} fill={c.skinLight} />
            </g>
          </>
        )}
      </g>
    );
  }

  // Slim body.
  return (
    <g id="body">
      {/* Neck */}
      <path
        d={`M ${p.headCx - p.neckHalf} ${p.neckTop - 1}
            L ${p.headCx - p.neckHalf} ${p.neckBottom}
            Q ${p.headCx} ${p.neckBottom + 3}, ${p.headCx + p.neckHalf} ${p.neckBottom}
            L ${p.headCx + p.neckHalf} ${p.neckTop - 1}
            Q ${p.headCx} ${p.neckTop - 4}, ${p.headCx - p.neckHalf} ${p.neckTop - 1}
            Z`}
        fill={c.skinShadow}
      />
      {/* Neck shadow under chin */}
      <ellipse cx={p.headCx} cy={p.neckTop + 2} rx={p.neckHalf + 1} ry={2.5} fill={c.skinShadow} opacity={0.6} />

      {/* Torso (skin base, mostly covered by outfit) */}
      <path
        d={`M ${p.headCx - p.shoulderHalf + 2} ${p.shoulderY}
            Q ${p.headCx - p.shoulderHalf - 2} ${p.shoulderY + 6}, ${p.headCx - p.shoulderHalf + 2} ${p.shoulderY + 14}
            L ${p.headCx - p.shoulderHalf + 6} ${p.waistY}
            L ${p.headCx + p.shoulderHalf - 6} ${p.waistY}
            L ${p.headCx + p.shoulderHalf - 2} ${p.shoulderY + 14}
            Q ${p.headCx + p.shoulderHalf + 2} ${p.shoulderY + 6}, ${p.headCx + p.shoulderHalf - 2} ${p.shoulderY}
            Q ${p.headCx} ${p.shoulderY - 6}, ${p.headCx - p.shoulderHalf + 2} ${p.shoulderY}
            Z`}
        fill={c.skin}
      />

      {/* Legs (visible below skirt for slim styles) */}
      <path
        d={`M ${p.headCx - 6} ${p.skirtBottom - 2}
            L ${p.headCx - 7} ${p.legBottom - 4}
            Q ${p.headCx - 6} ${p.legBottom - 1}, ${p.headCx - 3} ${p.legBottom - 1}
            L ${p.headCx - 1} ${p.legBottom - 1}
            L ${p.headCx - 1} ${p.skirtBottom - 2}
            Z`}
        fill={c.skin}
      />
      <path
        d={`M ${p.headCx + 1} ${p.skirtBottom - 2}
            L ${p.headCx + 1} ${p.legBottom - 1}
            L ${p.headCx + 3} ${p.legBottom - 1}
            Q ${p.headCx + 6} ${p.legBottom - 1}, ${p.headCx + 7} ${p.legBottom - 4}
            L ${p.headCx + 6} ${p.skirtBottom - 2}
            Z`}
        fill={c.skin}
      />
      {/* Shoes */}
      <ellipse cx={p.headCx - 4} cy={p.legBottom - 1} rx={5} ry={2.4} fill={c.outfitDark} />
      <ellipse cx={p.headCx + 4} cy={p.legBottom - 1} rx={5} ry={2.4} fill={c.outfitDark} />

      {/* Arms */}
      {!isWaving ? (
        <>
          {/* Left arm — relaxed at side */}
          <path
            d={`M ${p.headCx - p.shoulderHalf + 2} ${p.shoulderY + 2}
                Q ${p.headCx - p.shoulderHalf - 6} ${p.shoulderY + 18}, ${p.headCx - p.shoulderHalf - 4} ${p.shoulderY + 38}
                Q ${p.headCx - p.shoulderHalf - 2} ${p.shoulderY + 50}, ${p.headCx - p.shoulderHalf + 2} ${p.shoulderY + 52}
                Q ${p.headCx - p.shoulderHalf + 6} ${p.shoulderY + 48}, ${p.headCx - p.shoulderHalf + 4} ${p.shoulderY + 38}
                Q ${p.headCx - p.shoulderHalf + 2} ${p.shoulderY + 20}, ${p.headCx - p.shoulderHalf + 6} ${p.shoulderY + 8}
                Z`}
            fill={c.skin}
          />
          <circle cx={p.headCx - p.shoulderHalf - 1} cy={p.shoulderY + 54} r={4.5} fill={c.skinLight} />
          {/* Right arm — relaxed */}
          <path
            d={`M ${p.headCx + p.shoulderHalf - 2} ${p.shoulderY + 2}
                Q ${p.headCx + p.shoulderHalf + 6} ${p.shoulderY + 18}, ${p.headCx + p.shoulderHalf + 4} ${p.shoulderY + 38}
                Q ${p.headCx + p.shoulderHalf + 2} ${p.shoulderY + 50}, ${p.headCx + p.shoulderHalf - 2} ${p.shoulderY + 52}
                Q ${p.headCx + p.shoulderHalf - 6} ${p.shoulderY + 48}, ${p.headCx + p.shoulderHalf - 4} ${p.shoulderY + 38}
                Q ${p.headCx + p.shoulderHalf - 2} ${p.shoulderY + 20}, ${p.headCx + p.shoulderHalf - 6} ${p.shoulderY + 8}
                Z`}
            fill={c.skin}
          />
          <circle cx={p.headCx + p.shoulderHalf + 1} cy={p.shoulderY + 54} r={4.5} fill={c.skinLight} />
        </>
      ) : (
        <>
          {/* Left arm — relaxed */}
          <path
            d={`M ${p.headCx - p.shoulderHalf + 2} ${p.shoulderY + 2}
                Q ${p.headCx - p.shoulderHalf - 6} ${p.shoulderY + 18}, ${p.headCx - p.shoulderHalf - 4} ${p.shoulderY + 38}
                Q ${p.headCx - p.shoulderHalf - 2} ${p.shoulderY + 50}, ${p.headCx - p.shoulderHalf + 2} ${p.shoulderY + 52}
                Q ${p.headCx - p.shoulderHalf + 6} ${p.shoulderY + 48}, ${p.headCx - p.shoulderHalf + 4} ${p.shoulderY + 38}
                Q ${p.headCx - p.shoulderHalf + 2} ${p.shoulderY + 20}, ${p.headCx - p.shoulderHalf + 6} ${p.shoulderY + 8}
                Z`}
            fill={c.skin}
          />
          <circle cx={p.headCx - p.shoulderHalf - 1} cy={p.shoulderY + 54} r={4.5} fill={c.skinLight} />
          {/* Right arm — waving (rotates from shoulder) */}
          <g className={waveClass} style={{ transformOrigin: `${p.headCx + p.shoulderHalf - 2}px ${p.shoulderY + 4}px` }}>
            <path
              d={`M ${p.headCx + p.shoulderHalf - 2} ${p.shoulderY + 2}
                  Q ${p.headCx + p.shoulderHalf + 10} ${p.shoulderY - 6}, ${p.headCx + p.shoulderHalf + 18} ${p.shoulderY - 22}
                  Q ${p.headCx + p.shoulderHalf + 22} ${p.shoulderY - 32}, ${p.headCx + p.shoulderHalf + 18} ${p.shoulderY - 38}
                  Q ${p.headCx + p.shoulderHalf + 12} ${p.shoulderY - 34}, ${p.headCx + p.shoulderHalf + 6} ${p.shoulderY - 22}
                  Q ${p.headCx + p.shoulderHalf - 2} ${p.shoulderY - 8}, ${p.headCx + p.shoulderHalf - 6} ${p.shoulderY + 4}
                  Z`}
              fill={c.skin}
            />
            <circle cx={p.headCx + p.shoulderHalf + 18} cy={p.shoulderY - 38} r={5.5} fill={c.skinLight} />
          </g>
        </>
      )}
    </g>
  );
}

/* ================================================================== */
/* 6. OUTFIT (dress / hoodie / uniform / casual)                       */
/* ================================================================== */

function Outfit({ config, p, c, ids }: LayerProps) {
  const isChibi = p.isChibi;
  const outfitFill = `url(#${ids.outfitGrad})`;
  const outfitSolid = c.outfit;
  const outfitDark = c.outfitDark;
  const outfitLight = c.outfitLight;
  const accent = c.accent;

  const cx = p.headCx;
  const sw = p.shoulderHalf;
  const sy = p.shoulderY;
  const wy = p.waistY;
  const sb = p.skirtBottom;

  if (isChibi) {
    // Chibi outfits are tiny stubs covering the small body.
    if (config.outfitStyle === "dress") {
      return (
        <g id="outfit">
          {/* Bodice */}
          <path d={`M ${cx - sw + 2} ${sy} Q ${cx} ${sy - 4}, ${cx + sw - 2} ${sy} L ${cx + sw - 2} ${wy} L ${cx - sw + 2} ${wy} Z`} fill={outfitFill} />
          {/* Skirt (flared) */}
          <path d={`M ${cx - sw + 2} ${wy} Q ${cx - sw - 6} ${sb - 8}, ${cx - sw - 4} ${sb} L ${cx + sw + 4} ${sb} Q ${cx + sw + 6} ${sb - 8}, ${cx + sw - 2} ${wy} Z`} fill={outfitFill} />
          {/* Waist accent */}
          <rect x={cx - sw + 2} y={wy - 2} width={(sw - 2) * 2} height={3} fill={accent} />
          {/* Collar */}
          <path d={`M ${cx - 4} ${sy - 2} L ${cx} ${sy + 2} L ${cx + 4} ${sy - 2}`} stroke={outfitDark} strokeWidth={1.5} fill="none" />
        </g>
      );
    }
    if (config.outfitStyle === "hoodie") {
      return (
        <g id="outfit">
          {/* Hood behind neck */}
          <path d={`M ${cx - sw + 2} ${sy + 2} Q ${cx - sw - 2} ${sy - 14}, ${cx} ${sy - 18} Q ${cx + sw + 2} ${sy - 14}, ${cx + sw - 2} ${sy + 2} Q ${cx} ${sy - 4}, ${cx - sw + 2} ${sy + 2} Z`} fill={outfitDark} />
          {/* Body */}
          <path d={`M ${cx - sw + 2} ${sy} Q ${cx} ${sy - 2}, ${cx + sw - 2} ${sy} L ${cx + sw - 2} ${sb} L ${cx - sw + 2} ${sb} Z`} fill={outfitFill} />
          {/* Pocket */}
          <path d={`M ${cx - 8} ${wy + 4} Q ${cx - 8} ${wy}, ${cx - 4} ${wy} L ${cx + 4} ${wy} Q ${cx + 8} ${wy}, ${cx + 8} ${wy + 4} L ${cx + 8} ${wy + 14} Q ${cx + 8} ${wy + 18}, ${cx + 4} ${wy + 18} L ${cx - 4} ${wy + 18} Q ${cx - 8} ${wy + 18}, ${cx - 8} ${wy + 14} Z`} fill={outfitDark} opacity={0.5} />
          {/* Drawstrings */}
          <path d={`M ${cx - 4} ${sy + 2} Q ${cx - 5} ${sy + 10}, ${cx - 4} ${sy + 16}`} stroke={outfitDark} strokeWidth={1.2} fill="none" />
          <path d={`M ${cx + 4} ${sy + 2} Q ${cx + 5} ${sy + 10}, ${cx + 4} ${sy + 16}`} stroke={outfitDark} strokeWidth={1.2} fill="none" />
        </g>
      );
    }
    if (config.outfitStyle === "uniform") {
      return (
        <g id="outfit">
          {/* Top */}
          <path d={`M ${cx - sw + 2} ${sy} Q ${cx} ${sy - 2}, ${cx + sw - 2} ${sy} L ${cx + sw - 2} ${wy} L ${cx - sw + 2} ${wy} Z`} fill={outfitFill} />
          {/* Sailor collar */}
          <path d={`M ${cx - sw + 2} ${sy} L ${cx} ${sy + 12} L ${cx + sw - 2} ${sy} L ${cx + sw - 2} ${sy + 4} L ${cx} ${sy + 16} L ${cx - sw + 2} ${sy + 4} Z`} fill={outfitDark} />
          {/* Ribbon */}
          <path d={`M ${cx - 5} ${sy + 10} L ${cx - 7} ${sy + 6} L ${cx - 3} ${sy + 8} L ${cx} ${sy + 12} L ${cx + 3} ${sy + 8} L ${cx + 7} ${sy + 6} L ${cx + 5} ${sy + 10} L ${cx} ${sy + 14} Z`} fill={accent} />
          {/* Skirt (pleated) */}
          <path d={`M ${cx - sw + 2} ${wy} L ${cx - sw - 2} ${sb} L ${cx + sw + 2} ${sb} L ${cx + sw - 2} ${wy} Z`} fill={outfitDark} />
          <g stroke={outfitFill} strokeWidth={1} opacity={0.6}>
            <line x1={cx - 6} y1={wy + 2} x2={cx - 8} y2={sb} />
            <line x1={cx} y1={wy + 2} x2={cx} y2={sb} />
            <line x1={cx + 6} y1={wy + 2} x2={cx + 8} y2={sb} />
          </g>
        </g>
      );
    }
    // casual
    return (
      <g id="outfit">
        {/* Top */}
        <path d={`M ${cx - sw + 2} ${sy} Q ${cx} ${sy - 2}, ${cx + sw - 2} ${sy} L ${cx + sw - 2} ${wy} L ${cx - sw + 2} ${wy} Z`} fill={outfitFill} />
        {/* Neckline */}
        <path d={`M ${cx - 5} ${sy} Q ${cx} ${sy + 4}, ${cx + 5} ${sy}`} stroke={outfitDark} strokeWidth={1} fill="none" />
        {/* Skirt */}
        <path d={`M ${cx - sw + 2} ${wy} Q ${cx - sw - 4} ${sb - 6}, ${cx - sw - 2} ${sb} L ${cx + sw + 2} ${sb} Q ${cx + sw + 4} ${sb - 6}, ${cx + sw - 2} ${wy} Z`} fill={outfitDark} />
        {/* Belt */}
        <rect x={cx - sw + 2} y={wy - 1} width={(sw - 2) * 2} height={2.5} fill={accent} />
      </g>
    );
  }

  /* ============ Slim outfits ============ */

  if (config.outfitStyle === "dress") {
    return (
      <g id="outfit">
        {/* Bodice (with sweetheart neckline) */}
        <path
          d={`M ${cx - sw + 2} ${sy + 2}
              Q ${cx - sw - 1} ${sy + 4}, ${cx - sw + 4} ${sy + 8}
              L ${cx - 8} ${wy}
              L ${cx + 8} ${wy}
              L ${cx + sw - 4} ${sy + 8}
              Q ${cx + sw + 1} ${sy + 4}, ${cx + sw - 2} ${sy + 2}
              Q ${cx} ${sy - 2}, ${cx - sw + 2} ${sy + 2}
              Z`}
          fill={outfitFill}
        />
        {/* Sweetheart neckline dip */}
        <path d={`M ${cx - 8} ${sy + 8} Q ${cx} ${sy + 16}, ${cx + 8} ${sy + 8}`} fill={c.skin} opacity={0.55} />
        {/* Sleeves (puffy cap) */}
        <path d={`M ${cx - sw - 2} ${sy + 6} Q ${cx - sw - 8} ${sy + 4}, ${cx - sw - 6} ${sy + 14} Q ${cx - sw + 2} ${sy + 16}, ${cx - sw + 2} ${sy + 8} Z`} fill={outfitFill} />
        <path d={`M ${cx + sw + 2} ${sy + 6} Q ${cx + sw + 8} ${sy + 4}, ${cx + sw + 6} ${sy + 14} Q ${cx + sw - 2} ${sy + 16}, ${cx + sw - 2} ${sy + 8} Z`} fill={outfitFill} />
        {/* Skirt (A-line, flared with curved hem) */}
        <path
          d={`M ${cx - 8} ${wy}
              Q ${cx - sw - 8} ${wy + 20}, ${cx - sw - 12} ${sb}
              Q ${cx} ${sb + 4}, ${cx + sw + 12} ${sb}
              Q ${cx + sw + 8} ${wy + 20}, ${cx + 8} ${wy}
              Z`}
          fill={outfitFill}
        />
        {/* Skirt fold lines */}
        <g stroke={outfitDark} strokeWidth={0.8} fill="none" opacity={0.5}>
          <path d={`M ${cx - 4} ${wy + 4} Q ${cx - 8} ${sb - 14}, ${cx - 10} ${sb - 2}`} />
          <path d={`M ${cx + 4} ${wy + 4} Q ${cx + 8} ${sb - 14}, ${cx + 10} ${sb - 2}`} />
        </g>
        {/* Waist ribbon */}
        <rect x={cx - 9} y={wy - 2} width={18} height={4} rx={1.5} fill={accent} />
        {/* Center bow knot */}
        <circle cx={cx} cy={wy} r={3} fill={accent} />
        <path d={`M ${cx - 3} ${wy} L ${cx - 8} ${wy - 3} L ${cx - 8} ${wy + 3} Z`} fill={accent} />
        <path d={`M ${cx + 3} ${wy} L ${cx + 8} ${wy - 3} L ${cx + 8} ${wy + 3} Z`} fill={accent} />
        {/* Collar */}
        <path d={`M ${cx - 6} ${sy + 4} L ${cx} ${sy + 10} L ${cx + 6} ${sy + 4}`} stroke={outfitDark} strokeWidth={1.2} fill="none" />
      </g>
    );
  }

  if (config.outfitStyle === "hoodie") {
    return (
      <g id="outfit">
        {/* Hood behind neck (visible above shoulders) */}
        <path
          d={`M ${cx - sw - 4} ${sy + 4}
              Q ${cx - sw - 10} ${sy - 16}, ${cx} ${sy - 22}
              Q ${cx + sw + 10} ${sy - 16}, ${cx + sw + 4} ${sy + 4}
              Q ${cx} ${sy - 6}, ${cx - sw - 4} ${sy + 4}
              Z`}
          fill={outfitDark}
        />
        {/* Hood inner shadow */}
        <path
          d={`M ${cx - sw + 2} ${sy + 2} Q ${cx} ${sy - 8}, ${cx + sw - 2} ${sy + 2} Q ${cx} ${sy - 2}, ${cx - sw + 2} ${sy + 2} Z`}
          fill={darken(c.outfit, 0.32)}
        />
        {/* Body */}
        <path
          d={`M ${cx - sw + 2} ${sy + 2}
              Q ${cx - sw - 1} ${sy + 6}, ${cx - sw} ${sy + 18}
              L ${cx - sw + 2} ${sb}
              L ${cx + sw - 2} ${sb}
              L ${cx + sw} ${sy + 18}
              Q ${cx + sw + 1} ${sy + 6}, ${cx + sw - 2} ${sy + 2}
              Q ${cx} ${sy - 2}, ${cx - sw + 2} ${sy + 2}
              Z`}
          fill={outfitFill}
        />
        {/* Sleeves (long) — overlapping the arms */}
        <path
          d={`M ${cx - sw + 2} ${sy + 6}
              Q ${cx - sw - 6} ${sy + 20}, ${cx - sw - 4} ${sy + 38}
              Q ${cx - sw - 2} ${sy + 48}, ${cx - sw + 4} ${sy + 50}
              Q ${cx - sw + 8} ${sy + 46}, ${cx - sw + 6} ${sy + 38}
              Q ${cx - sw + 4} ${sy + 22}, ${cx - sw + 6} ${sy + 12}
              Z`}
          fill={outfitFill}
        />
        <path
          d={`M ${cx + sw - 2} ${sy + 6}
              Q ${cx + sw + 6} ${sy + 20}, ${cx + sw + 4} ${sy + 38}
              Q ${cx + sw + 2} ${sy + 48}, ${cx + sw - 4} ${sy + 50}
              Q ${cx + sw - 8} ${sy + 46}, ${cx + sw - 6} ${sy + 38}
              Q ${cx + sw - 4} ${sy + 22}, ${cx + sw - 6} ${sy + 12}
              Z`}
          fill={outfitFill}
        />
        {/* Cuff ribbing */}
        <ellipse cx={cx - sw + 1} cy={sy + 49} rx={5} ry={2.2} fill={outfitDark} />
        <ellipse cx={cx + sw - 1} cy={sy + 49} rx={5} ry={2.2} fill={outfitDark} />
        {/* Hem ribbing */}
        <rect x={cx - sw + 1} y={sb - 4} width={(sw - 1) * 2} height={4} rx={1.5} fill={outfitDark} />
        {/* Pocket */}
        <path
          d={`M ${cx - 14} ${wy + 6}
              Q ${cx - 14} ${wy + 2}, ${cx - 10} ${wy + 2}
              L ${cx + 10} ${wy + 2}
              Q ${cx + 14} ${wy + 2}, ${cx + 14} ${wy + 6}
              L ${cx + 14} ${wy + 24}
              Q ${cx + 14} ${wy + 28}, ${cx + 10} ${wy + 28}
              L ${cx - 10} ${wy + 28}
              Q ${cx - 14} ${wy + 28}, ${cx - 14} ${wy + 24}
              Z`}
          fill={outfitDark}
          opacity={0.4}
        />
        {/* Drawstrings */}
        <path d={`M ${cx - 4} ${sy + 4} Q ${cx - 5} ${sy + 14}, ${cx - 4} ${sy + 24}`} stroke={outfitDark} strokeWidth={1.4} fill="none" strokeLinecap="round" />
        <path d={`M ${cx + 4} ${sy + 4} Q ${cx + 5} ${sy + 14}, ${cx + 4} ${sy + 24}`} stroke={outfitDark} strokeWidth={1.4} fill="none" strokeLinecap="round" />
        <circle cx={cx - 4} cy={sy + 25} r={1.4} fill={outfitDark} />
        <circle cx={cx + 4} cy={sy + 25} r={1.4} fill={outfitDark} />
      </g>
    );
  }

  if (config.outfitStyle === "uniform") {
    return (
      <g id="outfit">
        {/* White shirt base */}
        <path
          d={`M ${cx - sw + 2} ${sy + 2}
              Q ${cx - sw - 1} ${sy + 6}, ${cx - sw + 2} ${sy + 12}
              L ${cx - sw + 4} ${wy}
              L ${cx + sw - 4} ${wy}
              L ${cx + sw - 2} ${sy + 12}
              Q ${cx + sw + 1} ${sy + 6}, ${cx + sw - 2} ${sy + 2}
              Q ${cx} ${sy - 2}, ${cx - sw + 2} ${sy + 2}
              Z`}
          fill={lighten(c.outfit, 0.7)}
        />
        {/* Sailor collar (V-shape, darker outfit color) */}
        <path
          d={`M ${cx - sw + 2} ${sy + 2}
              L ${cx} ${sy + 22}
              L ${cx + sw - 2} ${sy + 2}
              L ${cx + sw - 2} ${sy + 8}
              L ${cx} ${sy + 28}
              L ${cx - sw + 2} ${sy + 8}
              Z`}
          fill={outfitFill}
        />
        {/* collar stripes (accent) */}
        <path d={`M ${cx - sw + 4} ${sy + 5} L ${cx - 2} ${sy + 20} L ${cx + 2} ${sy + 20} L ${cx + sw - 4} ${sy + 5}`} stroke={accent} strokeWidth={1.4} fill="none" />
        {/* Back collar triangle peeking behind neck */}
        <path d={`M ${cx - 5} ${sy - 1} L ${cx + 5} ${sy - 1} L ${cx} ${sy + 8} Z`} fill={outfitDark} opacity={0.85} />
        {/* Ribbon bow at collar V */}
        <g>
          <path d={`M ${cx - 3} ${sy + 16} L ${cx - 9} ${sy + 12} L ${cx - 9} ${sy + 22} Z`} fill={accent} />
          <path d={`M ${cx + 3} ${sy + 16} L ${cx + 9} ${sy + 12} L ${cx + 9} ${sy + 22} Z`} fill={accent} />
          <rect x={cx - 3} y={sy + 14} width={6} height={6} rx={1.5} fill={c.accentDark} />
        </g>
        {/* Sleeves */}
        <path d={`M ${cx - sw + 2} ${sy + 6} Q ${cx - sw - 6} ${sy + 10}, ${cx - sw - 4} ${sy + 22} Q ${cx - sw + 2} ${sy + 22}, ${cx - sw + 4} ${sy + 12} Z`} fill={lighten(c.outfit, 0.7)} />
        <path d={`M ${cx + sw - 2} ${sy + 6} Q ${cx + sw + 6} ${sy + 10}, ${cx + sw + 4} ${sy + 22} Q ${cx + sw - 2} ${sy + 22}, ${cx + sw - 4} ${sy + 12} Z`} fill={lighten(c.outfit, 0.7)} />
        {/* Cuff stripes */}
        <ellipse cx={cx - sw - 1} cy={sy + 21} rx={5} ry={1.6} fill={accent} />
        <ellipse cx={cx + sw + 1} cy={sy + 21} rx={5} ry={1.6} fill={accent} />
        {/* Pleated skirt */}
        <path
          d={`M ${cx - sw + 4} ${wy}
              L ${cx - sw - 8} ${sb}
              L ${cx + sw + 8} ${sb}
              L ${cx + sw - 4} ${wy}
              Z`}
          fill={outfitFill}
        />
        {/* Pleats — vertical lines */}
        <g stroke={outfitDark} strokeWidth={0.9} opacity={0.55}>
          <line x1={cx - 12} y1={wy + 4} x2={cx - 16} y2={sb} />
          <line x1={cx - 6} y1={wy + 4} x2={cx - 8} y2={sb} />
          <line x1={cx} y1={wy + 4} x2={cx} y2={sb} />
          <line x1={cx + 6} y1={wy + 4} x2={cx + 8} y2={sb} />
          <line x1={cx + 12} y1={wy + 4} x2={cx + 16} y2={sb} />
        </g>
        {/* Skirt waistband */}
        <rect x={cx - sw + 4} y={wy - 2} width={(sw - 4) * 2} height={4} fill={outfitDark} />
      </g>
    );
  }

  // casual — simple top + skirt
  return (
    <g id="outfit">
      {/* Top (T-shirt) */}
      <path
        d={`M ${cx - sw + 2} ${sy + 4}
            Q ${cx - sw - 1} ${sy + 8}, ${cx - sw + 2} ${sy + 14}
            L ${cx - sw + 4} ${wy - 4}
            L ${cx + sw - 4} ${wy - 4}
            L ${cx + sw - 2} ${sy + 14}
            Q ${cx + sw + 1} ${sy + 8}, ${cx + sw - 2} ${sy + 4}
            Q ${cx + 4} ${sy + 2}, ${cx} ${sy + 8}
            Q ${cx - 4} ${sy + 2}, ${cx - sw + 2} ${sy + 4}
            Z`}
        fill={outfitFill}
      />
      {/* Short sleeves */}
      <path d={`M ${cx - sw + 2} ${sy + 6} Q ${cx - sw - 6} ${sy + 8}, ${cx - sw - 4} ${sy + 16} Q ${cx - sw + 2} ${sy + 18}, ${cx - sw + 4} ${sy + 12} Z`} fill={outfitFill} />
      <path d={`M ${cx + sw - 2} ${sy + 6} Q ${cx + sw + 6} ${sy + 8}, ${cx + sw + 4} ${sy + 16} Q ${cx + sw - 2} ${sy + 18}, ${cx + sw - 4} ${sy + 12} Z`} fill={outfitFill} />
      {/* Top hem stripe */}
      <rect x={cx - sw + 4} y={wy - 6} width={(sw - 4) * 2} height={2} fill={c.accent} opacity={0.85} />
      {/* Belt */}
      <rect x={cx - sw + 4} y={wy - 3} width={(sw - 4) * 2} height={4} rx={1} fill={c.accentDark} />
      {/* A-line skirt */}
      <path
        d={`M ${cx - sw + 4} ${wy + 1}
            Q ${cx - sw - 6} ${wy + 18}, ${cx - sw - 8} ${sb}
            L ${cx + sw + 8} ${sb}
            Q ${cx + sw + 6} ${wy + 18}, ${cx + sw - 4} ${wy + 1}
            Z`}
        fill={outfitDark}
      />
      {/* Skirt fold lines */}
      <g stroke={lighten(c.outfit, 0.3)} strokeWidth={0.8} fill="none" opacity={0.6}>
        <path d={`M ${cx - 6} ${wy + 4} Q ${cx - 10} ${sb - 14}, ${cx - 12} ${sb - 2}`} />
        <path d={`M ${cx + 6} ${wy + 4} Q ${cx + 10} ${sb - 14}, ${cx + 12} ${sb - 2}`} />
      </g>
    </g>
  );
}

/* ================================================================== */
/* 7. HEAD (face shape + face features + ears + front hair)            */
/* ================================================================== */

function Head(props: LayerProps) {
  const { config, p, c, ids, animated } = props;
  const isChibi = p.isChibi;
  const cx = p.headCx;
  const topY = p.headTop;
  const chinY = p.chinY;
  const rx = p.headRx;
  const ry = p.headRy;

  // Egg-shaped face: wider at top, narrower at chin.
  const facePath = `
    M ${cx} ${topY}
    C ${cx + rx + 1} ${topY + 2}, ${cx + rx * 0.96} ${topY + ry - 4}, ${cx + rx * 0.55} ${chinY - 2}
    C ${cx + rx * 0.2} ${chinY + 2}, ${cx - rx * 0.2} ${chinY + 2}, ${cx - rx * 0.55} ${chinY - 2}
    C ${cx - rx * 0.96} ${topY + ry - 4}, ${cx - rx - 1} ${topY + 2}, ${cx} ${topY}
    Z`;

  // Eye centers.
  const eyeLX = cx - p.eyeOffset;
  const eyeRX = cx + p.eyeOffset;
  const eyeY = p.eyeY;
  const eyeRx = p.eyeRx;
  const eyeRy = p.eyeRy;

  const blinkClass = animated ? "ac-blink" : undefined;
  const expr = config.expression;

  return (
    <g id="head">
      {/* Face shape */}
      <path d={facePath} fill={c.skin} />
      {/* Subtle face shadow on right side for dimension */}
      <path
        d={`M ${cx} ${topY + 4}
            C ${cx + rx + 1} ${topY + 6}, ${cx + rx * 0.96} ${topY + ry - 4}, ${cx + rx * 0.55} ${chinY - 2}
            C ${cx + rx * 0.2} ${chinY + 2}, ${cx + 4} ${chinY + 1}, ${cx + 2} ${chinY - 1}
            C ${cx + rx * 0.3} ${chinY - 6}, ${cx + rx * 0.7} ${topY + ry - 8}, ${cx + rx * 0.6} ${topY + 6}
            C ${cx + rx * 0.2} ${topY + 4}, ${cx} ${topY + 4}, ${cx} ${topY + 4}
            Z`}
        fill={c.skinShadow}
        opacity={0.35}
      />

      {/* Ears (animal ears sit on top of head, behind front hair) */}
      <AnimalEars {...props} />

      {/* Front hair (bangs + tendrils) */}
      <HairFront {...props} />

      {/* ============ Face features ============ */}
      <g id="face">
        <FaceFeatures
          p={p}
          c={c}
          ids={ids}
          expression={expr}
          animated={animated}
          eyeLX={eyeLX}
          eyeRX={eyeRX}
          eyeY={eyeY}
          eyeRx={eyeRx}
          eyeRy={eyeRy}
          blinkClass={blinkClass}
          isChibi={isChibi}
        />
      </g>
    </g>
  );
}

/* ================================================================== */
/* 8. FACE FEATURES (eyes, brows, nose, mouth, blush)                  */
/* ================================================================== */

interface FaceFeaturesProps {
  p: Proportions;
  c: DerivedColors;
  ids: LayerProps["ids"];
  expression: Expression;
  animated: boolean;
  eyeLX: number;
  eyeRX: number;
  eyeY: number;
  eyeRx: number;
  eyeRy: number;
  blinkClass: string | undefined;
  isChibi: boolean;
}

function FaceFeatures({
  p,
  c,
  ids,
  expression,
  eyeLX,
  eyeRX,
  eyeY,
  eyeRx,
  eyeRy,
  blinkClass,
  isChibi,
}: FaceFeaturesProps) {
  const cx = p.headCx;
  const lash = c.lash;

  // ---------- Eye renderer ----------
  // Returns a fully-detailed anime eye: sclera + iris + pupil + 2 highlights
  // + thick upper lash + outer-corner lash flick + optional lower-lash hint.
  // `closed` (boolean): if true, render the eye as a closed ^_^ curve.
  const renderEye = (side: "L" | "R", closed: boolean) => {
    const ex = side === "L" ? eyeLX : eyeRX;
    const eyeClipId = side === "L" ? ids.eyeClipL : ids.eyeClipR;
    const irisGradId = side === "L" ? ids.irisGradL : ids.irisGradR;
    const lashStroke = isChibi ? 2.4 : 1.8;

    if (closed) {
      // Closed-eye: happy ^_^ arc (thicker stroke, slight upward curve).
      return (
        <g key={side}>
          <path
            d={`M ${ex - eyeRx} ${eyeY + 1} Q ${ex} ${eyeY - eyeRy * 0.7}, ${ex + eyeRx} ${eyeY + 1}`}
            stroke={lash}
            strokeWidth={lashStroke}
            fill="none"
            strokeLinecap="round"
          />
          {/* Outer lash flick */}
          <path
            d={`M ${ex + eyeRx - 0.5} ${eyeY + 1} Q ${ex + eyeRx + 1.5} ${eyeY - 1}, ${ex + eyeRx + 2.5} ${eyeY - 3}`}
            stroke={lash}
            strokeWidth={lashStroke * 0.7}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      );
    }

    return (
      <g key={side}>
        {/* Upper lash (thick curved stroke above eye) */}
        <path
          d={`M ${ex - eyeRx - 0.5} ${eyeY + 1}
              Q ${ex} ${eyeY - eyeRy - 1.5}, ${ex + eyeRx + 0.5} ${eyeY + 1}`}
          stroke={lash}
          strokeWidth={lashStroke}
          fill="none"
          strokeLinecap="round"
        />
        {/* Outer-corner lash flick */}
        <path
          d={`M ${ex + eyeRx - 0.5} ${eyeY + 0.5}
              Q ${ex + eyeRx + 2} ${eyeY - 2}, ${ex + eyeRx + 3} ${eyeY - 4}`}
          stroke={lash}
          strokeWidth={lashStroke * 0.7}
          fill="none"
          strokeLinecap="round"
        />
        {/* Sclera + iris + pupil (clipped to eye shape so top is cut by lash) */}
        <g className={blinkClass}>
          <g clipPath={`url(#${eyeClipId})`}>
            {/* Sclera */}
            <ellipse cx={ex} cy={eyeY} rx={eyeRx} ry={eyeRy} fill="#ffffff" />
            {/* Slight shadow at top of sclera (under upper lid) */}
            <ellipse cx={ex} cy={eyeY - eyeRy * 0.55} rx={eyeRx * 0.95} ry={eyeRy * 0.4} fill={withAlpha(lash, 0.18)} />
            {/* Iris (colored) — positioned slightly low so top is cut by lash */}
            <ellipse cx={ex} cy={eyeY + eyeRy * 0.18} rx={eyeRx * 0.92} ry={eyeRy * 0.96} fill={`url(#${irisGradId})`} />
            {/* Iris outer ring (darker) */}
            <ellipse cx={ex} cy={eyeY + eyeRy * 0.18} rx={eyeRx * 0.92} ry={eyeRy * 0.96} fill="none" stroke={c.irisRing} strokeWidth={0.8} />
            {/* Iris inner band (lighter rim) */}
            <ellipse cx={ex} cy={eyeY + eyeRy * 0.18} rx={eyeRx * 0.72} ry={eyeRy * 0.78} fill="none" stroke={c.irisLight} strokeWidth={0.6} opacity={0.6} />
            {/* Pupil */}
            <ellipse cx={ex} cy={eyeY + eyeRy * 0.22} rx={eyeRx * 0.42} ry={eyeRy * 0.5} fill={c.pupil} />
          </g>
          {/* Highlights sit ON TOP of the clipped iris (not clipped themselves) */}
          <circle cx={ex - eyeRx * 0.32} cy={eyeY - eyeRy * 0.28} r={eyeRx * 0.3} fill="#ffffff" />
          <circle cx={ex + eyeRx * 0.28} cy={eyeY + eyeRy * 0.32} r={eyeRx * 0.13} fill="#ffffff" opacity={0.85} />
          {/* Tiny sparkle highlight for "excited" */}
          {expression === "excited" && (
            <g fill="#ffffff" opacity={0.95}>
              <circle cx={ex + eyeRx * 0.05} cy={eyeY - eyeRy * 0.5} r={eyeRx * 0.08} />
              <circle cx={ex - eyeRx * 0.5} cy={eyeY + eyeRy * 0.1} r={eyeRx * 0.06} />
            </g>
          )}
          {/* Lower lash hint (just at the outer corner) */}
          <path
            d={`M ${ex + eyeRx * 0.4} ${eyeY + eyeRy * 0.85}
                Q ${ex + eyeRx * 0.7} ${eyeY + eyeRy * 1.05}, ${ex + eyeRx * 0.95} ${eyeY + eyeRy * 1.1}`}
            stroke={lash}
            strokeWidth={lashStroke * 0.4}
            fill="none"
            strokeLinecap="round"
            opacity={0.7}
          />
        </g>
      </g>
    );
  };

  // ---------- Decide per-eye open/closed state per expression ----------
  // happy    → both open
  // waving    → both closed (^_^)
  // excited   → both open + sparkles
  // calm      → both half-closed (rendered via a thinner lash + lower position)
  // wink      → left closed, right open
  let leftClosed = false;
  let rightClosed = false;
  let halfClosed = false;
  if (expression === "waving") {
    leftClosed = true;
    rightClosed = true;
  } else if (expression === "wink") {
    leftClosed = true;
    rightClosed = false;
  } else if (expression === "calm") {
    halfClosed = true;
  }

  // For half-closed (calm), render the eye with a half-lid: draw an upper
  // lid rect over the top half of the iris, with skin color.
  const renderHalfLid = (side: "L" | "R") => {
    const ex = side === "L" ? eyeLX : eyeRX;
    const eyeClipId = side === "L" ? ids.eyeClipL : ids.eyeClipR;
    return (
      <g clipPath={`url(#${eyeClipId})`}>
        <rect x={ex - eyeRx - 1} y={eyeY - eyeRy - 1} width={eyeRx * 2 + 2} height={eyeRy * 0.9} fill={c.skin} />
      </g>
    );
  };

  // ---------- Brows ----------
  // Small arches above each eye (hair color, slightly darker).
  const browY = eyeY - eyeRy - (isChibi ? 6 : 4);
  const browLen = eyeRx * 1.3;
  const renderBrow = (side: "L" | "R") => {
    const ex = side === "L" ? eyeLX : eyeRX;
    let tilt = 0; // degrees
    if (expression === "excited") tilt = side === "L" ? -6 : 6;
    if (expression === "calm") tilt = side === "L" ? 3 : -3;
    return (
      <path
        key={`brow-${side}`}
        d={`M ${ex - browLen / 2} ${browY + 1.5} Q ${ex} ${browY - 1.5}, ${ex + browLen / 2} ${browY + 1.5}`}
        stroke={c.hairDark}
        strokeWidth={isChibi ? 2.6 : 1.8}
        fill="none"
        strokeLinecap="round"
        transform={`rotate(${tilt} ${ex} ${browY})`}
      />
    );
  };

  // ---------- Nose ----------
  // Tiny dot/short line, very subtle. Skipped for chibi (too small to render
  // cleanly without looking like a freckle).
  const nose = isChibi ? null : (
    <path
      d={`M ${cx - 1} ${p.noseY} Q ${cx} ${p.noseY + 1.5}, ${cx + 1} ${p.noseY}`}
      stroke={c.skinShadow}
      strokeWidth={0.9}
      fill="none"
      strokeLinecap="round"
      opacity={0.85}
    />
  );

  // ---------- Mouth ----------
  const mouthY = p.mouthY;
  const mouthStroke = isChibi ? 2 : 1.5;
  let mouth: React.ReactNode;
  if (expression === "excited") {
    // Big open smile (filled shape).
    mouth = (
      <g>
        <path
          d={`M ${cx - 7} ${mouthY - 1}
              Q ${cx} ${mouthY + 7}, ${cx + 7} ${mouthY - 1}
              Q ${cx} ${mouthY + 1}, ${cx - 7} ${mouthY - 1}
              Z`}
          fill={c.accentDark}
        />
        {/* tongue hint */}
        <path d={`M ${cx - 3} ${mouthY + 2} Q ${cx} ${mouthY + 6}, ${cx + 3} ${mouthY + 2} Z`} fill={lighten(c.accent, 0.1)} opacity={0.8} />
      </g>
    );
  } else if (expression === "happy") {
    // Gentle smile (open curve).
    mouth = (
      <path
        d={`M ${cx - 5} ${mouthY} Q ${cx} ${mouthY + 4.5}, ${cx + 5} ${mouthY}`}
        stroke={c.accentDark}
        strokeWidth={mouthStroke}
        fill="none"
        strokeLinecap="round"
      />
    );
  } else if (expression === "waving") {
    // Wider happy smile.
    mouth = (
      <path
        d={`M ${cx - 6} ${mouthY - 1} Q ${cx} ${mouthY + 5}, ${cx + 6} ${mouthY - 1}`}
        stroke={c.accentDark}
        strokeWidth={mouthStroke}
        fill="none"
        strokeLinecap="round"
      />
    );
  } else if (expression === "calm") {
    // Small subtle smile.
    mouth = (
      <path
        d={`M ${cx - 3.5} ${mouthY + 1} Q ${cx} ${mouthY + 3}, ${cx + 3.5} ${mouthY + 1}`}
        stroke={c.accentDark}
        strokeWidth={mouthStroke * 0.9}
        fill="none"
        strokeLinecap="round"
      />
    );
  } else {
    // wink — playful asymmetric smile (one side higher).
    mouth = (
      <path
        d={`M ${cx - 5} ${mouthY + 1} Q ${cx - 1} ${mouthY + 5}, ${cx + 6} ${mouthY - 1}`}
        stroke={c.accentDark}
        strokeWidth={mouthStroke}
        fill="none"
        strokeLinecap="round"
      />
    );
  }

  // ---------- Blush ----------
  const blush = (
    <g id="blush" opacity={0.7}>
      <ellipse cx={cx - p.blushOffset} cy={p.blushY} rx={p.blushRx} ry={p.blushRy} fill={c.accent} />
      <ellipse cx={cx + p.blushOffset} cy={p.blushY} rx={p.blushRx} ry={p.blushRy} fill={c.accent} />
    </g>
  );

  return (
    <g>
      {/* Brows (behind eyes) */}
      {!leftClosed && renderBrow("L")}
      {!rightClosed && renderBrow("R")}

      {/* Eyes */}
      {renderEye("L", leftClosed)}
      {renderEye("R", rightClosed)}

      {/* Half-lids for calm expression (drawn after eyes so they cover the top) */}
      {halfClosed && !leftClosed && renderHalfLid("L")}
      {halfClosed && !rightClosed && renderHalfLid("R")}
      {halfClosed && leftClosed && renderHalfLid("L")}
      {halfClosed && rightClosed && renderHalfLid("R")}

      {/* Blush (between eyes and mouth, on cheeks) */}
      {blush}

      {/* Nose */}
      {nose}

      {/* Mouth */}
      {mouth}
    </g>
  );
}

/* ================================================================== */
/* Animation CSS                                                       */
/* ================================================================== */

const ANIMATION_CSS = `
  .ac-float {
    transform-box: fill-box;
    transform-origin: center;
    animation: ac-float-anim 4s ease-in-out infinite;
  }
  @keyframes ac-float-anim {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }
  .ac-hair-sway {
    transform-box: fill-box;
    transform-origin: 50% 0%;
    animation: ac-hair-sway-anim 3.8s ease-in-out infinite;
  }
  @keyframes ac-hair-sway-anim {
    0%, 100% { transform: rotate(-1.4deg); }
    50% { transform: rotate(1.4deg); }
  }
  .ac-tail-sway {
    transform-box: fill-box;
    transform-origin: 0% 50%;
    animation: ac-tail-sway-anim 3.2s ease-in-out infinite;
  }
  @keyframes ac-tail-sway-anim {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }
  .ac-blink {
    transform-box: fill-box;
    transform-origin: center;
    animation: ac-blink-anim 5s ease-in-out infinite;
  }
  @keyframes ac-blink-anim {
    0%, 90%, 100% { transform: scaleY(1); }
    93%, 96% { transform: scaleY(0.08); }
  }
  .ac-wave {
    /* view-box so the inline transformOrigin (shoulder position in SVG
       viewport coords) is interpreted in SVG user space, not relative to
       the arm's bounding box. */
    transform-box: view-box;
    animation: ac-wave-anim 1.4s ease-in-out infinite;
  }
  @keyframes ac-wave-anim {
    0%, 100% { transform: rotate(-12deg); }
    50% { transform: rotate(18deg); }
  }
  .ac-bounce {
    transform-box: fill-box;
    transform-origin: center;
    animation: ac-bounce-anim 0.7s ease-in-out infinite;
  }
  @keyframes ac-bounce-anim {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  @media (prefers-reduced-motion: reduce) {
    .ac-float, .ac-hair-sway, .ac-tail-sway, .ac-blink, .ac-wave, .ac-bounce {
      animation: none !important;
    }
  }
`;

/* ================================================================== */
/* Main component                                                      */
/* ================================================================== */

export interface AnimeCharacterProps {
  /** Character appearance configuration. */
  config: CharacterConfig;
  /** Rendered pixel size (square). Defaults to 200. */
  size?: number;
  /** Whether to enable idle animations (float, sway, blink, wave, bounce).
   *  Defaults to true. Respects `prefers-reduced-motion`. */
  animated?: boolean;
  /** Optional className applied to the root <svg>. */
  className?: string;
}

export function AnimeCharacter({
  config,
  size = 200,
  animated = true,
  className,
}: AnimeCharacterProps) {
  const reactId = useId();
  // useId returns something like ":r5:" — strip colons so it's a valid
  // SVG/HTML id.
  const uid = reactId.replace(/[^a-zA-Z0-9_-]/g, "");
  const ids = {
    hairGrad: `ac-hg-${uid}`,
    outfitGrad: `ac-og-${uid}`,
    eyeClipL: `ac-ecl-${uid}`,
    eyeClipR: `ac-ecr-${uid}`,
    irisGradL: `ac-igl-${uid}`,
    irisGradR: `ac-igr-${uid}`,
  };

  const p = getProportions(config.artStyle);
  const c = deriveColors(config);

  const layerProps: LayerProps = { config, p, c, ids, animated };

  // Wrapper class: float always, bounce additionally when excited.
  const wrapperClass = animated
    ? `ac-float${config.expression === "excited" ? " ac-bounce" : ""}`
    : undefined;

  const eyeLX = p.headCx - p.eyeOffset;
  const eyeRX = p.headCx + p.eyeOffset;

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`Anime ${config.artStyle} character, ${config.hairStyle} hair, ${config.expression} expression`}
    >
      <defs>
        {/* Hair gradient (top light → bottom dark) */}
        <linearGradient id={ids.hairGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.hairLight} />
          <stop offset="55%" stopColor={c.hair} />
          <stop offset="100%" stopColor={c.hairDark} />
        </linearGradient>
        {/* Outfit gradient */}
        <linearGradient id={ids.outfitGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.outfitLight} />
          <stop offset="100%" stopColor={c.outfitDark} />
        </linearGradient>
        {/* Iris gradients (top light → bottom dark for depth) */}
        <radialGradient id={ids.irisGradL} cx="0.5" cy="0.35" r="0.75">
          <stop offset="0%" stopColor={c.irisLight} />
          <stop offset="55%" stopColor={c.iris} />
          <stop offset="100%" stopColor={c.irisDark} />
        </radialGradient>
        <radialGradient id={ids.irisGradR} cx="0.5" cy="0.35" r="0.75">
          <stop offset="0%" stopColor={c.irisLight} />
          <stop offset="55%" stopColor={c.iris} />
          <stop offset="100%" stopColor={c.irisDark} />
        </radialGradient>
        {/* Eye clip paths (so iris is naturally cut by upper lash line) */}
        <clipPath id={ids.eyeClipL}>
          <ellipse cx={eyeLX} cy={p.eyeY} rx={p.eyeRx} ry={p.eyeRy} />
        </clipPath>
        <clipPath id={ids.eyeClipR}>
          <ellipse cx={eyeRX} cy={p.eyeY} rx={p.eyeRx} ry={p.eyeRy} />
        </clipPath>
      </defs>

      {animated && <style>{ANIMATION_CSS}</style>}

      <g className={wrapperClass}>
        <HairBack {...layerProps} />
        <Tail {...layerProps} />
        <Body {...layerProps} />
        <Outfit {...layerProps} />
        <Head {...layerProps} />
      </g>
    </svg>
  );
}

export default AnimeCharacter;
