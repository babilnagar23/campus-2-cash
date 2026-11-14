import { getGroqClient, getGroqModel, getGroqReasoningEffort } from "./groq";
import {
    buildSystemPrompt,
    buildUserPrompt,
    buildRefineSystemPrompt,
    buildRefineUserPrompt,
} from "./ai-prompts";
import { validateAndNormalizeResponse } from "./ai-validation";
import { AnalysisResponse, ProjectInput } from "@/types";
import Groq from "groq-sdk";

export class GroqServiceError extends Error {
    statusCode: number;
    code: string;

    constructor(message: string, statusCode = 500, code = "AI_SERVICE_ERROR") {
        super(message);
        this.name = "GroqServiceError";
        this.statusCode = statusCode;
        this.code = code;
    }
}

function handleGroqError(err: unknown): never {
    if (err instanceof GroqServiceError) {
        throw err;
    }

    if (err instanceof Groq.AuthenticationError) {
        throw new GroqServiceError(
            "Groq API key is invalid or unauthorized. Please verify GROQ_API_KEY in .env.local.",
            401,
            "AUTH_ERROR"
        );
    }

    if (err instanceof Groq.RateLimitError) {
        throw new GroqServiceError(
            "Groq API rate limit or quota exceeded. Please wait a moment and try again.",
            429,
            "RATE_LIMIT"
        );
    }

    if (err instanceof Groq.APIConnectionTimeoutError) {
        throw new GroqServiceError(
            "Groq API request timed out after 60 seconds. Please try again.",
            504,
            "TIMEOUT"
        );
    }

    if (err instanceof Groq.APIConnectionError) {
        throw new GroqServiceError(
            "Unable to connect to Groq Cloud API. Please check your network connection.",
            503,
            "CONNECTION_ERROR"
        );
    }

    if (err instanceof Groq.BadRequestError) {
        const msg = err.message || "";
        throw new GroqServiceError(
            `Groq API Bad Request: ${msg.slice(0, 200)}`,
            400,
            "BAD_REQUEST"
        );
    }

    if (err instanceof Groq.APIError) {
        const status = err.status || 502;
        throw new GroqServiceError(
            `Groq Cloud API error (${status}): ${err.message.slice(0, 200)}`,
            status,
            "PROVIDER_ERROR"
        );
    }

    const message = err instanceof Error ? err.message : "An unexpected error occurred during Groq AI analysis.";
    throw new GroqServiceError(message, 500, "INTERNAL_ERROR");
}

async function callGroqWithFallback(
    messages: { role: "system" | "user" | "assistant"; content: string }[]
): Promise<string> {
    const groq = getGroqClient();
    const model = getGroqModel();
    const reasoningEffort = getGroqReasoningEffort();

    try {
        // Attempt with reasoning_effort and json_object response format
        const completion = await groq.chat.completions.create({
            model,
            messages,
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_completion_tokens: 8192,
            ...(reasoningEffort && reasoningEffort !== "none" ? { reasoning_effort: reasoningEffort } : {}),
        });

        const choice = completion.choices?.[0];
        const content = choice?.message?.content;

        if (!content || typeof content !== "string" || content.trim().length === 0) {
            throw new GroqServiceError("Groq model returned an empty response.", 502, "EMPTY_RESPONSE");
        }

        return content;
    } catch (firstErr: any) {
        // If parameter error occurred (e.g. reasoning_effort not supported by specific endpoint), retry without reasoning_effort
        const errMsg = firstErr?.message || "";
        if (
            errMsg.includes("reasoning_effort") ||
            errMsg.includes("unrecognized parameter") ||
            errMsg.includes("unknown parameter")
        ) {
            console.warn("Retrying Groq completion without reasoning_effort parameter...");
            const fallbackCompletion = await groq.chat.completions.create({
                model,
                messages,
                response_format: { type: "json_object" },
                temperature: 0.7,
                max_completion_tokens: 8192,
            });

            const content = fallbackCompletion.choices?.[0]?.message?.content;
            if (!content || typeof content !== "string" || content.trim().length === 0) {
                throw new GroqServiceError("Groq model returned an empty response on retry.", 502, "EMPTY_RESPONSE");
            }
            return content;
        }

        handleGroqError(firstErr);
    }
}

export async function analyzeProjectWithGroq(
    input: ProjectInput,
    extractedDocText?: string
): Promise<AnalysisResponse> {
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(input, extractedDocText);

    const rawResponse = await callGroqWithFallback([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
    ]);

    return validateAndNormalizeResponse(rawResponse);
}

export async function refineProjectWithGroq(
    originalResponse: AnalysisResponse,
    projectInput: ProjectInput,
    feedback: string
): Promise<AnalysisResponse> {
    const systemPrompt = buildRefineSystemPrompt();
    const userPrompt = buildRefineUserPrompt(
        JSON.stringify(originalResponse),
        feedback,
        projectInput
    );

    const rawResponse = await callGroqWithFallback([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
    ]);

    return validateAndNormalizeResponse(rawResponse);
}
