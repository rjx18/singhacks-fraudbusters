# Julius Baer Agentic AI Platform

## Overview
This project is a **Next.js + React** application demonstrating an **Agentic AI Platform for Real-Time AML Monitoring, Document Corroboration, and Process Orchestration**. Built for the *SingHacks 2025 Julius Baer* challenge, it automates Anti-Money Laundering (AML) surveillance, transaction analysis, document verification, and compliance workflows — powered by an agentic AI and Camunda orchestration.

The system consists of three integrated modules:
1. **Real-Time Transaction Fraud Monitoring**  
   Continuously monitors synthetic financial transactions, detects AML anomalies via configurable rules, and triggers workflow actions using Camunda orchestrator.
2. **Document & Image Corroboration**  
   Processes uploaded documents (PDFs, images, and text) to detect structural inconsistencies, missing data, or tampering — generating dynamic risk reports.
3. **Camunda Orchestrator + React Flow Visualization**  
   Manages transaction lifecycles through BPMN-based flows, displaying transaction check results and rule paths visually using React Flow.

A unified dashboard ties all modules together with a **role-based interface**, **audit trail**, and **AI copilot** for contextual insight.

---

## Tech Stack
- **Framework:** Next.js (App Router, React 18, Suspense)
- **Styling:** Tailwind CSS
- **Backend:** Next.js API Routes + Camunda Orchestrator API integration
- **Visualization:** React Flow (for transaction result flow diagrams)
- **Type Checking:** TypeScript
- **UI Components:** Custom React components styled with shadcn/ui

---

## Key Features

### 🧠 Part 1: Real-Time AML Monitoring
- **Transaction ingestion** from mock or live Camunda workflow tasks (`/api/transactions`)
- **Rule-based risk evaluation** (e.g., thresholds, cross-jurisdiction patterns)
- **Risk scoring & classification** (Low/Medium/High)
- **Camunda orchestration** to manage transaction state and escalation paths
- **Alert routing** across roles (Front, Compliance, Legal)
- **React Flow diagram** for transaction journey visualization

### 📄 Part 2: Document & Image Corroboration
- **Multi-format upload:** PDF, text, image
- **Content extraction & structure validation**
- **AI-generated & tampering detection hooks** (forensic analysis)
- **Automated risk scoring & feedback loop**
- **Detailed report generation** with per-document findings

### ⚙️ Part 3: Orchestration & Visualization
- **Camunda Engine Integration**  
  Orchestrates AML workflows - from rule triggering to remediation actions.
- **React Flow-based Visual Result Page**  
  Displays process instances, task completions, and rule outcomes visually for better interpretability.
- **Rule Mapping:** Links FINMA / MAS / HKMA circulars to corresponding orchestration nodes.

### 🧩 Integration Layer
- **Unified Dashboard** across transactions and document analysis
- **Audit Trail** across all actions for traceability

---

## Getting Started

### 1️⃣ Install Dependencies
```bash
npm install
# or
pnpm install
```

### 2️⃣ Run the Development Server
```bash
npm run dev
```
Then open [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

### 3️⃣ Project Entry Points
- **Dashboard:** `/dashboard` — summary of alerts, docs, and rules
- **Transactions:** `/aml` — live AML monitoring
- **Documents:** `/document` — document verification and risk scoring



---

## License
MIT License — for hackathon and educational use.

---

**Authors:**  
Team *FraudBusters* — SingHacks 2025 Julius Baer Challenge.
