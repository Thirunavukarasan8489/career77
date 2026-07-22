# Career77 — Documentation vs Existing Code Gap Analysis

## 1. Executive Summary
This document provides a documentation-to-code gap analysis for the Career77 recruitment platform. The target is to align the existing Next.js App Router implementation with the specifications and design blueprints located under `docs/`. 

Our findings indicate that while core public views, search utilities, and recruiter layout templates are functional, there are **critical security, authorization, and data integrity gaps** at the API layer that deviate from the documented architecture. This report documents these findings and provides a prioritized cleanup plan.

---

## 2. Current Project Status
*   **Public Storefront & Search**: **Working**. Job search queries and location filters align with the design guidelines.
*   **Recruiter Portal UI**: **Working**. Layouts, responsive sidebars, and basic form fields are implemented.
*   **Admin Dashboard UI**: **Working**. Dashboard interface and navigation links are in place.
*   **API Security**: **Critical Issue**. Several key endpoints lack session validation and role-based access checks.
*   **Billing & Subscriptions**: **Partially Working**. Endpoints are stubbed out with mock responders.
*   **Paid Training**: **Missing**. No implementation exists in the current codebase.

---

## 3. Product Gaps

### [P1] Missing Paid Training Workflows
- **Area:** Product Features / Paid Training
- **Status:** Missing
- **Current State:** The codebase does not contain directories or models for candidate paid training content.
- **Expected State:** Candidates can browse available training, enroll, pay, and access materials.
- **Source Documentation:** `docs/01-product/1.1-product-overview.md` & `docs/04-training/`
- **Affected Code:** `app/` folder (missing `/training` routes)
- **Risk:** Complete absence of core Candidate monetization features.
- **Recommended Action:** Scaffold training pages and enrollments once payments are integrated.
- **Dependencies:** Stripe/Razorpay setup.

---

## 4. Public Website Gaps

### [P2] Dynamic JSON-LD JobPosting Fields
- **Area:** Public Pages / SEO
- **Status:** Partially Working
- **Current State:** Job details generate schema tags, but fields like `baseSalary` are hardcoded.
- **Expected State:** Salary ranges and valid ranges must map dynamically from Mongoose documents.
- **Source Documentation:** `docs/08-architecture/8.4-architecture-api.md` & `AGENTS.md` Section 6
- **Affected Code:** `app/openings/[jobId]/page.tsx`
- **Risk:** Search engines may flag incomplete or invalid job schemas.
- **Recommended Action:** Bind salary fields dynamically to the `Job` model properties.
- **Dependencies:** None.

---

## 5. Candidate Gaps

### [P0] Candidate Profile Data Exposure
- **Area:** Candidate Privacy / Data Access
- **Status:** Critical Issue
- **Current State:** Calling `GET /api/candidates` without a candidate cookie or NextAuth session falls back to returning the first 50 candidate profiles, including emails, mobile numbers, and resume links.
- **Expected State:** Candidate profiles must remain protected and only be viewable by authorized recruiters or Super Admins.
- **Source Documentation:** `docs/08-architecture/8.6-architecture-authorization.md` Section 13
- **Affected Code:** `app/api/candidates/route.ts` (Lines 112-113)
- **Risk:** Critical data leakage; scrapers can harvest personal candidate information.
- **Recommended Action:** Throw a `401 Unauthorized` error if no valid session is present.
- **Dependencies:** None.

---

## 6. Paid Training Gaps

### [P1] Enrollment Status & Content Access Gate
- **Area:** Candidate Training Access
- **Status:** Missing
- **Current State:** No training course routes or enrollment validators are implemented in the API.
- **Expected State:** Server-side verification of payment tokens before unlocking training content.
- **Source Documentation:** `docs/08-architecture/8.6-architecture-authorization.md` Section 23
- **Affected Code:** `/app` (Scaffolding is missing)
- **Risk:** Users could gain unauthorized access to paid content.
- **Recommended Action:** Implement training database schemas and enrollment check helpers.
- **Dependencies:** Payment verification systems.

---

## 7. Recruiter Gaps

### [P0] Corrupted Interview Recruiter Mapping
- **Area:** Recruiter Workflows / Database Integrity
- **Status:** Critical Issue
- **Current State:** In `POST /api/interviews`, the candidate's ID (`application.candidateId`) is assigned directly to the `recruiterId` field.
- **Expected State:** The `recruiterId` must map to the ID of the authenticated recruiter scheduling the interview.
- **Source Documentation:** `docs/05-recruiter/5.6-recruiter-interviews.md`
- **Affected Code:** `app/api/interviews/route.ts` (Line 34)
- **Risk:** Recruiters cannot see scheduled interviews on their dashboards; data relationships are corrupted.
- **Recommended Action:** Retrieve the recruiter ID from the active NextAuth session.
- **Dependencies:** None.

