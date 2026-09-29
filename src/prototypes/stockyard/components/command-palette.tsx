"use client";

/**
 * stockyard / components / command-palette — the ⌘K command surface.
 *
 * A desktop-only interaction: a modal overlay that jumps to a view, opens a
 * SKU in the drawer, or fires an order action. Phones get a search SCREEN
 * instead, which is one more reason the desktop console is its own build.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { ORDER_STATUS_LABEL, STOCK_STATE_LABEL, stockState } from "../data";
import { VIEWS, useStockyard, type ViewId } from "../state/stockyard-context";
import { SearchIcon } from "./icons";

type Command =
  | { kind: "View"; id: string; label: string; hint: string }
  | { kind: "SKU"; id: string; label: string; hint: string }
  | { kind: "Order"; id: string; label: string; hint: string }
  | { kind: "Action"; id: string; label: string; hint: string };

const MAX_RESULTS = 9;

export function CommandPalette() {
  const {
    paletteOpen,
    setPaletteOpen,
    go,
    skus,
    orders,
    selectSku,
    selectOrder,
    shipOrder,
    density,
    setDensity,
    notify,
  } = useStockyard();
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (paletteOpen) {
      setQ("");
      setCursor(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [paletteOpen]);

  const commands = useMemo<Command[]>(() => {
    const term = q.trim().toLowerCase();
    const out: Command[] = [];

    for (const v of VIEWS) {
      if (!term || v.label.toLowerCase().includes(term)) {
        out.push({ kind: "View", id: v.id, label: v.label, hint: v.hint });
      }
    }
    for (const s of skus) {
      if (!term || s.sku.toLowerCase().includes(term) || s.name.toLowerCase().includes(term)) {
        out.push({ kind: "SKU", id: s.id, label: `${s.sku} — ${s.name}`, hint: STOCK_STATE_LABEL[stockState(s)] });
      }
    }
    for (const o of orders) {
      if (!term || o.ref.toLowerCase().includes(term) || o.customer.toLowerCase().includes(term)) {
        out.push({ kind: "Order", id: o.id, label: o.ref, hint: `${o.customer} · ${ORDER_STATUS_LABEL[o.status]}` });
      }
    }
    /* Actions are always reachable: they are the point of a palette. */
    out.push({
      kind: "Action",
      id: "density",
      label: `Density: ${density === "dense" ? "dense" : "regular"} rows`,
      hint: "Toggle row height",
    });

    return out.slice(0, MAX_RESULTS);
  }, [q, skus, orders, density]);

  if (!paletteOpen) return null;

  const run = (c: Command) => {
    setPaletteOpen(false);
    switch (c.kind) {
      case "View":
        go(c.id as ViewId);
        break;
      case "SKU":
        go("inventory");
        selectSku(c.id);
        break;
      case "Order":
        go("orders");
        selectOrder(c.id);
        break;
      case "Action":
        setDensity(density === "dense" ? "regular" : "dense");
        notify(`Row density: ${density === "dense" ? "regular" : "dense"}`);
        break;
    }
  };

  return (
    <div
      className="sy-palette"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={() => setPaletteOpen(false)}
    >
      <div className="sy-palette__box" onClick={(e) => e.stopPropagation()}>
        <label className="sy-palette__input">
          <SearchIcon size={16} />
          <input
            ref={inputRef}
            value={q}
            placeholder="Jump to a view, SKU or order…"
            onChange={(e) => {
              setQ(e.target.value);
              setCursor(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setCursor((c) => Math.min(c + 1, commands.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setCursor((c) => Math.max(c - 1, 0));
              } else if (e.key === "Enter" && commands[cursor]) {
                run(commands[cursor]);
              }
            }}
            aria-label="Command palette search"
          />
          <kbd>Esc</kbd>
        </label>
        <ul className="sy-palette__list">
          {commands.map((c, i) => (
            <li key={`${c.kind}-${c.id}`}>
              <button
                type="button"
                className={i === cursor ? "is-cursor" : ""}
                onMouseEnter={() => setCursor(i)}
                onClick={() => run(c)}
              >
                <span className="sy-palette__kind">{c.kind}</span>
                <b>{c.label}</b>
                <span className="sy-palette__hint">{c.hint}</span>
              </button>
            </li>
          ))}
          {commands.length === 0 && <li className="sy-palette__empty">No matches for “{q}”</li>}
        </ul>
        <footer className="sy-palette__foot">
          <kbd>↑</kbd>
          <kbd>↓</kbd> move · <kbd>↵</kbd> run · <kbd>Esc</kbd> dismiss
        </footer>
      </div>
    </div>
  );
}
