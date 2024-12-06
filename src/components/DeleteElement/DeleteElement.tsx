import React from 'react';
import styles from './DeleteElement.module.css';

interface DeleteElementProps {
  photoId: string;
  onDelete: () => void;
}

const DeleteElement: React.FC<DeleteElementProps> = ({ photoId, onDelete }) => {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        alert('Не знайдено токен авторизації');
        return;
      }

      // Логування для перевірки photoId
      console.log('Deleting photo with ID:', photoId);

      if (!photoId) {
        alert('Невідомий ID фото');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/images/delete/${photoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onDelete(); // Викликаємо onDelete для оновлення колекції
        alert('Фото успішно видалено');
      } else {
        const data = await response.json();
        console.error('Error:', data.message || 'Помилка при видаленні фото');
        alert(data.message || 'Помилка при видаленні фото');
      }
    } catch (err) {
      console.error('Помилка з’єднання:', err);
      alert('Помилка з’єднання');
    }
  };

  return (
    <button className={styles.deleteButton} onClick={handleDelete}>
      &#10006; {/* Символ для хрестика */}
    </button>
  );
};

export default DeleteElement;
