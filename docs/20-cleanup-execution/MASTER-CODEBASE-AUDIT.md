# Career77 Master Codebase Audit

**Audit Date:** 2026-07-23
**Codebase State:** ~42% implemented
**Framework:** Next.js 15 App Router + TypeScript + MongoDB + Mongoose + NextAuth + Tailwind CSS v4 + Cloudinary

---

## 1. Executive Summary

Career77 is a job platform approximately 42% implemented. The core authentication architecture, all three role portals (Candidate, Recruiter, Super Admin), and the fundamental CRUD layer for Jobs, Applications, Interviews, Companies, and Candidates are working. The implementation correctly follows the approved three-role product model.

**Critical issues requiring immediate attention:**
1. `PUT /api/cms` has no authentication — anyone can overwrite website content
2. `GET/POST /api/pipeline` has no authentication — open to public
3. Billing webhook is a non-functional stub
4. Recruiter dashboard calls a superadmin-only API (silent failure)
5. Admin console renders in dark theme — violates Light Theme Only requirement

The project preserves working functionality throughout and should not be rebuilt. Focused targeted fixes and missing feature implementations will bring the platform to production-ready state.

---

## 2. Current Implementation Status

| Area | Estimated % | Status |
|---|---|---|
| Public / Marketing | 85% | Mostly complete |
| Authentication | 80% | Working, minor gaps |
| Candidate Portal | 70% | All screens built, edge cases missing |
| Recruiter Portal | 65% | All screens built, gaps in subscriptions/pipeline |
| Super Admin Console | 60% | All screens built, billing/audit gaps |
| API Layer | 55% | 35+ endpoints. 3 security issues. Billing stub. |
| Database Models | 65% | 15 models. 2 unused. Auth linking gap. |
| UI/UX | 50% | Design system partially aligned. Admin dark theme. |
| Service Layer | 10% | No service abstraction. All logic in routes. |
| Paid Training | 0% | Not started |
| Email Notifications | 0% | Not started |
| Messaging | 0% | Not started |

---

## 3. Repository Structure

```
career77/
├── app/                        # Next.js App Router
│   ├── (candidate)/            # Candidate portal (layout isolation)
│   ├── admin/                  # Super Admin Console
│   ├── api/                    # 17 API route directories
│   ├── companies/              # Public company pages
│   ├── jobs/                   # Legacy public job pages
│   ├── openings/               # Public job search pages (duplicate concern)
│   ├── recruiter/              # Recruiter portal
│   ├── login/                  # Candidate login
│   ├── register/               # Candidate registration
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/                 # 15 shared/role-specific components (flat)
├── context/                    # AppContext (candidate state)
├── docs/                       # Product and architecture documentation
├── lib/                        # db, auth, cloudinary, matching
├── models/                     # 15 Mongoose models
├── public/                     # Static assets
├── middleware.ts               # Route protection
└── next.config.ts
```

---

## 4. Folder Structure Audit

**Classification: MOSTLY CLEAN**

Issues:
- `/dashboard/settings` is a duplicate of `/candidate/settings` (unreachable)
- `/jobs` and `/openings` are duplicate public job search routes — canonical route needs decision
- `components/` is a flat directory with no subdirectory organization
- `app/api/training/` is an empty directory (no route.ts)
- `LayoutWrapper` does not exclude public Navbar/Footer for `/candidate/*` and `/admin/*`

See: `docs/20-cleanup-execution/audit-folder-structure.md`

---

## 5. Public / Marketing Audit

| Screen | Route | Status |
|---|---|---|
| Landing Page | `/` | ✅ Implemented — marquee, hero, how-it-works |
| Job Search | `/openings` | ✅ Implemented — filters, pagination, SaveJobButton |
| Job Search (alt) | `/jobs` | ⚠️ Duplicate route — decision required |
| Job Detail | `/openings/[jobId]` | ✅ Implemented — QuickApplyModal, SaveJobButton |
| Company Profile | `/companies/[slug]` | ✅ Implemented |
| Company List | `/companies` | ✅ Implemented |

