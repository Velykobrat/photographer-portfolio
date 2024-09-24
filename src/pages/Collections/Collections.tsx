// src/pages/Collections/Collections.tsx

import { useState } from 'react';
import Card from '../../components/Card/Card';
import Modal from '../../components/Modal/Modal';
import styles from './Collections.module.css';

const Collections = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const photos = [
    { id: 1, image: 'path_to_image1.jpg', title: 'Photo 1' },
    { id: 2, image: 'path_to_image2.jpg', title: 'Photo 2' },
    { id: 3, image: 'path_to_image3.jpg', title: 'Photo 3' },
    { id: 4, image: 'path_to_image4.jpg', title: 'Photo 4' },
    { id: 5, image: 'path_to_image5.jpg', title: 'Photo 5' },
    { id: 6, image: 'path_to_image6.jpg', title: 'Photo 6' },
  ];

  const openModal = (image: string) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <div className={styles.collectionsContainer}>
        {photos.map((photo, index) => (
          <div key={photo.id} onClick={() => openModal(photo.image)}>
            <Card 
              image={photo.image} 
              title={photo.title} 
              isSquare={index % 2 === 0} // Якщо індекс парний, картка квадратна
            />
          </div>
        ))}
      </div>

      {selectedImage && <Modal image={selectedImage} onClose={closeModal} />}
    </div>
  );
};

export default Collections;
