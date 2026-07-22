# Career77 — Error Handling Design: Saved Jobs

| Scenario | HTTP Status | Internal Code | User Message |
|---|---|---|---|
| Unauthenticated Session | `401` | `UNAUTHORIZED` | "You must be signed in to save jobs." |
| Invalid Job ID | `400` | `INVALID_JOB_ID` | "Invalid job ID provided." |
| Job Not Found | `404` | `JOB_NOT_FOUND` | "Job opening not found." |
| Limit Reached | `400` | `SAVE_LIMIT_REACHED` | "You have reached the maximum limit of 50 saved jobs." |
