"use client";

/**
 * telemetry / screens / incidents — the incident queue.
 *
 * A queue is not a phone list: it is a two-column desktop layout with the
 * on-call roster pinned beside it. Rows carry a bordered SEV tag and a state
 * tag, expand in place to reveal the event timeline, and run a real
 * acknowledge → resolve flow. Resolving an incident is SHARED state — the
 * affected service tile on the Fleet view repaints from degraded to healthy
 * in the same click, without a reload.
 */

import { useState } from "react";
import {
  INCIDENTS,
  INCIDENT_STATE_LABEL,
  ONCALL,
  SEVERITY_LABEL,
  incidentStateOf,
  serviceById,
  type IncidentState,
  type Severity,
} from "../data";
import { useTelemetry } from "../state/telemetry-context";
import { Chip, SEVERITY_TONE, Tag, type TagTone } from "../components/controls";
import { CheckIcon, ChevronIcon, PlusIcon } from "../components/icons";

type Filter = "all" | "active" | Severity;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "sev-1", label: "SEV-1" },
  { id: "sev-2", label: "SEV-2" },
  { id: "sev-3", label: "SEV-3" },
];

const STATE_TONE: Record<IncidentState, TagTone> = {
  open: "red",
  acknowledged: "blue",
  resolved: "green",
};

export function IncidentsScreen() {
  const { acks, resolved, acknowledge, resolve, reopen, inspect, density, notify } = useTelemetry();
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string | null>("INC-2201");

  const list = INCIDENTS.filter((i) => {
    const state = incidentStateOf(i, acks, resolved);
    if (filter === "all") return true;
    if (filter === "active") return state !== "resolved";
    return i.severity === filter;
  });

  const countFor = (f: Filter) =>
    INCIDENTS.filter((i) => {
      const state = incidentStateOf(i, acks, resolved);
      if (f === "all") return true;
      if (f === "active") return state !== "resolved";
      return i.severity === f;
    }).length;

  return (
    <div className="tel-view" data-density={density}>
      <div className="tel-incbar">
        <div className="tel-toolbar__chips" role="group" aria-label="Filter incidents">
          {FILTERS.map((f) => (
            <Chip
              key={f.id}
              label={f.label}
              count={countFor(f.id)}
              on={filter === f.id}
              onClick={() => setFilter(f.id)}
            />
          ))}
        </div>
        <button
          type="button"
          className="tel-btn tel-btn--primary"
          onClick={() => notify("Declare incident — a draft sev-3 was created")}
        >
          <PlusIcon size={13} /> Declare incident
        </button>
      </div>

      <div className="tel-split">
        <div>
          {list.length === 0 ? (
            <div className="tel-empty">No incidents match this filter.</div>
          ) : (
            <ul className="tel-inc-list">
              {list.map((inc) => {
                const state = incidentStateOf(inc, acks, resolved);
                const svc = serviceById(inc.serviceId);
                const isOpen = expanded === inc.id;
                return (
                  <li key={inc.id} className={`tel-inc${isOpen ? " is-open" : ""}`} data-state={state}>
                    <button
                      type="button"
                      className="tel-inc__head"
                      aria-expanded={isOpen}
                      onClick={() => setExpanded(isOpen ? null : inc.id)}
                    >
                      <Tag tone={SEVERITY_TONE[inc.severity]}>{SEVERITY_LABEL[inc.severity]}</Tag>
                      <span className="tel-inc__main">
                        <span className="tel-inc__title">{inc.title}</span>
                        <span className="tel-inc__meta">
                          {inc.id} · {svc?.name} · opened {inc.opened} · commander {inc.commander}
                        </span>
                      </span>
                      <span className="tel-inc__right">
                        <span className="tel-inc__age tnum">{inc.age}</span>
                        <Tag tone={STATE_TONE[state]}>{INCIDENT_STATE_LABEL[state]}</Tag>
                        <span className={`tel-inc__chev${isOpen ? " is-up" : ""}`} aria-hidden="true">
                          <ChevronIcon size={15} />
                        </span>
                      </span>
                    </button>

                    <div className="tel-inc__panel">
                      <div className="tel-inc__panel-inner">
                        <div className="tel-inc__body">
                          <div>
                            <p className="tel-inc__summary">{inc.summary}</p>
                            <ol className="tel-timeline">
                              {inc.events.map((ev, i) => {
                                const pending = ev.time === "—";
                                return (
                                  <li key={i} className="tel-tl" data-pending={pending || undefined}>
                                    <span className="tel-tl__time tnum">{pending ? "···" : ev.time}</span>
                                    {ev.label}
                                  </li>
                                );
                              })}
                            </ol>
                          </div>
                          <div className="tel-inc__actions">
                            {state === "open" ? (
                              <button
                                type="button"
                                className="tel-btn tel-btn--primary"
                                onClick={() => acknowledge(inc.id)}
                              >
                                Acknowledge
                              </button>
                            ) : null}
                            {state !== "resolved" ? (
                              <button type="button" className="tel-btn" onClick={() => resolve(inc.id)}>
                                <CheckIcon size={13} /> Resolve
                              </button>
                            ) : (
                              <button type="button" className="tel-btn tel-btn--danger" onClick={() => reopen(inc.id)}>
                                Reopen
                              </button>
                            )}
                            <button type="button" className="tel-btn tel-btn--ghost" onClick={() => inspect(inc.serviceId)}>
                              View service
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <aside className="tel-rostercard" aria-label="On-call rota">
          <h2 className="tel-panel__section">On-call rota</h2>
          <ul className="tel-roster">
            {ONCALL.map((p) => (
              <li key={p.id}>
                <span className="tel-avatar" aria-hidden="true">
                  {p.initials}
                </span>
                <span className="tel-roster__who">
                  <b>{p.name}</b>
                  <span>{p.role}</span>
                  <span>{p.shift}</span>
                </span>
                <span className="tel-roster__pages tnum">
                  {p.pages} {p.pages === 1 ? "page" : "pages"}
                </span>
              </li>
            ))}
          </ul>
          <p className="tel-panel__note tel-panel__note--tight">
            Escalation path: primary → secondary → platform lead. Acknowledging an incident
            assigns the current primary as commander.
          </p>
        </aside>
      </div>
    </div>
  );
}
