const rateLimitCache = new Map();

export function rateLimit(ip: string, limit: number = 10, windowMs: number = 60000) {
  const now = Date.now();
  const record = rateLimitCache.get(ip);

  if (!record) {
    rateLimitCache.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (now > record.resetTime) {
    rateLimitCache.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count += 1;
  rateLimitCache.set(ip, record);
  return { success: true, remaining: limit - record.count };
}

// Memory cleanup every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  rateLimitCache.forEach((value, key) => {
    if (now > value.resetTime) {
      rateLimitCache.delete(key);
    }
  });
}, 10 * 60 * 1000);
