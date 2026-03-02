/**
 * AdvayDecor — Hybrid Rate Limiter (Redis + In-Memory Fallback)
 * ==========================================================
 * This system implements a multi-layer defense against automated bots.
 * 
 * 1. Redis Tier (Upstash): Distributed, persistent, and survives server restarts.
 * 2. Memory Tier (Map): Zero-latency fallback if Redis is unavailable or unconfigured.
 * 
 * Philosophy: "Generous for humans, brutal for bots."
 * --------------------------------------------------
 * A real user will NEVER hit these limits, even on a bad day.
 * A bot spamming 100 requests/sec will be stopped instantly (429 Too Many Requests).
 */

import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// -------------------------------------------------------------------------
// 1. IN-MEMORY FALLBACK (For local development or if Redis is missing)
// -------------------------------------------------------------------------
interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredEntries() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;

    for (const [key, entry] of rateLimitStore) {
        if (now > entry.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}

function memoryRateLimit(
    identifier: string,
    maxRequests: number,
    windowMs: number
): { limited: boolean; remaining: number; resetIn: number } {
    cleanupExpiredEntries();

    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    if (!entry || now > entry.resetTime) {
        rateLimitStore.set(identifier, {
            count: 1,
            resetTime: now + windowMs,
        });
        return { limited: false, remaining: maxRequests - 1, resetIn: windowMs };
    }

    entry.count += 1;

    if (entry.count > maxRequests) {
        return {
            limited: true,
            remaining: 0,
            resetIn: entry.resetTime - now,
        };
    }

    return {
        limited: false,
        remaining: maxRequests - entry.count,
        resetIn: entry.resetTime - now,
    };
}

// -------------------------------------------------------------------------
// 2. REDIS INITIALIZATION (Upstash)
// -------------------------------------------------------------------------
let redis: Redis | null = null;
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (redisUrl && redisToken) {
    try {
        redis = new Redis({
            url: redisUrl,
            token: redisToken,
        });
    } catch (e) {
        console.error('Rate Limiter: Failed to initialize Redis client', e);
    }
}

/**
 * Check if a request should be rate limited.
 * Automatically switches between Redis (Production) and Memory (Development).
 * 
 * @returns { limited: boolean, remaining: number, resetIn: number }
 */
export async function rateLimit(
    identifier: string,
    maxRequests: number,
    windowMs: number
): Promise<{ limited: boolean; remaining: number; resetIn: number }> {

    // LAYER 1: Redis (if configured)
    if (redis) {
        try {
            const ratelimit = new Ratelimit({
                redis: redis,
                limiter: Ratelimit.slidingWindow(maxRequests, `${Math.ceil(windowMs / 1000)} s`),
                analytics: true,
                prefix: '@advaydecor/ratelimit',
            });

            const { success, remaining, reset } = await ratelimit.limit(identifier);
            const now = Date.now();

            return {
                limited: !success,
                remaining,
                resetIn: Math.max(0, reset - now),
            };
        } catch (error) {
            console.error('Rate Limiter: Redis error, falling back to in-memory', error);
            // Don't throw — gracefully fall back to in-memory so the site doesn't crash
        }
    }

    // LAYER 2: In-Memory (Fallback)
    return memoryRateLimit(identifier, maxRequests, windowMs);
}

// -------------------------------------------------------------------------
// 3. RATE LIMIT PROFILES
// -------------------------------------------------------------------------
export const RATE_LIMITS = {
    // OTP: 5 requests per 60s
    otp: { maxRequests: 5, windowMs: 60 * 1000 },

    // Forms: 3 requests per 60s
    form: { maxRequests: 3, windowMs: 60 * 1000 },

    // Orders: 5 requests per 60s
    order: { maxRequests: 5, windowMs: 60 * 1000 },

    // Reviews: 5 requests per 60s
    review: { maxRequests: 5, windowMs: 60 * 1000 },

    // Payments: 10 requests per 60s (retries allowed)
    payment: { maxRequests: 10, windowMs: 60 * 1000 },

    // Coupons: 10 requests per 60s
    coupon: { maxRequests: 10, windowMs: 60 * 1000 },

    // General: 60 requests per 60s
    general: { maxRequests: 60, windowMs: 60 * 1000 },
};
