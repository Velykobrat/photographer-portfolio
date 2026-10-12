# MK Photography

A bilingual Ukrainian and English photography portfolio with a Sanity owner panel for managing series and photographs.

**Version:** v1.3.0 — Owner-managed Portfolio

- [Live website](https://photographer-portfolio-chi.vercel.app)
- [Ukrainian website](https://photographer-portfolio-chi.vercel.app/uk/home)
- [Owner panel](https://mk-photography-d3nr3igp.sanity.studio/)
- [GitHub releases](https://github.com/Velykobrat/photographer-portfolio/releases)

## Production status

The website is deployed on Vercel using its existing `vercel.app` address. A custom domain is not currently planned.

Sanity Studio is deployed, the existing portfolio has been migrated, and published Sanity content is enabled in production. Publishing, updating or deleting published portfolio content triggers a rebuild through the Sanity → Vercel webhook. Changes appear after a successful deployment; a failed build leaves the previous website online.

The owner can manage portfolio series and photos without editing code. Journal articles remain maintained in this repository.

## Features

- Ukrainian and English pages with a language switch that preserves the current page.
- Home, Portfolio, Journal and Contact pages.
- Portfolio category filters, featured series and direct series URLs.
- Owner-managed series titles, descriptions, categories, covers and display order.
- Batch photo uploads, draggable photo ordering, crop/hotspot and bilingual photo descriptions.
- Fullscreen viewer with keyboard and touch navigation, focus management and loading/error states.
- Right swipe on a series page to return to the localized portfolio; viewer gestures remain separate.
- Responsive images and layouts for desktop and mobile.
- Photoshoot request form with server-side validation, Telegram and Brevo email notifications.
- Direct Instagram, Telegram, Viber and email contact links.
- Prerendered pages, localized metadata, canonical URLs, hreflang, JSON-LD, sitemap and robots.txt.
- Automated frontend/API checks, Studio checks and dependency audits.

## Technology

| Area | Tools |
| --- | --- |
| Website | React, TypeScript, React Router, CSS Modules, Vite |
| Portfolio content | Sanity Studio, public production dataset and Sanity image CDN |
| Editorial / legacy media | Cloudinary |
| Contact API | Vercel Functions, Telegram Bot API, Brevo Email API |
| Deployment | Vercel for the website; Sanity hosting for Studio |
| Verification | ESLint, TypeScript, Vitest and GitHub Actions |

## Managing the portfolio

Open the [owner panel](https://mk-photography-d3nr3igp.sanity.studio/) and sign in with a Sanity account invited to the project. A link alone does not grant editing access: invite the owner to project `d3nr3igp` with an appropriate content-editing role.

1. Create or edit a photography series.
2. Add Ukrainian and English titles/descriptions, a category and a cover.
3. Upload photos, arrange them and add photo descriptions.
4. Publish the series, then wait for the website rebuild to finish.

Drafts do not appear on the public website. A series address is locked after its first Studio publication to preserve existing links. Duplicating a series clears its address so the new series can receive a unique URL. Addresses accept lowercase Latin letters, numbers and separating hyphens, up to 80 characters.

See [Sanity setup and maintenance](docs/sanity-setup.md) for configuration, migration and deployment details. Migration is already complete for this project; those instructions are retained for maintenance or a new environment.

## Content and deployment flow

```text
Owner → Sanity Studio → Published series and photos
                              │
                       Sanity webhook
                              │
                       Vercel main build
                              │
                Validated portfolio snapshot
                              │
             Website + prerendered pages + sitemap

Visitor → Contact form → /api/contact → Telegram / Brevo
```

Production uses `PORTFOLIO_SOURCE=sanity`. The build reads published content from the uncached Sanity API, validates it and creates a shared snapshot for the client, prerendered pages and metadata. No write token is included in the public website or Studio bundle.

The checked-in catalogue remains a legacy bootstrap for local development. `PORTFOLIO_SOURCE=legacy` uses the original Cloudinary catalogue. Journal images and other existing editorial assets may still use Cloudinary. Do not overwrite the checked-in bootstrap with a local production snapshot.

## Local development

Use Node.js 22.13 or newer within the 22.x release line.

```bash
git clone https://github.com/Velykobrat/photographer-portfolio.git
cd photographer-portfolio
npm ci
npm run dev
```

To review current Sanity content locally, set `PORTFOLIO_SOURCE=sanity` and run `npm run content:sync` before starting Vite. Environment-variable syntax depends on your shell. On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

The Vite server serves the frontend. Its `/api` proxy expects a backend on port 5000; use `vercel dev` in a linked project to run Vercel functions locally. Real notification delivery requires the environment variables below. Automated tests mock delivery and do not send messages.

```bash
npm run lint
npm run check
npm test
npm run build
```

For Studio:

```bash
cd studio
npm ci
npm run check
npm run audit:security
npm run build
npm run dev
```

## Configuration

| Variable | Purpose |
| --- | --- |
| `PORTFOLIO_SOURCE=sanity` | Load published Sanity portfolio content during the website build |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Telegram request notifications |
| `BREVO_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM` | Email request notifications |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Optional shared contact rate limiting |

Store website configuration in Vercel environment variables. Keep credentials out of source control, client bundles and issue/PR text. Studio deployments use the GitHub Actions secret `SANITY_DEPLOY_TOKEN`. The temporary migration token is only for migration and should be revoked after use.

The contact API accepts JSON up to 16 KiB, validates fields and calendar dates using `Europe/Kyiv`, rejects cross-origin browser submissions and uses honeypot protection. A request succeeds only when at least one notification provider confirms delivery; each provider has an 8-second deadline.

The basic rate limit is five valid requests per IP per ten minutes. Without shared storage it is best effort per server process and resets on cold starts. Optional Upstash configuration provides a shared counter; unavailable or incomplete configured storage returns 503. Rate-limited requests return 429 with `Retry-After`. Logs omit request data and provider credentials.

## Routing and SEO

English routes keep their original paths; Ukrainian routes use `/uk/`. Builds generate localized page HTML, metadata and sitemap entries from the current page map and published series. The number of URLs changes as the owner adds or removes series.

Vercel serves prerendered HTML through `cleanUrls`, redirects the root and legacy `/blog` paths, and serves a custom 404 page for unknown URLs. API routes are handled separately.

The canonical address in `src/data/site.ts` is the production Vercel URL. Preview deployment URLs must not replace it. Journal translations are maintained in `src/data/journalEnglish.ts`.

## Verification and maintenance

The v1.3.0 application passed 94 regression tests, lint, frontend/API TypeScript checks and a production build. Studio passed its TypeScript check, build and deployment. Website and Studio deployment status were verified separately.

GitHub Actions runs website quality checks on pull requests and `main`. Studio checks run for relevant changes and weekly. Studio dependency auditing also runs before deployment.

Two unresolved upstream tooling advisories remain covered by exact-version exceptions through **2026-11-11**. A passing audit gate does not mean zero vulnerabilities. New advisories, changed affected versions, registry failures and expired exceptions block Studio deployment. Review fixes before expiry; the existing deployed website and Studio are not disabled when an exception expires. See [Studio security notes](studio/SECURITY.md).

## Optional future work

- Journal editing through the owner panel.
- Visitor and inquiry analytics.
- Search Console setup and monitoring.
- Automated content backups and tested restoration.
- Ongoing dependency updates and maintenance.

These items are outside the current portfolio release. Portfolio CMS integration and owner-managed series/photos are already delivered.

## Release history

### v1.3.0 — Owner-managed Portfolio

- Deployed a Ukrainian Sanity Studio for independent portfolio management.
- Migrated the existing seven series and 57 photographs from Cloudinary to Sanity.
- Added bilingual series content, cover crop/hotspot, featured series and ordered photo uploads.
- Enabled production Sanity content and automatic Vercel rebuilds after publication.
- Preserved existing series URLs and fixed duplicate-series address handling.
- Unified address validation between Studio and the build, including the 80-character limit.
- Localized photo-button accessible names and retained mobile/keyboard gallery navigation.
- Patched available tooling dependency vulnerabilities and added scheduled/pre-deployment security gates.
- Updated documentation to reflect the deployed Vercel website and working owner panel.

### v1.2.1 — Mobile Navigation

- Shortened the Ukrainian home action to “Портфоліо” and kept the button label on one line.
- Added a left-to-right swipe on series pages to return to Portfolio in the current language, including when the page is scrolled down.
- Kept vertical scrolling, pinch zoom and the photo viewer's existing swipe controls; page navigation is disabled while the viewer is open.
- Added regression coverage for swipe direction, cancellation, multitouch and modal isolation.

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
