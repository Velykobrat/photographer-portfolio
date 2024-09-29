// src/pages/About/About.tsx

import styles from './About.module.css';
import photographerImage from '../../img/Margarert.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <img src={photographerImage} alt="Photographer" className={styles.photographerImage} />
      <div className={styles.aboutText}>
        <h2>Margaret Mari-Kristel</h2>
        <p>
          Мене звати Маргарет, я професійний фотограф та діюча модель з понад 10-річним досвідом у моделінгу. За останні два роки я повністю віддалася своїй пристрасті до фотографії, поєднуючи досвід здобутий в моді, з мистецтвом фотографії. У своїх роботах я завжди прагну відобразити не лише зовнішню красу, а й емоції, індивідуальність та глибину кожної людини перед об'єктивом.
        </p>
                <p>
          <a href="https://www.instagram.com/mary_kristel/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} className={styles.instagramIcon} /> @mary_kristel
          </a>
        </p>
        <p>
          My name is Margaret, I am a professional photographer and active model with over 10 years modeling experience. Over the past two years, I have fully devoted myself to my passion for photography, combining my experience in fashion with the art of photography. In my works, I always strive to reflect not only the external beauty, but also the emotions, individuality and depth of each person in front of the lens.
        </p>
      </div>
    </div>
  );
};

export default About;
