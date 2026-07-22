# Updated Cleanup Roadmap

**Version:** Post Phase 7 Audit
**Date:** 2026-07-23
**Basis:** Comprehensive codebase audit against AGENTS.md and /docs

---

## Priority Matrix

| Priority | Category | Description |
|---|---|---|
| P0 | **Critical Security** | Authorization holes — immediate fix required |
| P1 | **Broken Core Functionality** | Bugs that break critical product flows |
| P2 | **Incorrect Product Behavior** | Violations of documented product requirements |
| P3 | **Missing Required Features** | Features documented but not implemented |
| P4 | **Duplicate / Dead Code** | Unused routes, duplicate pages |
| P5 | **Folder Structure Cleanup** | Route organization, naming |
| P6 | **API Service Cleanup** | Service layer, API organization |
| P7 | **UI/UX Improvements** | Design system alignment, accessibility |
| P8 | **Performance Optimization** | Caching, pagination, queries |
| P9 | **Nice-to-Have** | Low-impact improvements |

---

## P0 — Critical Security

### P0-01: Fix CMS API Authorization
**File:** `app/api/cms/route.ts`
**Issue:** `PUT /api/cms` has no authentication check. Any unauthenticated user can modify CMS content.
**Fix:** Add superadmin role check before processing PUT request.

### P0-02: Fix Pipeline API Authorization
**File:** `app/api/pipeline/route.ts`
**Issue:** `GET` and `POST` `/api/pipeline` have no authentication. Anyone can read and create pipeline stages.
**Fix:** Add recruiter/superadmin role check.

---

## P1 — Broken Core Functionality

### P1-01: Fix Verification Company Lookup Bug
**File:** `app/api/verification/route.ts`
**Issue:** `POST /api/verification` uses `Company.findOne({})` — finds the first company in the database, not the requesting recruiter's company.
**Fix:** Look up the Company using the authenticated recruiter's `companyId`.

### P1-02: Implement Billing Webhook
**File:** `app/api/billing/webhook/route.ts`
**Issue:** Billing webhook is a logging stub. No payment verification, no subscription activation.
**Fix:** Integrate payment gateway signature verification. Activate subscription on successful payment.

### P1-03: Fix Recruiter Dashboard API Call
**File:** `app/recruiter/page.tsx`
**Issue:** Recruiter dashboard calls `/api/analytics` which is a superadmin-only endpoint. Returns 403 error for recruiter sessions.
**Fix:** Create a recruiter-scoped analytics endpoint or filter analytics data by recruiterId.

### P1-04: Fix Support Ticket for Quick Apply Candidates
**File:** `app/api/support/route.ts`
**Issue:** `POST /api/support` requires `candDoc.userId` which is missing for Quick Apply candidates (who never have a User record).
**Fix:** Allow candidate session ID as `raisedBy` identifier, or create User record during Quick Apply.

### P1-05: Remove Hardcoded Revenue from Analytics
**File:** `app/api/analytics/route.ts`
**Issue:** `monthlyRevenue: 49999` is hardcoded fake data returned to the admin dashboard.
**Fix:** Remove or replace with a real calculation from Invoice/Subscription data, or explicitly mark as placeholder.

---

## P2 — Incorrect Product Behavior

### P2-01: Fix Admin Console Theme (Light Theme Only)
**File:** `components/AdminLayoutClient.tsx`
**Issue:** Admin console uses `bg-slate-950` dark theme — contradicts the approved Light Theme Only requirement.
**Fix:** Redesign admin layout to use light surfaces (`bg-white`, `bg-slate-50`, `border-slate-200`).

### P2-02: Fix LayoutWrapper Routing Gap
**File:** `components/LayoutWrapper.tsx`
**Issue:** Public Navbar and Footer are not suppressed for `/candidate/*` and `/admin/*` paths.
**Fix:** Add `pathname.startsWith("/candidate")` and `pathname.startsWith("/admin")` to the suppression condition.

### P2-03: Remove Mock Data from OpeningsClient
**File:** `components/OpeningsClient.tsx`
**Issue:** Hardcoded fallback job entries display when the database returns zero results. Not production-appropriate.
**Fix:** Show a proper empty state instead of hardcoded mock data.

---

## P3 — Missing Required Features

### P3-01: Paid Training System
**Scope:** New feature — Candidate training enrollment, payment, access control
**Files:** `app/api/training/route.ts` (empty), new pages under `(candidate)/candidate/training/`
**Prerequisite:** P1-02 (billing webhook)

### P3-02: Real Payment/Billing Gateway Integration
**Scope:** Replace stub webhook with real payment gateway (Razorpay or Stripe)
**Files:** `app/api/billing/`
**Prerequisite:** P1-02

### P3-03: Recruiter Subscription Enforcement
**Scope:** Gate recruiter features by active subscription plan
**Files:** `app/api/jobs/`, subscription check middleware
**Prerequisite:** P3-02

