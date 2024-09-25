import { useForm } from 'react-hook-form';
import styles from './PhoneForm.module.css';

const PhoneForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data: any) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <label htmlFor="phone" style={{ display: 'none' }}>Phone Number:</label>
      <input 
        type="tel" 
        id="phone" 
        {...register('phone', { required: true, pattern: /^[0-9]+$/ })} 
        placeholder="Введіть номер телефону" 
      />
      {errors.phone && <p style={{ color: 'red' }}>Номер телефону обов'язковий і повинен містити лише цифри.</p>}
      <button type="submit">Call me</button>
    </form>
  );
};

export default PhoneForm;
