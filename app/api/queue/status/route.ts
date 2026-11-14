import { NextResponse } from "next/server";
import { getQueueStatus } from "@/lib/queue/queue";

export const runtime = "nodejs";

export async function GET() {
    try {
        const stats = getQueueStatus();
        return NextResponse.json({
            success: true,
            ...stats,
        });
    } catch (err: any) {
        return NextResponse.json(
            {
                success: false,
                error: err.message || "Failed to retrieve queue status.",
            },
            { status: 500 }
        );
    }
}
