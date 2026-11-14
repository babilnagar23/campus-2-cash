import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
    return Number.isFinite(score) ? score.toFixed(1) : "0.0";
}

// Semantic score colors: Gold (8.5-10), Jade (7-8.4), Mint (5.5-6.9), Warm Brass (4-5.4), Coral Amber (<4)
export function getScoreColor(score: number): string {
    if (score >= 8.5) return "text-[#C9A24B]";
    if (score >= 7.0) return "text-[#2F9E75]";
    if (score >= 5.5) return "text-[#5CD1B3]";
    if (score >= 4.0) return "text-[#D8B76B]";
    return "text-[#E08A68]";
}

export function getScoreBgColor(score: number): string {
    if (score >= 8.5) return "bg-[#C9A24B]";
    if (score >= 7.0) return "bg-[#2F9E75]";
    if (score >= 5.5) return "bg-[#5CD1B3]";
    if (score >= 4.0) return "bg-[#D8B76B]";
    return "bg-[#E08A68]";
}

export function getConfidenceColor(confidence: "Low" | "Medium" | "High" | string): string {
    switch (confidence) {
        case "High":
            return "text-[#2F9E75] bg-[#2F9E75]/15 border-[#2F9E75]/40";
        case "Medium":
            return "text-[#C9A24B] bg-[#C9A24B]/15 border-[#C9A24B]/40";
        case "Low":
            return "text-[#E08A68] bg-[#E08A68]/15 border-[#E08A68]/40";
        default:
            return "text-[#9EB0A5] bg-[#162620] border-[#304F44]";
    }
}

export function getVerdictColor(score: number): string {
    if (score >= 8.5) return "text-[#C9A24B]";
    if (score >= 7.0) return "text-[#2F9E75]";
    if (score >= 5.5) return "text-[#5CD1B3]";
    if (score >= 4.0) return "text-[#D8B76B]";
    return "text-[#E08A68]";
}

// ── Functional Forest Green & Champagne Gold Mapping ───────────

export interface ModelColorTheme {
    key: string;
    text: string;
    bg: string;
    border: string;
    badgeBg: string;
    hoverBorder: string;
    glow: string;
    accentHex: string;
}

export function getModelAccent(model: string = ""): ModelColorTheme {
    const lower = model.toLowerCase();
    if (lower.includes("subscription") || lower.includes("saas") || lower.includes("recurring")) {
        return {
            key: "jade",
            text: "text-[#2F9E75]",
            bg: "bg-[#2F9E75]/15",
            border: "border-[#2F9E75]/40",
            badgeBg: "bg-[#2F9E75]/20",
            hoverBorder: "hover:border-[#2F9E75]/60",
            glow: "shadow-jade-glow-sm",
            accentHex: "#2F9E75",
        };
    }
    if (lower.includes("freemium") || lower.includes("ai") || lower.includes("usage") || lower.includes("token")) {
        return {
            key: "forest",
            text: "text-[#5CD1B3]",
            bg: "bg-[#0E5A47]/30",
            border: "border-[#0E5A47]/60",
            badgeBg: "bg-[#0E5A47]/40",
            hoverBorder: "hover:border-[#5CD1B3]/50",
            glow: "shadow-forest-glow-sm",
            accentHex: "#0E5A47",
        };
    }
    if (lower.includes("marketplace") || lower.includes("platform") || lower.includes("api") || lower.includes("developer")) {
        return {
            key: "gold",
            text: "text-[#C9A24B]",
            bg: "bg-[#C9A24B]/15",
            border: "border-[#C9A24B]/40",
            badgeBg: "bg-[#C9A24B]/20",
            hoverBorder: "hover:border-[#C9A24B]/60",
            glow: "shadow-gold-glow-sm",
            accentHex: "#C9A24B",
        };
    }
    if (lower.includes("license") || lower.includes("enterprise") || lower.includes("b2b") || lower.includes("white label")) {
        return {
            key: "brass",
            text: "text-[#D8B76B]",
            bg: "bg-[#D8B76B]/15",
            border: "border-[#D8B76B]/40",
            badgeBg: "bg-[#D8B76B]/20",
            hoverBorder: "hover:border-[#D8B76B]/60",
            glow: "shadow-gold-glow-sm",
            accentHex: "#D8B76B",
        };
    }
    if (lower.includes("consulting") || lower.includes("service") || lower.includes("agency") || lower.includes("setup")) {
        return {
            key: "mint",
            text: "text-[#90E6C7]",
            bg: "bg-[#2F9E75]/15",
            border: "border-[#2F9E75]/40",
            badgeBg: "bg-[#2F9E75]/20",
            hoverBorder: "hover:border-[#90E6C7]/50",
            glow: "shadow-jade-glow-sm",
            accentHex: "#2F9E75",
        };
    }
    // Default to Champagne Gold
    return {
        key: "gold",
        text: "text-[#C9A24B]",
        bg: "bg-[#C9A24B]/15",
        border: "border-[#C9A24B]/40",
        badgeBg: "bg-[#C9A24B]/20",
        hoverBorder: "hover:border-[#C9A24B]/60",
        glow: "shadow-gold-glow-sm",
        accentHex: "#C9A24B",
    };
}

