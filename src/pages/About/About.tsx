// src/pages/About/About.tsx

import styles from './About.module.css';
import photographerImage from '../../img/Margarert.jpg';


const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <img src={photographerImage} alt="Photographer" className={styles.photographerImage} />
      <div className={styles.aboutText}>
        <h2>Про мене</h2>
        <p>
          Відзначати день фотографа 12 липня було вирішено ще й тому, що в цю дату 1854 року народився Джордж Істман 
          – засновник компанії Kodak, який зробив фотографію доступною всім.
        </p>
        <p>
          <a href="https://radiotrek.rv.ua/news/den_fotografa_253134.html" target="_blank" rel="noopener noreferrer">
            Джерело: Radio Трек
          </a>
        </p>
      </div>
    </div>
  );
};

export default About;
