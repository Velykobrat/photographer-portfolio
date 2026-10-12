import { createImageUrlBuilder } from '@sanity/image-url';
import type { PortfolioImage, PortfolioSeries, SanityPhoto } from '../data/portfolioSeries';
import type { Language } from '../localization';
import { getCloudinaryImage } from './cloudinary';

const builder = createImageUrlBuilder({ projectId: 'd3nr3igp', dataset: 'production' });

export function portfolioImageUrl(image: PortfolioImage, width: number, social = false) {
  if (typeof image === 'string') {
    return social
      ? `https://res.cloudinary.com/dln0hogkt/image/upload/c_fill,g_auto,w_1200,h_630,f_jpg,q_auto/${image}`
      : getCloudinaryImage(image, width);
  }
  let url = builder.image(image).width(width).auto('format').quality(85).fit('max');
  if (social) url = url.height(630).fit('crop');
  return url.url();
}

export const portfolioSrcSet = (image: PortfolioImage, widths: number[]) =>
  widths.map(width => `${portfolioImageUrl(image, width)} ${width}w`).join(', ');
export const seriesCover = (series: PortfolioSeries): PortfolioImage => series.cover ?? series.coverPublicId;
export const seriesTitle = (series: PortfolioSeries, language: Language) => language === 'uk' ? series.titleUk ?? series.title : series.title;
export const photoAlt = (photo: SanityPhoto, language: Language) => language === 'uk' ? photo.altUk : photo.altEn;
