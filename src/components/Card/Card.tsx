// src/components/Card/Card.tsx
import styles from './Card.module.css';

const Card = ({ image, title, isSquare }: { image: string; title: string; isSquare: boolean }) => {
  return (
    <div className={`${styles.cardContainer} ${isSquare ? styles.square : styles.rectangle}`}>
      <img src={image} alt={title} />

    </div>
  );
};

export default Card;
