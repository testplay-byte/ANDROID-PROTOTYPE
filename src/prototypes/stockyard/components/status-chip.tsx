"use client";

/**
 * stockyard / components / status-chip — the three vocabularies of the
 * console, rendered with one brutalist chip: a hard 2px border, a flat
 * token fill and an uppercase micro-label. Colour comes from `data-*`
 * attributes so the same chip reads correctly in both themes.
 */

import {
  MOVEMENT_TYPE_LABEL,
  ORDER_STATUS_LABEL,
  STOCK_STATE_LABEL,
  type MovementType,
  type OrderStatus,
  type StockState,
} from "../data";

export function StockChip({ state }: { state: StockState }) {
  return (
    <span className="sy-chip" data-chip="stock" data-state={state}>
      {STOCK_STATE_LABEL[state]}
    </span>
  );
}

export function OrderChip({ status }: { status: OrderStatus }) {
  return (
    <span className="sy-chip" data-chip="order" data-status={status}>
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}

export function MovementChip({ type }: { type: MovementType }) {
  return (
    <span className="sy-chip" data-chip="movement" data-type={type}>
      {MOVEMENT_TYPE_LABEL[type]}
    </span>
  );
}
