"use client";

/**
 * halo / components / device-card — one tile of the home device grid.
 *
 * A phone tile is a row you tap to open a sheet. This is a desktop control:
 * the power state AND the value are both live in the tile, with no navigation
 * at all, and the same component powers the drawer's list. Three parts, three
 * different depths of the shadow recipe — raised tile, raised control,
 * carved value groove.
 */

import { ACTIVE_WORD, IDLE_WORD, KIND_LABEL, roomById, wattsNow, type Device } from "../data";
import { PowerButton, ValueWell } from "./controls";

export function DeviceCard({
  device,
  onToggle,
  onNudge,
}: {
  device: Device;
  onToggle: () => void;
  onNudge: (dir: 1 | -1) => void;
}) {
  const room = roomById(device.room);
  const draw = wattsNow(device);

  return (
    <article className="halo-device halo-raised" data-on={device.on || undefined} data-offline={!device.online || undefined}>
      <header className="halo-device__head">
        <PowerButton device={device} onToggle={onToggle} />
        <div className="halo-device__id">
          <h3>{device.name}</h3>
          <p>
            {room.name} · {KIND_LABEL[device.kind]}
          </p>
        </div>
        <span className="halo-device__draw tnum" title="Instantaneous draw">
          {draw >= 100 ? `${(draw / 1000).toFixed(2)} kW` : `${Math.round(draw)} W`}
        </span>
      </header>

      <ValueWell device={device} onNudge={onNudge} />

      <footer className="halo-device__foot">
        <span className="halo-device__state">{device.on ? ACTIVE_WORD[device.kind] : IDLE_WORD[device.kind]}</span>
        <span className="halo-device__room">{room.floor}</span>
      </footer>
    </article>
  );
}
