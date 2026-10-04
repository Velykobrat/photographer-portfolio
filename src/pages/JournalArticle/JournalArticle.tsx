import { useEffect } from 'react';
import {
  Link,
  Navigate,
  useParams,
} from 'react-router-dom';

import { journalArticles } from '../../data/journalArticles';
import { getCloudinaryImage } from '../../utils/cloudinary';

import styles from './JournalArticle.module.css';

const JournalArticle = () => {
  const { slug } = useParams();

  const article = journalArticles.find(
    (item) => item.slug === slug
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }, [slug]);

  if (!article) {
    return (
      <Navigate
        to="/journal"
        replace
      />
    );
  }

  return (
    <main className={styles.article}>
      <header className={styles.hero}>
        <Link
          to="/journal"
          className={styles.back}
        >
          ← Journal
        </Link>

        <p className={styles.category}>
          {article.category}
        </p>

        <h1 className={styles.title}>
          {article.title}
        </h1>

        <p className={styles.subtitle}>
          {article.subtitle}
        </p>
      </header>

      <div className={styles.coverWrapper}>
        <img
          src={getCloudinaryImage(
            article.heroImagePublicId,
            1800
          )}
          alt={article.title}
          className={styles.cover}
        />
      </div>

      <section className={styles.content}>
        <div className={styles.intro}>
          {article.intro.map((paragraph) => (
            <p key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className={styles.questions}>
          {article.questions.map(
            (item, index) => (
              <div key={item.question}>
                <div className={styles.questionBlock}>
                  <p className={styles.number}>
                    {String(index + 1).padStart(
                      2,
                      '0'
                    )}
                  </p>

                  <h2 className={styles.question}>
                    {item.question}
                  </h2>

                  <p className={styles.answer}>
                    {item.answer}
                  </p>
                </div>

                {index === 3 &&
                  article.inlineImagePublicId && (
                    <div
                      className={
                        styles.inlineImageWrapper
                      }
                    >
                      <img
                        src={getCloudinaryImage(
                          article.inlineImagePublicId,
                          1600
                        )}
                        alt="Margaret"
                        className={
                          styles.inlineImage
                        }
                        loading="lazy"
                      />
                    </div>
                  )}

                {index === 5 &&
                  article.featuredQuote && (
                    <blockquote
                      className={styles.quote}
                    >
                      “{article.featuredQuote}”
                    </blockquote>
                  )}
              </div>
            )
          )}
        </div>

        {article.closingImagePublicId && (
          <div
            className={
              styles.closingImageWrapper
            }
          >
            <img
              src={getCloudinaryImage(
                article.closingImagePublicId,
                1800
              )}
              alt="Margaret"
              className={
                styles.closingImage
              }
              loading="lazy"
            />
          </div>
        )}

        <footer className={styles.closing}>
          {article.closingTitle && (
            <h2>
              {article.closingTitle}
            </h2>
          )}

          {article.closing.map((paragraph) => (
            <p key={paragraph}>
              {paragraph}
            </p>
          ))}
        </footer>

        <Link
          to="/journal"
          className={styles.backLink}
        >
          ← Back to Journal
        </Link>
      </section>
    </main>
  );
};

export default JournalArticle;