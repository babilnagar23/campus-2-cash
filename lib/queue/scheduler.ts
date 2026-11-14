import { getRedisConnection, isRedisConfigured } from "./connection";

const COOLDOWN_KEY = "campus-2-cash:groq:cooldown";
const STATS_KEY = "campus-2-cash:groq:stats";
const LOCK_KEY = "campus-2-cash:groq:concurrency_lock";

// Default cooldown is 15 seconds after completion
export const GROQ_COOLDOWN_MS = Number(process.env.GROQ_MIN_INTERVAL_MS) || 15000;

interface SchedulerMemoryState {
    nextEligibleTime: number;
    lastCompletedTime: number;
    completedCount: number;
    failedCount: number;
    rateLimit429Count: number;
    totalDurationMs: number;
}

declare global {
    // eslint-disable-next-line no-var
    var __campusSchedulerState: SchedulerMemoryState | undefined;
}

const memoryState: SchedulerMemoryState = global.__campusSchedulerState || {
    nextEligibleTime: 0,
    lastCompletedTime: 0,
    completedCount: 0,
    failedCount: 0,
    rateLimit429Count: 0,
    totalDurationMs: 0,
};

if (process.env.NODE_ENV !== "production") {
    global.__campusSchedulerState = memoryState;
}

/**
 * Get the timestamp (ms) when the next Groq request is allowed to start.
 */
export async function getNextEligibleTime(): Promise<number> {
    const redis = getRedisConnection();
    if (redis) {
        try {
            const raw = await redis.get(COOLDOWN_KEY);
            if (raw) {
                const ts = parseInt(raw, 10);
                if (!isNaN(ts)) return ts;
            }
        } catch (err: any) {
            console.warn("[SCHEDULER] Redis read failed, falling back to memory:", err.message);
        }
    }
    return memoryState.nextEligibleTime;
}

/**
 * Get remaining cooldown duration in milliseconds.
 * Returns 0 if no cooldown is currently active.
 */
export async function getCooldownRemainingMs(): Promise<number> {
    const nextEligible = await getNextEligibleTime();
    const now = Date.now();
    return Math.max(0, nextEligible - now);
}

/**
 * Check whether the 15-second post-completion cooldown is currently active.
 */
export async function isCooldownActive(): Promise<boolean> {
    const remaining = await getCooldownRemainingMs();
    return remaining > 0;
}

/**
 * Record successful completion of a Groq API request.
 * Sets the next allowed start time to now + GROQ_COOLDOWN_MS (15 seconds).
 */
export async function recordCompletion(durationMs = 0): Promise<number> {
    const now = Date.now();
    const nextEligible = now + GROQ_COOLDOWN_MS;

    memoryState.lastCompletedTime = now;
    memoryState.nextEligibleTime = nextEligible;
    memoryState.completedCount += 1;
    memoryState.totalDurationMs += durationMs;

    const redis = getRedisConnection();
    if (redis) {
        try {
            // Set cooldown expiration with a TTL so Redis keys auto-clean if abandoned
            const ttlSeconds = Math.ceil(GROQ_COOLDOWN_MS / 1000) + 60;
            await redis.set(COOLDOWN_KEY, nextEligible.toString(), "EX", ttlSeconds);
            await redis.hincrby(STATS_KEY, "completedCount", 1);
            if (durationMs > 0) {
                await redis.hincrby(STATS_KEY, "totalDurationMs", Math.round(durationMs));
            }
        } catch (err: any) {
            console.warn("[SCHEDULER] Failed to persist cooldown to Redis:", err.message);
        }
    }

    console.log(`[SCHEDULER] Completion recorded. 15s post-completion cooldown active until ${new Date(nextEligible).toLocaleTimeString()}`);
    return nextEligible;
}

/**
 * Record a failure of a Groq API request.
 * Still enforces a cooldown to avoid rapid hammering of the API.
 */
