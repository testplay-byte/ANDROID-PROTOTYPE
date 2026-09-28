/**
 * telemetry / components / service-panel — the right-hand detail panel.
 *
 * A desktop pattern with no phone equivalent: a persistent side panel that
 * opens BESIDE the table so the data and the context stay visible at the same
 * time. Esc or the × closes it and the table takes the full width back.
 *
 * It also carries the acknowledge / resolve actions, which is what makes the
 * incident → fleet tile repaint read as one app rather than two screens.
 */

import { INCIDENTS, STATE_LABEL, fmtPct, incidentStateOf, onCallById } from "../data";
import { useTelemetry } from "../state/telemetry-context";
import { Sparkline, UptimeStrip } from "./charts";
import { SEVERITY_TONE, StatusSquare, Tag } from "./controls";
import { CheckIcon, CloseIcon } from "./icons";

export function ServicePanel() {
  const {
    selectedService,
    selectService,
    services,
    incidents,
    acks,
    resolved,
    acknowledge,
    resolve,
    notify,
  } = useTelemetry();

  const svc = services.find((s) => s.id === selectedService);
  if (!svc) return null;

  const live = incidents.filter((i) => i.serviceId === svc.id);
  const tone = svc.state === "down" ? "red" : svc.state === "degraded" ? "amber" : "green";
  const commander = live[0] ? onCallById(live[0].commander.split(" ").pop()?.toLowerCase() ?? "") : undefined;

  return (
    <aside className="tel-panel" aria-label={`${svc.name} details`}>
      <header className="tel-panel__head">
        <div>
          <h2>{svc.name}</h2>
          <p>
            {svc.tier.toUpperCase()} · {svc.region} · {svc.team}
          </p>
        </div>
        <button
          type="button"
          className="tel-iconbtn"
          aria-label="Close detail panel"
          onClick={() => selectService(null)}
        >
          <CloseIcon />
        </button>
      </header>

      <Tag tone={tone}>
        <StatusSquare state={svc.state} small />
        {STATE_LABEL[svc.state]}
      </Tag>

      <h3 className="tel-panel__section">Live signals</h3>
      <dl className="tel-facts">
        <div>
          <dt>Nodes</dt>
          <dd>{svc.nodes}</dd>
        </div>
        <div>
          <dt>p50 latency</dt>
          <dd>{svc.liveP50} ms</dd>
        </div>
        <div>
          <dt>Error rate</dt>
          <dd>{svc.errorRate.toFixed(2)} %</dd>
        </div>
        <div>
          <dt>Node load</dt>
          <dd>
            <span className="tel-meter" data-state={svc.state}>
              <i style={{ width: `${Math.round(svc.load[svc.load.length - 1])}%` }} />
            </span>
          </dd>
        </div>
      </dl>

      <h3 className="tel-panel__section">Request rate · last hour</h3>
      <div className="tel-panel__spark">
        <Sparkline points={svc.load} state={svc.state} width={282} height={46} />
      </div>

      <h3 className="tel-panel__section">Uptime · 30 days</h3>
      <UptimeStrip
        bars={svc.bars}
        state={svc.state}
        label={`${svc.name} 30 day uptime, ${fmtPct(svc.uptime)} percent`}
      />
      <p className="tel-panel__note">
        Rolling 30-day uptime <b className="tnum">{fmtPct(svc.uptime)} %</b> against a{" "}
        <b className="tnum">{fmtPct(svc.slo)} %</b> objective.
      </p>

      <h3 className="tel-panel__section">Incidents</h3>
      {live.length === 0 ? (
        <p className="tel-panel__note">No incidents recorded against this service in the demo window.</p>
      ) : (
        <ul className="tel-panel__incs">
          {live.map((inc) => {
            const state = incidentStateOf(inc, acks, resolved);
            return (
              <li key={inc.id} data-state={state}>
                <div className="tel-panel__inc-head">
                  <Tag tone={SEVERITY_TONE[inc.severity]}>{inc.severity.toUpperCase()}</Tag>
                  <b className="tnum">{inc.id}</b>
                  <span className="tel-panel__inc-age tnum">{inc.age}</span>
                </div>
                <p>{inc.title}</p>
                {state !== "resolved" ? (
                  <div className="tel-panel__inc-actions">
                    {state === "open" && (
                      <button
                        type="button"
                        className="tel-btn tel-btn--sm tel-btn--primary"
                        onClick={() => acknowledge(inc.id)}
                      >
                        Acknowledge
                      </button>
                    )}
                    <button type="button" className="tel-btn tel-btn--sm" onClick={() => resolve(inc.id)}>
                      <CheckIcon size={13} /> Resolve
                    </button>
                  </div>
                ) : (
                  <p className="tel-panel__note tel-panel__note--tight">Closed — backlog drained.</p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <h3 className="tel-panel__section">On-call</h3>
      <dl className="tel-facts">
        <div>
          <dt>Commander</dt>
          <dd>
            {commander && <span className="tel-avatar tel-avatar--sm">{commander.initials}</span>}
            {live[0]?.commander ?? "—"}
          </dd>
        </div>
        <div>
          <dt>Channel</dt>
          <dd>{live[0]?.channel ?? "#on-call"}</dd>
        </div>
      </dl>

      <div className="tel-panel__actions">
        <button
          type="button"
          className="tel-btn tel-btn--ghost"
          onClick={() => notify(`Runbook opened for ${svc.name}`)}
        >
          Open runbook
        </button>
        <button
          type="button"
          className="tel-btn"
          onClick={() => notify(`Drain started on ${svc.nodes} ${svc.name} nodes`)}
        >
          Drain nodes
        </button>
      </div>
    </aside>
  );
}
