# Architecture Review Checklist — Saved Jobs

## Product
- [x] Mapped to PRD requirements
- [x] Business constraints satisfied

## Frontend
- [x] Server Component lists saved jobs
- [x] Client Component handles toggle clicks
- [x] Layout reuses dashboards layouts

## Backend
- [x] Endpoints defined with strict validation
- [x] Error codes mapped cleanly

## Database
- [x] Existing `Candidate` model reused (no new collection required)
- [x] Multikey index on `savedJobs` configured

## Security
- [x] Authentication checks use `getCandidateSession`
- [x] Authorization checks candidate identity to block ID spoofing
- [x] RBAC blocks recruiters and admins
- [x] Input validations prevent malicious script payloads
