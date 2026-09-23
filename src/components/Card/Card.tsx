import styles from './Card.module.css';

type CardProps = {
  image: string;
  alt: string;
  onClick: () => void;
};

const Card = ({ image, alt, onClick }: CardProps) => {
  return (
    <button
      type="button"
      className={styles.card}
      onClick={onClick}
      aria-label={`Open ${alt}`}
    >
      <img
        src={image}
        alt={alt}
        className={styles.image}
        loading="lazy"
      />
    </button>
  );
};

export default Card;