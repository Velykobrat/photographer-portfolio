# MK Photography

A production photography portfolio website built for **MK Photography**.

The website presents selected photography work, introduces the photographer, provides direct contact channels and allows potential clients to submit structured photoshoot requests.

**Live website:**  
https://photographer-portfolio-chi.vercel.app

## Overview

MK Photography is a real-world photography portfolio focused on portrait, fashion and personal photography.

The project started as a portfolio website and has evolved into a production product with cloud-hosted photography, responsive layouts, client inquiry handling and automated notifications.

The current stable release is **v1.1.2**.

Development of **v1.1** is focused on improving the portfolio experience, accessibility, multilingual content, SEO and content management.

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
- SPA routing on Vercel
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
npm install
```

Start the development server:

```bash
npm run dev
npm.cmd run dev
```

Run ESLint:

```bash
npm run lint
```

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
