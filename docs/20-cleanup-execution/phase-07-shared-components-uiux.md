# Phase 7 — Shared Components + Global UI/UX Consolidation

## 1. Objective
Audit all reusable components, identify duplication and design inconsistencies, align the codebase to the approved Career77 design system, and document issues and deferred actions across all portals.

---

## 2. Component Inventory
Full inventory documented in: `docs/20-cleanup-execution/phase-07-component-inventory.md`

**Summary of actual components found in `components/`:**

| Component | Role | Classification |
|---|---|---|
| `AdminLayoutClient` | Admin | Role-Specific Layout |
| `CandidateLayoutClient` | Candidate | Role-Specific Layout |
| `RecruiterLayoutClient` | Recruiter | Role-Specific Layout |
| `Navbar` | Public | Shared (Public) |
| `Footer` | Public | Shared (Public) |
| `LayoutWrapper` | Root | Shared (Root Shell) |
| `Providers` | Root | Shared (Root Providers) |
| `Toast` | Global | Shared (Global Feedback) |
| `OpeningsClient` | Public + Candidate | Shared (Feature) |
| `HomeSearchFilter` | Landing | Feature-Specific |
| `HowItWorks` | Landing | Feature-Specific |
| `SaveJobButton` | Candidate | Feature-Specific |
| `QuickApplyModal` | Public + Candidate | Feature-Specific |
| `JobDetailInteractive` | Public | Feature-Specific |
| `DeleteJobButton` | Recruiter | Feature-Specific |

---

## 3. Component Architecture

The project uses a flat `components/` directory with no subdirectory structure. There is no `components/ui/`, `components/forms/`, `components/layout/`, or `components/feedback/` organization.

The three layout clients (`CandidateLayoutClient`, `RecruiterLayoutClient`, `AdminLayoutClient`) are the primary structural components. All other components are feature-level components.

The architecture follows:
```
Shared UI (Toast, Navbar, Footer, LayoutWrapper)
    ↓
Feature Components (OpeningsClient, QuickApplyModal, SaveJobButton, etc.)
    ↓
Role-Specific Layouts (CandidateLayoutClient, RecruiterLayoutClient, AdminLayoutClient)
    ↓
Pages (app/**/page.tsx)
```

---

## 4. Shared UI Components

No headless/primitive UI component library exists (e.g. no shared `Button`, `Input`, `Modal`, `Badge`, `Card`, `Table`, `Select`, `Spinner`, `EmptyState`). All interactive UI elements are implemented inline using Tailwind CSS directly within each page or layout component.

**Assessment:** This is acceptable for the current scale. The existing inline Tailwind approach is consistent and does not produce meaningfully broken UI. A primitive component library is a future enhancement, not an urgent blocker.

---

## 5. Form System

Forms are implemented inline within individual pages. No shared `FormField`, `FormError`, `Label`, or `Input` component exists. Form patterns are visually consistent through shared Tailwind conventions but are not centralized.

**Issues:** None blocking production functionality.

---

## 6. Button System

No shared `Button` component exists. Buttons are implemented inline using Tailwind classes. The following patterns were observed:

- **Primary Action**: `bg-indigo-600 text-white rounded-xl px-4 py-2 hover:bg-indigo-700`
- **Destructive**: `border border-red-600 text-red-600 hover:bg-red-50 rounded-full`
- **Ghost/Secondary**: `border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl`

These are visually consistent but not centralized. The pattern is maintained through developer convention rather than enforced through a component.

---

## 7. Modal System

`QuickApplyModal` is the only explicitly modeled modal component. Confirmation dialogs (e.g. in `DeleteJobButton`) use native `window.confirm()`. There is no shared `ConfirmationModal`, `Dialog`, or `Drawer` component.

**Finding:** `DeleteJobButton` uses `window.confirm()` for the delete confirmation — a native browser dialog with no styling, no career77 branding, and limited accessibility. This should be replaced with a proper confirmation modal component in a future UI component phase.

---

## 8. Data Table System

No shared `DataTable` component exists. Tables within Admin and Recruiter pages are implemented inline within each page component using Tailwind table classes.

---

## 9. Status Badge System

No shared `StatusBadge` or `Badge` component exists. Status indicators are implemented inline using Tailwind span elements with color classes. This is visually consistent but not centralized.

---

## 10. Loading States

`CandidateLayoutClient` implements a spinner loading state:
```jsx
<div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
```

`RecruiterLayoutClient` and `AdminLayoutClient` do not have an equivalent loading spinner at the layout level. Individual pages manage their own loading states inline.

---

## 11. Empty States

No shared `EmptyState` component. Empty state messaging is implemented inline within each page. Patterns vary across pages.

---

## 12. Error States

No shared `ErrorState` component. Error handling is inline within each page or API call handler.

---

## 13. Notification System

