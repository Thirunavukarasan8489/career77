# Career77 — API Contract: Saved Jobs

## 1. POST /api/candidates/saved-jobs
*   **Method**: `POST`
*   **Authentication**: Cookie-based candidate session required.
*   **Request Body**:
    ```json
    { "jobId": "65b98f..." }
    ```
*   **Response**: `200 OK`
    ```json
    { "success": true, "message": "Job bookmarked successfully" }
    ```

## 2. DELETE /api/candidates/saved-jobs
*   **Method**: `DELETE`
*   **Request Body**:
    ```json
    { "jobId": "65b98f..." }
    ```
*   **Response**: `200 OK`
