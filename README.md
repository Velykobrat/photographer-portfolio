# MK Photography

A bilingual Ukrainian and English photography portfolio for **MK Photography**, based in Kyiv, Ukraine.

The website presents selected photography work, introduces the photographer, provides direct contact channels and allows potential clients to submit structured photoshoot requests.

**Live website:**  
https://photographer-portfolio-chi.vercel.app

## Overview

MK Photography is a real-world photography portfolio focused on portrait, fashion and personal photography.

The project started as a portfolio website and has evolved into a production product with cloud-hosted photography, responsive layouts, client inquiry handling and automated notifications.

The version in this repository is **v1.2.0 — Bilingual Portfolio & Reliability**.

The live deployment must be checked separately; updating this version does not confirm that production has been deployed.

This version adds Ukrainian and English content, prerendered page SEO, accessible gallery interactions and more reliable contact requests. The next milestone is photographer-managed content.

## Features

- Responsive photography portfolio
- Cloudinary-powered image delivery and optimization
- Fullscreen photo gallery
- Home, Portfolio, Journal and Contact pages
- Structured photoshoot request form
- Shoot type selection
- Preferred date picker
- Location and message fields
- Telegram notifications for new requests
- Email notifications through Brevo
- Server-side validation
- Honeypot spam protection
- Direct Instagram, Telegram, Viber and email contact options
- Ukrainian and English pages with a language switch
- Prerendered HTML, canonical URLs, hreflang and structured data
- Generated sitemap and robots.txt
- Static page routing and a custom 404 page on Vercel
- Automated quality checks and 57 regression tests
- Responsive desktop and mobile layouts

## Tech Stack

### Frontend

- React
- TypeScript
- React Router
- CSS Modules
- Vite

### Media

- Cloudinary

### Backend / Integrations

- Vercel Serverless Functions
- Telegram Bot API
- Brevo Email API

### Deployment

- Vercel

## Architecture

```text
Visitor
   │
   ├── Home
   ├── Portfolio
   │      │
   │      └── Cloudinary
   │
   ├── Journal
   │
   └── Contact
          │
          └── Contact Form
                 │
                 ▼
          Vercel Serverless API
                 │
          ┌──────┴──────┐
          ▼             ▼
      Telegram        Brevo
                      Email
```

## Portfolio Images

Portfolio images are hosted on Cloudinary instead of being stored directly in the repository.

The frontend retrieves the public portfolio image list and generates optimized Cloudinary URLs for gallery and fullscreen views.

Cloudinary automatically handles:

- responsive image sizing
- automatic format selection
- automatic quality optimization
- reduced repository size
- optimized delivery through CDN

## Contact Request Flow

Client inquiries are submitted through the website contact form.

The frontend sends structured request data to:

```text
/api/contact
```

The serverless API validates the request and then attempts delivery through:

```text
Telegram Bot API
+
Brevo Email API
```

A request is considered successfully delivered when at least one notification channel succeeds.

The form also includes:

- required-field validation
- consent validation
- maximum input lengths
- preferred date validation
- honeypot spam protection

Sensitive API credentials are stored as Vercel environment variables and are never exposed to the frontend.

## Local Development

Clone the repository:

```bash
git clone https://github.com/Velykobrat/photographer-portfolio.git
cd photographer-portfolio
```

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Use Node.js 22.13 or newer within the 22.x release line. On Windows, use
`npm.cmd` if PowerShell blocks `npm.ps1`.

`npm run dev` serves the frontend. The `/api` proxy expects a backend on port
5000; use `vercel dev` from a linked Vercel project to run the deployed functions
locally. Real contact delivery requires the notification environment variables
below. Automated tests mock delivery and never send Telegram messages or emails.

Run ESLint:

```bash
npm run lint
```

Check frontend and server TypeScript and run the regression suite:

```bash
npm run check
npm test
```

The GitHub Actions quality workflow runs lint, TypeScript checks, tests, the
production build and dependency audit on pull requests and pushes to `main`.

Create a production build:

```bash
npm run build
```

## Environment Variables

The production contact API uses the following environment variables:

```text
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
BREVO_API_KEY
CONTACT_EMAIL_TO
CONTACT_EMAIL_FROM
```

These values must not be committed to the repository.

### Contact request protection

The endpoint accepts JSON bodies up to 16 KiB, checks field types and lengths,
allows only the supported shoot types and validates calendar dates using
`Europe/Kyiv`. Cross-origin browser submissions are rejected. Each notification
provider has an 8-second deadline; success requires confirmation from at least
one provider. Logs do not include request data or provider credentials.

