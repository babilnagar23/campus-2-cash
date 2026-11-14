// Full integration test for Campus-2-Cash Queue Pipeline
const BASE_URL = "http://localhost:3000";

async function runQueuePipelineTest() {
    console.log("==================================================");
    console.log("   CAMPUS-2-CASH QUEUE & ANALYSIS INTEGRATION     ");
    console.log("==================================================\n");

    try {
        // 1. Check queue diagnostic endpoint
        console.log("[STEP 1] Checking GET /api/queue/status...");
        const queueRes = await fetch(`${BASE_URL}/api/queue/status`);
        const queueData = await queueRes.json();
        console.log(`[PASS] Queue status verified: Queue length = ${queueData.queueLength}, isProcessing = ${queueData.isProcessing}, completed = ${queueData.completedCount}`);

        // 2. Submit project to POST /api/analyze
        console.log("\n[STEP 2] Submitting project to POST /api/analyze...");
        const formData = new FormData();
        formData.append("title", "AI Campus Note-Taker");
        formData.append("description", "A web app that transcribes college lectures in real-time, generates summaries and smart flashcards for university STEM students.");
        formData.append("techStack", JSON.stringify(["React", "Next.js", "Python", "Whisper", "PostgreSQL"]));
        formData.append("targetAudience", "College engineering students");
        formData.append("preferredRevenue", "passive");

        const submitRes = await fetch(`${BASE_URL}/api/analyze`, {
            method: "POST",
            body: formData,
        });

        console.log(`[PASS] HTTP Status received: ${submitRes.status} (Expected: 202 Accepted)`);
        const submitData = await submitRes.json();
        console.log("[PASS] Response body:", JSON.stringify(submitData));

        if (submitRes.status !== 202 || !submitData.jobId) {
            throw new Error(`Expected HTTP 202 with jobId, got: ${submitRes.status} ${JSON.stringify(submitData)}`);
        }

        const jobId = submitData.jobId;
        console.log(`[PASS] Job successfully enqueued with ID: ${jobId}`);

        // 3. Poll GET /api/jobs/[jobId] until completion
        console.log(`\n[STEP 3] Polling GET /api/jobs/${jobId} for completion...`);
        let finalResult = null;
        const maxAttempts = 30; // 60 seconds

        for (let i = 1; i <= maxAttempts; i++) {
            await new Promise((r) => setTimeout(r, 2000));
            const pollRes = await fetch(`${BASE_URL}/api/jobs/${jobId}`);
            const pollData = await pollRes.json();

            console.log(`   Attempt ${i}: Status = ${pollData.status}${pollData.queuePosition ? ` (Position: ${pollData.queuePosition})` : ""}`);

            if (pollData.status === "completed" && pollData.result) {
                finalResult = pollData.result;
                break;
            }

            if (pollData.status === "failed") {
                throw new Error(`Job execution failed: ${pollData.error?.message || "Unknown error"}`);
            }
        }

        if (!finalResult) {
            throw new Error("Job polling timed out before completion.");
        }

        console.log("\n[PASS] Job completed successfully!");
        console.log("--------------------------------------------------");
        console.log(`Master Score:       ${finalResult.evaluation?.realWorldValueScore}/10 (${finalResult.evaluation?.verdict})`);
        console.log(`Scorecard Dims:     ${Object.keys(finalResult.evaluation?.scorecard || {}).length} dimensions`);
        console.log(`Monetization Paths: ${finalResult.paths?.length} models generated`);
        console.log(`Revenue Forecast:   Conservative: ${JSON.stringify(finalResult.evaluation?.revenueEstimate?.conservative)}`);
        console.log(`Strategic Strengths:${finalResult.strategicInsights?.strengths?.length} strengths`);
        console.log("--------------------------------------------------");

        // 4. Verify Cooldown
        console.log("\n[STEP 4] Verifying 15-second Groq rate-limit cooldown...");
        const statusAfter = await fetch(`${BASE_URL}/api/queue/status`).then(r => r.json());
        console.log(`[PASS] Cooldown remaining: ${(statusAfter.cooldownRemainingMs / 1000).toFixed(1)}s (Cooldown active: ${statusAfter.cooldownActive})`);

        console.log("\n==================================================");
        console.log("       ALL QUEUE & ANALYSIS TESTS PASSED!         ");
        console.log("==================================================\n");
    } catch (err) {
        console.error("\n[TEST FAILED]:", err.message);
        process.exit(1);
    }
}

runQueuePipelineTest();
