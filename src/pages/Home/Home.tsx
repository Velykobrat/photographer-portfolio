// src/pages/Home/Home.tsx
import styles from './Home.module.css';

import heroImage from '../../img/HomePage.jpg';
import homeImage from '../../img/HomePhoto.jpg';

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <img 
        src={heroImage} 
        alt="Background" 
        className={styles.backgroundImage} 
      />
      <img 
        src={homeImage} 
        alt="Photographer" 
        className={styles.photographerImage} 
      />
    </div>
  );
}

export default Home;
