import { NextRequest, NextResponse } from "next/server";
import { analyzeProjectWithGroq, refineProjectWithGroq, GroqServiceError } from "@/lib/ai-service";
import { extractDocumentText, truncateText, isSupportedUpload } from "@/lib/file-utils";
import { getGroqApiKey } from "@/lib/groq";
import { enqueueAnalysisJob } from "@/lib/queue/queue";
import { ProjectInput } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60; // 60s max execution duration for AI analysis

export async function POST(req: NextRequest) {
    try {
        const mode = req.nextUrl.searchParams.get("mode");
        const isSync = req.nextUrl.searchParams.get("sync") === "true";

        // Verify API key configuration upfront
        if (!getGroqApiKey()) {
            return NextResponse.json(
                {
                    success: false,
                    status: "failed",
                    error: {
                        code: "CONFIG_ERROR",
                        message: "Groq API key is missing. Please configure GROQ_API_KEY in your server environment (.env.local).",
                    },
                },
                { status: 500 }
            );
        }

        // ══════════════════════════════════════════════════════════
        // 1. REFINE MODE
        // ══════════════════════════════════════════════════════════
        if (mode === "refine") {
            let body: any;
            try {
                body = await req.json();
            } catch {
                return NextResponse.json(
                    {
                        success: false,
                        status: "failed",
                        error: { code: "INVALID_JSON", message: "Invalid JSON request body." },
                    },
                    { status: 400 }
                );
            }

            const { originalResponse, projectInput, userFeedback } = body;

            if (!userFeedback || typeof userFeedback !== "string" || userFeedback.trim().length < 3) {
                return NextResponse.json(
                    {
                        success: false,
                        status: "failed",
                        error: {
                            code: "VALIDATION_ERROR",
                            message: "Please provide specific guidance for refinement (at least 3 characters).",
                        },
                    },
                    { status: 400 }
                );
            }

            if (!originalResponse || !projectInput) {
                return NextResponse.json(
                    {
                        success: false,
                        status: "failed",
                        error: {
                            code: "VALIDATION_ERROR",
                            message: "Missing original project analysis or inputs for refinement.",
                        },
                    },
                    { status: 400 }
                );
            }

            if (isSync) {
                try {
                    const refined = await refineProjectWithGroq(
                        originalResponse,
                        projectInput as ProjectInput,
                        userFeedback.trim().slice(0, 2000)
                    );
                    return NextResponse.json(refined, { status: 200 });
                } catch (refineErr: any) {
                    console.error("Groq refinement error:", refineErr);
                    const status = refineErr instanceof GroqServiceError ? refineErr.statusCode : 502;
                    return NextResponse.json(
                        {
                            success: false,
                            status: "failed",
                            error: {
                                code: refineErr?.code || "REFINE_ERROR",
                                message: refineErr?.message || "Failed to refine recommendations with Groq.",
                            },
                        },
                        { status }
                    );
                }
            }

            // Standard queue mode for refinement
            const jobId = `refine_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
            console.log(`[ANALYSIS] Refinement request received, creating job: ${jobId}`);

            const job = await enqueueAnalysisJob({
                id: jobId,
                type: "refine",
                projectInput: projectInput as ProjectInput,
                originalResponse,
                feedback: userFeedback.trim().slice(0, 2000),
                createdAt: Date.now(),
            });

            return NextResponse.json(
                {
                    success: true,
                    status: "queued",
                    jobId: job.id,
                    queuePosition: job.queuePosition || 1,
                    message: "Your refinement request has been accepted into the queue.",
                },
                { status: 202 }
            );
        }

        // ══════════════════════════════════════════════════════════
        // 2. ANALYZE MODE
        // ══════════════════════════════════════════════════════════
        let formData: FormData;
        try {
            formData = await req.formData();
        } catch {
            return NextResponse.json(
                {
                    success: false,
                    status: "failed",
                    error: {
                        code: "INVALID_FORM_DATA",
                        message: "Malformed multipart form data. Please verify your submission.",
                    },
                },
                { status: 400 }
            );
        }

        const title = ((formData.get("title") as string) || "").trim();
        const description = ((formData.get("description") as string) || "").trim();

        // Server-side validation
        if (!title) {
            return NextResponse.json(
                {
                    success: false,
                    status: "failed",
                    error: { code: "TITLE_REQUIRED", message: "Project Title is required." },
                },
                { status: 400 }
            );
        }
        if (title.length > 200) {
            return NextResponse.json(
                {
                    success: false,
                    status: "failed",
                    error: { code: "TITLE_TOO_LONG", message: "Project Title must be 200 characters or fewer." },
                },
                { status: 400 }
            );
        }

        if (!description) {
            return NextResponse.json(
                {
                    success: false,
                    status: "failed",
                    error: { code: "DESCRIPTION_REQUIRED", message: "Project Description is required." },
                },
                { status: 400 }
            );
        }
        if (description.length < 15) {
            return NextResponse.json(
                {
                    success: false,
                    status: "failed",
                    error: {
                        code: "DESCRIPTION_TOO_SHORT",
                        message: "Please provide a more descriptive summary of your project (at least 15 characters).",
                    },
                },
                { status: 400 }
            );
        }
        if (description.length > 10000) {
            return NextResponse.json(
                {
                    success: false,
                    status: "failed",
                    error: {
                        code: "DESCRIPTION_TOO_LONG",
                        message: "Project Description exceeds maximum allowed length of 10,000 characters.",
                    },
                },
                { status: 400 }
            );
        }

        let techStack: string[] = [];
        try {
            const rawTech = formData.get("techStack") as string;
            if (rawTech) {
                const parsed = JSON.parse(rawTech);
                if (Array.isArray(parsed)) {
                    techStack = parsed.filter((t) => typeof t === "string" && t.trim().length > 0).slice(0, 25);
                }
            }
        } catch {
            techStack = [];
        }

        const targetAudience = ((formData.get("targetAudience") as string) || "").trim().slice(0, 200) || undefined;
        const targetCountry = ((formData.get("targetCountry") as string) || "").trim().slice(0, 100) || undefined;

        const rawPref = formData.get("preferredRevenue") as string;
        const preferredRevenue = ["passive", "active", "b2b", "any"].includes(rawPref)
            ? (rawPref as ProjectInput["preferredRevenue"])
            : "any";

        const knownCompetitors = ((formData.get("knownCompetitors") as string) || "").trim().slice(0, 300) || undefined;

        let githubUrl = ((formData.get("githubUrl") as string) || "").trim();
        if (githubUrl) {
            try {
                const parsedUrl = new URL(githubUrl);
                if (!["http:", "https:"].includes(parsedUrl.protocol)) {
                    githubUrl = "";
                }
            } catch {
                return NextResponse.json(
                    {
                        success: false,
                        status: "failed",
                        error: {
                            code: "INVALID_GITHUB_URL",
                            message: "Invalid GitHub URL format. Please enter a valid URL or leave it empty.",
                        },
                    },
                    { status: 400 }
                );
            }
        }

        const projectInput: ProjectInput = {
            title,
            description,
            techStack,
            targetAudience,
            targetCountry,
            preferredRevenue,
            knownCompetitors,
            githubUrl: githubUrl || undefined,
        };

        // ── Process Uploaded Documents ──────────────────────────
        let combinedExtractedText = "";
        const uploadedFiles = formData.getAll("files") as File[];
        const validFiles = uploadedFiles.filter((f) => f && typeof f.size === "number" && f.size > 0).slice(0, 3);
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

        for (const file of validFiles) {
            if (file.size > MAX_FILE_SIZE) {
                return NextResponse.json(
                    {
                        success: false,
                        status: "failed",
                        error: {
                            code: "FILE_TOO_LARGE",
                            message: `File "${file.name}" exceeds maximum allowed size of 10MB.`,
                        },
                    },
                    { status: 400 }
                );
            }

            if (!isSupportedUpload(file.type, file.name)) {
                return NextResponse.json(
                    {
                        success: false,
                        status: "failed",
                        error: {
                            code: "UNSUPPORTED_FILE_TYPE",
                            message: `File "${file.name}" has an unsupported format. Please upload PDF, TXT, or Markdown documents.`,
                        },
                    },
                    { status: 400 }
                );
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            const extraction = await extractDocumentText(buffer, file.type, file.name);

            if (extraction.text) {
                combinedExtractedText += "\n\n" + extraction.text;
            }
        }

        const truncatedDocText = truncateText(combinedExtractedText, 5000);

        // Synchronous fallback support if explicitly requested
        if (isSync) {
            try {
                console.log("[ANALYSIS] Running synchronous analysis on request");
                const analysis = await analyzeProjectWithGroq(projectInput, truncatedDocText);
                return NextResponse.json(analysis, { status: 200 });
            } catch (serviceErr: any) {
                console.error("Groq synchronous analysis error:", serviceErr);
                const status = serviceErr instanceof GroqServiceError ? serviceErr.statusCode : 502;
                return NextResponse.json(
                    {
                        success: false,
                        status: "failed",
                        error: {
                            code: serviceErr?.code || "ANALYSIS_FAILED",
                            message: serviceErr?.message || "AI commercialization analysis failed.",
                        },
                    },
                    { status }
                );
            }
        }

        // Shared Queue Integration (Standard Flow)
        const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        console.log(`[ANALYSIS] Request received: ${jobId}. Enqueueing into 15s-rate-limited FIFO queue...`);

        const job = await enqueueAnalysisJob({
            id: jobId,
            type: "analyze",
            projectInput,
            docText: truncatedDocText,
            createdAt: Date.now(),
        });

        // Return HTTP 202 Accepted with canonical queued payload
        return NextResponse.json(
            {
                success: true,
                status: "queued",
                jobId: job.id,
                queuePosition: job.queuePosition || 1,
                message: "Your project has been added to the analysis queue.",
            },
            { status: 202 }
        );
    } catch (unexpectedError: any) {
        console.error("Unexpected error in /api/analyze route:", unexpectedError);
        return NextResponse.json(
            {
                success: false,
                status: "failed",
                error: {
                    code: "INTERNAL_SERVER_ERROR",
                    message: "An unexpected server error occurred while processing your request.",
                },
            },
            { status: 500 }
        );
    }
}
