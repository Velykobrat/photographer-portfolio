import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';

import { DayPicker } from '@daypicker/react';
import '@daypicker/react/style.css';

import styles from './ContactForm.module.css';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

const shootTypes = [
  'Portrait',
  'Fashion',
  'Personal',
  'Commercial',
  'Other',
];

const formatDateForApi = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const formatDateForDisplay = (date: Date) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);

const ContactForm = () => {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [shootType, setShootType] = useState('');
  const [preferredDate, setPreferredDate] =
    useState<Date | undefined>();

  const [calendarOpen, setCalendarOpen] = useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setCalendarOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );

      document.removeEventListener(
        'keydown',
        handleEscape
      );
    };
  }, []);

  const resetStatus = () => {
    if (status === 'error' || status === 'success') {
      setStatus('idle');
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!shootType) {
      setStatus('error');
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: String(formData.get('name') || '').trim(),
      
      contact: String(
        formData.get('contact') || ''
      ).trim(),

      shootType,

      preferredDate: preferredDate
        ? formatDateForApi(preferredDate)
        : '',

      location: String(
        formData.get('location') || ''
      ).trim(),

      message: String(
        formData.get('message') || ''
      ).trim(),

      consent: formData.get('consent') === 'on',
      
      // Honeypot для ботів
      website: String(
        formData.get('website') || ''
      ),
    };

    try {
      setStatus('sending');

      const response = await fetch('/api/contact', {
  method: 'POST',

  headers: {
    'Content-Type': 'application/json',
  },

  body: JSON.stringify(data),
});

const result = await response
  .json()
  .catch(() => null);

console.log('Contact API response:', {
  status: response.status,
  result,
});

if (!response.ok) {
  throw new Error(
    result?.error ||
      `Request failed with status ${response.status}`
  );
}

      form.reset();

      setShootType('');
      setPreferredDate(undefined);
      setCalendarOpen(false);

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
      onChange={resetStatus}
    >
      {/* NAME */}

      <div className={styles.field}>
        <label htmlFor="name">
          Your name <span>*</span>
        </label>

        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Anna"
          required
        />
      </div>

      {/* CONTACT */}

      <div className={styles.field}>
        <label htmlFor="contact">
          How can I contact you? <span>*</span>
        </label>

        <input
          id="contact"
          name="contact"
          type="text"
          placeholder="@telegram / +380... / email"
          required
        />

        <p className={styles.hint}>
          Telegram, phone number or email
        </p>
      </div>

      {/* TYPE OF SHOOT */}

      <fieldset className={styles.shootTypeField}>
        <legend>
          Type of shoot <span>*</span>
        </legend>

        <div className={styles.shootTypes}>
          {shootTypes.map((type) => (
            <button
              key={type}
              type="button"
              className={`${styles.shootTypeButton} ${
                shootType === type
                  ? styles.selected
                  : ''
              }`}
              aria-pressed={shootType === type}
              onClick={() => {
                setShootType(type);
                resetStatus();
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </fieldset>

      {/* DATE + LOCATION */}

      <div className={styles.row}>
        <div className={styles.field}>
          <label>
            Preferred date
          </label>

          <div
            className={styles.datePicker}
            ref={calendarRef}
          >
            <button
              type="button"
              className={`${styles.dateButton} ${
                preferredDate
                  ? styles.dateSelected
                  : ''
              }`}
              onClick={() =>
                setCalendarOpen((open) => !open)
              }
            >
              <span>
                {preferredDate
                  ? formatDateForDisplay(
                      preferredDate
                    )
                  : 'Choose a date'}
              </span>

              <span
                className={styles.calendarIcon}
                aria-hidden="true"
              >
                ↗
              </span>
            </button>

            {calendarOpen && (
              <div className={styles.calendar}>
                <DayPicker
                  mode="single"
                  selected={preferredDate}
                  disabled={{
                    before: today,
                  }}
                  onSelect={(date) => {
                    if (!date) {
                      return;
                    }

                    setPreferredDate(date);
                    setCalendarOpen(false);
                    resetStatus();
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="location">
            Location
          </label>

          <input
            id="location"
            name="location"
            type="text"
            placeholder="Kyiv"
          />
        </div>
      </div>

      {/* MESSAGE */}

      <div className={styles.field}>
        <label htmlFor="message">
          Tell me about your idea
        </label>

        <textarea
          id="message"
          name="message"
          rows={5}
          maxLength={3000}
          placeholder="A few words about the shoot..."
        />
      </div>

      {/* CONSENT */}

      <label className={styles.consent}>
        <input
  type="checkbox"
  name="consent"
  required
/>
        <span>
          I agree to be contacted regarding this request.
        </span>
      </label>

      {/* HONEYPOT */}

      <div
        className={styles.honeypot}
        aria-hidden="true"
      >
        <label htmlFor="website">
          Website
        </label>

        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* SUBMIT */}

      <button
        type="submit"
        className={styles.submit}
        disabled={status === 'sending'}
      >
        {status === 'sending'
          ? 'Sending...'
          : 'Send request'}
      </button>

      {/* STATUS */}

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
            Please complete all required fields and try again.
          </p>
        )}
      </div>
    </form>
  );
};

export default ContactForm;