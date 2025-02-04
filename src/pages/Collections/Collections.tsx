import { useState } from 'react';
import Card from '../../components/Card/Card';
import Modal from '../../components/Modal/Modal';
import styles from './Collections.module.css';

const staticPhotos: { id: number; image: string; title: string; size: 'rectangle' | 'square' }[] = [
  { id: 1, image: './src/img/bob.jpg', title: 'Фото 1', size: 'rectangle' },
  { id: 2, image: './src/img/Diana.jpg', title: 'Фото 2', size: 'square' },
  { id: 3, image: './src/img/ehor.jpg', title: 'Фото 3', size: 'rectangle' },
  { id: 4, image: './src/img/inna.jpg', title: 'Фото 4', size: 'square' },
  { id: 5, image: './src/img/Lisa.jpg', title: 'Фото 5', size: 'rectangle' },
  { id: 6, image: './src/img/Masha.jpg', title: 'Фото 6', size: 'square' },
  { id: 7, image: './src/img/Nata.jpg', title: 'Фото 7', size: 'rectangle' },
  { id: 8, image: './src/img/IMG_2614.jpg', title: 'Фото 8', size: 'square' },
  { id: 9, image: './src/img/IMG_2637.jpg', title: 'Фото 9', size: 'rectangle' },
  { id: 10, image: './src/img/IMG_2691.jpg', title: 'Фото 10', size: 'square' },
  { id: 11, image: './src/img/IMG_2693.jpg', title: 'Фото 11', size: 'rectangle' },
  { id: 12, image: './src/img/IMG_2698.jpg', title: 'Фото 12', size: 'square' },
  { id: 13, image: './src/img/IMG_4306.jpg', title: 'Фото 13', size: 'rectangle' },
  { id: 14, image: './src/img/IMG_4311.jpg', title: 'Фото 14', size: 'square' },
  { id: 15, image: './src/img/IMG_5026.jpg', title: 'Фото 15', size: 'rectangle' },
  { id: 16, image: './src/img/IMG_5033.jpg', title: 'Фото 16', size: 'square' },
  { id: 17, image: './src/img/IMG_5162.jpg', title: 'Фото 17', size: 'rectangle' },
  { id: 18, image: './src/img//IMG_5165.jpg', title: 'Фото 18', size: 'square' },
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
