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
  const [errorMessage, setErrorMessage] = useState('');

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
      setErrorMessage('');
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!shootType) {
      setErrorMessage('Please choose a type of shoot.');
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

      website: String(
        formData.get('website') || ''
      ),
    };

    try {
      setStatus('sending');
      setErrorMessage('');

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
      setErrorMessage('');
      setStatus('success');
    } catch (error) {
      console.error('Contact form error:', error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );

      setStatus('error');
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      onChange={resetStatus}
    >
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
                  ? formatDateForDisplay(preferredDate)
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

      <button
        type="submit"
        className={styles.submit}
        disabled={status === 'sending'}
      >
        {status === 'sending'
          ? 'Sending...'
          : 'Send request'}
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
            {errorMessage ||
              'Something went wrong. Please try again.'}
          </p>
        )}
      </div>
    </form>
  );
};

export default ContactForm;