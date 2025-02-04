// src/pages/Press/Press.tsx

import NewsItem from '../../components/NewsItem/NewsItem.tsx';
import styles from './Blog.module.css';
import aboutImage from '../../img/2019 - Margaret - © Giuseppe Casalinuovo (8).jpg';
import photografImage from '../../img/14.jpg';

const Blog = () => {
  const newsItems = [
    {
      title: 'Мене звати Маргарет, я професійний фотограф та діюча модель',
      image: aboutImage,
      description: ' Маю 10-річний досвід у моделінгу. За останні два роки я повністю віддалася своїй пристрасті до фотографії, поєднуючи досвід здобутий в моді, з мистецтвом фотографії. У своїх роботах я завжди прагну відобразити не лише зовнішню красу, а й емоції, індивідуальність та глибину кожної людини перед обєктивом.',
      sources: [
        { name: 'mary_kristel', url: 'https://www.instagram.com/mary_kristel/' },
      ],
    },
    {
      title: 'Інтерв’ю з фотографом',
      image: photografImage,
      description: 'Фотограф поділився своїм досвідом в інтерв’ю для популярного журналу.',
      sources: [
        { name: 'Magazine Interview', url: 'http://l-models.agency/ru/models' },
      ],
    },
  ];

  return (
    
    <div className={styles.pressContainer}>
      <h2>Blog</h2>
      <div className={styles.newsList}>
        {newsItems.map((item, index) => (
          <NewsItem
            key={index}
            title={item.title}
            image={item.image}
            description={item.description}
            sources={item.sources} // Переконайтеся, що тут передається правильно
          />
        ))}
      </div>
    </div>
  );
};

export default Blog;
