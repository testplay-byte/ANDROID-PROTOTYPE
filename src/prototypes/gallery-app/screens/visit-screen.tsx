"use client";

/**
 * VisitScreen — plan the day: opening-hours ledger, an address block with a
 * quarter-circle motif, a ticket planner (date chips from the real week,
 * time-slot chips, square steppers per ticket type), and a hard-bordered
 * summary slab with a live EUR total. BOOK flips into a confirmation with a
 * rotated geometric ADMITTED stamp + toast.
 */

import { useState } from "react";
import { TopBar } from "../../../proto-kit";
import { DiagonalDivider, SectionLabel } from "../components/bits";
import {
  TICKET_TYPES,
  TIME_SLOTS,
  buildSlotDays,
  type TicketTypeId,
} from "../lib/data";
import { useGallery } from "../state/gallery-context";
import styles from "./visit-screen.module.css";

const HOURS: { day: string; time: string }[] = [
  { day: "Montag", time: "Geschlossen" },
  { day: "Dienstag", time: "10:00 — 18:00" },
  { day: "Mittwoch", time: "10:00 — 18:00" },
  { day: "Donnerstag", time: "10:00 — 21:00" },
  { day: "Freitag", time: "10:00 — 18:00" },
  { day: "Samstag", time: "10:00 — 20:00" },
  { day: "Sonntag", time: "10:00 — 16:00" },
];

type Counts = Record<TicketTypeId, number>;

function makeCode(): string {
  return `GM-${String(Math.floor(1000 + Math.random() * 9000))}`;
}

