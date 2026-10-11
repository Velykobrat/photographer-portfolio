import { alternatePaths, pageMetadata, type PageMetadata } from './data/pageMetadata';
import { SITE_NAME, SITE_URL } from './data/site';

export const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const renderHead = (path: string, page: PageMetadata) => {
  const title = `${page.title} — ${SITE_NAME}`;
  const canonical = `${SITE_URL}${path}`;
  const alternates = page.noIndex ? null : alternatePaths(path);
  const meta = (attribute: string, name: string, content: string) => `<meta ${attribute}="${name}" content="${escapeHtml(content)}" />`;
  return [
    `<title>${escapeHtml(title)}</title>`,
    meta('name', 'description', page.description), meta('name', 'robots', page.noIndex ? 'noindex, follow' : 'index, follow'),
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    ...Object.entries({ title, description: page.description, type: page.type, url: canonical, image: page.image, site_name: SITE_NAME,
      locale: page.language === 'uk' ? 'uk_UA' : 'en_US', 'locale:alternate': page.language === 'uk' ? 'en_US' : 'uk_UA',
      'image:width': '1200', 'image:height': '630', 'image:alt': title }).map(([key, value]) => meta('property', `og:${key}`, value)),
    ...Object.entries({ card: 'summary_large_image', title, description: page.description, image: page.image, 'image:alt': title }).map(([key, value]) => meta('name', `twitter:${key}`, value)),
    ...(alternates ? Object.entries({ ...alternates, 'x-default': alternates.en }).map(([language, alternate]) => `<link rel="alternate" hreflang="${language}" href="${SITE_URL}${alternate}" />`) : []),
    `<script id="page-schema" type="application/ld+json">${JSON.stringify(page.schema).replace(/</g, '\\u003c')}</script>`,
  ].join('\n');
};

export const renderSitemap = () => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${Object.keys(pageMetadata).map(path => {
  const alternates = alternatePaths(path)!;
  return `<url><loc>${SITE_URL}${path}</loc>${Object.entries({ ...alternates, 'x-default': alternates.en }).map(([language, alternate]) => `<xhtml:link rel="alternate" hreflang="${language}" href="${SITE_URL}${alternate}" />`).join('')}</url>`;
}).join('\n')}\n</urlset>`;
