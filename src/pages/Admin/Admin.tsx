import React, { useState } from 'react';
import { useAuth } from '../../components/Context/AuthContext';
import styles from './Admin.module.css';

const Admin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated, login, logout } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        login(); // Оновлюємо контекст
      } else {
        setError(data.message || 'Помилка авторизації');
      }
    } catch (err) {
      setError('Помилка з’єднання');
    }
  };

  return (
    <div className={styles.adminContainer}>
      {!isAuthenticated ? (
        <>
          <h1>Авторизація</h1>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Електронна пошта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Увійти</button>
          </form>
        </>
      ) : (
        <>
          <h1>Вітаємо, ви авторизовані</h1>
          <button className={styles.logoutButton} onClick={logout}>
            Вийти
          </button>
        </>
      )}
    </div>
  );
};

export default Admin;