### [P1] Lack of Verification Guard on Recruiter Routes
- **Area:** Recruiter Access Control
- **Status:** Critical Issue
- **Current State:** `middleware.ts` only checks if the session role is `recruiter` but does not check if the account is active or verified.
- **Expected State:** Unverified recruiters should be restricted from accessing recruiter dashboard features until approved.
- **Source Documentation:** `docs/05-recruiter/5.1-recruiter-overview.md` Section 3
- **Affected Code:** `middleware.ts` (Line 25)
- **Risk:** Unverified recruiters can immediately manage jobs and view applicant details.
- **Recommended Action:** Add a company verification check to the middleware logic.
- **Dependencies:** Company model.

---

## 8. Super Admin Gaps

### [P0] Unprotected Recruiter Verification Patch Handler
- **Area:** Super Admin / Account Moderation
- **Status:** Critical Issue
- **Current State:** `PATCH /api/verification` updates company verification flags without checking if the user is a Super Admin.
- **Expected State:** Restricted to Super Admin accounts.
- **Source Documentation:** `docs/06-admin/6.6-admin-verification.md`
- **Affected Code:** `app/api/verification/route.ts` (Line 44)
- **Risk:** Recruiters or guests can self-approve company verification statuses.
- **Recommended Action:** Enforce `superadmin` role verification.
- **Dependencies:** NextAuth.

---

## 9. Design System Gaps

### [P2] Color Contrast & Global Layout Alignment
- **Area:** Styling Alignment
- **Status:** Needs Refactoring
- **Current State:** Light theme styles are active, but some dashboard borders use arbitrary gray values instead of Tailwind color tokens.
- **Expected State:** Style implementations must align with the system tokens (`#4F46E5` for Primary, `#10B981` for Conversion).
- **Source Documentation:** `docs/07-design/7.3-design-color-system.md`
- **Affected Code:** `components/RecruiterLayoutClient.tsx` & `app/globals.css`
- **Risk:** Inconsistent UI design.
- **Recommended Action:** Audit borders and cards to ensure consistent Tailwind utility variables.
- **Dependencies:** None.

---

## 10. Frontend Architecture Gaps

### [P2] Inconsistent Client/Server Component Boundaries
- **Area:** Performance / Component Scopes
- **Status:** Needs Refactoring
- **Current State:** Pages like `recruiter/page.tsx` mark the entire component as `"use client"` instead of isolating interactive elements.
- **Expected State:** Leverage React Server Components for data fetching, using client components only for interactive elements.
- **Source Documentation:** `docs/08-architecture/8.1-architecture-frontend.md` & `AGENTS.md` Section 5
- **Affected Code:** `app/recruiter/page.tsx` (Line 1)
- **Risk:** Unnecessary client-side bundle size increase.
- **Recommended Action:** Move data fetching to a Server Component and pass records to clean Client layouts.
- **Dependencies:** None.

---

## 11. Backend Architecture Gaps

### [P1] Centralized Helper for Candidate Session Cookie Parsing
- **Area:** Security Helpers
- **Status:** Needs Refactoring
- **Current State:** Routes parse and verify the custom candidate cookie session token inline.
- **Expected State:** Reusable session extraction helper.
- **Source Documentation:** `docs/08-architecture/8.2-architecture-backend.md`
- **Affected Code:** `app/api/candidates/route.ts` & `app/api/applications/route.ts`
- **Risk:** Code duplication and inconsistent cookie attribute handling.
- **Recommended Action:** Expose a helper like `getCurrentCandidate(req)` in `lib/auth.ts`.
- **Dependencies:** None.

---

## 12. Database Gaps

### [P2] Missing User Role References in Profiles
- **Area:** Schema Relationships
- **Status:** Needs Refactoring
- **Current State:** `Candidate` and `Recruiter` schemas reference `userId` but do not index these references consistently.
- **Expected State:** Indexed user references to speed up lookup operations during auth.
- **Source Documentation:** `docs/08-architecture/8.3-architecture-database.md`
- **Affected Code:** `models/Recruiter.ts` & `models/Candidate.ts`
- **Risk:** Slower login lookup operations.
- **Recommended Action:** Ensure `userId` holds unique indexes across both schemas.
- **Dependencies:** None.

