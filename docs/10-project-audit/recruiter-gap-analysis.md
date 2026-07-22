# Recruiter Portal Gap Analysis

This document evaluates the existing Recruiter Portal implementation against the product specification (`docs/05-recruiter/`), user roles blueprint, and authorization architecture (`docs/08-architecture/8.6-architecture-authorization.md`).

---

## 1. Key Onboarding & Gatekeeping Gaps

### Onboarding & Verification Enforcement
*   **Specification (`docs/05-recruiter/5.1-recruiter-overview.md` Section 3)**: Recruiter Portal access requires: `Authenticated + Role = Recruiter + Account Status = Active + Verification Status = Approved`. Only approved Recruiters can access protected Recruiter Portal features.
*   **Codebase Implementation**: The Edge middleware (`middleware.ts`) and pages only check if a user is logged in with `role === "recruiter"`. It does not check:
    1. Whether the recruiter account status is Active.
    2. Whether the associated Company profile is verified.
*   **Gap Classification**: **Critical Access Security Gap**

### Verification Document Flow
*   **Specification**: Recruiters submit verification documents (such as GSTIN or business registration) to wait for Super Admin approval before unlocking portal features.
*   **Codebase Implementation**: The `/api/verification` endpoint allows document submission, but it defaults to finding or creating a stub company (`Company.findOne({})`) instead of mapping the document to the recruiter's actual authorized company.
*   **Gap Classification**: **Core Flow/Data Integrity Gap**

---

## 2. API & Authorization Gaps

### Company Context & Access
*   **Specification**: A recruiter must only access and modify companies they are authorized to manage (`docs/08-architecture/8.6-architecture-authorization.md` Section 14).
*   **Codebase Implementation**: `PUT /api/companies` finds or creates a company matching a generated slug. It does not check if the logged-in recruiter has ownership rights over that company, allowing cross-recruiter updates if slug naming collides.
*   **Gap Classification**: **Critical Authorization Gap**

### Job Creation Role Verification
*   **Specification**: Posting jobs is restricted to verified recruiter accounts.
*   **Codebase Implementation**: `POST /api/jobs` checks if a NextAuth session is present, but it does not check if the user has a `recruiter` role. Candidates with a session can post jobs, bypassing controls.
*   **Gap Classification**: **Critical Authorization Gap**

### Interview Owner Mapping Bug
*   **Specification**: Scheduled interviews must map the candidate to `candidateId` and the recruiter to `recruiterId`.
*   **Codebase Implementation**: `POST /api/interviews` maps the applicant's `candidateId` directly to the `recruiterId` database field. This locks the recruiter out of viewing scheduled meetings on their panel.
*   **Gap Classification**: **Business Logic Bug**

---

## 3. UI/UX & Layout Discrepancies

### Missing Pipeline Stage Protection
*   **Specification**: Drag-and-drop pipeline updates or stage configurations must be authorized server-side per job owner.
*   **Codebase Implementation**: `/api/pipeline` endpoints do not evaluate auth headers or check session properties, exposing recruiter pipeline configurations.
*   **Gap Classification**: **Needs Refactoring**

### Mock Settings Updates
*   **Specification**: Sensitive account modifications (password updates, email changes) must route through security verification handlers.
*   **Codebase Implementation**: `/recruiter/settings` contains client inputs without backend endpoints, preventing recruiters from saving settings changes.
*   **Gap Classification**: **Missing Feature**

---

## 4. Priority Cleanup Actions (Recruiter Domain)

1.  **Enforce Verification Guard in Middleware**:
    *   Update `middleware.ts` to check the recruiter's verification status (e.g., matching company status) before granting access to `/recruiter/*` (excluding login/register).
2.  **Bind Company Creation to Recruiter Profile**:
    *   Ensure recruiter registration links user entries to company records in a strict 1-to-1 or N-to-1 relationship.
3.  **Fix Interview Recruiter Context**:
    *   Assign `session.user.id` as the `recruiterId` inside `POST /api/interviews`.
