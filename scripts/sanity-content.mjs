export const PROJECT_ID = 'd3nr3igp';
export const DATASET = 'production';
export const API_VERSION = '2026-10-12';

export const portfolioQuery = `*[_type == "portfolioSeries"] | order(order asc, slug.current asc) {
  _id, title, slug, publishedSlug, category, description, order, featured,
  cover { asset, crop, hotspot },
  photos[] { _key, asset, crop, hotspot, altUk, altEn }
}`;

export async function fetchPublishedPortfolio(fetcher = fetch) {
  const url = new URL(`https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`);
  url.searchParams.set('query', portfolioQuery);
  url.searchParams.set('perspective', 'published');
  const response = await fetcher(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Sanity content request failed (${response.status}). Build stopped; existing deployment is unaffected.`);
  const data = await response.json();
  return normalizePortfolio(data.result);
}

const categories = new Set(['portrait', 'fashion', 'personal', 'commercial']);
function text(value, name, maximum, required = true) {
  if (value === undefined && !required) return undefined;
  if (typeof value !== 'string' || (required && !value.trim()) || value.length > maximum) throw new Error(`Invalid ${name}`);
  return value;
}
function image(value) {
  if (!/^image-[a-zA-Z0-9]+-\d+x\d+-[a-zA-Z0-9]+$/.test(value?.asset?._ref ?? '')) throw new Error('Image asset is missing or invalid');
  const result = { asset: { _type: 'reference', _ref: value.asset._ref } };
  for (const [name, keys] of [['crop', ['top', 'bottom', 'left', 'right']], ['hotspot', ['x', 'y', 'width', 'height']]]) {
    if (value[name] != null) {
      if (keys.some(key => typeof value[name][key] !== 'number' || !Number.isFinite(value[name][key]) || value[name][key] < 0 || value[name][key] > 1)) throw new Error(`Invalid image ${name}`);
      result[name] = Object.fromEntries(keys.map(key => [key, value[name][key]]));
    }
  }
  if (result.crop && (result.crop.top + result.crop.bottom >= 1 || result.crop.left + result.crop.right >= 1)) throw new Error('Image is fully cropped');
  return result;
}

export function normalizePortfolio(documents) {
  if (!Array.isArray(documents)) throw new Error('Sanity returned an invalid portfolio');
  const slugs = new Set();
  return documents.map(doc => {
    if (!doc || typeof doc !== 'object') throw new Error('Invalid series document');
    if (typeof doc._id !== 'string' || doc._id.startsWith('drafts.') || doc._id.startsWith('versions.')) throw new Error('Unpublished content cannot enter the site');
    const slug = doc.slug?.current;
    if (typeof slug !== 'string' || slug.length > 80 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slugs.has(slug)) throw new Error('Invalid or duplicate series address');
    slugs.add(slug);
    if (doc.publishedSlug && doc.publishedSlug !== slug) throw new Error('Published series addresses must remain unchanged');
    if (!categories.has(doc.category)) throw new Error(`Invalid category in ${slug}`);
    if (!Number.isInteger(doc.order) || doc.order < 0 || doc.order > 100000) throw new Error(`Invalid order in ${slug}`);
    if (typeof doc.featured !== 'boolean') throw new Error(`Invalid featured value in ${slug}`);
    if (!Array.isArray(doc.photos) || doc.photos.length < 1 || doc.photos.length > 300) throw new Error(`Invalid photographs in ${slug}`);
    const keys = new Set();
    const photos = doc.photos.map(photo => {
      if (typeof photo?._key !== 'string' || !photo._key || keys.has(photo._key)) throw new Error(`Invalid photo key in ${slug}`);
      keys.add(photo._key);
      return { ...image(photo), _key: photo._key,
        altUk: text(photo.altUk, 'Ukrainian photo description', 300), altEn: text(photo.altEn, 'English photo description', 300) };
    });
    return {
      slug, title: text(doc.title?.en, 'English title', 120), titleUk: text(doc.title?.uk, 'Ukrainian title', 120),
      descriptionEn: text(doc.description?.en, 'English series description', 1000, false),
      descriptionUk: text(doc.description?.uk, 'Ukrainian series description', 1000, false),
      category: doc.category, order: doc.order, featured: doc.featured,
      cover: image(doc.cover), photos,
      // Retained only for compatibility with the legacy series type.
      coverPublicId: '', cloudinaryTag: '',
    };
  }).sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}
