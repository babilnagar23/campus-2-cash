"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
    X,
    Upload,
    FileText,
    Image as ImageIcon,
    Loader2,
    Sparkles,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Info,
    HelpCircle,
} from "lucide-react";
import { SAMPLE_PROJECTS } from "@/lib/sample-projects";
import { ProjectInput, SampleProject } from "@/types";
import { saveToLocalStorage, loadFromLocalStorage } from "@/lib/utils";

const TECH_SUGGESTIONS = [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Python",
    "FastAPI",
    "PostgreSQL",
    "MongoDB",
    "TailwindCSS",
    "Docker",
    "Supabase",
    "Firebase",
    "LangChain",
    "OpenAI",
    "Flutter",
    "React Native",
    "AWS",
    "Stripe",
    "Redis",
    "GraphQL",
];

const MAX_FILES = 3;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function InputPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [techInput, setTechInput] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [fileError, setFileError] = useState("");

    const [form, setForm] = useState<Omit<ProjectInput, "files">>({
        title: "",
        description: "",
        techStack: [],
        targetAudience: "",
        targetCountry: "",
        preferredRevenue: "any",
        knownCompetitors: "",
        githubUrl: "",
    });

    // Check for pre-selected sample from the landing page
    useEffect(() => {
        if (typeof window !== "undefined") {
            const sampleId = localStorage.getItem("selectedSample");
            if (sampleId) {
                const sample = SAMPLE_PROJECTS.find((s) => s.id === sampleId);
                if (sample) {
                    applySample(sample);
                }
                localStorage.removeItem("selectedSample");
            }
        }
    }, []);

    function applySample(sample: SampleProject) {
        setForm({
            title: sample.title,
            description: sample.description,
            techStack: [...sample.techStack],
            targetAudience: sample.targetAudience,
            targetCountry: "Global",
            preferredRevenue: sample.preferredRevenue || "any",
            knownCompetitors: "",
            githubUrl: "",
        });
        setError("");
        setFileError("");
    }

    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: any[]) => {
            setFileError("");

            if (rejectedFiles && rejectedFiles.length > 0) {
                const firstReject = rejectedFiles[0];
                if (firstReject.errors?.[0]?.code === "file-too-large") {
                    setFileError(`File "${firstReject.file.name}" exceeds the 10MB limit.`);
                } else {
                    setFileError(`File "${firstReject.file.name}" is not a supported format.`);
                }
            }

            if (acceptedFiles.length > 0) {
                setFiles((prev) => {
                    const combined = [...prev, ...acceptedFiles];
                    if (combined.length > MAX_FILES) {
                        setFileError(`Maximum of ${MAX_FILES} files allowed. Extra files were ignored.`);
                        return combined.slice(0, MAX_FILES);
                    }
                    return combined;
                });
            }
        },
        []
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "text/plain": [".txt"],
            "text/markdown": [".md"],
        },
        maxSize: MAX_FILE_SIZE,
        maxFiles: MAX_FILES,
    });

    function addTechTag(tag: string) {
        const trimmed = tag.trim().replace(/,/g, "");
        if (trimmed && !form.techStack.includes(trimmed)) {
            setForm((prev) => ({
                ...prev,
                techStack: [...prev.techStack, trimmed],
            }));
        }
        setTechInput("");
    }

    function removeTechTag(tagToRemove: string) {
        setForm((prev) => ({
            ...prev,
            techStack: prev.techStack.filter((t) => t !== tagToRemove),
        }));
    }

    function removeFile(indexToRemove: number) {
        setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
        setFileError("");
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setFileError("");

        const trimmedTitle = form.title.trim();
        const trimmedDesc = form.description.trim();

        if (!trimmedTitle) {
            setError("Project Title is required.");
            return;
        }
        if (!trimmedDesc) {
            setError("Project Description is required.");
            return;
        }
        if (trimmedDesc.length < 20) {
            setError("Please provide a slightly more descriptive summary of your project (at least 20 characters).");
            return;
        }

        // Validate GitHub URL if provided
        if (form.githubUrl?.trim()) {
            try {
                const url = new URL(form.githubUrl.trim());
                if (!["http:", "https:"].includes(url.protocol)) {
                    setError("GitHub URL must start with http:// or https://");
                    return;
                }
            } catch {
                setError("Please enter a valid GitHub URL or leave the field blank.");
                return;
            }
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", trimmedTitle);
            formData.append("description", trimmedDesc);
            formData.append("techStack", JSON.stringify(form.techStack));
            if (form.targetAudience?.trim()) formData.append("targetAudience", form.targetAudience.trim());
            if (form.targetCountry?.trim()) formData.append("targetCountry", form.targetCountry.trim());
            if (form.preferredRevenue) formData.append("preferredRevenue", form.preferredRevenue);
            if (form.knownCompetitors?.trim()) formData.append("knownCompetitors", form.knownCompetitors.trim());
            if (form.githubUrl?.trim()) formData.append("githubUrl", form.githubUrl.trim());

            files.forEach((file) => {
                formData.append("files", file);
            });

            const res = await fetch("/api/analyze", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Analysis failed. Please verify your project details.");
            }

            // Save results and project input to localStorage
            saveToLocalStorage("c2c_result", data);
            saveToLocalStorage("c2c_input", {
                ...form,
                title: trimmedTitle,
                description: trimmedDesc,
            });

            router.push("/dashboard");
        } catch (err: unknown) {
            console.error("Submission error:", err);
            setError(err instanceof Error ? err.message : "An unexpected error occurred during analysis.");
        } finally {
            setLoading(false);
        }
    }

    const filteredSuggestions = TECH_SUGGESTIONS.filter(
        (t) => t.toLowerCase().includes(techInput.toLowerCase()) && !form.techStack.includes(t)
    ).slice(0, 6);

    return (
        <div className="min-h-screen bg-[#080B09] text-[#F4F7F2] py-8 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                {/* Back Link & Brand Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#929B93] hover:text-[#B7F36B] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Home</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#172019] border border-[#27332B] flex items-center justify-center font-bold text-xs text-[#B7F36B]">
                            C2C
                        </div>
                        <span className="font-bold text-sm text-[#F4F7F2]">Campus-2-Cash</span>
                    </div>
                </div>

                {/* Page Title & Context */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#172019] border border-[#B7F36B]/30 text-[#B7F36B] text-xs font-semibold uppercase tracking-wider mb-3">
                        <Sparkles className="w-3.5 h-3.5" />
                        Project Submission Workspace
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F7F2] tracking-tight">
                        Tell Us About Your Project
                    </h1>
                    <p className="text-xs sm:text-sm text-[#929B93] mt-2 max-w-lg mx-auto leading-relaxed">
                        The more detail you provide about your problem, tech stack, and target users, the more actionable and accurate your monetization roadmap will be.
                    </p>
                </div>

                {/* Quick Sample Selector */}
                <div className="gradient-border bg-[#111713] rounded-2xl p-4 sm:p-5 mb-6 shadow-card-subtle">
                    <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-semibold text-[#F4F7F2] flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-[#B7F36B]" />
                            Pre-fill with a sample project:
                        </span>
                        <span className="text-[11px] text-[#929B93]">Click to load and edit</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {SAMPLE_PROJECTS.map((s) => (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => applySample(s)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-[#172019] hover:bg-[#B7F36B]/10 border border-[#27332B] hover:border-[#B7F36B]/40 text-[#929B93] hover:text-[#B7F36B] transition-all"
                            >
                                <span>{s.emoji}</span>
                                <span className="font-medium">{s.title}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Project Title */}
                    <div className="gradient-border bg-[#111713] rounded-2xl p-5 shadow-card-subtle">
                        <label htmlFor="project-title" className="block text-xs font-semibold text-[#F4F7F2] uppercase tracking-wider mb-2">
                            Project Title <span className="text-[#E05353]">*</span>
                        </label>
                        <input
                            id="project-title"
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                            placeholder="e.g. AI Campus Note-Taker"
                            disabled={loading}
                            required
                            className="w-full bg-[#101612] border border-[#27332B] rounded-xl px-4 py-3 text-sm text-[#F4F7F2] placeholder:text-[#929B93]/60 focus:outline-none focus:border-[#B7F36B] focus:ring-1 focus:ring-[#B7F36B] transition-colors disabled:opacity-50"
                        />
                    </div>

                    {/* Project Description */}
                    <div className="gradient-border bg-[#111713] rounded-2xl p-5 shadow-card-subtle">
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="project-desc" className="block text-xs font-semibold text-[#F4F7F2] uppercase tracking-wider">
                                Project Description <span className="text-[#E05353]">*</span>
                            </label>
                            <span className="text-[11px] text-[#929B93]">
                                {form.description.length} characters (100+ words recommended)
                            </span>
                        </div>
                        <textarea
                            id="project-desc"
                            value={form.description}
                            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                            placeholder="Describe what your software does, the specific pain point it addresses, who benefits from it, and any unique technical elements or competitive differentiation you have built."
                            rows={6}
                            disabled={loading}
                            required
                            className="w-full bg-[#101612] border border-[#27332B] rounded-xl px-4 py-3 text-sm text-[#F4F7F2] placeholder:text-[#929B93]/60 focus:outline-none focus:border-[#B7F36B] focus:ring-1 focus:ring-[#B7F36B] transition-colors resize-none disabled:opacity-50"
                        />
                    </div>

                    {/* Technology Stack Tags */}
                    <div className="gradient-border bg-[#111713] rounded-2xl p-5 shadow-card-subtle">
                        <label className="block text-xs font-semibold text-[#F4F7F2] uppercase tracking-wider mb-2">
                            Technology Stack
                        </label>

                        {/* Active Tags */}
                        {form.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {form.techStack.map((tag) => (
                                    <span key={tag} className="tag-chip">
                                        <span>{tag}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeTechTag(tag)}
                                            disabled={loading}
                                            aria-label={`Remove ${tag}`}
                                            className="hover:text-[#E05353] transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Tag Input */}
                        <div className="relative">
                            <input
                                type="text"
                                value={techInput}
                                onChange={(e) => setTechInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === ",") {
                                        e.preventDefault();
                                        if (techInput.trim()) {
                                            addTechTag(techInput);
                                        }
                                    }
                                }}
                                placeholder="Type a technology (e.g. Next.js, Python, PostgreSQL) and press Enter..."
                                disabled={loading}
                                className="w-full bg-[#101612] border border-[#27332B] rounded-xl px-4 py-3 text-sm text-[#F4F7F2] placeholder:text-[#929B93]/60 focus:outline-none focus:border-[#B7F36B] focus:ring-1 focus:ring-[#B7F36B] transition-colors disabled:opacity-50"
                            />

                            {/* Dropdown Suggestions */}
                            {techInput.trim() && filteredSuggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-[#172019] border border-[#27332B] rounded-xl shadow-xl z-20 overflow-hidden">
                                    {filteredSuggestions.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => addTechTag(s)}
                                            className="w-full text-left px-4 py-2 text-xs sm:text-sm text-[#F4F7F2] hover:bg-[#B7F36B]/15 hover:text-[#B7F36B] transition-colors"
                                        >
                                            + Add {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Optional Personalization Settings */}
                    <div className="gradient-border bg-[#111713] rounded-2xl p-5 shadow-card-subtle space-y-4">
                        <div className="flex items-center justify-between border-b border-[#27332B] pb-3">
                            <h3 className="text-xs font-semibold text-[#F4F7F2] uppercase tracking-wider">
                                Market Personalization <span className="text-[#929B93] lowercase font-normal">(optional)</span>
                            </h3>
                            <span className="text-[11px] text-[#929B93]">Refines monetization accuracy</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-[#929B93] mb-1.5">Target Audience</label>
                                <input
                                    type="text"
                                    value={form.targetAudience}
                                    onChange={(e) => setForm((p) => ({ ...p, targetAudience: e.target.value }))}
                                    placeholder="e.g. University STEM students, campus professors"
                                    disabled={loading}
                                    className="w-full bg-[#101612] border border-[#27332B] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#F4F7F2] placeholder:text-[#929B93]/60 focus:outline-none focus:border-[#B7F36B] transition-colors disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-[#929B93] mb-1.5">Target Region / Country</label>
                                <input
                                    type="text"
                                    value={form.targetCountry}
                                    onChange={(e) => setForm((p) => ({ ...p, targetCountry: e.target.value }))}
                                    placeholder="e.g. Global, India, North America, Southeast Asia"
                                    disabled={loading}
                                    className="w-full bg-[#101612] border border-[#27332B] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#F4F7F2] placeholder:text-[#929B93]/60 focus:outline-none focus:border-[#B7F36B] transition-colors disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-[#929B93] mb-1.5">Preferred Revenue Style</label>
                                <select
                                    value={form.preferredRevenue}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            preferredRevenue: e.target.value as ProjectInput["preferredRevenue"],
                                        }))
                                    }
                                    disabled={loading}
                                    className="w-full bg-[#101612] border border-[#27332B] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#F4F7F2] focus:outline-none focus:border-[#B7F36B] transition-colors disabled:opacity-50"
                                >
                                    <option value="any">Any Viable Business Model</option>
                                    <option value="passive">Passive / Automated Micro-SaaS</option>
                                    <option value="active">Active Freelance / Service-Led</option>
                                    <option value="b2b">B2B / University Department Contracts</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-[#929B93] mb-1.5">GitHub Repository URL</label>
                                <input
                                    type="url"
                                    value={form.githubUrl}
                                    onChange={(e) => setForm((p) => ({ ...p, githubUrl: e.target.value }))}
                                    placeholder="https://github.com/username/project"
                                    disabled={loading}
                                    className="w-full bg-[#101612] border border-[#27332B] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#F4F7F2] placeholder:text-[#929B93]/60 focus:outline-none focus:border-[#B7F36B] transition-colors disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-[#929B93] mb-1.5">Known Competitors or Alternatives</label>
                            <input
                                type="text"
                                value={form.knownCompetitors}
                                onChange={(e) => setForm((p) => ({ ...p, knownCompetitors: e.target.value }))}
                                placeholder="e.g. Notion, Otter.ai, Quizlet, Coursera"
                                disabled={loading}
                                className="w-full bg-[#101612] border border-[#27332B] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#F4F7F2] placeholder:text-[#929B93]/60 focus:outline-none focus:border-[#B7F36B] transition-colors disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* File Upload Zone */}
                    <div className="gradient-border bg-[#111713] rounded-2xl p-5 shadow-card-subtle">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-semibold text-[#F4F7F2] uppercase tracking-wider">
                                Supporting Project Documents <span className="text-[#929B93] lowercase font-normal">(optional · max 3)</span>
                            </h3>
                            <span className="text-[11px] text-[#929B93]">Max 10MB each</span>
                        </div>

                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                                isDragActive
                                    ? "border-[#B7F36B] bg-[#B7F36B]/10"
                                    : "border-[#27332B] hover:border-[#B7F36B]/50 hover:bg-[#172019]/40"
                            }`}
                        >
                            <input {...getInputProps()} />
                            <Upload className="w-8 h-8 text-[#929B93] mx-auto mb-2" />
                            <p className="text-sm font-semibold text-[#F4F7F2] mb-1">
                                {isDragActive ? "Drop your files here..." : "Drag & drop documents or click to browse"}
                            </p>
                            <p className="text-xs text-[#929B93]">
                                Supports PDF reports, TXT, and Markdown documents
                            </p>
                        </div>

                        {/* File Upload Error */}
                        {fileError && (
                            <p className="text-xs text-[#F87171] mt-2 flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>{fileError}</span>
                            </p>
                        )}

                        {/* Uploaded File List */}
                        {files.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {files.map((file, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between p-3 rounded-xl bg-[#080B09]/70 border border-[#27332B]"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            {file.type.startsWith("image/") ? (
                                                <ImageIcon className="w-4 h-4 text-[#64C995] flex-shrink-0" />
                                            ) : (
                                                <FileText className="w-4 h-4 text-[#B7F36B] flex-shrink-0" />
                                            )}
                                            <span className="text-xs font-medium text-[#F4F7F2] truncate">
                                                {file.name}
                                            </span>
                                            <span className="text-[11px] text-[#929B93]">
                                                ({(file.size / 1024).toFixed(0)} KB)
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(i)}
                                            disabled={loading}
                                            className="text-[#929B93] hover:text-[#E05353] p-1 transition-colors"
                                            aria-label={`Remove ${file.name}`}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Error Banner */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="p-4 rounded-xl bg-[#E05353]/15 border border-[#E05353]/30 text-[#F87171] text-xs sm:text-sm flex items-start gap-3"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#F87171]" />
                                <div>
                                    <strong className="font-bold block mb-0.5">Submission Error</strong>
                                    <span>{error}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-[#B7F36B] hover:bg-[#a5e754] text-[#080B09] font-bold text-base shadow-lime-glow transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Evaluating Project with AI...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                <span>Analyze & Generate Monetization Roadmap</span>
                            </>
                        )}
                    </button>

                    {loading && (
                        <p className="text-center text-xs text-[#929B93] animate-pulse">
                            Evaluating 10 viability dimensions · Cross-referencing 2026 market intelligence · Generating pricing tiers
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