### P3-04: Email Transactional Notifications
**Scope:** Send emails on recruiter approval, application received, interview scheduled
**Files:** New `lib/email.ts` + integration in relevant API routes

### P3-05: Audit Log Usage
**Scope:** Write to AuditLog on admin actions, recruiter verification, payments
**Files:** `models/AuditLog.ts` (model exists), API routes to be updated

### P3-06: Admin User Suspension/Deactivation
**Scope:** Admin ability to deactivate candidate or recruiter accounts
**Files:** `app/api/candidates/`, `app/api/recruiter/`, `models/User.ts` (add status field)

### P3-07: Candidate → Recruiter Messaging
**Scope:** Authorized in-platform messaging system
**Files:** New feature area — models, API, pages

### P3-08: Invoice Model Usage
**Scope:** Create invoices on subscription and training payments
**Files:** `models/Invoice.ts` (model exists), billing API routes

---

## P4 — Duplicate / Dead Code

### P4-01: Remove `/dashboard/settings` Duplicate
**File:** `app/(candidate)/dashboard/settings/page.tsx`
**Issue:** Duplicate of `/candidate/settings`. The dashboard redirects to `/candidate/profile`. This settings page is unreachable in normal navigation.
**Fix:** Delete the page and redirect if directly accessed.

### P4-02: Consolidate `/jobs` and `/openings` Routes
**Files:** `app/jobs/`, `app/openings/`
**Issue:** Both routes serve public job search. Unclear which is canonical.
**Decision Required:** Confirm which route is the canonical public job search URL. Redirect the other.

---

## P5 — Folder Structure Cleanup

### P5-01: Organize Components Directory
**File:** `components/`
**Issue:** All 15 components are in a flat directory. As the project grows, this will become difficult to navigate.
**Fix:** Introduce subdirectories: `components/layout/`, `components/shared/`, `components/feedback/`, `components/feature/`

### P5-02: Remove Empty Training API Directory
**File:** `app/api/training/`
**Issue:** Empty directory with no `route.ts`. Misleads code readers.
**Action:** Leave in place until P3-01 is implemented. Then add the training route.

---

## P6 — API Service Cleanup

### P6-01: Extract Business Logic into Service Layer
**Scope:** Create `lib/services/` directory
**Services to extract:**
- `lib/services/jobs.ts` — job CRUD and validation
- `lib/services/applications.ts` — application business logic
- `lib/services/candidates.ts` — candidate profile management
- `lib/services/matching.ts` — already exists as `lib/matching.ts`

### P6-02: Create Recruiter-Scoped Analytics Endpoint
**File:** New `app/api/recruiter/analytics/route.ts`
**Scope:** Return recruiter-scoped stats (their job views, applications, etc.)

---

## P7 — UI/UX Improvements

### P7-01: Fix Primary Brand Color Inconsistencies
**Files:** `components/Navbar.tsx` (blue-600 → indigo-600), `components/AdminLayoutClient.tsx` (purple-600 → indigo-600)

### P7-02: Replace `window.confirm()` with Confirmation Modal
**File:** `components/DeleteJobButton.tsx`
**Fix:** Build a shared `ConfirmDialog` component

### P7-03: Add Toast Variants
**File:** `components/Toast.tsx`
**Fix:** Add `success`, `error`, `warning` variant styling

### P7-04: Add Toast Accessibility
**File:** `components/Toast.tsx`
**Fix:** Add `role="status"` or `aria-live="polite"` to toast container

### P7-05: Mobile Sidebar Accessibility
**Files:** Layout clients
**Fix:** Add `role="dialog"`, `aria-modal`, focus trap to mobile sidebars

### P7-06: Admin Table Pagination
**Files:** `app/admin/users/page.tsx`, `app/admin/companies/page.tsx`, etc.
**Fix:** Implement pagination controls on admin data tables

---

## P8 — Performance Optimization

### P8-01: Candidates Admin Query Limit
**File:** `app/api/candidates/route.ts`
**Issue:** Returns all candidates with `.limit(50)` — needs cursor-based pagination

### P8-02: NextAuth JWT Callback DB Query on Every Request
**File:** `app/api/auth/[...nextauth]/route.ts`
**Issue:** `jwt` callback runs `Recruiter.findOne()` on every token refresh — consider caching with token TTL

---

## P9 — Nice-to-Have

### P9-01: Formalize Design Tokens in Tailwind Config
Create `tailwind.config.ts` with named color extensions for primary, conversion, neutral

### P9-02: Shared UI Primitive Library
Create `components/ui/Button.tsx`, `components/ui/Input.tsx`, `components/ui/Badge.tsx`

### P9-03: Atlas Search Migration
When search relevance is insufficient, migrate from MongoDB text index to Atlas Search

---

## Execution Order

```
P0 → P1 → P2 → P3 → P4 → P5 → P6 → P7 → P8 → P9
```

Do not proceed to P3 (missing features) before P0 and P1 (security and bugs) are resolved.

Do not implement new UI features while the Admin dark theme violation persists (P2).
