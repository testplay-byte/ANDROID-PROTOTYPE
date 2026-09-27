/* plant-art — stylized SVG illustrations generated from data
   (shape + pot tokens in lib/data.ts). No bitmap assets, no emojis.
   Colors come from .bl-scoped CSS vars (--lf-* leaf greens, --pot-* set
   per [data-pot], --art-cut the "notch" color matching the card surface). */

import type { ReactNode } from "react";
import type { PlantShape } from "../lib/data";

interface PlantArtProps {
  shape: PlantShape;
  pot: string;
  className?: string;
}

export function PlantArt({ shape, pot, className }: PlantArtProps) {
  return (
    <svg
      viewBox="0 0 96 112"
      className={"bl-art " + (className ?? "")}
      data-pot={pot}
      aria-hidden="true"
      focusable="false"
    >
      <g className="bl-art__plant">{SHAPES[shape] ?? SHAPES.pothos}</g>
      <Pot />
    </svg>
  );
}

/* ---- shared pot (drawn last = in front of stems) ---- */

function Pot() {
  return (
    <g>
      <path className="bl-pot-body" d="M28 80h40l-4.5 26a4 4 0 0 1-4 3.4H36.5a4 4 0 0 1-4-3.4L28 80z" />
      <path className="bl-pot-shade" d="M58 80h10l-4.5 26a4 4 0 0 1-4 3.4H54l4-3.4L58 80z" />
      <rect className="bl-pot-rim" x="25" y="74" width="46" height="9" rx="4.5" />
      <rect className="bl-pot-rim-hi" x="25" y="74" width="46" height="3.2" rx="1.6" />
      <ellipse className="bl-pot-soil" cx="48" cy="77.5" rx="19" ry="2.6" />
    </g>
  );
}

/* ---- leaf helpers ---- */

