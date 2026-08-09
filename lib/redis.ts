import { Redis } from "@upstash/redis";

const globalForRedis = globalThis as unknown as {
  redis?: Redis;
};

export const redis =
  globalForRedis.redis ??
  Redis.fromEnv();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

const DEFAULT_TTL_SECONDS = 300;

export async function cacheGetOrSet<T>(
  key: string,
  loader: () => Promise<T>,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): Promise<T> {
  try {
    const cached = await redis.get<string>(key);

    if (cached !== null) {
      return typeof cached === "string"
        ? JSON.parse(cached) as T
        : cached as T;
    }

    const fresh = await loader();

    try {
      await redis.set(key, JSON.stringify(fresh), {
        ex: ttlSeconds,
      });
    } catch (error) {
      console.warn(
        "[Redis] cache write failed:",
        error instanceof Error ? error.message : error
      );
    }

    return fresh;
  } catch (error) {
    console.warn(
      "[Redis] cache unavailable, using database:",
      error instanceof Error ? error.message : error
    );

    return loader();
  }
}

export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, windowSeconds);
    }

    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
    };
  } catch (error) {
    console.warn(
      "[Redis] rate limiting unavailable; allowing request:",
      error instanceof Error ? error.message : error
    );

    return {
      allowed: true,
      remaining: limit,
    };
  }
}