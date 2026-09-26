import "../src/dashboard/dashboard.css";
import { ThemeToggle } from "../src/dashboard/theme-toggle";
import { Gallery, type GalleryItem } from "../src/dashboard/gallery";
import { STYLE_LABELS } from "../src/proto-kit/styles/types";

/*
 * Dashboard for the Pages root. Data-driven: to add a prototype, append an
 * entry to PROTOTYPES below (name, style, desc, tags, silhouette palette,
 * screens). Keep in sync with public/prototypes/navigation.md.
 */

const PROTOTYPES: GalleryItem[] = [
  {
    name: "Starter Template",
    url: "prototypes/_template/",
    status: "reference",
    desc: "A real, clickable phone frame with four switchable screens, bottom navigation, dark/light theming, and a live status bar with punch-hole camera.",
    style: "m3",
    tags: ["HTML", "CSS", "JS"],
    palette: { bg: "#14111f", surface: "#221e33", surfaceAlt: "#332d4c", accent: "#d0bcff", text: "#ece6f5" },
    screens: [
      { name: "Home", interactions: 70 },
      { name: "Search", interactions: 50 },
      { name: "Profile", interactions: 60 },
      { name: "Settings", interactions: 80 },
    ],
  },
  {
    name: "Search Page",
    url: "prototypes/search-page/",
    status: "review",
    desc: "Material 3 Expressive search with AniList/Extension source toggle, filter chips, expandable filter panel, collapsing header, and a functional settings screen.",
    style: "m3",
    tags: ["AniList", "Filters"],
    palette: { bg: "#14111f", surface: "#221e33", surfaceAlt: "#332d4c", accent: "#d0bcff", text: "#ece6f5" },
    screens: [
      { name: "Search", interactions: 95 },
      { name: "Settings", interactions: 60 },
    ],
  },
  {
    name: "Anime App",
    url: "prototypes/anime-app/",
    status: "review",
    desc: "6-screen Material 3 Expressive anime app with Home, Library, History, Search, Settings and a detail page. Real AniList data, add-to-library, custom keyboard.",
    style: "m3",
    tags: ["AniList", "6 screens"],
    palette: { bg: "#16112a", surface: "#2c2742", surfaceAlt: "#3a3456", accent: "#a78bfa", text: "#ede7f4" },
    screens: [
      { name: "Home", interactions: 85 },
      { name: "Library", interactions: 90 },
      { name: "History", interactions: 70 },
      { name: "Detail", interactions: 80 },
      { name: "Search", interactions: 75 },
      { name: "Settings", interactions: 60 },
    ],
  },
  {
    name: "Setup Wizard",
    url: "prototypes/setup-wizard/",
    status: "review",
    desc: "An animated 8-step setup wizard — theme switching, folder selection, permissions, backup restore, and an animated companion. Lime M3 palette.",
    style: "m3",
    tags: ["Animated", "Wizard"],
    palette: { bg: "#0a120a", surface: "#1a2a1a", surfaceAlt: "#253a25", accent: "#b3f35a", text: "#e8ffd4" },
    screens: [
      { name: "Welcome", interactions: 60 },
      { name: "Theme", interactions: 80 },
      { name: "Folders", interactions: 70 },
      { name: "Permissions", interactions: 65 },
      { name: "Backup", interactions: 75 },
      { name: "Linking", interactions: 70 },
      { name: "Processing", interactions: 50 },
      { name: "Finish", interactions: 60 },
    ],
  },
  {
    name: "Music Player",
    url: "prototypes/music-player/",
    status: "review",
    desc: "A soft-UI (neumorphism) music player — extruded circular album art, play/pause with pressed-in state, playlist grid and working playback simulation.",
    style: "neumorph",
    tags: ["Soft UI", "Player"],
    palette: { bg: "#e0e5ec", surface: "#eef1f6", surfaceAlt: "#d8dde6", accent: "#e07b39", text: "#3a4150" },
    screens: [
      { name: "Player", interactions: 95 },
      { name: "Library", interactions: 65 },
      { name: "Playlists", interactions: 55 },
      { name: "Settings", interactions: 50 },
    ],
  },
  {
    name: "Weather App",
    url: "prototypes/weather-app/",
    status: "review",
    desc: "Glassmorphism weather app — frosted translucent panels over colorful ambient blobs, hourly strip, 7-day forecast, multi-city switching and °C/°F toggle.",
    style: "glass",
    tags: ["Glass", "Weather"],
    palette: { bg: "#131a2e", surface: "#2f3547", surfaceAlt: "#3c4254", accent: "#c99cff", text: "#f4f6fb" },
    screens: [
      { name: "Today", interactions: 90 },
      { name: "Forecast", interactions: 60 },
      { name: "Cities", interactions: 70 },
      { name: "Settings", interactions: 45 },
    ],
  },
  {
    name: "Streetwear Store",
    url: "prototypes/streetwear-store/",
    status: "review",
    desc: "Neo-brutalist drop shop — thick borders, hard offset shadows, alarm-yellow accents, product detail with size picker and a full cart with quantities.",
    style: "brutalism",
    tags: ["Shop", "Cart"],
    palette: { bg: "#f7f4ec", surface: "#ffffff", surfaceAlt: "#e3ddcd", accent: "#ffd23f", text: "#141210" },
    screens: [
      { name: "Shop", interactions: 85 },
      { name: "Detail", interactions: 80 },
      { name: "Cart", interactions: 75 },
      { name: "Settings", interactions: 45 },
    ],
  },
  {
    name: "Finance Hub",
    url: "prototypes/finance-hub/",
    status: "review",
    desc: "IBM Carbon banking app — flat layer surfaces, 0px radii, spending bar chart, transaction filtering, card freeze toggles and tabular-nums money.",
    style: "carbon",
    tags: ["Banking", "Enterprise"],
    palette: { bg: "#161616", surface: "#262626", surfaceAlt: "#393939", accent: "#0f62fe", text: "#f4f4f4" },
    screens: [
      { name: "Overview", interactions: 80 },
      { name: "Activity", interactions: 85 },
      { name: "Cards", interactions: 70 },
      { name: "Settings", interactions: 50 },
    ],
  },
  {
    name: "Smart Home",
    url: "prototypes/smart-home/",
    status: "review",
    desc: "Bento-grid smart home dashboard — thermostat dial, light sliders, camera and energy tiles in mixed-height rounded cards, with live device toggles.",
    style: "bento",
    tags: ["Dashboard", "IoT"],
    palette: { bg: "#f2f2f7", surface: "#ffffff", surfaceAlt: "#e2e2e9", accent: "#ff5c33", text: "#111114" },
    screens: [
      { name: "Home", interactions: 95 },
      { name: "Rooms", interactions: 70 },
      { name: "Energy", interactions: 60 },
      { name: "Settings", interactions: 45 },
    ],
  },
  {
    name: "Fitness Tracker",
    url: "prototypes/fitness-tracker/",
    status: "review",
    desc: "Apple HIG fitness app — activity rings, iOS grouped lists, translucent tab bar, week selector and a live workout timer.",
    style: "hig",
    tags: ["iOS", "Health"],
    palette: { bg: "#f2f2f7", surface: "#ffffff", surfaceAlt: "#e2e2e7", accent: "#007aff", text: "#000000" },
    screens: [
      { name: "Activity", interactions: 85 },
      { name: "Workouts", interactions: 75 },
      { name: "Profile", interactions: 55 },
      { name: "Settings", interactions: 50 },
    ],
  },
  {
    name: "Kids Learning",
    url: "prototypes/kids-learning/",
    status: "review",
    desc: "Claymorphism learning game for kids — puffy pastel tiles, a tap-to-answer quiz with star rewards, a badge shelf and satisfying squish feedback.",
    style: "clay",
    tags: ["Game", "Kids"],
    palette: { bg: "#e0dbf2", surface: "#faf8ff", surfaceAlt: "#c3bcdc", accent: "#6d3fe0", text: "#262038" },
    screens: [
      { name: "Home", interactions: 70 },
      { name: "Play", interactions: 95 },
      { name: "Awards", interactions: 60 },
      { name: "Settings", interactions: 45 },
    ],
  },
  {
    name: "Chat App",
    url: "prototypes/chat-app/",
    status: "review",
    desc: "Flat-design messenger — zero shadows, solid teal/coral blocks, chat list with unread badges, working message send with auto-reply and the custom keyboard.",
    style: "flat",
    tags: ["Messaging", "Keyboard"],
    palette: { bg: "#f7f7f7", surface: "#ffffff", surfaceAlt: "#e6e6e6", accent: "#00897b", text: "#212121" },
    screens: [
      { name: "Chats", interactions: 75 },
      { name: "Detail", interactions: 90 },
      { name: "Calls", interactions: 55 },
      { name: "Settings", interactions: 45 },
    ],
  },
  {
    name: "Habit Tracker",
    url: "prototypes/habit-tracker/",
    status: "review",
    desc: "Monochrome minimalism — ink-on-paper habit checklist with streaks, a weekly completion grid, and add/manage habit flows. No color, only hierarchy.",
    style: "minimal",
    tags: ["Minimal", "Productivity"],
    palette: { bg: "#ffffff", surface: "#fafafa", surfaceAlt: "#eeeeee", accent: "#111111", text: "#111111" },
    screens: [
      { name: "Today", interactions: 85 },
      { name: "Stats", interactions: 55 },
      { name: "Habits", interactions: 75 },
      { name: "Settings", interactions: 45 },
    ],
  },
  {
    name: "Gallery App",
    url: "prototypes/gallery-app/",
    status: "review",
    desc: "Bauhaus museum app — geometric poster compositions in the red/blue/yellow triad, exhibition tickets with a working counter, and favorite artworks.",
    style: "bauhaus",
    tags: ["Culture", "Geometric"],
    palette: { bg: "#f4f1ea", surface: "#ffffff", surfaceAlt: "#e0dbcd", accent: "#d5321f", text: "#141414" },
    screens: [
      { name: "Exhibitions", interactions: 75 },
      { name: "Collection", interactions: 80 },
      { name: "Visit", interactions: 70 },
      { name: "Settings", interactions: 45 },
    ],
  },
];

