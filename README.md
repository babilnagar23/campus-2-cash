# Campus-2-Cash (C2C)

> **AI-Powered Project Monetization & Commercialization Engine for Student Innovators**  
> *Powered by Groq Cloud • `openai/gpt-oss-20b`*

Campus-2-Cash bridges the gap between academic projects, hackathon prototypes, and commercial viability. It evaluates software projects across **10 rigorous viability dimensions**, predicts real-world commercial value, and generates actionable, tailored **monetization paths** with concrete pricing tiers, revenue forecasts, and zero-budget launch roadmaps.

---

## 🌟 Key Features

- **10-Dimension Viability Rubric**: Scored on Market Demand, Problem Severity, Uniqueness, Feasibility, Monetization Potential, Scalability, Time-to-Revenue, Competitive Moat, Founder Fit, and 2026 Trend Alignment.
- **Powered by Groq `openai/gpt-oss-20b`**: High-performance open-weights intelligence providing fast, nuanced business model analysis and pricing architecture with configurable low reasoning effort.
- **Kafka-Style Distributed FIFO Request Queue**:
  - Global concurrency = 1 (strictly 1 Groq API call at a time across the entire platform).
  - Mandatory 15-second post-completion cooldown between requests to guarantee API compliance.
  - Cooldown timestamps persisted in Redis/memory to survive worker restarts.
  - Automatic HTTP 429 backoff extraction (`retry-after`).
  - Standalone BullMQ worker service (`npm run worker`).
  - Automatic in-memory fallback for local development without Redis.
