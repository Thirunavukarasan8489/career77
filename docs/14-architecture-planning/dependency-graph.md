# Dependency Graph — Saved Jobs

```text
Saved Jobs Feature
  │
  ├── Frontend
  │     ├── app/(candidate)/candidate/saved/page.tsx (Server Component)
  │     ├── components/SaveJobButton.tsx (Client Component)
  │     └── Data Fetching (fetch('/api/candidates/saved-jobs'))
  │
  ├── Backend
  │     ├── app/api/candidates/saved-jobs/route.ts (API Handler)
  │     ├── Validation (Check valid ObjectId hex format, limit <= 50)
  │     └── lib/auth.ts (getCandidateSession helper)
  │
  └── Database
        ├── models/Candidate.ts (Update schema)
        └── index ({ savedJobs: 1 })
```
