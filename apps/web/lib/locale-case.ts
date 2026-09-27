/**
 * Safe Casing Utilities for ErasmusMobility
 * Prevents Turkish dotted 'İ' from appearing in English text (e.g. INQUIRY instead of İNQUİRY)
 * and ensures accurate Turkish casing when locale is 'tr'.
 */

export type SupportedLocale = 'tr' | 'en';

/**
 * Safely converts text to uppercase respecting language rules.
 * When locale is 'en', forces standard Latin uppercase where 'i' -> 'I'.
 * When locale is 'tr', uses Turkish casing rules where 'i' -> 'İ' and 'ı' -> 'I'.
 */
export function toSafeUpperCase(text: string | null | undefined, locale: SupportedLocale = 'en'): string {
  if (!text) return '';
  if (locale === 'tr') {
    return text.toLocaleUpperCase('tr-TR');
  }
  return text.toLocaleUpperCase('en-US');
}

/**
 * Safely converts text to lowercase respecting language rules.
 * When locale is 'en', forces 'I' -> 'i' (never dotless 'ı').
 * When locale is 'tr', uses 'I' -> 'ı' and 'İ' -> 'i'.
 */
export function toSafeLowerCase(text: string | null | undefined, locale: SupportedLocale = 'en'): string {
  if (!text) return '';
  if (locale === 'tr') {
    return text.toLocaleLowerCase('tr-TR');
  }
  return text.toLocaleLowerCase('en-US');
}

/**
 * Converts a string to Title Case safely without Turkish casing anomalies in English.
 */
export function toSafeTitleCase(text: string | null | undefined, locale: SupportedLocale = 'en'): string {
  if (!text) return '';
  return text
    .split(' ')
    .map((word) => {
      if (!word) return '';
      const first = toSafeUpperCase(word.charAt(0), locale);
      const rest = toSafeLowerCase(word.slice(1), locale);
      return `${first}${rest}`;
    })
    .join(' ');
}
