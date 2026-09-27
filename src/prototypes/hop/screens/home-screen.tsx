/**
 * hop / screens / home — opens on a colour block, not a title.
 *
 * Top-to-bottom: full-bleed teal hero plane holding a big flat food
 * illustration (data-driven per featured cuisine; the small cuisine dots
 * swap the block's art + copy with a colour swap, not a fade), the
 * horizontal category strip (solid squares, flat glyphs), "back by
 * demand" rows with flat thumbnails, and a rotating promo banner block.
 */

import { useEffect, useState } from "react";
import {
  CUISINES,
  PROMOS,
  RESTAURANTS,
  cuisineById,
  ratingColor,
  restaurantById,
  type NavTab,
} from "../lib/data";
import { useHop } from "../state/hop-context";
import { FoodArt } from "../components/food-art";
import { ClockIcon, FlameIcon, HeartIcon, SearchIcon } from "../components/icons";

interface HomeScreenProps {
  onOpenRestaurant: (id: string) => void;
  onGoTab: (tab: NavTab) => void;
}

export function HomeScreen({ onOpenRestaurant, onGoTab }: HomeScreenProps) {
  const { favorites, toggleFavorite, showToast } = useHop();
  const [hero, setHero] = useState(0);
  const [promo, setPromo] = useState(0);

  /* the promo block rotates on its own, slowly */
  useEffect(() => {
    const id = window.setInterval(() => setPromo((p) => (p + 1) % PROMOS.length), 5200);
    return () => window.clearInterval(id);
  }, []);

  const heroCuisine = CUISINES[hero];
  const heroRest = RESTAURANTS.find((r) => r.cuisine === heroCuisine.id && r.hot) ?? restaurantById("forno");
  const hot = RESTAURANTS.filter((r) => r.hot);
  const active = PROMOS[promo];

  return (
    <div className="hp-scroll hp-home">
      {/* ---- hero: the screen opens ON the block ---- */}
      <section className="hp-hero" style={{ background: heroCuisine.color, color: heroCuisine.fg }} aria-label="Featured cuisine">
        <div className="hp-hero__top">
          <span className="hp-hero__brand">
            <span className="hp-hero__mark" aria-hidden="true" />
            hop
          </span>
          <button type="button" className="hp-hero__search" onClick={() => onGoTab("search")} aria-label="Search restaurants">
            <SearchIcon size={18} />
          </button>
        </div>

        <div className="hp-hero__body">
          <div className="hp-hero__copy">
            <span className="hp-hero__kicker">craving {heroCuisine.label.toLowerCase()}?</span>
            <h1 className="hp-hero__line">
              {heroCuisine.id === "pizza" && "Thin crust, flying out"}
              {heroCuisine.id === "sushi" && "Rolled ten seconds ago"}
              {heroCuisine.id === "salad" && "Green, loud, fast"}
              {heroCuisine.id === "brews" && "Cold ones, door in 20"}
            </h1>
            <button
              type="button"
              className="hp-hero__cta"
              style={{ background: heroCuisine.fg, color: heroCuisine.color }}
              onClick={() => onOpenRestaurant(heroRest.id)}
            >
              Order {heroRest.name}
            </button>
          </div>
          <FoodArt
            shape={heroCuisine.shape}
            cuisine={heroCuisine}
            seed={hero}
            size={148}
            bg={heroCuisine.color}
            className="hp-hero__art"
          />
        </div>

        {/* cuisine picker dots = tiny solid squares */}
        <div className="hp-hero__dots" role="tablist" aria-label="Featured cuisines">
          {CUISINES.map((c, i) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={i === hero}
              className={`hp-hero__dot${i === hero ? " hp-hero__dot--on" : ""}`}
              style={i === hero ? { background: c.fg } : { background: c.color }}
              onClick={() => setHero(i)}
              aria-label={c.label}
            />
          ))}
        </div>
      </section>

      {/* ---- category strip: solid squares, flat glyphs ---- */}
      <section className="hp-cats" aria-label="Categories">
        {CUISINES.map((c) => (
          <button
            key={c.id}
            type="button"
            className="hp-cat"
            style={{ background: c.color, color: c.fg }}
            onClick={() => onGoTab("search")}
          >
            <FoodArt shape={c.shape} cuisine={c} seed={c.label.length} size={52} bg={c.color} />
            <span className="hp-cat__label">{c.label}</span>
          </button>
        ))}
      </section>

      {/* ---- back by demand ---- */}
      <section className="hp-section">
        <header className="hp-section__head">
          <h2 className="hp-section__title">Back by demand</h2>
          <span className="hp-section__flag">
            <FlameIcon size={13} /> re-ordered 40% more this week
          </span>
        </header>
        <div className="hp-rows">
          {hot.map((r, i) => {
            const c = cuisineById(r.cuisine);
            const fav = favorites.includes(r.id);
            return (
              <div className="hp-row hp-stagger" style={{ animationDelay: `${i * 45}ms` }} key={r.id}>
                <button type="button" className="hp-row__main" onClick={() => onOpenRestaurant(r.id)}>
                  <FoodArt shape={c.shape} cuisine={c} seed={i + r.name.length} size={58} />
                  <span className="hp-row__text">
                    <span className="hp-row__name">{r.name}</span>
                    <span className="hp-row__meta">
                      <b className="hp-row__rating tnum" style={{ background: ratingColor(r.rating) }}>
                        {r.rating.toFixed(1)}
                      </b>
                      <span className="hp-row__line">{c.label}</span>
                      <span className="hp-row__time">
                        <ClockIcon size={13} /> {r.minutes} min
                      </span>
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  className={`hp-row__fav${fav ? " hp-row__fav--on" : ""}`}
                  aria-pressed={fav}
                  aria-label={fav ? `Unfavorite ${r.name}` : `Favorite ${r.name}`}
                  onClick={() => {
                    toggleFavorite(r.id);
                    showToast(fav ? `Removed ${r.name}.` : `Saved ${r.name} to favourites.`);
                  }}
                >
                  <HeartIcon size={17} filled={fav} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---- promo banner: one solid plane, colour-swap rotation ---- */}
      <section className="hp-promo" style={{ background: active.color, color: active.fg }} aria-label="Promotion">
        <div className="hp-promo__inner" key={active.id}>
          <h3 className="hp-promo__head">{active.headline}</h3>
          <p className="hp-promo__sub">{active.sub}</p>
        </div>
        <button
          type="button"
          className="hp-promo__go"
          style={{ background: active.fg, color: active.color }}
          onClick={() => onGoTab("search")}
        >
          Browse deals
        </button>
        <div className="hp-promo__strip" aria-hidden="true">
          {PROMOS.map((p, i) => (
            <span key={p.id} className={`hp-promo__pip${i === promo ? " hp-promo__pip--on" : ""}`} />
          ))}
        </div>
      </section>

      <p className="hp-fineprint">
        Prices shown before service fees. Free delivery over $25 — {RESTAURANTS.length} kitchens,
        {favorites.length > 0 ? ` ${favorites.length} saved` : " nothing saved yet"}.
      </p>
    </div>
  );
}
