// src/components/Header/Header.tsx

import { useLocation } from 'react-router-dom';

import styles from './Header.module.css';
import Logo from '../Logo/Logo';
import Navigation from '../Navigation/Navigation';

const Header = () => {
  const location = useLocation();

  const isHome = location.pathname === '/home' || location.pathname === '/';

  return (
    <header
      className={`${styles.header} ${
        isHome ? styles.transparent : ''
      }`}
    >
      <Logo />
      <Navigation />
    </header>
  );
};

export default Header;