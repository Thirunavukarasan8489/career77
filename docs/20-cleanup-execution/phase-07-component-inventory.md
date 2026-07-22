# Phase 7 — Component Inventory

## Component Registry

| Component | Current Location | Used By | Duplicate | Shared Candidate | Shared Recruiter | Shared Admin | Classification |
|---|---|---|---|---|---|---|---|
| `AdminLayoutClient` | `components/AdminLayoutClient.tsx` | `app/admin/layout.tsx` | No | No | No | Yes | Role-Specific |
| `CandidateLayoutClient` | `components/CandidateLayoutClient.tsx` | `app/(candidate)/layout.tsx` | No | Yes | No | No | Role-Specific |
| `RecruiterLayoutClient` | `components/RecruiterLayoutClient.tsx` | `app/recruiter/layout.tsx` | No | No | Yes | No | Role-Specific |
| `Navbar` | `components/Navbar.tsx` | `components/LayoutWrapper.tsx` | No | No | No | No | Shared (Public) |
| `Footer` | `components/Footer.tsx` | `components/LayoutWrapper.tsx` | No | No | No | No | Shared (Public) |
| `LayoutWrapper` | `components/LayoutWrapper.tsx` | `app/layout.tsx` | No | No | No | No | Shared (Root) |
| `Providers` | `components/Providers.tsx` | `app/layout.tsx` | No | No | No | No | Shared (Root) |
| `Toast` | `components/Toast.tsx` | Multiple (via `showToast` export) | No | Yes | Yes | Yes | Shared (Global) |
| `OpeningsClient` | `components/OpeningsClient.tsx` | Public Job Listings, Candidate Jobs | No | Yes | No | No | Shared (Feature) |
| `HomeSearchFilter` | `components/HomeSearchFilter.tsx` | Landing Page | No | No | No | No | Feature-Specific |
| `HowItWorks` | `components/HowItWorks.tsx` | Landing Page | No | No | No | No | Feature-Specific |
| `SaveJobButton` | `components/SaveJobButton.tsx` | Job listings (candidate) | No | Yes | No | No | Feature-Specific |
| `QuickApplyModal` | `components/QuickApplyModal.tsx` | Job listings, Job detail | No | No | No | No | Feature-Specific |
| `JobDetailInteractive` | `components/JobDetailInteractive.tsx` | Job detail page | No | No | No | No | Feature-Specific |
| `DeleteJobButton` | `components/DeleteJobButton.tsx` | Recruiter job management | No | No | Yes | No | Feature-Specific |

## Findings

### No Global UI Primitive Library
The project does not have a `components/ui/` directory or equivalent primitive library. There are no shared `Button`, `Input`, `Modal`, `Badge`, `Card`, `Table`, `Select`, `Checkbox`, `Spinner`, or `EmptyState` primitives.

All interactive UI is implemented inline within layout or page components using Tailwind CSS classes directly.

### Toast System
`Toast.tsx` is the single global toast system, using a `CustomEvent` (`show-toast`) dispatched on `window`. The `showToast(message)` utility function is re-exported from the same file. This pattern is used consistently across all three portals. No duplicate toast libraries detected.

### Layout System
Three distinct layout clients exist: `CandidateLayoutClient`, `RecruiterLayoutClient`, `AdminLayoutClient`. These are correctly separated and role-isolated.

### LayoutWrapper Gap (Deferred Issue)
`LayoutWrapper.tsx` only suppresses the public `Navbar` and `Footer` for `/recruiter` and `/dashboard` paths. The `/candidate/*` and `/admin/*` paths are NOT included in the suppression condition. This means the public Navbar and Footer may render on top of the candidate and admin portal layouts. This is a routing/layout boundary issue.

### AdminLayoutClient Theme Violation (Design Issue)
`AdminLayoutClient.tsx` uses a dark color palette (`bg-slate-950`, `text-slate-100`, `bg-slate-900`, `border-slate-800`) for the admin console. This directly contradicts the approved **Light Theme Only** design requirement. The recruiter and candidate layouts correctly use light surfaces (`bg-slate-50`, `bg-white`). The admin console is the only area using dark theme styling.

### Hardcoded Mock Data (OpeningsClient)
`OpeningsClient.tsx` contains hardcoded mock job entries used as fallback when the real database returns zero results. This mock data should not appear in production.
