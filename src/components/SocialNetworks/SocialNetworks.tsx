/* src/components/SocialNetworks/SocialNetworks.tsx */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTiktok, faXTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import styles from './SocialNetworks.module.css';

const SocialNetworks = () => {
  return (
    <div className={styles.contactItem}>
      <p>
        <a href="https://www.facebook.com/margaret.zongo" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faFacebook} className={`${styles.icon} ${styles['icon-facebook']}`} />
        </a>
        <a href="https://www.instagram.com/mary_kristel_ph/" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faInstagram} className={`${styles.icon} ${styles['icon-instagram']}`} />
        </a>
        <a href="https://tiktok.com/@username" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTiktok} className={`${styles.icon} ${styles['icon-tiktok']}`} />
        </a>
        <a href="https://twitter.com/username" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faXTwitter} className={`${styles.icon} ${styles['icon-twitter']}`} />
        </a>
        <a href="https://youtube.com/channel/username" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faYoutube} className={`${styles.icon} ${styles['icon-youtube']}`} />
        </a>
      </p>
    </div>
  );
};

export default SocialNetworks;
