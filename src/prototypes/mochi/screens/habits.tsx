"use client";

/**
 * mochi / screens / habits — the habit grid.
 *
 * Desktop: a MULTI-CARD GRID of habits, each carrying its streak and four
 * weekly completion bars, with a DETAIL REGION on the right showing the
 * 28-day strip, the per-weekday tally and a remove button. Adding and
 * removing a habit both work and both re-derive every count on the page.
 *
 * Tablet: the grid becomes a single-column LIST and the detail becomes a
 * PREVIEW pane beside it.
 */

import { useState, type FormEvent } from "react";
import { TODAY, pct } from "../data";
import { useMochi } from "../state/mochi-context";
import { Bar, Card, CheckPuck, Fact, Ring } from "../components/atoms";
import { FlameIcon, PlusIcon, TargetIcon, TrashIcon } from "../components/icons";

/* ---- detail region ---- */
function HabitDetail() {
  const {
    habits,
    selectedHabit,
    selectHabit,
    toggleHabit,
    removeHabit,
    slots,
    streak,
    counts,
    blocks,
    weekStart,
  } = useMochi();

  const habit = habits.find((h) => h.id === selectedHabit);
  if (!habit) {
    return (
      <aside className="mch-detail mch-detail--empty" aria-label="Habit detail">
        <p>Select a habit to open it here, beside the grid.</p>
      </aside>
    );
  }

  const on = !!habit.history[habit.history.length - 1];
  const run = streak(habit);
  const done28 = habit.history.filter(Boolean).length;
  const perDay = counts(habit);
  const weekDone = perDay.reduce((a, b) => a + b, 0);
  const trend = blocks(habit);

  /* the 28-day strip, oldest first, aligned to the frozen weekday */
  const strip = habit.history.map((done, i) => {
    const back = habit.history.length - 1 - i;
    return { done, i, abs: ((TODAY.dow - back) % 7 + 7) % 7 };
  });

  return (
    <aside className="mch-detail" data-tone={habit.tone} aria-label={`${habit.name} detail`}>
      <header className="mch-detail__head">
        <span className="mch-detail__glyph" aria-hidden="true">
          <TargetIcon size={20} />
        </span>
        <div className="mch-detail__heading">
          <h2>{habit.name}</h2>
          <p>{habit.cue}</p>
        </div>
        <span className="mch-pill" data-tone={run >= 7 ? "primary" : "secondary"}>
          <FlameIcon size={13} /> {run}
        </span>
      </header>

      <div className="mch-detail__ring">
        <Ring
          ratio={pct(weekDone, 7)}
          size={112}
          stroke={13}
          tone="primary"
          label={`${weekDone} of 7 days this week`}
        >
          <strong className="mch-ring__value tnum">{weekDone}/7</strong>
          <span className="mch-ring__sub">this week</span>
        </Ring>
        <dl className="mch-facts">
          <Fact label="Target" value={`${habit.target}× a week`} />
          <Fact label="Last 28 days" value={`${done28}/28`} />
          <Fact label="Current streak" value={`${run} days`} tone={run >= 7 ? "primary" : "warn"} />
          <Fact label="Today" value={on ? "Done" : "Still open"} tone={on ? "primary" : "secondary"} />
        </dl>
      </div>

      <button
        className={`mch-toggle mch-toggle--wide ${on ? "is-on" : ""}`}
        type="button"
        onClick={() => toggleHabit(habit.id)}
        aria-pressed={on}
      >
        <CheckPuck on={on} tone={habit.tone} />
        <span>{on ? "Ticked for today — untick" : "Tick today"}</span>
      </button>

      <div className="mch-field">
        <label>Last 28 days</label>
        <div className="mch-strip" data-tone={habit.tone}>
          {strip.map((d) => (
            <span
              key={d.i}
              data-on={d.done || undefined}
              data-today={d.i === strip.length - 1 || undefined}
              title={`${d.done ? "Done" : "Missed"} — ${d.i + 1} days back`}
            />
          ))}
        </div>
        <p className="mch-hint">28 fixed days, oldest on the left, today pressed into the clay.</p>
      </div>

      <div className="mch-field">
        <label>This week by day · starts {weekStart === "mon" ? "Monday" : "Sunday"}</label>
        <ul className="mch-weekbars">
          {slots.map((s) => {
            const value = perDay[s.group];
            return (
              <li key={s.group} data-today={s.isToday || undefined}>
                <span className="mch-weekbars__day">{s.letter}</span>
                <span className="mch-weekbars__track">
                  <span
                    className="mch-weekbars__fill"
                    data-tone={habit.tone}
                    style={{ width: `${((value / 4) * 100).toFixed(1)}%` }}
                  />
                </span>
                <span className="mch-weekbars__n tnum">{value}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mch-field">
        <label>Four-week trend</label>
        <div className="mch-trend">
          {trend.map((b, i) => (
            <span key={i} className="mch-trend__col" data-now={i === trend.length - 1 || undefined}>
              <span className="mch-trend__track">
                <span
                  className="mch-trend__fill"
                  data-tone={habit.tone}
                  style={{ height: `${((b.done / b.of) * 100).toFixed(1)}%` }}
                />
              </span>
              <span className="mch-trend__n tnum">{b.done}</span>
              <span className="mch-trend__label">{i === trend.length - 1 ? "now" : `-${trend.length - 1 - i}w`}</span>
            </span>
          ))}
        </div>
      </div>

      <button
        className="mch-btn mch-btn--quiet mch-btn--row"
        type="button"
        onClick={() => removeHabit(habit.id)}
      >
        <TrashIcon size={15} /> Remove {habit.name}
      </button>

      <button className="mch-link mch-link--row" type="button" onClick={() => selectHabit(null)}>
        Close detail
      </button>
    </aside>
  );
}

export function HabitsScreen() {
  const {
    habits,
    habitProgress,
    selectedHabit,
    selectHabit,
    toggleHabit,
    addHabit,
    streak,
    blocks,
  } = useMochi();

  const [name, setName] = useState("");
  const [cue, setCue] = useState("");
  const [target, setTarget] = useState("5");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const t = Number(target);
    if (!name.trim() || !Number.isFinite(t)) return;
    addHabit(name, cue, t);
    setName("");
    setCue("");
    setTarget("5");
  };

  return (
    <div className="mch-view mch-split">
      <div className="mch-split__master">
        <Card
          title="Habits"
          sub={`${habitProgress.done} of ${habitProgress.total} done today`}
          className="mch-summarycard"
        >
          <div className="mch-summary">
            <span className="mch-summary__figure tnum">
              {Math.round(habitProgress.ratio * 100)}%
            </span>
            <Bar ratio={habitProgress.ratio} tone="primary" height={12} />
            <span className="mch-summary__caption">
              Longest active streak{" "}
              <b className="tnum">{Math.max(0, ...habits.map((h) => streak(h)))} days</b> · the
              column that keeps going wins
            </span>
          </div>
        </Card>

        <ul className="mch-habitgrid">
          {habits.map((h) => {
            const on = !!h.history[h.history.length - 1];
            const run = streak(h);
            const week = blocks(h)[3];
            return (
              <li key={h.id}>
                <article
                  className="mch-hcard"
                  data-tone={h.tone}
                  data-selected={selectedHabit === h.id || undefined}
                >
                  <header className="mch-hcard__head">
                    <button
                      type="button"
                      className="mch-hcard__title"
                      onClick={() => selectHabit(h.id)}
                      aria-pressed={selectedHabit === h.id}
                    >
                      <b>{h.name}</b>
                      <span>{h.cue}</span>
                    </button>
                    <button
                      type="button"
                      className="mch-toggle"
                      onClick={() => toggleHabit(h.id)}
                      aria-pressed={on}
                      aria-label={`${h.name} — ${on ? "done" : "not done"} today`}
                    >
                      <CheckPuck on={on} tone={h.tone} />
                    </button>
                  </header>

                  <div className="mch-hcard__stats">
                    <span className="mch-streak" data-hot={run >= 7 || undefined}>
                      <FlameIcon size={15} />
                      <b className="tnum">{run}</b>
                      <span>day streak</span>
                    </span>
                    <span className="mch-hcard__target tnum">{h.target}× / week</span>
                  </div>

                  <div className="mch-hcard__bars" aria-label="Weekly completion">
                    {blocks(h).map((b, i) => (
                      <span key={i} className="mch-hcard__bar" data-now={i === 3 || undefined}>
                        <span className="mch-hcard__bartrack">
                          <span
                            className="mch-hcard__barfill"
                            data-tone={h.tone}
                            style={{ height: `${((b.done / b.of) * 100).toFixed(1)}%` }}
                          />
                        </span>
                        <span className="mch-hcard__barn tnum">{b.done}</span>
                      </span>
                    ))}
                  </div>

                  <p className="mch-hcard__foot tnum">
                    {week.done}/{week.of} this week ·{" "}
                    {week.done >= h.target ? "target met" : `${h.target - week.done} to go`}
                  </p>
                </article>
              </li>
            );
          })}
        </ul>

        <Card title="Add a habit" sub="New habits start with a blank 28-day strip.">
          <form className="mch-form mch-form--wrap" onSubmit={submit}>
            <label className="mch-field mch-field--inline">
              <span>Habit</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Evening walk"
                aria-label="New habit name"
              />
            </label>
            <label className="mch-field mch-field--inline">
              <span>Cue</span>
              <input
                value={cue}
                onChange={(e) => setCue(e.target.value)}
                placeholder="After dinner"
                aria-label="New habit cue"
              />
            </label>
            <label className="mch-field mch-field--inline mch-field--narrow">
              <span>Target / week</span>
              <input
                value={target}
                inputMode="numeric"
                onChange={(e) => setTarget(e.target.value)}
                aria-label="New habit weekly target"
              />
            </label>
            <button className="mch-btn mch-btn--filled" type="submit">
              <PlusIcon size={15} /> Add
            </button>
          </form>
        </Card>
      </div>

      <HabitDetail />
    </div>
  );
}
