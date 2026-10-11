import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { resolve, dirname, basename, extname } from 'node:path';
import { build } from 'vite';
import { pathToFileURL } from 'node:url';

// Use the same React components and route data as the browser, without network requests.
await build({ build: { ssr: 'src/entry-server.tsx', outDir: 'node_modules/.cache/portfolio-ssr', emptyOutDir: true },
  ssr: { external: ['react', 'react-dom', 'react-router', 'react-router-dom', '@daypicker/react'] } });
{
  const { render, renderHead, renderSitemap, pageMetadata, notFoundMetadata, SITE_URL } = await import(pathToFileURL(resolve('node_modules/.cache/portfolio-ssr/entry-server.js')).href);
  const template = await readFile('dist/index.html', 'utf8');
  const assets = await readdir('dist/assets');
  const cleanTemplate = template
    .replace(/<title>[\s\S]*?<\/title>/g, '')
    .replace(/<meta\s+(?:name="(?:description|robots|twitter:[^"]+)"|property="og:[^"]+")[\s\S]*?\/>/g, '')
    .replace(/<link\s+rel="canonical"[\s\S]*?\/>/g, '');
  for (const [path, page] of [...Object.entries(pageMetadata), ['/404', notFoundMetadata]]) {
    const content = render(path).replace(/\/src\/img\/([^"\s]+)/g, (_, name) => {
      const stem = basename(name, extname(name));
      const match = assets.find(asset => asset.startsWith(`${stem}-`) && extname(asset) === extname(name));
      if (!match) throw new Error(`Missing production image asset: ${name}`);
      return `/assets/${match}`;
    });
    const html = cleanTemplate.replace('lang="en"', `lang="${page.language}"`)
      .replace('</head>', `${renderHead(path, page)}\n</head>`)
      .replace('<div id="root"></div>', `<div id="root">${content}</div>`);
    const output = resolve('dist', `${path.slice(1)}.html`);
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, html);
  }
  // Keep the root fallback consistent with its redirect destination.
  await writeFile('dist/index.html', await readFile('dist/home.html', 'utf8'));
  await writeFile('dist/sitemap.xml', renderSitemap());
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  console.log(`Prerendered ${Object.keys(pageMetadata).length} pages, 404, sitemap.xml and robots.txt.`);
}
