"use client";

/**
 * halo / screens / energy — where the power goes.
 *
 * Three questions, three panels, and the same comparison running through all
 * of them: today against yesterday.
 *   1. a stat strip (today's kWh, the delta, the money, the live load)
 *   2. a 24-hour bar chart with yesterday drawn across it, plus the peak-rate
 *      strip that names the expensive window
 *   3. a by-device breakdown where every bar carries a tick for yesterday, so
 *      "is this device worse than it was?" is answerable without a second
 *      chart
 *
 * Every figure is derived from the live device state, so switching something
 * off on the Home grid or in the Rooms drawer moves these numbers.
 */

import { PEAK_WINDOW, hourLabel, kwhPrev, kwhToday, signedPct, type Device } from "../data";
import { useHalo } from "../state/halo-context";
import { DeviceBar, ChartAxis, HourlyBars, PeakStrip } from "../components/charts";
import { CardHead, Chip, Legend, StatTile } from "../components/controls";
import { DeviceIcon, LeafIcon, MoonIcon, TrendIcon } from "../components/icons";

const topDevices = (list: Device[], n: number) =>
  [...list].sort((a, b) => kwhToday(b) - kwhToday(a)).slice(0, n);

export function EnergyScreen() {
  const { devices, metrics, usageToday, usagePrev, hourNow, tariff } = useHalo();
  const ranked = topDevices(devices, 8);
  const busiest = usageToday.indexOf(Math.max(...usageToday));
  const peakKwh = usageToday.slice(PEAK_WINDOW.from, PEAK_WINDOW.to + 1).reduce((s, v) => s + v, 0);

  return (
    <div className="halo-view">
      <div className="halo-stats">
        <StatTile
          label="Used today"
          value={metrics.kwhToday.toFixed(2)}
          unit="kWh"
          sub={`${metrics.kwhPrev.toFixed(2)} kWh yesterday`}
          tone="flat"
          icon={<LeafIcon size={15} />}
        />
        <StatTile
          label="Against yesterday"
          value={signedPct(metrics.deltaPct)}
          sub={metrics.deltaPct <= 0 ? "Down — the better direction" : "Up — worth a look"}
          tone={metrics.deltaPct <= 0 ? "down" : "up"}
          icon={<TrendIcon size={15} />}
        />
        <StatTile
          label="Cost so far"
          value={`£${metrics.costToday.toFixed(2)}`}
          sub={`Fixed tariff ${tariff.toFixed(1)}p / kWh`}
          tone="flat"
          icon={<MoonIcon size={15} />}
        />
        <StatTile
          label="Live load"
          value={String(Math.round(metrics.liveWatts))}
          unit="W"
          sub={`${metrics.onCount} of ${metrics.totalCount} devices on`}
          tone="down"
          icon={<LeafIcon size={15} />}
        />
      </div>

      <section className="halo-card halo-raised">
        <CardHead
          title="Hourly load"
          desc={`kWh per hour — the darker bars are hours already gone (frozen at ${hourLabel(hourNow)})`}
          action={
            <Legend
              items={[
                { label: "Today", on: true },
                { label: "Yesterday", on: false },
                { label: "Peak rate", on: false },
              ]}
            />
          }
        />
        <HourlyBars today={usageToday} prev={usagePrev} nowHour={hourNow} />
        <ChartAxis />
      </section>

      <div className="halo-band">
        <section className="halo-card halo-raised">
          <CardHead
            title="Peak hours"
            desc={`The meter's expensive window is ${PEAK_WINDOW.label}`}
            meta={`${peakKwh.toFixed(2)} kWh in the window`}
          />
          <PeakStrip values={usageToday} nowHour={hourNow} />
          <p className="halo-note">
            Busiest hour <b className="tnum">{hourLabel(busiest)}</b> at{" "}
            <b className="tnum">{Math.max(...usageToday).toFixed(2)} kWh</b> — the kettle, the desk
            rig and the evening lights all land in the same two hours.
          </p>
        </section>

        <section className="halo-card halo-raised">
          <CardHead
            title="Where it goes"
            desc="Today against yesterday, per device — the tick is yesterday's share"
            meta={`${ranked.length} of ${devices.length}`}
          />
          <ul className="halo-usage">
            {ranked.map((d) => {
              const t = kwhToday(d);
              const p = kwhPrev(d);
              const delta = p === 0 ? 0 : ((t - p) / p) * 100;
              return (
                <li key={d.id}>
                  <span className="halo-usage__icon" aria-hidden="true">
                    <DeviceIcon kind={d.kind} size={15} />
                  </span>
                  <span className="halo-usage__id">
                    <b>{d.name}</b>
                    <span>{d.on ? "Running" : "Idle"}</span>
                  </span>
                  <DeviceBar today={t} prev={p} />
                  <b className="halo-usage__num tnum">{t.toFixed(2)}</b>
                  <Chip tone={delta > 0 ? "warn" : "on"}>{signedPct(delta)}</Chip>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
