"use client";

/* home-screen — greeting + the plant collection grid.
   Cards open the plant bottom sheet; the thirst rings animate on mount. */

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useBloom } from "../state/bloom-context";
import { greeting, thirstOf, thirstState } from "../lib/data";
import { PlantCard } from "../components/plant-card";
import { DropIcon, LeafIcon } from "../components/icons";

export function HomeScreen() {
  const { plants, selectPlant } = useBloom();
  /* clock-dependent text resolves client-side only (no hydration mismatch) */
  const [greet, setGreet] = useState("Good morning");
  useEffect(() => setGreet(greeting()), []);
  const dueNow = plants.filter((p) => {
    const s = thirstState(thirstOf(p));
    return s === "due" || s === "parched";
  }).length;
  const soon = plants.filter((p) => thirstState(thirstOf(p)) === "soon").length;

  return (
    <section className="bl-screen" aria-label="Home">
      <div className="bl-content">
        <header className="bl-greet" style={{ ["--stagger" as string]: "0ms" } as CSSProperties}>
          <h1 className="bl-greet__title">
            {greet}
            <LeafIcon size={24} className="bl-greet__leaf" />
          </h1>
          <p className="bl-greet__sub">
            {plants.length} plants thriving{dueNow > 0 ? ` · ${dueNow} need water` : " · all hydrated"}
          </p>
        </header>

        <div className="bl-chips" style={{ ["--stagger" as string]: "70ms" } as CSSProperties}>
          <span className="bl-chip bl-chip--due">
            <DropIcon size={14} />
            <b className="tnum">{dueNow}</b> due today
          </span>
          <span className="bl-chip">
            <LeafIcon size={14} />
            <b className="tnum">{soon}</b> thirsty soon
          </span>
        </div>

        <h2 className="bl-sechead" style={{ ["--stagger" as string]: "140ms" } as CSSProperties}>
          Your plants
        </h2>

        <div className="bl-pgrid">
          {plants.map((plant, i) => (
            <PlantCard key={plant.id} plant={plant} index={2 + i} onOpen={selectPlant} />
          ))}
        </div>
      </div>
    </section>
  );
}
