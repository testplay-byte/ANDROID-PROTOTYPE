/**
 * hop / components / tab-bar — the chrome signature.
 *
 * Edge-to-edge flat tab bar: four solid equal segments with hairline gaps
 * (background bleeding through), icon above label. The active segment is an
 * INVERTED colour block — solid primary plane, text knocked out in
 * primary-fg. No pills, no elevation, no indicator line: the colour swap IS
 * the selection. The Orders segment carries `data-hop-cart-slot` so the
 * cart-add fly animation has a landing target, and shows the count as a
 * solid coral square.
 */

import type { NavTab } from "../lib/data";
import { BagIcon, HomeIcon, SearchIcon, UserIcon } from "./icons";
import { useHop } from "../state/hop-context";

const ICONS: Record<NavTab, React.ReactNode> = {
  home: <HomeIcon size={21} />,
  search: <SearchIcon size={21} />,
  orders: <BagIcon size={21} />,
  account: <UserIcon size={21} />,
};

const LABELS: Record<NavTab, string> = {
  home: "Home",
  search: "Search",
  orders: "Orders",
  account: "Account",
};

export function TabBar({ active, onSelect }: { active: NavTab; onSelect: (tab: NavTab) => void }) {
  const { cartCount, bump, liveOrder } = useHop();
  const tabs: NavTab[] = ["home", "search", "orders", "account"];

  return (
    <nav className="hp-tabbar" aria-label="Hop sections">
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            type="button"
            className={`hp-tab${isActive ? " hp-tab--on" : ""}`}
            onClick={() => onSelect(tab)}
            aria-current={isActive ? "page" : undefined}
            {...(tab === "orders" ? { "data-hop-cart-slot": "" } : {})}
          >
            <span className="hp-tab__glyph">
              {ICONS[tab]}
              {tab === "orders" && cartCount > 0 ? (
                <span className="hp-tab__count tnum" key={bump}>
                  {cartCount}
                </span>
              ) : null}
              {tab === "orders" && cartCount === 0 && liveOrder ? (
                <span className="hp-tab__pulse" aria-hidden="true" />
              ) : null}
            </span>
            <span className="hp-tab__label">{LABELS[tab]}</span>
          </button>
        );
      })}
    </nav>
  );
}
