"use client";

/**
 * mochi / screens / today — the soft dashboard.
 *
 * Desktop layout: TWO independent columns of puffy cards (money on the
 * left, the day on the right) rather than one long phone-style list. The
 * balance ring is computed from the live category state, so editing a
 * limit on #budget moves this dial immediately; the habit checkboxes write
 * to the same history the #habits grid reads.
 *
 * At the tablet breakpoint the two columns collapse into a single column —
 * one long column of cards, which is the tablet's correct shape.
 */

import { BALANCE, SPEND_30, SPEND_30_LABEL, money, moneyK } from "../data";
import { useMochi } from "../state/mochi-context";
import { Bar, Card, CheckPuck, Fact, Ring } from "../components/atoms";
import { SpendSpark } from "../components/sparkline";
import { CheckIcon, ClockIcon, FlameIcon, TargetIcon, TrendIcon } from "../components/icons";

export function TodayScreen() {
  const {
    today,
    budget,
    habits,
    habitProgress,
    slots,
    streak,
    agenda,
    toggleHabit,
    toggleAgenda,
    go,
    weekStart,
  } = useMochi();

  const dailyAvg = SPEND_30_LABEL.total / SPEND_30.length;
  const paceOk = budget.ratio <= 0.85;
  const ringTone = budget.ratio > 1 ? "error" : budget.ratio > 0.9 ? "warn" : "primary";
  const agendaLeft = agenda.filter((a) => !a.done).length;
  const allDone = habitProgress.total > 0 && habitProgress.done === habitProgress.total;

  /* One column of pips per day: one pip per habit, filled when that habit
     was completed on that day. The columns are re-ordered by the week-start
     preference, so switching it visibly slides the strip. */
  const weekPips = slots.map((s) =>
    habits.map((h) => {
      const idx = h.history.length - 1 - s.back;
      return { habit: h, on: idx >= 0 && !!h.history[idx] };
    })
  );

  return (
    <div className="mch-view mch-today">
      {/* ---------------- left column: money ---------------- */}
      <div className="mch-today__col">
        <Card
          title={`${today.weekday} ${today.day} ${today.monthShort}`}
          sub="September so far · pinned demo day"
          meta={
            <span className="mch-pill" data-tone={paceOk ? "primary" : "warn"}>
              {paceOk ? "On pace" : "Watch it"}
            </span>
          }
        >
          <div className="mch-balance">
            <Ring
              ratio={budget.ratio}
              size={132}
              stroke={15}
              tone={ringTone}
              label={`${Math.round(budget.ratio * 100)} per cent of the monthly budget spent`}
            >
              <strong className="mch-ring__value tnum">{Math.round(budget.ratio * 100)}%</strong>
              <span className="mch-ring__sub">spent</span>
            </Ring>

            <dl className="mch-facts">
              <Fact label="In the account" value={money(BALANCE.available)} />
              <Fact label="Monthly budget" value={money(budget.limit)} />
              <Fact label="Spent this month" value={money(budget.spent)} tone={ringTone} />
              <Fact label="Still unspent" value={money(budget.left)} tone="primary" />
              <Fact
                label="Day pace"
                value={`${moneyK(dailyAvg)} / day`}
                tone={paceOk ? "primary" : "warn"}
              />
            </dl>
          </div>

          <Bar ratio={budget.ratio} tone={ringTone} height={12} className="mch-balance__bar" />

          <p className="mch-note">
            <TrendIcon size={15} />
            <span>
              Six no-spend days in the last 30 — that is what keeps the month under{" "}
              <b className="tnum">{money(budget.left)}</b>.{" "}
              <button className="mch-link" type="button" onClick={() => go("budget")}>
                Open budget
              </button>
            </span>
          </p>
        </Card>

        <Card
          title="Last 30 days"
          sub="Daily spend, 31 Aug → 29 Sep"
          meta={<span className="mch-card__meta tnum">{money(SPEND_30_LABEL.total)}</span>}
        >
          <SpendSpark values={SPEND_30} />
          <div className="mch-chiprow">
            <span className="mch-stat">
              <b className="tnum">{moneyK(SPEND_30_LABEL.peak)}</b>
              <span>peak day</span>
            </span>
            <span className="mch-stat">
              <b className="tnum">{moneyK(dailyAvg)}</b>
              <span>daily average</span>
            </span>
            <span className="mch-stat">
              <b className="tnum">{SPEND_30_LABEL.dryDays}</b>
              <span>no-spend days</span>
            </span>
            <span className="mch-stat">
              <b className="tnum">{money(BALANCE.saved)}</b>
              <span>moved to savings</span>
            </span>
          </div>
        </Card>
      </div>

      {/* ---------------- right column: the day ---------------- */}
      <div className="mch-today__col">
        <Card
          title="Habits today"
          sub={`Week starts ${weekStart === "mon" ? "Monday" : "Sunday"}`}
          meta={
            <span className="mch-pill" data-tone={allDone ? "primary" : "secondary"}>
              <TargetIcon size={13} /> {habitProgress.done}/{habitProgress.total}
            </span>
          }
        >
          <div className="mch-progress">
            <Bar ratio={habitProgress.ratio} tone="primary" height={12} />
            <span className="mch-progress__label tnum">{Math.round(habitProgress.ratio * 100)}% of today</span>
          </div>

          <ul className="mch-checklist">
            {habits.map((h) => {
              const on = !!h.history[h.history.length - 1];
              const run = streak(h);
              return (
                <li key={h.id} data-on={on || undefined} data-tone={h.tone}>
                  <button
                    type="button"
                    className="mch-check"
                    onClick={() => toggleHabit(h.id)}
                    aria-pressed={on}
                    aria-label={`${h.name} — ${on ? "done" : "not done"} today`}
                  >
                    <CheckPuck on={on} tone={h.tone} />
                    <span className="mch-check__body">
                      <b>{h.name}</b>
                      <span>{h.cue}</span>
                    </span>
                    <span className="mch-check__streak" data-hot={run >= 7 || undefined}>
                      <FlameIcon size={13} />
                      <span className="tnum">{run}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mch-weekdots" aria-label="Habits completed on each of the last seven days">
            {slots.map((s, i) => (
              <span key={s.group} className="mch-weekdots__col" data-today={s.isToday || undefined}>
                <span className="mch-weekdots__pips">
                  {weekPips[i].map((p) => (
                    <i key={p.habit.id} data-on={p.on || undefined} data-tone={p.habit.tone} />
                  ))}
                </span>
                <span className="mch-weekdots__letter">{s.letter}</span>
              </span>
            ))}
          </div>

          <button className="mch-link mch-link--row" type="button" onClick={() => go("habits")}>
            All habits <CheckIcon size={14} />
          </button>
        </Card>

        <Card
          title="Agenda"
          sub={`${agendaLeft} left of ${agenda.length} · ${today.iso}`}
          action={
            <span className="mch-pill" data-tone="tertiary">
              <ClockIcon size={13} /> {agendaLeft}
            </span>
          }
        >
          <ol className="mch-agenda">
            {agenda.map((a) => (
              <li key={a.id} data-done={a.done || undefined} data-kind={a.kind}>
                <span className="mch-agenda__time tnum">{a.time}</span>
                <button
                  type="button"
                  className="mch-agenda__row"
                  onClick={() => toggleAgenda(a.id)}
                  aria-pressed={a.done}
                >
                  <span className="mch-agenda__body">
                    <b>{a.title}</b>
                    <span>{a.detail}</span>
                  </span>
                  <span className="mch-agenda__tick">
                    <CheckPuck on={a.done} tone={a.kind === "money" ? "secondary" : "primary"} />
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
