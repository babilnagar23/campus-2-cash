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
    Award,
    Compass,
    Rocket,
    Clock,
    Lock,
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
        { label: "10 Dimensions", href: "#dimensions" },
        { label: "Examples", href: "#samples" },
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
            icon: <Award className="w-5 h-5 text-[#B7F36B]" />,
            title: "AI Project Evaluation",
            desc: "Evaluates your project against market demand, problem pain, uniqueness, technical feasibility, and scalability.",
        },
        {
            icon: <DollarSign className="w-5 h-5 text-[#64C995]" />,
            title: "Revenue Potential",
            desc: "Generates conservative, realistic, and optimistic revenue scenarios with clear assumptions.",
        },
        {
            icon: <Compass className="w-5 h-5 text-[#B7F36B]" />,
            title: "Monetization Strategies",
            desc: "Discovers viable business models, user personas, tiered pricing structures, and first customer funnels.",
        },
        {
            icon: <Zap className="w-5 h-5 text-[#FCD34D]" />,
            title: "Strategic Roadmap",
            desc: "Provides immediate, zero-budget validation steps you can execute in your first 7 days.",
        },
        {
            icon: <Shield className="w-5 h-5 text-[#64C995]" />,
            title: "Competitive Moat",
            desc: "Pinpoints your product's defensibility, core differentiation, and realistic barriers to entry.",
        },
        {
            icon: <RefreshCw className="w-5 h-5 text-[#B7F36B]" />,
            title: "Refine With AI",
            desc: "Iterate your recommendations by specifying market preferences, regional focus, or revenue style.",
        },
        {
            icon: <FileText className="w-5 h-5 text-[#64C995]" />,
            title: "Project File Analysis",
            desc: "Upload project PDFs, design mockups, and text documents for context-aware commercial analysis.",
        },
        {
            icon: <Download className="w-5 h-5 text-[#B7F36B]" />,
            title: "PDF Pitch Reports",
            desc: "Export an executive multi-page summary ready for hackathon judges, professors, or investors.",
        },
    ];

    const DIMENSIONS = [
        {
            number: "01",
            title: "Market Size & Demand",
            summary: "Quantifies the addressable audience and validates existing demand in current market dynamics.",
        },
        {
            number: "02",
            title: "Problem Severity",
            summary: "Assesses how painful the target problem is and whether users actively pay to solve it.",
        },
        {
            number: "03",
            title: "Uniqueness & Moat",
            summary: "Analyzes direct alternatives and identifies defensive differentiation against competitors.",
        },
        {
            number: "04",
            title: "Technical Feasibility",
            summary: "Evaluates whether a student team can realistically ship and maintain the product with their stack.",
        },
        {
            number: "05",
            title: "Monetization Potential",
            summary: "Tests how naturally the product accommodates subscriptions, usage fees, or enterprise licenses.",
        },
        {
            number: "06",
            title: "Scalability",
            summary: "Measures whether the software architecture can grow from 10 to 10,000 users without rebuilds.",
        },
        {
            number: "07",
            title: "Time-to-Revenue",
            summary: "Determines how quickly the founders can collect their first dollar from real customers.",
        },
        {
            number: "08",
            title: "Competitive Moat",
            summary: "Estimates how difficult it is for existing incumbents or peers to replicate the core product in 90 days.",
        },
        {
            number: "09",
            title: "Student Founder Fit",
            summary: "Verifies whether the student team has unique domain proximity, distribution, and agility.",
        },
        {
            number: "10",
            title: "Trend Alignment",
            summary: "Aligns your architecture with current AI agent, micro-SaaS, and edge automation workflows.",
        },
    ];

    const FAQ_ITEMS = [
        {
            q: "What is Campus-2-Cash?",
            a: "Campus-2-Cash is an AI-powered intelligence platform that evaluates academic, hackathon, and student software projects. It analyzes technical and commercial viability and generates concrete monetization models, pricing structures, and step-by-step launch plans.",
        },
        {
            q: "Who should use this platform?",
            a: "Any student, hackathon participant, recent graduate, or indie hacker with a functional project or prototype who wants to understand whether their idea has commercial potential and how to acquire paying customers.",
        },
        {
            q: "How does the project evaluation work?",
            a: "The platform evaluates your project input against 10 rigorous commercialization dimensions. Each dimension receives a score from 1 to 10 with written justification. The master score reflects real-world commercial viability.",
        },
        {
            q: "Can I upload a project report or diagram?",
            a: "Yes. You can upload up to 3 supporting files (PDF reports, system architecture diagrams, PNG/JPG/WEBP screenshots, or Markdown/text notes) up to 10MB each. The AI extracts and analyzes the contents alongside your description.",
        },
        {
            q: "Does it support different technology stacks?",
            a: "Absolutely. Whether you built your project with Python, React, Next.js, Flutter, Rust, Node.js, or embedded IoT systems, the AI evaluates feasibility and monetization in direct relation to your specific stack.",
        },
        {
            q: "Are revenue estimates guaranteed?",
            a: "No. Revenue estimates are modeled forecasts based on conservative, realistic, and optimistic execution scenarios. They illustrate realistic commercial boundaries rather than financial guarantees.",
        },
        {
            q: "Can I refine the AI recommendations?",
            a: "Yes! Use the 'Refine' button on your results dashboard to give direct feedback. You can tell the AI to focus on B2B contracts, regional markets like India, zero-budget strategies, or custom pricing tiers.",
        },
        {
            q: "Can I download a PDF report?",
            a: "Yes. The dashboard includes a one-click multi-page PDF export that compiles your project summary, evaluation scores, revenue forecasts, monetization paths, and strategic guidance into a clean pitch document.",
        },
        {
            q: "Are my projects stored on a central server?",
            a: "No. Campus-2-Cash uses browser-local storage for your results. We do not store your intellectual property in a central database or require an account.",
        },
    ];

    return (
        <div className="min-h-screen bg-[#080B09] text-[#F4F7F2] selection:bg-[#B7F36B] selection:text-[#080B09]">
            {/* Sticky Navigation Bar */}
            <header className="sticky top-0 z-40 bg-[#080B09]/90 backdrop-blur-md border-b border-[#27332B]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    {/* Brand Monogram & Name */}
                    <a href="#" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-[#172019] border border-[#27332B] flex items-center justify-center font-extrabold text-xs text-[#B7F36B] group-hover:border-[#B7F36B]/50 transition-colors">
                            C2C
                        </div>
                        <span className="font-bold text-base sm:text-lg tracking-tight text-[#F4F7F2]">
                            Campus<span className="text-[#B7F36B]">-2-</span>Cash
                        </span>
                    </a>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-xs sm:text-sm font-medium text-[#929B93] hover:text-[#B7F36B] transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Right CTA */}
                    <div className="hidden sm:flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => router.push("/dashboard/input")}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B7F36B] hover:bg-[#a5e754] text-[#080B09] font-bold text-xs sm:text-sm shadow-lime-glow-sm transition-all"
                        >
                            <span>Analyze Your Project</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle mobile menu"
                        className="md:hidden p-2 rounded-lg text-[#929B93] hover:text-[#F4F7F2] hover:bg-[#172019] transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Navigation Drawer */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-[#0D120F] border-b border-[#27332B] px-4 py-4 space-y-3"
                        >
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block text-sm font-medium text-[#929B93] hover:text-[#B7F36B] py-1.5 transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="pt-2 border-t border-[#27332B]">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        router.push("/dashboard/input");
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#B7F36B] text-[#080B09] font-bold text-sm shadow-lime-glow-sm"
                                >
                                    <span>Analyze Your Project</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Hero Section (Two-Column Layout) */}
            <section className="relative hero-gradient pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden border-b border-[#27332B]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Left Column: Product Introduction */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="lg:col-span-7 space-y-6"
                        >
                            {/* Eyebrow Badge */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#172019] border border-[#B7F36B]/30 text-[#B7F36B] text-xs font-semibold uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5 text-[#B7F36B]" />
                                AI-POWERED PROJECT INTELLIGENCE
                            </div>

                            {/* Main Headline */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#F4F7F2] tracking-tight leading-[1.1]">
                                Turn Your Student Project{" "}
                                <span className="text-[#B7F36B]">Into a Real Business.</span>
                            </h1>

                            {/* Supporting Text */}
                            <p className="text-base sm:text-lg text-[#929B93] leading-relaxed max-w-2xl">
                                Discover your project&apos;s real-world potential, explore profitable business models, evaluate your market opportunity, and get an actionable roadmap to your first customer.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => router.push("/dashboard/input")}
                                    className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#B7F36B] hover:bg-[#a5e754] text-[#080B09] font-bold text-sm sm:text-base shadow-lime-glow transition-all"
                                >
                                    <span>Analyze My Project</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                <a
                                    href="#samples"
                                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#111713] hover:bg-[#172019] border border-[#27332B] hover:border-[#B7F36B]/40 text-[#F4F7F2] font-semibold text-sm sm:text-base transition-all"
                                >
                                    <span>Explore Examples</span>
                                </a>
                            </div>

                            {/* Product Benefits */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#27332B]/60 text-xs text-[#929B93]">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#B7F36B] flex-shrink-0" />
                                    <span>AI-Powered Evaluation</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#B7F36B] flex-shrink-0" />
                                    <span>Personalized Monetization</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#B7F36B] flex-shrink-0" />
                                    <span>Practical Roadmaps</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column: Interactive Product-Interface Preview */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="lg:col-span-5"
                        >
                            <div className="gradient-border bg-[#111713] rounded-2xl p-5 shadow-2xl relative overflow-hidden">
                                {/* Illustrative Sample Banner */}
                                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#27332B]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#B7F36B]" />
                                        <span className="text-xs font-bold text-[#F4F7F2]">
                                            AI Campus Note-Taker
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#172019] border border-[#27332B] text-[#929B93]">
                                        ILLUSTRATIVE PREVIEW
                                    </span>
                                </div>

                                {/* Score Meter Header */}
                                <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#080B09]/70 border border-[#27332B] mb-4">
                                    <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                                        <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
                                            <circle cx="28" cy="28" r="23" fill="none" stroke="#172019" strokeWidth="4.5" />
                                            <circle
                                                cx="28"
                                                cy="28"
                                                r="23"
                                                fill="none"
                                                stroke="#B7F36B"
                                                strokeWidth="4.5"
                                                strokeLinecap="round"
                                                strokeDasharray={2 * Math.PI * 23}
                                                strokeDashoffset={2 * Math.PI * 23 * 0.16}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-sm font-extrabold text-[#B7F36B]">8.4</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm">⚡</span>
                                            <span className="text-xs sm:text-sm font-bold text-[#64C995]">
                                                Strong Commercial Potential
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-[#929B93] mt-0.5">
                                            High problem severity and fast student adoption loop
                                        </p>
                                    </div>
                                </div>

                                {/* Sample Dimension Mini-Bars */}
                                <div className="space-y-2 mb-4">
                                    {[
                                        { label: "Market Demand", score: "9/10", pct: "90%", color: "bg-[#B7F36B]" },
                                        { label: "Technical Feasibility", score: "8/10", pct: "80%", color: "bg-[#64C995]" },
                                        { label: "Time-to-Revenue", score: "9/10", pct: "90%", color: "bg-[#B7F36B]" },
                                    ].map((dim) => (
                                        <div key={dim.label} className="text-xs">
                                            <div className="flex justify-between text-[11px] mb-1">
                                                <span className="text-[#929B93]">{dim.label}</span>
                                                <span className="font-semibold text-[#F4F7F2]">{dim.score}</span>
                                            </div>
                                            <div className="h-1.5 bg-[#172019] rounded-full overflow-hidden">
                                                <div className={`h-full ${dim.color} rounded-full`} style={{ width: dim.pct }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Sample Monetization Model Card */}
                                <div className="p-3.5 rounded-xl bg-[#172019] border border-[#27332B] mb-3">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <span className="text-xs font-bold text-[#F4F7F2]">
                                            Campus-SaaS with .edu Freemium
                                        </span>
                                        <span className="text-[10px] font-bold text-[#B7F36B] px-1.5 py-0.5 rounded bg-[#B7F36B]/10 border border-[#B7F36B]/20">
                                            High Fit
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-[#929B93] mb-2">
                                        Pricing: Free basic (2 hrs/mo) · ₹299/mo Pro tier with unlimited audio sync
                                    </p>
                                    <div className="flex items-center justify-between text-[11px] text-[#F4F7F2] pt-2 border-t border-[#27332B]">
                                        <span>Est. First Year:</span>
                                        <span className="font-bold text-[#B7F36B]">₹60,000–₹180,000/mo</span>
                                    </div>
                                </div>

                                {/* Secret Weapon Preview */}
                                <div className="p-2.5 rounded-lg bg-[#080B09]/80 border border-[#27332B] flex items-center gap-2 text-xs text-[#929B93]">
                                    <Sparkles className="w-3.5 h-3.5 text-[#B7F36B] flex-shrink-0" />
                                    <span className="text-[11px] truncate">
                                        <strong className="text-[#F4F7F2]">Insight: </strong>
                                        Zero-cost peer distribution inside active lecture halls
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Key Statistics / Analysis Depth */}
            <section className="py-12 bg-[#0D120F] border-b border-[#27332B]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="p-4 rounded-xl bg-[#111713] border border-[#27332B]">
                            <div className="text-3xl sm:text-4xl font-extrabold text-[#B7F36B]">10</div>
                            <div className="text-xs sm:text-sm font-semibold text-[#F4F7F2] mt-1">
                                Evaluation Dimensions
                            </div>
                            <div className="text-[11px] text-[#929B93] mt-0.5">
                                Market, moat, founder fit & feasibility
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-[#111713] border border-[#27332B]">
                            <div className="text-3xl sm:text-4xl font-extrabold text-[#64C995]">3–5</div>
                            <div className="text-xs sm:text-sm font-semibold text-[#F4F7F2] mt-1">
                                Monetization Paths
                            </div>
                            <div className="text-[11px] text-[#929B93] mt-0.5">
                                Tailored business models & pricing tiers
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-[#111713] border border-[#27332B]">
                            <div className="text-3xl sm:text-4xl font-extrabold text-[#FCD34D]">3</div>
                            <div className="text-xs sm:text-sm font-semibold text-[#F4F7F2] mt-1">
                                Revenue Scenarios
                            </div>
                            <div className="text-[11px] text-[#929B93] mt-0.5">
                                Conservative, realistic & optimistic
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-[#111713] border border-[#27332B]">
                            <div className="text-3xl sm:text-4xl font-extrabold text-[#B7F36B]">100%</div>
                            <div className="text-xs sm:text-sm font-semibold text-[#F4F7F2] mt-1">
                                Actionable Roadmaps
                            </div>
                            <div className="text-[11px] text-[#929B93] mt-0.5">
                                Concrete zero-budget steps for week 1
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-[#080B09] border-b border-[#27332B]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#172019] border border-[#27332B] text-[#B7F36B] text-xs font-semibold uppercase tracking-wider mb-3">
                            <Layers className="w-3.5 h-3.5" />
                            Comprehensive Engine
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-[#F4F7F2]">
                            Everything You Need to Monetize Your Idea
                        </h2>
                        <p className="text-sm sm:text-base text-[#929B93] mt-3">
                            Built specifically for students with functioning code, prototypes, and coursework who want to launch a sustainable startup.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {FEATURES.map((f) => (
                            <div
                                key={f.title}
                                className="gradient-border bg-[#111713] rounded-2xl p-5 hover:bg-[#172019]/60 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-[#080B09] border border-[#27332B] flex items-center justify-center mb-4 group-hover:border-[#B7F36B]/40 transition-colors">
                                    {f.icon}
                                </div>
                                <h3 className="font-bold text-[#F4F7F2] text-sm mb-2">{f.title}</h3>
                                <p className="text-xs text-[#929B93] leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-[#0D120F] border-b border-[#27332B]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#172019] border border-[#27332B] text-[#B7F36B] text-xs font-semibold uppercase tracking-wider mb-3">
                            <Rocket className="w-3.5 h-3.5" />
                            Clear 4-Step Process
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-[#F4F7F2]">
                            From Academic Code to Real Cash
                        </h2>
                        <p className="text-sm sm:text-base text-[#929B93] mt-3">
                            A straightforward journey designed for student founders with no prior business experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                        {[
                            {
                                step: "01",
                                title: "Submit Your Project",
                                desc: "Enter your project title, description, tech stack, and optional project files or architecture screenshots.",
                            },
                            {
                                step: "02",
                                title: "AI Evaluates Your Idea",
                                desc: "Groq (openai/gpt-oss-120b) assesses your product across 10 commercial dimensions and predicts real-world value.",
                            },
                            {
                                step: "03",
                                title: "Discover Opportunities",
                                desc: "Review 3–5 monetization paths complete with pricing tiers, customer funnels, and revenue scenarios.",
                            },
                            {
                                step: "04",
                                title: "Refine, Plan & Export",
                                desc: "Guide the AI with feedback to reshape suggestions, then download your comprehensive PDF pitch summary.",
                            },
                        ].map((s, idx) => (
                            <div
                                key={s.step}
                                className="gradient-border bg-[#111713] rounded-2xl p-6 relative flex flex-col justify-between"
                            >
                                <div>
                                    <div className="text-xs font-mono font-bold text-[#B7F36B] mb-3">
                                        STEP {s.step}
                                    </div>
                                    <h3 className="text-base font-bold text-[#F4F7F2] mb-2">{s.title}</h3>
                                    <p className="text-xs text-[#929B93] leading-relaxed">{s.desc}</p>
                                </div>
                                {idx < 3 && (
                                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-[#172019] border border-[#27332B] flex items-center justify-center text-[#B7F36B] text-xs">
                                        →
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 10 Evaluation Dimensions Section */}
            <section id="dimensions" className="py-20 bg-[#080B09] border-b border-[#27332B]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#172019] border border-[#27332B] text-[#B7F36B] text-xs font-semibold uppercase tracking-wider mb-3">
                            <Target className="w-3.5 h-3.5" />
                            Rigorous Viability Rubric
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-[#F4F7F2]">
                            The 10 Dimensions of Student Viability
                        </h2>
                        <p className="text-sm sm:text-base text-[#929B93] mt-3">
                            Every project is scored on these ten specific pillars to determine whether it can transition into an independent company.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                        {DIMENSIONS.map((dim) => (
                            <div
                                key={dim.number}
                                className="p-4 rounded-xl bg-[#111713] border border-[#27332B] hover:border-[#B7F36B]/30 transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <span className="text-xs font-mono font-bold text-[#64C995] mb-2 block">
                                        {dim.number}
                                    </span>
                                    <h3 className="font-bold text-[#F4F7F2] text-xs sm:text-sm mb-1.5">
                                        {dim.title}
                                    </h3>
                                    <p className="text-[11px] text-[#929B93] leading-relaxed">{dim.summary}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pre-Loaded Demo Projects (5 Projects) */}
            <section id="samples" className="py-20 bg-[#0D120F] border-b border-[#27332B]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#172019] border border-[#27332B] text-[#B7F36B] text-xs font-semibold uppercase tracking-wider mb-3">
                            <Sparkles className="w-3.5 h-3.5" />
                            Pre-Loaded Demo Projects
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-[#F4F7F2]">
                            Explore Real Student Scenarios
                        </h2>
                        <p className="text-sm sm:text-base text-[#929B93] mt-3">
                            Click any demo project below to populate the submission workspace. You can edit every field before running an AI analysis.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {SAMPLE_PROJECTS.map((project) => (
                            <div
                                key={project.id}
                                className="gradient-border bg-[#111713] rounded-2xl p-5 flex flex-col justify-between hover:border-[#B7F36B]/40 transition-all group"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="text-3xl p-2 rounded-xl bg-[#080B09] border border-[#27332B]">
                                            {project.emoji}
                                        </span>
                                        <span className="text-[10px] font-semibold text-[#929B93] px-2 py-0.5 rounded-full bg-[#172019] border border-[#27332B]">
                                            {project.preferredRevenue?.toUpperCase()} MODEL
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-[#F4F7F2] text-base mb-2 group-hover:text-[#B7F36B] transition-colors">
                                        {project.title}
                                    </h3>

                                    <p className="text-xs text-[#929B93] line-clamp-3 mb-4 leading-relaxed">
                                        {project.description}
                                    </p>

                                    {/* Tech Tags */}
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {project.techStack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="text-[11px] px-2 py-0.5 rounded-md bg-[#172019] border border-[#27332B] text-[#F4F7F2]"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-[#27332B] flex items-center justify-between">
                                    <span className="text-[11px] text-[#929B93] truncate max-w-[160px]">
                                        {project.targetAudience}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleSampleSelect(project)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B7F36B]/15 hover:bg-[#B7F36B] text-[#B7F36B] hover:text-[#080B09] font-bold text-xs transition-all"
                                    >
                                        <span>Try This Project</span>
                                        <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <button
                            type="button"
                            onClick={() => router.push("/dashboard/input")}
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#B7F36B] hover:bg-[#a5e754] text-[#080B09] font-bold text-sm shadow-lime-glow transition-all"
                        >
                            <span>Or Start With Your Own Project Idea</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Accordion FAQ Section */}
            <section id="faq" className="py-20 bg-[#080B09] border-b border-[#27332B]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#172019] border border-[#27332B] text-[#B7F36B] text-xs font-semibold uppercase tracking-wider mb-3">
                            Frequently Asked Questions
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-[#F4F7F2]">
                            Questions & Honest Answers
                        </h2>
                        <p className="text-sm sm:text-base text-[#929B93] mt-3">
                            Everything you need to know about how Campus-2-Cash works.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {FAQ_ITEMS.map((item, idx) => {
                            const isOpen = openFaqIndex === idx;
                            return (
                                <div
                                    key={item.q}
                                    className="border border-[#27332B] bg-[#111713] rounded-xl overflow-hidden transition-colors"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-semibold text-[#F4F7F2] hover:text-[#B7F36B] transition-colors"
                                        aria-expanded={isOpen}
                                    >
                                        <span>{item.q}</span>
                                        <ChevronDown
                                            className={`w-4 h-4 text-[#929B93] flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#B7F36B]" : ""
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
                                                className="overflow-hidden"
                                            >
                                                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-[#929B93] leading-relaxed border-t border-[#27332B]/50 pt-3">
                                                    {item.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-20 bg-[#0D120F] border-b border-[#27332B] text-center relative overflow-hidden">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#B7F36B]/15 border border-[#B7F36B]/30 flex items-center justify-center text-[#B7F36B] mx-auto">
                        <Rocket className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F4F7F2] tracking-tight">
                        Your Project Could Be Your Next Business.
                    </h2>
                    <p className="text-sm sm:text-base text-[#929B93] max-w-xl mx-auto leading-relaxed">
                        Stop guessing about monetization. Discover where your idea can create real value with actionable market models.
                    </p>
                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={() => router.push("/dashboard/input")}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#B7F36B] hover:bg-[#a5e754] text-[#080B09] font-bold text-base shadow-lime-glow transition-all"
                        >
                            <span>Analyze My Project</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Professional Footer */}
            <footer className="bg-[#080B09] py-12 text-[#929B93] text-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#27332B]">
                        {/* Brand Column */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-[#172019] border border-[#27332B] flex items-center justify-center font-bold text-xs text-[#B7F36B]">
                                    C2C
                                </div>
                                <span className="font-bold text-[#F4F7F2] text-sm">Campus-2-Cash</span>
                            </div>
                            <p className="text-xs leading-relaxed text-[#929B93]">
                                AI-powered startup intelligence and commercialization engine for student founders and hackathon innovators.
                            </p>
                        </div>

                        {/* Navigation Links */}
                        <div>
                            <h4 className="font-semibold text-[#F4F7F2] text-xs uppercase tracking-wider mb-3">
                                Platform
                            </h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="hover:text-[#B7F36B] transition-colors">
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a href="#features" className="hover:text-[#B7F36B] transition-colors">
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a href="#how-it-works" className="hover:text-[#B7F36B] transition-colors">
                                        How It Works
                                    </a>
                                </li>
                                <li>
                                    <a href="#dimensions" className="hover:text-[#B7F36B] transition-colors">
                                        10 Dimensions
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h4 className="font-semibold text-[#F4F7F2] text-xs uppercase tracking-wider mb-3">
                                Resources
                            </h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#samples" className="hover:text-[#B7F36B] transition-colors">
                                        Demo Projects
                                    </a>
                                </li>
                                <li>
                                    <a href="#faq" className="hover:text-[#B7F36B] transition-colors">
                                        FAQ
                                    </a>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => router.push("/dashboard/input")}
                                        className="hover:text-[#B7F36B] transition-colors text-left"
                                    >
                                        Analysis Workspace
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Technology & Privacy */}
                        <div>
                            <h4 className="font-semibold text-[#F4F7F2] text-xs uppercase tracking-wider mb-3">
                                Technology
                            </h4>
                            <p className="text-xs leading-relaxed text-[#929B93] mb-2">
                                Powered by Groq • openai/gpt-oss-120b intelligence & Next.js 16.
                            </p>
                            <div className="flex items-center gap-1.5 text-[11px] text-[#64C995]">
                                <Lock className="w-3.5 h-3.5" />
                                <span>Zero database retention · Browser-local storage</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
                        <div>© {new Date().getFullYear()} Campus-2-Cash. All rights reserved.</div>
                        <div className="flex items-center gap-4">
                            <span>Designed with Premium Graphite & Electric Lime</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
