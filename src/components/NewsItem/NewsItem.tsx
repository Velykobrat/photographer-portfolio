// src/components/NewsItem/NewsItem.tsx

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

import styles from './NewsItem.module.css';

interface NewsItemProps {
  title: string;
  image: string;
  description: string;
  sources: { name: string; url: string }[];
}

const NewsItem: React.FC<NewsItemProps> = ({ title, image, description, sources }) => {
  return (
    <div className={styles.newsItemContainer}>
      <img src={image} alt={title} className={styles.newsItemImage} />
      <h3 className={styles.newsItemTitle}>{title}</h3>
      <p className={styles.newsItemDescription}>{description}</p>
      <div className={styles.newsItemSources}>
        {sources && sources.length > 0 ? ( 
          sources.map((source, index) => (
            <a key={index} href={source.url} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
              <FontAwesomeIcon icon={faInstagram} className={styles.instagramIcon} /> {source.name}
            </a>
          ))
        ) : (
          <p>Джерела не вказані.</p> // Відображення, якщо немає джерел
        )}
      </div>
    </div>
  );
};

export default NewsItem;
