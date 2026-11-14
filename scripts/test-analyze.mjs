import fs from "fs";
import path from "path";
import Groq from "groq-sdk";

function loadEnv() {
    const cwd = process.cwd();
    const envLocalPath = path.join(cwd, ".env.local");
    const envPath = path.join(cwd, ".env");

    let content = "";
    if (fs.existsSync(envLocalPath)) {
        content = fs.readFileSync(envLocalPath, "utf-8");
    } else if (fs.existsSync(envPath)) {
        content = fs.readFileSync(envPath, "utf-8");
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
}

async function runEndToEndAnalysisTest() {
    console.log("==================================================");
    console.log("   CAMPUS-2-CASH FULL GROQ ANALYSIS TEST         ");
    console.log("==================================================\n");

    loadEnv();
    const apiKey = (process.env.GROQ_API_KEY || "").trim();

    if (!apiKey) {
        console.log("[PENDING CONFIGURATION] GROQ_API_KEY is not set.");
        console.log("Set GROQ_API_KEY in .env.local to run live end-to-end project analysis testing.");
        process.exit(0);
    }

    const modelName = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
    console.log(`[INFO] Initializing Groq test using model: ${modelName}`);

    const groq = new Groq({ apiKey, timeout: 60000, maxRetries: 1 });

    const sampleProject = {
        title: "AI Campus Note-Taker",
        description:
            "A web app that lets university students record fast-paced lectures in real-time, automatically transcribes audio into concise summaries, generates flashcards, and exports study guides. Built for STEM students who struggle to capture complex technical lectures.",
        techStack: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
        targetAudience: "University students, especially engineering & medicine",
        targetCountry: "Global",
        preferredRevenue: "passive",
    };

    console.log(`[INFO] Submitting sample project: "${sampleProject.title}"...`);

    const systemPrompt = `You are an elite AI startup mentor and monetization strategist. Evaluate this project across 10 viability dimensions, provide a master score, 3 revenue scenarios, 3-5 monetization paths with pricing tiers and action steps, and strategic insights. Respond ONLY with valid JSON.`;

    const userPrompt = `PROJECT:
Title: ${sampleProject.title}
Description: ${sampleProject.description}
Tech Stack: ${sampleProject.techStack.join(", ")}
Target Audience: ${sampleProject.targetAudience}
Preferred Revenue Style: ${sampleProject.preferredRevenue}

Generate JSON with:
- evaluation: { realWorldValueScore (1.0-10.0), verdict, verdictEmoji, scorecard (10 dimensions: marketSize, problemSeverity, uniqueness, feasibility, monetizationPotential, scalability, timeToRevenue, competitiveMoat, founderFit, trendAlignment each with label, score, summary), revenueEstimate (conservative, realistic, optimistic, timeframe, assumptions), overallInsights }
- paths: array of 3-5 monetization models with id, model, emoji, targetUsers, pricing, pricingTiers, steps, whyItFits, confidence, estimatedMRR, timeToFirstDollar, marketTrendAlignment
- strategicInsights: { strengths, weaknesses, secretWeapon, quickWin }
- overallInsights

JSON only.`;

    try {
        const completion = await groq.chat.completions.create({
            model: modelName,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_completion_tokens: 4096,
        });

        const raw = completion.choices?.[0]?.message?.content;
        if (!raw) throw new Error("Empty response from Groq");

        const parsed = JSON.parse(raw);
        console.log("[PASS] Groq returned valid JSON completion");

        // Validate structure
        if (!parsed.evaluation || typeof parsed.evaluation.realWorldValueScore !== "number") {
            throw new Error("Missing or invalid evaluation.realWorldValueScore");
        }
        console.log(`[PASS] Real-World Value Score: ${parsed.evaluation.realWorldValueScore}/10 (${parsed.evaluation.verdict})`);

        if (!parsed.evaluation.scorecard || Object.keys(parsed.evaluation.scorecard).length < 5) {
            throw new Error("Scorecard is missing required viability dimensions");
        }
        console.log(`[PASS] Viability Scorecard verified (${Object.keys(parsed.evaluation.scorecard).length} dimensions)`);

        if (!Array.isArray(parsed.paths) || parsed.paths.length === 0) {
            throw new Error("Monetization paths array is empty");
        }
        console.log(`[PASS] Monetization Paths generated: ${parsed.paths.length} paths`);
        parsed.paths.forEach((p, idx) => {
            console.log(`       ${idx + 1}. ${p.emoji || "•"} ${p.model} (${p.pricing || "Pricing N/A"})`);
        });

        if (!parsed.strategicInsights || !Array.isArray(parsed.strategicInsights.strengths)) {
            throw new Error("Strategic insights are missing or invalid");
        }
        console.log("[PASS] Strategic Insights verified (Strengths, Risks, Secret Weapon, Quick Win)");

        console.log("\n--------------------------------------------------");
        console.log("Status: END-TO-END GROQ ANALYSIS PASSED");
        console.log("--------------------------------------------------\n");
    } catch (err) {
        console.error("\n[FAIL] End-to-end analysis failed:", err.message);
        process.exit(1);
    }
}

runEndToEndAnalysisTest();
