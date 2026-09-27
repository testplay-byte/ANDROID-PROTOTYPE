"use client";

/* pay screen — Apple Cash–style flow: contact row, big amount with a
   decimal-capable glass keypad (round keys), Request + Pay actions and a
   Face ID–style confirmation. Payments append to the Activity feed. */

import { useState } from "react";
import { IosNavBar } from "../components/ios";
import { CONTACTS, money } from "../lib/data";
import { useWallet } from "../state/wallet-context";

export function PayScreen() {
  const { passes, selectedId, prefs, addTxn, showToast, setPayTo, payTo } = useWallet();
  const [raw, setRaw] = useState(""); // "12" | "12." | "12.34"
  const [processing, setProcessing] = useState(false);
  const pass = passes.find((p) => p.id === selectedId) ?? passes[0];
  const contact = CONTACTS.find((c) => c.name === payTo) ?? CONTACTS[0];

  function key(k: string) {
    if (processing) return;
    if (k === "del") {
      setRaw(raw.slice(0, -1));
      return;
    }
    if (k === ".") {
      if (raw.includes(".")) return;
      setRaw(raw === "" ? "0." : raw + ".");
      return;
    }
    const frac = raw.includes(".") ? raw.split(".")[1] : "";
    if (raw.includes(".") && frac.length >= 2) return;
    if (raw.replace(".", "").length >= 7) return;
    setRaw(raw === "0" ? k : raw + k);
  }

  const cents = raw ? Math.round((parseFloat(raw) || 0) * 100) : 0;
  const [intPart, fracPart] = (raw === "" ? "0" : raw).split(".");
  const fracShown = (fracPart ?? "").padEnd(2, "0").slice(0, 2);

  function pay() {
    if (!cents || processing) return;
    setProcessing(true);
    window.setTimeout(() => {
      const now = new Date();
      addTxn({
        passId: pass.id,
        merchant: contact.name,
        category: "Apple Pay",
        amount: -cents,
        date: now.toISOString().slice(0, 10),
        time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      });
      setProcessing(false);
      setRaw("");
      showToast(`Paid ${money(cents)} to ${contact.name} with ${pass.name}`);
    }, 950);
  }

  function request() {
    if (!cents || processing) return;
    showToast(`Requested ${money(cents)} from ${contact.name}`);
  }

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "del"];

  return (
    <>
      <IosNavBar title="Pay" inlineOnly />
      <div className="wl-content wl-pay">
        <div className="wl-group-head">Send to</div>
        <div className="wl-contacts" role="radiogroup" aria-label="Send to">
          {CONTACTS.map((c) => {
            const initials = c.name.split(" ").map((w) => w[0]).join("");
            const on = contact.id === c.id;
            return (
              <button
                key={c.id}
                className={"wl-contact" + (on ? " on" : "")}
                role="radio"
                aria-checked={on}
                onClick={() => setPayTo(c.name)}
              >
                <span className="wl-contact__avatar">{initials}</span>
                <span className="wl-contact__name">{c.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        <div className="wl-amount" aria-live="polite">
          <span className="wl-amount__cur">$</span>
          <span className={"wl-amount__int" + (!cents ? " empty" : "")}>
            {Number(intPart).toLocaleString("en-US")}
          </span>
          <span className="wl-amount__frac">.{fracShown}</span>
        </div>

        <div className="wl-keypad" role="group" aria-label="Amount keypad">
          {keys.map((k) => (
            <button
              key={k}
              className="wl-key"
              aria-label={k === "del" ? "Delete" : k}
              disabled={processing}
              onClick={() => key(k)}
            >
              {k === "del" ? (
                <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                  <path d="M9 5.5h9.5a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5.5-6.5L9 5.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  <path d="m11.5 9.5 5 5M16.5 9.5l-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              ) : (
                k
              )}
            </button>
          ))}
        </div>

        <div className="wl-pay-actions">
          <button className="wl-request" onClick={request} disabled={!cents || processing}>
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="M12 19V5M12 5l-5.5 5.5M12 5l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Request
          </button>
          <button className={"wl-paybtn" + (!cents || processing ? " disabled" : "")} onClick={pay} disabled={!cents || processing}>
            {processing ? (
              <svg viewBox="0 0 24 24" width="18" height="18" className="wl-spin" aria-hidden="true">
                <path d="M12 3.5a8.5 8.5 0 1 1-8.5 8.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
                <rect x="4.5" y="3.5" width="15" height="17" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8.5 8.5c1.6-1.4 5.4-1.4 7 0M9.4 13c.5.7 1.4 1.1 2.6 1.1s2.1-.4 2.6-1.1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            )}
            {processing ? "Processing…" : `Pay ${cents ? money(cents) : ""}`}
          </button>
        </div>

        <div className="wl-pay-sub">
          {prefs.faceId ? "Face ID · " : ""}
          {pass.name} · {pass.number} — to {contact.name}
        </div>
      </div>
    </>
  );
}
