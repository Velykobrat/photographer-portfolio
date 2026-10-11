import { useLanguage } from '../../localization';
import { useEffect, useRef } from "react";
import type { TouchEvent } from "react";
import { createPortal } from "react-dom";

import styles from "./Modal.module.css";

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
  const { t } = useLanguage();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const onCloseRef = useRef(onClose);
  const onNextRef = useRef(onNext);
  const onPreviousRef = useRef(onPrevious);

  useEffect(() => {
    onCloseRef.current = onClose;
    onNextRef.current = onNext;
    onPreviousRef.current = onPrevious;
  }, [onClose, onNext, onPrevious]);

  useEffect(() => {
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>(
          "button:not(:disabled)",
        );
        const first = buttons?.[0];
        const last = buttons?.[buttons.length - 1];
        if (first && last) {
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNextRef.current();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPreviousRef.current();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // The dialog is portalled outside the app so background controls are inert.
    const root = document.getElementById("root");
    const wasInert = root?.inert ?? false;
    if (root) root.inert = true;

    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = previousOverflow;
      if (root) root.inert = wasInert;

      previousFocus?.focus();
    };
  }, []);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    touchStartY.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) {
      return;
    }

    const touchEndX = event.changedTouches[0]?.clientX;

    if (touchEndX === undefined) {
      touchStartX.current = null;
      return;
    }

    const distance = touchEndX - touchStartX.current;
    const verticalDistance =
      (event.changedTouches[0]?.clientY ?? 0) - (touchStartY.current ?? 0);

    if (
      Math.abs(distance) >= SWIPE_THRESHOLD &&
      Math.abs(distance) > Math.abs(verticalDistance)
    ) {
      if (distance < 0) {
        onNext();
      } else {
        onPrevious();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return createPortal(
    <div
      ref={dialogRef}
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('Photo viewer')}
    >
      <button
        ref={closeButtonRef}
        type="button"
        className={styles.close}
        onClick={onClose}
        aria-label={t("Close image")}
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
        aria-label={t("Previous image")}
      >
        ←
      </button>

      <div
        className={styles.imageWrapper}
        onClick={(event) => event.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => {
          touchStartX.current = null;
          touchStartY.current = null;
        }}
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
        aria-label={t("Next image")}
      >
        →
      </button>

      <div className={styles.counter} aria-live="polite" aria-atomic="true">
        {String(current).padStart(2, "0")}
        <span>/</span>
        {String(total).padStart(2, "0")}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
