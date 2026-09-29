"use client";

/**
 * stockyard / screens / inventory — the main screen, and the reason this
 * is a desktop build rather than a phone list.
 *
 * What makes it a DESKTOP inventory console:
 *   - a persistent left RAIL of categories with live counts
 *   - a sortable, multi-select table with a fixed layout (it can never
 *     produce a horizontal scrollbar at 1280×800)
 *   - checkbox multi-select driving a bulk action bar
 *   - a detail DRAWER that opens BESIDE the data, never over it
 *   - a density preference that changes the row height app-wide
 *
 * At tablet width (@container surface, ≤ 900px) the arrangement genuinely
 * changes: the rail becomes a sticky filter bar, the table becomes a
 * stack of self-describing records, and the drawer becomes a full-width
 * block that sits directly under that bar.
 */

import {
  CATEGORIES,
  STOCK_STATE_LABEL,
  freeStock,
  money,
  stockState,
  stockValue,
  type Category,
  type StockState,
} from "../data";
import { useStockyard, type SortKey, type StockFilter } from "../state/stockyard-context";
import { DetailDrawer } from "../components/detail-drawer";
import { StockChip } from "../components/status-chip";
import { AlertIcon, CheckIcon, SearchIcon, XIcon } from "../components/icons";

const COLUMNS: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "sku", label: "SKU" },
  { key: "name", label: "Description" },
  { key: "onHand", label: "On hand", align: "right" },
  { key: "reserved", label: "Res.", align: "right" },
  { key: "free", label: "Free", align: "right" },
  { key: "reorderPoint", label: "ROP", align: "right" },
  { key: "unitCost", label: "Unit cost", align: "right" },
];

const STOCK_FILTERS: StockFilter[] = ["all", "ok", "low", "critical", "backorder"];

