"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    RefreshCw,
    Sparkles,
    TrendingUp,
    Brain,
    Layers,
    AlertCircle,
    PlusCircle,
    Compass,
    CheckCircle2,
    DollarSign,
} from "lucide-react";
import { AnalysisResponse, ProjectInput, MonetizationPath } from "@/types";
import {
    loadFromLocalStorage,
    saveToLocalStorage,
    getVerdictColor,
    getScoreColor,
    formatRevenueDisplay,
    formatAnnualRevenueDisplay,
    safeRenderString,
} from "@/lib/utils";
import { EvaluationPanel } from "@/components/EvaluationPanel";
import { ScorecardPanel } from "@/components/ScorecardPanel";
import { MonetizationCard } from "@/components/MonetizationCard";
import { RefineModal } from "@/components/RefineModal";
import { ExportButton } from "@/components/ExportButton";
import { StrategicInsightsCard } from "@/components/StrategicInsightsCard";
import { SAMPLE_PROJECTS } from "@/lib/sample-projects";

type TabId = "overview" | "scorecard" | "paths" | "strategy";

export default function DashboardPage() {
    const router = useRouter();
    const [result, setResult] = useState<AnalysisResponse | null>(null);
    const [projectInput, setProjectInput] = useState<ProjectInput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refineOpen, setRefineOpen] = useState(false);
    const [refineCount, setRefineCount] = useState(0);
    const [activeTab, setActiveTab] = useState<TabId>("overview");

    useEffect(() => {
        try {
            const savedResult = loadFromLocalStorage<AnalysisResponse>("c2c_result");
            const savedInput = loadFromLocalStorage<ProjectInput>("c2c_input");

            if (savedResult && savedInput && savedResult.evaluation) {
                setResult(savedResult);
                setProjectInput(savedInput);
            }
        } catch (e) {
            console.error("Failed to load saved analysis from localStorage:", e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    function handleRefined(newResult: AnalysisResponse) {
        setResult(newResult);
        saveToLocalStorage("c2c_result", newResult);
        setRefineCount((prev) => prev + 1);
    }

    // ── Loading State ──────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#080B09] flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#B7F36B]/20 border border-[#B7F36B]/40 animate-pulse mx-auto flex items-center justify-center text-[#B7F36B]">
                        <Sparkles className="w-6 h-6 animate-spin" />
                    </div>
                    <p className="text-xs sm:text-sm text-[#929B93]">Loading analysis workspace...</p>
                </div>
            </div>
        );
    }

    // ── Safe Empty / Recovery State ────────────────────────────
    if (!result || !projectInput) {
        return (
            <div className="min-h-screen bg-[#080B09] text-[#F4F7F2] flex items-center justify-center p-4">
                <div className="max-w-md w-full gradient-border bg-[#111713] rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
                    <div className="w-12 h-12 rounded-2xl bg-[#172019] border border-[#27332B] flex items-center justify-center text-[#B7F36B] mx-auto">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-[#F4F7F2]">No Active Analysis Found</h2>
                        <p className="text-xs sm:text-sm text-[#929B93] mt-2 leading-relaxed">
                            No project evaluation is currently stored in your browser session. Start a new analysis or explore one of our pre-configured demo projects.
                        </p>
                    </div>

                    <div className="space-y-2.5 pt-2">
                        <button
                            type="button"
                            onClick={() => router.push("/dashboard/input")}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#B7F36B] hover:bg-[#a5e754] text-[#080B09] font-bold text-sm shadow-lime-glow-sm transition-all"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Start a New Analysis</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const sample = SAMPLE_PROJECTS[0];
                                if (typeof window !== "undefined") {
                                    localStorage.setItem("selectedSample", sample.id);
                                }
                                router.push("/dashboard/input");
                            }}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#172019] hover:bg-[#27332B] border border-[#27332B] text-[#F4F7F2] font-semibold text-xs sm:text-sm transition-all"
                        >
                            <span>Load Sample: {SAMPLE_PROJECTS[0].title}</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
        { id: "overview", label: "Overview", icon: <TrendingUp className="w-3.5 h-3.5" /> },
        { id: "scorecard", label: "10-Dimension Scorecard", icon: <Layers className="w-3.5 h-3.5" /> },
        { id: "paths", label: `Monetization Paths (${result.paths.length})`, icon: <Compass className="w-3.5 h-3.5" /> },
        ...(result.strategicInsights
            ? [{ id: "strategy" as TabId, label: "Founder Strategy", icon: <Brain className="w-3.5 h-3.5" /> }]
            : []),
    ];

    const score = result.evaluation.realWorldValueScore || 0;

    return (
        <div className="min-h-screen bg-[#080B09] text-[#F4F7F2]">
            {/* Sticky Navigation Header */}
            <header className="sticky top-0 z-30 backdrop-blur-md bg-[#080B09]/90 border-b border-[#27332B]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
                    {/* Left: Brand & Project Name */}
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            type="button"
                            onClick={() => router.push("/dashboard/input")}
                            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#929B93] hover:text-[#B7F36B] transition-colors flex-shrink-0"
                            aria-label="New Analysis"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>New</span>
                        </button>
                        <span className="text-[#27332B]">|</span>
                        <div className="w-6 h-6 rounded-md bg-[#172019] border border-[#27332B] flex items-center justify-center font-bold text-[10px] text-[#B7F36B] flex-shrink-0">
                            C2C
                        </div>
                        <h1 className="font-bold text-[#F4F7F2] text-sm sm:text-base truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                            {projectInput.title}
                        </h1>
                        {refineCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#B7F36B]/15 text-[#B7F36B] border border-[#B7F36B]/30 flex-shrink-0">
                                ×{refineCount} refined
                            </span>
                        )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <ExportButton result={result} projectInput={projectInput} />
                        <button
                            type="button"
                            onClick={() => setRefineOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#172019] hover:bg-[#B7F36B]/15 border border-[#27332B] hover:border-[#B7F36B]/40 text-[#F4F7F2] hover:text-[#B7F36B] text-xs sm:text-sm font-semibold transition-all"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-[#B7F36B]" />
                            <span>Refine</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/dashboard/input")}
                            title="Reset and start new analysis"
                            aria-label="Reset analysis"
                            className="flex items-center justify-center p-2 rounded-xl border border-[#27332B] bg-[#111713] text-[#929B93] hover:text-[#F4F7F2] hover:border-[#B7F36B]/40 transition-all"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                {/* Hero Summary Banner */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="gradient-border bg-[#111713] rounded-2xl p-5 sm:p-6 shadow-card-subtle"
                >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        {/* Score Circle & Verdict */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                            <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                                <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
                                    <circle cx="40" cy="40" r="34" fill="none" stroke="#172019" strokeWidth="6" />
                                    <circle
                                        cx="40"
                                        cy="40"
                                        r="34"
                                        fill="none"
                                        stroke="url(#dashLimeGrad)"
                                        strokeWidth="6"
                                        strokeLinecap="round"
                                        strokeDasharray={2 * Math.PI * 34}
                                        strokeDashoffset={2 * Math.PI * 34 * (1 - Math.min(10, Math.max(0, score)) / 10)}
                                    />
                                    <defs>
                                        <linearGradient id="dashLimeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#B7F36B" />
                                            <stop offset="100%" stopColor="#64C995" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-xl font-extrabold ${getScoreColor(score)}`}>
                                        {score.toFixed(1)}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{result.evaluation.verdictEmoji || "⚡"}</span>
                                    <h2 className={`text-lg sm:text-xl font-bold ${getVerdictColor(score)}`}>
                                        {result.evaluation.verdict}
                                    </h2>
                                </div>
                                <p className="text-xs text-[#929B93] mt-0.5">
                                    Real-World Commercial Value Score
                                </p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden lg:block w-px h-14 bg-[#27332B]" />

                        {/* Revenue at a Glance */}
                        <div className="w-full lg:w-auto flex-1 grid grid-cols-3 gap-3">
                            {[
                                {
                                    label: "Conservative",
                                    val: result.evaluation.revenueEstimate.conservative,
                                    color: "text-[#FB923C]",
                                },
                                {
                                    label: "Realistic",
                                    val: result.evaluation.revenueEstimate.realistic,
                                    color: "text-[#FCD34D]",
                                },
                                {
                                    label: "Optimistic",
                                    val: result.evaluation.revenueEstimate.optimistic,
                                    color: "text-[#B7F36B]",
                                },
                            ].map((r) => {
                                const monthly = formatRevenueDisplay(r.val);
                                const annual = formatAnnualRevenueDisplay(r.val);
                                return (
                                    <div
                                        key={r.label}
                                        className="text-center p-3 rounded-xl bg-[#080B09]/70 border border-[#27332B]"
                                    >
                                        <div className={`text-xs sm:text-sm font-bold ${r.color} truncate`}>
                                            {monthly}
                                        </div>
                                        <div className="text-[10px] sm:text-xs text-[#929B93] mt-0.5">
                                            {r.label} / mo
                                            {annual && (
                                                <span className="block text-[9px] opacity-75">
                                                    ({annual}/yr)
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Divider */}
                        <div className="hidden lg:block w-px h-14 bg-[#27332B]" />

                        {/* Quick Insights Blurb */}
                        <div className="w-full lg:max-w-xs text-xs text-[#929B93] leading-relaxed line-clamp-3">
                            <span className="text-[#F4F7F2] font-semibold block mb-0.5">Key Takeaway:</span>
                            {safeRenderString(result.overallInsights || result.evaluation.overallInsights)}
                        </div>
                    </div>
                </motion.div>

                {/* Navigation Tabs Bar */}
                <div className="flex gap-1.5 p-1 bg-[#111713] border border-[#27332B] rounded-xl overflow-x-auto">
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                                    isActive
                                        ? "bg-[#B7F36B] text-[#080B09] shadow-lime-glow-sm"
                                        : "text-[#929B93] hover:text-[#F4F7F2] hover:bg-[#172019]"
                                }`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content Display */}
                <div>
                    {/* Tab 1: Overview */}
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
                            <div>
                                <EvaluationPanel evaluation={result.evaluation} />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-[#F4F7F2] flex items-center gap-2">
                                        <Compass className="w-4 h-4 text-[#B7F36B]" />
                                        Recommended Monetization Models
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("paths")}
                                        className="text-xs text-[#B7F36B] hover:underline font-semibold"
                                    >
                                        View all {result.paths.length} paths →
                                    </button>
                                </div>
                                {result.paths.slice(0, 2).map((path: MonetizationPath, i: number) => (
                                    <MonetizationCard key={path.id || i} path={path} index={i} />
                                ))}
                                {result.paths.length > 2 && (
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("paths")}
                                        className="w-full py-3.5 border border-dashed border-[#27332B] hover:border-[#B7F36B]/50 rounded-xl text-xs sm:text-sm font-semibold text-[#929B93] hover:text-[#F4F7F2] hover:bg-[#111713] transition-all"
                                    >
                                        + {result.paths.length - 2} more monetization models available →
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tab 2: 10-Dimension Scorecard */}
                    {activeTab === "scorecard" && (
                        <div>
                            {result.evaluation.scorecard ? (
                                <ScorecardPanel
                                    scorecard={result.evaluation.scorecard}
                                    totalScore={result.evaluation.realWorldValueScore}
                                />
                            ) : (
                                <EvaluationPanel evaluation={result.evaluation} />
                            )}
                        </div>
                    )}

                    {/* Tab 3: Monetization Paths */}
                    {activeTab === "paths" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {result.paths.map((path: MonetizationPath, i: number) => (
                                <MonetizationCard key={path.id || i} path={path} index={i} />
                            ))}
                        </div>
                    )}

                    {/* Tab 4: Strategy */}
                    {activeTab === "strategy" && result.strategicInsights && (
                        <div className="max-w-3xl mx-auto">
                            <StrategicInsightsCard insights={result.strategicInsights} />
                        </div>
                    )}
                </div>

                {/* Bottom Refine CTA Card */}
                <div className="pt-8 pb-4 flex justify-center">
                    <div className="gradient-border bg-[#111713] rounded-2xl p-6 text-center max-w-md w-full space-y-3 shadow-card-subtle">
                        <div className="w-10 h-10 rounded-xl bg-[#172019] border border-[#27332B] flex items-center justify-center text-[#B7F36B] mx-auto">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-[#F4F7F2] text-sm sm:text-base">
                            Want to Refine These Suggestions?
                        </h3>
                        <p className="text-xs text-[#929B93] leading-relaxed">
                            Give the AI mentor direct guidance on market preference, pricing, or zero-budget constraints to regenerate all models.
                        </p>
                        <div className="pt-1">
                            <button
                                type="button"
                                onClick={() => setRefineOpen(true)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B7F36B] hover:bg-[#a5e754] text-[#080B09] font-bold text-xs sm:text-sm shadow-lime-glow-sm transition-all"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Refine Suggestions</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Attribution Note */}
                <p className="text-center text-[11px] text-[#929B93] pb-6">
                    Generated {new Date(result.generatedAt).toLocaleString()} · Powered by Groq • openai/gpt-oss-120b · Campus-2-Cash
                </p>
            </main>

            {/* Refinement Modal */}
            <RefineModal
                isOpen={refineOpen}
                onClose={() => setRefineOpen(false)}
                currentResult={result}
                projectInput={projectInput}
                onRefined={handleRefined}
            />
        </div>
    );
}
