"use client";

/**
 * stockyard / screens / settings — preferences, alerts and the keyboard map.
 *
 * Two-column desktop settings: controls on the left, a LIVE PREVIEW of the
 * affected table on the right. The density switch is not a decoration — it
 * sets `data-density` on the app root, which is what the inventory table,
 * the movement ledger and the order queue all read to size their rows.
 *
 * The alert switches read from token pairs only (container + on-container),
 * so they stay legible in the dark brutalism palette AND its light
 * counterpart without a second rule set.
 */

import { useDeviceTheme } from "../../../proto-kit";
import { money, stockState, STOCK_STATE_LABEL } from "../data";
import { useStockyard, type Density, type Notifications } from "../state/stockyard-context";
import { CheckIcon, RefreshIcon } from "../components/icons";

const SHORTCUTS: { keys: string; action: string }[] = [
  { keys: "⌘K / Ctrl+K", action: "Open the command palette" },
  { keys: "Esc", action: "Close the palette, detail panel or selection" },
  { keys: "/", action: "Focus the stock search field" },
  { keys: "1 – 4", action: "Jump to Inventory / Orders / Movement / Settings" },
  { keys: "D", action: "Flip row density between regular and dense" },
];

const ALERTS: { key: keyof Notifications; label: string; hint: string }[] = [
  { key: "lowStock", label: "Low stock", hint: "Warn when on-hand drops to the reorder point" },
  { key: "backorders", label: "Backorders", hint: "Raise immediately when a SKU hits zero" },
  { key: "orderAlerts", label: "Order events", hint: "Notify when a shipment is despatched" },
  { key: "dailyDigest", label: "Daily digest", hint: "One summary of the day's units at close" },
];

function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="sy-seg" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          className={`sy-seg__btn ${value === o.id ? "is-on" : ""}`}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Switch({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className="sy-switch"
      data-on={on || undefined}
      onClick={() => onChange(!on)}
    >
      <span className="sy-switch__box">
        <span className="sy-switch__knob">{on ? <CheckIcon size={11} strokeWidth={3} /> : null}</span>
      </span>
      <span className="sy-switch__text">{on ? "ON" : "OFF"}</span>
    </button>
  );
}

export function SettingsScreen() {
  const { density, setDensity, notifications, setNotification, skus, resetData, notify, counts } = useStockyard();
  const { theme, setTheme } = useDeviceTheme();

  /* A small slice of the real table, so the density preview is the actual
     row grammar and not a mock-up of it. */
  const preview = skus.slice(0, 6);

  return (
    <div className="sy-view" data-density={density}>
      <div className="sy-settings">
        <div className="sy-settings__col">
          <section className="sy-block">
            <header className="sy-block__head">
              <h2>Appearance</h2>
            </header>

            <div className="sy-field">
              <label>Theme</label>
              <Segmented
                label="Theme"
                value={theme}
                onChange={(t) => setTheme(t)}
                options={[
                  { id: "dark", label: "Ink" },
                  { id: "light", label: "Paper" },
                ]}
              />
              <p className="sy-field__hint">
                Scoped to this window — the dashboard around it never changes. Both palettes are the
                same brutalism contract: 0px radius, 2px ink borders, hard offset shadows.
              </p>
            </div>

            <div className="sy-field">
              <label>Row density</label>
              <Segmented
                label="Row density"
                value={density}
                onChange={(d: Density) => setDensity(d)}
                options={[
                  { id: "regular", label: "Regular" },
                  { id: "dense", label: "Dense" },
                ]}
              />
              <p className="sy-field__hint">
                Writes <code>data-density</code> on the app root. The inventory table, the movement
                ledger and the order queue all size their rows from it — see the live sample →
              </p>
            </div>
          </section>

          <section className="sy-block">
            <header className="sy-block__head">
              <h2>Alerts</h2>
              <span className="sy-micro">Stored on this device</span>
            </header>
            <ul className="sy-switches">
              {ALERTS.map((a) => (
                <li key={a.key}>
                  <div>
                    <b>{a.label}</b>
                    <span>{a.hint}</span>
                  </div>
                  <Switch
                    on={notifications[a.key]}
                    onChange={(v) => {
                      setNotification(a.key, v);
                      notify(`${a.label} alerts ${v ? "on" : "off"}`);
                    }}
                    label={a.label}
                  />
                </li>
              ))}
            </ul>
          </section>

          <section className="sy-block">
            <header className="sy-block__head">
              <h2>Keyboard</h2>
              <span className="sy-micro">Desktop only</span>
            </header>
            <dl className="sy-shortcuts">
              {SHORTCUTS.map((s) => (
                <div key={s.keys}>
                  <dt>
                    <kbd>{s.keys}</kbd>
                  </dt>
                  <dd>{s.action}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="sy-block">
            <header className="sy-block__head">
              <h2>Data</h2>
            </header>
            <p className="sy-field__hint">
              Every figure in Stockyard is seeded — no randomness, no backend. Restocking and
              shipping really do move the numbers; resetting puts the yard back to its opening state.
            </p>
            <div className="sy-field sy-field--row">
              <button className="sy-btn" type="button" onClick={resetData}>
                <RefreshIcon size={14} /> Reset the yard
              </button>
              <button
                className="sy-btn sy-btn--solid"
                type="button"
                onClick={() => notify("Export queued — the demo has no backend to export to")}
              >
                Export stock ledger
              </button>
            </div>
          </section>
        </div>

        <div className="sy-settings__preview">
          <section className="sy-block">
            <header className="sy-block__head">
              <h2>Row preview</h2>
              <span className="sy-micro">
                {density === "dense" ? "Dense · 26px" : "Regular · 40px"}
              </span>
            </header>
            <table className="sy-table sy-preview" data-density={density}>
              <colgroup>
                <col style={{ width: "24%" }} />
                <col style={{ width: "26%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "25%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">SKU</th>
                  <th scope="col">Item</th>
                  <th scope="col" style={{ textAlign: "right" }}>
                    On hand
                  </th>
                  <th scope="col">State</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((s) => {
                  const state = stockState(s);
                  return (
                    <tr key={s.id} data-state={state}>
                      <td className="sy-tnum">
                        <b>{s.sku}</b>
                      </td>
                      <td>{s.name}</td>
                      <td className="sy-tnum" style={{ textAlign: "right" }}>
                        {s.onHand.toLocaleString("en-US")}
                      </td>
                      <td>
                        <span className="sy-chip" data-chip="stock" data-state={state}>
                          {STOCK_STATE_LABEL[state]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <dl className="sy-facts sy-facts--tight">
              <div>
                <dt>SKUs tracked</dt>
                <dd className="sy-tnum">{counts.skus}</dd>
              </div>
              <div>
                <dt>Units on hand</dt>
                <dd className="sy-tnum">{counts.units.toLocaleString("en-US")}</dd>
              </div>
              <div>
                <dt>Stock value</dt>
                <dd className="sy-tnum">{money(counts.value)}</dd>
              </div>
              <div>
                <dt>Open orders</dt>
                <dd className="sy-tnum">{counts.openOrders}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