export function VisitScreen() {
  const { showToast } = useGallery();
  const [days] = useState(buildSlotDays);
  const [dayId, setDayId] = useState(() => buildSlotDays().find((d) => !d.closed)?.id ?? days[0].id);
  const [slot, setSlot] = useState<string>(TIME_SLOTS[1]);
  const [counts, setCounts] = useState<Counts>({ adult: 2, concession: 0 });
  const [booked, setBooked] = useState<null | { code: string; tickets: number; total: number; dayLabel: string; slot: string }>(null);

  const total = TICKET_TYPES.reduce((sum, t) => sum + (counts[t.id] ?? 0) * t.price, 0);
  const tickets = TICKET_TYPES.reduce((n, t) => n + (counts[t.id] ?? 0), 0);
  const chosenDay = days.find((d) => d.id === dayId) ?? days[0];

  function step(id: TicketTypeId, delta: number) {
    setCounts((prev) => {
      const next = Math.min(6, Math.max(0, (prev[id] ?? 0) + delta));
      return { ...prev, [id]: next };
    });
  }

  function book() {
    const code = makeCode();
    setBooked({
      code,
      tickets,
      total,
      dayLabel: `${chosenDay.weekday} ${chosenDay.day}. ${chosenDay.month}`,
      slot,
    });
    showToast(`TICKET BESTÄTIGT — ${code}`, "red");
  }

  return (
    <div className={styles.root}>
      <TopBar variant="hero" title="Visit" subtitle="Planen Sie Ihren Tag" />

      <div className={styles.content}>
        {/* ---- opening hours ---- */}
        <SectionLabel trailing="MO — SO">Öffnungszeiten</SectionLabel>
        <div className={styles.hoursTable}>
          {HOURS.map((h) => (
            <div
              key={h.day}
              className={`${styles.hoursRow} ${h.time === "Geschlossen" ? styles.hoursClosed : ""}`}
            >
              <span className={styles.hoursDay}>{h.day}</span>
              <span className={styles.hoursTime}>{h.time}</span>
            </div>
          ))}
        </div>

        <DiagonalDivider />

        {/* ---- address, with a quarter-circle motif ---- */}
        <SectionLabel>Anfahrt</SectionLabel>
        <div className={styles.addressBlock}>
          <address className={styles.address}>
            Galerie Bauhaus
            <br />
            Moholy-Nagy-Platz 1
            <br />
            10178 Berlin
          </address>
          <div className={styles.addressQuarter} aria-hidden="true">
            <span className={styles.addressDisc} />
            <span className={styles.addressPie} />
          </div>
        </div>
        <p className={styles.addressNote}>
          U8 Weinmeisterstraße · Tram M1 · Fahrradständer am blauen Tor
        </p>

        <DiagonalDivider />

        {/* ---- ticket planner ---- */}
        <SectionLabel>Tickets</SectionLabel>

        {booked ? (
          <div className={styles.confirmation}>
            <div className={styles.stamp} aria-hidden="true">
              <span className={styles.stampDisc} />
              <span className={styles.stampQuarter} />
              <span className={styles.stampBar} />
              <span className={styles.stampText}>ADMITTED</span>
            </div>
            <p className={styles.confirmTitle}>Gebucht</p>
            <div className={styles.confirmFacts}>
              <span>{booked.dayLabel}</span>
              <span>{booked.slot} Uhr</span>
              <span>
                {booked.tickets} {booked.tickets === 1 ? "Ticket" : "Tickets"}
              </span>
              <span>EUR {booked.total}</span>
            </div>
            <p className={styles.confirmMeta}>Code {booked.code} — an der Kasse vorzeigen</p>
            <button
              type="button"
              className={styles.resetBtn}
              onClick={() => setBooked(null)}
            >
              WEITERE BUCHEN
            </button>
          </div>
        ) : (
          <>
            {/* date chips */}
            <span className={styles.plannerLabel}>Tag</span>
            <div className={styles.dayChips} role="group" aria-label="Besuchstag">
              {days.map((d) => {
                const on = d.id === dayId;
                return (
                  <button
                    key={d.id}
                    type="button"
                    className={`${styles.dayChip} ${on ? styles.dayChipOn : ""}`}
                    aria-pressed={on}
                    disabled={d.closed}
                    onClick={() => setDayId(d.id)}
                  >
                    <span className={styles.dayChipWd}>{d.weekday}</span>
                    <span className={styles.dayChipNum}>{d.day}</span>
                    <span className={styles.dayChipMo}>{d.month}</span>
                  </button>
                );
              })}
            </div>

            {/* time slots */}
            <span className={styles.plannerLabel}>Zeitfenster</span>
            <div className={styles.slotChips} role="group" aria-label="Zeitfenster">
              {TIME_SLOTS.map((s) => {
                const on = s === slot;
                return (
                  <button
                    key={s}
                    type="button"
                    className={`${styles.slotChip} ${on ? styles.slotChipOn : ""}`}
                    aria-pressed={on}
                    onClick={() => setSlot(s)}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            {/* steppers */}
            <div className={styles.plannerBlock}>
              {TICKET_TYPES.map((t, i) => (
                <div
                  key={t.id}
                  className={`${styles.ticketRow} ${i > 0 ? styles.ticketRowBorder : ""}`}
                >
                  <div className={styles.ticketMeta}>
                    <span className={styles.ticketLabel}>{t.label}</span>
                    <span className={styles.ticketPrice}>EUR {t.price}</span>
                  </div>
                  <div className={styles.stepper}>
                    <button
                      type="button"
                      className={styles.stepBtn}
                      aria-label={`Remove one ${t.label} ticket`}
                      disabled={(counts[t.id] ?? 0) === 0}
                      onClick={() => step(t.id, -1)}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" aria-hidden="true">
                        <path d="M2 7h10" />
                      </svg>
                    </button>
                    <span className={styles.stepVal} aria-live="polite">
                      {counts[t.id] ?? 0}
                    </span>
                    <button
                      type="button"
                      className={styles.stepBtn}
                      aria-label={`Add one ${t.label} ticket`}
                      disabled={(counts[t.id] ?? 0) >= 6}
                      onClick={() => step(t.id, 1)}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" aria-hidden="true">
                        <path d="M2 7h10M7 2v10" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* hard summary */}
            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>DATUM</span>
                <b>
                  {chosenDay.weekday} {chosenDay.day}. {chosenDay.month}
                </b>
              </div>
              <div className={styles.summaryRow}>
                <span>FENSTER</span>
                <b>{slot} Uhr</b>
              </div>
              <div className={styles.summaryRow}>
                <span>TICKETS</span>
                <b>{tickets}</b>
              </div>
              <div className={styles.summaryTotal}>
                <span className={styles.totalLabel}>SUMME</span>
                <span className={styles.totalValue} aria-live="polite">
                  EUR {total}
                </span>
              </div>
            </div>

            <button
              type="button"
              className={styles.bookBtn}
              disabled={tickets === 0}
              onClick={book}
            >
              BOOK
            </button>
          </>
        )}
      </div>
    </div>
  );
}
