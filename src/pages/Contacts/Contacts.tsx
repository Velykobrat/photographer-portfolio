// src/pages/Contacts/Contacts.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons';
import styles from './Contacts.module.css';
import Messengers from '../../components/Messengers/Messengers';
import SocialNetworks from '../../components/SocialNetworks/SocialNetworks';

const Contacts = () => {
  return (
    <div className={styles.contactsContainer}>
      <h2>Контактна інформація</h2>

      <div className={styles.contactItem}>
        <h3><FontAwesomeIcon icon={faClock} className={styles.icon} /> Графік зворотного зв'язку</h3>
        <p>Пн-Пт: 10:00 - 18:00</p>
      </div>

      {/* Об'єднаний блок для Локації, Телефону та Емейлу */}
      <div className={styles.contactItem}>
        <p><FontAwesomeIcon icon={faMapMarkerAlt} className={styles.icon} /> Kyiv, Ukraine</p>
        <p><FontAwesomeIcon icon={faPhone} className={styles.icon} /> +38 (063) 103-79-94</p>
        <p><FontAwesomeIcon icon={faEnvelope} className={styles.icon} /> zongomargaret@gmail.com</p>
      </div>

      {/* Використання нових компонентів */}
      <Messengers />
      <SocialNetworks />
    </div>
  );
};

export default Contacts;
