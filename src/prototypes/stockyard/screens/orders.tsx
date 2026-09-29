"use client";

/**
 * stockyard / screens / orders — the despatch queue.
 *
 * The desktop half of the screen is the detail panel BESIDE the queue: an
 * order is never a screen you navigate away to, it opens next to the list
 * so the dispatcher keeps the whole queue in view while working one
 * shipment.
 *
 * "Mark shipped" is the flow that proves the state is shared: it draws
 * every line out of the inventory bins, appends a PICK per bin touched,
 * shrinks today's units on the movement chart, and flips the chip to
 * SHIPPED. The inventory table reflects it the moment you switch views.
 */

import { ORDER_STATUSES, ORDER_STATUS_LABEL, money, type Order, type OrderStatus } from "../data";
import { useStockyard, type OrderFilter } from "../state/stockyard-context";
import { OrderChip } from "../components/status-chip";
import { ArrowIcon, CheckIcon, TruckIcon, XIcon } from "../components/icons";

const FILTERS: OrderFilter[] = ["all", "open", "shipped", "hold"];

const FILTER_LABEL: Record<OrderFilter, string> = {
  all: "All",
  open: "Open",
  shipped: "Shipped",
  hold: "On hold",
};

function orderValue(order: Order, skus: { id: string; unitCost: number }[]) {
  return order.lines.reduce((a, l) => {
    const sku = skus.find((s) => s.id === l.skuId);
    return a + (sku ? sku.unitCost * l.qty : 0);
  }, 0);
}

