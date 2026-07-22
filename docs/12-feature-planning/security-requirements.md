# Career77 — Security Requirements: Saved Jobs

*   **Who can access the feature?**: Only authenticated Candidates.
*   **Who owns the data?**: The logged-in Candidate.
*   **Who can modify it?**: Only the matching Candidate session holder.
*   **Cross-tenant security checks**: APIs must lookup candidate details using the signature verified session ID, preventing Candidates from saving jobs to other profiles.
