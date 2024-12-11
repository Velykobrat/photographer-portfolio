// src/components/Modal/Modal.tsx
import { useEffect } from 'react';
import styles from './Modal.module.css';

const Modal = ({ image, onClose }: { image: string; onClose: () => void }) => {
  // Додаємо обробник події для клавіші Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Прибираємо обробник події після демонтування компонента
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img src={image} alt="Enlarged view" className={styles.modalImage} />
      </div>
    </div>
  );
};

export default Modal;
