import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { rateLimit } from '../lib/rate-limit';

describe('Rate Limiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createMockRequest = (ip: string = '127.0.0.1') => {
    return {
      headers: new Headers({
        'x-forwarded-for': ip,
      }),
    } as unknown as Request;
  };

  it('allows requests within the limit', () => {
    const req = createMockRequest('192.168.1.1');
    const options = { limit: 3, windowMs: 1000, prefix: 'test' };

    const res1 = rateLimit(req, options);
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(2);

    const res2 = rateLimit(req, options);
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = rateLimit(req, options);
    expect(res3.success).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it('blocks requests exceeding the limit', () => {
    const req = createMockRequest('192.168.1.2');
    const options = { limit: 2, windowMs: 1000, prefix: 'test2' };

    rateLimit(req, options);
    rateLimit(req, options);

    const res3 = rateLimit(req, options);
    expect(res3.success).toBe(false);
    expect(res3.remaining).toBe(0);
    expect(res3.error).toContain('Too many requests');
  });

  it('resets count after window expires', () => {
    const req = createMockRequest('192.168.1.3');
    const options = { limit: 1, windowMs: 1000, prefix: 'test3' };

    // Request 1: allowed
    expect(rateLimit(req, options).success).toBe(true);

    // Request 2 immediately: blocked
    expect(rateLimit(req, options).success).toBe(false);

    // Fast-forward 1001ms
    vi.advanceTimersByTime(1001);

    // Request 3 after window: allowed
    const res3 = rateLimit(req, options);
    expect(res3.success).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it('separates limits by IP', () => {
    const req1 = createMockRequest('10.0.0.1');
    const req2 = createMockRequest('10.0.0.2');
    const options = { limit: 1, windowMs: 1000, prefix: 'test4' };

    expect(rateLimit(req1, options).success).toBe(true);
    expect(rateLimit(req1, options).success).toBe(false); // IP1 blocked

    expect(rateLimit(req2, options).success).toBe(true); // IP2 allowed
  });
});