**Issues:**
- `OpeningsClient` falls back to hardcoded mock jobs when DB returns empty
- Navbar uses `blue-600` (should be `indigo-600`)
- Some pages lack descriptive `<meta description>` tags

---

## 6. Authentication Audit

| Flow | Route | Method | Status |
|---|---|---|---|
| Candidate Registration | `/register` | POST `/api/candidates` | ✅ OTP + custom cookie |
| Candidate OTP Login | `/login` | POST `/api/candidates/login` | ✅ |
| Candidate Logout | — | POST `/api/candidates/logout` | ✅ |
| Recruiter Registration | `/recruiter/register` | POST `/api/recruiter/register` | ✅ |
| Recruiter Login | `/recruiter/login` | NextAuth credentials | ✅ |
| Super Admin Login | `/admin/login` | NextAuth credentials | ✅ |
| Password Reset | — | — | ❌ Missing |
| Email Verification | — | — | ❌ Missing |

**Auth systems:** Two parallel systems — NextAuth (Recruiters/Admins) + custom HMAC cookie (Candidates). This is a deliberate design decision and works correctly.

See: `docs/20-cleanup-execution/audit-authorization.md`

---

## 7. Candidate Portal Audit

| Screen | Route | Status | Notes |
|---|---|---|---|
| Dashboard | `/candidate/*` (via redirect) | ✅ | Redirects to profile |
| Profile | `/candidate/profile` | ✅ | Edit all profile fields |
| Resume | `/candidate/resume` | ✅ | Cloudinary upload |
| Job Search | `/candidate/jobs` | ✅ | Filters, save jobs |
| Applications | `/candidate/applications` | ✅ | List with status |
| Interviews | `/candidate/interviews` | ✅ | List upcoming interviews |
| Settings | `/candidate/settings` | ✅ | Basic settings |
| Saved Jobs | `/candidate/saved` | ✅ | Saved job list |
| Notifications | `/dashboard/notifications` | ⚠️ | Data model works, full UI review needed |
| Paid Training | — | ❌ | Not implemented |

**Ownership:** Server-side enforced via `getCandidateSession()` cookie. Candidate A cannot access Candidate B's data. ✅

---

## 8. Recruiter Portal Audit

| Screen | Route | Status | Notes |
|---|---|---|---|
| Dashboard | `/recruiter` | ⚠️ | Calls admin-only analytics API — returns 403 |
| Jobs | `/recruiter/jobs` | ✅ | List, create, edit, close, delete |
| Post Job | `/recruiter/post-job` | ✅ | Create form |
| Job Applicants | `/recruiter/jobs/[jobId]/applicants` | ✅ | Per-job view |
| Applicants | `/recruiter/candidates` | ✅ | All applicants across jobs |
| Pipeline | `/recruiter/pipeline` | ⚠️ | Stages displayed but not linked to Application status |
| Interviews | `/recruiter/interviews` | ✅ | List, schedule |
| Company | `/recruiter/company` | ✅ | Company profile management |
| Analytics | `/recruiter/analytics` | ⚠️ | Uses admin analytics endpoint |
| Settings | `/recruiter/settings` | ✅ | Settings form |
| Pending | `/recruiter/pending` | ✅ | Awaiting verification page |

**Company Isolation:** Recruiter can only see jobs where `recruiterId` matches. Application ownership is enforced through job-recruiter relationship. ✅

---

## 9. Super Admin Console Audit

