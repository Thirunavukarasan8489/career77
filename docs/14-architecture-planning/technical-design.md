# Career77 — Feature Technical Design: Saved Jobs

## 1. Feature Overview
Specifies database additions, endpoint requirements, component structures, and validations for saved jobs.

## 2. Architecture Impact
Low impact. Reuses existing database helper setups.

## 3. System Flow
Client action → API Controller → Decrypt Session → Update Candidate in MongoDB → Response.

## 4. Frontend Architecture
Integrates `SaveJobButton` client component and `/candidate/saved` server page list.

## 5. Backend Architecture
API router handler executes database atomic updates.

## 6. File Structure
*   `app/api/candidates/saved-jobs/route.ts` [NEW]
*   `app/(candidate)/candidate/saved/page.tsx` [NEW]
*   `components/SaveJobButton.tsx` [NEW]
*   `models/Candidate.ts` [MODIFY]

## 7. Database Design
Adds `savedJobs` Array properties mapping ObjectIds.

## 8. Mongoose Model Design
Extends standard candidate model properties.

## 9. Index Strategy
Multikey index configured.

## 10. API Contract
Supports `POST` (save) and `DELETE` (unsave) endpoints.

## 11. Validation
Limits saves to 50 active items per candidate.

## 12. Authentication
Requires a candidate session.

## 13. Authorization
Enforces object ownership.

## 14. RBAC
Candidate role only.

## 15. File Storage
None.

## 16. Notifications
None.

## 17. Messaging
None.

## 18. Payments
No Payment Impact.

## 19. Subscriptions
None.

## 20. Audit Logs
None.

## 21. Search
None.

## 22. Pagination
Dashboard tab paginates lists.

## 23. Performance
Queries are indexed.

## 24. Caching and ISR
Tab views are dynamic.

## 25. Error Handling
Descriptive error messages are returned.

## 26. Observability
Logs API failures.

## 27. Security Threat Model
Enforces cryptographic token validations.

## 28. External Dependencies
None.

## 29. Environment Variables
None.

## 30. Migration Plan
New array properties initialized as empty lists automatically.

## 31. Rollout Plan
Standard deployment.

## 32. Rollback Plan
Roll back deploy commit via Vercel.

## 33. Open Questions
None.
