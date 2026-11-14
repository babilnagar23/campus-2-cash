import { Queue } from "bullmq";
import { getRedisConnection, isRedisConfigured } from "./connection";
import {
    GroqQueueJobData,
    GroqQueueJobResult,
    JobStatus,
    JobStatusResponse,
    QueueMetricsResponse,
    AnalysisJobPayload,
    AnalysisJobRecord,
} from "./queue-types";
import {
    waitForCooldown,
    recordCompletion,
    recordFailure,
    handleRateLimit,
    getCooldownRemainingMs,
    getSchedulerMetrics,
    GROQ_COOLDOWN_MS,
} from "./scheduler";
import { analyzeProjectWithGroq, refineProjectWithGroq, GroqServiceError } from "@/lib/ai-service";
import { AnalysisResponse } from "@/types";

export const GROQ_QUEUE_NAME = "groq-request-queue";

// Singleton BullMQ Queue instance
declare global {
    // eslint-disable-next-line no-var
    var __campusBullQueue: Queue<GroqQueueJobData, GroqQueueJobResult> | undefined;
    // eslint-disable-next-line no-var
    var __campusQueueMemoryState: InMemoryQueueState | undefined;
}

function getBullQueue(): Queue<GroqQueueJobData, GroqQueueJobResult> | null {
    if (!isRedisConfigured()) {
        return null;
    }

    if (global.__campusBullQueue) {
        return global.__campusBullQueue;
    }

    const redis = getRedisConnection();
    if (!redis) return null;

    try {
        const queue = new Queue<GroqQueueJobData, GroqQueueJobResult>(GROQ_QUEUE_NAME, {
            connection: redis,
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 5000,
                },
                removeOnComplete: {
                    age: 3600, // keep 1 hour
                    count: 1000,
                },
                removeOnFail: {
                    age: 7200, // keep 2 hours
                    count: 1000,
                },
            },
        });

        if (process.env.NODE_ENV !== "production") {
            global.__campusBullQueue = queue;
        }

        return queue;
    } catch (err: any) {
        console.warn("[QUEUE] Failed to create BullMQ queue, falling back to in-memory:", err.message);
        return null;
    }
}

// ── In-Memory FIFO Queue Fallback ──────────────────────────────
interface InMemoryQueueState {
    queue: AnalysisJobRecord[];
    jobs: Map<string, AnalysisJobRecord>;
    isProcessing: boolean;
    activeJobId: string | null;
}

const inMemoryState: InMemoryQueueState = global.__campusQueueMemoryState || {
    queue: [],
    jobs: new Map<string, AnalysisJobRecord>(),
    isProcessing: false,
    activeJobId: null,
};

if (process.env.NODE_ENV !== "production") {
    global.__campusQueueMemoryState = inMemoryState;
}

/**
 * Clean up old jobs exceeding 1 hour.
 */
function cleanupExpiredMemoryJobs() {
    const now = Date.now();
    for (const [id, job] of inMemoryState.jobs.entries()) {
        if (job.completedAt && now - job.completedAt > 3600000) {
            inMemoryState.jobs.delete(id);
        }
    }
}

/**
 * Worker tick for in-memory queue: processes the next job in strict FIFO order with concurrency = 1 and 15s cooldown.
 */
async function processNextMemoryJob(): Promise<void> {
    if (inMemoryState.isProcessing) return;
    if (inMemoryState.queue.length === 0) return;

    // Enforce 15-second post-completion cooldown before picking next job
    const remainingCooldown = await getCooldownRemainingMs();
    if (remainingCooldown > 0) {
        console.log(`[QUEUE-MEMORY] Respecting Groq 15s cooldown: waiting ${(remainingCooldown / 1000).toFixed(1)}s before next job...`);
        setTimeout(() => {
            processNextMemoryJob().catch(console.error);
        }, remainingCooldown);
        return;
    }

    const job = inMemoryState.queue.shift();
    if (!job) return;

    inMemoryState.isProcessing = true;
    inMemoryState.activeJobId = job.id;
    job.status = "processing";
    job.startedAt = Date.now();

    console.log(`[WORKER-MEMORY] Processing started: ${job.id} (${job.type})`);
    const startTime = Date.now();

    try {
        let result: AnalysisResponse;

        if (job.type === "refine") {
            if (!job.payload.originalResponse || !job.payload.feedback) {
                throw new Error("Missing original analysis or user feedback for refinement.");
            }
            console.log(`[GROQ] Request sent (refine): ${job.id}`);
            result = await refineProjectWithGroq(
                job.payload.originalResponse,
                job.payload.projectInput,
                job.payload.feedback
            );
        } else {
            console.log(`[GROQ] Request sent (analyze): ${job.id}`);
            result = await analyzeProjectWithGroq(
                job.payload.projectInput,
                job.payload.docText
            );
        }

        const duration = Date.now() - startTime;
        job.status = "completed";
        job.result = result;
        job.completedAt = Date.now();

        // Record successful completion and initiate 15s cooldown
        await recordCompletion(duration);
        console.log(`[QUEUE-MEMORY] Job completed: ${job.id} in ${duration}ms. 15s cooldown initiated.`);
    } catch (err: any) {
        const duration = Date.now() - startTime;
        console.error(`[WORKER-MEMORY] Job failed: ${job.id}`, err.message);

        if (err instanceof GroqServiceError && err.statusCode === 429) {
            await handleRateLimit(30);
        } else {
            await recordFailure(duration);
        }

        job.status = "failed";
        job.error = {
            code: err.code || "ANALYSIS_FAILED",
            message: err.message || "An unexpected error occurred during Groq AI analysis.",
        };
        job.completedAt = Date.now();
    } finally {
        inMemoryState.isProcessing = false;
        inMemoryState.activeJobId = null;
        cleanupExpiredMemoryJobs();

        // If more jobs are waiting in the queue, schedule the next tick after 15s cooldown
        if (inMemoryState.queue.length > 0) {
            setTimeout(() => {
                processNextMemoryJob().catch(console.error);
            }, GROQ_COOLDOWN_MS);
        }
    }
}

