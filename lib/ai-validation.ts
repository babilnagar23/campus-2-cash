import { AnalysisResponse, Scorecard, MonetizationPath, ConfidenceLevel, RevenueTierValue, PricingTier } from "@/types";
import { formatRevenue, formatPricingDisplay } from "./utils";

// ── Strict JSON Schema for Groq Structured Outputs ───────────
export const CAMPUS_ANALYSIS_JSON_SCHEMA = {
    name: "campus_project_analysis",
    strict: true,
    schema: {
        type: "object",
        additionalProperties: false,
        required: ["evaluation", "paths", "strategicInsights", "overallInsights"],
        properties: {
            evaluation: {
                type: "object",
                additionalProperties: false,
                required: [
                    "realWorldValueScore",
                    "verdict",
                    "verdictEmoji",
                    "scorecard",
                    "revenueEstimate",
                    "overallInsights",
                ],
                properties: {
                    realWorldValueScore: {
                        type: "number",
                        description: "Overall commercial score from 1.0 to 10.0, rounded to 1 decimal",
                    },
                    verdict: {
                        type: "string",
                        description: "Verdict rubric label",
                    },
                    verdictEmoji: {
                        type: "string",
                        description: "Emoji associated with the verdict",
                    },
                    scorecard: {
                        type: "object",
                        description: "10 viability dimensions",
                    },
                    revenueEstimate: {
                        type: "object",
                        description: "3 revenue tiers (conservative, realistic, optimistic)",
                    },
                    overallInsights: { type: "string" },
                },
            },
            paths: {
                type: "array",
                description: "3 to 5 tailored monetization models",
                items: {
                    type: "object",
                },
            },
            strategicInsights: {
                type: "object",
                description: "Founder strategy and insights",
            },
            overallInsights: { type: "string" },
        },
    },
};

// ── Clean JSON string extraction helper ───────────────────────
export function cleanAndExtractJSON(raw: string): string {
    if (!raw) return "{}";
    const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (fenceMatch) return fenceMatch[1].trim();

    const braceStart = raw.indexOf("{");
    const braceEnd = raw.lastIndexOf("}");
    if (braceStart !== -1 && braceEnd !== -1 && braceEnd > braceStart) {
        return raw.slice(braceStart, braceEnd + 1).trim();
    }
    return raw.trim();
}

function clampScore(val: unknown, fallback = 6): number {
    const num = typeof val === "number" ? val : parseFloat(String(val));
    if (isNaN(num)) return fallback;
    return Math.max(1, Math.min(10, Math.round(num * 10) / 10));
}

export function getVerdictForScore(score: number): { verdict: string; emoji: string } {
    if (score >= 8.5) return { verdict: "Investor-Ready", emoji: "🚀" };
    if (score >= 7.0) return { verdict: "Strong Potential", emoji: "⚡" };
    if (score >= 5.5) return { verdict: "Solid Foundation", emoji: "🌱" };
    if (score >= 4.0) return { verdict: "Needs Refinement", emoji: "🔨" };
    return { verdict: "Back to Drawing Board", emoji: "💡" };
}

function normalizeRevenueTier(val: unknown, fallbackMonthly: string, fallbackAnnual: string): RevenueTierValue {
    if (!val) {
        return { monthly: fallbackMonthly, annual: fallbackAnnual };
    }

    if (typeof val === "object" && val !== null) {
        const obj = val as Record<string, unknown>;
        const monthly = obj.monthly !== undefined ? String(obj.monthly) : fallbackMonthly;
        const annual = obj.annual !== undefined ? String(obj.annual) : fallbackAnnual;
        return {
            monthly: formatRevenue(monthly).monthly || fallbackMonthly,
            annual: formatRevenue(annual).monthly || fallbackAnnual,
        };
    }

    const str = String(val).trim();
    const parsed = formatRevenue(str);
    return {
        monthly: parsed.monthly || fallbackMonthly,
        annual: parsed.annual || fallbackAnnual,
    };
}

