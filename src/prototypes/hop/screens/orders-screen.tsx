/**
 * hop / screens / orders — the live tracker + the cart sheet.
 *
 * Orders is where Hop's flat stepper lives: three solid stage blocks on a
 * 1px rail, and a coral dot that travels the rail as the context ticker
 * advances the live order (Confirmed → Cooking → On the way). Each stage
 * block colour-swaps when it becomes current — filled for done, outlined
 * tier for pending. Below: past order blocks with a Reorder action that
 * refills the cart.
 *
 * CartSheet (rendered by the page from `cartOpen`) is the checkout view:
 * block steppers per line (square − qty + buttons, colour swap on press),
 * a solid accent subtotal footer, and PLACE ORDER which starts the tracker.
 */

import { ORDER_STAGES, STAGE_MS, cuisineById, menuFor, money, restaurantById } from "../lib/data";
import { useHop, type HopOrder } from "../state/hop-context";
import { FoodArt } from "../components/food-art";
import { BagIcon, CheckIcon, ClockIcon, MinusIcon, PlusIcon, ScooterIcon } from "../components/icons";

/* ---------- helpers ---------- */

function clockLabel(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours() % 12 || 12;
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

/** ms remaining on the live order's current stage — drives the dot. */
function stageProgress(order: HopOrder): number {
  const total = STAGE_MS * (ORDER_STAGES.length - 1);
  return Math.min(Math.max((Date.now() - order.placedAt) / total, 0), 1);
}

/* ---------- orders screen ---------- */

export function OrdersScreen() {
  const { liveOrder, pastOrders, reorder } = useHop();

  return (
    <div className="hp-scroll hp-orders">
      <header className="hp-orders__head">
        <h1 className="hp-orders__title">Orders</h1>
        {liveOrder ? (
          <span className="hp-orders__live">
            <span className="hp-orders__livedot" aria-hidden="true" /> live
          </span>
        ) : null}
      </header>

      {liveOrder ? <LiveTracker order={liveOrder} /> : <EmptyOrders />}

      {pastOrders.length > 0 && (
        <section className="hp-section hp-orders__past">
          <header className="hp-section__head">
            <h2 className="hp-section__title">Past</h2>
            <span className="hp-section__flag tnum">{pastOrders.length} delivered</span>
          </header>
          <div className="hp-rows hp-orders__list">
            {pastOrders.map((o, i) => {
              const c = cuisineById(restaurantById(o.restaurantId).cuisine);
              return (
                <div className="hp-past hp-stagger" style={{ animationDelay: `${i * 45}ms` }} key={o.id}>
                  <span className="hp-past__art">
                    <FoodArt shape={c.shape} cuisine={c} seed={o.restaurantName.length} size={52} />
                  </span>
                  <span className="hp-past__text">
                    <span className="hp-past__name">{o.restaurantName}</span>
                    <span className="hp-past__meta tnum">
                      {o.lines.reduce((n, l) => n + l.qty, 0)} items · {money(o.total)} ·{" "}
                      {clockLabel(o.placedAt)}
                    </span>
                  </span>
                  <button type="button" className="hp-past__go" onClick={() => reorder(o.id)}>
                    <span className="hp-past__goicon" aria-hidden="true">
                      <PlusIcon size={14} />
                    </span>
                    Reorder
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

/* ---------- live tracker ---------- */

function LiveTracker({ order }: { order: HopOrder }) {
  const { setCartOpen } = useHop();
  const progress = stageProgress(order);
  const eta = Math.max(Math.round((1 - progress) * order.lines[0]?.qty * 7 + 6), 1);

  return (
    <section className="hp-track" aria-label="Live order tracker">
      <div className="hp-track__head">
        <span className="hp-track__rest">{order.restaurantName}</span>
        <span className="hp-track__eta tnum">
          <ClockIcon size={14} /> {order.stage >= ORDER_STAGES.length - 1 ? "arriving" : `${eta} min`}
        </span>
      </div>

      {/* 1px rail with the travelling dot */}
      <div className="hp-track__rail" role="presentation">
        <span className="hp-track__fill" style={{ width: `${progress * 100}%` }} />
        <span className="hp-track__dot" style={{ left: `${progress * 100}%` }} aria-hidden="true" />
      </div>

      <ol className="hp-track__steps">
        {ORDER_STAGES.map((label, i) => {
          const done = i < order.stage;
          const current = i === order.stage;
          return (
            <li
              key={label}
              className={`hp-step${done ? " hp-step--done" : ""}${current ? " hp-step--on" : ""}`}
              aria-current={current ? "step" : undefined}
            >
              <span className="hp-step__box">
                {done ? <CheckIcon size={14} /> : <span className="hp-step__num tnum">{i + 1}</span>}
              </span>
              <span className="hp-step__label">{label}</span>
            </li>
          );
        })}
      </ol>

      <div className="hp-track__lines">
        {order.lines.map((l) => (
          <div className="hp-track__line tnum" key={l.key}>
            <span className="hp-track__qty">{l.qty}×</span>
            <span className="hp-track__lname">{l.name}</span>
            <span className="hp-track__lprice">{money(l.qty * l.unitPrice)}</span>
          </div>
        ))}
      </div>

      <div className="hp-track__foot">
        <span className="tnum">{money(order.total)}</span>
        <span className="hp-track__rider">
          <ScooterIcon size={15} /> {order.stage === 0 ? "kitchen has it" : order.stage === 1 ? "chef is on it" : "rider en route"}
        </span>
      </div>
      <button type="button" className="hp-track__hide" onClick={() => setCartOpen(false)}>
        Order #{order.id.slice(-4)} · tap tabs to keep browsing
      </button>
    </section>
  );
}

/* ---------- empty state ---------- */

function EmptyOrders() {
  const { setCartOpen } = useHop();
  return (
    <div className="hp-empty hp-orders__empty">
      <span className="hp-empty__mark" aria-hidden="true">
        <BagIcon size={26} />
      </span>
      <p className="hp-empty__title">No orders yet.</p>
      <p className="hp-empty__sub">
        Find a kitchen on Search, add a few things, and this screen turns into a live tracker.
      </p>
      <button type="button" className="hp-orders__browse" onClick={() => setCartOpen(true)}>
        Peek at cart
      </button>
    </div>
  );
}

/* ---------- cart sheet (checkout view) ---------- */

export function CartSheet() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    cartSubtotal,
    cartCount,
    cartRestaurantId,
    setQty,
    placeOrder,
    showToast,
  } = useHop();

  if (!cartOpen) return null;
  const restaurant = cartRestaurantId ? restaurantById(cartRestaurantId) : null;
  const fee = cartSubtotal >= 2500 || !restaurant ? 0 : restaurant.fee;
  const total = cartSubtotal + fee;

  function removeWithAnim(key: string, qty: number) {
    if (qty > 1) setQty(key, qty - 1);
    else {
      setQty(key, 0);
      showToast("Removed from cart.");
    }
  }

  return (
    <div className="hp-sheet-scrim hp-cart-scrim" onClick={() => setCartOpen(false)} role="presentation">
      <div className="hp-cart" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Your cart">
        <header className="hp-cart__head">
          <div className="hp-cart__headtext">
            <span className="hp-cart__kicker">cart · {cartCount} item{cartCount === 1 ? "" : "s"}</span>
            <h2 className="hp-cart__rest">{restaurant ? restaurant.name : "Your bag"}</h2>
          </div>
          <button type="button" className="hp-cart__close" onClick={() => setCartOpen(false)} aria-label="Close cart">
            <MinusIcon size={16} />
          </button>
        </header>

        {cart.length === 0 ? (
          <div className="hp-empty hp-cart__empty">
            <p className="hp-empty__title">Nothing in the bag.</p>
            <p className="hp-empty__sub">Add something from a menu — the + buttons never lie.</p>
          </div>
        ) : (
          <div className="hp-cart__lines">
            {cart.map((l) => {
              const item = cartRestaurantId ? menuFor(cartRestaurantId).find((m) => m.id === l.itemId) : undefined;
              const c = restaurant ? cuisineById(restaurant.cuisine) : null;
              return (
                <div className="hp-line" key={l.key}>
                  {c && item ? (
                    <span className="hp-line__art">
                      <FoodArt shape={item.shape} cuisine={c} seed={l.name.length} size={44} />
                    </span>
                  ) : null}
                  <span className="hp-line__text">
                    <span className="hp-line__name">{l.name}</span>
                    {l.optionLabels.length > 0 && (
                      <span className="hp-line__opts">{l.optionLabels.join(", ")}</span>
                    )}
                    <span className="hp-line__price tnum">
                      {l.unitPrice === 0 ? "free" : money(l.unitPrice)} ea
                    </span>
                  </span>
                  <span className="hp-line__stepper">
                    <button
                      type="button"
                      className="hp-stepbtn"
                      aria-label={`Remove one ${l.name}`}
                      onClick={() => removeWithAnim(l.key, l.qty)}
                    >
                      <MinusIcon size={14} />
                    </button>
                    <b className="hp-line__qty tnum" key={l.qty}>
                      {l.qty}
                    </b>
                    <button
                      type="button"
                      className="hp-stepbtn"
                      aria-label={`Add one ${l.name}`}
                      onClick={() => setQty(l.key, l.qty + 1)}
                    >
                      <PlusIcon size={14} />
                    </button>
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* solid accent subtotal footer */}
        <footer className="hp-cart__foot">
          <div className="hp-cart__totals">
            <span className="hp-cart__row tnum">
              <span>Subtotal</span>
              <span>{money(cartSubtotal)}</span>
            </span>
            <span className="hp-cart__row tnum">
              <span>Delivery</span>
              <span>{fee === 0 ? "free" : money(fee)}</span>
            </span>
            {cartSubtotal > 0 && cartSubtotal < 2500 && (
              <span className="hp-cart__hint">
                {money(2500 - cartSubtotal)} more clears the fee.
              </span>
            )}
          </div>
          <button
            type="button"
            className="hp-cart__place"
            disabled={cart.length === 0}
            onClick={placeOrder}
          >
            <span>Place order</span>
            <span className="tnum">{money(total)}</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
