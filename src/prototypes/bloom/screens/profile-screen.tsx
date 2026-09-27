"use client";

/* profile-screen — identity header + stats, M3 segmented theme switch
   (wired to useDeviceTheme, persisted), notification switches and a
   reminder-time stepper (persisted prefs), About row → toast. */

import type { CSSProperties } from "react";
import { useDeviceTheme } from "../../../proto-kit";
import { useBloom } from "../state/bloom-context";
import { formatClock } from "../lib/data";
import { Switch } from "../components/switch";
import { BellIcon, ChevronRightIcon, DropIcon, InfoIcon, LeafIcon, MinusIcon, PlusIcon } from "../components/icons";

export function ProfileScreen() {
  const { theme, setTheme } = useDeviceTheme();
  const { plants, streak, totalWaterings, prefs, setPrefs, showToast } = useBloom();

  function stepReminder(dir: 1 | -1) {
    let mins = prefs.reminderHour * 60 + prefs.reminderMin + dir * 30;
    mins = ((mins % 1440) + 1440) % 1440;
    setPrefs({ reminderHour: Math.floor(mins / 60), reminderMin: mins % 60 });
  }

  return (
    <section className="bl-screen" aria-label="Profile">
      <div className="bl-content">
        <header className="bl-greet" style={{ ["--stagger" as string]: "0ms" } as CSSProperties}>
          <h1 className="bl-greet__title">Profile</h1>
        </header>

        {/* identity + stats */}
        <div className="bl-id" style={{ ["--stagger" as string]: "70ms" } as CSSProperties}>
          <span className="bl-id__avatar" aria-hidden="true">
            <LeafIcon size={26} />
          </span>
          <div className="bl-id__text">
            <span className="bl-id__name">Maya Rowe</span>
            <span className="bl-id__since">Growing since April 2024</span>
          </div>
        </div>

        <div className="bl-stats" style={{ ["--stagger" as string]: "130ms" } as CSSProperties}>
          <div className="bl-stat">
            <b className="tnum">{plants.length}</b>
            <span>Plants</span>
          </div>
          <div className="bl-stat">
            <b className="tnum">{streak}</b>
            <span>Day streak</span>
          </div>
          <div className="bl-stat">
            <b className="tnum">{totalWaterings}</b>
            <span>Waterings</span>
          </div>
        </div>

        {/* appearance */}
        <h2 className="bl-sechead" style={{ ["--stagger" as string]: "190ms" } as CSSProperties}>
          Appearance
        </h2>
        <div className="bl-card" style={{ ["--stagger" as string]: "220ms" } as CSSProperties}>
          <div className="bl-seg" role="group" aria-label="Theme">
            <button
              type="button"
              className={"bl-seg__opt" + (theme === "dark" ? " on" : "")}
              aria-pressed={theme === "dark"}
              onClick={() => setTheme("dark")}
            >
              Dark
            </button>
            <button
              type="button"
              className={"bl-seg__opt" + (theme === "light" ? " on" : "")}
              aria-pressed={theme === "light"}
              onClick={() => setTheme("light")}
            >
              Light
            </button>
          </div>
        </div>

        {/* reminders */}
        <h2 className="bl-sechead" style={{ ["--stagger" as string]: "270ms" } as CSSProperties}>
          Notifications
        </h2>
        <div className="bl-card bl-card--pad0" style={{ ["--stagger" as string]: "300ms" } as CSSProperties}>
          <div className="bl-row">
            <span className="bl-row__ic">
              <DropIcon size={18} />
            </span>
            <span className="bl-row__main">
              <span className="bl-row__t">Watering reminders</span>
              <span className="bl-row__s">Nudge me when a plant hits its day</span>
            </span>
            <Switch
              checked={prefs.notifyWater}
              onChange={(v) => setPrefs({ notifyWater: v })}
              label="Watering reminders"
            />
          </div>
          <div className="bl-row">
            <span className="bl-row__ic">
              <LeafIcon size={18} />
            </span>
            <span className="bl-row__main">
              <span className="bl-row__t">Repot & feeding tips</span>
              <span className="bl-row__s">Seasonal reminders for bigger tasks</span>
            </span>
            <Switch
              checked={prefs.notifyRepot}
              onChange={(v) => setPrefs({ notifyRepot: v })}
              label="Repot and feeding tips"
            />
          </div>
          <div className="bl-row">
            <span className="bl-row__ic">
              <BellIcon size={18} />
            </span>
            <span className="bl-row__main">
              <span className="bl-row__t">Reminder time</span>
              <span className="bl-row__s">Daily gentle prompt</span>
            </span>
            <div className="bl-stepper" role="group" aria-label="Reminder time">
              <button type="button" onClick={() => stepReminder(-1)} aria-label="Earlier by 30 minutes">
                <MinusIcon size={16} />
              </button>
              <output className="bl-stepper__val tnum" aria-live="polite">
                {formatClock(prefs.reminderHour, prefs.reminderMin)}
              </output>
              <button type="button" onClick={() => stepReminder(1)} aria-label="Later by 30 minutes">
                <PlusIcon size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* about */}
        <h2 className="bl-sechead" style={{ ["--stagger" as string]: "350ms" } as CSSProperties}>
          About
        </h2>
        <div className="bl-card bl-card--pad0" style={{ ["--stagger" as string]: "380ms" } as CSSProperties}>
          <button
            type="button"
            className="bl-row bl-row--btn"
            onClick={() => showToast("Bloom prototype · plant data is simulated", "leaf")}
          >
            <span className="bl-row__ic">
              <InfoIcon size={18} />
            </span>
            <span className="bl-row__main">
              <span className="bl-row__t">Bloom 1.0</span>
              <span className="bl-row__s">Material 3 Expressive · prototype build</span>
            </span>
            <span className="bl-row__trail">
              <ChevronRightIcon size={16} />
            </span>
          </button>
        </div>

        <p className="bl-foot" style={{ ["--stagger" as string]: "430ms" } as CSSProperties}>
          Bloom keeps everything on this device — no account, no cloud.
        </p>
      </div>
    </section>
  );
}
