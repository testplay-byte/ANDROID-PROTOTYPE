/* =========================================================================
   _template / script.js  —  v3
   View routing, theme toggle, clock, portrait battery, likes, toggles,
   follow button, search filter, screen-info panel sync.
   ========================================================================= */

(function () {
  "use strict";

  /* ---- Screen metadata (for right-panel info) ------------------------- */
  var SCREEN_INFO = {
    home:     { name: "Home",     desc: "Scrollable feed with interactive cards, like buttons, and story avatars." },
    search:   { name: "Search",   desc: "Search bar, recent queries, trending chips, and category list." },
    profile:  { name: "Profile",  desc: "User profile with stats, follow button, tabs, and a media grid." },
    settings: { name: "Settings", desc: "Toggle switches, grouped setting rows, and destructive actions." }
  };

  /* ---- View navigation ------------------------------------------------- */
  function goTo(viewName) {
    var views = document.querySelectorAll(".view");
    var found = false;
    views.forEach(function (v) {
      var isActive = v.dataset.view === viewName;
      v.classList.toggle("view--active", isActive);
      if (isActive) { v.scrollTop = 0; found = true; }
    });
    if (!found) return;

    document.querySelectorAll(".bottomnav__item").forEach(function (b) {
      b.classList.toggle("is-active", b.dataset.goto === viewName);
    });
    document.querySelectorAll(".screentlist__item").forEach(function (b) {
      b.classList.toggle("is-active", b.dataset.goto === viewName);
    });

    // update right-panel screen info
    var info = SCREEN_INFO[viewName];
    if (info) {
      var n = document.getElementById("screenInfoName");
      var d = document.getElementById("screenInfoDesc");
      if (n) n.textContent = info.name;
      if (d) d.textContent = info.desc;
    }

    history.replaceState(null, "", "#" + viewName);
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-goto]");
    if (!t) return;
    e.preventDefault();
    goTo(t.dataset.goto);
  });

  var initial = (location.hash || "#home").slice(1);
  goTo(document.querySelector('[data-view="' + initial + '"]') ? initial : "home");

  /* ---- Theme toggle (scoped to .device, NOT <html>) -------------------- */
  /* The app's dark mode toggle changes ONLY the device's theme, never the
     whole page. data-theme is set on the .device element, and CSS variables
     inside .device cascade to its children. The page (stage, side panels)
     stays in its own fixed theme. See docs/theme-architecture.md. */
  var themeToggle = document.getElementById("themeToggle");
  var device = document.getElementById("device");

  function setTheme(theme) {
    if (!device) return;
    device.setAttribute("data-theme", theme);
    try { localStorage.setItem("proto-app-theme", theme); } catch (_) {}
  }
  try { var saved = localStorage.getItem("proto-app-theme"); if (saved) setTheme(saved); } catch (_) {}

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = device ? device.getAttribute("data-theme") : "light";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* ---- Live clock ------------------------------------------------------ */
  var clock = document.getElementById("clock");
  function tick() {
    if (!clock) return;
    var d = new Date();
    var h = d.getHours() % 12 || 12;
    var m = d.getMinutes().toString().padStart(2, "0");
    clock.textContent = h + ":" + m;
  }
  tick();
  setInterval(tick, 1000 * 30);

  /* ---- Portrait battery fill ------------------------------------------ */
  // Portrait battery viewBox 8x16. Inner body: y=3..14 (height 11).
  // Fill grows from bottom (y=14) upward.
  (function () {
    var pctEl = document.getElementById("battPct");
    var fillEl = document.getElementById("battFill");
    if (!pctEl || !fillEl) return;
    var pct = Math.max(0, Math.min(100, parseInt(pctEl.textContent, 10) || 87));
    pctEl.textContent = pct;
    var innerTop = 3, innerBottom = 14, innerH = innerBottom - innerTop; // 11
    var fh = Math.round((pct / 100) * innerH);
    var fy = innerBottom - fh;
    fillEl.setAttribute("y", String(fy));
    fillEl.setAttribute("height", String(fh));
    if (pct <= 15) fillEl.style.fill = "var(--color-danger)";
  })();

  /* ---- Like buttons (toggle) ------------------------------------------ */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-like]");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    var liked = btn.classList.toggle("is-liked");
    var countEl = btn.querySelector(".post__count");
    if (countEl) {
      var n = parseInt(countEl.textContent, 10) || 0;
      countEl.textContent = liked ? n + 1 : n - 1;
    }
    btn.animate(
      [{ transform: "scale(1.25)" }, { transform: "scale(1)" }],
      { duration: 300, easing: "cubic-bezier(.2,.7,.2,1)" }
    );
  });

  /* ---- Toggle switches ------------------------------------------------- */
  document.addEventListener("click", function (e) {
    var tog = e.target.closest("[data-toggle]");
    if (!tog) return;
    e.preventDefault();
    tog.classList.toggle("is-on");
  });

  /* ---- Follow button --------------------------------------------------- */
  var followBtn = document.getElementById("followBtn");
  if (followBtn) {
    followBtn.addEventListener("click", function () {
      var following = followBtn.classList.toggle("is-following");
      followBtn.textContent = following ? "Following" : "Follow";
    });
  }

  /* ---- Tabs ------------------------------------------------------------ */
  document.addEventListener("click", function (e) {
    var tab = e.target.closest(".tab");
    if (!tab) return;
    var parent = tab.parentElement;
    parent.querySelectorAll(".tab").forEach(function (t) { t.classList.remove("is-active"); });
    tab.classList.add("is-active");
  });

  /* ---- Search filter --------------------------------------------------- */
  var searchInput = document.getElementById("searchInput");
  var recentList = document.getElementById("recentList");
  if (searchInput && recentList) {
    searchInput.addEventListener("input", function () {
      var q = searchInput.value.toLowerCase().trim();
      recentList.querySelectorAll("li").forEach(function (li) {
        var text = li.querySelector("span:nth-child(2)").textContent.toLowerCase();
        li.style.display = !q || text.indexOf(q) !== -1 ? "" : "none";
      });
    });
  }

  /* ---- Chip click feedback -------------------------------------------- */
  document.querySelectorAll(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      chip.animate(
        [{ transform: "scale(.95)" }, { transform: "scale(1)" }],
        { duration: 200, easing: "ease-out" }
      );
    });
  });

  /* ---- Prevent drag-to-select on the entire document ------------------ */
  // Extra safety: cancel native selection-drag globally.
  document.addEventListener("selectstart", function (e) {
    // Allow selection only inside inputs (so the search field works).
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    e.preventDefault();
  });
  document.addEventListener("dragstart", function (e) { e.preventDefault(); });

  /* ---- Mobile fullscreen toggle --------------------------------------- */
  // On mobile, the device fills the screen by default (native app feel).
  // The floating button toggles between fullscreen and framed view.
  // `device` is already defined above (theme toggle section).
  var fsToggle = document.getElementById("fsToggle");
  var fsExpand = document.getElementById("fsIconExpand");
  var fsShrink = document.getElementById("fsIconShrink");

  if (fsToggle && device) {
    var isFramed = false;
    fsToggle.addEventListener("click", function () {
      isFramed = !isFramed;
      device.classList.toggle("device--framed", isFramed);
      fsExpand.style.display = isFramed ? "none" : "block";
      fsShrink.style.display = isFramed ? "block" : "none";
    });
  }
})();
