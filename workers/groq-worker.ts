/**
 * ============================================================
 * Standalone Groq Request Worker (BullMQ + Redis)
 * ============================================================
 *
 * Responsibilities:
 * - Enforces global concurrency = 1 (strictly 1 Groq request at a time).
 * - Enforces 15-second post-completion cooldown between Groq requests.
 * - Handles Groq HTTP 429 rate-limiting with exponential backoff.
 * - Processes both 'analyze' and 'refine' jobs from a single FIFO queue.
 * - Graceful shutdown handling for container and process managers.
 *
 * Run with: npm run worker
 */

import { Worker, Job } from "bullmq";
import { getRedisConnection, isRedisConfigured, closeRedisConnections } from "../lib/queue/connection";
import { GROQ_QUEUE_NAME } from "../lib/queue/queue";
import { GroqQueueJobData, GroqQueueJobResult } from "../lib/queue/queue-types";
import {
    waitForCooldown,
    recordCompletion,
    recordFailure,
    handleRateLimit,
    GROQ_COOLDOWN_MS,
} from "../lib/queue/scheduler";
import { analyzeProjectWithGroq, refineProjectWithGroq, GroqServiceError } from "../lib/ai-service";
import { AnalysisResponse } from "../types";

import fs from "fs";
import path from "path";

// Zero-dependency .env loader for standalone worker
function loadEnv() {
    for (const envFile of [".env.local", ".env"]) {
        const fullPath = path.resolve(process.cwd(), envFile);
        if (fs.existsSync(fullPath)) {
            try {
                const content = fs.readFileSync(fullPath, "utf-8");
                for (const line of content.split("\n")) {
                    const trimmed = line.trim();
                    if (!trimmed || trimmed.startsWith("#")) continue;
                    const eqIdx = trimmed.indexOf("=");
                    if (eqIdx > 0) {
                        const key = trimmed.slice(0, eqIdx).trim();
                        let val = trimmed.slice(eqIdx + 1).trim();
                        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                            val = val.slice(1, -1);
                        }
                        if (!process.env[key]) {
                            process.env[key] = val;
                        }
                    }
                }
            } catch {
                // ignore
            }
        }
    }
}
loadEnv();

async function startWorker() {
    console.log("══════════════════════════════════════════════════════════════════");
    console.log("   CAMPUS-2-CASH GROQ WORKER SERVICE (BullMQ + Redis)");
    console.log("══════════════════════════════════════════════════════════════════");
    console.log(`[WORKER] Queue: "${GROQ_QUEUE_NAME}"`);
    console.log(`[WORKER] Concurrency: 1 (Strictly sequential FIFO execution)`);
    console.log(`[WORKER] Cooldown: ${GROQ_COOLDOWN_MS}ms (Post-completion cooldown)`);
    console.log(`[WORKER] Groq Model: ${process.env.GROQ_MODEL || "openai/gpt-oss-20b"}`);
    console.log(`[WORKER] Reasoning Effort: ${process.env.GROQ_REASONING_EFFORT || "low"}`);

    if (!isRedisConfigured()) {
        console.warn("\n⚠️  WARNING: REDIS_URL is not configured.");
        console.warn("The standalone worker requires a valid Redis connection.");
        console.warn("For local development without Redis, the Next.js dev server runs the");
        console.warn("in-process FIFO queue automatically with the exact same 15s cooldown.\n");
        process.exit(1);
    }

    const redis = getRedisConnection();
    if (!redis) {
        console.error("[WORKER] Failed to connect to Redis. Exiting.");
        process.exit(1);
    }

    const worker = new Worker<GroqQueueJobData, GroqQueueJobResult>(
        GROQ_QUEUE_NAME,
        async (job: Job<GroqQueueJobData, GroqQueueJobResult>) => {
            const { jobId, operation, projectInput, docText, originalResponse, feedback } = job.data;
            console.log(`\n--------------------------------------------------------------`);
            console.log(`[WORKER] Job picked up: ${jobId} (Operation: ${operation}, Attempt: ${job.attemptsMade + 1})`);

            // Step 1: Enforce mandatory 15-second cooldown from previous request completion
            await waitForCooldown();

            const startTime = Date.now();
            console.log(`[GROQ] Dispatching request to Groq (${operation}) at ${new Date().toLocaleTimeString()}...`);

            try {
                let analysis: AnalysisResponse;

                if (operation === "refine") {
                    if (!originalResponse || !feedback) {
                        throw new Error("Missing originalResponse or feedback in refine job payload.");
                    }
                    analysis = await refineProjectWithGroq(originalResponse, projectInput, feedback);
                } else {
                    analysis = await analyzeProjectWithGroq(projectInput, docText);
                }

                const durationMs = Date.now() - startTime;
                console.log(`[GROQ] Analysis completed successfully in ${(durationMs / 1000).toFixed(2)}s.`);

                // Step 2: Record completion time to initiate distributed 15-second cooldown
                await recordCompletion(durationMs);

                const result: GroqQueueJobResult = {
                    analysis,
                    executionDurationMs: durationMs,
                    completedAt: Date.now(),
                };

                return result;
            } catch (err: any) {
                const durationMs = Date.now() - startTime;
                console.error(`[GROQ] Request failed after ${durationMs}ms:`, err.message);

                if (err instanceof GroqServiceError && err.statusCode === 429) {
                    console.warn(`[WORKER] Rate limit 429 detected. Initiating backoff cooldown.`);
                    await handleRateLimit(30);
                } else {
                    await recordFailure(durationMs);
                }

                throw err;
            }
        },
        {
            connection: redis,
            concurrency: 1, // Global concurrency constraint: strictly 1 at a time
            limiter: {
                max: 1,
                duration: 1000,
            },
        }
    );

    worker.on("ready", () => {
        console.log("[WORKER] Worker is ready and listening for incoming jobs.");
    });

    worker.on("completed", (job) => {
        console.log(`[WORKER] Job completed successfully: ${job.id}`);
    });

    worker.on("failed", (job, err) => {
        console.error(`[WORKER] Job failed: ${job?.id}. Reason: ${err.message}`);
    });

    worker.on("error", (err) => {
        console.error("[WORKER] Worker encountered an error:", err.message);
    });

    // Graceful shutdown handling
    const shutdown = async (signal: string) => {
        console.log(`\n[WORKER] Received ${signal}. Shutting down worker gracefully...`);
        try {
            await worker.close();
            await closeRedisConnections();
            console.log("[WORKER] Worker and Redis connections closed cleanly.");
            process.exit(0);
        } catch (err: any) {
            console.error("[WORKER] Error during shutdown:", err.message);
            process.exit(1);
        }
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
}

startWorker().catch((err) => {
    console.error("[WORKER] Fatal error in worker:", err);
    process.exit(1);
});
