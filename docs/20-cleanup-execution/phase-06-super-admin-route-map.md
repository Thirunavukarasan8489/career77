# Phase 6 — Super Admin Route Map

## Admin Table
| Feature | Route | Page | Layout | API | Model | Status |
|---|---|---|---|---|---|---|
| Dashboard | `/admin` | `page.tsx` | `AdminLayout` | `/api/analytics` | `User` | Implemented |
| Users | `/admin/users` | `users/page.tsx` | `AdminLayout` | `/api/candidates` | `User` | Implemented |
| Companies | `/admin/companies` | `companies/page.tsx` | `AdminLayout` | `/api/companies` | `Company` | Implemented |
| Jobs | `/admin/jobs` | `jobs/page.tsx` | `AdminLayout` | `/api/jobs` | `Job` | Implemented |
| Verification | `/admin/verification` | `verification/page.tsx` | `AdminLayout` | `/api/verification` | `VerificationRequest` | Implemented |
| Analytics | `/admin/analytics` | `analytics/page.tsx` | `AdminLayout` | `/api/analytics` | `Job` | Implemented |
| CMS | `/admin/cms` | `cms/page.tsx` | `AdminLayout` | `/api/cms` | `CmsContent` | Implemented |
| Billing | `/admin/billing` | `billing/page.tsx` | `AdminLayout` | `/api/billing/webhook` | `Payment` | Implemented |
| Subscription Setup | `/admin/settings` | `settings/page.tsx` | `AdminLayout` | `/api/recruiter/settings` | `Subscription` | Implemented |
| Support | `/admin/support` | `support/page.tsx` | `AdminLayout` | `/api/support` | `SupportTicket` | Implemented |
| System Settings | `/admin/settings` | `settings/page.tsx` | `AdminLayout` | `/api/recruiter/settings` | `User` | Implemented |
