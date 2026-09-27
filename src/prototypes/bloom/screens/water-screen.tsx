"use client";

/* water-screen — today's care schedule: streak card (flame-leaf + spring
   counter), checklist rows (droplet ripple + strike-through + weekly bar
   fill) and the upcoming 7-day strip with due-days tinted. */

import type { CSSProperties } from "react";
import { useBloom } from "../state/bloom-context";
import { dayPillLabel, thirstOf, thirstState } from "../lib/data";
import { PlantArt } from "../components/plant-art";
import { DropIcon, FlameLeafIcon } from "../components/icons";

/** the schedule = every plant at/over 60% thirst (due or nearly), sorted by slot */
function dueList(plants: ReturnType<typeof useBloom>["plants"]) {
  return plants
    .filter((p) => {
      const t = thirstOf(p);
      return t >= 60;
    })
    .sort((a, b) => a.slot.localeCompare(b.slot));
}

export function WaterScreen() {
  const { plants, checks, toggleCheck, streak } = useBloom();
  const due = dueList(plants);
  const doneCount = due.filter((p) => checks.includes(p.id)).length;
  const allDone = due.length > 0 && doneCount === due.length;
  /* week = the 4 days already banked + today's tasks (fills as you tick) */
  const weekPct = Math.round(((4 + doneCount) / (4 + Math.max(due.length, 1))) * 100);

  const week = Array.from({ length: 7 }, (_, i) => {
    const { top, big } = dayPillLabel(i);
    // deterministic demo rhythm: waterings land on days 0, 2, 3, 5 (+6 next cycle)
    const hasDue = [0, 2, 3, 5].includes(i) || (i === 1 && due.length > 2);
    return { top, big, hasDue, isToday: i === 0 };
  });

  return (
    <section className="bl-screen" aria-label="Water">
      <div className="bl-content">
        <header className="bl-greet" style={{ ["--stagger" as string]: "0ms" } as CSSProperties}>
          <h1 className="bl-greet__title">Watering</h1>
          <p className="bl-greet__sub">
            {allDone ? "All caught up — your plants thank you." : `${doneCount} of ${due.length} tasks done today`}
          </p>
        </header>

        {/* streak card */}
        <div className="bl-streak" style={{ ["--stagger" as string]: "70ms" } as CSSProperties}>
          <span className="bl-streak__flame" aria-hidden="true">
            <FlameLeafIcon size={30} />
          </span>
          <div className="bl-streak__text">
            <span className="bl-streak__num tnum" key={streak}>
              {streak}
              <small>-day streak</small>
            </span>
            <span className="bl-streak__sub">Keep it alive — one watering a day keeps it going.</span>
          </div>
          <div className="bl-streak__ring" aria-hidden="true">
            <span className={"bl-streak__dot" + (checks.length > 0 ? " on" : "")} />
          </div>
        </div>

        {/* weekly progress */}
        <div className="bl-week" style={{ ["--stagger" as string]: "120ms" } as CSSProperties}>
          <div className="bl-week__head">
            <span>This week</span>
            <b className="tnum">{weekPct}%</b>
          </div>
          <div
            className="bl-week__track"
            role="progressbar"
            aria-valuenow={weekPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Weekly care progress"
          >
            <span className="bl-week__fill" style={{ width: `${weekPct}%` }} />
          </div>
        </div>

        {/* today's checklist */}
        <h2 className="bl-sechead" style={{ ["--stagger" as string]: "170ms" } as CSSProperties}>
          Today&apos;s schedule
        </h2>
        <ul className="bl-tasks">
          {due.map((plant, i) => {
            const checked = checks.includes(plant.id);
            const state = thirstState(thirstOf(plant));
            return (
              <li key={plant.id} style={{ ["--stagger" as string]: `${190 + i * 55}ms` } as CSSProperties}>
                <button
                  type="button"
                  className={"bl-task" + (checked ? " done" : "")}
                  aria-pressed={checked}
                  onClick={() => toggleCheck(plant.id)}
                >
                  <span className="bl-task__slot tnum">{plant.slot}</span>
                  <span className="bl-task__art" aria-hidden="true">
                    <PlantArt shape={plant.shape} pot={plant.pot} />
                  </span>
                  <span className="bl-task__text">
                    <span className="bl-task__name">{plant.name}</span>
                    <span className="bl-task__meta">
                      {plant.task}
                      {state === "parched" || state === "due" ? " · thirsty" : " · soon"}
                    </span>
                  </span>
                  <span className={"bl-check" + (checked ? " on" : "")} aria-hidden="true">
                    <svg className="bl-check__drop" viewBox="0 0 24 24" width="13" height="13">
                      <path
                        d="M12 3.2c3.4 4 6.4 7.4 6.4 11a6.4 6.4 0 0 1-12.8 0c0-3.6 3-7 6.4-11z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="bl-ripple" />
                  </span>
                </button>
              </li>
            );
          })}
          {due.length === 0 ? (
            <li className="bl-empty" style={{ ["--stagger" as string]: "200ms" } as CSSProperties}>
              <DropIcon size={22} />
              Nothing due today — enjoy the green.
            </li>
          ) : null}
        </ul>

        {/* upcoming week */}
        <h2 className="bl-sechead" style={{ ["--stagger" as string]: "300ms" } as CSSProperties}>
          Upcoming week
        </h2>
        <div className="bl-days" style={{ ["--stagger" as string]: "330ms" } as CSSProperties}>
          {week.map((d) => (
            <div
              key={d.top + d.big}
              className={"bl-day" + (d.hasDue ? " due" : "") + (d.isToday ? " today" : "")}
            >
              <span className="bl-day__top">{d.top}</span>
              <span className="bl-day__big tnum">{d.big}</span>
              {d.hasDue ? <span className="bl-day__drop" aria-hidden="true" /> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
