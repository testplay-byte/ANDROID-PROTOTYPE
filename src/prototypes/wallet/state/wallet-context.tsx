"use client";

/* wallet-context — central client state: selected pass, pay flow,
   transactions (payments made in the prototype append here), toast,
   and the iOS 27 glass-appearance pref ("clear" | "tinted", persisted). */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { PASS_BY_ID, PASSES, TXNS } from "../lib/data";
import type { Pass, Txn } from "../lib/data";

export type GlassAppearance = "clear" | "tinted";

export interface WalletPrefs {
  glass: GlassAppearance;
  faceId: boolean;
  expressTransit: boolean;
  notifyTxn: boolean;
  notifyOffers: boolean;
}

const PREFS_KEY = "wallet-prefs-v1";

const DEFAULT_PREFS: WalletPrefs = {
  glass: "clear",
  faceId: true,
  expressTransit: true,
  notifyTxn: true,
  notifyOffers: false,
};

function loadPrefs(): WalletPrefs {
  try {
    const s = JSON.parse(localStorage.getItem(PREFS_KEY) ?? "null");
    if (s && typeof s === "object") return { ...DEFAULT_PREFS, ...s };
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_PREFS };
}

interface WalletContextValue {
  prefs: WalletPrefs;
  setPrefs: (p: Partial<WalletPrefs>) => void;
  passes: Pass[];
  selectedId: string;
  selectPass: (id: string) => void;
  txns: Txn[];
  addTxn: (t: Omit<Txn, "id">) => void;
  payTo: string | null; // contact name pending confirmation
  setPayTo: (name: string | null) => void;
  toastMsg: string | null;
  showToast: (m: string) => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefsState] = useState<WalletPrefs>(DEFAULT_PREFS);
  const [selectedId, setSelectedId] = useState<string>(PASSES[0].id);
  const [extraTxns, setExtraTxns] = useState<Txn[]>([]);
  const [payTo, setPayTo] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    setPrefsState(loadPrefs());
  }, []);

  const setPrefs = useCallback((p: Partial<WalletPrefs>) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...p };
      try {
        localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const showToast = useCallback((m: string) => {
    setToastMsg(m);
    window.setTimeout(() => setToastMsg((cur) => (cur === m ? null : cur)), 2300);
  }, []);

  const txns = useMemo(() => [...extraTxns, ...TXNS], [extraTxns]);

  const value: WalletContextValue = {
    prefs,
    setPrefs,
    passes: PASSES,
    selectedId,
    selectPass: setSelectedId,
    txns,
    addTxn: (t) => setExtraTxns((list) => [{ ...t, id: "u" + Date.now() }, ...list]),
    payTo,
    setPayTo,
    toastMsg,
    showToast,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within <WalletProvider>");
  return ctx;
}

export { PASS_BY_ID };
