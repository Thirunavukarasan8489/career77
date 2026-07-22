# Model-to-API Mapping

| Model | Create API | Read API | Update API | Delete API | Used By | Status |
|---|---|---|---|---|---|---|
| `Candidate` | `/api/candidates` | `/api/candidates` | `/api/candidates` | None | Candidate pages | Implemented |
| `Job` | `/api/jobs` | `/api/jobs` | `/api/jobs/[id]` | `/api/jobs/[id]` | Recruiter pages | Implemented |