export function getDimensionTheme(key: string): { text: string; bg: string; border: string; hex: string } {
    switch (key) {
        case "marketSize":
            return { text: "text-[#2F9E75]", bg: "bg-[#2F9E75]", border: "border-[#2F9E75]/40", hex: "#2F9E75" };
        case "problemSeverity":
            return { text: "text-[#E08A68]", bg: "bg-[#E08A68]", border: "border-[#E08A68]/40", hex: "#E08A68" };
        case "uniqueness":
            return { text: "text-[#C9A24B]", bg: "bg-[#C9A24B]", border: "border-[#C9A24B]/40", hex: "#C9A24B" };
        case "feasibility":
            return { text: "text-[#5CD1B3]", bg: "bg-[#0E5A47]", border: "border-[#0E5A47]/60", hex: "#0E5A47" };
        case "monetizationPotential":
            return { text: "text-[#C9A24B]", bg: "bg-[#C9A24B]", border: "border-[#C9A24B]/40", hex: "#C9A24B" };
        case "scalability":
            return { text: "text-[#2F9E75]", bg: "bg-[#2F9E75]", border: "border-[#2F9E75]/40", hex: "#2F9E75" };
        case "timeToRevenue":
            return { text: "text-[#C9A24B]", bg: "bg-[#C9A24B]", border: "border-[#C9A24B]/40", hex: "#C9A24B" };
        case "competitiveMoat":
            return { text: "text-[#5CD1B3]", bg: "bg-[#0E5A47]", border: "border-[#0E5A47]/60", hex: "#0E5A47" };
        case "founderFit":
            return { text: "text-[#D8B76B]", bg: "bg-[#D8B76B]", border: "border-[#D8B76B]/40", hex: "#D8B76B" };
        case "trendAlignment":
            return { text: "text-[#2F9E75]", bg: "bg-[#2F9E75]", border: "border-[#2F9E75]/40", hex: "#2F9E75" };
        default:
            return { text: "text-[#C9A24B]", bg: "bg-[#C9A24B]", border: "border-[#C9A24B]/40", hex: "#C9A24B" };
    }
}

// ── Currency & Revenue Formatting Helpers ──────────────────────

function formatRawAmount(numOrStr: unknown): string {
    if (numOrStr === undefined || numOrStr === null) return "";
    if (typeof numOrStr === "number") {
        if (numOrStr >= 100000) {
            return `₹${(numOrStr / 100000).toFixed(1).replace(/\.0$/, "")}L`;
        }
        if (numOrStr >= 1000) {
            return `₹${(numOrStr / 1000).toFixed(0)}k`;
        }
        return `₹${numOrStr.toLocaleString()}`;
    }
    const str = String(numOrStr).trim();
    return str;
}

/**
 * Safely extracts monthly and annual revenue components from any value:
 * Handles objects { monthly, annual }, numeric amounts, or formatted strings.
 */
