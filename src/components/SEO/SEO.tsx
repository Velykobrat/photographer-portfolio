import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageMetadata, alternatePaths } from '../../data/pageMetadata';
import { SITE_NAME, SITE_URL, SOCIAL_IMAGE, websiteSchema } from '../../data/site';
import { useLanguage, localizedPath } from '../../localization';

type SEOProps = { title: string; description: string; canonicalPath?: string; image?: string; noIndex?: boolean };
const setMeta = (attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, key); document.head.appendChild(element); }
  element.content = content;
};
const SEO = ({ title, description, canonicalPath = '/home', image = SOCIAL_IMAGE, noIndex = false }: SEOProps) => {
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const path = noIndex ? pathname : localizedPath(canonicalPath, language);
  const metadata = noIndex ? undefined : pageMetadata[path];
  const fullTitle = `${metadata?.title ?? title} — ${SITE_NAME}`;
  const summary = metadata?.description ?? description;
  const socialImage = metadata?.image ?? image;
  const type = metadata?.type ?? 'website';
  const schema = metadata?.schema ?? websiteSchema;
  useEffect(() => {
    document.title = fullTitle;
    document.documentElement.lang = language;
    setMeta('name', 'robots', noIndex ? 'noindex, follow' : 'index, follow');
    setMeta('name', 'description', summary);
    for (const [key, content] of Object.entries({ title: fullTitle, description: summary, type, url: `${SITE_URL}${path}`, image: socialImage, site_name: SITE_NAME, locale: language === 'uk' ? 'uk_UA' : 'en_US', 'locale:alternate': language === 'uk' ? 'en_US' : 'uk_UA', 'image:width': '1200', 'image:height': '630', 'image:alt': fullTitle })) setMeta('property', `og:${key}`, content);
    for (const [key, content] of Object.entries({ card: 'summary_large_image', title: fullTitle, description: summary, image: socialImage, 'image:alt': fullTitle })) setMeta('name', `twitter:${key}`, content);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = `${SITE_URL}${path}`;
    document.head.querySelectorAll('link[hreflang]').forEach(element => element.remove());
    const alternates = noIndex ? null : alternatePaths(path);
    if (alternates) for (const [lang, alternate] of Object.entries({ ...alternates, 'x-default': alternates.en })) {
      const link = document.createElement('link'); link.rel = 'alternate'; link.hreflang = lang; link.href = `${SITE_URL}${alternate}`; document.head.appendChild(link);
    }
    let script = document.head.querySelector<HTMLScriptElement>('script#page-schema');
    if (!script) { script = document.createElement('script'); script.id = 'page-schema'; script.type = 'application/ld+json'; document.head.appendChild(script); }
    script.textContent = JSON.stringify(schema);
  }, [fullTitle, summary, socialImage, type, schema, path, language, noIndex]);
  return null;
};
export default SEO;
