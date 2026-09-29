"use client";

/**
 * helio / screens / overview — the portfolio screen.
 *
 * The composition the references use: one wide feature card, a grid of
 * panels, and a single moment of full saturation (the five stat tiles) to
 * stop the charcoal from reading as monotonous.
 */

import {
  ALERTS,
  GOALS,
  HEALTH,
  MIX,
  PRODUCTION,
  PRODUCTION_PREV,
  RANKED,
  STORAGE,
  TILES,
  WEEKS,
  WEEK_AVG,
  totalOutput,
  fmt,
} from "../data";
import { useHelio } from "../state/helio-context";
import {
  AreaLine,
  ChartCard,
  ColumnChart,
  ComboChart,
  Donut,
  HalfGauge,
  RankBars,
  SegmentedProgress,
  StackedBar,
} from "../components/charts";
import {
  BatteryIcon,
  ClockIcon,
  FlagIcon,
  GaugeIcon,
  LayersIcon,
  LeafIcon,
  SignalIcon,
  SunIcon,
} from "../components/icons";

const TILE_COLORS = [
  "var(--chart-series-5)",
  "var(--chart-series-4)",
  "var(--chart-series-3)",
  "var(--chart-series-1)",
  "var(--chart-series-2)",
];

const LOAD = [18, 22, 26, 31, 38, 44, 52, 61, 58, 49, 43, 36, 29, 24, 21, 19];

export function OverviewScreen() {
  const { density, go, notify, live } = useHelio();
  const storagePct = Math.round((STORAGE.usedMwh / STORAGE.capacityMwh) * 100);
  const mix = MIX[1]; // today, Tuesday

  return (
    <div className="hl-view" data-density={density}>
      {/* the one pop of saturation in the system */}
      <div className="hl-tiles">
        {TILES.map((t, i) => (
          <article className="hl-tile" key={t.label} style={{ background: TILE_COLORS[i] }}>
            <span>{t.label}</span>
            <strong className="tnum">
              {t.value}
              <em>{t.unit}</em>
            </strong>
          </article>
        ))}
      </div>

      <div className="hl-grid">
        <ChartCard
          title="Production today"
          tall
          icon={<GaugeIcon size={16} />}
          legend={[
            { label: "Today", color: "var(--chart-series-1)" },
            { label: "Yesterday", color: "var(--chart-series-2)" },
          ]}
          aside={
            <button className="hl-select" type="button" onClick={() => notify("Range: today · hourly")}>
              Hourly <span aria-hidden="true">▾</span>
            </button>
          }
        >
          <div className="hl-headline">
            <strong className="tnum">{fmt(totalOutput, 0)}</strong>
            <span>MW right now</span>
            <b className="hl-delta tnum">+6.2%</b>
          </div>
          <ComboChart
            values={PRODUCTION}
            compare={PRODUCTION_PREV}
            labels={PRODUCTION.map((_, i) => (i % 4 === 0 ? String(i).padStart(2, "0") : ""))}
            highlight={12}
            valueFmt={(v) => v.toFixed(1)}
            height={206}
          />
        </ChartCard>

        <ChartCard title="Quarterly goal" icon={<FlagIcon size={16} />}>
          <Donut pct={GOALS.pct} centre={`${GOALS.pct}%`} sub={`${GOALS.done} of ${GOALS.total} complete`} />
          <p className="hl-card__note">{GOALS.note}</p>
        </ChartCard>

        <ChartCard title="Grid health" icon={<SignalIcon size={16} />}>
          <div className="hl-stat">
            <strong className="tnum">{HEALTH.score}%</strong>
            <span className="hl-badge">{HEALTH.label}</span>
          </div>
          <SegmentedProgress value={HEALTH.score} segments={8} color="var(--chart-series-4)" />
          <p className="hl-card__note">Frequency held inside the band for 27 days.</p>
        </ChartCard>

        <ChartCard title="Storage" icon={<BatteryIcon size={16} />}>
          <HalfGauge
            pct={storagePct}
            centre={`${storagePct}%`}
            sub={`${STORAGE.usedMwh} / ${STORAGE.capacityMwh} MWh`}
          />
          <p className="hl-card__note">Charging at {STORAGE.chargeRate} MW.</p>
        </ChartCard>

        <ChartCard
          title="Output, 8 weeks"
          icon={<LayersIcon size={16} />}
          aside={<span className="hl-tag">MW</span>}
        >
          <ColumnChart data={WEEKS} selected={WEEKS.length - 1} avg={WEEK_AVG} avgLabel={`${WEEK_AVG} AVG`} />
        </ChartCard>

        <ChartCard title="Energy mix" icon={<SunIcon size={16} />} aside={<span className="hl-tag">today</span>}>
          <StackedBar
            segments={[
              { label: "Solar", value: mix.solar, color: "var(--chart-series-3)" },
              { label: "Wind", value: mix.wind, color: "var(--chart-series-4)" },
              { label: "Grid", value: mix.grid, color: "var(--chart-series-1)" },
              { label: "Battery", value: mix.battery, color: "var(--chart-series-2)" },
            ]}
          />
        </ChartCard>

        <ChartCard title="Top contributors" icon={<LeafIcon size={16} />} aside={<span className="hl-tag">MW</span>}>
          <RankBars rows={RANKED} format={(v) => fmt(v)} />
        </ChartCard>

        <ChartCard
          title="Alerts"
          icon={<FlagIcon size={16} />}
          aside={<span className="hl-tag">{ALERTS.length}</span>}
        >
          <ul className="hl-alerts">
            {ALERTS.map((a) => (
              <li key={a.id} data-sev={a.severity}>
                <i />
                <div>
                  <b>{a.text}</b>
                  <span>{a.when}</span>
                </div>
              </li>
            ))}
          </ul>
          <button className="hl-linkbtn" type="button" onClick={() => go("sites")}>
            Review in Sites
          </button>
        </ChartCard>

        <ChartCard
          title="Load shape"
          icon={<ClockIcon size={16} />}
          aside={<span className="hl-tag">{live ? "streaming" : "held"}</span>}
        >
          <AreaLine
            values={LOAD}
            labels={["00", "04", "08", "12", "16", "20", "24"]}
            color="var(--chart-series-1)"
          />
        </ChartCard>
      </div>
    </div>
  );
}
