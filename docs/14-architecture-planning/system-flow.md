# Career77 — System Flow: Saved Jobs

```text
Candidate
    ↓
Clicks "Save Job" (React Client Action)
    ↓
API Request: POST /api/candidates/saved-jobs { jobId }
    ↓
Candidate Cookie Session validation
    ↓
Mongoose: Candidate.findByIdAndUpdate()
    ↓
MongoDB: Appends jobId to savedJobs array
    ↓
Success Response: 200 OK
    ↓
UI updates Save button toggle state (filled color state)
```
