import { useLanguage } from '../../localization';
import { LocalizedLink as Link } from '../../LocalizedLinks';

import SEO from "../../components/SEO/SEO";
import styles from "./NotFound.module.css";

const NotFound = () => {
  const { t } = useLanguage();
  return (
  <main className={styles.page}>
    <SEO
      title="Page not found"
      description="The requested page could not be found."
      noIndex
    />
    <p>404</p>
    <h1>{t("Page not found")}</h1>
    <p>{t("This page may have moved, or the link is incorrect.")}</p>
    <Link to="/collections">{t("Explore the portfolio →")}</Link>
  </main>
);
};

export default NotFound;
