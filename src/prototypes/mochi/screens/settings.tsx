"use client";

/**
 * mochi / screens / settings — preferences and the keyboard reference.
 *
 * Desktop settings are a two-column form of independent cards, not one
 * long phone-style list. The clay depth control is the prototype's own
 * idea: it writes `data-clay-depth` on the app root and the stylesheet
 * swaps the whole shadow recipe — the surfaces physically inflate or
 * relax, live, without any code running.
 */

import { useDeviceTheme } from "../../../proto-kit";
import { BALANCE, TODAY, money, type WeekStart } from "../data";
import { DEPTH_HINT, DEPTH_LABEL, useMochi, type Depth } from "../state/mochi-context";
import { Card, Segmented } from "../components/atoms";
import { LayersIcon, MoonIcon, SunIcon } from "../components/icons";

const SHORTCUTS: { keys: string; action: string }[] = [
  { keys: "⌘K / Ctrl+K", action: "Open the command palette" },
  { keys: "1 – 4", action: "Jump to Today / Budget / Habits / Settings" },
  { keys: "/", action: "Open Budget and focus the envelope filter" },
  { keys: "Esc", action: "Close the palette and the detail pane" },
  { keys: "↑ ↓ ↵", action: "Move and open inside the command palette" },
];

const DEPTHS: Depth[] = ["soft", "medium", "deep"];

export function SettingsScreen() {
  const { theme, setTheme } = useDeviceTheme();
  const { depth, setDepth, weekStart, setWeekStart, notify, resetAll, isWide, today } = useMochi();

  return (
    <div className="mch-view mch-settings">
      <div className="mch-settings__grid">
        <Card title="Appearance" sub="Scoped to the window — the stage around it never changes.">
          <div className="mch-field">
            <label id="mch-theme">Theme</label>
            <Segmented
              label="Theme"
              value={theme}
              onChange={(t) => setTheme(t)}
              options={[
                { id: "dark", label: "Dark" },
                { id: "light", label: "Light" },
              ]}
            />
            <p className="mch-hint">
              Light clay keeps ink-dark text on pale dough — never pale text on a pale card.
            </p>
          </div>

          <div className="mch-field">
            <label id="mch-depth">
              <LayersIcon size={14} /> Clay depth
            </label>
            <Segmented
              label="Clay depth"
              value={depth}
              onChange={(d: Depth) => {
                setDepth(d);
                notify(`Clay depth · ${DEPTH_LABEL[d]}`);
              }}
              options={DEPTHS.map((d) => ({ id: d, label: DEPTH_LABEL[d] }))}
              block
            />
            <p className="mch-hint">{DEPTH_HINT[depth]}</p>
            <ul className="mch-depthpreview" aria-label="Clay depth preview">
              {DEPTHS.map((d) => (
                <li key={d} data-depth={d} data-on={depth === d || undefined}>
                  <span className="mch-depthpreview__tile" />
                  <span className="mch-depthpreview__label">{DEPTH_LABEL[d]}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card title="Calendar" sub="Changes how every week in Mochi is grouped and labelled.">
          <div className="mch-field">
            <label id="mch-weekstart">Week starts on</label>
            <Segmented
              label="Week start day"
              value={weekStart}
              onChange={(w: WeekStart) => {
                setWeekStart(w);
                notify(`Week starts ${w === "mon" ? "Monday" : "Sunday"}`);
              }}
              options={[
                { id: "mon", label: "Monday" },
                { id: "sun", label: "Sunday" },
              ]}
            />
            <p className="mch-hint">
              Regroups the 7-day strips on Today, the per-day tally in the habit detail and
              the weekly labels. Today is still {today.weekday} {today.day} {today.month}.
            </p>
          </div>

          <div className="mch-field">
            <label>Demo day</label>
            <p className="mch-hint">
              Mochi freezes the clock at <b>{TODAY.iso}</b> ({today.weekday}) so the agenda,
              the streaks and the 30-day spend are identical for every reviewer. Account
              balance <b className="tnum">{money(BALANCE.available)}</b> on {TODAY.iso}.
            </p>
          </div>
        </Card>

        <Card
          title="Keyboard"
          sub={isWide ? "Desktop shortcuts are live" : "Shortcuts are desktop-only"}
        >
          <dl className="mch-shortcuts">
            {SHORTCUTS.map((s) => (
              <div key={s.keys}>
                <dt>
                  <kbd>{s.keys}</kbd>
                </dt>
                <dd>{s.action}</dd>
              </div>
            ))}
          </dl>
          {!isWide && (
            <p className="mch-hint">
              The surface is narrower than 901px, so the palette and the number keys are parked
              — widen the window (or switch to the desktop surface) to use them.
            </p>
          )}
        </Card>

        <Card title="Data" sub="Everything here is fixed demo data — no backend, no clock.">
          <p className="mch-hint">
            Budget limits, added envelopes, habits and ticked days are stored in this browser
            only. Resetting restores the seeded plan and the default preferences.
          </p>
          <div className="mch-field mch-field--row">
            <button className="mch-btn" type="button" onClick={resetAll}>
              Reset the plan
            </button>
            <button
              className="mch-btn mch-btn--filled"
              type="button"
              onClick={() => notify("Export queued — the demo has nothing to export to")}
            >
              Export month
            </button>
          </div>
          <div className="mch-themechips" aria-hidden="true">
            <span className="mch-themechip" data-kind="dark">
              <MoonIcon size={15} /> dark dough
            </span>
            <span className="mch-themechip" data-kind="light">
              <SunIcon size={15} /> light dough
            </span>
            <span className="mch-themechip" data-kind="contrast">
              ink on cream, always
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
