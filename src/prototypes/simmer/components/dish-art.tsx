"use client";

/* simmer / components/dish-art — generative clay dish illustration.
   Built from the recipe's `art` descriptor: a puffy vessel (pan with
   handle / bowl / tray / pancake stack / soup pot) plus data-driven
   ingredient blobs on top. Pure CSS divs with the clay shadow tokens —
   no SVG, no bitmaps. Blobs alternate the recipe's three colors and
   pseudo-random offsets so every dish reads as its own little still
   life while sharing one construction language. */

import type { CSSProperties } from "react";
import type { Recipe } from "../lib/data";

/* deterministic blob placement: seeded per (recipe, index) */
function blobStyle(c: [string, string, string], i: number, dots: number): CSSProperties {
  const seed = (i * 2654435761 + dots * 40503) >>> 0;
  const a1 = (seed % 100) / 100;
  const a2 = ((seed >> 7) % 100) / 100;
  const angle = (i / Math.max(dots, 1)) * Math.PI * 2 + a1 * 0.9;
  const radius = 22 + a2 * 18; // % from center
  const size = 22 + ((seed >> 3) % 14);
  const color = c[i % 3];
  return {
    width: size,
    height: size * 0.78,
    background: color,
    left: `calc(50% + ${Math.cos(angle) * radius}% - ${size / 2}px)`,
    top: `calc(46% + ${Math.sin(angle) * radius * 0.62}% - ${size / 2}px)`,
    transform: `rotate(${(a1 - 0.5) * 46}deg)`,
    animationDelay: `${i * 70}ms`,
  };
}

export function DishArt({ recipe, big = false }: { recipe: Recipe; big?: boolean }) {
  const { kind, c, dots } = recipe.art;
  return (
    <div
      className={`sm-dish sm-dish--${kind}${big ? " sm-dish--big" : ""}`}
      style={
        {
          "--dish-a": c[0],
          "--dish-b": c[1],
          "--dish-c": c[2],
        } as CSSProperties
      }
      aria-hidden={true}
    >
      {kind === "pan" && <span className="sm-dish-handle" />}
      {kind === "stack" ? (
        <span className="sm-dish-stack">
          <i />
          <i />
          <i />
        </span>
      ) : (
        <span className={`sm-dish-vessel sm-dish-vessel--${kind}`}>
          {kind === "pot" && (
            <>
              <span className="sm-pot-ear sm-pot-ear--l" />
              <span className="sm-pot-ear sm-pot-ear--r" />
            </>
          )}
          <span className="sm-dish-food" />
        </span>
      )}
      {Array.from({ length: dots }, (_, i) => (
        <span key={i} className="sm-dish-blob" style={blobStyle(c, i, dots)} />
      ))}
      {kind === "stack" && <span className="sm-dish-blob sm-dish-blob--peak" style={{ background: c[1] }} />}
      <span className="sm-dish-steam sm-dish-steam--1" />
      <span className="sm-dish-steam sm-dish-steam--2" />
    </div>
  );
}
