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

const Collections = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Використовуємо імпортовані зображення
  const photos = [
    { id: 1, image: Lisa, title: 'Photo 1', size: 'square' },
    { id: 2, image: Ehor, title: 'Photo 2', size: 'rectangle' },
    { id: 3, image: Vital, title: 'Photo 3', size: 'rectangle' },
    { id: 4, image: Tanya, title: 'Photo 4', size: 'square' },
    { id: 5, image: Olya, title: 'Photo 5', size: 'rectangle' },
    { id: 6, image: Inna, title: 'Photo 6', size: 'rectangle' },
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
