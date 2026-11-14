"use client";

import { motion } from "framer-motion";
import { Scorecard } from "@/types";
import { getScoreColor, getScoreBgColor } from "@/lib/utils";
import { Layers } from "lucide-react";

interface Props {
    scorecard: Scorecard;
    totalScore: number;
}

const DIMENSION_ICONS: Record<string, string> = {
    marketSize: "📊",
    problemSeverity: "🔥",
    uniqueness: "💎",
    feasibility: "⚙️",
    monetizationPotential: "💰",
    scalability: "📈",
    timeToRevenue: "⚡",
    competitiveMoat: "🛡️",
    founderFit: "🎯",
    trendAlignment: "🚀",
};

export function ScorecardPanel({ scorecard, totalScore }: Props) {
    const dimensions = Object.entries(scorecard) as [keyof Scorecard, Scorecard[keyof Scorecard]][];

    return (
        <div className="gradient-border card-gradient rounded-2xl p-6 shadow-card-subtle">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#27332B]">
                <div>
                    <h3 className="text-base font-bold text-[#F4F7F2] flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#B7F36B]" />
                        10-Dimension Startup Scorecard
                    </h3>
                    <p className="text-xs text-[#929B93] mt-0.5">
                        Comprehensive viability rubric assessed by AI
                    </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto bg-[#172019] border border-[#27332B] px-3 py-1.5 rounded-xl">
                    <span className="text-xs text-[#929B93]">Master Score:</span>
                    <div className={`text-base font-extrabold ${getScoreColor(totalScore)}`}>
                        {totalScore.toFixed(1)}
                        <span className="text-xs text-[#929B93] font-normal"> / 10</span>
                    </div>
                </div>
            </div>

            {/* 10 Dimension Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dimensions.map(([key, dim], i) => (
                    <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="p-4 rounded-xl bg-[#080B09]/60 border border-[#27332B] hover:border-[#B7F36B]/30 transition-colors"
                    >
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="text-base flex-shrink-0">{DIMENSION_ICONS[key] || "•"}</span>
                                <span className="text-xs sm:text-sm font-semibold text-[#F4F7F2] truncate">
                                    {dim.label}
                                </span>
                            </div>
                            <span className={`text-xs font-bold tabular-nums px-2 py-0.5 rounded-md bg-[#172019] border border-[#27332B] ${getScoreColor(dim.score)}`}>
                                {dim.score}/10
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1.5 bg-[#172019] rounded-full overflow-hidden mb-2.5">
                            <motion.div
                                className={`h-full rounded-full ${getScoreBgColor(dim.score)}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${(Math.max(1, Math.min(10, dim.score)) / 10) * 100}%` }}
                                transition={{ duration: 1.0, delay: i * 0.05, ease: "easeOut" }}
                            />
                        </div>

                        <p className="text-xs text-[#929B93] leading-relaxed">
                            {dim.summary}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Rubric Legend */}
            <div className="flex items-center justify-between flex-wrap gap-2 mt-6 pt-4 border-t border-[#27332B]">
                <span className="text-[11px] text-[#929B93] uppercase font-semibold tracking-wider">Scoring Rubric:</span>
                <div className="flex items-center gap-4 flex-wrap">
                    {[
                        { range: "8.5–10.0", label: "Investor-Ready", color: "bg-[#B7F36B]" },
                        { range: "7.0–8.4", label: "Strong Potential", color: "bg-[#64C995]" },
                        { range: "5.5–6.9", label: "Solid Foundation", color: "bg-[#FCD34D]" },
                        { range: "4.0–5.4", label: "Needs Refinement", color: "bg-[#FB923C]" },
                        { range: "1.0–3.9", label: "Early Concept", color: "bg-[#F87171]" },
                    ].map((l) => (
                        <div key={l.range} className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${l.color}`} />
                            <span className="text-xs text-[#929B93]">
                                {l.label} <span className="opacity-60">({l.range})</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
