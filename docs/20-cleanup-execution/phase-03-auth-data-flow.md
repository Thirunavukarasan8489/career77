# Phase 3 — Auth Data Flow

*   **Candidate Login**: Enter OTP/email -> verification handler `/api/candidates/otp` -> signs cookie `candidate_session` -> middleware intercepts `/candidate/*` -> reads context states.
*   **Recruiter Login**: Credentials form -> next-auth session creation -> maps `role` attributes -> authorization checks on recruiter dashboards.
