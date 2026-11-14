import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
    return Number.isFinite(score) ? score.toFixed(1) : "0.0";
}

// Semantic score colors: Green/lime (8-10), Emerald/mint (7), Yellow (6), Orange (4-5), Red (<4)
export function getScoreColor(score: number): string {
    if (score >= 8) return "text-[#B7F36B]";
    if (score >= 7) return "text-[#64C995]";
    if (score >= 5.5) return "text-[#FCD34D]";
    if (score >= 4) return "text-[#FB923C]";
    return "text-[#F87171]";
}

export function getScoreBgColor(score: number): string {
    if (score >= 8) return "bg-[#B7F36B]";
    if (score >= 7) return "bg-[#64C995]";
    if (score >= 5.5) return "bg-[#FCD34D]";
    if (score >= 4) return "bg-[#FB923C]";
    return "bg-[#F87171]";
}

export function getConfidenceColor(confidence: "Low" | "Medium" | "High" | string): string {
    switch (confidence) {
        case "High":
            return "text-[#B7F36B] bg-[#B7F36B]/10 border-[#B7F36B]/25";
        case "Medium":
            return "text-[#FCD34D] bg-[#FCD34D]/10 border-[#FCD34D]/25";
        case "Low":
            return "text-[#FB923C] bg-[#FB923C]/10 border-[#FB923C]/25";
        default:
            return "text-[#929B93] bg-[#172019] border-[#27332B]";
    }
}

export function getVerdictColor(score: number): string {
    if (score >= 8) return "text-[#B7F36B]";
    if (score >= 7) return "text-[#64C995]";
    if (score >= 5.5) return "text-[#FCD34D]";
    if (score >= 4) return "text-[#FB923C]";
    return "text-[#F87171]";
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
