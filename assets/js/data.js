/* ==========================================================================
   SCHOOL OF RAYA MODEL G20 2026 — CONTENT DATA
   Single source of truth for every piece of conference content rendered by
   JavaScript. Editing this file changes the site; no markup edits required.

   ⚠ PLACEHOLDER NOTICE
   Contact details, Secretariat and Organising Committee names, and the
   partner logos are illustrative placeholders. Search "PLACEHOLDER" to find
   every instance that needs a real value before publication.
   ========================================================================== */
(function (global) {
  "use strict";

  /* ======================================================================
     EVENT
     Change the dates here and the countdown, the key-dates timeline and
     every date printed on the site follow.
     ====================================================================== */
  var EVENT = {
    name: "School of Raya Model G20 2026",
    shortName: "Model G20 2026",
    host: "The School of Raya",
    edition: "Inaugural Edition",
    tagline: "Two days of rigorous diplomacy, debate and decision-making.",

    /* Conference opens 8 October 2026, 09:00 IST */
    startISO: "2026-10-08T09:00:00+05:30",
    endISO: "2026-10-09T17:30:00+05:30",
    datesLabel: "8th – 9th October 2026",
    daysLabel: "Thursday – Friday",

    venue: "School of Raya",
    venueLine1: "The School of Raya",
    venueLine2: "Hennur Bagalur Road, Dasanayakanahalli",
    venueLine3: "Bengaluru, Karnataka 562149",
    venueCity: "Bengaluru, Karnataka, India",

    /* The map embed needs no API key. To move the pin, change this query. */
    mapQuery: "The School of Raya, Hennur Bagalur Road, Dasanayakanahalli, Bengaluru, Karnataka 562149",

    /* PLACEHOLDER — replace with the Secretariat's published channels */
    email: "modelg20@schoolofraya.edu",
    phone: "+91 80 4000 1234",

    partnershipLine: "In partnership with Flame University and Wanyang India."
  };

  EVENT.mapEmbed = "https://maps.google.com/maps?q=" +
    encodeURIComponent(EVENT.mapQuery) + "&z=14&output=embed";
  EVENT.mapLink = "https://maps.google.com/maps?q=" + encodeURIComponent(EVENT.mapQuery);

  /* ======================================================================
     KEY DATES — the homepage timeline, in order.
     state: "done" | "open" | "pending"
     ====================================================================== */
  var KEY_DATES = [
    { k: "Registration opens",        v: "1st August 2026",     state: "done",
      note: "Applications accepted from schools and individual delegates." },
    { k: "Registration closes",       v: "15th September 2026", state: "open",
      note: "Late applications are considered only against unfilled seats." },
    { k: "Allotments released",       v: "22nd September 2026", state: "pending",
      note: "Committee and country allocations issued by email." },
    { k: "Background guides issued",  v: "25th September 2026", state: "pending",
      note: "Agenda briefs and rules of procedure sent to every delegate." },
    { k: "Conference",                v: "8th – 9th October 2026", state: "pending",
      note: "Two days at The School of Raya, Bengaluru.", key: true }
  ];

  /* ======================================================================
     PARTNERS
     PLACEHOLDER LOGOS — drop a real file into assets/img/partners/ and set
     `logo` to its path. Remove `logo` to fall back to the typographic mark.
     ====================================================================== */
  var PARTNERS = [
    { name: "Flame University", mark: "FLAME", sub: "University",
      role: "Academic Partner", url: "#",
      logo: "assets/img/partners/flame-university.svg" },
    { name: "Wanyang India",    mark: "WANYANG", sub: "India",
      role: "Programme Partner", url: "#",
      logo: "assets/img/partners/wanyang-india.svg" }
  ];

  /* ======================================================================
     COMMITTEES
     No tracks, no seat pools — every committee sits in one grid.

     id         short code, used in links. Keep it lowercase and simple.
     name       committee name as printed
     level      "Beginner" | "Intermediate" | "Advanced"
     agenda     the full agenda question, printed in full on the card
     icon       key into the icon set in render.js
     ====================================================================== */
  var COMMITTEES = [
    {
      id: "human-rights",
      name: "Human Rights",
      level: "Beginner",
      icon: "rights",
      agenda: "How can G20 nations improve financial oversight to prevent global supply chains and business activities from enabling human rights abuses?"
    },
    {
      id: "environmental",
      name: "Environmental",
      level: "Beginner",
      icon: "leaf",
      agenda: "How can sustainable energy technologies and energy sovereignty be better integrated in an increasingly volatile global oil and gas landscape?"
    },
    {
      id: "artificial-intelligence",
      name: "Artificial Intelligence",
      level: "Beginner",
      icon: "circuit",
      agenda: "How can G20 nations establish international standards for the safe development and deployment of autonomous artificial intelligence systems while preventing their misuse against civilians, especially in wartime?"
    },
    {
      id: "gender-equality",
      name: "Gender Equality",
      level: "Intermediate",
      icon: "balance",
      agenda: "How can G20 nations strengthen international cooperation to prevent and respond to systemic gender-based violence in armed conflict while ensuring justice and long-term support for survivors?"
    },
    {
      id: "drugs-and-crime",
      name: "Drugs & Crime",
      level: "Intermediate",
      icon: "shield",
      agenda: "How can G20 nations combat the rise of transnational synthetic drug trafficking and cryptocurrency-enabled organised crime through international cooperation?"
    },
    {
      id: "anti-corruption",
      name: "Anti-Corruption",
      level: "Advanced",
      icon: "gavel",
      agenda: "Should G20 nations condition foreign aid and development financing on measurable anti-corruption, equity, and governance benchmarks?"
    },
    {
      id: "post-conflict-reconstruction",
      name: "Post-Conflict Infrastructure Reconstruction",
      level: "Intermediate",
      icon: "build",
      agenda: "How can G20 nations build robust infrastructure in post-conflict states to improve living conditions, economic opportunities, and global stability?"
    },
    {
      id: "economic-and-financial",
      name: "Economic & Financial",
      level: "Advanced",
      icon: "chart",
      agenda: "How can developmental aid be structured to avoid exploitation and unfair extraction of resources from less economically developed countries (LEDCs)?"
    }
  ];

  var LEVEL_ORDER = { Beginner: 1, Intermediate: 2, Advanced: 3 };

  /* ======================================================================
     CORE SECRETARIAT
     PLACEHOLDER — five offices with placeholder names and portraits.
     To use a real photograph, add `photo: "assets/img/team/their-file.jpg"`.
     The initials plate is drawn automatically when `photo` is absent.
     ====================================================================== */
  var SECRETARIAT = [
    { office: "Secretary-General",        abbr: "SG",  name: "To be announced", initials: "SG",
      remit: "Ultimate authority over the conference. Chairs the Executive Board and signs every credential issued." },
    { office: "Director-General",         abbr: "DG",  name: "To be announced", initials: "DG",
      remit: "Runs the conference floor. Owns the substantive programme and the Chair's bench." },
    { office: "Deputy Secretary-General", abbr: "DSG", name: "To be announced", initials: "DSG",
      remit: "Second signature on all Secretariat instruments. Deputises in the Secretary-General's absence." },
    { office: "Chargé d'Affaires",        abbr: "CDA", name: "To be announced", initials: "CDA",
      remit: "The delegate's first and last point of contact, from allotment through to the closing ceremony." },
    { office: "Under-Secretary-General",  abbr: "USG", name: "To be announced", initials: "USG",
      remit: "Appoints and trains the Chair's bench. Approves every background guide before release." }
  ];

  /* ======================================================================
     ORGANISING COMMITTEE
     PLACEHOLDER — same shape as the Secretariat above.
     ====================================================================== */
  var ORGANISING = [
    { office: "Head of Delegate Affairs", abbr: "DA",  name: "To be announced", initials: "DA",
      remit: "Registration, allotments and delegate correspondence." },
    { office: "Head of Logistics",        abbr: "LOG", name: "To be announced", initials: "LOG",
      remit: "Venue, catering, transport and delegate safety across both days." },
    { office: "Head of Press & Media",    abbr: "PR",  name: "To be announced", initials: "PR",
      remit: "The press corps, photography and the conference record." },
    { office: "Head of Design",           abbr: "DES", name: "To be announced", initials: "DES",
      remit: "Identity, print, signage and the conference's visual language." },
    { office: "Head of Outreach",         abbr: "OUT", name: "To be announced", initials: "OUT",
      remit: "School partnerships, invitations and the delegate pipeline." },
    { office: "Head of Technology",       abbr: "TEC", name: "To be announced", initials: "TEC",
      remit: "This website, the registration pipeline and floor technology." }
  ];

  /* ======================================================================
     SOCIAL MEDIA
     PLACEHOLDER — point each `url` at the real account.
     ====================================================================== */
  var SOCIALS = [
    { name: "Instagram", handle: "@modelg20raya", url: "#", icon: "instagram" },
    { name: "LinkedIn",  handle: "School of Raya Model G20", url: "#", icon: "linkedin" },
    { name: "X",         handle: "@modelg20raya", url: "#", icon: "x" },
    { name: "YouTube",   handle: "School of Raya", url: "#", icon: "youtube" }
  ];

  /* ======================================================================
     EXPORT
     ====================================================================== */
  global.MG20 = {
    EVENT: EVENT,
    KEY_DATES: KEY_DATES,
    PARTNERS: PARTNERS,
    COMMITTEES: COMMITTEES,
    SECRETARIAT: SECRETARIAT,
    ORGANISING: ORGANISING,
    SOCIALS: SOCIALS,
    LEVEL_ORDER: LEVEL_ORDER,
    byId: function (id) {
      for (var i = 0; i < COMMITTEES.length; i++) if (COMMITTEES[i].id === id) return COMMITTEES[i];
      return null;
    }
  };
})(window);