// ── Public Queue Methods ───────────────────────────────────────

/**
 * Enqueue a Groq job (supports Redis/BullMQ or in-memory fallback).
 */
export async function enqueueGroqJob(data: GroqQueueJobData): Promise<{ jobId: string; queuePosition: number }> {
    const bullQueue = getBullQueue();

    if (bullQueue) {
        const job = await bullQueue.add(data.operation, data, {
            jobId: data.jobId,
        });

        const waitingCount = await bullQueue.getWaitingCount();
        const activeCount = await bullQueue.getActiveCount();
        const queuePosition = waitingCount + activeCount;

        console.log(`[QUEUE-REDIS] Enqueued job ${data.jobId} (position ${queuePosition})`);
        return { jobId: data.jobId, queuePosition: Math.max(1, queuePosition) };
    }

    // In-memory fallback
    const jobRecord: AnalysisJobRecord = {
        id: data.jobId,
        type: data.operation,
        status: "queued",
        payload: {
            id: data.jobId,
            type: data.operation,
            projectInput: data.projectInput,
            docText: data.docText,
            originalResponse: data.originalResponse,
            feedback: data.feedback,
            createdAt: data.createdAt,
            userId: data.userId,
            idempotencyKey: data.idempotencyKey,
        },
        createdAt: data.createdAt || Date.now(),
        queuePosition: inMemoryState.queue.length + 1,
    };

    inMemoryState.jobs.set(data.jobId, jobRecord);
    inMemoryState.queue.push(jobRecord);

    console.log(`[QUEUE-MEMORY] Enqueued job ${data.jobId} (Queue length: ${inMemoryState.queue.length})`);

    // Kick off worker asynchronously
    setImmediate(() => {
        processNextMemoryJob().catch(console.error);
    });

    return { jobId: data.jobId, queuePosition: inMemoryState.queue.length };
}

/**
 * Enqueue analysis or refinement job (backward-compatible signature).
 */
export async function enqueueAnalysisJob(payload: AnalysisJobPayload): Promise<AnalysisJobRecord> {
    const data: GroqQueueJobData = {
        jobId: payload.id,
        operation: payload.type,
        projectInput: payload.projectInput,
        docText: payload.docText,
        originalResponse: payload.originalResponse,
        feedback: payload.feedback,
        createdAt: payload.createdAt || Date.now(),
        userId: payload.userId,
        idempotencyKey: payload.idempotencyKey,
    };

    const enqueued = await enqueueGroqJob(data);

    // Return an AnalysisJobRecord representing the job
    const memoryRecord = inMemoryState.jobs.get(payload.id);
    if (memoryRecord) {
        return memoryRecord;
    }

    return {
        id: payload.id,
        type: payload.type,
        status: "queued",
        payload,
        createdAt: payload.createdAt || Date.now(),
        queuePosition: enqueued.queuePosition,
    };
}

/**
 * Retrieve the current status of a Groq job.
 */
