# How to edit this site

Written for someone who has never touched this project before. No prior
knowledge assumed. Nothing here needs a developer.

---

## The one thing to know first

There are **two kinds of page** in this site, and they are edited differently.

| | Where you edit | Do you need to run anything? |
|---|---|---|
| **The front page** (`index.html`) | `src/pages/index.html` — one self-contained file | No |
| **Every other page** | `src/pages/<name>.html` | Yes — `python3 build.py` |

The reason for the difference: the interior pages all share one navigation bar
and one footer. Rather than keep fourteen copies of that in step by hand, they
are assembled from a template. The front page has its own look and its own
navigation, so it stands alone.

**Golden rule: edit files inside `src/`. Never edit the `.html` files sitting in
the top folder** — those are generated, and the next build replaces them.

(If you forget and edit a generated file anyway, the build will notice and
refuse to overwrite your work. It will tell you exactly what to do.)

---

## Running the build

Open a terminal in the project folder and type:

```
python3 build.py
```

That is the whole thing. It takes under a second and prints what it wrote.
Refresh your browser and the change is there.

Two extra options you will rarely need:

- `python3 build.py --check` — shows what *would* change, writes nothing.
- `python3 build.py --force` — rebuilds even pages you edited directly,
  discarding those direct edits.

### Seeing the site on your own machine

Open a terminal in the project folder:

```
python3 -m http.server 8000
```

Then visit **http://localhost:8000** in your browser. Leave the terminal open
while you work; press `Ctrl+C` when you're done.

> Opening `index.html` by double-clicking mostly works, but the committee
> listings and the country matrix will be blank, because browsers block those
> files from loading over `file://`. Use the command above instead.

---

## The five most common jobs

### 1. Change the summit dates

Open **`assets/js/data.js`**. Near the top:

```js
startISO: "2026-10-08T09:00:00+05:30",
datesLabel: "8 – 9 October 2026",
```

`startISO` drives every countdown on the site, including the one on the front
page. The format is `YYYY-MM-DDTHH:MM:SS+05:30` — the `+05:30` is India
Standard Time, leave it as it is.

`datesLabel` is the human-readable version shown in text. Change both.

Then look in **`src/pages/index.html`** for the line reading
`8 – 9 October 2026 · FLAME University, Pune` and update that too — it's
written out in full on the cover so the page reads correctly even if the data
file is ever removed.

Run `python3 build.py`.

### 2. Change contact details

They appear in two places:

- **Front page** — `src/pages/index.html`, the section marked **EDIT 7**.
- **Contact page** — `src/pages/contact.html`, the four `contact-card` blocks
  near the top.

Everything currently reads `…@modelg20.example` and `+91 00000 00000`. Those
are placeholders. Replace them with your real addresses everywhere they appear.

Run `python3 build.py`.

### 3. Add a partner

Open **`src/pages/index.html`** and find **EDIT 6**. There is a commented-out
block that says `COPY FROM HERE`. Copy everything between those two markers,
paste it just below the FLAME University card, remove the `<!--` and `-->`
around your copy, and fill in the details.

To use a real logo instead of the typographic plate, replace these two lines:

```html
<b>FLAME</b>
<span>University</span>
```

with:

```html
<img src="assets/img/partners/their-logo.png" alt="Their Name">
```

and put the image file in `assets/img/partners/`.

Run `python3 build.py`.

### 4. Add, rename or remove a committee

Open **`assets/js/data.js`** and find the `COMMITTEES` list. Each committee is
a block like this:

```js
{
  id: "dewg",                       // short code — used in web links, keep it simple
  abbr: "DEWG",                     // shown on the card
  track: "Sherpa Track",
  name: "Digital Economy Working Group",
  agenda: "Governing Frontier AI: Compute, Cross-Border Data and Digital Sovereignty",
  brief: "The newest fault line at the table…",
  role: "Minister for Technology / Digital Affairs",
  pool: "extended",                 // who is seated — see below
  difficulty: 3,                    // 1 to 5, drawn as the little bars
  level: "Intermediate",
  outputs: ["Digital Ministers' Declaration"],
  focus: [
    "Compute thresholds, model evaluations and incident reporting",
    "…"
  ]
},
```

Copy a whole block, paste it, change the values. `pool` decides which
delegations can be seated:

| `pool` | Who is seated |
|---|---|
| `"g20"` | The 21 G20 members only |
| `"extended"` | G20 members plus the 12 invited states |
| `"full"` | Everyone, including international organisations |
| `"press"` | Members plus organisations |
| `"select"` | The 20 listed in `CRISIS_SEATS` above |

**Do not put a seat count in.** Seat numbers are worked out automatically from
the pool so that the committee cards and the country matrix can never disagree
with each other.

Adding a committee here makes it appear on the Committees page, in the country
matrix, and in the registration form's dropdown menus — all at once. You do not
need to touch any HTML.

Run `python3 build.py`.

### 5. Change the wording on a page

