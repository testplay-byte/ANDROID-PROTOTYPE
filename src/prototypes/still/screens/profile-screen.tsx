"use client";

/* still / screens / profile — stats (minutes / streak / sessions),
   the daily-reminder time stepper (extruded +/- discs around a carved
   readout, persisted), soundscape toggles (rain / bowl / noise —
   carved knob = off, extruded knob lit = on; visual only, persisted),
   a Dark/Light theme segmented control wired to useDeviceTheme
   (persisted as still-theme) and a quiet About row → toast. */

import type { CSSProperties } from "react";
import { useDeviceTheme } from "../../../proto-kit";
import { useStill } from "../state/still-context";
import type { StillPrefs } from "../state/still-context";
import {
  BellIcon,
  BowlIcon,
  InfoIcon,
  MinusIcon,
  PlusIcon,
  RainIcon,
  UserIcon,
  WavesIcon,
} from "../components/icons";

function fmt12(hour: number, min: number): string {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? "AM" : "PM";
  return `${h12}:${String(min).padStart(2, "0")} ${ampm}`;
}

export function ProfileScreen() {
  const { theme, setTheme } = useDeviceTheme();
  const {
    totalMinutes,
    streak,
    completeCount,
    prefs,
    setPrefs,
    showToast,
  } = useStill();

  function step(dir: 1 | -1) {
    let mins = prefs.reminderHour * 60 + prefs.reminderMin + dir * 30;
    mins = ((mins % 1440) + 1440) % 1440;
    setPrefs({ reminderHour: Math.floor(mins / 60), reminderMin: mins % 60 });
  }

  const sounds = [
    { key: "soundRain" as const, label: "Rain", icon: <RainIcon size={18} /> },
    { key: "soundBowl" as const, label: "Singing bowl", icon: <BowlIcon size={18} /> },
    { key: "soundNoise" as const, label: "Soft noise", icon: <WavesIcon size={18} /> },
  ];

  return (
    <section className="st-screen" aria-label="Profile">
      <div className="st-content">
        <header className="st-head st-head--small" style={({ ["--stagger" as string]: "0ms" } as CSSProperties)}>
          <span className="st-head__label">Profile</span>
        </header>

        {/* identity */}
        <div className="st-id" style={({ ["--stagger" as string]: "70ms" } as CSSProperties)}>
          <span className="st-id__avatar" aria-hidden="true">
            <UserIcon size={22} />
          </span>
          <div className="st-id__text">
            <b>Ada Lindqvist</b>
            <span>Practising since March</span>
          </div>
        </div>

        {/* stats — three small extruded pills */}
        <div className="st-stats" style={({ ["--stagger" as string]: "130ms" } as CSSProperties)}>
          <div className="st-stat">
            <b className="st-num">{totalMinutes}</b>
            <span>Minutes</span>
          </div>
          <div className="st-stat">
            <b className="st-num">{streak}</b>
            <span>Day streak</span>
          </div>
          <div className="st-stat">
            <b className="st-num">{completeCount}</b>
            <span>Sessions</span>
          </div>
        </div>

        {/* daily reminder */}
        <h2 className="st-sechead" style={({ ["--stagger" as string]: "190ms" } as CSSProperties)}>
          Daily reminder
        </h2>
        <div className="st-remind" style={({ ["--stagger" as string]: "230ms" } as CSSProperties)}>
          <div className="st-remind__row">
            <button
              type="button"
              className="st-nudge"
              onClick={() => step(-1)}
              aria-label="Earlier by 30 minutes"
            >
              <MinusIcon size={16} />
            </button>
            <span className="st-remind__time st-num">
              {fmt12(prefs.reminderHour, prefs.reminderMin)}
            </span>
            <button
              type="button"
              className="st-nudge"
              onClick={() => step(1)}
              aria-label="Later by 30 minutes"
            >
              <PlusIcon size={16} />
            </button>
          </div>
          <button
            type="button"
            className={`st-switchrow${prefs.notifyDaily ? " st-switchrow--on" : ""}`}
            onClick={() => {
              setPrefs({ notifyDaily: !prefs.notifyDaily });
              if (!prefs.notifyDaily) showToast("Reminder on", "bell");
            }}
            aria-pressed={prefs.notifyDaily}
          >
            <span className="st-switchrow__icon" aria-hidden="true">
              <BellIcon size={16} />
            </span>
            <span className="st-switchrow__label">
              {prefs.notifyDaily ? "Stillness check-in" : "Reminders paused"}
            </span>
            <span className="st-switchrow__knob" aria-hidden="true" />
          </button>
        </div>

        {/* soundscapes — visual only, stateful */}
        <h2 className="st-sechead" style={({ ["--stagger" as string]: "290ms" } as CSSProperties)}>
          Soundscape
        </h2>
        <div className="st-sounds" style={({ ["--stagger" as string]: "330ms" } as CSSProperties)}>
          {sounds.map((s) => {
            const on = prefs[s.key];
            return (
              <button
                key={s.key}
                type="button"
                className={`st-sound${on ? " st-sound--on" : ""}`}
                aria-pressed={on}
                onClick={() => setPrefs({ [s.key]: !on } as Partial<StillPrefs>)}
              >
                <span className="st-sound__icon" aria-hidden="true">
                  {s.icon}
                </span>
                <span>{s.label}</span>
                <span className="st-sound__dot" aria-hidden="true" />
              </button>
            );
          })}
        </div>
        <p className="st-note">Sound plays beside a session — never over it.</p>

        {/* theme */}
        <h2 className="st-sechead" style={({ ["--stagger" as string]: "390ms" } as CSSProperties)}>
          Appearance
        </h2>
        <div className="st-seg" style={({ ["--stagger" as string]: "430ms" } as CSSProperties)} role="group" aria-label="Theme">
          <button
            type="button"
            className={`st-seg__item${theme === "dark" ? " st-seg__item--on" : ""}`}
            aria-pressed={theme === "dark"}
            onClick={() => setTheme("dark")}
          >
            Dark
          </button>
          <button
            type="button"
            className={`st-seg__item${theme === "light" ? " st-seg__item--on" : ""}`}
            aria-pressed={theme === "light"}
            onClick={() => setTheme("light")}
          >
            Light
          </button>
        </div>

        {/* about */}
        <button
          type="button"
          className="st-about"
          style={({ ["--stagger" as string]: "490ms" } as CSSProperties)}
          onClick={() => showToast("Still — a breathing companion prototype", "info")}
        >
          <span className="st-switchrow__icon" aria-hidden="true">
            <InfoIcon size={15} />
          </span>
          <span className="st-switchrow__label">About Still</span>
          <span className="st-about__ver st-num">v1.0</span>
        </button>
      </div>
    </section>
  );
}