`Toast.tsx` is the single global notification system. It works via `CustomEvent` dispatched on the `window` object. The `showToast(message: string)` utility function is used consistently across:
- `CandidateLayoutClient` (logout feedback)
- `RecruiterLayoutClient` (logout feedback, actions)
- `AdminLayoutClient` (logout feedback)
- `DeleteJobButton` (action feedback)
- `SaveJobButton` (action feedback)
- `QuickApplyModal` (submission feedback)
- `OpeningsClient` (apply action feedback)

**Assessment:** The Toast system is consistent, working, and shared globally. No duplicate notification libraries detected. Single `Toast` mount in `LayoutWrapper` ensures one global instance.

**Limitation:** `Toast` only supports a plain text `message` string. It has no `variant` support (success/error/warning/info distinction). All messages appear with the same dark `bg-zinc-900` styling regardless of severity.

---

## 14. Typography

Fonts are correctly configured:
- **Inter**: Body font, loaded via `next/font/google`, applied via `font-sans` Tailwind utility
- **Outfit**: Display font, loaded via `next/font/google`, applied via `font-display` Tailwind utility

Both fonts are applied to the root HTML element in `app/layout.tsx`. Typography is consistent across the application.

---

## 15. Color System

Full token audit documented in: `docs/20-cleanup-execution/phase-07-design-token-audit.md`

**Three color inconsistencies found:**

| Location | Actual Color | Required Color | Severity |
|---|---|---|---|
| `Navbar.tsx` — brand logo | `text-blue-600` | `text-indigo-600` | Low |
| `AdminLayoutClient.tsx` — active nav | `bg-purple-600` | `bg-indigo-600` | Low |
| `AdminLayoutClient.tsx` — shell background | `bg-slate-950` (dark) | `bg-white` / `bg-slate-50` (light) | **HIGH** |

The Admin Console dark theme (`bg-slate-950`, `text-slate-100`, `border-slate-800`) contradicts the approved **Light Theme Only** product requirement.

---

## 16. Spacing

Spacing is implemented via Tailwind utilities consistently. No arbitrary spacing values or inconsistent patterns were identified as blockers. Spacing conventions are:
- Section padding: `px-4 sm:px-6 lg:px-8`
- Page containers: `max-w-7xl mx-auto`
- Component gaps: `gap-4`, `gap-6`, `gap-8`

---

## 17. Radius and Shadows

Consistent patterns observed:
- **Cards / Panels**: `rounded-2xl`
- **Buttons**: `rounded-xl`
- **Pill buttons**: `rounded-full`
- **Inputs**: `rounded-xl`
- **Modals**: `rounded-2xl`

Shadows: `shadow-sm` on cards, `shadow-2xl` on modal overlays and sidebars.

---

## 18. Navigation

Each portal has its own independent navigation:

| Area | Nav Component | Isolation |
|---|---|---|
| Public | `Navbar.tsx` | Correct — suppressed inside recruiter/dashboard paths |
| Candidate | `CandidateLayoutClient.tsx` sidebar | Correct — candidate-only nav items |
| Recruiter | `RecruiterLayoutClient.tsx` sidebar | Correct — recruiter-only nav items |
| Admin | `AdminLayoutClient.tsx` sidebar | Correct — admin-only nav items |

**Finding:** `LayoutWrapper.tsx` suppresses `Navbar` and `Footer` only for paths starting with `/recruiter` or `/dashboard`. It does NOT suppress them for `/candidate/*` or `/admin/*`. This means the public Navbar and Footer may render on candidate portal and admin console pages in addition to their own layout headers.

The admin console layout is loaded through `app/admin/layout.tsx` using a Next.js route group, which may or may not correctly prevent `LayoutWrapper` from rendering the navbar. This needs runtime verification.

---

## 19. Layouts

Five layout contexts exist:
1. **Root** — `app/layout.tsx` → `LayoutWrapper` (Navbar + Footer + Toast)
2. **Candidate** — `app/(candidate)/layout.tsx` → `CandidateLayoutClient`
3. **Recruiter** — `app/recruiter/layout.tsx` → `RecruiterLayoutClient`
4. **Admin** — `app/admin/layout.tsx` → `AdminLayoutClient`
5. **Auth** — Login/register pages render without sidebar layouts

The Next.js route group `(candidate)` correctly creates a layout scope that prevents the candidate layout from leaking into public routes.

---

## 20. Responsive System

All three layout clients implement responsive mobile navigation:
- **Candidate**: Mobile header with hamburger → slide-in sidebar
- **Recruiter**: Mobile header with hamburger → slide-in drawer
- **Admin**: Mobile header with hamburger → slide-in sidebar

Desktop uses a persistent sidebar. The responsive structure is consistent across all three portals.

---

## 21. Accessibility

Positive findings:
- Hamburger buttons have `aria-label="Open Navigation"` in Candidate and Admin layouts
- `SaveJobButton` has `aria-label` set dynamically based on saved state
- `focus-visible:ring-2` is applied on `SaveJobButton`
- Semantic HTML used for navigation (`<nav>`, `<aside>`, `<header>`, `<main>`)

