# Phase 2 — Public Route Map

## Routes Table
| Route | Page File | Layout | Components | API | Models | SEO | Authentication | Responsive Behavior | Status |
|---|---|---|---|---|---|---|---|---|---|
| `/` | `app/page.tsx` | `LayoutWrapper` | Hero, Search | None (Direct DB query) | `Job` | Meta tags | Guest | Fully Responsive | Green |
| `/jobs` | `app/jobs/page.tsx` | `LayoutWrapper` | `OpeningsClient` | None (Direct DB query) | `Job` | Meta tags | Guest | Fully Responsive | Green |
| `/jobs/[jobId]` | `app/jobs/[jobId]/page.tsx` | `LayoutWrapper` | `JobDetailInteractive` | `/api/candidates/saved-jobs` (conditional) | `Job` | JSON-LD | Guest (Save requires login) | Fully Responsive | Green |
| `/companies` | `app/companies/page.tsx` | `LayoutWrapper` | List cards | None (Direct DB query) | `Company` | Meta tags | Guest | Fully Responsive | Green |
| `/companies/[slug]` | `app/companies/[slug]/page.tsx` | `LayoutWrapper` | Openings details | None (Direct DB query) | `Company`, `Job` | Metadata generate | Guest | Fully Responsive | Green |
