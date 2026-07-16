/* =========================================================================
   search-page / script.js  —  v2 (redesigned)
   Material 3 Expressive search with feature-rich filter bottom sheet.
   - Full genre list (16 genres, multi-select)
   - Year, Season, Format, Status selects
   - Minimum score slider
   - Sort chips
   - Active filter chips display
   - Bottom sheet modal with Apply/Reset
   ========================================================================= */

(function () {
  "use strict";

  var device = document.getElementById("device");

  /* ---- Clock + battery ----------------------------------------------- */
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

  /* ---- Filter state --------------------------------------------------- */
  var GENRES = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mecha",
    "Music", "Mystery", "Psychological", "Romance", "Sci-Fi", "Slice of Life",
    "Sports", "Supernatural", "Thriller"];
  var SORT_LABELS = {
    "POPULARITY_DESC": "Popularity", "SCORE_DESC": "Score", "START_DATE_DESC": "Newest",
    "TITLE_ROMAJI": "Title A-Z", "FAVOURITES_DESC": "Favorites"
  };

  var state = {
    source: "anilist",
    query: "",
    genres: [],
    year: "",
    season: "",
    format: "",
    status: "",
    minScore: 0,
    sort: "POPULARITY_DESC"
  };

  function countActiveFilters() {
    var n = 0;
    if (state.genres.length) n += state.genres.length;
    if (state.year) n++;
    if (state.season) n++;
    if (state.format) n++;
    if (state.status) n++;
    if (state.minScore > 0) n++;
    return n;
  }

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
    if (filters.status) { params.push("status:$status"); vars.status = filters.status; }
    if (filters.minScore && filters.minScore > 0) { params.push("averageScore_greater:$minScore"); vars.minScore = filters.minScore; }
    if (filters.sort) params.push("sort:" + filters.sort);

    var varDecls = ["$page:Int", "$perPage:Int"];
    if (vars.search !== undefined) varDecls.push("$search:String");
    if (vars.genres !== undefined) varDecls.push("$genres:[String]");
    if (vars.year !== undefined) varDecls.push("$year:Int");
    if (vars.season !== undefined) varDecls.push("$season:MediaSeason");
    if (vars.format !== undefined) varDecls.push("$format:MediaFormat");
    if (vars.status !== undefined) varDecls.push("$status:MediaStatus");
    if (vars.minScore !== undefined) varDecls.push("$minScore:Int");

    var q = "query(" + varDecls.join(",") + "){Page(page:$page,perPage:$perPage){media(" + params.join(",") + "){id title{romaji english} coverImage{large extraLarge} averageScore episodes format season seasonYear genres status}}}";
    return gql(q, vars);
  }

  /* ---- Helpers -------------------------------------------------------- */
  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }
  function fmtScore(s) { return s ? (s / 10).toFixed(1) : "—"; }

  function animeCard(a) {
    var title = a.title.romaji || a.title.english || "Unknown";
    var cover = a.coverImage.large || a.coverImage.extraLarge;
    var score = a.averageScore ? '<span class="anime-card__score"><span class="star">★</span>' + fmtScore(a.averageScore) + '</span>' : '';
    var metaParts = [];
    if (a.format) metaParts.push(a.format);
    if (a.episodes) metaParts.push(a.episodes + " ep");
    else if (a.seasonYear) metaParts.push(a.seasonYear);
    var meta = metaParts.join(" · ");
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
    for (var i = 0; i < (count || 12); i++) {
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

  /* ---- Source toggle -------------------------------------------------- */
  document.getElementById("sourceToggle").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-source]");
    if (!btn) return;
    state.source = btn.dataset.source;
    this.querySelectorAll(".source-toggle__btn").forEach(function (b) {
      b.classList.toggle("is-active", b === btn);
    });
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

  /* ---- Build genre chips in the sheet -------------------------------- */
  var genreChips = document.getElementById("genreChips");
  GENRES.forEach(function (g) {
    var chip = el(
      '<button class="fchip" data-genre="' + g + '">' +
        '<svg class="fchip__check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
        '<span>' + g + '</span>' +
      '</button>'
    );
    genreChips.appendChild(chip);
    chip.addEventListener("click", function () {
      var idx = state.genres.indexOf(g);
      if (idx === -1) { state.genres.push(g); this.classList.add("is-active"); }
      else { state.genres.splice(idx, 1); this.classList.remove("is-active"); }
      updateFilterUI();
      doSearch();
    });
  });

  /* ---- Populate year dropdown ---------------------------------------- */
  var yearSelect = document.getElementById("filterYear");
  var yr = new Date().getFullYear();
  for (var y = yr; y >= 1990; y--) {
    yearSelect.appendChild(el('<option value="' + y + '">' + y + '</option>'));
  }

  /* ---- Filter selects ------------------------------------------------- */
  ["filterYear", "filterSeason", "filterFormat", "filterStatus"].forEach(function (id) {
    document.getElementById(id).addEventListener("change", function () {
      state.year = document.getElementById("filterYear").value;
      state.season = document.getElementById("filterSeason").value;
      state.format = document.getElementById("filterFormat").value;
      state.status = document.getElementById("filterStatus").value;
      updateFilterUI();
      doSearch();
    });
  });

  /* ---- Score slider --------------------------------------------------- */
  var scoreSlider = document.getElementById("filterScore");
  var scoreValue = document.getElementById("scoreValue");
  scoreSlider.addEventListener("input", function () {
    var v = parseInt(this.value);
    state.minScore = v;
    scoreValue.textContent = v > 0 ? (v / 10).toFixed(1) + "+" : "Any";
    updateFilterUI();
  });
  scoreSlider.addEventListener("change", doSearch);

  /* ---- Sort chips ----------------------------------------------------- */
  document.getElementById("sortChips").addEventListener("click", function (e) {
    var chip = e.target.closest("[data-sort]");
    if (!chip) return;
    state.sort = chip.dataset.sort;
    this.querySelectorAll(".fchip").forEach(function (c) { c.classList.toggle("is-active", c === chip); });
    document.getElementById("sortLabel").textContent = SORT_LABELS[state.sort];
    doSearch();
  });

  /* ---- Quick sort button (cycles through sorts) ---------------------- */
  document.getElementById("sortBtn").addEventListener("click", function () {
    openSheet();
  });

  /* ---- Per-group clear buttons --------------------------------------- */
  document.querySelectorAll("[data-clear]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var group = this.dataset.clear;
      if (group === "genres") {
        state.genres = [];
        document.querySelectorAll("#genreChips .fchip").forEach(function (c) { c.classList.remove("is-active"); });
      } else if (group === "release") {
        state.year = ""; state.season = "";
        document.getElementById("filterYear").value = "";
        document.getElementById("filterSeason").value = "";
      } else if (group === "type") {
        state.format = ""; state.status = "";
        document.getElementById("filterFormat").value = "";
        document.getElementById("filterStatus").value = "";
      } else if (group === "score") {
        state.minScore = 0;
        scoreSlider.value = 0;
        scoreValue.textContent = "Any";
      }
      updateFilterUI();
      doSearch();
    });
  });

  /* ---- Reset all ------------------------------------------------------ */
  document.getElementById("resetAllFilters").addEventListener("click", function () {
    state.genres = []; state.year = ""; state.season = ""; state.format = "";
    state.status = ""; state.minScore = 0; state.sort = "POPULARITY_DESC";
    document.querySelectorAll("#genreChips .fchip").forEach(function (c) { c.classList.remove("is-active"); });
    document.getElementById("filterYear").value = "";
    document.getElementById("filterSeason").value = "";
    document.getElementById("filterFormat").value = "";
    document.getElementById("filterStatus").value = "";
    scoreSlider.value = 0;
    scoreValue.textContent = "Any";
    document.querySelectorAll("#sortChips .fchip").forEach(function (c) { c.classList.toggle("is-active", c.dataset.sort === "POPULARITY_DESC"); });
    document.getElementById("sortLabel").textContent = "Popularity";
    updateFilterUI();
    doSearch();
  });

  /* ---- Apply button (closes sheet) ----------------------------------- */
  document.getElementById("applyFilters").addEventListener("click", closeSheet);

  /* ---- Bottom sheet open/close --------------------------------------- */
  var sheetScrim = document.getElementById("sheetScrim");
  var filterSheet = document.getElementById("filterSheet");

  function openSheet() {
    sheetScrim.classList.add("is-visible");
    filterSheet.classList.add("is-open");
  }
  function closeSheet() {
    sheetScrim.classList.remove("is-visible");
    filterSheet.classList.remove("is-open");
  }

  document.getElementById("filterBtn").addEventListener("click", openSheet);
  document.getElementById("sheetClose").addEventListener("click", closeSheet);
  sheetScrim.addEventListener("click", closeSheet);

  /* ---- Update filter UI (badge, active chips, group clears) ---------- */
  function updateFilterUI() {
    var count = countActiveFilters();
    var badge = document.getElementById("filterBadge");
    var filterBtn = document.getElementById("filterBtn");
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = "flex";
      filterBtn.classList.add("is-active");
    } else {
      badge.style.display = "none";
      filterBtn.classList.remove("is-active");
    }

    // Active filter chips
    var chips = document.getElementById("activeFilters");
    chips.innerHTML = "";
    state.genres.forEach(function (g) {
      chips.appendChild(makeActiveChip(g, function () {
        state.genres.splice(state.genres.indexOf(g), 1);
        document.querySelectorAll("#genreChips .fchip").forEach(function (c) {
          if (c.dataset.genre === g) c.classList.remove("is-active");
        });
        updateFilterUI(); doSearch();
      }));
    });
    if (state.year) chips.appendChild(makeActiveChip(state.year, function () {
      state.year = ""; document.getElementById("filterYear").value = ""; updateFilterUI(); doSearch();
    }));
    if (state.season) chips.appendChild(makeActiveChip(state.season.charAt(0) + state.season.slice(1).toLowerCase(), function () {
      state.season = ""; document.getElementById("filterSeason").value = ""; updateFilterUI(); doSearch();
    }));
    if (state.format) chips.appendChild(makeActiveChip(formatLabel(state.format), function () {
      state.format = ""; document.getElementById("filterFormat").value = ""; updateFilterUI(); doSearch();
    }));
    if (state.status) chips.appendChild(makeActiveChip(statusLabel(state.status), function () {
      state.status = ""; document.getElementById("filterStatus").value = ""; updateFilterUI(); doSearch();
    }));
    if (state.minScore > 0) chips.appendChild(makeActiveChip("★ " + (state.minScore / 10).toFixed(1) + "+", function () {
      state.minScore = 0; scoreSlider.value = 0; scoreValue.textContent = "Any"; updateFilterUI(); doSearch();
    }));
    chips.classList.toggle("has-chips", chips.children.length > 0);

    // Group clear button visibility
    setGroupClear("genres", state.genres.length > 0);
    setGroupClear("release", !!(state.year || state.season));
    setGroupClear("type", !!(state.format || state.status));
    setGroupClear("score", state.minScore > 0);

    // Sort label
    document.getElementById("sortLabel").textContent = SORT_LABELS[state.sort];
  }

  function setGroupClear(group, visible) {
    var btn = document.querySelector('[data-clear="' + group + '"]');
    if (btn) btn.classList.toggle("is-hidden", !visible);
  }

  function formatLabel(f) {
    var m = { TV: "TV", MOVIE: "Movie", OVA: "OVA", ONA: "ONA", SPECIAL: "Special", MUSIC: "Music" };
    return m[f] || f;
  }
  function statusLabel(s) {
    var m = { RELEASING: "Airing", FINISHED: "Finished", NOT_YET_RELEASED: "Upcoming", CANCELLED: "Cancelled" };
    return m[s] || s;
  }

  function makeActiveChip(label, onRemove) {
    var chip = el(
      '<button class="active-filter-chip">' +
        '<span>' + label + '</span>' +
        '<span class="active-filter-chip__x"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>' +
      '</button>'
    );
    chip.addEventListener("click", onRemove);
    return chip;
  }

  /* ---- Search execution ---------------------------------------------- */
  function doSearch() {
    var grid = document.getElementById("resultsGrid");
    var label = document.getElementById("resultsLabel");
    var count = document.getElementById("resultsCount");

    var hasQuery = !!state.query;
    var hasFilters = countActiveFilters() > 0;

    if (hasQuery) {
      label.textContent = 'Results for "' + state.query + '"';
    } else if (hasFilters) {
      label.textContent = "Filtered results";
    } else {
      label.textContent = "Popular anime";
    }
    if (state.source === "extension") {
      label.textContent = label.textContent + " · Extension";
    }

    showSkeletons(12);

    fetchMedia(state.query, {
      genres: state.genres,
      year: state.year,
      season: state.season,
      format: state.format,
      status: state.status,
      minScore: state.minScore,
      sort: state.sort
    }).then(function (d) {
      var media = (d.data && d.data.Page && d.data.Page.media) || [];
      count.textContent = media.length ? media.length + " found" : "";

      if (!media.length) {
        showEmpty("No results found", "Try different keywords or adjust your filters.");
        return;
      }

      grid.innerHTML = "";
      media.forEach(function (a) { grid.appendChild(animeCard(a)); });
    }).catch(function () {
      showEmpty("Search error", "Could not fetch results. Check your connection.");
    });
  }

  // Initial load
  updateFilterUI();
  doSearch();

  /* ---- Bottom nav (visual feedback only — single screen prototype) --- */
  document.querySelectorAll(".bottomnav__item").forEach(function (item) {
    item.addEventListener("click", function () {
      if (this.dataset.nav === "search") return;
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
    var dragViews = Array.prototype.slice.call(device.querySelectorAll(".view, .content, .filter-sheet__body"));
    var dragTargets = [device.querySelector(".screen")].concat(dragViews).filter(Boolean);
    dragTargets.forEach(function (el) {
      var dragging = false, sx = 0, sy = 0, sl = 0, st = 0, moved = false;
      el.addEventListener("mousedown", function (e) {
        if (e.target.closest("button, a, input, select, .fchip, .source-toggle__btn, .bottomnav__item, .filter-sheet")) return;
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

  /* ---- Fullscreen API (mobile) --------------------------------------- */
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
