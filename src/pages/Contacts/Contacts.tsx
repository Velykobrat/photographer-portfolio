import { useLanguage } from '../../localization';
import ContactForm from '../../components/ContactForm/ContactForm';
import SEO from '../../components/SEO/SEO';
import styles from './Contacts.module.css';

import instagramQr from '../../img/qr_insta.png';

const Contacts = () => {
  const { t, language } = useLanguage();
  return (
    <main className={styles.contact}>

      <SEO
    title="Contact"
    description="Book a portrait, fashion or personal photography session with MK Photography in Kyiv and Ladyzhyn, Ukraine."
    canonicalPath="/contacts"
      />
      
      <header className={styles.intro}>
        <p className={styles.eyebrow}>{t("Get in touch")}</p>

        <h1 className={styles.title}>
          {t("Let's create")}
          <br />{t("something together.")}</h1>

        <p className={styles.description}>
          {language === 'uk' ? (
            <>Для замовлення <strong>портретної, комерційної чи особистої зйомки</strong>, залиште заявку або напишіть мені напряму, щоб узгодити дату.</>
          ) : (
            t("For portrait, fashion and personal photography, send a request or contact me directly.")
          )}
        </p>
      </header>

      <section className={styles.requestSection}>
        <p className={styles.sectionLabel}>{t("Send a request")}</p>

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
          aria-label={t("Open MK Photography on Instagram")}
        >
          <img
            src={instagramQr}
            alt={t("QR code for MK Photography Instagram")}
            className={styles.instagramQr}
          />
        </a>

        <div className={`${styles.detail} ${styles.email}`}>
          <span>{t("Email")}</span>

          <a href="mailto:zongomargaret@gmail.com">
            zongomargaret@gmail.com
          </a>
        </div>

        <div className={`${styles.detail} ${styles.location}`}>
          <span>{t("Based in")}</span>

          <p>{t("Ladyzhyn | Kyiv, Ukraine")}</p>
        </div>
      </section>
    </main>
  );
};

export default Contacts;
