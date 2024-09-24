// src/components/Header/Header.tsx
import styles from './Header.module.css';
import Logo from '../Logo/Logo';
import Navigation from '../Navigation/Navigation';

const Header = () => {
  return (
    <nav className={styles.nav}>
      <Logo />
      <Navigation />
    </nav>
  );
};

export default Header;
