// src/pages/Home/Home.tsx

import { Link } from 'react-router-dom';
import styles from './Home.module.css';

import heroImage from '../../img/14.jpg';
import logoImage from '../../img/logo_2026_vector.svg';

const Home = () => {
  return (
    <main className={styles.home}>
      <img
        src={heroImage}
        alt="Portrait photography"
        className={styles.heroImage}
      />

      <div className={styles.overlay} />

      <section className={styles.content}>
        <img
          src={logoImage}
          alt="Photographer logo"
          className={styles.logo}
        />

        <p className={styles.subtitle}>
          PHOTOGRAPHY · PORTRAIT · FASHION
        </p>

        <div className={styles.actions}>
          <Link to="/collections" className={styles.primaryLink}>
            View portfolio
          </Link>

          <Link to="/contacts" className={styles.secondaryLink}>
            Book a shoot
          </Link>
        </div>
      </section>

      <div className={styles.scrollHint}>
        <span>SCROLL</span>
        <div className={styles.scrollLine} />
      </div>
    </main>
  );
};

export default Home;