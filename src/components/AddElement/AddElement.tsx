// src/components/AddElement/AddElement.tsx
import { useState } from 'react';
import styles from './AddElement.module.css';

interface AddElementProps {
  onImageUploaded: (imagePath: string) => void; // Передача шляху до зображення в батьківський компонент
}

const AddElement = ({ onImageUploaded }: AddElementProps) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Обробка зміни файлу
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const selectedFile = e.target.files[0];

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('upload_preset', 'your_upload_preset'); // Використовуємо ваш upload preset
    formData.append('cloud_name', 'dln0hogkt'); // Ваш Cloudinary Cloud Name
    formData.append('api_key', '742714616849782'); // Ваш API Key

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dln0hogkt/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert('Фото успішно додано');
        setUploadedImage(data.secure_url); // Отримуємо URL завантаженого зображення
        onImageUploaded(data.secure_url); // Передаємо URL зображення в батьківський компонент
      } else {
        alert('Помилка при завантаженні фото: ' + data.error.message);
      }
    } catch (err) {
      console.error('Помилка з’єднання:', err);
      alert('Помилка з’єднання');
    }
  }
};


  return (
    <div className={styles.addElementContainer}>
      {/* Приховане поле вибору файлу */}
      <input
        id="fileInput"
        type="file"
        className={styles.fileInput}
        onChange={handleFileChange}
        accept="image/*" // Приймаємо тільки зображення
      />

      {/* Кнопка для вибору файлу */}
      <button
        className={styles.uploadButton}
        onClick={() => document.getElementById('fileInput')?.click()} // Симулюємо натискання на input
      >
        Додати Фото
      </button>

      {/* Показуємо додане зображення */}
      {uploadedImage && <img className={styles.uploadedImage} src={uploadedImage} alt="Added" />}
    </div>
  );
};

export default AddElement;
