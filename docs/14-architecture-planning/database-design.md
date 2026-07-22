# Career77 — Database Design: Saved Jobs

## Schema Modification
We will update the existing `Candidate` model at `models/Candidate.ts` to include:

```typescript
savedJobs: {
  type: [Schema.Types.ObjectId],
  ref: "Job",
  default: [],
}
```

## Collection Indexes
Ensure that querying candidate record arrays works efficiently by adding a multikey index:
*   `CandidateSchema.index({ savedJobs: 1 })`
