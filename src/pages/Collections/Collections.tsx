// src/pages/Collections/Collections.tsx
import { useState, useEffect } from 'react';
import Card from '../../components/Card/Card';
import Modal from '../../components/Modal/Modal';
import styles from './Collections.module.css';

const Collections = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [photos, setPhotos] = useState<any[]>([]);

  // Завантажуємо фото з API
  useEffect(() => {
  const fetchPhotos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/images/collection');
      const data = await response.json();
      console.log('Fetched Photos:', data); // Перевірка отриманих даних
      setPhotos(data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  fetchPhotos();
}, []);


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
          key={photo.id || index}  // Використання index, якщо id немає
          className={`${styles.cardWrapper} ${styles[photo.size]}`}
          onClick={() => openModal(photo.image)}
        >
          <Card
            image={photo.filePath}  // Вказуємо правильний шлях до фото
            title={photo.title}
            size={photo.size}
          />
        </div>
      ))}

      {selectedImage && <Modal image={selectedImage} onClose={closeModal} />}
    </div>
  );
};

export default Collections;
