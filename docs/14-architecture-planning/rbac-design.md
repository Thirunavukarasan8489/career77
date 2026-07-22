# Career77 — RBAC Design: Saved Jobs

*   **Allowed roles**: Only `candidate` role sessions can call saved jobs endpoints.
*   **Recruiter access**: Blocked. Attempting to access these endpoints returns `403 Forbidden`.
*   **Admin access**: Blocked from modifying saved list records.
