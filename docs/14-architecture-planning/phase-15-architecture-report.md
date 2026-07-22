# Career77 — Phase 15 Architecture Report

## 1. Feature
Candidate Saved Jobs.

## 2. Phase 14 Verification
Verified that Phase 14 design specification returned a `DESIGN READY FOR ARCHITECTURE` decision.

## 3. Architecture Impact
Low impact. Minimal schema properties expansion.

## 4. Frontend Architecture
Integrates `SaveJobButton` client component and `/candidate/saved` server page list.

## 5. Backend Architecture
API route handler executes database atomic updates.

## 6. Database Design
Reuses existing `candidates` collection, adding a multi-key index on `savedJobs`.

## 7. API Design
Supports `POST` and `DELETE` requests under `/api/candidates/saved-jobs`.

## 8. Authentication
Session validation uses the cryptographic cookie helper `getCandidateSession`.

## 9. Authorization
Decrypted candidate session ID enforces tenant isolation.

## 10. RBAC
Candidate role only.

## 11. File Storage
None.

## 12. Notifications
None.

## 13. Messaging
None.

## 14. Payments
No Payment Impact.

## 15. Subscriptions
None.

## 16. Audit Logs
None.

## 17. Search
None.

## 18. Performance
Uses query indexes to guarantee response times under 200ms.

## 19. Caching
Dynamic dashboards are bypass-cached.

## 20. Security
Enforces array size capacity limit (50 items) to prevent database denial-of-service spamming threats.

## 21. Observability
Logs API toggle failures.

## 22. Dependencies
No new npm dependencies.

## 23. Environment Variables
None.

## 24. Migration Plan
New array properties initialized as empty lists automatically.

## 25. Rollout Plan
Standard Git deployment.

## 26. Rollback Plan
Roll back deploy commit via Vercel.

## 27. Implementation File Map
Detailed in `implementation-file-map.md`.

## 28. Architecture Decisions
Reusing Candidate model is preferred over creating a new `SavedJob` collection.

## 29. Open Questions
None.

## 30. Final Status
**ARCHITECTURE READY FOR IMPLEMENTATION**
