/* ==========================================================================
   MODEL G20 2026 — COUNTRY MATRIX
   Search, filter and read the full delegation allotment across every
   committee. Two presentations off one data set: the wide grid for scanning
   the whole conference, and a focused list when a single committee is chosen.
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;
  var $  = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  function init() {
    var root = $("[data-matrix]");
    if (!root) return;
    var D = window.MG20;
    var esc = window.MG20esc;

    var state = {
      q: "",
      committee: new URLSearchParams(window.location.search).get("committee") || "all",
      group: "all",
      openOnly: false
    };

    var GROUPS = [
      { id: "all", label: "All delegations" },
      { id: "member", label: "G20 members" },
      { id: "invited", label: "Invited states" },
      { id: "org", label: "Organisations" }
    ];

    /* ---- Controls ----------------------------------------------------- */
    var cmtFilters = $("[data-matrix-committees]", root);
    if (cmtFilters) {
      cmtFilters.innerHTML =
        '<button class="chip" type="button" data-cmt="all">Every committee</button>' +
        D.COMMITTEES.map(function (c) {
          return '<button class="chip" type="button" data-cmt="' + c.id + '" title="' + esc(c.name) + '">' + esc(c.abbr) + "</button>";
        }).join("");
    }
    var grpFilters = $("[data-matrix-groups]", root);
    if (grpFilters) {
      grpFilters.innerHTML = GROUPS.map(function (g) {
        return '<button class="chip" type="button" data-grp="' + g.id + '">' + esc(g.label) + "</button>";
      }).join("");
    }

    var out = $("[data-matrix-out]", root);
    var summary = $("[data-matrix-summary]", root);
    var search = $("[data-matrix-search]", root);

    /* ---- Filtering ---------------------------------------------------- */
    function visibleCommittees() {
      return state.committee === "all"
        ? D.COMMITTEES
        : D.COMMITTEES.filter(function (c) { return c.id === state.committee; });
    }

    function rowsFor(committees) {
      var q = state.q.trim().toLowerCase();
      return D.COUNTRIES.filter(function (c) {
        if (state.group !== "all" && c.group !== state.group) return false;
        if (q && c.name.toLowerCase().indexOf(q) < 0 && c.code.toLowerCase().indexOf(q) < 0 &&
            c.region.toLowerCase().indexOf(q) < 0) return false;
        var seated = committees.some(function (cm) {
          return D.seatsFor(cm).some(function (x) { return x.code === c.code; });
        });
        if (!seated) return false;
        if (state.openOnly) {
          return committees.some(function (cm) {
            return D.seatsFor(cm).some(function (x) { return x.code === c.code; }) &&
                   D.statusFor(cm.id, c.code) !== "closed";
          });
        }
        return true;
      });
    }

    function cellFor(committee, country) {
      var seated = D.seatsFor(committee).some(function (x) { return x.code === country.code; });
      if (!seated) return '<span class="t-faint" aria-label="Not seated">—</span>';
      var st = D.statusFor(committee.id, country.code);
      return '<span class="avail avail--' + st + '">' + D.STATUS_LABEL[st] + "</span>";
    }

    /* ---- Views -------------------------------------------------------- */
    function renderGrid(committees, rows) {
      return '<div class="table-wrap"><table class="table table--matrix">' +
        "<caption class=\"visually-hidden\">Delegation availability by committee</caption>" +
        "<thead><tr><th scope=\"col\">Delegation</th>" +
          committees.map(function (c) {
            return '<th scope="col" title="' + esc(c.name) + '">' + esc(c.abbr) + "</th>";
          }).join("") +
        "</tr></thead><tbody>" +
        rows.map(function (c) {
          return "<tr>" +
            '<th scope="row"><span class="table__country">' +
              '<span class="flag' + (c.group === "org" ? " flag--org" : "") + '" aria-hidden="true">' + esc(c.code) + "</span>" +
              esc(c.name) +
            "</span></th>" +
            committees.map(function (cm) { return "<td>" + cellFor(cm, c) + "</td>"; }).join("") +
          "</tr>";
        }).join("") +
        "</tbody></table></div>";
    }

    function renderFocused(committee, rows) {
      return '<div class="stack-5">' +
        '<div class="card card--muted">' +
          '<span class="eyebrow">' + esc(committee.abbr) + " · " + esc(committee.track) + "</span>" +
          '<h3 class="card__title">' + esc(committee.name) + "</h3>" +
          '<p class="t-sm t-quiet-italic">' + esc(committee.agenda) + "</p>" +
        "</div>" +
        '<div class="matrix-cards">' +
        rows.map(function (c) {
          var st = D.statusFor(committee.id, c.code);
          return '<div class="mx-card">' +
            '<span class="flag' + (c.group === "org" ? " flag--org" : "") + '" aria-hidden="true">' + esc(c.code) + "</span>" +
            "<span>" +
              '<span class="mx-card__name">' + esc(c.name) + "</span><br>" +
              '<span class="mx-card__meta">' + esc(c.region) + " · " +
                (c.group === "member" ? "G20 member" : c.group === "invited" ? "Invited state" : "Organisation") +
              "</span>" +
            "</span>" +
            '<span class="avail avail--' + st + '">' + D.STATUS_LABEL[st] + "</span>" +
          "</div>";
        }).join("") +
        "</div></div>";
    }

    function paint() {
      var committees = visibleCommittees();
      var rows = rowsFor(committees);

      $$("[data-cmt]", root).forEach(function (b) { b.classList.toggle("is-active", b.dataset.cmt === state.committee); });
      $$("[data-grp]", root).forEach(function (b) { b.classList.toggle("is-active", b.dataset.grp === state.group); });
      var toggle = $("[data-matrix-open]", root);
      if (toggle) toggle.setAttribute("aria-pressed", String(state.openOnly));

      if (!rows.length) {
        out.innerHTML =
          '<div class="empty"><div class="empty__mark">' +
            '<svg viewBox="0 0 20 20" width="20" height="20" fill="none"><circle cx="9" cy="9" r="6.2" stroke="currentColor" stroke-width="1.5"/><path d="M13.5 13.5 18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' +
          "</div>" +
          "<h3 class=\"t-h3\">No delegation matches</h3>" +
          '<p class="t-sm">Try a different spelling, or clear the filters to see all ' + D.COUNTRIES.length + " delegations.</p>" +
          '<button class="btn btn--ghost btn--sm" type="button" data-matrix-reset>Clear filters</button></div>';
      } else if (committees.length === 1) {
        out.innerHTML = renderFocused(committees[0], rows);
      } else {
        out.innerHTML = renderGrid(committees, rows);
      }

      if (summary) {
        var openSeats = 0, totalSeats = 0;
        committees.forEach(function (cm) {
          D.seatsFor(cm).forEach(function (c) {
            totalSeats++;
            if (D.statusFor(cm.id, c.code) !== "closed") openSeats++;
          });
        });
        summary.innerHTML =
          "<span>Showing <strong>" + rows.length + "</strong> of " + D.COUNTRIES.length + " delegations</span>" +
          "<span><strong>" + openSeats + "</strong> seats available of " + totalSeats + "</span>" +
          "<span>Across <strong>" + committees.length + "</strong> " + (committees.length === 1 ? "committee" : "committees") + "</span>";
      }
    }

    /* ---- Events ------------------------------------------------------- */
    if (search) {
      search.addEventListener("input", function () { state.q = search.value; paint(); });
    }
    root.addEventListener("click", function (e) {
      var cmt = e.target.closest("[data-cmt]");
      if (cmt) { state.committee = cmt.dataset.cmt; paint(); return; }
      var grp = e.target.closest("[data-grp]");
      if (grp) { state.group = grp.dataset.grp; paint(); return; }
      var tog = e.target.closest("[data-matrix-open]");
      if (tog) { state.openOnly = !state.openOnly; paint(); return; }
      var reset = e.target.closest("[data-matrix-reset]");
      if (reset) {
        state = { q: "", committee: "all", group: "all", openOnly: false };
        if (search) { search.value = ""; search.dispatchEvent(new Event("input", { bubbles: true })); }
        paint();
      }
    });

    paint();
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init);
  else init();
})();
