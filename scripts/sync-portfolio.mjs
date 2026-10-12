import { writeFile, rename } from 'node:fs/promises';
import { fetchPublishedPortfolio } from './sanity-content.mjs';

const source = process.env.PORTFOLIO_SOURCE ?? 'legacy';
if (!['legacy', 'sanity'].includes(source)) throw new Error('PORTFOLIO_SOURCE must be legacy or sanity');
const series = source === 'sanity' ? await fetchPublishedPortfolio() : [];
const output = new URL('../src/data/portfolio.generated.json', import.meta.url);
const temporary = new URL('../src/data/portfolio.generated.json.tmp', import.meta.url);
await writeFile(temporary, `${JSON.stringify({ source, series }, null, 2)}\n`);
await rename(temporary, output);
console.log(source === 'sanity' ? `Loaded ${series.length} published series from Sanity.` : 'Portfolio uses the existing Cloudinary catalogue (legacy mode).');
