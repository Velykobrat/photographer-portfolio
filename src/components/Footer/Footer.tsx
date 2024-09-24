// src/components/Footer/Footer.tsx

import { useForm } from 'react-hook-form';
import styles from './Footer.module.css';

const Footer = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data: any) => console.log(data);

  return (
    <footer className={styles.footerContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="phone">Phone Number:</label>
        <input 
          type="tel" 
          id="phone" 
          {...register('phone', { required: true, pattern: /^[0-9]+$/ })} 
          placeholder="Enter your phone number" 
        />
        {errors.phone && <p>Phone number is required and must be numeric.</p>}
        <button type="submit">Submit</button>
      </form>
      <p className={styles.copyright}>© 2024 Photographer's Portfolio</p>
    </footer>
  );
};

export default Footer;
