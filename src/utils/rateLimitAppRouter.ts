import { NextRequest } from 'next/server'

type RateLimitConfig = {
  intervalMs: number
  uniqueTokenPerInterval: number
}

type Bucket = {
  tokens: number
  lastRefill: number
}

const buckets = new Map<string, Bucket>()

/**
 * Rate limiting for Next.js App Router
 * Lightweight, in-memory token bucket limiter.
 * Replace with Redis or Upstash in production for distributed deployments.
 */
export function rateLimitAppRouter(req: NextRequest, config: RateLimitConfig) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  const now = Date.now()
  const bucket = buckets.get(ip) ?? {
    tokens: config.uniqueTokenPerInterval,
    lastRefill: now,
  }

  if (now - bucket.lastRefill >= config.intervalMs) {
    bucket.tokens = config.uniqueTokenPerInterval
    bucket.lastRefill = now
  }

  if (bucket.tokens <= 0) {
    buckets.set(ip, bucket)
    return { success: false, remaining: 0, resetAt: bucket.lastRefill + config.intervalMs }
  }

  bucket.tokens -= 1
  buckets.set(ip, bucket)
  return { success: true, remaining: bucket.tokens, resetAt: bucket.lastRefill + config.intervalMs }
}

