/* ==========================================================================
   MODEL G20 2026 — CONTENT DATA
   Single source of truth for every piece of conference content rendered by
   JavaScript. Editing this file changes the site; no markup edits required.

   ⚠ PLACEHOLDER NOTICE
   Delegation availability, fees, contact details and Secretariat appointments
   are illustrative placeholders for the design build. Replace with the
   Secretariat's authoritative figures before publication. Search "PLACEHOLDER"
   to find every instance.
   ========================================================================== */
(function (global) {
  "use strict";

  /* ======================================================================
     EVENT
     ====================================================================== */
  var EVENT = {
    name: "Model G20 2026",
    edition: "Inaugural Edition",
    theme: "Common Ground",
    themeFull: "Common Ground — Rebuilding Trust in a Fragmented World",
    themeBlurb:
      "Twenty economies. Eighty per cent of world output. One table. The 2026 " +
      "edition asks its delegates a harder question than any communiqué has " +
      "answered in a decade: what is still negotiable?",
    host: "The School of Raya",
    venueName: "FLAME University",
    venueLine: "Lavale, Off Pune–Bangalore Highway",
    venueCity: "Pune, Maharashtra 412115, India",
    venueLat: 18.58,
    venueLon: 73.7,
    /* Summit opens 8 October 2026, 09:00 IST */
    startISO: "2026-10-08T09:00:00+05:30",
    endISO: "2026-10-09T17:30:00+05:30",
    datesLabel: "8 – 9 October 2026",
    daysLabel: "Thursday – Friday",
    /* PLACEHOLDER — replace with the Secretariat's published channels */
    email: "secretariat@modelg20.example",
    emailDelegates: "delegates@modelg20.example",
    emailPress: "press@modelg20.example",
    phone: "+91 00000 00000",
    stats: [
      { value: 500, suffix: "+", label: "Delegates" },
      { value: 10, suffix: "", label: "Committees" },
      { value: 46, suffix: "", label: "Delegations" },
      { value: 2, suffix: "", label: "Days of Summit" }
    ],
    deadlines: [
      { k: "Early Registration closes", v: "15 August 2026", state: "open" },
      { k: "Regular Registration closes", v: "15 September 2026", state: "open" },
      { k: "Allotments released", v: "22 September 2026", state: "pending" },
      { k: "Position papers due", v: "1 October 2026", state: "pending" }
    ]
  };

  /* ======================================================================
     DELEGATIONS
     group: member | invited | org
     ====================================================================== */
  var COUNTRIES = [
    /* — G20 members — */
    { code: "AR", name: "Argentina",           lon: -58.38, lat: -34.60, group: "member",  region: "Americas" },
    { code: "AU", name: "Australia",           lon: 149.13, lat: -35.28, group: "member",  region: "Asia-Pacific" },
    { code: "BR", name: "Brazil",              lon: -47.88, lat: -15.79, group: "member",  region: "Americas" },
    { code: "CA", name: "Canada",              lon: -75.70, lat: 45.42,  group: "member",  region: "Americas" },
    { code: "CN", name: "China",               lon: 116.41, lat: 39.90,  group: "member",  region: "Asia-Pacific" },
    { code: "FR", name: "France",              lon: 2.35,   lat: 48.86,  group: "member",  region: "Europe" },
    { code: "DE", name: "Germany",             lon: 13.40,  lat: 52.52,  group: "member",  region: "Europe" },
    { code: "IN", name: "India",               lon: 77.21,  lat: 28.61,  group: "member",  region: "Asia-Pacific" },
    { code: "ID", name: "Indonesia",           lon: 106.85, lat: -6.21,  group: "member",  region: "Asia-Pacific" },
    { code: "IT", name: "Italy",               lon: 12.50,  lat: 41.90,  group: "member",  region: "Europe" },
    { code: "JP", name: "Japan",               lon: 139.69, lat: 35.69,  group: "member",  region: "Asia-Pacific" },
    { code: "MX", name: "Mexico",              lon: -99.13, lat: 19.43,  group: "member",  region: "Americas" },
    { code: "RU", name: "Russian Federation",  lon: 37.62,  lat: 55.76,  group: "member",  region: "Europe" },
    { code: "SA", name: "Saudi Arabia",        lon: 46.68,  lat: 24.71,  group: "member",  region: "Middle East" },
    { code: "ZA", name: "South Africa",        lon: 28.19,  lat: -25.75, group: "member",  region: "Africa" },
    { code: "KR", name: "Republic of Korea",   lon: 126.98, lat: 37.57,  group: "member",  region: "Asia-Pacific" },
    { code: "TR", name: "Türkiye",             lon: 32.85,  lat: 39.93,  group: "member",  region: "Europe" },
    { code: "GB", name: "United Kingdom",      lon: -0.13,  lat: 51.51,  group: "member",  region: "Europe" },
    { code: "US", name: "United States",       lon: -77.04, lat: 38.91,  group: "member",  region: "Americas" },
    { code: "EU", name: "European Union",      lon: 4.35,   lat: 50.85,  group: "member",  region: "Europe" },
    { code: "AU2", name: "African Union",      lon: 38.76,  lat: 9.03,   group: "member",  region: "Africa" },

    /* — Invited states — */
    { code: "ES", name: "Spain",               lon: -3.70,  lat: 40.42,  group: "invited", region: "Europe" },
    { code: "NL", name: "Netherlands",         lon: 4.30,   lat: 52.08,  group: "invited", region: "Europe" },
    { code: "NO", name: "Norway",              lon: 10.75,  lat: 59.91,  group: "invited", region: "Europe" },
    { code: "CH", name: "Switzerland",         lon: 7.45,   lat: 46.95,  group: "invited", region: "Europe" },
    { code: "SG", name: "Singapore",           lon: 103.82, lat: 1.35,   group: "invited", region: "Asia-Pacific" },
    { code: "AE", name: "United Arab Emirates",lon: 54.37,  lat: 24.45,  group: "invited", region: "Middle East" },
    { code: "NG", name: "Nigeria",             lon: 7.49,   lat: 9.06,   group: "invited", region: "Africa" },
    { code: "EG", name: "Egypt",               lon: 31.24,  lat: 30.04,  group: "invited", region: "Africa" },
    { code: "KE", name: "Kenya",               lon: 36.82,  lat: -1.29,  group: "invited", region: "Africa" },
    { code: "BD", name: "Bangladesh",          lon: 90.41,  lat: 23.81,  group: "invited", region: "Asia-Pacific" },
    { code: "VN", name: "Viet Nam",            lon: 105.83, lat: 21.03,  group: "invited", region: "Asia-Pacific" },
    { code: "CL", name: "Chile",               lon: -70.65, lat: -33.46, group: "invited", region: "Americas" },

    /* — International organisations (matrix only; not plotted) — */
    { code: "UN",  name: "United Nations",                     group: "org", region: "Multilateral" },
    { code: "IMF", name: "International Monetary Fund",         group: "org", region: "Multilateral" },
    { code: "WB",  name: "World Bank Group",                    group: "org", region: "Multilateral" },
    { code: "WTO", name: "World Trade Organization",            group: "org", region: "Multilateral" },
    { code: "WHO", name: "World Health Organization",           group: "org", region: "Multilateral" },
    { code: "OECD",name: "OECD",                                group: "org", region: "Multilateral" },
    { code: "ILO", name: "International Labour Organization",    group: "org", region: "Multilateral" },
    { code: "FSB", name: "Financial Stability Board",           group: "org", region: "Multilateral" },
    { code: "IEA", name: "International Energy Agency",         group: "org", region: "Multilateral" },
    { code: "ISA", name: "International Solar Alliance",        group: "org", region: "Multilateral" },
    { code: "UNFCCC", name: "UNFCCC Secretariat",               group: "org", region: "Multilateral" },
    { code: "FAO", name: "Food & Agriculture Organization",     group: "org", region: "Multilateral" },
    { code: "UNCTAD", name: "UNCTAD",                           group: "org", region: "Multilateral" }
  ];

  /* ======================================================================
     COMMITTEES
     pool: which delegations are seated — g20 | extended | full | select
     ====================================================================== */
  var COMMITTEES = [
    {
      id: "ls", abbr: "LS", track: "Sherpa Track",
      name: "G20 Leaders' Summit",
      agenda: "Rebuilding the Multilateral Consensus: Sovereignty, Security and the Rules-Based Order",
      brief:
        "The apex organ of the conference. Heads of State and Government convene " +
        "to negotiate the Leaders' Declaration — the only document the summit " +
        "adopts by consensus, and the one every other committee feeds into.",
      role: "Head of State or Government",
      pool: "g20", difficulty: 4, level: "Advanced",
      outputs: ["Leaders' Declaration", "Chair's Summary"],
      focus: [
        "Reform of the UN Security Council and the Bretton Woods institutions",
        "Conflict, sanctions regimes and the limits of economic statecraft",
        "A common floor for sovereign AI and dual-use technology controls"
      ]
    },
    {
      id: "fmcbg", abbr: "FMCBG", track: "Finance Track",
      name: "Finance Ministers & Central Bank Governors",
      agenda: "Sovereign Debt Distress and the Architecture of Global Financial Stability",
      brief:
        "The Finance Track's senior forum. Delegates arrive with balance sheets, " +
        "not talking points: debt sustainability analyses, exchange-rate exposure " +
        "and the political cost of every basis point.",
      role: "Finance Minister / Central Bank Governor",
      pool: "g20", difficulty: 5, level: "Advanced",
      outputs: ["FMCBG Communiqué", "Common Framework Annex"],
      focus: [
        "A workable successor to the Common Framework for debt treatment",
        "Capital-flow volatility and the case for a global liquidity backstop",
        "Cross-border payments, CBDCs and the fragmentation of settlement"
      ]
    },
    {
      id: "ecswg", abbr: "ECSWG", track: "Sherpa Track",
      name: "Environment & Climate Sustainability Working Group",
      agenda: "Financing the Just Transition: Adaptation, Loss and Damage",
      brief:
        "Where climate ambition meets the ledger. The group must reconcile " +
        "adaptation finance targets with the fiscal space of the countries that " +
        "need them most.",
      role: "Environment Minister / Climate Envoy",
      pool: "extended", difficulty: 3, level: "Intermediate",
      outputs: ["Ministerial Outcome Document", "Adaptation Finance Annex"],
      focus: [
        "Capitalising and governing the loss-and-damage facility",
        "Carbon border measures and their trade consequences",
        "Nature finance: biodiversity credits, blue economy, land restoration"
      ]
    },
    {
      id: "dewg", abbr: "DEWG", track: "Sherpa Track",
      name: "Digital Economy Working Group",
      agenda: "Governing Frontier AI: Compute, Cross-Border Data and Digital Sovereignty",
      brief:
        "The newest fault line at the table. Delegates negotiate the first serious " +
        "attempt at interoperable AI governance while defending national compute " +
        "and data positions.",
      role: "Minister for Technology / Digital Affairs",
      pool: "extended", difficulty: 3, level: "Intermediate",
      outputs: ["Digital Ministers' Declaration", "Interoperability Principles"],
      focus: [
        "Compute thresholds, model evaluations and incident reporting",
        "Data free flow with trust versus data localisation mandates",
        "Digital public infrastructure as an export and a dependency"
      ]
    },
    {
      id: "tiwg", abbr: "TIWG", track: "Sherpa Track",
      name: "Trade & Investment Working Group",
      agenda: "Rewiring Global Supply Chains and the Reform of the WTO",
      brief:
        "Industrial policy is back and the rulebook has not caught up. This group " +
        "negotiates the gap between what states are doing and what they have " +
        "agreed they may do.",
      role: "Trade Minister / Chief Negotiator",
      pool: "extended", difficulty: 4, level: "Advanced",
      outputs: ["Trade Ministers' Statement", "Appellate Reform Roadmap"],
      focus: [
        "Restoring binding dispute settlement",
        "Subsidy disciplines for green industrial policy",
        "Critical minerals, export controls and friend-shoring"
      ]
    },
    {
      id: "dwg", abbr: "DWG", track: "Sherpa Track",
      name: "Development Working Group",
      agenda: "Delivering the 2030 Agenda: Food Security, Health Systems and Human Capital",
      brief:
        "The conference's most accessible committee and its broadest mandate. " +
        "Ideal for delegates taking their first seat at an international table.",
      role: "Development Minister / Sherpa",
      pool: "full", difficulty: 2, level: "Foundational",
      outputs: ["Development Action Plan", "SDG Acceleration Annex"],
      focus: [
        "Financing the SDG gap through MDB balance-sheet reform",
        "Pandemic preparedness, local manufacturing and equitable access",
        "Food systems, fertiliser markets and export restrictions"
      ]
    },
    {
      id: "etwg", abbr: "ETWG", track: "Sherpa Track",
      name: "Energy Transitions Working Group",
      agenda: "Critical Minerals, Grid Sovereignty and the Price of Decarbonisation",
      brief:
        "Energy security and climate policy pull in opposite directions here. " +
        "Delegates must find the sequencing that both survives an election and " +
        "meets a target.",
      role: "Energy Minister",
      pool: "extended", difficulty: 3, level: "Intermediate",
      outputs: ["Energy Ministers' Communiqué", "Minerals Security Framework"],
      focus: [
        "Refining capacity concentration and supply resilience",
        "Grid interconnection and the One Sun One World One Grid proposition",
        "Transition finance for coal-dependent economies"
      ]
    },
    {
      id: "y20", abbr: "Y20", track: "Engagement Group",
      name: "Youth 20",
      agenda: "Employment, Mobility and the Future of Work",
      brief:
        "The official youth voice of the G20 process. The Y20 communiqué is " +
        "formally transmitted to the Leaders' Summit and may be cited in floor " +
        "debate — the only engagement group with that privilege.",
      role: "Youth Delegate",
      pool: "full", difficulty: 1, level: "Foundational",
      outputs: ["Y20 Communiqué to Leaders"],
      focus: [
        "Automation, displacement and the shape of the social contract",
        "Skilled migration corridors and credential recognition",
        "Youth debt, housing and intergenerational fiscal fairness"
      ]
    },
    {
      id: "ipc", abbr: "IPC", track: "Media",
      name: "International Press Corps",
      agenda: "Reporting the Summit: Truth, Speed and Accountability",
      brief:
        "Journalists, photographers and broadcast delegates covering every " +
        "committee in real time. The IPC publishes a daily edition, runs the " +
        "leaders' press conferences and holds the floor to account.",
      role: "Correspondent / Photojournalist / Editor",
      pool: "press", difficulty: 2, level: "Foundational",
      outputs: ["The Raya Dispatch — daily edition", "Closing press conference"],
      focus: [
        "Live filing from committee under embargo rules",
        "Photojournalism and the visual record of the summit",
        "Editorial judgement, sourcing and the right of reply"
      ]
    },
    {
      id: "crisis", abbr: "ESS", track: "Crisis",
      name: "Emergency Sherpa Session",
      agenda: "Classified — briefed in committee at first session",
      brief:
        "A continuous crisis committee convened under the Chair's emergency " +
        "powers. Directives are live, the situation moves every twenty minutes " +
        "and no background guide can prepare you for the third update.",
      role: "Sherpa with plenipotentiary authority",
      pool: "select", difficulty: 5, level: "Advanced",
      outputs: ["Emergency Directives", "Chair's Situation Report"],
      focus: [
        "Real-time directive drafting under compressed deadlines",
        "Coalition management when the crisis splits the room",
        "Escalation control and the cost of a veto"
      ]
    }
  ];

  /* ======================================================================
     ALLOTMENT MATRIX
     PLACEHOLDER — availability is generated deterministically for the design
     build so the matrix demonstrates realistic density. Replace `statusFor`
     with a lookup against the Secretariat's live allotment sheet.
     ====================================================================== */
  /* The crisis committee seats twenty of the twenty-one members. */
  var CRISIS_SEATS = ["US", "CN", "RU", "IN", "GB", "FR", "DE", "JP", "BR", "ZA",
                      "SA", "TR", "KR", "EU", "AU2", "CA", "MX", "ID", "IT", "AR"];

  var POOLS = {
    g20:      function (c) { return c.group === "member"; },
    extended: function (c) { return c.group === "member" || c.group === "invited"; },
    full:     function () { return true; },
    select:   function (c) { return CRISIS_SEATS.indexOf(c.code) > -1; },
    press:    function (c) { return c.group === "org" || c.group === "member"; }
  };

  function hash(str) {
    var h = 2166136261, i;
    for (i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h;
  }

  function statusFor(committeeId, countryCode) {
    var n = hash(committeeId + "::" + countryCode) % 100;
    if (n < 14) return "closed";
    if (n < 34) return "few";
    return "open";
  }

  var STATUS_LABEL = { open: "Available", few: "Limited", closed: "Allotted" };

  function seatsFor(committee) {
    var test = POOLS[committee.pool] || POOLS.full;
    return COUNTRIES.filter(test);
  }

  /* ======================================================================
     SCHEDULE
     ====================================================================== */
  var SCHEDULE = [
    {
      id: "d1", label: "Day One", date: "Thursday 8 October",
      note: "Accreditation, ceremonial opening, and the first two committee sessions.",
      items: [
        { t: "07:30", t2: "09:00", title: "Delegate Accreditation & Registration", venue: "Grand Foyer, Academic Block", tag: "Logistics" },
        { t: "09:00", t2: "09:30", title: "Procession of Delegations", venue: "Central Courtyard", tag: "Ceremonial", key: true },
        { t: "09:30", t2: "10:45", title: "Opening Ceremony & Inaugural Address", venue: "Auditorium", tag: "Ceremonial", key: true,
          desc: "Address by the Secretary-General, followed by the Chair's charge to the floor." },
        { t: "11:00", t2: "11:30", title: "Sherpa Briefing & Rules of Procedure", venue: "Assigned Committee Rooms", tag: "Briefing" },
        { t: "11:30", t2: "13:15", title: "Committee Session I — Opening Statements", venue: "All Committees", tag: "Session" },
        { t: "13:15", t2: "14:15", title: "Delegates' Luncheon", venue: "Dining Hall", tag: "Break" },
        { t: "14:15", t2: "16:30", title: "Committee Session II — Setting the Agenda", venue: "All Committees", tag: "Session" },
        { t: "15:00", t2: "16:30", title: "Emergency Sherpa Session Convenes", venue: "Crisis Room", tag: "Crisis", key: true,
          desc: "Situation briefed on the floor. No prior notice is given to delegates." },
        { t: "16:45", t2: "17:30", title: "First Press Briefing", venue: "Press Centre", tag: "Media" },
        { t: "18:30", t2: "20:30", title: "Diplomatic Reception", venue: "Amphitheatre Lawn", tag: "Social", key: true }
      ]
    },
    {
      id: "d2", label: "Day Two", date: "Friday 9 October",
      note: "Drafting, merger and adoption — then the closing plenary and the awards floor.",
      items: [
        { t: "08:45", t2: "09:00", title: "Morning Roll Call", venue: "All Committees", tag: "Session" },
        { t: "09:00", t2: "11:15", title: "Committee Session III — Moderated Caucus", venue: "All Committees", tag: "Session" },
        { t: "11:30", t2: "13:15", title: "Committee Session IV — Working Paper Drafting", venue: "All Committees", tag: "Session" },
        { t: "13:15", t2: "14:15", title: "Luncheon & Bloc Consultations", venue: "Dining Hall", tag: "Break" },
        { t: "14:15", t2: "15:00", title: "Leaders' Press Conference", venue: "Press Centre", tag: "Media", key: true },
        { t: "14:15", t2: "16:15", title: "Committee Session V — Merger, Amendment & Final Vote", venue: "All Committees", tag: "Session", key: true },
        { t: "16:30", t2: "17:30", title: "Adoption of Outcome Documents", venue: "All Committees", tag: "Session" },
        { t: "17:45", t2: "18:45", title: "Closing Plenary — Transmission to Leaders", venue: "Auditorium", tag: "Ceremonial", key: true,
          desc: "Each Chair transmits their committee's outcome to the Leaders' Summit for the record." },
        { t: "18:45", t2: "19:45", title: "Awards Ceremony & Lowering of Flags", venue: "Auditorium", tag: "Ceremonial", key: true },
        { t: "20:00", t2: "22:30", title: "Delegate Ball & Cultural Evening", venue: "Great Hall", tag: "Social", key: true }
      ]
    }
  ];

  /* ======================================================================
     SECRETARIAT
     PLACEHOLDER — appointments are announced by the host institution.
     Add a `name` key to any office to render it in place of the notice.
     ====================================================================== */
  var SECRETARIAT = [
    { office: "Secretary-General", initials: "SG", group: "Office of the Secretary-General",
      remit: "Ultimate authority over the conference. Chairs the Executive Board and signs every credential issued." },
    { office: "Director-General", initials: "DG", group: "Office of the Secretary-General",
      remit: "Runs the summit floor. Owns the substantive programme, committee quality and the Chair's bench." },
    { office: "Deputy Secretary-General", initials: "DSG", group: "Office of the Secretary-General",
      remit: "Second signature on all Secretariat instruments. Deputises in the Secretary-General's absence." },
    { office: "Chargé d'Affaires", initials: "CDA", group: "Delegate Affairs",
      remit: "The delegate's first and last point of contact, from allotment through to the awards floor." },
    { office: "Under-Secretary-General, Committee Affairs", initials: "CA", group: "Substantive",
      remit: "Appoints and trains the Chair's bench. Approves every background guide before release." },
    { office: "Under-Secretary-General, Delegate Affairs", initials: "DA", group: "Delegate Affairs",
      remit: "Owns registration, the country matrix and delegation allotment across all ten committees." },
    { office: "Under-Secretary-General, Media & Publications", initials: "MP", group: "Substantive",
      remit: "Directs the International Press Corps and publishes The Raya Dispatch each morning of summit." },
    { office: "Under-Secretary-General, Outreach & Partnerships", initials: "OP", group: "External",
      remit: "Institutional delegations, sponsorship and the diplomatic guest programme." },
    { office: "Under-Secretary-General, Logistics & Operations", initials: "LO", group: "Operations",
      remit: "Venue, accommodation, transport, catering and delegate safety across both days." },
    { office: "Under-Secretary-General, Design & Technology", initials: "DT", group: "Operations",
      remit: "Visual identity, this platform, the live results system and all summit signage." },
    { office: "Under-Secretary-General, Finance", initials: "FN", group: "Operations",
      remit: "Budget, delegate fees, vendor settlement and the audited close of the conference accounts." },
    { office: "Faculty Advisor", initials: "FA", group: "Faculty",
      remit: "Institutional oversight on behalf of the host, safeguarding and academic standards." }
  ];

  /* ======================================================================
     RESOURCES
     ====================================================================== */
  var RESOURCES = [
    { cat: "Core", title: "Delegate Handbook 2026", meta: "PDF · 3.4 MB · v1.2",
      desc: "Everything a delegate needs: dress code, conduct, awards criteria, floor etiquette.", state: "ready" },
    { cat: "Core", title: "Rules of Procedure", meta: "PDF · 1.1 MB · v2.0",
      desc: "The full procedural code, including crisis variations and the points hierarchy.", state: "ready" },
    { cat: "Core", title: "Position Paper Guidelines", meta: "PDF · 640 KB",
      desc: "Structure, citation standard, word limits and the plagiarism policy.", state: "ready" },
    { cat: "Core", title: "Country Matrix", meta: "XLSX · 210 KB · live",
      desc: "Complete delegation allotment across all ten committees, updated nightly.", state: "ready" },
    { cat: "Committee", title: "Background Guide — Leaders' Summit", meta: "PDF · 5.2 MB", desc: "Sherpa Track · Advanced", state: "ready" },
    { cat: "Committee", title: "Background Guide — FMCBG", meta: "PDF · 4.8 MB", desc: "Finance Track · Advanced", state: "ready" },
    { cat: "Committee", title: "Background Guide — ECSWG", meta: "PDF · 4.1 MB", desc: "Sherpa Track · Intermediate", state: "ready" },
    { cat: "Committee", title: "Background Guide — DEWG", meta: "PDF · 4.4 MB", desc: "Sherpa Track · Intermediate", state: "ready" },
    { cat: "Committee", title: "Background Guide — TIWG", meta: "PDF · 3.9 MB", desc: "Sherpa Track · Advanced", state: "ready" },
    { cat: "Committee", title: "Background Guide — DWG", meta: "PDF · 3.6 MB", desc: "Sherpa Track · Foundational", state: "ready" },
    { cat: "Committee", title: "Background Guide — ETWG", meta: "PDF · 4.0 MB", desc: "Sherpa Track · Intermediate", state: "ready" },
    { cat: "Committee", title: "Background Guide — Y20", meta: "PDF · 2.8 MB", desc: "Engagement Group · Foundational", state: "ready" },
    { cat: "Committee", title: "Press Corps Style Manual", meta: "PDF · 2.2 MB", desc: "Media · filing standards and embargo rules", state: "ready" },
    { cat: "Committee", title: "Crisis Primer — Emergency Sherpa Session", meta: "PDF · 1.4 MB", desc: "Released 48 hours before summit", state: "soon" },
    { cat: "Logistics", title: "Travel & Accommodation Note", meta: "PDF · 1.8 MB", desc: "Airport transfers, approved hotels, campus access.", state: "ready" },
    { cat: "Logistics", title: "Campus Map & Committee Locations", meta: "PDF · 2.6 MB", desc: "Room allocations and the accessible-route plan.", state: "ready" },
    { cat: "Logistics", title: "Faculty Advisor Pack", meta: "PDF · 1.2 MB", desc: "Chaperone duties, consent forms, emergency protocol.", state: "ready" },
    { cat: "Brand", title: "Identity & Brand Guidelines", meta: "PDF · 6.1 MB", desc: "Crest usage, palette, typography, partner lock-ups.", state: "ready" },
    { cat: "Brand", title: "Sponsorship Prospectus", meta: "PDF · 4.7 MB", desc: "Partnership tiers and delegate reach.", state: "ready" },
    { cat: "Brand", title: "Press Kit", meta: "ZIP · 22 MB", desc: "Crest files, photography, boilerplate copy.", state: "ready" }
  ];

  /* ======================================================================
     FAQ
     ====================================================================== */
  var FAQS = [
    { cat: "Delegates", q: "Do I need previous Model UN experience to apply?",
      a: "No. Four of our ten committees are graded Foundational and are built for first-time delegates — the Development Working Group and Youth 20 in particular. Experience is only a factor in allotment for Advanced committees, where the Secretariat weighs your stated background against the seat requested." },
    { cat: "Delegates", q: "Can I apply as part of a delegation from my school?",
      a: "Yes, and it is the route most institutions take. Delegations of five or more are registered by a single faculty advisor, receive a reduced per-delegate fee, and are allotted as a bloc wherever the matrix permits. Institutional delegations are also eligible for the Best Delegation award." },
    { cat: "Delegates", q: "How are country allotments decided?",
      a: "The Secretariat allots on a rolling basis, weighing preference order, committee experience, delegation balance and the date your registration was completed. Every applicant states three committee preferences and three country preferences; the overwhelming majority receive one of their first two." },
    { cat: "Delegates", q: "What is the dress code?",
      a: "Western business formal for all committee sessions and the closing plenary. National or traditional formal attire is equally welcome and is encouraged for the opening ceremony. The Delegate Ball is black tie optional." },
    { cat: "Registration", q: "What does the delegate fee include?",
      a: "Committee participation across both days, all summit documentation, delegate kit and placard, lunch and refreshments on both days, the diplomatic reception, the Delegate Ball, and certification. Accommodation and travel are quoted separately." },
    { cat: "Registration", q: "Is accommodation available on campus?",
      a: "Yes. A limited block of twin-sharing rooms is held for outstation delegates for the nights of 7 and 8 October, allocated in order of confirmed payment. Faculty advisors are accommodated separately." },
    { cat: "Registration", q: "What is the refund policy?",
      a: "Registrations cancelled on or before 15 September 2026 are refunded in full less a processing charge. Cancellations between 16 and 28 September receive a fifty per cent refund. No refund is issued after 28 September, though a substitution of delegate within the same delegation is permitted at no cost until 3 October." },
    { cat: "Registration", q: "Can my registration be transferred to another delegate?",
      a: "Yes. Substitutions within the same registered delegation are free until 3 October 2026, subject to the incoming delegate meeting the committee's stated experience level. Write to the Chargé d'Affaires with both names." },
    { cat: "Logistics", q: "How do I reach the venue?",
      a: "FLAME University is roughly 45 minutes from Pune Airport and 30 minutes from Pune Junction railway station. Shuttle transfers run from both on 7 and 8 October against pre-booking, which is collected in the registration form." },
    { cat: "Logistics", q: "Is the venue accessible?",
      a: "All committee rooms, the auditorium, dining hall and press centre are step-free and lift-served, with accessible washrooms on every floor. Tell us what you need in the accessibility field on the registration form and the Logistics office will confirm arrangements in writing before you travel." },
    { cat: "Logistics", q: "What are the meal arrangements?",
      a: "Lunch and two refreshment services are provided on each summit day, with vegetarian, vegan, Jain and halal options as standard. Dietary requirements captured at registration are passed directly to catering." },
    { cat: "Committees", q: "When are background guides released?",
      a: "Core guides are published with the opening of registration and are downloadable from the Resources page. The crisis primer for the Emergency Sherpa Session is released 48 hours before the summit opens, and no earlier — that is the point of it." },
    { cat: "Committees", q: "Are position papers compulsory?",
      a: "Yes, for every committee except the International Press Corps, where a portfolio submission replaces it. Papers are due by 23:59 IST on 1 October 2026. A delegate who does not submit remains eligible to participate but is not eligible for an award." },
    { cat: "Committees", q: "How are awards decided?",
      a: "Each committee recognises Best Delegate, two High Commendations and two Special Mentions, judged on substantive command, diplomacy, quality of caucusing and contribution to the outcome document. The Chair's assessment is final; the Secretariat does not review awards." },
    { cat: "Committees", q: "May I use a laptop or phone in committee?",
      a: "Electronic devices are permitted during unmoderated caucus and drafting only. During formal debate the floor runs on paper and the spoken word. The International Press Corps operates under a standing exemption." }
  ];

  /* ======================================================================
     GALLERY — art-directed placeholder plates.
     Swap `src` in for any item to render a real photograph instead.
     ====================================================================== */
  var GALLERY = [
    { id: 1, seed: 11, size: "full",  title: "Opening Procession",       cap: "Delegations enter the central courtyard", year: "2026" },
    { id: 2, seed: 24, size: "tall",  title: "The Chair's Bench",        cap: "Leaders' Summit, first session",          year: "2026" },
    { id: 3, seed: 37, size: "",      title: "Placards Down",            cap: "A vote carries in FMCBG",                 year: "2026" },
    { id: 4, seed: 42, size: "",      title: "Unmoderated Caucus",       cap: "Bloc consultation on the east terrace",   year: "2026" },
    { id: 5, seed: 58, size: "wide",  title: "Filed at Deadline",        cap: "The Raya Dispatch goes to press",         year: "2026" },
    { id: 6, seed: 63, size: "",      title: "Crisis Update Three",      cap: "Emergency Sherpa Session",                year: "2026" },
    { id: 7, seed: 71, size: "",      title: "The Long Corridor",        cap: "Between sessions",                        year: "2026" },
    { id: 8, seed: 88, size: "wide",  title: "Adoption by Consensus",    cap: "Closing plenary, transmission to leaders", year: "2026" },
    { id: 9, seed: 95, size: "",      title: "Best Delegate",            cap: "Awards ceremony",                         year: "2026" },
    { id: 10, seed: 103, size: "",    title: "Lowering of the Flags",    cap: "Central courtyard, close of summit",      year: "2026" },
    { id: 11, seed: 117, size: "tall",title: "Night Session",            cap: "Drafting runs past the hour",             year: "2026" },
    { id: 12, seed: 126, size: "",    title: "Common Ground",            cap: "Delegates, day three",                    year: "2026" }
  ];

  /* ======================================================================
     REGISTRATION — fee tiers  (PLACEHOLDER figures)
     ====================================================================== */
  var FEES = [
    { id: "individual", name: "Individual Delegate", price: "₹3,500", per: "per delegate", featured: false,
      includes: ["Committee participation, both days", "Full documentation & delegate kit", "Lunch and refreshments", "Diplomatic reception", "Certificate of participation"] },
    { id: "delegation", name: "Institutional Delegation", price: "₹3,100", per: "per delegate · 5 or more", featured: true, ribbon: "Most chosen",
      includes: ["Everything in Individual Delegate", "Bloc allotment where the matrix permits", "Faculty advisor pass at no charge", "Eligible for Best Delegation", "Priority accommodation block"] },
    { id: "press", name: "International Press Corps", price: "₹2,900", per: "per correspondent", featured: false,
      includes: ["Full floor access, every committee", "Press centre workstation", "Leaders' press conference access", "Published byline in The Raya Dispatch", "Certificate of participation"] },
    { id: "observer", name: "Observer & Faculty", price: "₹1,400", per: "per person", featured: false,
      includes: ["Gallery access to all committees", "Opening and closing ceremonies", "Lunch and refreshments", "Advisor briefing programme", "Certificate of attendance"] }
  ];

  var ACCOMMODATION = { label: "On-campus accommodation", price: "₹2,800", per: "2 nights · twin sharing · 7–9 October" };

  /* ======================================================================
     EXPORT
     ====================================================================== */
  global.MG20 = {
    EVENT: EVENT,
    COUNTRIES: COUNTRIES,
    COMMITTEES: COMMITTEES,
    SCHEDULE: SCHEDULE,
    SECRETARIAT: SECRETARIAT,
    RESOURCES: RESOURCES,
    FAQS: FAQS,
    GALLERY: GALLERY,
    FEES: FEES,
    ACCOMMODATION: ACCOMMODATION,
    STATUS_LABEL: STATUS_LABEL,
    statusFor: statusFor,
    seatsFor: seatsFor,
    byId: function (id) {
      for (var i = 0; i < COMMITTEES.length; i++) if (COMMITTEES[i].id === id) return COMMITTEES[i];
      return null;
    },
    country: function (code) {
      for (var i = 0; i < COUNTRIES.length; i++) if (COUNTRIES[i].code === code) return COUNTRIES[i];
      return null;
    }
  };
})(window);
