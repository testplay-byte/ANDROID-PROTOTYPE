"use client";

/* pulse / screens/settings-screen — workspace preferences, all persisted:
   - theme: Dark/Light segmented (via useDeviceTheme → `pulse-theme`,
     scoped to .device only)
   - refresh interval: Carbon number stepper (5s…120s, step 5)
   - notifications: sev-1 page / sev-2 email / weekly digest switches
   - table density: Comfortable/Compact segmented — changes row heights
     app-wide (class on the .plu root)
   - reset incident state button + About row → toast */

import type { ReactNode } from "react";
import { useDeviceTheme } from "../../../proto-kit";
import { usePulse } from "../state/pulse-context";
import { CarbonSwitch, Segmented, ActionButton } from "../components/controls";
import { MinusIcon, PlusIcon, BellIcon } from "../components/icons";

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="plu-panel">
      <h2 className="plu-sechead">{title}</h2>
      <div className="plu-setgroup">{children}</div>
    </section>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="plu-setrow">
      <div className="plu-setrow__txt">
        <span className="plu-setrow__label">{label}</span>
        {hint ? <span className="plu-setrow__hint">{hint}</span> : null}
      </div>
      <div className="plu-setrow__ctrl">{children}</div>
    </div>
  );
}

export function SettingsScreen() {
  const { theme, setTheme } = useDeviceTheme();
  const { prefs, setPrefs, showToast, resetIncidents } = usePulse();

  const stepRefresh = (delta: number) => {
    const next = Math.min(120, Math.max(5, prefs.refreshSec + delta));
    if (next === prefs.refreshSec) return;
    setPrefs({ refreshSec: next });
  };

  return (
    <div className="plu-screen plu-screen--settings">
      <div className="plu-scroll">
        <Group title="Appearance">
          <Row label="Theme" hint="Scoped to the device, persisted">
            <Segmented
              ariaLabel="Theme"
              options={[
                { id: "dark", label: "DARK" },
                { id: "light", label: "LIGHT" },
              ]}
              value={theme}
              onSelect={(id) => setTheme(id as "dark" | "light")}
            />
          </Row>
          <Row label="Table density" hint="Row heights across all screens">
            <Segmented
              ariaLabel="Table density"
              options={[
                { id: "comfortable", label: "COMFORTABLE" },
                { id: "compact", label: "COMPACT" },
              ]}
              value={prefs.density}
              onSelect={(id) => setPrefs({ density: id as "comfortable" | "compact" })}
            />
          </Row>
        </Group>

        <Group title="Monitoring">
          <Row label="Refresh interval" hint="Synthetic probe cadence">
            <div className="plu-stepper">
              <button
                type="button"
                className="plu-stepper__btn"
                aria-label="Decrease refresh interval"
                onClick={() => stepRefresh(-5)}
                disabled={prefs.refreshSec <= 5}
              >
                <MinusIcon />
              </button>
              <span className="plu-stepper__val tnum" aria-live="polite">
                {prefs.refreshSec}s
              </span>
              <button
                type="button"
                className="plu-stepper__btn"
                aria-label="Increase refresh interval"
                onClick={() => stepRefresh(5)}
                disabled={prefs.refreshSec >= 120}
              >
                <PlusIcon />
              </button>
            </div>
          </Row>
          <Row label="Incident state" hint="Ack / resolve decisions are persisted">
            <ActionButton kind="ghost" onClick={resetIncidents}>
              <BellIcon size={14} />
              Reset to defaults
            </ActionButton>
          </Row>
        </Group>

        <Group title="Notifications">
          <Row label="SEV-1 incidents" hint="Page on-call immediately">
            <CarbonSwitch
              checked={prefs.notifySev1}
              onChange={(v) => setPrefs({ notifySev1: v })}
              label="Page me on SEV-1 incidents"
            />
          </Row>
          <Row label="SEV-2 incidents" hint="Email to ops distribution list">
            <CarbonSwitch
              checked={prefs.notifySev2}
              onChange={(v) => setPrefs({ notifySev2: v })}
              label="Email me on SEV-2 incidents"
            />
          </Row>
          <Row label="Weekly digest" hint="Availability report, Mondays 09:00">
            <CarbonSwitch
              checked={prefs.notifyWeekly}
              onChange={(v) => {
                setPrefs({ notifyWeekly: v });
                if (v) showToast("Weekly digest enabled", "success");
              }}
              label="Send weekly availability digest"
            />
          </Row>
        </Group>

        <Group title="Workspace">
          <Row label="Region primary" hint="Default dashboard region">
            <span className="plu-setval tnum">us-east-1</span>
          </Row>
          <Row label="Plan" hint="Ent · 200 monitoring slots">
            <span className="plu-setval">Pulse Enterprise</span>
          </Row>
          <Row label="Build" hint="Prototype fixture data">
            <span className="plu-setval tnum">v1.4.0-static</span>
          </Row>
        </Group>
      </div>
    </div>
  );
}
