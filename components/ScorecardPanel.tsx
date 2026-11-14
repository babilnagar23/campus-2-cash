"use client";

import { motion } from "framer-motion";
import { Scorecard } from "@/types";
import { getScoreColor, getDimensionTheme, safeRenderString } from "@/lib/utils";
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
        <div className="bg-[#162620] border border-[#304F44] rounded-2xl p-6 shadow-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#304F44]">
                <div>
                    <h3 className="font-serif text-base font-medium text-[#F4F6F0] flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#C9A24B]" />
                        10-Dimension Startup Scorecard
                    </h3>
                    <p className="text-xs text-[#9EB0A5] mt-0.5">
                        Comprehensive viability rubric assessed by AI
                    </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto bg-[#1C3029] border border-[#304F44] px-3.5 py-1.5 rounded-full">
                    <span className="text-xs text-[#9EB0A5]">Master Score:</span>
                    <div className={`text-base font-bold font-mono ${getScoreColor(totalScore)}`}>
                        {totalScore.toFixed(1)}
                        <span className="text-xs text-[#9EB0A5] font-normal font-sans"> / 10</span>
                    </div>
                </div>
            </div>

            {/* 10 Dimension Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dimensions.map(([key, dim], i) => {
                    const theme = getDimensionTheme(key);
                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="p-4 rounded-xl bg-[#12201B] border border-[#304F44] hover:border-[#C9A24B]/50 transition-colors group"
                        >
                            <div className="flex items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-base flex-shrink-0">{DIMENSION_ICONS[key] || "•"}</span>
                                    <span className="text-xs sm:text-sm font-medium text-[#F4F6F0] truncate group-hover:text-[#C9A24B] transition-colors">
                                        {safeRenderString(dim.label)}
                                    </span>
                                </div>
                                <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-[#1C3029] border border-[#304F44] ${getScoreColor(dim.score)}`}>
                                    {dim.score}/10
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-1.5 bg-[#1C3029] rounded-full overflow-hidden mb-2.5">
                                <motion.div
                                    className={`h-full rounded-full ${theme.bg}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(Math.max(1, Math.min(10, dim.score)) / 10) * 100}%` }}
                                    transition={{ duration: 1.0, delay: i * 0.05, ease: "easeOut" }}
                                />
                            </div>

                            <p className="text-xs text-[#9EB0A5] leading-relaxed font-normal">
                                {safeRenderString(dim.summary)}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Rubric Legend */}
            <div className="flex items-center justify-between flex-wrap gap-2 mt-6 pt-4 border-t border-[#304F44]">
                <span className="text-[11px] text-[#9EB0A5] uppercase font-semibold tracking-wider">Scoring Rubric:</span>
                <div className="flex items-center gap-4 flex-wrap">
                    {[
                        { range: "8.5–10.0", label: "Investor-Ready", color: "bg-[#C9A24B]" },
                        { range: "7.0–8.4", label: "Strong Potential", color: "bg-[#2F9E75]" },
                        { range: "5.5–6.9", label: "Solid Foundation", color: "bg-[#5CD1B3]" },
                        { range: "4.0–5.4", label: "Needs Refinement", color: "bg-[#D8B76B]" },
                        { range: "1.0–3.9", label: "Early Concept", color: "bg-[#E08A68]" },
                    ].map((l) => (
                        <div key={l.range} className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${l.color}`} />
                            <span className="text-xs text-[#9EB0A5]">
                                {l.label} <span className="opacity-60">({l.range})</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
