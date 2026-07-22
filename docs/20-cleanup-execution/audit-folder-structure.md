# Audit — Folder Structure

## Classification: Mostly Clean

## Repository Root Structure

```
career77/
├── app/                  # Next.js App Router (pages + API routes)
├── components/           # Flat shared components directory
├── context/              # React context providers
├── docs/                 # Product and architecture documentation
├── lib/                  # Utility library (auth, db, cloudinary, matching)
├── models/               # Mongoose model definitions
├── public/               # Static assets
├── scripts/              # Utility scripts
├── middleware.ts          # Next.js route protection middleware
├── globals.css            # Global styles (Tailwind v4)
├── package.json
├── tsconfig.json
└── next.config.ts
```

## App Directory Structure

```
app/
├── (candidate)/           # Route group — candidate portal (layout isolation)
│   ├── layout.tsx          # Candidate layout (uses CandidateLayoutClient)
│   ├── candidate/
│   │   ├── applications/page.tsx
│   │   ├── interviews/page.tsx
│   │   ├── jobs/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── resume/page.tsx
│   │   ├── saved/page.tsx
│   │   └── settings/page.tsx
│   └── dashboard/
│       ├── page.tsx          # Redirect → /candidate/profile
│       ├── notifications/page.tsx
│       └── settings/page.tsx  ← DUPLICATE of candidate/settings
│
├── admin/                 # Super Admin Console
│   ├── layout.tsx
│   ├── page.tsx           # Admin Dashboard
│   ├── analytics/page.tsx
│   ├── billing/page.tsx
│   ├── cms/page.tsx
│   ├── companies/page.tsx
│   ├── jobs/page.tsx
│   ├── login/page.tsx
│   ├── settings/page.tsx
│   ├── support/page.tsx
│   ├── users/page.tsx
│   └── verification/page.tsx
│
├── api/                   # API Routes
│   ├── analytics/route.ts
│   ├── applications/route.ts + [jobId]/route.ts
│   ├── auth/[...nextauth]/route.ts
│   ├── billing/subscribe/route.ts + webhook/route.ts
│   ├── candidates/route.ts + login/ + logout/ + otp/ + saved-jobs/
│   ├── cms/route.ts
│   ├── companies/route.ts + [slug]/route.ts
│   ├── interviews/route.ts
│   ├── jobs/route.ts + [jobId]/route.ts
│   ├── notifications/route.ts
│   ├── pipeline/route.ts
│   ├── recruiter/register/route.ts + settings/route.ts
│   ├── resume/generate/route.ts
│   ├── support/route.ts
│   ├── training/              ← EMPTY (no route.ts)
│   ├── uploads/route.ts + view/route.ts
│   └── verification/route.ts
│
├── companies/[slug]/page.tsx + page.tsx
├── jobs/[jobId]/page.tsx + page.tsx
├── openings/[jobId]/page.tsx + page.tsx
├── login/page.tsx
├── register/page.tsx + preview/page.tsx
│
├── recruiter/             # Recruiter Portal
│   ├── layout.tsx
│   ├── page.tsx           # Recruiter Dashboard
│   ├── analytics/page.tsx
│   ├── candidates/page.tsx
│   ├── company/page.tsx
│   ├── interviews/page.tsx
│   ├── jobs/page.tsx + [jobId]/applicants/page.tsx
│   ├── login/page.tsx
│   ├── pending/page.tsx
│   ├── pipeline/page.tsx
│   ├── post-job/page.tsx
│   ├── register/page.tsx
│   └── settings/page.tsx
│
├── globals.css
├── layout.tsx             # Root layout
├── page.tsx               # Landing Page
├── robots.ts
└── sitemap.ts
```

## Findings

### Structure Issues

| Issue | Location | Severity |
|---|---|---|
| Duplicate route: `/dashboard/settings` vs `/candidate/settings` | `(candidate)/dashboard/settings/page.tsx` | Medium |
| Duplicate route: `/jobs` vs `/openings` — both appear to be public job search | `app/jobs/` and `app/openings/` | Medium |
| Empty API directory: `app/api/training/` has no `route.ts` | `app/api/training/` | Low |
| No subdirectory organization in `components/` — all 15 components flat | `components/` | Low |
| `LayoutWrapper` does not suppress public Navbar/Footer for `/candidate/*` and `/admin/*` | `components/LayoutWrapper.tsx` | Medium |

### No Major Structural Problems
The project does not suffer from deeply nested folders, circular imports, or mixed domain boundaries. The Next.js App Router route group `(candidate)` correctly isolates the candidate portal layout. The `models/`, `lib/`, and `components/` directories are clean and purposeful.

### Naming Conventions
- **Consistent**: `PascalCase` for components and models
- **Consistent**: `camelCase` for utilities
- **Consistent**: `kebab-case` for API route directories
- No violations detected

### Summary
```
Folder Structure Classification: MOSTLY CLEAN
Primary concerns: Route duplication (/jobs vs /openings), LayoutWrapper gap, empty training API directory
```
