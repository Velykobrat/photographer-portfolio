// src/components/Navigation/Navigation.tsx
import { Link } from 'react-router-dom';
import styles from './Navigation.module.css';

const Navigation = () => {
  return (
    <div className={styles.navLinks}>
      <Link to="/collections">Collections</Link>
      <Link to="/press">Press</Link>
      <Link to="/contacts">Contacts</Link>
      <Link to="/about">About</Link>
    </div>
  );
};

export default Navigation;
