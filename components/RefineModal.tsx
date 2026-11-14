"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Sparkles, ArrowRight, AlertCircle } from "lucide-react";
import { AnalysisResponse, ProjectInput } from "@/types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    currentResult: AnalysisResponse;
    projectInput: ProjectInput;
    onRefined: (result: AnalysisResponse) => void;
}

const QUICK_SUGGESTIONS = [
    "Focus on B2B monetization opportunities",
    "Suggest India-specific and regional opportunities",
    "Focus on zero-budget bootstrapped strategies",
    "Prioritize faster revenue (under 2 weeks to first dollar)",
    "Improve and expand pricing recommendations",
    "Focus on passive SaaS and automated subscription models",
];

export function RefineModal({ isOpen, onClose, currentResult, projectInput, onRefined }: Props) {
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Close on Escape key press
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape" && isOpen && !loading) {
                onClose();
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, loading, onClose]);

    async function handleRefine() {
        const trimmed = feedback.trim();
        if (!trimmed || trimmed.length < 3) {
            setError("Please provide specific feedback for the AI mentor (at least 3 characters).");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/analyze?mode=refine", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    originalResponse: currentResult,
                    projectInput,
                    userFeedback: trimmed,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to refine suggestions. Please try again.");
            }

            onRefined(data as AnalysisResponse);
            onClose();
            setFeedback("");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Refinement failed. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => !loading && onClose()}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                        aria-hidden="true"
                    />

                    {/* Modal Dialog */}
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="refine-modal-title"
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative w-full max-w-xl bg-[#111713] border border-[#27332B] rounded-2xl shadow-2xl overflow-hidden z-10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27332B] bg-[#0D120F]">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-[#B7F36B]/15 border border-[#B7F36B]/30 flex items-center justify-center text-[#B7F36B]">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div>
                                    <h2 id="refine-modal-title" className="font-bold text-[#F4F7F2] text-base">
                                        Refine Recommendations
                                    </h2>
                                    <p className="text-xs text-[#929B93]">
                                        Guide the AI to reshape monetization models to your goals
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                aria-label="Close modal"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#929B93] hover:text-[#F4F7F2] hover:bg-[#172019] transition-colors disabled:opacity-50"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-[#F4F7F2] uppercase tracking-wider mb-2">
                                    Quick Suggestions (Click to insert):
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {QUICK_SUGGESTIONS.map((item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => setFeedback(item)}
                                            className="text-xs px-3 py-1.5 rounded-lg bg-[#172019] hover:bg-[#B7F36B]/10 border border-[#27332B] hover:border-[#B7F36B]/30 text-[#929B93] hover:text-[#B7F36B] transition-all text-left"
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="refine-feedback-input"
                                    className="block text-xs font-semibold text-[#F4F7F2] uppercase tracking-wider mb-2"
                                >
                                    Your Feedback & Constraints:
                                </label>
                                <textarea
                                    id="refine-feedback-input"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="e.g. Focus on B2B SaaS strategies targeting enterprise student organizations. I want annual contract pricing rather than monthly micro-transactions..."
                                    rows={4}
                                    disabled={loading}
                                    className="w-full bg-[#101612] border border-[#27332B] rounded-xl px-4 py-3 text-sm text-[#F4F7F2] placeholder:text-[#929B93]/60 focus:outline-none focus:border-[#B7F36B] focus:ring-1 focus:ring-[#B7F36B] transition-colors resize-none disabled:opacity-50"
                                />
                            </div>

                            {/* Error Banner */}
                            {error && (
                                <div className="p-3 rounded-xl bg-[#E05353]/10 border border-[#E05353]/30 flex items-start gap-2.5 text-xs text-[#F87171]">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="px-4 py-2.5 rounded-xl border border-[#27332B] text-xs font-semibold text-[#929B93] hover:text-[#F4F7F2] hover:bg-[#172019] transition-all disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRefine}
                                    disabled={loading || !feedback.trim()}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B7F36B] hover:bg-[#a5e754] text-[#080B09] font-bold text-xs sm:text-sm shadow-lime-glow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Regenerating with AI...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            Regenerate Analysis
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
