# Career77 — Implementation Plan: Saved Jobs

## Phase A — Database
*   **Task**: Update `Candidate` model to support `savedJobs` schema property.
*   **Dependencies**: None.
*   **Files**: `models/Candidate.ts`

## Phase B — Backend & API
*   **Task**: Build `/api/candidates/saved-jobs` toggle endpoints.
*   **Dependencies**: Database.
*   **Files**: `app/api/candidates/saved-jobs/route.ts`

## Phase C — Frontend
*   **Task**: Implement Saved Job toggle buttons in job cards and saved tab views.
*   **Dependencies**: API.
*   **Files**: `app/(candidate)/candidate/saved/page.tsx`, `components/JobDetailInteractive.tsx`
