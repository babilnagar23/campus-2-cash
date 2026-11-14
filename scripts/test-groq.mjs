import fs from "fs";
import path from "path";
import Groq from "groq-sdk";

// Helper: load environment variables from .env.local or .env
function loadEnv() {
    const cwd = process.cwd();
    const envLocalPath = path.join(cwd, ".env.local");
    const envPath = path.join(cwd, ".env");

    let loadedFile = null;
    let content = "";

    if (fs.existsSync(envLocalPath)) {
        content = fs.readFileSync(envLocalPath, "utf-8");
        loadedFile = ".env.local";
    } else if (fs.existsSync(envPath)) {
        content = fs.readFileSync(envPath, "utf-8");
        loadedFile = ".env";
    }

    if (content) {
        for (const line of content.split("\n")) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith("#")) {
                const eqIdx = trimmed.indexOf("=");
                if (eqIdx !== -1) {
                    const key = trimmed.slice(0, eqIdx).trim();
                    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
                    if (!process.env[key]) {
                        process.env[key] = val;
                    }
                }
            }
        }
    }

    return loadedFile;
}

async function runGroqConnectionTest() {
    console.log("==================================================");
    console.log("       CAMPUS-2-CASH GROQ CONNECTION TEST        ");
    console.log("==================================================\n");

    const loadedEnv = loadEnv();
    if (loadedEnv) {
        console.log(`[PASS] Environment loaded from ${loadedEnv}`);
    } else {
        console.log("[INFO] No .env.local or .env file found; using process environment");
    }

    const apiKey = (process.env.GROQ_API_KEY || "").trim();
    if (!apiKey) {
        console.log("\n[PENDING CONFIGURATION] GROQ_API_KEY is not set.");
        console.log("To complete live connection testing, add your key to .env.local:");
        console.log("  GROQ_API_KEY=gsk_your_actual_groq_api_key_here\n");
        console.log("Get a key from https://console.groq.com/keys");
        process.exit(0);
    }

    // Masked display: never print actual key
    const maskedKey = apiKey.length > 8 ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : "***";
    console.log(`[PASS] GROQ_API_KEY detected (${maskedKey})`);

    const modelName = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
    let groq;
    try {
        groq = new Groq({ apiKey, timeout: 30000, maxRetries: 1 });
        console.log("[PASS] Groq client initialized");
    } catch (clientErr) {
        console.error("[FAIL] Groq client initialization failed:", clientErr.message);
        process.exit(1);
    }

    console.log(`[INFO] Sending test completion request to model: ${modelName}...`);

    try {
        const response = await groq.chat.completions.create({
            model: modelName,
            messages: [
                {
                    role: "system",
                    content: "You are a test evaluator. Respond ONLY with a valid JSON object.",
                },
                {
                    role: "user",
                    content: 'Return this exact JSON: {"status": "ok", "engine": "gpt-oss-120b", "verified": true}',
                },
            ],
            response_format: { type: "json_object" },
            temperature: 0.1,
            max_completion_tokens: 1024,
        });

        console.log("[PASS] Model request completed");

        const content = response.choices?.[0]?.message?.content;
        if (!content) {
            throw new Error("Model returned empty message content");
        }

        console.log(`[PASS] ${modelName} responded`);

        const parsed = JSON.parse(content);
        if (!parsed || typeof parsed !== "object" || parsed.verified !== true) {
            throw new Error(`Unexpected JSON structure received: ${content}`);
        }

        console.log("[PASS] Structured JSON parsed and verified");

        console.log("\n--------------------------------------------------");
        console.log("Provider: Groq Cloud");
        console.log(`Model:    ${modelName}`);
        console.log("Status:   CONNECTION SUCCESSFUL");
        console.log("--------------------------------------------------\n");
    } catch (apiErr) {
        console.error("\n[FAIL] Groq API request failed:");
        console.error("Message:", apiErr.message);
        if (apiErr.status) console.error("HTTP Status:", apiErr.status);
        console.log("\nStatus: CONNECTION FAILED");
        process.exit(1);
    }
}

runGroqConnectionTest();
