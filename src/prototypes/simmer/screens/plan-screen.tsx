"use client";

/* simmer / screens/plan — the week, then the list it implies.
   Five chunky day cards, each with a midday + evening slot; tapping a
   slot opens the picker sheet. Below, the shopping list auto-derives
   from whatever is planned, grouped by aisle, every line a checkable
   clay checkbox (persisted). */

import type { CSSProperties } from "react";
import { DishArt } from "../components/dish-art";
import { CartIcon, PlusIcon } from "../components/icons";
import { useSimmer } from "../state/simmer-context";
import {
  AISLES,
  PLAN_DAYS,
  PLAN_SLOTS,
  formatMinutes,
  formatQty,
  planEntries,
  recipeById,
  shoppingList,
  type PlanDay,
  type PlanSlot,
  type WeekPlan,
} from "../lib/data";

const SLOT_LABEL: Record<PlanSlot, string> = { midday: "Midday", evening: "Evening" };

export function PlanScreen() {
  const { plan, openPicker, checkedLines, toggleLine, clearCheckedLines } = useSimmer();
  const list = shoppingList(plan);
  const meals = planEntries(plan).filter((e) => e.recipe).length;
  const totalLines = AISLES.reduce((n, a) => n + list[a].length, 0);
  const checkedCount = checkedLines.length;

  return (
    <section className="sm-screen">
      <header className="sm-head">
        <div className="sm-head-row">
          <span className="sm-head-kicker">This week</span>
          <span className="sm-head-pill tnum">
            {meals} meals
          </span>
        </div>
        <h1 className="sm-head-title">Meal plan</h1>
      </header>

      <div className="sm-content">
        {/* day cards */}
        <div className="sm-days">
          {PLAN_DAYS.map((day: PlanDay, di) => (
            <article key={day} className="sm-day sm-rise" style={{ "--stagger": di } as CSSProperties}>
              <div className="sm-day-top">
                <h2 className="sm-day-name">{day}</h2>
                <span className="sm-day-n tnum">{countFor(plan, day)}</span>
              </div>
              {PLAN_SLOTS.map((slot: PlanSlot) => {
                const r = recipeById(plan[day][slot] ?? "");
                return (
                  <button
                    key={slot}
                    type="button"
                    className={`sm-slot${r ? "" : " sm-slot--empty"}`}
                    onClick={() => openPicker({ day, slot })}
                    aria-label={`${day} ${SLOT_LABEL[slot]} — ${r ? r.name : "empty, choose a recipe"}`}
                  >
                    {r ? (
                      <>
                        <span className="sm-slot-art">
                          <DishArt recipe={r} />
                        </span>
                        <span className="sm-slot-txt">
                          <small>{SLOT_LABEL[slot]}</small>
                          <b>{r.name}</b>
                          <small className="tnum">{formatMinutes(r.minutes)}</small>
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="sm-slot-plus">
                          <PlusIcon size={14} />
                        </span>
                        <span className="sm-slot-txt">
                          <small>{SLOT_LABEL[slot]}</small>
                          <b>Add a recipe</b>
                        </span>
                      </>
                    )}
                  </button>
                );
              })}
            </article>
          ))}
        </div>

        {/* derived shopping list */}
        <div className="sm-sect sm-rise" style={{ "--stagger": 5 } as CSSProperties}>
          <div className="sm-sect-head">
            <h2>
              <span className="sm-sect-ico">
                <CartIcon size={15} />
              </span>
              Shopping list
            </h2>
            <span className="sm-sect-n tnum">
              {checkedCount}/{totalLines}
            </span>
          </div>
          <p className="sm-list-note">
            Auto-derived from the {meals} meals above — grouped by aisle, quantities merged.
            {checkedCount > 0 && (
              <button type="button" className="sm-list-clear" onClick={clearCheckedLines}>
                Reset ticks
              </button>
            )}
          </p>

          {totalLines === 0 ? (
            <div className="sm-empty">
              <p>The week is empty — tap a slot and the list fills itself.</p>
            </div>
          ) : (
            AISLES.map(
              (aisle) =>
                list[aisle].length > 0 && (
                  <div key={aisle} className="sm-aisle">
                    <h3 className="sm-aisle-head">{aisle}</h3>
                    <ul className="sm-lines">
                      {list[aisle].map((line) => {
                        const on = checkedLines.includes(line.key);
                        return (
                          <li key={line.key}>
                            <button
                              type="button"
                              className={`sm-line${on ? " sm-line--on" : ""}`}
                              onClick={() => toggleLine(line.key)}
                              aria-pressed={on}
                            >
                              <span className="sm-line-box">{on && <TickSvg />}</span>
                              <span className="sm-line-name">{line.name}</span>
                              <span className="sm-line-qty tnum">
                                {formatQty(round1(line.qty), line.unit)}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ),
            )
          )}
        </div>
      </div>
    </section>
  );
}

function countFor(plan: WeekPlan, day: PlanDay): number {
  return PLAN_SLOTS.filter((s) => plan[day][s]).length;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function TickSvg() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m4.5 12.5 5 5L19.5 7" />
    </svg>
  );
}
