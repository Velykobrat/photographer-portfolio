// src/components/Footer/Footer.tsx

import styles from './Footer.module.css';
import PhoneForm from '../PhoneForm/PhoneForm';

const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContent}>
        <div className={styles.formContainer}>
          <PhoneForm />
        </div>
      </div>
      <p className={styles.copyright}>© 2024 Photographer's Portfolio</p>
    </footer>
  );
};

export default Footer;
