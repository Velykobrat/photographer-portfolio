import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './Collections.module.css';

import {
  portfolioSeries,
  type PortfolioCategory,
} from '../../data/portfolioSeries';

import {
  getCloudinaryImage,
  getCloudinarySrcSet,
} from '../../utils/cloudinary';

type Filter = 'all' | PortfolioCategory;

const categoryLabels: Record<PortfolioCategory, string> = {
  portrait: 'Portrait',
  fashion: 'Fashion',
  personal: 'Personal',
  commercial: 'Commercial',
};

const Collections = () => {
  const [activeFilter, setActiveFilter] =
    useState<Filter>('all');

  const availableCategories = useMemo(
    () =>
      Array.from(
        new Set(
          portfolioSeries.map(
            (series) => series.category
          )
        )
      ),
    []
  );

  const visibleSeries = useMemo(() => {
    const sorted = [...portfolioSeries].sort(
      (a, b) =>
        (a.order ?? 999) - (b.order ?? 999)
    );

    if (activeFilter === 'all') {
      return sorted;
    }

    return sorted.filter(
      (series) =>
        series.category === activeFilter
    );
  }, [activeFilter]);

  const featuredSeries =
    activeFilter === 'all'
      ? visibleSeries.find(
          (series) => series.featured
        )
      : undefined;

  const regularSeries = featuredSeries
    ? visibleSeries.filter(
        (series) =>
          series.slug !== featuredSeries.slug
      )
    : visibleSeries;

  return (
    <main className={styles.portfolio}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>
          Selected work
        </p>

        <h1 className={styles.title}>
          Portfolio
        </h1>

        
      </header>

      <nav
        className={styles.filters}
        aria-label="Portfolio categories"
      >
        <button
          type="button"
          className={`${styles.filterButton} ${
            activeFilter === 'all'
              ? styles.activeFilter
              : ''
          }`}
          onClick={() =>
            setActiveFilter('all')
          }
        >
          All
        </button>

        {availableCategories.map(
          (category) => (
            <button
              key={category}
              type="button"
              className={`${styles.filterButton} ${
                activeFilter === category
                  ? styles.activeFilter
                  : ''
              }`}
              onClick={() =>
                setActiveFilter(category)
              }
            >
              {categoryLabels[category]}
            </button>
          )
        )}
      </nav>

      {featuredSeries && (
        <Link
          to={`/collections/${featuredSeries.slug}`}
          className={`${styles.seriesCard} ${styles.featuredCard}`}
        >
          <div className={styles.coverWrapper}>
            <img
              src={getCloudinaryImage(
                featuredSeries.coverPublicId,
                1600
              )}
              srcSet={getCloudinarySrcSet(
                featuredSeries.coverPublicId,
                [480, 800, 1200, 1600, 2000]
              )}
              sizes="(max-width: 600px) 100vw, 65vw"
              alt={`${featuredSeries.title} photography series`}
              className={styles.cover}
              decoding="async"
            />
          </div>

          <div className={styles.seriesInfo}>
            <p className={styles.featuredLabel}>
              Featured series
            </p>

            <p className={styles.seriesCategory}>
              {
                categoryLabels[
                  featuredSeries.category
                ]
              }
            </p>

            <h2 className={styles.seriesTitle}>
              {featuredSeries.title}
            </h2>

            <span className={styles.viewSeries}>
              View series →
            </span>
          </div>
        </Link>
      )}

      <section className={styles.seriesGrid}>
        {regularSeries.map((series) => (
          <Link
            key={series.slug}
            to={`/collections/${series.slug}`}
            className={styles.seriesCard}
          >
            <div className={styles.coverWrapper}>
              <img
                src={getCloudinaryImage(
                  series.coverPublicId,
                  1200
                )}
                srcSet={getCloudinarySrcSet(
                  series.coverPublicId,
                  [480, 800, 1200, 1600]
                )}
                sizes="(max-width: 600px) 100vw, 50vw"
                alt={`${series.title} photography series`}
                className={styles.cover}
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className={styles.seriesInfo}>
              <p className={styles.seriesCategory}>
                {
                  categoryLabels[
                    series.category
                  ]
                }
              </p>

              <h2 className={styles.seriesTitle}>
                {series.title}
              </h2>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
};

export default Collections;