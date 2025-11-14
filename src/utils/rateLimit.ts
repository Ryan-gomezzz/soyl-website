import type { NextApiRequest } from 'next';

type RateLimitConfig = {
  intervalMs: number;
  uniqueTokenPerInterval: number;
};

type Bucket = {
  tokens: number;
  lastRefill: number;
};

const buckets = new Map<string, Bucket>();

/**
 * Lightweight, in-memory token bucket limiter.
 * Replace with Redis or Upstash in production for distributed deployments.
 */
export async function rateLimit(req: NextApiRequest, config: RateLimitConfig) {
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
    req.socket.remoteAddress ??
    'unknown';

  const now = Date.now();
  const bucket = buckets.get(ip) ?? {
    tokens: config.uniqueTokenPerInterval,
    lastRefill: now
  };

  if (now - bucket.lastRefill >= config.intervalMs) {
    bucket.tokens = config.uniqueTokenPerInterval;
    bucket.lastRefill = now;
  }

  if (bucket.tokens <= 0) {
    buckets.set(ip, bucket);
    return { success: false };
  }

  bucket.tokens -= 1;
  buckets.set(ip, bucket);
  return { success: true };
}


