/* =========================================================================
   anime-app / script.js
   AniList GraphQL integration, 7-screen routing, settings persistence,
   library/history (localStorage), search w/ filters, video player controls.
   Built on the template v6 architecture (scoped theming, drag-scroll, fullscreen).
   ========================================================================= */

(function () {
  "use strict";

  /* ---- Screen metadata (for right panel) ------------------------------ */
  var SCREEN_INFO = {
    home:     { name: "Home",     desc: "Trending anime, continue watching, and seasonal picks." },
    library:  { name: "Library",  desc: "Your saved anime, organized by status. Grid or list view." },
    history:  { name: "History",  desc: "Recently watched episodes with resume progress." },
    search:   { name: "Search",   desc: "Search AniList with genre, year, season, format, and sort filters." },
    settings: { name: "Settings", desc: "Theme, accent, player, library, and data preferences. All applied." },
    detail:   { name: "Detail",   desc: "Anime detail with cover, synopsis, genres, and episode list." },
    player:   { name: "Player",   desc: "Video player (mock) with controls and episode list." }
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

  function fetchHomeData() {
    var trendingQ = "{Page(page:1,perPage:5){media(type:ANIME,sort:TRENDING_DESC){id title{romaji english} coverImage{extraLarge large} bannerImage averageScore episodes status format season seasonYear genres description}}}";
    var seasonalQ = "{Page(page:1,perPage:12){media(type:ANIME,season:WINTER,seasonYear:2025,sort:POPULARITY_DESC){id title{romaji english} coverImage{large} averageScore episodes format}}}";
    var topRatedQ = "{Page(page:1,perPage:9){media(type:ANIME,sort:SCORE_DESC){id title{romaji english} coverImage{large} averageScore episodes format}}}";
    return Promise.all([
      gql(trendingQ), gql(seasonalQ), gql(topRatedQ)
    ]).then(function (results) {
      return {
        data: {
          trending: results[0].data.Page,
          seasonal: results[1].data.Page,
          topRated: results[2].data.Page
        }
      };
    });
  }

  function fetchSearch(query, filters) {
    var vars = { page: 1, perPage: 24 };
    var params = ["type:ANIME"];
    if (query) { params.push("search:$search"); vars.search = query; }
    if (filters.genre) { params.push("genre:$genre"); vars.genre = filters.genre; }
    if (filters.year) { params.push("seasonYear:$year"); vars.year = parseInt(filters.year); }
    if (filters.season) { params.push("season:$season"); vars.season = filters.season; }
    if (filters.format) { params.push("format:$format"); vars.format = filters.format; }
    if (filters.sort) params.push("sort:" + filters.sort);
    var varDecls = [];
    if (vars.search !== undefined) varDecls.push("$search:String");
    varDecls.push("$page:Int", "$perPage:Int");
    if (vars.genre !== undefined) varDecls.push("$genre:String");
    if (vars.year !== undefined) varDecls.push("$year:Int");
    if (vars.season !== undefined) varDecls.push("$season:MediaSeason");
    if (vars.format !== undefined) varDecls.push("$format:MediaFormat");
    var q = "query(" + varDecls.join(",") + "){Page(page:$page,perPage:$perPage){media(" + params.join(",") + "){id title{romaji english} coverImage{large} averageScore episodes format season seasonYear genres}}}";
    return gql(q, vars);
  }

  function fetchDetail(id) {
    var q = "query($id:Int){Media(id:$id,type:ANIME){id title{romaji english native} coverImage{extraLarge large} bannerImage averageScore episodes status format season seasonYear duration genres description studios{nodes{name}} nextAiringEpisode{airingAt episode}}}";
    return gql(q, { id: id });
  }

  /* ---- State (localStorage) ------------------------------------------- */
  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  var settings = LS.get("anime-settings", {
    theme: "dark", accent: "pink", autoplay: true, skipIntro: true,
    quality: "1080p", libLayout: "grid", libSort: "title",
    trackHistory: true, continueWatching: true
  });
  var library = LS.get("anime-library", []);
  var history = LS.get("anime-history", []);

  function saveSettings() { LS.set("anime-settings", settings); }
  function saveLibrary() { LS.set("anime-library", library); }
  function saveHistory() { LS.set("anime-history", history); }

  /* ---- View navigation (with back stack) ------------------------------ */
  var viewStack = ["home"];
  var device = document.getElementById("device");

  function goTo(viewName, opts) {
    opts = opts || {};
    if (viewName === "back") {
      viewStack.pop();
      viewName = viewStack[viewStack.length - 1] || "home";
    } else {
      // pushed views (detail, player) add to stack; main views reset stack
      var mainViews = ["home", "library", "history", "search", "settings"];
      if (mainViews.indexOf(viewName) !== -1) {
        viewStack = [viewName];
      } else {
        if (viewStack[viewStack.length - 1] !== viewName) viewStack.push(viewName);
      }
    }

    document.querySelectorAll(".view").forEach(function (v) {
      var active = v.dataset.view === viewName;
      v.classList.toggle("view--active", active);
      if (active) v.scrollTop = 0;
    });

    document.querySelectorAll(".bottomnav__item").forEach(function (b) {
      b.classList.toggle("is-active", b.dataset.goto === viewName);
    });
    document.querySelectorAll(".screentlist__item").forEach(function (b) {
      b.classList.toggle("is-active", b.dataset.goto === viewName);
    });

    var info = SCREEN_INFO[viewName];
    if (info) {
      var n = document.getElementById("screenInfoName");
      var d = document.getElementById("screenInfoDesc");
      if (n) n.textContent = info.name;
      if (d) d.textContent = info.desc;
    }

    if (opts.data) currentAnimeData = opts.data;
    if (viewName === "detail" && opts.id) renderDetail(opts.id, opts.data);
    if (viewName === "player" && opts.id) renderPlayer(opts.id, opts.episode || 1);

    // show/hide bottom nav for pushed views
    var bottomNav = document.querySelector(".bottomnav");
    if (bottomNav) bottomNav.style.display = (viewName === "detail" || viewName === "player") ? "none" : "flex";

    history.replaceState(null, "", "#" + viewName);
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-goto]");
    if (!t) return;
    e.preventDefault();
    var target = t.dataset.goto;
    if (target === "detail") {
      var card = t.closest("[data-anime-id]");
      if (card) goTo("detail", { id: card.dataset.animeId, data: card._animeData });
    } else {
      goTo(target);
    }
  });

  // Anime card click → detail page (cards don't have data-goto, they have data-anime-id)
  document.addEventListener("click", function (e) {
    var card = e.target.closest("[data-anime-id]");
    if (!card) return;
    if (e.target.closest("[data-goto]")) return; // already handled above
    if (e.target.closest(".episode-row")) return; // episodes handled separately
    e.preventDefault();
    e.stopPropagation();
    goTo("detail", { id: card.dataset.animeId, data: card._animeData });
  });

  /* ---- Theme + accent (scoped to .device) ----------------------------- */
  function applySettings() {
    device.setAttribute("data-theme", settings.theme);
    device.setAttribute("data-accent", settings.accent);
  }
  applySettings();

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

  /* ---- Helpers -------------------------------------------------------- */
  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }
  function stripTags(s) { return s ? s.replace(/<[^>]*>/g, "") : ""; }
  function truncate(s, n) { s = stripTags(s || ""); return s.length > n ? s.slice(0, n) + "…" : s; }
  function fmtScore(s) { return s ? (s / 10).toFixed(1) : "—"; }

  function animeCard(a) {
    var title = a.title.romaji || a.title.english || "Unknown";
    var cover = a.coverImage.large || a.coverImage.extraLarge;
    var c = el('<div class="anime-card" data-anime-id="' + a.id + '"><div class="anime-card__cover"><img src="' + cover + '" alt="' + title + '" loading="lazy"/>' + (a.averageScore ? '<span class="anime-card__score">★ ' + fmtScore(a.averageScore) + '</span>' : '') + '</div><h3 class="anime-card__title">' + title + '</h3><span class="anime-card__meta">' + (a.format || "TV") + (a.episodes ? ' · ' + a.episodes + ' ep' : "") + '</span></div>');
    c._animeData = a;
    return c;
  }

  function animeRow(a) {
    var title = a.title.romaji || a.title.english || "Unknown";
    var cover = a.coverImage.large || "";
    return el('<div class="anime-row" data-anime-id="' + a.id + '"><div class="anime-row__cover"><img src="' + cover + '" alt="' + title + '" loading="lazy"/></div><div class="anime-row__info"><h3 class="anime-row__title">' + title + '</h3><span class="anime-row__meta">' + (a.format || "TV") + (a.episodes ? ' · ' + a.episodes + ' ep' : "") + '</span></div><span class="anime-row__score">★ ' + fmtScore(a.averageScore) + '</span></div>');
  }

  /* ---- HOME ----------------------------------------------------------- */
  var heroIndex = 0, heroTimer = null, heroData = [];

  function renderHome(data) {
    // Hero carousel
    heroData = (data.data && data.data.trending && data.data.trending.media) || [];
    var slides = document.getElementById("heroSlides");
    var dots = document.getElementById("heroDots");
    if (!slides || !heroData.length) return;
    slides.innerHTML = heroData.map(function (a) {
      var title = a.title.romaji || a.title.english || "";
      var img = a.bannerImage || a.coverImage.extraLarge;
      return '<div class="hero__slide" data-anime-id="' + a.id + '"><img src="' + img + '" alt="' + title + '" loading="lazy"/><div class="hero__overlay"><h3 class="hero__title">' + title + '</h3><div class="hero__meta"><span class="hero__score">★ ' + fmtScore(a.averageScore) + '</span><span>' + (a.format || "TV") + '</span>' + (a.episodes ? '<span>' + a.episodes + ' ep</span>' : "") + '</div><button class="hero__btn" data-anime-id="' + a.id + '">▶ Watch Now</button></div></div>';
    }).join("");
    dots.innerHTML = heroData.map(function (_, i) { return '<span class="hero__dot' + (i === 0 ? " is-active" : "") + '" data-idx="' + i + '"></span>'; }).join("");
    heroIndex = 0;
    slides.style.transform = "translateX(0%)";
    // attach click handlers to hero slides
    slides.querySelectorAll(".hero__slide").forEach(function (s) { s._animeData = heroData.find(function (a) { return String(a.id) === s.dataset.animeId; }); });
    slides.querySelectorAll(".hero__btn").forEach(function (b) { b._animeData = heroData.find(function (a) { return String(a.id) === b.dataset.animeId; }); });
    startHeroAuto();

    // Trending grid
    var tg = document.getElementById("trendingGrid");
    if (tg && data.data.trending) {
      tg.innerHTML = "";
      data.data.trending.media.forEach(function (a) { tg.appendChild(animeCard(a)); });
    }

    // Season grid
    var sg = document.getElementById("seasonGrid");
    if (sg && data.data.seasonal) {
      sg.innerHTML = "";
      data.data.seasonal.media.forEach(function (a) { sg.appendChild(animeCard(a)); });
    }

    // Top rated grid
    var rg = document.getElementById("topRatedGrid");
    if (rg && data.data.topRated) {
      rg.innerHTML = "";
      data.data.topRated.media.forEach(function (a) { rg.appendChild(animeCard(a)); });
    }

    // Continue watching
    renderContinueWatching();
  }

  function startHeroAuto() {
    if (heroTimer) clearInterval(heroTimer);
    heroTimer = setInterval(function () {
      heroIndex = (heroIndex + 1) % heroData.length;
      updateHero();
    }, 4000);
  }

  function updateHero() {
    var slides = document.getElementById("heroSlides");
    var dots = document.getElementById("heroDots");
    if (!slides || !heroData.length) return;
    slides.style.transform = "translateX(-" + (heroIndex * 100) + "%)";
    dots.querySelectorAll(".hero__dot").forEach(function (d, i) { d.classList.toggle("is-active", i === heroIndex); });
  }

  document.addEventListener("click", function (e) {
    var dot = e.target.closest(".hero__dot");
    if (dot) { heroIndex = parseInt(dot.dataset.idx); updateHero(); startHeroAuto(); }
  });

  function renderContinueWatching() {
    var cw = document.getElementById("continueWatching");
    if (!cw) return;
    if (!history.length) {
      cw.innerHTML = '<div style="font-size:12px;color:var(--color-text-muted);padding:12px 0">No watch history yet. Start watching to see episodes here.</div>';
      return;
    }
    cw.innerHTML = "";
    history.slice(0, 8).forEach(function (h) {
      var card = el('<div class="cw-card" data-anime-id="' + h.id + '"><div class="cw-card__img"><img src="' + h.cover + '" alt="' + h.title + '"/><div class="cw-card__progress"><div class="cw-card__progress-fill" style="width:' + (h.progress || 0) + '%"></div></div></div><h4 class="cw-card__title">' + h.title + '</h4><span class="cw-card__ep">EP ' + h.episode + '</span></div>');
      card._animeData = { id: h.id, title: { romaji: h.title }, coverImage: { large: h.cover } };
      cw.appendChild(card);
    });
  }

  // Load home data
  fetchHomeData().then(renderHome).catch(function (e) {
    console.error("Home fetch error:", e);
    var hc = document.getElementById("homeContent");
    if (hc) hc.innerHTML = '<div class="empty-state"><div class="empty-state__icon">⚠</div><h3 class="empty-state__title">Could not load</h3><p class="empty-state__desc">Check your connection and reload.</p></div>';
  });

  /* ---- LIBRARY -------------------------------------------------------- */
  var libTab = "all", libSort = settings.libSort, libView = settings.libLayout;

  function renderLibrary() {
    var content = document.getElementById("libraryContent");
    if (!content) return;
    var items = library.slice();
    if (libTab !== "all") items = items.filter(function (a) { return a.status === libTab; });
    if (libSort === "title") items.sort(function (a, b) { return a.title.localeCompare(b.title); });
    else if (libSort === "score") items.sort(function (a, b) { return (b.score || 0) - (a.score || 0); });
    else if (libSort === "updated") items.sort(function (a, b) { return (b.updated || 0) - (a.updated || 0); });

    if (!items.length) {
      content.innerHTML = '<div class="empty-state"><div class="empty-state__icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div><h3 class="empty-state__title">Library is empty</h3><p class="empty-state__desc">Browse anime and add them to your library.</p><button class="empty-state__btn" data-goto="home">Browse anime</button></div>';
      return;
    }
    content.innerHTML = "";
    if (libView === "list") {
      content.className = "";
      var list = el('<div class="anime-list"></div>');
      items.forEach(function (item) {
        var a = { id: item.id, title: { romaji: item.title }, coverImage: { large: item.cover }, averageScore: item.score, format: item.format, episodes: item.episodes };
        var row = animeRow(a);
        row._animeData = a;
        list.appendChild(row);
      });
      content.appendChild(list);
    } else {
      content.className = "grid" + (libView === "compact" ? " grid--3" : "");
      items.forEach(function (item) {
        var a = { id: item.id, title: { romaji: item.title }, coverImage: { large: item.cover }, averageScore: item.score, format: item.format, episodes: item.episodes };
        var card = animeCard(a);
        card._animeData = a;
        content.appendChild(card);
      });
    }
  }

  document.addEventListener("click", function (e) {
    var tab = e.target.closest("[data-lib-tab]");
    if (tab) {
      libTab = tab.dataset.libTab;
      document.querySelectorAll("[data-lib-tab]").forEach(function (t) { t.classList.toggle("is-active", t === tab); });
      renderLibrary();
    }
    var vt = e.target.closest("[data-view-mode]");
    if (vt) {
      libView = vt.dataset.viewMode;
      document.querySelectorAll("[data-view-mode]").forEach(function (t) { t.classList.toggle("is-active", t === vt); });
      settings.libLayout = libView; saveSettings();
      renderLibrary();
    }
  });

  document.getElementById("librarySort").addEventListener("change", function (e) {
    libSort = e.target.value; settings.libSort = libSort; saveSettings(); renderLibrary();
  });

  // Sync library UI from settings on load
  document.getElementById("librarySort").value = settings.libSort;
  document.querySelectorAll("[data-view-mode]").forEach(function (b) { b.classList.toggle("is-active", b.dataset.viewMode === settings.libLayout); });

  /* ---- HISTORY -------------------------------------------------------- */
  function renderHistory() {
    var hc = document.getElementById("historyContinue");
    var hl = document.getElementById("historyList");
    if (!history.length) {
      if (hc) hc.innerHTML = '<div style="font-size:12px;color:var(--color-text-muted);padding:12px 0">No history yet.</div>';
      if (hl) hl.innerHTML = '<div class="empty-state"><div class="empty-state__icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></div><h3 class="empty-state__title">No watch history</h3><p class="empty-state__desc">Episodes you watch will appear here.</p></div>';
      return;
    }
    if (hc) {
      hc.innerHTML = "";
      history.slice(0, 8).forEach(function (h) {
        var card = el('<div class="cw-card" data-anime-id="' + h.id + '"><div class="cw-card__img"><img src="' + h.cover + '" alt="' + h.title + '"/><div class="cw-card__progress"><div class="cw-card__progress-fill" style="width:' + (h.progress || 0) + '%"></div></div></div><h4 class="cw-card__title">' + h.title + '</h4><span class="cw-card__ep">EP ' + h.episode + '</span></div>');
        card._animeData = { id: h.id, title: { romaji: h.title }, coverImage: { large: h.cover } };
        hc.appendChild(card);
      });
    }
    if (hl) {
      hl.innerHTML = "";
      history.forEach(function (h) {
        var row = el('<div class="anime-row" data-anime-id="' + h.id + '"><div class="anime-row__cover"><img src="' + h.cover + '" alt="' + h.title + '"/></div><div class="anime-row__info"><h3 class="anime-row__title">' + h.title + '</h3><span class="anime-row__meta">Episode ' + h.episode + ' · ' + (h.watchedAgo || "recently") + '</span></div></div>');
        row._animeData = { id: h.id, title: { romaji: h.title }, coverImage: { large: h.cover } };
        hl.appendChild(row);
      });
    }
  }

  document.getElementById("clearHistoryBtn").addEventListener("click", function () {
    if (confirm("Clear all watch history?")) { history = []; saveHistory(); renderHistory(); renderContinueWatching(); }
  });

  /* ---- SEARCH --------------------------------------------------------- */
  var searchTimer = null;
  var activeGenres = [];
  var GENRES = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mecha", "Music", "Mystery", "Psychological", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"];

  function initSearchFilters() {
    var gc = document.getElementById("genreChips");
    gc.innerHTML = GENRES.map(function (g) { return '<button class="chip" data-genre="' + g + '">' + g + "</button>"; }).join("");
    var ys = document.getElementById("filterYear");
    var yr = new Date().getFullYear();
    for (var y = yr; y >= 1990; y--) { var o = el('<option value="' + y + '">' + y + "</option>"); ys.appendChild(o); }
  }
  initSearchFilters();

  document.getElementById("filterToggleBtn").addEventListener("click", function () {
    document.getElementById("filterPanel").classList.toggle("is-collapsed");
  });

  document.addEventListener("click", function (e) {
    var chip = e.target.closest("[data-genre]");
    if (!chip) return;
    e.preventDefault();
    var g = chip.dataset.genre;
    var idx = activeGenres.indexOf(g);
    if (idx === -1) { activeGenres.push(g); chip.classList.add("is-active"); }
    else { activeGenres.splice(idx, 1); chip.classList.remove("is-active"); }
    doSearch();
  });

  ["filterYear", "filterSeason", "filterFormat", "filterSort"].forEach(function (id) {
    document.getElementById(id).addEventListener("change", doSearch);
  });

  document.getElementById("searchInput").addEventListener("input", function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(doSearch, 400);
  });

  function doSearch() {
    var q = document.getElementById("searchInput").value.trim();
    var filters = {
      genre: activeGenres[0] || "",
      year: document.getElementById("filterYear").value,
      season: document.getElementById("filterSeason").value,
      format: document.getElementById("filterFormat").value,
      sort: document.getElementById("filterSort").value
    };
    var results = document.getElementById("searchResults");
    if (!q && !filters.genre && !filters.year && !filters.season && !filters.format) {
      results.innerHTML = '<div style="grid-column:1/-1" class="empty-state"><div class="empty-state__icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></div><h3 class="empty-state__title">Search anime</h3><p class="empty-state__desc">Type a title or apply filters to find anime from AniList.</p></div>';
      return;
    }
    results.innerHTML = Array(6).fill('<div class="skeleton" style="aspect-ratio:2/3"></div>').join("");
    fetchSearch(q, filters).then(function (d) {
      var media = (d.data && d.data.Page && d.data.Page.media) || [];
      if (!media.length) {
        results.innerHTML = '<div style="grid-column:1/-1" class="empty-state"><h3 class="empty-state__title">No results</h3><p class="empty-state__desc">Try different keywords or filters.</p></div>';
        return;
      }
      results.innerHTML = "";
      media.forEach(function (a) { var c = animeCard(a); results.appendChild(c); });
    }).catch(function () {
      results.innerHTML = '<div style="grid-column:1/-1" class="empty-state"><h3 class="empty-state__title">Search error</h3><p class="empty-state__desc">Could not fetch results.</p></div>';
    });
  }
  doSearch();

  /* ---- DETAIL --------------------------------------------------------- */
  var currentAnimeData = null;

  function renderDetail(id, cachedData) {
    var content = document.getElementById("detailContent");
    content.innerHTML = '<div class="skeleton" style="height:200px;border-radius:0"></div>';

    function render(a) {
      var title = a.title.romaji || a.title.english || "Unknown";
      var cover = a.coverImage.large || a.coverImage.extraLarge;
      var banner = a.bannerImage || cover;
      var inLib = library.find(function (x) { return String(x.id) === String(a.id); });
      var epCount = a.episodes || 12;
      var studio = (a.studios && a.studios.nodes && a.studios.nodes[0]) ? a.studios.nodes[0].name : "Unknown";

      document.getElementById("detailAppBarTitle").textContent = truncate(title, 30);

      var episodes = "";
      for (var i = 1; i <= epCount; i++) {
        episodes += '<div class="episode-row" data-ep="' + i + '" data-anime-id="' + a.id + '"><div class="episode-row__num">' + i + '</div><div class="episode-row__info"><h4 class="episode-row__title">Episode ' + i + '</h4><span class="episode-row__meta">' + (a.duration || 24) + ' min</span></div><div class="episode-row__play"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div></div>';
      }

      content.innerHTML =
        '<div class="detail-banner"><img src="' + banner + '" alt=""/></div>' +
        '<div class="detail-header"><div class="detail-cover"><img src="' + cover + '" alt="' + title + '"/></div>' +
        '<div class="detail-info"><h2 class="detail-title">' + title + '</h2>' +
        (a.title.english ? '<span class="detail-subtitle">' + truncate(a.title.english, 40) + '</span>' : '') +
        '<div class="detail-meta">' +
        '<span class="meta-pill meta-pill--score">★ ' + fmtScore(a.averageScore) + '</span>' +
        '<span class="meta-pill">' + (a.status || "AIRING").replace("_", " ") + '</span>' +
        '<span class="meta-pill">' + epCount + ' ep</span>' +
        '<span class="meta-pill">' + (a.format || "TV") + '</span>' +
        '</div></div></div>' +
        '<div class="detail-actions">' +
        '<button class="btn btn--primary" id="addToLibBtn">' + (inLib ? '✓ In Library' : '+ Add to Library') + '</button>' +
        '<button class="btn btn--secondary btn--icon" id="playFirstEpBtn" data-anime-id="' + a.id + '"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></button>' +
        '</div>' +
        '<div class="detail-body">' +
        '<div class="detail-section"><div class="detail-genres">' + (a.genres || []).map(function (g) { return '<span class="chip">' + g + '</span>'; }).join('') + '</div></div>' +
        '<div class="detail-section"><h3>Synopsis</h3><p class="detail-synopsis" id="synopsis">' + stripTags(a.description || "No description available.") + '</p><button class="detail-expand" id="synopsisExpand">Read more</button></div>' +
        '<div class="detail-section"><h3>Episodes</h3><div class="episode-list">' + episodes + '</div></div>' +
        '</div>';

      // Store anime data for episode clicks
      currentAnimeData = a;

      // Add to library
      document.getElementById("addToLibBtn").addEventListener("click", function () {
        var idx = library.findIndex(function (x) { return String(x.id) === String(a.id); });
        if (idx === -1) {
          library.push({ id: a.id, title: title, cover: cover, score: a.averageScore, format: a.format, episodes: epCount, status: "watching", updated: Date.now() });
          saveLibrary();
          this.textContent = "✓ In Library";
        } else {
          library.splice(idx, 1);
          saveLibrary();
          this.textContent = "+ Add to Library";
        }
      });

      // Play first episode
      var pf = document.getElementById("playFirstEpBtn");
      if (pf) { pf._animeData = a; pf.addEventListener("click", function () { goTo("player", { id: a.id, episode: 1, data: a }); }); }

      // Synopsis expand
      document.getElementById("synopsisExpand").addEventListener("click", function () {
        document.getElementById("synopsis").classList.toggle("is-expanded");
        this.textContent = document.getElementById("synopsis").classList.contains("is-expanded") ? "Show less" : "Read more";
      });

      // Episode clicks
      content.querySelectorAll(".episode-row").forEach(function (row) {
        row.addEventListener("click", function () {
          goTo("player", { id: a.id, episode: parseInt(row.dataset.ep), data: a });
        });
      });
    }

    if (cachedData) render(cachedData);
    fetchDetail(id).then(function (d) {
      if (d.data && d.data.Media) render(d.data.Media);
    }).catch(function () {
      if (!cachedData) content.innerHTML = '<div class="empty-state"><h3 class="empty-state__title">Could not load</h3></div>';
    });
  }

  /* ---- PLAYER --------------------------------------------------------- */
  var playerState = { playing: false, progress: 0, duration: 24 * 60, currentEp: 1, animeId: null, anime: null };

  function renderPlayer(id, episode) {
    playerState.animeId = id;
    playerState.currentEp = episode;
    playerState.progress = 0;
    playerState.playing = false;

    var a = currentAnimeData || {};
    var title = a.title ? (a.title.romaji || a.title.english) : "Anime";
    var cover = a.coverImage ? a.coverImage.large : "";
    var epCount = a.episodes || 12;

    playerState.anime = a;

    document.getElementById("playerPoster").src = a.bannerImage || cover || "";
    document.getElementById("playerTitle").textContent = title + " · EP " + episode;
    document.getElementById("totalTime").textContent = "24:00";
    document.getElementById("currentTime").textContent = "0:00";
    document.getElementById("seekFill").style.width = "0%";

    var playBtn = document.getElementById("playPauseBtn");
    playBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';

    // Episode list
    var list = document.getElementById("playerEpisodes");
    var eps = "";
    for (var i = 1; i <= epCount; i++) {
      eps += '<div class="episode-row' + (i === episode ? " is-current" : "") + '" data-ep="' + i + '"><div class="episode-row__num">' + i + '</div><div class="episode-row__info"><h4 class="episode-row__title">Episode ' + i + '</h4><span class="episode-row__meta">24 min</span></div><div class="episode-row__play"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div></div>';
    }
    list.innerHTML = '<h3 class="player-ep-title">Episodes</h3>' + eps;

    // Episode click → switch episode
    list.querySelectorAll(".episode-row").forEach(function (row) {
      row.addEventListener("click", function () {
        var ep = parseInt(row.dataset.ep);
        renderPlayer(id, ep);
      });
    });

    // Record in history
    if (settings.trackHistory) {
      var idx = history.findIndex(function (h) { return String(h.id) === String(id); });
      var entry = { id: id, title: title, cover: cover, episode: episode, progress: 0, watchedAgo: "just now", watchedAt: Date.now() };
      if (idx === -1) history.unshift(entry);
      else { history[idx].episode = episode; history[idx].watchedAgo = "just now"; history.unshift(history.splice(idx, 1)[0]); }
      history = history.slice(0, 50);
      saveHistory();
    }

    // Skip intro button visibility
    document.getElementById("skipIntroBtn").style.display = settings.skipIntro ? "" : "none";
  }

  // Player controls
  document.getElementById("playPauseBtn").addEventListener("click", function () {
    playerState.playing = !playerState.playing;
    this.innerHTML = playerState.playing
      ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>'
      : '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    if (playerState.playing) startPlayerProgress();
    else stopPlayerProgress();
  });

  var playerTimer = null;
  function startPlayerProgress() {
    stopPlayerProgress();
    playerTimer = setInterval(function () {
      playerState.progress += 1;
      if (playerState.progress >= playerState.duration) { playerState.progress = 0; stopPlayerProgress(); playerState.playing = false; document.getElementById("playPauseBtn").innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'; }
      var pct = (playerState.progress / playerState.duration) * 100;
      document.getElementById("seekFill").style.width = pct + "%";
      var m = Math.floor(playerState.progress / 60), s = (playerState.progress % 60).toString().padStart(2, "0");
      document.getElementById("currentTime").textContent = m + ":" + s;
      // Update history progress
      if (settings.trackHistory && playerState.animeId) {
        var idx = history.findIndex(function (h) { return String(h.id) === String(playerState.animeId); });
        if (idx !== -1) { history[idx].progress = pct; saveHistory(); }
      }
    }, 1000);
  }
  function stopPlayerProgress() { if (playerTimer) { clearInterval(playerTimer); playerTimer = null; } }

  // Seek
  document.getElementById("seekTrack").addEventListener("click", function (e) {
    var rect = this.getBoundingClientRect();
    var pct = (e.clientX - rect.left) / rect.width;
    playerState.progress = Math.floor(pct * playerState.duration);
    document.getElementById("seekFill").style.width = (pct * 100) + "%";
    var m = Math.floor(playerState.progress / 60), s = (playerState.progress % 60).toString().padStart(2, "0");
    document.getElementById("currentTime").textContent = m + ":" + s;
  });

  // Next/Prev episode
  document.getElementById("nextEpBtn").addEventListener("click", function () {
    var epCount = (playerState.anime && playerState.anime.episodes) || 12;
    if (playerState.currentEp < epCount) renderPlayer(playerState.animeId, playerState.currentEp + 1);
  });
  document.getElementById("prevEpBtn").addEventListener("click", function () {
    if (playerState.currentEp > 1) renderPlayer(playerState.animeId, playerState.currentEp - 1);
  });

  // Player fullscreen
  document.getElementById("playerFsBtn").addEventListener("click", function () {
    var area = document.getElementById("playerArea");
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    } else {
      var req = area.requestFullscreen || area.webkitRequestFullscreen;
      if (req) req.call(area);
    }
  });

  // Skip intro
  document.getElementById("skipIntroBtn").addEventListener("click", function () {
    playerState.progress += 85;
    var pct = (playerState.progress / playerState.duration) * 100;
    document.getElementById("seekFill").style.width = pct + "%";
  });

  // Toggle overlay on tap
  document.getElementById("playerArea").addEventListener("click", function (e) {
    if (e.target.closest(".player-ctrl") || e.target.closest(".player-seek")) return;
    document.getElementById("playerOverlay").classList.toggle("is-hidden");
  });

  /* ---- SETTINGS ------------------------------------------------------- */
  document.getElementById("settingTheme").addEventListener("change", function (e) {
    settings.theme = e.target.value; saveSettings(); applySettings();
  });
  document.getElementById("settingQuality").addEventListener("change", function (e) {
    settings.quality = e.target.value; saveSettings();
  });
  document.getElementById("settingLibLayout").addEventListener("change", function (e) {
    settings.libLayout = e.target.value; saveSettings(); libView = e.target.value;
    document.querySelectorAll("[data-view-mode]").forEach(function (b) { b.classList.toggle("is-active", b.dataset.viewMode === settings.libLayout); });
    renderLibrary();
  });
  document.getElementById("settingLibSort").addEventListener("change", function (e) {
    settings.libSort = e.target.value; saveSettings(); libSort = e.target.value;
    document.getElementById("librarySort").value = settings.libSort;
    renderLibrary();
  });

  document.addEventListener("click", function (e) {
    var tog = e.target.closest("[data-setting]");
    if (!tog) return;
    e.preventDefault();
    var key = tog.dataset.setting;
    settings[key] = !settings[key];
    tog.classList.toggle("is-on", settings[key]);
    saveSettings();
  });

  document.addEventListener("click", function (e) {
    var sw = e.target.closest("[data-accent]");
    if (!sw) return;
    e.preventDefault();
    settings.accent = sw.dataset.accent; saveSettings(); applySettings();
    document.querySelectorAll("[data-accent]").forEach(function (s) { s.classList.toggle("is-active", s === sw); });
  });

  document.getElementById("clearHistorySetting").addEventListener("click", function () {
    if (confirm("Clear all watch history?")) { history = []; saveHistory(); renderHistory(); renderContinueWatching(); }
  });
  document.getElementById("clearLibrarySetting").addEventListener("click", function () {
    if (confirm("Clear entire library?")) { library = []; saveLibrary(); renderLibrary(); }
  });
  document.getElementById("resetSettings").addEventListener("click", function () {
    if (confirm("Reset all settings to defaults?")) {
      localStorage.removeItem("anime-settings");
      settings = { theme: "dark", accent: "pink", autoplay: true, skipIntro: true, quality: "1080p", libLayout: "grid", libSort: "title", trackHistory: true, continueWatching: true };
      saveSettings(); applySettings(); location.reload();
    }
  });

  // Sync settings UI
  document.getElementById("settingTheme").value = settings.theme;
  document.getElementById("settingQuality").value = settings.quality;
  document.getElementById("settingLibLayout").value = settings.libLayout;
  document.getElementById("settingLibSort").value = settings.libSort;
  document.querySelectorAll("[data-setting]").forEach(function (t) { t.classList.toggle("is-on", settings[t.dataset.setting]); });
  document.querySelectorAll("[data-accent]").forEach(function (s) { s.classList.toggle("is-active", s.dataset.accent === settings.accent); });

  /* ---- Click-drag-to-scroll (desktop) --------------------------------- */
  (function () {
    var finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer || !device) return;
    var dragViews = Array.prototype.slice.call(device.querySelectorAll(".view"));
    var dragTargets = [device.querySelector(".screen")].concat(dragViews).filter(Boolean);
    dragTargets.forEach(function (el) {
      var dragging = false, sx = 0, sy = 0, sl = 0, st = 0, moved = false;
      el.addEventListener("mousedown", function (e) {
        if (e.target.closest("button, a, input, select, .toggle, .chip, .tab, .anime-card, .anime-row, .episode-row, .hero__slide, [data-goto]")) return;
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

  // Initial render
  renderLibrary();
  renderHistory();

  // Restore view from hash
  var initial = (location.hash || "#home").slice(1);
  if (["home", "library", "history", "search", "settings"].indexOf(initial) !== -1) goTo(initial);
  else goTo("home");

})();
