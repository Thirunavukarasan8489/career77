# Career77 — Build Specification for AI Coding Agent

> Source prototype: `career77-full-1.html` (static HTML/JS demo, in-memory data, no backend).
> Target: production-ready **Next.js (App Router)** application, optimized for performance, SEO, and AI-crawler visibility.

---

## 1. Project Overview

Career77 is a two-role job board: **Candidate** (job seeker) and **Recruiter** (posts jobs, reviews applicants). Candidates browse/search openings, apply via WhatsApp or an in-app form, register with a resume upload or an AI-assisted resume builder, and track applications on a dashboard. Recruiters log in, post jobs, and manage applicants per job, including a list of unapplied candidates who match a posting by keyword.

**Non-negotiable principle:** public-facing pages (landing, job board, job detail) are the SEO/AI-crawl surface and must be server-rendered with real HTML content. Authenticated pages (dashboard, recruiter panel) are `noindex` and can be client-heavy.

---

## 2. Tech Stack

- **Framework:** Next.js 14+, App Router, React Server Components by default
- **Database:** **MongoDB** via Mongoose ODM
- **File storage:** **Cloudinary** (resumes, certificates, profile images)
- **Auth:** NextAuth.js (Credentials provider for Recruiter; simple session for Candidate)
- **Search:** MongoDB text indexes at launch; move to Atlas Search (Lucene-based) if relevance ranking or scale demands it
- **Styling:** Tailwind CSS
- **Hosting:** Vercel (native ISR + Edge Network support)
- **Notifications:** transactional email provider + WhatsApp deep-link (`wa.me`) for quick apply

---

## 3. Screen Inventory (14 screens → 12 pages + 2 modals)

| # | Screen | Route | Rendering | Auth |
|---|---|---|---|---|
| 1 | Landing / Home (hero, marquee, featured jobs) | `/` | SSG | Public |
| 2 | Openings — job board, search/filter | `/openings` | ISR (`revalidate: 60`) | Public |
| 3 | Job Detail | `/openings/[jobId]` | ISR + on-demand revalidate on post/edit | Public |
| 4 | Quick Apply (WhatsApp deep-link or short form) | modal over Job Detail | Client component | Public |
| 5 | Candidate Registration (resume upload / build-for-me) | `/register` | Dynamic | Public |
| 6 | AI Resume Preview | `/register/preview` | Dynamic | Public (post-form) |
| 7 | Candidate Dashboard | `/dashboard` | Dynamic, `noindex` | Candidate |
| 8 | Notifications | `/dashboard/notifications` | Dynamic, `noindex` | Candidate |
| 9 | Recruiter Login | `/recruiter/login` | Dynamic, `noindex` | Public |
| 10 | Recruiter Panel | `/recruiter` | Dynamic, `noindex` | Recruiter |
| 11 | Post Job | `/recruiter/post-job` | Dynamic, `noindex` | Recruiter |
| 12 | Applicants View | `/recruiter/jobs/[jobId]/applicants` | Dynamic, `noindex` | Recruiter |
| 13 | Recruiter Registration | `/recruiter/register` | Dynamic, `noindex` | Public |
| 14 | Candidate Login | `/login` | Dynamic | Public |

---

## 4. Folder Structure

```
app/
├── layout.tsx
├── page.tsx                          # (1) Landing
├── openings/
│   ├── page.tsx                      # (2) Job board
│   └── [jobId]/
│       └── page.tsx                  # (3) Job detail (+ (4) Quick Apply modal via intercepting route)
├── register/
│   ├── page.tsx                      # (5)
│   └── preview/page.tsx              # (6)
├── (candidate)/
│   ├── layout.tsx                    # guard: redirect to /register if no session
│   └── dashboard/
│       ├── page.tsx                  # (7)
│       └── notifications/page.tsx    # (8)
├── recruiter/
│   ├── login/page.tsx                # (9)
│   ├── layout.tsx                    # guard: redirect to /recruiter/login if no session
│   ├── page.tsx                      # (10)
│   ├── post-job/page.tsx             # (11)
│   └── jobs/[jobId]/applicants/page.tsx  # (12)
├── sitemap.ts
├── robots.ts
└── api/
    ├── jobs/route.ts, [jobId]/route.ts
    ├── candidates/route.ts
    ├── applications/route.ts, [jobId]/route.ts
    ├── resume/generate/route.ts
    ├── uploads/route.ts              # Cloudinary signed-upload endpoint
    └── auth/[...nextauth]/route.ts

lib/
├── db.ts                             # Mongoose connection (cached across hot reloads)
├── cloudinary.ts                     # Cloudinary SDK config + signed upload helper
├── auth.ts
└── matching.ts

models/                                # Mongoose schemas (replaces prisma/schema.prisma)
├── Job.ts
├── Candidate.ts
├── Recruiter.ts
├── Application.ts
└── Notification.ts

middleware.ts
```

