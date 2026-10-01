import styles from './Card.module.css';

type CardProps = {
  image: string;
  srcSet?: string;
  alt: string;
  onClick: () => void;
};

const Card = ({
  image,
  srcSet,
  alt,
  onClick,
}: CardProps) => {
  return (
    <button
      type="button"
      className={styles.card}
      onClick={onClick}
      aria-label={`Open ${alt}`}
    >
      <img
        src={image}
        srcSet={srcSet}
        sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
        alt={alt}
        className={styles.image}
        loading="lazy"
        decoding="async"
      />
    </button>
  );
};

export default Card;