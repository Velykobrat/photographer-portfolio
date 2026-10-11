import { describe, expect, it } from 'vitest';
import { pageMetadata, alternatePaths } from '../src/data/pageMetadata';
import { getJournalArticles } from '../src/data/journalArticles';
import { renderHead, renderSitemap } from '../src/seoMarkup';
import { basePath, getLanguage, localizedPath } from '../src/localization';
import { SITE_URL } from '../src/data/site';

describe('localized SEO', () => {
  it('provides reciprocal alternates and a self canonical for every real page', () => {
    for (const [path, page] of Object.entries(pageMetadata)) {
      const head = renderHead(path, page);
      expect(head).toContain(`rel="canonical" href="${SITE_URL}${path}"`);
      const alternates = alternatePaths(path)!;
      expect(head).toContain(`hreflang="en" href="${SITE_URL}${alternates.en}"`);
      expect(head).toContain(`hreflang="uk" href="${SITE_URL}${alternates.uk}"`);
      expect(pageMetadata[alternates.en]).toBeDefined();
      expect(pageMetadata[alternates.uk]).toBeDefined();
    }
  });
  it('includes all real pages in the sitemap without redirects or error pages', () => {
    const xml = renderSitemap();
    expect((xml.match(/<loc>/g) ?? []).length).toBe(Object.keys(pageMetadata).length);
    expect(xml).not.toContain('/404');
    expect(xml).not.toContain('/blog');
    expect(xml).toContain('xmlns:xhtml=');
  });
  it('escapes user-facing content and script delimiters in generated HTML', () => {
    const head = renderHead('/home', { ...pageMetadata['/home'], title: '"<hello>', schema: { text: '</script>' } });
    expect(head).toContain('&quot;&lt;hello&gt;');
    expect(head).toContain('\\u003c/script>');
  });
  it('preserves the current page when switching languages', () => {
    expect(localizedPath(basePath('/uk/collections/inlight'), 'en')).toBe('/collections/inlight');
    expect(getLanguage('/ukraine')).toBe('en');
    expect(alternatePaths('/nonexistent')).toBeNull();
  });
  it('contains complete English translations and Ukrainian titles for both articles', () => {
    const english = getJournalArticles('en');
    const ukrainian = getJournalArticles('uk');
    english.forEach((article, index) => {
      expect(article.questions.length).toBe(ukrainian[index].questions.length);
      expect(JSON.stringify([article.subtitle, article.excerpt, article.intro, article.questions, article.closing])).not.toMatch(/[а-яіїєґ]/i);
      expect(ukrainian[index].title).toMatch(/[а-яіїєґ]/i);
    });
  });
});
