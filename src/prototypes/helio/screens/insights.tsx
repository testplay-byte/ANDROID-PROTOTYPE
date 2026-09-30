"use client";

/**
 * helio / screens / insights — the showcase for the extended chart
 * vocabulary: a heat map, a tree map, a radar chart, radial bars and a
 * radial gauge, all on one screen so the marks can be compared.
 */

import {
  HEAT,
  HEAT_COLS,
  HEAT_ROWS,
  RADAR_AXES,
  RADAR_NOW,
  RADAR_TARGET,
  RADIAL,
  RESERVE,
  TREE,
  fmt,
} from "../data";
import { useHelio } from "../state/helio-context";
import {
  ChartCard,
  CountUp,
  HeatMap,
  RadarChart,
  RadialBars,
  RadialGauge,
  Sparkline,
  TreeMap,
} from "../components/charts";
import { GaugeIcon, GridIcon, LayersIcon, SignalIcon } from "../components/icons";

export function InsightsScreen() {
  const { density, notify } = useHelio();

  return (
    <div className="hl-view" data-density={density}>
      <div className="hl-bento">
        <ChartCard
          title="Output by region and hour"
          area={{ col: 6, row: 2 }}
          icon={<GridIcon size={16} />}
          aside={<span className="hl-tag">MWh</span>}
        >
          <div className="hl-headline">
            <strong className="tnum">
              <CountUp value={428} />k
            </strong>
            <span>delivered today</span>
            <b className="hl-delta tnum">+8.4%</b>
          </div>
          <HeatMap rows={HEAT_ROWS} cols={HEAT_COLS} values={HEAT} format={(v) => `${v} MWh`} />
        </ChartCard>

        <ChartCard title="Capacity mix" area={{ col: 3, row: 2 }} icon={<LayersIcon size={16} />} aside={<span className="hl-tag">share</span>}>
          <TreeMap nodes={TREE} height={240} />
        </ChartCard>

        <ChartCard title="System shape" area={{ col: 3, row: 2 }} icon={<SignalIcon size={16} />} aside={<span className="hl-tag">vs target</span>}>
          <div className="hl-radarpair">
            <RadarChart axes={RADAR_AXES} series={RADAR_NOW} size={230} />
            <RadarChart axes={RADAR_AXES} series={RADAR_TARGET} size={230} color="var(--chart-series-2)" />
          </div>
          <p className="hl-card__note">Now vs target across six system dimensions.</p>
        </ChartCard>

        <ChartCard title="Resource use" area={{ col: 3, row: 2 }} icon={<GaugeIcon size={16} />}>
          <RadialBars rows={RADIAL} size={214} />
        </ChartCard>

        <ChartCard title="Reserve margin" area={{ col: 3, row: 2 }} icon={<SignalIcon size={16} />}>
          <RadialGauge pct={RESERVE.pct} centre={`${RESERVE.pct}%`} sub={RESERVE.sub} size={220} />
          <p className="hl-card__note">
            Trigger bands at 30% and 15%. Dispatch is standing by at 12% headroom.
          </p>
        </ChartCard>

        <ChartCard
          title="Seven-day trend"
          area={{ col: 6, row: 2 }}
          icon={<LayersIcon size={16} />}
          aside={
            <button className="hl-select" type="button" onClick={() => notify("Range: 7 days") }>
              7D <span aria-hidden="true">▾</span>
            </button>
          }
        >
          <div className="hl-stat">
            <strong className="tnum">
              <CountUp value={2.94} decimals={2} suffix=" GW" />
            </strong>
            <span className="hl-badge">+12% week on week</span>
          </div>
          <Sparkline
            values={[1.6, 1.9, 2.2, 2.0, 2.6, 2.4, 2.94]}
            color="var(--chart-series-1)"
            area
            smooth
            height={120}
            label="Seven-day output"
          />
          <p className="hl-card__note">
            Peak day Tuesday · {fmt(428)}k MWh delivered · {fmt(61)}% reserve held.
          </p>
        </ChartCard>
      </div>
    </div>
  );
}
