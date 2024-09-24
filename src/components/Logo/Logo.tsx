// src/components/Logo/Logo.tsx
import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

const Logo = () => {
  return (
    <Link to="/collections">
      <img src="/path_to_your_logo.png" alt="Logo" className={styles.logo} />
    </Link>
  );
};

export default Logo;
