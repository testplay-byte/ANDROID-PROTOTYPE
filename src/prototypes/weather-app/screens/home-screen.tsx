"use client";

/* home screen — hero, metrics, sun arc, hourly strip, 7-day outlook
   (exact port of the reference screens/home.js) */

import { useEffect, useRef, useState } from "react";
import { COND_LABEL, WDIR_LABEL, greeting } from "../lib/data";
import { deg, hourLabel, t, windV } from "../lib/prefs";
import type { CityWeatherData, HourPoint } from "../lib/engine";
import { hashStr, tween } from "../lib/utils";
import { UiIcon, WxIcon } from "../components/icons";
import { ARC_H, SunArc, arcX, arcY } from "../components/charts";
import { useWeather } from "../state/weather-context";

/* big temperature morphs from its previous value (reference countUpTemp) */
let lastShownTemp: number | null = null;

function CountUpTemp({ target }: { target: number }) {
  const [shown, setShown] = useState(target);
  const raf = useRef(0);
  useEffect(() => {
    const from = lastShownTemp === null ? target : lastShownTemp;
    lastShownTemp = target;
    if (from === target) {
      setShown(target);
      return;
    }
    let alive = true;
    tween(from, target, 700, (v) => {
      if (alive) setShown(Math.round(v));
    });
    return () => {
      alive = false;
      cancelAnimationFrame(raf.current);
    };
  }, [target]);
  return <span>{shown}</span>;
}

export function HourlyStrip({ wx }: { wx: CityWeatherData }) {
  const { prefs } = useWeather();
  return (
    <div className="hgrid">
      {wx.hourly.map((h: HourPoint, i: number) => (
        <div key={i} className={"hour" + (i === 0 ? " now" : "")}>
          <span className="h-t">{i === 0 ? "Now" : hourLabel(h.h24, prefs.timeF)}</span>
          <span className="h-i">
            <WxIcon code={h.code} isDay={h.isDay} size={30} />
          </span>
          <span className="h-v">{deg(h.temp, prefs.unit)}</span>
          <span className="h-pp">{h.pp >= 20 ? <><UiIcon name="dropletSm" size={8} /> {h.pp}%</> : ""}</span>
        </div>
      ))}
    </div>
  );
}

export function DailyRows({ wx }: { wx: CityWeatherData }) {
  const { prefs, openDayModal } = useWeather();
  const lo = Math.min(...wx.daily.map((d) => d.lo));
  const hi = Math.max(...wx.daily.map((d) => d.hi));
  const span = Math.max(hi - lo, 1);
  return (
    <>
      {wx.daily.map((d, i) => (
        <button key={i} className="day-row" data-day={i} aria-label={`Open ${d.dow} details`} onClick={() => openDayModal(i)}>
          <span className="d-name">{i === 0 ? "Today" : d.dowS}</span>
          <span className="d-ic">
            <WxIcon code={d.code} isDay size={27} />
          </span>
          <span className="d-pp">{d.pp >= 20 ? <><UiIcon name="dropletSm" size={8} /> {d.pp}%</> : ""}</span>
          <span className="d-bar">
            <i style={{ left: `${(((d.lo - lo) / span) * 100).toFixed(0)}%`, width: `${(((d.hi - d.lo) / span) * 100).toFixed(0)}%` }} />
          </span>
          <span className="d-temps">
            <span className="lo">{deg(d.lo, prefs.unit)}</span>
            <span className="hi">{deg(d.hi, prefs.unit)}</span>
          </span>
        </button>
      ))}
    </>
  );
}

