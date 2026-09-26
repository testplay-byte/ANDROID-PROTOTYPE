"use client";

/**
 * VisitScreen — opening hours (hairline rows), address block, ticket
 * counter (adult / concession square steppers with a live total), and a
 * BOOK button that flips into a booked confirmation with a geometric
 * stamp (red disc + blue quarter over yellow, ink frame).
 */

import { useState } from "react";
import { TopBar } from "../../../proto-kit";
import { TICKET_TYPES, type TicketTypeId } from "../lib/data";
import styles from "./visit-screen.module.css";

const HOURS: { day: string; time: string }[] = [
  { day: "Monday", time: "Closed" },
  { day: "Tuesday", time: "10:00 — 18:00" },
  { day: "Wednesday", time: "10:00 — 18:00" },
  { day: "Thursday", time: "10:00 — 21:00" },
  { day: "Friday", time: "10:00 — 18:00" },
  { day: "Saturday", time: "10:00 — 20:00" },
  { day: "Sunday", time: "10:00 — 16:00" },
];

type Counts = Record<TicketTypeId, number>;

export function VisitScreen() {
  const [counts, setCounts] = useState<Counts>({ adult: 2, concession: 0 });
  const [booked, setBooked] = useState(false);

  const total = TICKET_TYPES.reduce(
    (sum, t) => sum + (counts[t.id] ?? 0) * t.price,
    0
  );
  const tickets = TICKET_TYPES.reduce((n, t) => n + (counts[t.id] ?? 0), 0);

  function step(id: TicketTypeId, delta: number) {
    setCounts((prev) => {
      const next = Math.min(6, Math.max(0, (prev[id] ?? 0) + delta));
      return { ...prev, [id]: next };
    });
  }

  return (
    <div className={styles.root}>
      <TopBar variant="hero" title="Visit" subtitle="Plan Your Day" />

      <div className={styles.content}>
        {/* ---- Opening hours ---- */}
        <section className={styles.group}>
          <h2 className={styles.groupLabel}>Opening Hours</h2>
          <div className={styles.hoursTable}>
            {HOURS.map((h) => (
              <div
                key={h.day}
                className={`${styles.hoursRow} ${h.time === "Closed" ? styles.hoursClosed : ""}`}
              >
                <span className={styles.hoursDay}>{h.day}</span>
                <span className={styles.hoursTime}>{h.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ---- Address ---- */}
        <section className={styles.group}>
          <h2 className={styles.groupLabel}>Address</h2>
          <address className={styles.address}>
            Galerie Bauhaus
            <br />
            Moholy-Nagy-Platz 1
            <br />
            10178 Berlin
          </address>
          <p className={styles.addressNote}>
            U8 Weinmeisterstrasse · Tram M1 · Bike racks at the blue gate
          </p>
        </section>

        {/* ---- Tickets / booking ---- */}
        <section className={styles.group}>
          <h2 className={styles.groupLabel}>Tickets</h2>

          {booked ? (
            <div className={styles.confirmation}>
              <div className={styles.stamp} aria-hidden="true">
                <span className={styles.stampDisc} />
                <span className={styles.stampQuarter} />
                <span className={styles.stampBar} />
                <span className={styles.stampText}>ADMITTED</span>
              </div>
              <p className={styles.confirmTitle}>Booked</p>
              <p className={styles.confirmMeta}>
                {tickets} {tickets === 1 ? "ticket" : "tickets"} · EUR {total} ·
                Code GM-2417
              </p>
              <button
                type="button"
                className={styles.bookBtn}
                onClick={() => setBooked(false)}
              >
                BOOK ANOTHER
              </button>
            </div>
          ) : (
            <>
              {TICKET_TYPES.map((t) => (
                <div key={t.id} className={styles.ticketRow}>
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

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>TOTAL</span>
                <span className={styles.totalValue}>EUR {total}</span>
              </div>

              <button
                type="button"
                className={styles.bookBtn}
                disabled={tickets === 0}
                onClick={() => setBooked(true)}
              >
                BOOK
              </button>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
