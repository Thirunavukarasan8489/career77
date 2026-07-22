# Career77 — Validation Design: Saved Jobs

*   **Request validation**: Route handlers verify `jobId` parameter is a valid 24-character hex string.
*   **Database validation**: Mongoose checks that `jobId` exists in the `Job` collection before pushing to candidate list.
*   **Capacity limits**: Candidates can save up to 50 jobs max. Saves beyond this boundary return `400 Bad Request` with an explanation limit string.
