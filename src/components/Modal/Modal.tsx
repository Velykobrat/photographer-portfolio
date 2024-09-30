// src/components/Modal/Modal.tsx
import styles from './Modal.module.css';

const Modal = ({ image, onClose }: { image: string; onClose: () => void }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img src={image} alt="Enlarged view" className={styles.modalImage} />
      </div>
    </div>
  );
};

export default Modal;
