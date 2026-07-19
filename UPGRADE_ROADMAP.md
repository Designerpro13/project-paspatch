# PatchWise Upgrade Roadmap

## Objective

Turn PatchWise from a hackathon prototype into a dependable vulnerability-management product with durable data, explainable recommendations, secure multi-user access, and production-grade operations.

The dependency modernization to Next.js 16, React 19, Tailwind CSS 4, Firebase 12, and Genkit 1.40 is the new technical baseline. Future work should preserve a green typecheck and production build.

## Current-state assessment

### What already works

- App Router UI for dashboards, ingestion, scan parsing, mapping, prioritization, patch records, advisory, chat, and reports.
- Six typed Genkit flows with structured Zod input and output schemas.
- Nmap-oriented workflows, vulnerability status tracking, patch CRUD, dashboard charts, and printable reports.
- Demo mode that makes the product easy to evaluate without external infrastructure.

### Gaps to close

- Authentication is a hardcoded `admin`/`admin` client check persisted in `localStorage`.
- Vulnerabilities, assets, and patches exist only in React context and disappear on refresh or mode changes.
- Firebase is installed but no authentication, database, storage, or security rules are implemented.
- Domain types are coupled to AI-flow outputs and include an unrestricted index signature.
- Nmap XML and vulnerability data are sent directly to an LLM instead of being deterministically parsed and validated first.
- AI output has no source provenance, citations, confidence, evaluation suite, rate limits, or human approval boundary.
- Reporting is a static 30-day print view rather than a queryable, exportable reporting system.
- There is no automated test suite, lint configuration, CI gate, telemetry, audit trail, backup policy, or incident runbook.
- Documentation references `GOOGLE_API_KEY`, while runtime configuration expects `GEMINI_API_KEY`.

## Product and engineering principles

1. Deterministic processing first; use AI for interpretation and explanation, not basic parsing.
2. Every recommendation must be explainable and linked to authoritative evidence.
3. Tenant isolation, least privilege, and auditability are product requirements, not deployment details.
4. Long-running ingestion and analysis run as jobs with observable status and safe retries.
5. Demo fixtures remain available but are isolated from production data paths.
6. No phase is complete without measurable acceptance criteria.

## Target architecture

- **Web:** Next.js App Router with server-side authorization and thin client components.
- **Identity:** Firebase Authentication with organization membership and role-based access control.
- **Persistence:** Firestore behind repository interfaces; use transactions, indexes, converters, and security rules. Keep domain services independent enough to migrate stores later.
- **Files:** Cloud Storage for uploaded scan and advisory artifacts, with size/type limits and retention policies.
- **Processing:** Idempotent ingestion jobs with explicit queued, running, completed, and failed states.
- **Intelligence:** Deterministic enrichment and scoring followed by Genkit flows for summarized, cited recommendations.
- **Operations:** Structured logs, error tracking, traces, health checks, usage/cost metrics, and audit events.
