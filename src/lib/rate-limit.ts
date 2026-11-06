import { Redis } from 'ioredis'

const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000')
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
  total: number
}

export async function rateLimit(
  identifier: string,
  maxRequests: number = MAX_REQUESTS,
  windowMs: number = WINDOW_MS
): Promise<RateLimitResult> {
  if (!redis) {
    return {
      success: true,
      remaining: maxRequests,
      resetTime: Date.now() + windowMs,
      total: maxRequests,
    }
  }

  const key = `ratelimit:${identifier}`
  const now = Date.now()
  const windowStart = now - windowMs

  const multi = redis.multi()
  multi.zremrangebyscore(key, 0, windowStart)
  multi.zcard(key)
  multi.zadd(key, now, `${now}-${Math.random()}`)
  multi.expire(key, Math.ceil(windowMs / 1000))
  const results = await multi.exec()

  const current = (results?.[1]?.[1] as number) || 0
  const remaining = Math.max(0, maxRequests - current - 1)

  return {
    success: current < maxRequests,
    remaining,
    resetTime: now + windowMs,
    total: maxRequests,
  }
}

export async function checkRateLimit(
  identifier: string,
  maxRequests: number = MAX_REQUESTS,
  windowMs: number = WINDOW_MS
): Promise<{ allowed: boolean; remaining: number }> {
  const result = await rateLimit(identifier, maxRequests, windowMs)
  return {
    allowed: result.success,
    remaining: result.remaining,
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')

  if (cfConnectingIp) return cfConnectingIp
  if (realIp) return realIp
  if (forwarded) return forwarded.split(',')[0].trim()
  return 'unknown'
}

export function createRateLimiter(
  maxRequests: number,
  windowMs: number,
  keyPrefix: string
) {
  return async (identifier: string) => {
    const fullKey = `${keyPrefix}:${identifier}`
    return rateLimit(fullKey, maxRequests, windowMs)
  }
}

export const apiRateLimiter = createRateLimiter(100, 60000, 'api')
export const authRateLimiter = createRateLimiter(10, 900000, 'auth')
export const uploadRateLimiter = createRateLimiter(20, 3600000, 'upload')
export const profileViewRateLimiter = createRateLimiter(30, 60000, 'profile-view')