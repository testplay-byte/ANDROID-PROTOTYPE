"use client";

/* overlays — splash, loading, toast, day-detail modal
   (exact ports of the reference #splash / #loading / #toast / modal sheet) */

import { useEffect, useState } from "react";
import { COND_LABEL, WDIR_LABEL } from "../lib/data";
import { deg, windV } from "../lib/prefs";
import { cityWeather } from "../lib/engine";
import { UiIcon, WxIcon } from "./icons";
import { MiniCurve } from "./charts";
import { useWeather } from "../state/weather-context";

/* ---------- splash (boot card) ---------- */
export function WaSplash() {
  const { splashHidden, effTheme } = useWeather();
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (splashHidden) {
      const t = setTimeout(() => setGone(true), 700);
      return () => clearTimeout(t);
    }
  }, [splashHidden]);
  if (gone) return null;
  return (
    <div className={"splash" + (splashHidden ? " hide" : "")} aria-hidden="true">
      <div className="splash-card glass rim">
        <div className="splash-sun">
          <span className="ring" />
          <span className="core" />
        </div>
        <div className="splash-word">
          Aurora <b>Weather</b>
        </div>
        <div className="splash-sub">Glass forecast</div>
        <div className="splash-bar">
          <i />
        </div>
      </div>
    </div>
  );
}

/* ---------- loading overlay ---------- */
export function WaLoading() {
  const { loading, city } = useWeather();
  return (
    <div className={"loading" + (loading ? " show" : "")} aria-hidden={!loading}>
      <div className="loading-card glass">
        <div className="loading-sun">
          <svg viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="9" className="sun-core" />
            <path d="M24 6v5M24 37v5M6 24h5M37 24h5M11.3 11.3l3.5 3.5M33.2 33.2l3.5 3.5M36.7 11.3l-3.5 3.5M14.8 33.2l-3.5 3.5" />
          </svg>
        </div>
        <div className="loading-title">Fetching the sky…</div>
        <div className="loading-sub">{city.name}</div>
      </div>
    </div>
  );
}

/* ---------- toast ---------- */
export function WaToast() {
  const { toastMsg } = useWeather();
  return (
    <div className={"wa-toast" + (toastMsg ? " show" : "")} role="status">
      {toastMsg}
    </div>
  );
}

/* ---------- day detail modal ---------- */
export function WaDayModal() {
  const { modalDay, closeModal, city, prefs } = useWeather();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (modalDay !== null) {
      const raf = requestAnimationFrame(() => setOpen(true));
      return () => cancelAnimationFrame(raf);
    }
    setOpen(false);
  }, [modalDay]);

  useEffect(() => {
    if (modalDay === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modalDay, closeModal]);

  if (modalDay === null) return null;

  const wx = cityWeather(city);
  const d = wx.daily[modalDay];
  const [wv, wu] = windV(d.wind, prefs.windU);
  const uvLv = d.uv < 3 ? "Low" : d.uv < 6 ? "Moderate" : d.uv < 8 ? "High" : "Very high";

  return (
    <div className={"modal-root" + (open ? " open" : "")}>
      <div className="modal-veil" onClick={closeModal} />
      <div className="modal-sheet rim" role="dialog" aria-modal="true" aria-label={`${d.dow} forecast details`}>
        <div className="modal-grab" />
        <div className="modal-head">
          <div>
            <div className="m-day">{modalDay === 0 ? "Today" : d.dow}</div>
            <div className="m-date">
              {d.dateLabel} · {city.name}
            </div>
          </div>
          <button className="icon-btn" onClick={closeModal} aria-label="Close">
            <UiIcon name="x" size={15} />
          </button>
        </div>
        <div className="modal-big">
          <span className="mb-ic">
            <WxIcon code={d.code} isDay size={66} />
          </span>
          <div>
            <div className="mb-temp">
              {deg(d.hi, prefs.unit)} <small>/ {deg(d.lo, prefs.unit)}</small>
            </div>
            <div className="mb-cond">
              {COND_LABEL[d.code]} · {d.pp}% chance of precipitation
            </div>
          </div>
        </div>
        <div className="modal-mini glass soft">
          <div className="mm-title">Temperature through the day</div>
          <MiniCurve cityId={city.id} d={d} unit={prefs.unit} />
        </div>
        <div className="modal-grid">
          <div className="detail-tile glass soft">
            <span className="dt-label">
              <UiIcon name="wind" size={12} />
              Wind
            </span>
            <span className="dt-value">
              {wv} <small>{wu} {WDIR_LABEL(d.wdir)}</small>
            </span>
          </div>
          <div className="detail-tile glass soft">
            <span className="dt-label">
              <UiIcon name="drop" size={12} />
              Humidity
            </span>
            <span className="dt-value">
              {d.rh}
              <small>%</small>
            </span>
          </div>
          <div className="detail-tile glass soft">
            <span className="dt-label">
              <UiIcon name="uv" size={12} />
              UV index
            </span>
            <span className="dt-value">
              {d.uv} <small>{uvLv}</small>
            </span>
          </div>
          <div className="detail-tile glass soft">
            <span className="dt-label">
              <UiIcon name="sunrise" size={12} />
              Daylight
            </span>
            <span className="dt-value" style={{ fontSize: "14.5px" }}>
              {city.rise} – {city.set}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