| Screen | Route | Status | Notes |
|---|---|---|---|
| Dashboard | `/admin` | ✅ | Platform metrics (hardcoded revenue) |
| Users | `/admin/users` | ✅ | Candidate list |
| Companies | `/admin/companies` | ✅ | Company list |
| Jobs | `/admin/jobs` | ✅ | Job list with status |
| Verification | `/admin/verification` | ✅ | Approve/reject verification requests |
| Analytics | `/admin/analytics` | ⚠️ | Real data except hardcoded revenue |
| CMS | `/admin/cms` | ⚠️ | Editor works, write API has no auth |
| Billing | `/admin/billing` | ⚠️ | Subscription list. Webhook stub. |
| Support | `/admin/support` | ✅ | Ticket list, status updates |
| Settings | `/admin/settings` | ✅ | Settings page |

**Missing admin screens:** Subscription plan configuration, Audit log viewer, Invoice management.

**Admin Role Protection:** All admin APIs correctly check for `superadmin` role via `getServerSession()`. Except `PUT /api/cms` — no auth at all. ⚠️

---

## 10. UI/UX Audit

**Theme:** Light Theme Only — PARTIALLY COMPLIANT. Admin console violates this with dark theme.

| Area | Status | Issues |
|---|---|---|
| Typography | ✅ | Inter + Outfit correctly loaded and applied |
| Primary Color | ⚠️ | `indigo-600` used in most places. Navbar uses `blue-600`. Admin uses `purple-600`. |
| Spacing | ✅ | Consistent Tailwind conventions |
| Cards | ✅ | `rounded-2xl shadow-sm` consistent |
| Buttons | ✅ | Consistent pattern — no shared component |
| Forms | ✅ | Consistent inline patterns |
| Loading States | ⚠️ | Candidate layout has spinner. Others inline. |
| Empty States | ⚠️ | Inconsistent, mostly inline text |
| Error States | ⚠️ | Inconsistent, mostly try/catch with toast |
| Modals | ⚠️ | QuickApplyModal exists. DeleteJobButton uses `window.confirm()`. |
| Toast | ⚠️ | No variant support. No aria-live. |
| Responsive | ✅ | Mobile sidebars implemented in all three layouts |
| Accessibility | ⚠️ | Aria-labels on some elements. No focus trap on mobile sidebars. |
| Admin Theme | 🔴 | Dark theme (`bg-slate-950`) — violates Light Theme Only |

---

## 11. Component Audit

| Component | Role | Issues |
|---|---|---|
| `AdminLayoutClient` | Admin | Dark theme violation |
| `CandidateLayoutClient` | Candidate | No issues |
| `RecruiterLayoutClient` | Recruiter | No issues |
| `Navbar` | Public | `blue-600` brand color |
| `Footer` | Public | No issues |
| `LayoutWrapper` | Root | Does not exclude `/candidate/*` `/admin/*` from public nav |
| `Toast` | Global | No variant, no aria-live |
| `OpeningsClient` | Public/Candidate | Hardcoded mock data fallback |
| `QuickApplyModal` | Feature | Works correctly |
| `SaveJobButton` | Feature | Works correctly |
| `DeleteJobButton` | Feature | Uses `window.confirm()` |
| `HomeSearchFilter` | Feature | No issues |
| `HowItWorks` | Feature | No issues |
| `JobDetailInteractive` | Feature | No issues |

**No duplicate components found.**
**No shared UI primitive library exists.** (Button, Input, Modal, Badge, etc. are all inline)

See: `docs/20-cleanup-execution/audit-components.md`

---

## 12. API Audit

**35+ endpoints implemented. No service layer. All business logic in route handlers.**

**Critical API Issues:**
| Issue | Severity |
|---|---|
| `PUT /api/cms` — no auth | 🔴 P0 |
| `GET/POST /api/pipeline` — no auth | 🔴 P0 |
| `POST /api/billing/webhook` — stub only | 🔴 P1 |
| `POST /api/verification` — wrong company lookup | 🔴 P1 |
| Analytics — hardcoded revenue | ⚠️ P1 |
| Recruiter dashboard → admin-only analytics | ⚠️ P1 |

See: `docs/20-cleanup-execution/audit-api.md`

---

## 13. Model Audit

**15 Mongoose models implemented.**

