# Career77 — Backend Architecture: Saved Jobs

## API Route Handlers
*   `app/api/candidates/saved-jobs/route.ts`: Manages toggle actions (`POST` to save, `DELETE` to unsave).

## Database Queries
*   **Create/Save**: `Candidate.findByIdAndUpdate(candidateId, { $addToSet: { savedJobs: jobId } })`
*   **Remove/Unsave**: `Candidate.findByIdAndUpdate(candidateId, { $pull: { savedJobs: jobId } })`
