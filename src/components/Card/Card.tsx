// src/components/Card/Card.tsx

import styles from './Card.module.css';

const Card = ({ image, title, size }: { image: string; title: string; size: 'rectangle' | 'square' }) => {
  return (
    <div className={`${styles.cardContainer} ${styles[size]}`}>
      <img src={image} alt={title} />
    </div>
  );
};

export default Card;
