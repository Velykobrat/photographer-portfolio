// src/pages/Home/Home.tsx
import styles from './Home.module.css';
import heroImage from '../../img/HomePhoto.jpg';
import logoImage from '../../img/logo.png';

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <img 
        src={heroImage} 
        alt="Background" 
        className={styles.backgroundImage} 
      />
      <div className={styles.logoContainer}>
        <img 
          src={logoImage} 
          alt="Photographer's Logo" 
          className={styles.logo} 
        />
      </div>
    </div>
  );
}

export default Home;
