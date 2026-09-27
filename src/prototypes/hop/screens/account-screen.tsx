/**
 * hop / screens / account — the flat settings surface.
 *
 * Opens ON a teal identity block (initials square, name, live order count)
 * — the classic flat "header plane". Below: address cards as solid blocks
 * with a single selected plane (tap to make default, persisted to
 * `hop-prefs`), payment blocks (card / wallet / cash, one active colour
 * swap), Dark/Light theme via the proto-kit DeviceThemeProvider (persisted
 * to `hop-theme`, scoped to `.device` only), and notification switches —
 * all prefs flow through the hop context so nothing is screen-local.
 */

import { useDeviceTheme } from "../../../proto-kit";
import { useHop } from "../state/hop-context";
import { BellIcon, CardIcon, CheckIcon, PinIcon, UserIcon, WalletIcon } from "../components/icons";

const PAYMENTS = [
  { id: "card", label: "Visa ···· 4412", sub: "Expires 09/28", icon: <CardIcon size={17} /> },
  { id: "wallet", label: "Hop Wallet", sub: "$38.20 balance", icon: <WalletIcon size={17} /> },
  { id: "cash", label: "Cash on delivery", sub: "Exact change appreciated", icon: <UserIcon size={17} /> },
];

export function AccountScreen() {
  const { theme, setTheme } = useDeviceTheme();
  const { prefs, setPref, addresses, liveOrder, pastOrders, favorites, showToast } = useHop();

  const switches: Array<{ key: "notifyOrders" | "notifyDeals" | "notifyPromos"; label: string; sub: string }> = [
    { key: "notifyOrders", label: "Order updates", sub: "Stage changes and rider arrival" },
    { key: "notifyDeals", label: "Kitchen deals", sub: "Saved kitchens dropping a price" },
    { key: "notifyPromos", label: "App promos", sub: "Hop-wide weeks and drops" },
  ];

  return (
    <div className="hp-scroll hp-account">
      {/* ---- identity plane ---- */}
      <header className="hp-acct__head">
        <span className="hp-acct__avatar" aria-hidden="true">
          JA
        </span>
        <span className="hp-acct__who">
          <span className="hp-acct__name">Jules Ansel</span>
          <span className="hp-acct__meta tnum">
            {pastOrders.length + (liveOrder ? 1 : 0)} orders · {favorites.length} saved kitchens
          </span>
        </span>
        {liveOrder ? <span className="hp-acct__live tnum">1 live</span> : null}
      </header>

      {/* ---- addresses ---- */}
      <section className="hp-section hp-acct__section">
        <header className="hp-section__head">
          <h2 className="hp-section__title">
            <PinIcon size={14} /> Addresses
          </h2>
          <span className="hp-section__flag">tap to set default</span>
        </header>
        <div className="hp-addrgrid">
          {addresses.map((a) => {
            const on = prefs.defaultAddressId === a.id;
            return (
              <button
                key={a.id}
                type="button"
                className={`hp-addr${on ? " hp-addr--on" : ""}`}
                aria-pressed={on}
                onClick={() => {
                  setPref("defaultAddressId", a.id);
                  showToast(`${a.label} is now the default drop-off.`);
                }}
              >
                <span className="hp-addr__label">
                  {a.label}
                  {on && (
                    <span className="hp-addr__check" aria-hidden="true">
                      <CheckIcon size={12} />
                    </span>
                  )}
                </span>
                <span className="hp-addr__line">{a.line}</span>
                <span className="hp-addr__note">{a.note}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ---- payments ---- */}
      <section className="hp-section hp-acct__section">
        <header className="hp-section__head">
          <h2 className="hp-section__title">
            <CardIcon size={14} /> Payment
          </h2>
        </header>
        <div className="hp-pays">
          {PAYMENTS.map((p) => {
            const on = prefs.paymentId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={`hp-pay${on ? " hp-pay--on" : ""}`}
                aria-pressed={on}
                onClick={() => {
                  setPref("paymentId", p.id);
                  showToast(`Paying with ${p.label.toLowerCase()}.`);
                }}
              >
                <span className="hp-pay__icon" aria-hidden="true">
                  {p.icon}
                </span>
                <span className="hp-pay__text">
                  <span className="hp-pay__label">{p.label}</span>
                  <span className="hp-pay__sub">{p.sub}</span>
                </span>
                <span className="hp-pay__dot" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </section>

      {/* ---- appearance: flat segmented, hop-theme persisted by DeviceThemeProvider ---- */}
      <section className="hp-section hp-acct__section">
        <header className="hp-section__head">
          <h2 className="hp-section__title">Appearance</h2>
          <span className="hp-section__flag">persists as hop-theme</span>
        </header>
        <div className="hp-seg" role="group" aria-label="Theme">
          <button
            type="button"
            className={`hp-seg__btn${theme === "dark" ? " hp-seg__btn--on" : ""}`}
            aria-pressed={theme === "dark"}
            onClick={() => setTheme("dark")}
          >
            Dark
          </button>
          <button
            type="button"
            className={`hp-seg__btn${theme === "light" ? " hp-seg__btn--on" : ""}`}
            aria-pressed={theme === "light"}
            onClick={() => setTheme("light")}
          >
            Light
          </button>
        </div>
      </section>

      {/* ---- notification switches (hop-prefs persisted) ---- */}
      <section className="hp-section hp-acct__section">
        <header className="hp-section__head">
          <h2 className="hp-section__title">
            <BellIcon size={14} /> Notifications
          </h2>
        </header>
        <div className="hp-switches">
          {switches.map((s) => {
            const on = prefs[s.key];
            return (
              <div className="hp-switchrow" key={s.key}>
                <span className="hp-switchrow__text">
                  <span className="hp-switchrow__label">{s.label}</span>
                  <span className="hp-switchrow__sub">{s.sub}</span>
                </span>
                <button
                  type="button"
                  className={`hp-switch${on ? " hp-switch--on" : ""}`}
                  role="switch"
                  aria-checked={on}
                  aria-label={s.label}
                  onClick={() => {
                    setPref(s.key, !on);
                    showToast(`${s.label} ${on ? "off" : "on"}.`);
                  }}
                >
                  <span className="hp-switch__knob" aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <p className="hp-fineprint">
        Hop keeps your defaults in two places: hop-theme for the screen, hop-prefs for everything else.
        Clearing site data resets both.
      </p>
    </div>
  );
}
