import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import { pageMetadata } from './data/pageMetadata';

import './index.css';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
      <App />
  </StrictMode>
);

if (root.hasChildNodes() && pageMetadata[window.location.pathname]) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
