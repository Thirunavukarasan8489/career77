# Career77 — Cleanup and Implementation Roadmap

## 1. Executive Summary
This document provides a phased implementation roadmap to address the gaps identified in the Career77 project audit. The roadmap outlines a sequence of tasks to secure APIs, align layouts with design guidelines, and implement missing features without breaking existing functionality.

---

## 2. Current Project State
The application has a functional UI core with pages for candidates, recruiters, and admins. However, security checks are missing on several backend endpoints, which allows unauthenticated access to database updates, support tickets, and stats. Mock placeholders exist for paid training, payments, and messaging.

---

## 3. Roadmap Principles
1.  **Preserve Working Functionality**: Do not refactor stable client pages unless it resolves a security vulnerability, performance bottleneck, or typing error.
2.  **Fix Security Before Features**: All P0 security, data integrity, and API authorization tasks must be verified before implementing new product modules.
3.  **Work in Small Phases**: Each step must compile independently, pass TypeScript checks, and be manually testable.

---

## 4. Phase 0 — Baseline and Backup
Before editing codebase files, capture baselines to verify that subsequent changes do not introduce regressions:
*   Confirm Git status (`git status`).
*   Verify the current working branch is clean.
*   Verify TypeScript compilation (`npx tsc --noEmit`).
*   Verify ESLint rules pass (`npm run lint`).
*   Verify production builds compile without errors (`npm run build`).

---

## 5. Phase 1 — Critical Security and Data Integrity

### SEC-01 — Secure Candidates List Endpoint
- **Priority:** P0
- **Phase:** Phase 1 — Critical Security and Data Integrity
- **Type:** Security
- **Status:** Not Started
- **Documentation:** `docs/08-architecture/8.6-architecture-authorization.md` Section 13
- **Affected Files:** `app/api/candidates/route.ts`
- **Problem:** `GET /api/candidates` falls back to returning the first 50 candidate profiles (including emails, mobile numbers, and resume links) to unauthenticated public callers.
- **Expected Result:** Return a `401 Unauthorized` response to unauthenticated requests.
- **Dependencies:** Phase 0 Baseline
- **Risk:** High (data exposure)
- **Validation:** Test that an anonymous `GET /api/candidates` request returns a 401 error.

### SEC-02 — Restrict Job Creation Route by Role
- **Priority:** P0
- **Phase:** Phase 1 — Critical Security and Data Integrity
- **Type:** Security
- **Status:** Not Started
- **Documentation:** `docs/08-architecture/8.6-architecture-authorization.md` Section 19
- **Affected Files:** `app/api/jobs/route.ts`
- **Problem:** `POST /api/jobs` checks for session validity but does not verify if the user possesses the `recruiter` or `superadmin` role.
- **Expected Result:** Restrict job creation to users with the `recruiter` or `superadmin` role.
- **Dependencies:** Phase 0 Baseline
- **Risk:** Medium
- **Validation:** Verify that candidate credentials return a `403 Forbidden` response when trying to create a job.

### SEC-03 — Enforce Super Admin Verification Gate
- **Priority:** P0
- **Phase:** Phase 1 — Critical Security and Data Integrity
- **Type:** Security
- **Status:** Not Started
- **Documentation:** `docs/06-admin/6.6-admin-verification.md` & `docs/08-architecture/8.6-architecture-authorization.md` Section 26
- **Affected Files:** `app/api/verification/route.ts`
- **Problem:** `PATCH /api/verification` updates recruiter company verification statuses without verifying if the user has a `superadmin` role.
- **Expected Result:** Restrict verification updates strictly to Super Admins.
- **Dependencies:** Phase 0 Baseline
- **Risk:** High
- **Validation:** Test that unauthorized accounts receive a `403 Forbidden` response when updating verification statuses.

