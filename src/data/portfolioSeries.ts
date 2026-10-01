export type PortfolioCategory =
  | 'portrait'
  | 'fashion'
  | 'personal'
  | 'commercial';

export type PortfolioSeries = {
  slug: string;
  title: string;
  category: PortfolioCategory;
  cloudinaryTag: string;
  coverPublicId: string;
  featured?: boolean;
  order?: number;
};

export const portfolioSeries: PortfolioSeries[] = [
  {
    slug: 'lat-lingerie',
    title: 'Lat.lingerie',
    category: 'commercial',
    cloudinaryTag: 'series-lat-lingerie',
    coverPublicId: 'lat-lingerie-01_ft3vwv',
    featured: true,
    order: 1,
  },
  {
    slug: 'leliano-bologna',
    title: 'Leliano Bologna',
    category: 'personal',
    cloudinaryTag: 'series-leliano-bologna',
    coverPublicId: 'leliano-bologna-01_plurb9',
    featured: true,
    order: 2,
  },
];