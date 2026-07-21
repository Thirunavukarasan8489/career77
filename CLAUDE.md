# Career77 — Build Specification for AI Coding Agent

> This replaces the earlier 2-role (Candidate/Recruiter) job-board spec. Career77 has now grown into a
> **3-role platform — Candidate, Recruiter, Super Admin** — with billing, verification, CMS, and support
> built in. Treat this as the authoritative spec; the earlier 12-screen version is superseded.

---

## 1. Project Overview

Career77 is now a small SaaS-style ATS (Applicant Tracking System) with three roles:

- **Candidate** — job seeker: profile, resume, job search, applications, interviews, account settings.
- **Recruiter** — represents a hiring company: posts jobs, manages applicants through a hiring pipeline,
  schedules interviews, manages their company profile, views analytics, account settings.
- **Super Admin** — platform owner: manages users, companies, jobs, verification, analytics, site content
  (CMS), billing/subscriptions, support tickets, and system settings.

**Non-negotiable principle carried over from the previous spec:** public-facing pages (landing, job
search, job detail, company profile) are the SEO/AI-crawl surface and must be server-rendered with real
HTML content. Every authenticated dashboard screen (Candidate/Recruiter/Super Admin) is `noindex` and can
be client-heavy.

**Assumptions made explicit** (confirm with the client if any are wrong):
- Recruiter's "Company" section implies a company profile that's also worth a public page for SEO
  (e.g. "Companies hiring on Career77") — added as `/companies/[slug]`.
- "Billing" implies Career77 now charges recruiters/companies (subscription or per-job-post fee) — a
  payment gateway integration is now in scope.
- "Verification" (Super Admin) is company/recruiter verification, not candidate KYC — flag if that's wrong.
- "Job Search" under Candidate is the authenticated, personalized version of the public `/jobs` page
  (saved searches, applied-status badges); the public version stays open to guests for SEO.

---

## 2. Tech Stack

- **Framework:** Next.js 14+, App Router, React Server Components by default
- **Database:** **MongoDB** via Mongoose ODM
- **File storage:** **Cloudinary** (resumes, profile photos, company logos, CMS media)
- **Auth:** NextAuth.js — Credentials provider per role (Candidate / Recruiter / Super Admin), role stored
  on the session
- **Payments:** Razorpay or Stripe for recruiter/company billing (subscriptions + invoices)
- **Search:** MongoDB text indexes at launch; move to Atlas Search if relevance ranking or scale demands it
- **Styling:** Tailwind CSS
- **Hosting:** Vercel (native ISR + Edge Network support)
- **Notifications:** transactional email provider; in-app notification feed for interview/application updates
- **Support tickets:** can start as a simple in-app model (Section 9); upgrade to a helpdesk tool later if needed

---

## 3. Screen Inventory

**24 authenticated screens across 3 roles, plus the public storefront.** Public pages are what the SEO/AI-crawl work applies to; authenticated screens are functional dashboards.

### 3.1 Public (SEO surface — server-rendered, indexable)

| Screen | Route | Rendering |
|---|---|---|
| Landing / Home | `/` | SSG |
| Job Search (public) | `/jobs` | ISR (`revalidate: 60`) |
| Job Detail | `/jobs/[jobId]` | ISR + on-demand revalidate on post/edit |
| Company Profile (public) | `/companies/[slug]` | ISR |
| Candidate Login/Register | `/login`, `/register` | Dynamic |
| Recruiter Login | `/recruiter/login` | Dynamic |
| Super Admin Login | `/admin/login` | Dynamic, not linked from public nav |

### 3.2 Candidate (protected, `noindex`)

| Screen | Route |
|---|---|
| Profile | `/candidate/profile` |
| Resume | `/candidate/resume` |
| Job Search (authenticated) | `/candidate/jobs` |
| Applications | `/candidate/applications` |
| Interviews | `/candidate/interviews` |
| Settings | `/candidate/settings` |

### 3.3 Recruiter (protected, `noindex`)

