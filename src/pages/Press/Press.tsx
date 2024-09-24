// src/pages/Press/Press.tsx

import NewsItem from '../../components/NewsItem/NewsItem.tsx';
import styles from './Press.module.css';

const Press = () => {
  const newsItems = [
    {
      title: 'Виставка фотографій в галереї',
      image: 'path_to_image1.jpg',
      description: 'Фотограф представив свої нові роботи на виставці в місцевій галереї.',
      sources: [
        { name: 'News Source 1', url: 'https://example.com/news1' },
        { name: 'News Source 2', url: 'https://example.com/news2' },
      ],
    },
    {
      title: 'Інтерв’ю з фотографом',
      image: 'path_to_image2.jpg',
      description: 'Фотограф поділився своїм досвідом в інтерв’ю для популярного журналу.',
      sources: [
        { name: 'Magazine Interview', url: 'https://example.com/interview' },
      ],
    },
  ];

  return (
    <div className={styles.pressContainer}>
      <h2>Преса</h2>
      {newsItems.map((item, index) => (
        <NewsItem
          key={index}
          title={item.title}
          image={item.image}
          description={item.description}
          sources={item.sources}
        />
      ))}
    </div>
  );
};

export default Press;
