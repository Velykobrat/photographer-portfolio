import { portfolioSeries } from './portfolioSeries';
import { getJournalArticles } from './journalArticles';
import { SITE_NAME, SITE_URL, SOCIAL_IMAGE, websiteSchema } from './site';
import { portfolioImageUrl, seriesCover, seriesTitle } from '../utils/portfolioImages';

export type PageMetadata = {
  title: string;
  description: string;
  image: string;
  language: 'en' | 'uk';
  type: 'website' | 'article';
  schema: object;
  noIndex?: boolean;
};

const socialImage = (publicId: string) =>
  `https://res.cloudinary.com/dln0hogkt/image/upload/c_fill,g_auto,w_1200,h_630,f_jpg,q_auto/${publicId}`;

export const pageMetadata: Record<string, PageMetadata> = {
  '/home': {
    title: 'Portrait & Fashion Photographer in Kyiv',
    description: 'Portrait, fashion and personal photography in Kyiv by MK Photography. Explore selected work and book your photo shoot.',
    image: SOCIAL_IMAGE, language: 'en', type: 'website', schema: websiteSchema,
  },
  '/collections': {
    title: 'Portfolio',
    description: 'Selected portrait, fashion, personal and commercial photography by MK Photography.',
    image: SOCIAL_IMAGE, language: 'en', type: 'website', schema: websiteSchema,
  },
  '/journal': {
    title: 'Journal',
    description: 'Stories, conversations and notes about photography, people and the moments behind the frame.',
    image: SOCIAL_IMAGE, language: 'en', type: 'website', schema: websiteSchema,
  },
  '/contacts': {
    title: 'Contact',
    description: 'Book a portrait, fashion or personal photography session with MK Photography in Kyiv and Ladyzhyn, Ukraine.',
    image: SOCIAL_IMAGE, language: 'en', type: 'website', schema: websiteSchema,
  },
};

for (const series of portfolioSeries) {
  const path = `/collections/${series.slug}`;
  pageMetadata[path] = {
    title: series.title,
    description: series.descriptionEn || `${series.title} — a ${series.category} photography series by MK Photography.`,
    image: portfolioImageUrl(seriesCover(series), 1200, true), language: 'en', type: 'website',
    schema: { '@context': 'https://schema.org', '@type': 'ImageGallery', name: series.title, url: `${SITE_URL}${path}` },
  };
}

for (const article of getJournalArticles('en')) {
  const path = `/journal/${article.slug}`;
  pageMetadata[path] = {
    title: article.title, description: article.excerpt,
    image: socialImage(article.cardImagePublicId), language: 'en', type: 'article',
    schema: { '@context': 'https://schema.org', '@type': 'Article', headline: article.title,
      description: article.excerpt, image: socialImage(article.cardImagePublicId),
      inLanguage: 'en', mainEntityOfPage: `${SITE_URL}${path}`,
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL } },
  };
}

export const notFoundMetadata: PageMetadata = {
  title: 'Page not found', description: 'The requested page could not be found.',
  image: SOCIAL_IMAGE, language: 'en', type: 'website', schema: websiteSchema, noIndex: true,
};

const ukrainianPages: Record<string, [string, string]> = {
  '/home': ['Фотограф портретів та моди у Києві', 'Портретна фотографія, мода та особисті зйомки у Києві від MK Photography. Перегляньте портфоліо та замовте зйомку.'],
  '/collections': ['Портфоліо', 'Вибрані портретні, особисті та комерційні зйомки, фотографія моди MK Photography.'],
  '/journal': ['Журнал', 'Історії, розмови та нотатки про фотографію, людей і моменти за кадром.'],
  '/contacts': ['Контакти', 'Замовте портретну зйомку, зйомку моди або особисту зйомку MK Photography у Києві та Ладижині, Україна.'],
};
for (const [path, metadata] of Object.entries(pageMetadata)) {
  const translatedArticle = getJournalArticles('uk').find(article => path === `/journal/${article.slug}`);
  const series = portfolioSeries.find(item => path === `/collections/${item.slug}`);
  const title = ukrainianPages[path]?.[0] ?? translatedArticle?.title ?? (series ? seriesTitle(series, 'uk') : metadata.title);
  const description = ukrainianPages[path]?.[1] ?? translatedArticle?.excerpt ?? (series?.descriptionUk || `${series ? seriesTitle(series, 'uk') : metadata.title} — серія фотографій MK Photography.`);
  const url = `${SITE_URL}/uk${path}`;
  pageMetadata[`/uk${path}`] = { ...metadata, title, description, language: 'uk',
    schema: translatedArticle ? { ...metadata.schema, headline: title, description, inLanguage: 'uk', mainEntityOfPage: url }
      : { ...metadata.schema, url, ...(series ? { name: title } : {}) } };
}

export const alternatePaths = (path: string) => {
  const base = path.startsWith('/uk/') ? path.slice(3) : path;
  return pageMetadata[base] ? { en: base, uk: `/uk${base}` } : null;
};
