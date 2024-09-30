// src/pages/Contacts/Contacts.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons';
import styles from './Contacts.module.css';
import Messengers from '../../components/Messengers/Messengers';
import SocialNetworks from '../../components/SocialNetworks/SocialNetworks';
import PhoneForm from '../../components/PhoneForm/PhoneForm'; // Імпортуємо PhoneForm

const Contacts = () => {
  return (
    <div className={styles.contactsContainer}>
      <div className={styles.contactItem}>
        <h3><FontAwesomeIcon icon={faClock} className={styles.icon} /> Feedback</h3>
        <p>10:00 - 18:00</p>
      </div>

      <div className={styles.contactItem}>
        <p><FontAwesomeIcon icon={faMapMarkerAlt} className={styles.icon} /> Kyiv, Ukraine</p>
        <p><FontAwesomeIcon icon={faPhone} className={styles.icon} /> +38 (063) 103-79-94</p>
        <p><FontAwesomeIcon icon={faEnvelope} className={styles.icon} /> zongomargaret@gmail.com</p>
      </div>

      <div className={styles.componentsContainer}>
        <PhoneForm />
        <Messengers />
        <SocialNetworks />
      </div>
    </div>
  );
};

export default Contacts;
