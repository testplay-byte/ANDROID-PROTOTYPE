"use client";

/* simmer / screens/find — search + browse.
   Clay header card holds the title; the inset search pill and category
   chips scroll with the content. Recipe grid below, filtered live. */

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useKeyboardInput } from "../../../proto-kit";
import { FilterChip } from "../components/chips";
import { RecipeCard } from "../components/recipe-card";
import { SearchIcon } from "../components/icons";
import { CATEGORIES, RECIPES, type Category } from "../lib/data";

export function FindScreen() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");
  const kb = useKeyboardInput({ value: q, onChange: setQ });

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return RECIPES.filter((r) => {
      if (cat !== "all" && r.category !== cat) return false;
      if (!needle) return true;
      return (
        r.name.toLowerCase().includes(needle) ||
        r.blurb.toLowerCase().includes(needle) ||
        r.ingredients.some((i) => i.name.toLowerCase().includes(needle))
      );
    });
  }, [q, cat]);

  const countFor = (id: Category | "all") =>
    id === "all" ? RECIPES.length : RECIPES.filter((r) => r.category === id).length;

  return (
    <section className="sm-screen">
      <header className="sm-head">
        <div className="sm-head-row">
          <span className="sm-head-kicker">The index</span>
        </div>
        <h1 className="sm-head-title">Find something good</h1>
      </header>

      <div className="sm-content">
        <label className="sm-search sm-rise" style={{ "--stagger": 0 } as CSSProperties}>
          <span className="sm-search-ico">
            <SearchIcon size={17} />
          </span>
          <input
            type="text"
            placeholder="Search recipes or ingredients…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            {...kb}
            aria-label="Search recipes"
          />
          {q !== "" && (
            <button type="button" className="sm-search-clear" onClick={() => setQ("")} aria-label="Clear search">
              ×
            </button>
          )}
        </label>

        <div className="sm-chiprow" style={{ "--stagger": 1 } as CSSProperties}>
          {CATEGORIES.map((c) => (
            <FilterChip
              key={c.id}
              label={c.label}
              count={countFor(c.id)}
              active={cat === c.id}
              onClick={() => setCat(c.id)}
            />
          ))}
        </div>

        {results.length === 0 ? (
          <div className="sm-empty" style={{ "--stagger": 2 } as CSSProperties}>
            <span className="sm-empty-ico">
              <SearchIcon size={22} />
            </span>
            <p>
              Nothing matches <b>“{q}”</b>
              {cat !== "all" ? ` in ${cat}` : ""}. Try “lemon” or “pasta”.
            </p>
          </div>
        ) : (
          <div className="sm-grid">
            {results.map((r, i) => (
              <div key={r.id} className="sm-rise" style={{ "--stagger": 2 + Math.min(i, 6) } as CSSProperties}>
                <RecipeCard recipe={r} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
