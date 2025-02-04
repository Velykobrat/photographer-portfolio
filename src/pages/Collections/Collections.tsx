import { useState } from 'react';
import Card from '../../components/Card/Card';
import Modal from '../../components/Modal/Modal';
import styles from './Collections.module.css';

// Імпортуємо зображення
import Bob from '../../img/bob.jpg';
import Diana from '../../img/Diana.jpg';
import Ehor from '../../img/ehor.jpg';
import Inna from '../../img/inna.jpg';
import Lisa from '../../img/Lisa.jpg';
import Masha from '../../img/Masha.jpg';
import Nata from '../../img/Nata.jpg';
import IMG2614 from '../../img/IMG_2614.jpg';
import IMG2637 from '../../img/IMG_2637.jpg';
import IMG2691 from '../../img/IMG_2691.jpg';
import IMG2693 from '../../img/IMG_2693.jpg';
import IMG2698 from '../../img/IMG_2698.jpg';
import IMG4306 from '../../img/IMG_4306.jpg';
import IMG4311 from '../../img/IMG_4311.jpg';
import IMG5026 from '../../img/IMG_5026.jpg';
import IMG5033 from '../../img/IMG_5033.jpg';
import IMG5162 from '../../img/IMG_5162.jpg';
import IMG5165 from '../../img/IMG_5165.jpg';

const staticPhotos: { id: number; image: string; title: string; size: 'rectangle' | 'square' }[] = [
  { id: 1, image: Bob, title: 'Фото 1', size: 'rectangle' },
  { id: 2, image: Diana, title: 'Фото 2', size: 'square' },
  { id: 3, image: Ehor, title: 'Фото 3', size: 'rectangle' },
  { id: 4, image: Inna, title: 'Фото 4', size: 'square' },
  { id: 5, image: Lisa, title: 'Фото 5', size: 'rectangle' },
  { id: 6, image: Masha, title: 'Фото 6', size: 'square' },
  { id: 7, image: Nata, title: 'Фото 7', size: 'rectangle' },
  { id: 8, image: IMG2614, title: 'Фото 8', size: 'square' },
  { id: 9, image: IMG2637, title: 'Фото 9', size: 'rectangle' },
  { id: 10, image: IMG2691, title: 'Фото 10', size: 'square' },
  { id: 11, image: IMG2693, title: 'Фото 11', size: 'rectangle' },
  { id: 12, image: IMG2698, title: 'Фото 12', size: 'square' },
  { id: 13, image: IMG4306, title: 'Фото 13', size: 'rectangle' },
  { id: 14, image: IMG4311, title: 'Фото 14', size: 'square' },
  { id: 15, image: IMG5026, title: 'Фото 15', size: 'rectangle' },
  { id: 16, image: IMG5033, title: 'Фото 16', size: 'square' },
  { id: 17, image: IMG5162, title: 'Фото 17', size: 'rectangle' },
  { id: 18, image: IMG5165, title: 'Фото 18', size: 'square' },
];

const Collections = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (image: string) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className={styles.collectionsContainer}>
      {staticPhotos.map((photo) => (
        <Card 
          key={photo.id} 
          image={photo.image} 
          title={photo.title} 
          size={photo.size} 
          onClick={() => openModal(photo.image)} // Додаємо onClick
        />
      ))}

      {selectedImage && <Modal image={selectedImage} onClose={closeModal} />}
    </div>
  );
};

export default Collections;