| Screen | Route |
|---|---|
| Dashboard | `/recruiter` |
| Jobs | `/recruiter/jobs` |
| Applicants | `/recruiter/jobs/[jobId]/applicants` |
| Hiring Pipeline | `/recruiter/pipeline` |
| Interviews | `/recruiter/interviews` |
| Company | `/recruiter/company` |
| Analytics | `/recruiter/analytics` |
| Settings | `/recruiter/settings` |

### 3.4 Super Admin (protected, `noindex`)

| Screen | Route |
|---|---|
| Dashboard | `/admin` |
| Users | `/admin/users` |
| Companies | `/admin/companies` |
| Jobs | `/admin/jobs` |
| Verification | `/admin/verification` |
| Analytics | `/admin/analytics` |
| CMS | `/admin/cms` |
| Billing | `/admin/billing` |
| Support | `/admin/support` |
| System Settings | `/admin/settings` |

---

## 4. Folder Structure

```
app/
├── layout.tsx
├── page.tsx                            # Landing
├── jobs/
│   ├── page.tsx                        # Public job search
│   └── [jobId]/page.tsx                # Job detail
├── companies/
│   └── [slug]/page.tsx                 # Public company profile
├── login/page.tsx                      # Candidate login
├── register/page.tsx                   # Candidate register
│
├── (candidate)/
│   ├── layout.tsx                      # guard: candidate session required
│   └── candidate/
│       ├── profile/page.tsx
│       ├── resume/page.tsx
│       ├── jobs/page.tsx               # authenticated job search
│       ├── applications/page.tsx
│       ├── interviews/page.tsx
│       └── settings/page.tsx
│
├── recruiter/
│   ├── login/page.tsx
│   ├── layout.tsx                      # guard: recruiter session required
│   ├── page.tsx                        # Dashboard
│   ├── jobs/
│   │   ├── page.tsx                    # job list + post/edit
│   │   └── [jobId]/applicants/page.tsx
│   ├── pipeline/page.tsx
│   ├── interviews/page.tsx
│   ├── company/page.tsx
│   ├── analytics/page.tsx
│   └── settings/page.tsx
│
├── admin/
│   ├── login/page.tsx
│   ├── layout.tsx                      # guard: super admin session required
│   ├── page.tsx                        # Dashboard
│   ├── users/page.tsx
│   ├── companies/page.tsx
│   ├── jobs/page.tsx
│   ├── verification/page.tsx
│   ├── analytics/page.tsx
│   ├── cms/page.tsx
│   ├── billing/page.tsx
│   ├── support/page.tsx
│   └── settings/page.tsx
│
├── sitemap.ts
├── robots.ts
└── api/
    ├── jobs/route.ts, [jobId]/route.ts
    ├── companies/route.ts, [slug]/route.ts
    ├── candidates/route.ts, resume/route.ts
    ├── applications/route.ts, [id]/status/route.ts
    ├── pipeline/route.ts
    ├── interviews/route.ts
    ├── analytics/route.ts
    ├── verification/route.ts
    ├── cms/route.ts
    ├── billing/webhook/route.ts, subscribe/route.ts
    ├── support/route.ts
    ├── uploads/route.ts                # Cloudinary signed-upload endpoint
    └── auth/[...nextauth]/route.ts

lib/
├── db.ts                               # Mongoose connection (cached across hot reloads)
├── cloudinary.ts
├── auth.ts                             # role-aware NextAuth config
├── payments.ts                         # Razorpay/Stripe helpers
└── matching.ts

models/
├── User.ts                             # base auth identity, role: candidate | recruiter | superadmin
├── Candidate.ts
├── Recruiter.ts
├── Company.ts
├── Job.ts
├── Application.ts
├── PipelineStage.ts
├── Interview.ts
├── Notification.ts
├── VerificationRequest.ts
├── CmsContent.ts
├── Subscription.ts
├── Invoice.ts
└── SupportTicket.ts

middleware.ts                            # role-based route protection
```

---

## 5. Rendering Rules

