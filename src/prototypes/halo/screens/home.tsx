"use client";

/**
 * halo / screens / home — the room summary.
 *
 * The desktop home is a CONTROL SURFACE, not a dashboard of read-only tiles:
 * every device card carries its own power control and its own value groove,
 * and both write straight into the shared state the other three views read.
 * Layout: a 4-up stat strip, a row of room summary tiles that doubles as the
 * grid filter, the device grid itself, then a two-column band holding the
 * 24-hour power curve and the live draw leaderboard.
 *
 * The grid is `repeat(4, …)` at desktop and drops to 2-up at
 * `@container surface (max-width: 900px)` — the tablet reflow.
 */

import { ROOMS, wattsNow, type RoomId } from "../data";
import { useHalo } from "../state/halo-context";
import { PowerCurve, ChartAxis } from "../components/charts";
import { CardHead, Chip, Legend, StatTile } from "../components/controls";
import { DeviceCard } from "../components/device-card";
import { BoltIcon, HomeIcon, LeafIcon, MoonIcon } from "../components/icons";

/** How many cards the home grid shows before deferring to the Rooms view. */
const MAX_CARDS = 8;

export function HomeScreen() {
  const { devices, metrics, usageToday, tariff, hourNow, homeRoom, setHomeRoom, toggleDevice, nudgeDevice, go } = useHalo();

  const visible =
    homeRoom === "all"
      ? [...devices].sort((a, b) => Number(b.on) - Number(a.on) || wattsNow(b) - wattsNow(a))
      : devices.filter((d) => d.room === homeRoom);
  const cards = visible.slice(0, MAX_CARDS);
  const rest = Math.max(0, visible.length - cards.length);

  return (
    <div className="halo-view">
      <div className="halo-stats">
        <StatTile
          label="Indoor"
          value={metrics.indoorTemp.toFixed(1)}
          unit="°C"
          sub={`Outside ${metrics.outdoorTemp.toFixed(1)} °C`}
          tone="flat"
          icon={<HomeIcon size={15} />}
        />
        <StatTile
          label="Live load"
          value={metrics.liveWatts >= 1000 ? (metrics.liveWatts / 1000).toFixed(2) : String(Math.round(metrics.liveWatts))}
          unit={metrics.liveWatts >= 1000 ? "kW" : "W"}
          sub={`${metrics.drawOrder[0]?.name ?? "—"} is the biggest draw`}
          tone="down"
          icon={<BoltIcon size={15} />}
        />
        <StatTile
          label="Used today"
          value={metrics.kwhToday.toFixed(2)}
          unit="kWh"
          sub={`£${metrics.costToday.toFixed(2)} at ${tariff.toFixed(1)}p / kWh`}
          tone="flat"
          icon={<LeafIcon size={15} />}
        />
        <StatTile
          label="Active devices"
          value={`${metrics.onCount}`}
          unit={`/ ${metrics.totalCount}`}
          sub={homeRoom === "all" ? "Whole home" : ROOMS.find((r) => r.id === homeRoom)?.name}
          tone="up"
          icon={<MoonIcon size={15} />}
        />
      </div>

      {/* Room summary — also the grid filter, so the numbers on the tiles
          and the cards below can never disagree. */}
      <section className="halo-roomstrip" aria-label="Room summary">
        <button
          type="button"
          className={`halo-roomtile halo-raised ${homeRoom === "all" ? "is-on" : ""}`}
          aria-pressed={homeRoom === "all"}
          onClick={() => setHomeRoom("all")}
        >
          <span className="halo-roomtile__name">Whole home</span>
          <b className="tnum">{metrics.onCount}</b>
          <span className="halo-roomtile__sub">active devices</span>
        </button>
        {ROOMS.map((r) => {
          const inRoom = devices.filter((d) => d.room === r.id);
          const on = inRoom.filter((d) => d.on).length;
          const selected = homeRoom === r.id;
          return (
            <button
              key={r.id}
              type="button"
              className={`halo-roomtile halo-raised ${selected ? "is-on" : ""}`}
              aria-pressed={selected}
              onClick={() => setHomeRoom(r.id as RoomId)}
            >
              <span className="halo-roomtile__name">{r.name}</span>
              <b className="tnum">{r.temp.toFixed(1)}°</b>
              <span className="halo-roomtile__sub tnum">
                {on}/{inRoom.length} on
              </span>
            </button>
          );
        })}
      </section>

      <section className="halo-gridsection">
        <div className="halo-sectionbar">
          <h2>
            {homeRoom === "all" ? "Everything worth touching" : ROOMS.find((r) => r.id === homeRoom)?.name}
          </h2>
          <div className="halo-sectionbar__right">
            <span className="halo-card__meta tnum">
              {cards.length} of {visible.length} shown
            </span>
            {rest > 0 && (
              <button type="button" className="halo-btn halo-btn--sm" onClick={() => go("rooms")}>
                Open all in Rooms
              </button>
            )}
          </div>
        </div>
        <div className="halo-grid">
          {cards.map((d) => (
            <DeviceCard key={d.id} device={d} onToggle={() => toggleDevice(d.id)} onNudge={(dir) => nudgeDevice(d.id, dir)} />
          ))}
        </div>
      </section>

      <div className="halo-band">
        <section className="halo-card halo-raised">
          <CardHead
            title="Power curve"
            desc="Whole-home draw, last 24 hours · the shaded band is the peak-rate window"
            action={<Legend items={[{ label: "Today", on: true }, { label: "Now", on: true }, { label: "Peak rate", on: false }]} />}
          />
          <PowerCurve
            values={usageToday}
            nowHour={hourNow}
            label={`24 hour power curve, peak ${Math.max(...usageToday).toFixed(2)} kilowatt hours`}
          />
          <ChartAxis />
        </section>

        <section className="halo-card halo-raised">
          <CardHead title="Drawing now" desc="Live load, highest first" meta={`${Math.round(metrics.liveWatts)} W total`} />
          <ul className="halo-draw">
            {metrics.drawOrder.map((d) => (
              <li key={d.id}>
                <span className="halo-draw__name">{d.name}</span>
                <span className="halo-draw__track">
                  <i style={{ width: `${(wattsNow(d) / Math.max(1, metrics.drawOrder[0] ? wattsNow(metrics.drawOrder[0]) : 1)) * 100}%` }} />
                </span>
                <b className="tnum">{Math.round(wattsNow(d))} W</b>
                <Chip tone={d.on ? "on" : "off"}>{d.on ? "On" : "Idle"}</Chip>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
