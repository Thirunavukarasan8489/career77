# Career77 — Training Removal Report

## 1. Reason for Removal
The Training feature has been officially removed from the Career77 product scope to focus entirely on recruitment, job applications, and recruiter subscriptions.

## 2. Training Features Removed
None present in application routes. No candidate training modules or courses pages exist.

## 3. Training Routes Removed
None.

## 4. Training APIs Removed
An empty directory `app/api/training` was cleaned.

## 5. Training Components Removed
None.

## 6. Training Database Models Removed
None. No training or enrollment models exist under `models/`.

## 7. Training Services Removed
None.

## 8. Training Payment Logic Removed
None. Payment schema is scoped only to subscriptions and company invoicing.

## 9. Training Notifications Removed
None.

## 10. Training Navigation Removed
Verified that no navigation bars, sidebars, or footer menus reference training, courses, or enrollments.

## 11. Documentation Updated
Documentation under `docs/` has been verified; all active product specs focus purely on recruitment and recruiter subscriptions. The directory `docs/04-training` does not exist in the workspace.

## 12. Shared Functionality Preserved
All subscription billing endpoints, company profile update validators, and recruiter dashboards remain fully operational.

## 13. Remaining References
Historical markdown comments in audit/roadmap summaries have been updated to reflect deprecation.

## 14. Validation Results
*   **TypeScript check**: **Passed** (0 errors).
*   **Next.js Production build**: **Passed** (Compiled successfully).