The basic rate limit is 5 valid requests per IP in a 10-minute window. Without
shared storage it is **best effort per server process** and resets on cold starts;
it does not provide a global limit across Vercel instances. For a shared limit,
connect an Upstash Redis store to this Vercel project and configure both:

```text
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

The shared counter uses an atomic Redis script and expires after 10 minutes.
Only a hash of the IP is used as the counter key. If shared storage is configured
but unavailable or incomplete, the endpoint returns 503 and the form points to
direct contact channels. A blocked request returns 429 with `Retry-After`.

### Routing

Production builds prerender all 26 English/Ukrainian page URLs with initial page content,
canonical, Open Graph/Twitter metadata, reciprocal hreflang and JSON-LD. English URLs
remain unchanged; Ukrainian routes use /uk/. The language switch keeps the current page.
Journal translations are in src/data/journalEnglish.ts; Ukrainian originals are preserved.
Review English editorial translations with the photographer before publishing.

Vercel serves generated HTML with cleanUrls and uses dist/404.html for unknown URLs.
API endpoints are handled separately. Root and legacy /blog URLs redirect permanently.
The old bot-specific Journal rewrite is replaced by HTML served identically to all visitors.
robots.txt and sitemap.xml are generated from the same page map as metadata.
Gallery photographs still load from Cloudinary in the browser; gallery titles and links
are available in initial HTML. New content requires a rebuild.

Canonical domain: src/data/site.ts. Currently the existing Vercel production URL.
When adding a custom domain, update SITE_URL and rebuild; do not use a preview URL.
A full studio address is not known, so no LocalBusiness address or invented reviews are added.

Development: npm.cmd run dev on Windows. Open /uk/home to review Ukrainian.
Production HTML checks: npm.cmd run build (includes scripts/verify-seo.mjs).
Vite development routing does not simulate Vercel redirects or HTTP 404 statuses.
Validate redirects, unknown URL status, both languages and contact delivery in a Vercel
preview before merging. Submit the deployed sitemap to Google Search Console afterward.

## Development Roadmap

### v1.0.0 — Stable Production Release

- Core responsive website
- Photography portfolio
- Cloudinary integration
- Journal
- Contact request system
- Telegram notifications
- Brevo email notifications
- Vercel deployment

### v1.1 — Portfolio Experience

Planned improvements include:

- portfolio collections and photography series
- improved fullscreen gallery UX
- mobile swipe navigation
- keyboard navigation and accessibility improvements
- better photo metadata and alt text
- Ukrainian and English localization
- improved SEO and social sharing metadata

### Future

- photographer-managed content
- CMS integration
- self-managed portfolio collections
- Journal article management
- advanced SEO
- analytics
- further performance and UX improvements

## Release History

### v1.2.0 — Bilingual Portfolio & Reliability

- Added Ukrainian routes under `/uk/` while preserving English URLs
- Translated navigation, pages, contact form, calendar and both Journal stories
- Added initial HTML for 26 page URLs, localized metadata, social previews, hreflang and JSON-LD
- Generated sitemap and robots.txt; replaced bot-specific rewrites with static page delivery
- Improved gallery focus management, keyboard controls, loading, cancellation and retry states
- Hardened contact request validation, provider timeouts and delivery confirmation
- Added optional shared Upstash rate limiting with a documented local fallback
- Simplified form typography, examples and spacing
- Updated Vite/React tooling and added CI, API type checks and 57 tests

Validation: lint, TypeScript, tests and production build. Before publishing: review English
editorial translations and verify Vercel routing, mobile layout and real contact delivery.


### v1.1.3 — Beyond the Frame

- Published the second Journal story: _Beyond the Frame_
- Added new editorial photography for the article
- Added social preview metadata for the new publication
- Improved Journal image loading for multiple articles

### v1.1.2 — Journal Foundation

- Added the new Journal section and `/journal` routes
- Added individual editorial article pages
- Published the first story: _12 Questions with Margaret_
- Added separate card, hero and editorial article images
- Added direct-route support for Journal pages on Vercel

### v1.0.0

First stable production release of MK Photography.

The release includes the complete responsive website, Cloudinary portfolio, Journal, contact request workflow, Telegram and email notifications, and Vercel production deployment.

## License

This project is licensed under the MIT License.
