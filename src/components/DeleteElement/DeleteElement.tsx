import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Іконка кошика
import styles from './DeleteElement.module.css';

interface DeleteElementProps {
  photoId: string;
  onDelete: () => void;
}

const DeleteElement: React.FC<DeleteElementProps> = ({ photoId, onDelete }) => {
  const handleDelete = async () => {
    try {
      // Валідація формату photoId
      const isValidObjectId = /^[a-fA-F0-9]{24}$/.test(photoId);
      if (!isValidObjectId) {
        console.error('Некоректний формат ID:', photoId); // Лог для некоректного ID
        alert('Некоректний формат ID');
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Не знайдено токен авторизації');
        return;
      }

      console.log('Deleting image with ID:', photoId); // Лог для перевірки photoId

      const response = await fetch(`http://localhost:5000/api/images/delete/${photoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onDelete();
        alert('Фото успішно видалено');
      } else {
        const data = await response.json();
        alert(data.message || 'Помилка при видаленні фото');
      }
    } catch (err) {
      console.error('Помилка з’єднання:', err);
      alert('Помилка з’єднання');
    }
  };

  return (
    <button className={styles.deleteButton} onClick={handleDelete}>
      <FontAwesomeIcon icon={faTrash} size="lg" />
    </button>
  );
};

export default DeleteElement;
