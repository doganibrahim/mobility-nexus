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

/**
 * Folds Turkish diacritics and handles uppercase/lowercase dotted and dotless I/i
 * so search terms like "kadikoy", "kadıköy", "istanbul", "İSTANBUL", "bilisim", "BİLİŞİM"
 * match accurately and interchangeably.
 */
export function foldTurkish(s: string | null | undefined): string {
  if (!s) return '';
  return String(s)
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'c')
    .toLowerCase();
}

/**
 * Checks if target string contains the query string, using Turkish diacritic folding.
 */
export function trSearchMatch(target: string | null | undefined, query: string | null | undefined): boolean {
  if (!query || !query.trim()) return true;
  if (!target) return false;
  return foldTurkish(target).includes(foldTurkish(query.trim()));
}