| Model | Status | Key Issue |
|---|---|---|
| User | ✅ Working | No status field |
| Candidate | ✅ Working | `userId` optional breaks support |
| Recruiter | ✅ Working | Redundant password |
| Company | ✅ Working | No recruiter relationship |
| Job | ✅ Working | Duplicate experience fields |
| Application | ✅ Working | Limited status enum |
| Interview | ✅ Working | No companyId scope |
| PipelineStage | ⚠️ Partial | No auth, unlinked to Application |
| Subscription | ⚠️ Partial | Hardcoded plan enum |
| SupportTicket | ⚠️ Partial | Missing statuses, assignedTo |
| Notification | ✅ Working | Candidate only |
| CmsContent | ⚠️ Partial | No auth on write |
| AuditLog | 🔴 Unused | Model exists, never written to |
| Invoice | 🔴 Unused | Model exists, billing stub |
| VerificationRequest | ⚠️ Partial | Wrong company lookup in POST |

See: `docs/20-cleanup-execution/audit-models-database.md`

---

## 14. Database Audit

**Database:** MongoDB via Mongoose
**Indexes:** Core indexes in place (email unique, compound indexes on Application)
**Text Search:** MongoDB text index on Job (title + description) ✅
**Pagination:** Cursor-based pagination on `/api/jobs` ✅. Admin tables lack pagination.

**Key database relationship gaps:**
- Company → Recruiters reverse relationship missing
- AuditLog model never receives writes
- Pipeline stages not linked to Application status

---

## 15. Authentication Audit

**System 1:** NextAuth.js (JWT, 30-day session) — Recruiter + Super Admin
**System 2:** Custom HMAC cookie (`candidate_session`) — Candidate
**Status:** Both systems work correctly. This dual-system is a deliberate architectural choice.

**Gaps:**
- Password reset flow not implemented
- Email verification not implemented
- OTP expiry UI feedback incomplete

---

## 16. Authorization Audit

**Middleware:** Correctly protects all three role portals
**API:** Most endpoints enforce role and ownership correctly
**Critical gap:** `PUT /api/cms` and `GET/POST /api/pipeline` have no authorization

See: `docs/20-cleanup-execution/audit-authorization.md`

---

## 17. Role Boundary Audit

| Boundary | Status |
|---|---|
| Guest → Candidate routes | ✅ Redirected to login |
| Guest → Recruiter routes | ✅ Redirected to recruiter login |
| Guest → Admin routes | ✅ Redirected to admin login |
| Candidate → Recruiter routes | ✅ Blocked (no NextAuth token) |
| Recruiter → Admin routes | ✅ Blocked (role !== superadmin) |
| Unverified Recruiter → Portal | ✅ Redirected to /pending |
| Cross-candidate data access | ✅ Server enforces via candidateId from cookie |
| Cross-recruiter job access | ✅ Server enforces via recruiterId on Job |

---

## 18. Documentation vs Code Matrix

