// src/components/Navigation/Navigation.tsx

import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.css';

const Navigation = () => {
  return (
    <nav className={styles.navigation}>
      <NavLink
        to="/collections"
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.active : ''}`
        }
      >
        Portfolio
      </NavLink>

      <NavLink
        to="/blog"
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.active : ''}`
        }
      >
        Journal
      </NavLink>

      <NavLink
        to="/contacts"
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.active : ''}`
        }
      >
        Contact
      </NavLink>
    </nav>
  );
};

export default Navigation;