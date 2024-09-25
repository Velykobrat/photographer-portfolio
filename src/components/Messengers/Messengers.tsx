/* src/components/Messengers/Messengers.tsx */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faViber, faTelegram, faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';
import styles from './Messengers.module.css';

const Messengers = () => {
  return (
    <div className={styles.contactItem}>
      <p>
        <a href="viber://chat?number=+380631037994" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faViber} className={`${styles.icon} ${styles['icon-viber']}`} />
        </a>
        <a href="https://t.me/mary_kristel" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTelegram} className={`${styles.icon} ${styles['icon-telegram']}`} />
        </a>
        <a href="https://m.me/margaret.zongo" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faFacebookMessenger} className={`${styles.icon} ${styles['icon-messenger']}`} />
        </a>
      </p>
    </div>
  );
};

export default Messengers;

