# Project Audit Report: Career77 recruitment ecosystem

This report evaluates the current codebase state of the Career77 application. It covers architecture, routes, database models, security, and quality findings, categorizing items by operational status and presenting a prioritized roadmap (P0 to P3).

---

## 1. Current Project Structure
The project is built on the Next.js App Router paradigm. Below is the file-system layout:
```text
/
├── app/                              # Next.js App Router (Layouts, Pages, APIs)
│   ├── (candidate)/                  # Candidate authenticated scope
│   ├── admin/                        # Super Admin dashboard pages
│   ├── api/                          # Next.js backend API routes
│   │   ├── analytics/                # Platform metrics API
│   │   ├── applications/             # Job applications endpoints
│   │   ├── auth/                     # NextAuth configurations
│   │   ├── billing/                  # Payment subscriptions & webhooks API
│   │   ├── candidates/               # Candidate profiles & auth login API
│   │   ├── cms/                      # Marketing content API
│   │   ├── companies/                # Employer company details API
│   │   ├── interviews/               # Interview sessions management API
│   │   ├── jobs/                     # Job listings API
│   │   ├── notifications/            # In-app alert system API
│   │   ├── pipeline/                 # Recruiter applicant stages API
│   │   ├── recruiter/                # Recruiter register API
│   │   ├── resume/                   # Resume generation/parsing placeholders
│   │   ├── support/                  # Admin support ticket API
│   │   └── uploads/                  # Cloudinary direct upload signatures API
│   ├── companies/                    # Public company pages
│   ├── jobs/                         # Public job postings (Clean URLs)
│   ├── login/                        # Candidate credentials-less login (OTP)
│   ├── openings/                     # Job board search and listings
│   ├── recruiter/                    # Recruiter dashboard pages
│   └── register/                     # Candidate registration flow
├── components/                       # Reusable React components & layout wrappers
├── context/                          # Frontend candidate state context
├── docs/                             # Architecture and domain documentation
├── lib/                              # Database connectors, matchers, and auth utilities
├── models/                           # MongoDB/Mongoose models
├── scripts/                          # Database seed script
├── middleware.ts                     # Edge-level route protection middleware
└── tsconfig.json                     # TypeScript settings
```

---

## 2. Current Technology Stack
*   **Framework**: Next.js 16.2.10 (App Router), React 19.2.4
*   **Database**: MongoDB via Mongoose 9.7.4
*   **Styling**: Tailwind CSS v4.0.0 (using `@tailwindcss/postcss`)
*   **Auth**: NextAuth.js 4.24.14 (Recruiters, Admins) + Custom cryptography cookie sessions (Candidates)
*   **File Storage**: Cloudinary (integrated with signature generation)
*   **Language**: TypeScript 5.x

---

## 3. Current Architecture
The codebase uses a standard decoupled model-view-controller paradigm within Next.js:
1.  **Frontend State & Layouts**: NextAuth provides recruiter and admin session state. Custom session context (`AppContext.tsx`) handles candidate verification state. Responsive dashboard layouts are dynamic client components.
2.  **API Layer**: Folder-based server routes handle client requests.
3.  **Database Layer**: Cached Mongoose connections (`lib/db.ts`) share instances across Serverless function invocations to prevent exhaustion.

---

## 4. Existing Features
1.  **Job Search & Filter**: Filtering jobs by keyword, location, and experience.
2.  **Candidate Registration & OTP Login**: Session creation using secure cookies; mock OTP dispatch.
3.  **Recruiter Registration & Login**: NextAuth credentials login backed by hashed passwords (bcryptjs).
4.  **Application Tracking**: Candidates can see their submissions; Recruiters can review applicants.
5.  **Direct Direct File Uploads**: Signature generation for Cloudinary.
6.  **Pipeline Management**: Basic stages for application pipelines.
7.  **Support Tickets**: Raising support tickets.
8.  **Verification Requests**: Verification requests submittable by recruiters.

---

