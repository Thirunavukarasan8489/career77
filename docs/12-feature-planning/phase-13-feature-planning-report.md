# Career77 — Phase 13 Feature Planning Report

## 1. Selected Feature
Candidate Saved Jobs.

## 2. Why This Feature
High candidate value, low complexity, and directly boosts job seeker engagement.

## 3. User Problem
Candidates cannot bookmark jobs, causing repeated searches and lost listings.

## 4. Business Value
Increases average application rates.

## 5. Primary User
Candidate.

## 6. User Journey
Toggle save -> View curated saved jobs in the dashboard list.

## 7. Functional Requirements
*   FR-001: Save Toggle button.
*   FR-002: Curated list rendering.

## 8. UX/UI Requirements
Clean toggle icon, light theme only, mobile-responsive layout.

## 9. Architecture Impact
Uses existing candidate cookie session parser.

## 10. Database Impact
Adds a `savedJobs` array of Job ObjectIds to the `Candidate` schema.

## 11. API Impact
Adds `POST /api/candidates/saved-jobs` and `DELETE /api/candidates/saved-jobs/[jobId]`.

## 12. Security Impact
Enforces user ownership, preventing session cross-pollution.

## 13. RBAC Impact
Candidate only.

## 14. Notification Impact
None.

## 15. Payment Impact
No Payment Impact.

## 16. Subscription Impact
None.

## 17. Audit Log Impact
None.

## 18. Risks
Low.

## 19. Dependencies
Candidate session handler.

## 20. Success Metrics
Conversion rates of saved-to-applied jobs.

## 21. Implementation Plan
Phase A (Database) -> Phase B (API Endpoints) -> Phase C (UI Views).

## 22. Documentation Impact
Update candidate user guides.

## 23. Rollout Plan
Standard Git pull-request build pipeline.

## 24. Rollback Plan
Roll back deploy commit via Vercel dashboard.

## 25. Open Questions
None.

## 26. Final Recommendation
**FEATURE READY FOR DESIGN**