export async function recordFailure(durationMs = 0): Promise<number> {
    const now = Date.now();
    const nextEligible = now + GROQ_COOLDOWN_MS;

    memoryState.lastCompletedTime = now;
    memoryState.nextEligibleTime = nextEligible;
    memoryState.failedCount += 1;

    const redis = getRedisConnection();
    if (redis) {
        try {
            const ttlSeconds = Math.ceil(GROQ_COOLDOWN_MS / 1000) + 60;
            await redis.set(COOLDOWN_KEY, nextEligible.toString(), "EX", ttlSeconds);
            await redis.hincrby(STATS_KEY, "failedCount", 1);
        } catch (err: any) {
            console.warn("[SCHEDULER] Failed to persist failure to Redis:", err.message);
        }
    }

    return nextEligible;
}

/**
 * Handle Groq HTTP 429 Rate Limit error.
 * Extracts retry-after if available and sets nextEligible time accordingly.
 */
export async function handleRateLimit(retryAfterSeconds?: number): Promise<number> {
    const now = Date.now();
    const backoffMs = (retryAfterSeconds && retryAfterSeconds > 0 ? retryAfterSeconds : 20) * 1000;
    const nextEligible = Math.max(now + backoffMs, now + GROQ_COOLDOWN_MS);

    memoryState.lastCompletedTime = now;
    memoryState.nextEligibleTime = nextEligible;
    memoryState.rateLimit429Count += 1;

    const redis = getRedisConnection();
    if (redis) {
        try {
            const ttlSeconds = Math.ceil(backoffMs / 1000) + 60;
            await redis.set(COOLDOWN_KEY, nextEligible.toString(), "EX", ttlSeconds);
            await redis.hincrby(STATS_KEY, "rateLimit429Count", 1);
        } catch (err: any) {
            console.warn("[SCHEDULER] Failed to persist 429 backoff to Redis:", err.message);
        }
    }

    console.warn(`[SCHEDULER] Groq 429 Rate Limit encountered. Backoff scheduled for ${(backoffMs / 1000).toFixed(1)}s.`);
    return nextEligible;
}

/**
 * Pause execution until any active cooldown period has fully elapsed.
 * Ensures strict minimum 15-second spacing between successive Groq API calls.
 */
export async function waitForCooldown(): Promise<void> {
    const remaining = await getCooldownRemainingMs();
    if (remaining > 0) {
        console.log(`[SCHEDULER] Enforcing 15s cooldown: waiting ${(remaining / 1000).toFixed(1)}s before executing Groq request...`);
        await new Promise((resolve) => setTimeout(resolve, remaining));
    }
}

/**
 * Retrieve current metrics for diagnostics and queue status monitoring.
 */
export async function getSchedulerMetrics() {
    const remaining = await getCooldownRemainingMs();
    const nextEligible = await getNextEligibleTime();

    let completed = memoryState.completedCount;
    let failed = memoryState.failedCount;
    let rate429 = memoryState.rateLimit429Count;
    let totalDur = memoryState.totalDurationMs;

    const redis = getRedisConnection();
    if (redis) {
        try {
            const stats = await redis.hgetall(STATS_KEY);
            if (stats && Object.keys(stats).length > 0) {
                completed = parseInt(stats.completedCount || "0", 10) || completed;
                failed = parseInt(stats.failedCount || "0", 10) || failed;
                rate429 = parseInt(stats.rateLimit429Count || "0", 10) || rate429;
                totalDur = parseInt(stats.totalDurationMs || "0", 10) || totalDur;
            }
        } catch {
            // fallback to memory metrics
        }
    }

    const avgDuration = completed > 0 ? Math.round(totalDur / completed) : 0;

    return {
        cooldownRemainingMs: remaining,
        cooldownActive: remaining > 0,
        nextEligibleTime: nextEligible,
        completedCount: completed,
        failedCount: failed,
        rateLimit429Count: rate429,
        averageDurationMs: avgDuration,
        mode: (isRedisConfigured() ? "redis" : "in-memory") as "redis" | "in-memory",
    };
}
