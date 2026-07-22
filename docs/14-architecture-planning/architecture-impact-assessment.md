# Career77 — Architecture Impact Assessment: Saved Jobs

*   **Frontend (Medium Impact)**: Requires a new Tab within the candidate dashboard (`/candidate/saved`) and a save button component added to job search grids.
*   **Backend (Low Impact)**: Requires API endpoints to save, unsave, and retrieve bookmarks.
*   **Database (Low Impact)**: Adds an array of ObjectIds pointing to `Job` documents within the `Candidate` schema.
*   **API (Low Impact)**: Adds simple endpoint routes.
*   **Authentication (Low Impact)**: Leverages existing candidate cookie session validation.
*   **Authorization & RBAC (Low Impact)**: Extends standard candidate owner checks.
*   **Notifications (No Impact)**: None.
*   **Messaging (No Impact)**: None.
*   **Payments & Subscriptions (No Impact)**: None.
*   **Audit Logs (No Impact)**: Bookmark actions do not write global audit logs.
