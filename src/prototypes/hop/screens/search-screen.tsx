/**
 * hop / screens / search — find food via colour.
 *
 * A big flat search block (proto-kit keyboard), then a cuisine colour grid:
 * each tile is one solid hue plane; tapping it filters the restaurant list
 * below. Results are two-tone split blocks — left half is the flat food
 * illustration on the cuisine colour, right half is info on the surface
 * tier. Rating is a solid colour chip, never stars.
 */

import { useMemo, useState } from "react";
import { useKeyboardInput } from "../../../proto-kit";
import {
  CUISINES,
  RESTAURANTS,
  cuisineById,
  menuFor,
  money,
  ratingColor,
} from "../lib/data";
import { useHop } from "../state/hop-context";
import { FoodArt } from "../components/food-art";
import { ClockIcon, SearchIcon } from "../components/icons";

interface SearchScreenProps {
  onOpenRestaurant: (id: string) => void;
}

export function SearchScreen({ onOpenRestaurant }: SearchScreenProps) {
  const { favorites, openSheet } = useHop();
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState<string | null>(null);
  const kb = useKeyboardInput({ value: query, onChange: setQuery, enterLabel: "Search" });

  const trimmed = query.trim().toLowerCase();
  const results = useMemo(
    () =>
      RESTAURANTS.filter((r) => {
        if (cuisine && r.cuisine !== cuisine) return false;
        if (!trimmed) return true;
        const inMenu = menuFor(r.id).some((m) => m.name.toLowerCase().includes(trimmed));
        return (
          r.name.toLowerCase().includes(trimmed) ||
          r.tagline.toLowerCase().includes(trimmed) ||
          cuisineById(r.cuisine).label.toLowerCase().includes(trimmed) ||
          inMenu
        );
      }),
    [cuisine, trimmed]
  );

  return (
    <div className="hp-scroll hp-search">
      {/* big flat search block */}
      <div className="hp-search__block">
        <span className="hp-search__icon" aria-hidden="true">
          <SearchIcon size={20} />
        </span>
        <input
          className="hp-search__input"
          type="text"
          placeholder="Search food or restaurants"
          value={query}
          readOnly
          onChange={(e) => setQuery(e.target.value)}
          {...kb}
          aria-label="Search food or restaurants"
        />
      </div>

      {/* cuisine colour grid — tap to filter */}
      <div className="hp-cuisine-grid" role="group" aria-label="Filter by cuisine">
        {CUISINES.map((c) => {
          const on = cuisine === c.id;
          return (
            <button
              key={c.id}
              type="button"
              className={`hp-cuisine${on ? " hp-cuisine--on" : ""}`}
              style={{ background: on ? c.color : "var(--color-surface-2)", color: on ? c.fg : "var(--color-text)" }}
              aria-pressed={on}
              onClick={() => setCuisine(on ? null : c.id)}
            >
              <span className="hp-cuisine__swatch" style={{ background: c.color }} aria-hidden="true" />
              {c.label}
            </button>
          );
        })}
      </div>

      {/* results */}
      <div className="hp-results" aria-label={`${results.length} results`}>
        {results.length === 0 ? (
          <div className="hp-empty">
            <p className="hp-empty__title">Nothing matches that.</p>
            <p className="hp-empty__sub">
              Try {CUISINES.map((c) => c.label.toLowerCase()).join(", ")} — or clear the filter.
            </p>
          </div>
        ) : (
          results.map((r, i) => {
            const c = cuisineById(r.cuisine);
            const fav = favorites.includes(r.id);
            return (
              <button
                key={r.id}
                type="button"
                className="hp-split hp-stagger"
                style={{ animationDelay: `${i * 40}ms` }}
                onClick={() => onOpenRestaurant(r.id)}
                aria-label={`Open ${r.name}`}
              >
                <span className="hp-split__art" style={{ background: c.color }}>
                  <FoodArt shape={c.shape} cuisine={c} seed={i + r.name.length} size={96} bg={c.color} />
                </span>
                <span className="hp-split__info">
                  <span className="hp-split__top">
                    <span className="hp-split__name">{r.name}</span>
                    <span className="hp-split__chip tnum" style={{ background: ratingColor(r.rating) }}>
                      {r.rating.toFixed(1)}
                    </span>
                  </span>
                  <span className="hp-split__tag">{r.tagline}</span>
                  <span className="hp-split__meta">
                    <span className="hp-split__time">
                      <ClockIcon size={13} /> {r.minutes} min
                    </span>
                    <span className="hp-split__fee tnum">
                      {r.fee === 0 ? "free delivery" : `${money(r.fee)} delivery`}
                    </span>
                    <span>{" · "}</span>
                    <span>{"$".repeat(r.priceLevel)}</span>
                    {fav && <span className="hp-split__fav">saved</span>}
                  </span>
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
