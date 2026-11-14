import Groq from "groq-sdk";

export const DEFAULT_GROQ_MODEL = "openai/gpt-oss-120b";
export const DEFAULT_REASONING_EFFORT = "medium";

export function getGroqApiKey(): string {
    const key = process.env.GROQ_API_KEY || "";
    return key.trim();
}

export function getGroqModel(): string {
    return (process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL).trim();
}

export function getGroqReasoningEffort(): "low" | "medium" | "high" | "default" | "none" {
    const val = (process.env.GROQ_REASONING_EFFORT || DEFAULT_REASONING_EFFORT).toLowerCase();
    if (["low", "medium", "high", "none"].includes(val)) {
        return val as "low" | "medium" | "high" | "none";
    }
    return "medium";
}

let cachedGroqClient: Groq | null = null;

export function getGroqClient(): Groq {
    const apiKey = getGroqApiKey();
    if (!apiKey) {
        throw new Error(
            "GROQ_API_KEY is not configured. Please add your Groq API key to .env.local to enable AI analysis."
        );
    }

    if (!cachedGroqClient) {
        cachedGroqClient = new Groq({
            apiKey,
            timeout: 60000, // 60 seconds
            maxRetries: 2,
        });
    }

    return cachedGroqClient;
}
