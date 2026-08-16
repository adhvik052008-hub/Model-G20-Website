/* ==========================================================================
   MODEL G20 2026 — INTERACTION LAYER
   Progressive enhancement only: every behaviour here layers onto markup that
   already works without it. No dependencies.
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var $  = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var on = function (el, ev, fn, opt) { if (el) el.addEventListener(ev, fn, opt); };

  root.classList.add("js");

  /* ======================================================================
     CURTAIN — the summit "seal" lift on first paint
     ====================================================================== */
  function curtain() {
    var el = $(".curtain");
    if (!el) return;
    var lift = function () {
      el.classList.add("is-lifted");
      window.setTimeout(function () { el.remove(); }, 1500);
      doc.body.classList.remove("is-locked");
    };
    doc.body.classList.add("is-locked");
    if (reduced) { lift(); return; }
    /* Hold briefly so the mark registers, then lift regardless of load state. */
    window.setTimeout(lift, 900);
  }

  /* ======================================================================
     NAVIGATION
     ====================================================================== */
  function nav() {
    var bar = $(".site-nav");
    if (!bar) return;

    var lastY = window.scrollY;
    var ticking = false;

    function update() {
      var y = window.scrollY;
      bar.classList.toggle("is-stuck", y > 40);
      /* Hide on downward scroll once past the fold, reveal on any scroll up. */
      if (y > 420 && y > lastY + 6) bar.classList.add("is-hidden");
      else if (y < lastY - 6 || y < 200) bar.classList.remove("is-hidden");
      lastY = y;
      ticking = false;
    }
    on(window, "scroll", function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();

    /* Drawer */
    var burger = $(".burger");
    var drawer = $(".drawer");
    if (burger && drawer) {
      var setOpen = function (open) {
        burger.setAttribute("aria-expanded", String(open));
        drawer.classList.toggle("is-open", open);
        drawer.setAttribute("aria-hidden", String(!open));
        doc.body.classList.toggle("is-locked", open);
        bar.classList.remove("is-hidden");
      };
      on(burger, "click", function () {
        setOpen(burger.getAttribute("aria-expanded") !== "true");
      });
      $$(".drawer__link", drawer).forEach(function (a, i) {
        a.style.setProperty("--i", i);
        on(a, "click", function () { setOpen(false); });
      });
      on(doc, "keydown", function (e) {
        if (e.key === "Escape" && drawer.classList.contains("is-open")) setOpen(false);
      });
    }

    /* Overflow menu */
    var more = $(".nav-more");
    if (more) {
      var btn = $(".nav-more__btn", more);
      var close = function () { more.classList.remove("is-open"); if (btn) btn.setAttribute("aria-expanded", "false"); };
      on(btn, "click", function (e) {
        e.stopPropagation();
        var open = !more.classList.contains("is-open");
        more.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", String(open));
      });
      on(doc, "click", function (e) { if (!more.contains(e.target)) close(); });
      on(doc, "keydown", function (e) { if (e.key === "Escape") close(); });
    }
  }

  /* ======================================================================
     SCROLL REVEAL
     ====================================================================== */
  function reveal() {
    var nodes = $$("[data-reveal], .reveal-mask");
    if (!nodes.length) return;
    if (!("IntersectionObserver" in window) || reduced) {
      nodes.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    nodes.forEach(function (n) { io.observe(n); });

    /* Auto-stagger direct children of any [data-reveal-group] */
    $$("[data-reveal-group]").forEach(function (group) {
      $$(":scope > *", group).forEach(function (child, i) {
        if (!child.hasAttribute("data-reveal")) child.setAttribute("data-reveal", "");
        child.style.setProperty("--i", i % 8);
        io.observe(child);
      });
    });
  }

  /* ======================================================================
     COUNTDOWN
     ====================================================================== */
  function countdown() {
    var boxes = $$("[data-countdown]");
    if (!boxes.length) return;
    var target = new Date((window.MG20 && MG20.EVENT.startISO) || "2026-11-13T09:00:00+05:30").getTime();

    var UNITS = [
      { k: "days", label: "Days", ms: 864e5 },
      { k: "hours", label: "Hours", ms: 36e5 },
      { k: "minutes", label: "Minutes", ms: 6e4 },
      { k: "seconds", label: "Seconds", ms: 1e3 }
    ];

    boxes.forEach(function (box) {
      if (box.dataset.built) return;
      box.dataset.built = "1";
      box.innerHTML = UNITS.map(function (u) {
        return '<div class="cd-unit"><span class="cd-unit__value" data-u="' + u.k + '" aria-hidden="true">--</span>' +
               '<span class="cd-unit__label">' + u.label + '</span></div>';
      }).join("");
      box.setAttribute("role", "timer");
      var live = doc.createElement("span");
      live.className = "visually-hidden";
      live.setAttribute("aria-live", "polite");
      box.appendChild(live);
      box._live = live;
    });

    var prev = {};
    function tick() {
      var diff = target - Date.now();
      var over = diff <= 0;
      if (over) diff = 0;
      var rest = diff;
      var vals = {};
      UNITS.forEach(function (u) {
        vals[u.k] = Math.floor(rest / u.ms);
        rest -= vals[u.k] * u.ms;
      });

      boxes.forEach(function (box) {
        UNITS.forEach(function (u) {
          var el = $('[data-u="' + u.k + '"]', box);
          if (!el) return;
          var str = String(vals[u.k]);
          if (u.k !== "days") str = str.padStart(2, "0");
          if (el.textContent === str) return;
          el.textContent = str;
          if (!reduced && u.k !== "seconds") {
            el.classList.remove("is-tick");
            void el.offsetWidth;
            el.classList.add("is-tick");
          }
        });
        if (box._live && prev.days !== vals.days) {
          box._live.textContent = over
            ? "The summit is under way."
            : vals.days + " days, " + vals.hours + " hours until the summit opens.";
        }
      });
      prev = vals;

      $$("[data-countdown-over]").forEach(function (el) { el.hidden = !over; });
      $$("[data-countdown-live]").forEach(function (el) { el.hidden = over; });
    }
    tick();
    window.setInterval(tick, 1000);
  }

  /* ======================================================================
     ANIMATED COUNTERS
     ====================================================================== */
  function counters() {
    var nodes = $$("[data-count]");
    if (!nodes.length) return;
    if (!("IntersectionObserver" in window) || reduced) {
      nodes.forEach(function (n) { n.textContent = n.dataset.count + (n.dataset.suffix || ""); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);
        var to = parseFloat(el.dataset.count) || 0;
        var suffix = el.dataset.suffix || "";
        var dur = 1500;
        var start = performance.now();
        (function step(now) {
          var p = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 4);
          el.textContent = Math.round(to * eased) + (p === 1 ? suffix : "");
          if (p < 1) requestAnimationFrame(step);
        })(start);
      });
    }, { threshold: 0.4 });
    nodes.forEach(function (n) { n.textContent = "0"; io.observe(n); });
  }

  /* ======================================================================
     CUSTOM CURSOR
     ====================================================================== */
  function cursor() {
    if (reduced || window.matchMedia("(pointer: coarse)").matches) return;
    var el = doc.createElement("div");
    el.className = "cursor";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = '<div class="cursor__ring"></div><div class="cursor__dot"></div>';
    doc.body.appendChild(el);
    var ring = $(".cursor__ring", el);
    var dot = $(".cursor__dot", el);

    var tx = 0, ty = 0, rx = 0, ry = 0;
    on(window, "mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      el.classList.add("is-active");
      dot.style.transform = "translate3d(" + tx + "px," + ty + "px,0)";
    }, { passive: true });
    on(doc, "mouseleave", function () { el.classList.remove("is-active"); });

    (function loop() {
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
      requestAnimationFrame(loop);
    })();

    var HOVER = 'a, button, [role="button"], input, select, textarea, .card--interactive, .wm-node, .gal-item, label.choice';
    on(doc, "mouseover", function (e) {
      if (e.target.closest && e.target.closest(HOVER)) el.classList.add("is-hover");
    });
    on(doc, "mouseout", function (e) {
      if (e.target.closest && e.target.closest(HOVER)) el.classList.remove("is-hover");
    });
  }

  /* ======================================================================
     ACCORDION
     ====================================================================== */
  function accordion() {
    $$(".accordion").forEach(function (acc) {
      var single = acc.dataset.single === "true";
      $$(".acc-trigger", acc).forEach(function (btn) {
        on(btn, "click", function () {
          var item = btn.closest(".acc-item");
          var open = item.classList.contains("is-open");
          if (single && !open) {
            $$(".acc-item.is-open", acc).forEach(function (o) {
              o.classList.remove("is-open");
              $(".acc-trigger", o).setAttribute("aria-expanded", "false");
            });
          }
          item.classList.toggle("is-open", !open);
          btn.setAttribute("aria-expanded", String(!open));
        });
      });
    });
  }

  /* ======================================================================
     TABS  — <div data-tabs> with [role=tab][aria-controls]
     ====================================================================== */
  function tabs() {
    $$("[data-tabs]").forEach(function (wrap) {
      var btns = $$('[role="tab"]', wrap);
      if (!btns.length) return;

      function select(btn, focus) {
        btns.forEach(function (b) {
          var on_ = b === btn;
          b.setAttribute("aria-selected", String(on_));
          b.tabIndex = on_ ? 0 : -1;
          var panel = doc.getElementById(b.getAttribute("aria-controls"));
          if (panel) panel.hidden = !on_;
        });
        if (focus) btn.focus();
      }

      btns.forEach(function (btn, i) {
        on(btn, "click", function () { select(btn); });
        on(btn, "keydown", function (e) {
          var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          select(btns[(i + d + btns.length) % btns.length], true);
        });
      });
      select(btns.filter(function (b) { return b.getAttribute("aria-selected") === "true"; })[0] || btns[0]);
    });
  }

  /* ======================================================================
     MODAL
     ====================================================================== */
  var Modal = {
    open: function (id, opener) {
      var m = doc.getElementById(id);
      if (!m) return;
      m.classList.add("is-open");
      m.setAttribute("aria-hidden", "false");
      doc.body.classList.add("is-locked");
      m._opener = opener || doc.activeElement;
      var focusable = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', m);
      if (focusable.length) focusable[0].focus();
    },
    close: function (m) {
      if (!m) return;
      m.classList.remove("is-open");
      m.setAttribute("aria-hidden", "true");
      doc.body.classList.remove("is-locked");
      if (m._opener && m._opener.focus) m._opener.focus();
    }
  };
  window.MG20Modal = Modal;

  function modals() {
    on(doc, "click", function (e) {
      var opener = e.target.closest("[data-modal-open]");
      if (opener) { e.preventDefault(); Modal.open(opener.dataset.modalOpen, opener); return; }
      var closer = e.target.closest("[data-modal-close]");
      if (closer) { Modal.close(closer.closest(".modal")); return; }
      if (e.target.classList && e.target.classList.contains("modal")) Modal.close(e.target);
    });
    on(doc, "keydown", function (e) {
      if (e.key !== "Escape") return;
      var open = $(".modal.is-open");
      if (open) Modal.close(open);
    });
    /* Focus trap */
    on(doc, "keydown", function (e) {
      if (e.key !== "Tab") return;
      var m = $(".modal.is-open");
      if (!m) return;
      var f = $$('button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', m)
        .filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ======================================================================
     SCROLL PROGRESS + TO TOP
     ====================================================================== */
  function chrome() {
    var bar = $(".scroll-progress");
    var top = $(".to-top");
    if (!bar && !top) return;
    var ticking = false;
    function update() {
      var h = doc.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? window.scrollY / h : 0;
      if (bar) bar.style.transform = "scaleX(" + p + ")";
      if (top) top.classList.toggle("is-visible", window.scrollY > 700);
      ticking = false;
    }
    on(window, "scroll", function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    on(top, "click", function () {
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    });
    update();
  }

  /* ======================================================================
     WORD ROTATOR
     ====================================================================== */
  function rotator() {
    $$(".rotator").forEach(function (r) {
      var words = $$("span", r);
      if (words.length < 2) { if (words[0]) words[0].classList.add("is-in"); return; }
      var i = 0;
      words[0].classList.add("is-in");
      if (reduced) return;
      window.setInterval(function () {
        words[i].classList.remove("is-in");
        words[i].classList.add("is-out");
        var prev = i;
        window.setTimeout(function () { words[prev].classList.remove("is-out"); }, 700);
        i = (i + 1) % words.length;
        words[i].classList.add("is-in");
      }, 2600);
    });
  }

  /* ======================================================================
     MARQUEE — duplicate the track so the loop is seamless
     ====================================================================== */
  function marquee() {
    $$(".marquee__track").forEach(function (track) {
      if (track.dataset.cloned) return;
      track.dataset.cloned = "1";
      track.innerHTML += track.innerHTML;
    });
  }

  /* ======================================================================
     SEARCH INPUT — clear button state
     ====================================================================== */
  function searchInputs() {
    $$(".search").forEach(function (wrap) {
      var input = $("input", wrap);
      var clear = $(".search__clear", wrap);
      if (!input) return;
      var sync = function () { wrap.classList.toggle("has-value", input.value.length > 0); };
      on(input, "input", sync);
      on(clear, "click", function () {
        input.value = "";
        sync();
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.focus();
      });
      sync();
    });
  }

  /* ======================================================================
     FORM VALIDATION
     Native constraints, custom presentation. Nothing is submitted anywhere:
     there is no backend in this build — see README.
     ====================================================================== */
  function validateField(input) {
    var field = input.closest(".field") || input.closest(".choice-group");
    if (!field) return input.checkValidity();
    var ok = input.checkValidity();
    field.classList.toggle("has-error", !ok);
    var err = $(".field__error", field);
    if (err && !ok) {
      err.textContent = input.validationMessage;
    }
    return ok;
  }

  function forms() {
    $$("form[data-validate]").forEach(function (form) {
      $$("input, select, textarea", form).forEach(function (input) {
        on(input, "blur", function () { if (input.value) validateField(input); });
        on(input, "input", function () {
          var field = input.closest(".field");
          if (field && field.classList.contains("has-error")) validateField(input);
        });
      });

      on(form, "submit", function (e) {
        e.preventDefault();
        var fields = $$("input, select, textarea", form).filter(function (i) { return !i.disabled; });
        var firstBad = null;
        fields.forEach(function (i) { if (!validateField(i) && !firstBad) firstBad = i; });
        if (firstBad) {
          firstBad.focus();
          firstBad.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
          return;
        }
        var done = $("[data-form-done]", form.parentNode) || $("#" + form.dataset.done);
        if (done) {
          form.hidden = true;
          done.hidden = false;
          done.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
          var h = $("h2, h3", done);
          if (h) { h.setAttribute("tabindex", "-1"); h.focus(); }
        }
        try { window.localStorage.removeItem("mg20-draft"); } catch (err) {}
      });
    });
  }

  /* ======================================================================
     REGISTRATION WIZARD
     ====================================================================== */
  function wizard() {
    var form = $("[data-wizard]");
    if (!form) return;
    var steps = $$(".reg-step", form);
    var dots = $$(".step", form.closest("[data-wizard-scope]") || doc);
    var current = 0;

    function paint() {
      steps.forEach(function (s, i) { s.hidden = i !== current; });
      dots.forEach(function (d, i) {
        d.classList.toggle("is-active", i === current);
        d.classList.toggle("is-done", i < current);
      });
      var back = $("[data-wizard-back]", form);
      var next = $("[data-wizard-next]", form);
      var submit = $("[data-wizard-submit]", form);
      if (back) back.hidden = current === 0;
      if (next) next.hidden = current === steps.length - 1;
      if (submit) submit.hidden = current !== steps.length - 1;
      if (current === steps.length - 1) summarise();
      var head = $(".reg-step__head", steps[current]);
      if (head) { head.setAttribute("tabindex", "-1"); head.focus({ preventScroll: true }); }
      form.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
    }

    function stepValid() {
      var inputs = $$("input, select, textarea", steps[current]).filter(function (i) { return !i.disabled; });
      var bad = null;
      inputs.forEach(function (i) { if (!validateField(i) && !bad) bad = i; });
      if (bad) { bad.focus(); bad.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" }); }
      return !bad;
    }

    function summarise() {
      var box = $("[data-wizard-summary]", form);
      if (!box) return;
      var rows = [];
      $$("input, select, textarea", form).forEach(function (i) {
        if (!i.name || i.type === "submit" || i.type === "button") return;
        var label = i.dataset.summary;
        if (!label) return;
        var val = i.value;
        if (i.type === "checkbox") val = i.checked ? "Yes" : "No";
        if (i.type === "radio") { if (!i.checked) return; val = i.dataset.summaryValue || i.value; }
        if (i.tagName === "SELECT" && i.selectedIndex > -1) val = i.options[i.selectedIndex].text;
        if (!val) return;
        rows.push('<div class="reg-summary__row"><dt>' + label + "</dt><dd>" + escapeHTML(val) + "</dd></div>");
      });
      box.innerHTML = rows.length
        ? rows.join("")
        : '<p class="t-sm t-muted">Nothing to review yet.</p>';
    }

    on($("[data-wizard-next]", form), "click", function () {
      if (!stepValid()) return;
      current = Math.min(current + 1, steps.length - 1);
      saveDraft();
      paint();
    });
    on($("[data-wizard-back]", form), "click", function () {
      current = Math.max(current - 1, 0);
      paint();
    });

    /* Draft persistence — a delegate mid-form should not lose their work. */
    function saveDraft() {
      var data = {};
      $$("input, select, textarea", form).forEach(function (i) {
        if (!i.name) return;
        if (i.type === "checkbox") data[i.name] = i.checked;
        else if (i.type === "radio") { if (i.checked) data[i.name] = i.value; }
        else data[i.name] = i.value;
      });
      try { window.localStorage.setItem("mg20-draft", JSON.stringify(data)); } catch (e) {}
    }
    function loadDraft() {
      var raw;
      try { raw = window.localStorage.getItem("mg20-draft"); } catch (e) { return; }
      if (!raw) return;
      var data;
      try { data = JSON.parse(raw); } catch (e) { return; }
      $$("input, select, textarea", form).forEach(function (i) {
        if (!i.name || !(i.name in data)) return;
        if (i.type === "checkbox") i.checked = !!data[i.name];
        else if (i.type === "radio") i.checked = i.value === data[i.name];
        else i.value = data[i.name];
      });
      var note = $("[data-draft-note]", form);
      if (note) note.hidden = false;
    }
    on(form, "input", saveDraft);
    on(form, "change", saveDraft);
    loadDraft();
    paint();
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  window.MG20esc = escapeHTML;

  /* ======================================================================
     PARALLAX — light touch, transform only
     ====================================================================== */
  function parallax() {
    var nodes = $$("[data-parallax]");
    if (!nodes.length || reduced) return;
    var ticking = false;
    function update() {
      var vh = window.innerHeight;
      nodes.forEach(function (n) {
        var rect = n.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        var speed = parseFloat(n.dataset.parallax) || 0.12;
        var mid = rect.top + rect.height / 2 - vh / 2;
        n.style.transform = "translate3d(0," + (-mid * speed).toFixed(2) + "px,0)";
      });
      ticking = false;
    }
    on(window, "scroll", function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    on(window, "resize", update);
    update();
  }

  /* ======================================================================
     BOOT
     ====================================================================== */
  function init() {
    curtain();
    nav();
    reveal();
    countdown();
    counters();
    accordion();
    tabs();
    modals();
    chrome();
    rotator();
    marquee();
    searchInputs();
    forms();
    wizard();
    parallax();
    cursor();
  }

  if (doc.readyState === "loading") on(doc, "DOMContentLoaded", init);
  else init();
})();