### SEC-04 — Secure Analytics Access
- **Priority:** P0
- **Phase:** Phase 1 — Critical Security and Data Integrity
- **Type:** Security
- **Status:** Not Started
- **Documentation:** `docs/08-architecture/8.6-architecture-authorization.md` Section 27
- **Affected Files:** `app/api/analytics/route.ts`
- **Problem:** `GET /api/analytics` returns platform performance statistics to unauthenticated public callers.
- **Expected Result:** Restrict analytics access to authenticated Super Admins.
- **Dependencies:** Phase 0 Baseline
- **Risk:** Medium
- **Validation:** Verify that unauthenticated requests to `/api/analytics` return a `401 Unauthorized` response.

### SEC-05 — Secure Support Ticket Endpoints
- **Priority:** P0
- **Phase:** Phase 1 — Critical Security and Data Integrity
- **Type:** Security
- **Status:** Not Started
- **Documentation:** `docs/08-architecture/8.6-architecture-authorization.md` Section 29
- **Affected Files:** `app/api/support/route.ts`
- **Problem:** `GET /api/support` returns support tickets to any caller without validating ownership or roles.
- **Expected Result:** Limit ticket retrieval to the ticket author or Super Admins.
- **Dependencies:** Phase 0 Baseline
- **Risk:** High (data exposure)
- **Validation:** Verify that a candidate can only retrieve their own tickets, and unauthenticated requests return a `401 Unauthorized` response.

### SEC-06 — Secure Subscription Modifications
- **Priority:** P0
- **Phase:** Phase 1 — Critical Security and Data Integrity
- **Type:** Security
- **Status:** Not Started
- **Documentation:** `docs/08-architecture/8.6-architecture-authorization.md` Section 25 & `docs/09-platform/9.4-platform-subscriptions.md`
- **Affected Files:** `app/api/billing/subscribe/route.ts`
- **Problem:** `POST /api/billing/subscribe` updates plans using client-provided `companyId` parameters without checking company ownership.
- **Expected Result:** Verify company ownership before updating subscriptions.
- **Dependencies:** Phase 0 Baseline
- **Risk:** High
- **Validation:** Verify that recruiters receive a `403 Forbidden` response when trying to modify subscriptions for other companies.

### SEC-07 — Fix Interview Recruiter ID Mapping Bug
- **Priority:** P0
- **Phase:** Phase 1 — Critical Security and Data Integrity
- **Type:** Security
- **Status:** Not Started
- **Documentation:** `docs/05-recruiter/5.6-recruiter-interviews.md`
- **Affected Files:** `app/api/interviews/route.ts`
- **Problem:** `POST /api/interviews` populates the database `recruiterId` field with the candidate's ID (`application.candidateId`).
- **Expected Result:** Retrieve and assign the recruiter's ID from the session.
- **Dependencies:** Phase 0 Baseline
- **Risk:** Medium
- **Validation:** Verify that scheduled interviews map the correct recruiter ID in MongoDB.

---

## 6. Phase 2 — Authentication and Authorization

### AUTH-01 — Implement Recruiter Verification Status Guard
- **Priority:** P1
- **Phase:** Phase 2 — Authentication and Authorization
- **Type:** Architecture
- **Status:** Not Started
- **Documentation:** `docs/05-recruiter/5.1-recruiter-overview.md` Section 3
- **Affected Files:** `middleware.ts`
- **Problem:** `middleware.ts` allows any recruiter account to access `/recruiter` dashboards immediately upon registration without verification checks.
- **Expected Result:** Redirect unverified recruiters to a pending status page until approved by a Super Admin.
- **Dependencies:** SEC-03
- **Risk:** Medium
- **Validation:** Test that a newly registered recruiter is redirected to `/recruiter/pending` when trying to access the dashboard.

### AUTH-02 — Secure Company Profile Updates
- **Priority:** P1
- **Phase:** Phase 2 — Authentication and Authorization
- **Type:** Architecture
- **Status:** Not Started
- **Documentation:** `docs/08-architecture/8.6-architecture-authorization.md` Section 14
- **Affected Files:** `app/api/companies/route.ts`
- **Problem:** `PUT /api/companies` updates company profiles based on name slugs without owner verification checks.
- **Expected Result:** Restrict company updates to the authorized recruiter.
- **Dependencies:** AUTH-01
- **Risk:** High
- **Validation:** Verify that recruiters receive a `403 Forbidden` response when trying to modify other companies' profiles.

