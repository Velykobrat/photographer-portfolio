// src/components/Logo/Logo.tsx

import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

import logoImage from '../../img/logo_2026_vector.svg';

const Logo = () => {
  return (
    <Link
      to="/home"
      className={styles.logo}
      aria-label="Go to homepage"
    >
      <img
        src={logoImage}
        alt="MK"
        className={styles.logoImage}
      />
    </Link>
  );
};

export default Logo;