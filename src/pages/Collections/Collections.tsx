// src/pages/Collections/Collections.tsx
import { useState } from 'react';
import Card from '../../components/Card/Card';
import Modal from '../../components/Modal/Modal';
import styles from './Collections.module.css';

// Імпорт зображень
import Lisa from '../../img/Lisa.jpg';
import Ehor from '../../img/ehor.jpg';
import Vital from '../../img/Vital.jpg';
import Tanya from '../../img/Tanya.jpg';
import Olya from '../../img/Olya.jpg';
import Inna from '../../img/inna.jpg';
import Bob from '../../img/bob.jpg'
import Masha from '../../img/Masha.jpg'
import Nata from '../../img/Nata.jpg'
import Diana from '../../img/Diana.jpg'

const Collections = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

// Використовуємо імпортовані зображення
const photos = [
  { id: 1, image: Lisa, title: 'Photo 1', size: 'rectangle' },
  { id: 2, image: Ehor, title: 'Photo 2', size: 'rectangle' },
  { id: 3, image: Vital, title: 'Photo 3', size: 'rectangle' },
  { id: 4, image: Tanya, title: 'Photo 4', size: 'rectangle' },
  { id: 5, image: Olya, title: 'Photo 5', size: 'rectangle' },
  { id: 6, image: Inna, title: 'Photo 6', size: 'rectangle' },
  { id: 7, image: Bob, title: 'Photo 7', size: 'rectangle' },
  { id: 8, image: Masha, title: 'Photo 8', size: 'rectangle' },
  { id: 9, image: Nata, title: 'Photo 9', size: 'rectangle' },
  { id: 10, image: Diana, title: 'Photo 10', size: 'rectangle' },
];


  const openModal = (image: string) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className={styles.collectionsContainer}>
      {photos.map((photo, index) => (
  <div 
    key={photo.id} 
    className={`${styles.cardWrapper} ${styles[photo.size]}`} 
    onClick={() => openModal(photo.image)}
  >
    <Card 
      image={photo.image} 
      title={photo.title} 
      isSquare={index % 2 === 0} // Якщо індекс парний, картка квадратна
    />
  </div>
))}

      {selectedImage && <Modal image={selectedImage} onClose={closeModal} />}
    </div>
  );
};

export default Collections;
