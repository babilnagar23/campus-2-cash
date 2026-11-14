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
    const [statusMessage, setStatusMessage] = useState("");
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

    async function pollJob(jobId: string): Promise<AnalysisResponse> {
        const maxAttempts = 60; // 120 seconds maximum wait time
        for (let i = 0; i < maxAttempts; i++) {
            await new Promise((r) => setTimeout(r, 2000));
            try {
                const res = await fetch(`/api/jobs/${jobId}`);
                if (!res.ok) continue;
                const data = await res.json();
                if (data.status === "completed" && data.result) {
                    return data.result as AnalysisResponse;
                }
                if (data.status === "failed") {
                    throw new Error(data.error?.message || "Refinement job failed.");
                }
                if (data.status === "processing") {
                    setStatusMessage("AI mentor is refining monetization paths...");
                } else if (data.status === "cooldown" || data.status === "queued") {
                    setStatusMessage(data.message || `In queue (Position ${data.queuePosition || data.position || 1}). Waiting for 15s cooldown...`);
                }
            } catch (pollErr: any) {
                if (pollErr.message?.includes("Refinement job failed")) throw pollErr;
            }
        }
        throw new Error("Refinement timed out. Please try again.");
    }

    async function handleRefine() {
        const trimmed = feedback.trim();
        if (!trimmed || trimmed.length < 3) {
            setError("Please provide specific feedback for the AI mentor (at least 3 characters).");
            return;
        }

        setError("");
        setStatusMessage("Submitting refinement to queue...");
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
                const errMsg = data.error?.message || data.error || "Failed to refine suggestions. Please try again.";
                throw new Error(errMsg);
            }

            let finalResult: AnalysisResponse;

            // Handle HTTP 202 Queued Response
            if (res.status === 202 || (data.status === "queued" && data.jobId)) {
                setStatusMessage("Request queued. Processing in order...");
                finalResult = await pollJob(data.jobId);
            } else if (data.result && data.result.evaluation) {
                finalResult = data.result;
            } else if (data.evaluation) {
                finalResult = data as AnalysisResponse;
            } else {
                throw new Error("Unexpected response structure from server.");
            }

            onRefined(finalResult);
            onClose();
            setFeedback("");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Refinement failed. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
            setStatusMessage("");
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
                        className="relative w-full max-w-xl bg-[#162620] border border-[#304F44] rounded-2xl shadow-2xl overflow-hidden z-10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#304F44] bg-[#12201B]">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-[#C9A24B]/15 border border-[#C9A24B]/30 flex items-center justify-center text-[#C9A24B]">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div>
                                    <h2 id="refine-modal-title" className="font-serif font-bold text-[#F4F6F0] text-base">
                                        Refine Recommendations
                                    </h2>
                                    <p className="text-xs text-[#9EB0A5]">
                                        Guide the AI mentor to reshape monetization models to your goals
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                aria-label="Close modal"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9EB0A5] hover:text-[#F4F6F0] hover:bg-[#1C3029] transition-colors disabled:opacity-50"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-[#C9A24B] uppercase tracking-wider mb-2">
                                    Quick Suggestions (Click to insert):
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {QUICK_SUGGESTIONS.map((item, idx) => {
                                        const hoverAccents = [
                                            "hover:border-[#C9A24B]/60 hover:text-[#C9A24B] hover:bg-[#C9A24B]/10",
                                            "hover:border-[#2F9E75]/60 hover:text-[#2F9E75] hover:bg-[#2F9E75]/10",
                                            "hover:border-[#E5B558]/60 hover:text-[#E5B558] hover:bg-[#E5B558]/10",
                                            "hover:border-[#0E5A47]/80 hover:text-[#52C59D] hover:bg-[#0E5A47]/20",
                                            "hover:border-[#7BD8B2]/60 hover:text-[#7BD8B2] hover:bg-[#7BD8B2]/10",
                                            "hover:border-[#D8B76B]/60 hover:text-[#D8B76B] hover:bg-[#D8B76B]/10",
                                        ];
                                        return (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => setFeedback(item)}
                                                className={`text-xs px-3 py-1.5 rounded-lg bg-[#12201B] border border-[#304F44] text-[#9EB0A5] transition-all text-left ${hoverAccents[idx % hoverAccents.length]}`}
                                            >
                                                {item}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="refine-feedback-input"
                                    className="block text-xs font-semibold text-[#F4F6F0] uppercase tracking-wider mb-2"
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
                                    className="w-full bg-[#12201B] border border-[#304F44] rounded-xl px-4 py-3 text-sm text-[#F4F6F0] placeholder:text-[#9EB0A5]/60 focus:outline-none focus:border-[#C9A24B] focus:ring-1 focus:ring-[#C9A24B] transition-colors resize-none disabled:opacity-50"
                                />
                            </div>

                            {/* Status message */}
                            {statusMessage && (
                                <div className="p-3 rounded-xl bg-[#0E5A47]/15 border border-[#2F9E75]/30 flex items-center gap-2 text-xs text-[#2F9E75]">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C9A24B] shrink-0" />
                                    <span>{statusMessage}</span>
                                </div>
                            )}

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
                                    className="px-4 py-2.5 rounded-xl border border-[#304F44] text-xs font-semibold text-[#9EB0A5] hover:text-[#F4F6F0] hover:bg-[#1C3029] transition-all disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRefine}
                                    disabled={loading || !feedback.trim()}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E5A47] hover:bg-[#13745C] text-white font-semibold text-xs sm:text-sm border border-[#2F9E75]/40 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin text-[#C9A24B]" />
                                            Regenerating with AI...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 text-[#C9A24B]" />
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
