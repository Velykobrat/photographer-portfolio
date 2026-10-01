import { useEffect, useRef } from 'react';
import type { TouchEvent } from 'react';

import styles from './Modal.module.css';

type ModalProps = {
  image: string;
  alt: string;

  current: number;
  total: number;

  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

const SWIPE_THRESHOLD = 50;

const Modal = ({
  image,
  alt,
  current,
  total,
  onClose,
  onNext,
  onPrevious,
}: ModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const touchStartX = useRef<number | null>(null);

  const onCloseRef = useRef(onClose);
  const onNextRef = useRef(onNext);
  const onPreviousRef = useRef(onPrevious);

  onCloseRef.current = onClose;
  onNextRef.current = onNext;
  onPreviousRef.current = onPrevious;

  useEffect(() => {
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current();
      }

      if (event.key === 'ArrowRight') {
        onNextRef.current();
      }

      if (event.key === 'ArrowLeft') {
        onPreviousRef.current();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown
      );

      document.body.style.overflow = previousOverflow;

      previousFocus?.focus();
    };
  }, []);

  const handleTouchStart = (
    event: TouchEvent<HTMLDivElement>
  ) => {
    touchStartX.current =
      event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (
    event: TouchEvent<HTMLDivElement>
  ) => {
    if (touchStartX.current === null) {
      return;
    }

    const touchEndX =
      event.changedTouches[0]?.clientX;

    if (touchEndX === undefined) {
      touchStartX.current = null;
      return;
    }

    const distance =
      touchEndX - touchStartX.current;

    if (Math.abs(distance) >= SWIPE_THRESHOLD) {
      if (distance < 0) {
        onNext();
      } else {
        onPrevious();
      }
    }

    touchStartX.current = null;
  };

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      <button
        ref={closeButtonRef}
        type="button"
        className={styles.close}
        onClick={onClose}
        aria-label="Close image"
      >
        ×
      </button>

      <button
        type="button"
        className={`${styles.navigationButton} ${styles.previous}`}
        onClick={(event) => {
          event.stopPropagation();
          onPrevious();
        }}
        aria-label="Previous image"
      >
        ←
      </button>

      <div
        className={styles.imageWrapper}
        onClick={(event) => event.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          key={image}
          src={image}
          alt={alt}
          className={styles.image}
          draggable={false}
        />
      </div>

      <button
        type="button"
        className={`${styles.navigationButton} ${styles.next}`}
        onClick={(event) => {
          event.stopPropagation();
          onNext();
        }}
        aria-label="Next image"
      >
        →
      </button>

      <div className={styles.counter}>
        {String(current).padStart(2, '0')}
        <span>/</span>
        {String(total).padStart(2, '0')}
      </div>
    </div>
  );
};

export default Modal;