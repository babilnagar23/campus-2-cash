"use client";

import { motion } from "framer-motion";
import { EvaluationResult } from "@/types";
import {
    getScoreColor,
    getScoreBgColor,
    getVerdictColor,
    getDimensionTheme,
    formatRevenueDisplay,
    formatAnnualRevenueDisplay,
    safeRenderString,
} from "@/lib/utils";
import { TrendingUp, Award, DollarSign } from "lucide-react";

interface Props {
    evaluation: EvaluationResult;
}

export function EvaluationPanel({ evaluation }: Props) {
    const dims = [
        { key: "marketSize", data: evaluation.dimensions.marketSize },
        { key: "uniqueness", data: evaluation.dimensions.uniqueness },
        { key: "feasibility", data: evaluation.dimensions.feasibility },
        { key: "monetizationPotential", data: evaluation.dimensions.monetizationPotential },
        { key: "executionRisk", data: evaluation.dimensions.executionRisk },
    ];

    // SVG circle score meter
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const score = Math.min(Math.max(evaluation.realWorldValueScore || 0, 0), 10);
    const dashOffset = circumference - (score / 10) * circumference;

    return (
        <div className="space-y-4">
            {/* Master Score Meter */}
            <div className="bg-[#162620] border border-[#304F44] rounded-2xl p-6 text-center shadow-sm">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A24B]/15 border border-[#C9A24B]/35 text-[#C9A24B] text-xs font-semibold uppercase tracking-wider mb-4">
                    <Award className="w-3.5 h-3.5" />
                    Overall Assessment
                </div>

                <div className="relative inline-flex items-center justify-center mb-3">
                    <svg width="120" height="120" viewBox="0 0 100 100" className="-rotate-90">
                        {/* Background track */}
                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="none"
                            stroke="#12201B"
                            strokeWidth="8"
                        />
                        {/* Progress meter */}
                        <motion.circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="none"
                            stroke="url(#evalGoldGradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: dashOffset }}
                            transition={{ duration: 1.4, ease: "easeOut" }}
                        />
                        <defs>
                            <linearGradient id="evalGoldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#C9A24B" />
                                <stop offset="100%" stopColor="#2F9E75" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-bold font-mono ${getScoreColor(score)}`}>
                            {score.toFixed(1)}
                        </span>
                        <span className="text-[11px] text-[#9EB0A5]">out of 10</span>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">{evaluation.verdictEmoji}</span>
                    <h3 className={`font-serif text-lg font-medium ${getVerdictColor(score)}`}>
                        {safeRenderString(evaluation.verdict)}
                    </h3>
                </div>

                <p className="text-xs sm:text-sm text-[#9EB0A5] leading-relaxed max-w-md mx-auto font-normal">
                    {safeRenderString(evaluation.overallInsights)}
                </p>
            </div>

            {/* 5-Dimension Overview Bars */}
            <div className="bg-[#162620] border border-[#304F44] rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-sm font-medium text-[#F4F6F0] flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#2F9E75]" />
                        Core Dimensions
                    </h3>
                    <span className="text-xs text-[#9EB0A5]">Weighted summary</span>
                </div>

                <div className="space-y-4">
                    {dims.map(({ key, data }, i) => {
                        const theme = getDimensionTheme(key);
                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.08 * i }}
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-medium text-[#F4F6F0] flex items-center gap-1.5">
                                        <span className={`w-1.5 h-1.5 rounded-full ${theme.bg}`} />
                                        {data.label}
                                    </span>
                                    <span className={`text-xs font-bold font-mono ${theme.text}`}>
                                        {data.score}/10
                                    </span>
                                </div>
                                <div className="h-2 bg-[#12201B] rounded-full overflow-hidden border border-[#304F44]/50">
                                    <motion.div
                                        className={`h-full rounded-full ${theme.bg}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(Math.max(1, Math.min(10, data.score)) / 10) * 100}%` }}
                                        transition={{ duration: 1.1, delay: 0.08 * i, ease: "easeOut" }}
                                    />
                                </div>
                                <p className="text-[11px] text-[#9EB0A5] mt-1.5 leading-relaxed">{data.summary}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Revenue Scenarios */}
            <div className="bg-[#162620] border border-[#304F44] rounded-2xl p-5 shadow-sm">
                <h3 className="font-serif text-sm font-medium text-[#F4F6F0] mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#C9A24B]" />
                    Revenue Forecast · {safeRenderString(evaluation.revenueEstimate.timeframe, "First 12 Months")}
                </h3>
                <div className="grid grid-cols-3 gap-2.5">
                    {[
                        {
                            label: "Conservative",
                            value: evaluation.revenueEstimate.conservative,
                            color: "text-[#5CD1B3]",
                            border: "border-[#0E5A47]/60",
                            bg: "bg-[#0E5A47]/20",
                        },
                        {
                            label: "Realistic",
                            value: evaluation.revenueEstimate.realistic,
                            color: "text-[#2F9E75]",
                            border: "border-[#2F9E75]/40",
                            bg: "bg-[#2F9E75]/15",
                        },
                        {
                            label: "Optimistic",
                            value: evaluation.revenueEstimate.optimistic,
                            color: "text-[#C9A24B]",
                            border: "border-[#C9A24B]/40",
                            bg: "bg-[#C9A24B]/15",
                        },
                    ].map((tier) => {
                        const monthly = formatRevenueDisplay(tier.value);
                        const annual = formatAnnualRevenueDisplay(tier.value);
                        return (
                            <div
                                key={tier.label}
                                className={`text-center p-3 rounded-xl bg-[#12201B] border ${tier.border} ${tier.bg} transition-colors`}
                            >
                                <div className={`text-sm sm:text-base font-bold font-mono ${tier.color} truncate`}>
                                    {monthly}
                                </div>
                                <div className="text-[11px] text-[#9EB0A5] mt-0.5">
                                    {tier.label} / mo
                                    {annual && (
                                        <span className="block text-[10px] text-[#9EB0A5]/80">
                                            ({annual}/yr)
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                {evaluation.revenueEstimate.assumptions && (
                    <p className="text-[11px] text-[#9EB0A5] mt-3 italic border-t border-[#304F44]/50 pt-2.5">
                        {safeRenderString(evaluation.revenueEstimate.assumptions)}
                    </p>
                )}
            </div>
        </div>
    );
}