function OrderDetail({ order }: { order: Order }) {
  const { skus, setOrderStatus, shipOrder, selectOrder, notify } = useStockyard();

  const units = order.lines.reduce((a, l) => a + l.qty, 0);
  const value = orderValue(order, skus);
  const shipped = order.status === "shipped";

  return (
    <aside className="sy-panel" aria-label={`${order.ref} detail`}>
      <header className="sy-panel__head">
        <div>
          <span className="sy-micro">{order.channel} · placed {order.placed}</span>
          <h2>{order.ref}</h2>
          <p>{order.customer}</p>
        </div>
        <button className="sy-iconbtn" type="button" onClick={() => selectOrder(null)} aria-label="Close order detail">
          <XIcon size={14} />
        </button>
      </header>

      <dl className="sy-facts">
        <div>
          <dt>Status</dt>
          <dd>
            <OrderChip status={order.status} />
          </dd>
        </div>
        <div>
          <dt>Due</dt>
          <dd className="sy-tnum">{order.due}</dd>
        </div>
        <div>
          <dt>Lines</dt>
          <dd className="sy-tnum">{order.lines.length}</dd>
        </div>
        <div>
          <dt>Units</dt>
          <dd className="sy-tnum">{units.toLocaleString("en-US")}</dd>
        </div>
        <div>
          <dt>Order value</dt>
          <dd className="sy-tnum">{money(value)}</dd>
        </div>
      </dl>

      <h3 className="sy-panel__section">Lines</h3>
      <table className="sy-linetable">
        <colgroup>
          <col style={{ width: "34%" }} />
          <col style={{ width: "30%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "18%" }} />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">SKU</th>
            <th scope="col">Item</th>
            <th scope="col" style={{ textAlign: "right" }}>
              Qty
            </th>
            <th scope="col" style={{ textAlign: "right" }}>
              Free
            </th>
          </tr>
        </thead>
        <tbody>
          {order.lines.map((line) => {
            const sku = skus.find((s) => s.id === line.skuId);
            const free = sku ? Math.max(0, sku.onHand - sku.reserved) : 0;
            return (
              <tr key={line.skuId} data-short={free < line.qty || undefined}>
                <td className="sy-tnum">{sku?.sku ?? line.skuId}</td>
                <td className="sy-linetable__name">{sku?.name ?? "Unknown SKU"}</td>
                <td className="sy-tnum" style={{ textAlign: "right" }}>
                  {line.qty.toLocaleString("en-US")}
                </td>
                <td className="sy-tnum" style={{ textAlign: "right" }}>
                  {free.toLocaleString("en-US")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h3 className="sy-panel__section">Move to</h3>
      <div className="sy-statusrow" role="group" aria-label="Set order status">
        {ORDER_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            className={`sy-filter ${order.status === s ? "is-on" : ""}`}
            aria-pressed={order.status === s}
            disabled={shipped && s !== "shipped"}
            onClick={() => {
              setOrderStatus(order.id, s);
              notify(`${order.ref} → ${ORDER_STATUS_LABEL[s]}`);
            }}
          >
            {ORDER_STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <button
        className="sy-btn sy-btn--solid sy-btn--wide"
        type="button"
        disabled={shipped}
        onClick={() => {
          shipOrder(order.id);
          notify(`${order.ref} shipped — ${units.toLocaleString("en-US")} units left the yard`);
        }}
      >
        <TruckIcon size={16} />
        {shipped ? "Shipped — stock already decremented" : "Mark shipped"}
      </button>
      {shipped && (
        <p className="sy-panel__note">
          <CheckIcon size={12} /> This order was picked from the bins; the inventory table already reflects it.
        </p>
      )}
    </aside>
  );
}

export function OrdersScreen() {
  const { orders, orderFilter, setOrderFilter, selectedOrder, selectOrder, skus, density, notify } = useStockyard();
  const detail = orders.find((o) => o.id === selectedOrder) ?? null;

  const visible = orders.filter((o) => {
    if (orderFilter === "all") return true;
    if (orderFilter === "open") return o.status !== "shipped" && o.status !== "hold";
    return o.status === orderFilter;
  });

  return (
    <div className="sy-view sy-split" data-density={density}>
      <div className="sy-rail" aria-label="Order filters">
        <span className="sy-rail__title sy-micro">Queue</span>
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`sy-cat ${orderFilter === f ? "is-on" : ""}`}
            aria-pressed={orderFilter === f}
            onClick={() => setOrderFilter(f)}
          >
            <span className="sy-cat__name">{FILTER_LABEL[f]}</span>
            <span className="sy-cat__n sy-tnum">
              {f === "all"
                ? orders.length
                : f === "open"
                  ? orders.filter((o) => o.status !== "shipped" && o.status !== "hold").length
                  : orders.filter((o) => o.status === f).length}
            </span>
          </button>
        ))}

        <span className="sy-rail__title sy-micro">Ready to load</span>
        <ol className="sy-loadlist">
          {orders
            .filter((o) => o.status === "packed")
            .map((o) => (
              <li key={o.id}>
                <b className="sy-tnum">{o.ref}</b>
                <span>{o.customer}</span>
                <i className="sy-tnum">{money(orderValue(o, skus))}</i>
              </li>
            ))}
          {orders.filter((o) => o.status === "packed").length === 0 && (
            <li className="sy-loadlist__empty">Nothing staged on the dock.</li>
          )}
        </ol>
      </div>

      <div className="sy-datacol">
        <div className="sy-toolbar">
          <span className="sy-toolbar__count sy-micro">
            {visible.length} order{visible.length === 1 ? "" : "s"} ·{" "}
            <b className="sy-tnum">{money(visible.reduce((a, o) => a + orderValue(o, skus), 0))}</b> pipeline
          </span>
          <div className="sy-filters" role="group" aria-label="Sort hint">
            <button type="button" className="sy-filter" onClick={() => notify("Sorted by due date — the demo has one order")}>
              Due date
            </button>
            <button type="button" className="sy-filter" onClick={() => notify("Export queued — the demo has no backend")}>
              Export
            </button>
          </div>
        </div>

        <ul className="sy-orders">
          {visible.map((o) => (
            <li key={o.id}>
              <button
                type="button"
                className="sy-order"
                data-status={o.status}
                data-open={selectedOrder === o.id || undefined}
                onClick={() => selectOrder(selectedOrder === o.id ? null : o.id)}
              >
                <span className="sy-order__ref sy-tnum">{o.ref}</span>
                <span className="sy-order__cust">{o.customer}</span>
                <span className="sy-order__meta sy-micro">
                  {o.channel} · {o.lines.length} lines · due {o.due}
                </span>
                <span className="sy-order__val sy-tnum">{money(orderValue(o, skus))}</span>
                <OrderChip status={o.status} />
                <ArrowIcon size={14} />
              </button>
            </li>
          ))}
          {visible.length === 0 && <li className="sy-orders__empty">No orders in this state.</li>}
        </ul>

        <footer className="sy-tablefoot">
          <span className="sy-tnum">
            {orders.filter((o) => o.status === "shipped").length} shipped this cycle
          </span>
          <span className="sy-tablefoot__hint">
            <CheckIcon size={12} /> Shipping an order decrements the shared inventory
          </span>
        </footer>
      </div>

      {detail && <OrderDetail order={detail} />}
    </div>
  );
}
