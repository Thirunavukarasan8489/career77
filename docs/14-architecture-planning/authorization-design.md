# Career77 — Authorization Design: Saved Jobs

*   **Session verification**: Endpoints load session cookies using the centralized helper `getCandidateSession`.
*   **Tenant boundaries**: Since the candidate's database identity is extracted directly from the authenticated session credentials, candidates cannot access or modify bookmarks belonging to other seeker records.
