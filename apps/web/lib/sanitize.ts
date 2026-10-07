/**
 * Strips HTML tags and sanitizes input to prevent XSS and injection attacks.
 */
export function sanitizeInput(input: unknown): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip script tags
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')   // Strip style tags
    .replace(/<[^>]*>/g, '')                                             // Strip remaining HTML tags
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')     // Strip control characters
    .trim();
}

/**
 * Validates email address with standard RFC-compliant regex.
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates Erasmus+ Organisation ID (OID) format (e.g. E10123456).
 */
export function isValidOid(oid: string): boolean {
  if (!oid) return false;
  return /^E\d{8}$/i.test(oid.trim());
}