function MonsteraLeaf({ x, y, r, rot, flip }: { x: number; y: number; r: number; rot: number; flip?: boolean }) {
  /* rounded heart-ish leaf with fenestrations cut via --art-cut wedges */
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})${flip ? " scale(-1 1)" : ""}`}>
      <path
        className="bl-lf-2"
        d={`M0 ${r * 0.95}C ${-r} ${r * 0.5} ${-r * 1.05} ${-r * 0.45} ${-r * 0.12} ${-r * 0.9}
           0 -${r} 0 -${r} ${r * 0.12} -${r * 0.9}
           ${r * 1.05} ${-r * 0.45} ${r} ${r * 0.5} 0 ${r * 0.95}Z`}
      />
      <path className="bl-art-cut" d={`M ${r * 0.55} ${-r * 0.15} l ${r * 0.62} ${-r * 0.18} l ${r * 0.04} ${r * 0.28} l -${r * 0.66} ${r * 0.02} z`} />
      <path className="bl-art-cut" d={`M ${r * 0.5} ${r * 0.28} l ${r * 0.6} ${r * 0.02} l ${r * 0.02} ${r * 0.26} l -${r * 0.55} ${-r * 0.22} z`} />
      <path className="bl-vein" d={`M0 ${r * 0.9} L0 ${-r * 0.85}`} />
    </g>
  );
}

const SHAPES: Record<PlantShape, ReactNode> = {
  /* Monstera — big fenestrated leaves at three heights */
  monstera: (
    <g>
      <path className="bl-stem" d="M48 78C46 62 42 52 34 44" />
      <path className="bl-stem" d="M48 78C50 60 56 50 64 42" />
      <path className="bl-stem" d="M48 78V52" />
      <MonsteraLeaf x={33} y={42} r={17} rot={-18} />
      <MonsteraLeaf x={65} y={40} r={18} rot={16} flip />
      <MonsteraLeaf x={48} y={28} r={16} rot={-2} />
    </g>
  ),

  /* Snake plant — upright sword leaves, bright edge */
  snake: (
    <g>
      {[
        { x: 40, h: 60, rot: -9, w: 5 },
        { x: 48, h: 70, rot: 0, w: 5.4 },
        { x: 56, h: 58, rot: 10, w: 5 },
        { x: 34, h: 44, rot: -19, w: 4.4 },
        { x: 62, h: 47, rot: 19, w: 4.4 },
      ].map((l, i) => (
        <path
          key={i}
          className={i % 2 ? "bl-lf-deep bl-lf-edge" : "bl-lf-1 bl-lf-edge"}
          d={`M${l.x} 78C ${l.x - l.w} ${78 - l.h * 0.5} ${l.x - l.w + 1} ${78 - l.h + 6} ${l.x} ${78 - l.h}
             C ${l.x + l.w - 1} ${78 - l.h + 6} ${l.x + l.w} ${78 - l.h * 0.5} ${l.x} 78Z`}
          transform={`rotate(${l.rot} ${l.x} 78)`}
        />
      ))}
    </g>
  ),

  /* Pothos — heart leaves + a vine trailing over the rim */
  pothos: (
    <g>
      <path className="bl-stem" d="M48 78C44 66 36 62 30 56" />
      <path className="bl-stem" d="M48 78c2-12 10-16 16-22" />
      <path className="bl-stem" d="M48 78V58" />
      <HeartLeaf x={30} y={54} r={10} rot={-24} />
      <HeartLeaf x={48} y={48} r={12} rot={2} />
      <HeartLeaf x={66} y={54} r={10} rot={26} />
      <path className="bl-vine" d="M70 76c8 4 10 12 8 22" />
      <HeartLeaf x={78} y={86} r={6.5} rot={70} />
      <HeartLeaf x={79} y={98} r={5.5} rot={95} />
    </g>
  ),

  /* Fiddle-fig — slim trunk, big upright violin leaves */
  fiddle: (
    <g>
      <path className="bl-trunk" d="M48 78C47 60 49 44 50 30" />
      {[
        { x: 41, y: 34, rot: -32 },
        { x: 59, y: 36, rot: 30 },
        { x: 40, y: 50, rot: -24 },
        { x: 60, y: 52, rot: 26 },
        { x: 50, y: 24, rot: -2 },
      ].map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.rot})`}>
          <path
            className={i % 2 ? "bl-lf-deep" : "bl-lf-1"}
            d="M0 12C -7 8 -8 -4 -4 -11 -1 -15 1 -15 4 -11 8 -4 7 8 0 12Z"
          />
          <path className="bl-vein" d="M0 11V-12" />
        </g>
      ))}
    </g>
  ),

  /* Echeveria — tight rosette of plump petals */
  succulent: (
    <g>
      {Array.from({ length: 8 }, (_, i) => i * 45).map((rot) => (
        <ellipse key={`o${rot}`} className="bl-lf-2" cx={48} cy={60} rx={7.5} ry={15} transform={`rotate(${rot} 48 75)`} />
      ))}
      {Array.from({ length: 8 }, (_, i) => i * 45 + 22).map((rot) => (
        <ellipse key={`i${rot}`} className="bl-lf-hi" cx={48} cy={66} rx={5.6} ry={11} transform={`rotate(${rot} 48 75)`} />
      ))}
      <circle className="bl-lf-hi" cx={48} cy={73.5} r={4} />
    </g>
  ),

  /* Calathea — striped leaves fanned on thin stems */
  calathea: (
    <g>
      <path className="bl-stem" d="M44 78c-4-10-8-14-12-18" />
      <path className="bl-stem" d="M48 78V50" />
      <path className="bl-stem" d="M52 78c4-10 8-14 12-18" />
      {[
        { x: 32, y: 56, rot: -26 },
        { x: 48, y: 46, rot: -2 },
        { x: 64, y: 56, rot: 26 },
      ].map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.rot})`}>
          <path className="bl-lf-deep" d="M0 13C -6.5 9 -7.5 -3 -4 -10 -1.4 -14 1.4 -14 4 -10 7.5 -3 6.5 9 0 13Z" />
          {[-6, -2.5, 1, 4.5].map((px) => (
            <path key={px} className="bl-lf-stripe" d={`M0 -9C ${px * 0.7} -4 ${px * 0.85} 2 0 9`} />
          ))}
          <path className="bl-vein" d="M0 12V-10" />
        </g>
      ))}
    </g>
  ),

  /* ZZ plant — two arching stems of glossy paired leaflets */
  zz: (
    <g>
      <path className="bl-trunk" d="M46 78C40 62 36 52 30 40" />
      <path className="bl-trunk" d="M50 78c5-16 9-24 15-34" />
      {[
        { x: 38, y: 58, rot: -28 },
        { x: 33, y: 46, rot: -34 },
        { x: 58, y: 58, rot: 28 },
        { x: 64, y: 46, rot: 34 },
      ].map((l, i) => (
        <ellipse key={i} className="bl-lf-gloss" cx={l.x} cy={l.y} rx={5} ry={9.5} transform={`rotate(${l.rot} ${l.x} ${l.y})`} />
      ))}
      <ellipse className="bl-lf-gloss" cx={29} cy={37} rx={4.6} ry={9} transform="rotate(-40 29 37)" />
      <ellipse className="bl-lf-gloss" cx={66} cy={41} rx={4.6} ry={9} transform="rotate(38 66 41)" />
    </g>
  ),
};

function HeartLeaf({ x, y, r, rot }: { x: number; y: number; r: number; rot: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path
        className="bl-lf-2"
        d={`M0 ${r}C ${-r * 1.15} ${r * 0.35} ${-r * 0.9} ${-r * 0.8} ${-r * 0.16} ${-r * 0.72}
           0 -${r * 0.7} 0 -${r * 0.7} ${r * 0.16} -${r * 0.72}
           ${r * 0.9} ${-r * 0.8} ${r * 1.15} ${r * 0.35} 0 ${r}Z`}
      />
      <path className="bl-vein" d={`M0 ${r * 0.95}V-${r * 0.6}`} />
    </g>
  );
}
