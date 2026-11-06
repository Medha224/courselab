# 🎓 AI-Powered Lesson Creation Tool

> **Engineering Role**: AI Research Intern — Program Design Team  
> **Mission**: Build an AI-powered system that automates educational research, synthesizes rigorous 45-minute lesson plans, and validates content integrity through two independent Quality Control (QC) layers.

---

## 🌟 Executive Overview & Key Capabilities

The **AI-Powered Lesson Creation Tool** is an end-to-end curriculum engineering system designed for instructional designers, educators, and curriculum engineers. It takes a **Lesson Title** and **Learning Objective** as input and executes a multi-stage automated workflow:

1. **Multi-Source Research Automation**:
   - Queries real-time APIs (**Open Library API**, **Wikipedia REST API**, and authoritative specification databases like **IETF RFCs** and **MDN Web Docs**).
   - Curates educational **YouTube video masterclasses** with precise timestamps, channel attribution, and conceptual summaries.
   - Synthesizes findings into an indexed research bundle with key facts, edge cases, and misconceptions.

2. **45-Minute Lesson Synthesizer**:
   - Structured specifically for a **strict 45-minute cognitive pacing window** (suitable for self-learning or instructor-led teaching).
   - Structured sections with mental models, deep-dive conceptual deconstruction, RFC packet dumps, hands-on lab triage, and formative self-assessments.
   - Embedded video lesson guides and authoritative academic/specification citations.

3. **Two Independent Quality Control (QC) Layers**:
   - **QC Layer 1 (Research & Factual Accuracy)**:
     - Verifies technical claims against canonical standards (e.g. RFC 9110, Cormen et al. CLRS).
     - Identifies misleading myths (e.g., POST auto-encryption myth, GET request body proxies, 204 response bodies).
     - Audits source credibility (canonical vs secondary) and detects internal inconsistencies.
     - Produces an independent audit report with scores, metrics, verified claims, and actionable fixes.
   - **QC Layer 2 (Instructional Quality & Pedagogical Flow)**:
     - Measures alignment against Bloom's Taxonomy for every sub-clause in the objective.
     - Audits 45-minute pacing feasibility (word count, reading time at 140 wpm, activity and quiz time).
     - Identifies explanation gaps, visual scaffolding opportunities, and active recall needs.
     - Produces an independent audit report with scores, pacing timeline analysis, and pedagogical fixes.

4. **Review, Edit, and One-Click QC Recommendations**:
   - Interactive live section editor allowing instructors to customize and reorder content.
   - One-click **"Apply Fix"** or **"Apply All High Priority Fixes"** that surgically incorporates QC recommendations into the lesson.
   - Dual-view workspace: Real-time learner/instructor preview alongside audit reports.
   - Auto-save state preservation in browser `localStorage` and disk storage (`server/storage/`).

5. **Multi-Format Export Engine**:
   - **Markdown (`.md`)**: Complete GFM format with timing tables, code blocks, video links, references, and QC audit appendices.
   - **Standalone HTML (`.html`)**: Clean, responsive layout with embedded CSS, badges, and print-to-PDF styles.
   - **Structured JSON (`.json`)**: Machine-readable package containing lesson metadata, sections, activities, quizzes, references, and complete QC reports.

6. **Zero-Config Resilient Architecture**:
   - Runs **100% out of the box** with zero mandatory external API keys via our autonomous domain intelligence engine.
   - Seamlessly upgrades to live cloud LLMs (**Google Gemini 2.5 Flash / OpenAI GPT-4o-mini**) when an API key is configured.

---

## 🏗️ Architecture & Component Hierarchy

