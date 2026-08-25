# How to edit this site

Written for someone who has never touched this project before. No prior
knowledge assumed. Nothing here needs a developer.

---

## The one thing to know first

There are **two kinds of page** in this site, and they are edited differently.

| | Where you edit | Do you need to run anything? |
|---|---|---|
| **The homepage** (`index.html`) | `src/pages/index.html` — one self-contained file | No |
| **Every other page** | `src/pages/<name>.html` | Yes — `python3 build.py` |

The interior pages all share one navigation bar and one footer. Rather than keep
seven copies of those in step by hand, they are assembled from a template. The
homepage has its own look, its own animated background and its own navigation,
so it stands alone.

**Golden rule: edit files inside `src/`. Never edit the `.html` files sitting in
the top folder** — those are generated, and the next build replaces them.

(If you forget and edit a generated file anyway, the build notices and refuses
to overwrite your work. It tells you exactly what to do.)

---

## Running the build

Open a terminal in the project folder:

```
python3 build.py
```

That is the whole thing. It takes under a second and prints what it wrote.
Refresh your browser and the change is there.

- `python3 build.py --check` — shows what *would* change, writes nothing.
- `python3 build.py --force` — rebuilds even pages you edited directly.

### Seeing the site on your own machine

```
python3 -m http.server 8000
```

Then visit **http://localhost:8000**. Leave the terminal open while you work;
press `Ctrl+C` when you're done.

> Opening `index.html` by double-clicking mostly works, but the committee cards
> and the team cards will be blank, because browsers block those files from
> loading over `file://`. Use the command above instead.

---

## The seven most common jobs

### 1. Change the conference dates

Open **`assets/js/data.js`**. Near the top:

```js
startISO: "2026-10-10T09:00:00+05:30",
endISO:   "2026-10-11T16:00:00+05:30",
datesLabel: "10th – 11th October 2026",
```

`startISO` drives every countdown on the site. The format is
`YYYY-MM-DDTHH:MM:SS+05:30` — the `+05:30` is India Standard Time; leave it.

The dates are also written out in plain text in three places, so the pages read
correctly even if the data file is ever removed. Search for
`10th – 11th October 2026` in `src/pages/index.html`, `src/pages/schedule.html`
and `src/partials/footer.html` and change all of them.

Then run `python3 build.py`.

### 2. Change contact details

- **Everywhere except the home page** — `assets/js/data.js`, the `email` and
  `phone` lines. The footer and the contact page read from there.
- **The home page** — `src/pages/index.html`, the section marked **EDIT 7**.

Then run `python3 build.py`.

### 3. Add, rename or remove a committee

Open **`assets/js/data.js`** and find the `COMMITTEES` list. Each one looks like
this:

```js
{
  id: "human-rights",          // used in links — lowercase, hyphens, no spaces
  name: "Human Rights",
  level: "Beginner",           // Beginner | Intermediate | Advanced
  icon: "rights",              // see the icon list below
  agenda: "How can G20 nations improve financial oversight…"
},
```

Copy a whole block, paste it, change the values. Adding one here makes it appear
on the Committees page **and** in the registration form's dropdown at the same
time — you do not need to touch any HTML.

Available `icon` values: `rights`, `leaf`, `circuit`, `balance`, `shield`,
`gavel`, `build`, `chart`.

Then run `python3 build.py`.

### 4. Add a real name or photograph to a team card

Open **`assets/js/data.js`** and find `SECRETARIAT` or `ORGANISING`. Add a
`name`, and a `photo` if you have one:

```js
{ office: "Secretary-General", abbr: "SG", initials: "SG",
  name: "A. Name",
  photo: "assets/img/team/a-name.jpg",
  remit: "…" },
```

Put the image in `assets/img/team/` and crop it square. Without a `photo`, the
card draws an initials plate instead.

The cards on the **home page** are written out in the HTML rather than
generated — Letters from Secretariat under **EDIT 9**, the Organising Committee
under **EDIT 10**, both in `src/pages/index.html`.

Then run `python3 build.py`.

### 5. Replace a partner logo

Two placeholder files ship with the site:

```
assets/img/partners/flame-university.svg
assets/img/partners/wanyang-india.svg
```

Replace either file with the official artwork, **keeping the same filename**,
and both the homepage and the data file pick it up with no other change. A PNG
works too — if you use one, change the `.svg` to `.png` in
`src/pages/index.html` (under **EDIT 6**) and in `data.js`.

### 6. Change the map location

The map needs no Google account and no API key. In `assets/js/data.js`:

```js
mapQuery: "The School of Raya, Hennur Bagalur Road, …",
```