## 5. Existing Routes (Views)
| Route | Access | Rendering | Status |
| :--- | :--- | :--- | :--- |
| `/` | Public | SSG (Server Static) | **Working** |
| `/openings` | Public | ISR | **Working** |
| `/jobs/[jobId]` | Public | ISR | **Working** |
| `/register` | Public | Dynamic | **Working** |
| `/login` | Public | Dynamic | **Working** |
| `/candidate/profile` | Candidate | Client-Heavy | **Working** |
| `/candidate/applications`| Candidate | Client-Heavy | **Working** |
| `/candidate/interviews` | Candidate | Client-Heavy | **Working** |
| `/candidate/resume` | Candidate | Client-Heavy | **Working** |
| `/recruiter` | Recruiter | Client-Heavy | **Working** |
| `/recruiter/login` | Public | Dynamic | **Working** |
| `/recruiter/register` | Public | Dynamic | **Working** |
| `/recruiter/post-job` | Recruiter | Client-Heavy | **Working** |
| `/admin` | Admin | Client-Heavy | **Working** |

---

## 6. Existing API Routes
| Endpoint | Method | Purpose | Status | Finding Classification |
| :--- | :--- | :--- | :--- | :--- |
| `/api/candidates/login` | POST | Request/Verify Candidate OTP | **Working** | **Needs Verification** (Mock OTP logic) |
| `/api/candidates` | GET | Fetch self or all candidate profiles | **Partially Working** | **Critical Issue** (Fetches all candidates if session missing) |
| `/api/candidates` | POST | Candidate profile registration | **Working** | **Working** |
| `/api/candidates` | PUT | Edit Candidate Profile details | **Working** | **Working** |
| `/api/jobs` | GET | List open positions with search & cursor | **Working** | **Working** |
| `/api/jobs` | POST | Create a new job posting | **Working** | **Critical Issue** (Unchecked roles) |
| `/api/applications` | GET | Retrieve candidate or recruiter apps | **Working** | **Working** |
| `/api/applications` | POST | Submit job application (Quick Apply) | **Working** | **Working** |
| `/api/applications/[jobId]`| GET/PATCH| Fetch/update applicants for job | **Working** | **Working** |
| `/api/interviews` | GET/POST| Fetch/schedule interview sessions | **Partially Working** | **Critical Issue** (No auth check, bad recruiterId mapping) |
| `/api/pipeline` | GET/POST| Stages configuration for pipelines | **Partially Working** | **Needs Refactoring** (No auth/validation check) |
| `/api/verification` | GET/POST/PATCH| Verification requests | **Partially Working** | **Critical Issue** (No auth checks on PATCH/GET) |
| `/api/billing/subscribe` | POST | Activate company subscription | **Mocked** | **Critical Issue** (No authorization/payment checks) |
| `/api/billing/webhook` | POST | Event receiver from gateway | **Mocked** | **Partially Working** (Logs event without actions) |
| `/api/support` | GET/POST/PATCH| Manage support tickets | **Partially Working** | **Needs Refactoring** (No auth/validation check) |
| `/api/uploads` | POST | Generate Cloudinary Direct upload signature| **Working** | **Needs Refactoring** (Unauthenticated signature) |
| `/api/analytics` | GET | Fetch dashboard statistics | **Working** | **Critical Issue** (No authentication/role check) |

---

## 7. Existing Database Models
All schemas are located in `/models/` as Mongoose schemas:
1.  **User**: Email, hashed password, role (`candidate` | `recruiter` | `superadmin`), OTP details. (**Working**)
2.  **Company**: Company details, verified flag. (**Working**)
3.  **Recruiter**: Link to User, Company details. (**Working**)
4.  **Candidate**: User association, experience, skills, Cloudinary resume links. (**Working**)
5.  **Job**: Recruiter reference, experience requirements, text indexes. (**Working**)
6.  **Application**: Candidate & Job association, recruitment pipeline status. (**Working**)
7.  **Notification**: Recruiter matching triggers for candidates. (**Working**)
8.  **Interview**: Session schedule, video links. (**Working**)
9.  **VerificationRequest**: Recruiter verification documents. (**Working**)
10. **PipelineStage**: Configurable hiring boards. (**Working**)
11. **Subscription**: Billing state tracking. (**Working**)
12. **Invoice**: Recruiter plan billing billing history. (**Working**)
13. **SupportTicket**: Customer service messages. (**Working**)
14. **CmsContent**: Landing page configurable hero blocks. (**Working**)

