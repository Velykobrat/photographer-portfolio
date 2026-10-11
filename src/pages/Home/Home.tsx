import { useLanguage } from '../../localization';
import { LocalizedLink as Link } from '../../LocalizedLinks';


import SEO from '../../components/SEO/SEO';

import {
  getCloudinaryImage,
  getCloudinarySrcSet,
} from '../../utils/cloudinary';

import logoImage from '../../img/logo_2026_vector.svg';

import styles from './Home.module.css';

const heroPublicId = '14_tbvntx';

const heroImage = getCloudinaryImage(
  heroPublicId,
  2200
);

const heroSrcSet = getCloudinarySrcSet(
  heroPublicId,
  [
    640,
    960,
    1280,
    1600,
    2200,
  ]
);

const Home = () => {
  const { t } = useLanguage();
  return (
    <main className={styles.home}>
      <SEO
        title="Portrait & Fashion Photography"
        description="Portrait, fashion and personal photography by MK Photography. View selected work and book a photo shoot."
        canonicalPath="/home"
      />

      <img
        src={heroImage}
        srcSet={heroSrcSet}
        sizes="100vw"
        alt={t("Portrait photography")}
        className={styles.heroImage}
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />

      <div className={styles.overlay} />

      <section className={styles.content}>
        <h1 className={styles.visuallyHidden}>{t('Portrait & fashion photographer in Kyiv')}</h1>
        <img
          src={logoImage}
          alt={t("Photographer logo")}
          className={styles.logo}
        />

        <p className={styles.subtitle}>{t("PHOTOGRAPHY · PORTRAIT · FASHION")}</p>

        <div className={styles.actions}>
          <Link
            to="/collections"
            className={styles.primaryLink}
          >{t("View portfolio")}</Link>

          <Link
            to="/contacts"
            className={styles.secondaryLink}
          >{t("Book a shoot")}</Link>
        </div>
      </section>

      <div className={styles.scrollHint}>
        <span>{t("SCROLL")}</span>
        <div className={styles.scrollLine} />
      </div>
    </main>
  );
};

export default Home;
