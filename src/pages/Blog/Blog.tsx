import NewsItem from '../../components/NewsItem/NewsItem';
import { getCloudinaryImage } from '../../utils/cloudinary';

import styles from './Blog.module.css';

const aboutImage = getCloudinaryImage(
  '2019_-_Margaret_-_Giuseppe_Casalinuovo_8_yi7rl4',
  1600
);

const photographerImage = getCloudinaryImage(
  '2019_-_Margaret_-_Giuseppe_Casalinuovo_18_bnfeeu',
  1600
);

const articles = [
  {
    id: 1,
    category: 'About',
    title:
      'Мене звати Маргарет, я професійний фотограф та діюча модель',
    image: aboutImage,
    description:
      'Маю 10-річний досвід у моделінгу. За останні два роки я повністю віддалася своїй пристрасті до фотографії, поєднуючи досвід, здобутий у моді, з мистецтвом фотографії. У своїх роботах я прагну відобразити не лише зовнішню красу, а й емоції, індивідуальність та глибину кожної людини перед об’єктивом.',
    sources: [
      {
        name: '@mary_kristel',
        url: 'https://www.instagram.com/mary_kristel/',
      },
      {
        name: '@mary_kristel_ph',
        url: 'https://www.instagram.com/mary_kristel_ph/',
      },
    ],
  },
  {
    id: 2,
    category: 'Interview',
    title: 'Інтерв’ю з фотографом',
    image: photographerImage,
    description:
      'Розмова про фотографію, досвід роботи перед камерою та за нею, творчий шлях і власний погляд на образ людини у кадрі.',
    sources: [
      {
        name: 'Read interview',
        url: 'http://l-models.agency/ru/models',
      },
    ],
  },
];

const Blog = () => {
  return (
    <main className={styles.journal}>
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
        {articles.map((article, index) => (
          <NewsItem
            key={article.id}
            category={article.category}
            title={article.title}
            image={article.image}
            description={article.description}
            sources={article.sources}
            reverse={index % 2 !== 0}
            priority={index === 0}
          />
        ))}
      </section>
    </main>
  );
};

export default Blog;