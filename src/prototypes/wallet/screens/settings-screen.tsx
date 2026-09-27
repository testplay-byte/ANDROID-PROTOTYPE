"use client";

/* settings screen — iOS grouped lists: glass appearance (iOS 27 tint),
   defaults, security & notifications */

import { IosNavBar, IosSegmented, IosSwitch, useIosCollapse } from "../components/ios";
import { useDeviceTheme } from "../../../proto-kit";
import { useWallet } from "../state/wallet-context";
import type { GlassAppearance } from "../state/wallet-context";

export function SettingsScreen({
  onOpenPass,
}: {
  onOpenPass: () => void;
}) {
  const { ref, collapsed } = useIosCollapse();
  const { prefs, setPrefs, passes, selectedId, selectPass, showToast } = useWallet();
  const { theme, setTheme } = useDeviceTheme();
  const def = passes.find((p) => p.id === selectedId) ?? passes[0];

  return (
    <>
      <IosNavBar title="Settings" collapsed={collapsed} />
      <div className="wl-content" ref={ref}>
        <div className="wl-group-head">Appearance</div>
        <div className="wl-group">
          <div className="wl-row sep">
            <div className="wl-row__main">
              <span className="wl-row__title">Liquid Glass</span>
              <span className="wl-row__sub">Material density, iOS 27 style</span>
            </div>
            <IosSegmented<GlassAppearance>
              label="Glass appearance"
              value={prefs.glass}
              onChange={(g) => setPrefs({ glass: g })}
              options={[
                { id: "clear", label: "Clear" },
                { id: "tinted", label: "Tinted" },
              ]}
            />
          </div>
          <div className="wl-row sep">
            <div className="wl-row__main">
              <span className="wl-row__title">Appearance</span>
              <span className="wl-row__sub">Light / dark for the app and device chrome</span>
            </div>
            <IosSegmented<"dark" | "light">
              label="Appearance"
              value={theme}
              onChange={(t) => setTheme(t)}
              options={[
                { id: "dark", label: "Dark" },
                { id: "light", label: "Light" },
              ]}
            />
          </div>
        </div>
        <div className="wl-footnote">
          “Clear” uses the ultra-translucent iOS 26 material; “Tinted” matches the iOS 27
          density slider for better legibility over bright content.
        </div>

        <div className="wl-group-head">Defaults</div>
        <div className="wl-group">
          <button className="wl-row sep wl-row--btn" onClick={onOpenPass}>
            <span className="wl-disc tint-indigo">
              <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                <rect x="2.5" y="5" width="19" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M3 10.4h18" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </span>
            <div className="wl-row__main">
              <span className="wl-row__title">Default Card</span>
              <span className="wl-row__sub">{def.name}</span>
            </div>
            <svg viewBox="0 0 24 24" width="17" height="17" className="wl-chev" aria-hidden="true">
              <path d="m9 5.5 6.5 6.5L9 18.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="wl-row sep">
            <div className="wl-row__main">
              <span className="wl-row__title">Express Transit</span>
              <span className="wl-row__sub">Use {passes.find((p) => p.kind === "transit")?.name} without unlocking</span>
            </div>
            <IosSwitch on={prefs.expressTransit} onChange={(v) => setPrefs({ expressTransit: v })} label="Express Transit" />
          </div>
          <div className="wl-row">
            <div className="wl-row__main">
              <span className="wl-row__title">Face ID for Payments</span>
              <span className="wl-row__sub">Require Face ID before every payment</span>
            </div>
            <IosSwitch on={prefs.faceId} onChange={(v) => setPrefs({ faceId: v })} label="Face ID for payments" />
          </div>
        </div>

        <div className="wl-group-head">Notifications</div>
        <div className="wl-group">
          <div className="wl-row sep">
            <div className="wl-row__main">
              <span className="wl-row__title">Transactions</span>
              <span className="wl-row__sub">Alert for every charge and refund</span>
            </div>
            <IosSwitch on={prefs.notifyTxn} onChange={(v) => setPrefs({ notifyTxn: v })} label="Transaction alerts" />
          </div>
          <div className="wl-row">
            <div className="wl-row__main">
              <span className="wl-row__title">Offers & Rewards</span>
              <span className="wl-row__sub">Cash-back nudges from your passes</span>
            </div>
            <IosSwitch on={prefs.notifyOffers} onChange={(v) => setPrefs({ notifyOffers: v })} label="Offers and rewards" />
          </div>
        </div>

        <div className="wl-group-head">About</div>
        <div className="wl-group">
          <button
            className="wl-row wl-row--btn"
            onClick={() => showToast("Wallet prototype · data is simulated")}
          >
            <div className="wl-row__main">
              <span className="wl-row__title">Prototype Information</span>
              <span className="wl-row__sub">Wallet 27.0 (simulated data)</span>
            </div>
            <svg viewBox="0 0 24 24" width="17" height="17" className="wl-chev" aria-hidden="true">
              <path d="m9 5.5 6.5 6.5L9 18.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="wl-footnote">
          Apple Wallet–style concept built on the iOS 26/27 Liquid Glass design language.
          No real cards, money, or accounts are involved.
        </div>
      </div>
    </>
  );
}
