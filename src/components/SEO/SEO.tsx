import { useEffect } from 'react';

type SEOProps = {
  title: string;
  description: string;
  canonicalPath?: string;
  image?: string;
};

const SITE_NAME = 'MK Photography';
const SITE_URL =
  'https://photographer-portfolio-chi.vercel.app';

const DEFAULT_IMAGE =
  'https://res.cloudinary.com/dln0hogkt/image/upload/f_auto,q_auto,w_1600/14_tbvntx';

const setMetaTag = (
  selector: string,
  attribute: 'name' | 'property',
  key: string,
  content: string
) => {
  let element = document.head.querySelector(
    selector
  ) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

const SEO = ({
  title,
  description,
  canonicalPath = '/',
  image = DEFAULT_IMAGE,
}: SEOProps) => {
  useEffect(() => {
    const fullTitle =
      title === SITE_NAME
        ? SITE_NAME
        : `${title} — ${SITE_NAME}`;

    const canonicalUrl =
      `${SITE_URL}${canonicalPath}`;

    document.title = fullTitle;

    setMetaTag(
      'meta[name="description"]',
      'name',
      'description',
      description
    );

    setMetaTag(
      'meta[property="og:title"]',
      'property',
      'og:title',
      fullTitle
    );

    setMetaTag(
      'meta[property="og:description"]',
      'property',
      'og:description',
      description
    );

    setMetaTag(
      'meta[property="og:type"]',
      'property',
      'og:type',
      'website'
    );

    setMetaTag(
      'meta[property="og:url"]',
      'property',
      'og:url',
      canonicalUrl
    );

    setMetaTag(
      'meta[property="og:image"]',
      'property',
      'og:image',
      image
    );

    setMetaTag(
      'meta[name="twitter:card"]',
      'name',
      'twitter:card',
      'summary_large_image'
    );

    setMetaTag(
      'meta[name="twitter:title"]',
      'name',
      'twitter:title',
      fullTitle
    );

    setMetaTag(
      'meta[name="twitter:description"]',
      'name',
      'twitter:description',
      description
    );

    setMetaTag(
      'meta[name="twitter:image"]',
      'name',
      'twitter:image',
      image
    );

    let canonical =
      document.head.querySelector(
        'link[rel="canonical"]'
      ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical =
        document.createElement('link');

      canonical.rel = 'canonical';

      document.head.appendChild(canonical);
    }

    canonical.href = canonicalUrl;
  }, [
    title,
    description,
    canonicalPath,
    image,
  ]);

  return null;
};

export default SEO;