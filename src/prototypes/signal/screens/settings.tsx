"use client";

/**
 * signal / screens / settings — the desktop preference surface.
 *
 * A two-column settings form (not a scrolling phone list). The two
 * interesting controls are real: "reduce motion" switches off every chart's
 * draw-in animation, and density rescales every table and card app-wide. The
 * keyboard reference documents the shortcuts the shell actually binds.
 */

import { useDeviceTheme } from "../../../proto-kit";
import { useSignal, VIEWS, type Density } from "../state/signal-context";
import { Kbd, Legend, Panel, PanelHead, Readout, Segmented, Toggle } from "../components/atoms";
import { BellIcon, DownloadIcon, FilterIcon, KeyboardIcon, MotionIcon, PulseIcon, SlidersIcon } from "../components/icons";

const SHORTCUTS: { keys: string; action: string }[] = [
  { keys: "⌘K / Ctrl+K", action: "Open the command palette" },
  { keys: "1 – 5", action: "Jump to Overview / Funnel / Retention / Explore / Settings" },
  { keys: "R", action: "Cycle the range 7D → 30D → 90D" },
  { keys: "/", action: "Focus the event search on Explore" },
  { keys: "Esc", action: "Close the palette, the inspector or the selection" },
  { keys: "Drag on a chart", action: "Brush a window on the time series" },
];

export function SettingsScreen() {
  const { density, setDensity, reduceMotion, setReduceMotion, notify, segmentsDirty, resetSegments, range, setRange } =
    useSignal();
  const { theme, setTheme } = useDeviceTheme();

  return (
    <div className="sig-view sig-view--settings" data-density={density}>
      <div className="sig-settings">
        <Panel>
          <PanelHead title="Appearance" unit="scoped to this window" />
          <div className="sig-field">
            <label>Theme</label>
            <Segmented
              label="Theme"
              value={theme}
              onChange={(t) => setTheme(t)}
              options={[
                { id: "dark", label: "Dark" },
                { id: "light", label: "Light" },
              ]}
            />
            <p className="sig-field__hint">
              Console defines both themes in <code>console.css</code>; flipping this re-inks every chart
              series because the charts only ever read <code>--chart-series-*</code>.
            </p>
          </div>

          <div className="sig-field">
            <label>Density</label>
            <Segmented
              label="Row density"
              value={density}
              onChange={(d: Density) => setDensity(d)}
              options={[
                { id: "comfortable", label: "Comfortable" },
                { id: "compact", label: "Compact" },
              ]}
            />
            <p className="sig-field__hint">Changes row height, card padding and the feed app-wide. Remembered.</p>
          </div>

          <div className="sig-field">
            <label>Range default</label>
            <div className="sig-field__row">
              <Segmented
                label="Range"
                value={range}
                onChange={(r) => setRange(r)}
                options={[
                  { id: "7d", label: "7D" },
                  { id: "30d", label: "30D" },
                  { id: "90d", label: "90D" },
                ]}
                compact
              />
              <button className="sig-btn" type="button" onClick={() => setRange("30d")}>
                Reset to 30D
              </button>
            </div>
            <p className="sig-field__hint">The range is global — every view re-derives from the same slice.</p>
          </div>
        </Panel>

        <Panel>
          <PanelHead title="Motion & density" unit="display" />
          <div className="sig-field sig-field--row">
            <span className="sig-field__icon" aria-hidden="true">
              <MotionIcon size={16} />
            </span>
            <div className="sig-field__text">
              <b>Reduce motion</b>
              <p className="sig-field__hint">
                Stops every chart&apos;s draw-in animation: line strokes render complete, bars and heat cells
                appear at full height. Hover and brush readouts are untouched.
              </p>
            </div>
            <Toggle on={reduceMotion} onChange={setReduceMotion} label="Reduce motion" />
          </div>

          <div className="sig-field sig-field--row">
            <span className="sig-field__icon" aria-hidden="true">
              <SlidersIcon size={16} />
            </span>
            <div className="sig-field__text">
              <b>Current segments</b>
              <p className="sig-field__hint">
                {segmentsDirty ? "A segment filter is active across every view." : "No segment filter — every view shows the whole dataset."}
              </p>
            </div>
            <button className="sig-btn" type="button" onClick={resetSegments} disabled={!segmentsDirty}>
              <FilterIcon size={14} /> Reset
            </button>
          </div>

          <div className="sig-field sig-field--row">
            <span className="sig-field__icon" aria-hidden="true">
              <BellIcon size={16} />
            </span>
            <div className="sig-field__text">
              <b>Alerting</b>
              <p className="sig-field__hint">Anomaly alerts are listed on Overview. This demo has no backend to route them to.</p>
            </div>
            <button className="sig-btn" type="button" onClick={() => notify("Test alert sent to the demo inbox")}>
              Send test
            </button>
          </div>
        </Panel>

        <Panel>
          <PanelHead title="Keyboard" unit="desktop shortcuts" right={<Kbd>⌘K</Kbd>} />
          <dl className="sig-shortcuts">
            {SHORTCUTS.map((s) => (
              <div key={s.keys}>
                <dt>
                  <Kbd>{s.keys}</Kbd>
                </dt>
                <dd>{s.action}</dd>
              </div>
            ))}
          </dl>
          <p className="sig-field__hint">
            <KeyboardIcon size={14} /> Views are hash-routed, so every screen is deep-linkable —{" "}
            <code>#funnel</code>, <code>#retention</code>, <code>#explore</code>.
          </p>
        </Panel>

        <Panel>
          <PanelHead title="Views" unit="hash routes" />
          <ul className="sig-viewlist">
            {VIEWS.map((v, i) => (
              <li key={v.id}>
                <Kbd>{i + 1}</Kbd>
                <b>{v.label}</b>
                <span>{v.hint}</span>
                <code>#{v.id}</code>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <PanelHead title="Ink" unit="the chart palette" />
          <Legend
            items={[
              { label: "Series 1 — signal", series: 1 },
              { label: "Series 2 — comparison", series: 2 },
              { label: "Series 3 — caution", series: 3 },
              { label: "Series 4 — secondary", series: 4 },
              { label: "Series 5 — failure", series: 5 },
            ]}
          />
          <Readout
            items={[
              { label: "Gridlines", value: "--chart-grid" },
              { label: "Axes", value: "--chart-axis" },
              { label: "Series", value: "--chart-series-1…5" },
            ]}
            note="No chart in Signal names a colour. It names a series index, and the token supplies the ink."
          />
        </Panel>

        <Panel>
          <PanelHead title="Data" unit="demo dataset" />
          <p className="sig-field__hint">
            <PulseIcon size={14} /> 210 days of history from a fixed-seed generator, pinned to 29 Sep 2026.
            No <code>Math.random</code>, no <code>Date.now</code> — reload and every number is identical.
          </p>
          <div className="sig-field sig-field--row">
            <button className="sig-btn" type="button" onClick={() => notify("Preferences reset to defaults")}>
              Reset preferences
            </button>
            <button className="sig-btn sig-btn--solid" type="button" onClick={() => notify("Export queued — the demo has no backend")}>
              <DownloadIcon size={14} /> Export workspace
            </button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