```
kal/
├── server/
│   ├── index.js                     # Express API & static client server
│   ├── services/
│   │   ├── researchService.js       # Multi-source research (Books, Web/RFC, YouTube)
│   │   ├── synthesisService.js      # 45-minute structured lesson generator & QC patcher
│   │   ├── qcLayer1Service.js       # QC Layer 1: Factual accuracy & source verification
│   │   ├── qcLayer2Service.js       # QC Layer 2: Instructional quality & pacing audit
│   │   ├── llmProvider.js           # Unified LLM provider (Gemini / OpenAI / Autonomous)
│   │   └── exportService.js         # Markdown, HTML/PDF, and JSON exporters
│   └── storage/                     # Persistent disk storage for saved lessons
│
├── client/                          # React + Vite + Custom Modern Dark Theme
│   ├── src/
│   │   ├── App.jsx                  # Main workspace, state orchestration & auto-save
│   │   ├── index.css                # Dark theme design system & print styles
│   │   └── components/
│   │       ├── Header.jsx           # Top navigation, status indicator & quick modals
│   │       ├── InputSection.jsx     # Lesson Title/Objective inputs & sample presets
│   │       ├── PipelineProgress.jsx # 4-stage pipeline tracker with step retries
│   │       ├── LessonPreview.jsx    # Interactive learner view with quiz & video cards
│   │       ├── LessonEditor.jsx     # Real-time live section & timing editor
│   │       ├── QCAuditPanel.jsx     # Tabbed/split view for QC1 & QC2 reports + Apply Fixes
│   │       ├── ExportModal.jsx      # Modal for downloading .md, .html, .json
│   │       ├── SettingsModal.jsx    # API key configuration & engine switcher
│   │       └── SavedLessonsModal.jsx# Lesson library browser & session restore
│   ├── vite.config.js               # Dev server configuration with API proxy
│   └── dist/                        # Production build served directly by Express
│
├── sample_outputs/                  # Verified lesson & QC report artifacts
│   ├── sample1_http_requests_lesson.md
│   ├── sample1_http_requests_qc1_report.md
│   ├── sample1_http_requests_qc2_report.md
│   ├── sample1_http_requests_lesson.html
│   ├── sample1_http_requests_complete_package.json
│   ├── sample2_binary_search_lesson.md
│   ├── sample2_binary_search_qc1_report.md
│   ├── sample2_binary_search_qc2_report.md
│   ├── sample2_binary_search_lesson.html
│   └── sample2_binary_search_complete_package.json
│
├── tests/
│   ├── run_all_tests.js             # Automated 9-suite verification runner
│   └── generate_samples.js          # Artifact generation script
│
├── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher (v24.x tested)
- **npm**: v9.0.0 or higher

### Installation
From the root directory:
```bash
# Install root dependencies
npm install

# Build the client interface
npm run build:client
```

### Running the Application
Start the unified server:
```bash
npm start
```
Navigate your browser to:
👉 **`http://localhost:5000`**

*(Both the frontend UI and backend REST API run on port 5000 with zero cross-origin configuration required).*

---

## 🧪 Testing & Verification

Run the automated verification suite:
```bash
npm test
```

### Test Coverage Summary:
- **Suite 1: Input Validation & Error Handling**: Ensures empty inputs are rejected gracefully with helpful feedback.
- **Suite 2: Multi-Source Research Engine**: Verifies books from Open Library, IETF RFC 9110 web citations, and YouTube videos.
- **Suite 3: 45-Minute Lesson Synthesizer**: Tests timing breakdown, cognitive load, hands-on lab scaffolding, and quiz questions.
- **Suite 4: QC Layer 1 (Factual Accuracy)**: Validates claim verification, source credibility scoring, and RFC 9110 adherence.
- **Suite 5: QC Layer 2 (Instructional Quality)**: Validates Bloom's taxonomy coverage and 45-minute completion feasibility.
- **Suite 6: Review, Edit, & QC Apply**: Validates that applying recommendations surgically updates the lesson content.
- **Suite 7: Multi-Format Exports**: Tests Markdown, print-ready HTML, and JSON outputs.
- **Suite 8: Sample 2 Verification (Binary Search)**: Validates divide-and-conquer recurrence, integer overflow fix, and both QC layers.

To re-generate all sample markdown, HTML, and JSON artifacts:
```bash
npm run generate:samples
```

---

## 🔍 The Two Quality Control (QC) Layers in Detail

