import { useLocation } from 'react-router-dom';
import { basePath } from '../../localization';
import { useLanguage } from '../../localization';
import { LocalizedNavLink as NavLink } from '../../LocalizedLinks';
// src/components/Navigation/Navigation.tsx


import styles from './Navigation.module.css';

const Navigation = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const windowSafePath = () => basePath(location.pathname);
  return (
    <nav className={styles.navigation}>
      <a className={styles.link} href={language === 'uk' ? windowSafePath() : '/uk' + windowSafePath()} hrefLang={language === 'uk' ? 'en' : 'uk'} aria-label={language === 'uk' ? 'Switch to English' : 'Переключити на українську'}>{language === 'uk' ? 'EN' : 'УКР'}</a>
      <NavLink
        to="/collections"
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.active : ''}`
        }
      >{t("Portfolio")}</NavLink>

      <NavLink
        to="/journal"
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.active : ''}`
        }
      >{t("Journal")}</NavLink>

      <NavLink
        to="/contacts"
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.active : ''}`
        }
      >{t("Contact")}</NavLink>
    </nav>
  );
};

export default Navigation;