---

## 7. Phase 3 — Database and API Architecture

### DB-01 — Centralize Candidate Session Verification
- **Priority:** P1
- **Phase:** Phase 3 — Database and API Architecture
- **Type:** Architecture
- **Status:** Not Started
- **Documentation:** `docs/08-architecture/8.2-architecture-backend.md`
- **Affected Files:** `lib/auth.ts`, `app/api/candidates/route.ts`, `app/api/applications/route.ts`
- **Problem:** Candidate session tokens are verified inline, leading to code duplication.
- **Expected Result:** Centralize candidate session verification into a helper function inside `lib/auth.ts`.
- **Dependencies:** Phase 0 Baseline
- **Risk:** Low
- **Validation:** Verify candidate routes and applications function correctly with the helper.

### DB-02 — Create Audit Log Schema
- **Priority:** P1
- **Phase:** Phase 3 — Database and API Architecture
- **Type:** Architecture
- **Status:** Not Started
- **Documentation:** `docs/09-platform/9.6-platform-audit-logs.md`
- **Affected Files:** `models/AuditLog.ts` [NEW]
- **Problem:** Administrative updates (approvals, subscription changes) are not logged.
- **Expected Result:** Create an append-only `AuditLog` model to track sensitive updates.
- **Dependencies:** Phase 0 Baseline
- **Risk:** Low
- **Validation:** Verify that changes log correctly in the MongoDB database collection.

---

## 8. Phase 4 — Code Structure and Technical Debt

### DEBT-01 — Consolidate NextAuth User Queries
- **Priority:** P2
- **Phase:** Phase 4 — Code Structure and Technical Debt
- **Type:** Cleanup
- **Status:** Not Started
- **Documentation:** `docs/08-architecture/8.5-architecture-authentication.md`
- **Affected Files:** `app/api/auth/[...nextauth]/route.ts`
- **Problem:** NextAuth queries both `User` and `Recruiter` collections, creating redundant database lookups.
- **Expected Result:** Consolidate credentials check to run only on the `User` schema.
- **Dependencies:** Phase 0 Baseline
- **Risk:** Low
- **Validation:** Verify that recruiter login continues to function correctly.

---

## 9. Phase 5 — Candidate Experience

### CAND-01 — Bind Dynamic JSON-LD Fields
- **Priority:** P2
- **Phase:** Phase 5 — Candidate Experience
- **Type:** Design
- **Status:** Not Started
- **Documentation:** `AGENTS.md` Section 6 & `docs/08-architecture/8.4-architecture-api.md`
- **Affected Files:** `app/openings/[jobId]/page.tsx`
- **Problem:** Job pages generate schema tags, but fields like `baseSalary` are hardcoded.
- **Expected Result:** Bind salary ranges and details dynamically from Mongoose documents.
- **Dependencies:** Phase 0 Baseline
- **Risk:** Low
- **Validation:** Run rich result tests on `/openings` details pages.

---

## 10. Phase 6 — Recruiter Experience

### REC-01 — Link Company Registration to Recruiter
- **Priority:** P1
- **Phase:** Phase 6 — Recruiter Experience
- **Type:** Feature
- **Status:** Not Started
- **Documentation:** `docs/05-recruiter/5.7-recruiter-company.md`
- **Affected Files:** `app/api/recruiter/register/route.ts`
- **Problem:** Recruiter registrations do not consistently link user profiles to company collections.
- **Expected Result:** Recruiters are linked to their respective company profile upon registration.
- **Dependencies:** AUTH-02
- **Risk:** Medium
- **Validation:** Verify that new recruiters are linked to the correct company profile in MongoDB.

---

## 11. Phase 7 — Super Admin Experience

