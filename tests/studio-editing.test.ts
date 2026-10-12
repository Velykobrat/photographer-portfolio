import { describe, expect, it, vi } from 'vitest';
import { duplicateSeries } from '../studio/actions/duplicateSeries';
import { validateSeriesSlug } from '../studio/utils/seriesSlug';
import { normalizePortfolio } from '../scripts/sanity-content.mjs';

describe('duplicating a portfolio series', () => {
  it('preserves content and action behavior while removing the copied address and lock', () => {
    const action = { label: 'Duplicate', onHandle: vi.fn(), disabled: false };
    const original = Object.assign(vi.fn<(props: unknown) => typeof action>(() => action), { action: 'duplicate' as const });
    const wrapped = duplicateSeries(original);
    const props = { id: 'series-original', type: 'portfolioSeries', draft: null, published: null, liveEdit: false, initialValueResolved: true, onComplete: vi.fn() };
    expect(wrapped(props)).toBe(action);
    expect(wrapped.action).toBe('duplicate');
    const source = Object.freeze({ _id: 'drafts.copy', _type: 'portfolioSeries',
      slug: { current: 'original' }, publishedSlug: 'original', title: { uk: 'Назва', en: 'Title' },
      cover: { asset: { _ref: 'image-abcdef-1000x1000-jpg' } },
      photos: [{ _key: 'photo', altUk: 'Фото', altEn: 'Photo' }], order: 20, featured: true });
    const mappedProps = original.mock.calls[0][0] as typeof props & { mapDocument: (doc: typeof source) => Record<string, unknown> };
    const copy = mappedProps.mapDocument(source);
    expect(copy).not.toHaveProperty('slug');
    expect(copy).not.toHaveProperty('publishedSlug');
    expect(copy).toMatchObject({ _id: 'drafts.copy', title: source.title, cover: source.cover, photos: source.photos, order: 20, featured: true });
    expect(source.publishedSlug).toBe('original');
  });
});

describe('manual series addresses', () => {
  it.each([1, 79, 80])('accepts a valid address of %i characters', length => {
    expect(validateSeriesSlug({ current: 'a'.repeat(length) })).toBe(true);
  });
  it.each([81, 120])('rejects an address of %i characters before publication', length => {
    const slug = 'a'.repeat(length);
    expect(validateSeriesSlug({ current: slug })).toContain('80');
    expect(() => normalizePortfolio([{ _id: 'series-test', slug: { current: slug } }])).toThrow('address');
  });
  it.each(['hello world', 'UPPERCASE', '../contacts', '-leading', 'trailing-', 'double--dash'])('rejects invalid address %s', current => {
    expect(validateSeriesSlug({ current })).not.toBe(true);
  });
});
