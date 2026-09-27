"use client";

/* forecast screen — 24h chart card (temp/pp/wind), detail grid, 7-day
   (exact port of the reference screens/forecast.js) */

import { useState } from "react";
import { deg } from "../lib/prefs";
import { UiIcon } from "../components/icons";
import { ChartSvg } from "../components/charts";
import { DailyRows, HourlyStrip } from "./home-screen";
import { useWeather } from "../state/weather-context";

const MODES: [string, string][] = [
  ["temp", "Temperature"],
  ["pp", "Precipitation"],
  ["wind", "Wind"],
];

const MODE_NAME: Record<string, string> = {
  temp: "Temperature curve",
  pp: "Chance of precipitation",
  wind: "Wind speed",
};

export function ForecastScreen() {
  const { city, wx, prefs } = useWeather();
  const [chartMode, setChartMode] = useState("temp");

  const grid = [
    { ic: "gauge", l: "Pressure", v: city.pres, u: "hPa" },
    { ic: "eye", l: "Visibility", v: city.vis, u: "km" },
    { ic: "drop", l: "Dew point", v: deg(city.dew, prefs.unit), u: "" },
    { ic: "layers", l: "Cloud cover", v: wx.daily[0].cloud, u: "%" },
    { ic: "sunrise", l: "Sunrise", v: city.rise, u: "" },
    { ic: "sunset", l: "Sunset", v: city.set, u: "" },
  ];

  return (
    <>
      <div className="seg-chips" role="tablist" aria-label="Chart type">
        {MODES.map(([id, lab]) => (
          <button
            key={id}
            className={"fchip" + (chartMode === id ? " on" : "")}
            data-mode={id}
            role="tab"
            aria-selected={chartMode === id}
            onClick={() => setChartMode(id)}
          >
            {lab}
          </button>
        ))}
      </div>

      <div className="chart-card glass rim">
        <div className="sec-head in-card">
          <span className="sec-title">Next 24 hours · {city.name}</span>
          <span className="sec-sub">{MODE_NAME[chartMode]}</span>
        </div>
        <div className="chart-scroll">
          <ChartSvg mode={chartMode} wx={wx} unit={prefs.unit} windU={prefs.windU} />
        </div>
        <div className="hgrid inset" style={{ marginTop: 12 }}>
          <HourlyStrip wx={wx} />
        </div>
      </div>

      <div className="detail-grid">
        {grid.map((g) => (
          <div key={g.l} className="detail-tile glass soft">
            <span className="dt-label">
              <UiIcon name={g.ic} size={12} />
              {g.l}
            </span>
            <span className="dt-value">
              {g.v}
              <small>{g.u}</small>
            </span>
          </div>
        ))}
      </div>

      <div className="sec-head">
        <span className="sec-title">7-day outlook</span>
        <span className="sec-sub">Tap a day for details</span>
      </div>
      <div className="daily-card glass">
        <DailyRows wx={wx} />
      </div>
    </>
  );
}