export async function getGroqJobStatus(jobId: string): Promise<JobStatusResponse> {
    const bullQueue = getBullQueue();

    if (bullQueue) {
        try {
            const job = await bullQueue.getJob(jobId);
            if (!job) {
                // Check in-memory in case mode switched
                const memoryRecord = inMemoryState.jobs.get(jobId);
                if (memoryRecord) {
                    return formatMemoryJobStatus(memoryRecord);
                }
                return {
                    success: false,
                    jobId,
                    status: "failed",
                    error: {
                        code: "JOB_NOT_FOUND",
                        message: `No active or recent job found matching ID: ${jobId}`,
                    },
                };
            }

            const state = await job.getState();
            const cooldownRemaining = await getCooldownRemainingMs();

            if (state === "completed") {
                const result = job.returnvalue?.analysis || (job.returnvalue as unknown as AnalysisResponse);
                return {
                    success: true,
                    jobId,
                    status: "completed",
                    result,
                    createdAt: job.timestamp,
                    completedAt: job.finishedOn,
                    durationMs: job.finishedOn && job.processedOn ? job.finishedOn - job.processedOn : undefined,
                };
            }

            if (state === "failed") {
                return {
                    success: false,
                    jobId,
                    status: "failed",
                    error: {
                        code: "ANALYSIS_FAILED",
                        message: job.failedReason || "Analysis job failed during execution.",
                    },
                    createdAt: job.timestamp,
                };
            }

            if (state === "active") {
                return {
                    success: true,
                    jobId,
                    status: "processing",
                    message: "AI mentor is actively analyzing your project...",
                    createdAt: job.timestamp,
                    startedAt: job.processedOn,
                };
            }

            // Waiting or delayed (queued)
            const waitingCount = await bullQueue.getWaitingCount();
            return {
                success: true,
                jobId,
                status: cooldownRemaining > 0 ? "cooldown" : "queued",
                position: Math.max(1, waitingCount),
                queuePosition: Math.max(1, waitingCount),
                estimatedWaitSeconds: Math.max(15, (waitingCount + 1) * 25),
                message: cooldownRemaining > 0
                    ? `15-second Groq cooldown active (${Math.ceil(cooldownRemaining / 1000)}s remaining)...`
                    : `In analysis queue (Position: ${Math.max(1, waitingCount)}).`,
                createdAt: job.timestamp,
            };
        } catch (err: any) {
            console.error(`[QUEUE] Error fetching BullMQ job ${jobId}:`, err.message);
        }
    }

    // In-memory fallback
    const record = inMemoryState.jobs.get(jobId);
    if (!record) {
        return {
            success: false,
            jobId,
            status: "failed",
            error: {
                code: "JOB_NOT_FOUND",
                message: `No active or recent job found matching ID: ${jobId}`,
            },
        };
    }

    return formatMemoryJobStatus(record);
}

function formatMemoryJobStatus(record: AnalysisJobRecord): JobStatusResponse {
    const isQueued = record.status === "queued";
    let position = 0;
    if (isQueued) {
        const idx = inMemoryState.queue.findIndex((j) => j.id === record.id);
        position = idx !== -1 ? idx + 1 : 1;
    }

    return {
        success: record.status !== "failed",
        jobId: record.id,
        status: record.status,
        position: position || undefined,
        queuePosition: position || undefined,
        estimatedWaitSeconds: isQueued ? position * 25 : undefined,
        result: record.result,
        error: record.error,
        message:
            record.status === "processing"
                ? "AI mentor is actively analyzing your project..."
                : isQueued
                ? `In analysis queue (Position: ${position}).`
                : undefined,
        createdAt: record.createdAt,
        startedAt: record.startedAt,
        completedAt: record.completedAt,
        durationMs: record.completedAt && record.startedAt ? record.completedAt - record.startedAt : undefined,
    };
}

/**
 * Backward-compatible getJobRecord function.
 */
export async function getJobRecord(jobId: string): Promise<AnalysisJobRecord | null> {
    const statusResp = await getGroqJobStatus(jobId);
    if (!statusResp.success && statusResp.error?.code === "JOB_NOT_FOUND") {
        return null;
    }

    return {
        id: statusResp.jobId,
        type: "analyze",
        status: statusResp.status,
        payload: {
            id: statusResp.jobId,
            type: "analyze",
            projectInput: { title: "", description: "", techStack: [] },
        },
        result: statusResp.result,
        error: statusResp.error,
        createdAt: statusResp.createdAt || Date.now(),
        startedAt: statusResp.startedAt,
        completedAt: statusResp.completedAt,
        queuePosition: statusResp.position,
    };
}

/**
 * Retrieve comprehensive queue metrics.
 */
export async function getGroqQueueMetrics(): Promise<QueueMetricsResponse> {
    const scheduler = await getSchedulerMetrics();
    const bullQueue = getBullQueue();

    let queueLength = inMemoryState.queue.length;
    let activeJob = inMemoryState.activeJobId;
    let isProcessing = inMemoryState.isProcessing;

    if (bullQueue) {
        try {
            const waiting = await bullQueue.getWaitingCount();
            const active = await bullQueue.getActiveCount();
            queueLength = waiting;
            isProcessing = active > 0;
            if (active > 0) {
                const activeJobs = await bullQueue.getActive(0, 1);
                activeJob = activeJobs[0]?.id || "active";
            } else {
                activeJob = null;
            }
        } catch {
            // fallback to memory
        }
    }

    let workerStatus: QueueMetricsResponse["workerStatus"] = "idle";
    if (isProcessing) {
        workerStatus = "processing";
    } else if (scheduler.cooldownActive) {
        workerStatus = "cooldown";
    }

    return {
        success: true,
        queueLength,
        activeJob,
        activeJobId: activeJob,
        isProcessing,
        workerStatus,
        cooldownRemainingMs: scheduler.cooldownRemainingMs,
        cooldownActive: scheduler.cooldownActive,
        nextEligibleTime: scheduler.nextEligibleTime,
        completedCount: scheduler.completedCount,
        failedCount: scheduler.failedCount,
        averageDurationMs: scheduler.averageDurationMs,
        rateLimit429Count: scheduler.rateLimit429Count,
        mode: scheduler.mode,
    };
}

/**
 * Backward-compatible getQueueStatus function.
 */
export async function getQueueStatus() {
    return getGroqQueueMetrics();
}
