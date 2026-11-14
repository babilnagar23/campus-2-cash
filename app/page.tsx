"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    Zap,
    TrendingUp,
    Shield,
    ArrowRight,
    DollarSign,
    Target,
    Layers,
    FileText,
    Download,
    RefreshCw,
    CheckCircle2,
    Menu,
    X,
    ChevronDown,
    ChevronRight,
    Award,
    Compass,
    Rocket,
    Clock,
    Lock,
    Brain,
    BarChart3,
    Cpu,
    Flame,
    Users,
    Check,
    CheckCircle,
    Flag,
    Quote,
} from "lucide-react";
import { SAMPLE_PROJECTS } from "@/lib/sample-projects";
import { SampleProject } from "@/types";

export default function HomePage() {
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const navLinks = [
        { label: "Features", href: "#features" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "10 Dimensions", href: "#ten-dimensions" },
        { label: "Examples", href: "#examples" },
        { label: "FAQ", href: "#faq" },
    ];

    function handleSampleSelect(sample: SampleProject) {
        if (typeof window !== "undefined") {
            localStorage.setItem("selectedSample", sample.id);
        }
        router.push("/dashboard/input");
    }

    const FEATURES = [
        {
            icon: <Brain className="w-5 h-5 text-[#2F9E75]" />,
            iconBox: "bg-[#2F9E75]/15 border-[#2F9E75]/35 text-[#2F9E75]",
            title: "10-Dimension Evaluation",
            desc: "Evaluates your project across market demand, problem pain, uniqueness, technical feasibility, and founder fit.",
        },
        {
            icon: <DollarSign className="w-5 h-5 text-[#C9A24B]" />,
            iconBox: "bg-[#C9A24B]/15 border-[#C9A24B]/35 text-[#C9A24B]",
            title: "Tailored Monetization Models",
            desc: "Discovers viable business models, user personas, tiered pricing structures, and first customer funnels.",
        },
        {
            icon: <TrendingUp className="w-5 h-5 text-[#5CD1B3]" />,
            iconBox: "bg-[#0E5A47]/30 border-[#0E5A47]/60 text-[#5CD1B3]",
            title: "3 Revenue Scenarios",
            desc: "Generates realistic, conservative, and optimistic revenue forecasts with clear commercial assumptions.",
        },
        {
            icon: <Rocket className="w-5 h-5 text-[#D8B76B]" />,
            iconBox: "bg-[#D8B76B]/15 border-[#D8B76B]/35 text-[#D8B76B]",
            title: "First-Week Roadmap",
            desc: "Provides immediate, zero-budget validation steps student founders can execute in their first 7 days.",
        },
        {
            icon: <Shield className="w-5 h-5 text-[#2F9E75]" />,
            iconBox: "bg-[#2F9E75]/15 border-[#2F9E75]/35 text-[#2F9E75]",
            title: "Defensibility & Moat",
            desc: "Pinpoints your product's competitive advantages, technical differentiation, and barriers to entry.",
        },
        {
            icon: <RefreshCw className="w-5 h-5 text-[#C9A24B]" />,
            iconBox: "bg-[#C9A24B]/15 border-[#C9A24B]/35 text-[#C9A24B]",
            title: "Interactive AI Refinement",
            desc: "Iterate your recommendations by specifying regional focus, B2B preferences, or zero-budget constraints.",
        },
        {
            icon: <FileText className="w-5 h-5 text-[#5CD1B3]" />,
            iconBox: "bg-[#0E5A47]/30 border-[#0E5A47]/60 text-[#5CD1B3]",
            title: "Document Ingestion",
            desc: "Upload project PDFs, READMEs, or architecture specs to give the AI deep technical context.",
        },
        {
            icon: <Download className="w-5 h-5 text-[#D8B76B]" />,
            iconBox: "bg-[#D8B76B]/15 border-[#D8B76B]/35 text-[#D8B76B]",
            title: "Executive PDF Export",
            desc: "Generate professional, multi-page PDF briefing reports formatted for angel investors, grants, and mentors.",
        },
    ];

    const HOW_IT_WORKS = [
        {
            step: "01",
            title: "Describe Your Project",
            desc: "Enter your project title, description, tech stack, and optional target audience or PDF documents.",
            tag: "2-Minute Intake",
        },
        {
            step: "02",
            title: "AI Commercialization Engine",
            desc: "Groq GPT-OSS 20B analyzes your submission across 10 viability dimensions and market intelligence data.",
            tag: "Deep Viability Scoring",
        },
        {
            step: "03",
            title: "Launch & Monetize",
            desc: "Explore 3–5 tailored business models, revenue scenarios, pricing tiers, and an immediate 7-day action plan.",
            tag: "Validated Execution",
        },
    ];

    const TEN_DIMENSIONS = [
        { num: "01", name: "Market Size & Demand", desc: "Is there a hungry, addressable market actively seeking this solution?" },
        { num: "02", name: "Problem Severity", desc: "Is this solving an acute, hair-on-fire pain point that users will pay for?" },
        { num: "03", name: "Uniqueness & Moat", desc: "How defensible is the core value proposition against existing alternatives?" },
        { num: "04", name: "Technical Feasibility", desc: "Can the architecture be scaled reliably on bootstrapped infrastructure?" },
        { num: "05", name: "Monetization Potential", desc: "How naturally does the feature set convert into recurring revenue streams?" },
        { num: "06", name: "Scalability", desc: "Can the business grow 10× without a linear increase in operational costs?" },
        { num: "07", name: "Time-to-Revenue", desc: "How quickly can the founder reach their first paying customer (<45 days)?" },
        { num: "08", name: "Competitive Moat", desc: "What prevents larger incumbents or peers from replicating this in 90 days?" },
        { num: "09", name: "Student Founder Fit", desc: "Can student founders build and sell this with minimal capital and zero staff?" },
        { num: "10", name: "2026 Trend Alignment", desc: "Does this capitalize on AI workflows, open APIs, or new platform shifts?" },
    ];

    const FAQS = [
        {
            q: "What is Campus-2-Cash?",
            a: "Campus-2-Cash is an institutional AI-powered intelligence platform that evaluates academic, hackathon, and student software projects. It analyzes technical and commercial viability and generates concrete monetization models, pricing structures, and step-by-step launch plans.",
        },
        {
            q: "How does the AI evaluate my project?",
            a: "We use Groq Cloud's high-speed open-weights intelligence (openai/gpt-oss-20b) calibrated with specialized venture rubrics. The system assesses your project across 10 distinct commercial dimensions, comparing it against modern 2026 SaaS benchmarks and pricing patterns.",
        },
        {
            q: "Is my project data kept private?",
            a: "Yes, completely. Your project submissions and uploaded files are processed in real-time in server memory and are never saved to a database or used to train third-party AI models. Your analysis results are stored locally in your browser's private storage.",
        },
        {
            q: "Are the revenue estimates guaranteed?",
            a: "No. Revenue estimates are modeled forecasts based on conservative, realistic, and optimistic execution scenarios. They illustrate realistic commercial boundaries and unit economics rather than financial guarantees.",
        },
        {
            q: "Can I refine or steer the recommendations?",
            a: "Yes! Use the 'Refine' button on your results dashboard to give direct guidance. You can instruct the AI to focus on B2B contracts, regional markets like India, zero-budget strategies, or custom pricing tiers.",
        },
        {
            q: "Can I export my evaluation for investors or judges?",
            a: "Yes. The dashboard includes a one-click multi-page PDF export styled in an executive dark forest and champagne-gold theme, complete with viability scores, revenue scenarios, monetization roadmaps, and strategic guidance.",
        },
    ];

    return (
        <div className="min-h-screen bg-[#12201B] text-[#F4F6F0] selection:bg-[#C9A24B]/30 selection:text-[#FAF0DA]">
            {/* ── Fixed Editorial Header ──────────────────────────── */}
            <header className="fixed top-0 w-full z-50 bg-[#12201B]/90 backdrop-blur-md border-b border-[#304F44]/50 shadow-[0_1px_12px_rgba(0,0,0,0.25)]">
                <div className="h-20 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
                    {/* Brand Logo & Name */}
                    <div
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <div className="w-9 h-9 rounded-xl bg-[#162620] border border-[#304F44] flex items-center justify-center font-bold text-xs text-[#C9A24B] shadow-inner group-hover:border-[#C9A24B]/60 transition-colors">
                            C2C
                        </div>
                        <span className="font-serif text-xl sm:text-2xl text-[#F4F6F0] tracking-tight font-medium">
                            Campus-2-Cash
                        </span>
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-sm font-medium text-[#9EB0A5] hover:text-[#F4F6F0] transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Right Action Button (Desktop) */}
                    <div className="hidden lg:flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => router.push("/dashboard/input")}
                            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#0E5A47] hover:bg-[#13745C] text-white font-medium text-sm transition-all duration-200 shadow-sm border border-[#0E5A47] hover:border-[#2F9E75] group"
                        >
                            <span>Analyze Your Project</span>
                            <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Mobile Navigation Toggle */}
                    <div className="flex lg:hidden items-center gap-2">
                        <button
                            type="button"
                            onClick={() => router.push("/dashboard/input")}
                            className="px-3.5 py-1.5 rounded-full bg-[#0E5A47] text-white font-medium text-xs flex items-center gap-1"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-[#C9A24B]" />
                            <span>Analyze</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#162620] border border-[#304F44] text-[#F4F6F0]"
                            aria-label="Toggle navigation menu"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden bg-[#162620] border-b border-[#304F44] px-6 py-4 space-y-3"
                        >
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block text-sm font-medium text-[#9EB0A5] hover:text-[#C9A24B] py-1.5 transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        router.push("/dashboard/input");
                                    }}
                                    className="w-full py-3 rounded-full bg-[#0E5A47] text-white font-medium text-sm flex items-center justify-center gap-2"
                                >
                                    <span>Analyze My Project</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* ── Main Hero Section (Matching Editorial Desktop & Mobile Reference) ── */}
            <main className="pt-24 sm:pt-28 pb-16 relative overflow-hidden">
                {/* Ambient Sage/Gold Radial Glow Backgrounds */}
                <div className="absolute top-0 right-0 w-[600px] lg:w-[850px] h-[600px] lg:h-[850px] rounded-full pointer-events-none -mr-48 -mt-24 blur-[130px] opacity-30 bg-[#0E5A47]" />
                <div className="absolute top-1/2 left-0 w-[400px] lg:w-[500px] h-[400px] lg:h-[500px] rounded-full pointer-events-none -ml-36 blur-[110px] opacity-25 bg-[#C9A24B]" />

                <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 lg:pt-10 relative z-10">
                    {/* 2-Column Desktop Grid / Stacked Mobile */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
                        {/* ── LEFT COLUMN: Editorial Pitch (7 cols on desktop) ── */}
                        <div className="lg:col-span-7 flex flex-col items-start">
                            {/* Small Pill Badge with Gold Sparkle */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#162620] border border-[#304F44] shadow-sm mb-6 sm:mb-8"
                            >
                                <Sparkles className="w-4 h-4 text-[#C9A24B]" />
                                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#F4F6F0]">
                                    AI-Powered Project Intelligence
                                </span>
                            </motion.div>

                            {/* Master Headline with Hand-Drawn Gold Swash */}
                            <motion.h1
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="font-serif text-4xl sm:text-6xl lg:text-[72px] leading-[1.06] text-[#F4F6F0] tracking-tight mb-6"
                            >
                                Turn your student <br className="hidden sm:inline" />
                                project into a{" "}
                                <span className="relative inline-block italic text-[#2F9E75] font-serif font-medium pl-1">
                                    real business.
                                    {/* Hand-drawn Gold Swash SVG */}
                                    <svg
                                        className="absolute -bottom-2 left-0 w-full h-[14px] text-[#C9A24B] overflow-visible"
                                        fill="none"
                                        preserveAspectRatio="none"
                                        viewBox="0 0 320 20"
                                    >
                                        <path
                                            d="M4 14C78 4 195 3 316 12C240 7 132 8 68 17"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="3"
                                        />
                                    </svg>
                                </span>
                            </motion.h1>

                            {/* Subheading */}
                            <motion.p
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                className="text-base sm:text-lg text-[#9EB0A5] max-w-[560px] mb-8 sm:mb-10 leading-relaxed font-normal"
                            >
                                Discover your project&apos;s real-world commercial potential, choose the right business model, and get a clear roadmap to your first customer.
                            </motion.p>

                            {/* Dual CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10"
                            >
                                <button
                                    type="button"
                                    onClick={() => router.push("/dashboard/input")}
                                    className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#0E5A47] hover:bg-[#13745C] text-white font-medium text-base shadow-lg shadow-[#0E5A47]/30 border border-[#0E5A47] hover:border-[#2F9E75] transition-all duration-200 group"
                                >
                                    <span>Analyze My Project</span>
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <a
                                    href="#examples"
                                    className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#162620] hover:bg-[#1C3029] text-[#F4F6F0] font-medium text-base border border-[#304F44] hover:border-[#C9A24B]/50 transition-all duration-200"
                                >
                                    Explore Examples
                                </a>
                            </motion.div>

                            {/* Subtle Divider & Micro Trust Indicators */}
                            <div className="w-full pt-4">
                                <div className="h-[1px] w-full bg-[#304F44]/50 mb-6" />
                                <div className="flex flex-wrap items-center gap-y-3 gap-x-6 sm:gap-x-8 text-xs sm:text-sm font-medium text-[#F4F6F0]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-[#0E5A47]/30 border border-[#0E5A47]/60 flex items-center justify-center text-[#5CD1B3]">
                                            <Brain className="w-3.5 h-3.5" />
                                        </div>
                                        <span>AI-Powered Evaluation</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-[#C9A24B]/20 border border-[#C9A24B]/40 flex items-center justify-center text-[#C9A24B]">
                                            <DollarSign className="w-3.5 h-3.5" />
                                        </div>
                                        <span>Personalized Monetization</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-[#2F9E75]/20 border border-[#2F9E75]/40 flex items-center justify-center text-[#2F9E75]">
                                            <Compass className="w-3.5 h-3.5" />
                                        </div>
                                        <span>Practical Roadmaps</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT COLUMN: Layered Product Deck (5 cols on desktop) ── */}
                        <div className="lg:col-span-5 relative flex justify-center items-center py-4 lg:py-6">
                            {/* CARD A: Floating Top-Right Offset Scenario Card */}
                            <motion.div
                                initial={{ opacity: 0, y: -15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="hidden sm:block absolute -top-4 -right-2 sm:-right-4 z-30 bg-[#1C3029] border border-[#304F44] rounded-xl p-3.5 shadow-xl w-56"
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[10px] uppercase text-[#9EB0A5] tracking-wider font-semibold">
                                        Realistic Scenario
                                    </span>
                                    <span className="text-xs font-bold text-[#2F9E75] bg-[#2F9E75]/20 px-2 py-0.5 rounded-full border border-[#2F9E75]/40">
                                        +142% Trajectory
                                    </span>
                                </div>
                                {/* Sparkline Mini Chart */}
                                <div className="h-8 w-full flex items-end">
                                    <svg className="w-full h-8 overflow-visible" fill="none" viewBox="0 0 160 36">
                                        <path
                                            d="M0 32 L30 28 L65 24 L100 14 L130 16 L160 4"
                                            stroke="#2F9E75"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2.5"
                                        />
                                        <path
                                            d="M0 32 L30 28 L65 24 L100 14 L130 16 L160 4 V36 H0 Z"
                                            fill="url(#heroSparkGrad)"
                                            opacity="0.2"
                                        />
                                        <defs>
                                            <linearGradient id="heroSparkGrad" x1="0" y1="0" x2="0" y2="36" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#2F9E75" />
                                                <stop offset="1" stopColor="#12201B" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </motion.div>

                            {/* PRIMARY HERO ANALYSIS CARD (Rounded 24px, Deep Elevation) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="w-full bg-[#162620] border border-[#304F44] rounded-[24px] p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative z-20"
                            >
                                {/* Card Header Row */}
                                <div className="flex items-center justify-between pb-5 mb-5 border-b border-[#304F44]/60">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#1C3029] border border-[#304F44] flex items-center justify-center text-[#C9A24B]">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-lg text-[#F4F6F0] leading-tight font-medium">
                                                AI Campus Note-Taker
                                            </h3>
                                            <span className="text-[11px] text-[#9EB0A5]">
                                                Computer Science · NLP Capstone
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-wider text-[#C9A24B] bg-[#C9A24B]/15 border border-[#C9A24B]/30 px-2.5 py-1 rounded-full font-semibold">
                                        Illustrative Preview
                                    </span>
                                </div>

                                {/* Score & Potential Row with Circular Ring */}
                                <div className="bg-[#12201B] border border-[#304F44]/80 rounded-xl p-4 sm:p-5 mb-5 flex items-center gap-4 sm:gap-5">
                                    <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                                            <circle cx="32" cy="32" r="28" fill="none" stroke="#243C34" strokeWidth="4.5" />
                                            <circle
                                                cx="32"
                                                cy="32"
                                                r="28"
                                                fill="none"
                                                stroke="#C9A24B"
                                                strokeWidth="4.5"
                                                strokeLinecap="round"
                                                strokeDasharray="175.9"
                                                strokeDashoffset="28"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="font-mono text-xl font-bold text-[#F4F6F0] leading-none">
                                                8.4
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-[#C9A24B] font-semibold uppercase tracking-wider block mb-0.5">
                                            High Viability Index
                                        </span>
                                        <h4 className="font-serif text-lg text-[#F4F6F0] leading-snug font-medium">
                                            Strong Commercial Potential
                                        </h4>
                                    </div>
                                </div>

                                {/* 3 Slim Progress Bars */}
                                <div className="space-y-3.5 mb-5">
                                    <div>
                                        <div className="flex justify-between items-center mb-1 text-xs">
                                            <span className="text-[#9EB0A5] font-medium">Market Demand</span>
                                            <span className="font-mono font-semibold text-[#2F9E75]">9.2 / 10</span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-[#12201B] overflow-hidden border border-[#304F44]/50">
                                            <div className="h-full bg-[#0E5A47] rounded-full w-[92%]" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-1 text-xs">
                                            <span className="text-[#9EB0A5] font-medium">Technical Feasibility</span>
                                            <span className="font-mono font-semibold text-[#5CD1B3]">8.0 / 10</span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-[#12201B] overflow-hidden border border-[#304F44]/50">
                                            <div className="h-full bg-[#0E5A47] rounded-full w-[80%]" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-1 text-xs">
                                            <span className="text-[#9EB0A5] font-medium">Time-to-First-Dollar</span>
                                            <span className="font-mono font-semibold text-[#C9A24B]">9.0 / 10 (&lt;45 Days)</span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-[#12201B] overflow-hidden border border-[#304F44]/50">
                                            <div className="h-full bg-[#C9A24B] rounded-full w-[90%]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Monetization Recommendation Callout */}
                                <div className="bg-[#1C3029] border border-[#304F44] p-4 rounded-xl flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-semibold text-[#F4F6F0] truncate">
                                                Campus SaaS with .edu Freemium
                                            </span>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#2F9E75]/20 text-[#63D6AC] border border-[#2F9E75]/40 shrink-0">
                                                Optimal Fit
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#9EB0A5]">
                                            Modeled MRR: <strong className="text-[#C9A24B]">₹60,000–₹1,80,000/mo</strong>
                                        </p>
                                    </div>
                                    <div className="w-7 h-7 rounded-full bg-[#162620] border border-[#304F44] flex items-center justify-center shrink-0 text-[#2F9E75]">
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* CARD B: Floating Bottom-Left Offset Checklist Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="hidden sm:block absolute -bottom-6 -left-2 sm:-left-6 z-30 bg-[#1C3029] border border-[#304F44] rounded-xl p-4 shadow-xl w-60"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] uppercase text-[#9EB0A5] font-semibold tracking-wider">
                                        Venture Launchpath
                                    </span>
                                    <Flag className="w-3.5 h-3.5 text-[#C9A24B]" />
                                </div>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2 text-[#F4F6F0]">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2F9E75] shrink-0" />
                                        <span className="truncate">Pilot with 1 college group</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#F4F6F0]">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2F9E75] shrink-0" />
                                        <span className="truncate">Launch .edu freemium cohort</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#F4F6F0]">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" />
                                        <span className="truncate">First 10 paying accounts</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* ── BELOW THE HERO: Metric Benchmark Quad ── */}
                    <div className="mt-16 lg:mt-24 pt-8 border-t border-[#304F44]/50 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        <div className="flex flex-col pl-2 lg:pl-0">
                            <span className="font-serif text-3xl sm:text-5xl text-[#2F9E75] leading-tight font-medium">
                                10
                            </span>
                            <span className="text-sm sm:text-base font-semibold text-[#F4F6F0] mt-1">
                                Evaluation Dimensions
                            </span>
                            <span className="text-xs text-[#9EB0A5] mt-0.5">Comprehensive scoring engine</span>
                        </div>
                        <div className="flex flex-col pl-4 sm:pl-8 lg:border-l lg:border-[#304F44]/50">
                            <span className="font-serif text-3xl sm:text-5xl text-[#C9A24B] leading-tight font-medium">
                                3–5
                            </span>
                            <span className="text-sm sm:text-base font-semibold text-[#F4F6F0] mt-1">
                                Monetization Paths
                            </span>
                            <span className="text-xs text-[#9EB0A5] mt-0.5">Custom fit to student code</span>
                        </div>
                        <div className="flex flex-col pl-2 sm:pl-8 lg:border-l lg:border-[#304F44]/50">
                            <span className="font-serif text-3xl sm:text-5xl text-[#5CD1B3] leading-tight font-medium">
                                3
                            </span>
                            <span className="text-sm sm:text-base font-semibold text-[#F4F6F0] mt-1">
                                Revenue Scenarios
                            </span>
                            <span className="text-xs text-[#9EB0A5] mt-0.5">Conservative, real, ambitious</span>
                        </div>
                        <div className="flex flex-col pl-4 sm:pl-8 lg:border-l lg:border-[#304F44]/50">
                            <span className="font-serif text-3xl sm:text-5xl text-[#F4F6F0] leading-tight font-medium">
                                1
                            </span>
                            <span className="text-sm sm:text-base font-semibold text-[#F4F6F0] mt-1">
                                Action Roadmap
                            </span>
                            <span className="text-xs text-[#9EB0A5] mt-0.5">Direct line to customer zero</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* ── Section 1: Features ───────────────────────────────── */}
            <section id="features" className="py-20 bg-[#0E1915]/60 border-t border-[#304F44]/40">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#162620] border border-[#304F44] text-xs font-semibold uppercase tracking-wider text-[#C9A24B] mb-3">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Venture Intelligence Capabilities</span>
                        </div>
                        <h2 className="font-serif text-3xl sm:text-4xl text-[#F4F6F0] font-medium tracking-tight">
                            Everything You Need to Commercialize Student Code
                        </h2>
                        <p className="text-sm sm:text-base text-[#9EB0A5] mt-3 leading-relaxed">
                            Turn your academic prototype into a profitable venture with institutional-grade AI models built for student builders.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {FEATURES.map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="p-6 rounded-2xl bg-[#162620] border border-[#304F44] hover:border-[#C9A24B]/50 transition-all duration-200 flex flex-col justify-between"
                            >
                                <div>
                                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${f.iconBox}`}>
                                        {f.icon}
                                    </div>
                                    <h3 className="font-medium text-base text-[#F4F6F0] mb-2">{f.title}</h3>
                                    <p className="text-xs sm:text-sm text-[#9EB0A5] leading-relaxed">{f.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Section 2: How It Works ────────────────────────────── */}
            <section id="how-it-works" className="py-20 bg-[#12201B] border-t border-[#304F44]/40">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="text-center max-w-xl mx-auto mb-14">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#162620] border border-[#304F44] text-xs font-semibold uppercase tracking-wider text-[#2F9E75] mb-3">
                            <Compass className="w-3.5 h-3.5" />
                            <span>Structured Methodology</span>
                        </div>
                        <h2 className="font-serif text-3xl sm:text-4xl text-[#F4F6F0] font-medium tracking-tight">
                            From Repository to Recurring Revenue in 3 Steps
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {HOW_IT_WORKS.map((step, idx) => (
                            <div
                                key={step.step}
                                className="p-7 rounded-2xl bg-[#162620] border border-[#304F44] hover:border-[#2F9E75]/50 transition-all duration-200 relative"
                            >
                                <span className="font-serif text-3xl text-[#C9A24B] font-bold block mb-3">
                                    {step.step}
                                </span>
                                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#2F9E75] block mb-2">
                                    {step.tag}
                                </span>
                                <h3 className="font-medium text-lg text-[#F4F6F0] mb-2">{step.title}</h3>
                                <p className="text-xs sm:text-sm text-[#9EB0A5] leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Section 3: 10 Dimensions ───────────────────────────── */}
            <section id="ten-dimensions" className="py-20 bg-[#0E1915]/60 border-t border-[#304F44]/40">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#162620] border border-[#304F44] text-xs font-semibold uppercase tracking-wider text-[#C9A24B] mb-3">
                            <Layers className="w-3.5 h-3.5" />
                            <span>Rigorous Evaluation Framework</span>
                        </div>
                        <h2 className="font-serif text-3xl sm:text-4xl text-[#F4F6F0] font-medium tracking-tight">
                            The 10-Dimension Viability Rubric
                        </h2>
                        <p className="text-xs sm:text-sm text-[#9EB0A5] mt-2 leading-relaxed">
                            Every project is scored on a standardized 1–10 scale across 10 critical pillars calibrated to venture feasibility.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {TEN_DIMENSIONS.map((dim) => (
                            <div
                                key={dim.num}
                                className="p-4 rounded-xl bg-[#162620] border border-[#304F44] hover:border-[#C9A24B]/40 transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <span className="font-mono text-xs font-bold text-[#C9A24B]">{dim.num}</span>
                                    <h4 className="font-medium text-sm text-[#F4F6F0] mt-1 mb-1.5">{dim.name}</h4>
                                    <p className="text-[11px] text-[#9EB0A5] leading-relaxed">{dim.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Section 4: Interactive Sample Projects ─────────────── */}
            <section id="examples" className="py-20 bg-[#12201B] border-t border-[#304F44]/40">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#162620] border border-[#304F44] text-xs font-semibold uppercase tracking-wider text-[#2F9E75] mb-3">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Interactive Demonstrations</span>
                            </div>
                            <h2 className="font-serif text-3xl sm:text-4xl text-[#F4F6F0] font-medium tracking-tight">
                                Explore Pre-Loaded Student Projects
                            </h2>
                            <p className="text-xs sm:text-sm text-[#9EB0A5] mt-1">
                                Click any sample project to pre-fill the workspace and explore its monetization roadmap.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {SAMPLE_PROJECTS.slice(0, 3).map((sample) => (
                            <div
                                key={sample.id}
                                className="p-6 rounded-2xl bg-[#162620] border border-[#304F44] hover:border-[#C9A24B]/60 transition-all flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[11px] uppercase tracking-wider font-semibold text-[#C9A24B] bg-[#C9A24B]/15 px-2.5 py-0.5 rounded-full border border-[#C9A24B]/30">
                                            {sample.targetAudience}
                                        </span>
                                    </div>
                                    <h3 className="font-serif text-xl font-medium text-[#F4F6F0] mb-2 group-hover:text-[#C9A24B] transition-colors">
                                        {sample.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-[#9EB0A5] leading-relaxed line-clamp-3 mb-4">
                                        {sample.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mb-6">
                                        {sample.techStack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-2 py-0.5 rounded bg-[#1C3029] text-[#9EB0A5] text-[10px] border border-[#304F44]"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleSampleSelect(sample)}
                                    className="w-full py-2.5 rounded-xl bg-[#0E5A47] hover:bg-[#13745C] text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#0E5A47]"
                                >
                                    <span>Analyze This Sample</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Section 5: FAQ ────────────────────────────────────── */}
            <section id="faq" className="py-20 bg-[#0E1915]/60 border-t border-[#304F44]/40">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#162620] border border-[#304F44] text-xs font-semibold uppercase tracking-wider text-[#C9A24B] mb-3">
                            <Target className="w-3.5 h-3.5" />
                            <span>Common Questions</span>
                        </div>
                        <h2 className="font-serif text-3xl sm:text-4xl text-[#F4F6F0] font-medium tracking-tight">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {FAQS.map((faq, index) => {
                            const isOpen = openFaqIndex === index;
                            return (
                                <div
                                    key={index}
                                    className="rounded-xl bg-[#162620] border border-[#304F44] overflow-hidden transition-colors"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                                        className="w-full px-5 py-4 text-left flex items-center justify-between gap-4"
                                    >
                                        <span className="text-sm sm:text-base font-medium text-[#F4F6F0]">{faq.q}</span>
                                        <ChevronDown
                                            className={`w-4 h-4 text-[#C9A24B] transition-transform ${
                                                isOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="px-5 pb-4 text-xs sm:text-sm text-[#9EB0A5] leading-relaxed border-t border-[#304F44]/50 pt-3"
                                            >
                                                {faq.a}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Section 6: Bottom Call to Action ──────────────────── */}
            <section className="py-20 bg-[#12201B] border-t border-[#304F44]/40">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="p-8 sm:p-12 rounded-3xl bg-[#162620] border border-[#304F44] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#0E5A47]/20 blur-3xl pointer-events-none -mr-20 -mt-20" />
                        <div className="relative z-10 space-y-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A24B]/15 border border-[#C9A24B]/30 text-xs font-semibold text-[#C9A24B] uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5" />
                                Ready to Test Your Project?
                            </span>
                            <h2 className="font-serif text-3xl sm:text-4xl text-[#F4F6F0] font-medium tracking-tight">
                                Evaluate Your Project in Under 60 Seconds
                            </h2>
                            <p className="text-sm text-[#9EB0A5] max-w-lg mx-auto leading-relaxed">
                                Join student innovators turning semester projects, hackathon prototypes, and research code into viable commercial software ventures.
                            </p>
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={() => router.push("/dashboard/input")}
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#0E5A47] hover:bg-[#13745C] text-white font-medium text-base shadow-lg transition-all border border-[#0E5A47] hover:border-[#2F9E75]"
                                >
                                    <span>Analyze My Project Now</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ────────────────────────────────────────────── */}
            <footer className="w-full bg-[#0E1915] border-t border-[#304F44]/40 py-10">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-[#304F44]/40">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-[#162620] border border-[#304F44] flex items-center justify-center font-bold text-[10px] text-[#C9A24B]">
                                C2C
                            </div>
                            <span className="font-serif text-lg text-[#F4F6F0] font-medium">Campus-2-Cash</span>
                        </div>
                        <p className="text-xs text-[#9EB0A5] text-center md:text-right">
                            Translating student engineering and collegiate research into viable venture architecture.
                        </p>
                    </div>
                    <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#9EB0A5]">
                        <span>© 2026 Campus-2-Cash. Powered by Groq • openai/gpt-oss-20b. All rights reserved.</span>
                        <div className="flex items-center gap-4">
                            <a href="#features" className="hover:text-[#F4F6F0] transition-colors">Features</a>
                            <a href="#ten-dimensions" className="hover:text-[#F4F6F0] transition-colors">10 Dimensions</a>
                            <a href="#examples" className="hover:text-[#F4F6F0] transition-colors">Examples</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