| Feature | Documentation | Code | Working | Partial | Missing | Conflict |
|---|---|---|---|---|---|---|
| Candidate Registration | ✅ | ✅ | ✅ | — | — | — |
| Candidate Profile | ✅ | ✅ | ✅ | — | — | — |
| Candidate Resume | ✅ | ✅ | ✅ | — | — | — |
| Candidate Job Search | ✅ | ✅ | ✅ | — | — | — |
| Candidate Applications | ✅ | ✅ | ✅ | — | — | — |
| Candidate Interviews | ✅ | ✅ | ✅ | — | — | — |
| Candidate Settings | ✅ | ✅ | ✅ | — | — | — |
| Candidate Paid Training | ✅ | ❌ | — | — | ✅ | — |
| Recruiter Registration | ✅ | ✅ | ✅ | — | — | — |
| Recruiter Dashboard | ✅ | ✅ | — | ✅ | — | Analytics API conflict |
| Recruiter Jobs | ✅ | ✅ | ✅ | — | — | — |
| Recruiter Applicants | ✅ | ✅ | ✅ | — | — | — |
| Recruiter Pipeline | ✅ | ✅ | — | ✅ | — | Not synced to Application status |
| Recruiter Interviews | ✅ | ✅ | ✅ | — | — | — |
| Recruiter Company | ✅ | ✅ | ✅ | — | — | — |
| Recruiter Subscriptions | ✅ | ✅ | — | ✅ | — | Billing webhook stub |
| Admin Dashboard | ✅ | ✅ | — | ✅ | — | Hardcoded revenue |
| Admin Users | ✅ | ✅ | ✅ | — | — | — |
| Admin Companies | ✅ | ✅ | ✅ | — | — | — |
| Admin Verification | ✅ | ✅ | — | ✅ | — | Company lookup bug |
| Admin CMS | ✅ | ✅ | — | ✅ | — | No auth on write |
| Admin Billing | ✅ | ✅ | — | ✅ | — | Stub webhook |
| Admin Support | ✅ | ✅ | ✅ | — | — | — |
| Admin Analytics | ✅ | ✅ | — | ✅ | — | Hardcoded data |
| Admin Audit Logs | ✅ | ❌ | — | — | ✅ | Model exists, no API writes |
| Payments | ✅ | ❌ | — | ✅ | — | Stub only |
| Messaging | ✅ | ❌ | — | — | ✅ | Not started |
| Email Notifications | ✅ | ❌ | — | — | ✅ | Not started |
| Light Theme | ✅ | ⚠️ | — | ✅ | — | Admin console uses dark theme |

---

## 19. Missing Features

1. Paid Training system (entire feature area)
2. Real payment gateway integration
3. Recruiter subscription enforcement / feature gating
4. Email transactional notifications
5. Candidate → Recruiter messaging
6. Application pipeline status synchronization
7. Admin audit log viewer and writes
8. Admin invoice management
9. Admin user suspension/deactivation
10. Password reset flow
11. Email verification

---

## 20. Broken Features

1. `PUT /api/cms` — no auth (P0)
2. `GET/POST /api/pipeline` — no auth (P0)
3. Recruiter dashboard analytics (403 from admin-only API) (P1)
4. Verification POST — wrong company lookup (P1)
5. Billing webhook — stub, no payment processing (P1)
6. Support ticket creation for Quick Apply candidates (P1)

---

## 21. Duplicate Code

| Item | Location |
|---|---|
| `/dashboard/settings` + `/candidate/settings` | app/(candidate)/dashboard/settings/ vs candidate/settings/ |
| `/jobs` + `/openings` | app/jobs/ and app/openings/ |
| Recruiter `password` field | Both `User.password` and `Recruiter.password` store same hashed password |

No duplicate React components found.

---

## 22. Dead Code

| Item | Location |
|---|---|
| `AuditLog` model | `models/AuditLog.ts` — never written to |
| `Invoice` model | `models/Invoice.ts` — never used |
| `app/api/training/` | Empty directory |
| `/dashboard/settings` page | Unreachable in normal navigation |

---

## 23. Security Findings

| Finding | Severity | File |
|---|---|---|
| `PUT /api/cms` no authentication | 🔴 Critical | `app/api/cms/route.ts` |
| `POST /api/verification` wrong company | 🔴 High | `app/api/verification/route.ts` |
| `GET/POST /api/pipeline` no auth | 🔴 High | `app/api/pipeline/route.ts` |
| Billing webhook no signature verification | 🔴 High | `app/api/billing/webhook/route.ts` |
| Recruiter password redundant storage | ⚠️ Medium | `models/Recruiter.ts` |
| Candidate userId optional breaks auth path | ⚠️ Medium | `models/Candidate.ts`, `app/api/support/route.ts` |

---

## 24. Performance Findings

