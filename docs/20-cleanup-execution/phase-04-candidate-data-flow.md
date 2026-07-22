# Phase 4 — Candidate Data Flow

*   **View Profile**: Client requests `GET /api/candidates` -> server verifies active `candidate_session` using `getCandidateSession` -> finds candidate by session candidateId in `Candidate` model -> returns profile fields.
*   **Update Profile**: Client submits fields to `PUT /api/candidates` -> server decrypts candidate ID -> executes updates on Candidate schema.
