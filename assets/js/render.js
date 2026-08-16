/* ==========================================================================
   MODEL G20 2026 — CONTENT RENDERERS
   Each renderer looks for its mount point and does nothing if absent, so a
   single script serves every page. Runs before app.js so that reveal
   observers and tab wiring see the finished DOM.
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;
  var $  = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var D = window.MG20;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  window.MG20esc = esc;

  var ICON = {
    arrow: '<svg class="btn__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M14 3v5h5M9 13h6M9 17h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    down: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 3v11m0 0 4-4m-4 4-4-4M4 17h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    seal: '<svg viewBox="0 0 100 100" fill="none" aria-hidden="true"><circle cx="50" cy="50" r="46" stroke="currentColor" stroke-width="1.5"/><circle cx="50" cy="50" r="38" stroke="currentColor" stroke-width="0.75"/><ellipse cx="50" cy="50" rx="38" ry="15" stroke="currentColor" stroke-width="0.75"/><ellipse cx="50" cy="50" rx="15" ry="38" stroke="currentColor" stroke-width="0.75"/><path d="M12 50h76M50 12v76" stroke="currentColor" stroke-width="0.75"/></svg>'
  };

  /* ======================================================================
     STATS
     ====================================================================== */
  function stats() {
    $$("[data-stats]").forEach(function (mount) {
      mount.innerHTML = D.EVENT.stats.map(function (s) {
        return '<div class="stat"><div class="stat__value"><span data-count="' + s.value +
               '" data-suffix="' + s.suffix + '">' + s.value + s.suffix + "</span></div>" +
               '<div class="stat__label">' + esc(s.label) + "</div></div>";
      }).join("");
    });
  }

  /* ======================================================================
     NATIONS MARQUEE
     ====================================================================== */
  function marqueeContent() {
    $$("[data-marquee-nations]").forEach(function (mount) {
      mount.innerHTML = D.COUNTRIES
        .filter(function (c) { return c.group !== "org"; })
        .map(function (c) { return '<span class="marquee__item">' + esc(c.name) + "</span>"; })
        .join("");
    });
  }

  /* ======================================================================
     COMMITTEES
     ====================================================================== */
  function committeeCard(c) {
    var open = D.seatsFor(c).filter(function (x) { return D.statusFor(c.id, x.code) !== "closed"; }).length;
    return '<article class="cmt-card" data-reveal>' +
      '<div class="cmt-card__seal">' + ICON.seal + "</div>" +
      '<div class="row row--between row--tight">' +
        '<span class="cmt-card__abbr">' + esc(c.abbr) + "</span>" +
        '<span class="badge badge--quiet">' + esc(c.track) + "</span>" +
      "</div>" +
      '<h3 class="cmt-card__name">' + esc(c.name) + "</h3>" +
      '<p class="cmt-card__agenda">' + esc(c.agenda) + "</p>" +
      '<p class="t-sm t-muted">' + esc(c.brief) + "</p>" +
      '<dl class="cmt-card__facts">' +
        '<div class="cmt-fact"><dt>Seats</dt><dd>' + c.seats + "</dd></div>" +
        '<div class="cmt-fact"><dt>Open</dt><dd>' + open + "</dd></div>" +
        '<div class="cmt-fact"><dt>Level</dt><dd>' + esc(c.level) + "</dd></div>" +
      "</dl>" +
      '<div class="row row--between">' +
        '<span class="difficulty" role="img" aria-label="Difficulty ' + c.difficulty + ' of 5">' +
          [1, 2, 3, 4, 5].map(function (n) {
            return '<i class="' + (n <= c.difficulty ? "is-on" : "") + '"></i>';
          }).join("") +
        "</span>" +
        '<button class="btn-text" type="button" data-committee-open="' + c.id + '">Dossier' +
          '<span class="btn-text__line"></span></button>' +
      "</div>" +
    "</article>";
  }

  function committees() {
    var mount = $("[data-committees]");
    if (!mount) return;
    mount.innerHTML = D.COMMITTEES.map(committeeCard).join("");

    /* Dossier modal, built once and re-filled on open. */
    var modal = doc.createElement("div");
    modal.className = "modal";
    modal.id = "committee-dossier";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML =
      '<div class="modal__box">' +
        '<button class="modal__close" data-modal-close aria-label="Close dossier">' +
          '<svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
        "</button>" +
        '<div class="modal__body" data-dossier></div>' +
      "</div>";
    doc.body.appendChild(modal);

    doc.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-committee-open]");
      if (!btn) return;
      var c = D.byId(btn.dataset.committeeOpen);
      if (!c) return;
      var seats = D.seatsFor(c);
      var open = seats.filter(function (x) { return D.statusFor(c.id, x.code) === "open"; });
      $("[data-dossier]", modal).innerHTML =
        '<span class="eyebrow">' + esc(c.abbr) + " · " + esc(c.track) + "</span>" +
        '<h2 id="dossier-title" class="t-h2" style="margin-top:.9rem">' + esc(c.name) + "</h2>" +
        '<p class="t-lead t-quiet-italic" style="margin-top:.7rem">' + esc(c.agenda) + "</p>" +
        '<hr class="divider" style="margin:1.8rem 0">' +
        '<div class="split split--even">' +
          "<div>" +
            '<p class="t-body">' + esc(c.brief) + "</p>" +
            '<h4 style="margin:1.6rem 0 .8rem">Under negotiation</h4>' +
            '<div class="prose"><ul>' + c.focus.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul></div>" +
          "</div>" +
          '<div class="stack-4">' +
            '<div class="card card--muted">' +
              '<dl class="reg-summary">' +
                '<div class="reg-summary__row"><dt>Delegate role</dt><dd>' + esc(c.role) + "</dd></div>" +
                '<div class="reg-summary__row"><dt>Seats</dt><dd>' + c.seats + "</dd></div>" +
                '<div class="reg-summary__row"><dt>Currently open</dt><dd>' + open.length + "</dd></div>" +
                '<div class="reg-summary__row"><dt>Level</dt><dd>' + esc(c.level) + "</dd></div>" +
                '<div class="reg-summary__row" style="border:0"><dt>Outputs</dt><dd>' + c.outputs.map(esc).join("<br>") + "</dd></div>" +
              "</dl>" +
            "</div>" +
            '<a class="btn btn--block" href="register.html?committee=' + c.id + '">Request this committee' + ICON.arrow + "</a>" +
            '<a class="btn btn--ghost btn--block" href="country-matrix.html?committee=' + c.id + '">View the matrix</a>' +
          "</div>" +
        "</div>";
      modal.setAttribute("aria-labelledby", "dossier-title");
      if (window.MG20Modal) window.MG20Modal.open("committee-dossier", btn);
    });
  }

  /* Compact committee list used on the home page. */
  function committeeTracks() {
    var mount = $("[data-tracks]");
    if (!mount) return;
    mount.innerHTML = D.COMMITTEES.map(function (c, i) {
      return '<a class="track" href="committees.html#' + c.id + '" data-reveal>' +
        '<span class="track__idx">' + String(i + 1).padStart(2, "0") + "</span>" +
        "<span>" +
          '<span class="track__title">' + esc(c.name) + "</span>" +
          '<span class="track__desc">' + esc(c.agenda) + "</span>" +
        "</span>" +
        '<span class="track__go"><svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
      "</a>";
    }).join("");
  }

  /* ======================================================================
     SCHEDULE
     ====================================================================== */
  function schedule() {
    var mount = $("[data-schedule]");
    if (!mount) return;

    var nav = '<div class="day-select" role="tablist" aria-label="Summit days">' +
      D.SCHEDULE.map(function (d, i) {
        return '<button class="day-btn" role="tab" id="tab-' + d.id + '" aria-controls="panel-' + d.id +
          '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '">' +
          '<span class="day-btn__k">' + esc(d.label) + "</span>" +
          '<span class="day-btn__d">' + esc(d.date) + "</span>" +
          '<span class="day-btn__n">' + d.items.length + " scheduled entries</span>" +
        "</button>";
      }).join("") + "</div>";

    var panels = D.SCHEDULE.map(function (d, i) {
      return '<div class="tab-panel" role="tabpanel" id="panel-' + d.id + '" aria-labelledby="tab-' + d.id + '"' +
        (i === 0 ? "" : " hidden") + ">" +
        '<p class="t-sm t-muted" style="margin:2rem 0 1.2rem;max-width:62ch">' + esc(d.note) + "</p>" +
        '<div class="timeline">' + d.items.map(function (it) {
          return '<div class="tl-item' + (it.key ? " tl-item--key" : "") + '">' +
            '<div class="tl-time"><span>' + esc(it.t) + "</span><small>until " + esc(it.t2) + "</small></div>" +
            '<div class="tl-body">' +
              '<h3 class="tl-title">' + esc(it.title) + "</h3>" +
              (it.desc ? '<p class="t-sm t-muted">' + esc(it.desc) + "</p>" : "") +
              '<div class="tl-meta"><span>' + esc(it.venue) + '</span><span class="badge badge--quiet">' + esc(it.tag) + "</span></div>" +
            "</div>" +
          "</div>";
        }).join("") + "</div>" +
      "</div>";
    }).join("");

    mount.setAttribute("data-tabs", "");
    mount.innerHTML = nav + panels;
  }

  /* ======================================================================
     SECRETARIAT
     ====================================================================== */
  function secretariat() {
    var mount = $("[data-secretariat]");
    if (!mount) return;
    mount.innerHTML = D.SECRETARIAT.map(function (p) {
      return '<article class="person" data-reveal>' +
        '<div class="row row--tight" style="gap:1rem">' +
          '<div class="person__avatar" aria-hidden="true">' + esc(p.initials) + "</div>" +
          "<div>" +
            '<div class="person__office">' + esc(p.group) + "</div>" +
            '<h3 class="person__role">' + esc(p.office) + "</h3>" +
          "</div>" +
        "</div>" +
        '<p class="t-sm t-muted">' + esc(p.remit) + "</p>" +
        '<p class="person__name">' + (p.name ? esc(p.name) : "<em>Appointment announced ahead of summit</em>") + "</p>" +
      "</article>";
    }).join("");
  }

  /* ======================================================================
     RESOURCES
     ====================================================================== */
  function resources() {
    var mount = $("[data-resources]");
    if (!mount) return;
    var cats = [];
    D.RESOURCES.forEach(function (r) { if (cats.indexOf(r.cat) < 0) cats.push(r.cat); });

    var filters = $("[data-resource-filters]");
    if (filters) {
      filters.innerHTML =
        '<button class="chip is-active" type="button" data-rfilter="all">All <span class="chip__count">' + D.RESOURCES.length + "</span></button>" +
        cats.map(function (c) {
          var n = D.RESOURCES.filter(function (r) { return r.cat === c; }).length;
          return '<button class="chip" type="button" data-rfilter="' + esc(c) + '">' + esc(c) + ' <span class="chip__count">' + n + "</span></button>";
        }).join("");
    }

    function paint(filter) {
      var list = D.RESOURCES.filter(function (r) { return filter === "all" || r.cat === filter; });
      mount.innerHTML = list.map(function (r) {
        var ready = r.state === "ready";
        return '<div class="row-item">' +
          '<div class="row-item__icon">' + ICON.doc + "</div>" +
          '<div class="row-item__body">' +
            '<div class="row-item__title">' + esc(r.title) + "</div>" +
            '<div class="row-item__sub">' + esc(r.desc) + " · " + esc(r.meta) + "</div>" +
          "</div>" +
          '<div class="row-item__action">' +
            (ready
              ? '<a class="btn btn--ghost btn--sm" href="#" data-download="' + esc(r.title) + '">Download</a>'
              : '<span class="badge badge--quiet">Released later</span>') +
          "</div>" +
        "</div>";
      }).join("");
    }
    paint("all");

    if (filters) {
      filters.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-rfilter]");
        if (!btn) return;
        $$(".chip", filters).forEach(function (c) { c.classList.remove("is-active"); });
        btn.classList.add("is-active");
        paint(btn.dataset.rfilter);
      });
    }

    /* No files are bundled in this build — say so honestly rather than 404. */
    mount.addEventListener("click", function (e) {
      var a = e.target.closest("[data-download]");
      if (!a) return;
      e.preventDefault();
      var note = $("[data-download-note]");
      if (note) {
        note.hidden = false;
        note.textContent = '"' + a.dataset.download + '" is not bundled with this build. Upload the file to /assets/docs/ and point this link at it.';
        note.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    });
  }

  /* ======================================================================
     FAQ
     ====================================================================== */
  function faqs() {
    var mount = $("[data-faqs]");
    if (!mount) return;
    var cats = [];
    D.FAQS.forEach(function (f) { if (cats.indexOf(f.cat) < 0) cats.push(f.cat); });

    mount.innerHTML = cats.map(function (cat) {
      return '<section class="stack-5" data-reveal>' +
        '<h2 class="t-h3" id="faq-' + cat.toLowerCase().replace(/\W+/g, "-") + '">' + esc(cat) + "</h2>" +
        '<div class="accordion" data-single="true">' +
          D.FAQS.filter(function (f) { return f.cat === cat; }).map(function (f, i) {
            var id = "faq-" + cat.toLowerCase().replace(/\W+/g, "-") + "-" + i;
            return '<div class="acc-item">' +
              '<h3 style="margin:0"><button class="acc-trigger" type="button" aria-expanded="false" aria-controls="' + id + '">' +
                "<span>" + esc(f.q) + "</span>" +
                '<span class="acc-icon" aria-hidden="true"></span>' +
              "</button></h3>" +
              '<div class="acc-panel" id="' + id + '"><div><div class="acc-panel__inner">' + esc(f.a) + "</div></div></div>" +
            "</div>";
          }).join("") +
        "</div>" +
      "</section>";
    }).join("");

    var jump = $("[data-faq-jump]");
    if (jump) {
      jump.innerHTML = cats.map(function (c) {
        return '<a class="chip" href="#faq-' + c.toLowerCase().replace(/\W+/g, "-") + '">' + esc(c) + "</a>";
      }).join("");
    }
  }

  /* ======================================================================
     GALLERY — generative plates stand in for photography
     ====================================================================== */
  function plateArt(seed) {
    function rnd(n) {
      var x = Math.sin(seed * 9301 + n * 49297) * 233280;
      return x - Math.floor(x);
    }
    var kind = Math.floor(rnd(1) * 3);
    var parts = [];
    var i;

    if (kind === 0) {
      /* Concentric meridians — the summit seal, cropped */
      var cx = 20 + rnd(2) * 60, cy = 30 + rnd(3) * 50;
      for (i = 0; i < 9; i++) {
        parts.push('<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + (8 + i * 9) + '" ry="' + (8 + i * 9) * (0.35 + rnd(i + 4) * 0.6) +
          '" fill="none" stroke="rgba(239,221,198,' + (0.34 - i * 0.03).toFixed(2) + ')" stroke-width="0.7"/>');
      }
    } else if (kind === 1) {
      /* Assembly rows — abstracted seating */
      for (i = 0; i < 13; i++) {
        var y = 12 + i * 7;
        var w = 20 + rnd(i) * 68;
        parts.push('<rect x="' + (rnd(i + 20) * (100 - w)).toFixed(1) + '" y="' + y + '" width="' + w.toFixed(1) +
          '" height="2.4" rx="1.2" fill="rgba(239,221,198,' + (0.1 + rnd(i + 9) * 0.3).toFixed(2) + ')"/>');
      }
    } else {
      /* Rising arcs — flight paths */
      for (i = 0; i < 7; i++) {
        var y0 = 88 - i * 3;
        parts.push('<path d="M-4,' + y0 + ' Q' + (30 + rnd(i) * 40).toFixed(0) + ',' + (10 + rnd(i + 3) * 40).toFixed(0) +
          ' 104,' + (20 + rnd(i + 6) * 40).toFixed(0) + '" fill="none" stroke="rgba(239,221,198,' +
          (0.12 + rnd(i + 12) * 0.26).toFixed(2) + ')" stroke-width="0.6"/>');
      }
    }
    /* Dot lattice wash, consistent across all three variants */
    for (i = 0; i < 42; i++) {
      parts.push('<circle cx="' + (rnd(i + 40) * 100).toFixed(1) + '" cy="' + (rnd(i + 80) * 100).toFixed(1) +
        '" r="' + (0.5 + rnd(i + 120) * 0.9).toFixed(2) + '" fill="rgba(239,221,198,' + (0.08 + rnd(i + 160) * 0.22).toFixed(2) + ')"/>');
    }
    return '<svg class="plate__art" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<rect width="100" height="100" fill="url(#pg' + seed + ')"/>' +
      '<defs><linearGradient id="pg' + seed + '" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#' + (kind === 1 ? "4C0606" : "600808") + '"/>' +
        '<stop offset="1" stop-color="#' + (kind === 2 ? "240303" : "380404") + '"/>' +
      "</linearGradient></defs>" + parts.join("") + "</svg>";
  }

  function gallery() {
    var mount = $("[data-gallery]");
    if (!mount) return;
    var ratio = { full: "16x9", wide: "16x9", tall: "3x4", "": "4x3" };

    mount.innerHTML = D.GALLERY.map(function (g, i) {
      return '<button class="gal-item' + (g.size ? " gal-item--" + g.size : "") + '" type="button" data-gal="' + i +
          '" aria-label="Open ' + esc(g.title) + '" data-reveal="scale" style="--i:' + (i % 6) + '">' +
        '<div class="plate plate--' + ratio[g.size] + '">' +
          (g.src ? '<img src="' + esc(g.src) + '" alt="' + esc(g.title) + '" loading="lazy">' : plateArt(g.seed)) +
          '<div class="plate__cap"><h4>' + esc(g.title) + "</h4><p>" + esc(g.cap) + "</p></div>" +
        "</div>" +
        '<span class="gal-item__zoom" aria-hidden="true">' +
          '<svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M2 6V2h4M14 10v4h-4M14 6V2h-4M2 10v4h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        "</span>" +
      "</button>";
    }).join("");

    var lb = doc.createElement("div");
    lb.className = "modal";
    lb.id = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Gallery viewer");
    lb.setAttribute("aria-hidden", "true");
    lb.innerHTML =
      '<div class="modal__box" style="width:min(1080px,100%)">' +
        '<button class="modal__close" data-modal-close aria-label="Close viewer">' +
          '<svg viewBox="0 0 16 16" width="15" height="15" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
        "</button>" +
        '<button class="lightbox__nav lightbox__nav--prev" data-gal-prev aria-label="Previous image">' +
          '<svg viewBox="0 0 16 16" width="16" height="16" fill="none"><path d="M10 2 4 8l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
        '<button class="lightbox__nav lightbox__nav--next" data-gal-next aria-label="Next image">' +
          '<svg viewBox="0 0 16 16" width="16" height="16" fill="none"><path d="M6 2l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
        '<div class="lightbox__frame" data-gal-frame></div>' +
        '<div class="modal__body" style="padding:1.4rem 1.8rem 1.8rem">' +
          '<div class="row row--between">' +
            '<div><h3 class="t-h3" data-gal-title></h3><p class="t-sm t-muted" data-gal-cap></p></div>' +
            '<span class="badge badge--quiet" data-gal-count></span>' +
          "</div>" +
        "</div>" +
      "</div>";
    doc.body.appendChild(lb);

    var idx = 0;
    function show(i) {
      idx = (i + D.GALLERY.length) % D.GALLERY.length;
      var g = D.GALLERY[idx];
      $("[data-gal-frame]", lb).innerHTML = g.src
        ? '<img src="' + esc(g.src) + '" alt="' + esc(g.title) + '">'
        : plateArt(g.seed);
      $("[data-gal-title]", lb).textContent = g.title;
      $("[data-gal-cap]", lb).textContent = g.cap + " · " + g.year;
      $("[data-gal-count]", lb).textContent = (idx + 1) + " / " + D.GALLERY.length;
    }

    mount.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-gal]");
      if (!btn) return;
      show(parseInt(btn.dataset.gal, 10));
      if (window.MG20Modal) window.MG20Modal.open("lightbox", btn);
    });
    $("[data-gal-prev]", lb).addEventListener("click", function () { show(idx - 1); });
    $("[data-gal-next]", lb).addEventListener("click", function () { show(idx + 1); });
    doc.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ======================================================================
     FEES
     ====================================================================== */
  function fees() {
    var mount = $("[data-fees]");
    if (!mount) return;
    mount.innerHTML = D.FEES.map(function (f) {
      return '<article class="fee-card' + (f.featured ? " fee-card--featured" : "") + '" data-reveal>' +
        (f.ribbon ? '<span class="fee-ribbon">' + esc(f.ribbon) + "</span>" : "") +
        '<h3 class="fee-card__name">' + esc(f.name) + "</h3>" +
        '<div class="fee-card__price">' + esc(f.price) + "<small>" + esc(f.per) + "</small></div>" +
        '<ul class="fee-card__list">' + f.includes.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
      "</article>";
    }).join("");
  }

  /* ======================================================================
     DEADLINES
     ====================================================================== */
  function deadlines() {
    $$("[data-deadlines]").forEach(function (mount) {
      mount.innerHTML = D.EVENT.deadlines.map(function (d) {
        return '<div class="reg-summary__row"><dt>' + esc(d.k) + "</dt><dd>" + esc(d.v) + "</dd></div>";
      }).join("");
    });
  }

  /* ======================================================================
     COMMITTEE SELECT OPTIONS (registration form)
     ====================================================================== */
  function committeeOptions() {
    $$("[data-committee-options]").forEach(function (sel) {
      var keep = sel.innerHTML;
      sel.innerHTML = keep + D.COMMITTEES.map(function (c) {
        return '<option value="' + c.id + '">' + esc(c.name) + " (" + esc(c.abbr) + ")</option>";
      }).join("");
    });
    $$("[data-country-options]").forEach(function (sel) {
      var keep = sel.innerHTML;
      sel.innerHTML = keep + D.COUNTRIES.map(function (c) {
        return '<option value="' + c.code + '">' + esc(c.name) + "</option>";
      }).join("");
    });
    /* Deep link: register.html?committee=dewg preselects the committee. */
    var pre = new URLSearchParams(window.location.search).get("committee");
    if (pre) {
      var first = $('[data-committee-options][name="committee1"]');
      if (first) first.value = pre;
    }
  }

  function init() {
    if (!D) return;
    stats();
    marqueeContent();
    committees();
    committeeTracks();
    schedule();
    secretariat();
    resources();
    faqs();
    gallery();
    fees();
    deadlines();
    committeeOptions();
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init);
  else init();
})();
