# Career77 — Frontend Architecture: Saved Jobs

## Data Fetching
*   **Saved Jobs List Page**: A Next.js Server Component queries candidate data from MongoDB and populates saved job listings.
*   **Job Toggle**: A client component triggers asynchronous `fetch()` requests to toggling endpoints.

## Server / Client Boundaries
*   `app/(candidate)/candidate/saved/page.tsx`: Server Component.
*   `components/SaveJobButton.tsx`: Client Component (`"use client"`).
