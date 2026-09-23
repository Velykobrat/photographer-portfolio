// src/components/Footer/Footer.tsx

import styles from './Footer.module.css';
import developerLogo from '../../img/developer-logo.svg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copyright}>
          © {currentYear} MK PHOTOGRAPHY
        </p>

        <a
          href="#"
          className={styles.developer}
          aria-label="Website developed by BeBetter"
        >
          <span>Designed & developed by</span>

          <img
            src={developerLogo}
            alt="BeBetter"
            className={styles.developerLogo}
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;