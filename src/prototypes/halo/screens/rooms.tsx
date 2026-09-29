"use client";

/**
 * halo / screens / rooms — the room list with a device drawer.
 *
 * THE desktop pattern this prototype exists to show: the detail opens BESIDE
 * the list, in a second column, so the room you picked and the devices in it
 * are on screen at the same time. A phone has no such thing — it pushes the
 * room detail onto a new screen.
 *
 * Every switch in the drawer writes the same state the Home grid reads, so
 * turning the kitchen pendants off here changes the Home tiles, the live load
 * readout and the energy totals in the same click.
 *
 * At `@container surface (max-width: 900px)` the split flips: the drawer
 * leaves its column and becomes a full-width block directly BELOW the list.
 */

import { ACTIVE_WORD, IDLE_WORD, KIND_LABEL, ROOMS, roomById, wattsNow } from "../data";
import { useHalo } from "../state/halo-context";
import { CardHead, Chip, PowerButton, ValueWell } from "../components/controls";
import { CloseIcon, SearchIcon } from "../components/icons";

export function RoomsScreen() {
  const {
    devices,
    roomFilter,
    setRoomFilter,
    selectedRoom,
    selectRoom,
    toggleDevice,
    nudgeDevice,
    toggleRoom,
    notify,
  } = useHalo();

  const term = roomFilter.trim().toLowerCase();
  const rows = ROOMS.filter((r) => !term || r.name.toLowerCase().includes(term) || r.floor.toLowerCase().includes(term));
  const room = selectedRoom ? roomById(selectedRoom) : null;
  const drawerDevices = devices.filter((d) => d.room === selectedRoom);
  const drawerOn = drawerDevices.filter((d) => d.on).length;
  const drawerWatts = drawerDevices.reduce((s, d) => s + wattsNow(d), 0);

  return (
    <div className="halo-view halo-split">
      {/* ---------------- the list ---------------- */}
      <div className="halo-pane">
        <label className="halo-roomfilter halo-press">
          <SearchIcon size={15} />
          <input
            type="search"
            value={roomFilter}
            placeholder="Filter rooms or floors"
            onChange={(e) => setRoomFilter(e.target.value)}
            aria-label="Filter rooms"
          />
          <kbd>/</kbd>
        </label>

        <ul className="halo-roomlist">
          {rows.map((r) => {
            const inRoom = devices.filter((d) => d.room === r.id);
            const on = inRoom.filter((d) => d.on).length;
            const draw = inRoom.reduce((s, d) => s + wattsNow(d), 0);
            const selected = selectedRoom === r.id;
            return (
              <li key={r.id}>
                <button
                  type="button"
                  className={`halo-roomrow halo-raised ${selected ? "is-on" : ""}`}
                  onClick={() => selectRoom(selected ? null : r.id)}
                  aria-pressed={selected}
                >
                  <span className="halo-roomrow__temp tnum" aria-label={`${r.temp} degrees`}>
                    {r.temp.toFixed(1)}°
                  </span>
                  <span className="halo-roomrow__id">
                    <b>{r.name}</b>
                    <span>
                      {r.floor} · target {r.target.toFixed(1)}°
                    </span>
                  </span>
                  <span className="halo-roomrow__counts tnum">
                    <b>
                      {on}/{inRoom.length}
                    </b>
                    <span>active</span>
                  </span>
                  <span className="halo-roomrow__draw tnum">{Math.round(draw)} W</span>
                </button>
              </li>
            );
          })}
          {rows.length === 0 && (
            <li className="halo-roomlist__empty">No room matches “{roomFilter}”.</li>
          )}
        </ul>
      </div>

      {/* ---------------- the drawer, beside the list ---------------- */}
      {room && (
        <aside className="halo-drawer halo-raised" aria-label={`${room.name} devices`}>
          <header className="halo-drawer__head">
            <div>
              <h2>{room.name}</h2>
              <p>
                {room.floor} · {drawerOn} of {drawerDevices.length} active · {Math.round(drawerWatts)} W
              </p>
            </div>
            <button
              type="button"
              className="halo-iconbtn halo-raised"
              onClick={() => selectRoom(null)}
              aria-label="Close device drawer"
              title="Close drawer (Esc)"
            >
              <CloseIcon size={15} />
            </button>
          </header>

          <div className="halo-drawer__actions">
            <button
              type="button"
              className="halo-btn halo-btn--sm"
              onClick={() => toggleRoom(room.id)}
            >
              {drawerOn === drawerDevices.length ? "Turn room off" : "Turn room on"}
            </button>
            <button
              type="button"
              className="halo-btn halo-btn--sm halo-btn--quiet"
              onClick={() => notify(`${room.name} scene saved`)}
            >
              Save as scene
            </button>
          </div>

          <ul className="halo-devlist">
            {drawerDevices.map((d) => (
              <li key={d.id} className="halo-devrow halo-raised" data-on={d.on || undefined}>
                <PowerButton device={d} onToggle={() => toggleDevice(d.id)} size="sm" />
                <span className="halo-devrow__id">
                  <b>{d.name}</b>
                  <span>
                    {KIND_LABEL[d.kind]} · {d.on ? ACTIVE_WORD[d.kind] : IDLE_WORD[d.kind]}
                  </span>
                </span>
                <span className="halo-devrow__value">
                  {d.step > 0 ? (
                    <ValueWell device={d} onNudge={(dir) => nudgeDevice(d.id, dir)} />
                  ) : (
                    <Chip tone={d.on ? "on" : "off"}>{Math.round(wattsNow(d))} W</Chip>
                  )}
                </span>
                {!d.online && <Chip tone="warn">Offline</Chip>}
              </li>
            ))}
          </ul>

          <CardHead title="Room facts" />
          <dl className="halo-facts">
            <div>
              <dt>Measured</dt>
              <dd className="tnum">{room.temp.toFixed(1)} °C</dd>
            </div>
            <div>
              <dt>Target</dt>
              <dd className="tnum">{room.target.toFixed(1)} °C</dd>
            </div>
            <div>
              <dt>Active now</dt>
              <dd className="tnum">{drawerOn} / {drawerDevices.length}</dd>
            </div>
            <div>
              <dt>Drawing</dt>
              <dd className="tnum">{Math.round(drawerWatts)} W</dd>
            </div>
          </dl>
        </aside>
      )}
    </div>
  );
}
