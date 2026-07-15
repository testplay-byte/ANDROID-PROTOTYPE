/* =========================================================================
   _template / script.js
   Wires up: view navigation (data-goto), theme toggle, live clock, demo list.
   Copy into a new prototype and extend.
   ========================================================================= */

(function () {
  "use strict";

  /* ---- View navigation ------------------------------------------------- */
  // Any element with [data-goto="viewName"] switches the active view.
  function goTo(viewName) {
    const views = document.querySelectorAll(".view");
    let found = false;
    views.forEach((v) => {
      const isActive = v.dataset.view === viewName;
      v.classList.toggle("view--active", isActive);
      if (isActive) { v.scrollTop = 0; found = true; }
    });
    if (!found) return;

    // sync bottom nav active state
    document.querySelectorAll(".bottomnav__item").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.goto === viewName);
    });

    // hash for shareable state
    history.replaceState(null, "", "#" + viewName);
  }

  document.addEventListener("click", function (e) {
    const t = e.target.closest("[data-goto]");
    if (!t) return;
    e.preventDefault();
    goTo(t.dataset.goto);
  });

  // restore view from hash
  const initial = (location.hash || "#home").slice(1);
  goTo(document.querySelector('[data-view="' + initial + '"]') ? initial : "home");

  /* ---- Theme toggle ---------------------------------------------------- */
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem("proto-theme", theme); } catch (_) {}
  }
  try {
    const saved = localStorage.getItem("proto-theme");
    if (saved) setTheme(saved);
  } catch (_) {}

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      setTheme(next);
    });
  }

  /* ---- Live clock in status bar --------------------------------------- */
  const clock = document.getElementById("clock");
  function tick() {
    if (!clock) return;
    const d = new Date();
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "" : ""; // 24h keeps it simple; change if you want 12h
    h = h % 12 || 12;
    clock.textContent = h + ":" + m + ampm;
  }
  tick();
  setInterval(tick, 1000 * 30);

  /* ---- Demo: counting list -------------------------------------------- */
  const list = document.getElementById("demoList");
  if (list) {
    list.addEventListener("click", function (e) {
      const row = e.target.closest(".list__row");
      if (!row) return;
      const meta = row.querySelector(".list__meta");
      const n = parseInt(meta.textContent || "0", 10) + 1;
      meta.textContent = n;
      row.animate(
        [{ background: "color-mix(in srgb, var(--color-primary) 18%, transparent)" }, { background: "transparent" }],
        { duration: 400, easing: "ease-out" }
      );
    });
  }
})();
