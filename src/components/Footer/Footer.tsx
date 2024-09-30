// src/components/Footer/Footer.tsx

import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContent}>
        {/* PhoneForm більше тут не використовується */}
      </div>
      <p className={styles.copyright}>© 2024 Photographer's Portfolio</p>
    </footer>
  );
};

export default Footer;