export function InventoryScreen() {
  const {
    visibleSkus,
    skus,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    stockFilter,
    setStockFilter,
    sort,
    toggleSort,
    selectedSku,
    selectSku,
    selectedIds,
    toggleRow,
    clearSelection,
    density,
    notify,
  } = useStockyard();

  const allSelected = visibleSkus.length > 0 && selectedIds.length === visibleSkus.length;
  const selectedTotal = visibleSkus
    .filter((s) => selectedIds.includes(s.id))
    .reduce((a, s) => a + stockValue(s), 0);
  const selectedUnits = visibleSkus
    .filter((s) => selectedIds.includes(s.id))
    .reduce((a, s) => a + s.onHand, 0);

  const categoryCount = (c: Category | "all") =>
    c === "all" ? skus.length : skus.filter((s) => s.category === c).length;

  return (
    <div className="sy-view sy-split" data-density={density}>
      {/* ---- left rail of categories (desktop-only navigation) ---- */}
      <nav className="sy-rail" aria-label="Categories">
        <span className="sy-rail__title sy-micro">Categories</span>
        <button
          type="button"
          className={`sy-cat ${categoryFilter === "all" ? "is-on" : ""}`}
          aria-pressed={categoryFilter === "all"}
          onClick={() => setCategoryFilter("all")}
        >
          <span className="sy-cat__name">All stock</span>
          <span className="sy-cat__n sy-tnum">{categoryCount("all")}</span>
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`sy-cat ${categoryFilter === c ? "is-on" : ""}`}
            aria-pressed={categoryFilter === c}
            onClick={() => setCategoryFilter(categoryFilter === c ? "all" : c)}
          >
            <span className="sy-cat__name">{c}</span>
            <span className="sy-cat__n sy-tnum">{categoryCount(c)}</span>
          </button>
        ))}
      </nav>

      {/* ---- the data ---- */}
      <div className="sy-datacol">
        <div className="sy-toolbar">
          <label className="sy-search">
            <SearchIcon size={15} />
            <input
              type="search"
              value={search}
              placeholder="Search SKU, description, supplier"
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search stock"
            />
            <kbd>/</kbd>
          </label>
          <div className="sy-filters" role="group" aria-label="Filter by stock state">
            {STOCK_FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={`sy-filter ${stockFilter === f ? "is-on" : ""}`}
                aria-pressed={stockFilter === f}
                onClick={() => setStockFilter(f)}
              >
                {f === "all" ? "All" : STOCK_STATE_LABEL[f as StockState]}
              </button>
            ))}
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="sy-bulkbar" role="status">
            <b className="sy-tnum">{selectedIds.length}</b> selected
            <span className="sy-bulkbar__stat sy-tnum">
              {selectedUnits.toLocaleString("en-US")} units · {money(selectedTotal)}
            </span>
            <span className="sy-bulkbar__sep" />
            <button type="button" onClick={() => notify("Purchase requisition drafted for the selection")}>
              Raise PO
            </button>
            <button type="button" onClick={() => notify("Cycle count scheduled for the selected bins")}>
              Schedule count
            </button>
            <button type="button" onClick={() => notify("Reorder report exported — the demo has no backend")}>
              Export
            </button>
            <button type="button" onClick={clearSelection} className="sy-bulkbar__clear" aria-label="Clear selection">
              <XIcon size={12} />
            </button>
          </div>
        )}

        <table className="sy-table">
          {/* Fixed layout: column widths are percentages, so the table can
              never overflow its column and force a horizontal scrollbar. */}
          <colgroup>
            <col style={{ width: "4%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "13%" }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="sy-table__check">
                <input
                  type="checkbox"
                  checked={allSelected}
                  aria-label="Select every visible row"
                  onChange={() => {
                    if (allSelected) clearSelection();
                    else visibleSkus.forEach((s) => toggleRow(s.id));
                  }}
                />
              </th>
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  style={c.align === "right" ? { textAlign: "right" } : undefined}
                  aria-sort={sort.key === c.key ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                >
                  <button type="button" onClick={() => toggleSort(c.key)}>
                    {c.label}
                    <span className={`sy-sort ${sort.key === c.key ? "is-on" : ""}`} aria-hidden="true">
                      {sort.key === c.key && sort.dir === "asc" ? "▲" : "▼"}
                    </span>
                  </button>
                </th>
              ))}
              <th scope="col">State</th>
            </tr>
          </thead>
          <tbody>
            {visibleSkus.map((s) => {
              const state = stockState(s);
              const checked = selectedIds.includes(s.id);
              return (
                <tr
                  key={s.id}
                  data-selected={selectedSku === s.id || undefined}
                  data-checked={checked || undefined}
                  data-state={state}
                  onClick={() => selectSku(selectedSku === s.id ? null : s.id)}
                >
                  <td className="sy-table__check" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={checked}
                      aria-label={`Select ${s.sku}`}
                      onChange={() => toggleRow(s.id)}
                    />
                  </td>
                  <td className="sy-table__sku">
                    <b className="sy-tnum">{s.sku}</b>
                  </td>
                  <td data-label="Description" className="sy-table__name">
                    {s.name}
                    <span className="sy-table__sub">{s.supplier}</span>
                  </td>
                  <td data-label="On hand" className="sy-table__num sy-tnum" style={{ textAlign: "right" }}>
                    {s.onHand.toLocaleString("en-US")}
                  </td>
                  <td data-label="Reserved" className="sy-table__num sy-tnum" style={{ textAlign: "right" }}>
                    {s.reserved.toLocaleString("en-US")}
                  </td>
                  <td data-label="Free" className="sy-table__num sy-tnum" style={{ textAlign: "right" }}>
                    {freeStock(s).toLocaleString("en-US")}
                  </td>
                  <td data-label="ROP" className="sy-table__num sy-tnum" style={{ textAlign: "right" }}>
                    {s.reorderPoint.toLocaleString("en-US")}
                  </td>
                  <td data-label="Unit cost" className="sy-table__num sy-tnum" style={{ textAlign: "right" }}>
                    {money(s.unitCost)}
                  </td>
                  <td data-label="State" className="sy-table__state">
                    <StockChip state={state} />
                  </td>
                </tr>
              );
            })}
            {visibleSkus.length === 0 && (
              <tr>
                <td colSpan={8} className="sy-table__empty">
                  No stock matches this view. Clear the search, or pick another category or state.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <footer className="sy-tablefoot">
          <span className="sy-tnum">
            {visibleSkus.length} of {skus.length} SKUs
          </span>
          <span className="sy-tablefoot__hint">
            <CheckIcon size={12} /> Click a row to open its detail panel on the right
          </span>
        </footer>
      </div>

      {selectedSku && <DetailDrawer />}
    </div>
  );
}

/** Small warning used by the top bar + settings; kept beside the screen it
 *  summarises so the counts never drift from the data they describe. */
export function StockWarning() {
  const { counts, go } = useStockyard();
  if (counts.critical + counts.backorder === 0) return null;
  return (
    <button className="sy-warn" type="button" onClick={() => go("inventory")}>
      <AlertIcon size={13} />
      <span className="sy-tnum">{counts.critical + counts.backorder}</span> critical
    </button>
  );
}
