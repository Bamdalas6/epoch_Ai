# Epoch AI homepage: redesign concept (unofficial)

Not affiliated with or endorsed by Epoch AI. Content and figures come from epoch.ai for illustration.

| Folder | Stack | What it is |
|---|---|---|
| `content/` | JSON | `site.json` (homepage, read by every part) and `pages.json` (inner pages) |
| `api/` | Python (FastAPI) | Serves the content and validates newsletter signups |
| `web/` | Next.js + React, semantic HTML5 | The website: homepage plus 12 inner pages, white background, zoom and scroll motion |
| `mobile/` | Flutter | Animated companion app reading the same API |

## Pages

| Route | What's on it |
|---|---|
| `/` | Hero, key trends with confidence-interval bars, featured work, filterable latest work, scroll-driven chart story, data cards, expert quote carousel |
| `/latest` | All publications with search, type pills, topic and sort filters |
| `/trends` | Trends dashboard; switch growth between ×/year, doubling time and orders of magnitude; sticky category nav |
| `/data` | Featured datasets plus a searchable, filterable list of all datasets |
| `/data-insights` | Featured insights and a searchable archive |
| `/benchmarks` | Hub at a glance, latest activity timeline, FAQ |
| `/topics` | The four topic groups |
| `/about`, `/about/team`, `/about/careers`, `/about/donate`, `/about/consultations`, `/contact` | Company pages; team directory with search; role accordions; enquiry and contact forms with an error summary |

Links to pages not rebuilt here (individual topic pages, data explorers, FrontierMath, ECI) go to epoch.ai and are marked ↗.
Press **Ctrl K** (or **/**) anywhere to search pages.

## Run it

**Windows shortcut:** double-click `START-WEBSITE.bat`. It starts the API and the website and opens http://localhost:3000. Needs Node.js (and Python for the newsletter form).

Or start each part by hand:

**1. API** (Python 3.10+)

    cd api
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000

**2. Website** (Node 20+)

    cd web
    npm install
    npm run dev          # http://localhost:3000

The site reads from the API and falls back to `content/site.json` if the API is off.
Set `API_URL` if the API is not on `http://127.0.0.1:8000`.

**3. Mobile app** (Flutter 3.19+)

    cd mobile
    flutter create .     # generates the android/ios/web folders once
    flutter pub get
    flutter run -d chrome --dart-define=API_URL=http://127.0.0.1:8000

On an Android emulator use `--dart-define=API_URL=http://10.0.2.2:8000`.

## Deploy to Vercel

1. In Vercel choose **Add New → Project** and import this GitHub repository.
2. Set **Root Directory** to `web` (leave "Include files outside the root directory" on, the default). Framework: Next.js, detected automatically.
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
- Restrict CORS origins in `api/main.py`.
