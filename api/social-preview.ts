const SITE_NAME = 'MK Photography';

const SITE_URL =
  'https://photographer-portfolio-chi.vercel.app';

const CLOUD_NAME = 'dln0hogkt';

type SocialArticle = {
  title: string;
  description: string;
  imagePublicId: string;
};

const articles: Record<string, SocialArticle> = {
  '12-questions-with-margaret': {
    title: '12 Questions with Margaret',

    description:
      'Дванадцять простих запитань про фотографію, людей, натхнення та те, куди Маргарет хоче рухатися далі.',

    imagePublicId:
      '2019_-_Margaret_-_Giuseppe_Casalinuovo_18_bnfeeu',
  },

  'beyond-the-frame': {
    title: 'Beyond the Frame',

    description:
      'Маргарет розповідає про шлях від моделінгу до фотографії, довіру між фотографом і людиною перед камерою, внутрішню дисципліну та те, чому найбільше боїться втратити творчий запал.',

    imagePublicId:
      'DSC06757_ct6pyb',
  },
};

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const getSocialImage = (publicId: string) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,g_auto,w_1200,h_630,f_auto,q_auto/${publicId}`;

export default {
  fetch(request: Request) {
    const url = new URL(request.url);

    const slug =
      url.searchParams.get('slug');

    if (!slug) {
      return new Response(
        'Article slug is required',
        {
          status: 400,
        }
      );
    }

    const article = articles[slug];

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

    const canonicalUrl =
      `${SITE_URL}/journal/${slug}`;

    const image =
      getSocialImage(
        article.imagePublicId
      );

    const html = `<!doctype html>
<html lang="uk">
<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>${escapeHtml(title)}</title>

  <meta
    name="description"
    content="${escapeHtml(article.description)}"
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
    content="${escapeHtml(article.description)}"
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
    content="${escapeHtml(article.description)}"
  />

  <meta
    name="twitter:image"
    content="${image}"
  />
</head>

<body>
  <h1>${escapeHtml(article.title)}</h1>

  <p>
    ${escapeHtml(article.description)}
  </p>
</body>
</html>`;

    return new Response(
      html,
      {
        status: 200,

        headers: {
          'Content-Type':
            'text/html; charset=utf-8',

          'Cache-Control':
            'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  },
};