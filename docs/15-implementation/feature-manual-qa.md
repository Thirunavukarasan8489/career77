# Feature Manual QA — Saved Jobs

## Environment
Local host / Production Vercel deployment.

## Login Requirements
Requires a candidate session active.

## Test User
Test candidate email: candidate@example.com

## Test Scenario 1: Bookmark Job Toggle
1. Navigate to `/candidate/jobs`.
2. Click the save icon on a job card.
3. Verify that the save icon updates to a filled indigo state.
4. Verify success toast notification displays: "Job saved successfully."

## Test Scenario 2: Saved Jobs Tab View
1. Open the "Saved Jobs" tab inside the candidate dashboard (`/candidate/saved`).
2. Verify that the bookmarked job is listed.
3. Click "Remove" or toggle save icon.
4. Verify the job is removed from the dashboard saved list.