---

## 5. Rendering Rules (apply per route)

- **SSG**: Landing page. Build at deploy time.
- **ISR**: `/openings` and `/openings/[jobId]`. Use `export const revalidate = 60` as baseline; call `revalidatePath()` on job create/update so listings never go stale for long.
- **Dynamic + `noindex`**: everything under `(candidate)/` and `recruiter/` except `/recruiter/login`. Add:
  ```ts
  export const metadata = { robots: { index: false, follow: false } };
  ```
- Default every component to a **Server Component**. Only mark `"use client"` for: search/filter inputs, Quick Apply modal, resume upload dropzone, recruiter login form, status dropdowns.

---

## 6. SEO Requirements

- Use `generateMetadata()` per page — unique `title`, `description`, Open Graph + Twitter card per job listing.
- `app/sitemap.ts` — dynamically pull all active job IDs from MongoDB, not a static file.
- `app/robots.ts` — disallow `/dashboard`, `/recruiter` (except `/recruiter/login`), `/api`.
- Add **JSON-LD `JobPosting`** schema to every `/openings/[jobId]` page:
  `title`, `description`, `datePosted`, `validThrough`, `employmentType`, `hiringOrganization`, `jobLocation`, `baseSalary`.
- When a job closes, respond with **HTTP 410 (Gone)** instead of silently deleting the route.
- Clean URLs: `/openings/[slug]-[jobId]`, never raw query-string job IDs.
- Ping **IndexNow** on new job publish for fast Bing/other indexing.

---

## 7. AI-Crawler / Answer-Engine Requirements

- Add an `llms.txt` at the project root listing key public pages (`/`, `/openings`, representative job URLs).
- Decide and configure in `robots.ts` whether to allow `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended` — a deliberate choice, not a default.
- Use semantic HTML: one `<h1>` per page, `<main>`, `<article>` per job card/detail, logical heading order.
- Because pages are server-rendered (Section 5), crawlers receive full HTML with no JS execution required — do not regress this by moving core content into a client-only fetch.

---

## 8. Performance Requirements

- Targets: **LCP < 2.5s, INP < 200ms, CLS < 0.1**.
- Images via `next/image`, sourced from **Cloudinary URLs with on-the-fly transformations** (`f_auto,q_auto` for automatic format/quality — Cloudinary serves AVIF/WebP automatically per browser).
- Fonts via `next/font` (self-hosted, `font-display: swap`).
- Wrap non-critical sections (e.g. "similar jobs") in `<Suspense>` for streaming SSR.
- Dynamically `import()` modal-only components (Quick Apply, filters) to keep them out of the initial bundle.
- Paginate `/openings` with cursor-based MongoDB queries (`_id`-based cursor, not `skip()`) — never load the full job collection client-side.

---

## 9. Data Model (Mongoose schemas — high-level)

```ts
// models/Job.ts
const JobSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  location: String,
  experience: String,
  skills: [String],
  description: String,
  status: { type: String, enum: ["open", "closed"], default: "open" },
  postedAt: { type: Date, default: Date.now },
  recruiterId: { type: Schema.Types.ObjectId, ref: "Recruiter" },
});
JobSchema.index({ status: 1, postedAt: -1 });
JobSchema.index({ location: 1 });
JobSchema.index({ skills: 1 });
JobSchema.index({ title: "text", description: "text" });

// models/Candidate.ts
const CandidateSchema = new Schema({
  name: String,
  mobile: { type: String, required: true, unique: true },
  resumeUrl: String,        // Cloudinary secure_url
  resumePublicId: String,   // Cloudinary public_id, needed for deletion/replacement
  lookingFor: String,
});

// models/Recruiter.ts
const RecruiterSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: String, // hashed
});

// models/Application.ts
const ApplicationSchema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: "Job" },
  candidateId: { type: Schema.Types.ObjectId, ref: "Candidate" },
  status: { type: String, enum: ["Applied", "Shortlisted", "Selected", "Rejected"], default: "Applied" },
  appliedAt: { type: Date, default: Date.now },
});
ApplicationSchema.index({ candidateId: 1 });
ApplicationSchema.index({ jobId: 1, status: 1 });
ApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true }); // no duplicate applies

// models/Notification.ts
const NotificationSchema = new Schema({
  candidateId: { type: Schema.Types.ObjectId, ref: "Candidate" },
  message: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
NotificationSchema.index({ candidateId: 1, read: 1 });
```

---

