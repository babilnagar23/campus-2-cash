// ============================================================
// Extended TypeScript interfaces — Campus-2-Cash (Groq openai/gpt-oss-20b)
// ============================================================

export interface ProjectInput {
    title: string;
    description: string;
    techStack: string[];
    files?: File[];
    targetAudience?: string;
    targetCountry?: string;
    preferredRevenue?: "passive" | "active" | "b2b" | "any";
    knownCompetitors?: string;
    githubUrl?: string;
}

// ── Scorecard (10 dimensions) ──────────────────────────────
export interface ScorecardDimension {
    label: string;
    score: number; // 1–10
    summary: string;
}

export interface Scorecard {
    marketSize: ScorecardDimension;
    problemSeverity: ScorecardDimension;
    uniqueness: ScorecardDimension;
    feasibility: ScorecardDimension;
    monetizationPotential: ScorecardDimension;
    scalability: ScorecardDimension;
    timeToRevenue: ScorecardDimension;
    competitiveMoat: ScorecardDimension;
    founderFit: ScorecardDimension;
    trendAlignment: ScorecardDimension;
}

// ── Legacy 5-dimension (backward-compat for EvaluationPanel) ────
export interface DimensionScore {
    label: string;
    score: number;
    summary: string;
}

// ── Revenue Scenario (supports string or { monthly, annual }) ──
export interface RevenueTierValue {
    monthly: string;
    annual: string;
}

export interface RevenueEstimate {
    conservative: string | RevenueTierValue;
    realistic: string | RevenueTierValue;
    optimistic: string | RevenueTierValue;
    annualConservative?: string;
    annualRealistic?: string;
    annualOptimistic?: string;
    timeframe: string;
    assumptions?: string;
}

export interface EvaluationResult {
    realWorldValueScore: number; // 1–10
    verdict: string;
    verdictEmoji: string;
    // Full 10-dimension scorecard
    scorecard?: Scorecard;
    // Legacy 5 dimensions (backward-compat for EvaluationPanel)
    dimensions: {
        marketSize: DimensionScore;
        uniqueness: DimensionScore;
        feasibility: DimensionScore;
        monetizationPotential: DimensionScore;
        executionRisk: DimensionScore;
    };
    revenueEstimate: RevenueEstimate;
    overallInsights: string;
}

export type ConfidenceLevel = "Low" | "Medium" | "High";

export interface PricingTier {
    name: string;
    price: string | RevenueTierValue | number;
    features: string[];
}

export interface MonetizationPath {
    id: string;
    model: string;
    emoji: string;
    targetUsers: string;
    secondaryUsers?: string;
    pricing: string | RevenueTierValue;
    pricingTiers: PricingTier[];
    steps: string[];
    whyItFits: string;
    confidence: ConfidenceLevel;
    confidenceReason?: string;
    estimatedMRR?: string | RevenueTierValue | number;
    timeToFirstDollar?: string;
    marketTrendAlignment: string;
}

export interface StrategicInsights {
    strengths: string[];
    weaknesses: string[];
    secretWeapon: string;
    quickWin: string;
}

export interface AnalysisResponse {
    evaluation: EvaluationResult;
    paths: MonetizationPath[];
    strategicInsights?: StrategicInsights;
    overallInsights: string;
    generatedAt: string;
}

export interface RefineRequest {
    originalResponse: AnalysisResponse;
    projectInput: ProjectInput;
    userFeedback: string;
}

export interface SampleProject {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    targetAudience: string;
    preferredRevenue: ProjectInput["preferredRevenue"];
    emoji: string;
}
