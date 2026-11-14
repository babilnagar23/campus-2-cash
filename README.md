# Campus-2-Cash (C2C)

> **AI-Powered Project Monetization & Commercialization Engine for Student Innovators**  
> *Powered by Groq Cloud • `openai/gpt-oss-120b`*

Campus-2-Cash bridges the gap between academic projects, hackathon prototypes, and commercial viability. It evaluates software projects across **10 rigorous viability dimensions**, predicts real-world commercial value, and generates actionable, tailored **monetization paths** with concrete pricing tiers, revenue forecasts, and zero-budget launch roadmaps.

---

## 🌟 Key Features

- **10-Dimension Viability Rubric**: Scored on Market Demand, Problem Severity, Uniqueness, Feasibility, Monetization Potential, Scalability, Time-to-Revenue, Competitive Moat, Founder Fit, and 2026 Trend Alignment.
- **Powered by Groq `openai/gpt-oss-120b`**: High-performance open-weights intelligence providing fast, nuanced business model analysis and pricing architecture.
- **Document Ingestion**: Analyzes project descriptions and supports optional attachments (PDF documents, TXT, and Markdown).
- **Tailored Monetization Models**: Generates 3–5 concrete business models (e.g. Campus-SaaS, B2B department licenses, usage-based APIs, freemium) with actionable 2–3 tier pricing structures.
- **Three-Tier Revenue Modeling**: Realistic, conservative, and optimistic revenue forecasts with clear assumptions.
- **Immediate Action Steps**: Provides 5 concrete, zero-budget validation steps student founders can execute in their first 7 days.
- **Interactive AI Refinement**: Built-in feedback loop allowing founders to guide the AI to focus on B2B contracts, regional markets (such as India or Southeast Asia), zero-budget constraints, or specific pricing strategies.
- **Executive PDF Export**: One-click multi-page PDF generation styled in an executive dark graphite theme, formatted for hackathon judges, university advisors, or angel investors.
- **Local Persistence & Privacy**: Analysis runs server-side via Groq Cloud with zero database retention; results are persisted securely in browser-local storage.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Frontend Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) + Custom Dark Graphite & Electric Lime Theme
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **File Parsing**: `pdf-parse` (Node.js runtime text extraction)
- **PDF Generation**: `jspdf`
- **AI Intelligence**: [Groq Cloud](https://console.groq.com/) using **`openai/gpt-oss-120b`** via `groq-sdk`

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js 20+](https://nodejs.org/) installed
- A Groq Cloud API key from [Groq Console](https://console.groq.com/keys)

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

Open `.env.local` and configure your Groq Cloud API key:

```env
# Groq Cloud API Key — obtain from https://console.groq.com/keys
GROQ_API_KEY=gsk_your_actual_groq_api_key_here

# Groq Model Identifier (Default: openai/gpt-oss-120b)
GROQ_MODEL=openai/gpt-oss-120b

# Reasoning Effort (Options: none, low, medium, high; Default: medium)
GROQ_REASONING_EFFORT=medium
```

> **Security Note**: Never commit `.env.local` or `.env` to Git. The Groq API key is executed strictly server-side in API routes and is never exposed to client browsers.

### 4. Test the Groq Connection

Run the built-in diagnostic test to verify your API credentials:

```bash
npm run test:groq
```

### 5. Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js local development server |
| `npm run build` | Builds the optimized production bundle |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint 9 checks across all source code |
| `npm run test:groq` | Validates live Groq Cloud API connection with `openai/gpt-oss-120b` |
| `npm run test:analyze` | Runs an end-to-end project analysis integration test |
| `npx tsc --noEmit` | Runs TypeScript compiler type-checking without emitting files |

---

## 📁 Project Architecture

```
campus-2-cash/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # Server-side Groq analysis & refinement endpoint
│   ├── dashboard/
│   │   ├── input/
│   │   │   └── page.tsx          # Project intake form with document upload
│   │   └── page.tsx              # Analytics dashboard (Overview, Scorecard, Paths, Strategy)
│   ├── globals.css               # Centralized Dark Graphite + Electric Lime design tokens
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
│   ├── ai-prompts.ts             # GPT-OSS 120B system and user prompt builders
│   ├── ai-service.ts             # Centralized Groq analysis & refinement service
│   ├── ai-validation.ts          # JSON Schema & response normalization
│   ├── file-utils.ts             # Server-side PDF & text document extraction
│   ├── groq.ts                   # Centralized Groq SDK client factory
│   ├── market-trends-2026.ts     # Injected 2026 market intelligence data
│   ├── sample-projects.ts        # 5 pre-loaded demo project specifications
│   └── utils.ts                  # Color helpers, class merge, safe localStorage utilities
├── scripts/
│   ├── test-groq.mjs             # Live Groq API connection test
│   └── test-analyze.mjs          # End-to-end project analysis integration test
├── types/
│   └── index.ts                  # TypeScript interfaces for inputs, scorecards & results
├── .env.example                  # Environment variable template
├── eslint.config.mjs             # ESLint 9 flat configuration
├── tailwind.config.ts            # Tailwind CSS theme with Graphite/Lime tokens
└── package.json                  # Dependencies and scripts
```

---

## 🛡️ Input & Document Upload Specifications

- **Required Fields**: Project Title (2–200 characters), Project Description (20–10,000 characters).
- **Optional Fields**: Tech Stack tags, Target Audience, Target Region/Country, Preferred Revenue Style, GitHub Repository URL, Known Competitors.
- **Supported Document Types**:
  - Documents: `.pdf`, `.txt`, `.md` (parsed into text context for the language model)
- **Constraints**: Maximum 3 files per submission, 10MB maximum size per file.

---

## 🚢 Deployment

Campus-2-Cash is optimized for deployment on [Vercel](https://vercel.com/) or any platform supporting Next.js Node.js runtime.

1. Connect your GitHub repository to Vercel.
2. In Project Settings > Environment Variables, add:
   - `GROQ_API_KEY`: Your Groq Cloud API key
   - `GROQ_MODEL`: `openai/gpt-oss-120b` (optional, default)
   - `GROQ_REASONING_EFFORT`: `medium` (optional, default)
3. Deploy. The Node.js runtime is configured automatically for file extraction and Groq completions.