Every page has a matching file in `src/pages/`. `about.html` is the About page,
`schedule.html` is the Schedule page, and so on. Open the one you want, find
the sentence, change it, save, and run `python3 build.py`.

The HTML looks busy, but the words are always the plain text between the
angle brackets. You can ignore everything else:

```html
<p class="t-lead">
  This sentence is what appears on the page. ← change this
</p>
```

---

## Where everything lives

```
src/pages/          ← the pages. THIS is what you edit.
src/partials/       ← the shared navigation bar and footer
assets/js/data.js   ← all conference content: committees, countries,
                      schedule, FAQs, Secretariat, resources, fees
assets/css/         ← the styling (see below)
assets/img/         ← the crest, the social image, partner logos
build.py            ← the assembler
```

### The four stylesheets

| File | What's in it |
|---|---|
| `tokens.css` | Colours, type sizes, spacing, shadows. **Start here for any visual change.** |
| `base.css` | Page background, headings, layout helpers |
| `components.css` | Buttons, cards, navigation, forms, tables |
| `pages.css` | Layouts used on exactly one page |

To change the brand colours across every interior page, open
`assets/css/tokens.css` and edit these two lines:

```css
--parchment-300: #EFDDC6;  /* the beige page background */
--maroon-600:    #600808;  /* the maroon accent         */
```

The front page keeps its own copy of the colours at the top of
`src/pages/index.html`, under **EDIT 1**. Change both if you want the whole
site to shift.

---

## Adding a whole new page

1. Copy an existing file in `src/pages/` — `faqs.html` is a simple one to start
   from — and rename it, e.g. `sponsors.html`.
2. Change the block at the very top:
   ```html
   <!--meta
   title: Sponsors
   nav: sponsors
   description: One sentence describing the page, used by Google and by
                link previews on WhatsApp and elsewhere.
   -->
   ```
3. Open `build.py` and add `"sponsors"` to the `PAGE_ORDER` list. (Skip this and
   the page still builds — the build just mentions it isn't listed.)
4. Add a link to it in `src/partials/header.html` and `src/partials/footer.html`
   so people can find it, and in `src/pages/index.html` if you want it in the
   front-page navigation too.
5. Run `python3 build.py`.

---

## Publishing changes

The site is plain HTML. Whatever you use to host it, you upload the top-level
folder and you are done — there is no server-side build.

**On GitHub Pages:** commit and push. That's it. Pages serves the generated
files straight from the repository.

```
git add -A
git commit -m "Update contact details"
git push
```

If you're serving the site from a subfolder rather than a bare domain, open
`build.py`, update the `BASE_URL` line near the top, and rebuild — that keeps
the link previews and the sitemap pointing at the right addresses. All the
links between pages are relative and work from any folder without changes.

---

## Still to be filled in

These ship as placeholders and should be replaced before the site goes public:

1. **Contact addresses** — everything reading `@modelg20.example`, and the phone
   number.
2. **Secretariat names** — the offices currently say "Appointment announced
   ahead of summit". In `assets/js/data.js`, add a `name:` line to any office
   to show a name instead:
   ```js
   { office: "Secretary-General", initials: "SG", name: "A. Name", … }
   ```
3. **Seat availability** — the country matrix currently generates plausible
   availability so the page demonstrates properly. When you have the real
   allotment sheet, replace the `statusFor` function in `data.js`.
4. **Fees and deadlines** — `FEES`, `ACCOMMODATION` and `EVENT.deadlines` in
   `data.js` carry indicative figures.
5. **Documents** — the Resources page links have no files behind them yet. Put
   your PDFs in `assets/docs/` and point the links there.
6. **Forms** — the contact form and the registration form both check what
   people type and show a confirmation, but nothing is sent anywhere, because
   there is no server. Connect them to a form service (Formspree, Netlify
   Forms, Google Forms) when you're ready to collect real registrations.
7. **Partner website link** — the "Visit website" link on the front page points
   at `#`. Point it at the real address.
8. **Social media links** — the four icons on the front page and in the footer
   point at `#`.

---

## If something breaks

**A page looks unstyled.** You're probably opening the file directly rather
than through `python3 -m http.server 8000`. Use the server.

**A change didn't appear.** You edited a file in the top folder instead of in
`src/pages/`, or you forgot to run `python3 build.py`. Also try a hard refresh —
`Ctrl+Shift+R`, or `Cmd+Shift+R` on a Mac.

**The build says "SKIPPED … edited directly since the last build".** You edited
a generated page. Copy your change into the matching file in `src/pages/`, then
build again. Or run `python3 build.py --force` to throw the direct edit away.

**Everything is broken after an edit to `data.js`.** You most likely dropped a
comma or a quotation mark. Undo your change, then redo it more slowly — each
entry needs a comma after it except the last one in a list.

**Getting back to a working state.** If the project is in Git, `git checkout .`
undoes every uncommitted change and returns you to the last saved state.
