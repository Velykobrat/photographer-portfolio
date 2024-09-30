// src/components/Navigation/Navigation.tsx

import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faPhone, faNewspaper, faUser, faHome } from '@fortawesome/free-solid-svg-icons'; // Додаємо іконку будиночка
import styles from './Navigation.module.css';

const Navigation = () => {
  return (
    <div className={styles.navLinks}>
      <NavLink 
        to="/home" 
        className={({ isActive }) => (isActive ? styles.activeLink : undefined)}
      >
        <FontAwesomeIcon icon={faHome} className={styles.icon} /> {/* Додаємо кнопку для Home */}
      </NavLink>
      <NavLink 
        to="/collections" 
        className={({ isActive }) => (isActive ? styles.activeLink : undefined)}
      >
        <FontAwesomeIcon icon={faCamera} className={styles.icon} />
      </NavLink>
      <NavLink 
        to="/about" 
        className={({ isActive }) => (isActive ? styles.activeLink : undefined)}
      >
        <FontAwesomeIcon icon={faUser} className={styles.icon} />
      </NavLink>
      <NavLink 
        to="/contacts" 
        className={({ isActive }) => (isActive ? styles.activeLink : undefined)}
      >
        <FontAwesomeIcon icon={faPhone} className={styles.icon} />
      </NavLink>
      <NavLink 
        to="/blog" 
        className={({ isActive }) => (isActive ? styles.activeLink : undefined)}
      >
        <FontAwesomeIcon icon={faNewspaper} className={styles.icon} />
      </NavLink>
    </div>
  );
};

export default Navigation;
