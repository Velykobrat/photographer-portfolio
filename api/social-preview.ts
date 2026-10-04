import { journalArticles } from '../src/data/journalArticles';

const SITE_NAME = 'MK Photography';

const SITE_URL =
  'https://photographer-portfolio-chi.vercel.app';

const CLOUD_NAME = 'dln0hogkt';

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const getSocialImage = (publicId: string) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,g_auto,w_1200,h_630,f_auto,q_auto/${publicId}`;

export async function GET(request: Request) {
  const url = new URL(request.url);

  const slug =
    url.searchParams.get('slug');

  const article = journalArticles.find(
    (item) => item.slug === slug
  );

  if (!article) {
    return new Response(
      'Article not found',
      {
        status: 404,
      }
    );
  }

  const title =
    `${article.title} — ${SITE_NAME}`;

  const description =
    article.excerpt;

  const canonicalUrl =
    `${SITE_URL}/journal/${article.slug}`;

  const image =
    getSocialImage(
      article.cardImagePublicId
    );

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />

  <title>${escapeHtml(title)}</title>

  <meta
    name="description"
    content="${escapeHtml(description)}"
  />

  <link
    rel="canonical"
    href="${canonicalUrl}"
  />

  <meta
    property="og:site_name"
    content="${SITE_NAME}"
  />

  <meta
    property="og:title"
    content="${escapeHtml(title)}"
  />

  <meta
    property="og:description"
    content="${escapeHtml(description)}"
  />

  <meta
    property="og:type"
    content="article"
  />

  <meta
    property="og:url"
    content="${canonicalUrl}"
  />

  <meta
    property="og:image"
    content="${image}"
  />

  <meta
    property="og:image:width"
    content="1200"
  />

  <meta
    property="og:image:height"
    content="630"
  />

  <meta
    property="og:image:alt"
    content="${escapeHtml(article.title)}"
  />

  <meta
    name="twitter:card"
    content="summary_large_image"
  />

  <meta
    name="twitter:title"
    content="${escapeHtml(title)}"
  />

  <meta
    name="twitter:description"
    content="${escapeHtml(description)}"
  />

  <meta
    name="twitter:image"
    content="${image}"
  />
</head>

<body>
  <h1>${escapeHtml(article.title)}</h1>
  <p>${escapeHtml(article.excerpt)}</p>
</body>
</html>`;

  return new Response(html, {
    status: 200,

    headers: {
      'Content-Type':
        'text/html; charset=utf-8',

      'Cache-Control':
        'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}