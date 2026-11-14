# Campus-2-Cash (C2C)
**AI-Powered Project Monetization & Commercialization Engine**  
**Software Design Document (SDD)**  
**Version 2.1 (Groq Cloud Migration — openai/gpt-oss-120b)**  
**Date: November 2026**

---

### 1. Executive Summary & Purpose

**Campus-2-Cash** is an AI-powered intelligence platform that evaluates academic, hackathon, and student software projects. It transforms coursework and functional code into commercial opportunities by:
1. Scoring projects across **10 rigorous commercial viability dimensions**.
2. Modeling **three revenue scenarios** (conservative, realistic, optimistic).
3. Formulating **3–5 tailored monetization paths** with concrete pricing tiers and first-customer funnels.
4. Delivering **actionable zero-budget roadmaps** for the founder's first 7 days.
5. Providing an **interactive AI refinement loop** to adjust models based on founder constraints.
6. Generating an executive **multi-page PDF report** for investors and mentors.

The platform operates on a **privacy-first, local-persistence model**: all user intellectual property is analyzed via Groq Cloud (`openai/gpt-oss-120b`) server-side and stored strictly within the client's browser local storage with zero central database retention.

---

### 2. Design System & Visual Identity

The entire user interface follows a unified **Premium Graphite + Electric Lime** design system:

| Token | Hex Value | Usage |
|---|---|---|
| Main Background | `#080B09` | Root page background, deep contrast canvas |
| Secondary Background | `#0D120F` | Navbars, headers, section alternating contrast |
| Card Background | `#111713` | Primary cards, forms, content panels |
| Elevated Card | `#172019` | Dropdowns, hover states, nested information containers |
| Primary Accent | `#B7F36B` | Electric Lime brand accent, primary buttons, score highlights |
| Secondary Accent | `#64C995` | Mint green highlights, secondary metrics, success badges |
| Main Text | `#F4F7F2` | Headings, primary text, high-contrast readable copy |
| Secondary Text | `#929B93` | Subtitles, descriptions, metadata, muted labels |
| Border | `#27332B` | Subtle card borders, dividers, form input outlines |
| Input Background | `#101612` | Form fields, textareas, file drop zones |

---

### 3. Core Viability Rubric (The 10 Dimensions)

Each project is evaluated from 1.0 to 10.0 across ten structured dimensions:

1. **Market Size & Demand**: Quantifies total addressable market and validated customer need.
2. **Problem Severity**: Evaluates problem pain level and willingness to pay.
3. **Uniqueness & Moat**: Identifies genuine competitive differentiation and barriers to entry.
4. **Technical Feasibility**: Assesses if a student team can realistically ship and maintain the software.
5. **Monetization Potential**: Analyzes natural fit for subscription, usage fees, or enterprise sales.
6. **Scalability**: Measures growth capacity without requiring architectural rewrites.
7. **Time-to-Revenue**: Estimates how quickly founders can capture their first dollar.
8. **Competitive Moat**: Analyzes defensibility against cloning within 90 days.
9. **Student Founder Fit**: Leverages unique student domain proximity and agility.
10. **Trend Alignment**: Evaluates synergy with current AI agent, micro-SaaS, and edge automation trends.

**Master Score Calculation**:
$$\text{Real-World Value Score} = \frac{\sum_{i=1}^{10} \text{Dimension Score}_i}{10}$$

**Score Verdict Rubric**:
- `8.5 – 10.0`: Investor-Ready 🚀
- `7.0 – 8.4`: Strong Potential ⚡
- `5.5 – 6.9`: Solid Foundation 🌱
- `4.0 – 5.4`: Needs Refinement 🔨
- `1.0 – 3.9`: Early Concept 💡

---

### 4. Technical Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Next.js 16 Frontend                  │
│                                                        │
│  ┌───────────────┐  ┌────────────────┐  ┌───────────┐  │
│  │ Homepage      │  │ Input Form     │  │ Dashboard │  │
│  │ (app/page.tsx)│  │ (input/page.tsx)│  │ (page.tsx) │  │
│  └───────┬───────┘  └───────┬────────┘  └─────▲─────┘  │
└──────────┼──────────────────┼─────────────────┼────────┘
           │                  │ (Multipart POST)│ (JSON)
           │                  ▼                 │
┌──────────┼────────────────────────────────────┴────────┐
│          ▼         Next.js Node.js API Route           │
│             (/app/api/analyze/route.ts)                │
│                                                        │
│  ┌───────────────────────┐  ┌───────────────────────┐  │
│  │ Input & File Validator│  │ Server File Extractor │  │
│  │ (String/Size/MIME)    │  │ (pdf-parse / Text)    │  │
│  └───────────┬───────────┘  └───────────┬───────────┘  │
│              └─────────────┬────────────┘              │
│                            ▼                           │
│                 Centralized AI Service                 │
│                   (lib/ai-service.ts)                  │
│                            │                           │
│                            ▼                           │
│                 Official Groq SDK Client               │
│                     (lib/groq.ts)                      │
└────────────────────────────┼───────────────────────────┘
                             │ (JSON Object Mode)
                             ▼
                Groq Cloud API Endpoint
                 (openai/gpt-oss-120b)
```

---

### 5. API Endpoints

#### `POST /api/analyze`
Accepts `multipart/form-data`:
- `title` (string, required): Project title.
- `description` (string, required): Project description.
- `techStack` (stringified JSON array, optional): Technologies used.
- `targetAudience` (string, optional): Target user segment.
- `targetCountry` (string, optional): Geographical target market.
- `preferredRevenue` (string, optional): "passive" | "active" | "b2b" | "any".
- `knownCompetitors` (string, optional): Direct or indirect alternatives.
- `githubUrl` (string, optional): Valid repository URL.
- `files` (array of File objects, max 3, max 10MB each): PDF, TXT, MD.

Returns normalized `AnalysisResponse` object adhering to strict TypeScript schema.

#### `POST /api/analyze?mode=refine`
Accepts `application/json`:
- `originalResponse` (AnalysisResponse): Prior analysis data.
- `projectInput` (ProjectInput): Original project specification.
- `userFeedback` (string): Specific founder feedback and constraints.

Returns updated `AnalysisResponse` preserving core scores while regenerating monetization models and strategic insights.

---

### 6. Persistence & Privacy Architecture

- **Zero Central Storage**: Student project descriptions, files, and generated business strategies are not stored in any external database.
- **Client Session Persistence**: Results are written to browser `localStorage` (`c2c_result`, `c2c_input`) wrapped with defensive error handling to prevent quota crashes.
- **Empty & Recovery State**: When localStorage is cleared or corrupted, the dashboard presents a clean recovery screen with direct links to restart or load pre-built demo scenarios.

---

### 7. PDF Export Subsystem

`components/ExportButton.tsx` executes client-side document compilation using `jspdf`:
- Fully branded in Dark Graphite (#0D120F) with Electric Lime (#B7F36B) section dividers.
- Guaranteed background painting on **every new page break** to ensure complete legibility.
- Comprehensive document sections: Executive Header, Project Description, Real-World Value Score, 10-Dimension Scorecard, Revenue Projections, Monetization Opportunities with Tiered Pricing, and Strategic Founder Guidance.
- Automatic filename sanitization and error-handling states.
