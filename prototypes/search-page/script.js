/* =========================================================================
   search-page / script.js
   Material 3 Expressive search screen.
   - AniList GraphQL integration
   - Source toggle (AniList / Extension — Extension is visual-only, same data)
   - Filter chips (quick genres) + expandable filter panel
   - Debounced search with default results when no query
   - Material 3 bottom nav with active-pill indicator
   ========================================================================= */

(function () {
  "use strict";

  var device = document.getElementById("device");

  /* ---- Clock + battery (from template) -------------------------------- */
  var clock = document.getElementById("clock");
  function tick() { if (!clock) return; var d = new Date(); var h = d.getHours() % 12 || 12; var m = d.getMinutes().toString().padStart(2, "0"); clock.textContent = h + ":" + m; }
  tick(); setInterval(tick, 30000);

  (function () {
    var pctEl = document.getElementById("battPct"), fillEl = document.getElementById("battFill");
    if (!pctEl || !fillEl) return;
    var pct = Math.max(0, Math.min(100, parseInt(pctEl.textContent, 10) || 87));
    pctEl.textContent = pct;
    var fh = Math.round((pct / 100) * 11);
    fillEl.setAttribute("y", String(14 - fh));
    fillEl.setAttribute("height", String(fh));
  })();

  /* ---- State ----------------------------------------------------------- */
  var state = {
    source: "anilist",       // "anilist" or "extension"
    query: "",
    genres: [],              // active genre filters (from chips)
    year: "",
    season: "",
    format: "",
    sort: "POPULARITY_DESC"
  };

  /* ---- AniList API ---------------------------------------------------- */
  var API = "https://graphql.anilist.co";
  var cache = {};

  function gql(query, variables) {
    var key = query + JSON.stringify(variables || {});
    if (cache[key]) return Promise.resolve(cache[key]);
    return fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ query: query, variables: variables || {} })
    }).then(function (r) { return r.json(); }).then(function (d) {
      cache[key] = d; return d;
    });
  }

  function fetchMedia(query, filters) {
    var vars = { page: 1, perPage: 30 };
    var params = ["type:ANIME"];
    if (query) { params.push("search:$search"); vars.search = query; }
    if (filters.genres && filters.genres.length) { params.push("genre_in:$genres"); vars.genres = filters.genres; }
    if (filters.year) { params.push("seasonYear:$year"); vars.year = parseInt(filters.year); }
    if (filters.season) { params.push("season:$season"); vars.season = filters.season; }
    if (filters.format) { params.push("format:$format"); vars.format = filters.format; }
    if (filters.sort) params.push("sort:" + filters.sort);

    var varDecls = ["$page:Int", "$perPage:Int"];
    if (vars.search !== undefined) varDecls.push("$search:String");
    if (vars.genres !== undefined) varDecls.push("$genres:[String]");
    if (vars.year !== undefined) varDecls.push("$year:Int");
    if (vars.season !== undefined) varDecls.push("$season:MediaSeason");
    if (vars.format !== undefined) varDecls.push("$format:MediaFormat");

    var q = "query(" + varDecls.join(",") + "){Page(page:$page,perPage:$perPage){media(" + params.join(",") + "){id title{romaji english} coverImage{large extraLarge} averageScore episodes format season seasonYear genres}}}";
    return gql(q, vars);
  }

  /* ---- Helpers -------------------------------------------------------- */
  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }
  function fmtScore(s) { return s ? (s / 10).toFixed(1) : "—"; }

  function animeCard(a) {
    var title = a.title.romaji || a.title.english || "Unknown";
    var cover = a.coverImage.large || a.coverImage.extraLarge;
    var score = a.averageScore ? '<span class="anime-card__score">★ ' + fmtScore(a.averageScore) + '</span>' : '';
    var meta = (a.format || "TV") + (a.episodes ? ' · ' + a.episodes + ' ep' : (a.seasonYear ? ' · ' + a.seasonYear : ''));
    return el(
      '<div class="anime-card">' +
        '<div class="anime-card__cover">' +
          '<img src="' + cover + '" alt="' + title + '" loading="lazy"/>' +
          score +
        '</div>' +
        '<h3 class="anime-card__title">' + title + '</h3>' +
        '<span class="anime-card__meta">' + meta + '</span>' +
      '</div>'
    );
  }

  function showSkeletons(count) {
    var grid = document.getElementById("resultsGrid");
    grid.innerHTML = "";
    for (var i = 0; i < (count || 9); i++) {
      grid.appendChild(el('<div class="skeleton" style="aspect-ratio:2/3"></div>'));
    }
  }

  function showEmpty(title, desc) {
    var grid = document.getElementById("resultsGrid");
    grid.innerHTML = '';
    grid.appendChild(el(
      '<div class="empty-state" style="grid-column:1/-1">' +
        '<div class="empty-state__icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></div>' +
        '<h3 class="empty-state__title">' + title + '</h3>' +
        '<p class="empty-state__desc">' + desc + '</p>' +
      '</div>'
    ));
  }

  /* ---- Source toggle (AniList / Extension) ---------------------------- */
  document.getElementById("sourceToggle").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-source]");
    if (!btn) return;
    var src = btn.dataset.source;
    state.source = src;
    this.querySelectorAll(".source-toggle__btn").forEach(function (b) {
      b.classList.toggle("is-active", b === btn);
    });
    // Re-run the current search with the new source.
    // Extension is visual-only — it fetches the same AniList data.
    doSearch();
  });

  /* ---- Search input (debounced) --------------------------------------- */
  var searchTimer = null;
  var searchInput = document.getElementById("searchInput");
  var searchClear = document.getElementById("searchClear");

  searchInput.addEventListener("input", function () {
    state.query = this.value.trim();
    searchClear.style.display = state.query ? "flex" : "none";
    clearTimeout(searchTimer);
    searchTimer = setTimeout(doSearch, 450);
  });

  searchClear.addEventListener("click", function () {
    searchInput.value = "";
    state.query = "";
    searchClear.style.display = "none";
    searchInput.focus();
    doSearch();
  });

  /* ---- Filter chips (quick genre filters) ----------------------------- */
  document.querySelectorAll(".filter-chip[data-genre]").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var genre = this.dataset.genre;
      var idx = state.genres.indexOf(genre);
      if (idx === -1) { state.genres.push(genre); this.classList.add("is-active"); }
      else { state.genres.splice(idx, 1); this.classList.remove("is-active"); }
      doSearch();
    });
  });

  /* ---- Expandable filter panel ---------------------------------------- */
  var filterPanel = document.getElementById("filterPanel");
  var filterToggleChip = document.getElementById("filterToggleChip");

  filterToggleChip.addEventListener("click", function () {
    var isOpen = filterPanel.classList.toggle("is-open");
    filterToggleChip.classList.toggle("is-active", isOpen);
  });

  // Populate year dropdown
  var yearSelect = document.getElementById("filterYear");
  var yr = new Date().getFullYear();
  for (var y = yr; y >= 1990; y--) {
    yearSelect.appendChild(el('<option value="' + y + '">' + y + '</option>'));
  }

  ["filterYear", "filterSeason", "filterFormat", "filterSort"].forEach(function (id) {
    document.getElementById(id).addEventListener("change", function () {
      state.year = document.getElementById("filterYear").value;
      state.season = document.getElementById("filterSeason").value;
      state.format = document.getElementById("filterFormat").value;
      state.sort = document.getElementById("filterSort").value || "POPULARITY_DESC";
      doSearch();
    });
  });

  document.getElementById("resetFilters").addEventListener("click", function () {
    state.genres = [];
    state.year = ""; state.season = ""; state.format = "";
    state.sort = "POPULARITY_DESC";
    document.querySelectorAll(".filter-chip[data-genre]").forEach(function (c) { c.classList.remove("is-active"); });
    document.getElementById("filterYear").value = "";
    document.getElementById("filterSeason").value = "";
    document.getElementById("filterFormat").value = "";
    document.getElementById("filterSort").value = "POPULARITY_DESC";
    doSearch();
  });

  /* ---- Search execution ----------------------------------------------- */
  function doSearch() {
    var grid = document.getElementById("resultsGrid");
    var label = document.getElementById("resultsLabel");
    var count = document.getElementById("resultsCount");

    var hasQuery = !!state.query;
    var hasFilters = state.genres.length > 0 || state.year || state.season || state.format;

    // Update label
    if (hasQuery) {
      label.textContent = 'Results for "' + state.query + '"';
    } else if (hasFilters) {
      label.textContent = "Filtered results";
    } else {
      label.textContent = "Popular anime";
    }

    // Source label note (Extension is visual-only)
    if (state.source === "extension") {
      label.textContent = label.textContent + " · Extension";
    }

    showSkeletons(12);

    fetchMedia(state.query, {
      genres: state.genres,
      year: state.year,
      season: state.season,
      format: state.format,
      sort: state.sort
    }).then(function (d) {
      var media = (d.data && d.data.Page && d.data.Page.media) || [];
      count.textContent = media.length ? media.length + " found" : "";

      if (!media.length) {
        showEmpty("No results", "Try different keywords or adjust your filters.");
        return;
      }

      grid.innerHTML = "";
      media.forEach(function (a) { grid.appendChild(animeCard(a)); });
    }).catch(function () {
      showEmpty("Search error", "Could not fetch results. Check your connection.");
    });
  }

  // Initial load — show popular anime by default (no query, no filters)
  doSearch();

  /* ---- Bottom navigation ---------------------------------------------- */
  // The search item is active by default. Other items are non-functional
  // (this is a single-screen prototype) but show visual feedback on tap.
  document.querySelectorAll(".bottomnav__item").forEach(function (item) {
    item.addEventListener("click", function () {
      var nav = this.dataset.nav;
      if (nav === "search") return; // already on search
      // Brief visual feedback (ripple-like) without navigating
      this.animate(
        [{ transform: "scale(.92)" }, { transform: "scale(1)" }],
        { duration: 200, easing: "cubic-bezier(.2,.7,.2,1)" }
      );
    });
  });

  /* ---- Click-drag-to-scroll (desktop) --------------------------------- */
  (function () {
    var finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer || !device) return;
    var dragViews = Array.prototype.slice.call(device.querySelectorAll(".view, .content"));
    dragTargets = [device.querySelector(".screen")].concat(dragViews).filter(Boolean);
    dragTargets.forEach(function (el) {
      var dragging = false, sx = 0, sy = 0, sl = 0, st = 0, moved = false;
      el.addEventListener("mousedown", function (e) {
        if (e.target.closest("button, a, input, select, .filter-chip, .source-toggle__btn, .bottomnav__item")) return;
        if (e.button !== 0) return;
        dragging = true; moved = false; sx = e.clientX; sy = e.clientY; sl = el.scrollLeft; st = el.scrollTop;
        el.style.cursor = "grabbing"; e.preventDefault();
      });
      window.addEventListener("mousemove", function (e) {
        if (!dragging) return;
        var dx = e.clientX - sx, dy = e.clientY - sy;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
        el.scrollLeft = sl - dx; el.scrollTop = st - dy;
      });
      window.addEventListener("mouseup", function () { if (!dragging) return; dragging = false; el.style.cursor = ""; });
      el.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    });
  })();

  /* ---- Fullscreen API (mobile) ---------------------------------------- */
  (function () {
    var fsToggle = document.getElementById("fsToggle");
    var fsExpand = document.getElementById("fsIconExpand");
    var fsShrink = document.getElementById("fsIconShrink");
    if (!fsToggle || !device) return;
    function isFs() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
    function sync() { var fs = isFs(); if (fsExpand) fsExpand.style.display = fs ? "none" : "block"; if (fsShrink) fsShrink.style.display = fs ? "block" : "none"; }
    fsToggle.addEventListener("click", function () {
      if (isFs()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); }
      else { var req = device.requestFullscreen || device.webkitRequestFullscreen; if (req) req.call(device); }
    });
    ["fullscreenchange", "webkitfullscreenchange"].forEach(function (ev) { document.addEventListener(ev, sync); });
    sync();
  })();

})();
