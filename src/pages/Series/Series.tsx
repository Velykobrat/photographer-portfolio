import { useLanguage } from '../../localization';
import { LocalizedLink as Link } from '../../LocalizedLinks';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SEO from "../../components/SEO/SEO";
import Card from "../../components/Card/Card";
import Modal from "../../components/Modal/Modal";

import {
  portfolioSeries,
  type PortfolioSeries,
} from "../../data/portfolioSeries";

import {
  getCloudinaryImage,
  getCloudinarySrcSet,
} from "../../utils/cloudinary";

import styles from "./Series.module.css";
import NotFound from "../NotFound/NotFound";

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

  const series = portfolioSeries.find((item) => item.slug === slug);

  return series ? (
    <SeriesContent key={series.slug} series={series} />
  ) : (
    <NotFound />
  );
};

const SeriesContent = ({ series }: { series: PortfolioSeries }) => {
  const { t, language } = useLanguage();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Load photos for the current series
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    let active = true;

    fetch(
      `https://res.cloudinary.com/dln0hogkt/image/list/${series.cloudinaryTag}.json`,
      { signal: controller.signal },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load photography series");
        }

        return response.json();
      })
      .then((data) => {
        if (
          !data ||
          !Array.isArray(data.resources) ||
          !data.resources.every(
            (photo: unknown) =>
              typeof photo === "object" &&
              photo !== null &&
              "public_id" in photo &&
              typeof photo.public_id === "string" &&
              photo.public_id.length > 0,
          )
        ) {
          throw new Error("Invalid Cloudinary response");
        }

        const loadedPhotos: Photo[] = data.resources
          .sort((a: CloudinaryPhoto, b: CloudinaryPhoto) =>
            a.public_id.localeCompare(b.public_id, undefined, {
              numeric: true,
            }),
          )
          .map((photo: CloudinaryPhoto, index: number) => ({
            id: photo.public_id,

            image: getCloudinaryImage(photo.public_id, 1200),

            srcSet: getCloudinarySrcSet(
              photo.public_id,
              [480, 800, 1200, 1600],
            ),

            fullscreen: getCloudinaryImage(photo.public_id, 2200),

            alt: `${series.title} — photo ${index + 1}`,
          }));

        if (active) setPhotos(loadedPhotos);
      })
      .catch((error) => {
        if (!active) return;
        console.error("Cloudinary series error:", error);

        setError("This photography series is temporarily unavailable.");
      })
      .finally(() => {
        window.clearTimeout(timeout);
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [series, attempt]);

  // Preload neighbouring fullscreen photos
  useEffect(() => {
    if (selectedIndex === null || photos.length < 2) {
      return;
    }

    const nextIndex = (selectedIndex + 1) % photos.length;

    const previousIndex = (selectedIndex - 1 + photos.length) % photos.length;

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

  const retry = () => {
    setPhotos([]);
    setSelectedIndex(null);
    setIsLoading(true);
    setError(null);
    setAttempt((value) => value + 1);
  };
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
    <main className={styles.series}>
      <SEO
        title={series.title}
        description={`${series.title} — a ${t(series.category)} photography series by MK Photography.`}
        canonicalPath={`/collections/${series.slug}`}
        image={getCloudinaryImage(series.coverPublicId, 1600)}
      />

      <header className={styles.intro}>
        <Link to="/collections" className={styles.back}>{t("← Portfolio")}</Link>

        <p className={styles.category}>{series.category}</p>

        <h1 className={styles.title}>{series.title}</h1>

        {!isLoading && !error && (
          <p className={styles.count}>
            {photos.length} {language === 'uk' ? ({zero: 'фотографій', two: 'фотографії', one: 'фотографія', few: 'фотографії', many: 'фотографій', other: 'фотографії'}[new Intl.PluralRules('uk').select(photos.length)] ?? 'фотографій') : photos.length === 1 ? 'photograph' : 'photographs'}
          </p>
        )}
      </header>

      {isLoading && (
        <p className={styles.status} role="status">{t("Loading series...")}</p>
      )}

      {error && (
        <div className={styles.status} role="alert">
          <p>{t(error)}</p>
          <button type="button" className={styles.retry} onClick={retry}>{t("Try again")}</button>
        </div>
      )}

      {!isLoading && !error && photos.length === 0 && (
        <p className={styles.status} role="status">{t("Photographs will be added to this series soon.")}</p>
      )}

      {!isLoading && !error && photos.length > 0 && (
        <section className={styles.gallery}>
          {photos.map((photo, index) => (
            <Card
              key={photo.id}
              image={photo.image}
              srcSet={photo.srcSet}
              alt={language === 'uk' ? `${series.title} — фотографія ${index + 1}` : photo.alt}
              priority={index === 0}
              onClick={() => openModal(index)}
            />
          ))}
        </section>
      )}

      {selectedIndex !== null && photos[selectedIndex] && (
        <Modal
          image={photos[selectedIndex].fullscreen}
          alt={language === 'uk' ? `${series.title} — фотографія ${selectedIndex + 1}` : photos[selectedIndex].alt}
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
