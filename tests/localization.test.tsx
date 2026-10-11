// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppContent } from '../src/App';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it('keeps Ukrainian routes during navigation and offers the same English page', async () => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  render(<MemoryRouter initialEntries={['/uk/contacts']}><AppContent /></MemoryRouter>);
  expect(screen.getByRole('link', { name: 'Switch to English' }).getAttribute('href')).toBe('/contacts');
  const user = userEvent.setup();
  await user.click(screen.getByRole('link', { name: 'Портфоліо' }));
  expect(screen.getByRole('heading', { name: 'Портфоліо' })).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Switch to English' }).getAttribute('href')).toBe('/collections');
  expect(document.documentElement.lang).toBe('uk');
  expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toContain('/uk/collections');
});

it('sends stable API values from Ukrainian labels and translates backend errors', async () => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  const fetch = vi.fn().mockResolvedValue(Response.json({ error: 'Too many requests. Please try again later or contact me directly.' }, { status: 429 }));
  vi.stubGlobal('fetch', fetch);
  render(<MemoryRouter initialEntries={['/uk/contacts']}><AppContent /></MemoryRouter>);
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Ваше ім’я', { exact: false }), 'Анна');
  await user.type(screen.getByLabelText('Як з вами зв’язатися?', { exact: false }), '@anna');
  await user.click(screen.getByRole('button', { name: 'Портретна' }));
  await user.click(screen.getByRole('checkbox'));
  await user.click(screen.getByRole('button', { name: 'Надіслати заявку' }));
  await screen.findByText('Забагато заявок. Спробуйте пізніше або зв’яжіться зі мною напряму.');
  expect(JSON.parse(fetch.mock.calls[0][1].body).shootType).toBe('Portrait');
  expect((screen.getByLabelText('Ваше ім’я', { exact: false }) as HTMLInputElement).value).toBe('Анна');
});

it('uses article metadata and changes back to website metadata on navigation', async () => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  render(<MemoryRouter initialEntries={['/journal/beyond-the-frame']}><AppContent /></MemoryRouter>);
  expect(screen.getByText('My creative spark.')).toBeTruthy();
  expect(document.head.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe('article');
  await userEvent.setup().click(screen.getByRole('link', { name: 'Contact', exact: true }));
  await waitFor(() => expect(document.head.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe('website'));
  expect(document.documentElement.lang).toBe('en');
  expect(JSON.parse(document.getElementById('page-schema')!.textContent!)['@type']).toBe('WebSite');
});