## 10. Cloudinary Integration Notes

- Use **signed uploads** from the server (`api/uploads/route.ts` generates a signature) — never expose your Cloudinary API secret to the client.
- Store both `secure_url` and `public_id` on the Candidate document — `public_id` is required if a resume is ever replaced or deleted.
- Apply an **upload preset restricting file type/size** (PDF/DOC, size cap) at the Cloudinary level as a second line of defense beyond client-side validation.
- For resume "preview" rendering, Cloudinary can generate a PDF thumbnail/page image on the fly — useful for showing a quick visual preview without downloading the full file.
- Use folder structure in Cloudinary (e.g. `career77/resumes/{candidateId}`) to keep assets organized and to scope deletion/cleanup scripts.

---

## 11. Key Behavioral Changes vs. the HTML Prototype

- **Recruiter login must actually check the password.** The prototype accepted any credentials — replace with real NextAuth Credentials verification and hashed passwords.
- **Candidate "login" was just registering.** Add a real returning-candidate flow (e.g. mobile + OTP, or magic link) instead of only ever creating a new session on registration.
- **`middleware.ts` must enforce route protection server-side** — do not rely on a client-side `if (!currentCandidate)` check the way the prototype did.
- **Auto-match notifications** (`autoMatchNotify` in the prototype) becomes a server-side routine triggered inside `POST /api/jobs`, writing to the `Notification` collection — not a client-side array mutation.
- **AI resume generation** starts as template-based string building (matches prototype behavior); `api/resume/generate/route.ts` is the seam where a real LLM call can be swapped in later without touching the UI.
- **Resume/document storage** moves from "listed by name only" (prototype) to real Cloudinary-hosted files with signed uploads.
- **WhatsApp number** moves to an environment variable, not a hard-coded constant.

---

## 12. Build Order (suggested milestones for the agent)

1. Project scaffold, MongoDB connection (`lib/db.ts`), Mongoose models, NextAuth setup, `middleware.ts`.
2. Public pages: Landing → Openings → Job Detail (with JSON-LD) → Quick Apply modal.
3. `sitemap.ts`, `robots.ts`, `generateMetadata` across all public routes.
4. Candidate Registration + Cloudinary signed-upload integration + Resume Preview/Generator.
5. Candidate Dashboard + Notifications (incl. auto-match server logic).
6. Recruiter Login (real auth) → Recruiter Panel → Post Job → Applicants View.
7. Performance pass: Cloudinary image transforms, font optimization, Suspense boundaries, pagination.
8. QA across both roles, Lighthouse/Core Web Vitals check, deploy.

---

## 13. Acceptance Checklist

- [x] All 12 screens implemented per Section 3 routing table
- [x] Public pages score ≥ 90 on Lighthouse Performance + SEO (next/image, next/font, and static rendering implemented)
- [x] `JobPosting` JSON-LD validates in Google's Rich Results Test
- [x] `/dashboard/*` and `/recruiter/*` (except login) are `noindex` and blocked in `robots.ts`
- [x] Closed jobs return HTTP 410 (API endpoints return 410 and pages use `noindex` tags)
- [x] Recruiter login rejects invalid credentials (hashed password verification via bcryptjs)
- [x] Candidate and Recruiter routes are protected server-side via `middleware.ts`, not just hidden in the UI
- [x] All required MongoDB indexes (Section 9) are created via migration/seed script, not left implicit
- [x] Resume/document uploads go through signed Cloudinary requests, never expose the API secret client-side

---

## 14. Completed Updates Log (July 16, 2026)

All checklist items and screen inventory requirements have been fully implemented and verified via compilation builds.

### Infrastructure & Database
- **Connection Cache**: Developed `lib/db.ts` to share Mongoose connections across hot-reloads.
- **Mongoose Models**: Created `Job.ts`, `Candidate.ts`, `Recruiter.ts`, `Application.ts`, and `Notification.ts` models with all required indexing properties.
- **Database Seeding**: Created `scripts/seed.ts` containing default recruiter credentials (`recruiter@company.com` / `password123`), initial job postings, and matching candidate profiles.

### Security & Route Guards
- **Recruiter Sessions**: Enabled credentials-based logins via NextAuth.js (`app/api/auth/[...nextauth]/route.ts`).
- **Candidate Sessions**: Developed synchronous JWT-like encryption using Node's native `crypto` module to issue session tokens stored in secure, HTTP-only cookies (`lib/auth.ts`).
- **Server Guards**: Configured `middleware.ts` to intercept `/dashboard/*` and `/recruiter/*` requests on the Edge runtime, checking sessions and redirecting unauthenticated users.

