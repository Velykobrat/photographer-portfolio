import { describe, expect, it, vi } from 'vitest';
import { fetchPublishedPortfolio, normalizePortfolio } from '../scripts/sanity-content.mjs';

const image = { asset: { _ref: 'image-abcdef123456-1200x1800-jpg' } };
function document(slug = 'new-series') {
  return { _id: `series-${slug}`, title: { uk: 'Нова серія', en: 'New series' },
    slug: { current: slug }, publishedSlug: slug, category: 'portrait', order: 10, featured: false,
    cover: image, description: { uk: 'Опис', en: 'Description' },
    photos: [
      { ...image, _key: 'second', altUk: 'Друге фото', altEn: 'Second photo' },
      { ...image, _key: 'first', altUk: 'Перше фото', altEn: 'First photo' },
    ] };
}

describe('published Sanity portfolio', () => {
  it('preserves editorial photo order, both languages and asset references', () => {
    const [series] = normalizePortfolio([document()]);
    expect(series.titleUk).toBe('Нова серія');
    expect(series.photos.map(photo => photo._key)).toEqual(['second', 'first']);
    expect(series.photos[0].altEn).toBe('Second photo');
    expect(series.cover.asset._ref).toBe(image.asset._ref);
  });
  it('accepts an empty published portfolio without resurrecting withdrawn series', () => {
    expect(normalizePortfolio([])).toEqual([]);
  });
  it('sorts series by order and uses stable addresses for ties', () => {
    const last = { ...document('last'), order: 30 };
    expect(normalizePortfolio([last, document('b'), document('a')]).map(item => item.slug)).toEqual(['a', 'b', 'last']);
  });
  it.each(['drafts.series-new-series', 'versions.release.series-new-series'])('rejects unpublished documents (%s)', id => {
    expect(() => normalizePortfolio([{ ...document(), _id: id }])).toThrow('Unpublished');
  });
  it('rejects duplicate and changed published addresses', () => {
    expect(() => normalizePortfolio([document(), document()])).toThrow('duplicate');
    expect(() => normalizePortfolio([{ ...document(), slug: { current: 'changed' } }])).toThrow('unchanged');
  });
  it.each(['../contacts', 'uk/name', 'hello world', 'UPPERCASE'])('rejects invalid routes (%s)', slug => {
    expect(() => normalizePortfolio([document(slug)])).toThrow('address');
  });
  it('rejects broken assets, duplicate photo keys and missing localized descriptions', () => {
    const doc = document();
    expect(() => normalizePortfolio([{ ...doc, cover: {} }])).toThrow('asset');
    expect(() => normalizePortfolio([{ ...doc, photos: [doc.photos[0], doc.photos[0]] }])).toThrow('key');
    expect(() => normalizePortfolio([{ ...doc, photos: [{ ...doc.photos[0], altEn: '' }] }])).toThrow('description');
  });
  it('uses the uncached API with the published perspective', async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ result: [document()] }));
    const result = await fetchPublishedPortfolio(fetcher);
    const url = fetcher.mock.calls[0][0] as URL;
    expect(url.hostname).toBe('d3nr3igp.api.sanity.io');
    expect(url.searchParams.get('perspective')).toBe('published');
    expect(result[0].slug).toBe('new-series');
  });
  it('fails the build on upstream errors instead of replacing content with an empty fallback', async () => {
    await expect(fetchPublishedPortfolio(vi.fn().mockResolvedValue(new Response(null, { status: 503 })))).rejects.toThrow('Build stopped');
  });
});
