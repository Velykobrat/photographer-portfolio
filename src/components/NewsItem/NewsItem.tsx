import styles from './NewsItem.module.css';

interface Source {
  name: string;
  url: string;
}

interface NewsItemProps {
  category: string;
  title: string;
  image: string;
  description: string;
  sources?: Source[];
  reverse?: boolean;
  priority?: boolean;
}

const NewsItem = ({
  category,
  title,
  image,
  description,
  sources = [],
  reverse = false,
  priority = false,
}: NewsItemProps) => {
  return (
    <article
      className={`${styles.newsItem} ${
        reverse ? styles.reverse : ''
      }`}
    >
      <div className={styles.imageWrapper}>
        <img
          src={image}
          alt={title}
          className={styles.image}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
        />
      </div>

      <div className={styles.content}>
        <p className={styles.category}>
          {category}
        </p>

        <h2 className={styles.title}>
          {title}
        </h2>

        <p className={styles.description}>
          {description}
        </p>

        {sources.length > 0 && (
          <div className={styles.sources}>
            {sources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sourceLink}
              >
                {source.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default NewsItem;