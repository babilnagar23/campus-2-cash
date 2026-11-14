import { AnalysisResponse, ProjectInput } from "@/types";

export type JobStatus =
    | "queued"
    | "waiting"
    | "processing"
    | "cooldown"
    | "completed"
    | "failed"
    | "cancelled";

export type JobOperation = "analyze" | "refine";

export interface GroqQueueJobData {
    jobId: string;
    operation: JobOperation;
    projectInput: ProjectInput;
    docText?: string;
    originalResponse?: AnalysisResponse;
    feedback?: string;
    createdAt: number;
    userId?: string;
    idempotencyKey?: string;
    attemptsMade?: number;
}

export interface GroqQueueJobResult {
    analysis: AnalysisResponse;
    executionDurationMs: number;
    completedAt: number;
}

export interface JobStatusResponse {
    success: boolean;
    jobId: string;
    status: JobStatus;
    position?: number;
    queuePosition?: number;
    estimatedWaitSeconds?: number;
    message?: string;
    result?: AnalysisResponse;
    error?: {
        code: string;
        message: string;
    };
    createdAt?: number;
    startedAt?: number;
    completedAt?: number;
    durationMs?: number;
}

export interface QueueMetricsResponse {
    success: boolean;
    queueLength: number;
    activeJob: string | null;
    activeJobId?: string | null;
    isProcessing?: boolean;
    workerStatus: "online" | "processing" | "cooldown" | "idle" | "offline";
    cooldownRemainingMs: number;
    cooldownActive: boolean;
    nextEligibleTime: number;
    completedCount: number;
    failedCount: number;
    averageDurationMs: number;
    rateLimit429Count: number;
    mode: "redis" | "in-memory";
}

// ── Backward-compatible types for existing routes ───────────────
export interface AnalysisJobPayload {
    id: string;
    type: "analyze" | "refine";
    projectInput: ProjectInput;
    docText?: string;
    originalResponse?: AnalysisResponse;
    feedback?: string;
    createdAt?: number;
    userId?: string;
    idempotencyKey?: string;
}

export interface AnalysisJobRecord {
    id: string;
    type: "analyze" | "refine";
    status: JobStatus;
    payload: AnalysisJobPayload;
    result?: AnalysisResponse;
    error?: {
        code: string;
        message: string;
    };
    createdAt: number;
    startedAt?: number;
    completedAt?: number;
    queuePosition?: number;
}

export type StandardApiResponse = JobStatusResponse;
