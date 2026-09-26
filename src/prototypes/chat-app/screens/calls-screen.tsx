"use client";

/**
 * chat-app / screens / calls-screen — recent calls.
 *
 * Rows with a flat colored circle holding the direction icon:
 *   incoming = arrow-down-left (primary teal), outgoing = arrow-up-right
 *   (coral secondary), missed = x (error red). Each row has a call button
 *   that shows a brief "Calling..." overlay state.
 */
import { useEffect, useRef, useState } from "react";
import { TopBar } from "../../../proto-kit";
import { Avatar } from "../components/avatar";
import type { CallEntry } from "../lib/types";
import styles from "./calls-screen.module.css";

interface CallsScreenProps {
  active: boolean;
  calls: CallEntry[];
}

export function CallsScreen({ active, calls }: CallsScreenProps) {
  const [calling, setCalling] = useState<CallEntry | null>(null);
  const timerRef = useRef<number | null>(null);

  // Auto-dismiss the calling overlay after ~2s.
  useEffect(() => {
    if (!calling) return;
    timerRef.current = window.setTimeout(() => setCalling(null), 2000);
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [calling]);

  return (
    <section
      className={`view ${active ? "view--active" : ""}`}
      data-view="calls"
      aria-label="Calls"
      aria-hidden={!active}
    >
      <TopBar variant="inline" title="Calls" subtitle="Recent" />
      <div className={styles.content}>
        <div className={styles.list}>
          {calls.map((call) => (
            <div key={call.id} className={styles.row}>
              <span
                className={`${styles.directionCircle} ${styles[`dir_${call.type}`] ?? ""}`}
                aria-hidden="true"
              >
                {call.type === "incoming" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 7l10 10" />
                    <path d="M17 8v9H8" />
                  </svg>
                )}
                {call.type === "outgoing" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7" />
                    <path d="M8 7h9v9" />
                  </svg>
                )}
                {call.type === "missed" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                )}
              </span>
              <Avatar initials={call.initials} accent={call.accent} size={42} />
              <span className={styles.rowMain}>
                <span
                  className={`${styles.rowName} ${call.type === "missed" ? styles.rowNameMissed : ""}`}
                >
                  {call.name}
                </span>
                <span className={styles.rowWhen}>
                  {call.when}
                  {call.duration ? ` · ${call.duration}` : ""}
                </span>
              </span>
              <button
                type="button"
                className={styles.callButton}
                onClick={() => setCalling(call)}
                aria-label={`Call ${call.name}`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Calling overlay — brief feedback state */}
      <div
        className={`${styles.overlay} ${calling ? styles.overlayShow : ""}`}
        aria-hidden={!calling}
      >
        {calling && (
          <div className={styles.overlayCard}>
            <Avatar initials={calling.initials} accent={calling.accent} size={72} />
            <p className={styles.overlayName}>{calling.name}</p>
            <p className={styles.overlayStatus}>
              Calling<span className={styles.ellipsis}>...</span>
            </p>
            <button
              type="button"
              className={styles.endButton}
              onClick={() => setCalling(null)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 23.26 17v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
                <path d="M22 2L2 22" />
              </svg>
              End
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