// ── Comprehensive Validation & Normalization ───────────────────
export function validateAndNormalizeResponse(rawText: string): AnalysisResponse {
    const cleaned = cleanAndExtractJSON(rawText);
    let parsed: any;
    try {
        parsed = JSON.parse(cleaned);
    } catch (parseErr) {
        console.error("JSON parse failure on raw Groq AI output:", rawText.slice(0, 500));
        throw new Error("AI provider returned invalid JSON format. Please retry the analysis.");
    }

    if (!parsed || typeof parsed !== "object" || !parsed.evaluation) {
        throw new Error("AI response structure is missing the required evaluation payload.");
    }

    const evalObj = parsed.evaluation;

    // Validate 10-dimension scorecard (Supports both Object format and Array format)
    const rawSc = evalObj.scorecard || {};
    const scorecardKeys: (keyof Scorecard)[] = [
        "marketSize",
        "problemSeverity",
        "uniqueness",
        "feasibility",
        "monetizationPotential",
        "scalability",
        "timeToRevenue",
        "competitiveMoat",
        "founderFit",
        "trendAlignment",
    ];

    const defaultLabels: Record<keyof Scorecard, string> = {
        marketSize: "Market Size & Demand",
        problemSeverity: "Problem Severity",
        uniqueness: "Uniqueness & Differentiation",
        feasibility: "Technical Feasibility",
        monetizationPotential: "Monetization Potential",
        scalability: "Scalability",
        timeToRevenue: "Time-to-Revenue",
        competitiveMoat: "Competitive Moat",
        founderFit: "Student Founder Fit",
        trendAlignment: "2026 Trend Alignment",
    };

    const normalizedScorecard: Partial<Scorecard> = {};
    let dimensionSum = 0;

    for (const key of scorecardKeys) {
        let item: any = {};
        if (Array.isArray(rawSc)) {
            item =
                rawSc.find(
                    (el: any) =>
                        el &&
                        (el.label?.toLowerCase() === key.toLowerCase() ||
                            el.label?.toLowerCase()?.includes(key.toLowerCase()) ||
                            el.dimension?.toLowerCase() === key.toLowerCase())
                ) || {};
        } else if (typeof rawSc === "object") {
            item = rawSc[key] || rawSc[defaultLabels[key]] || {};
        }

        const score = clampScore(item.score, 6.5);
        dimensionSum += score;
        normalizedScorecard[key] = {
            label: item.label || defaultLabels[key],
            score,
            summary: item.summary || `${defaultLabels[key]} evaluated based on project specifications.`,
        };
    }

    const calculatedMasterScore = Math.round((dimensionSum / 10) * 10) / 10;
    const rawScore = typeof evalObj.realWorldValueScore === "number" ? evalObj.realWorldValueScore : calculatedMasterScore;
    const finalScore = Math.abs(rawScore - calculatedMasterScore) <= 1.0 ? rawScore : calculatedMasterScore;

    const verdictMeta = getVerdictForScore(finalScore);

    // Backward-compatible 5 dimensions for EvaluationPanel
    const dims = evalObj.dimensions || {
        marketSize: normalizedScorecard.marketSize,
        uniqueness: normalizedScorecard.uniqueness,
        feasibility: normalizedScorecard.feasibility,
        monetizationPotential: normalizedScorecard.monetizationPotential,
        executionRisk: {
            label: "Execution Risk & Timeline",
            score: Math.max(1, Math.min(10, 11 - (normalizedScorecard.feasibility?.score || 6))),
            summary: normalizedScorecard.feasibility?.summary || "Manageable execution risk.",
        },
    };

    // Revenue estimate normalization (guaranteed safe structured values)
    const rawRev = evalObj.revenueEstimate || {};
    const conservativeTier = normalizeRevenueTier(rawRev.conservative, "₹10,000", "₹120,000");
    const realisticTier = normalizeRevenueTier(rawRev.realistic, "₹50,000", "₹600,000");
    const optimisticTier = normalizeRevenueTier(rawRev.optimistic, "₹200,000", "₹2,400,000");

    const revenueEstimate = {
        conservative: conservativeTier,
        realistic: realisticTier,
        optimistic: optimisticTier,
        annualConservative: rawRev.annualConservative || conservativeTier.annual,
        annualRealistic: rawRev.annualRealistic || realisticTier.annual,
        annualOptimistic: rawRev.annualOptimistic || optimisticTier.annual,
        timeframe: typeof rawRev.timeframe === "string" ? rawRev.timeframe : "First 12 Months",
        assumptions:
            typeof rawRev.assumptions === "string"
                ? rawRev.assumptions
                : "Based on organic campus acquisition and standard student-tier SaaS conversion rates.",
    };

    // Monetization paths normalization
    const rawPaths = Array.isArray(parsed.paths) && parsed.paths.length > 0 ? parsed.paths : [];
    if (rawPaths.length === 0) {
        throw new Error("AI response did not contain any valid monetization paths.");
    }

    const normalizedPaths: MonetizationPath[] = rawPaths.map((p: any, idx: number) => {
        // Safe pricing string
        const pricingDisplay = formatPricingDisplay(p.pricing);

        // Safe estimated MRR string
        let mrrDisplay = "₹25,000–₹75,000";
        if (p.estimatedMRR !== undefined && p.estimatedMRR !== null) {
            if (typeof p.estimatedMRR === "object") {
                const parsedRev = formatRevenue(p.estimatedMRR);
                mrrDisplay = `${parsedRev.monthly}/mo`;
            } else if (typeof p.estimatedMRR === "number") {
                mrrDisplay = `₹${p.estimatedMRR.toLocaleString()}/mo`;
            } else {
                mrrDisplay = String(p.estimatedMRR);
            }
        }

        // Safe pricing tiers
        const pricingTiers: PricingTier[] = Array.isArray(p.pricingTiers) && p.pricingTiers.length > 0
            ? p.pricingTiers.map((t: any) => ({
                  name: typeof t.name === "string" ? t.name : "Tier",
                  price: formatPricingDisplay(t.price),
                  features: Array.isArray(t.features)
                      ? t.features.map(String).filter(Boolean)
                      : typeof t.features === "string"
                      ? [t.features]
                      : ["Standard access"],
              }))
            : [
                  { name: "Free Tier", price: "₹0/mo", features: ["Essential features"] },
                  { name: "Pro Tier", price: "₹399/mo", features: ["Full access", "Priority support"] },
              ];

        // Safe steps
        const steps = Array.isArray(p.steps) && p.steps.length > 0
            ? p.steps.map(String).filter(Boolean)
            : ["Validate demand with 10 target users", "Build lightweight prototype", "Launch beta cohort"];

        return {
            id: p.id ? String(p.id) : `path-${idx + 1}`,
            model: typeof p.model === "string" ? p.model : `Monetization Strategy ${idx + 1}`,
            emoji: typeof p.emoji === "string" ? p.emoji : "💡",
            targetUsers: typeof p.targetUsers === "string" ? p.targetUsers : "Core target audience",
            secondaryUsers: typeof p.secondaryUsers === "string" ? p.secondaryUsers : undefined,
            pricing: pricingDisplay,
            pricingTiers,
            steps,
            whyItFits: typeof p.whyItFits === "string" ? p.whyItFits : "Directly leverages the project tech stack.",
            confidence: (["Low", "Medium", "High"].includes(p.confidence)
                ? p.confidence
                : "Medium") as ConfidenceLevel,
            confidenceReason: typeof p.confidenceReason === "string" ? p.confidenceReason : undefined,
            estimatedMRR: mrrDisplay,
            timeToFirstDollar: typeof p.timeToFirstDollar === "string" ? p.timeToFirstDollar : "3–4 weeks",
            marketTrendAlignment:
                typeof p.marketTrendAlignment === "string"
                    ? p.marketTrendAlignment
                    : "Aligned with modern micro-SaaS and AI agent ecosystem trends",
        };
    });

    // Strategic insights normalization
    const rawSi = parsed.strategicInsights || {};
    const strengths = Array.isArray(rawSi.strengths) && rawSi.strengths.length > 0
        ? rawSi.strengths.map(String).filter(Boolean).slice(0, 4)
        : ["Addresses an authentic student pain point", "Leverages accessible modern technologies"];
    const weaknesses = Array.isArray(rawSi.weaknesses) && rawSi.weaknesses.length > 0
        ? rawSi.weaknesses.map(String).filter(Boolean).slice(0, 4)
        : ["Requires initial user acquisition validation", "High competition in generic tool segment"];
    const secretWeapon =
        typeof rawSi.secretWeapon === "string"
            ? rawSi.secretWeapon
            : "Direct, organic access to university campus peers for rapid user testing.";
    const quickWin =
        typeof rawSi.quickWin === "string"
            ? rawSi.quickWin
            : "Interview 5 target users this week to validate willingness to pay.";

    const strategicInsights = {
        strengths,
        weaknesses,
        secretWeapon,
        quickWin,
    };

    const overallInsights =
        typeof parsed.overallInsights === "string"
            ? parsed.overallInsights
            : typeof evalObj.overallInsights === "string"
            ? evalObj.overallInsights
            : "Your project demonstrates real-world commercial potential.";

    return {
        evaluation: {
            realWorldValueScore: finalScore,
            verdict: evalObj.verdict || verdictMeta.verdict,
            verdictEmoji: evalObj.verdictEmoji || verdictMeta.emoji,
            scorecard: normalizedScorecard as Scorecard,
            dimensions: dims,
            revenueEstimate,
            overallInsights,
        },
        paths: normalizedPaths,
        strategicInsights,
        overallInsights,
        generatedAt: new Date().toISOString(),
    };
}
