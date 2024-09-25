// src/components/Logo/Logo.tsx
import { Link } from 'react-router-dom';
import styles from './Logo.module.css';
import logoImage from '../../img/logo.png';  // Імпорт зображення

const Logo = () => {
  return (
    <Link to="/collections" className={styles.logoContainer}>
      <img src={logoImage} alt="MK Photographer Logo" className={styles.logoImage} />
      <span className={styles.logoText}>Photographer</span>
    </Link>
  );
};

export default Logo;
