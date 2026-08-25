/* ==========================================================================
   THE SCHOOL OF RAYA MODEL G20 2026 — CONTENT DATA
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
    name: "The School of Raya Model G20 2026",
    shortName: "Model G20 2026",
    host: "The School of Raya",
    edition: "Inaugural Edition",
    tagline: "Two days of rigorous diplomacy, debate and decision-making.",

    /* Conference opens 10 October 2026, 09:00 IST */
    startISO: "2026-10-10T09:00:00+05:30",
    endISO: "2026-10-11T16:00:00+05:30",
    datesLabel: "10th – 11th October 2026",
    daysLabel: "Saturday – Sunday",

    venue: "The School of Raya",
    venueLine1: "The School of Raya",
    venueLine2: "Hennur Bagalur Road, Dasanayakanahalli",
    venueLine3: "Bengaluru, Karnataka 562149",
    venueCity: "Bengaluru, Karnataka, India",

    /* The map embed needs no API key. To move the pin, change this query. */
    mapQuery: "The School of Raya, Hennur Bagalur Road, Dasanayakanahalli, Bengaluru, Karnataka 562149",

    /* PLACEHOLDER — replace with the Secretariat's published channels */
    email: "modelg20@theschoolofraya.com",

    partnershipLine: "In partnership with Flame University and One Young India."
  };

  EVENT.mapEmbed = "https://maps.google.com/maps?q=" +
    encodeURIComponent(EVENT.mapQuery) + "&z=14&output=embed";
  EVENT.mapLink = "https://maps.google.com/maps?q=" + encodeURIComponent(EVENT.mapQuery);

  /* ======================================================================
     PARTNERS
     PLACEHOLDER LOGOS — drop a real file into assets/img/partners/ and set
     `logo` to its path. Remove `logo` to fall back to the typographic mark.
     ====================================================================== */
  var PARTNERS = [
    { name: "Flame University", mark: "FLAME", sub: "University",
      role: "Academic Partner", url: "#",
      logo: "assets/img/partners/flame-university.svg" },
    { name: "One Young India", mark: "ONE YOUNG", sub: "India",
      role: "Programme Partner", url: "#",
      logo: "assets/img/partners/one-young-india.svg" }
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
     To use a photograph, add photo: "assets/img/team/their-file.jpg".
     Without one, the card draws an initials plate.
     ====================================================================== */
  var SECRETARIAT = [
    { name: "Aadya Banka",     initials: "AB", office: "Presidency Coordinator" },
    { name: "Deetya Aradhya",  initials: "DA", office: "Deputy Coordinator" },
    { name: "Dakshil Mathuria", initials: "DM", office: "Deputy Coordinator" },
    { name: "Samir Wajid",     initials: "SW", office: "Deputy Coordinator" }
  ];

  /* ======================================================================
     ORGANISING COMMITTEE — same shape as above.
     ====================================================================== */
  var ORGANISING = [
    { name: "Abinaya Vijaybhaskar",  initials: "AV", office: "Organising Committee Head" },
    { name: "Medha Shashi Bhaskara", initials: "MB", office: "Organising Committee Head" },
    { name: "Aanya Chauhan",         initials: "AC", office: "Communication Head" },
    { name: "Chaitanya Ballari",     initials: "CB", office: "Website Head" },
    { name: "Adhvik Kaarthikeya",    initials: "AK", office: "Website Head" },
    { name: "Hari Lokesh",           initials: "HL", office: "Finance Head" },
    { name: "Siddharth Sajith",      initials: "SS", office: "Logistics Head" },
    { name: "Sia Grover",            initials: "SG", office: "Head of Delegate Affairs" }
  ];

  /* ======================================================================
     SOCIAL MEDIA
     PLACEHOLDER — point each `url` at the real account.
     ====================================================================== */
  var SOCIALS = [
    { name: "Instagram", handle: "@raya_modelg20", icon: "instagram",
      url: "https://www.instagram.com/raya_modelg20" }
  ];


  /* ======================================================================
     EXPORT
     ====================================================================== */
  global.MG20 = {
    EVENT: EVENT,
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
