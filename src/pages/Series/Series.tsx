import { localizedPath, useLanguage } from '../../localization';
import { LocalizedLink as Link } from '../../LocalizedLinks';
import { useEffect, useRef, useState, type TouchEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
import { photoAlt, portfolioImageUrl, portfolioSrcSet, seriesCover, seriesTitle } from '../../utils/portfolioImages';

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
  const title = seriesTitle(series, language);
  const navigate = useNavigate();
  const swipe = useRef<{ x: number; y: number; id: number } | null>(null);
  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    swipe.current = selectedIndex === null && event.touches.length === 1 && touch
      ? { x: touch.clientX, y: touch.clientY, id: touch.identifier }
      : null;
  };
  const handleTouchMove = (event: TouchEvent<HTMLElement>) => {
    const start = swipe.current;
    const touch = event.touches[0];
    if (!start || !touch) return;
    const dx = Math.abs(touch.clientX - start.x);
    const dy = Math.abs(touch.clientY - start.y);
    if (event.touches.length !== 1 || (dy > 24 && dy >= dx)) {
      swipe.current = null;
    }
  };
  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start || selectedIndex !== null || event.touches.length !== 0) return;
    const touch = Array.from(event.changedTouches).find(item => item.identifier === start.id);
    if (!touch) return;
    const dx = touch.clientX - start.x;
    const dy = Math.abs(touch.clientY - start.y);
    if (dx >= 80 && dx > dy * 2) {
      navigate(localizedPath('/collections', language));
    }
  };
  const [photos, setPhotos] = useState<Photo[]>(() => (series.photos ?? []).map(photo => ({
    id: photo._key, image: portfolioImageUrl(photo, 1200),
    srcSet: portfolioSrcSet(photo, [480, 800, 1200, 1600]),
    fullscreen: portfolioImageUrl(photo, 2200), alt: photo.altEn,
  })));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(series.photos === undefined);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Load photos for the current series
  useEffect(() => {
    if (series.photos) return;
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

  const getPhotoAlt = (index: number) => series.photos?.[index]
    ? photoAlt(series.photos[index], language)
    : language === 'uk' ? `${title} — фотографія ${index + 1}` : photos[index].alt;

  return (
    <main
      className={styles.series}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => { swipe.current = null; }}
    >
      <SEO
        title={title}
        description={`${series.title} — a ${t(series.category)} photography series by MK Photography.`}
        canonicalPath={`/collections/${series.slug}`}
        image={portfolioImageUrl(seriesCover(series), 1200, true)}
      />

      <header className={styles.intro}>
        <Link to="/collections" className={styles.back}>{t("← Portfolio")}</Link>

        <p className={styles.category}>{t(series.category)}</p>

        <h1 className={styles.title}>{title}</h1>

        {(language === 'uk' ? series.descriptionUk : series.descriptionEn) && (
          <p className={styles.description}>{language === 'uk' ? series.descriptionUk : series.descriptionEn}</p>
        )}

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
              alt={getPhotoAlt(index)}
              priority={index === 0}
              onClick={() => openModal(index)}
            />
          ))}
        </section>
      )}

      {selectedIndex !== null && photos[selectedIndex] && (
        <Modal
          image={photos[selectedIndex].fullscreen}
          alt={getPhotoAlt(selectedIndex)}
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
