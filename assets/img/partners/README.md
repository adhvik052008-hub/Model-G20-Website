# Partner logos

Drop partner logo files here, then point at them from the front page.

Open `src/pages/index.html`, find the section marked **EDIT 6**, and replace
the two lines inside `.partner__mark`:

```html
<b>FLAME</b>
<span>University</span>
```

with:

```html
<img src="assets/img/partners/flame-university.png" alt="FLAME University">
```

Then run `python3 build.py`.

**What works best:** SVG if the partner supplies one, otherwise PNG with a
transparent background, at least 600px wide. The plate is a warm beige, so a
logo in a single dark colour sits on it best. Very light or white logos will
disappear.

Always use the partner's official file. Do not recreate a logo by hand.