Change the address and the contact page and footer both follow. The homepage
has its own copy — search for `maps.google.com` in `src/pages/index.html`.

### 7. Change the wording on a page

Every page has a matching file in `src/pages/`. `about.html` is the About page,
`schedule.html` is the Schedule page, and so on. Open the one you want, find the
sentence, change it, save, run `python3 build.py`.

The HTML looks busy, but the words are always the plain text between the angle
brackets:

```html
<p class="t-lead">
  This sentence is what appears on the page. ← change this
</p>
```

---

## Collecting registrations

The registration form and the contact form both work as soon as the site is on
Netlify — Netlify detects them on the first deploy and collects submissions
under **Site → Forms**, where you can turn on email notifications.

If you would rather use Google Forms or your own backend, the instructions are
written in full at the top of `src/pages/register.html`. It is a four-step
change.

Until the site is deployed, submitting a form shows a short message asking the
sender to email instead. That is deliberate — the site never claims to have sent
something it did not send.

---

## Where everything lives

```
src/pages/          ← the pages. THIS is what you edit.
src/partials/       ← the shared navigation bar and footer
assets/js/data.js   ← committees, team, key dates, partners, contacts, socials
assets/css/         ← the styling (see below)
assets/img/         ← the crest, the social card, partner logos
build.py            ← the assembler
```

### The four stylesheets

| File | What's in it |
|---|---|
| `tokens.css` | Colours, type sizes, spacing, shadows. **Start here for any visual change.** |
| `base.css` | Page background, headings, layout helpers |
| `components.css` | Buttons, cards, navigation, forms, badges |
| `pages.css` | Page layouts and the conference components |

To change the brand colours across every interior page, open
`assets/css/tokens.css`:

```css
--parchment-300: #EFDDC6;  /* the beige page background */
--maroon-600:    #600808;  /* the maroon accent         */
```

The homepage keeps its own copy of the colours at the top of
`src/pages/index.html`, under **EDIT 1**. Change both to shift the whole site.

---

## Adding a whole new page

1. Copy an existing file in `src/pages/` — `schedule.html` is a simple one — and
   rename it, e.g. `sponsors.html`.
2. Change the block at the very top:
   ```html
   <!--meta
   title: Sponsors
   nav: sponsors
   description: One sentence describing the page, used by Google and by link
                previews on WhatsApp and elsewhere.
   -->
   ```
3. Open `build.py` and add `"sponsors"` to `PAGE_ORDER`, and `"sponsors"` to
   `NAV_KEYS`.
4. Add a link in `src/partials/header.html` (both the top bar and the mobile
   drawer) and in `src/partials/footer.html`. Add it to `src/pages/index.html`
   too if you want it in the homepage navigation.
5. Run `python3 build.py`.

---

## Publishing changes

The site is plain HTML. Whatever you use to host it, you upload the top-level
folder and you are done — there is no server-side build.

**On Netlify, connected to GitHub:** commit and push. Netlify redeploys on its
own.

```
git add -A
git commit -m "Update contact details"
git push
```

**On Netlify, by drag-and-drop:** zip the project folder and drop it on
[app.netlify.com/drop](https://app.netlify.com/drop).

---

## Still to be filled in

These ship as placeholders and should be replaced before launch:

1. **Phone number** — `+91 80 4000 1234` is a placeholder. (The email address
   is real: `modelg20@theschoolofraya.com`.)
2. **Team portraits** — every card draws an initials plate. See job 4 above.
3. **Logos** — see job 5 above.
4. **Partner website links** — the two "Visit website" links point at `#`.
5. **Social media links** — the four handles in `SOCIALS` point at `#`.
6. **The two letters** — see the note at the top of the Letters section in
   `src/pages/index.html`.

---

## If something breaks

**A page looks unstyled.** You're probably opening the file directly rather than
through `python3 -m http.server 8000`. Use the server.

**A change didn't appear.** You edited a file in the top folder instead of in
`src/pages/`, or you forgot to run `python3 build.py`. Also try a hard refresh —
`Ctrl+Shift+R`, or `Cmd+Shift+R` on a Mac.

**The build says "SKIPPED … edited directly since the last build".** You edited
a generated page. Copy your change into the matching file in `src/pages/`, then
build again — or run `python3 build.py --force` to throw the direct edit away.

**Everything is broken after an edit to `data.js`.** You most likely dropped a
comma or a quotation mark. Undo your change, then redo it more slowly — each
entry needs a comma after it except the last one in a list.

**Getting back to a working state.** `git checkout .` undoes every uncommitted
change and returns you to the last saved state.
