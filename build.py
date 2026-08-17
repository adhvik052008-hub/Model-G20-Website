#!/usr/bin/env python3
"""
Model G20 2026 — static site assembler.

Composes every page in src/pages/ against the shared shell in src/partials/
and writes plain HTML to the repository root, ready to serve from GitHub
Pages or any static host with no runtime dependency.

    python3 build.py            # build all pages
    python3 build.py --check    # build to memory and report, writing nothing

Front matter lives in an HTML comment at the top of each page file:

    <!--meta
    title: Committees
    nav: committees
    description: One-line summary used for <title>, OG tags and search.
    scripts: matrix.js
    -->
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent.resolve()
PAGES = ROOT / "src" / "pages"
PARTIALS = ROOT / "src" / "partials"

# Order matters only for the build log.
PAGE_ORDER = [
    "index", "about", "committees", "country-matrix", "secretariat",
    "schedule", "resources", "gallery", "faqs", "contact", "register",
    "design-system", "wireframes", "404",
]

# nav key -> the placeholder that receives aria-current="page"
NAV_KEYS = [
    "home", "about", "committees", "matrix", "secretariat", "schedule",
    "resources", "gallery", "faqs", "contact", "register",
]

BASE_URL = "https://adhvik052008-hub.github.io/model-g20-website/"

SHELL = """<!doctype html>
<html lang="en">
<head>
{head}
</head>
<body{body_attr}>
{header}
<main id="main">
{content}
</main>
{footer}
{scripts}
</body>
</html>
"""

META_RE = re.compile(r"^\s*<!--meta\s*(.*?)-->\s*", re.DOTALL)


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def parse_page(text: str) -> tuple[dict, str]:
    """Split a page file into its front matter and its body."""
    meta: dict[str, str] = {}
    match = META_RE.match(text)
    if match:
        for line in match.group(1).splitlines():
            line = line.strip()
            if not line or ":" not in line:
                continue
            key, _, value = line.partition(":")
            meta[key.strip()] = value.strip()
        text = text[match.end():]
    return meta, text.strip("\n")


def build_head(meta: dict, head_tpl: str, slug: str) -> str:
    canonical = BASE_URL + ("" if slug == "index" else f"{slug}.html")
    return (
        head_tpl
        .replace("{{title}}", meta.get("title", "Model G20 2026"))
        .replace("{{description}}", meta.get("description", ""))
        .replace("{{canonical}}", canonical)
    )


def build_nav(html: str, active: str, crest: str) -> str:
    """Fill crest slots and mark the active navigation item."""
    crest_lg = crest.replace('class="crest__mark"', 'class="curtain__mark"')
    html = html.replace("{{crest_lg}}", crest_lg).replace("{{crest}}", crest)
    for key in NAV_KEYS:
        token = "{{a_%s}}" % key
        html = html.replace(token, ' aria-current="page"' if key == active else "")
    # Any nav key not in NAV_KEYS (design-system, wireframes) leaves no marker.
    return re.sub(r"\{\{a_[a-z_]+\}\}", "", html)


def build_scripts(meta: dict) -> str:
    # world.js and data.js are pure data; render.js and map.js populate the DOM;
    # app.js wires interaction last so its observers see the finished markup.
    core = ["world.js", "data.js", "render.js", "map.js"]
    extra = [s.strip() for s in meta.get("scripts", "").split(",") if s.strip()]
    ordered = core + extra + ["app.js"]
    return "\n".join(f'<script src="assets/js/{name}" defer></script>' for name in ordered)


def build_page(slug: str, head_tpl: str, header_tpl: str, footer_tpl: str, crest: str) -> str:
    meta, content = parse_page(read(PAGES / f"{slug}.html"))

    # A standalone page carries its own <html>, styling and scripts. It is
    # copied through byte for byte — the cover page works this way so it can be
    # edited directly without knowing anything about the shell.
    if meta.get("standalone", "").lower() == "true":
        return content + "\n"

    body_class = meta.get("body_class", "").strip()
    return SHELL.format(
        head=build_head(meta, head_tpl, slug),
        body_attr=f' class="{body_class}"' if body_class else "",
        header=build_nav(header_tpl, meta.get("nav", ""), crest),
        content=content,
        footer=footer_tpl.replace("{{crest}}", crest),
        scripts=build_scripts(meta),
    )


def write_sitemap(slugs: list[str]) -> None:
    """Emit sitemap.xml and robots.txt so the two can never drift from PAGE_ORDER."""
    # 404 is reachable but should never be indexed.
    indexable = [s for s in slugs if s != "404"]
    urls = "\n".join(
        "  <url>\n"
        f"    <loc>{BASE_URL}{'' if s == 'index' else s + '.html'}</loc>\n"
        f"    <priority>{'1.0' if s == 'index' else '0.8' if s in ('committees', 'register', 'country-matrix') else '0.6'}</priority>\n"
        "  </url>"
        for s in indexable
    )
    (ROOT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{urls}\n</urlset>\n",
        encoding="utf-8",
    )
    (ROOT / "robots.txt").write_text(
        f"User-agent: *\nAllow: /\n\nSitemap: {BASE_URL}sitemap.xml\n", encoding="utf-8"
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Build the Model G20 2026 site.")
    parser.add_argument("--check", action="store_true", help="build without writing files")
    parser.add_argument("--force", action="store_true",
                        help="overwrite pages that were edited directly since the last build")
    args = parser.parse_args()

    head_tpl = read(PARTIALS / "head.html")
    header_tpl = read(PARTIALS / "header.html")
    footer_tpl = read(PARTIALS / "footer.html")
    crest = read(PARTIALS / "crest.svg").strip()

    found = sorted(p.stem for p in PAGES.glob("*.html"))
    unknown = [s for s in found if s not in PAGE_ORDER]
    slugs = [s for s in PAGE_ORDER if s in found] + unknown
    if not slugs:
        print("No pages found in src/pages/", file=sys.stderr)
        return 1

    total = 0
    skipped = []
    for slug in slugs:
        html = build_page(slug, head_tpl, header_tpl, footer_tpl, crest)
        total += len(html)
        out = ROOT / f"{slug}.html"

        # If someone edited the built page directly, do not silently discard
        # their work — say so and leave the file alone until --force.
        if out.exists() and not args.check and not args.force:
            if out.stat().st_mtime > (PAGES / f"{slug}.html").stat().st_mtime + 1:
                if out.read_text(encoding="utf-8") != html:
                    skipped.append(slug)
                    print(f"  SKIPPED  {slug}.html  (edited directly since the last build)")
                    continue

        if not args.check:
            out.write_text(html, encoding="utf-8")
        print(f"  {'checked' if args.check else 'built'}  {slug}.html  ({len(html):,} bytes)")

    if not args.check:
        write_sitemap(slugs)
        print("  built  sitemap.xml, robots.txt")

    print(f"\n{len(slugs)} pages · {total:,} bytes total")
    if unknown:
        print(f"note: {', '.join(unknown)} not listed in PAGE_ORDER")
    if skipped:
        print(
            "\nLeft alone because they were edited directly: "
            + ", ".join(f"{s}.html" for s in skipped)
            + "\n  • To keep those edits, copy them back into src/pages/ so they survive."
            + "\n  • To discard them and rebuild from src/, run:  python3 build.py --force"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
