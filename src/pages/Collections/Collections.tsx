import { useEffect, useState } from 'react';

import Card from '../../components/Card/Card';
import Modal from '../../components/Modal/Modal';
import styles from './Collections.module.css';
import { getCloudinaryImage } from '../../utils/cloudinary';

type CloudinaryPhoto = {
  public_id: string;
};

type Photo = {
  id: string;
  image: string;
  fullscreen: string;
  alt: string;
};

const Collections = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(
      'https://res.cloudinary.com/dln0hogkt/image/list/portfolio-public.json'
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load portfolio images');
        }

        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data.resources)) {
          throw new Error('Invalid Cloudinary response');
        }

        const loadedPhotos: Photo[] = data.resources.map(
          (photo: CloudinaryPhoto) => ({
            id: photo.public_id,
            image: getCloudinaryImage(photo.public_id, 1200),
            fullscreen: getCloudinaryImage(photo.public_id, 2000),
            alt: photo.public_id,
          })
        );

        setPhotos(loadedPhotos);
        setError(null);
      })
      .catch((error) => {
        console.error('Cloudinary error:', error);
        setError('Portfolio is temporarily unavailable.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const openModal = (index: number) => {
    setSelectedIndex(index);
  };

  const closeModal = () => {
    setSelectedIndex(null);
  };

  const showNext = () => {
    setSelectedIndex((current) => {
      if (current === null || photos.length === 0) {
        return null;
      }

      return (current + 1) % photos.length;
    });
  };

  const showPrevious = () => {
    setSelectedIndex((current) => {
      if (current === null || photos.length === 0) {
        return null;
      }

      return (current - 1 + photos.length) % photos.length;
    });
  };

  return (
    <main className={styles.portfolio}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Selected work</p>

        <h1 className={styles.title}>Portfolio</h1>

        <p className={styles.description}>
          Portrait · Fashion · Personal
        </p>
      </header>

      {isLoading && (
        <p className={styles.status}>
          Loading portfolio...
        </p>
      )}

      {error && (
        <p className={styles.status}>
          {error}
        </p>
      )}

      {!isLoading && !error && (
        <section className={styles.gallery}>
          {photos.map((photo, index) => (
            <Card
              key={photo.id}
              image={photo.image}
              alt={photo.alt}
              onClick={() => openModal(index)}
            />
          ))}
        </section>
      )}

      {selectedIndex !== null && photos[selectedIndex] && (
        <Modal
          image={photos[selectedIndex].fullscreen}
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

export default Collections;