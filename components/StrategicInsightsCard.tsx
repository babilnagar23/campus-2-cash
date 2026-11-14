"use client";

import { motion } from "framer-motion";
import { StrategicInsights } from "@/types";
import { ShieldCheck, AlertTriangle, Zap, Sparkles } from "lucide-react";

interface Props {
    insights: StrategicInsights;
}

export function StrategicInsightsCard({ insights }: Props) {
    return (
        <div className="gradient-border card-gradient rounded-2xl overflow-hidden shadow-card-subtle">
            <div className="p-5 pb-3 border-b border-[#27332B]">
                <h3 className="text-base font-bold text-[#F4F7F2] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#B7F36B]" />
                    Strategic Founder Insights
                </h3>
                <p className="text-xs text-[#929B93] mt-0.5">
                    Targeted guidance based on your technology and target audience
                </p>
            </div>

            <div className="p-5 space-y-5">
                {/* Strengths */}
                <div>
                    <div className="flex items-center gap-2 mb-2.5">
                        <ShieldCheck className="w-4 h-4 text-[#64C995]" />
                        <span className="text-xs font-bold text-[#64C995] uppercase tracking-wider">
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
                                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#080B09]/50 border border-[#27332B]"
                            >
                                <div className="w-5 h-5 rounded-full bg-[#64C995]/15 border border-[#64C995]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-[#64C995] text-xs font-bold">{i + 1}</span>
                                </div>
                                <p className="text-xs sm:text-sm text-[#F4F7F2] leading-relaxed">{s}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Risks / Weaknesses */}
                <div>
                    <div className="flex items-center gap-2 mb-2.5">
                        <AlertTriangle className="w-4 h-4 text-[#FB923C]" />
                        <span className="text-xs font-bold text-[#FB923C] uppercase tracking-wider">
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
                                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#080B09]/50 border border-[#27332B]"
                            >
                                <div className="w-5 h-5 rounded-full bg-[#FB923C]/15 border border-[#FB923C]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-[#FB923C] text-xs font-bold">{i + 1}</span>
                                </div>
                                <p className="text-xs sm:text-sm text-[#929B93] leading-relaxed">{w}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Secret Weapon */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="p-4 rounded-xl bg-[#172019] border border-[#B7F36B]/30 shadow-lime-glow-sm"
                >
                    <div className="flex items-center gap-2 mb-1.5">
                        <Sparkles className="w-4 h-4 text-[#B7F36B]" />
                        <span className="text-xs font-bold text-[#B7F36B] uppercase tracking-wider">
                            Your Secret Weapon
                        </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#F4F7F2] leading-relaxed">{insights.secretWeapon}</p>
                </motion.div>

                {/* Quick Win This Week */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="p-4 rounded-xl bg-[#172019] border border-[#FCD34D]/30"
                >
                    <div className="flex items-center gap-2 mb-1.5">
                        <Zap className="w-4 h-4 text-[#FCD34D]" />
                        <span className="text-xs font-bold text-[#FCD34D] uppercase tracking-wider">
                            Actionable Quick Win (Next 7 Days)
                        </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#F4F7F2] leading-relaxed">{insights.quickWin}</p>
                </motion.div>
            </div>
        </div>
    );
}
