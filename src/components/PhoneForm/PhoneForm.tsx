// src/components/PhoneForm/PhoneForm.tsx

import { useForm, SubmitHandler } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Імпорт стилів
import styles from './PhoneForm.module.css'; // Імпорт стилів з модуля CSS
import { useEffect } from 'react';

// Визначте інтерфейс для вашої форми
interface PhoneFormInputs {
  phone: string;
}

const PhoneForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<PhoneFormInputs>();

  const onSubmit: SubmitHandler<PhoneFormInputs> = (data) => {
    const phone = formatPhoneNumber(data.phone);
    // Якщо номер телефону пройшов валідацію
    toast.success("Номер телефону надіслано успішно!"); // Повідомлення про успіх
    console.log({ phone });
  };

  const formatPhoneNumber = (input: string) => {
    const cleaned = ('' + input).replace(/\D/g, '');
    // Ваша логіка форматування номера
    return cleaned;
  };

  // Виклик тосту при зміні помилок
  useEffect(() => {
    if (errors.phone) {
      toast.error(errors.phone.message);
    }
  }, [errors]); // Запустити при зміні помилок

  return (
    <>
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className={styles.formContainer}
      >
        <div className={styles.inputGroup}>
          <input 
            type="tel" 
            id="phone" 
            {...register('phone', { 
              required: true, 
              pattern: {
                value: /^[+]?380\d{9}|^0\d{9}|^80\d{9}|^38\d{9}$/,
                message: "Номер телефону обов'язковий і має бути у форматі: +380XXXXXXXXX, 0XXXXXXXXX або 80XXXXXXXXX."
              }
            })} 
            placeholder="+38 (XXX) XXXXXXX" 
            className={`${styles.inputField} ${errors.phone ? styles.errorInput : ''}`}
          />
          
          <button type="submit" className={styles.submitButton}>Call Me</button>
        </div>
      </form>
      <ToastContainer /> {/* Додайте компонент для тостів */}
    </>
  );
};

export default PhoneForm;
