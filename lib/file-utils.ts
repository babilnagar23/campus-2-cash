/**
 * Server-side document extraction utilities for Groq (openai/gpt-oss-20b).
 * Supports text-based document formats: PDF, TXT, and Markdown.
 * Images without machine-readable text are cleanly rejected with informative feedback.
 */

export interface DocumentExtractionResult {
    text: string;
    fileName: string;
    warning?: string;
}

export function isPDFDocument(mimeType: string, fileName?: string): boolean {
    if (mimeType.toLowerCase() === "application/pdf") return true;
    if (fileName && fileName.toLowerCase().endsWith(".pdf")) return true;
    return false;
}

export function isTextDocument(mimeType: string, fileName?: string): boolean {
    const normalized = mimeType.toLowerCase();
    if (
        normalized.startsWith("text/") ||
        normalized === "application/json" ||
        normalized === "application/markdown"
    ) {
        return true;
    }
    if (fileName) {
        const lower = fileName.toLowerCase();
        return lower.endsWith(".txt") || lower.endsWith(".md") || lower.endsWith(".json");
    }
    return false;
}

export function isSupportedUpload(mimeType: string, fileName?: string): boolean {
    return isPDFDocument(mimeType, fileName) || isTextDocument(mimeType, fileName);
}

export async function extractTextFromPDF(buffer: Buffer): Promise<{ text: string; warning?: string }> {
    try {
        const pdfParse = (await import("pdf-parse")).default;
        const data = await pdfParse(buffer);
        const text = (data.text || "").replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").trim();

        if (!text || text.length === 0) {
            return {
                text: "",
                warning: "The uploaded PDF contained no extractable text. Scanned or image-only PDFs cannot be analyzed without OCR.",
            };
        }

        return { text };
    } catch (error) {
        console.error("PDF parsing error:", error);
        return {
            text: "",
            warning: "Unable to parse PDF. Please verify that the PDF is not encrypted or corrupted.",
        };
    }
}

export async function extractDocumentText(
    buffer: Buffer,
    mimeType: string,
    fileName: string
): Promise<DocumentExtractionResult> {
    if (isPDFDocument(mimeType, fileName)) {
        const pdfResult = await extractTextFromPDF(buffer);
        if (pdfResult.warning) {
            return {
                text: `[Document: ${fileName} — Warning: ${pdfResult.warning}]`,
                fileName,
                warning: pdfResult.warning,
            };
        }
        return {
            text: `[PDF Document: ${fileName}]\n${pdfResult.text}`,
            fileName,
        };
    }

    if (isTextDocument(mimeType, fileName)) {
        const rawText = buffer.toString("utf-8").trim();
        return {
            text: `[Text Document: ${fileName}]\n${rawText}`,
            fileName,
        };
    }

    throw new Error(
        `File "${fileName}" has an unsupported format. Campus-2-Cash currently accepts PDF, TXT, and Markdown documents.`
    );
}

export function truncateText(text: string, maxChars = 5000): string {
    if (!text) return "";
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars) + "\n...[Content truncated for analysis efficiency]";
}
