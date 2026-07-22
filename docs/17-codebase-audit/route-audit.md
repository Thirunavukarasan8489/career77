# Route Audit

## Route tree
*   `/`: Public homepage
*   `/jobs`: Public job board
*   `/openings/[jobId]`: Public job detailed descriptions
*   `/candidate/profile`: Candidate profile editing
*   `/candidate/saved`: Candidate bookmarked jobs
*   `/candidate/jobs`: Candidate personalized job search
*   `/candidate/applications`: Candidate applications tracking page
*   `/candidate/interviews`: Candidate interview scheduling page
*   `/candidate/settings`: Candidate account configuration
*   `/recruiter/pending`: Onboarding redirection view
*   `/recruiter`: Recruiter metrics dashboard
*   `/recruiter/jobs`: Recruiter postings list
*   `/recruiter/company`: Recruiter company editor
*   `/recruiter/candidates`: Recruiter applicants pipelines view
*   `/admin`: Super Admin dashboard stats panel
*   `/admin/verification`: Admin approvals queue page
*   `/admin/support`: Admin support ticket desk page

## Route Table
| Route | Type | Role | Auth Required | Implemented | Status |
|---|---|---|---|---|---|
| `/` | Page | Guest | No | Yes | Fully Implemented |
| `/jobs` | Page | Guest | No | Yes | Fully Implemented |
| `/candidate/profile` | Page | Candidate | Yes | Yes | Fully Implemented |
| `/candidate/saved` | Page | Candidate | Yes | Yes | Fully Implemented |
| `/recruiter` | Page | Recruiter | Yes | Yes | Fully Implemented |
| `/admin` | Page | Super Admin | Yes | Yes | Fully Implemented |
