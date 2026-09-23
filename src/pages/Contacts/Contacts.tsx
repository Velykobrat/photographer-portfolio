import ContactForm from '../../components/ContactForm/ContactForm';

import styles from './Contacts.module.css';

const Contacts = () => {
  return (
    <main className={styles.contact}>
      <section className={styles.intro}>
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
      </section>

      <section className={styles.content}>
        <div className={styles.details}>
          <div className={styles.detail}>
            <span>Based in</span>
            <p>Kyiv, Ukraine</p>
          </div>

          <div className={styles.detail}>
            <span>Phone</span>

            <a href="tel:+380631037994">
              +38 063 103 79 94
            </a>
          </div>

          <div className={styles.detail}>
            <span>Email</span>

            <a href="mailto:zongomargaret@gmail.com">
              zongomargaret@gmail.com
            </a>
          </div>

          <div className={styles.detail}>
            <span>Available</span>
            <p>10:00 — 18:00</p>
          </div>

          <div className={styles.messengers}>
            <a
              href="https://t.me/mary_kristel"
              target="_blank"
              rel="noreferrer"
            >
              Telegram
            </a>

            <a
              href="viber://chat?number=+380631037994"
              target="_blank"
              rel="noreferrer"
            >
              Viber
            </a>

            <a
              href="https://m.me/margaret.zongo"
              target="_blank"
              rel="noreferrer"
            >
              Messenger
            </a>
          </div>
        </div>

        <div className={styles.formColumn}>
          <p className={styles.formTitle}>
            Send a request
          </p>

          <ContactForm />
        </div>
      </section>
    </main>
  );
};

export default Contacts;