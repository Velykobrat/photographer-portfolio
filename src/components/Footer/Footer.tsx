// src/components/Footer/Footer.tsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Функція для оновлення стану авторизації
  const updateAuthStatus = () => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token); // Оновлюємо стан авторизації
  };

  // Використовуємо useEffect, щоб перевіряти авторизацію при монтуванні
  useEffect(() => {
    updateAuthStatus(); // Оновлюємо статус при монтуванні

    // Спостереження за зміною в localStorage
    const handleStorageChange = () => updateAuthStatus();
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Порожній масив, отже, ефект спрацює тільки при першому рендері

  // Функція для логіну
  const handleLogin = () => {
    localStorage.setItem('authToken', 'yourToken'); // Замість цього має бути реальний токен
    updateAuthStatus(); // Оновлюємо статус авторизації
  };

  // Функція для логауту
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    updateAuthStatus(); // Оновлюємо статус авторизації
  };

  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContent}>
        <p className={styles.copyright}>© 2024 Photographer's Portfolio</p>
        <Link to="/admin" className={styles.indicatorWrapper}>
          <div className={`${styles.lightBulb} ${isAuthenticated ? styles.active : ''}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isAuthenticated ? '#FFD700' : '#808080'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.icon}
            >
              <path d="M12 2C9.243 2 7 4.243 7 7c0 2.642 1.383 4.92 3.385 6.031-.186.781-.385 1.65-.385 2.469 0 2.761 2.239 5 5 5s5-2.239 5-5c0-.819-.199-1.688-.385-2.469C15.617 11.92 17 9.642 17 7c0-2.757-2.243-5-5-5zm0 12c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Кнопки для тестування */}
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
    </footer>
  );
};

export default Footer;