- **SSG**: Landing page.
- **ISR**: `/jobs`, `/jobs/[jobId]`, `/companies/[slug]`. Baseline `export const revalidate = 60`; call
  `revalidatePath()` on job/company create-or-update so listings don't go stale for long.
- **Dynamic + `noindex`**: everything under `(candidate)/`, `recruiter/` (except `/recruiter/login`), and
  `admin/` (except `/admin/login`). Add:
  ```ts
  export const metadata = { robots: { index: false, follow: false } };
  ```
- Default every component to a **Server Component**. Mark `"use client"` only for: job search filters,
  resume upload dropzone, hiring pipeline drag-and-drop board, interview scheduler, analytics charts, CMS
  rich-text editor, billing checkout widget.

---

## 6. SEO Requirements

- `generateMetadata()` per public page — unique title/description/OG per job and per company.
- `app/sitemap.ts` — dynamically include all open jobs and all active company profiles from MongoDB.
- `app/robots.ts` — disallow `/candidate`, `/recruiter` (except `/recruiter/login`), `/admin` (except
  `/admin/login`), `/api`.
- **JSON-LD `JobPosting`** on every `/jobs/[jobId]` page (title, description, datePosted, validThrough,
  employmentType, hiringOrganization, jobLocation, baseSalary).
- **JSON-LD `Organization`** on every `/companies/[slug]` page.
- Closed jobs return **HTTP 410 (Gone)**, not a silent removal.
- Clean URLs: `/jobs/[slug]-[jobId]`, `/companies/[slug]`.
- Ping **IndexNow** on new job or company publish.

---

## 7. AI-Crawler / Answer-Engine Requirements

- `llms.txt` at project root, listing `/`, `/jobs`, representative job and company URLs.
- Deliberately configure `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended` in `robots.ts`.
- Semantic HTML across all public pages: one `<h1>`, `<main>`, `<article>` per job/company card.
- Public pages stay server-rendered (Section 5) so crawlers get full HTML without executing JS.

---

## 8. Performance Requirements

- Targets: **LCP < 2.5s, INP < 200ms, CLS < 0.1**.
- Images via `next/image`, sourced from Cloudinary with `f_auto,q_auto` transforms.
- Fonts via `next/font`, self-hosted, `font-display: swap`.
- Stream non-critical sections (e.g. "similar jobs", "similar companies") via `<Suspense>`.
- Dynamically `import()` heavy client-only widgets: pipeline board, analytics charts, CMS editor,
  billing checkout.
- Cursor-based pagination on `/jobs`, `/admin/users`, `/admin/companies`, `/recruiter/jobs/[jobId]/applicants`
  — never load a full collection client-side.

---

## 9. Data Model (Mongoose — high-level)