export function HomeScreen() {
  const { city, wx, prefs, go } = useWeather();
  const c = wx.current;

  const ago = Math.max(0, Math.round((Date.now() - prefs.updated) / 60000));
  const agoTxt = ago < 1 ? "just now" : ago === 1 ? "1 min ago" : ago + " min ago";
  const [wv, wu] = windV(c.wind, prefs.windU);
  const uvLv = c.uv < 3 ? "Low" : c.uv < 6 ? "Moderate" : c.uv < 8 ? "High" : c.uv < 11 ? "Very high" : "Extreme";
  const aqiLv = c.aqi < 51 ? "Good" : c.aqi < 101 ? "Moderate" : "Unhealthy";
  const visTxt = city.vis >= 15 ? "Crystal clear" : city.vis >= 8 ? "Good" : city.vis >= 4 ? "Moderate" : "Poor";
  const presTrend = ["Steady", "Rising slowly", "Falling slowly"][hashStr(city.id) % 3];
  const dayP = Math.min(1, Math.max(0, (wx.now - wx.riseM) / (wx.setM - wx.riseM)));
  const dl = wx.setM - wx.riseM;
  const d0 = wx.daily[0];

  return (
    <>
      <div className="hero glass rim">
        <div className="hero-city">{city.name}</div>
        <div className="hero-temp">
          <CountUpTemp target={t(c.temp, prefs.unit)} />
          <span className="deg">°</span>
        </div>
        <div className="hero-cond">{COND_LABEL[c.code]}</div>
        <div className="hero-feels">
          Feels like {t(c.feels, prefs.unit)}°{prefs.unit.toUpperCase()} · {greeting(Math.floor(wx.now / 60))}
        </div>
        <div className="hero-icon">
          <WxIcon code={c.code} isDay={c.isDay} size={106} />
        </div>
        <div className="hero-range">
          <span className="chip">
            H: <b>{deg(d0.hi, prefs.unit)}</b>
          </span>
          <span className="chip">
            L: <b>{deg(d0.lo, prefs.unit)}</b>
          </span>
          <span className="chip">
            <UiIcon name="drop" size={12} /> <b>{c.rh}%</b> humidity
          </span>
        </div>
        <div className="hero-upd">
          <UiIcon name="clock" size={11} /> Updated {agoTxt} · {wx.localTime} local
        </div>
      </div>

      <div className="metrics">
        <div className="metric glass soft">
          <div className="m-head">
            <span className="m-ic">
              <UiIcon name="thermo" size={14} />
            </span>
            Feels like
          </div>
          <div className="m-val">{deg(c.feels, prefs.unit)}</div>
          <div className="m-sub">
            {c.feels < c.temp - 0.5 ? "Wind chill is cooling it down" : c.feels > c.temp + 0.5 ? "Humidity makes it warmer" : "Close to the actual temperature"}
          </div>
        </div>
        <div className="metric glass soft">
          <div className="m-head">
            <span className="m-ic">
              <UiIcon name="wind" size={14} />
            </span>
            Wind
          </div>
          <div className="wind-row">
            <div className="compass">
              <span className="needle" style={{ transform: `rotate(${Math.round(c.wdir)}deg)` }} />
            </div>
            <div>
              <div className="m-val">
                {wv}
                <small>{wu}</small>
              </div>
              <div className="m-sub">
                {WDIR_LABEL(c.wdir)} · {Math.round(c.wdir)}°
              </div>
            </div>
          </div>
        </div>
        <div className="metric glass soft">
          <div className="m-head">
            <span className="m-ic">
              <UiIcon name="drop" size={14} />
            </span>
            Humidity
          </div>
          <div className="m-val">
            {c.rh}
            <small>%</small>
          </div>
          <div className="m-sub">Dew point {deg(city.dew, prefs.unit)}</div>
        </div>
        <div className="metric glass soft">
          <div className="m-head">
            <span className="m-ic">
              <UiIcon name="eye" size={14} />
            </span>
            Visibility
          </div>
          <div className="m-val">
            {city.vis}
            <small>km</small>
          </div>
          <div className="m-sub">{visTxt}</div>
        </div>
        <div className="metric glass soft">
          <div className="m-head">
            <span className="m-ic">
              <UiIcon name="gauge" size={14} />
            </span>
            Pressure
          </div>
          <div className="m-val">
            {city.pres}
            <small>hPa</small>
          </div>
          <div className="m-sub">{presTrend}</div>
        </div>
        <div className="metric glass soft">
          <div className="m-head">
            <span className="m-ic">
              <UiIcon name="sunrise" size={14} />
            </span>
            Sunrise
          </div>
          <div className="m-val">{city.rise}</div>
          <div className="m-sub">Sunset at {city.set}</div>
        </div>
        <div className="metric glass soft wide">
          <div className="m-head">
            <span className="m-ic">
              <UiIcon name="uv" size={14} />
            </span>
            UV index
          </div>
          <div className="m-val">
            {c.uv}
            <small>· {uvLv}</small>
          </div>
          <div className="uv-bar">
            <i style={{ width: `${((c.uv / 11) * 100).toFixed(0)}%` }} />
          </div>
          <div className="m-sub">
            Air quality {aqiLv} · AQI {c.aqi}
          </div>
        </div>
      </div>

      <div className="suncard glass rim">
        <div className="sec-head flush">
          <span className="sec-title">Sun &amp; daylight</span>
          <span className="sec-sub">
            {Math.floor(dl / 60)}h {Math.round(dl % 60)}m of daylight
          </span>
        </div>
        <div className="sun-arc">
          <SunArc p={dayP} />
          <span className="a-dot" style={{ left: `${arcX(dayP).toFixed(1)}%`, top: `${((arcY(dayP) / ARC_H) * 100).toFixed(1)}%` }} />
        </div>
        <div className="sun-labels">
          <div>
            <span className="lbl">
              <UiIcon name="sunrise" size={13} /> Sunrise
            </span>
            <span className="val">{city.rise}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <span className="lbl">
              Sunset <UiIcon name="sunset" size={13} />
            </span>
            <span className="val">{city.set}</span>
          </div>
        </div>
        <div className="sun-note">
          {dayP >= 1
            ? "The sun has set — golden hour is over."
            : dayP <= 0
              ? "Before sunrise — the city is still waking up."
              : `The sun is ${dayP < 0.5 ? "climbing" : "descending"} over ${city.name}.`}
        </div>
      </div>

      <div className="sec-head">
        <span className="sec-title">Hourly forecast</span>
        <button className="link-btn" onClick={() => go("forecast")}>
          Full forecast ›
        </button>
      </div>
      <div className="hourly-card glass">
        <HourlyStrip wx={wx} />
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
