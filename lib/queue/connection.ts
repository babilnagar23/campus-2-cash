import Redis, { RedisOptions } from "ioredis";

// Global connection singletons to survive Next.js HMR reloads
declare global {
    // eslint-disable-next-line no-var
    var __campusRedisClient: Redis | null | undefined;
    // eslint-disable-next-line no-var
    var __campusRedisSubscriber: Redis | null | undefined;
}

const REDIS_URL = process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL;

export function isRedisConfigured(): boolean {
    return Boolean(REDIS_URL && REDIS_URL.trim().length > 0);
}

export function getRedisOptions(): RedisOptions {
    return {
        maxRetriesPerRequest: null, // Required by BullMQ
        enableReadyCheck: false,
        retryStrategy(times) {
            const delay = Math.min(times * 100, 3000);
            return delay;
        },
        reconnectOnError(err) {
            const targetError = "READONLY";
            if (err.message.includes(targetError)) {
                return true;
            }
            return false;
        },
    };
}

export function getRedisConnection(): Redis | null {
    if (!isRedisConfigured()) {
        return null;
    }

    if (global.__campusRedisClient) {
        return global.__campusRedisClient;
    }

    try {
        const client = new Redis(REDIS_URL!, getRedisOptions());

        client.on("connect", () => {
            console.log("[REDIS] Connected to Redis cluster for Groq request queue.");
        });

        client.on("error", (err) => {
            console.warn("[REDIS] Redis connection error:", err.message);
        });

        if (process.env.NODE_ENV !== "production") {
            global.__campusRedisClient = client;
        }

        return client;
    } catch (err: any) {
        console.warn("[REDIS] Failed to initialize Redis client:", err.message);
        return null;
    }
}

export function getRedisSubscriberConnection(): Redis | null {
    if (!isRedisConfigured()) {
        return null;
    }

    if (global.__campusRedisSubscriber) {
        return global.__campusRedisSubscriber;
    }

    try {
        const subscriber = new Redis(REDIS_URL!, getRedisOptions());

        if (process.env.NODE_ENV !== "production") {
            global.__campusRedisSubscriber = subscriber;
        }

        return subscriber;
    } catch (err: any) {
        console.warn("[REDIS] Failed to initialize Redis subscriber:", err.message);
        return null;
    }
}

export async function closeRedisConnections(): Promise<void> {
    if (global.__campusRedisClient) {
        try {
            await global.__campusRedisClient.quit();
        } catch {
            // ignore
        }
        global.__campusRedisClient = null;
    }

    if (global.__campusRedisSubscriber) {
        try {
            await global.__campusRedisSubscriber.quit();
        } catch {
            // ignore
        }
        global.__campusRedisSubscriber = null;
    }
}
