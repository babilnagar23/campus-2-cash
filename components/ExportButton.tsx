"use client";

import { useState } from "react";
import { Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { AnalysisResponse, ProjectInput } from "@/types";
import { formatRevenueDisplay, formatPricingDisplay, safeRenderString } from "@/lib/utils";

interface Props {
    result: AnalysisResponse;
    projectInput: ProjectInput;
}

export function ExportButton({ result, projectInput }: Props) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleExport() {
        setLoading(true);
        setStatus("idle");
        setErrorMessage("");

        try {
            const { jsPDF } = await import("jspdf");
            const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

            const pageWidth = 210;
            const pageHeight = 297;
            const margin = 16;
            const contentWidth = pageWidth - margin * 2;
            let currentPage = 1;
            let y = margin;

            // Palette definitions (Forest Green, Champagne Gold & Obsidian Pine)
            const COLOR_BG: [number, number, number] = [18, 32, 27]; // #12201B (Obsidian Pine)
            const COLOR_CARD: [number, number, number] = [22, 38, 32]; // #162620 (Pine Surface)
            const COLOR_BORDER: [number, number, number] = [48, 79, 68]; // #304F44 (Pine Border)
            const COLOR_TEXT_PRIMARY: [number, number, number] = [244, 246, 240]; // #F4F6F0 (Crisp Off-White)
            const COLOR_TEXT_MUTED: [number, number, number] = [158, 176, 165]; // #9EB0A5 (Pine Sage)
            const COLOR_ACCENT_PRIMARY: [number, number, number] = [14, 90, 71]; // #0E5A47 (Forest Green)
            const COLOR_ACCENT_GOLD: [number, number, number] = [201, 162, 75]; // #C9A24B (Champagne Gold)
            const COLOR_ACCENT_JADE: [number, number, number] = [47, 158, 117]; // #2F9E75 (Mint Jade)
            const COLOR_ACCENT_MINT: [number, number, number] = [123, 216, 178]; // #7BD8B2 (Soft Mint)
            const COLOR_ACCENT_CORAL: [number, number, number] = [224, 138, 104]; // #E08A68 (Coral Amber)

            function paintPageBackground() {
                doc.setFillColor(...COLOR_BG);
                doc.rect(0, 0, pageWidth, pageHeight, "F");

                // Header brand line on every page
                doc.setDrawColor(...COLOR_BORDER);
                doc.setLineWidth(0.3);
                doc.line(margin, 10, pageWidth - margin, 10);

                doc.setFont("helvetica", "normal");
                doc.setFontSize(7.5);
                doc.setTextColor(...COLOR_TEXT_MUTED);
                doc.text("CAMPUS-2-CASH | Institutional Startup Intelligence Platform", margin, 8);
                doc.text(`Page ${currentPage}`, pageWidth - margin - 12, 8);

                // Footer line on every page
                doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);
                doc.text("Generated with Campus-2-Cash · Powered by Groq • openai/gpt-oss-20b · Confidential Founder Intelligence", margin, pageHeight - 6);
            }

            function checkPageBreak(requiredHeight: number) {
                if (y + requiredHeight > pageHeight - 16) {
                    doc.addPage();
                    currentPage += 1;
                    paintPageBackground();
                    y = 18;
                }
            }

            function addSectionHeading(title: string) {
                checkPageBreak(12);
                y += 3;
                doc.setFont("helvetica", "bold");
                doc.setFontSize(10);
                doc.setTextColor(...COLOR_ACCENT_GOLD);
                doc.text(title.toUpperCase(), margin, y);
                y += 2;
                doc.setDrawColor(...COLOR_ACCENT_GOLD);
                doc.setLineWidth(0.4);
                doc.line(margin, y, margin + 30, y);
                y += 4;
            }

            function addParagraph(
                text: string,
                fontSize = 8.5,
                color: [number, number, number] = COLOR_TEXT_MUTED,
                isBold = false
            ) {
                doc.setFont("helvetica", isBold ? "bold" : "normal");
                doc.setFontSize(fontSize);
                doc.setTextColor(...color);

                const lines = doc.splitTextToSize(text || "", contentWidth);
                checkPageBreak(lines.length * 4.2 + 2);
                doc.text(lines, margin, y);
                y += lines.length * 4.2 + 1;
            }

            // Paint first page background
            paintPageBackground();
            y = 18;

            // ── Document Title Header ──────────────────────────
            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.setTextColor(...COLOR_ACCENT_GOLD);
            doc.text("CAMPUS-2-CASH", margin, y);
            y += 6;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(...COLOR_TEXT_PRIMARY);
            doc.text("Student Venture Commercialization & Institutional Viability Audit", margin, y);
            y += 5;

            const dateStr = result.generatedAt ? new Date(result.generatedAt).toLocaleDateString() : new Date().toLocaleDateString();
            doc.setFontSize(7.5);
            doc.setTextColor(...COLOR_TEXT_MUTED);
            doc.text(`Generated: ${dateStr}  |  Rubric: 10 Dimensions & Groq GPT-OSS 20B Intelligence`, margin, y);
            y += 4;

            doc.setDrawColor(...COLOR_BORDER);
            doc.setLineWidth(0.5);
            doc.line(margin, y, pageWidth - margin, y);
            y += 6;

            // ── 1. Project Specifications ───────────────────────
            addSectionHeading("1. Venture Specification");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);
            doc.setTextColor(...COLOR_TEXT_PRIMARY);
            checkPageBreak(8);
            doc.text(projectInput.title || "Untitled Project", margin, y);
            y += 5;

            if (projectInput.techStack && projectInput.techStack.length > 0) {
                addParagraph(`Technology Stack: ${projectInput.techStack.join(", ")}`, 8.5, COLOR_ACCENT_MINT, true);
            }
            if (projectInput.targetAudience) {
                addParagraph(`Target Audience: ${projectInput.targetAudience}`, 8, COLOR_TEXT_MUTED);
            }
            if (projectInput.targetCountry) {
                addParagraph(`Target Region: ${projectInput.targetCountry}`, 8, COLOR_TEXT_MUTED);
            }

            addParagraph(projectInput.description || "No description provided.", 8.5, COLOR_TEXT_MUTED);
            y += 3;

            // ── 2. Real-World Value Evaluation ─────────────────
            addSectionHeading("2. Institutional Viability Score & Verdict");

            checkPageBreak(18);
            // Draw score card container
            doc.setFillColor(...COLOR_CARD);
            doc.setDrawColor(...COLOR_BORDER);
            doc.roundedRect(margin, y, contentWidth, 16, 2, 2, "FD");

            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(...COLOR_ACCENT_GOLD);
            doc.text(`Score: ${result.evaluation.realWorldValueScore.toFixed(1)} / 10`, margin + 5, y + 7);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(...COLOR_TEXT_PRIMARY);
            doc.text(`Verdict: ${result.evaluation.verdictEmoji || ""} ${result.evaluation.verdict}`, margin + 5, y + 13);
            y += 20;

            addParagraph(result.overallInsights || result.evaluation.overallInsights, 8.5, COLOR_TEXT_MUTED);
            y += 2;

            // ── 3. 10-Dimension Scorecard ──────────────────────
            if (result.evaluation.scorecard) {
                addSectionHeading("3. 10-Dimension Commercial Scorecard");
                const scEntries = Object.entries(result.evaluation.scorecard);

                for (const [, item] of scEntries) {
                    checkPageBreak(12);
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(8.5);
                    doc.setTextColor(...COLOR_TEXT_PRIMARY);
                    doc.text(`• ${item.label}`, margin + 2, y);

                    doc.setTextColor(...COLOR_ACCENT_GOLD);
                    doc.text(`${item.score}/10`, pageWidth - margin - 14, y);
                    y += 3.8;

                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(7.5);
                    doc.setTextColor(...COLOR_TEXT_MUTED);
                    const sumLines = doc.splitTextToSize(item.summary, contentWidth - 8);
                    checkPageBreak(sumLines.length * 3.6 + 2);
                    doc.text(sumLines, margin + 6, y);
                    y += sumLines.length * 3.6 + 2.5;
                }
            }

            // ── 4. Revenue Projections ─────────────────────────
            addSectionHeading("4. Revenue Scenarios");
            const rev = result.evaluation.revenueEstimate;
            addParagraph(`Timeframe: ${rev.timeframe}`, 8.5, COLOR_TEXT_PRIMARY, true);

            checkPageBreak(16);
            doc.setFillColor(...COLOR_CARD);
            doc.setDrawColor(...COLOR_BORDER);
            doc.roundedRect(margin, y, contentWidth, 14, 2, 2, "FD");

            const colW = contentWidth / 3;
            doc.setFontSize(7.5);
            doc.setTextColor(...COLOR_TEXT_MUTED);
            doc.text("Conservative", margin + 4, y + 5);
            doc.text("Realistic", margin + colW + 4, y + 5);
            doc.text("Optimistic", margin + colW * 2 + 4, y + 5);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(...COLOR_ACCENT_MINT);
            doc.text(formatRevenueDisplay(rev.conservative), margin + 4, y + 10);
            doc.setTextColor(...COLOR_ACCENT_GOLD);
            doc.text(formatRevenueDisplay(rev.realistic), margin + colW + 4, y + 10);
            doc.setTextColor(...COLOR_ACCENT_JADE);
            doc.text(formatRevenueDisplay(rev.optimistic), margin + colW * 2 + 4, y + 10);
            y += 18;

            if (rev.assumptions) {
                addParagraph(`Assumptions: ${safeRenderString(rev.assumptions)}`, 7.5, COLOR_TEXT_MUTED);
            }

            // ── 5. Monetization Opportunities ──────────────────
            addSectionHeading("5. Actionable Monetization Paths");
            result.paths.forEach((path, i) => {
                checkPageBreak(25);

                doc.setFillColor(...COLOR_CARD);
                doc.setDrawColor(...COLOR_BORDER);
                doc.roundedRect(margin, y, contentWidth, 10, 1.5, 1.5, "FD");

                doc.setFont("helvetica", "bold");
                doc.setFontSize(9.5);
                doc.setTextColor(...COLOR_ACCENT_GOLD);
                doc.text(`Path ${i + 1}: ${safeRenderString(path.model)}`, margin + 4, y + 6.5);

                doc.setFontSize(8);
                doc.setTextColor(...COLOR_TEXT_MUTED);
                doc.text(`[${safeRenderString(path.confidence)} Confidence]`, pageWidth - margin - 32, y + 6.5);
                y += 13;

                addParagraph(`Target Users: ${safeRenderString(path.targetUsers)}`, 8, COLOR_TEXT_PRIMARY, true);
                addParagraph(`Pricing Structure: ${formatPricingDisplay(path.pricing)}`, 8, COLOR_TEXT_MUTED);
                if (path.estimatedMRR) {
                    addParagraph(`Estimated MRR: ${formatRevenueDisplay(path.estimatedMRR)}`, 8, COLOR_ACCENT_JADE);
                }
                if (path.timeToFirstDollar) {
                    addParagraph(`Time to First Dollar: ${safeRenderString(path.timeToFirstDollar)}`, 8, COLOR_TEXT_MUTED);
                }
                addParagraph(`Why it fits: ${safeRenderString(path.whyItFits)}`, 8, COLOR_TEXT_MUTED);

                // Pricing tiers
                if (path.pricingTiers && path.pricingTiers.length > 0) {
                    addParagraph("Pricing Tiers:", 8, COLOR_TEXT_PRIMARY, true);
                    path.pricingTiers.forEach((tier) => {
                        const featStr = tier.features ? tier.features.map(f => safeRenderString(f)).join(", ") : "";
                        addParagraph(`  • ${safeRenderString(tier.name)} (${formatPricingDisplay(tier.price)}): ${featStr}`, 7.5, COLOR_TEXT_MUTED);
                    });
                }

                // Action steps
                if (path.steps && path.steps.length > 0) {
                    addParagraph("Execution Steps:", 8, COLOR_TEXT_PRIMARY, true);
                    path.steps.forEach((step, sIdx) => {
                        addParagraph(`  ${sIdx + 1}. ${safeRenderString(step)}`, 7.5, COLOR_TEXT_MUTED);
                    });
                }
                y += 3;
            });

            // ── 6. Strategic Insights ──────────────────────────
            if (result.strategicInsights) {
                addSectionHeading("6. Strategic Founder Guidance");

                addParagraph("Core Strengths:", 8.5, COLOR_ACCENT_JADE, true);
                result.strategicInsights.strengths.forEach((s, idx) => {
                    addParagraph(`  ${idx + 1}. ${s}`, 8, COLOR_TEXT_MUTED);
                });

                addParagraph("Critical Risks to Mitigate:", 8.5, COLOR_ACCENT_CORAL, true);
                result.strategicInsights.weaknesses.forEach((w, idx) => {
                    addParagraph(`  ${idx + 1}. ${w}`, 8, COLOR_TEXT_MUTED);
                });

                if (result.strategicInsights.secretWeapon) {
                    addParagraph("Secret Weapon:", 8.5, COLOR_ACCENT_GOLD, true);
                    addParagraph(`  ${result.strategicInsights.secretWeapon}`, 8, COLOR_TEXT_PRIMARY);
                }

                if (result.strategicInsights.quickWin) {
                    addParagraph("Quick Win This Week:", 8.5, COLOR_ACCENT_MINT, true);
                    addParagraph(`  ${result.strategicInsights.quickWin}`, 8, COLOR_TEXT_PRIMARY);
                }
            }

            // Safe filename creation
            const safeTitle = (projectInput.title || "campus2cash")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "")
                .slice(0, 40);

            doc.save(`${safeTitle}-monetization-report.pdf`);
            setStatus("success");
            setTimeout(() => setStatus("idle"), 4000);
        } catch (err: unknown) {
            console.error("PDF export failure:", err);
            setStatus("error");
            setErrorMessage(err instanceof Error ? err.message : "PDF generation failed. Please try again.");
            setTimeout(() => setStatus("idle"), 5000);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={handleExport}
                disabled={loading}
                aria-label="Export complete analysis report as PDF"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#162620] hover:bg-[#1C3029] border border-[#304F44] hover:border-[#C9A24B]/50 text-[#F4F6F0] hover:text-[#C9A24B] font-semibold text-xs sm:text-sm shadow-sm transition-all disabled:opacity-50"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#C9A24B]" />
                        <span>Generating PDF...</span>
                    </>
                ) : status === "success" ? (
                    <>
                        <CheckCircle2 className="w-4 h-4 text-[#2F9E75]" />
                        <span className="text-[#2F9E75]">Downloaded!</span>
                    </>
                ) : status === "error" ? (
                    <>
                        <AlertCircle className="w-4 h-4 text-[#F87171]" />
                        <span className="text-[#F87171]">Export Failed</span>
                    </>
                ) : (
                    <>
                        <Download className="w-4 h-4 text-[#C9A24B]" />
                        <span>Export PDF</span>
                    </>
                )}
            </button>
            {status === "error" && errorMessage && (
                <span className="text-xs text-[#F87171] max-w-[200px] truncate" title={errorMessage}>
                    {errorMessage}
                </span>
            )}
        </div>
    );
}
