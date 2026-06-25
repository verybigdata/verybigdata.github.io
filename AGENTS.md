# AGENTS.md

## Overview
Personal Jekyll blog hosted on GitHub Pages. Lean, mobile-first design with auto dark/light mode, Inter + JetBrains Mono fonts, and Rouge syntax highlighting. No CSS/JS frameworks — all styles are hand-written SCSS compiled by Jekyll.

## Stack
- **Jekyll 4.4.1** (via Ruby 3.3.4, see `Dockerfile`)
- **Theme**: minima (declared, but all layouts/styles are fully custom)
- **Plugins**: jekyll-feed, jekyll-paginate, jekyll-seo-tag, jekyll-sitemap
- **Frontend**: Custom SCSS (`_sass/` → `assets/main.css`) + vanilla JS (`assets/nav.js`)
- **Fonts**: Inter (body) + JetBrains Mono (code) via Google Fonts
- **Syntax highlighting**: Rouge (built into Jekyll/kramdown)
- **Docker**: Uses `ghcr.io/actions/jekyll-build-pages:v1.0.13` for parity with GitHub Pages build environment (AMD64; runs via emulation on ARM64 hosts)

## Local Dev
```bash
# Preferred: Docker (matches GitHub Pages environment exactly)
docker-compose up --build jekyll-dev   # http://localhost:4000 with --drafts

# Or local Ruby
bundle exec jekyll serve
```

No Grunt/npm asset build step — Jekyll compiles SCSS natively.

## Key Directory Layout

```
_sass/
  _variables.scss   ← CSS custom properties (colors, fonts, breakpoints)
  _base.scss        ← reset, body, typography, links, tables
  _nav.scss         ← fixed top navbar, scroll-aware, mobile hamburger, theme toggle
  _hero.scss        ← page/post hero banner with optional cover image
  _post-list.scss   ← home page post list and pagination
  _post.scss        ← single post layout, prev/next pager
  _syntax.scss      ← Rouge syntax highlighting, light + dark token colors
  _footer.scss      ← footer with inline SVG social icons
  _forms.scss       ← contact form styles
  _utils.scss       ← utility classes (img-responsive, embed-responsive, etc.)

assets/
  main.scss         ← imports all _sass partials; Jekyll compiles to assets/main.css
  nav.js            ← scroll-aware navbar + dark/light theme toggle

_layouts/
  default.html      ← HTML shell: head → nav → content → footer
  page.html         ← extends default; hero banner + prose container
  post.html         ← extends default; hero banner + article + prev/next pager

_includes/
  head.html         ← <head>: meta, anti-flash theme script, Google Fonts, main.css
  nav.html          ← semantic <nav> with CSS-only hamburger + theme toggle button
  footer.html       ← SVG social icons (RSS, Twitter, GitHub, LinkedIn, Email) + copyright
  g_analytics.html  ← Google Analytics 4
  third_party.html  ← MathJax 2.7.1 (async)
  twitter.html      ← Twitter Card meta tags
  youtube.html      ← reusable {% include youtube.html id="..." %} embed
```

## Dark / Light Theme
- Default: follows OS `prefers-color-scheme`
- User override: sun/moon button in navbar; choice saved to `localStorage`
- Anti-flash: inline script in `<head>` restores saved theme before first paint
- CSS: `[data-theme='dark']` attribute on `<html>` overrides the OS preference

## Content Conventions
- `permalink: /:title` (global in `_config.yml`)
- Default author: `Baran Buluttekin` (via `defaults` in `_config.yml`)
- **Posts**: `YYYY-MM-DD-title.md` (or `.html`). Front matter fields:
  - `header-img:` — path to hero image (e.g. `img/light.jpg`); omit for plain title block
  - `description:` — shown as excerpt on home page; without it nothing renders in the list
  - `title:`, `subtitle:` — displayed in hero banner
- **Pages**: top-level `.html` with front matter (`layout: page`). Same `header-img:` / `description:` conventions.
- Contact form posts to `formspree.io/{{ site.email_username }}` (configured in `_config.yml`)

## Breakpoints (mobile-first)
| Breakpoint | Width |
|---|---|
| Mobile (base) | < 640px |
| Tablet | ≥ 640px |
| Desktop | ≥ 768px |

- Hamburger menu appears at ≤ 640px (CSS-only, no JS)
- Prose container max-width: `760px`
- Nav inner max-width: `1200px`

## Testing Local Changes
No automated tests. Verify by running `docker-compose up --build jekyll-dev` and inspecting at `http://localhost:4000`.

Check:
1. Light and dark mode (toggle button + OS preference)
2. Hero image on pages with `header-img:` set; plain title block where it's absent
3. Code blocks render with syntax colours in both themes
4. Mobile view at 375px: hamburger menu, readable hero text, horizontal code scroll
5. Home page shows `description:` field content, not raw post markup
