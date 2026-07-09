/**
 * lib/rate-limit.ts
 *
 * A lightweight, zero-dependency, in-memory rate limiter.
 * Uses a Map to track request counts per IP per route.
 * No Redis or external service required.
 *
 * Usage:
 *   const result = rateLimit(request, { limit: 5, windowMs: 15 * 60 * 1000 });
 *   if (!result.success) return NextResponse.json({ error: result.error }, { status: 429 });
 */

interface RateLimitOptions {
  /** Maximum number of requests allowed within the window */
  limit: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Optional key prefix to namespace different routes */
  prefix?: string;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: Date;
  error?: string;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store: key → { count, resetAt }
const store = new Map<string, RateLimitEntry>();

/**
 * Periodically cleans up expired entries to avoid memory leaks.
 * Runs every 5 minutes.
 */
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt <= now) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Gets the real client IP from the request headers,
 * falling back to a generic value if not found.
 */
function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return 'unknown';
}

/**
 * Main rate limiter function.
 * Call this at the top of any API route handler.
 */
export function rateLimit(request: Request, options: RateLimitOptions): RateLimitResult {
  const { limit, windowMs, prefix = 'rl' } = options;
  const ip = getClientIp(request);
  const now = Date.now();
  const key = `${prefix}:${ip}`;

  const existing = store.get(key);

  // If window has expired or no entry, start fresh
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return {
      success: true,
      remaining: limit - 1,
      resetAt: new Date(resetAt),
    };
  }

  // Increment existing entry
  existing.count += 1;
  store.set(key, existing);

  if (existing.count > limit) {
    const secondsLeft = Math.ceil((existing.resetAt - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetAt: new Date(existing.resetAt),
      error: `Too many requests. Please try again in ${secondsLeft} seconds.`,
    };
  }

  return {
    success: true,
    remaining: limit - existing.count,
    resetAt: new Date(existing.resetAt),
  };
}

// ─── Preset rate limit configs ──────────────────────────────────────────────

/** For auth endpoints like register, login: 10 per hour */
export const authRateLimit = (request: Request) =>
  rateLimit(request, { limit: 10, windowMs: 60 * 60 * 1000, prefix: 'auth' });

/** For OTP/forgot-password: 5 per 15 minutes (strict) */
export const otpRateLimit = (request: Request) =>
  rateLimit(request, { limit: 5, windowMs: 15 * 60 * 1000, prefix: 'otp' });

/** For payment endpoints: 10 per minute */
export const paymentRateLimit = (request: Request) =>
  rateLimit(request, { limit: 10, windowMs: 60 * 1000, prefix: 'pay' });
