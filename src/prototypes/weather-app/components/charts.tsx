"use client";

/* charts — SVG builders: sun arc, 24h chart (temp/pp/wind), day mini-curve
   (ported from the reference charts.js as React components) */

import { clamp, hashStr, mulberry } from "../lib/utils";
import { deg, windV } from "../lib/prefs";
import type { Unit, WindUnit } from "../lib/prefs";
import type { CityWeatherData, DayForecast } from "../lib/engine";

/* ---------- sun arc (home) ---------- */
export const ARC_R = 42;
export const ARC_CX = 50;
export const ARC_CY = 86;
export const ARC_H = 92;
export const arcX = (p: number) => ARC_CX - ARC_R * Math.cos(Math.PI * clamp(p, 0, 1));
export const arcY = (p: number) => ARC_CY - ARC_R * Math.sin(Math.PI * clamp(p, 0, 1));

export function SunArc({ p }: { p: number }) {
  const d = `M ${ARC_CX - ARC_R} ${ARC_CY} A ${ARC_R} ${ARC_R} 0 0 1 ${ARC_CX + ARC_R} ${ARC_CY}`;
  return (
    <svg viewBox={`0 0 100 ${ARC_H}`} preserveAspectRatio="none" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
      <line className="a-horizon" x1="2" y1={ARC_CY} x2="98" y2={ARC_CY} />
      <path className="a-track" d={d} />
      <path className="a-fill" d={d} pathLength={100} strokeDasharray={`${(clamp(p, 0, 1) * 100).toFixed(1)} 100`} />
    </svg>
  );
}

/* ---------- 24-hour chart (forecast screen) ---------- */
const COLW = 64;
const H = 128;
const PT = 34;
const PB = 16;

export function ChartSvg({ mode, wx, unit, windU }: { mode: string; wx: CityWeatherData; unit: Unit; windU: WindUnit }) {
  const N = 24;
  const W = N * COLW;
  const x = (i: number) => i * COLW + COLW / 2;

  let inner: React.ReactNode;

  if (mode === "pp") {
    const vals = wx.hourly.map((h) => h.pp);
    const y = (v: number) => H - PB - (v / 100) * (H - PT - PB);
    inner = (
      <>
        <line className="c-axis" x1="0" y1={H - PB} x2={W} y2={H - PB} />
        {vals.map((v, i) => {
          const h = (v / 100) * (H - PT - PB);
          return <rect key={i} className="c-bar" x={(x(i) - 9).toFixed(1)} y={(H - PB - h).toFixed(1)} width="18" height={Math.max(h, 3).toFixed(1)} rx="7" />;
        })}
        {vals.map((v, i) =>
          i % 3 === 0 ? (
            <text key={i} className="c-lab" x={x(i)} y={(y(v) - 8).toFixed(1)}>
              {v}%
            </text>
          ) : null
        )}
      </>
    );
  } else {
    const vals = wx.hourly.map((h) => (mode === "temp" ? h.temp : windV(h.wind, windU)[0]));
    const mn = Math.min(...vals);
    const mx = Math.max(...vals);
    const span = Math.max(mx - mn, 2);
    const y = (v: number) => PT + (1 - (v - mn) / span) * (H - PT - PB);
    const path = vals.map((v, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1)).join(" ");
    const area = `${path} L ${x(N - 1)} ${H - PB} L ${x(0)} ${H - PB} Z`;
    inner = (
      <>
        <path d={area} fill="rgba(255,255,255,.1)" />
        <path className="c-line" d={path} />
        {vals.map((v, i) => (
          <circle key={i} className="c-dot" cx={x(i)} cy={y(v).toFixed(1)} r={i % 3 === 0 ? 3 : 2} />
        ))}
        {vals.map((v, i) =>
          i % 3 === 0 ? (
            <text key={i} className="c-lab" x={x(i)} y={(y(v) - 9).toFixed(1)}>
              {mode === "temp" ? deg(v, unit) : Math.round(v)}
            </text>
          ) : null
        )}
      </>
    );
  }
  return (
    <svg className="chart-svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      {inner}
    </svg>
  );
}

/* ---------- through-the-day mini curve (day modal) ---------- */
export function MiniCurve({ cityId, d, unit }: { cityId: string; d: DayForecast; unit: Unit }) {
  const r0 = mulberry(hashStr(cityId + "md" + d.dateLabel));
  const pts = Array.from({ length: 12 }, (_, i) => {
    const h = 2 + i * 2;
    const di = Math.sin(((h - 9) / 24) * Math.PI * 2);
    return d.lo + (d.hi - d.lo) * (0.5 + 0.5 * di) + (r0() - 0.5);
  });
  const mn = Math.min(...pts);
  const mx = Math.max(...pts);
  const span = Math.max(mx - mn, 1);
  const W = 300;
  const H = 58;
  const y = (v: number) => 12 + (1 - (v - mn) / span) * (H - 24);
  const path = pts.map((v, i) => (i ? "L" : "M") + (i * (W / 11)).toFixed(1) + " " + y(v).toFixed(1)).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 16}`} aria-hidden="true" style={{ display: "block" }}>
      <path d={`${path} L ${W} ${H} L 0 ${H} Z`} fill="rgba(255,255,255,.08)" />
      <path d={path} fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="2.2" strokeLinecap="round" />
      {[0, 3, 6, 9, 11].map((i) => {
        const x = i * (W / 11);
        return (
          <g key={i}>
            <circle cx={x.toFixed(1)} cy={y(pts[i]).toFixed(1)} r="2.6" fill="#fff" />
            <text x={clamp(x, 12, W - 14).toFixed(1)} y={(y(pts[i]) - 7).toFixed(1)} fill="rgba(255,255,255,.92)" fontSize="9.5" fontWeight="600" textAnchor="middle" fontFamily="Outfit, sans-serif">
              {deg(pts[i], unit)}
            </text>
          </g>
        );
      })}
      <text x="0" y={H + 13} fill="rgba(255,255,255,.5)" fontSize="8.5" fontFamily="Outfit, sans-serif">
        2 AM
      </text>
      <text x={W * 0.5} y={H + 13} fill="rgba(255,255,255,.5)" fontSize="8.5" textAnchor="middle" fontFamily="Outfit, sans-serif">
        2 PM
      </text>
      <text x={W} y={H + 13} fill="rgba(255,255,255,.5)" fontSize="8.5" textAnchor="end" fontFamily="Outfit, sans-serif">
        Midnight
      </text>
    </svg>
  );
}