- **Document Ingestion**: Analyzes project descriptions and supports optional attachments (PDF documents, TXT, and Markdown).
- **Tailored Monetization Models**: Generates 3–5 concrete business models (e.g. Campus-SaaS, B2B department licenses, usage-based APIs, freemium) with actionable 2–3 tier pricing structures.
- **Three-Tier Revenue Modeling**: Realistic, conservative, and optimistic revenue forecasts with clear assumptions.
- **Immediate Action Steps**: Provides concrete, zero-budget validation steps student founders can execute in their first 7 days.
- **Interactive AI Refinement**: Built-in feedback loop allowing founders to guide the AI to focus on B2B contracts, regional markets (such as India or Southeast Asia), zero-budget constraints, or specific pricing strategies.
- **Executive PDF Export**: One-click multi-page PDF generation styled in an executive dark graphite theme, formatted for hackathon judges, university advisors, or angel investors.
- **Session Recovery**: Pending queue jobs survive browser refreshes via `localStorage` job recovery.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Node.js runtime)
- **Frontend Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) + Custom Dark Graphite Multicolor Theme
- **Queue & Scheduling**: [BullMQ 6](https://docs.bullmq.io/) + [ioRedis 6](https://github.com/redis/ioredis) (with automatic in-memory fallback)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **File Parsing**: `pdf-parse` (Node.js runtime text extraction)
- **PDF Generation**: `jspdf`
- **AI Intelligence**: [Groq Cloud](https://console.groq.com/) using **`openai/gpt-oss-20b`** with `low` reasoning effort via `groq-sdk`

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js 20+](https://nodejs.org/) installed
- A Groq Cloud API key from [Groq Console](https://console.groq.com/keys)
- (Optional) A Redis instance (e.g., [Upstash Redis](https://upstash.com/) or local Redis `redis://localhost:6379`) for distributed multi-instance deployments.

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/campus-2-cash.git
cd campus-2-cash
npm install
```

### 3. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

Open `.env.local` and configure your settings:

```env
# Groq Cloud API Key — obtain from https://console.groq.com/keys
GROQ_API_KEY=gsk_your_actual_groq_api_key_here

# Groq Model Identifier (Strictly: openai/gpt-oss-20b)
GROQ_MODEL=openai/gpt-oss-20b

# Reasoning Effort (Strictly: low)
GROQ_REASONING_EFFORT=low

# Redis Connection URL (Optional for local dev, Required for production multi-instance)
REDIS_URL=redis://default:password@your-redis-host:6379

# Cooldown between Groq requests in milliseconds (Default: 15000)
GROQ_MIN_INTERVAL_MS=15000
```

> **Note on Local Development**: If `REDIS_URL` is omitted, Campus-2-Cash automatically runs an in-process FIFO queue with the exact same 15s cooldown and lifecycle events. No local Redis server is required to test locally.

### 4. Running the Application

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running the Standalone Queue Worker (Production)

In production or when using Redis, run the standalone Groq request worker in a dedicated process:

```bash
npm run worker
```

---

## 📋 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js local development server |
| `npm run build` | Builds the optimized production bundle with webpack |
| `npm run start` | Starts the production server |
| `npm run worker` | Starts the standalone BullMQ Groq worker service |
| `npm run test:scheduler` | Automated test verifying FIFO ordering, concurrency=1, and 15s cooldown math |
| `npm run test:groq` | Validates live Groq Cloud API connection with `openai/gpt-oss-20b` |
| `npm run test:analyze` | Runs an end-to-end project analysis integration test |
| `npm run lint` | Runs ESLint checks across all source code |
| `npx tsc --noEmit` | Runs TypeScript compiler type-checking |

---

## 📁 Project Architecture

```
campus-2-cash/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts      # Enqueues project analysis & returns HTTP 202
│   │   ├── jobs/[jobId]/route.ts # Polling endpoint for job status & result
│   │   └── queue/status/route.ts # Real-time queue metrics and cooldown diagnostics
│   ├── dashboard/
│   │   ├── input/page.tsx        # Project intake form with dropzone & queue status
│   │   └── page.tsx              # Analytics dashboard (Overview, Scorecard, Paths, Strategy)
│   ├── globals.css               # Centralized Dark Graphite Multicolor design tokens
│   ├── layout.tsx                # Root layout with dark theme
│   └── page.tsx                  # Landing page with interactive preview & FAQ
├── components/
│   ├── EvaluationPanel.tsx       # Circular score meter, 5-dimension summary, revenue forecast
│   ├── ExportButton.tsx          # Multi-page jsPDF generator with full background handling
│   ├── MonetizationCard.tsx      # Expandable monetization model card with pricing tiers
│   ├── RefineModal.tsx           # Refinement modal with suggestion chips & escape handling
│   ├── ScorecardPanel.tsx        # 10-dimension viability grid with progress meters & rubric
│   └── StrategicInsightsCard.tsx # Strengths, risks, secret weapon & quick win display
├── lib/
│   ├── queue/
│   │   ├── connection.ts         # Redis connection manager with reconnect strategies
│   │   ├── queue-types.ts        # TypeScript interfaces for jobs, results & status
│   │   ├── queue.ts              # Unified queue manager (BullMQ + in-memory fallback)
│   │   └── scheduler.ts          # Distributed 15-second post-completion cooldown coordinator
│   ├── ai-prompts.ts             # GPT-OSS 20B system and user prompt builders
│   ├── ai-service.ts             # Centralized Groq analysis & refinement service
│   ├── ai-validation.ts          # JSON Schema validation & response normalization
│   ├── file-utils.ts             # Server-side PDF & text document extraction
│   ├── groq.ts                   # Centralized Groq SDK client factory
│   ├── market-trends-2026.ts     # Injected 2026 market intelligence data
│   ├── sample-projects.ts        # Pre-loaded demo project specifications
│   └── utils.ts                  # Color helpers, class merge, safe formatting utilities
├── workers/
│   └── groq-worker.ts            # Standalone BullMQ worker process (concurrency: 1)
├── scripts/
│   ├── test-groq-scheduler.mjs   # Automated test for cooldown math & FIFO execution
│   ├── test-groq.mjs             # Live Groq API connection test
│   └── test-analyze.mjs          # End-to-end project analysis integration test
├── types/
│   └── index.ts                  # TypeScript interfaces for inputs, scorecards & results
├── .env.example                  # Environment variable template
└── package.json                  # Dependencies and scripts
```

---

## 🚢 Production Deployment

### Option A: Vercel + Upstash Redis (Recommended)

1. Deploy the Next.js frontend to [Vercel](https://vercel.com).
2. Create a free Redis database on [Upstash Redis](https://upstash.com).
3. In Vercel Project Settings > Environment Variables, set:
   - `GROQ_API_KEY`: Your Groq Cloud API key
   - `GROQ_MODEL`: `openai/gpt-oss-20b`
   - `GROQ_REASONING_EFFORT`: `low`
   - `REDIS_URL`: Your Upstash Redis connection string
   - `GROQ_MIN_INTERVAL_MS`: `15000`
4. Deploy the standalone worker (`npm run worker`) to a persistent worker host like Railway, Render Background Worker, or Fly.io with the same environment variables.
