"use client";

/**
 * counter / screens / services — the menu, and the engine of the booking form.
 *
 * These numbers are not decoration: duration sets the block height on the
 * schedule grid and the end time in the conflict check; price is what the
 * form quotes and what the bookings table sums. Edit either here and every
 * other view updates, which is the point of keeping one services list in
 * context rather than a copy per screen.
 */

import { durationLabel, money } from "../data";
import { useCounter } from "../state/counter-context";

const TONES = ["a", "b", "c", "d"] as const;

export function ServicesScreen() {
  const {
    services,
    bookings,
    updateService,
    resetServices,
    notify,
    selectedId,
    select,
    go,
  } = useCounter();

  const active = services.filter((s) => s.active);
  const averageDuration = Math.round(
    active.reduce((sum, s) => sum + s.duration, 0) / Math.max(1, active.length)
  );
  const averagePrice = Math.round(
    active.reduce((sum, s) => sum + s.price, 0) / Math.max(1, active.length)
  );
  const bookableRevenue = active.reduce((sum, s) => {
    const count = bookings.filter((b) => b.serviceId === s.id && b.status !== "cancelled").length;
    return sum + count * s.price;
  }, 0);

  return (
    <div className="ctr-view">
      <div className="ctr-statrow">
        <div className="ctr-stat" data-tone="a">
          <span className="ctr-stat__label">Services</span>
          <b className="ctr-stat__value tnum">
            {active.length}
            <small>/{services.length}</small>
          </b>
          <span className="ctr-stat__note">active on the list</span>
        </div>
        <div className="ctr-stat" data-tone="b">
          <span className="ctr-stat__label">Avg duration</span>
          <b className="ctr-stat__value tnum">{durationLabel(averageDuration)}</b>
          <span className="ctr-stat__note">across the active menu</span>
        </div>
        <div className="ctr-stat" data-tone="c">
          <span className="ctr-stat__label">Avg price</span>
          <b className="ctr-stat__value tnum">{money(averagePrice)}</b>
          <span className="ctr-stat__note">active services only</span>
        </div>
        <div className="ctr-stat" data-tone="d">
          <span className="ctr-stat__label">Booked value</span>
          <b className="ctr-stat__value tnum">{money(bookableRevenue)}</b>
          <span className="ctr-stat__note">all non-cancelled bookings</span>
        </div>
      </div>

      <div className="ctr-svgrid">
        {services.map((s, i) => {
          const count = bookings.filter(
            (b) => b.serviceId === s.id && b.status !== "cancelled"
          ).length;
          const first = bookings.find((b) => b.serviceId === s.id && b.status !== "cancelled");
          return (
            <article
              key={s.id}
              className="ctr-svcard"
              data-tone={TONES[i % TONES.length]}
              data-inactive={!s.active || undefined}
              data-selected={selectedId === first?.id || undefined}
            >
              <header className="ctr-svcard__head">
                <h2>{s.name}</h2>
                <span className="ctr-svcard__cat">{s.category}</span>
              </header>

              <div className="ctr-svcard__controls">
                <label className="ctr-stepper">
                  <span>Duration</span>
                  <span className="ctr-stepper__row">
                    <button
                      type="button"
                      onClick={() => updateService(s.id, { duration: Math.max(10, s.duration - 5) })}
                      aria-label={`Shorten ${s.name} by five minutes`}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={10}
                      max={240}
                      step={5}
                      value={s.duration}
                      onChange={(e) =>
                        updateService(s.id, {
                          duration: Math.max(10, Math.min(240, parseInt(e.target.value, 10) || 10)),
                        })
                      }
                      aria-label={`${s.name} duration in minutes`}
                    />
                    <button
                      type="button"
                      onClick={() => updateService(s.id, { duration: Math.min(240, s.duration + 5) })}
                      aria-label={`Lengthen ${s.name} by five minutes`}
                    >
                      +
                    </button>
                  </span>
                </label>

                <label className="ctr-stepper">
                  <span>Price</span>
                  <span className="ctr-stepper__row">
                    <button
                      type="button"
                      onClick={() => updateService(s.id, { price: Math.max(0, s.price - 5) })}
                      aria-label={`Reduce the price of ${s.name}`}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={0}
                      max={500}
                      step={5}
                      value={s.price}
                      onChange={(e) =>
                        updateService(s.id, {
                          price: Math.max(0, Math.min(500, parseInt(e.target.value, 10) || 0)),
                        })
                      }
                      aria-label={`${s.name} price`}
                    />
                    <button
                      type="button"
                      onClick={() => updateService(s.id, { price: Math.min(500, s.price + 5) })}
                      aria-label={`Raise the price of ${s.name}`}
                    >
                      +
                    </button>
                  </span>
                </label>
              </div>

              <footer className="ctr-svcard__foot">
                <span className="ctr-svcard__count tnum">
                  {count} booked · {durationLabel(s.duration)} · {money(s.price)}
                </span>
                <button
                  type="button"
                  className="ctr-toggle"
                  aria-pressed={s.active}
                  onClick={() => {
                    updateService(s.id, { active: !s.active });
                    notify(`${s.name} ${s.active ? "hidden from" : "added to"} the bookable list`);
                  }}
                >
                  {s.active ? "Active" : "Hidden"}
                </button>
              </footer>

              {first && (
                <button
                  type="button"
                  className="ctr-linkbtn ctr-svcard__link"
                  onClick={() => {
                    go("bookings");
                    select(first.id);
                  }}
                >
                  Show next booking for {s.name}
                </button>
              )}
            </article>
          );
        })}
      </div>

      <div className="ctr-viewfoot">
        <p className="ctr-viewfoot__note">
          Durations drive the schedule grid and the double-booking check; prices drive the booking
          quote. Changes are live in this session only.
        </p>
        <button className="ctr-btn" type="button" onClick={resetServices}>
          Restore the menu
        </button>
      </div>
    </div>
  );
}
