# Implementation File Map — Saved Jobs

## New Files
| File | Purpose |
|---|---|
| `app/api/candidates/saved-jobs/route.ts` | Endpoint handler for saving and unsaving jobs |
| `app/(candidate)/candidate/saved/page.tsx` | Dashboard Saved Jobs view |
| `components/SaveJobButton.tsx` | React client component toggle button |

## Modified Files
| File | Change |
|---|---|
| `models/Candidate.ts` | Add `savedJobs` Array properties to Mongoose Schema |
| `app/(candidate)/candidate/jobs/page.tsx` | Integrate `SaveJobButton` inside job listing card views |
| `app/jobs/[jobId]/page.tsx` | Integrate `SaveJobButton` inside job details panel |

## Database Changes
| Collection | Change |
|---|---|
| `candidates` | Add `savedJobs` array field and multi-key index |
