import { MARKET_TRENDS_2026 } from "./market-trends-2026";
import { ProjectInput } from "@/types";

// ============================================================
// SYSTEM & USER PROMPT BUILDERS — Groq (openai/gpt-oss-20b)
// ============================================================

export function buildSystemPrompt(): string {
    return `You are an elite AI startup mentor, commercialization strategist, and venture analyst operating in 2026.
Your role is to give student founders and hackathon innovators a rigorous, honest, and actionable commercial assessment of their project.

CRITICAL OPERATING PRINCIPLES:
1. SPECIFIC & ACTIONABLE: Never provide vague or generic business advice. Reference concrete customer segments, actual platforms, realistic pricing benchmarks, and zero-budget actions the student can take this week.
2. BRUTALLY HONEST: Score dimensions objectively. If a project has weak defensibility, fierce competition, or execution risks, articulate them clearly with constructive solutions.
3. GROUNDED IN 2026 DATA: Base your analysis on contemporary market dynamics, micro-SaaS economics, AI automation workflows, and student founder advantages.
4. STRICT JSON OUTPUT: Respond ONLY with a valid, parseable JSON object matching the requested schema. Do not include markdown code block formatting, introductory text, or concluding commentary.

---
${MARKET_TRENDS_2026}
---

EVALUATION RUBRIC (10 Dimensions, each scored 1.0–10.0):
1. Market Size & Demand — Addressable student/professional audience and proven willingness to pay in 2026.
2. Problem Severity — How acute is the pain point? Is it a "vitamin" (nice to have) or a "painkiller" (urgent need)?
3. Uniqueness & Differentiation — Real moats and technical/distribution differentiation versus existing solutions.
4. Technical Feasibility — Can a student team realistically build and maintain a working version in 30–60 days?
5. Monetization Potential — How naturally does the product support subscriptions, usage fees, or enterprise sales?
6. Scalability — Can the architecture scale to 10,000+ users without fundamental re-engineering?
7. Time-to-Revenue — How quickly can the founder collect their first dollar? (10 = within 7 days).
8. Competitive Moat — How defensible is this against an existing incumbent or clone copying it in 90 days?
9. Student Founder Fit — How uniquely suited is the student team (campus access, agility, domain proximity)?
10. Trend Alignment — How strongly does the project leverage current AI agent, micro-SaaS, or edge trends?

Master Real-World Value Score = (Sum of all 10 dimension scores) / 10, rounded to 1 decimal place.

Verdict Rubric:
- 8.5–10.0: "Investor-Ready" 🚀
- 7.0–8.4: "Strong Potential" ⚡
- 5.5–6.9: "Solid Foundation" 🌱
- 4.0–5.4: "Needs Refinement" 🔨
- 1.0–3.9: "Back to Drawing Board" 💡`;
}

export function buildUserPrompt(input: ProjectInput, extractedDocText?: string): string {
    const techStackStr = input.techStack && input.techStack.length > 0 ? input.techStack.join(", ") : "Not specified";

    const documentContext = extractedDocText
        ? `\n\n<SUPPORTING_DOCUMENTS>\n${extractedDocText.slice(0, 5000)}\n</SUPPORTING_DOCUMENTS>`
        : "";

    return `Analyze the following student project and produce a comprehensive commercialization report.

PROJECT DETAILS:
- Title: ${input.title}
- Description: ${input.description}
- Tech Stack: ${techStackStr}
- Target Audience: ${input.targetAudience || "Infer from project description"}
- Target Region: ${input.targetCountry || "Global"}
- Preferred Revenue Model: ${input.preferredRevenue || "Any viable model"}
- Known Competitors: ${input.knownCompetitors || "None specified"}
${input.githubUrl ? `- GitHub Repository: ${input.githubUrl}` : ""}${documentContext}

Generate a comprehensive commercialization analysis.
OUTPUT A SINGLE VALID JSON OBJECT MATCHING THIS EXACT SCHEMA:
{
  "evaluation": {
    "realWorldValueScore": 7.5,
    "verdict": "Strong Potential",
    "verdictEmoji": "⚡",
    "scorecard": {
      "marketSize": { "label": "Market Size & Demand", "score": 8.0, "summary": "..." },
      "problemSeverity": { "label": "Problem Severity", "score": 7.5, "summary": "..." },
      "uniqueness": { "label": "Uniqueness & Differentiation", "score": 7.0, "summary": "..." },
      "feasibility": { "label": "Technical Feasibility", "score": 8.5, "summary": "..." },
      "monetizationPotential": { "label": "Monetization Potential", "score": 7.5, "summary": "..." },
      "scalability": { "label": "Scalability", "score": 8.0, "summary": "..." },
      "timeToRevenue": { "label": "Time-to-Revenue", "score": 7.0, "summary": "..." },
      "competitiveMoat": { "label": "Competitive Moat", "score": 6.5, "summary": "..." },
      "founderFit": { "label": "Student Founder Fit", "score": 8.0, "summary": "..." },
      "trendAlignment": { "label": "2026 Trend Alignment", "score": 8.5, "summary": "..." }
    },
    "revenueEstimate": {
      "conservative": { "monthly": "₹15,000", "annual": "₹1,80,000" },
      "realistic": { "monthly": "₹60,000", "annual": "₹7,20,000" },
      "optimistic": { "monthly": "₹2,50,000", "annual": "₹30,00,000" },
      "timeframe": "First 12 Months",
      "assumptions": "..."
    },
    "overallInsights": "..."
  },
  "paths": [
    {
      "id": "path-1",
      "model": "Freemium Campus SaaS",
      "emoji": "💎",
      "targetUsers": "College students",
      "pricing": "Free basic, ₹399/mo premium",
      "pricingTiers": [
        { "name": "Free Tier", "price": "₹0/mo", "features": ["Core features"] },
        { "name": "Pro Tier", "price": "₹399/mo", "features": ["Full access", "Priority support"] }
      ],
      "steps": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
      "whyItFits": "...",
      "confidence": "High",
      "confidenceReason": "...",
      "estimatedMRR": "₹50,000/mo",
      "timeToFirstDollar": "2-3 weeks",
      "marketTrendAlignment": "..."
    }
  ],
  "strategicInsights": {
    "strengths": ["...", "...", "..."],
    "weaknesses": ["...", "...", "..."],
    "secretWeapon": "...",
    "quickWin": "..."
  },
  "overallInsights": "..."
}

OUTPUT VALID JSON ONLY.`;
}

export function buildRefineSystemPrompt(): string {
    return `You are an elite startup mentor refining an existing monetization analysis based on direct feedback from a student founder.
Maintain the same JSON structure. Keep existing scorecard evaluation scores identical unless the founder's feedback specifically challenges an assumption.
Substantially revise the monetization paths, pricing tiers, action steps, and strategic advice to directly align with the founder's new constraints (e.g. zero-budget, B2B enterprise, regional focus like India, passive SaaS).

OUTPUT VALID JSON ONLY. NO COMMENTARY.`;
}

export function buildRefineUserPrompt(
    originalJson: string,
    feedback: string,
    input: ProjectInput
): string {
    return `STUDENT FOUNDER FEEDBACK:
"${feedback}"

PROJECT TITLE: ${input.title}
TECH STACK: ${input.techStack.join(", ")}
PREFERRED REVENUE: ${input.preferredRevenue || "Any"}

ORIGINAL ANALYSIS:
${originalJson.slice(0, 3500)}

Regenerate the complete analysis incorporating the founder's feedback. Keep the scorecard consistent, but produce updated, customized monetization paths and founder insights.

OUTPUT VALID JSON ONLY.`;
}
