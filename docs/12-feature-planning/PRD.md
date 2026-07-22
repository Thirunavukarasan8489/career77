# Career77 — Product Requirements Document: Saved Jobs

## 1. Overview
The "Saved Jobs" feature allows authenticated candidates to bookmark job listings for subsequent review, simplifying candidate search workflows and improving application conversions.

## 2. Problem
Candidates find it difficult to keep track of interesting job listings they want to apply to later.

## 3. Goals
*   Provide a toggle action to bookmark job listings.
*   Display saved jobs inside candidate dashboards.

## 4. Non-Goals
*   Send alert notifications for saved jobs.

## 5. User Personas
*   Active candidate seeking streamlined application processes.

## 6. User Journey
Candidate saves job → Job renders inside candidate saved list.

## 7. Functional Requirements
*   **FR-001**: Save toggle on listings cards.
*   **FR-002**: Saved tab view in candidate settings.

## 8. Non-Functional Requirements
*   Page rendering under 300ms.
*   Light-theme aesthetic rules.

## 9. UX/UI Requirements
Standard bookmark button states.

## 10. Role and Permission Requirements
Restricted to candidate session credentials.

## 11. Data Requirements
Add `savedJobs` array to the `Candidate` schema in MongoDB.

## 12. API Requirements
Endpoints for toggle and listings views.

## 13. Security Requirements
Ensure user horizontal identity boundaries are enforced.

## 14. Notification Requirements
None.

## 15. Payment and Subscription Impact
No Payment Impact.

## 16. Audit Logging
Track bookmark save events inside admin log feeds.

## 17. Edge Cases
Closed job items indicate inactive states.

## 18. Acceptance Criteria
*   AC-001: Save toggle updates button.
*   AC-002: Curated list shows saved elements.

## 19. Success Metrics
*   Higher save-to-application conversions.

## 20. Dependencies
Candidate session API.

## 21. Risks
Low.

## 22. Implementation Plan
Update Candidate model -> Build API endpoints -> Add dashboard view.

## 23. Documentation Impact
Update candidate guides.

## 24. Rollout Plan
Gradual deployment.

## 25. Rollback Plan
Revert Vercel git commit.

## 26. Open Questions
None.

## 27. Approval Status
**Planned**
