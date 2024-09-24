import styles from './NewsItem.module.css';

interface NewsItemProps {
  title: string;
  image: string;
  description: string;
  sources: { name: string; url: string }[];
}

const NewsItem: React.FC<NewsItemProps> = ({ title, image, description, sources }) => {
  return (
    <div className={styles.newsItem}>
      <img src={image} alt={title} className={styles.newsImage} />
      <h3 className={styles.newsTitle}>{title}</h3>
      <p className={styles.newsDescription}>{description}</p>
      <div className={styles.sources}>
        {sources.map((source, index) => (
          <a key={index} href={source.url} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
            {source.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default NewsItem;