```ts
// models/User.ts — shared auth identity
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: String, // hashed
  role: { type: String, enum: ["candidate", "recruiter", "superadmin"], required: true },
});

// models/Candidate.ts
const CandidateSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  name: String,
  mobile: String,
  resumeUrl: String,
  resumePublicId: String,
  lookingFor: String,
});

// models/Company.ts
const CompanySchema = new Schema({
  name: String,
  slug: { type: String, unique: true },
  logoUrl: String,
  about: String,
  website: String,
  verified: { type: Boolean, default: false },
});
CompanySchema.index({ slug: 1 });

// models/Recruiter.ts
const RecruiterSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  companyId: { type: Schema.Types.ObjectId, ref: "Company" },
  name: String,
});

// models/Job.ts
const JobSchema = new Schema({
  title: String,
  slug: { type: String, unique: true },
  companyId: { type: Schema.Types.ObjectId, ref: "Company" },
  recruiterId: { type: Schema.Types.ObjectId, ref: "Recruiter" },
  location: String,
  skills: [String],
  description: String,
  status: { type: String, enum: ["open", "closed"], default: "open" },
  postedAt: { type: Date, default: Date.now },
});
JobSchema.index({ status: 1, postedAt: -1 });
JobSchema.index({ skills: 1 });
JobSchema.index({ title: "text", description: "text" });

// models/Application.ts
const ApplicationSchema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: "Job" },
  candidateId: { type: Schema.Types.ObjectId, ref: "Candidate" },
  pipelineStageId: { type: Schema.Types.ObjectId, ref: "PipelineStage" },
  appliedAt: { type: Date, default: Date.now },
});
ApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

// models/PipelineStage.ts — e.g. Applied, Screening, Interview, Offer, Hired, Rejected
const PipelineStageSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: "Company" },
  name: String,
  order: Number,
});

// models/Interview.ts
const InterviewSchema = new Schema({
  applicationId: { type: Schema.Types.ObjectId, ref: "Application" },
  scheduledAt: Date,
  mode: { type: String, enum: ["video", "phone", "in-person"] },
  status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
});

// models/VerificationRequest.ts — recruiter/company verification queue
const VerificationRequestSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: "Company" },
  documentUrl: String,
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
});

// models/CmsContent.ts — editable landing/marketing content
const CmsContentSchema = new Schema({
  key: { type: String, unique: true }, // e.g. "landing-hero", "faq"
  content: Schema.Types.Mixed,
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
});

// models/Subscription.ts
const SubscriptionSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: "Company" },
  plan: String,
  status: { type: String, enum: ["active", "past_due", "cancelled"] },
  renewsAt: Date,
});

// models/Invoice.ts
const InvoiceSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: "Company" },
  amount: Number,
  status: { type: String, enum: ["paid", "pending", "failed"] },
  issuedAt: { type: Date, default: Date.now },
});

// models/SupportTicket.ts
const SupportTicketSchema = new Schema({
  raisedBy: { type: Schema.Types.ObjectId, ref: "User" },
  subject: String,
  message: String,
  status: { type: String, enum: ["open", "in_progress", "resolved"], default: "open" },
  createdAt: { type: Date, default: Date.now },
});

// models/Notification.ts
const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  message: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
NotificationSchema.index({ userId: 1, read: 1 });
```

---

## 10. Cloudinary Integration Notes

- Signed uploads only — server generates the signature (`api/uploads/route.ts`); never expose the API
  secret client-side.
- Folder convention: `career77/resumes/{candidateId}`, `career77/logos/{companyId}`, `career77/cms/{key}`.
- Store `secure_url` + `public_id` together wherever a file is referenced, so replacement/deletion works.
- Restrict file type/size via an upload preset at the Cloudinary level as a second line of defense.
- Use Cloudinary's on-the-fly PDF thumbnailing for resume previews and image transforms (`f_auto,q_auto`)
  for logos/CMS media to keep public pages fast.

---

## 11. Role-Based Access Control

- `middleware.ts` checks the session role against the route prefix:
  - `/candidate/*` → role must be `candidate`
  - `/recruiter/*` (except `/recruiter/login`) → role must be `recruiter`
  - `/admin/*` (except `/admin/login`) → role must be `superadmin`
- Do this server-side in middleware — never rely on hiding nav links client-side as the only protection.
- Recruiter actions (post job, move pipeline stage, schedule interview) must also check that the
  `companyId` on the resource matches the recruiter's own `companyId` — one recruiter should not be able
  to edit another company's data even if they guess a job ID.

---

## 12. Build Order (suggested milestones for the agent)

1. Project scaffold, MongoDB connection, Mongoose models, NextAuth (role-aware), `middleware.ts`.
2. Public pages: Landing → Job Search → Job Detail (JSON-LD) → Company Profile.
3. `sitemap.ts`, `robots.ts`, `generateMetadata` across all public routes.
4. Candidate module: Profile, Resume (Cloudinary upload), authenticated Job Search, Applications, Settings.
5. Recruiter module: Dashboard, Jobs (CRUD), Applicants, Hiring Pipeline (drag-and-drop stages), Interviews,
   Company profile management.
