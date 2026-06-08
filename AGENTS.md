# AGENTS.md

## Overview
Personal Jekyll blog hosted on GitHub Pages. Uses the `minima` theme with custom Bootstrap-based CSS/JS overrides.

## Stack
- **Jekyll 4.4.1** (via Ruby 3.2, see `Dockerfile`)
- **Theme**: minima
- **Plugins**: jekyll-feed, jekyll-paginate, jekyll-seo-tag, jekyll-sitemap
- **Frontend**: Bootstrap + custom `clean-blog` CSS/JS
- **Docker**: Custom `Dockerfile` based on `ruby:3.2-bookworm` (ARM64 native)

## Local Dev Commands
```bash
# Standard Jekyll serve
bundle exec jekyll serve

# Build drafts
bundle exec jekyll build --drafts
```

Or via Docker (avoids local Ruby setup):
```bash
docker-compose up --build jekyll-dev   # builds image and runs on http://localhost:4000 with --drafts
```

## Asset Build (Grunt)
```bash
# Install deps if needed
npm install

# Build CSS (Less -> CSS), minify JS, and add license banner
grunt default
```
Task: uglifies `js/clean-blog.js`, compiles `less/clean-blog.less` into `css/clean-blog.css` + `.min.css`, and applies the license banner.

## Key Directory Layout / Gotchas
- **`_config.yml`** is the root of truth. `timezone: Europe/London` is set.
- **Posts**: `YYYY-MM-DD-title.md` (also `.html` is allowed). Frontmatter must include `header-img:` if using a custom banner.
- **Pages** (top-level `.html` with frontmatter): `index.html`, `about.html`, `contact.html`, plus the generated `404.html`.
- **`_layouts/`**: `default` -> `page` (no wrapper header) / `post` (header banner + previous/next pager).
- **`_includes/`**: shared head, nav, footer, analytics, and a reusable `youtube.html` include.
- **`_site`** and `.jekyll-cache` are in `.gitignore`; do not commit build artifacts.

## Content Conventions
- `permalink: /:title` (set globally in `_config.yml`)
- Default author for posts & pages: `Baran Buluttekin` (set via `defaults` in `_config.yml`)
- Contact form uses `formspree.io/{{ site.email_username }}` (configured in `_config.yml`)
- `page.header-img` overrides `site.header-img` for page/post banners

## Testing Local Changes
There are no automated tests. Verify changes by running `jekyll serve` (or `docker-compose`) and inspecting at `http://localhost:4000`.
