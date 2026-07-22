# Implementation Gap Report

## Overall Estimated Completion: ~42%

---

## 1. Already Correct

The following features are implemented correctly and match the approved product requirements:

### Authentication
- ✅ Candidate OTP login/registration with HMAC-signed cookie session
- ✅ Recruiter credentials login via NextAuth.js (JWT strategy)
- ✅ Super Admin credentials login via NextAuth.js
- ✅ Middleware route protection for all three role portals
- ✅ Cross-role guard (candidate cannot access recruiter/admin, recruiter cannot access admin)
- ✅ Recruiter pending/verification state enforcement

### Candidate Portal
- ✅ Candidate profile view and edit (`/candidate/profile`)
- ✅ Candidate resume upload via Cloudinary (`/candidate/resume`)
- ✅ Candidate job search with filters and pagination (`/candidate/jobs`)
- ✅ Candidate saved jobs (`/candidate/saved`)
- ✅ Candidate applications list (`/candidate/applications`)
- ✅ Candidate interview list (`/candidate/interviews`)
- ✅ Candidate settings (`/candidate/settings`)
- ✅ Candidate ownership enforced server-side via cookie session

### Recruiter Portal
- ✅ Recruiter dashboard with stats
- ✅ Job create, edit, delete, list (`/recruiter/jobs`)
- ✅ Applicant list view (`/recruiter/candidates`)
- ✅ Per-job applicant view (`/recruiter/jobs/[jobId]/applicants`)
- ✅ Pipeline page (`/recruiter/pipeline`)
- ✅ Interview schedule and list (`/recruiter/interviews`)
- ✅ Company profile page (`/recruiter/company`)
- ✅ Recruiter analytics page (`/recruiter/analytics`)
- ✅ Recruiter settings page (`/recruiter/settings`)
- ✅ Job ownership enforced server-side by recruiterId on Job document

### Super Admin Console
- ✅ Admin dashboard with platform metrics
- ✅ User list (`/admin/users`)
- ✅ Company list (`/admin/companies`)
- ✅ Job moderation (`/admin/jobs`)
- ✅ Verification queue (`/admin/verification`)
- ✅ Analytics (`/admin/analytics`)
- ✅ CMS editor (`/admin/cms`)
- ✅ Billing view (`/admin/billing`)
- ✅ Support tickets (`/admin/support`)
- ✅ System settings (`/admin/settings`)
- ✅ All admin APIs protected by superadmin role check (except CMS write)

### Public / Marketing
- ✅ Landing page (`/`)
- ✅ Job search / openings (`/openings`)
- ✅ Job detail (`/openings/[jobId]`, `/jobs/[jobId]`)
- ✅ Company profile (`/companies/[slug]`)
- ✅ SEO: sitemap, robots implemented

### Models
- ✅ 15 Mongoose models implemented
- ✅ Core models indexed appropriately
- ✅ Duplicate application prevention (unique compound index)
- ✅ Text search index on Job (title + description)

---

## 2. Needs Cleanup

These features exist but have code quality, consistency, or minor correctness issues:

| Item | Issue | Priority |
|---|---|---|
| `AdminLayoutClient` dark theme | Uses `bg-slate-950` — violates Light Theme Only requirement | P2 |
| `LayoutWrapper` routing gap | Doesn't suppress Navbar/Footer for `/candidate/*` and `/admin/*` | P3 |
| `OpeningsClient` mock data | Hardcoded fallback jobs when DB returns empty | P3 |
| Recruiter dashboard uses `/api/analytics` | Admin-only endpoint called from recruiter dashboard — fails silently | P2 |
| `Navbar` brand uses `blue-600` | Should be `indigo-600` per design system | P7 |
| Admin active nav uses `purple-600` | Should be `indigo-600` per design system | P7 |
| `/dashboard/settings` duplicate | Same as `/candidate/settings` — dead route | P4 |
| `/jobs` vs `/openings` | Two routes for same public job search | P5 |
| Recruiter password redundant | Stored on both User and Recruiter model | P5 |
| `Toast` no variant/ARIA | Single-style toast, no severity, no aria-live | P7 |

---

## 3. Needs Fix (Bugs & Security Issues)

| Item | Issue | Priority |
|---|---|---|
| `PUT /api/cms` — No auth | Anyone can update CMS content | **P0 Security** |
| `GET/POST /api/pipeline` — No auth | Pipeline stages readable/writable by anyone | **P0 Security** |
| `POST /api/verification` — Company lookup bug | `Company.findOne({})` finds wrong company | P1 |
| Billing webhook — stub | No verification, no subscription activation | P1 |
| Analytics — hardcoded revenue | `monthlyRevenue: 49999` is fake data | P1 |
| Candidate `userId` optional | Breaks support ticket creation for Quick Apply candidates | P1 |
| `DeleteJobButton` uses `window.confirm()` | No accessible confirmation modal | P7 |

---

## 4. Needs Implementation (Missing Features)

| Feature | Area | Priority |
|---|---|---|
| Paid Training system | Candidate/Admin | P3 |
| Recruiter subscription payment flow | Recruiter/Billing | P3 |
| Real billing/payment gateway integration | Platform | P3 |
| Email transactional notifications | Platform | P3 |
| Recruiter → Candidate messaging | Candidate/Recruiter | P3 |
| Application pipeline status sync | Recruiter | P3 |
| Audit log usage | Platform/Admin | P3 |
| Invoice usage | Billing | P3 |
| WhatsApp deep link notifications | Platform | P8 |
| Admin user deactivation/suspension | Admin | P3 |
| Admin bulk actions on tables | Admin | P7 |
| Shared UI primitive components | Frontend | P6 |
| Service layer abstraction | Backend | P6 |

---

## 5. Needs Documentation Update

| Item | Required Update |
|---|---|
| Admin dark theme vs Light Theme Only | Acknowledge violation, plan fix |
| Two public job search routes | Document which is canonical |
| Quick Apply anonymous flow | Document as intended design decision |
| Pipeline stage management | Document relationship to Application status |

---

## 6. Needs Architecture Decision

| Item | Decision Required |
|---|---|
| Candidate auth model | Should Quick Apply candidates always create a `User` record? |
| Recruiter duplicate password | Should `Recruiter.password` be removed once `User` record is created? |
| Pipeline vs Application status | Should pipeline stages drive application status or remain separate? |
| Service layer | When to extract business logic from route handlers? |
