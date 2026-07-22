# Phase 5 — Recruiter Data Flow

*   **List Recruiter Jobs**: Client requests `GET /api/jobs` -> server calls NextAuth `getServerSession` -> identifies active recruiter session -> queries `Job` collection matching recruiter companyId -> returns jobs list.
*   **Create Job opening**: Form submits attributes to `POST /api/jobs` -> validates fields -> stores new Job with recruiter companyId mappings.
