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

## Delivery phases

### Phase 0 — Establish a trusted baseline

**Goal:** Make every later change safe to ship.

Deliverables:

- Pin a supported Node.js LTS release in `engines`, `.nvmrc`, and CI.
- Add ESLint flat configuration, formatting, and scripts that work with Next.js 16.
- Add unit, component, and end-to-end test runners; initially cover authentication boundaries and the critical ingest-to-patch path.
- Add CI checks for install, lint, typecheck, test, production build, dependency audit, and secret scanning.
- Validate environment variables at startup and align the docs with `GEMINI_API_KEY`.
- Remove unused packages and add automated dependency-update pull requests.
- Document local setup, architecture decisions, data handling, and release steps.

Exit criteria:

- A clean checkout produces the same build in local development and CI.
- No build/type errors are ignored, and all required checks block merging.
- Secrets are absent from source and validated before server startup.

### Phase 1 — Identity, tenancy, and durable data

**Goal:** Replace the browser-only demo architecture with secure application foundations.

Deliverables:

- Implement Firebase Authentication with secure server-verified sessions.
- Add organizations and memberships with `owner`, `admin`, `analyst`, and `viewer` roles.
- Protect routes and server actions; never trust client-provided organization or role identifiers.
- Define domain-owned schemas for users, organizations, assets, vulnerabilities, findings, patches, and audit events.
- Introduce repository and service layers instead of importing AI output types into application state.
- Persist records in Firestore with converters, indexes, tenant-scoped queries, transactions, and tested security rules.
- Move demo data to explicit seed fixtures and place a visible non-production banner around demo mode.
- Record immutable audit events for login, ingestion, status changes, recommendations, exports, and administrative actions.

Exit criteria:

- Two organizations cannot access each other's records through either UI or direct API calls.
- Refreshing or signing in on another device preserves authorized data.
- Every mutating operation has actor, timestamp, organization, target, and before/after context.

### Phase 2 — Reliable ingestion and vulnerability intelligence

**Goal:** Build trustworthy inputs before adding more AI behavior.

Deliverables:

- Parse Nmap XML with a hardened XML parser; reject DTDs/external entities and enforce file/record limits.
- Normalize software identity using CPE and package URL where available.
- Add scheduled NVD CVE and CISA KEV synchronization with source timestamps and retryable cursors.
- Support CSV/JSON asset imports and preserve the original uploaded artifact.
- Add idempotency keys, deduplication, validation errors, job progress, retries, and dead-letter handling.
- Store provenance for every field: source, source record ID, observed time, import job, and parser version.
- Separate assets, vulnerabilities, and findings so one CVE can affect many assets without duplicating canonical data.

Exit criteria:

- Re-importing the same artifact creates no duplicate assets or findings.
- Malformed and oversized inputs fail safely with actionable messages.
- A user can trace each finding back to its exact source artifact and parser version.

### Phase 3 — Explainable risk and remediation workflow

**Goal:** Turn findings into defensible work priorities.

Deliverables:

- Calculate a deterministic base risk from CVSS, CISA KEV, EPSS, exploit maturity, exposure, asset criticality, and compensating controls.
- Show the scoring formula and contributing evidence beside every priority.
- Add finding lifecycle states, ownership, comments, due dates, SLA policies, exceptions, and evidence attachments.
- Add remediation projects that group related patches by service, asset group, or maintenance window.
- Track patch state separately from patch availability: proposed, approved, scheduled, applied, verified, failed, and rolled back.
- Verify remediation with a follow-up scan rather than treating recommendation creation as patch completion.

Exit criteria:

- The same evidence always produces the same base score.
- Analysts can override a score only with a reason, and the override is audited.
- Dashboard patch metrics count verified remediation, not generated recommendations.

### Phase 4 — Guardrailed AI assistance

**Goal:** Make AI useful without making it the source of truth.

Deliverables:

- Ground chat and advisory flows in tenant-authorized stored records and approved external sources.
- Require structured outputs containing source references, confidence, assumptions, and uncertainty.
- Add prompt-injection defenses, input size limits, timeouts, rate limits, token budgets, and output sanitization.
- Redact secrets and sensitive fields before model calls; define retention and provider data-use policies.
- Require human approval before AI output changes priority, status, ownership, or remediation plans.
- Build a versioned evaluation set covering parsing, mapping, prioritization, hallucination, citation quality, and adversarial inputs.
- Capture model name, prompt version, latency, cost, safety result, and evaluation score for each run.