---

## 13. API Gaps

### [P0] Unprotected Support Ticket and Analytics Endpoints
- **Area:** API Security
- **Status:** Critical Issue
- **Current State:** `GET /api/analytics` and `GET/PATCH /api/support` lack session checks.
- **Expected State:** Restricted to Super Admin or owner accounts.
- **Source Documentation:** `docs/08-architecture/8.4-architecture-api.md`
- **Affected Code:** `app/api/analytics/route.ts` & `app/api/support/route.ts`
- **Risk:** Public disclosure of ticket messages and platform usage analytics.
- **Recommended Action:** Add NextAuth verification checks before returning responses.
- **Dependencies:** NextAuth.

---

## 14. Authentication Gaps

### [P2] Duplicated Session Cookie Configuration
- **Area:** Cookie Signatures
- **Status:** Needs Refactoring
- **Current State:** Session generation properties are defined in both the register and login endpoints.
- **Expected State:** Centralized helper function in `lib/auth.ts`.
- **Source Documentation:** `docs/03-auth/3.2-candidate-auth.md`
- **Affected Code:** `app/api/candidates/route.ts` & `app/api/candidates/login/route.ts`
- **Risk:** Drift in cookie options (`httpOnly`, `maxAge`) between registration and login.
- **Recommended Action:** Create a centralized helper to set candidate session cookies.
- **Dependencies:** None.

---

## 15. Authorization Gaps

### [P0] Unprotected Job Creation Endpoint
- **Area:** Role Authorization
- **Status:** Critical Issue
- **Current State:** `POST /api/jobs` checks for a session, but allows any logged-in user (including candidates) to create jobs.
- **Expected State:** Restricted to users with the `recruiter` or `superadmin` role.
- **Source Documentation:** `docs/08-architecture/8.6-architecture-authorization.md` Section 19
- **Affected Code:** `app/api/jobs/route.ts` (Line 77)
- **Risk:** Spammers or candidate accounts can create job postings.
- **Recommended Action:** Enforce role verification on the session user object.
- **Dependencies:** NextAuth.

---

## 16. RBAC Gaps

### [P0] Anonymous Access to Verification and Support Moderation
- **Area:** Role Access Gates
- **Status:** Critical Issue
- **Current State:** Administrative endpoints can be queried by anyone.
- **Expected State:** Enforce `role === "superadmin"` checks for moderation endpoints.
- **Source Documentation:** `docs/08-architecture/8.7-architecture-rbac.md`
- **Affected Code:** `app/api/verification/route.ts` & `app/api/support/route.ts`
- **Risk:** Elevation of privileges; recruiters or guests can modify ticket or company statuses.
- **Recommended Action:** Verify session roles before processing updates.
- **Dependencies:** NextAuth.

---

## 17. File Storage Gaps

### [P2] Insecure File Signature Generation Parameter Validation
- **Area:** Cloudinary direct uploads
- **Status:** Needs Refactoring
- **Current State:** `/api/uploads` returns signed tokens for arbitrary folder values passed by the client.
- **Expected State:** Validate the folder path to ensure it follows the schema design.
- **Source Documentation:** `docs/08-architecture/8.8-architecture-file-storage.md`
- **Affected Code:** `app/api/uploads/route.ts`
- **Risk:** Users could upload files to arbitrary folders on Cloudinary.
- **Recommended Action:** Restrict folder values to allowed values (e.g. `career77/resumes`).
- **Dependencies:** None.

---

## 18. Notification Gaps

### [P1] Mock Email Transports
- **Area:** Platform Alerts
- **Status:** Partially Working
- **Current State:** Matching alerts are stored in the database, but email deliveries are stubbed.
- **Expected State:** SMTP or transactional email transport integration.
- **Source Documentation:** `docs/09-platform/9.1-platform-notifications.md`
- **Affected Code:** `app/api/jobs/route.ts`
- **Risk:** Recruiter approvals or matches do not trigger emails.
- **Recommended Action:** Implement nodemailer or transactional email integrations.
- **Dependencies:** SMTP Credentials.

---

## 19. Messaging Gaps

### [P1] Missing Messaging Routes
- **Area:** Candidate-Recruiter Communication
- **Status:** Missing
- **Current State:** Not defined / Not implemented in the codebase.
- **Expected State:** Messaging portal for candidate-recruiter interactions.
- **Source Documentation:** `docs/09-platform/9.2-platform-messaging.md`
- **Affected Code:** `app/` folder (missing `/messages` or `/chats` routes)
- **Risk:** Communication is restricted to external links (e.g. WhatsApp).
- **Recommended Action:** Keep as "Not Defined" if not explicitly requested, or scaffold messaging interfaces if required.
- **Dependencies:** Real-time listeners or polling.

