import { useLanguage } from '../../localization';
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import { uk, enGB } from "@daypicker/react/locale";
import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";

import styles from "./ContactForm.module.css";
import { contactLimits, shootTypes } from "../../../shared/contact";

type FormStatus = "idle" | "sending" | "success" | "error";

const formatDateForApi = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDateForDisplay = (date: Date, language: string) =>
  new Intl.DateTimeFormat(language === "uk" ? "uk-UA" : "en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);

const ContactForm = () => {
  const { t, language } = useLanguage();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [shootType, setShootType] = useState("");

  const [preferredDate, setPreferredDate] = useState<Date | undefined>();

  const [calendarOpen, setCalendarOpen] = useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false);

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
      if (event.key === "Escape") {
        setCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);

      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const resetStatus = () => {
    if (status === "error" || status === "success") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sendingRef.current) return;

    if (!shootType) {
      setErrorMessage("Please choose a type of shoot.");
      setStatus("error");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: String(formData.get("name") || "").trim(),

      contact: String(formData.get("contact") || "").trim(),

      shootType,

      preferredDate: preferredDate ? formatDateForApi(preferredDate) : "",

      location: String(formData.get("location") || "").trim(),

      message: String(formData.get("message") || "").trim(),

      consent: formData.get("consent") === "on",

      website: String(formData.get("website") || ""),
    };

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    sendingRef.current = true;
    try {
      setStatus("sending");
      setErrorMessage("");

      const response = await fetch("/api/contact", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
        signal: controller.signal,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Your request could not be sent. Please try again or contact me directly.",
        );
      }
      if (result?.success !== true) {
        throw new Error(
          "We could not confirm your request. Please contact me directly.",
        );
      }

      form.reset();

      setShootType("");
      setPreferredDate(undefined);
      setCalendarOpen(false);
      setErrorMessage("");
      setStatus("success");
    } catch (error) {
      setErrorMessage(
        controller.signal.aborted
          ? "We could not confirm your request in time. Please contact me directly before trying again."
          : error instanceof TypeError
            ? "Your request could not be sent. Please check your connection or contact me directly."
            : error instanceof Error
              ? error.message
              : "Something went wrong. Please try again.",
      );

      setStatus("error");
    } finally {
      window.clearTimeout(timeout);
      sendingRef.current = false;
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      onChange={resetStatus}
      aria-busy={status === "sending"}
    >
      <fieldset className={styles.fields} disabled={status === "sending"}>
        <div className={styles.field}>
          <label htmlFor="name">{t("Your name")}<span>*</span>
          </label>

          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={contactLimits.name}
            placeholder={t("Anna")}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="contact">{t("How can I contact you?")}<span>*</span>
          </label>

          <input
            id="contact"
            name="contact"
            type="text"
            placeholder={t("Phone, Telegram or email")}
            maxLength={contactLimits.contact}
            required
          />
        </div>

        <fieldset className={styles.shootTypeField}>
          <legend>{t("Type of shoot")}<span>*</span>
          </legend>

          <div className={styles.shootTypes}>
            {shootTypes.map((type) => (
              <button
                key={type}
                type="button"
                className={`${styles.shootTypeButton} ${
                  shootType === type ? styles.selected : ""
                }`}
                aria-pressed={shootType === type}
                onClick={() => {
                  setShootType(type);
                  resetStatus();
                }}
              >
                {t(type)}
              </button>
            ))}
          </div>
        </fieldset>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="preferred-date">{t("Preferred date")}</label>

            <div className={styles.datePicker} ref={calendarRef}>
              <button
                type="button"
                id="preferred-date"
                aria-expanded={calendarOpen}
                aria-controls={
                  calendarOpen ? "preferred-date-calendar" : undefined
                }
                className={`${styles.dateButton} ${
                  preferredDate ? styles.dateSelected : ""
                }`}
                onClick={() => setCalendarOpen((open) => !open)}
              >
                <span>
                  {preferredDate
                    ? formatDateForDisplay(preferredDate, language)
                    : t("Choose a date")}
                </span>

                <span className={styles.calendarIcon} aria-hidden="true">
                  ↗
                </span>
              </button>

              {calendarOpen && (
                <div id="preferred-date-calendar" className={styles.calendar}>
                  <DayPicker
                    locale={language === "uk" ? uk : enGB}
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
            <label htmlFor="location">{t("Location")}</label>

            <input
              id="location"
              name="location"
              type="text"
              placeholder={t("Kyiv")}
              maxLength={contactLimits.location}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="message">{t("Tell me about your idea")}</label>

          <textarea
            id="message"
            name="message"
            rows={3}
            maxLength={contactLimits.message}
            placeholder={t("A few words about the shoot...")}
          />
        </div>

        <label className={styles.consent}>
          <input type="checkbox" name="consent" required />

          <span>{t("I agree to be contacted regarding this request.")}</span>
        </label>

        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="website">Website</label>

          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
      </fieldset>

      <button
        type="submit"
        className={styles.submit}
        disabled={status === "sending"}
      >
        {status === "sending" ? t("Sending...") : t("Send request")}
      </button>

      <div className={styles.status} aria-live="polite">
        {status === "success" && (
          <p className={styles.success}>{t("Thank you. Your request has been sent.")}</p>
        )}

        {status === "error" && (
          <p className={styles.error}>
            {t(errorMessage || "Something went wrong. Please try again.")}
          </p>
        )}
      </div>
    </form>
  );
};

export default ContactForm;
