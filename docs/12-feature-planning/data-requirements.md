# Career77 — Data Requirements: Saved Jobs

## Existing Models Used
*   `Candidate`: We will add an array field `savedJobs` containing references to `Job` ObjectIds.
*   `Job`: Queried to fetch title, company details, location, and status.

## New Models Required
None. Adding `savedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }]` to the existing `Candidate` model prevents collection duplication and maintains data integrity.

## Indexes
An index is required on `savedJobs` if querying jobs saved by specific candidate ranges:
*   `Candidate.index({ savedJobs: 1 })`
