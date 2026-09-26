"use client";

/**
 * ExhibitionsScreen — 2 feature cards with pure-CSS geometric posters,
 * title / dates / price, and a TICKETS button (2px ink border, 0 radius,
 * primary red). Tapping TICKETS toggles a booked/added state.
 */

import { useState } from "react";
import { TopBar } from "../../../proto-kit";
import { GeometricPoster } from "../components/geometric-poster";
import { EXHIBITIONS } from "../lib/data";
import styles from "./exhibitions-screen.module.css";

export function ExhibitionsScreen() {
  const [ticketed, setTicketed] = useState<Record<number, boolean>>({});

  return (
    <div className={styles.root}>
      <TopBar variant="hero" title="Exhibitions" subtitle="Galerie Bauhaus" />

      <div className={styles.content}>
        {EXHIBITIONS.map((ex) => {
          const booked = !!ticketed[ex.id];
          return (
            <article key={ex.id} className={styles.card}>
              <GeometricPoster poster={ex.poster} />

              <div className={styles.body}>
                <h2 className={styles.title}>{ex.title}</h2>
                <div className={styles.metaRow}>
                  <span className={styles.dates}>{ex.dates}</span>
                  <span className={styles.price}>EUR {ex.price}</span>
                </div>

                <button
                  type="button"
                  className={`${styles.tickets} ${booked ? styles.ticketsOn : ""}`}
                  aria-pressed={booked}
                  onClick={() =>
                    setTicketed((prev) => ({ ...prev, [ex.id]: !prev[ex.id] }))
                  }
                >
                  {booked ? "TICKETS — 1" : "TICKETS"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
