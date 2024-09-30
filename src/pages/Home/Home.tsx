import styles from './Home.module.css';

import homeImage from '../../img/HomePage.jpg';

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <img 
        src={homeImage} 
        alt="Background" 
        className={styles.backgroundImage} // Зображення фону
      />
      <img 
        src={homeImage} 
        alt="Photographer" 
        className={styles.photographerImage} // Зображення фотографа
      />
    </div>
  );
}

export default Home;
