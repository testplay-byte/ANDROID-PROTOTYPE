"use client";

/* atlas / screens / me — traveller profile as a bento.

   Stats own the top row (countries / miles / trips are big numerals in
   their own tiles — frequency-of-glance says: this is the brag grid),
   then appearance (Dark/Light segmented, wired to useDeviceTheme and
   persisted under `atlas-theme` by the page-level provider), the planner
   default trip-length stepper, notification toggles (persisted prefs),
   and About → toast. Every row is a tile; no lists outside the grid. */

import { useDeviceTheme } from "../../../proto-kit";
import { useAtlas } from "../state/atlas-context";
import { Tile, TileHead } from "../components/tile";
import {
  BagIcon,
  BellIcon,
  CalendarIcon,
  CompassIcon,
  GlobeIcon,
  MinusIcon,
  PlaneIcon,
  PlusIcon,
  StarIcon,
  SunIcon,
} from "../components/icons";
import { STATS } from "../lib/data";

function Switch({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={"at-switch" + (on ? " on" : "")}
      onClick={() => onChange(!on)}
    >
      <span className="at-switch-knob" aria-hidden="true" />
    </button>
  );
}

export function MeScreen() {
  const { theme, setTheme } = useDeviceTheme();
  const { prefs, setPrefs, showToast, saved, trips, trip } = useAtlas();

  return (
    <div className="at-screen at-screen-me">
      {/* identity strip — avatar disc + name, one wide tile */}
      <Tile wide i={0} className="at-me-id">
        <span className="at-avatar" aria-hidden="true">
          <CompassIcon size={24} strokeWidth={2.2} />
        </span>
        <div className="at-me-idtxt">
          <span className="at-me-name">Amara K.</span>
          <span className="at-me-sub tnum">
            {saved.length} saved · {trips.length} planned
          </span>
        </div>
        <span className="at-me-badge tnum">
          <StarIcon size={12} filled /> Lv. {Math.max(1, Math.round(STATS.trips / 5))}
        </span>
      </Tile>

      {/* stats bento — big numerals, one job per tile */}
      <Tile i={1} className="at-stat">
        <TileHead icon={<GlobeIcon size={15} strokeWidth={2.2} />} title="Countries" />
        <span className="at-stat-n tnum">{STATS.countries}</span>
      </Tile>
      <Tile i={2} className="at-stat">
        <TileHead icon={<PlaneIcon size={15} strokeWidth={2.2} />} title="Trips" />
        <span className="at-stat-n tnum">{STATS.trips}</span>
      </Tile>
      <Tile wide i={3} className="at-stat at-stat-miles">
        <TileHead icon={<CompassIcon size={15} strokeWidth={2.2} />} title="Miles travelled" />
        <span className="at-stat-n tnum">{STATS.miles.toLocaleString("en-US")}</span>
        <span className="at-stat-l">streak: {STATS.streakNights} nights out</span>
      </Tile>

      {/* appearance — segmented Dark / Light (persisted as atlas-theme) */}
      <Tile wide i={4} className="at-row-tile">
        <div className="at-row">
          <TileHead icon={<SunIcon size={15} strokeWidth={2.2} />} title="Appearance" />
          <div className="at-seg" role="radiogroup" aria-label="Theme">
            <button
              type="button"
              role="radio"
              aria-checked={theme === "dark"}
              className={"at-seg-b" + (theme === "dark" ? " on" : "")}
              onClick={() => setTheme("dark")}
            >
              Dark
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={theme === "light"}
              className={"at-seg-b" + (theme === "light" ? " on" : "")}
              onClick={() => setTheme("light")}
            >
              Light
            </button>
          </div>
        </div>
      </Tile>

      {/* planner default trip length — stepper */}
      <Tile wide i={5} className="at-row-tile">
        <div className="at-row">
          <TileHead icon={<CalendarIcon size={15} strokeWidth={2.2} />} title="Trip length" />
          <div className="at-stepper">
            <button
              type="button"
              className="at-step-b"
              aria-label="Shorten default trip"
              disabled={prefs.tripLength <= 2}
              onClick={() => setPrefs({ tripLength: Math.max(2, prefs.tripLength - 1) })}
            >
              <MinusIcon size={15} />
            </button>
            <span className="at-step-n tnum" aria-live="polite">
              {prefs.tripLength}d
            </span>
            <button
              type="button"
              className="at-step-b"
              aria-label="Lengthen default trip"
              disabled={prefs.tripLength >= 21}
              onClick={() => setPrefs({ tripLength: Math.min(21, prefs.tripLength + 1) })}
            >
              <PlusIcon size={15} />
            </button>
          </div>
        </div>
      </Tile>

      {/* notification toggles — one tile, three switches */}
      <Tile wide i={6} className="at-toggles">
        <TileHead icon={<BellIcon size={15} strokeWidth={2.2} />} title="Notifications" />
        <div className="at-togrow">
          <span className="at-tog-label">Deal alerts</span>
          <Switch
            on={prefs.notifyDeals}
            label="Deal alerts"
            onChange={(v) => {
              setPrefs({ notifyDeals: v });
              showToast(v ? "Deal alerts on" : "Deal alerts off", "plane");
            }}
          />
        </div>
        <div className="at-togrow">
          <span className="at-tog-label">Flight status</span>
          <Switch
            on={prefs.notifyFlights}
            label="Flight status"
            onChange={(v) => {
              setPrefs({ notifyFlights: v });
              showToast(v ? "Flight updates on" : "Flight updates off", "plane");
            }}
          />
        </div>
        <div className="at-togrow">
          <span className="at-tog-label">Packing reminders</span>
          <Switch
            on={prefs.notifyPack}
            label="Packing reminders"
            onChange={(v) => {
              setPrefs({ notifyPack: v });
              showToast(v ? `Packing reminders for ${trip.city}` : "Packing reminders off", "bag");
            }}
          />
        </div>
      </Tile>

      {/* about */}
      <Tile wide i={7} className="at-about">
        <button
          type="button"
          className="at-about-b"
          onClick={() => showToast("Atlas v1.0 — bento trip planner", "info")}
        >
          <span className="at-about-left">
            <BagIcon size={15} strokeWidth={2.2} />
            <span>About Atlas</span>
          </span>
          <span className="at-about-ver">v1.0</span>
        </button>
      </Tile>
    </div>
  );
}
