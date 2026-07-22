# Audit — Authorization

## Authentication Systems (Two Parallel Systems)

Career77 uses TWO parallel authentication systems:

### System 1: NextAuth.js (JWT strategy)
- Used by: **Recruiters**, **Super Admins**
- Token stored: HttpOnly JWT cookie (managed by NextAuth)
- Session access: `getServerSession(authOptions)` server-side, `useSession()` client-side
- Role stored in token: `token.role` = `"recruiter"` | `"superadmin"`

### System 2: Custom HMAC Cookie (Candidate)
- Used by: **Candidates**
- Token stored: `candidate_session` HttpOnly cookie
- Signing: HMAC-SHA256 with `NEXTAUTH_SECRET`
- Session access: `getCandidateSession()` from `lib/auth.ts`
- Role stored in token: `"candidate"`

---

## Frontend Route Protection (Middleware)

**File:** `middleware.ts`

| Route Pattern | Protection | Role Check | Status |
|---|---|---|---|
| `/candidate/*` | candidate_session cookie OR NextAuth candidate token | candidate role | ✅ Correct |
| `/dashboard/*` | Same as candidate | candidate role | ✅ Correct (legacy support) |
| `/recruiter/*` (except login/register/pending) | NextAuth JWT required | recruiter or superadmin | ✅ Correct |
| `/recruiter/*` with recruiter role | Company verification check | `token.companyVerified` | ✅ Correct |
| `/admin/*` (except login) | NextAuth JWT required | superadmin only | ✅ Correct |

**Middleware Config Matcher:**
```
["/candidate/:path*", "/dashboard/:path*", "/recruiter/:path*", "/admin/:path*"]
```

**Gap:** `/candidate/*` is protected in middleware correctly. However, the `LayoutWrapper` does not hide the public Navbar/Footer for `/candidate/*` or `/admin/*` paths — this is a UI layout issue, not a security issue.

---

## Backend API Authorization

### Candidate APIs
| Endpoint | Auth Check | Ownership Check | Status |
|---|---|---|---|
| `GET /api/candidates` (own profile) | `getCandidateSession()` cookie | candidateId from cookie (server) | ✅ Correct |
| `PUT /api/candidates` | `verifyCandidateSession()` cookie | candidateId from cookie (server) | ✅ Correct |
| `GET /api/applications` (candidate) | `getCandidateSession()` cookie | candidateId from cookie | ✅ Correct |
| `GET /api/notifications` | `verifyCandidateSession()` cookie | candidateId from cookie | ✅ Correct |
| `GET/POST /api/candidates/saved-jobs` | cookie-based | candidateId from cookie | ✅ Correct |

### Recruiter APIs
| Endpoint | Auth Check | Ownership Check | Status |
|---|---|---|---|
| `POST /api/jobs` | `getServerSession()` | role = recruiter/superadmin | ✅ Correct |
| `PUT/DELETE /api/jobs/[jobId]` | `getServerSession()` | recruiterId on job matches session | ✅ Correct |
| `GET /api/applications` (recruiter) | `getServerSession()` | jobs scoped to recruiterId | ✅ Correct |
| `POST /api/interviews` | `getServerSession()` | role = recruiter, then Recruiter.findOne({userId}) | ✅ Correct |

### Admin APIs
| Endpoint | Auth Check | Role Check | Status |
|---|---|---|---|
| `GET /api/analytics` | `getServerSession()` | superadmin only | ✅ Correct |
| `GET /api/verification` | `getServerSession()` | superadmin only | ✅ Correct |
| `PATCH /api/verification` | `getServerSession()` | superadmin only | ✅ Correct |
| `GET /api/support` | `getServerSession()` | superadmin only | ✅ Correct |
| `PATCH /api/support` | `getServerSession()` | superadmin only | ✅ Correct |

### ⚠️ Missing/Weak Authorization

| Endpoint | Issue | Severity |
|---|---|---|
| `PUT /api/cms` | **No auth check** — anyone can update CMS content | 🔴 CRITICAL |
| `GET /api/pipeline` | No auth — anyone can read pipeline stages | ⚠️ Medium |
| `POST /api/pipeline` | No auth — anyone can create pipeline stages | ⚠️ Medium |
| `GET /api/candidates` (admin list) | Returns all candidates to superadmin/recruiter — correct, but no pagination limit is enforced consistently | Low |
| `POST /api/applications` | Anonymous application is allowed by design — must be explicitly documented | Low |

---

## Role Boundary Verification

| Scenario | Expected | Implementation | Status |
|---|---|---|---|
| Guest → `/candidate/*` | Redirect to `/login` | Middleware redirects | ✅ |
| Guest → `/recruiter/*` | Redirect to `/recruiter/login` | Middleware redirects | ✅ |
| Guest → `/admin/*` | Redirect to `/admin/login` | Middleware redirects | ✅ |
| Candidate cookie → `/recruiter/*` | Redirect | NextAuth token absent → redirect | ✅ |
| Recruiter JWT → `/admin/*` | Redirect | role !== 'superadmin' → redirect | ✅ |
| Recruiter (unverified) → `/recruiter/*` | Redirect to pending | `!token.companyVerified` → pending | ✅ |
| Candidate → Admin API | Forbidden | No candidate session matches admin check | ✅ |
| Recruiter → Admin API | Forbidden | role !== 'superadmin' check | ✅ |
| Anyone → `PUT /api/cms` | Should be forbidden | **No check — OPEN** | 🔴 |

---

## Security Findings Summary

| Finding | Severity | Location |
|---|---|---|
| `PUT /api/cms` has no authentication or authorization | 🔴 Critical | `app/api/cms/route.ts` |
| `POST /api/verification` uses `Company.findOne({})` — finds wrong company | 🔴 High | `app/api/verification/route.ts` |
| `POST /api/billing/webhook` is a stub — no signature verification | 🔴 High | `app/api/billing/webhook/route.ts` |
| Analytics response includes hardcoded `monthlyRevenue: 49999` | ⚠️ Medium | `app/api/analytics/route.ts` |
| `GET/POST /api/pipeline` has no authentication | ⚠️ Medium | `app/api/pipeline/route.ts` |
| Recruiter password stored redundantly in both User and Recruiter models | ⚠️ Medium | `models/Recruiter.ts` |
| Candidate without `userId` cannot raise support tickets | ⚠️ Medium | `app/api/support/route.ts` |
| Admin console uses dark theme (non-security but product rule violation) | Low | `components/AdminLayoutClient.tsx` |