---

## 20. Payment Gaps

### [P1] Unverified Billing Checkout Sessions
- **Area:** Billing Gates
- **Status:** Partially Working
- **Current State:** Subscriptions are activated immediately on request without gateway webhook checks.
- **Expected State:** Payment verification before activating plans.
- **Source Documentation:** `docs/09-platform/9.3-platform-payments.md`
- **Affected Code:** `app/api/billing/subscribe/route.ts`
- **Risk:** Financial loss; recruiters can access premium features for free.
- **Recommended Action:** Integrate actual billing checkouts or signature checks.
- **Dependencies:** Stripe/Razorpay setup.

---

## 21. Subscription Gaps

### [P0] Insecure Subscription Updates
- **Area:** Subscription Security
- **Status:** Critical Issue
- **Current State:** `POST /api/billing/subscribe` updates subscription plans using client-provided `companyId` parameters without checking company ownership.
- **Expected State:** Verify recruiter company ownership before updating subscriptions.
- **Source Documentation:** `docs/09-platform/9.4-platform-subscriptions.md`
- **Affected Code:** `app/api/billing/subscribe/route.ts`
- **Risk:** Users could modify other companies' subscription levels.
- **Recommended Action:** Validate company ownership in the active session.
- **Dependencies:** NextAuth.

---

## 22. Support Gaps

### [P0] Unprotected Support Ticket API
- **Area:** Support Tickets
- **Status:** Critical Issue
- **Current State:** `GET /api/support` fetches all support tickets without validating user roles.
- **Expected State:** Candidates should only see their own tickets, while Super Admins see all tickets.
- **Source Documentation:** `docs/09-platform/9.5-platform-support.md`
- **Affected Code:** `app/api/support/route.ts` (Line 5)
- **Risk:** Public leakage of support tickets and user email addresses.
- **Recommended Action:** Implement role checks and query filtering based on the session.
- **Dependencies:** NextAuth.

---

## 23. Audit Log Gaps

### [P1] Missing Audit Logging System
- **Area:** Platform Compliance
- **Status:** Missing
- **Current State:** Actions like company approvals or subscription changes do not write to an audit log.
- **Expected State:** Append-only database records for administrative actions.
- **Source Documentation:** `docs/09-platform/9.6-platform-audit-logs.md`
- **Affected Code:** `/api/verification` & `/api/billing` routes
- **Risk:** Missing trail for administrative updates.
- **Recommended Action:** Implement an `AuditLog` model to track sensitive updates.
- **Dependencies:** None.

---

## 24. Security Gaps

### [P0] Exposure of Candidate Details to Anonymous Queries
- **Area:** Security / Candidate Data
- **Status:** Critical Issue
- **Current State:** `GET /api/candidates` lists candidates publicly if no active session is present.
- **Expected State:** Expose profiles only to verified recruiters or admins.
- **Source Documentation:** `docs/08-architecture/8.6-architecture-authorization.md` Section 13
- **Affected Code:** `app/api/candidates/route.ts` (Line 112)
- **Risk:** Data leakage.
- **Recommended Action:** Throw `401 Unauthorized` for anonymous requests.
- **Dependencies:** None.

---

## 25. Performance Gaps

### [P2] Inefficient Regex Search Queries
- **Area:** MongoDB Queries
- **Status:** Needs Refactoring
- **Current State:** `/api/jobs` uses case-insensitive regular expressions (`$regex`) for filtering postings.
- **Expected State:** Utilize MongoDB text indexes.
- **Source Documentation:** `docs/08-architecture/8.3-architecture-database.md` & `AGENTS.md` Section 30
- **Affected Code:** `app/api/jobs/route.ts`
- **Risk:** Database query performance degradation at scale.
- **Recommended Action:** Refactor search queries to use text index search parameters.
- **Dependencies:** Text indexes on Mongoose schemas.

---

## 26. Code Quality Gaps

### [P2] NextAuth Redundant Query Callback Lookup
- **Area:** Code Refactoring
- **Status:** Needs Refactoring
- **Current State:** NextAuth queries both the `User` and `Recruiter` collections to authorize sessions.
- **Expected State:** Maintain credentials and roles strictly inside the `User` schema.
- **Source Documentation:** `docs/08-architecture/8.5-architecture-authentication.md`
- **Affected Code:** `app/api/auth/[...nextauth]/route.ts` (Lines 24-50)
- **Risk:** Unnecessary database queries during login.
- **Recommended Action:** Consolidate credentials check to run only on the `User` schema.
- **Dependencies:** None.