const STYLE_BARS = STYLE_ORDER_SAFE();

function STYLE_ORDER_SAFE() {
  const counts = new Map<string, number>();
  const screens = new Map<string, number>();
  for (const p of PROTOTYPES) {
    counts.set(p.style, (counts.get(p.style) ?? 0) + 1);
    screens.set(p.style, (screens.get(p.style) ?? 0) + p.screens.length);
  }
  return Array.from(counts.entries()).map(([style, count]) => ({
    style,
    label: STYLE_LABELS[style as keyof typeof STYLE_LABELS] ?? style,
    count,
    screens: screens.get(style) ?? 0,
  }));
}

const TOTAL_SCREENS = PROTOTYPES.reduce((n, p) => n + p.screens.length, 0);
const MAX_STYLE_SCREENS = Math.max(...STYLE_BARS.map((s) => s.screens));

const BAR_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

// Donut: screens by style (stroke-dasharray on r=76, circumference 477.5)
function donutSlices() {
  const C = 477.5;
  let offset = 0;
  return STYLE_BARS.map((s, i) => {
    const len = (s.screens / TOTAL_SCREENS) * C;
    const slice = {
      color: BAR_COLORS[i % BAR_COLORS.length],
      dash: `${len - 2} ${C - len + 2}`,
      offset: -offset,
      label: s.label,
      value: s.screens,
    };
    offset += len;
    return slice;
  });
}