### QC Layer 1: Research and Factual Accuracy
Designed to ensure that instructional content is technically unimpeachable:
- **Claim Verification**: Every factual assertion is matched against canonical standards (e.g., IETF RFCs, W3C standards, peer-reviewed textbooks).
- **Misconception Detection**: Flags widespread misconceptions (e.g., claiming POST is encrypted without HTTPS; claiming GET request bodies are widely supported; confusing 401 Unauthorized with 403 Forbidden).
- **Source Reliability**: Classifies sources as Canonical/Authoritative vs Secondary/Encyclopedic.
- **Severity Scoring**: Flags issues as `HIGH`, `MEDIUM`, or `LOW`.

### QC Layer 2: Instructional Quality & Pedagogical Flow
Designed to guarantee effective learning outcomes within a 45-minute class:
- **Bloom's Taxonomy Objective Alignment**: Verifies that every clause in the learning objective is addressed at the appropriate cognitive level (Remember, Understand, Apply, Analyze, Evaluate).
- **45-Minute Pacing Audit**:
  - Calculates word count and reading time at an instructional rate of 140 words/minute.
  - Balances concept deconstruction (13 min), demonstrations (10 min), hands-on practice (10 min), and assessment (5 min).
- **Scaffolding & Cognitive Load**: Identifies missing diagrams, confusing transitions, or lack of step-by-step guidance.
- **One-Click Remediation**: Instructors can review each suggestion and click **"Apply Fix"** to immediately enhance the lesson.

---

## 📋 Demonstration of Sample Test Cases

### Sample 1: HTTP Requests and Responses
- **Input Title**: `HTTP Requests and Responses`
- **Input Objective**: `Explain GET and POST methods and distinguish between 2xx, 4xx, and 5xx response status categories.`
- **QC Layer 1 Result**: **96 / 100 (PASSED_WITH_RECOMMENDATIONS)**
  - Verified RFC 9110 Sections 9 (Methods) and 15 (Status Codes).
  - Addressed historical naming anomaly of 401 (Unauthenticated vs Unauthorized).
  - Recommended note regarding proxy behavior on GET request bodies.
- **QC Layer 2 Result**: **95 / 100 (PASSED_WITH_RECOMMENDATIONS)**
  - 100% Bloom's coverage across GET/POST semantics and 2xx/4xx/5xx categories.
  - Pacing audit: 42 estimated minutes (optimal for 45-minute lesson).
  - Recommended ASCII sequence diagram for client-server exchange.
- **Artifacts Saved**: `sample_outputs/sample1_http_requests_*`

### Sample 2: Binary Search Algorithms: Divide and Conquer
- **Input Title**: `Binary Search Algorithms: Divide and Conquer`
- **Input Objective**: `Explain the divide-and-conquer principle of binary search, implement the iterative and recursive variants, and analyze its O(log n) time complexity against linear search.`
- **QC Layer 1 Result**: **97 / 100 (PASSED_WITH_RECOMMENDATIONS)**
  - Verified Cormen et al. (CLRS 4th Ed) recurrence relation $T(n) = T(n/2) + \mathcal{O}(1) = \mathcal{O}(\log n)$.
  - Verified Joshua Bloch (Google Research) integer overflow fix `low + (high - low) // 2`.
  - Audited auxiliary space complexity: $\mathcal{O}(1)$ iterative vs $\mathcal{O}(\log n)$ recursive call stack.
- **QC Layer 2 Result**: **96 / 100 (PASSED_WITH_RECOMMENDATIONS)**
  - 99% objective alignment across all three sub-competencies.
  - Pacing audit: 43 estimated minutes.
  - Interactive boundary bug-hunting lab (single-element search, infinite loop trap).
- **Artifacts Saved**: `sample_outputs/sample2_binary_search_*`

---

## 🛡️ Error Handling & State Preservation

- **Empty / Invalid Input Shielding**: Clear visual validation preventing empty submissions.
- **Network Resilience**: Falls back smoothly to curated domain literature if external APIs experience downtime or latency.
- **Modular Retries**: If any stage (Research, Synthesis, QC1, QC2) fails, instructors can retry that specific stage independently without restarting.
- **Auto-Save Persistence**: Every keystroke and generated lesson state is synchronized to browser `localStorage` and disk (`server/storage/*.json`), guaranteeing that instructor edits are never lost on browser refresh.

---

## 📄 License
MIT License. Built for the Program Design Team.
