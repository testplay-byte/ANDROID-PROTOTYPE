"use client";

/* pulse / screens/incidents-screen — incident queue:
   - severity filter chips (ALL / SEV-1 / SEV-2 / SEV-3 + OPEN)
   - incident rows: bordered uppercase severity tag, id, title, state tag,
     opened time; tap → expands the event timeline (grid-rows 0fr→1fr)
   - acknowledge / resolve flow — changes service status squares on Overview */

import { useMemo, useState } from "react";
import { usePulse } from "../state/pulse-context";
import { incidentStateOf, type IncidentState, type Severity } from "../lib/data";
import { StateTag, ActionButton, SEVERITY_TONE } from "../components/controls";
import { ChevronIcon } from "../components/icons";

const STATE_TONE: Record<IncidentState, "red" | "blue" | "green"> = {
  open: "red",
  acknowledged: "blue",
  resolved: "green",
};
const STATE_LABEL: Record<IncidentState, string> = {
  open: "OPEN",
  acknowledged: "ACKNOWLEDGED",
  resolved: "RESOLVED",
};

type Filter = "all" | "open" | Severity;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "open", label: "ACTIVE" },
  { id: "sev-1", label: "SEV-1" },
  { id: "sev-2", label: "SEV-2" },
  { id: "sev-3", label: "SEV-3" },
];

export function IncidentsScreen() {
  const { incidents, acks, resolved, acknowledge, resolve, reopen, services } = usePulse();
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string | null>("INC-1042");

  const list = useMemo(
    () =>
      incidents.filter((i) => {
        if (filter === "all") return true;
        if (filter === "open") return incidentStateOf(i, acks, resolved) !== "resolved";
        return i.severity === filter;
      }),
    [incidents, filter, acks, resolved]
  );

  const affected = (serviceId: string) =>
    services.find((s) => s.id === serviceId)?.name ?? serviceId;

  return (
    <div className="plu-screen plu-screen--incidents">
      <div className="plu-scroll">
        <div className="plu-chipbar" role="group" aria-label="Filter incidents">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`plu-chip ${filter === f.id ? "plu-chip--active" : ""}`}
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
          <span className="plu-chipbar__count tnum">{list.length}</span>
        </div>

        {list.length === 0 ? (
          <div className="plu-empty">
            <p>No incidents match this filter.</p>
          </div>
        ) : (
          <ul className="plu-inc-list">
            {list.map((inc) => {
              const state = incidentStateOf(inc, acks, resolved);
              const open = expanded === inc.id;
              return (
                <li key={inc.id} className={`plu-inc plu-inc--${state} ${open ? "plu-inc--open" : ""}`}>
                  <button
                    type="button"
                    className="plu-inc__head"
                    aria-expanded={open}
                    onClick={() => setExpanded(open ? null : inc.id)}
                  >
                    <span className="plu-inc__sev">
                      <StateTag tone={SEVERITY_TONE[inc.severity]}>{inc.severity.toUpperCase()}</StateTag>
                    </span>
                    <span className="plu-inc__main">
                      <span className="plu-inc__title">{inc.title}</span>
                      <span className="plu-inc__meta tnum">
                        {inc.id} · {affected(inc.serviceId)} · opened {inc.opened}
                      </span>
                    </span>
                    <span className="plu-inc__right">
                      <StateTag tone={STATE_TONE[state]}>{STATE_LABEL[state]}</StateTag>
                      <span className={`plu-inc__chev ${open ? "plu-inc__chev--up" : ""}`} aria-hidden="true">
                        <ChevronIcon />
                      </span>
                    </span>
                  </button>

                  {/* expandable timeline */}
                  <div className="plu-inc__panel">
                    <div className="plu-inc__panel-inner">
                      <ol className="plu-timeline">
                        {inc.events.map((ev, i) => {
                          const pending = ev.time === "—";
                          return (
                            <li key={i} className={`plu-tl ${pending ? "plu-tl--pending" : ""}`}>
                              <span className="plu-tl__time tnum">{pending ? "···" : ev.time}</span>
                              <span className="plu-tl__label">{ev.label}</span>
                            </li>
                          );
                        })}
                      </ol>
                      <div className="plu-inc__actions">
                        {state === "open" ? (
                          <ActionButton kind="primary" onClick={() => acknowledge(inc.id)}>
                            Acknowledge
                          </ActionButton>
                        ) : null}
                        {state !== "resolved" ? (
                          <ActionButton kind="ghost" onClick={() => resolve(inc.id)}>
                            Resolve
                          </ActionButton>
                        ) : (
                          <ActionButton kind="danger" onClick={() => reopen(inc.id)}>
                            Reopen
                          </ActionButton>
                        )}
                        <span className="plu-inc__dur tnum">{inc.duration}</span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