export function formatRevenue(val: unknown): { monthly: string; annual?: string; display: string } {
    if (!val) {
        return { monthly: "₹0", annual: "₹0", display: "₹0" };
    }

    if (typeof val === "object" && val !== null) {
        const obj = val as Record<string, unknown>;
        const monthlyRaw = obj.monthly !== undefined ? obj.monthly : obj.month;
        const annualRaw = obj.annual !== undefined ? obj.annual : obj.year;

        const monthly = monthlyRaw !== undefined ? formatRawAmount(monthlyRaw) : "";
        const annual = annualRaw !== undefined ? formatRawAmount(annualRaw) : "";

        if (monthly && annual) {
            return {
                monthly,
                annual,
                display: `${monthly} / mo (${annual}/yr)`,
            };
        }
        if (monthly) {
            return { monthly, display: `${monthly} / mo` };
        }
        if (annual) {
            return { monthly: annual, annual, display: `${annual} / yr` };
        }
    }

    if (typeof val === "number") {
        const formatted = formatRawAmount(val);
        return { monthly: formatted, display: `${formatted} / mo` };
    }

    const str = String(val).trim();
    return {
        monthly: str,
        display: str,
    };
}

/**
 * Returns a guaranteed-string monthly revenue value for display in JSX.
 */
export function formatRevenueDisplay(val: unknown, preferAnnual = false): string {
    const parsed = formatRevenue(val);
    if (preferAnnual && parsed.annual) {
        return parsed.annual;
    }
    return parsed.monthly || parsed.display;
}

/**
 * Returns a guaranteed-string annual revenue value if available.
 */
export function formatAnnualRevenueDisplay(val: unknown): string {
    const parsed = formatRevenue(val);
    return parsed.annual || "";
}

/**
 * Safely formats pricing amounts (handles objects { monthly, annual }, numbers, or strings).
 */
export function formatPricingDisplay(val: unknown): string {
    if (val === undefined || val === null) return "Free";

    if (typeof val === "object" && val !== null) {
        const obj = val as Record<string, unknown>;
        if (obj.monthly !== undefined && obj.annual !== undefined) {
            return `${formatRawAmount(obj.monthly)}/mo (${formatRawAmount(obj.annual)}/yr)`;
        }
        if (obj.monthly !== undefined) return `${formatRawAmount(obj.monthly)}/mo`;
        if (obj.price !== undefined) return formatPricingDisplay(obj.price);
        return Object.values(obj).filter(Boolean).map(formatRawAmount).join(" / ") || "Custom";
    }

    if (typeof val === "number") {
        if (val === 0) return "Free";
        return formatRawAmount(val);
    }

    return String(val);
}

/**
 * Universal safe string renderer for JSX.
 * Guarantees that no plain object is EVER rendered directly as a React child.
 */
export function safeRenderString(val: unknown, fallback = ""): string {
    if (val === undefined || val === null) return fallback;
    if (typeof val === "string") return val;
    if (typeof val === "number" || typeof val === "boolean") return String(val);

    if (typeof val === "object") {
        const obj = val as Record<string, unknown>;
        if (obj.monthly !== undefined) {
            return formatRevenueDisplay(val);
        }
        if (obj.display !== undefined) return String(obj.display);
        if (obj.name !== undefined) return String(obj.name);
        if (obj.title !== undefined) return String(obj.title);
        // Fallback: join stringifiable values
        const parts = Object.values(obj)
            .filter((v) => typeof v === "string" || typeof v === "number")
            .map(String);
        return parts.length > 0 ? parts.join(" · ") : fallback;
    }

    return fallback;
}

// ── Local Storage Helpers ──────────────────────────────────────

export function saveToLocalStorage(key: string, data: unknown): boolean {
    if (typeof window === "undefined") return false;
    try {
        window.localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.warn(`Failed to save to localStorage (${key}):`, e);
        return false;
    }
}

export function loadFromLocalStorage<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
        const item = window.localStorage.getItem(key);
        if (!item) return null;
        return JSON.parse(item) as T;
    } catch (e) {
        console.warn(`Failed to parse localStorage item (${key}):`, e);
        return null;
    }
}

export function removeFromLocalStorage(key: string): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.removeItem(key);
    } catch (e) {
        console.warn(`Failed to remove localStorage item (${key}):`, e);
    }
}
