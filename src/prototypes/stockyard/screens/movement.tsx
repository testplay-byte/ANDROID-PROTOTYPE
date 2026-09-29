"use client";

/**
 * stockyard / screens / movement — the stock ledger and its daily series.
 *
 * Every restock and every despatch appends a row here, and both move
 * today's bar on the chart, so the ledger is the audit trail of the
 * shared inventory state rather than a static list.
 *
 * The chart is a plain column chart built from fixed numbers in data.ts:
 * no SVG geometry maths, no animation library, just hard-edged bars with
 * a hard border each — which is what this design language wants anyway.
 */

import { DAILY_LABELS, MOVEMENT_TYPE_LABEL, type MovementType } from "../data";
import { useStockyard, type MovementFilter } from "../state/stockyard-context";
import { MovementChip } from "../components/status-chip";
import { CheckIcon } from "../components/icons";

const FILTERS: MovementFilter[] = ["all", "receipt", "pick", "adjust", "transfer"];

const NET: Record<MovementType, { in: string; out: string }> = {
  receipt: { in: "IN", out: "OUT" },
  pick: { in: "IN", out: "OUT" },
  adjust: { in: "GAIN", out: "LOSS" },
  transfer: { in: "IN", out: "OUT" },
};

export function MovementScreen() {
  const { movements, dailyUnits, movementFilter, setMovementFilter, sku, skus, density, counts } = useStockyard();

  const visible = movements.filter((m) => movementFilter === "all" || m.type === movementFilter);

  const peak = Math.max(...dailyUnits);
  const busiest = DAILY_LABELS[dailyUnits.indexOf(peak)];

  const net = (list: typeof movements) =>
    list.reduce((a, m) => a + m.qty, 0);

  return (
    <div className="sy-view" data-density={density}>
      <div className="sy-statrow">
        <div className="sy-stat">
          <span className="sy-micro">Units today</span>
          <b className="sy-tnum">{counts.unitsToday.toLocaleString("en-US")}</b>
          <span className="sy-stat__sub">bar updates on every receipt and pick</span>
        </div>
        <div className="sy-stat" data-tone="ok">
          <span className="sy-micro">Received</span>
          <b className="sy-tnum">
            +{movements.filter((m) => m.qty > 0).reduce((a, m) => a + m.qty, 0).toLocaleString("en-US")}
          </b>
          <span className="sy-stat__sub">{movements.filter((m) => m.type === "receipt").length} receipts logged</span>
        </div>
        <div className="sy-stat" data-tone="bad">
          <span className="sy-micro">Picked</span>
          <b className="sy-tnum">
            −{Math.abs(movements.filter((m) => m.qty < 0).reduce((a, m) => a + m.qty, 0)).toLocaleString("en-US")}
          </b>
          <span className="sy-stat__sub">{movements.filter((m) => m.type === "pick").length} picks logged</span>
        </div>
        <div className="sy-stat">
          <span className="sy-micro">Busiest day</span>
          <b className="sy-tnum">{busiest}</b>
          <span className="sy-stat__sub">peak {peak.toLocaleString("en-US")} units</span>
        </div>
      </div>

      <section className="sy-block">
        <header className="sy-block__head">
          <h2>Units moved per day</h2>
          <span className="sy-micro">14 days · {net(movements).toLocaleString("en-US")} net units in view</span>
        </header>
        <div className="sy-chart" role="img" aria-label={`Daily units, peak ${peak} on ${busiest}`}>
          {dailyUnits.map((v, i) => {
            const pct = Math.max(4, Math.round((v / peak) * 100));
            const isToday = i === dailyUnits.length - 1;
            return (
              <div className="sy-bar" key={DAILY_LABELS[i]} data-today={isToday || undefined}>
                <span className="sy-bar__n sy-tnum">{v.toLocaleString("en-US")}</span>
                <span className="sy-bar__fill" style={{ height: `${pct}%` }} />
                <span className="sy-bar__label sy-micro">{DAILY_LABELS[i].slice(5)}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="sy-block">
        <header className="sy-block__head">
          <h2>Movement log</h2>
          <div className="sy-filters" role="group" aria-label="Filter by movement type">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={`sy-filter ${movementFilter === f ? "is-on" : ""}`}
                aria-pressed={movementFilter === f}
                onClick={() => setMovementFilter(f)}
              >
                {f === "all" ? "All" : MOVEMENT_TYPE_LABEL[f as MovementType]}
              </button>
            ))}
          </div>
        </header>

        <table className="sy-table sy-log">
          <colgroup>
            <col style={{ width: "11%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "23%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "8%" }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Ref</th>
              <th scope="col">Type</th>
              <th scope="col">SKU</th>
              <th scope="col">Reason</th>
              <th scope="col" style={{ textAlign: "right" }}>
                Qty
              </th>
              <th scope="col">Location</th>
              <th scope="col" style={{ textAlign: "right" }}>
                When
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((m) => {
              const item = sku(m.skuId);
              return (
                <tr key={m.id} data-type={m.type}>
                  <td className="sy-tnum">
                    <b>{m.ref}</b>
                  </td>
                  <td data-label="Type">
                    <MovementChip type={m.type} />
                  </td>
                  <td data-label="SKU" className="sy-tnum">
                    {item?.sku ?? m.skuId}
                    <span className="sy-table__sub">{item?.name ?? ""}</span>
                  </td>
                  <td data-label="Reason">{m.reason}</td>
                  <td
                    data-label="Qty"
                    className="sy-tnum sy-log__qty"
                    style={{ textAlign: "right" }}
                    data-sign={m.qty >= 0 ? "in" : "out"}
                  >
                    {m.qty >= 0 ? "+" : "−"}
                    {Math.abs(m.qty).toLocaleString("en-US")}
                    {m.type === "adjust" && (
                      <span className="sy-log__tag sy-micro">{m.qty >= 0 ? NET.adjust.in : NET.adjust.out}</span>
                    )}
                  </td>
                  <td data-label="Location" className="sy-tnum">
                    {m.location}
                  </td>
                  <td data-label="When" className="sy-tnum" style={{ textAlign: "right" }}>
                    {m.when}
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={7} className="sy-table__empty">
                  No movements of this type in the ledger.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <footer className="sy-tablefoot">
          <span className="sy-tnum">
            {visible.length} of {movements.length} entries · {skus.length} SKUs tracked
          </span>
          <span className="sy-tablefoot__hint">
            <CheckIcon size={12} /> Receipts and picks are written by the console, not by hand
          </span>
        </footer>
      </section>
    </div>
  );
}
