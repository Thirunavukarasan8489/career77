# Gap Analysis, Conflicts & Priority Cleanup Plan

This document analyzes the findings from our project audit against the official Career77 product specifications and architecture blueprints (`docs/`). It lists the structural conflicts identified between the actual codebase implementation and the architecture guidelines, followed by a prioritized, actionable cleanup plan.

---

## 1. Gap Analysis: Design Blueprint vs. Existing Codebase

| Architecture Blueprint Area | Blueprint Requirement (`docs/`) | Codebase Status | Gap Classification |
| :--- | :--- | :--- | :--- |
| **Candidate Profiles API** | `docs/08-architecture/8.6-architecture-authorization.md` requires that candidate data must be protected and a candidate must not access other candidates' private data. | `GET /api/candidates` falls back to returning the first 50 candidate profiles (including names, emails, phones, and resume links) to any unauthenticated caller. | **Critical Security Conflict** |
| **Job Postings Access** | `docs/08-architecture/8.7-architecture-rbac.md` requires that only verified users holding the `recruiter` or `superadmin` role can post jobs. | `POST /api/jobs` checks for a session, but allows any logged-in user (including candidates) to create jobs. | **Critical Authorization Conflict** |
| **Verification Actions** | `docs/08-architecture/8.6-architecture-authorization.md` requires recruiter verification to be restricted strictly to Super Admins. | `PATCH /api/verification` updates verification status for companies without performing session or role verification checks. | **Critical Authorization Conflict** |
| **Analytics Reporting** | `docs/08-architecture/8.6-architecture-authorization.md` requires that platform performance analytics be restricted to Super Admins. | `GET /api/analytics` fetches and exposes platform statistics to unauthenticated public callers. | **Critical Security Conflict** |
| **Subscription Handling**| `docs/09-platform/platform-subscriptions.md` requires subscriptions to be verified server-side against actual payment gateway logs. | `POST /api/billing/subscribe` immediately updates status to active without payment checks, and accepts arbitrary `companyId` parameters. | **Logical & Billing Conflict** |
| **Interview Scheduling** | `docs/08-architecture/8.6-architecture-authorization.md` governs that recruiters schedule interviews for their company's jobs. | `POST /api/interviews` maps the applicant's `candidateId` into the `recruiterId` field, creating corrupted database relations. | **Core Business Logic Bug** |

---

## 2. Identified Conflicts

### Conflict 1: Public Exposure of Private Candidate Data
*   **Blueprint Policy**: Candidate information (resumes, emails, phone numbers) must remain strictly private and accessible only to the owner, authorized recruiters, or Super Admins.
*   **Actual Behavior**: An anonymous HTTP request to `/api/candidates` fetches and leaks a list of candidate profiles. This constitutes a severe privacy violation and a scraper exploit vector.

### Conflict 2: Complete Absence of Server-Side Role Validation (RBAC)
*   **Blueprint Policy**: The server-side code must evaluate user roles (`candidate`, `recruiter`, `superadmin`) and not rely on frontend layout routing or middleware redirects.
*   **Actual Behavior**: Routes under `/api/jobs`, `/api/verification`, and `/api/analytics` only check if a user is logged in (at best), neglecting to enforce role checks. A candidate can post jobs, and any user can fetch system statistics.

### Conflict 3: Corrupted Interview Ownership
*   **Blueprint Policy**: An interview must explicitly map the scheduling recruiter's ID (`recruiterId`) to link the session back to the employer's dashboard.
*   **Actual Behavior**: `POST /api/interviews` populates the database `recruiterId` field with the value of `application.candidateId`. This prevents recruiters from viewing their scheduled meetings on their portal and creates incorrect data relationships.

### Conflict 4: Insecure Billing Updates
*   **Blueprint Policy**: Recruiters cannot modify subscriptions or invoice data belonging to another company.
*   **Actual Behavior**: Any client payload presenting a random `companyId` can instantly upgrade, activate, or modify subscription tiers using `api/billing/subscribe`.

---

## 3. Priority Cleanup Plan

### P0: Critical Security & Data Integrity (Immediate Focus)
- [ ] **Secure `GET /api/candidates`**:
  *   Remove the public fallback `Candidate.find().limit(50)` query.
  *   Restrict anonymous queries. If no session is found, return `401 Unauthorized` or return only public details if public lookup is required.
- [ ] **Secure Job Creation**:
  *   Update `POST /api/jobs` to verify that the logged-in user possesses either the `recruiter` or `superadmin` role.
- [ ] **Enforce Admin Verification Gate**:
  *   Guard `PATCH /api/verification` and `GET /api/verification` to verify that the requesting user's session role is strictly `superadmin`.
- [ ] **Secure Support Ticket Operations**:
  *   Guard `GET /api/support` to restrict tickets to the author or Super Admin users.
- [ ] **Secure Analytics Endpoint**:
  *   Block unauthenticated access to `GET /api/analytics` by enforcing Super Admin checks.
- [ ] **Fix Interview Mapping Bug**:
  *   Modify `POST /api/interviews` to correctly read the recruiter's ID from the session rather than assigning the candidate's ID to `recruiterId`.

### P1: Core Logic Gaps & API Guarding
- [ ] **Add Reusable Session Validator**:
  *   Consolidate candidate session parsing and verification into a centralized helper inside `lib/auth.ts`.
- [ ] **Secure Subscription Creation**:
  *   Assert that the user's session corresponds to the recruiter managing the target `companyId` before modifying billing records.
- [ ] **Verify Cloudinary Direct Upload Payload**:
  *   Add simple file extension checks (e.g. PDF/DOCX) on signature generation request parameters.

### P2: Code Quality, Strict Typing, & Redundancies
- [ ] **Consolidate Candidate Auth**:
  *   Remove duplicated session token signing code from candidate routes.
- [ ] **Eliminate Redundant NextAuth Lookups**:
  *   Standardize user queries strictly to the `User` model, phasing out the legacy fallback lookup to the `Recruiter` schema.
- [ ] **Introduce strict types**:
  *   Replace instances of `any` with Mongoose documents in API handlers.
