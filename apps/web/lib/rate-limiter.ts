import { NextRequest } from 'next/server';

interface RateLimitRecord {
  count: number;
  firstRequestTime: number;
  lastRequestTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodic cleanup of stale rate-limit records every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now - record.lastRequestTime > 15 * 60 * 1000) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Extracts client IP address from standard reverse proxy and Cloudflare headers.
 */
export function getClientIp(request: NextRequest): string {
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0].trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return '127.0.0.1';
}

/**
 * Checks whether an action from a given key exceeds the rate limit.
 * @param key Identifier (e.g. IP address or user ID + action name)
 * @param limit Maximum allowed requests within the window
 * @param windowMs Time window in milliseconds (e.g. 60000 for 1 minute)
 */
export function checkRateLimit(
  key: string,
  limit = 5,
  windowMs = 60 * 1000,
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record) {
    rateLimitStore.set(key, {
      count: 1,
      firstRequestTime: now,
      lastRequestTime: now,
    });
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: now + windowMs,
    };
  }

  // If the window has expired, reset counter
  if (now - record.firstRequestTime > windowMs) {
    record.count = 1;
    record.firstRequestTime = now;
    record.lastRequestTime = now;
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: now + windowMs,
    };
  }

  // Window is active
  record.count += 1;
  record.lastRequestTime = now;

  if (record.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.firstRequestTime + windowMs,
    };
  }

  return {
    allowed: true,
    remaining: limit - record.count,
    resetTime: record.firstRequestTime + windowMs,
  };
}
