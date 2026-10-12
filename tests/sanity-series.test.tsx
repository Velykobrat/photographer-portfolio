// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('../src/data/portfolioSeries', () => ({ portfolioSeries: [{
  slug: 'cms-series', title: 'CMS series', titleUk: 'Серія з CMS', category: 'portrait',
  order: 1, featured: true, coverPublicId: '', cloudinaryTag: '', descriptionUk: 'Опис серії',
  cover: { asset: { _ref: 'image-abcdef123456-1200x1800-jpg' } },
  photos: [
    { _key: 'first', asset: { _ref: 'image-abcdef123456-1200x1800-jpg' }, altUk: 'Портрет біля вікна', altEn: 'Portrait by a window' },
    { _key: 'second', asset: { _ref: 'image-abcdef234567-1200x1800-jpg' }, altUk: 'Портрет на вулиці', altEn: 'Portrait outdoors' },
  ],
}] }));
import Series from '../src/pages/Series/Series';
import Collections from '../src/pages/Collections/Collections';
import { pageMetadata } from '../src/data/pageMetadata';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it('renders Ukrainian CMS photos immediately, retains modal navigation and never fetches Cloudinary tags', () => {
  const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
  render(<MemoryRouter initialEntries={['/uk/collections/cms-series']}><Routes>
    <Route path='/uk/collections/:slug' element={<Series />} />
    <Route path='/uk/collections' element={<Collections />} />
  </Routes></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Серія з CMS' })).toBeTruthy();
  expect(screen.getByText('Опис серії')).toBeTruthy();
  const image = screen.getByAltText('Портрет біля вікна');
  expect(image.getAttribute('src')).toContain('cdn.sanity.io');
  expect(screen.getByRole('button', { name: 'Відкрити Портрет біля вікна' })).toBeTruthy();
  fireEvent.click(image.closest('button')!);
  fireEvent.click(screen.getByRole('button', { name: 'Наступна фотографія' }));
  expect(screen.getByRole('dialog').querySelector('img')!.alt).toBe('Портрет на вулиці');
  expect(fetcher).not.toHaveBeenCalled();
});

it('includes new series in localized metadata and portfolio links', () => {
  render(<MemoryRouter initialEntries={['/uk/collections']}><Collections /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Серія з CMS' })).toBeTruthy();
  expect(screen.getByRole('link').getAttribute('href')).toBe('/uk/collections/cms-series');
  expect(pageMetadata['/uk/collections/cms-series'].title).toBe('Серія з CMS');
  expect(pageMetadata['/uk/collections/cms-series'].image).toContain('cdn.sanity.io');
});