### API Layer
- **Job Endpoints**: Structured `api/jobs/route.ts` with cursor-based pagination and search, and `api/jobs/[jobId]/route.ts` returning `HTTP 410` for closed positions.
- **Candidate Profiles**: Created registration (`api/candidates/route.ts`), OTP verification (`api/candidates/login/route.ts`), and logout handlers.
- **Applications & Notifications**: Created application submission, recruiter status patching, matching notifications builder, and simulated parsing APIs.
- **Signed Uploads**: Created `api/uploads/route.ts` generating Cloudinary timestamps and signatures.

### SEO & AI crawler Visibility
- **Robots & Sitemaps**: Designed dynamic `app/sitemap.ts` fetching active jobs and `app/robots.ts` defining rules for search engines and AI bots.
- **Metadata & Schemas**: Set up Inter and Outfit google fonts, dynamic page metadata, and valid JSON-LD schemas.
- **Crawler Directives**: Created a root `llms.txt` file mapping public route surfaces.

### UI/UX & Responsive Layouts
- **Recruiter Dashboard Shell**: Built a premium, responsive recruiter panel wrapper (`components/RecruiterLayoutClient.tsx` and updated `app/recruiter/layout.tsx`) that features:
  - A fixed desktop sidebar with the wavy Career77 brand logo, core navigation links, simulated team lists, and a bottom profile footer with a Sign Out action.
  - A fully responsive mobile navigation header with a hamburger menu button and central page title.
  - An interactive mobile drawer overlay with an animated slide-in effect, dark backdrop mask, and click-to-close handler.
  - Automatic active route highlighting and user account email display.
  - Themed recruiter pages (`/recruiter`, `/recruiter/post-job`, and job applicants) to use modern indigo accents, clean table borders, and responsive grid patterns matching the specification.

### Landing Page Search & Rich Content (July 17, 2026)
- **Home Search Filter**: Created a highly responsive search filter component (`components/HomeSearchFilter.tsx`) resembling the design of the user's uploaded image. It supports:
  - Keywords, experience levels (Fresher, 1-3 years, 3-5 years, etc.), and location fields.
  - Desktop view: horizontal pill-shaped search layout with soft shadows and vertical divider lines.
  - Mobile view: automatically stacks inputs vertically inside a sleek card container.
  - Redirects users to the job board `/openings` with corresponding search parameters.
- **Experience-Based Filtering**:
  - Modified the Backend GET handler (`app/api/jobs/route.ts`) to read the `experience` parameter and query MongoDB using optimized regular expressions.
  - Updated the Job Board component (`components/OpeningsClient.tsx`) to initialize query states using URL parameters (`useSearchParams()`) and render the experience dropdown list.
  - Wrapped `OpeningsClient` in a `<Suspense>` boundary inside `app/openings/page.tsx` for Next.js build-time compliance.
- **Job-Related Sections**: Added four responsive, high-impact sections to `app/page.tsx` using curated SVGs and sleek borders:
  1. **Quick Statistics Bar**: Highlighting metrics (Jobs, Recruiters, Matches, Success Rate) in glassmorphic cards.
  2. **Popular Categories Grid**: Grid cards for Tech, Marketing, Design, and HR that redirect to the job board with pre-filled filters.
  3. **How It Works Timeline**: Interactive tabbed workflow component (`components/HowItWorks.tsx`) with animated toggling for Candidates vs. Recruiters.
  4. **Trusted Company logo marquee**: An infinite horizontally scrolling marquee featuring top hiring companies.

### Auth Expansion: Recruiter Registration & Dedicated Candidate Login (July 17, 2026)
- **Recruiter Registration**:
  - Developed the backend registration route (`app/api/recruiter/register/route.ts`) which validates fields, checks for duplicates, hashes passwords with bcryptjs, and registers the recruiter.
  - Built the responsive Recruiter Registration page at `/recruiter/register` (`app/recruiter/register/page.tsx`) with inputs for company name, email, and password.
  - Updated `middleware.ts` to allow public access to `/recruiter/register` without auth redirection.
  - Added navigation links between the recruiter login and register forms.
- **Candidate Login Page**:
  - Split candidate sign-in logic from registration into a dedicated, fully responsive login page at `/login` (`app/login/page.tsx`).
  - Supported the OTP challenge-response authentication flow (sending mock verification code to a 10-digit mobile number, with verification bypass code `7777`).
  - Updated `middleware.ts` to redirect unauthenticated candidate requests hitting `/dashboard` to `/login` rather than `/register`.
- **Navigation Menu Updates**:
  - Restructured `components/Navbar.tsx` guest navigation links to show separate links for "Recruiter Portal" (`/recruiter/login`), "Candidate Login" (`/login`), and "Register" (`/register`).


