import { NextRequest, NextResponse } from "next/server";
import { analyzeProjectWithGroq, refineProjectWithGroq, GroqServiceError } from "@/lib/ai-service";
import { extractDocumentText, truncateText, isSupportedUpload } from "@/lib/file-utils";
import { getGroqApiKey } from "@/lib/groq";
import { ProjectInput } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60; // 60s max execution duration for AI analysis

export async function POST(req: NextRequest) {
    try {
        const mode = req.nextUrl.searchParams.get("mode");

        // Verify API key configuration upfront
        if (!getGroqApiKey()) {
            return NextResponse.json(
                {
                    error: "Groq API key is missing. Please configure GROQ_API_KEY in your server environment (.env.local).",
                    code: "CONFIG_ERROR",
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
                return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
            }

            const { originalResponse, projectInput, userFeedback } = body;

            if (!userFeedback || typeof userFeedback !== "string" || userFeedback.trim().length < 3) {
                return NextResponse.json(
                    { error: "Please provide specific guidance for refinement (at least 3 characters)." },
                    { status: 400 }
                );
            }

            if (!originalResponse || !projectInput) {
                return NextResponse.json(
                    { error: "Missing original project analysis or inputs for refinement." },
                    { status: 400 }
                );
            }

            try {
                const refined = await refineProjectWithGroq(
                    originalResponse,
                    projectInput as ProjectInput,
                    userFeedback.trim().slice(0, 2000)
                );
                return NextResponse.json(refined);
            } catch (refineErr: any) {
                console.error("Groq refinement error:", refineErr);
                const status = refineErr instanceof GroqServiceError ? refineErr.statusCode : 502;
                return NextResponse.json(
                    {
                        error: refineErr?.message || "Failed to refine recommendations with Groq. Existing results were preserved.",
                        code: refineErr?.code || "REFINE_ERROR",
                    },
                    { status }
                );
            }
        }

        // ══════════════════════════════════════════════════════════
        // 2. ANALYZE MODE
        // ══════════════════════════════════════════════════════════
        let formData: FormData;
        try {
            formData = await req.formData();
        } catch {
            return NextResponse.json(
                { error: "Malformed multipart form data. Please verify your submission." },
                { status: 400 }
            );
        }

        const title = ((formData.get("title") as string) || "").trim();
        const description = ((formData.get("description") as string) || "").trim();

        // Server-side validation
        if (!title) {
            return NextResponse.json({ error: "Project Title is required." }, { status: 400 });
        }
        if (title.length > 200) {
            return NextResponse.json({ error: "Project Title must be 200 characters or fewer." }, { status: 400 });
        }

        if (!description) {
            return NextResponse.json({ error: "Project Description is required." }, { status: 400 });
        }
        if (description.length < 15) {
            return NextResponse.json(
                { error: "Please provide a more descriptive summary of your project (at least 15 characters)." },
                { status: 400 }
            );
        }
        if (description.length > 10000) {
            return NextResponse.json(
                { error: "Project Description exceeds maximum allowed length of 10,000 characters." },
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
                    { error: "Invalid GitHub URL format. Please enter a valid URL or leave it empty." },
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
                    { error: `File "${file.name}" exceeds maximum allowed size of 10MB.` },
                    { status: 400 }
                );
            }

            if (!isSupportedUpload(file.type, file.name)) {
                return NextResponse.json(
                    {
                        error: `File "${file.name}" has an unsupported format. Please upload PDF, TXT, or Markdown documents.`,
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

        try {
            const analysis = await analyzeProjectWithGroq(projectInput, truncatedDocText);
            return NextResponse.json(analysis);
        } catch (serviceErr: any) {
            console.error("Groq analysis error:", serviceErr);
            const status = serviceErr instanceof GroqServiceError ? serviceErr.statusCode : 502;
            return NextResponse.json(
                {
                    error: serviceErr?.message || "AI commercialization analysis failed. Please retry.",
                    code: serviceErr?.code || "ANALYSIS_FAILED",
                },
                { status }
            );
        }
    } catch (unexpectedError: any) {
        console.error("Unexpected error in /api/analyze route:", unexpectedError);
        return NextResponse.json(
            { error: "An unexpected server error occurred while processing your request." },
            { status: 500 }
        );
    }
}
