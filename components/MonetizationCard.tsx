"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MonetizationPath, PricingTier } from "@/types";
import {
    getConfidenceColor,
    formatPricingDisplay,
    formatRevenueDisplay,
    safeRenderString,
    getModelAccent,
} from "@/lib/utils";
import { ChevronDown, ChevronUp, TrendingUp, Users, DollarSign, Zap, Clock, ShieldCheck, Check } from "lucide-react";

interface Props {
    path: MonetizationPath;
    index: number;
}

export function MonetizationCard({ path, index }: Props) {
    const [expanded, setExpanded] = useState(false);
    const theme = getModelAccent(path.model);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className={`monetization-card bg-[#162620] border border-[#304F44] rounded-2xl overflow-hidden shadow-sm ${theme.hoverBorder} transition-all`}
        >
            {/* Card Header */}
            <div className="p-5 pb-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <span className={`text-3xl p-2 rounded-xl bg-[#1C3029] border ${theme.border} flex-shrink-0`}>
                            {path.emoji || "💡"}
                        </span>
                        <div className="min-w-0">
                            <h3 className="font-serif font-medium text-[#F4F6F0] text-base truncate">{safeRenderString(path.model)}</h3>
                            {path.estimatedMRR && (
                                <div className={`flex items-center gap-1.5 text-xs ${theme.text} font-semibold mt-0.5`}>
                                    <span>Est. MRR: {formatRevenueDisplay(path.estimatedMRR)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${getConfidenceColor(
                            path.confidence
                        )}`}
                    >
                        {safeRenderString(path.confidence)} Confidence
                    </span>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3.5 p-3 rounded-xl bg-[#12201B] border border-[#304F44]">
                    <div className="flex items-center gap-2 text-xs text-[#9EB0A5]">
                        <Users className="w-3.5 h-3.5 text-[#C9A24B] flex-shrink-0" />
                        <span className="truncate text-[#F4F6F0]">
                            <strong className="text-[#9EB0A5] font-normal">Target: </strong>
                            {safeRenderString(path.targetUsers)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#9EB0A5]">
                        <DollarSign className={`w-3.5 h-3.5 ${theme.text} flex-shrink-0`} />
                        <span className="truncate text-[#F4F6F0]">
                            <strong className="text-[#9EB0A5] font-normal">Pricing: </strong>
                            {formatPricingDisplay(path.pricing)}
                        </span>
                    </div>
                    {path.timeToFirstDollar && (
                        <div className="flex items-center gap-2 text-xs text-[#9EB0A5]">
                            <Clock className="w-3.5 h-3.5 text-[#D8B76B] flex-shrink-0" />
                            <span className="truncate text-[#F4F6F0]">
                                <strong className="text-[#9EB0A5] font-normal">Time to First $: </strong>
                                {safeRenderString(path.timeToFirstDollar)}
                            </span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-[#9EB0A5]">
                        <TrendingUp className="w-3.5 h-3.5 text-[#2F9E75] flex-shrink-0" />
                        <span className="truncate text-[#F4F6F0]">
                            <strong className="text-[#9EB0A5] font-normal">Trend: </strong>
                            {safeRenderString(path.marketTrendAlignment)}
                        </span>
                    </div>
                </div>

                {/* First Action Steps */}
                <div className="space-y-2 mt-4">
                    <p className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${theme.text}`}>
                        <Zap className="w-3.5 h-3.5" />
                        First Action Steps
                    </p>
                    <div className="space-y-1.5">
                        {path.steps.slice(0, 3).map((step: unknown, i: number) => (
                            <div key={i} className="flex items-start gap-2.5">
                                <span className={`flex-shrink-0 w-5 h-5 rounded-full ${theme.bg} ${theme.text} border ${theme.border} text-xs flex items-center justify-center font-bold mt-0.5`}>
                                    {i + 1}
                                </span>
                                <p className="text-xs sm:text-sm text-[#9EB0A5] leading-relaxed font-normal">{safeRenderString(step)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Expand Toggle */}
            <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between px-5 py-3 border-t border-[#304F44] text-xs font-medium text-[#9EB0A5] hover:text-[#F4F6F0] hover:bg-[#1C3029]/60 transition-colors"
                aria-expanded={expanded}
            >
                <span className="flex items-center gap-1.5">
                    {expanded ? "Hide detailed roadmap & pricing" : "View full roadmap, pricing tiers & fit analysis"}
                </span>
                {expanded ? (
                    <ChevronUp className={`w-4 h-4 ${theme.text}`} />
                ) : (
                    <ChevronDown className="w-4 h-4 text-[#9EB0A5]" />
                )}
            </button>

            {/* Expanded Content */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden bg-[#12201B]/80"
                    >
                        <div className="px-5 pb-5 pt-2 space-y-4 border-t border-[#304F44]/60">
                            {/* Why it fits */}
                            <div className={`p-3.5 rounded-xl bg-[#1C3029] border ${theme.border}`}>
                                <h4 className={`text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5 ${theme.text}`}>
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Why This Model Fits Your Project
                                </h4>
                                <p className="text-xs sm:text-sm text-[#F4F6F0] leading-relaxed font-normal">{safeRenderString(path.whyItFits)}</p>
                            </div>

                            {/* Complete steps (if more than 3) */}
                            {path.steps.length > 3 && (
                                <div>
                                    <h4 className="font-serif text-xs font-medium text-[#F4F6F0] uppercase tracking-wider mb-2">
                                        Subsequent Execution Steps
                                    </h4>
                                    <div className="space-y-1.5">
                                        {path.steps.slice(3).map((step: unknown, i: number) => (
                                            <div key={i + 3} className="flex items-start gap-2.5">
                                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1C3029] text-[#9EB0A5] border border-[#304F44] text-xs flex items-center justify-center font-bold mt-0.5">
                                                    {i + 4}
                                                </span>
                                                <p className="text-xs text-[#9EB0A5] leading-relaxed font-normal">{safeRenderString(step)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Pricing Tiers */}
                            {path.pricingTiers && path.pricingTiers.length > 0 && (
                                <div>
                                    <h4 className="font-serif text-xs font-medium text-[#F4F6F0] uppercase tracking-wider mb-2">
                                        Proposed Pricing Tiers
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {path.pricingTiers.map((tier: PricingTier, i: number) => (
                                            <div
                                                key={i}
                                                className={`p-3 rounded-xl bg-[#162620] border border-[#304F44] hover:${theme.border} transition-colors flex flex-col justify-between`}
                                            >
                                                <div>
                                                    <div className="flex items-baseline justify-between gap-2 mb-2 pb-1.5 border-b border-[#304F44]">
                                                        <span className="text-xs font-bold text-[#F4F6F0]">{safeRenderString(tier.name)}</span>
                                                        <span className={`text-xs font-bold font-mono ${theme.text}`}>
                                                            {formatPricingDisplay(tier.price)}
                                                        </span>
                                                    </div>
                                                    <ul className="space-y-1">
                                                        {tier.features.map((feat: unknown, j: number) => (
                                                            <li
                                                                key={j}
                                                                className="text-xs text-[#9EB0A5] flex items-start gap-1.5 leading-snug"
                                                            >
                                                                <Check className="w-3 h-3 text-[#2F9E75] flex-shrink-0 mt-0.5" />
                                                                <span>{safeRenderString(feat)}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Secondary audience & confidence rationale */}
                            <div className="space-y-1.5 pt-2 border-t border-[#304F44] text-xs text-[#9EB0A5]">
                                {path.secondaryUsers && (
                                    <div>
                                        <strong className="text-[#F4F6F0] font-medium">Secondary Market: </strong>
                                        {safeRenderString(path.secondaryUsers)}
                                    </div>
                                )}
                                {path.confidenceReason && (
                                    <div>
                                        <strong className="text-[#F4F6F0] font-medium">Confidence Rationale: </strong>
                                        {safeRenderString(path.confidenceReason)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
