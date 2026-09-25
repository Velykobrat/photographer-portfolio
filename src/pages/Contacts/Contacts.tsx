import ContactForm from '../../components/ContactForm/ContactForm';
import styles from './Contacts.module.css';

import instagramQr from '../../img/qr_insta.png';

const Contacts = () => {
  return (
    <main className={styles.contact}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>
          Get in touch
        </p>

        <h1 className={styles.title}>
          Let's create
          <br />
          something together.
        </h1>

        <p className={styles.description}>
          For portrait, fashion and personal photography,
          send a request or contact me directly.
        </p>
      </header>

      <section className={styles.requestSection}>
        <p className={styles.sectionLabel}>
          Send a request
        </p>

        <ContactForm />
      </section>

      <section className={styles.contactDetails}>
        <div className={styles.socialLinks}>
          <a
            href="https://www.instagram.com/mary_kristel_ph/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>

          <a
            href="https://t.me/mary_kristel"
            target="_blank"
            rel="noreferrer"
          >
            Telegram
          </a>

          <a
            href="viber://chat?number=+380631037994"
          >
            Viber
          </a>
        </div>

        <a
          href="https://www.instagram.com/mary_kristel_ph/"
          target="_blank"
          rel="noreferrer"
          className={styles.instagramQrLink}
          aria-label="Open MK Photography on Instagram"
        >
          <img
            src={instagramQr}
            alt="QR code for MK Photography Instagram"
            className={styles.instagramQr}
          />
        </a>

        <div className={`${styles.detail} ${styles.email}`}>
          <span>Email</span>

          <a href="mailto:zongomargaret@gmail.com">
            zongomargaret@gmail.com
          </a>
        </div>

        <div className={`${styles.detail} ${styles.location}`}>
          <span>Based in</span>

          <p>
            Ladyzhyn | Kyiv, Ukraine
          </p>
        </div>
      </section>
    </main>
  );
};

export default Contacts;