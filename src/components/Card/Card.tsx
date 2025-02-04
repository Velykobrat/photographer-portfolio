// src/components/Card/Card.tsx

import styles from './Card.module.css';

const Card = ({ image, title, size, onClick }: { image: string; title: string; size: 'rectangle' | 'square'; onClick?: () => void }) => {
  return (
    <div className={`${styles.cardWrapper} ${styles[size]}`} onClick={onClick}>
      <div className={styles.cardContainer}>
        <img src={image} alt={title} />
      </div>
    </div>
  );
};

export default Card;
