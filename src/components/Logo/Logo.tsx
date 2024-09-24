// src/components/Logo/Logo.tsx
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCameraRetro } from '@fortawesome/free-solid-svg-icons'; // Іконка фотокамери
import styles from './Logo.module.css';

const Logo = () => {
  return (
    <Link to="/collections" className={styles.logoContainer}>
      <FontAwesomeIcon icon={faCameraRetro} className={styles.icon} />
      <span className={styles.logoText}>MK Photographer</span>
    </Link>
  );
};

export default Logo;
