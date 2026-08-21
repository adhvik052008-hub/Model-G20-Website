/* ==========================================================================
   SCHOOL OF RAYA MODEL G20 2026 — CONTENT RENDERERS
   Each renderer looks for its mount point and does nothing if absent, so a
   single script serves every page. Runs before app.js so that reveal
   observers see the finished DOM.
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

  var ARROW = '<svg class="btn__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* Committee icons. Single stroke weight, 24-grid, all currentColor. */
  var ICON = {
    rights:  '<path d="M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" stroke="currentColor" stroke-width="1.4"/><path d="M4 21a8 8 0 0 1 16 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    leaf:    '<path d="M20 4C10 4 4 9 4 16c0 2 .6 3.4 1.4 4.3C9 16 13 13.5 18 12c-4 2.6-7.2 5.4-9.4 9 1 .6 2.2.9 3.4.9 5 0 8-4.6 8-10 0-3.6-.4-6.4 0-7.9Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
    circuit: '<rect x="8" y="8" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M10 8V4m4 4V4m-4 16v-4m4 4v-4M8 10H4m4 4H4m16-4h-4m4 4h-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    balance: '<path d="M12 4v16M7 20h10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M4 8h16M4 8l-2 6a3.2 3.2 0 0 0 4 0L4 8Zm16 0-2 6a3.2 3.2 0 0 0 4 0l-2-6Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="12" cy="5" r="1.6" stroke="currentColor" stroke-width="1.4"/>',
    shield:  '<path d="M12 3 5 6v6c0 4.2 2.9 7.8 7 9 4.1-1.2 7-4.8 7-9V6l-7-3Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="m9 12 2.2 2.2L15.5 10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>',
    gavel:   '<path d="m5 19 6-6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="m9.5 8.5 6 6M13 5l6 6M11.2 6.8 9 9m6 6-2.2 2.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M3 21h8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    build:   '<path d="M4 21V9l6-4 6 4v12" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M16 12h4v9M3 21h18M9 21v-5h2v5" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
    chart:   '<path d="M3 20h18" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M6 20v-6m4 6V8m4 12v-9m4 9V5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>'
  };

  var SOCIAL_ICON = {
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.4"/><circle cx="17" cy="7" r="1.1" fill="currentColor"/>',
    linkedin:  '<rect x="3.5" y="3.5" width="17" height="17" rx="2.5" stroke="currentColor" stroke-width="1.4"/><path d="M8 10.5V17M8 7.4v.1M12 17v-3.6a2 2 0 0 1 4 0V17" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    x:         '<path d="m4 4 16 16M20 4 4 20" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    youtube:   '<rect x="2.5" y="5.5" width="19" height="13" rx="4" stroke="currentColor" stroke-width="1.4"/><path d="m10.5 9.5 4.5 2.5-4.5 2.5v-5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>'
  };

  function svg(inner, cls) {
    return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" aria-hidden="true">' + inner + "</svg>";
  }

  /* ======================================================================
     COMMITTEES — one grid, no tracks
     ====================================================================== */
  function committees() {
    var mount = $("[data-committees]");
    if (!mount) return;

    mount.innerHTML = D.COMMITTEES.map(function (c, i) {
      return '<article class="cmte" id="' + esc(c.id) + '" data-reveal style="--i:' + (i % 3) + '">' +
        '<div class="cmte__top">' +
          '<span class="cmte__icon">' + svg(ICON[c.icon] || ICON.chart) + "</span>" +
          '<span class="badge badge--' + c.level.toLowerCase() + '">' + esc(c.level) + "</span>" +
        "</div>" +
        '<h3 class="cmte__name">' + esc(c.name) + "</h3>" +
        '<p class="cmte__label">Agenda</p>' +
        '<p class="cmte__agenda">' + esc(c.agenda) + "</p>" +
      "</article>";
    }).join("");
  }

  /* ======================================================================
     KEY DATES — the homepage timeline
     ====================================================================== */
  function keyDates() {
    $$("[data-key-dates]").forEach(function (mount) {
      mount.innerHTML = D.KEY_DATES.map(function (d, i) {
        return '<li class="kd' + (d.key ? " kd--key" : "") + ' is-' + d.state + '" data-reveal style="--i:' + i + '">' +
          '<span class="kd__dot" aria-hidden="true"></span>' +
          '<span class="kd__date">' + esc(d.v) + "</span>" +
          '<span class="kd__title">' + esc(d.k) + "</span>" +
          (d.note ? '<span class="kd__note">' + esc(d.note) + "</span>" : "") +
        "</li>";
      }).join("");
    });
  }

  /* ======================================================================
     TEAM — Core Secretariat and Organising Committee
     ====================================================================== */
  function personCard(p, i) {
    var portrait = p.photo
      ? '<img class="person__photo" src="' + esc(p.photo) + '" alt="' + esc(p.name) + '" loading="lazy" width="320" height="320">'
      : '<span class="person__plate" aria-hidden="true"><b>' + esc(p.initials || p.abbr) + "</b></span>";

    return '<article class="person" data-reveal style="--i:' + (i % 3) + '">' +
      '<div class="person__portrait">' + portrait + "</div>" +
      '<div class="person__body">' +
        '<span class="person__abbr">' + esc(p.abbr) + "</span>" +
        '<h3 class="person__name">' + esc(p.name) + "</h3>" +
        '<p class="person__office">' + esc(p.office) + "</p>" +
        (p.remit ? '<p class="person__remit">' + esc(p.remit) + "</p>" : "") +
      "</div>" +
    "</article>";
  }

  function team() {
    $$("[data-team]").forEach(function (mount) {
      var which = mount.getAttribute("data-team");
      var list  = which === "organising" ? D.ORGANISING : D.SECRETARIAT;
      var limit = parseInt(mount.getAttribute("data-limit"), 10);
      if (limit > 0) list = list.slice(0, limit);
      mount.innerHTML = list.map(personCard).join("");
    });
  }

  /* ======================================================================
     PARTNERS
     ====================================================================== */
  function partners() {
    $$("[data-partners]").forEach(function (mount) {
      mount.innerHTML = D.PARTNERS.map(function (p, i) {
        var mark = p.logo
          ? '<img src="' + esc(p.logo) + '" alt="' + esc(p.name) + '" loading="lazy" width="260" height="96">'
          : "<b>" + esc(p.mark) + "</b><span>" + esc(p.sub) + "</span>";
        return '<article class="partner" data-reveal style="--i:' + i + '">' +
          '<div class="partner__mark">' + mark + "</div>" +
          '<p class="partner__role">' + esc(p.role) + "</p>" +
        "</article>";
      }).join("");
    });
  }

  /* ======================================================================
     SOCIAL LINKS
     ====================================================================== */
  function socials() {
    $$("[data-socials]").forEach(function (mount) {
      mount.innerHTML = D.SOCIALS.map(function (s) {
        return '<a class="social" href="' + esc(s.url) + '" aria-label="' + esc(s.name) + '">' +
          svg(SOCIAL_ICON[s.icon] || SOCIAL_ICON.x) +
          "<span>" + esc(s.handle) + "</span>" +
        "</a>";
      }).join("");
    });
  }

  /* ======================================================================
     EVENT DETAILS — fills any [data-event="key"] with EVENT[key]
     ====================================================================== */
  function eventDetails() {
    $$("[data-event]").forEach(function (el) {
      var v = D.EVENT[el.getAttribute("data-event")];
      if (v == null) return;
      if (el.tagName === "A") {
        el.textContent = v;
        var href = el.getAttribute("href") || "";
        if (href === "#mail") el.href = "mailto:" + v;
        else if (href === "#tel") el.href = "tel:" + String(v).replace(/[^\d+]/g, "");
      } else if (el.tagName === "IFRAME") {
        el.src = v;
      } else {
        el.textContent = v;
      }
    });
  }

  /* ======================================================================
     COMMITTEE OPTIONS — the registration form's select
     ====================================================================== */
  function committeeOptions() {
    $$("[data-committee-options]").forEach(function (sel) {
      var keep = sel.querySelector("option[value='']");
      sel.innerHTML = (keep ? keep.outerHTML : "") + D.COMMITTEES.map(function (c) {
        return '<option value="' + esc(c.id) + '">' + esc(c.name) + " — " + esc(c.level) + "</option>";
      }).join("");
    });

    var pre = new URLSearchParams(window.location.search).get("committee");
    if (pre) {
      var first = $("[data-committee-options]");
      if (first) first.value = pre;
    }
  }

  function init() {
    if (!D) return;
    committees();
    keyDates();
    team();
    partners();
    socials();
    eventDetails();
    committeeOptions();
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init);
  else init();
})();
