import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

import Card from '../../components/Card/Card';
import Modal from '../../components/Modal/Modal';

import { portfolioSeries } from '../../data/portfolioSeries';

import {
  getCloudinaryImage,
  getCloudinarySrcSet,
} from '../../utils/cloudinary';

import styles from './Series.module.css';

type CloudinaryPhoto = {
  public_id: string;
};

type Photo = {
  id: string;
  image: string;
  srcSet: string;
  fullscreen: string;
  alt: string;
};

const Series = () => {
  const { slug } = useParams();

  const series = portfolioSeries.find(
    (item) => item.slug === slug
  );

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedIndex, setSelectedIndex] =
    useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] =
    useState<string | null>(null);

  // Load photos for the current series
  useEffect(() => {
    if (!series) {
      return;
    }

    setIsLoading(true);
    setError(null);

    fetch(
      `https://res.cloudinary.com/dln0hogkt/image/list/${series.cloudinaryTag}.json`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            'Failed to load photography series'
          );
        }

        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data.resources)) {
          throw new Error(
            'Invalid Cloudinary response'
          );
        }

        const loadedPhotos: Photo[] =
          data.resources
            .sort(
              (
                a: CloudinaryPhoto,
                b: CloudinaryPhoto
              ) =>
                a.public_id.localeCompare(
                  b.public_id,
                  undefined,
                  { numeric: true }
                )
            )
            .map(
              (
                photo: CloudinaryPhoto,
                index: number
              ) => ({
                id: photo.public_id,

                image: getCloudinaryImage(
                  photo.public_id,
                  1200
                ),

                srcSet: getCloudinarySrcSet(
                  photo.public_id,
                  [480, 800, 1200, 1600]
                ),

                fullscreen: getCloudinaryImage(
                  photo.public_id,
                  2200
                ),

                alt: `${series.title} — photo ${
                  index + 1
                }`,
              })
            );

        setPhotos(loadedPhotos);
      })
      .catch((error) => {
        console.error(
          'Cloudinary series error:',
          error
        );

        setError(
          'This photography series is temporarily unavailable.'
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [series]);

  // Preload neighbouring fullscreen photos
  useEffect(() => {
    if (
      selectedIndex === null ||
      photos.length < 2
    ) {
      return;
    }

    const nextIndex =
      (selectedIndex + 1) % photos.length;

    const previousIndex =
      (selectedIndex - 1 + photos.length) %
      photos.length;

    const imagesToPreload = [
      photos[nextIndex]?.fullscreen,
      photos[previousIndex]?.fullscreen,
    ];

    imagesToPreload.forEach((src) => {
      if (!src) {
        return;
      }

      const image = new Image();
      image.src = src;
    });
  }, [selectedIndex, photos]);

  // Reset scroll position when opening another series
useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'auto',
  });
}, [slug]);
  
  if (!series) {
    return (
      <Navigate
        to="/collections"
        replace
      />
    );
  }

  const openModal = (index: number) => {
    setSelectedIndex(index);
  };

  const closeModal = () => {
    setSelectedIndex(null);
  };

  const showNext = () => {
    setSelectedIndex((current) => {
      if (
        current === null ||
        photos.length === 0
      ) {
        return null;
      }

      return (current + 1) % photos.length;
    });
  };

  const showPrevious = () => {
    setSelectedIndex((current) => {
      if (
        current === null ||
        photos.length === 0
      ) {
        return null;
      }

      return (
        (current - 1 + photos.length) %
        photos.length
      );
    });
  };

  return (
    <main className={styles.series}>
      <header className={styles.intro}>
        <Link
          to="/collections"
          className={styles.back}
        >
          ← Portfolio
        </Link>

        <p className={styles.category}>
          {series.category}
        </p>

        <h1 className={styles.title}>
          {series.title}
        </h1>

        {!isLoading && !error && (
          <p className={styles.count}>
            {photos.length}{' '}
            {photos.length === 1
              ? 'photograph'
              : 'photographs'}
          </p>
        )}
      </header>

      {isLoading && (
        <p className={styles.status}>
          Loading series...
        </p>
      )}

      {error && (
        <p className={styles.status}>
          {error}
        </p>
      )}

      {!isLoading &&
        !error &&
        photos.length > 0 && (
          <section className={styles.gallery}>
            {photos.map((photo, index) => (
              <Card
                key={photo.id}
                image={photo.image}
                srcSet={photo.srcSet}
                alt={photo.alt}
                onClick={() =>
                  openModal(index)
                }
              />
            ))}
          </section>
        )}

      {selectedIndex !== null &&
        photos[selectedIndex] && (
          <Modal
            image={
              photos[selectedIndex].fullscreen
            }
            alt={photos[selectedIndex].alt}
            current={selectedIndex + 1}
            total={photos.length}
            onClose={closeModal}
            onNext={showNext}
            onPrevious={showPrevious}
          />
        )}
    </main>
  );
};

export default Series;