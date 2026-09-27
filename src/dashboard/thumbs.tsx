import type { ReactNode } from "react";
import type { GalleryItem } from "./gallery";

/**
 * Mini home-screen thumbnails for the dashboard gallery.
 *
 * Each entry is a tiny CSS composition that mirrors the REAL home screen of
 * the prototype, so a card's silhouette previews the actual app. Add one
 * when adding a prototype (keyed by the PROTOTYPES name in app/page.tsx).
 * Inline styles only — palettes come from the item (matching the prototype's
 * default theme).
 */

type Palette = GalleryItem["palette"];

const line = (c: string, w = "70%", h = 6, r = 4): React.CSSProperties => ({
  height: h, width: w, borderRadius: r, background: c, flex: "0 0 auto",
});

const THUMBS: Record<string, (p: Palette) => ReactNode> = {
  "Starter Template": (p) => (
    <>
      <div style={{ display: "flex", gap: 4 }}>
        <span style={line(p.surfaceAlt, "50%", 10, 6)} />
        <span style={{ ...line(p.accent, "22%", 10, 6), marginLeft: "auto" }} />
      </div>
      <div style={{ background: p.surface, borderRadius: 6, padding: 6, display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={line(p.accent, "34%", 8, 4)} />
        <span style={line(p.surfaceAlt, "90%")} />
        <span style={line(p.surfaceAlt, "60%")} />
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        <span style={{ ...line(p.surfaceAlt, "50%", 34, 6) }} />
        <span style={{ ...line(p.surfaceAlt, "50%", 34, 6) }} />
      </div>
    </>
  ),
  "Search Page": (p) => (
    <>
      <span style={{ ...line(p.surface, "100%", 14, 999) }} />
      <div style={{ display: "flex", gap: 4 }}>
        <span style={line(p.accent, "46%", 10, 999)} />
        <span style={line(p.surfaceAlt, "46%", 10, 999)} />
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {[70, 46, 58].map((w, i) => (
          <span key={i} style={{ flex: 1, aspectRatio: "2/3", borderRadius: 4, background: p.surface }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {[52, 64].map((w, i) => (
          <span key={i} style={{ flex: 1, aspectRatio: "2/3", borderRadius: 4, background: p.surface }} />
        ))}
        <span style={{ flex: 1 }} />
      </div>
    </>
  ),
  "Anime App": (p) => (
    <>
      <div style={{ height: 44, borderRadius: 8, background: `linear-gradient(135deg, ${p.accent}, ${p.surfaceAlt})` }} />
      <span style={line(p.text, "58%", 7, 4)} />
      <div style={{ display: "flex", gap: 4 }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ flex: 1, aspectRatio: "2/3", borderRadius: 5, background: i === 0 ? p.accent : p.surface }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {[1, 2, 0].map((i) => (
          <span key={i} style={{ flex: 1, aspectRatio: "2/3", borderRadius: 5, background: i === 0 ? p.accent : p.surface }} />
        ))}
      </div>
    </>
  ),
  "Setup Wizard": (p) => (
    <>
      <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} style={{ width: 6, height: 6, borderRadius: 999, background: i < 3 ? p.accent : p.surfaceAlt }} />
        ))}
      </div>
      <div style={{ background: p.surface, borderRadius: 8, padding: 8, display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
        <span style={{ width: 22, height: 22, borderRadius: 999, background: p.accent, opacity: 0.85 }} />
        <span style={line(p.text, "70%", 6, 4)} />
        <span style={line(p.surfaceAlt, "50%", 5, 4)} />
      </div>
      <span style={{ height: 14, borderRadius: 999, background: p.accent, marginTop: "auto" }} />
    </>
  ),
  "Music Player": (p) => (
    <>
      <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
        <div style={{ width: "62%", aspectRatio: "1", borderRadius: "50%", background: p.surface, boxShadow: `6px 6px 12px rgba(0,0,0,.25), -6px -6px 12px rgba(255,255,255,.9), inset 0 0 0 6px ${p.bg}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ width: "55%", height: "55%", borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${p.accent}, ${p.surfaceAlt})` }} />
        </div>
      </div>
      <span style={{ ...line(p.text, "64%", 7, 4), alignSelf: "center" }} />
      <span style={{ height: 4, borderRadius: 999, background: p.surfaceAlt, position: "relative" }}>
        <span style={{ position: "absolute", inset: `0 55% 0 0`, borderRadius: 999, background: p.accent }} />
      </span>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 2 }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: i === 1 ? 26 : 18, height: i === 1 ? 26 : 18, borderRadius: "50%", background: p.surface, boxShadow: `3px 3px 6px rgba(0,0,0,.22), -3px -3px 6px rgba(255,255,255,.9)` }} />
        ))}
      </div>
    </>
  ),
  "Wallet": (p) => (
    <>
      {/* fanned pass stack — front card in the accent gradient */}
      <div style={{ position: "relative", height: 64, marginBottom: 3 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: i === 0 ? 0 : 10,
              right: i === 0 ? 0 : 10,
              top: i * 14,
              height: 44,
              borderRadius: 9,
              background: i === 0 ? `linear-gradient(140deg, ${p.accent}, ${p.surfaceAlt})` : p.surface,
              border: "1px solid rgba(255,255,255,.28)",
              boxShadow: i === 0 ? "0 4px 10px rgba(0,0,0,.35)" : "none",
              zIndex: 3 - i,
            }}
          />
        ))}
      </div>
      <span style={{ ...line(p.text, "60%", 4, 0) }} />
      {/* floating glass tab bar */}
      <div style={{ display: "flex", gap: 3, padding: 3, borderRadius: 999, background: p.surfaceAlt, border: "1px solid rgba(255,255,255,.14)", marginTop: 6 }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} style={{ flex: 1, height: 13, borderRadius: 999, background: i === 0 ? p.accent : "transparent" }} />
        ))}
      </div>
    </>
  ),
  "Weather App": (p) => (
    <>
      {/* Aurora hero card — glass sheet with thin hero temp + sun glyph */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          padding: "8px 4px 7px",
          borderRadius: 10,
          background: "rgba(255,255,255,.16)",
          border: "1px solid rgba(255,255,255,.45)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.5), 0 4px 10px rgba(20,10,60,.3)",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4.6" fill="#FFD470" />
          <g stroke="#FFD470" strokeWidth="1.9" strokeLinecap="round">
            <path d="M12 2.4v2.6M12 19v2.6M2.4 12h2.6M19 12h2.6M5.2 5.2l1.9 1.9M16.9 16.9l1.9 1.9M18.8 5.2l-1.9 1.9M7.1 16.9l-1.9 1.9" />
          </g>
        </svg>
        <span style={{ fontSize: 22, fontWeight: 300, color: p.text, lineHeight: 1 }}>13°</span>
        <span style={{ ...line(p.text, "34%", 5, 4), opacity: 0.7 }} />
      </div>
      {/* metric tiles (glass-in-glass) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
        {[0, 1].map((i) => (
          <span key={i} style={{ height: 20, borderRadius: 8, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.3)" }} />
        ))}
      </div>
      {/* dock — white active pill + 3 ghost tabs */}
      <div style={{ display: "flex", gap: 3, padding: 3, borderRadius: 999, background: "rgba(255,255,255,.16)", border: "1px solid rgba(255,255,255,.35)" }}>
        <span style={{ flex: 1, height: 16, borderRadius: 999, background: "#fff" }} />
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ flex: 1, height: 16, borderRadius: 999 }} />
        ))}
      </div>
    </>
  ),
  "Streetwear Store": (p) => (
    <>
      <span style={{ ...line(p.text, "80%", 12, 0) }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ border: `2px solid ${p.text}`, boxShadow: `3px 3px 0 ${p.text}`, display: "flex", flexDirection: "column", gap: 3, padding: 4 }}>
            <span style={{ height: 22, background: i % 3 === 0 ? p.accent : p.surfaceAlt }} />
            <span style={{ ...line(p.text, "80%", 4, 0) }} />
            <span style={{ height: 7, background: p.accent, border: `1px solid ${p.text}` }} />
          </div>
        ))}
      </div>
    </>
  ),
  "Finance Hub": (p) => (
    <>
      <div style={{ border: `1px solid ${p.surfaceAlt}`, padding: 7, display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={line(p.surfaceAlt, "44%", 4, 0)} />
        <span style={{ ...line(p.text, "74%", 11, 0) }} />
      </div>
      <div style={{ border: `1px solid ${p.surfaceAlt}`, padding: 7, display: "flex", alignItems: "flex-end", gap: 3, height: 42 }}>
        {[14, 20, 30, 24, 18, 26, 22, 16].map((h, i) => (
          <span key={i} style={{ flex: 1, height: h, background: i === 2 ? p.accent : p.surfaceAlt }} />
        ))}
      </div>
      <div style={{ border: `1px solid ${p.surfaceAlt}`, padding: 6, display: "flex", gap: 4, alignItems: "center" }}>
        <span style={{ width: 12, height: 12, background: p.surfaceAlt }} />
        <span style={line(p.text, "40%", 5, 0)} />
        <span style={{ ...line(p.text, "20%", 5, 0), marginLeft: "auto" }} />
      </div>
    </>
  ),
  "Smart Home": (p) => (
    <>
      <span style={{ ...line(p.text, "52%", 10, 4) }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
        <div style={{ background: p.surface, borderRadius: 10, padding: 6, gridColumn: "1", gridRow: "span 2", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: p.accent }}>21.5°</span>
          <span style={{ width: 16, height: 16, borderRadius: "50%", background: p.accent }} />
        </div>
        <div style={{ background: p.surface, borderRadius: 10, padding: 6, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ ...line(p.text, "40%", 5, 3) }} />
          <span style={{ width: 14, height: 8, borderRadius: 999, background: p.accent, marginLeft: "auto" }} />
        </div>
        <div style={{ background: "#1c1c21", borderRadius: 10, padding: 6 }}>
          <span style={{ ...line(p.accent, "30%", 4, 2) }} />
        </div>
        <div style={{ background: p.surface, borderRadius: 10, padding: 6, gridColumn: "span 2", display: "flex", alignItems: "flex-end", gap: 2, height: 26 }}>
          {[8, 12, 9, 14, 11, 16].map((h, i) => (
            <span key={i} style={{ flex: 1, height: h, borderRadius: 2, background: i === 5 ? p.accent : p.surfaceAlt }} />
          ))}
        </div>
      </div>
    </>
  ),
  "Fitness Tracker": (p) => (
    <>
      <div style={{ display: "flex", justifyContent: "center", padding: "6px 0" }}>
        <svg width="72" height="72" viewBox="0 0 72 72">
          {[
            { r: 30, c: p.accent, dash: "70 160" },
            { r: 23, c: "var(--chart-2)", dash: "48 126" },
            { r: 16, c: "#f2b705", dash: "34 82" },
          ].map((ring, i) => (
            <circle key={i} cx="36" cy="36" r={ring.r} fill="none" stroke={ring.c} strokeWidth="6" strokeLinecap="round" strokeDasharray={ring.dash} transform="rotate(-90 36 36)" />
          ))}
        </svg>
      </div>
      {[0, 1].map((i) => (
        <div key={i} style={{ background: p.surface, borderRadius: 10, padding: "7px 8px", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: i === 0 ? p.accent : p.surfaceAlt }} />
          <span style={line(p.text, "44%", 5, 3)} />
          <span style={{ ...line(p.text, "18%", 5, 3), marginLeft: "auto" }} />
        </div>
      ))}
    </>
  ),
  "Kids Learning": (p) => (
    <>
      <span style={{ ...line(p.text, "64%", 12, 4) }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          { bg: p.accent, g: "A" },
          { bg: "#0e8a7d", g: "7" },
          { bg: "#c94f8c", g: "●●" },
          { bg: "#c2620a", g: "▲" },
        ].map((t, i) => (
          <div key={i} style={{ background: p.surface, borderRadius: 12, padding: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, boxShadow: `4px 4px 8px rgba(83,73,113,.2), inset -3px -3px 6px rgba(140,130,175,.15), inset 3px 3px 6px rgba(255,255,255,.9)` }}>
            <span style={{ width: 22, height: 22, borderRadius: 8, background: t.bg, color: "#fff", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{t.g}</span>
            <span style={line(p.text, "56%", 4, 2)} />
          </div>
        ))}
      </div>
    </>
  ),
  "Chat App": (p) => (
    <>
      <span style={{ ...line(p.surfaceAlt, "100%", 14, 8) }} />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0" }}>
          <span style={{ width: 16, height: 16, borderRadius: "50%", background: [p.accent, "#f4511e", "#8e24aa", "#43a047"][i], flex: "0 0 auto" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
            <span style={line(p.text, `${58 - i * 6}%`, 4, 2)} />
            <span style={line(p.surfaceAlt, `${80 - i * 8}%`, 4, 2)} />
          </div>
          {i < 2 && <span style={{ width: 9, height: 9, borderRadius: "50%", background: p.accent, flex: "0 0 auto" }} />}
        </div>
      ))}
    </>
  ),
  "Habit Tracker": (p) => (
    <>
      <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
        <svg width="56" height="56" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="23" fill="none" stroke={p.surfaceAlt} strokeWidth="4" />
          <circle cx="28" cy="28" r="23" fill="none" stroke={p.text} strokeWidth="4" strokeDasharray="48 145" strokeLinecap="round" transform="rotate(-90 28 28)" />
        </svg>
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ border: `1px solid ${p.surfaceAlt}`, borderRadius: 8, padding: "6px 8px", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={line(p.text, `${46 - i * 6}%`, 4, 2)} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", border: `1.5px solid ${p.text}`, marginLeft: "auto", background: i === 0 ? p.text : "transparent", flex: "0 0 auto" }} />
        </div>
      ))}
    </>
  ),
  "Gallery App": (p) => (
    <>
      <span style={{ ...line(p.text, "72%", 10, 0) }} />
      {[0, 1].map((i) => (
        <div key={i} style={{ border: `2px solid ${p.text}`, padding: 5, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ height: 34, position: "relative", overflow: "hidden", background: p.surface }}>
            <span style={{ position: "absolute", left: 6, top: 5, width: 20, height: 20, borderRadius: "50%", background: p.accent }} />
            <span style={{ position: "absolute", right: -8, bottom: -10, width: 24, height: 24, borderRadius: "50%", background: "#2b50c8" }} />
            <span style={{ position: "absolute", left: 0, right: 0, top: i === 0 ? 6 : 20, height: 4, background: "#f2b705" }} />
            <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 3, background: p.text }} />
          </div>
          <span style={{ height: 8, background: p.accent }} />
        </div>
      ))}
    </>
  ),
};

export function getThumb(name: string, p: Palette): ReactNode | undefined {
  const fn = THUMBS[name];
  return fn ? fn(p) : undefined;
}
