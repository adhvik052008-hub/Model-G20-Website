/* ==========================================================================
   MODEL G20 2026 — INTERACTIVE DELEGATION MAP
   Renders a dot-matrix world from WORLD geometry, plots every delegation at
   its real coordinates, and draws arcs converging on the host campus.

   Usage:  <div class="worldmap" data-worldmap="hero|full"></div>
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;
  var $  = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var NS = "http://www.w3.org/2000/svg";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(name, attrs) {
    var node = doc.createElementNS(NS, name);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) node.setAttribute(k, attrs[k]);
    return node;
  }

  /* A shallow great-circle-ish arc: quadratic bezier bowed away from the
     equator side, with the bow scaled to the chord length. */
  function arcPath(a, b) {
    var mx = (a[0] + b[0]) / 2;
    var my = (a[1] + b[1]) / 2;
    var dx = b[0] - a[0];
    var dy = b[1] - a[1];
    var dist = Math.sqrt(dx * dx + dy * dy);
    var bow = Math.min(dist * 0.28, 90);
    /* Perpendicular offset, always bowing "up" for a consistent read. */
    var nx = -dy / (dist || 1);
    var ny = dx / (dist || 1);
    if (ny > 0) { nx = -nx; ny = -ny; }
    return "M" + a[0].toFixed(1) + "," + a[1].toFixed(1) +
           " Q" + (mx + nx * bow).toFixed(1) + "," + (my + ny * bow).toFixed(1) +
           " " + b[0].toFixed(1) + "," + b[1].toFixed(1);
  }

  function build(container) {
    var W = window.WORLD;
    var D = window.MG20;
    if (!W || !D) return;

    var mode = container.dataset.worldmap || "full";
    var interactive = mode === "full";
    var step = parseFloat(container.dataset.step) || (mode === "hero" ? 2.6 : 2.2);

    var svg = el("svg", {
      viewBox: "0 0 " + W.VIEW_W + " " + W.VIEW_H,
      class: "worldmap__canvas",
      role: interactive ? "group" : "presentation",
      "aria-label": interactive
        ? "Map of participating delegations, plotted at national capitals"
        : ""
    });
    if (!interactive) svg.setAttribute("aria-hidden", "true");

    /* --- Landmass lattice ------------------------------------------------ */
    var dots = W.sampleDots(step);
    var r = mode === "hero" ? 1.35 : 1.5;
    var lattice = el("g", { class: "wm-lattice" });
    /* One path of tiny circles is far cheaper than 3,000 <circle> nodes. */
    var d = dots.map(function (p) {
      return "M" + p[0] + "," + (p[1] - r) +
             "a" + r + "," + r + " 0 1,0 0," + (r * 2) +
             "a" + r + "," + r + " 0 1,0 0," + (-r * 2);
    }).join("");
    lattice.appendChild(el("path", { d: d, class: "wm-dot" }));
    svg.appendChild(lattice);

    /* --- Host node ------------------------------------------------------- */
    var host = W.project(D.EVENT.venueLon, D.EVENT.venueLat);
    var pins = D.COUNTRIES.filter(function (c) {
      return typeof c.lat === "number" && typeof c.lon === "number";
    });

    /* --- Arcs ------------------------------------------------------------ */
    var arcGroup = el("g", { class: "wm-arcs" });
    if (!reduced) {
      var arcFrom = ["US", "BR", "GB", "ZA", "JP", "AU", "RU", "CN", "SA", "CA", "AR", "NG"];
      arcFrom.forEach(function (code, i) {
        var c = D.country(code);
        if (!c || typeof c.lat !== "number") return;
        var p = W.project(c.lon, c.lat);
        var path = el("path", { d: arcPath(p, host), class: "wm-arc" });
        var len = Math.hypot(p[0] - host[0], p[1] - host[1]) * 1.5;
        path.style.setProperty("--len", len.toFixed(0));
        path.style.animationDelay = (i * 0.22 + 0.5).toFixed(2) + "s";
        arcGroup.appendChild(path);
      });
    }
    svg.appendChild(arcGroup);

    /* --- Delegation pins -------------------------------------------------- */
    var nodeGroup = el("g", { class: "wm-nodes" });
    pins.forEach(function (c) {
      var p = W.project(c.lon, c.lat);
      var g = el("g", {
        class: "wm-node" + (c.group === "invited" ? " is-org" : ""),
        transform: "translate(" + p[0].toFixed(1) + "," + p[1].toFixed(1) + ")"
      });
      g.appendChild(el("circle", { class: "wm-node__halo", r: 11 }));
      g.appendChild(el("circle", { class: "wm-node__pin", r: mode === "hero" ? 2.6 : 3.4 }));
      if (interactive) {
        g.setAttribute("tabindex", "0");
        g.setAttribute("role", "button");
        g.setAttribute("aria-label", c.name + " — " + (c.group === "member" ? "G20 member" : "invited state"));
        g.dataset.code = c.code;
        /* Enlarge the hit area without enlarging the mark. */
        g.appendChild(el("circle", { r: 9, fill: "transparent" }));
      } else {
        g.setAttribute("aria-hidden", "true");
        g.style.pointerEvents = "none";
      }
      nodeGroup.appendChild(g);
    });
    svg.appendChild(nodeGroup);

    /* --- Host marker ------------------------------------------------------ */
    var hostG = el("g", {
      class: "wm-host",
      transform: "translate(" + host[0].toFixed(1) + "," + host[1].toFixed(1) + ")"
    });
    if (!reduced) {
      for (var i = 0; i < 3; i++) hostG.appendChild(el("circle", { class: "wm-host__ring", r: 14 }));
    }
    hostG.appendChild(el("circle", { r: 5.2, fill: "var(--maroon-600)", stroke: "var(--parchment-100)", "stroke-width": "1.4" }));
    hostG.appendChild(el("circle", { r: 1.8, fill: "var(--parchment-100)" }));
    hostG.setAttribute("aria-hidden", "true");
    svg.appendChild(hostG);

    container.appendChild(svg);

    /* --- Info panel ------------------------------------------------------- */
    if (!interactive) return;

    var info = doc.createElement("div");
    info.className = "wm-info is-idle";
    info.setAttribute("aria-live", "polite");
    container.appendChild(info);

    var idle = {
      name: D.EVENT.venueName,
      rows: [
        ["Host", D.EVENT.host],
        ["Summit", D.EVENT.datesLabel],
        ["Delegations", pins.length + " plotted"]
      ],
      hint: "Select a delegation to view its seat."
    };

    function paint(state) {
      info.innerHTML =
        '<div class="wm-info__name">' + window.MG20esc(state.name) + "</div>" +
        '<dl class="wm-info__grid">' +
          state.rows.map(function (r) {
            return "<dt>" + r[0] + "</dt><dd>" + window.MG20esc(r[1]) + "</dd>";
          }).join("") +
        "</dl>" +
        (state.hint ? '<p class="t-xs t-faint">' + state.hint + "</p>" : "");
    }
    paint(idle);

    var active = null;
    function show(code) {
      var c = D.country(code);
      if (!c) return;
      var open = D.COMMITTEES.filter(function (cm) {
        return D.seatsFor(cm).some(function (x) { return x.code === code; }) &&
               D.statusFor(cm.id, code) !== "closed";
      });
      paint({
        name: c.name,
        rows: [
          ["Status", c.group === "member" ? "G20 member" : c.group === "invited" ? "Invited state" : "Organisation"],
          ["Region", c.region],
          ["Seats open", open.length + " of " + D.COMMITTEES.length + " committees"]
        ],
        hint: open.length
          ? "Open in " + open.slice(0, 5).map(function (o) { return o.abbr; }).join(" · ")
          : "Fully allotted across every committee."
      });
      info.classList.remove("is-idle");
      $$(".wm-node", svg).forEach(function (n) { n.classList.toggle("is-active", n.dataset.code === code); });
      active = code;
    }
    function clear() {
      if (!active) return;
      paint(idle);
      info.classList.add("is-idle");
      $$(".wm-node.is-active", svg).forEach(function (n) { n.classList.remove("is-active"); });
      active = null;
    }

    $$(".wm-node", svg).forEach(function (n) {
      n.addEventListener("mouseenter", function () { show(n.dataset.code); });
      n.addEventListener("focus", function () { show(n.dataset.code); });
      n.addEventListener("click", function () { show(n.dataset.code); });
      n.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(n.dataset.code); }
      });
    });
    svg.addEventListener("mouseleave", clear);
    container.addEventListener("focusout", function (e) {
      if (!container.contains(e.relatedTarget)) clear();
    });
  }

  function init() {
    $$("[data-worldmap]").forEach(function (c) {
      if (c.dataset.built) return;
      c.dataset.built = "1";
      build(c);
    });
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init);
  else init();
})();