---

## 27. Documentation Gaps

### [P2] Discrepancies between Specifications and API Code
- **Area:** Design Specs
- **Status:** Needs Refactoring
- **Current State:** Code implementation does not match the server-side role validation guidelines in the documentation.
- **Expected State:** Clear specifications mapping roles to each endpoint.
- **Source Documentation:** `docs/08-architecture/8.6-architecture-authorization.md`
- **Affected Code:** APIs under `/app/api/`
- **Risk:** Divergence from security guidelines.
- **Recommended Action:** Align backend endpoints with documented authorization rules.
- **Dependencies:** None.

---

## 28. P0 Critical Issues

1.  **Candidate Profile Leakage**: `GET /api/candidates` leaks details (emails, phone numbers, resume URLs) publicly.
2.  **Unauthorized Job Posting**: `POST /api/jobs` allows candidate accounts to publish jobs.
3.  **Self-Verification Approval**: `PATCH /api/verification` does not verify if the caller is a Super Admin.
4.  **Exposed Analytics & Support**: Administrative metrics and ticket details are accessible without authentication.
5.  **Insecure Billing Subscriptions**: Plans can be updated using arbitrary company parameters without verification.
6.  **Interview Recruiter ID Bug**: Interview sessions map recruiter details to the candidate's ID.

---

## 29. P1 Important Issues

1.  **Lack of Verification Guard in Middleware**: Unverified recruiters can access the portal before approval.
2.  **Insecure Company Profile Updates**: Company details can be updated without verifying company ownership.
3.  **Missing Paid Training**: Course listings and enrollment flows are not implemented.
4.  **Mocked Payments & Subscriptions**: Missing actual payment checkout checks.
5.  **Missing Audit Logging System**: Administrative updates are not logged.

---

## 30. P2 Cleanup Issues

1.  **Duplicated Candidate Session Cookie Logic**: Centralize session cookie generation.
2.  **NextAuth Redundant Queries**: Consolidate credentials checks to the User collection.
3.  **Inconsistent Client/Server Components**: Optimize page boundaries to reduce client bundles.
4.  **Border Contrast & Color Alignment**: Ensure UI colors consistently follow theme guidelines.

---

## 31. P3 Future Improvements

1.  **MongoDB Text Index Search**: Replace regex filtering with native index searches.
2.  **Stripe/Razorpay Integration**: Integrate live payment processors.
3.  **Messaging Implementation**: Add real-time recruiter-candidate messaging.

---

## 32. Recommended Implementation Order

```text
Phase 1: P0 Security & Data Integrity (Immediate Focus)
- Restrict GET /api/candidates (Prevent candidate profile leakage)
- Add role verification to POST /api/jobs (Prevent candidate job creation)
- Secure PATCH /api/verification (Super Admin role checks)
- Secure GET /api/analytics and GET/PATCH /api/support (Access control checks)
- Secure POST /api/billing/subscribe (Verify company access)
- Fix recruiterId assignment in POST /api/interviews
        ↓
Phase 2: Authentication and Authorization Gaps
- Add verification status check to recruiter middleware
- Secure PUT /api/companies (Verify recruiter company ownership)
- Add helper for candidate session cookie parsing
        ↓
Phase 3: Database and API Architecture Gaps
- Consolidate credentials check in NextAuth
- Create AuditLog schema and model
- Clean up duplicate session cookie generation code
        ↓
Phase 4: Core Candidate Experience Gaps
- Dynamic JSON-LD mapping for JobPosting
- Border and color system contrast alignment
        ↓
Phase 5: Performance Gaps
- Optimize component boundaries (Server vs Client)
- Replace regex queries with MongoDB text searches
```

---

## 33. Risks and Dependencies
*   **Dependency on NextAuth JWT Session**: Securing API endpoints relies on NextAuth session helpers. Issues with session retrieval on Serverless functions could block valid requests.
*   **Edge Middleware Database Access**: Verifying recruiter approval status in `middleware.ts` requires database access, which can increase latency. We must retrieve details efficiently without affecting response times.

---

## 34. Final Summary
The audit confirms that Career77 has a solid UI foundation. However, securing endpoints and fixing logic bugs (such as candidate data exposure and the recruiter interview ID mapping issue) is required to align the implementation with the product specifications.
