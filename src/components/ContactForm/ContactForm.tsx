import { FormEvent, useState } from 'react';

import styles from './ContactForm.module.css';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

const ContactForm = () => {
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: String(formData.get('name') || '').trim(),
      contact: String(formData.get('contact') || '').trim(),
      message: String(formData.get('message') || '').trim(),

      // Honeypot для простих спам-ботів
      website: String(formData.get('website') || ''),
    };

    if (!data.name || !data.contact) {
      setStatus('error');
      return;
    }

    try {
      setStatus('sending');

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      form.reset();
      setStatus('success');
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
    >
      <div className={styles.field}>
        <label htmlFor="name">Your name</label>

        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Name"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="contact">
          Phone, Telegram or email
        </label>

        <input
          id="contact"
          name="contact"
          type="text"
          autoComplete="email"
          placeholder="+380... / @username / email"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="message">
          Tell me about your idea
        </label>

        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="A few words about the shoot..."
        />
      </div>

      <div
        className={styles.honeypot}
        aria-hidden="true"
      >
        <label htmlFor="website">Website</label>

        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        className={styles.submit}
        disabled={status === 'sending'}
      >
        {status === 'sending' ? 'Sending...' : 'Send request'}
      </button>

      <div
        className={styles.status}
        aria-live="polite"
      >
        {status === 'success' && (
          <p className={styles.success}>
            Thank you. Your request has been sent.
          </p>
        )}

        {status === 'error' && (
          <p className={styles.error}>
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </form>
  );
};

export default ContactForm;