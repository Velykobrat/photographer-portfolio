import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AppContent } from './App';
export { pageMetadata, notFoundMetadata } from './data/pageMetadata';
export { SITE_URL, SITE_NAME } from './data/site';
export { renderHead, renderSitemap } from './seoMarkup';

export const render = (path: string) => renderToString(
  <StaticRouter location={path}><AppContent /></StaticRouter>,
);
