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
    featured: false,
    order: 1,
  },
  {
    slug: 'leliano-bologna',
    title: 'Leliano Bologna',
    category: 'personal',
    cloudinaryTag: 'series-leliano-bologna',
    coverPublicId: 'leliano-bologna-01_plurb9',
    featured: false,
    order: 2,
    },
  {
  slug: 'inlight',
  title: 'Inlight',
  category: 'fashion',
  cloudinaryTag: 'series-inlight',
  coverPublicId: 'inlight-01_udbqed',
  featured: true,
  order: 3,
},
{
  slug: 'lisa-ladyzhyn',
  title: 'Lisa Ladyzhyn',
  category: 'personal',
  cloudinaryTag: 'series-lisa-ladyzhyn',
  coverPublicId: 'lisa-ladyzhyn-04_tmq21a',
  featured: false,
  order: 4,
},
{
  slug: 'mynule',
  title: 'Mynule',
  category: 'commercial',
  cloudinaryTag: 'series-mynule',
  coverPublicId: 'mynule-01_i1xxgk',
  featured: false,
  order: 5,
},
{
  slug: 'serhii-kyiv',
  title: 'Serhii Kyiv',
  category: 'portrait',
  cloudinaryTag: 'series-serhii-kyiv',
  coverPublicId: 'serhii-kyiv-02_p3soy4',
  featured: false,
  order: 6,
},
{
  slug: 'zara-kyiv',
  title: 'Zara Kyiv',
  category: 'portrait',
  cloudinaryTag: 'series-zara-kyiv',
  coverPublicId: 'zara-kyiv-11_wy4ulm',
  featured: false,
  order: 7,
},
];