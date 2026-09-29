"use client";

/**
 * mochi / screens / budget — envelopes, limits and a detail pane.
 *
 * Desktop: a MULTI-CARD GRID of envelopes on the left with a sticky
 * DETAIL REGION on the right. Selecting an envelope opens it BESIDE the
 * grid (never over it), the limit is editable in place, and a working
 * add-envelope form appends to the grid and selects the new row.
 *
 * Tablet: the same data, but the grid becomes a single-column LIST and
 * the detail becomes a PREVIEW pane beside it — a genuine master-detail
 * shape, not the desktop grid squeezed narrower.
 */

import { useState, type FormEvent } from "react";
import { CATEGORY_TONE_HINT, money, pct, sum, type Category } from "../data";
import { useMochi } from "../state/mochi-context";
import { Bar, Card, Fact, Ring } from "../components/atoms";
import { PlusIcon, SearchIcon, TrashIcon, WalletIcon } from "../components/icons";

const STEPS = [10, 25, 50, 100];

function toneFor(ratio: number) {
  if (ratio > 1) return "error" as const;
  if (ratio > 0.9) return "warn" as const;
  return "primary" as const;
}

/* ---- the detail region: an envelope opened BESIDE the grid ---- */
function EnvelopeDetail({ cat }: { cat: Category }) {
  const { setCategoryLimit, removeCategory, notify, today } = useMochi();
  const ratio = pct(cat.spent, cat.limit);
  const tone = toneFor(ratio);
  const maxDay = Math.max(...cat.byDay, 1);
  const [draft, setDraft] = useState(String(cat.limit));

  const commit = (raw: string) => {
    setDraft(raw);
    const n = Number(raw);
    if (raw.trim() !== "" && Number.isFinite(n) && n >= 0) {
      setCategoryLimit(cat.id, n);
    }
  };

  return (
    <aside className="mch-detail" data-tone={cat.tone} aria-label={`${cat.name} envelope`}>
      <header className="mch-detail__head">
        <span className="mch-detail__glyph" aria-hidden="true">
          <WalletIcon size={20} />
        </span>
        <div className="mch-detail__heading">
          <h2>{cat.name}</h2>
          <p>{cat.note}</p>
        </div>
        <span className="mch-pill" data-tone={tone}>
          {CATEGORY_TONE_HINT[cat.tone]}
        </span>
      </header>

      <div className="mch-detail__ring">
        <Ring
          ratio={ratio}
          size={112}
          stroke={13}
          tone={tone}
          label={`${Math.round(ratio * 100)} per cent of ${cat.name} spent`}
        >
          <strong className="mch-ring__value tnum">{Math.round(ratio * 100)}%</strong>
          <span className="mch-ring__sub">of limit</span>
        </Ring>
        <dl className="mch-facts">
          <Fact label="Limit" value={money(cat.limit)} />
          <Fact label="Spent" value={money(cat.spent)} tone={tone} />
          <Fact
            label={ratio > 1 ? "Over by" : "Left"}
            value={money(Math.abs(cat.limit - cat.spent))}
            tone={ratio > 1 ? "error" : "primary"}
          />
          <Fact label="Daily average" value={money(cat.spent / 29)} />
        </dl>
      </div>

      <div className="mch-field">
        <label htmlFor="mch-limit">Monthly limit</label>
        <div className="mch-input">
          <span aria-hidden="true">£</span>
          <input
            id="mch-limit"
            type="text"
            inputMode="decimal"
            value={draft}
            onChange={(e) => commit(e.target.value)}
            aria-label={`Monthly limit for ${cat.name}, in pounds`}
          />
        </div>
        <div className="mch-stepper">
          {STEPS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setCategoryLimit(cat.id, cat.limit + s);
                setDraft(String(cat.limit + s));
                notify(`${cat.name} limit +${s}`);
              }}
            >
              {s >= 0 ? `+${s}` : s}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setCategoryLimit(cat.id, cat.limit - 50);
              setDraft(String(Math.max(0, cat.limit - 50)));
              notify(`${cat.name} limit −50`);
            }}
          >
            −50
          </button>
        </div>
        <p className="mch-hint">
          Editing the limit re-derives the Today ring and the monthly total immediately.
        </p>
      </div>

      <div className="mch-field">
        <label>This week so far · {today.monthShort}</label>
        <div className="mch-daybars">
          {cat.byDay.map((v, i) => (
            <span key={i} className="mch-daybars__col" data-today={i === 6 || undefined}>
              <span className="mch-daybars__track">
                <span
                  className="mch-daybars__fill"
                  data-tone={cat.tone}
                  style={{ height: `${((v / maxDay) * 100).toFixed(1)}%` }}
                />
              </span>
              <span className="mch-daybars__day">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
            </span>
          ))}
        </div>
        <p className="mch-hint tnum">Week total {money(sum(cat.byDay))}</p>
      </div>

      <button
        className="mch-btn mch-btn--quiet mch-btn--row"
        type="button"
        onClick={() => removeCategory(cat.id)}
      >
        <TrashIcon size={15} /> Remove {cat.name}
      </button>
    </aside>
  );
}

