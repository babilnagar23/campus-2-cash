import { NextRequest, NextResponse } from "next/server";
import { getGroqJobStatus } from "@/lib/queue/queue";
import { JobStatusResponse } from "@/lib/queue/queue-types";

export const runtime = "nodejs";

export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ jobId: string }> }
) {
    try {
        const { jobId } = await context.params;

        if (!jobId || typeof jobId !== "string") {
            const response: JobStatusResponse = {
                success: false,
                status: "failed",
                jobId: "",
                error: {
                    code: "INVALID_JOB_ID",
                    message: "A valid jobId must be provided.",
                },
            };
            return NextResponse.json(response, { status: 400 });
        }

        const statusResponse = await getGroqJobStatus(jobId);

        if (!statusResponse.success && statusResponse.error?.code === "JOB_NOT_FOUND") {
            return NextResponse.json(statusResponse, { status: 404 });
        }

        return NextResponse.json(statusResponse, { status: 200 });
    } catch (err: any) {
        console.error("Job status endpoint error:", err);
        const errorResponse: JobStatusResponse = {
            success: false,
            status: "failed",
            jobId: "",
            error: {
                code: "SERVER_ERROR",
                message: err.message || "An unexpected error occurred while fetching job status.",
            },
        };
        return NextResponse.json(errorResponse, { status: 500 });
    }
}
