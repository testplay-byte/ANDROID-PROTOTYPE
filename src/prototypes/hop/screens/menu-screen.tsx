/**
 * hop / screens / menu — the pushed restaurant detail.
 *
 * Opens ON a solid cuisine-colour header (back + favourite knocked out of
 * the plane, never floating on a scrim), directly under a flat delivery
 * strip. Menu rows are surface blocks: square FoodArt thumbnail, name/desc,
 * solid price, and a square + button. Tapping + quick-adds (flyToCart dot →
 * tab-bar count); rows with options open the item sheet instead, where the
 * square toggles live. Zero depth anywhere — separation is tier steps and
 * one colour plane.
 */

import {
  cuisineById,
  menuFor,
  money,
  ratingColor,
  restaurantById,
} from "../lib/data";
import { flyToCart, useHop } from "../state/hop-context";
import { FoodArt } from "../components/food-art";
import { BackIcon, CardIcon, ClockIcon, HeartIcon, PinIcon, PlusIcon, ScooterIcon } from "../components/icons";

interface MenuScreenProps {
  restaurantId: string;
  onBack: () => void;
}

export function MenuScreen({ restaurantId, onBack }: MenuScreenProps) {
  const {
    favorites,
    toggleFavorite,
    openSheet,
    addToCart,
    showToast,
    cartCount,
    cartSubtotal,
    cartRestaurantId,
    setCartOpen,
  } = useHop();
  const restaurant = restaurantById(restaurantId);
  const cuisine = cuisineById(restaurant.cuisine);
  const items = menuFor(restaurantId);
  const fav = favorites.includes(restaurant.id);
  const cartHere = cartRestaurantId === restaurant.id;

  function quickAdd(e: React.MouseEvent<HTMLButtonElement>, itemId: string) {
    e.stopPropagation();
    const item = items.find((m) => m.id === itemId);
    if (!item) return;
    if (item.options && item.options.length > 0) {
      openSheet(restaurant, item);
      return;
    }
    if (e.currentTarget) flyToCart(e.currentTarget);
    addToCart(restaurant, item, []);
    showToast(`${item.name} added.`);
  }

  return (
    <div className="hp-menu">
      <div className="hp-scroll">
      {/* ---- flat header: the screen opens ON the colour plane ---- */}
      <header className="hp-menu__head" style={{ background: cuisine.color, color: cuisine.fg }}>
        <div className="hp-menu__toprow">
          <button type="button" className="hp-menu__back" onClick={onBack} aria-label="Back">
            <BackIcon size={20} />
          </button>
          <button
            type="button"
            className={`hp-menu__fav${fav ? " hp-menu__fav--on" : ""}`}
            aria-pressed={fav}
            aria-label={fav ? `Unfavorite ${restaurant.name}` : `Favorite ${restaurant.name}`}
            onClick={() => {
              toggleFavorite(restaurant.id);
              showToast(fav ? `Removed ${restaurant.name}.` : `Saved ${restaurant.name} to favourites.`);
            }}
          >
            <HeartIcon size={18} filled={fav} />
          </button>
        </div>
        <div className="hp-menu__headbody">
          <div className="hp-menu__headtext">
            <span className="hp-menu__kicker">{cuisine.label}</span>
            <h1 className="hp-menu__name">{restaurant.name}</h1>
            <p className="hp-menu__tag">{restaurant.tagline}</p>
            <span className="hp-menu__chips">
              <b className="hp-menu__rating tnum" style={{ background: ratingColor(restaurant.rating), color: cuisine.fg }}>
                {restaurant.rating.toFixed(1)}
              </b>
              <span className="hp-menu__price-lv">{"$".repeat(restaurant.priceLevel)}</span>
            </span>
          </div>
          <FoodArt
            shape={cuisine.shape}
            cuisine={cuisine}
            seed={restaurant.name.length}
            size={116}
            bg={cuisine.color}
            className="hp-menu__art"
          />
        </div>
      </header>

      {/* ---- delivery strip: solid tier-2 band, icons inline ---- */}
      <div className="hp-strip">
        <span className="hp-strip__cell">
          <ClockIcon size={15} /> <b className="tnum">{restaurant.minutes} min</b>
        </span>
        <span className="hp-strip__cell">
          <ScooterIcon size={15} />{" "}
          <b className="tnum">{restaurant.fee === 0 ? "free delivery" : `${money(restaurant.fee)} fee`}</b>
        </span>
        <span className="hp-strip__cell">
          <PinIcon size={15} /> <b>1.2 km</b>
        </span>
      </div>

      {/* ---- menu ---- */}
      <section className="hp-section hp-menu__section">
        <header className="hp-section__head">
          <h2 className="hp-section__title">Menu</h2>
          <span className="hp-section__flag">
            <CardIcon size={13} /> {items.length} items
          </span>
        </header>
        <div className="hp-rows">
          {items.map((m, i) => (
            <div
              className="hp-row hp-menu__item hp-stagger"
              style={{ animationDelay: `${i * 45}ms` }}
              key={m.id}
            >
              <button
                type="button"
                className="hp-row__main hp-menu__itemmain"
                onClick={(e) => {
                  if (m.options && m.options.length > 0) openSheet(restaurant, m);
                  else quickAdd(e, m.id);
                }}
              >
                <FoodArt shape={m.shape} cuisine={cuisine} seed={i + m.name.length} size={58} />
                <span className="hp-row__text">
                  <span className="hp-row__name">
                    {m.name}
                    {m.star && <b className="hp-menu__pop">popular</b>}
                  </span>
                  <span className="hp-row__meta">
                    <span className="hp-row__line">{m.desc}</span>
                  </span>
                  <span className="hp-menu__priceline tnum">
                    {m.price === 0 ? "free with order" : money(m.price)}
                    {m.options && m.options.length > 0 && (
                      <span className="hp-menu__choices"> · {m.options.length} options</span>
                    )}
                  </span>
                </span>
              </button>
              <button
                type="button"
                className="hp-menu__add"
                style={{ background: cuisine.color, color: cuisine.fg }}
                aria-label={`Add ${m.name}`}
                onClick={(e) => quickAdd(e, m.id)}
              >
                <PlusIcon size={17} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <p className="hp-fineprint">
        Kitchen closes at 11pm. Corner Pop and free items attach to any order — no minimum drama.
      </p>
      </div>

      {/* ---- cart dock: solid accent bar, only when this restaurant has a cart ---- */}
      {cartHere && cartCount > 0 ? (
        <button type="button" className="hp-menu__dock" onClick={() => setCartOpen(true)}>
          <span className="hp-menu__dockcount tnum">{cartCount}</span>
          <span className="hp-menu__docktext">View cart</span>
          <span className="hp-menu__docktotal tnum">{money(cartSubtotal)}</span>
        </button>
      ) : null}
    </div>
  );
}
