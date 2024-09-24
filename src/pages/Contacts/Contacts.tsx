// src/pages/Contacts/Contacts.tsx
import styles from './Contacts.module.css';

const Contacts = () => {
  return (
    <div className={styles.contactsContainer}>
      <h2>Контактна інформація</h2>
      <div className={styles.contactItem}>
        <h3>Локація</h3>
        <p>Місто, Країна</p>
      </div>
      <div className={styles.contactItem}>
        <h3>Телефон</h3>
        <p>+38 (012) 345-67-89</p>
      </div>
      <div className={styles.contactItem}>
        <h3>Емейл</h3>
        <p>example@email.com</p>
      </div>
      <div className={styles.contactItem}>
        <h3>Месенджери</h3>
        <p>
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">Viber</a>,
          <a href="https://t.me/username" target="_blank" rel="noopener noreferrer"> Telegram</a>
        </p>
      </div>
      <div className={styles.contactItem}>
        <h3>Соціальні мережі</h3>
        <p>
          <a href="https://facebook.com/username" target="_blank" rel="noopener noreferrer">Facebook</a>,
          <a href="https://instagram.com/username" target="_blank" rel="noopener noreferrer">Instagram</a>,
          <a href="https://tiktok.com/@username" target="_blank" rel="noopener noreferrer">TikTok</a>
        </p>
      </div>
      <div className={styles.contactItem}>
        <h3>Графік зворотного зв'язку</h3>
        <p>Пн-Пт: 10:00 - 18:00</p>
      </div>
    </div>
  );
};

export default Contacts;