export function BudgetScreen() {
  const {
    categories,
    budget,
    selectedCategory,
    selectCategory,
    addCategory,
    categorySearch,
    setCategorySearch,
    notify,
  } = useMochi();

  const [name, setName] = useState("");
  const [limit, setLimit] = useState("120");

  const term = categorySearch.trim().toLowerCase();
  const shown = term ? categories.filter((c) => c.name.toLowerCase().includes(term)) : categories;
  const selected = categories.find((c) => c.id === selectedCategory);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const n = Number(limit);
    if (!name.trim() || !Number.isFinite(n) || n < 0) {
      notify("Give the envelope a name and a limit");
      return;
    }
    addCategory(name, n);
    setName("");
    setLimit("120");
  };

  return (
    <div className="mch-view mch-split">
      <div className="mch-split__master">
        <Card
          title="Envelopes"
          sub={`${categories.length} categories · ${money(budget.spent)} of ${money(budget.limit)}`}
          className="mch-summarycard"
        >
          <div className="mch-summary">
            <span className="mch-summary__figure tnum">{money(budget.spent)}</span>
            <Bar ratio={budget.ratio} tone={toneFor(budget.ratio)} height={12} />
            <span className="mch-summary__caption tnum">
              {money(budget.left)} unspent of {money(budget.limit)} ·{" "}
              {Math.round(budget.ratio * 100)}% gone
            </span>
          </div>
        </Card>

        <div className="mch-toolbar">
          <label className="mch-search">
            <SearchIcon size={15} />
            <input
              value={categorySearch}
              placeholder="Filter envelopes…"
              onChange={(e) => setCategorySearch(e.target.value)}
              aria-label="Filter envelopes"
            />
            <kbd>/</kbd>
          </label>
          <span className="mch-toolbar__count tnum">
            {shown.length} of {categories.length}
          </span>
        </div>

        <ul className="mch-envelopes">
          {shown.map((c) => {
            const r = pct(c.spent, c.limit);
            const tone = toneFor(r);
            return (
              <li key={c.id}>
                <button
                  type="button"
                  className="mch-env"
                  data-tone={c.tone}
                  data-selected={selectedCategory === c.id || undefined}
                  onClick={() => selectCategory(c.id)}
                  aria-pressed={selectedCategory === c.id}
                >
                  <span className="mch-env__head">
                    <b>{c.name}</b>
                    <span className="mch-env__num tnum">
                      {money(c.spent)}
                      <span className="mch-env__of"> / {money(c.limit)}</span>
                    </span>
                  </span>
                  <Bar ratio={r} tone={tone} height={10} />
                  <span className="mch-env__foot">
                    <span>{CATEGORY_TONE_HINT[c.tone]}</span>
                    <span className="tnum" data-tone={tone}>
                      {Math.round(r * 100)}%
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
          {shown.length === 0 && (
            <li className="mch-empty">No envelope matches “{categorySearch}”.</li>
          )}
        </ul>

        <Card title="Add an envelope" sub="It appears in the grid and opens in the detail pane.">
          <form className="mch-form" onSubmit={submit}>
            <label className="mch-field mch-field--inline">
              <span>Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Gifts"
                aria-label="New envelope name"
              />
            </label>
            <label className="mch-field mch-field--inline mch-field--narrow">
              <span>Limit (£)</span>
              <input
                value={limit}
                inputMode="decimal"
                onChange={(e) => setLimit(e.target.value)}
                aria-label="New envelope monthly limit in pounds"
              />
            </label>
            <button className="mch-btn mch-btn--filled" type="submit">
              <PlusIcon size={15} /> Add
            </button>
          </form>
        </Card>
      </div>

      {selected ? (
        <EnvelopeDetail cat={selected} />
      ) : (
        <aside className="mch-detail mch-detail--empty" aria-label="Envelope detail">
          <p>Select an envelope to open it here, beside the grid.</p>
        </aside>
      )}
    </div>
  );
}
