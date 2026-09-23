import { useEffect } from 'react';
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

const Modal = ({
  image,
  alt,
  current,
  total,
  onClose,
  onNext,
  onPrevious,
}: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'ArrowRight') {
        onNext();
      }

      if (event.key === 'ArrowLeft') {
        onPrevious();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onNext, onPrevious]);

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
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
      >
        <img
          src={image}
          alt={alt}
          className={styles.image}
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