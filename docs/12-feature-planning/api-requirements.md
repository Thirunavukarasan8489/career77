# Career77 — API Requirements: Saved Jobs

## 1. POST /api/candidates/saved-jobs
*   **Method**: `POST`
*   **Authentication**: Candidate Session Cookie Required.
*   **Request Body**:
    ```json
    { "jobId": "65ab..." }
    ```
*   **Validation**: Verify `jobId` exists and matches active state in MongoDB.
*   **Response**: `200 OK` on success.
*   **Errors**: `400 Bad Request` if missing `jobId`, `401 Unauthorized` if session is missing.

## 2. DELETE /api/candidates/saved-jobs/[jobId]
*   **Method**: `DELETE`
*   **Authentication**: Candidate Session Cookie Required.
*   **Response**: `200 OK` on success.
