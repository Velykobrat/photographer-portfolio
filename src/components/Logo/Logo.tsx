import { useLanguage } from '../../localization';
import { LocalizedLink as Link } from '../../LocalizedLinks';
// src/components/Logo/Logo.tsx


import styles from './Logo.module.css';

import logoImage from '../../img/logo_2026_vector.svg';

const Logo = () => {
  const { t } = useLanguage();
  return (
    <Link
      to="/home"
      className={styles.logo}
      aria-label={t("Go to homepage")}
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