---

## 8. Authentication Status
*   **Recruiters / Super Admins**: Uses NextAuth with Credentials provider checking the `User` and legacy `Recruiter` schemas. (**Working**)
*   **Candidates**: Uses a custom Node `crypto` HMAC-SHA256 signed session cookie (`candidate_session`) to bypass NextAuth for simplified candidate access. (**Working**)
*   **Issues**:
    *   No centralized validation helper for candidate sessions on API routes (repetitive parsing from cookies in each route handler). (**Needs Refactoring**)

---

## 9. Authorization/RBAC Status
*   **Middleware**: Guarding paths is implemented at the Edge level (`middleware.ts`) which validates whether the user possesses a `candidate_session` cookie or NextAuth session with `superadmin`/`recruiter` roles. (**Working**)
*   **API Level Route Guards**: This is the major vulnerability area. Multiple endpoints fetch or mutate data without evaluating roles or validating the session.
    *   `GET /api/candidates` dumps all candidate profiles, including emails/resumes, if no session cookie exists. (**Critical Issue**)
    *   `POST /api/jobs` allows candidates or superadmins to post jobs as long as they are authenticated, without verifying the `recruiter` role. (**Critical Issue**)
    *   `POST /api/interviews` maps candidate ID to `recruiterId` field and runs without verification. (**Critical Issue**)
    *   `PATCH /api/verification` allows anyone to approve verification requests. (**Critical Issue**)
    *   `POST /api/billing/subscribe` updates subscriptions without checking if user belongs to the target company. (**Critical Issue**)

---

## 10. File Storage Status
*   Direct direct client uploads use server signatures (`generateUploadSignature`) for Cloudinary. (**Working**)
*   **Issues**: No size restrictions or extension checks are enforced inside `/api/uploads`. (**Needs Refactoring**)

---

## 11. Payment Status
*   **Subscriptions**: Subscriptions are handled by mock endpoints (`/api/billing/subscribe`) that immediately set the subscription status to "active" without validating payment gateway responses. (**Partially Working / Mocked**)
*   **Webhooks**: `/api/billing/webhook` only outputs to logs and returns `received: true`. (**Partially Working / Mocked**)

---

## 12. Notification Status
*   **In-app Alert notifications**: Server-side matches create `Notification` documents when jobs are created. (**Working**)
*   **WhatsApp / Emails**: Standard deep links are active, but transactional emails are mocked. (**Partially Working**)

---

## 13. Candidate Feature Status
*   OTP Login / Sign-up: (**Working**)
*   Interactive Profile Update: (**Working**)
*   Upload Resumes: (**Working**)
*   Browse Jobs / Apply: (**Working**)
*   My Applications Tracking: (**Working**)
*   Scheduled Interviews Tracker: (**Working**)

---

## 14. Recruiter Feature Status
*   Credentials Register / Login: (**Working**)
*   Create Company Profiles: (**Partially Working**) - Lacks owner-relationships checks.
*   Post Job Openings: (**Working**)
*   Filter Candidates & Auto-Match: (**Working**)
*   Hiring Pipeline Stages: (**Working**)
*   Schedule Interviews: (**Partially Working**) - Contains logical bug where candidate ID is assigned to recruiter field.

---

## 15. Super Admin Feature Status
*   Platform Statistics Dashboard: (**Working**)
*   Verification Request Queue: (**Working**)
*   Cms Landing Page Content Editor: (**Working**)
*   Support Inquiries View: (**Working**)

---

