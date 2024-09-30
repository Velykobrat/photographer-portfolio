// src/pages/Press/Press.tsx

import NewsItem from '../../components/NewsItem/NewsItem.tsx';
import styles from './Blog.module.css';
import posingCliffImage from '../../img/Posing_Cliff_Berryman.jpg';
import beckenbauerImage from '../../img/Beckenbauer_Pressefotografen2.jpg';

const Blog = () => {
  const newsItems = [
    {
      title: 'Виставка фотографій в галереї',
      image: posingCliffImage,
      description: 'Фотограф представив свої нові роботи на виставці в місцевій галереї.',
      sources: [
        { name: 'News Source 1', url: 'https://exhttp://l-models.agency/ru/models/' },
        { name: 'News Source 2', url: 'http://l-models.agency/ru/models/' },
      ],
    },
    {
      title: 'Інтерв’ю з фотографом',
      image: beckenbauerImage,
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
