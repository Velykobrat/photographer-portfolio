// src/pages/Contacts/Contacts.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons';
import { faFacebookMessenger, faFacebook, faInstagram, faTiktok, faTelegram, faViber, faXTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import styles from './Contacts.module.css';

const Contacts = () => {
  return (
    <div className={styles.contactsContainer}>
      <h2>Контактна інформація</h2>

      {/* Об'єднаний блок для Локації, Телефону та Емейлу */}
      <div className={styles.contactItem}>
        <p><FontAwesomeIcon icon={faMapMarkerAlt} className={styles.icon} /> Kyiv, Ukraine</p>
        <p><FontAwesomeIcon icon={faPhone} className={styles.icon} /> +38 (063) 103-79-94</p>
        <p><FontAwesomeIcon icon={faEnvelope} className={styles.icon} /> zongomargaret@gmail.com</p>
      </div>

      {/* Блок для Месенджерів з доданим Facebook Messenger */}
      <div className={styles.contactItem}>
        <h3><FontAwesomeIcon icon={faViber} className={styles.icon} /> Месенджери</h3>
        <p>
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faViber} className={styles.icon} /> Viber
          </a>, 
          <a href="https://t.me/username" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTelegram} className={styles.icon} /> Telegram
          </a>, 
          <a href="https://m.me/username" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebookMessenger} className={styles.icon} /> Messenger
          </a>
        </p>
      </div>

      {/* Блок для Соціальних мереж з доданими X та YouTube */}
      <div className={styles.contactItem}>
        <h3><FontAwesomeIcon icon={faFacebook} className={styles.icon} /> Соціальні мережі</h3>
        <p>
          <a href="https://facebook.com/username" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} className={styles.icon} /> Facebook
          </a>, 
          <a href="https://www.instagram.com/mary_kristel_ph/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} className={styles.icon} /> Instagram
          </a>, 
          <a href="https://tiktok.com/@username" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTiktok} className={styles.icon} /> TikTok
          </a>, 
          <a href="https://twitter.com/username" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faXTwitter} className={styles.icon} /> X (Twitter)
          </a>, 
          <a href="https://youtube.com/channel/username" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faYoutube} className={styles.icon} /> YouTube
          </a>
        </p>
      </div>

      <div className={styles.contactItem}>
        <h3><FontAwesomeIcon icon={faClock} className={styles.icon} /> Графік зворотного зв'язку</h3>
        <p>Пн-Пт: 10:00 - 18:00</p>
      </div>
    </div>
  );
};

export default Contacts;
