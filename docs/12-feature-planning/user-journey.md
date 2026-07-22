# Career77 — User Journey: Saved Jobs

## 1. Happy Path
```text
Candidate
    ↓
Job Board (Listing Card or Details Page)
    ↓
Clicks "Save Job"
    ↓
Visual State Updates to "Saved" (Micro-animation / color fill)
    ↓
Navigates to Candidate Dashboard "Saved Jobs" tab
    ↓
Sees Saved Job listed
```

## 2. Alternate Paths
*   **Unsaved Job**: Candidate clicks "Saved" on a previously bookmarked job, removing it from the saved jobs page.
*   **Guest Access**: Guest clicks "Save Job" -> Prompted to log in/register. Post-login, the job is saved automatically.

## 3. Error and Edge States
*   **Job Closed**: If a saved job closes, it remains in the saved list but displays a "Closed" badge and disables the apply action.
*   **Duplicate Save**: API ignores duplicate save requests and returns status `200` with the current state.
