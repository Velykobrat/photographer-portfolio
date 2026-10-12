export const SERIES_SLUG_MAX_LENGTH = 80;

export function validateSeriesSlug(value: { current?: string } | undefined) {
  // The schema's required rule handles an absent address.
  if (!value?.current) return true;
  if (value.current.length > SERIES_SLUG_MAX_LENGTH) {
    return `Адреса серії має містити не більше ${SERIES_SLUG_MAX_LENGTH} символів.`;
  }
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)
    ? true
    : 'Використовуйте латинські літери, цифри та дефіси.';
}