export default function Page() {
  return (
    <>
      {/* =================== Top navigation (split) =================== */}
      <header className="topnav">
        <div className="topnav__inner">
          <a className="brand" href="./" aria-label="ANDROID-PROTOTYPE home">
            <span className="brand__logo" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="2" width="12" height="20" rx="3" />
                <path d="M11 18h2" />
                <path d="M9 6h6" />
              </svg>
            </span>
            <span className="brand__text">
              <span className="brand__name">ANDROID-PROTOTYPE</span>
              <span className="brand__sub">mobile UI · prototypes · design</span>
            </span>
          </a>
          <nav className="navpill" aria-label="Site">
            <a
              className="navbtn"
              href="https://github.com/testplay-byte/ANDROID-PROTOTYPE"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span className="lbl">Repo</span>
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="wrap">
        {/* =================== Hero =================== */}
        <section className="hero" id="top">
          <h1 className="hero__title">Interactive mobile UI prototypes</h1>
          <p className="hero__subtitle">live in your browser.</p>

          <div className="stats">
            <div className="stat">
              <div className="stat__head">
                <span className="stat__icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="2" width="12" height="20" rx="3" />
                    <path d="M11 18h2" />
                  </svg>
                </span>
                <span className="stat__label">Prototypes</span>
              </div>
              <div className="stat__value">
                <span className="stat__num">{PROTOTYPES.length}</span>
                <span className="stat__hint">and growing</span>
              </div>
            </div>
            <div className="stat">
              <div className="stat__head">
                <span className="stat__icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                </span>
                <span className="stat__label">Screens</span>
              </div>
              <div className="stat__value">
                <span className="stat__num">{TOTAL_SCREENS}</span>
                <span className="stat__hint">interactive</span>
              </div>
            </div>
            <div className="stat">
              <div className="stat__head">
                <span className="stat__icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2 2 7l10 5 10-5-10-5z" />
                    <path d="m2 17 10 5 10-5" />
                    <path d="m2 12 10 5 10-5" />
                  </svg>
                </span>
                <span className="stat__label">Design languages</span>
              </div>
              <div className="stat__value">
                <span className="stat__num">{STYLE_BARS.length}</span>
                <span className="stat__hint">+ M3 components</span>
              </div>
            </div>
            <div className="stat">
              <div className="stat__head">
                <span className="stat__icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M12 7v5l4 2" />
                  </svg>
                </span>
                <span className="stat__label">Last updated</span>
              </div>
              <div className="stat__value">
                <span className="stat__num">2026-09-26</span>
              </div>
            </div>
          </div>

          {/* two-up: bars + donut */}
          <div className="twoup">
            <div className="panel">
              <div className="panel__head">
                <h2 className="panel__title">Prototypes by design language</h2>
                <span className="panel__hint">screens · hover for detail</span>
              </div>
              <ul className="bars">
                {STYLE_BARS.map((s, i) => (
                  <li
                    className="bar"
                    key={s.style}
                    title={`${s.label}: ${s.count} prototype${s.count === 1 ? "" : "s"}, ${s.screens} screens`}
                  >
                    <span className="bar__icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="6" y="2" width="12" height="20" rx="3" />
                      </svg>
                    </span>
                    <span className="bar__label">{s.label}</span>
                    <span className="bar__track">
                      <span
                        className="bar__fill"
                        style={{ width: `${Math.round((s.screens / MAX_STYLE_SCREENS) * 100)}%`, background: BAR_COLORS[i % BAR_COLORS.length] }}
                      />
                    </span>
                    <span className="bar__count">{s.screens}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="panel">
              <div className="panel__head">
                <h2 className="panel__title">Screens by design language</h2>
                <span className="panel__hint">share of {TOTAL_SCREENS} screens · hover a slice</span>
              </div>
              <div className="donut-wrap">
                <div className="donut" role="img" aria-label="Screen distribution by design language">
                  <svg width="180" height="180" viewBox="0 0 180 180">
                    <circle cx="90" cy="90" r="76" fill="none" stroke="var(--muted)" strokeWidth="28" />
                    {donutSlices().map((d) => (
                      <circle
                        key={d.label}
                        cx="90" cy="90" r="76"
                        fill="none"
                        stroke={d.color}
                        strokeWidth="28"
                        strokeDasharray={d.dash}
                        strokeDashoffset={d.offset}
                      />
                    ))}
                  </svg>
                  <div className="donut__center">
                    <span className="donut__num">{TOTAL_SCREENS}</span>
                    <span className="donut__cap">screens</span>
                  </div>
                </div>
                <ul className="legend">
                  {donutSlices().map((d) => (
                    <li className="legend__row" key={d.label}>
                      <span className="legend__dot" style={{ background: d.color }} />
                      <span className="legend__name">{d.label}</span>
                      <span className="legend__val">{d.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="cta">
            <a className="cta__btn" href="#prototypes">
              Browse prototypes
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
            <p className="cta__note">
              Every prototype is a live, clickable phone-frame UI built in a distinct design language — filter below by style.
            </p>
          </div>
        </section>

        {/* =================== Prototypes gallery (filterable) =================== */}
        <section className="section" id="prototypes">
          <div className="section__head">
            <h2 className="section__title">Prototypes</h2>
            <span className="section__hint">live &amp; interactive — filter by design language</span>
          </div>

          <Gallery items={PROTOTYPES} />
        </section>
      </main>
    </>
  );
}