## 16. Code Quality Issues
*   **Untyped / Any Types**: Multiple client pages and API handlers fallback to `any` for database documents and requests. (**Needs Refactoring**)
*   **Error Handling**: Failures inside API handlers return generic "Internal server error" messages without descriptive context. (**Needs Refactoring**)

---

## 17. Security Issues
*   **Unprotected API endpoints**: Lack of session validation allows unauthorized entities to fetch or modify statistics, tickets, verifications, and user credentials. (**Critical Issue**)
*   **Data Leakage**: `/api/candidates` exposes phone numbers and resumes when accessed anonymously. (**Critical Issue**)

---

## 18. Performance Issues
*   **Regex Queries**: Search functionality in `/api/jobs` uses case-insensitive MongoDB regex queries (`$regex`) which can cause performance degradation at scale without proper text search setups. (**Needs Refactoring**)

---

## 19. Duplicate/Dead Code
*   **Candidate Login/Register**: Session token generation is duplicated between `candidates/route.ts` and `candidates/login/route.ts`. (**Needs Refactoring**)
*   **Recruiter collection fallback check**: NextAuth credentials check queries both `User` and legacy `Recruiter` schemas, creating redundant logic. (**Needs Refactoring**)

---

## 20. Documentation Coverage
*   `docs/` has comprehensive MD guides describing product requirements, frontend patterns, database standards, and RBAC rules.
*   **Gaps**: The actual codebase has discrepancies with the documented authorization checks, lacking the actual server-side role validation mentioned in `docs/08-architecture/8.6-architecture-authorization.md`. (**Needs Refactoring**)

---

## 21. Missing Features
*   **Production Payment Verification**: Missing actual merchant gateway integrations (Stripe, Razorpay, etc.).
*   **Email Transports**: Standard nodemailer or mailer configuration.

---

## 22. Recommended Cleanup Plan
1.  **Refactor Authentication Helpers**: Move candidate token checking and session extraction to a reusable utility function under `lib/auth.ts`.
2.  **Centralize API Route Guards**: Create wrappers or inline helpers that assert `session` validity and check roles (`candidate` | `recruiter` | `superadmin`) before executing operations.
3.  **Fix Interview Model Assignment**: Adjust the `POST` route in `api/interviews` to correctly identify and assign `recruiterId` from the active NextAuth session rather than the applicant.

---

## 23. Recommended Implementation Plan (Roadmap)

### P0: Critical / Security / Data Integrity (Immediate Focus)
*   **Candidate Data Protection**: Secure `GET /api/candidates` so it rejects anonymous requests or limits search fields for public access.
*   **API Authorization Guards**: Implement role-based validation checks on:
    *   `POST /api/jobs` (Restrict to recruiters/superadmins)
    *   `GET/POST/PATCH /api/verification` (Restrict to superadmins)
    *   `GET/PATCH /api/support` (Restrict to appropriate roles)
    *   `GET /api/analytics` (Restrict to superadmins)
    *   `POST /api/billing/subscribe` (Verify user belongs to target company)
*   **Fix Interview Recruiter ID**: Patch the `recruiterId` field assignment bug in `POST /api/interviews`.

### P1: Important Architecture / Core Functionality
*   **Centralize Session Extraction**: Expose candidate session validation helper in `lib/auth.ts`.
*   **Validation Layer**: Add Zod schemas or basic object checks to prevent empty/unsafe payload insertions in pipeline stages and support tickets.
*   **Direct Upload Protections**: Introduce size and MIME type checks on direct upload configurations.

### P2: Code Quality / Refactoring
*   **Eliminate Duplicate Session Codes**: Consolidate session cookie building between `api/candidates` register and login endpoints.
*   **TypeScript Strictness**: Replace occurrences of `any` with Mongoose model types.
*   **Cleanup NextAuth Checks**: Standardize NextAuth check to use a unified `User` model, phasing out fallback lookups on the legacy `Recruiter` schema.

### P3: Nice-to-have Improvements
*   **Search Optimizations**: Migrate query regex patterns to MongoDB native text search.
*   **Real Payments / Emails**: Integrate sandboxed payment SDKs and setup nodemailer transports.
