# Audit — API Inventory

## API Architecture

All backend logic is implemented as **Next.js Route Handlers** (`route.ts`) directly inside `app/api/`. There is no separate Express server, no `controllers/` directory, no `services/` layer. Business logic sits directly inside each `route.ts` file.

**No service layer abstraction exists.** Database calls and business logic are co-located with HTTP handlers.

---

## Complete API Inventory

| Method | Endpoint | Purpose | Auth | Role | Ownership | Status |
|---|---|---|---|---|---|---|
| `GET` | `/api/jobs` | List/search open jobs | No | Public | N/A | ✅ Implemented |
| `POST` | `/api/jobs` | Create job | Yes | Recruiter/Admin | recruiterId stored | ✅ Implemented |
| `GET` | `/api/jobs/[jobId]` | Get single job | No | Public | N/A | ✅ Implemented |
| `PUT` | `/api/jobs/[jobId]` | Update job | Yes | Recruiter/Admin | recruiterId check | ✅ Implemented |
| `DELETE` | `/api/jobs/[jobId]` | Delete job | Yes | Recruiter/Admin | recruiterId check | ✅ Implemented |
| `POST` | `/api/applications` | Submit application | No* | Public (anon OK) | candidateId created on fly | ⚠️ Partial |
| `GET` | `/api/applications` | List applications | Yes | Candidate/Recruiter | ownership enforced | ✅ Implemented |
| `GET` | `/api/applications/[jobId]` | Applications for job | Yes | Recruiter | recruiterId scope | ✅ Implemented |
| `POST` | `/api/candidates` | Register candidate | No | Public | — | ✅ Implemented |
| `GET` | `/api/candidates` | Get own profile or list | Yes (cookie/session) | Candidate/Recruiter/Admin | candidateId/role | ✅ Implemented |
| `PUT` | `/api/candidates` | Update own profile | Yes (cookie) | Candidate | candidateId | ✅ Implemented |
| `POST` | `/api/candidates/otp` | Request OTP login | No | Public | — | ✅ Implemented |
| `POST` | `/api/candidates/login` | OTP verify + session | No | Public | — | ✅ Implemented |
| `POST` | `/api/candidates/logout` | Clear candidate session | Yes (cookie) | Candidate | — | ✅ Implemented |
| `GET/POST` | `/api/candidates/saved-jobs` | Save/unsave jobs | Yes (cookie) | Candidate | candidateId | ✅ Implemented |
| `GET` | `/api/interviews` | List interviews | Yes | Candidate/Recruiter/Admin | scoped by role | ✅ Implemented |
| `POST` | `/api/interviews` | Schedule interview | Yes | Recruiter/Admin | recruiterId verified | ✅ Implemented |
| `GET` | `/api/analytics` | Platform analytics | Yes | SuperAdmin only | superadmin role | ✅ Implemented (has hardcoded `monthlyRevenue: 49999`) |
| `GET` | `/api/companies` | List companies | No | Public | N/A | ✅ Implemented |
| `POST` | `/api/companies` | Create company | Yes | Recruiter/Admin | — | ✅ Implemented |
| `GET` | `/api/companies/[slug]` | Single company | No | Public | N/A | ✅ Implemented |
| `GET` | `/api/verification` | List verification requests | Yes | SuperAdmin | superadmin role | ✅ Implemented |
| `POST` | `/api/verification` | Submit verification | Yes | Auth user | company finding is buggy* | ⚠️ Partial |
| `PATCH` | `/api/verification` | Approve/reject | Yes | SuperAdmin | superadmin role | ✅ Implemented |
| `GET` | `/api/support` | List tickets | Yes | SuperAdmin | superadmin role | ✅ Implemented |
| `POST` | `/api/support` | Create ticket | Yes | Candidate/Recruiter | userId lookup | ⚠️ Partial |
| `PATCH` | `/api/support` | Update ticket status | Yes | SuperAdmin | superadmin role | ✅ Implemented |
| `GET` | `/api/cms` | Get CMS content | No | Public | N/A | ✅ Implemented |
| `PUT` | `/api/cms` | Update CMS content | No* | — | **NO AUTH CHECK** | 🔴 Security Issue |
| `GET` | `/api/notifications` | Candidate notifications | Yes (cookie) | Candidate | candidateId | ✅ Implemented |
| `PATCH` | `/api/notifications` | Mark all read | Yes (cookie) | Candidate | candidateId | ✅ Implemented |
| `GET` | `/api/pipeline` | Pipeline stages | No* | — | **NO AUTH** | ⚠️ Partial |
| `POST` | `/api/pipeline` | Create stage | No* | — | **NO AUTH** | ⚠️ Partial |
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth login/session | — | Recruiter/Admin | credentials | ✅ Implemented |
| `POST` | `/api/recruiter/register` | Register recruiter | No | Public | — | ✅ Implemented |
| `GET/PUT` | `/api/recruiter/settings` | Recruiter settings | Yes | Recruiter | — | ✅ Implemented |
| `POST` | `/api/uploads` | Upload to Cloudinary | Yes (cookie) | Candidate | candidateId | ✅ Implemented |
| `GET` | `/api/uploads/view` | View upload | — | — | — | Needs review |
| `POST` | `/api/billing/subscribe` | Create subscription | Yes | Recruiter | — | ✅ Implemented |
| `POST` | `/api/billing/webhook` | Billing webhook | — | — | **STUB ONLY** | 🔴 Not Implemented |
| `POST` | `/api/resume/generate` | AI resume generation | — | — | — | Needs review |
| `app/api/training/` | — | Training API | — | — | **EMPTY DIR** | 🔴 Missing |

---

## Critical API Issues

### 🔴 CMS API — No Authorization on Write
`PUT /api/cms` has **no authentication or authorization check**. Any unauthenticated user can update CMS content.

### 🔴 Pipeline API — No Authorization
`GET/POST /api/pipeline` has **no authentication or authorization**. Pipeline stages can be read and created by anyone.

### 🔴 Billing Webhook — Stub Only
`POST /api/billing/webhook` only logs the event and returns `{ received: true }`. No actual payment verification, no Subscription activation, no idempotency check.

### ⚠️ Analytics — Hardcoded Revenue
`GET /api/analytics` returns `monthlyRevenue: 49999` as a hardcoded number. This is mock/placeholder data in a production API.

### ⚠️ Verification POST — Incorrect Company Lookup
`POST /api/verification` does `Company.findOne({})` with no filter — finds the **first company in the database** regardless of the authenticated recruiter's company association. This is incorrect.

### ⚠️ Support POST — Candidate userId Gap
`POST /api/support` for candidate tickets requires `candDoc.userId` to be set on the Candidate document. But candidate registration (`POST /api/candidates`) does not always set `userId`. This creates a code path that returns 404 when a candidate without a linked `User` document tries to raise a support ticket.

### ⚠️ Application POST — Anonymous Application
`POST /api/applications` does not require authentication. It finds or creates a Candidate by mobile number. This means anyone can submit an application without being logged in. This is by design (Quick Apply) but should be clearly documented and understood as a security trade-off.

---

## API Service Layer Assessment

**No service layer exists.** All business logic is inline within route handlers. This is acceptable for the current scale but makes the codebase harder to test and maintain as it grows.

**Recommendation:** Extract business logic into a `lib/services/` or `services/` directory in a future refactor phase.
