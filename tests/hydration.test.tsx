// @vitest-environment jsdom
import { expect, it, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { act } from 'react';
import { StaticRouter } from 'react-router-dom';
import App, { AppContent } from '../src/App';

it('hydrates prerendered content without replacing the Ukrainian form', async () => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  window.history.replaceState(null, '', '/uk/contacts');
  const container = document.createElement('div');
  container.innerHTML = renderToString(<StaticRouter location="/uk/contacts"><AppContent /></StaticRouter>);
  document.body.appendChild(container);
  const originalInput = container.querySelector('#name');
  const errors: unknown[] = [];
  let root!: ReturnType<typeof hydrateRoot>;
  await act(async () => {
    root = hydrateRoot(container, <App />, { onRecoverableError: error => errors.push(error) });
  });
  expect(errors).toEqual([]);
  expect(container.querySelector('#name')).toBe(originalInput);
  expect(document.documentElement.lang).toBe('uk');
  await act(async () => root.unmount());
  container.remove();
  window.history.replaceState(null, '', '/');
});
