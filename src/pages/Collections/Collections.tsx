// src/pages/Collections/Collections.tsx
import { useState, useEffect } from 'react';
import Card from '../../components/Card/Card';
import Modal from '../../components/Modal/Modal';
import AddElement from '../../components/AddElement/AddElement';
import DeleteElement from '../../components/DeleteElement/DeleteElement';
import styles from './Collections.module.css';

const Collections = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Перевірка, чи користувач авторизований
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  // Завантажуємо фото з API
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/images/collection');
        const data = await response.json();
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

  // Функція для оновлення списку фото після видалення
  const handleDelete = (photoId: string) => {
    setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.id !== photoId));
  };

  // Функція для додавання нового фото в колекцію
  const handleImageUpload = (imagePath: string) => {
    setPhotos((prevPhotos) => [...prevPhotos, { filePath: imagePath, id: Date.now(), title: 'New Photo' }]);
  };

  return (
    <div className={styles.collectionsContainer}>
      {/* Кнопка додавання елементів рендериться першою перед усіма картинками */}
      {isAuthenticated && (
        <div className={styles.addElementContainer}>
          <AddElement onImageUploaded={handleImageUpload} />
        </div>
      )}

      {/* Відображення картинок */}
      {photos.map((photo, index) => (
  <div
    key={photo.id || index} // Використовуємо index, якщо немає id
    className={`${styles.cardWrapper} ${styles[photo.size]}`}
    onClick={() => openModal(photo.image)}
  >
    <Card
      image={photo.filePath}
      title={photo.title}
      size={photo.size}
    />
    {/* Кнопка для видалення, якщо користувач авторизований */}
    {isAuthenticated && (
      <DeleteElement photoId={photo.id} onDelete={() => handleDelete(photo.id)} />
    )}
  </div>
))}


      {selectedImage && <Modal image={selectedImage} onClose={closeModal} />}
    </div>
  );
};

export default Collections;
