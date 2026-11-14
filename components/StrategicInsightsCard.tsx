"use client";

import { motion } from "framer-motion";
import { StrategicInsights } from "@/types";
import { safeRenderString } from "@/lib/utils";
import { ShieldCheck, AlertTriangle, Zap, Sparkles } from "lucide-react";

interface Props {
    insights: StrategicInsights;
}

export function StrategicInsightsCard({ insights }: Props) {
    return (
        <div className="bg-[#162620] border border-[#304F44] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 pb-3 border-b border-[#304F44]">
                <h3 className="font-serif text-base font-medium text-[#F4F6F0] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C9A24B]" />
                    Strategic Founder Guidance
                </h3>
                <p className="text-xs text-[#9EB0A5] mt-0.5">
                    Targeted guidance based on your technology and target audience
                </p>
            </div>

            <div className="p-5 space-y-5">
                {/* Core Strengths (Jade) */}
                <div>
                    <div className="flex items-center gap-2 mb-2.5">
                        <ShieldCheck className="w-4 h-4 text-[#2F9E75]" />
                        <span className="text-xs font-bold text-[#2F9E75] uppercase tracking-wider">
                            Core Strengths
                        </span>
                    </div>
                    <div className="space-y-2">
                        {insights.strengths.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="flex items-start gap-2.5 p-3 rounded-xl bg-[#12201B] border border-[#2F9E75]/30 hover:border-[#2F9E75]/50 transition-colors"
                            >
                                <div className="w-5 h-5 rounded-full bg-[#2F9E75]/15 border border-[#2F9E75]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-[#2F9E75] text-xs font-bold font-mono">{i + 1}</span>
                                </div>
                                <p className="text-xs sm:text-sm text-[#F4F6F0] leading-relaxed font-normal">{safeRenderString(s)}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Critical Risks (Coral Amber) */}
                <div>
                    <div className="flex items-center gap-2 mb-2.5">
                        <AlertTriangle className="w-4 h-4 text-[#E08A68]" />
                        <span className="text-xs font-bold text-[#E08A68] uppercase tracking-wider">
                            Critical Risks to Mitigate
                        </span>
                    </div>
                    <div className="space-y-2">
                        {insights.weaknesses.map((w, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 + 0.15 }}
                                className="flex items-start gap-2.5 p-3 rounded-xl bg-[#12201B] border border-[#E08A68]/30 hover:border-[#E08A68]/50 transition-colors"
                            >
                                <div className="w-5 h-5 rounded-full bg-[#E08A68]/15 border border-[#E08A68]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-[#E08A68] text-xs font-bold font-mono">{i + 1}</span>
                                </div>
                                <p className="text-xs sm:text-sm text-[#9EB0A5] leading-relaxed font-normal">{safeRenderString(w)}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Secret Weapon (Champagne Gold) */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="p-4 rounded-xl bg-[#1C3029] border border-[#C9A24B]/40 shadow-sm"
                >
                    <div className="flex items-center gap-2 mb-1.5">
                        <Sparkles className="w-4 h-4 text-[#C9A24B]" />
                        <span className="text-xs font-bold text-[#C9A24B] uppercase tracking-wider">
                            Your Secret Weapon
                        </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#F4F6F0] leading-relaxed font-normal">{safeRenderString(insights.secretWeapon)}</p>
                </motion.div>

                {/* Quick Win This Week (Warm Brass) */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="p-4 rounded-xl bg-[#1C3029] border border-[#D8B76B]/40 shadow-sm"
                >
                    <div className="flex items-center gap-2 mb-1.5">
                        <Zap className="w-4 h-4 text-[#D8B76B]" />
                        <span className="text-xs font-bold text-[#D8B76B] uppercase tracking-wider">
                            Actionable Quick Win (Next 7 Days)
                        </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#F4F6F0] leading-relaxed font-normal">{safeRenderString(insights.quickWin)}</p>
                </motion.div>
            </div>
        </div>
    );
}
