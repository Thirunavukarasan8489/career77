# Career77 — Feature UX/UI Design Specification

## 1. Feature Overview
This document specifies design standards, component structures, states, and responsive mappings for the Candidate Saved Jobs interface.

## 2. Design Goals
*   Provide clear save/bookmark affordances.
*   Enforce light theme colors (`#4F46E5` Primary, `#10B981` Success, `#FFFFFF` Surface).
*   Create smooth hover transitions.

## 3. User Journey
Toggling the bookmark updates visual state instantly. The saved tab displays interactive list elements.

## 4. Screen Inventory
*   `SCR-001`: Candidate Saved Jobs Dashboard tab (`/candidate/saved`).

## 5. Page Structure
*   Dashboard navigation header.
*   Filter search bar.
*   Job listing grid items.
*   Pagination footer.

## 6. Component Inventory
*   `SaveJobButton`: Bookmark toggle button.

## 7. Interaction Design
Focus rings and button loading animations are configured.

## 8. Form Design
None.

## 9. Table Design
None.

## 10. Dashboard Design
Adds a "Saved Jobs" tab layout next to "Applications" and "Interviews" links in the candidate control panel.

## 11. Modal and Drawer Design
None.

## 12. Responsive Design
Mobile views display single-column cards; desktop views use a multi-column layout grid.

## 13. Accessibility
Keyboard navigation, focus visible markers, and aria-attributes are enforced.

## 14. Content Design
User-facing toast messages are clean and descriptive.

## 15. Loading States
Save button displays a loading spinner when awaiting API responses.

## 16. Empty States
A customized vector illustration, explanation text, and search redirect action button are displayed when no jobs are saved.

## 17. Error States
API failures show a red-alert toast: "Could not save job. Please try again."

## 18. Success States
Toast popup: "Job saved successfully."

## 19. Role-Specific UI
Only candidate sessions can trigger save operations.

## 20. Candidate Experience
Bookmarking jobs does not disrupt browsing flows.

## 21. Recruiter Experience
None.

## 22. Super Admin Experience
None.

## 23. Design Tokens
Uses existing Tailwind configurations.

## 24. Design System Compliance
Light theme only. No dark theme styles.

## 25. Open Questions
None.