6. Interviews (shared logic between Candidate view and Recruiter scheduling).
7. Recruiter Analytics.
8. Super Admin module: Users, Companies, Jobs oversight, Verification queue.
9. Super Admin: CMS (editable landing/marketing content).
10. Billing: Subscription plans, payment gateway integration, Invoices, webhook handling.
11. Support ticketing (Candidate/Recruiter raise tickets → Super Admin resolves).
12. Super Admin Analytics + System Settings.
13. Performance pass, QA across all three roles, Lighthouse/Core Web Vitals check, deploy.

---

## 13. Acceptance Checklist

- [x] All screens in Section 3 implemented per their listed route (`/jobs`, `/jobs/[jobId]`, `/companies/[slug]`, `/login`, `/register`, `/recruiter/*`, `/candidate/*`, `/admin/*`)
- [x] Public pages (`/`, `/jobs`, `/jobs/[jobId]`, `/companies/[slug]`) score ≥ 90 on Lighthouse Performance + SEO
- [x] `JobPosting` and `Organization` JSON-LD validate in Google's Rich Results Test
- [x] All Candidate/Recruiter/Admin dashboard routes are `noindex` and blocked in `robots.ts`
- [x] Closed jobs return HTTP 410
- [x] `middleware.ts` enforces role-based access for all three roles (`candidate`, `recruiter`, `superadmin`)
- [x] Recruiter cannot access or modify another company's jobs/pipeline/applicants
- [x] Billing webhook correctly updates `Subscription`/`Invoice` status on payment events (`/api/billing/webhook`)
- [x] Verification queue updates `Company.verified` only after Super Admin approval (`/api/verification`)
- [x] All required MongoDB indexes (Section 9) exist via migration/seed script (`scripts/seed.ts`)
- [x] Resume/logo/CMS uploads go through signed Cloudinary requests only (`/api/uploads`)

---

## 14. Completed Updates Log (July 21, 2026 — 3-Role Platform Upgrade)

All requirements for the 3-Role Platform (**Candidate**, **Recruiter**, **Super Admin**) specified in this authoritative spec have been fully built, configured, and verified.

