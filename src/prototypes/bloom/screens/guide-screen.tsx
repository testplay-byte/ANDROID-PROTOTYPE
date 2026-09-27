"use client";

/* guide-screen — category chips filter an accordion list of care articles.
   Tap a row to expand (grid-rows 0fr→1fr height animation + chevron
   rotate); a single open row keeps the list calm. */

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { GUIDE_ARTICLES, type GuideCategory } from "../lib/data";
import { ChevronDownIcon, DropIcon, LeafIcon, PawIcon, SunIcon } from "../components/icons";

type Filter = "All" | GuideCategory;
const FILTERS: Filter[] = ["All", "Watering", "Light", "Soil", "Pets"];

const CAT_ICONS: Record<GuideCategory, ReactNode> = {
  Watering: <DropIcon size={16} />,
  Light: <SunIcon size={16} />,
  Soil: <LeafIcon size={16} />,
  Pets: <PawIcon size={16} />,
};

export function GuideScreen() {
  const [filter, setFilter] = useState<Filter>("All");
  const [openId, setOpenId] = useState<string | null>("g-finger");

  const articles = useMemo(
    () => (filter === "All" ? GUIDE_ARTICLES : GUIDE_ARTICLES.filter((a) => a.category === filter)),
    [filter],
  );

  return (
    <section className="bl-screen" aria-label="Guide">
      <div className="bl-content">
        <header className="bl-greet" style={{ ["--stagger" as string]: "0ms" } as CSSProperties}>
          <h1 className="bl-greet__title">Care guide</h1>
          <p className="bl-greet__sub">Short, practical lessons from the potting bench.</p>
        </header>

        <div className="bl-filters" aria-label="Article categories" style={{ ["--stagger" as string]: "70ms" } as CSSProperties}>
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              className={"bl-fchip" + (filter === f ? " on" : "")}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <ul className="bl-articles" key={filter}>
          {articles.map((a, i) => {
            const open = openId === a.id;
            return (
              <li
                key={a.id}
                className={"bl-article" + (open ? " open" : "")}
                style={{ ["--stagger" as string]: `${110 + i * 50}ms` } as CSSProperties}
              >
                <button
                  type="button"
                  className="bl-article__head"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : a.id)}
                >
                  <span className={"bl-article__ic ic-" + a.category.toLowerCase()} aria-hidden="true">
                    {CAT_ICONS[a.category]}
                  </span>
                  <span className="bl-article__title">
                    <span className="bl-article__t">{a.title}</span>
                    <span className="bl-article__meta">
                      {a.category} · {a.minutes} min read
                    </span>
                  </span>
                  <span className="bl-article__chev" aria-hidden="true">
                    <ChevronDownIcon size={18} />
                  </span>
                </button>
                <div className="bl-article__body">
                  <div className="bl-article__inner">
                    <p>{a.body}</p>
                    <p className="bl-article__tip">
                      <LeafIcon size={14} />
                      {a.tip}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
