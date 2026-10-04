import { Link } from 'react-router-dom';

import { journalArticles } from '../../data/journalArticles';
import { getCloudinaryImage } from '../../utils/cloudinary';

import SEO from '../../components/SEO/SEO';
import styles from './Blog.module.css';

const Blog = () => {
  return (
    <main className={styles.journal}>

      <SEO
  title="Journal"
  description="Stories, conversations and notes about photography, people and the moments behind the frame."
  canonicalPath="/journal"
      />
      
      <header className={styles.intro}>
        <p className={styles.eyebrow}>
          Stories & notes
        </p>

        <h1 className={styles.title}>
          Journal
        </h1>

        <p className={styles.lead}>
          Photography, people and stories behind the frame.
        </p>
      </header>

      <section className={styles.newsList}>
        {journalArticles.map((article) => (
          <article
            key={article.id}
            className={styles.articleCard}
          >
            <div className={styles.imageWrapper}>
              <img
                src={getCloudinaryImage(
                  article.cardImagePublicId,
                  1600
                )}
                alt={article.title}
                className={styles.articleImage}
              />
            </div>

            <div className={styles.articleContent}>
              <p className={styles.articleCategory}>
                {article.category}
              </p>

              <h2 className={styles.articleTitle}>
                {article.title}
              </h2>

              <p className={styles.articleExcerpt}>
                {article.excerpt}
              </p>

              <Link
                to={`/journal/${article.slug}`}
                className={styles.readLink}
              >
                Read story
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Blog;