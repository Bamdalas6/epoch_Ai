# Epoch AI homepage: redesign concept (unofficial)

Not affiliated with or endorsed by Epoch AI. Content and figures come from epoch.ai for illustration.

| Folder | Stack | What it is |
|---|---|---|
| `content/` | JSON | `site.json` (homepage, read by every part) and `pages.json` (inner pages) |
| `server/` | Python (FastAPI) | Optional: serves the content and validates newsletter signups |
| `app/`, `components/`, `lib/` | Next.js + React, semantic HTML5 | The website: homepage plus 12 inner pages, white background, zoom and scroll motion |
| `mobile/` | Flutter | Animated companion app reading the same API |

## Pages

Every link stays on this site: 92 pages, checked by crawling every link.

| Route | What's on it |
|---|---|
| `/` | Hero, key trends, featured work, filterable latest work, scroll-driven chart story, data cards, expert quotes |
| `/latest`, `/data-insights`, `/newsletter`, `/podcast` | Publication lists with search and filters |
| `/publications/[slug]` | One page per report, data insight, newsletter issue and podcast episode (35) |
| `/trends` | Trends dashboard with ×/year, doubling time and OOM views |
| `/topics`, `/topics/[slug]` | Topic hub and 15 topic pages |
| `/data`, `/data/[slug]` | Data hub and 16 dataset pages |
| `/benchmarks`, `/benchmarks/[slug]` | Benchmark hub and 5 benchmark pages (ECI, FrontierMath, Open Problems, MirrorCode, Automation Reports) |
| `/about`, `/about/team`, `/about/transparency`, `/about/press`, `/about/consultations`, `/about/careers`, `/about/careers/apply/[slug]`, `/about/donate`, `/contact` | Company pages and forms |
| `/legal/privacy`, `/legal/cookies` | This concept's own privacy and cookie notes |

Content lives in `content/site.json` (homepage), `content/pages.json` (main pages) and `content/library.json` (topics, datasets, benchmarks, newsletter, podcast, transparency, press).
Old epoch.ai-style addresses such as `/eci` or `/gradient-updates` redirect to the matching page. The only outbound links are Epoch AI's social profiles and the every.org donation page.
Press **Ctrl K** (or **/**) anywhere to search pages.

## Deploy to Vercel

1. In Vercel choose **Add New → Project** and import this GitHub repository.
2. Leave **Root Directory** empty. Framework: Next.js, detected automatically.
3. Deploy. No environment variables are needed: pages are pre-rendered from `content/*.json`, and `/api/subscribe` is answered by a built-in route.
4. Optional: host the Python API elsewhere and set `API_URL` to its address to have the site read content from it.

## Motion, and how it stays accessible

- Hero: headline words rise in, trend line draws itself, squares spring in, and the graphic zooms as you scroll past.
- Scroll: sections fade and rise in; cards zoom in; the chart, featured card, quote and consultation box zoom with scroll position; chart bars grow; numbers count up; a progress bar tracks reading position.
- Hover: cards tilt and zoom, numbers scale, links draw underlines.
- All of it switches off when the visitor's device asks for reduced motion, and the page is fully readable without JavaScript.
- The scrolling "Trusted by" list has a Pause button and stops on hover.

## Before going live

- Messina Sans is a licensed font and is not bundled; add the font files you are licensed to use.
- Links to pages not rebuilt here point to the live epoch.ai pages.
- The contact and consultation forms validate but do not send; connect them to a form backend.
- Hanken Grotesk (free, via next/font) stands in for Messina Sans until licensed files are added.
- `POST /api/subscribe` only validates; connect a mailing-list provider.
- Restrict CORS origins in `server/main.py`.