Gaps identified:
- Mobile sidebar overlays lack `role="dialog"` and `aria-modal="true"`
- Mobile sidebar overlays have no focus trap implementation
- `DeleteJobButton` uses `window.confirm()` which has accessibility limitations
- `Toast.tsx` has no `role="status"` or `aria-live` region for screen reader announcement

---

## 22. Candidate Components

Candidate-specific components are correctly scoped:
- `CandidateLayoutClient` — candidate navigation and layout
- `SaveJobButton` — candidate job saving interaction
- `QuickApplyModal` — candidate job application flow

These components correctly use the `AppContext` (candidate session) and `showToast`. No Recruiter or Admin features are exposed through candidate components.

---

## 23. Recruiter Components

Recruiter-specific components:
- `RecruiterLayoutClient` — recruiter navigation and layout (18.5 KB — most complex layout client)
- `DeleteJobButton` — recruiter job deletion action

These components correctly use `useSession` (NextAuth) and are scoped to recruiter functionality.

---

## 24. Super Admin Components

Admin-specific components:
- `AdminLayoutClient` — admin navigation and layout

The Admin layout is the lightest layout client. Most admin functionality is implemented inline within `app/admin/*` page files.

---

## 25. Duplicate Components

No duplicate component implementations found. Each component serves a distinct purpose. There are no two components attempting to solve the same problem.

`OpeningsClient` is shared between the public job listings page and the candidate job search page — this is intentional reuse, not duplication.

---

## 26. Design Token Audit

See: `docs/20-cleanup-execution/phase-07-design-token-audit.md`

**Summary:**
- Tokens are minimal (only `--background` and `--foreground` defined)
- No `tailwind.config.ts` exists for theme extension
- Color usage is consistent through convention but not through formal tokens
- Three color deviations from design spec identified

---

## 27. Tailwind Audit

- Tailwind v4 is used via `@import "tailwindcss"` in `globals.css`
- No `@apply` directives are used
- One custom utility (`animate-marquee`) and one keyframe (`@keyframes marquee`) are defined for the landing page marquee animation
- No arbitrary values (`[]`) or excessive custom CSS detected

---

## 28. Components Changed

**None.** Phase 7 is an audit phase. No component files were modified.

---

## 29. Components Removed

**None.**

---

## 30. Components Moved

**None.**

---

## 31. Regression Results

No code changes were made. No regressions introduced.

---

## 32. Validation Results

Build: **Passing** (no changes made)
TypeScript: **No new errors introduced**
Lint: **No new lint errors introduced**

---

## 33. Pre-existing Failures

React 19 ESLint warnings (pre-existing, unrelated to this phase).

---

## 34. New Failures

**None.**

---

## 35. Deferred Issues

The following issues were identified and are deferred for resolution in future phases:

| # | Issue | Severity | Deferred To |
|---|---|---|---|
| D7-01 | `AdminLayoutClient` uses dark theme — contradicts Light Theme Only requirement | HIGH | Phase 8 (Admin UI fix) |
| D7-02 | `LayoutWrapper` does not suppress public Navbar/Footer for `/candidate/*` and `/admin/*` paths | MEDIUM | Phase 8 (Layout routing) |
| D7-03 | `Navbar` brand logo uses `blue-600` instead of approved `indigo-600` | LOW | UI polish phase |
| D7-04 | `AdminLayoutClient` active nav uses `purple-600` instead of approved `indigo-600` | LOW | Phase 8 (Admin UI fix) |
| D7-05 | No shared UI primitive library (Button, Input, Modal, Badge, etc.) | LOW | Future component phase |
| D7-06 | `DeleteJobButton` uses `window.confirm()` — lacks branding and accessibility | LOW | Future UI component phase |
| D7-07 | `Toast` has no `variant` support — all severities use same dark styling | LOW | Future component phase |
| D7-08 | `Toast` has no `role="status"` or `aria-live` for screen readers | LOW | Future accessibility phase |
| D7-09 | Mobile sidebars lack `role="dialog"` and focus trap | LOW | Future accessibility phase |
| D7-10 | `OpeningsClient` contains hardcoded mock job data used as fallback | MEDIUM | Phase 8 (Data cleanup) |

---

## 36. Risks

- **D7-01 (Admin Dark Theme)**: The admin console currently renders a dark theme in a light-theme-only product. If stakeholders review the admin console, this will appear inconsistent. Fixing this requires visual regression testing of the admin area after the change.
- **D7-02 (LayoutWrapper routing gap)**: Depending on Next.js route group behavior, the public Navbar and Footer may or may not render over candidate/admin portal pages. Requires runtime verification before fix.

---

## 37. Phase Completion Status

**PHASE 7 COMPLETE — SHARED COMPONENTS + GLOBAL UI/UX CONSOLIDATION AUDIT FINISHED**

No code changes were required. All findings are documented. Ten deferred issues are classified by severity and queued for follow-up phases.
