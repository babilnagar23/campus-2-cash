"use client";

import { motion } from "framer-motion";
import { EvaluationResult } from "@/types";
import {
    getScoreColor,
    getScoreBgColor,
    getVerdictColor,
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
            <div className="gradient-border card-gradient rounded-2xl p-6 text-center shadow-card-subtle">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B7F36B]/10 border border-[#B7F36B]/20 text-[#B7F36B] text-xs font-semibold uppercase tracking-wider mb-4">
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
                            stroke="#172019"
                            strokeWidth="8"
                        />
                        {/* Progress meter */}
                        <motion.circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="none"
                            stroke="url(#evalLimeGradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: dashOffset }}
                            transition={{ duration: 1.4, ease: "easeOut" }}
                        />
                        <defs>
                            <linearGradient id="evalLimeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#B7F36B" />
                                <stop offset="100%" stopColor="#64C995" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-extrabold ${getScoreColor(score)}`}>
                            {score.toFixed(1)}
                        </span>
                        <span className="text-[11px] text-[#929B93]">out of 10</span>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">{evaluation.verdictEmoji}</span>
                    <h3 className={`text-lg font-bold ${getVerdictColor(score)}`}>
                        {evaluation.verdict}
                    </h3>
                </div>

                <p className="text-xs sm:text-sm text-[#929B93] leading-relaxed max-w-md mx-auto">
                    {evaluation.overallInsights}
                </p>
            </div>

            {/* 5-Dimension Overview Bars */}
            <div className="gradient-border card-gradient rounded-2xl p-5 shadow-card-subtle">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-[#F4F7F2] flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#B7F36B]" />
                        Core Dimensions
                    </h3>
                    <span className="text-xs text-[#929B93]">Weighted summary</span>
                </div>

                <div className="space-y-4">
                    {dims.map(({ key, data }, i) => (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.08 * i }}
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-medium text-[#F4F7F2]">{data.label}</span>
                                <span className={`text-xs font-bold ${getScoreColor(data.score)}`}>
                                    {data.score}/10
                                </span>
                            </div>
                            <div className="h-2 bg-[#172019] rounded-full overflow-hidden border border-[#27332B]/50">
                                <motion.div
                                    className={`h-full rounded-full ${getScoreBgColor(data.score)}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(Math.max(1, Math.min(10, data.score)) / 10) * 100}%` }}
                                    transition={{ duration: 1.1, delay: 0.08 * i, ease: "easeOut" }}
                                />
                            </div>
                            <p className="text-[11px] text-[#929B93] mt-1.5 leading-relaxed">{data.summary}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Revenue Scenarios */}
            <div className="gradient-border card-gradient rounded-2xl p-5 shadow-card-subtle">
                <h3 className="text-sm font-semibold text-[#F4F7F2] mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#B7F36B]" />
                    Revenue Forecast · {safeRenderString(evaluation.revenueEstimate.timeframe, "First 12 Months")}
                </h3>
                <div className="grid grid-cols-3 gap-2.5">
                    {[
                        { label: "Conservative", value: evaluation.revenueEstimate.conservative, color: "text-[#FB923C]" },
                        { label: "Realistic", value: evaluation.revenueEstimate.realistic, color: "text-[#FCD34D]" },
                        { label: "Optimistic", value: evaluation.revenueEstimate.optimistic, color: "text-[#B7F36B]" },
                    ].map((tier) => {
                        const monthly = formatRevenueDisplay(tier.value);
                        const annual = formatAnnualRevenueDisplay(tier.value);
                        return (
                            <div
                                key={tier.label}
                                className="text-center p-3 rounded-xl bg-[#080B09]/60 border border-[#27332B]"
                            >
                                <div className={`text-sm sm:text-base font-bold ${tier.color} truncate`}>
                                    {monthly}
                                </div>
                                <div className="text-[11px] text-[#929B93] mt-0.5">
                                    {tier.label} / mo
                                    {annual && (
                                        <span className="block text-[10px] text-[#929B93]/80">
                                            ({annual}/yr)
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                {evaluation.revenueEstimate.assumptions && (
                    <p className="text-[11px] text-[#929B93] mt-3 italic border-t border-[#27332B] pt-2.5">
                        {safeRenderString(evaluation.revenueEstimate.assumptions)}
                    </p>
                )}
            </div>
        </div>
    );
}
