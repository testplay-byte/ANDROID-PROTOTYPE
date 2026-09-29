"use client";

/**
 * stockyard / components / detail-drawer — the right-hand detail panel.
 *
 * A desktop pattern with no phone equivalent: a panel that opens BESIDE
 * the data (never over it), so the table stays visible and the user keeps
 * their context. Closing it (×, or Esc) returns the full width.
 *
 * The restock form is REAL: it writes into the bins, recomputes the SKU's
 * totals, appends a RECEIPT to the movement ledger and grows today's bar
 * on the movement chart. The table row it belongs to updates underneath.
 */

import { useEffect, useState } from "react";
import {
  UOM_LABEL,
  freeStock,
  money,
  shortfall,
  stockState,
  stockValue,
} from "../data";
import { useStockyard } from "../state/stockyard-context";
import { StockChip } from "./status-chip";
import { BinIcon, PlusIcon, XIcon } from "./icons";

export function DetailDrawer() {
  const { selectedSku, selectSku, sku, restock, movements, notify } = useStockyard();
  const item = sku(selectedSku);
  const [qty, setQty] = useState(item?.reorderQty ?? 0);
  const [bin, setBin] = useState(0);

  /* Re-seed the form whenever a different SKU is opened. */
  useEffect(() => {
    if (item) {
      setQty(item.reorderQty);
      setBin(0);
    }
  }, [item]);

  if (!item) return null;

  const state = stockState(item);
  const free = freeStock(item);
  const peak = Math.max(...item.locations.map((l) => l.onHand), 1);
  const recent = movements.filter((m) => m.skuId === item.id).slice(0, 4);

  const receive = () => {
    const n = Math.max(0, Math.round(qty));
    if (n === 0) {
      notify("Enter a quantity to receive");
      return;
    }
    restock(item.id, n, bin);
    notify(`${n} ${item.uom} of ${item.sku} into ${item.locations[bin].code}`);
  };

  return (
    <aside className="sy-drawer" aria-label={`${item.sku} details`}>
      <header className="sy-drawer__head">
        <div>
          <span className="sy-micro">{item.sku}</span>
          <h2>{item.name}</h2>
          <p>
            {item.supplier} · {UOM_LABEL[item.uom]}
          </p>
        </div>
        <button className="sy-iconbtn" type="button" onClick={() => selectSku(null)} aria-label="Close detail panel">
          <XIcon size={14} />
        </button>
      </header>

      <StockChip state={state} />

      <dl className="sy-facts">
        <div>
          <dt>On hand</dt>
          <dd className="sy-tnum">{item.onHand.toLocaleString("en-US")}</dd>
        </div>
        <div>
          <dt>Reserved</dt>
          <dd className="sy-tnum">{item.reserved.toLocaleString("en-US")}</dd>
        </div>
        <div>
          <dt>Free</dt>
          <dd className="sy-tnum sy-facts__strong">{free.toLocaleString("en-US")}</dd>
        </div>
        <div>
          <dt>Reorder point</dt>
          <dd className="sy-tnum">{item.reorderPoint.toLocaleString("en-US")}</dd>
        </div>
        <div>
          <dt>Shortfall</dt>
          <dd className="sy-tnum" data-tone={shortfall(item) > 0 ? "bad" : "ok"}>
            {shortfall(item).toLocaleString("en-US")}
          </dd>
        </div>
        <div>
          <dt>Unit cost</dt>
          <dd className="sy-tnum">{money(item.unitCost)}</dd>
        </div>
        <div>
          <dt>Stock value</dt>
          <dd className="sy-tnum">{money(stockValue(item))}</dd>
        </div>
        <div>
          <dt>Lead time</dt>
          <dd className="sy-tnum">{item.leadDays} d</dd>
        </div>
      </dl>

      {/* Cover bar: how far on-hand sits above the reorder point. */}
      <div className="sy-cover">
        <div className="sy-cover__track">
          <span
            className="sy-cover__fill"
            data-state={state}
            style={{ width: `${Math.min(100, Math.round((item.onHand / Math.max(item.reorderPoint * 2, 1)) * 100))}%` }}
          />
          <span className="sy-cover__mark" style={{ left: "50%" }} aria-hidden="true" />
        </div>
        <span className="sy-micro sy-cover__legend">
          <b className="sy-tnum">{item.onHand.toLocaleString("en-US")}</b> on hand
          <span aria-hidden="true">/</span>
          <b className="sy-tnum">{(item.reorderPoint * 2).toLocaleString("en-US")}</b> scale
          <span aria-hidden="true">·</span> reorder at <b className="sy-tnum">{item.reorderPoint.toLocaleString("en-US")}</b>
        </span>
      </div>

      <h3 className="sy-drawer__section">
        <BinIcon size={14} /> By location
      </h3>
      <ul className="sy-bins">
        {item.locations.map((l) => {
          const pct = Math.round((l.onHand / peak) * 100);
          return (
            <li key={l.code} data-empty={l.onHand === 0 || undefined}>
              <span className="sy-bins__code">{l.code}</span>
              <span className="sy-bins__bar" aria-hidden="true">
                <span className="sy-bins__fill" style={{ width: `${pct}%` }} />
              </span>
              <span className="sy-bins__n sy-tnum">
                {l.onHand.toLocaleString("en-US")}
                <i>/{l.reserved.toLocaleString("en-US")} res</i>
              </span>
            </li>
          );
        })}
      </ul>

      <h3 className="sy-drawer__section">
        <PlusIcon size={13} /> Receive stock
      </h3>
      <div className="sy-restock">
        <div className="sy-stepper">
          <button type="button" onClick={() => setQty((q) => Math.max(0, q - 10))} aria-label="Decrease quantity">
            −
          </button>
          <input
            type="number"
            min={0}
            step={10}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            aria-label={`Units of ${item.sku} to receive`}
          />
          <button type="button" onClick={() => setQty((q) => q + 10)} aria-label="Increase quantity">
            +
          </button>
        </div>
        <label className="sy-select">
          <span className="sy-micro">Into</span>
          <select value={bin} onChange={(e) => setBin(Number(e.target.value))} aria-label="Destination bin">
            {item.locations.map((l, i) => (
              <option key={l.code} value={i}>
                {l.code} — {l.zone}
              </option>
            ))}
          </select>
        </label>
        <div className="sy-restock__actions">
          <button className="sy-btn sy-btn--solid" type="button" onClick={receive}>
            Receive {Math.max(0, Math.round(qty))} {item.uom}
          </button>
          <button className="sy-btn" type="button" onClick={() => setQty(item.reorderQty)}>
            Reset to reorder qty
          </button>
        </div>
      </div>

      <h3 className="sy-drawer__section">Recent movement</h3>
      <ul className="sy-drawer__log">
        {recent.map((m) => (
          <li key={m.id}>
            <span className="sy-micro">{m.ref}</span>
            <b className="sy-tnum" data-sign={m.qty >= 0 ? "in" : "out"}>
              {m.qty >= 0 ? "+" : "−"}
              {Math.abs(m.qty).toLocaleString("en-US")}
            </b>
            <span className="sy-drawer__logwhy">
              {m.reason} · {m.location} · {m.when}
            </span>
          </li>
        ))}
        {recent.length === 0 && <li className="sy-drawer__log-empty">No movement recorded for this SKU yet.</li>}
      </ul>
    </aside>
  );
}
