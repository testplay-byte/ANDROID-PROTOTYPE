/**
 * hop / components / item-sheet — the menu-item detail sheet.
 *
 * Flat blocks only: a solid cuisine-colour header holding the food art,
 * options as SQUARE toggles (selected = inverted colour swap, not a check
 * mark floating in space), and a solid accent add-bar at the bottom.
 * Opens from context (`sheet`); tap the scrim to dismiss.
 */

import { useEffect, useState } from "react";
import { cuisineById, money } from "../lib/data";
import { flyToCart, useHop } from "../state/hop-context";
import { FoodArt } from "./food-art";
import { CheckIcon, PlusIcon } from "./icons";

export function ItemSheet() {
  const { sheet, closeSheet, addToCart, showToast } = useHop();
  const [picked, setPicked] = useState<string[]>([]);

  useEffect(() => {
    setPicked([]);
  }, [sheet]);

  if (!sheet) return null;
  const { item, restaurant } = sheet;
  const cuisine = cuisineById(restaurant.cuisine);
  const options = item.options ?? [];
  const delta = options
    .filter((o) => picked.includes(o.id))
    .reduce((s, o) => s + o.delta, 0);
  const price = item.price + delta;

  function toggle(id: string) {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  function add(e: React.MouseEvent<HTMLButtonElement>) {
    if (e.currentTarget) flyToCart(e.currentTarget);
    addToCart(restaurant, item, picked);
    showToast(`${item.name} added.`);
    closeSheet();
  }

  return (
    <div className="hp-sheet-scrim" onClick={closeSheet} role="presentation">
      <div className="hp-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={item.name}>
        <div className="hp-sheet__head" style={{ background: cuisine.color, color: cuisine.fg }}>
          <FoodArt shape={item.shape} cuisine={cuisine} seed={item.id.length} size={88} bg={cuisine.color} className="hp-sheet__art" />
          <div className="hp-sheet__headtext">
            <span className="hp-sheet__rest">{restaurant.name}</span>
            <h2 className="hp-sheet__name">{item.name}</h2>
            <p className="hp-sheet__desc">{item.desc}</p>
          </div>
        </div>

        {options.length > 0 && (
          <div className="hp-sheet__options">
            <span className="hp-sheet__optlabel">Make it yours</span>
            <div className="hp-optgrid">
              {options.map((o) => {
                const on = picked.includes(o.id);
                return (
                  <button
                    key={o.id}
                    type="button"
                    className={`hp-opt${on ? " hp-opt--on" : ""}`}
                    style={on ? { background: cuisine.color, color: cuisine.fg } : undefined}
                    onClick={() => toggle(o.id)}
                    aria-pressed={on}
                  >
                    {on && <CheckIcon size={13} />}
                    <span>{o.label}</span>
                    <b className="tnum">{o.delta === 0 ? "incl." : `+${money(o.delta)}`}</b>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="hp-sheet__foot">
          <button type="button" className="hp-sheet__close" onClick={closeSheet}>
            Close
          </button>
          <button type="button" className="hp-sheet__add" onClick={add} style={{ background: "var(--color-primary)", color: "var(--color-primary-fg)" }}>
            <PlusIcon size={16} />
            <span className="tnum">{price === 0 ? "Add · free" : `Add · ${money(price)}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
