# Screen Implementation Matrix

| Role | Screen | Route | Page File | Main Component | APIs | Model | Auth | RBAC | Status |
|---|---|---|---|---|---|---|---|---|---|
| Candidate | Profile Editor | `/candidate/profile` | `profile/page.tsx` | Profile Client | `/api/candidates` | Candidate | Cookie | Candidate | FULLY IMPLEMENTED |
| Candidate | Saved Jobs | `/candidate/saved` | `saved/page.tsx` | Saved Jobs Client | `/api/candidates/saved-jobs` | Candidate | Cookie | Candidate | FULLY IMPLEMENTED |
| Recruiter | Dashboard | `/recruiter` | `page.tsx` | Recruiter Dashboard Client | `/api/jobs` | Job | NextAuth | Recruiter | FULLY IMPLEMENTED |
| Super Admin | Verification | `/admin/verification` | `verification/page.tsx` | Verification Queue | `/api/verification` | VerificationRequest | NextAuth | Super Admin | FULLY IMPLEMENTED |
