# Career77 — Feature Design Handoff

## Feature
Candidate Saved Jobs.

## Design Summary
Integrates a toggle bookmark action into job search pages and displays saved elements within candidate dashboard views.

## Screens
*   `SCR-001`: Candidate Saved Jobs Dashboard tab (`/candidate/saved`).

## Components
*   `SaveJobButton`: Bookmark toggle trigger.

## User Flows
*   Save Toggle Action.
*   Dashboard navigation.

## Interactions
*   Hover states: background shifts to light slate.
*   Active state: icon fills with solid indigo.
*   Focus state: ring outline.

## Responsive Rules
Mobile card layouts align to center screens. Grid sizes scale on larger viewports.

## Accessibility Rules
Supports keyboard tab keys, visible focus rings, and screen reader labels.

## Role Visibility
Only candidate role sessions see bookmark buttons.

## Loading States
Spinner replaces text during API interactions.

## Empty States
Render placeholder text with "Browse Openings" CTA button.

## Error States
Alert banner: "Unable to save job. Try again."

## Success States
Toast message: "Job saved successfully."

## Design Tokens
Standard colors:
*   Primary: `#4F46E5`
*   Neutral: `#0F172A`
*   Light surface: `#F8FAFC`

## Developer Notes
Reuse existing candidate dashboard structures.

## Open Questions
None.

## Approval Status
**Design Handed Off**
