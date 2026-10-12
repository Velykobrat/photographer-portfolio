import { build } from 'vite';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { API_VERSION, DATASET, PROJECT_ID, normalizePortfolio } from './sanity-content.mjs';

const apply = process.argv.includes('--apply');
const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_TOKEN;
if (apply && !token) throw new Error('Migration requires Sanity authentication. Use the authenticated CLI with studio/scripts/migrate.cjs.');
const api = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}`;
const auth = token ? { Authorization: `Bearer ${token}` } : {};

await build({ configFile: false, logLevel: 'error', build: {
  ssr: 'src/data/portfolioSeries.ts', outDir: 'node_modules/.cache/portfolio-migration', emptyOutDir: true,
} });
const { legacyPortfolioSeries } = await import(pathToFileURL(resolve('node_modules/.cache/portfolio-migration/portfolioSeries.js')).href);
const plan = [];
for (const series of legacyPortfolioSeries) {
  const response = await fetch(`https://res.cloudinary.com/dln0hogkt/image/list/${series.cloudinaryTag}.json`, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Cannot load ${series.slug} (${response.status})`);
  const data = await response.json();
  if (!Array.isArray(data.resources) || !data.resources.length || data.resources.some(item => typeof item?.public_id !== 'string')) throw new Error(`Invalid photo list: ${series.slug}`);
  const ids = data.resources.map(item => item.public_id).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  plan.push({ series, photos: ids });
}
await mkdir('node_modules/.cache', { recursive: true });
await writeFile('node_modules/.cache/portfolio-migration-plan.json', `${JSON.stringify(plan, null, 2)}\n`);
console.log(`Migration plan: ${plan.length} series, ${plan.reduce((count, entry) => count + entry.photos.length, 0)} photographs. Existing addresses and photo order are preserved.`);
if (!apply) {
  console.log('Dry run only. No Sanity documents or assets were created.');
  process.exit(0);
}

// Check destinations first; createIfNotExists ensures a rerun cannot overwrite editorial changes.
const existingQuery = encodeURIComponent('*[_type == "portfolioSeries" || _id in $ids]{_id, "slug": slug.current}');
const ids = plan.flatMap(entry => [`series-${entry.series.slug}`, `drafts.series-${entry.series.slug}`]);
const existingResponse = await fetch(`${api}/data/query/${DATASET}?query=${existingQuery}&%24ids=${encodeURIComponent(JSON.stringify(ids))}&perspective=raw`, { headers: auth, signal: AbortSignal.timeout(30000) });
if (!existingResponse.ok) throw new Error(`Cannot check existing documents (${existingResponse.status})`);
const { result: existing } = await existingResponse.json();
if (!Array.isArray(existing)) throw new Error('Cannot inspect existing Sanity documents');
const assetCacheFile = 'node_modules/.cache/portfolio-migration-assets.json';
let assetCache = {};
try { assetCache = JSON.parse(await readFile(assetCacheFile, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
async function upload(publicId) {
  if (assetCache[publicId]) return { _type: 'reference', _ref: assetCache[publicId] };
  const response = await fetch(`https://res.cloudinary.com/dln0hogkt/image/upload/f_jpg,q_100/${publicId}`, { signal: AbortSignal.timeout(60000) });
  if (!response.ok) throw new Error(`Cannot download photograph (${response.status})`);
  const body = await response.arrayBuffer();
  const uploaded = await fetch(`${api}/assets/images/${DATASET}?filename=${encodeURIComponent(publicId.replaceAll('/', '-') + '.jpg')}`, {
    method: 'POST', headers: { ...auth, 'Content-Type': 'image/jpeg' }, body, signal: AbortSignal.timeout(120000),
  });
  if (!uploaded.ok) throw new Error(`Cannot upload photograph to Sanity (${uploaded.status})`);
  const data = await uploaded.json();
  const ref = data.document?._id;
  if (typeof ref !== 'string' || !ref.startsWith('image-')) throw new Error('Sanity did not return an image asset');
  assetCache[publicId] = ref;
  await writeFile(assetCacheFile, `${JSON.stringify(assetCache, null, 2)}\n`);
  return { _type: 'reference', _ref: ref };
}
for (const { series, photos } of plan) {
  const id = `series-${series.slug}`;
  if (existing.some(doc => doc._id === id || doc._id === `drafts.${id}`)) {
    console.log(`Skipped existing series: ${series.slug}`);
    continue;
  }
  if (existing.some(doc => doc.slug === series.slug)) throw new Error(`Another document already uses ${series.slug}; no replacement was attempted.`);
  const images = [];
  for (const [index, publicId] of photos.entries()) {
    images.push({ _type: 'portfolioPhoto', _key: createHash('sha256').update(publicId).digest('hex').slice(0, 24),
      asset: await upload(publicId), altUk: `${series.title} — фотографія ${index + 1}`, altEn: `${series.title} — photo ${index + 1}` });
  }
  const doc = { _id: id, _type: 'portfolioSeries',
    title: { uk: series.title, en: series.title }, slug: { _type: 'slug', current: series.slug }, publishedSlug: series.slug,
    category: series.category, featured: series.featured ?? false, order: series.order ?? 10,
    cover: { _type: 'image', asset: await upload(series.coverPublicId) }, photos: images };
  normalizePortfolio([doc]);
  const response = await fetch(`${api}/data/mutate/${DATASET}?visibility=sync`, {
    method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations: [{ createIfNotExists: doc }] }), signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`Cannot create ${series.slug} (${response.status})`);
  console.log(`Migrated ${series.slug}: ${images.length} photographs.`);
}
console.log('Migration completed. Review imported photo descriptions in Studio, then enable PORTFOLIO_SOURCE=sanity.');