| Finding | Severity | Location |
|---|---|---|
| Admin tables lack pagination | Medium | Admin pages |
| NextAuth `jwt` callback hits DB on every refresh | Low | `app/api/auth/[...nextauth]/route.ts` |
| `GET /api/candidates` admin list — `.limit(50)` not enforced with pagination | Low | `app/api/candidates/route.ts` |

---

## 25. Folder Structure Findings

- Mostly clean Next.js App Router structure
- Two duplicate public job search routes need consolidation decision
- `components/` needs subdirectory organization
- `app/api/training/` is an empty directory

---

## 26. API Service Findings

- No service layer — all business logic in route handlers
- Acceptable for current scale but limits testability
- Priority extraction candidates: Jobs, Applications, Candidates services

---

## 27. Cleanup Recommendations

1. **Fix P0 security issues first** — CMS write auth, Pipeline auth
2. **Fix P1 bugs** — Analytics API conflict, Verification lookup, Billing webhook, Support ticket
3. **Fix Admin dark theme** — Light Theme Only violation
4. **Fix LayoutWrapper** — Suppress public Navbar for candidate/admin paths
5. **Remove mock data** from OpeningsClient
6. **Deduplicate routes** — jobs vs openings decision
7. **Remove dead settings duplicate**

---

## 28. Implementation Recommendations

1. Implement Paid Training (largest missing feature area)
2. Integrate real payment gateway (required for Training + Subscriptions)
3. Implement email notifications (required for recruiter approval, interview scheduling)
4. Implement Audit Log writes (required for production-grade admin)
5. Implement Invoice generation (required for billing)
6. Add password reset flow
7. Add messaging system

---

## 29. Priority Matrix

| Priority | Count | Items |
|---|---|---|
| P0 — Critical Security | 2 | CMS auth, Pipeline auth |
| P1 — Broken Functionality | 5 | Analytics, Webhook, Verification, Support, Revenue |
| P2 — Incorrect Behavior | 3 | Admin theme, LayoutWrapper, mock data |
| P3 — Missing Features | 8 | Training, Billing, Email, Messaging, Audit, Invoice, Suspend, Pipeline sync |
| P4 — Duplicate Code | 2 | Route duplicates |
| P5 — Folder Structure | 2 | Components org, route consolidation |
| P6 — Service Layer | 2 | Service extraction, Recruiter analytics API |
| P7 — UI/UX | 6 | Colors, Toast, Confirm dialog, Accessibility, Pagination |
| P8 — Performance | 2 | JWT callback, Admin pagination |

---

## 30. Safe Cleanup Roadmap

See: `docs/19-cleanup-roadmap/updated-cleanup-roadmap.md`

**Phase order:**
```
P0 (Security) → P1 (Bugs) → P2 (Product Violations) → P3 (Missing Features) → P4-P9
```

---

## 31. Risks

| Risk | Mitigation |
|---|---|
| Admin theme change may break admin UX for current users | Test admin console fully after light theme migration |
| Billing webhook implementation requires payment gateway credentials | Coordinate with payment provider before implementing |
| Paid Training requires new model + payment integration | Prerequisite: P1-02 billing webhook must be complete |
| Candidate `userId` fix may break existing Quick Apply candidates | Carefully migrate or handle both cases during fix |
| Pipeline status sync may change existing application statuses | Requires data migration plan |

---

## 32. Recommended Next Phase

**Immediate (before any new feature work):**
1. Fix `PUT /api/cms` — add superadmin auth check (30 min)
2. Fix `GET/POST /api/pipeline` — add recruiter/admin auth check (30 min)
3. Fix recruiter dashboard — create recruiter-scoped analytics endpoint (2 hours)
4. Fix admin dark theme — redesign AdminLayoutClient to light theme (4 hours)
5. Fix LayoutWrapper — add candidate/admin path exclusions (30 min)

**These five fixes should be executed as the next approved cleanup phase before any new feature development begins.**

---

*End of Career77 Master Codebase Audit*