### ADM-01 — Verification Queue Actions Audit Logs
- **Priority:** P1
- **Phase:** Phase 7 — Super Admin Experience
- **Type:** Feature
- **Status:** Not Started
- **Documentation:** `docs/09-platform/9.6-platform-audit-logs.md`
- **Affected Files:** `app/api/verification/route.ts`
- **Problem:** Company verification updates do not generate audit logs.
- **Expected Result:** Generate audit logs when verification requests are approved or rejected.
- **Dependencies:** DB-02
- **Risk:** Low
- **Validation:** Verify logs populate in MongoDB when updating verification statuses.

---

## 12. Phase 8 — Paid Training

### TRAIN-01 — Scaffold Paid Training Module
- **Priority:** P1
- **Phase:** Phase 8 — Paid Training
- **Type:** Feature
- **Status:** Not Started
- **Documentation:** `docs/04-training/`
- **Affected Files:** `models/Training.ts` [NEW], `/app/training` [NEW]
- **Problem:** Candidate paid training features are missing.
- **Expected Result:** Scaffold course models and pages.
- **Dependencies:** Phase 0 Baseline
- **Risk:** Medium
- **Validation:** Verify that courses render correctly.

---

## 13. Phase 9 — Platform Services

### PLAT-01 — Subscription Payments Gate
- **Priority:** P1
- **Phase:** Phase 9 — Platform Services
- **Type:** Feature
- **Status:** Not Started
- **Documentation:** `docs/09-platform/9.4-platform-subscriptions.md`
- **Affected Files:** `app/api/billing/subscribe/route.ts`
- **Problem:** Subscriptions are activated immediately on request without gateway checks.
- **Expected Result:** Integrate sandbox checkout checks before activating plans.
- **Dependencies:** SEC-06
- **Risk:** High (billing)
- **Validation:** Verify subscription updates require valid payment credentials.

---

## 14. Phase 10 — Design System Alignment

### DS-01 — Standardize Border Contrast Variables
- **Priority:** P2
- **Phase:** Phase 10 — Design System Alignment
- **Type:** Design
- **Status:** Not Started
- **Documentation:** `docs/07-design/7.3-design-color-system.md`
- **Affected Files:** `components/RecruiterLayoutClient.tsx`, `app/globals.css`
- **Problem:** Some UI borders use hardcoded gray hex values instead of Tailwind color tokens.
- **Expected Result:** Align styles to use theme variables (`#4F46E5` for Primary, `#10B981` for Conversion).
- **Dependencies:** Phase 0 Baseline
- **Risk:** Low
- **Validation:** Check visual consistency on different screen sizes.

---

## 15. Phase 11 — Performance Optimization

### PERF-01 — Refactor Search using text indexes
- **Priority:** P2
- **Phase:** Phase 11 — Performance Optimization
- **Type:** Performance
- **Status:** Not Started
- **Documentation:** `docs/08-architecture/8.3-architecture-database.md` & `AGENTS.md` Section 30
- **Affected Files:** `app/api/jobs/route.ts`
- **Problem:** Job board queries use case-insensitive `$regex` queries, which can degrade database performance at scale.
- **Expected Result:** Migrate search logic to use native MongoDB text indexes.
- **Dependencies:** Phase 0 Baseline
- **Risk:** Low
- **Validation:** Verify search results return matching postings.

---

## 16. Phase 12 — Final Validation
Validate that the changes pass all build checks and align with the guidelines:
*   Verify no compiler errors (`npx tsc --noEmit`).
*   Verify ESLint rules pass (`npm run lint`).
*   Verify the production bundle compiles (`npm run build`).

---

## 17. Documentation Updates
Update documentation files (`docs/`) if any implementation details change.

---

## 18. Risks and Dependencies
*   **NextAuth Session Dependencies**: Restricting API routes relies on NextAuth session states. If session context fails to propagate on serverless environments, it could block access for valid users.

---

## 19. Definition of Done
The cleanup tasks are complete when:
*   All P0 security, authentication, and logic bugs are resolved.
*   P1 database architecture gaps are patched.
*   Production build completes without errors.
*   No code changes were made during this planning phase.

---

## 20. Recommended Next Action
Begin **Phase 0 — Baseline and Backup** to record baseline TypeScript, ESLint, and production build statuses.