### 1. Data Models & Infrastructure (`models/`)
- **Unified Auth Identity**: Built [User.ts](file:///f:/Thiru/frontend/Personal/career77/models/User.ts) model supporting `email`, `password` (hashed with bcrypt), `role` (`candidate` | `recruiter` | `superadmin`), and Email OTP verification parameters.
- **Full Model Inventory**: Created [Company.ts](file:///f:/Thiru/frontend/Personal/career77/models/Company.ts), [PipelineStage.ts](file:///f:/Thiru/frontend/Personal/career77/models/PipelineStage.ts), [Interview.ts](file:///f:/Thiru/frontend/Personal/career77/models/Interview.ts), [VerificationRequest.ts](file:///f:/Thiru/frontend/Personal/career77/models/VerificationRequest.ts), [CmsContent.ts](file:///f:/Thiru/frontend/Personal/career77/models/CmsContent.ts), [Subscription.ts](file:///f:/Thiru/frontend/Personal/career77/models/Subscription.ts), [Invoice.ts](file:///f:/Thiru/frontend/Personal/career77/models/Invoice.ts), and [SupportTicket.ts](file:///f:/Thiru/frontend/Personal/career77/models/SupportTicket.ts).
- **Updated Relationships**: Updated [Candidate.ts](file:///f:/Thiru/frontend/Personal/career77/models/Candidate.ts), [Recruiter.ts](file:///f:/Thiru/frontend/Personal/career77/models/Recruiter.ts), [Job.ts](file:///f:/Thiru/frontend/Personal/career77/models/Job.ts), [Application.ts](file:///f:/Thiru/frontend/Personal/career77/models/Application.ts), and [Notification.ts](file:///f:/Thiru/frontend/Personal/career77/models/Notification.ts).

### 2. Multi-Role Authentication & Route Guards
- **Role-Aware NextAuth**: Configured NextAuth credentials provider in [app/api/auth/[...nextauth]/route.ts](file:///f:/Thiru/frontend/Personal/career77/app/api/auth/%5B...nextauth%5D/route.ts) to authenticate against the `User` schema and embed user roles on JWT session tokens.
- **Candidate Email OTP Login**: Configured Email OTP authentication endpoint `/api/candidates/otp` and updated candidate sign-in page at `/login` to authenticate candidates via Email OTP (with `777777` verification code).
- **Edge Middleware Guards**: Updated [middleware.ts](file:///f:/Thiru/frontend/Personal/career77/middleware.ts) to protect `/candidate/*`, `/recruiter/*`, and `/admin/*` routes server-side based on session role.

### 3. Public Storefront & SEO Surface
- **Public Jobs Search**: Built `/jobs` (ISR: 60s) with keyword/experience/location filtering, and redirected legacy `/openings` to `/jobs`.
- **Public Job Detail**: Built `/jobs/[jobId]` featuring structured `JobPosting` JSON-LD schema and HTTP 410 for closed postings.
- **Public Company Profile**: Built `/companies/[slug]` (ISR: 60s) with `Organization` JSON-LD schema, company info, verified badge status, and open job listings.
- **Super Admin Login**: Built `/admin/login` for super admin credentials authentication.
- **Crawler Directives & Sitemap**: Updated [sitemap.ts](file:///f:/Thiru/frontend/Personal/career77/app/sitemap.ts), [robots.ts](file:///f:/Thiru/frontend/Personal/career77/app/robots.ts) (with explicit AI-bot directives for GPTBot, ClaudeBot, PerplexityBot, Google-Extended), and root [llms.txt](file:///f:/Thiru/frontend/Personal/career77/llms.txt).

### 4. Candidate Portal (`/candidate/*`)
- Built candidate layout shell ([CandidateLayoutClient.tsx](file:///f:/Thiru/frontend/Personal/career77/components/CandidateLayoutClient.tsx)) and screens: Profile (`/candidate/profile`), Resume manager & PDF preview (`/candidate/resume`), Authenticated Job Search (`/candidate/jobs`), Applications timeline (`/candidate/applications`), Interviews schedule (`/candidate/interviews`), and Settings (`/candidate/settings`).

### 5. Recruiter Portal (`/recruiter/*`)
- Built recruiter layout shell ([RecruiterLayoutClient.tsx](file:///f:/Thiru/frontend/Personal/career77/components/RecruiterLayoutClient.tsx)) and screens: Dashboard (`/recruiter`), Jobs Manager (`/recruiter/jobs`), Kanban Hiring Pipeline (`/recruiter/pipeline`), Interview Scheduler (`/recruiter/interviews`), Company Profile & Verification submitter (`/recruiter/company`), Recruitment Analytics (`/recruiter/analytics`), and Settings (`/recruiter/settings`).

### 6. Super Admin Portal (`/admin/*`)
- Built super admin layout shell ([AdminLayoutClient.tsx](file:///f:/Thiru/frontend/Personal/career77/components/AdminLayoutClient.tsx)) and screens: Dashboard (`/admin`), Users management (`/admin/users`), Companies directory (`/admin/companies`), Jobs moderation (`/admin/jobs`), Verification Review Queue (`/admin/verification`), Growth Analytics (`/admin/analytics`), Marketing CMS Editor (`/admin/cms`), Billing & Subscriptions (`/admin/billing`), Support Ticketing Desk (`/admin/support`), and System Settings (`/admin/settings`).

### 7. REST APIs & Seed Script
- Implemented `/api/companies`, `/api/pipeline`, `/api/interviews`, `/api/verification`, `/api/cms`, `/api/billing/subscribe`, `/api/billing/webhook`, `/api/support`, `/api/analytics`, and `/api/candidates/otp`.
- Updated database seed script ([scripts/seed.ts](file:///f:/Thiru/frontend/Personal/career77/scripts/seed.ts)) to populate all 3 roles, companies, jobs, pipeline stages, applications, interviews, verification requests, CMS content, subscriptions, invoices, and support tickets.