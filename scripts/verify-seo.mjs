import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const { pageMetadata, SITE_URL } = await import(pathToFileURL(resolve('node_modules/.cache/portfolio-ssr/entry-server.js')).href);
const css = (await Promise.all((await readdir('dist/assets')).filter(file => file.endsWith('.css')).map(file => readFile(`dist/assets/${file}`, 'utf8')))).join('');
for (const [path, metadata] of Object.entries(pageMetadata)) {
  const html = await readFile(`dist${path}.html`, 'utf8');
  assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1, path);
  assert.equal((html.match(/<title>/g) ?? []).length, 1, path);
  assert.ok(html.includes(`href="${SITE_URL}${path}"`), path);
  assert.ok(html.includes(`lang="${metadata.language}"`), path);
  assert.ok(html.includes('<h1'), `No prerendered heading: ${path}`);
  assert.ok(!html.includes('/src/img/'), `Development image URL: ${path}`);
  for (const [, classList] of html.matchAll(/class="([^"]+)"/g)) {
    for (const name of classList.split(' ').filter(name => name.startsWith('_'))) assert.ok(css.includes(`.${name}`), `SSR/CSS mismatch: ${name}`);
  }
  for (const [, asset] of html.matchAll(/(?:src|href)="(\/assets\/[^"?]+)"/g)) await readFile(`dist${asset}`);
}
assert.ok((await readFile('dist/404.html', 'utf8')).includes('noindex, follow'));
assert.ok((await readFile('dist/robots.txt', 'utf8')).includes(`${SITE_URL}/sitemap.xml`));
console.log(`Verified initial HTML, headings, metadata and assets for ${Object.keys(pageMetadata).length} pages.`);