Exit criteria:

- Recommendations without supporting evidence are rejected or clearly marked unverified.
- Cross-tenant retrieval tests and prompt-injection tests pass.
- A model or prompt update cannot ship unless it meets agreed evaluation thresholds.

### Phase 5 — Product feature upgrade

**Goal:** Deliver the workflows security teams use daily.

Priority order:

1. **Remediation queue:** saved filters, bulk assignment, SLA views, comments, approvals, and evidence.
2. **Asset inventory:** ownership, business criticality, environment, exposure, tags, software, and scan history.
3. **Finding explorer:** CVE/asset/service views, deduplication, exceptions, and full evidence timeline.
4. **Dashboards:** age, SLA breach, KEV exposure, risk trend, reopen rate, remediation throughput, and coverage.
5. **Reports:** configurable date ranges, organization branding, PDF/CSV export, scheduled delivery, and immutable snapshots.
6. **Integrations:** Jira/GitHub Issues, Slack/email notifications, scanner webhooks, and ticket synchronization.
7. **Search and chat:** scoped natural-language queries that link every answer to records and authoritative advisories.

Exit criteria:

- An analyst can move from imported scan to assigned and verified remediation without copying data between screens.
- Every dashboard metric has a documented query definition and can be reproduced from stored records.
- Integrations are idempotent, observable, and safe to retry.

### Phase 6 — Production hardening and launch

**Goal:** Operate PatchWise as a security product, not only deploy it.

Deliverables:

- Structured logging, traces, error tracking, health checks, dashboards, and alerts.
- Defined SLOs for availability, request latency, ingestion completion, and data freshness.
- Backup, restore, retention, deletion, and disaster-recovery procedures with a successful restore drill.
- CSP and security headers, dependency/container scanning, abuse protection, and independent threat modeling.
- Accessibility review against WCAG 2.2 AA and responsive/browser coverage.
- Load tests for large scans and concurrent AI jobs, plus cost budgets and quota alerts.
- Staged environments, preview deployments, release notes, rollback procedure, and incident runbooks.

Exit criteria:

- Security review has no unresolved critical findings.
- Recovery objectives are documented and demonstrated by a restore test.
- On-call operators can detect, diagnose, and roll back a failed release using documented procedures.

## Proposed domain model

- `Organization`: tenant, plan, settings, retention policy.
- `Membership`: user, organization, role, status.
- `Asset`: hostname/address, environment, owner, criticality, exposure, tags.
- `SoftwareComponent`: normalized product/package identity and observed version.
- `Vulnerability`: canonical CVE/advisory data and source provenance.
- `Finding`: vulnerability-to-asset occurrence, evidence, risk, status, SLA, assignee.
- `Remediation`: proposed action, approval, schedule, execution, verification, rollback.
- `IngestionJob`: source artifact, parser version, progress, errors, idempotency key.
- `AiRun`: prompt/model version, authorized context references, result, citations, cost, review state.
- `AuditEvent`: immutable actor/action/target record with correlation ID.

## Recommended first two-week sprint

1. Decide and record ADRs for Firebase tenancy, session handling, and repository boundaries.
2. Add supported Node pinning, ESLint, test runners, and a CI quality gate.
3. Add typed environment validation and correct API-key documentation.
4. Define domain schemas independent of Genkit outputs.
5. Implement Firebase Auth, organization membership, route protection, and emulator-backed security-rule tests.
6. Persist one vertical slice: create/import asset, list assets, and audit the mutation.
7. Keep demo mode as seeded data through the same repository interface.

Sprint success means a new user can authenticate, access exactly one organization, create an asset, reload the page, and still see it—while CI proves another organization cannot read it.

## Decisions to make before Phase 1

- Firebase-only backend versus a relational database for reporting-heavy workloads.
- Single-region versus multi-region storage and the required data residency.
- Supported identity providers and whether enterprise SSO is a launch requirement.
- Exact authoritative vulnerability sources and their licensing/redistribution terms.
- Model-provider data retention requirements for customer security data.
- Initial tenant scale targets: assets, findings, artifact size, users, and ingestion frequency.

## Definition of done for future work

A feature is complete only when it has authorization checks, schema validation, loading/empty/error states, audit behavior where relevant, automated coverage, observability, accessible interaction, documentation, and a rollback or recovery path.
