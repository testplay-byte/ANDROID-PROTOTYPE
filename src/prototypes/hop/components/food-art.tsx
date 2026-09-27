/**
 * hop / components / food-art — the flat food illustrations.
 *
 * Every "photo" in Hop is a data-driven solid-colour composition: one of
 * four silhouette recipes (pizza / sushi / salad / brew), painted with the
 * cuisine's art palette on a flat plate block. No gradients, no strokes —
 * pure filled geometry. `seed` varies garnish placement between items of
 * the same cuisine so rows don't look cloned.
 */

import type { ArtShape, Cuisine } from "../lib/data";

interface FoodArtProps {
  shape: ArtShape;
  cuisine: Cuisine;
  /** 0..n — deterministic garnish offset. */
  seed?: number;
  size?: number;
  /** Background plane of the tile (defaults to surface-2). */
  bg?: string;
  className?: string;
}

export function FoodArt({ shape, cuisine, seed = 0, size = 64, bg, className }: FoodArtProps) {
  const { art } = cuisine;
  const back = bg ?? "var(--color-surface-2)";
  const k = seed % 3;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <rect width="64" height="64" fill={back} />
      {shape === "pizza" && <Pizza art={art} k={k} />}
      {shape === "sushi" && <Sushi art={art} k={k} />}
      {shape === "salad" && <Salad art={art} k={k} />}
      {shape === "brew" && <Brew art={art} k={k} />}
    </svg>
  );
}

type Art = Cuisine["art"];

function Pizza({ art, k }: { art: Art; k: number }) {
  /* full pie disc + one lifted triangular slice, flat pepperoni dots */
  return (
    <g>
      <rect x="8" y="46" width="48" height="6" fill={art.plate} />
      <circle cx="32" cy="30" r="19" fill={art.base} />
      <circle cx="25" cy="24" r="3.4" fill={art.accent} />
      <circle cx="37" cy="27" r="3.4" fill={art.accent} />
      <circle cx="29" cy="36" r="3.4" fill={art.accent} />
      <circle cx="39" cy="37" r="3.4" fill={art.accent} />
      {/* lifted slice */}
      <path
        d={
          k === 0
            ? "M52 12 61 22 47 26Z"
            : k === 1
              ? "M50 9 61 17 49 24Z"
              : "M53 14 60 25 46 25Z"
        }
        fill={art.base}
      />
      <path d={k === 0 ? "M55 16.5 58.5 20 53 21.6Z" : k === 1 ? "M54 13.5 58 16.5 53 19Z" : "M55 18 57.5 22.5 51.5 22.5Z"} fill={art.accent} />
      {k === 2 && <circle cx="17" cy="41" r="2.6" fill={art.garnish} />}
      {k !== 2 && <path d="M40 42c3-1 5-3 6-6 2 3 1 7-2 9-2 1-4 0-4-3Z" fill={art.garnish} />}
    </g>
  );
}

function Sushi({ art, k }: { art: Art; k: number }) {
  /* tray block + two nigiri bricks with nori bands + chopstick bars */
  return (
    <g>
      <rect x="6" y="38" width="52" height="14" fill={art.plate} />
      <rect x="11" y={k === 1 ? "24" : "22"} width="18" height="12" rx="5" fill={art.base} />
      <rect x="16" y={k === 1 ? "24" : "22"} width="7" height="12" fill={art.accent} />
      <rect x="34" y={k === 2 ? "26" : "24"} width="18" height="12" rx="5" fill={art.base} />
      <rect x="39" y={k === 2 ? "26" : "24"} width="7" height="12" fill={art.accent} />
      {/* nori bands */}
      <rect x="18" y={k === 1 ? "24" : "22"} width="3" height="12" fill={art.garnish} />
      <rect x="41" y={k === 2 ? "26" : "24"} width="3" height="12" fill={art.garnish} />
      {/* chopsticks */}
      <rect x="44" y="8" width="16" height="2.6" rx="1.3" transform="rotate(24 44 8)" fill={art.plate} />
      <rect x="44" y="13" width="16" height="2.6" rx="1.3" transform="rotate(20 44 13)" fill={art.plate} />
      {k === 0 && <circle cx="12" cy="14" r="4" fill={art.accent} />}
    </g>
  );
}

function Salad({ art, k }: { art: Art; k: number }) {
  /* half-circle bowl + three leaf blobs + tomato dots climbing out */
  return (
    <g>
      <path d="M8 34a24 24 0 0 0 48 0Z" fill={art.plate} />
      <circle cx="23" cy="27" r="8" fill={art.base} />
      <circle cx="35" cy="23" r="9" fill={art.accent} />
      <circle cx="44" cy="29" r="7" fill={art.base} />
      <circle cx="29" cy="17" r="6" fill={art.accent} />
      <circle cx={k === 0 ? "18" : k === 1 ? "31" : "41"} cy={k === 2 ? "16" : "13"} r="3.4" fill={art.garnish} />
      <circle cx={k === 0 ? "43" : "22"} cy={k === 1 ? "14" : "18"} r="3.4" fill={art.garnish} />
      <rect x="8" y="32.5" width="48" height="3.5" fill={art.accent} />
    </g>
  );
}

function Brew({ art, k }: { art: Art; k: number }) {
  /* tapered pint with foam cap, blocky handle, flat straw variant */
  return (
    <g>
      <rect x="10" y="50" width="36" height="5" fill={art.plate} />
      <path d="M16 16h24l-3 34H19Z" fill={art.base} />
      <path d="M15.4 12h25.2c1 4-1.4 7-6 7.6-2.6.4-5.6.4-8.4-.2-3-.6-5.6-2.4-6.8-7.4Z" fill={art.accent} />
      <circle cx="22" cy="10.5" r="4" fill={art.accent} />
      <circle cx="31" cy="8.6" r="4.6" fill={art.accent} />
      <circle cx="39.5" cy="10.8" r="3.6" fill={art.accent} />
      {/* label block */}
      <rect x="20" y={k === 1 ? "26" : "29"} width="16" height="8" fill={art.garnish} />
      {k === 2 && <rect x="36" y="4" width="3" height="16" rx="1.5" transform="rotate(14 36 4)" fill={art.accent} />}
    </g>
  );
}
